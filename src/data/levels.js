/**
 * @typedef {Object} Level
 * @property {number} n - Level number (1-indexed)
 * @property {string} name - Display name of the level
 * @property {number} min - Minimum XP required to reach this level
 * @property {string} color - Hex colour associated with the level
 */

/** @type {Level[]} */
export const LEVELS = [
  { n: 1, name: "AI Curious", min: 0, color: "#6B8EAD" },
  { n: 2, name: "AI Aware", min: 300, color: "#4AA8D4" },
  { n: 3, name: "AI Apprentice", min: 700, color: "#00D4E8" },
  { n: 4, name: "AI Practitioner", min: 1400, color: "#0072C6" },
  { n: 5, name: "AI Strategist", min: 2500, color: "#1D9E75" },
  { n: 6, name: "AI Executive", min: 4000, color: "#C17F24" },
];
