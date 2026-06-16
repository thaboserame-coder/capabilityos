import React from "react";
import { COLORS, TYPE_SCALE, SHADOW, RADIUS } from "../theme/tokens.js";
import { useAppStore, DEMO_COHORT } from "../store/AppStore.jsx";
import { getLevelForXP } from "../data/levels.js";

// DEMO_COHORT fields: name, xp, level, mods, streak, last, ind

const MEDAL = ["🥇", "🥈", "🥉"];

export default function Leaderboard() {
  const { auth, xp } = useAppStore();

  // Merge current user into cohort, sort by XP
  const allEntries = [
    { name: auth?.name || "You", ind: auth?.industry || "", xp, isYou: true },
    ...DEMO_COHORT,
  ].sort((a, b) => b.xp - a.xp);

  const topXP = allEntries[0]?.xp || 1;

  // Podium: show 2nd, 1st, 3rd
  const podiumOrder = [allEntries[1], allEntries[0], allEntries[2]];

  return (
    <div style={{ padding: "40px 48px", maxWidth: 760 }}>
      <div style={{ ...TYPE_SCALE.caption, color: COLORS.muted2, textTransform: "uppercase" }}>
        Community
      </div>
      <h1 style={{ ...TYPE_SCALE.pageTitle, marginTop: 6 }}>Leaderboard</h1>
      <p style={{ ...TYPE_SCALE.body, color: COLORS.muted, marginTop: 10, maxWidth: 520 }}>
        See how you rank among your cohort. XP is earned by completing modules and achieving perfect quiz scores.
      </p>

      {/* Podium (top 3) */}
      <div style={{ display: "flex", gap: 12, marginTop: 28, alignItems: "flex-end", justifyContent: "center", marginBottom: 32 }}>
        {podiumOrder.map((entry, podiumIdx) => {
          if (!entry) return <div key={podiumIdx} style={{ width: 120 }} />;
          const realRank = allEntries.indexOf(entry);
          const heights = [80, 110, 60];
          const level = getLevelForXP(entry.xp);
          return (
            <div key={entry.name} style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 150 }}>
              <div style={{ fontSize: 28, marginBottom: 4 }}>{MEDAL[realRank] || ""}</div>
              <div
                style={{
                  width: "100%",
                  borderRadius: `${RADIUS.md} ${RADIUS.md} 0 0`,
                  background: entry.isYou ? COLORS.acc : COLORS.surf,
                  border: `1px solid ${entry.isYou ? COLORS.acc : COLORS.border}`,
                  borderBottom: "none",
                  height: heights[podiumIdx],
                  display: "flex", flexDirection: "column",
                  alignItems: "center", justifyContent: "flex-end",
                  paddingBottom: 10,
                }}
              >
                <div style={{ fontWeight: 800, fontSize: 18, color: entry.isYou ? "#fff" : COLORS.text }}>
                  {entry.xp.toLocaleString()}
                </div>
                <div style={{ fontSize: 10, color: entry.isYou ? "rgba(255,255,255,0.7)" : COLORS.muted2 }}>XP</div>
              </div>
              <div
                style={{
                  width: "100%",
                  background: entry.isYou ? COLORS.acc + "12" : COLORS.bg,
                  border: `1px solid ${entry.isYou ? COLORS.acc + "40" : COLORS.border}`,
                  borderRadius: `0 0 ${RADIUS.md} ${RADIUS.md}`,
                  padding: "8px 6px", textAlign: "center",
                }}
              >
                <div style={{ fontWeight: 700, fontSize: 13, color: entry.isYou ? COLORS.acc : COLORS.text }}>
                  {entry.name}
                </div>
                <div style={{ fontSize: 11, color: COLORS.muted2, marginTop: 2 }}>{level.name}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Full rankings table */}
      <div
        style={{
          background: COLORS.surf,
          border: `1px solid ${COLORS.border}`,
          borderRadius: RADIUS.lg, boxShadow: SHADOW.sm,
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "grid", gridTemplateColumns: "40px 1fr 130px 90px",
            padding: "10px 18px",
            borderBottom: `1px solid ${COLORS.border}`,
            background: COLORS.bg,
          }}
        >
          {["#", "Participant", "Level", "XP"].map((h) => (
            <div key={h} style={{ ...TYPE_SCALE.caption, fontWeight: 700, color: COLORS.muted2, fontSize: 11, textTransform: "uppercase" }}>
              {h}
            </div>
          ))}
        </div>

        {allEntries.map((entry, idx) => {
          const level = getLevelForXP(entry.xp);
          const barPct = Math.round((entry.xp / topXP) * 100);
          return (
            <div
              key={entry.name + idx}
              style={{
                display: "grid", gridTemplateColumns: "40px 1fr 130px 90px",
                padding: "12px 18px", alignItems: "center",
                borderBottom: idx < allEntries.length - 1 ? `1px solid ${COLORS.border}` : "none",
                background: entry.isYou ? COLORS.acc + "06" : "transparent",
              }}
            >
              {/* Rank */}
              <div style={{ fontWeight: 800, fontSize: 15, color: idx < 3 ? ["#E8B84B","#9CA3AF","#C17F24"][idx] : COLORS.muted2 }}>
                {idx < 3 ? MEDAL[idx] : idx + 1}
              </div>

              {/* Name + bar */}
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontWeight: entry.isYou ? 700 : 500, fontSize: 14, color: COLORS.text }}>
                    {entry.name}
                  </span>
                  {entry.isYou && (
                    <span style={{ fontSize: 10, fontWeight: 700, padding: "1px 6px", background: COLORS.acc, color: "#fff", borderRadius: 999 }}>
                      You
                    </span>
                  )}
                </div>
                {entry.ind && <div style={{ fontSize: 11, color: COLORS.muted2, marginTop: 1 }}>{entry.ind}</div>}
                <div style={{ marginTop: 5, height: 4, borderRadius: 999, background: COLORS.border, overflow: "hidden", maxWidth: 180 }}>
                  <div
                    style={{
                      height: "100%", borderRadius: 999,
                      width: `${barPct}%`,
                      background: entry.isYou ? COLORS.acc : COLORS.accSoft,
                    }}
                  />
                </div>
              </div>

              {/* Level */}
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: level.color }}>{level.name}</div>
                <div style={{ fontSize: 10, color: COLORS.muted2 }}>Level {level.n}</div>
              </div>

              {/* XP */}
              <div style={{ fontWeight: 700, fontSize: 15, color: entry.isYou ? COLORS.acc : COLORS.text }}>
                {entry.xp.toLocaleString()}
              </div>
            </div>
          );
        })}
      </div>

      <p style={{ ...TYPE_SCALE.caption, color: COLORS.muted2, marginTop: 14, textAlign: "center" }}>
        Demo cohort · Rankings update as you complete modules
      </p>
    </div>
  );
}
