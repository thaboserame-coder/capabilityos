import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { generateQuiz } from "./quizClient.js";

const params = {
  tierId: "t1",
  moduleId: "t1m1",
  moduleTitle: "The AI mandate",
  moduleSummary: "Board-level AI governance",
  industry: "Financial Services",
};

describe("generateQuiz", () => {
  beforeEach(() => {
    vi.spyOn(console, "warn").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
    delete globalThis.fetch;
  });

  it("returns AI-generated questions when /api/quiz responds successfully", async () => {
    const questions = [
      { q: "Q1?", options: ["a", "b", "c", "d"], correct: 0, explanation: "because" },
    ];
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ questions }),
    });

    const result = await generateQuiz(params);

    expect(globalThis.fetch).toHaveBeenCalledWith(
      "/api/quiz",
      expect.objectContaining({ method: "POST" }),
    );
    expect(result.source).toBe("ai");
    expect(result.questions).toEqual(questions);
  });

  it("falls back to the local question bank when the response is not ok", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({ ok: false, status: 503 });

    const result = await generateQuiz(params);

    expect(result.source).toBe("fallback");
    expect(result.questions.length).toBeGreaterThan(0);
    expect(console.warn).toHaveBeenCalled();
  });

  it("falls back when the API returns an empty questions array", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ questions: [] }),
    });

    const result = await generateQuiz(params);

    expect(result.source).toBe("fallback");
    expect(result.questions.length).toBeGreaterThan(0);
  });

  it("falls back when fetch throws (network error / not deployed)", async () => {
    globalThis.fetch = vi.fn().mockRejectedValue(new TypeError("Failed to fetch"));

    const result = await generateQuiz(params);

    expect(result.source).toBe("fallback");
    expect(result.questions.length).toBeGreaterThan(0);
    expect(console.warn).toHaveBeenCalled();
  });

  it("requests no more than the available fallback questions", async () => {
    globalThis.fetch = vi.fn().mockRejectedValue(new Error("offline"));
    const result = await generateQuiz(params);
    for (const q of result.questions) {
      expect(q.options).toHaveLength(4);
      expect(q.correct).toBeGreaterThanOrEqual(0);
      expect(q.correct).toBeLessThanOrEqual(3);
    }
  });
});
