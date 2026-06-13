import { describe, it, expect, beforeEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { useAppStore, useBadgeStatus } from "./useAppStore.js";
import { getTotalModuleCount } from "../data/tiers.js";
import { XP } from "../theme/tokens.js";
import { updateBoard } from "../api/storage.js";

/**
 * `useAppStore` is a module-level singleton (by design — see the store's
 * JSDoc). Each test resets it to a known baseline so tests don't leak state
 * into one another, mirroring how a fresh page load would behave.
 */
function resetStore() {
  window.localStorage.clear();
  useAppStore.setState({
    screen: { screen: "login" },
    navStack: [],
    user: null,
    board: [],
    notesByLearner: {},
    toast: null,
    totalModules: getTotalModuleCount(),
  });
}

beforeEach(resetStore);

describe("login", () => {
  it("creates a fresh profile and lands on the dashboard", () => {
    useAppStore.getState().login("Thabo Serame", "Technology & Software");
    const state = useAppStore.getState();

    expect(state.user).toMatchObject({
      name: "Thabo Serame",
      industry: "Technology & Software",
      progress: [],
      xp: 0,
      badges: [],
      streak: 0,
      perfectQuizzes: 0,
    });
    expect(state.screen).toEqual({ screen: "dashboard" });
    expect(state.navStack).toEqual([]);
    expect(state.board.some((row) => row.name === "Thabo Serame")).toBe(true);
  });

  it("resumes an existing learner's saved progress", () => {
    useAppStore.getState().login("Thabo Serame", "Technology & Software");
    useAppStore.getState().completeModule("t1", "t1m1");
    useAppStore.getState().logout();

    useAppStore.getState().login("Thabo Serame", "Mining & Resources");
    const { user } = useAppStore.getState();

    expect(user.progress).toContain("t1m1");
    expect(user.industry).toBe("Mining & Resources");
  });
});

describe("logout", () => {
  it("clears the session and returns to the login screen", () => {
    useAppStore.getState().login("Thabo Serame", "Technology & Software");
    useAppStore.getState().logout();
    const state = useAppStore.getState();

    expect(state.user).toBeNull();
    expect(state.screen).toEqual({ screen: "login" });
    expect(state.navStack).toEqual([]);
  });
});

describe("navigateTo / goBack", () => {
  it("pushes the current screen onto the nav stack", () => {
    useAppStore.getState().login("Thabo Serame", "Technology & Software");
    useAppStore.getState().navigateTo("tier", { tierId: "t1" });

    const state = useAppStore.getState();
    expect(state.screen).toEqual({ screen: "tier", params: { tierId: "t1" } });
    expect(state.navStack).toEqual([{ screen: "dashboard" }]);
  });

  it("returns to the previous screen", () => {
    useAppStore.getState().login("Thabo Serame", "Technology & Software");
    useAppStore.getState().navigateTo("tier", { tierId: "t1" });
    useAppStore.getState().goBack();

    const state = useAppStore.getState();
    expect(state.screen).toEqual({ screen: "dashboard" });
    expect(state.navStack).toEqual([]);
  });

  it("defaults to the dashboard when the nav stack is empty", () => {
    useAppStore.getState().login("Thabo Serame", "Technology & Software");
    useAppStore.getState().goBack();
    expect(useAppStore.getState().screen).toEqual({ screen: "dashboard" });
  });
});

describe("toast", () => {
  it("shows and dismisses a toast", () => {
    useAppStore.getState().showToast("Hello", "success");
    let state = useAppStore.getState();
    expect(state.toast).toMatchObject({ message: "Hello", variant: "success" });

    useAppStore.getState().dismissToast();
    state = useAppStore.getState();
    expect(state.toast).toBeNull();
  });
});

describe("completeModule", () => {
  it("awards XP and marks the module complete", () => {
    useAppStore.getState().login("Thabo Serame", "Technology & Software");
    useAppStore.getState().completeModule("t1", "t1m1");

    const state = useAppStore.getState();
    expect(state.user.progress).toEqual(["t1m1"]);
    expect(state.user.xp).toBe(XP.MODULE);
  });

  it("awards the 'First Steps' badge on the first completed module", () => {
    useAppStore.getState().login("Thabo Serame", "Technology & Software");
    useAppStore.getState().completeModule("t1", "t1m1");

    const state = useAppStore.getState();
    expect(state.user.badges).toContain("first");
    expect(state.toast).toMatchObject({ variant: "badge" });
    expect(state.toast.message).toContain("First Steps");
  });

  it("does not award XP twice for the same module", () => {
    useAppStore.getState().login("Thabo Serame", "Technology & Software");
    useAppStore.getState().completeModule("t1", "t1m1");
    useAppStore.getState().completeModule("t1", "t1m1");

    const state = useAppStore.getState();
    expect(state.user.progress).toEqual(["t1m1"]);
    expect(state.user.xp).toBe(XP.MODULE);
  });
});

describe("recordQuizResult", () => {
  it("does nothing notable for a non-perfect score", () => {
    useAppStore.getState().login("Thabo Serame", "Technology & Software");
    useAppStore.getState().recordQuizResult(false);

    const state = useAppStore.getState();
    expect(state.user.perfectQuizzes).toBe(0);
    expect(state.user.xp).toBe(0);
    expect(state.toast).toBeNull();
  });

  it("awards bonus XP for a perfect score", () => {
    useAppStore.getState().login("Thabo Serame", "Technology & Software");
    useAppStore.getState().recordQuizResult(true);

    const state = useAppStore.getState();
    expect(state.user.perfectQuizzes).toBe(1);
    expect(state.user.xp).toBe(XP.PERFECT);
    expect(state.toast).toMatchObject({ variant: "success" });
  });

  it("awards the 'Sharp Mind' badge after three perfect scores", () => {
    useAppStore.getState().login("Thabo Serame", "Technology & Software");
    useAppStore.getState().recordQuizResult(true);
    useAppStore.getState().recordQuizResult(true);
    useAppStore.getState().recordQuizResult(true);

    const state = useAppStore.getState();
    expect(state.user.perfectQuizzes).toBe(3);
    expect(state.user.badges).toContain("sharp");
    expect(state.toast).toMatchObject({ variant: "badge" });
    expect(state.toast.message).toContain("Sharp Mind");
  });
});

describe("facilitator notes", () => {
  it("loads an empty notes list for a learner with none", () => {
    const notes = useAppStore.getState().loadNotes("Sipho Ndlovu");
    expect(notes).toEqual([]);
    expect(useAppStore.getState().notesByLearner["Sipho Ndlovu"]).toEqual([]);
  });

  it("ignores blank notes", () => {
    useAppStore.getState().addNote("Sipho Ndlovu", "   ");
    expect(useAppStore.getState().notesByLearner["Sipho Ndlovu"]).toBeUndefined();
  });

  it("saves a trimmed note and refreshes the learner's notes", () => {
    useAppStore.getState().addNote("Sipho Ndlovu", "  Great progress  ");
    const notes = useAppStore.getState().notesByLearner["Sipho Ndlovu"];
    expect(notes).toHaveLength(1);
    expect(notes[0].text).toBe("Great progress");
  });
});

describe("refreshBoard", () => {
  it("reloads the leaderboard from storage", () => {
    updateBoard({
      name: "Nomsa Khumalo",
      xp: 2100,
      lv: "AI Strategist",
      mods: 14,
      streak: 7,
      last: "now",
      ind: "Mining & Resources",
    });
    useAppStore.getState().refreshBoard();
    expect(useAppStore.getState().board.some((row) => row.name === "Nomsa Khumalo")).toBe(true);
  });
});

describe("useBadgeStatus", () => {
  it("reports every badge as not earned when there is no user", () => {
    const { result } = renderHook(() => useBadgeStatus());
    expect(result.current.every((badge) => badge.earned === false)).toBe(true);
    expect(result.current.length).toBeGreaterThan(0);
  });

  it("reports earned badges from the current user", () => {
    useAppStore.getState().login("Thabo Serame", "Technology & Software");
    useAppStore.getState().completeModule("t1", "t1m1");

    const { result } = renderHook(() => useBadgeStatus());
    const first = result.current.find((badge) => badge.id === "first");
    expect(first.earned).toBe(true);
  });
});
