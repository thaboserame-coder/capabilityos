import { getTotalModuleCount, TIERS } from "../data/tiers.js";
import { DEMO_COHORT } from "../data/demoCohort.js";

/**
 * Shared fixtures for Storybook stories (and available to tests).
 *
 * These intentionally mirror the shapes used across the unit/integration
 * test suite (e.g. `LearnerDashboard.test.jsx`'s `BASE_USER`) so stories stay
 * representative of real app state without duplicating magic values.
 */

/**
 * @param {Partial<import("../store/useAppStore.js").User>} overrides
 * @returns {import("../store/useAppStore.js").User}
 */
export function createTestUser(overrides = {}) {
  return {
    name: "Thabo Serame",
    industry: "Mining & Resources",
    progress: [],
    xp: 0,
    badges: [],
    streak: 0,
    last: new Date().toISOString(),
    perfectQuizzes: 0,
    ...overrides,
  };
}

/** Module ids for every module in Tier 1 ("AI Executive"). */
export const TIER1_MODULE_IDS = TIERS[0].mods.map((mod) => mod.id);

/** Module ids for every module across all tiers. */
export const ALL_MODULE_IDS = TIERS.flatMap((tier) => tier.mods.map((mod) => mod.id));

/**
 * Base Zustand store state. Mirrors the `resetStore()` helper used across
 * the component test suite.
 * @param {Partial<import("../store/useAppStore.js").AppState>} overrides
 */
export function baseStoreState(overrides = {}) {
  return {
    screen: { screen: "dashboard" },
    navStack: [],
    user: null,
    board: [],
    notesByLearner: {},
    toast: null,
    totalModules: getTotalModuleCount(),
    ...overrides,
  };
}

export { DEMO_COHORT };
