import React from "react";
import { COLORS, FONT_FAMILY_DISPLAY, FONT_FAMILY_BODY } from "./tokens.js";

// GLOBAL_CSS is exported separately so it can be unit-tested in isolation
// (GlobalStyles.test.jsx asserts it references both Spectral and Archivo).
export const GLOBAL_CSS = `
  :root {
    --color-bg: ${COLORS.bg};
    --color-surface: ${COLORS.surf};
    --color-surface-2: ${COLORS.surf2};
    --color-surface-3: ${COLORS.surf3};
    --color-accent: ${COLORS.acc};
    --color-accent-soft: ${COLORS.accSoft};
    --color-text: ${COLORS.text};
    --color-muted: ${COLORS.muted};
    --color-muted-2: ${COLORS.muted2};
    --color-border: ${COLORS.border};
    --color-border-hover: ${COLORS.borderH};
    --font-display: ${FONT_FAMILY_DISPLAY};
    --font-body: ${FONT_FAMILY_BODY};
  }

  * {
    box-sizing: border-box;
  }

  html, body, #root {
    margin: 0;
    padding: 0;
    min-height: 100%;
  }

  body {
    background: var(--color-bg);
    color: var(--color-text);
    font-family: var(--font-body);
    -webkit-font-smoothing: antialiased;
    text-rendering: optimizeLegibility;
  }

  h1, h2, h3, h4 {
    font-family: var(--font-display);
    margin: 0;
    color: var(--color-text);
  }

  p {
    margin: 0;
  }

  a {
    color: var(--color-accent);
    text-decoration: none;
  }

  button {
    font-family: var(--font-body);
  }

  ::selection {
    background: var(--color-surface-3);
  }

  /* Calm, premium scrollbars */
  ::-webkit-scrollbar {
    width: 10px;
    height: 10px;
  }
  ::-webkit-scrollbar-track {
    background: transparent;
  }
  ::-webkit-scrollbar-thumb {
    background: var(--color-border);
    border-radius: 8px;
  }
  ::-webkit-scrollbar-thumb:hover {
    background: var(--color-border-hover);
  }
`;

export default function GlobalStyles() {
  return <style>{GLOBAL_CSS}</style>;
}
