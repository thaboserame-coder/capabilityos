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

  /* ── Animations ────────────────────────────────────────────────── */
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes slideRight {
    from { opacity: 0; transform: translateX(-12px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes badgePop {
    0%   { transform: scale(0.5); opacity: 0; }
    70%  { transform: scale(1.15); opacity: 1; }
    100% { transform: scale(1); }
  }
  @keyframes spin {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50%       { opacity: 0.55; }
  }

  /* ── Animation utility classes ─────────────────────────────────── */
  .fade-in  { animation: fadeUp 0.35s ease both; }
  .slide-in { animation: slideRight 0.3s ease both; }
  .badge-pop { animation: badgePop 0.4s cubic-bezier(0.34,1.56,0.64,1) both; }
  .spin     { animation: spin 1s linear infinite; }
  .pulse    { animation: pulse 1.8s ease-in-out infinite; }

  /* ── Module HTML content (.ch) ─────────────────────────────────── */
  .ch {
    font-family: var(--font-body);
    font-size: 15px;
    line-height: 1.75;
    color: var(--color-text);
  }
  .ch h1, .ch h2, .ch h3, .ch h4 {
    font-family: var(--font-display);
    color: var(--color-text);
    margin-top: 1.4em;
    margin-bottom: 0.5em;
    line-height: 1.3;
  }
  .ch h2 { font-size: 1.3em; }
  .ch h3 { font-size: 1.1em; }
  .ch p  { margin-bottom: 1em; }
  .ch ul, .ch ol { padding-left: 1.4em; margin-bottom: 1em; }
  .ch li { margin-bottom: 0.4em; }
  .ch strong { font-weight: 700; color: var(--color-text); }
  .ch em { font-style: italic; color: var(--color-muted); }
  .ch blockquote {
    margin: 1em 0;
    padding: 12px 18px;
    border-left: 3px solid var(--color-accent);
    background: var(--color-surface-2);
    border-radius: 0 6px 6px 0;
    color: var(--color-muted);
    font-style: italic;
  }
  .ch code {
    font-family: 'Courier New', monospace;
    font-size: 0.9em;
    background: var(--color-surface-3);
    padding: 2px 6px;
    border-radius: 3px;
    color: var(--color-accent);
  }
  .ch pre {
    background: var(--color-surface-3);
    border: 1px solid var(--color-border);
    border-radius: 8px;
    padding: 14px 16px;
    overflow-x: auto;
    margin: 1em 0;
  }
  .ch pre code {
    background: none;
    padding: 0;
    color: var(--color-text);
    font-size: 0.88em;
  }
  .ch table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 1em;
    font-size: 0.9em;
  }
  .ch th, .ch td {
    text-align: left;
    padding: 8px 12px;
    border-bottom: 1px solid var(--color-border);
  }
  .ch th {
    font-weight: 700;
    color: var(--color-muted-2);
    text-transform: uppercase;
    font-size: 0.78em;
    letter-spacing: 0.05em;
    background: var(--color-surface-2);
  }
  .ch tr:hover td { background: var(--color-surface-2); }

  /* ── Progress bar utility ───────────────────────────────────────── */
  .prog-bar {
    height: 6px;
    border-radius: 999px;
    background: var(--color-border);
    overflow: hidden;
  }
  .prog-bar-fill {
    height: 100%;
    border-radius: 999px;
    background: var(--color-accent);
    transition: width 400ms ease;
  }

  /* ── Mobile responsive ─────────────────────────────────────────── */
  @media (max-width: 768px) {
    .mob-hide { display: none !important; }
    .mob-full { width: 100% !important; }
  }
  @media (max-width: 960px) {
    .sidebar-mob {
      position: fixed !important;
      left: 0; top: 0; bottom: 0;
      z-index: 200;
      transform: translateX(-100%);
      transition: transform 0.25s ease;
      box-shadow: 4px 0 24px rgba(0,0,0,0.12);
    }
    .sidebar-mob.open {
      transform: translateX(0);
    }
  }
`;

export default function GlobalStyles() {
  return <style>{GLOBAL_CSS}</style>;
}
