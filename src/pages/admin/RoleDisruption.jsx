import React, { useState } from "react";
import { COLORS, TYPE_SCALE, SHADOW, RADIUS } from "../../theme/tokens.js";
import { ROLE_FAMILIES, BUSINESS_UNITS } from "../../data/enterpriseData.js";

const TREND_ICONS = { critical: "▲▲", up: "▲", stable: "→", low: "▽" };
const TREND_COLORS = { critical: COLORS.danger, up: "#E8743B", stable: "#D4A72C", low: COLORS.green };

function DisruptionBar({ score }) {
  const color =
    score >= 80 ? COLORS.danger :
    score >= 60 ? "#E8743B" :
    score >= 40 ? "#D4A72C" :
    COLORS.green;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <div style={{ flex: 1, height: 8, borderRadius: 999, background: COLORS.border, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${score}%`, background: color, borderRadius: 999 }} />
      </div>
      <span style={{ fontSize: 13, fontWeight: 800, color, width: 32, textAlign: "right" }}>{score}</span>
    </div>
  );
}

export default function RoleDisruption() {
  const [sort, setSort] = useState("disruption"); // disruption | headcount | gap
  const [filterHorizon, setFilterHorizon] = useState("all");

  const sorted = [...ROLE_FAMILIES]
    .filter((r) => {
      if (filterHorizon === "urgent") return r.timeHorizon.includes("6") || r.timeHorizon.includes("12");
      if (filterHorizon === "near") return r.timeHorizon.includes("18") || r.timeHorizon.includes("24");
      if (filterHorizon === "mid") return r.timeHorizon.includes("36") || r.timeHorizon.includes("48");
      return true;
    })
    .sort((a, b) => {
      if (sort === "disruption") return b.disruptionScore - a.disruptionScore;
      if (sort === "headcount") return b.headcount - a.headcount;
      if (sort === "gap") return b.readinessGap - a.readinessGap;
      return 0;
    });

  const totalAtRisk = ROLE_FAMILIES.filter((r) => r.disruptionScore >= 60).reduce((s, r) => s + r.headcount, 0);
  const criticalRoles = ROLE_FAMILIES.filter((r) => r.disruptionScore >= 80);

  return (
    <div style={{ padding: "36px 48px", maxWidth: 1200 }}>
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: COLORS.muted2, textTransform: "uppercase", letterSpacing: "0.08em" }}>
          Workforce Analytics
        </div>
        <h1 style={{ ...TYPE_SCALE.pageTitle, marginTop: 6 }}>Role Disruption Forecast</h1>
        <p style={{ fontSize: 13, color: COLORS.muted, marginTop: 8, maxWidth: 660 }}>
          AI and automation exposure assessment by role family. Prioritised by disruption probability, time horizon, and readiness gap to help you sequence workforce interventions.
        </p>
      </div>

      {/* Summary stats */}
      <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 28 }}>
        {[
          { label: "Role Families Assessed",   value: ROLE_FAMILIES.length,   color: COLORS.text },
          { label: "Critical Disruption Risk",  value: criticalRoles.length,   color: COLORS.danger },
          { label: "Employees at High+ Risk",   value: totalAtRisk.toLocaleString(), color: "#E8743B" },
          { label: "Avg Disruption Score",      value: Math.round(ROLE_FAMILIES.reduce((s, r) => s + r.disruptionScore, 0) / ROLE_FAMILIES.length), color: "#D4A72C" },
        ].map((s) => (
          <div
            key={s.label}
            style={{
              background: COLORS.surf,
              border: `1px solid ${COLORS.border}`,
              borderRadius: RADIUS.md,
              boxShadow: SHADOW.sm,
              padding: "18px 22px",
              flex: 1,
              minWidth: 140,
            }}
          >
            <div style={{ fontSize: 26, fontWeight: 800, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 12, color: COLORS.muted2, marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Critical alert */}
      {criticalRoles.length > 0 && (
        <div
          style={{
            background: COLORS.danger + "08",
            border: `1px solid ${COLORS.danger}30`,
            borderRadius: RADIUS.md,
            padding: "16px 20px",
            marginBottom: 24,
            display: "flex",
            gap: 14,
            alignItems: "flex-start",
          }}
        >
          <span style={{ fontSize: 18, color: COLORS.danger }}>⚠</span>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.danger }}>
              {criticalRoles.length} role {criticalRoles.length > 1 ? "families" : "family"} at critical disruption risk (80+)
            </div>
            <div style={{ fontSize: 12, color: COLORS.muted, marginTop: 4 }}>
              {criticalRoles.map((r) => r.name).join(" · ")} — require immediate intervention planning
            </div>
          </div>
        </div>
      )}

      {/* Controls */}
      <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ display: "flex", gap: 8 }}>
          {[
            { id: "disruption", label: "Disruption Score" },
            { id: "headcount", label: "Headcount" },
            { id: "gap", label: "Readiness Gap" },
          ].map((s) => (
            <button
              key={s.id}
              onClick={() => setSort(s.id)}
              style={{
                padding: "7px 14px",
                borderRadius: RADIUS.sm,
                border: `1px solid ${sort === s.id ? COLORS.acc : COLORS.border}`,
                background: sort === s.id ? COLORS.acc + "12" : COLORS.surf,
                color: sort === s.id ? COLORS.acc : COLORS.muted,
                fontSize: 12,
                fontWeight: sort === s.id ? 700 : 500,
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              Sort: {s.label}
            </button>
          ))}
        </div>
        <select
          value={filterHorizon}
          onChange={(e) => setFilterHorizon(e.target.value)}
          style={{
            padding: "7px 14px",
            border: `1px solid ${COLORS.border}`,
            borderRadius: RADIUS.sm,
            fontSize: 12,
            fontFamily: "inherit",
            color: COLORS.text,
            background: COLORS.surf,
            cursor: "pointer",
          }}
        >
          <option value="all">All Horizons</option>
          <option value="urgent">Urgent (&lt;18 months)</option>
          <option value="near">Near-term (18–30 months)</option>
          <option value="mid">Mid-term (30–60 months)</option>
        </select>
      </div>

      {/* Role cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {sorted.map((rf) => {
          const bu = BUSINESS_UNITS.find((b) => b.id === rf.bu);
          const tc = rf.disruptionScore >= 80 ? COLORS.danger : rf.disruptionScore >= 60 ? "#E8743B" : "#D4A72C";
          const trendColor = TREND_COLORS[rf.trend] || COLORS.muted2;
          return (
            <div
              key={rf.id}
              style={{
                background: COLORS.surf,
                border: `1px solid ${COLORS.border}`,
                borderLeft: `4px solid ${tc}`,
                borderRadius: RADIUS.md,
                boxShadow: SHADOW.sm,
                padding: "20px 24px",
              }}
            >
              <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 20, alignItems: "start" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                    <h3 style={{ fontSize: 15, fontWeight: 700, color: COLORS.text }}>{rf.name}</h3>
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        color: trendColor,
                      }}
                    >
                      {TREND_ICONS[rf.trend]} {rf.trend === "critical" ? "CRITICAL" : rf.trend === "up" ? "Rising" : rf.trend === "stable" ? "Stable" : "Decreasing"}
                    </span>
                  </div>
                  <div style={{ fontSize: 12, color: COLORS.muted2, marginBottom: 14 }}>
                    {bu?.name} · {rf.headcount.toLocaleString()} employees · Horizon: {rf.timeHorizon} · {rf.automationExposure} automation
                  </div>

                  {/* Disruption bar */}
                  <div style={{ marginBottom: 14 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: COLORS.muted2, textTransform: "uppercase", marginBottom: 6 }}>
                      Disruption Risk Score
                    </div>
                    <DisruptionBar score={rf.disruptionScore} />
                  </div>

                  {/* Readiness gap */}
                  <div style={{ marginBottom: 14 }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontSize: 11,
                        fontWeight: 700,
                        color: COLORS.muted2,
                        textTransform: "uppercase",
                        marginBottom: 6,
                      }}
                    >
                      <span>Readiness Gap to Target</span>
                      <span style={{ color: tc }}>{rf.readinessGap}pp to close</span>
                    </div>
                    <div style={{ position: "relative", height: 8, borderRadius: 999, background: COLORS.border, overflow: "hidden" }}>
                      <div
                        style={{
                          height: "100%",
                          width: `${rf.currentReadiness}%`,
                          background: COLORS.acc,
                          borderRadius: 999,
                        }}
                      />
                      <div
                        style={{
                          position: "absolute",
                          top: 0,
                          left: `${rf.targetReadiness}%`,
                          width: 2,
                          height: "100%",
                          background: COLORS.green,
                        }}
                      />
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: COLORS.muted2, marginTop: 4 }}>
                      <span>Current: {rf.currentReadiness}%</span>
                      <span style={{ color: COLORS.green }}>Target: {rf.targetReadiness}%</span>
                    </div>
                  </div>

                  {/* Critical skills */}
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {rf.criticalSkills.map((s) => (
                      <span
                        key={s}
                        style={{
                          fontSize: 11,
                          fontWeight: 600,
                          color: COLORS.muted,
                          background: COLORS.border,
                          borderRadius: 999,
                          padding: "3px 10px",
                        }}
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Right column: numbers */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 14,
                    alignItems: "flex-end",
                    minWidth: 140,
                  }}
                >
                  <div
                    style={{
                      textAlign: "center",
                      background: tc + "10",
                      border: `1px solid ${tc}30`,
                      borderRadius: RADIUS.md,
                      padding: "12px 18px",
                    }}
                  >
                    <div style={{ fontSize: 32, fontWeight: 900, color: tc, lineHeight: 1 }}>
                      {rf.disruptionScore}
                    </div>
                    <div style={{ fontSize: 10, fontWeight: 700, color: tc, marginTop: 4 }}>DISRUPTION SCORE</div>
                  </div>
                  <div style={{ fontSize: 12, color: COLORS.muted, textAlign: "right" }}>
                    <strong style={{ color: COLORS.text, display: "block", fontSize: 14 }}>
                      {rf.headcount.toLocaleString()}
                    </strong>
                    employees impacted
                  </div>
                  <div style={{ fontSize: 12, color: COLORS.muted2, textAlign: "right" }}>
                    {rf.reskillPath}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
