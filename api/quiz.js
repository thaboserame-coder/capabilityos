/**
 * Vercel serverless function: POST /api/quiz
 *
 * Server-side proxy to the Anthropic API for generating module quizzes.
 * This exists so the Anthropic API key never reaches the browser (see
 * `src/api/quizClient.js` for the architectural rationale).
 *
 * Required environment variable (set in Vercel project settings, never
 * committed): ANTHROPIC_API_KEY
 *
 * Request body: { tierId, moduleId, moduleTitle, moduleSummary, industry }
 * Response body: { questions: QuizQuestion[] }
 *
 * If ANTHROPIC_API_KEY is not configured, responds with 503 so the client
 * cleanly falls back to its local question bank — this endpoint is
 * optional, not a hard dependency.
 */

const ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages";
const ANTHROPIC_MODEL = "claude-sonnet-4-5-20250929";

/**
 * @param {import("http").IncomingMessage & { body?: any }} req
 * @param {import("http").ServerResponse & { status: Function, json: Function }} res
 */
export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    res.status(503).json({
      error: "Quiz generation is not configured on this deployment (ANTHROPIC_API_KEY missing).",
    });
    return;
  }

  const { moduleTitle, moduleSummary, industry } = req.body ?? {};

  if (!moduleTitle || !moduleSummary) {
    res.status(400).json({ error: "moduleTitle and moduleSummary are required" });
    return;
  }

  const prompt = buildPrompt({ moduleTitle, moduleSummary, industry });

  try {
    const response = await fetch(ANTHROPIC_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: ANTHROPIC_MODEL,
        max_tokens: 2048,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!response.ok) {
      const detail = await response.text();
      res.status(502).json({ error: "Upstream AI provider error", detail });
      return;
    }

    const data = await response.json();
    const text = data?.content?.[0]?.text ?? "";
    const questions = parseQuestions(text);

    if (!questions.length) {
      res.status(502).json({ error: "AI response did not contain valid quiz questions" });
      return;
    }

    res.status(200).json({ questions });
  } catch (error) {
    res.status(500).json({ error: "Quiz generation failed", detail: String(error) });
  }
}

/**
 * @param {{ moduleTitle: string, moduleSummary: string, industry?: string }} params
 * @returns {string}
 */
function buildPrompt({ moduleTitle, moduleSummary, industry }) {
  const industryLine = industry
    ? `Tailor scenarios and examples to the ${industry} industry where natural.`
    : "";

  return [
    `Generate exactly 5 multiple-choice quiz questions for a corporate AI-literacy module titled "${moduleTitle}".`,
    `Module summary: ${moduleSummary}`,
    industryLine,
    "Each question must have exactly 4 answer options, one correct answer, and a one-sentence explanation.",
    "Respond with ONLY a JSON array (no markdown fences, no commentary) matching this shape:",
    `[{"q": "...", "options": ["...","...","...","..."], "correct": 0, "explanation": "..."}]`,
  ]
    .filter(Boolean)
    .join("\n");
}

/**
 * Parse the model's response text into a validated questions array.
 * Defensive: strips markdown code fences if present, validates shape, and
 * silently drops malformed entries rather than failing the whole request.
 * @param {string} text
 * @returns {Array<{q: string, options: string[], correct: number, explanation: string}>}
 */
function parseQuestions(text) {
  const cleaned = text
    .trim()
    .replace(/^```(?:json)?/i, "")
    .replace(/```$/, "")
    .trim();

  let parsed;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    return [];
  }

  if (!Array.isArray(parsed)) return [];

  return parsed.filter(
    (item) =>
      item &&
      typeof item.q === "string" &&
      Array.isArray(item.options) &&
      item.options.length === 4 &&
      item.options.every((opt) => typeof opt === "string") &&
      typeof item.correct === "number" &&
      item.correct >= 0 &&
      item.correct <= 3 &&
      typeof item.explanation === "string",
  );
}
