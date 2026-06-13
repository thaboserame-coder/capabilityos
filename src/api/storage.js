/**
 * Platform-agnostic persistence adapter.
 *
 * The original prototype was built as a Claude.ai artifact and persisted
 * state via `window.storage.get/set/list` — a sandbox-only API that does not
 * exist in a real browser. This module provides the same conceptual
 * operations (`get`, `set`, `remove`, `list`) backed by `localStorage`, with
 * an in-memory fallback for environments where `localStorage` is unavailable
 * (SSR, some test runners, privacy modes that disable storage).
 *
 * All CapabilityOS-specific persistence (user profile, leaderboard,
 * facilitator notes) is built on top of this generic adapter so the backing
 * store can be swapped for a real API/database later without touching
 * component code — see `getUser`/`saveUser` etc. below.
 */

const NAMESPACE = "capabilityos";

/** In-memory fallback store, used when localStorage throws or is absent. */
const memoryStore = new Map();

/**
 * @returns {boolean} true if `window.localStorage` is available and writable
 */
function isLocalStorageAvailable() {
  try {
    if (typeof window === "undefined" || !window.localStorage) return false;
    const testKey = `${NAMESPACE}:__write_test__`;
    window.localStorage.setItem(testKey, "1");
    window.localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

const useLocalStorage = isLocalStorageAvailable();

function namespacedKey(key) {
  return `${NAMESPACE}:${key}`;
}

/**
 * Low-level key/value storage adapter. Values are JSON-serialised.
 */
export const storage = {
  /**
   * @template T
   * @param {string} key
   * @param {T} [fallback]
   * @returns {T|undefined}
   */
  get(key, fallback) {
    const fullKey = namespacedKey(key);
    try {
      const raw = useLocalStorage ? window.localStorage.getItem(fullKey) : memoryStore.get(fullKey);
      if (raw === null || raw === undefined) return fallback;
      return JSON.parse(raw);
    } catch {
      return fallback;
    }
  },

  /**
   * @param {string} key
   * @param {unknown} value
   */
  set(key, value) {
    const fullKey = namespacedKey(key);
    const serialised = JSON.stringify(value);
    try {
      if (useLocalStorage) {
        window.localStorage.setItem(fullKey, serialised);
      } else {
        memoryStore.set(fullKey, serialised);
      }
    } catch {
      // Storage quota exceeded or unavailable mid-session — degrade silently
      // rather than crashing the learner's session. Falls back to memory so
      // the current tab keeps working even if persistence fails.
      memoryStore.set(fullKey, serialised);
    }
  },

  /**
   * @param {string} key
   */
  remove(key) {
    const fullKey = namespacedKey(key);
    try {
      if (useLocalStorage) window.localStorage.removeItem(fullKey);
    } catch {
      /* no-op */
    }
    memoryStore.delete(fullKey);
  },

  /**
   * List all values whose key starts with the given prefix.
   * @param {string} prefix
   * @returns {unknown[]}
   */
  list(prefix) {
    const fullPrefix = namespacedKey(prefix);
    const results = [];
    if (useLocalStorage) {
      for (let i = 0; i < window.localStorage.length; i += 1) {
        const key = window.localStorage.key(i);
        if (key && key.startsWith(fullPrefix)) {
          try {
            results.push(JSON.parse(window.localStorage.getItem(key)));
          } catch {
            /* skip unparsable entries */
          }
        }
      }
    }
    for (const [key, raw] of memoryStore.entries()) {
      if (key.startsWith(fullPrefix)) {
        try {
          results.push(JSON.parse(raw));
        } catch {
          /* skip unparsable entries */
        }
      }
    }
    return results;
  },
};

const USER_KEY = "user";
const LEADERBOARD_KEY = "leaderboard";
const NOTES_KEY_PREFIX = "notes:";

/**
 * @typedef {Object} UserProfile
 * @property {string} name
 * @property {string} industry
 * @property {string[]} progress - Completed module ids
 * @property {number} xp
 * @property {string[]} badges - Earned badge ids
 * @property {number} streak
 * @property {string} last - ISO timestamp of last activity
 * @property {number} perfectQuizzes
 */

/**
 * @returns {UserProfile|undefined}
 */
export function loadUser() {
  return storage.get(USER_KEY);
}

/**
 * @param {UserProfile} user
 */
export function saveUser(user) {
  storage.set(USER_KEY, user);
}

/**
 * @typedef {Object} LeaderboardEntry
 * @property {string} name
 * @property {number} xp
 * @property {string} lv
 * @property {number} mods
 * @property {number} streak
 * @property {string} last
 * @property {string} ind
 */

/**
 * @returns {LeaderboardEntry[]}
 */
export function getBoard() {
  return storage.get(LEADERBOARD_KEY, []);
}

/**
 * Upsert a learner's leaderboard entry (matched by name).
 * @param {LeaderboardEntry} entry
 */
export function updateBoard(entry) {
  const board = getBoard();
  const idx = board.findIndex((row) => row.name === entry.name);
  if (idx >= 0) {
    board[idx] = entry;
  } else {
    board.push(entry);
  }
  storage.set(LEADERBOARD_KEY, board);
}

/**
 * @typedef {Object} FacilitatorNote
 * @property {string} id
 * @property {string} learnerName
 * @property {string} text
 * @property {string} createdAt - ISO timestamp
 */

/**
 * @param {string} learnerName
 * @returns {FacilitatorNote[]}
 */
export function getNotes(learnerName) {
  return storage.get(`${NOTES_KEY_PREFIX}${learnerName}`, []);
}

/**
 * @param {string} learnerName
 * @param {string} text
 * @returns {FacilitatorNote}
 */
export function saveNote(learnerName, text) {
  const notes = getNotes(learnerName);
  const note = {
    id: `note_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    learnerName,
    text,
    createdAt: new Date().toISOString(),
  };
  notes.push(note);
  storage.set(`${NOTES_KEY_PREFIX}${learnerName}`, notes);
  return note;
}
