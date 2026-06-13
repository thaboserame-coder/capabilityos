/**
 * Core Web Vitals reporting.
 *
 * Wraps the `web-vitals` library and sends each metric to a pluggable
 * reporter. By default the reporter logs to the console in development and
 * is a no-op in production builds unless `VITE_ANALYTICS_ENDPOINT` is set,
 * in which case metrics are POSTed there as JSON.
 *
 * This satisfies the "performance dashboards" observability requirement
 * without hard-coding a dependency on a specific analytics vendor — swap
 * `sendToEndpoint` for Datadog RUM, Vercel Analytics, etc. as needed.
 */
import { onCLS, onFCP, onINP, onLCP, onTTFB } from "web-vitals";

/**
 * @typedef {Object} VitalMetric
 * @property {string} name - e.g. "CLS", "LCP", "INP", "FCP", "TTFB"
 * @property {number} value
 * @property {string} id
 * @property {string} navigationType
 */

/**
 * @param {VitalMetric} metric
 */
function reportMetric(metric) {
  const endpoint = import.meta.env?.VITE_ANALYTICS_ENDPOINT;

  if (import.meta.env?.DEV) {
    console.info(`[web-vitals] ${metric.name}:`, Math.round(metric.value * 100) / 100);
  }

  if (!endpoint) return;

  const body = JSON.stringify({
    name: metric.name,
    value: metric.value,
    id: metric.id,
    navigationType: metric.navigationType,
    page: typeof location !== "undefined" ? location.pathname : "",
    ts: Date.now(),
  });

  // `navigator.sendBeacon` is fire-and-forget and survives page unload —
  // ideal for performance metrics, which are often recorded right as the
  // user navigates away.
  if (typeof navigator !== "undefined" && navigator.sendBeacon) {
    navigator.sendBeacon(endpoint, body);
  } else if (typeof fetch !== "undefined") {
    fetch(endpoint, {
      method: "POST",
      body,
      keepalive: true,
      headers: { "Content-Type": "application/json" },
    }).catch(() => {
      /* metrics are best-effort; never block or throw on failure */
    });
  }
}

/**
 * Register Core Web Vitals reporters. Call once from `main.jsx`.
 */
export function reportWebVitals() {
  onCLS(reportMetric);
  onFCP(reportMetric);
  onINP(reportMetric);
  onLCP(reportMetric);
  onTTFB(reportMetric);
}
