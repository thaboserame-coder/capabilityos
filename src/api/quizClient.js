import { getFallbackQuiz } from "../data/fallbackQuiz.js";

/**
 * Client for generating module quizzes.
 *
 * Architectural note (Fix-from-the-Root): the original prototype called
 * `https://api.anthropic.com/v1/messages` directly from the browser with an
 * API key embedded in client code. This is a critical security issue — it
 * exposes the key to anyone who opens devtools, and the Anthropic API does
 * not support browser CORS for this kind of unauthenticated client use in
 * production.
 *
 * The fix: the client calls a same-origin serverless endpoint, `/api/quiz`
 * (see `/api/quiz.js` at the project root, deployed as a Vercel function).
 * The serverless function holds the API key as a server-side environment
 * variable and proxies the request. If that endpoint is unavailable —
 * not deployed, misconfigured, or the request fails for any reason — this
 * client falls back to a small local question bank so the learning flow
 * (and the XP/badge/certification mechanics that depend on it) keeps
 * working without interruption.
 *
 * @typedef {import("../data/fallbackQuiz.js").QuizQuestion} QuizQuestion
 */

/**
 * @param {{
 *   tierId: string,
 *   moduleId: string,
 *   moduleTitle: string,
 *   moduleSummary: string,
 *   industry: string,
 * }} params
 * @returns {Promise<{ questions: QuizQuestion[], source: "ai" | "fallback" }>}
 */
export async function generateQuiz({ tierId, moduleId, moduleTitle, moduleSummary, industry }) {
  try {
    const response = await fetch("/api/quiz", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tierId, moduleId, moduleTitle, moduleSummary, industry }),
    });

    if (!response.ok) {
      throw new Error(`Quiz API responded with status ${response.status}`);
    }

    const data = await response.json();
    if (!Array.isArray(data?.questions) || data.questions.length === 0) {
      throw new Error("Quiz API returned no questions");
    }

    return { questions: data.questions, source: "ai" };
  } catch (error) {
    // Network error, missing deployment, or malformed response — degrade to
    // the local fallback bank rather than blocking the learner.
    if (typeof console !== "undefined") {
      console.warn("[quizClient] Falling back to local question bank:", error);
    }
    return {
      questions: getFallbackQuiz({ moduleTitle, industry, count: 5 }),
      source: "fallback",
    };
  }
}
