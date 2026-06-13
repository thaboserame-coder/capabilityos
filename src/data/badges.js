import { TIERS } from "./tiers.js";

/**
 * @typedef {Object} BadgeDefinition
 * @property {string} id - Unique badge id, persisted in learner progress records
 * @property {string} icon - Key into `theme/icons.js` ICONS map
 * @property {string} name - Display name shown on the badge
 * @property {string} desc - One-line description of how to earn the badge
 * @property {(completedModuleIds: string[], perfectQuizzes: number) => boolean} ok
 *   Predicate that returns true once the badge has been earned. `completedModuleIds`
 *   is the learner's progress array (module ids); `perfectQuizzes` is the count of
 *   quizzes the learner has scored 100% on.
 */

const t1ModIds = () => TIERS.find((t) => t.id === "t1")?.mods.map((m) => m.id) ?? [];
const t2ModIds = () => TIERS.find((t) => t.id === "t2")?.mods.map((m) => m.id) ?? [];
const t3ModIds = () => TIERS.find((t) => t.id === "t3")?.mods.map((m) => m.id) ?? [];
const allModIds = () => TIERS.flatMap((tier) => tier.mods.map((m) => m.id));

/**
 * Ordered list of badges a learner can earn. Order determines display order
 * on the dashboard and the order in which `newBadges()` checks for newly
 * earned badges after a module or quiz completion.
 *
 * @type {BadgeDefinition[]}
 */
export const BDEFS = [
  {
    id: "first",
    icon: "bookOpen",
    name: "First Steps",
    desc: "Complete your first module",
    ok: (progress) => progress.length >= 1,
  },
  {
    id: "five",
    icon: "check",
    name: "Building Momentum",
    desc: "Complete 5 modules",
    ok: (progress) => progress.length >= 5,
  },
  {
    id: "ten",
    icon: "award",
    name: "Halfway There",
    desc: "Complete 10 modules",
    ok: (progress) => progress.length >= 10,
  },
  {
    id: "sharp",
    icon: "refresh",
    name: "Sharp Mind",
    desc: "Score 100% on 3 quizzes",
    ok: (_progress, perfectQuizzes) => perfectQuizzes >= 3,
  },
  {
    id: "t1",
    icon: "target",
    name: "AI Executive Graduate",
    desc: "Complete every Tier 1: AI Executive module",
    ok: (progress) => t1ModIds().every((id) => progress.includes(id)),
  },
  {
    id: "t2",
    icon: "users",
    name: "AI Leader Graduate",
    desc: "Complete every Tier 2: AI Leader module",
    ok: (progress) => t2ModIds().every((id) => progress.includes(id)),
  },
  {
    id: "t3",
    icon: "shield",
    name: "AI Practitioner Graduate",
    desc: "Complete every Tier 3: AI Practitioner module",
    ok: (progress) => t3ModIds().every((id) => progress.includes(id)),
  },
  {
    id: "all",
    icon: "award",
    name: "Capability Master",
    desc: "Complete all 20 modules across every tier",
    ok: (progress) => allModIds().every((id) => progress.includes(id)),
  },
];

/**
 * Compute which badges a learner has newly earned since their last check.
 * @param {string[]} progress - Completed module ids
 * @param {number} perfectQuizzes - Count of quizzes scored 100%
 * @param {string[]} have - Badge ids the learner already holds
 * @returns {BadgeDefinition[]} Badges earned now but not present in `have`
 */
export function newBadges(progress, perfectQuizzes, have) {
  return BDEFS.filter((badge) => !have.includes(badge.id) && badge.ok(progress, perfectQuizzes));
}
