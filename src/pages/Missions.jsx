import React, { useState } from "react";
import { Link } from "react-router-dom";
import { COLORS, TYPE_SCALE, SHADOW, RADIUS } from "../theme/tokens.js";
import { useAppStore, MISSIONS } from "../store/AppStore.jsx";

const TYPE_COLORS = {
  Sprint:       { bg: "#E0F2FE", text: "#0369A1", border: "#BAE6FD" },
  Mastery:      { bg: "#F3E8FF", text: "#7C3AED", border: "#DDD6FE" },
  Championship: { bg: "#FEF9C3", text: "#A16207", border: "#FDE68A" },
  Daily:        { bg: "#FEF3C7", text: "#D97706", border: "#FDE68A" },
};

const TYPE_DESCRIPTIONS = {
  Sprint:       "Short-burst missions completed in one sitting",
  Mastery:      "Deeper missions requiring multiple sessions",
  Championship: "Pinnacle missions for top performers",
  Daily:        "Consistency-based missions reset weekly",
};

export default function Missions() {
  const { progress, streak, xp } = useAppStore();
  const [expanded, setExpanded] = useState(null);

  const missionsWithProgress = MISSIONS.map((m) => {
    const steps = m.checkFn(progress, streak);
    const pct = Math.min(Math.round((steps / m.totalSteps) * 100), 100);
    const done = pct >= 100;
    return { ...m, steps, pct, done };
  });

  const completed = missionsWithProgress.filter((m) => m.done).length;
  const totalXP = missionsWithProgress.filter((m) => m.done).reduce((s, m) => s + m.xp, 0);

  return (
    <div style={{ padding: "40px 48px", maxWidth: 800 }}>
      <div style={{ ...TYPE_SCALE.caption, color: COLORS.muted2, textTransform: "uppercase" }}>
        Quests & Challenges
      </div>
      <h1 style={{ ...TYPE_SCALE.pageTitle, marginTop: 6 }}>Missions</h1>
      <p style={{ ...TYPE_SCALE.body, color: COLORS.muted, marginTop: 10, maxWidth: 580 }}>
        Complete missions to earn bonus XP and unlock recognition. Missions track your progress automatically as you learn.
      </p>

      {/* Summary bar */}
      <div style={{ display: "flex", gap: 16, marginTop: 24, flexWrap: "wrap" }}>
        {[
          { label: "Missions Completed", value: `${completed} / ${MISSIONS.length}`, color: COLORS.acc },
          { label: "Mission XP Earned", value: totalXP.toLocaleString() + " XP", color: COLORS.green },
          { label: "Current Streak", value: `${streak} day${streak !== 1 ? "s" : ""}`, color: COLORS.fire },
        ].map((s) => (
          <div
            key={s.label}
            style={{
              flex: "1 1 160px",
              background: COLORS.surf,
              border: `1px solid ${COLORS.border}`,
              borderRadius: RADIUS.md,
              padding: "14px 18px",
              boxShadow: SHADOW.sm,
            }}
          >
            <div style={{ fontSize: 22, fontWeight: 900, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 11, fontWeight: 600, color: COLORS.muted2, textTransform: "uppercase", marginTop: 2 }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* Mission cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 28 }}>
        {missionsWithProgress.map((m) => {
          const typeStyle = TYPE_COLORS[m.type] || TYPE_COLORS.Sprint;
          const isExpanded = expanded === m.id;

          return (
            <div
              key={m.id}
              style={{
                background: COLORS.surf,
                border: `1px solid ${m.done ? COLORS.green + "40" : COLORS.border}`,
                borderRadius: RADIUS.lg,
                boxShadow: SHADOW.sm,
                overflow: "hidden",
                opacity: 1,
              }}
            >
              {/* Main row */}
              <div
                style={{
                  padding: "18px 20px",
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  cursor: "pointer",
                }}
                onClick={() => setExpanded(isExpanded ? null : m.id)}
              >
                {/* Icon */}
                <div
                  style={{
                    width: 48, height: 48,
                    borderRadius: RADIUS.md,
                    background: m.done ? COLORS.green + "15" : typeStyle.bg,
                    border: `1.5px solid ${m.done ? COLORS.green + "40" : typeStyle.border}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 22, flexShrink: 0,
                  }}
                >
                  {m.done ? "✅" : m.icon}
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 4 }}>
                    <span style={{ fontWeight: 700, fontSize: 15, color: COLORS.text }}>{m.name}</span>
                    <span
                      style={{
                        fontSize: 11, fontWeight: 700,
                        padding: "2px 8px",
                        borderRadius: 999,
                        background: typeStyle.bg,
                        color: typeStyle.text,
                        border: `1px solid ${typeStyle.border}`,
                        textTransform: "uppercase",
                        letterSpacing: "0.04em",
                      }}
                    >
                      {m.type}
                    </span>
                    {m.done && (
                      <span
                        style={{
                          fontSize: 11, fontWeight: 700,
                          padding: "2px 8px", borderRadius: 999,
                          background: COLORS.green + "15",
                          color: COLORS.green,
                          border: `1px solid ${COLORS.green}30`,
                        }}
                      >
                        Complete
                      </span>
                    )}
                  </div>
                  <p style={{ fontSize: 13, color: COLORS.muted, margin: 0, marginBottom: 10, lineHeight: 1.5 }}>
                    {m.desc}
                  </p>

                  {/* Progress bar */}
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                      <span style={{ fontSize: 11, color: COLORS.muted2, fontWeight: 600 }}>
                        {m.steps} / {m.totalSteps} steps
                      </span>
                      <span style={{ fontSize: 11, color: COLORS.muted2 }}>{m.pct}%</span>
                    </div>
                    <div style={{ height: 6, borderRadius: 999, background: COLORS.border, overflow: "hidden", maxWidth: 320 }}>
                      <div
                        style={{
                          height: "100%",
                          width: `${m.pct}%`,
                          background: m.done ? COLORS.green : COLORS.acc,
                          borderRadius: 999,
                          transition: "width 500ms ease",
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* XP + expand */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8, flexShrink: 0 }}>
                  <div
                    style={{
                      background: COLORS.gold + "15",
                      border: `1px solid ${COLORS.gold}30`,
                      borderRadius: 999,
                      padding: "4px 12px",
                      fontSize: 13, fontWeight: 800, color: COLORS.gold,
                    }}
                  >
                    +{m.xp} XP
                  </div>
                  <span style={{ fontSize: 11, color: COLORS.muted2 }}>{isExpanded ? "▲ Less" : "▼ Details"}</span>
                </div>
              </div>

              {/* Expanded details */}
              {isExpanded && (
                <div
                  style={{
                    borderTop: `1px solid ${COLORS.border}`,
                    padding: "16px 20px",
                    background: COLORS.bg,
                  }}
                >
                  <div style={{ fontSize: 12, color: COLORS.muted2, marginBottom: 10, fontStyle: "italic" }}>
                    {TYPE_DESCRIPTIONS[m.type]}
                  </div>

                  {/* Step-by-step checklist */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {Array.from({ length: m.totalSteps }).map((_, i) => {
                      const isDone = i < m.steps;
                      return (
                        <div
                          key={i}
                          style={{
                            display: "flex", alignItems: "center", gap: 10,
                            padding: "8px 12px",
                            borderRadius: RADIUS.sm,
                            background: isDone ? COLORS.green + "08" : COLORS.surf,
                            border: `1px solid ${isDone ? COLORS.green + "25" : COLORS.border}`,
                          }}
                        >
                          <div
                            style={{
                              width: 18, height: 18, borderRadius: "50%",
                              background: isDone ? COLORS.green : COLORS.border,
                              display: "flex", alignItems: "center", justifyContent: "center",
                              flexShrink: 0,
                            }}
                          >
                            {isDone && <span style={{ color: "#fff", fontSize: 10, fontWeight: 900 }}>✓</span>}
                          </div>
                          <span style={{ fontSize: 13, color: isDone ? COLORS.text : COLORS.muted2, fontWeight: isDone ? 600 : 400 }}>
                            Step {i + 1}{isDone ? " — Completed" : " — In progress"}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* CTA if not done */}
                  {!m.done && (
                    <div style={{ marginTop: 14 }}>
                      {m.id === "m1" || m.id === "m4" ? (
                        <Link
                          to="/learning"
                          style={{
                            display: "inline-block",
                            padding: "8px 18px",
                            background: COLORS.acc,
                            color: "#fff",
                            borderRadius: RADIUS.sm,
                            textDecoration: "none",
                            fontSize: 13,
                            fontWeight: 700,
                          }}
                        >
                          Continue Learning →
                        </Link>
                      ) : m.id === "m2" ? (
                        <Link
                          to="/use-cases"
                          style={{
                            display: "inline-block",
                            padding: "8px 18px",
                            background: COLORS.acc,
                            color: "#fff",
                            borderRadius: RADIUS.sm,
                            textDecoration: "none",
                            fontSize: 13,
                            fontWeight: 700,
                          }}
                        >
                          Explore Use Cases →
                        </Link>
                      ) : m.id === "m3" ? (
                        <Link
                          to="/prompt-lab"
                          style={{
                            display: "inline-block",
                            padding: "8px 18px",
                            background: COLORS.acc,
                            color: "#fff",
                            borderRadius: RADIUS.sm,
                            textDecoration: "none",
                            fontSize: 13,
                            fontWeight: 700,
                          }}
                        >
                          Go to Prompt Lab →
                        </Link>
                      ) : (
                        <span style={{ fontSize: 12, color: COLORS.muted2 }}>
                          Keep logging in daily to build your streak.
                        </span>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {completed === MISSIONS.length && (
        <div
          style={{
            marginTop: 32, padding: "20px 24px",
            background: COLORS.gold + "10",
            border: `1.5px solid ${COLORS.gold}40`,
            borderRadius: RADIUS.lg,
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: 32 }}>🏆</div>
          <div style={{ fontWeight: 800, fontSize: 18, color: COLORS.text, marginTop: 8 }}>All Missions Complete!</div>
          <div style={{ fontSize: 14, color: COLORS.muted, marginTop: 4 }}>
            You've earned {totalXP.toLocaleString()} mission XP. An exceptional achievement.
          </div>
        </div>
      )}
    </div>
  );
}
