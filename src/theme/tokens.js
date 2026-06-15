// CapabilityOS design tokens — Digilytics Co
// Light "executive" theme: bright, spacious, boardroom-ready.
// Preserves Digilytics Blue (acc) and the Spectral/Archivo type pairing.

export const COLORS = {
  // Surfaces
  bg: "#F4F6F8", // page background — light grey
  surf: "#FFFFFF", // primary card / panel surface
  surf2: "#FAFAFA", // secondary surface (off-white)
  surf3: "#EBF4FF", // tinted surface for active/selected states (blue light)

  // Digilytics Blue — signature accent, preserved across retheme
  acc: "#1D5BD8",
  accSoft: "#7FA9F0",

  // Text
  text: "#0F1B2D", // primary text — near-black charcoal
  muted: "#5A6B85", // secondary text — slate
  muted2: "#8C9AB3", // tertiary text — soft slate

  // Borders
  border: "#E5E7EB", // default hairline border
  borderH: "#C7D5EC", // hover / focus border (blue-tinted)

  // System accents (meaning-only — use sparingly)
  gold: "#D4A72C", // warning / streak
  green: "#1F9D55", // positive / healthy / complete
  danger: "#D64545", // critical / risk
  fire: "#E8743B", // streak / momentum
  purple: "#7C5CBF", // capability / premium nuance
};

export const SHADOW = {
  sm: "0 1px 2px rgba(15, 27, 45, 0.05)",
  md: "0 4px 16px rgba(15, 27, 45, 0.08)",
  lg: "0 16px 40px rgba(15, 27, 45, 0.12)",
};

export const RADIUS = {
  sm: "6px",
  md: "10px",
  lg: "16px",
};

export const XP = {
  MODULE: 100,
  QUIZ_Q: 10,
  PERFECT: 50,
};

export const FONT_FAMILY_DISPLAY = "'Spectral', serif";
export const FONT_FAMILY_BODY = "'Archivo', sans-serif";

// Figma "Design System for CapabilityOS" — Typography page type scale.
// Sizes/weights adopted as specified; fonts intentionally NOT changed —
// FONT_FAMILY_DISPLAY (Spectral) / FONT_FAMILY_BODY (Archivo) remain the
// platform typefaces per the binding GlobalStyles test.
export const TYPE_SCALE = {
  display: {
    fontFamily: FONT_FAMILY_DISPLAY,
    fontSize: "48px",
    fontWeight: 800,
    lineHeight: 1.1,
    letterSpacing: "-0.01em",
  },
  pageTitle: {
    fontFamily: FONT_FAMILY_DISPLAY,
    fontSize: "30px",
    fontWeight: 700,
    lineHeight: 1.2,
    letterSpacing: "-0.005em",
  },
  sectionTitle: {
    fontFamily: FONT_FAMILY_DISPLAY,
    fontSize: "20px",
    fontWeight: 600,
    lineHeight: 1.3,
  },
  cardTitle: {
    fontFamily: FONT_FAMILY_BODY,
    fontSize: "15px",
    fontWeight: 600,
    lineHeight: 1.4,
  },
  body: {
    fontFamily: FONT_FAMILY_BODY,
    fontSize: "14px",
    fontWeight: 400,
    lineHeight: 1.6,
  },
  caption: {
    fontFamily: FONT_FAMILY_BODY,
    fontSize: "12px",
    fontWeight: 500,
    lineHeight: 1.4,
    letterSpacing: "0.02em",
  },
};
