import { create } from "zustand";
import { XP } from "../theme/tokens.js";
import { BDEFS, newBadges } from "../data/badges.js";
import { getTotalModuleCount } from "../data/tiers.js";
import { getLevel } from "../utils/xp.js";
import { loadUser, saveUser, getBoard, updateBoard, getNotes, saveNote } from "../api/storage.js";

/**
 * Central application state, built with Zustand.
 *
 * ## Why Zustand (architectural trade-off, documented for the roadmap)
 *
 * The original prototype held all state in `App`'s `useState` calls and
 * passed it down through 6+ levels of props (`App` -> `LearnerDashboard` ->
 * `TierView` -> `ModuleView` -> `Quiz`, etc.), plus sibling callbacks passed
 * back up (`onComplete`, `onQuizDone`, `flash`, `go`). This "prop drilling"
 * made every intermediate component aware of state it did not use, and made
 * it hard to test components in isolation.
 *
 * Zustand was chosen over Redux/Context for three reasons appropriate to
 * this codebase's size: (1) no boilerplate reducers/actions/dispatchers —
 * state and the functions that mutate it live together, which keeps the
 * "fix at the root" principle easy to apply; (2) components subscribe only
 * to the slices of state they read, avoiding the re-render storms that a
 * single Context.Provider would cause; (3) the store is plain JS, so it is
 * trivially unit-testable with Vitest without rendering React at all.
 *
 * If CapabilityOS grows into multiple independently-deployed micro-frontends
 * (see docs/ARCHITECTURE.md roadmap), each micro-frontend would own a
 * narrower store and communicate via a shared event bus rather than a single
 * global store — that migration is straightforward from Zustand slices but
 * would be a significant rewrite from a monolithic Context tree.
 *
 * @typedef {import("../api/storage.js").UserProfile} UserProfile
 * @typedef {import("../api/storage.js").LeaderboardEntry} LeaderboardEntry
 * @typedef {import("../api/storage.js").FacilitatorNote} FacilitatorNote
 *
 * @typedef {Object} ToastState
 * @property {string} id
 * @property {string} message
 * @property {"info"|"success"|"badge"} variant
 *
 * @typedef {Object} NavEntry
 * @property {string} screen
 * @property {Record<string, unknown>} [params]
 */

/**
 * Build a fresh user profile for a newly-registered learner.
 * @param {string} name
 * @param {string} industry
 * @returns {UserProfile}
 */
function createUser(name, industry) {
  return {
    name,
    industry,
    progress: [],
    xp: 0,
    badges: [],
    streak: 0,
    last: new Date().toISOString(),
    perfectQuizzes: 0,
  };
}

/**
 * @param {UserProfile} user
 * @returns {LeaderboardEntry}
 */
function toLeaderboardEntry(user) {
  return {
    name: user.name,
    xp: user.xp,
    lv: getLevel(user.xp).name,
    mods: user.progress.length,
    streak: user.streak,
    last: "just now",
    ind: user.industry,
  };
}

/**
 * @typedef {Object} AppState
 * @property {NavEntry} screen - Current screen and its params
 * @property {NavEntry[]} navStack - History for the back button
 * @property {UserProfile|null} user
 * @property {LeaderboardEntry[]} board
 * @property {Record<string, FacilitatorNote[]>} notesByLearner
 * @property {ToastState|null} toast
 * @property {number} totalModules
 *
 * @property {(name: string, industry: string) => void} login
 * @property {() => void} logout
 * @property {(screen: string, params?: Record<string, unknown>) => void} navigateTo
 * @property {() => void} goBack
 * @property {(message: string, variant?: ToastState["variant"]) => void} showToast
 * @property {() => void} dismissToast
 * @property {(tierId: string, moduleId: string) => void} completeModule
 * @property {(wasPerfect: boolean) => void} recordQuizResult
 * @property {(learnerName: string) => FacilitatorNote[]} loadNotes
 * @property {(learnerName: string, text: string) => void} addNote
 * @property {() => void} refreshBoard
 */

/** @type {import("zustand").UseBoundStore<import("zustand").StoreApi<AppState>>} */
export const useAppStore = create((set, get) => ({
  screen: { screen: "login" },
  navStack: [],
  user: loadUser() ?? null,
  board: getBoard(),
  notesByLearner: {},
  toast: null,
  totalModules: getTotalModuleCount(),

  login: (name, industry) => {
    const existing = loadUser();
    const user =
      existing && existing.name === name ? { ...existing, industry } : createUser(name, industry);
    saveUser(user);
    updateBoard(toLeaderboardEntry(user));
    set({ user, board: getBoard(), screen: { screen: "dashboard" }, navStack: [] });
  },

  logout: () => {
    set({ user: null, screen: { screen: "login" }, navStack: [] });
  },

  navigateTo: (screen, params = {}) => {
    const current = get().screen;
    set((state) => ({
      navStack: [...state.navStack, current],
      screen: { screen, params },
    }));
  },

  goBack: () => {
    set((state) => {
      if (state.navStack.length === 0) {
        return { screen: { screen: "dashboard" } };
      }
      const navStack = [...state.navStack];
      const previous = navStack.pop();
      return { navStack, screen: previous };
    });
  },

  showToast: (message, variant = "info") => {
    const toast = { id: `toast_${Date.now()}`, message, variant };
    set({ toast });
  },

  dismissToast: () => set({ toast: null }),

  completeModule: (tierId, moduleId) => {
    const user = get().user;
    if (!user) return;

    const alreadyDone = user.progress.includes(moduleId);
    const progress = alreadyDone ? user.progress : [...user.progress, moduleId];
    const xp = alreadyDone ? user.xp : user.xp + XP.MODULE;

    const updatedUser = {
      ...user,
      progress,
      xp,
      last: new Date().toISOString(),
    };

    const earned = newBadges(progress, updatedUser.perfectQuizzes, updatedUser.badges);
    const finalUser = earned.length
      ? { ...updatedUser, badges: [...updatedUser.badges, ...earned.map((b) => b.id)] }
      : updatedUser;

    saveUser(finalUser);
    updateBoard(toLeaderboardEntry(finalUser));

    set({ user: finalUser, board: getBoard() });

    if (!alreadyDone) {
      get().showToast(`+${XP.MODULE} XP — module complete!`, "success");
    }
    for (const badge of earned) {
      get().showToast(`Badge earned: ${badge.name}`, "badge");
    }
  },

  recordQuizResult: (wasPerfect) => {
    const user = get().user;
    if (!user) return;

    const perfectQuizzes = wasPerfect ? user.perfectQuizzes + 1 : user.perfectQuizzes;
    const bonusXp = wasPerfect ? XP.PERFECT : 0;
    const updatedUser = {
      ...user,
      perfectQuizzes,
      xp: user.xp + bonusXp,
      last: new Date().toISOString(),
    };

    const earned = newBadges(updatedUser.progress, perfectQuizzes, updatedUser.badges);
    const finalUser = earned.length
      ? { ...updatedUser, badges: [...updatedUser.badges, ...earned.map((b) => b.id)] }
      : updatedUser;

    saveUser(finalUser);
    updateBoard(toLeaderboardEntry(finalUser));
    set({ user: finalUser, board: getBoard() });

    if (wasPerfect) {
      get().showToast(`Perfect score! +${XP.PERFECT} bonus XP`, "success");
    }
    for (const badge of earned) {
      get().showToast(`Badge earned: ${badge.name}`, "badge");
    }
  },

  loadNotes: (learnerName) => {
    const notes = getNotes(learnerName);
    set((state) => ({ notesByLearner: { ...state.notesByLearner, [learnerName]: notes } }));
    return notes;
  },

  addNote: (learnerName, text) => {
    if (!text.trim()) return;
    saveNote(learnerName, text.trim());
    const notes = getNotes(learnerName);
    set((state) => ({ notesByLearner: { ...state.notesByLearner, [learnerName]: notes } }));
  },

  refreshBoard: () => set({ board: getBoard() }),
}));

/**
 * Convenience selector: all badge definitions paired with whether the
 * current user has earned them. Used by the dashboard's badge shelf.
 * @returns {Array<import("../data/badges.js").BadgeDefinition & { earned: boolean }>}
 */
export function useBadgeStatus() {
  const user = useAppStore((state) => state.user);
  const earned = user?.badges ?? [];
  return BDEFS.map((badge) => ({ ...badge, earned: earned.includes(badge.id) }));
}
