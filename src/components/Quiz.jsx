import { useEffect, useState } from "react";
import { ArrowLeft, Check, Loader2, RefreshCw, X } from "lucide-react";
import { useAppStore } from "../store/useAppStore.js";
import { COLORS, FONT_FAMILY_DISPLAY } from "../theme/tokens.js";
import { findModule } from "../data/tiers.js";
import { generateQuiz } from "../api/quizClient.js";

/**
 * @typedef {import("../data/fallbackQuiz.js").QuizQuestion} QuizQuestion
 */

const PASS_THRESHOLD = 0.8;

/**
 * Module quiz. `screen: "quiz"`, expects `params: { tierId, moduleId }`.
 *
 * Fetches questions via `generateQuiz` (AI-backed with local fallback — see
 * `src/api/quizClient.js`), lets the learner answer all questions, then
 * shows per-question feedback and records the result via
 * `recordQuizResult` / `completeModule`.
 */
export default function Quiz() {
  const user = useAppStore((state) => state.user);
  const screen = useAppStore((state) => state.screen);
  const navigateTo = useAppStore((state) => state.navigateTo);
  const goBack = useAppStore((state) => state.goBack);
  const completeModule = useAppStore((state) => state.completeModule);
  const recordQuizResult = useAppStore((state) => state.recordQuizResult);

  const { tierId, moduleId } = screen.params ?? {};
  const { tier, mod } = findModule(tierId, moduleId);

  /** @type {[ "loading" | "active" | "submitted", Function ]} */
  const [phase, setPhase] = useState("loading");
  /** @type {[ QuizQuestion[], Function ]} */
  const [questions, setQuestions] = useState([]);
  /** @type {[ (number|null)[], Function ]} */
  const [answers, setAnswers] = useState([]);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    if (!tier || !mod || !user) return;
    let cancelled = false;
    setPhase("loading");
    setLoadError(false);

    generateQuiz({
      tierId: tier.id,
      moduleId: mod.id,
      moduleTitle: mod.title,
      moduleSummary: mod.summary,
      industry: user.industry,
    }).then((result) => {
      if (cancelled) return;
      setQuestions(result.questions);
      setAnswers(new Array(result.questions.length).fill(null));
      setPhase("active");
      if (result.source === "fallback") setLoadError(true);
    });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- re-run only when navigating to a new module
  }, [tier?.id, mod?.id]);

  if (!user || !tier || !mod) {
    return (
      <main style={{ maxWidth: 800, margin: "0 auto", padding: "32px 24px" }}>
        <p style={{ color: COLORS.muted2 }}>Quiz not available — module not found.</p>
        <button
          type="button"
          className="nb"
          onClick={() => navigateTo("dashboard")}
          style={backButtonStyle}
        >
          <ArrowLeft size={14} aria-hidden="true" /> Back to dashboard
        </button>
      </main>
    );
  }

  /**
   * @param {number} questionIndex
   * @param {number} optionIndex
   */
  function selectAnswer(questionIndex, optionIndex) {
    if (phase !== "active") return;
    setAnswers((prev) => {
      const next = [...prev];
      next[questionIndex] = optionIndex;
      return next;
    });
  }

  function submit() {
    setPhase("submitted");
    const correctCount = questions.reduce(
      (count, question, i) => (answers[i] === question.correct ? count + 1 : count),
      0,
    );
    const wasPerfect = correctCount === questions.length && questions.length > 0;
    recordQuizResult(wasPerfect);
    if (correctCount / questions.length >= PASS_THRESHOLD) {
      completeModule(tier.id, mod.id);
    }
  }

  const allAnswered = answers.length > 0 && answers.every((a) => a !== null);
  const correctCount =
    phase === "submitted"
      ? questions.reduce(
          (count, question, i) => (answers[i] === question.correct ? count + 1 : count),
          0,
        )
      : 0;
  const passed =
    phase === "submitted" &&
    questions.length > 0 &&
    correctCount / questions.length >= PASS_THRESHOLD;

  return (
    <main
      className="fade-in"
      style={{ maxWidth: 720, margin: "0 auto", padding: "32px 24px 64px" }}
    >
      <button type="button" className="nb" onClick={goBack} style={backButtonStyle}>
        <ArrowLeft size={14} aria-hidden="true" /> Back to module
      </button>

      <p
        style={{
          fontSize: 11,
          color: tier.color,
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          marginTop: 18,
        }}
      >
        Quiz · {tier.name}
      </p>
      <h1
        style={{
          fontFamily: FONT_FAMILY_DISPLAY,
          fontSize: 24,
          fontWeight: 500,
          color: COLORS.text,
          margin: "6px 0 24px",
        }}
      >
        {mod.title}
      </h1>

      {phase === "loading" ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            color: COLORS.muted2,
            padding: "40px 0",
          }}
        >
          <Loader2
            size={18}
            className="spin"
            style={{ animation: "spin 1s linear infinite" }}
            aria-hidden="true"
          />
          <span>Generating your quiz…</span>
        </div>
      ) : null}

      {phase !== "loading" ? (
        <>
          {loadError ? (
            <p
              role="status"
              style={{
                fontSize: 12,
                color: COLORS.muted,
                marginBottom: 16,
                padding: "8px 12px",
                borderRadius: 8,
                border: `1px solid ${COLORS.border}`,
              }}
            >
              Using the offline question bank for this quiz.
            </p>
          ) : null}

          {phase === "submitted" ? (
            <div
              style={{
                marginBottom: 24,
                padding: "16px 18px",
                borderRadius: 10,
                border: `1px solid ${(passed ? COLORS.green : COLORS.danger) + "55"}`,
                background: `${passed ? COLORS.green : COLORS.danger}1A`,
              }}
            >
              <p style={{ fontSize: 15, fontWeight: 600, color: COLORS.text }}>
                {correctCount} / {questions.length} correct
              </p>
              <p style={{ fontSize: 13, color: COLORS.muted2, marginTop: 4 }}>
                {passed
                  ? "Great work — this module is marked complete."
                  : `You need ${Math.ceil(questions.length * PASS_THRESHOLD)}/${questions.length} correct to complete this module. Review the explanations below and try again.`}
              </p>
            </div>
          ) : null}

          <ol style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 20 }}>
            {questions.map((question, qIndex) => (
              <li key={qIndex}>
                <p style={{ fontSize: 14, fontWeight: 600, color: COLORS.text, marginBottom: 10 }}>
                  {qIndex + 1}. {question.q}
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {question.options.map((option, oIndex) => {
                    const selected = answers[qIndex] === oIndex;
                    const isCorrect = oIndex === question.correct;
                    let borderColor = COLORS.border;
                    let bg = COLORS.surf;
                    if (phase === "submitted") {
                      if (isCorrect) {
                        borderColor = COLORS.green;
                        bg = `${COLORS.green}14`;
                      } else if (selected && !isCorrect) {
                        borderColor = COLORS.danger;
                        bg = `${COLORS.danger}14`;
                      }
                    } else if (selected) {
                      borderColor = COLORS.acc;
                      bg = `${COLORS.acc}14`;
                    }

                    return (
                      <button
                        key={oIndex}
                        type="button"
                        className="qopt"
                        disabled={phase === "submitted"}
                        onClick={() => selectAnswer(qIndex, oIndex)}
                        aria-pressed={selected}
                        style={{
                          textAlign: "left",
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                          padding: "10px 14px",
                          borderRadius: 8,
                          border: `1px solid ${borderColor}`,
                          background: bg,
                          color: COLORS.text,
                          fontSize: 13,
                          cursor: phase === "submitted" ? "default" : "pointer",
                        }}
                      >
                        {phase === "submitted" && isCorrect ? (
                          <Check size={14} color={COLORS.green} aria-hidden="true" />
                        ) : phase === "submitted" && selected ? (
                          <X size={14} color={COLORS.danger} aria-hidden="true" />
                        ) : (
                          <span
                            aria-hidden="true"
                            style={{
                              width: 14,
                              height: 14,
                              borderRadius: "50%",
                              border: `1px solid ${COLORS.muted}`,
                              background: selected ? COLORS.acc : "transparent",
                              flexShrink: 0,
                            }}
                          />
                        )}
                        <span>{option}</span>
                      </button>
                    );
                  })}
                </div>
                {phase === "submitted" ? (
                  <p style={{ fontSize: 12, color: COLORS.muted2, marginTop: 8, lineHeight: 1.6 }}>
                    {question.explanation}
                  </p>
                ) : null}
              </li>
            ))}
          </ol>

          <div style={{ marginTop: 28, display: "flex", gap: 12 }}>
            {phase === "active" ? (
              <button
                type="button"
                className="nb"
                onClick={submit}
                disabled={!allAnswered}
                style={primaryButtonStyle(!allAnswered)}
              >
                Submit answers
              </button>
            ) : (
              <>
                <button type="button" className="nb" onClick={goBack} style={secondaryButtonStyle}>
                  Back to module
                </button>
                {!passed ? (
                  <button
                    type="button"
                    className="nb"
                    onClick={() => {
                      setPhase("loading");
                      setAnswers(new Array(questions.length).fill(null));
                      generateQuiz({
                        tierId: tier.id,
                        moduleId: mod.id,
                        moduleTitle: mod.title,
                        moduleSummary: mod.summary,
                        industry: user.industry,
                      }).then((result) => {
                        setQuestions(result.questions);
                        setAnswers(new Array(result.questions.length).fill(null));
                        setPhase("active");
                        setLoadError(result.source === "fallback");
                      });
                    }}
                    style={primaryButtonStyle(false)}
                  >
                    <RefreshCw size={14} aria-hidden="true" /> Try again
                  </button>
                ) : null}
              </>
            )}
          </div>
        </>
      ) : null}
    </main>
  );
}

const backButtonStyle = {
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  padding: "6px 12px",
  borderRadius: 8,
  border: `1px solid ${COLORS.border}`,
  background: "transparent",
  color: COLORS.muted2,
  fontSize: 13,
  cursor: "pointer",
};

const secondaryButtonStyle = {
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  padding: "10px 18px",
  borderRadius: 8,
  border: `1px solid ${COLORS.borderH}`,
  background: COLORS.surf2,
  color: COLORS.text,
  fontSize: 13,
  fontWeight: 600,
  cursor: "pointer",
};

/** @param {boolean} disabled */
function primaryButtonStyle(disabled) {
  return {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    padding: "10px 18px",
    borderRadius: 8,
    border: `1px solid ${COLORS.acc}`,
    background: disabled ? COLORS.surf3 : COLORS.acc,
    color: disabled ? COLORS.muted : COLORS.bg,
    fontSize: 13,
    fontWeight: 600,
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.6 : 1,
  };
}
