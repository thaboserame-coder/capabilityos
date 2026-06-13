/**
 * Offline/fallback quiz bank.
 *
 * The original prototype generated every quiz live by calling the Anthropic
 * API directly from the browser. That is both insecure (exposes API
 * surface/keys to the client) and a hard dependency — the app is unusable
 * without a live, authenticated API call. `src/api/quizClient.js` now calls
 * a server-side proxy (`/api/quiz`, see project-root `api/quiz.js`) instead.
 *
 * This module provides a small, hand-written question bank used when that
 * proxy is unreachable or no API key is configured (e.g. local development,
 * CI, or a learner on a restricted network). It guarantees the quiz flow —
 * and therefore XP, badges, and certification — always works, with or
 * without the AI service.
 *
 * @typedef {Object} QuizQuestion
 * @property {string} q - The question text
 * @property {string[]} options - Exactly 4 answer options
 * @property {number} correct - Index (0-3) of the correct option
 * @property {string} explanation - Shown after answering, regardless of correctness
 */

/** @type {QuizQuestion[]} */
const GENERIC_QUESTIONS = [
  {
    q: "Which of the following best describes generative AI?",
    options: [
      "A system that follows fixed, predefined rules with no learning",
      "A system that creates new content by predicting plausible continuations based on patterns in training data",
      "A database query tool for structured records only",
      "A type of antivirus software",
    ],
    correct: 1,
    explanation:
      "Generative AI produces new text, code, or analysis by predicting the most statistically plausible continuation of a prompt, based on patterns learned during training.",
  },
  {
    q: "What is 'hallucination' in the context of generative AI?",
    options: [
      "A hardware malfunction in the server running the model",
      "When the AI refuses to answer a question",
      "Confident, fluent, well-structured output that is factually incorrect",
      "A visual glitch in the user interface",
    ],
    correct: 2,
    explanation:
      "Hallucination describes output that looks accurate and authoritative but is not grounded in fact — a structural feature of how generative models work, not a rare bug.",
  },
  {
    q: "Before relying on an AI-generated factual claim in a professional context, what should you do?",
    options: [
      "Use it immediately — AI outputs are generally reliable for facts",
      "Independently verify it against an authoritative source when accuracy matters",
      "Ask a different AI tool to confirm, and stop there",
      "Reformat it so it looks more official",
    ],
    correct: 1,
    explanation:
      "Verification against an authoritative source is the professional standard for any AI-generated factual claim — statistics, names, dates, regulatory details, and similar.",
  },
  {
    q: "Why does data quality matter so much for machine learning systems?",
    options: [
      "It doesn't — model architecture is the only thing that matters",
      "ML models learn patterns from historical data, so poor or biased data produces poor or biased predictions at scale",
      "Data quality only affects how fast the model runs",
      "Data quality is only relevant for generative AI, not machine learning",
    ],
    correct: 1,
    explanation:
      "An ML model is only as good as the data it learns from. Incomplete, inconsistent, or biased historical data leads to incomplete, inconsistent, or biased predictions.",
  },
  {
    q: "What is the most common organisational (non-technical) reason AI initiatives fail?",
    options: [
      "The AI model is too accurate",
      "Unclear business case, weak accountability, or change management treated as a one-off announcement rather than a sustained programme",
      "Too much executive sponsorship",
      "Excessive testing before launch",
    ],
    correct: 1,
    explanation:
      "Technical failure is relatively rare. The more common pattern is an unclear outcome definition, accountability sitting too low in the organisation, or adoption never moving past compliance.",
  },
  {
    q: "Under POPIA, what should you confirm before passing personal information to an AI tool?",
    options: [
      "Nothing — POPIA does not apply to AI tools",
      "Only whether the tool is free to use",
      "Whether the tool is approved for this data type, how the data will be stored/used, and whether this use fits the original purpose of collection",
      "Whether the AI tool has a privacy policy of any kind, regardless of content",
    ],
    correct: 2,
    explanation:
      "POPIA applies regardless of which tool is used. Before sharing personal information with an AI system, confirm approval, storage/use terms, and consistency with the original purpose of collection.",
  },
  {
    q: "A vendor claims their AI model is '95% accurate'. What should you ask first?",
    options: [
      "Nothing — 95% is a strong number and should be accepted",
      "What was being predicted, what the test set contained, and what the baseline comparison was",
      "Whether the number can be rounded up to 100% for the board pack",
      "How many employees the vendor has",
    ],
    correct: 1,
    explanation:
      "An accuracy figure with no methodology carries no useful information. Always ask what was measured, against what data, and compared to what baseline.",
  },
  {
    q: "What is the recommended relationship between AI and human review for professional deliverables?",
    options: [
      "AI replaces human review entirely once it reaches sufficient accuracy",
      "Human review replaces AI — AI should not be used for drafting",
      "AI accelerates the draft; human expertise validates the output before it is relied upon",
      "AI and human review should never be used on the same document",
    ],
    correct: 2,
    explanation:
      "The consistent professional standard across functions is: AI drafts, human verifies — particularly where outputs affect financial figures, people decisions, or legal/regulatory content.",
  },
];

/**
 * Build a small quiz (5 questions) for a given module. Currently returns a
 * shuffled subset of the generic question bank — sufficient to exercise the
 * full quiz/XP/badge flow without a live AI call. The live `/api/quiz`
 * endpoint (when configured) generates questions tailored to the specific
 * module and the learner's industry.
 *
 * @param {{ moduleTitle?: string, industry?: string, count?: number }} [options]
 * @returns {QuizQuestion[]}
 */
export function getFallbackQuiz({ count = 5 } = {}) {
  const shuffled = [...GENERIC_QUESTIONS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}
