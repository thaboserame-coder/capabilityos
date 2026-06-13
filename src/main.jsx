import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { GlobalStyles } from "./theme/GlobalStyles.jsx";
import { reportWebVitals } from "./observability/webVitals.js";
import { initErrorTracking } from "./observability/errorTracking.js";

initErrorTracking();

// Dev-only: surface WCAG violations as console warnings while developing,
// in addition to the build-time `eslint-plugin-jsx-a11y` checks, the
// Storybook a11y addon, and the cypress-axe E2E suite. Never bundled into
// production (dynamic import, gated on import.meta.env.DEV).
if (import.meta.env.DEV) {
  import("@axe-core/react").then(({ default: axe }) => {
    axe(React, ReactDOM, 1000);
  });
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <GlobalStyles />
    <App />
  </React.StrictMode>,
);

// Send Core Web Vitals (LCP, CLS, INP, etc.) to the analytics/observability
// endpoint configured in src/observability/webVitals.js.
reportWebVitals();
