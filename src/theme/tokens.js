/**
 * Design tokens for the CapabilityOS UI.
 *
 * Centralising colour, spacing and typography values here means a future
 * theme switch (e.g. light mode, white-label client branding) only requires
 * changes in this one module rather than hunting through component files.
 *
 * @typedef {Object} ColorTokens
 * @property {string} bg - Page background
 * @property {string} surf - Primary surface (cards, panels)
 * @property {string} surf2 - Secondary surface (inputs, nested panels)
 * @property {string} surf3 - Tertiary surface (badges, avatars)
 * @property {string} acc - Accent / brand cyan
 * @property {string} text - Primary text colour
 * @property {string} muted - Muted label colour
 * @property {string} muted2 - Secondary muted text colour
 * @property {string} border - Default border colour
 * @property {string} borderH - Hover border colour
 * @property {string} gold - Gold accent (badges, certificates)
 * @property {string} green - Success / completion accent
 * @property {string} danger - Error / attention accent
 * @property {string} fire - Streak / momentum accent
 */

/** @type {ColorTokens} */
export const COLORS = {
  bg: "#030B16",
  surf: "#071220",
  surf2: "#0C1B30",
  surf3: "#112244",
  acc: "#00D4E8",
  text: "#D4E8F5",
  muted: "#4A6880",
  muted2: "#7A9BB8",
  border: "rgba(255,255,255,0.06)",
  borderH: "rgba(255,255,255,0.13)",
  gold: "#C17F24",
  green: "#1D9E75",
  danger: "#E24B4A",
  fire: "#FF9500",
};

/**
 * XP awarded for each type of learning activity.
 * @type {{MODULE: number, QUIZ_Q: number, PERFECT: number}}
 */
export const XP = {
  MODULE: 100,
  QUIZ_Q: 10,
  PERFECT: 50,
};

export const FONT_FAMILY_DISPLAY = "'Cormorant Garamond', serif";
export const FONT_FAMILY_BODY = "'DM Sans', sans-serif";
