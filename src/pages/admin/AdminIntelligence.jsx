import React, { useState } from "react";
import { COLORS, TYPE_SCALE, SHADOW, RADIUS } from "../../theme/tokens.js";
import { BUSINESS_UNITS, ORG_CAPABILITY_SCORES, ORG, DEMO_LEARNERS } from "../../data/enterpriseData.js";

function RadarChart({ scores }) {
  const dims = scores.length;
  const cx = 160, cy = 160, r = 110;
  const toXY = (i, val, maxVal = 100) => {
    const angle = (2 * Math.PI * i) / dims - Math.PI / 2;
    const pct = val / maxVal;
    return { x: cx + r * pct * Math.cos(angle), y: cy + r * pct * Math.sin(angle) };
  };

  const orgPts = scores.map((s, i) => toXY(i, s.orgScore));
  const benchPts = scores.map((s, i) => toXY(i, s.benchmark));

  const toPath = (pts) => pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ") + " Z";
  const gridLevels = [25, 50, 75, 100];

  return (
    <svg viewBox="0 0 320 320" style={{ width: "100%", maxWidth: 320 }}>
      {/* Grid circles */}
      {gridLevels.map((g) => (
        <polygon
          key={g}
          points={Array.from({ length: dims }, (_, i) => {
            const pt = toXY(i, g);
            return `${pt.x},${pt.y}`;
          }).join(" ")}
          fill="none"
          stroke={COLORS.border}
          strokeWidth={0.5}
        />
      ))}
      {/* Axis lines */}
      {scores.map((_, i) => {
        const pt = toXY(i, 100);
        return <line key={i} x1={cx} y1={cy} x2={pt.x} y2={pt.y} stroke={COLORS.border} strokeWidth={0.5} />;
      })}
      {/* Benchmark polygon */}
      <path d={toPath(benchPts)} fill="none" stroke="#1D5BD840" strokeWidth={1.5} strokeDasharray="4 3" />
      {/* Org polygon */}
      <path d={toPath(orgPts)} fill="#1D5BD820" stroke="#1D5BD8" strokeWidth={2} />
      {/* Labels */}
      {scores.map((s, i) => {
        const pt = toXY(i, 118);
        return (
          <text
            key={i}
            x={pt.x}
            y={pt.y}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={9}
            fill={COLORS.muted}
            fontFamily="Archivo, sans-serif"
          >
            {s.name.split(" ")[0]}
          </text>
        );
      })}
    </svg>
  );
}

export default function AdminIntelligence() {
  const [activeBU, setActiveBU] = useState("all");

  const buScores = activeBU === "all"
    ? ORG_CAPABILITY_SCORES
    : ORG_CAPABILITY_SCORES.map((s) => ({ ...s }));

  const topLearnersXp = [...DEMO_LEARNERS].sort((a, b) => b.xp - a.xp).slice(0, 8);
  const bottomReadiness = [...DEMO_LEARNERS].sort((a, b) => a.readiness - b.readiness).slice(0, 5);

  return (
    <div style={{ padding: "36px 48px", maxWidth: 1200 }}>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: COLORS.muted2, textTransform: "uppercase", letterSpacing: "0.08em" }}>
          Workforce Intelligence Dashboard
        </div>
        <h1 style={{ ...TYPE_SCALE.pageTitle, marginTop: 6 }}>Intelligence Overview</h1>
        <p style={{ fontSize: 13, color: COLORS.muted, marginTop: 8, maxWidth: 680 }}>
          Aggregate view of AI readiness, capability gaps, and engagement patterns across {ORG.name}. Use this as your primary diagnostic for workforce intelligence decisions.
        </p>
      </div>

      {/* Org-level capability radar + BU heat map */}
      <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: 24, marginBottom: 28 }}>
        {/* Radar */}
        <div
          style={{
            background: COLORS.surf,
            border: `1px solid ${COLORS.border}`,
            borderRadius: RADIUS.md,
            boxShadow: SHADOW.sm,
            padding: 24,
          }}
        >
          <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.text, marginBottom: 4 }}>
            Org Capability Profile
          </div>
          <div style={{ fontSize: 11, color: COLORS.muted2, marginBottom: 16 }}>
            Solid = Org · Dashed = Industry avg
          </div>
          <RadarChart scores={ORG_CAPABILITY_SCORES} />
          <div style={{ fontSize: 11, color: COLORS.muted2, marginTop: 12, textAlign: "center" }}>
            Avg readiness: <strong style={{ color: COLORS.acc }}>{ORG.overallReadiness}%</strong> vs benchmark <strong>53%</strong>
          </div>
        </div>

        {/* Capability dimension bars */}
        <div
          style={{
            background: COLORS.surf,
            border: `1px solid ${COLORS.border}`,
            borderRadius: RADIUS.md,
            boxShadow: SHADOW.sm,
            padding: 24,
          }}
        >
          <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.text, marginBottom: 16 }}>
            Capability Gap Analysis — All Dimensions
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {ORG_CAPABILITY_SCORES.map((s) => (
              <div key={s.dim}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: COLORS.text }}>{s.name}</span>
                  <div style={{ display: "flex", gap: 12 }}>
                    <span style={{ fontSize: 12, color: COLORS.muted2 }}>
                      Org: <strong style={{ color: COLORS.acc }}>{s.orgScore}%</strong>
                    </span>
                    <span style={{ fontSize: 12, color: COLORS.muted2 }}>
                      Benchmark: <strong style={{ color: COLORS.muted }}>{s.benchmark}%</strong>
                    </span>
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: 700,
                        color: s.gap < -15 ? COLORS.danger : s.gap < -8 ? "#E8743B" : COLORS.green,
                      }}
                    >
                      {s.gap}pp
                    </span>
                  </div>
                </div>
                <div style={{ position: "relative", height: 8, borderRadius: 999, background: COLORS.border, overflow: "visible" }}>
                  {/* Benchmark marker */}
                  <div
                    style={{
                      position: "absolute",
                      left: `${s.benchmark}%`,
                      top: -3,
                      width: 2,
                      height: 14,
                      background: COLORS.muted2,
                      borderRadius: 1,
                    }}
                  />
                  {/* Org bar */}
                  <div
                    style={{
                      height: "100%",
                      width: `${s.orgScore}%`,
                      borderRadius: 999,
                      background: s.gap < -15 ? "#D6454580" : s.gap < -8 ? "#E8743B80" : "#1D5BD8",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div style={{ fontSize: 11, color: COLORS.muted2, marginTop: 16 }}>
            ▏ = Industry benchmark · Largest gaps: AI Practitioner (−23pp) and AI Productivity (−21pp)
          </div>
        </div>
      </div>

      {/* BU performance table */}
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ ...TYPE_SCALE.sectionTitle, marginBottom: 14 }}>Business Unit Performance</h2>
        <div
          style={{
            background: COLORS.surf,
            border: `1px solid ${COLORS.border}`,
            borderRadius: RADIUS.md,
            boxShadow: SHADOW.sm,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr 1.2fr 1fr",
              padding: "10px 20px",
              background: COLORS.bg,
              borderBottom: `1px solid ${COLORS.border}`,
              fontSize: 11,
              fontWeight: 700,
              color: COLORS.muted2,
              textTransform: "uppercase",
              gap: 8,
            }}
          >
            <div>Unit</div>
            <div>Employees</div>
            <div>Learners</div>
            <div>Readiness</div>
            <div>Completion</div>
            <div>Top Gap</div>
            <div>Risk</div>
          </div>
          {BUSINESS_UNITS.map((bu) => {
            const riskColors = { critical: "#D64545", high: "#E8743B", medium: "#D4A72C", low: "#1F9D55" };
            const rc = riskColors[bu.riskLevel] || COLORS.muted2;
            return (
              <div
                key={bu.id}
                style={{
                  display: "grid",
                  gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr 1.2fr 1fr",
                  padding: "13px 20px",
                  borderBottom: `1px solid ${COLORS.border}`,
                  alignItems: "center",
                  gap: 8,
                  borderLeft: `3px solid ${bu.avgReadiness >= 60 ? COLORS.green : bu.avgReadiness >= 40 ? "#D4A72C" : COLORS.danger}`,
                }}
              >
                <div style={{ fontWeight: 700, fontSize: 13, color: COLORS.text }}>{bu.name}</div>
                <div style={{ fontSize: 13, color: COLORS.muted }}>{bu.employees.toLocaleString()}</div>
                <div style={{ fontSize: 13, color: COLORS.muted }}>{bu.learners}</div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: bu.avgReadiness >= 60 ? COLORS.green : bu.avgReadiness >= 40 ? "#D4A72C" : COLORS.danger }}>
                    {bu.avgReadiness}%
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 13, color: COLORS.muted }}>{bu.completionRate}%</div>
                </div>
                <div style={{ fontSize: 12, color: COLORS.muted2 }}>{bu.topGap}</div>
                <div>
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      color: rc,
                      background: rc + "15",
                      border: `1px solid ${rc}30`,
                      borderRadius: 999,
                      padding: "2px 8px",
                      textTransform: "capitalize",
                    }}
                  >
                    {bu.riskLevel}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Two col: top learners + intervention flags */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        {/* Top performers */}
        <div
          style={{
            background: COLORS.surf,
            border: `1px solid ${COLORS.border}`,
            borderRadius: RADIUS.md,
            boxShadow: SHADOW.sm,
            padding: 24,
          }}
        >
          <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.text, marginBottom: 16 }}>
            Top Performers by XP
          </div>
          {topLearnersXp.map((l, i) => (
            <div
              key={l.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                paddingBottom: 10,
                marginBottom: 10,
                borderBottom: i < topLearnersXp.length - 1 ? `1px solid ${COLORS.border}` : "none",
              }}
            >
              <div
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: "50%",
                  background: i < 3 ? COLORS.acc + "20" : COLORS.border,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 11,
                  fontWeight: 700,
                  color: i < 3 ? COLORS.acc : COLORS.muted2,
                  flexShrink: 0,
                }}
              >
                {i + 1}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: COLORS.text }}>{l.name}</div>
                <div style={{ fontSize: 11, color: COLORS.muted2 }}>{l.role} · {l.mods} modules</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 13, fontWeight: 800, color: "#7C5CBF" }}>{l.xp.toLocaleString()}</div>
                <div style={{ fontSize: 10, color: COLORS.muted2 }}>XP</div>
              </div>
            </div>
          ))}
        </div>

        {/* Lowest readiness — intervention candidates */}
        <div
          style={{
            background: COLORS.surf,
            border: `1px solid ${COLORS.border}`,
            borderRadius: RADIUS.md,
            boxShadow: SHADOW.sm,
            padding: 24,
          }}
        >
          <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.text, marginBottom: 4 }}>
            Lowest Readiness — Intervention Needed
          </div>
          <div style={{ fontSize: 12, color: COLORS.muted2, marginBottom: 16 }}>
            Learners most at risk of falling below threshold
          </div>
          {bottomReadiness.map((l, i) => (
            <div
              key={l.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                paddingBottom: 10,
                marginBottom: 10,
                borderBottom: i < bottomReadiness.length - 1 ? `1px solid ${COLORS.border}` : "none",
              }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: COLORS.text }}>{l.name}</div>
                <div style={{ fontSize: 11, color: COLORS.muted2 }}>Last active: {l.lastActive}</div>
              </div>
              <div style={{ width: 80 }}>
                <div
                  style={{
                    height: 5,
                    borderRadius: 999,
                    background: COLORS.border,
                    overflow: "hidden",
                    marginBottom: 3,
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${l.readiness}%`,
                      background: COLORS.danger,
                      borderRadius: 999,
                    }}
                  />
                </div>
                <div style={{ fontSize: 11, fontWeight: 700, color: COLORS.danger, textAlign: "right" }}>
                  {l.readiness}%
                </div>
              </div>
            </div>
          ))}
          <div style={{ fontSize: 12, color: COLORS.muted2, marginTop: 8, borderTop: `1px solid ${COLORS.border}`, paddingTop: 12 }}>
            {DEMO_LEARNERS.filter((l) => l.readiness < 20).length} learners below 20% readiness threshold
          </div>
        </div>
      </div>
    </div>
  );
}
