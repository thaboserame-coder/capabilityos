/**
 * Seed data shown on the facilitator dashboard so the cohort view is never
 * empty for a brand-new tenant. Real learners (loaded from the leaderboard
 * API) are merged with this list and de-duplicated by name in
 * `FacilitatorDashboard`.
 *
 * @typedef {Object} DemoLearner
 * @property {string} name
 * @property {number} xp
 * @property {string} lv - Level name
 * @property {number} mods - Modules completed
 * @property {number} streak - Current daily streak
 * @property {string} last - Human-readable "last active" string
 * @property {string} ind - Industry
 */

/** @type {DemoLearner[]} */
export const DEMO_COHORT = [
  {
    name: "Nomsa Khumalo",
    xp: 2100,
    lv: "AI Strategist",
    mods: 14,
    streak: 7,
    last: "30 min ago",
    ind: "Mining & Resources",
  },
  {
    name: "James Okonkwo",
    xp: 1450,
    lv: "AI Practitioner",
    mods: 9,
    streak: 3,
    last: "2 hours ago",
    ind: "Financial Services",
  },
  {
    name: "Sarah Dlamini",
    xp: 980,
    lv: "AI Apprentice",
    mods: 6,
    streak: 2,
    last: "1 day ago",
    ind: "Healthcare & Life Sciences",
  },
  {
    name: "Michael van der Berg",
    xp: 700,
    lv: "AI Apprentice",
    mods: 5,
    streak: 1,
    last: "1 day ago",
    ind: "Manufacturing & Engineering",
  },
  {
    name: "Thandi Molefe",
    xp: 300,
    lv: "AI Aware",
    mods: 3,
    streak: 0,
    last: "3 days ago",
    ind: "Retail & Consumer Goods",
  },
  {
    name: "Sipho Ndlovu",
    xp: 150,
    lv: "AI Curious",
    mods: 1,
    streak: 1,
    last: "5 days ago",
    ind: "Telecommunications",
  },
];
