// Level progression — CapabilityOS
// 8 levels matching the original EDAAI Workforce Architecture

export const LEVELS = [
  { n: 1, name: "Digital Literate",       min: 0,     color: "#6B8EAD" },
  { n: 2, name: "Data Aware",             min: 300,   color: "#4AA8D4" },
  { n: 3, name: "Analytics Literate",     min: 700,   color: "#0072C6" },
  { n: 4, name: "AI Literate",            min: 1400,  color: "#00D4E8" },
  { n: 5, name: "AI Productive",          min: 2500,  color: "#1D9E75" },
  { n: 6, name: "AI Practitioner",        min: 4000,  color: "#C17F24" },
  { n: 7, name: "AI Leader",              min: 6500,  color: "#7C3AED" },
  { n: 8, name: "Transformation Leader",  min: 10000, color: "#E8B84B" },
];

export function getLevelForXP(xp) {
  let level = LEVELS[0];
  for (const l of LEVELS) {
    if (xp >= l.min) level = l;
  }
  return level;
}

export function getNextLevel(xp) {
  const idx = LEVELS.findIndex((l) => l.min > xp);
  return idx === -1 ? null : LEVELS[idx];
}

export function getLevelProgress(xp) {
  const current = getLevelForXP(xp);
  const next = getNextLevel(xp);
  if (!next) return { current, next: null, pct: 100 };
  const pct = Math.round(((xp - current.min) / (next.min - current.min)) * 100);
  return { current, next, pct };
}
