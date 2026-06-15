// Level progression — Digilytics Co CapabilityOS gamification layer.
// Levels provide a finer-grained sense of momentum than tiers and
// drive the progress indicators on the learner dashboard.

export const LEVELS = Array.from({ length: 20 }, (_, i) => {
  const level = i + 1;
  // Each level requires progressively more XP (gentle curve).
  const xpRequired = Math.round(100 * level + 25 * level * (level - 1));
  return {
    level,
    xpRequired,
    title: levelTitle(level),
  };
});

function levelTitle(level) {
  if (level <= 3) return "Foundations";
  if (level <= 7) return "Builder";
  if (level <= 12) return "Operator";
  if (level <= 17) return "Strategist";
  return "Authority";
}

export function getLevelForXP(xp) {
  let current = LEVELS[0];
  for (const entry of LEVELS) {
    if (xp >= entry.xpRequired) current = entry;
    else break;
  }
  return current;
}

export function getNextLevel(xp) {
  return LEVELS.find((entry) => entry.xpRequired > xp) || null;
}

export function getLevelProgress(xp) {
  const current = getLevelForXP(xp);
  const next = getNextLevel(xp);
  if (!next) return 1;
  const span = next.xpRequired - current.xpRequired;
  const into = xp - current.xpRequired;
  return span > 0 ? Math.min(1, Math.max(0, into / span)) : 1;
}
