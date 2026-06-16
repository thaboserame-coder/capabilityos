import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { COLORS, TYPE_SCALE, SHADOW, RADIUS } from "../theme/tokens.js";
import { useAppStore } from "../store/AppStore.jsx";
import { getModuleById } from "../data/tiers.js";

export default function ModuleReader() {
  const { tierId, moduleId } = useParams();
  const navigate = useNavigate();
  const { completeModule, isModuleDone, accessibleTiers } = useAppStore();

  const tier = accessibleTiers.find((t) => t.id === tierId);
  const mod = tier ? getModuleById(tierId, moduleId) : null;

  const [phase, setPhase] = useState("read"); // "read" | "quiz" | "result"
  const [answers, setAnswers] = useState({});
  const [xpEarned, setXpEarned] = useState(0);
  const [newBadges, setNewBadges] = useState([]);

  const alreadyDone = isModuleDone(tierId, moduleId);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [phase]);

  if (!tier || !mod) {
    return (
      <div style={{ padding: 48 }}>
        <p style={{ ...TYPE_SCALE.body, color: COLORS.muted }}>Module not found.</p>
        <button
          onClick={() => navigate("/learning")}
          style={{ marginTop: 16, padding: "10px 20px", borderRadius: RADIUS.sm, background: COLORS.acc, color: "#fff", border: "none", cursor: "pointer", fontFamily: "inherit", fontWeight: 600 }}
        >
          Back to Learning
        </button>
      </div>
    );
  }

  const quiz = mod.quiz || [];
  const correctCount = quiz.filter((q, i) => answers[i] === q.correct).length;
  const isPerfect = quiz.length > 0 && correctCount === quiz.length;

  function handleQuizSubmit() {
    const baseXP = 100;
    const quizXP = correctCount * 10;
    const bonusXP = isPerfect ? 50 : 0;
    const total = baseXP + quizXP + bonusXP;
    setXpEarned(total);
    const badges = completeModule(tierId, moduleId, total, isPerfect);
    setNewBadges(badges || []);
    setPhase("result");
  }

  const modIdx = tier.mods.findIndex((m) => m.id === moduleId);
  const nextMod = tier.mods[modIdx + 1] || null;

  // ── READ PHASE ──────────────────────────────────────────────────────
  if (phase === "read") {
    return (
      <div style={{ padding: "32px 48px", maxWidth: 860 }}>
        {/* Breadcrumb */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 24 }}>
          <button
            onClick={() => navigate("/learning")}
            style={{ background: "none", border: "none", cursor: "pointer", color: COLORS.muted, fontSize: 13, fontFamily: "inherit", padding: 0 }}
          >
            Learning
          </button>
          <span style={{ color: COLORS.muted2 }}>›</span>
          <span style={{ color: tier.color, fontSize: 13, fontWeight: 600 }}>{tier.name}</span>
          <span style={{ color: COLORS.muted2 }}>›</span>
          <span style={{ color: COLORS.text, fontSize: 13 }}>{mod.title}</span>
        </div>

        {/* Module header */}
        <div
          style={{
            background: COLORS.surf,
            border: `1px solid ${COLORS.border}`,
            borderLeft: `4px solid ${tier.color}`,
            borderRadius: RADIUS.lg, boxShadow: SHADOW.sm,
            padding: 24, marginBottom: 28,
          }}
        >
          <div style={{ ...TYPE_SCALE.caption, color: tier.color, textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.06em" }}>
            {tier.icon} {tier.name} · {mod.type}
          </div>
          <h1 style={{ ...TYPE_SCALE.pageTitle, marginTop: 8, marginBottom: 8 }}>{mod.title}</h1>
          <p style={{ ...TYPE_SCALE.body, color: COLORS.muted, margin: 0 }}>{mod.summary}</p>
          <div style={{ display: "flex", gap: 16, marginTop: 14 }}>
            <span style={{ ...TYPE_SCALE.caption, color: COLORS.muted2 }}>⏱ {mod.dur}</span>
            <span style={{ ...TYPE_SCALE.caption, color: COLORS.muted2 }}>📝 {quiz.length} quiz questions</span>
            <span style={{ ...TYPE_SCALE.caption, color: tier.color, fontWeight: 600 }}>
              ✦ Up to {100 + quiz.length * 10 + 50} XP
            </span>
            {alreadyDone && (
              <span style={{ ...TYPE_SCALE.caption, color: COLORS.green, fontWeight: 700 }}>✓ Completed</span>
            )}
          </div>
        </div>

        {/* HTML content */}
        <div
          className="module-content"
          style={{
            background: COLORS.surf,
            border: `1px solid ${COLORS.border}`,
            borderRadius: RADIUS.lg, boxShadow: SHADOW.sm,
            padding: "32px 36px",
            lineHeight: 1.75,
            color: COLORS.text,
            fontFamily: "'Archivo', sans-serif",
            fontSize: 15,
          }}
          dangerouslySetInnerHTML={{ __html: mod.html }}
        />

        {/* CTA */}
        <div style={{ display: "flex", gap: 12, marginTop: 28, alignItems: "center" }}>
          {quiz.length > 0 ? (
            <button
              onClick={() => setPhase("quiz")}
              style={{
                padding: "14px 28px", background: tier.color, color: "#fff",
                border: "none", borderRadius: RADIUS.md, fontWeight: 700, fontSize: 15,
                cursor: "pointer", fontFamily: "inherit",
                boxShadow: "0 3px 12px rgba(0,0,0,0.18)",
              }}
            >
              Take the Quiz →
            </button>
          ) : (
            <button
              onClick={() => { completeModule(tierId, moduleId, 100, false); navigate("/learning"); }}
              style={{
                padding: "14px 28px", background: tier.color, color: "#fff",
                border: "none", borderRadius: RADIUS.md, fontWeight: 700, fontSize: 15,
                cursor: "pointer", fontFamily: "inherit",
                boxShadow: "0 3px 12px rgba(0,0,0,0.18)",
              }}
            >
              Mark Complete (+100 XP) →
            </button>
          )}
          <button
            onClick={() => navigate("/learning")}
            style={{
              padding: "14px 20px", background: "none", color: COLORS.muted,
              border: `1px solid ${COLORS.border}`, borderRadius: RADIUS.md,
              fontWeight: 500, fontSize: 14, cursor: "pointer", fontFamily: "inherit",
            }}
          >
            Back to Learning
          </button>
        </div>
      </div>
    );
  }

  // ── QUIZ PHASE ───────────────────────────────────────────────────────
  if (phase === "quiz") {
    const allAnswered = quiz.every((_, i) => answers[i] !== undefined);
    return (
      <div style={{ padding: "32px 48px", maxWidth: 760 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 24 }}>
          <button
            onClick={() => setPhase("read")}
            style={{ background: "none", border: "none", cursor: "pointer", color: COLORS.muted, fontSize: 13, fontFamily: "inherit", padding: 0 }}
          >
            ← Back to module
          </button>
        </div>

        <div style={{ ...TYPE_SCALE.caption, color: tier.color, textTransform: "uppercase", fontWeight: 700 }}>
          Knowledge Check
        </div>
        <h2 style={{ ...TYPE_SCALE.sectionTitle, marginTop: 6, marginBottom: 6 }}>{mod.title}</h2>
        <p style={{ ...TYPE_SCALE.caption, color: COLORS.muted2 }}>
          {quiz.length} questions · Answer all to submit
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 20, marginTop: 24 }}>
          {quiz.map((q, qi) => (
            <div
              key={qi}
              style={{
                background: COLORS.surf,
                border: `1px solid ${COLORS.border}`,
                borderRadius: RADIUS.md, boxShadow: SHADOW.sm,
                padding: 20,
              }}
            >
              <p style={{ ...TYPE_SCALE.cardTitle, fontSize: 15, margin: "0 0 14px 0" }}>
                <span style={{ color: tier.color, fontWeight: 800, marginRight: 8 }}>Q{qi + 1}.</span>
                {q.q}
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {q.opts.map((opt, oi) => {
                  const selected = answers[qi] === oi;
                  return (
                    <button
                      key={oi}
                      onClick={() => setAnswers((a) => ({ ...a, [qi]: oi }))}
                      style={{
                        textAlign: "left", padding: "10px 14px",
                        borderRadius: RADIUS.sm, cursor: "pointer",
                        fontFamily: "inherit", fontSize: 14, lineHeight: 1.5,
                        border: `1.5px solid ${selected ? tier.color : COLORS.border}`,
                        background: selected ? tier.color + "14" : COLORS.surf2 || "#FAFAFA",
                        color: selected ? tier.color : COLORS.text,
                        fontWeight: selected ? 600 : 400,
                        transition: "all .12s",
                      }}
                    >
                      <span style={{ fontWeight: 700, marginRight: 8, opacity: 0.5 }}>
                        {String.fromCharCode(65 + oi)}.
                      </span>
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: 12, marginTop: 28 }}>
          <button
            onClick={handleQuizSubmit}
            disabled={!allAnswered}
            style={{
              padding: "14px 28px", fontWeight: 700, fontSize: 15,
              background: allAnswered ? tier.color : COLORS.border,
              color: allAnswered ? "#fff" : COLORS.muted2,
              border: "none", borderRadius: RADIUS.md, cursor: allAnswered ? "pointer" : "not-allowed",
              fontFamily: "inherit",
              boxShadow: allAnswered ? "0 3px 12px rgba(0,0,0,0.18)" : "none",
            }}
          >
            Submit Answers
          </button>
          <span style={{ ...TYPE_SCALE.caption, color: COLORS.muted2, alignSelf: "center" }}>
            {Object.keys(answers).length}/{quiz.length} answered
          </span>
        </div>
      </div>
    );
  }

  // ── RESULT PHASE ─────────────────────────────────────────────────────
  return (
    <div style={{ padding: "32px 48px", maxWidth: 700 }}>
      {/* Score card */}
      <div
        style={{
          background: COLORS.surf,
          border: `1px solid ${COLORS.border}`,
          borderRadius: RADIUS.lg, boxShadow: SHADOW.md,
          padding: 32, textAlign: "center",
        }}
      >
        <div style={{ fontSize: 56, lineHeight: 1 }}>
          {isPerfect ? "🏆" : correctCount >= quiz.length * 0.7 ? "🎯" : "📘"}
        </div>
        <h2 style={{ ...TYPE_SCALE.sectionTitle, marginTop: 12 }}>
          {isPerfect ? "Perfect Score!" : correctCount >= quiz.length * 0.7 ? "Well Done!" : "Module Complete"}
        </h2>
        <p style={{ ...TYPE_SCALE.body, color: COLORS.muted, margin: "8px 0 0" }}>
          You answered {correctCount} of {quiz.length} questions correctly.
        </p>

        {/* XP awarded */}
        <div
          style={{
            display: "inline-flex", alignItems: "center", gap: 10,
            background: tier.color + "12", border: `1px solid ${tier.color}40`,
            borderRadius: RADIUS.md, padding: "14px 24px", marginTop: 20,
          }}
        >
          <span style={{ fontSize: 24 }}>✦</span>
          <div style={{ textAlign: "left" }}>
            <div style={{ fontSize: 28, fontWeight: 800, color: tier.color }}>+{xpEarned} XP</div>
            <div style={{ ...TYPE_SCALE.caption, color: COLORS.muted2 }}>
              100 base · {correctCount * 10} quiz{isPerfect ? " · 50 perfect bonus" : ""}
            </div>
          </div>
        </div>

        {/* New badges */}
        {newBadges.length > 0 && (
          <div style={{ marginTop: 20 }}>
            <div style={{ ...TYPE_SCALE.caption, color: COLORS.muted2, marginBottom: 8 }}>🎖 Badge unlocked!</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" }}>
              {newBadges.map((b) => (
                <div
                  key={b.id}
                  style={{
                    display: "flex", alignItems: "center", gap: 8,
                    background: "#FFF8E1", border: "1px solid #E8B84B40",
                    borderRadius: RADIUS.sm, padding: "8px 14px",
                  }}
                >
                  <span style={{ fontSize: 20 }}>{b.icon}</span>
                  <div style={{ textAlign: "left" }}>
                    <div style={{ fontWeight: 700, fontSize: 13 }}>{b.name}</div>
                    <div style={{ fontSize: 11, color: COLORS.muted2 }}>{b.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Breakdown */}
        {quiz.length > 0 && (
          <div style={{ marginTop: 24, textAlign: "left" }}>
            <div style={{ ...TYPE_SCALE.caption, color: COLORS.muted2, marginBottom: 10 }}>Answer review:</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {quiz.map((q, qi) => {
                const userAns = answers[qi];
                const correct = userAns === q.correct;
                return (
                  <div
                    key={qi}
                    style={{
                      background: correct ? COLORS.green + "08" : "#FEF2F2",
                      border: `1px solid ${correct ? COLORS.green + "30" : "#FCA5A530"}`,
                      borderRadius: RADIUS.sm, padding: "10px 14px",
                    }}
                  >
                    <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.text }}>
                      {correct ? "✓" : "✗"} Q{qi + 1}: {q.q}
                    </div>
                    {!correct && (
                      <div style={{ fontSize: 12, color: COLORS.muted, marginTop: 4 }}>
                        You chose: {q.opts[userAns]} · Correct: {q.opts[q.correct]}
                      </div>
                    )}
                    <div style={{ fontSize: 12, color: COLORS.muted2, marginTop: 4, fontStyle: "italic" }}>
                      {q.exp}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Actions */}
        <div style={{ display: "flex", gap: 10, marginTop: 24, justifyContent: "center", flexWrap: "wrap" }}>
          {nextMod && (
            <button
              onClick={() => navigate(`/module/${tierId}/${nextMod.id}`)}
              style={{
                padding: "12px 22px", background: tier.color, color: "#fff",
                border: "none", borderRadius: RADIUS.md, fontWeight: 700, fontSize: 14,
                cursor: "pointer", fontFamily: "inherit",
                boxShadow: "0 2px 8px rgba(0,0,0,0.18)",
              }}
            >
              Next Module →
            </button>
          )}
          <button
            onClick={() => navigate("/learning")}
            style={{
              padding: "12px 22px", background: COLORS.surf, color: COLORS.muted,
              border: `1px solid ${COLORS.border}`, borderRadius: RADIUS.md,
              fontWeight: 500, fontSize: 14, cursor: "pointer", fontFamily: "inherit",
            }}
          >
            Back to Learning
          </button>
        </div>
      </div>
    </div>
  );
}
