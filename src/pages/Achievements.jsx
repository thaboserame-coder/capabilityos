import React from "react";
import { COLORS, TYPE_SCALE, SHADOW, RADIUS } from "../theme/tokens.js";
import { useAppStore, BADGES, MISSIONS } from "../store/AppStore.jsx";

export default function Achievements() {
  const { xp, progress, perfectQuizzes, streak } = useAppStore();

  // BADGES: ok(progress, perfectQuizzes)
  const earnedBadges = BADGES.filter((b) => b.ok(progress, perfectQuizzes));
  const lockedBadges = BADGES.filter((b) => !b.ok(progress, perfectQuizzes));

  // MISSIONS: checkFn(progress, streak), totalSteps, xp (reward), desc
  const getMissionProgress = (m) => m.checkFn(progress, streak);
  const isMissionDone = (m) => getMissionProgress(m) >= m.totalSteps;
  const completedMissions = MISSIONS.filter(isMissionDone);
  const activeMissions = MISSIONS.filter((m) => !isMissionDone(m));

  return (
    <div style={{ padding: "40px 48px", maxWidth: 1000 }}>
      <div style={{ ...TYPE_SCALE.caption, color: COLORS.muted2, textTransform: "uppercase" }}>
        Progress & Recognition
      </div>
      <h1 style={{ ...TYPE_SCALE.pageTitle, marginTop: 6 }}>Achievements</h1>
      <p style={{ ...TYPE_SCALE.body, color: COLORS.muted, marginTop: 10, maxWidth: 580 }}>
        Track your milestones, complete missions, and earn badges as you advance through the AI capability framework.
      </p>

      {/* Stats row */}
      <div style={{ display: "flex", gap: 14, marginTop: 28, flexWrap: "wrap" }}>
        {[
          { label: "Badges Earned", value: earnedBadges.length, total: BADGES.length, color: "#E8B84B" },
          { label: "Missions Done", value: completedMissions.length, total: MISSIONS.length, color: COLORS.acc },
          { label: "Total XP", value: xp, total: null, color: "#7C3AED" },
        ].map((s) => (
          <div
            key={s.label}
            style={{
              background: COLORS.surf, border: `1px solid ${COLORS.border}`,
              borderRadius: RADIUS.md, boxShadow: SHADOW.sm,
              padding: "18px 22px", minWidth: 140,
            }}
          >
            <div style={{ fontSize: 26, fontWeight: 800, color: s.color }}>
              {s.value.toLocaleString()}{s.total ? <span style={{ fontSize: 16, color: COLORS.muted2, fontWeight: 500 }}>/{s.total}</span> : ""}
            </div>
            <div style={{ ...TYPE_SCALE.caption, color: COLORS.muted2, marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Badges */}
      <div style={{ marginTop: 36 }}>
        <h2 style={{ ...TYPE_SCALE.sectionTitle, marginBottom: 16 }}>Badges</h2>

        {earnedBadges.length > 0 && (
          <div style={{ marginBottom: 24 }}>
            <div style={{ ...TYPE_SCALE.caption, color: COLORS.green, fontWeight: 700, textTransform: "uppercase", marginBottom: 10 }}>
              ✓ Earned ({earnedBadges.length})
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 10 }}>
              {earnedBadges.map((b) => (
                <div
                  key={b.id}
                  style={{
                    display: "flex", gap: 12, alignItems: "flex-start",
                    background: "#FFFBEB", border: "1px solid #E8B84B40",
                    borderRadius: RADIUS.md, padding: "14px 16px",
                  }}
                >
                  <span style={{ fontSize: 28, lineHeight: 1 }}>{b.icon}</span>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14, color: COLORS.text }}>{b.name}</div>
                    <div style={{ fontSize: 12, color: COLORS.muted, marginTop: 3, lineHeight: 1.4 }}>{b.desc}</div>
                    <div style={{ fontSize: 11, color: COLORS.green, fontWeight: 700, marginTop: 5 }}>✓ Earned</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {lockedBadges.length > 0 && (
          <div>
            <div style={{ ...TYPE_SCALE.caption, color: COLORS.muted2, textTransform: "uppercase", marginBottom: 10 }}>
              Locked ({lockedBadges.length})
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 10 }}>
              {lockedBadges.map((b) => (
                <div
                  key={b.id}
                  style={{
                    display: "flex", gap: 12, alignItems: "flex-start",
                    background: COLORS.surf, opacity: 0.55,
                    border: `1px solid ${COLORS.border}`,
                    borderRadius: RADIUS.md, padding: "14px 16px",
                    filter: "grayscale(0.7)",
                  }}
                >
                  <span style={{ fontSize: 28, lineHeight: 1 }}>{b.icon}</span>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14, color: COLORS.text }}>{b.name}</div>
                    <div style={{ fontSize: 12, color: COLORS.muted, marginTop: 3, lineHeight: 1.4 }}>{b.desc}</div>
                    <div style={{ fontSize: 11, color: COLORS.muted2, marginTop: 5 }}>🔒 Keep learning to unlock</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Missions */}
      <div style={{ marginTop: 40 }}>
        <h2 style={{ ...TYPE_SCALE.sectionTitle, marginBottom: 16 }}>Missions</h2>

        {activeMissions.length > 0 && (
          <div style={{ marginBottom: 24 }}>
            <div style={{ ...TYPE_SCALE.caption, color: COLORS.acc, fontWeight: 700, textTransform: "uppercase", marginBottom: 10 }}>
              Active ({activeMissions.length})
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {activeMissions.map((m) => {
                const current = getMissionProgress(m);
                const pct = Math.min(100, Math.round((current / m.totalSteps) * 100));
                return (
                  <div
                    key={m.id}
                    style={{
                      background: COLORS.surf, border: `1px solid ${COLORS.border}`,
                      borderRadius: RADIUS.md, boxShadow: SHADOW.sm,
                      padding: "16px 18px",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <span style={{ fontSize: 24 }}>{m.icon}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, fontSize: 14, color: COLORS.text }}>{m.name}</div>
                        <div style={{ fontSize: 12, color: COLORS.muted, marginTop: 2 }}>{m.desc}</div>
                        <div style={{ marginTop: 10, height: 6, borderRadius: 999, background: COLORS.border, overflow: "hidden" }}>
                          <div
                            style={{
                              height: "100%", borderRadius: 999,
                              width: `${pct}%`, background: COLORS.acc,
                              transition: "width .6s",
                            }}
                          />
                        </div>
                        <div style={{ ...TYPE_SCALE.caption, color: COLORS.muted2, marginTop: 5 }}>
                          {current} / {m.totalSteps} · {pct}%
                        </div>
                      </div>
                      <div
                        style={{
                          flexShrink: 0, textAlign: "center",
                          background: "#FFF8E1", border: "1px solid #E8B84B40",
                          borderRadius: RADIUS.sm, padding: "6px 10px",
                        }}
                      >
                        <div style={{ fontSize: 15, fontWeight: 800, color: "#C17F24" }}>+{m.xp}</div>
                        <div style={{ fontSize: 10, color: COLORS.muted2 }}>XP</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {completedMissions.length > 0 && (
          <div>
            <div style={{ ...TYPE_SCALE.caption, color: COLORS.green, fontWeight: 700, textTransform: "uppercase", marginBottom: 10 }}>
              ✓ Completed ({completedMissions.length})
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {completedMissions.map((m) => (
                <div
                  key={m.id}
                  style={{
                    display: "flex", alignItems: "center", gap: 12,
                    background: COLORS.green + "08", border: `1px solid ${COLORS.green}30`,
                    borderRadius: RADIUS.md, padding: "12px 16px", opacity: 0.8,
                  }}
                >
                  <span style={{ fontSize: 20 }}>{m.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 14, color: COLORS.text }}>{m.name}</div>
                    <div style={{ fontSize: 12, color: COLORS.muted }}>{m.desc}</div>
                  </div>
                  <span style={{ fontSize: 13, color: COLORS.green, fontWeight: 700 }}>✓ Done</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
