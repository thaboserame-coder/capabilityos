import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

const handlers = {};

vi.mock("web-vitals", () => ({
  onCLS: (cb) => {
    handlers.CLS = cb;
  },
  onFCP: (cb) => {
    handlers.FCP = cb;
  },
  onINP: (cb) => {
    handlers.INP = cb;
  },
  onLCP: (cb) => {
    handlers.LCP = cb;
  },
  onTTFB: (cb) => {
    handlers.TTFB = cb;
  },
}));

const { reportWebVitals } = await import("./webVitals.js");

describe("reportWebVitals", () => {
  beforeEach(() => {
    for (const key of Object.keys(handlers)) delete handlers[key];
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it("registers a reporter for each Core Web Vitals metric", () => {
    reportWebVitals();
    expect(Object.keys(handlers).sort()).toEqual(["CLS", "FCP", "INP", "LCP", "TTFB"].sort());
  });

  it("logs metrics to the console in development", () => {
    reportWebVitals();
    const spy = vi.spyOn(console, "info").mockImplementation(() => {});
    handlers.CLS({ name: "CLS", value: 0.123, id: "v1", navigationType: "navigate" });
    expect(spy).toHaveBeenCalled();
  });

  it("sends metrics via sendBeacon when an analytics endpoint is configured", () => {
    vi.stubEnv("VITE_ANALYTICS_ENDPOINT", "https://analytics.example.com/collect");
    const sendBeacon = vi.fn();
    vi.stubGlobal("navigator", { ...navigator, sendBeacon });

    reportWebVitals();
    handlers.LCP({ name: "LCP", value: 1200, id: "v2", navigationType: "navigate" });

    expect(sendBeacon).toHaveBeenCalledWith(
      "https://analytics.example.com/collect",
      expect.any(String),
    );
  });

  it("does nothing when no analytics endpoint is configured", () => {
    const sendBeacon = vi.fn();
    vi.stubGlobal("navigator", { ...navigator, sendBeacon });

    reportWebVitals();
    handlers.FCP({ name: "FCP", value: 800, id: "v3", navigationType: "navigate" });

    expect(sendBeacon).not.toHaveBeenCalled();
  });
});
