import { describe, it, expect, vi, afterEach } from "vitest";
import { captureException, initErrorTracking } from "./errorTracking.js";

describe("captureException", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
    delete globalThis.fetch;
  });

  it("logs the error to the console in development", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    captureException(new Error("boom"), { type: "test" });
    expect(spy).toHaveBeenCalledWith("[error-tracking]", expect.any(Error), { type: "test" });
  });

  it("posts the error payload to the configured endpoint", () => {
    vi.stubEnv("VITE_ERROR_ENDPOINT", "https://errors.example.com/collect");
    globalThis.fetch = vi.fn().mockResolvedValue({ ok: true });

    captureException(new Error("boom"));

    expect(globalThis.fetch).toHaveBeenCalledWith(
      "https://errors.example.com/collect",
      expect.objectContaining({ method: "POST" }),
    );
    const body = JSON.parse(globalThis.fetch.mock.calls[0][1].body);
    expect(body.message).toBe("boom");
  });

  it("does not throw when reporting fails", () => {
    vi.stubEnv("VITE_ERROR_ENDPOINT", "https://errors.example.com/collect");
    globalThis.fetch = vi.fn().mockRejectedValue(new Error("network down"));

    expect(() => captureException(new Error("boom"))).not.toThrow();
  });

  it("does nothing beyond logging when no endpoint is configured", () => {
    globalThis.fetch = vi.fn();
    captureException("a string error");
    expect(globalThis.fetch).not.toHaveBeenCalled();
  });
});

describe("initErrorTracking", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("reports uncaught window errors", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    initErrorTracking();

    window.dispatchEvent(new ErrorEvent("error", { message: "uncaught failure" }));

    expect(spy).toHaveBeenCalledWith("[error-tracking]", expect.anything(), {
      type: "window.onerror",
    });
  });

  it("reports unhandled promise rejections", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    initErrorTracking();

    const event = new Event("unhandledrejection");
    Object.defineProperty(event, "reason", { value: new Error("rejected") });
    window.dispatchEvent(event);

    expect(spy).toHaveBeenCalledWith("[error-tracking]", expect.anything(), {
      type: "unhandledrejection",
    });
  });
});
