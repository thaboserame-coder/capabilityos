import { LEVELS } from "../data/levels.js";

/**
 * XP/level helpers shared across the dashboard, navigation, and certificate
 * views. Extracted from the original monolith so the level-progression rules
 * live in one tested place.
 */

/**
 * @param {number} xp
 * @returns {import("../data/levels.js").Level}
 */
export function getLevel(xp) {
  let current = LEVELS[0];
  for (const level of LEVELS) {
    if (xp >= level.min) current = level;
  }
  return current;
}

/**
 * The level the learner is progressing toward, or `null` if they have
 * reached the highest level.
 * @param {number} xp
 * @returns {import("../data/levels.js").Level|null}
 */
export function getNextLevel(xp) {
  const current = getLevel(xp);
  const idx = LEVELS.findIndex((level) => level.n === current.n);
  return LEVELS[idx + 1] ?? null;
}

/**
 * Percentage (0-100) of progress toward the next level. Returns 100 when at
 * the highest level.
 * @param {number} xp
 * @returns {number}
 */
export function getLevelProgressPct(xp) {
  const current = getLevel(xp);
  const next = getNextLevel(xp);
  if (!next) return 100;
  const span = next.min - current.min;
  const progress = xp - current.min;
  return Math.min(100, Math.max(0, Math.round((progress / span) * 100)));
}
