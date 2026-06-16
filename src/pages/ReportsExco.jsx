import React from "react";
import { COLORS, TYPE_SCALE, SHADOW, RADIUS } from "../theme/tokens.js";
import { useAppStore } from "../store/AppStore.jsx";
import { getLevelForXP } from "../data/levels.js";

export default function ReportsExco() {
  const { auth, xp, accessibleTiers, isModuleDone } = useAppStore();
  const level = getLevelForXP(xp);

  // Build per-tier stats
  const tierRows = accessibleTiers.map((tier) => {
    const done = tier.mods.filter((m) => isModuleDone(tier.id, m.id)).length;
    const total = tier.mods.length;
    const pct = total ? Math.round((done / total) * 100) : 0;
    return { tier, done, total, pct };
  });

  const totalDone = tierRows.reduce((s, r) => s + r.done, 0);
  const totalMods = tierRows.reduce((s, r) => s + r.total, 0);
  const overallPct = totalMods ? Math.round((totalDone / totalMods) * 100) : 0;

  return (
    <div>
      {/* Command-centre header */}
      <div style={{ background: COLORS.text, color: "#FFFFFF", padding: "32px 48px" }}>
        <div style={{ ...TYPE_SCALE.caption, color: COLORS.accSoft, textTransform: "uppercase" }}>
          Reports &amp; Exco
        </div>
        <h1 style={{ ...TYPE_SCALE.pageTitle, color: "#FFFFFF", marginTop: 6 }}>
          Capability Readiness Overview
        </h1>
        <p style={{ ...TYPE_SCALE.body, color: "rgba(255,255,255,0.65)", marginTop: 8, maxWidth: 600 }}>
          A consolidated view of AI capability development across learning tiers, for governance and executive review.
        </p>
        <div style={{ display: "flex", gap: 32, marginTop: 28, flexWrap: "wrap" }}>
          <HeaderStat label="Participant" value={auth?.name || "—"} />
          <HeaderStat label="Role" value={auth?.role || "—"} />
          <HeaderStat label="Level" value={level.name} />
          <HeaderStat label="Total XP" value={xp.toLocaleString()} />
          <HeaderStat label="Overall readiness" value={`${overallPct}%`} />
        </div>
      </div>

      {/* Report body */}
      <div style={{ padding: "40px 48px", maxWidth: 1000 }}>
        {/* Overall progress */}
        <div
          style={{
            background: COLORS.surf, border: `1px solid ${COLORS.border}`,
            borderRadius: RADIUS.md, boxShadow: SHADOW.sm,
            padding: 24, marginBottom: 32,
            display: "flex", alignItems: "center", gap: 28,
          }}
        >
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 40, fontWeight: 800, color: COLORS.acc }}>{overallPct}%</div>
            <div style={{ ...TYPE_SCALE.caption, color: COLORS.muted2 }}>Overall</div>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ ...TYPE_SCALE.cardTitle, marginBottom: 8 }}>Programme completion</div>
            <div style={{ height: 10, borderRadius: 999, background: COLORS.border, overflow: "hidden" }}>
              <div
                style={{
                  height: "100%", borderRadius: 999,
                  width: `${overallPct}%`,
                  background: overallPct >= 80 ? COLORS.green : COLORS.acc,
                  transition: "width .6s",
                }}
              />
            </div>
            <div style={{ ...TYPE_SCALE.caption, color: COLORS.muted2, marginTop: 6 }}>
              {totalDone} of {totalMods} modules completed across {tierRows.length} tiers
            </div>
          </div>
        </div>

        {/* Tier breakdown table */}
        <h2 style={{ ...TYPE_SCALE.sectionTitle, marginBottom: 14 }}>Readiness by tier</h2>
        <div
          style={{
            background: COLORS.surf, border: `1px solid ${COLORS.border}`,
            borderRadius: RADIUS.md, boxShadow: SHADOW.sm, overflow: "hidden",
          }}
        >
          {/* Table header */}
          <div
            style={{
              display: "flex", padding: "10px 20px",
              background: COLORS.bg, borderBottom: `1px solid ${COLORS.border}`,
              ...TYPE_SCALE.caption, color: COLORS.muted2, textTransform: "uppercase",
            }}
          >
            <div style={{ flex: 3 }}>Tier</div>
            <div style={{ flex: 1, textAlign: "center" }}>Modules</div>
            <div style={{ flex: 1, textAlign: "center" }}>Completed</div>
            <div style={{ flex: 2, textAlign: "right" }}>Readiness</div>
          </div>

          {tierRows.length === 0 && (
            <div style={{ padding: "24px 20px", ...TYPE_SCALE.body, color: COLORS.muted }}>
              No tiers available for your role.
            </div>
          )}

          {tierRows.map((row, i) => (
            <div
              key={row.tier.id}
              style={{
                display: "flex", alignItems: "center",
                padding: "16px 20px",
                borderBottom: i < tierRows.length - 1 ? `1px solid ${COLORS.border}` : "none",
              }}
            >
              <div style={{ flex: 3, display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 18 }}>{row.tier.icon}</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: COLORS.text }}>{row.tier.name}</div>
                  <div style={{ fontSize: 11, color: COLORS.muted2 }}>{row.tier.audience}</div>
                </div>
              </div>
              <div style={{ flex: 1, textAlign: "center", ...TYPE_SCALE.body, color: COLORS.muted }}>
                {row.total}
              </div>
              <div style={{ flex: 1, textAlign: "center", fontWeight: 700, color: COLORS.text }}>
                {row.done}
              </div>
              <div style={{ flex: 2, display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 12 }}>
                <div style={{ width: 120, height: 6, borderRadius: 999, background: COLORS.border, overflow: "hidden" }}>
                  <div
                    style={{
                      height: "100%", borderRadius: 999,
                      width: `${row.pct}%`,
                      background: row.pct >= 100 ? COLORS.green : row.tier.color,
                    }}
                  />
                </div>
                <span style={{ ...TYPE_SCALE.caption, color: COLORS.muted2, width: 36, textAlign: "right" }}>
                  {row.pct}%
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Per-tier module detail */}
        {tierRows.map((row) => (
          <div key={row.tier.id} style={{ marginTop: 36 }}>
            <h2 style={{ ...TYPE_SCALE.sectionTitle, marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
              <span>{row.tier.icon}</span> {row.tier.name} — Module Detail
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 10 }}>
              {row.tier.mods.map((mod) => {
                const done = isModuleDone(row.tier.id, mod.id);
                return (
                  <div
                    key={mod.id}
                    style={{
                      background: done ? COLORS.green + "08" : COLORS.surf,
                      border: `1px solid ${done ? COLORS.green + "40" : COLORS.border}`,
                      borderRadius: RADIUS.sm, padding: "12px 14px",
                    }}
                  >
                    <div style={{ fontSize: 18, marginBottom: 4 }}>{done ? "✓" : "○"}</div>
                    <div style={{ fontWeight: 700, fontSize: 13, color: COLORS.text, lineHeight: 1.3 }}>{mod.title}</div>
                    <div style={{ fontSize: 11, color: COLORS.muted2, marginTop: 4 }}>
                      {done ? "Complete" : mod.dur}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function HeaderStat({ label, value }) {
  return (
    <div>
      <div style={{ ...TYPE_SCALE.caption, color: "rgba(255,255,255,0.5)", textTransform: "uppercase" }}>
        {label}
      </div>
      <div style={{ ...TYPE_SCALE.cardTitle, color: "#FFFFFF", fontSize: 16, marginTop: 3 }}>
        {value}
      </div>
    </div>
  );
}
