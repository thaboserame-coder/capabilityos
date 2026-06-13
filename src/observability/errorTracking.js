/**
 * Lightweight error tracking shim.
 *
 * Production-grade error tracking (Sentry, Datadog RUM, Bugsnag, etc.)
 * requires an account and a project DSN/key — both out of scope for this
 * scaffold (see docs/RUNBOOK.md "Observability setup"). This module provides
 * the integration point: it installs global handlers for uncaught errors and
 * unhandled promise rejections, and a `captureException` helper that
 * components can call directly.
 *
 * To wire up a real provider:
 *   1. `npm install @sentry/react`
 *   2. Replace the body of `reportError` below with `Sentry.captureException`
 *   3. Call `Sentry.init({ dsn: import.meta.env.VITE_SENTRY_DSN })` at the
 *      top of `initErrorTracking`
 *
 * Until then, errors are logged to the console (dev) and, if
 * `VITE_ERROR_ENDPOINT` is configured, POSTed there as JSON — giving teams a
 * working error feed on day one without a third-party account.
 */

/**
 * @param {unknown} error
 * @param {Record<string, unknown>} [context]
 */
function reportError(error, context = {}) {
  const endpoint = import.meta.env?.VITE_ERROR_ENDPOINT;

  if (import.meta.env?.DEV) {
    console.error("[error-tracking]", error, context);
  }

  if (!endpoint || typeof fetch === "undefined") return;

  const payload = {
    message: error instanceof Error ? error.message : String(error),
    stack: error instanceof Error ? error.stack : undefined,
    context,
    page: typeof location !== "undefined" ? location.pathname : "",
    ts: Date.now(),
  };

  fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    keepalive: true,
  }).catch(() => {
    /* error reporting is best-effort; never throw from here */
  });
}

/**
 * Manually report a caught exception with optional context.
 * @param {unknown} error
 * @param {Record<string, unknown>} [context]
 */
export function captureException(error, context) {
  reportError(error, context);
}

/**
 * Install global handlers for uncaught errors and unhandled promise
 * rejections. Call once from `main.jsx`, before rendering.
 */
export function initErrorTracking() {
  if (typeof window === "undefined") return;

  window.addEventListener("error", (event) => {
    reportError(event.error ?? event.message, { type: "window.onerror" });
  });

  window.addEventListener("unhandledrejection", (event) => {
    reportError(event.reason, { type: "unhandledrejection" });
  });
}
