// Recognition tiers — Digilytics Co CapabilityOS gamification layer.
// Tiers are awarded based on cumulative XP and reflect depth of
// capability development, not just activity volume.

import { COLORS } from "../theme/tokens.js";

export const TIERS = [
  {
    id: "explorer",
    name: "Explorer",
    minXP: 0,
    color: COLORS.muted,
    description: "Beginning the capability journey — exploring foundational modules.",
  },
  {
    id: "practitioner",
    name: "Practitioner",
    minXP: 500,
    color: COLORS.acc,
    description: "Demonstrating consistent application of core capabilities.",
  },
  {
    id: "specialist",
    name: "Specialist",
    minXP: 1500,
    color: COLORS.purple,
    description: "Advanced depth across a focused capability area.",
  },
  {
    id: "authority",
    name: "Authority",
    minXP: 3000,
    color: COLORS.gold,
    description: "Recognised internal authority — mentors others and shapes practice.",
  },
];

export function getTierForXP(xp) {
  return TIERS.reduce((acc, tier) => (xp >= tier.minXP ? tier : acc), TIERS[0]);
}

export function getNextTier(xp) {
  return TIERS.find((tier) => tier.minXP > xp) || null;
}
