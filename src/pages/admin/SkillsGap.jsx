import React, { useState } from "react";
import { COLORS, TYPE_SCALE, SHADOW, RADIUS } from "../../theme/tokens.js";
import { ORG_CAPABILITY_SCORES, ROLE_FAMILIES, BUSINESS_UNITS } from "../../data/enterpriseData.js";

export default function SkillsGap() {
  const [filterBU, setFilterBU] = useState("all");

  const roles = filterBU === "all"
    ? ROLE_FAMILIES
    : ROLE_FAMILIES.filter((r) => r.bu === filterBU);

  const sortedGaps = [...ORG_CAPABILITY_SCORES].sort((a, b) => a.gap - b.gap);

  return (
    <div style={{ padding: "36px 48px", maxWidth: 1200 }}>
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: COLORS.muted2, textTransform: "uppercase", letterSpacing: "0.08em" }}>
          Workforce Analytics
        </div>
        <h1 style={{ ...TYPE_SCALE.pageTitle, marginTop: 6 }}>Skills Gap Analysis</h1>
        <p style={{ fontSize: 13, color: COLORS.muted, marginTop: 8, maxWidth: 660 }}>
          Identify the critical skill deficiencies preventing the organisation from meeting its AI readiness targets. Prioritised by gap severity and strategic impact.
        </p>
      </div>

      {/* Top capability gaps — org level */}
      <div style={{ marginBottom: 32 }}>
        <h2 style={{ ...TYPE_SCALE.sectionTitle, marginBottom: 14 }}>Largest Capability Gaps — Organisation</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 14 }}>
          {sortedGaps.map((s) => {
            const severity = s.gap < -18 ? "critical" : s.gap < -12 ? "high" : s.gap < -6 ? "medium" : "low";
            const sColors = { critical: COLORS.danger, high: "#E8743B", medium: "#D4A72C", low: COLORS.green };
            const sc = sColors[severity];
            return (
              <div
                key={s.dim}
                style={{
                  background: COLORS.surf,
                  border: `1px solid ${COLORS.border}`,
                  borderLeft: `3px solid ${sc}`,
                  borderRadius: RADIUS.md,
                  boxShadow: SHADOW.sm,
                  padding: "18px 20px",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: COLORS.text }}>{s.name}</span>
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      color: sc,
                      background: sc + "15",
                      border: `1px solid ${sc}30`,
                      borderRadius: 999,
                      padding: "2px 8px",
                      textTransform: "capitalize",
                    }}
                  >
                    {severity}
                  </span>
                </div>
                <div style={{ display: "flex", gap: 20, marginBottom: 12 }}>
                  <div>
                    <div style={{ fontSize: 22, fontWeight: 800, color: COLORS.acc }}>{s.orgScore}%</div>
                    <div style={{ fontSize: 11, color: COLORS.muted2 }}>Org Score</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 22, fontWeight: 800, color: COLORS.muted }}>{s.benchmark}%</div>
                    <div style={{ fontSize: 11, color: COLORS.muted2 }}>Benchmark</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 22, fontWeight: 800, color: sc }}>{s.gap}pp</div>
                    <div style={{ fontSize: 11, color: COLORS.muted2 }}>Gap</div>
                  </div>
                </div>
                {/* Gap bar */}
                <div
                  style={{
                    position: "relative",
                    height: 8,
                    borderRadius: 999,
                    background: COLORS.border,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      height: "100%",
                      left: `${s.orgScore}%`,
                      width: `${Math.abs(s.gap)}%`,
                      background: sc + "60",
                      borderRadius: 999,
                    }}
                  />
                  <div
                    style={{
                      height: "100%",
                      width: `${s.orgScore}%`,
                      background: COLORS.acc,
                      borderRadius: 999,
                    }}
                  />
                </div>
                <div style={{ fontSize: 11, color: COLORS.muted2, marginTop: 6 }}>
                  Needs {Math.abs(s.gap)}pp improvement to reach benchmark
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Role family gaps */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <h2 style={{ ...TYPE_SCALE.sectionTitle }}>Skills Gap by Role Family</h2>
          <select
            value={filterBU}
            onChange={(e) => setFilterBU(e.target.value)}
            style={{
              padding: "8px 14px",
              border: `1px solid ${COLORS.border}`,
              borderRadius: RADIUS.sm,
              fontSize: 13,
              fontFamily: "inherit",
              color: COLORS.text,
              background: COLORS.surf,
              cursor: "pointer",
            }}
          >
            <option value="all">All Business Units</option>
            {BUSINESS_UNITS.map((b) => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {roles.map((rf) => {
            const severityColors = { critical: COLORS.danger, up: "#E8743B", stable: "#D4A72C", low: COLORS.green };
            const tc = rf.readinessGap >= 50 ? COLORS.danger : rf.readinessGap >= 30 ? "#E8743B" : "#D4A72C";
            const bu = BUSINESS_UNITS.find((b) => b.id === rf.bu);
            return (
              <div
                key={rf.id}
                style={{
                  background: COLORS.surf,
                  border: `1px solid ${COLORS.border}`,
                  borderRadius: RADIUS.md,
                  boxShadow: SHADOW.sm,
                  padding: "20px 24px",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14, flexWrap: "wrap", gap: 12 }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <h3 style={{ fontSize: 15, fontWeight: 700, color: COLORS.text }}>{rf.name}</h3>
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 700,
                          color: rf.disruptionScore >= 80 ? COLORS.danger : rf.disruptionScore >= 60 ? "#E8743B" : "#D4A72C",
                          background: (rf.disruptionScore >= 80 ? COLORS.danger : rf.disruptionScore >= 60 ? "#E8743B" : "#D4A72C") + "15",
                          border: `1px solid ${(rf.disruptionScore >= 80 ? COLORS.danger : rf.disruptionScore >= 60 ? "#E8743B" : "#D4A72C")}30`,
                          borderRadius: 999,
                          padding: "2px 8px",
                        }}
                      >
                        {rf.disruptionScore}% disruption risk
                      </span>
                    </div>
                    <div style={{ fontSize: 12, color: COLORS.muted2, marginTop: 3 }}>
                      {bu?.name} · {rf.headcount.toLocaleString()} employees · {rf.automationExposure} automation exposure
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 20, textAlign: "center" }}>
                    <div>
                      <div style={{ fontSize: 20, fontWeight: 800, color: COLORS.muted }}>{rf.currentReadiness}%</div>
                      <div style={{ fontSize: 10, color: COLORS.muted2 }}>Current</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 20, fontWeight: 800, color: COLORS.green }}>{rf.targetReadiness}%</div>
                      <div style={{ fontSize: 10, color: COLORS.muted2 }}>Target</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 20, fontWeight: 800, color: tc }}>{rf.readinessGap}pp</div>
                      <div style={{ fontSize: 10, color: COLORS.muted2 }}>Gap</div>
                    </div>
                  </div>
                </div>

                {/* Gap bar */}
                <div
                  style={{
                    position: "relative",
                    height: 10,
                    borderRadius: 999,
                    background: COLORS.border,
                    overflow: "hidden",
                    marginBottom: 10,
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${rf.currentReadiness}%`,
                      background: COLORS.acc,
                      borderRadius: 999,
                    }}
                  />
                  {/* Target marker */}
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

                {/* Critical skills */}
                <div style={{ marginTop: 8 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: COLORS.muted2, textTransform: "uppercase", marginBottom: 6 }}>
                    Critical Skill Gaps
                  </div>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {rf.criticalSkills.map((s) => (
                      <span
                        key={s}
                        style={{
                          fontSize: 11,
                          fontWeight: 600,
                          color: tc,
                          background: tc + "10",
                          border: `1px solid ${tc}25`,
                          borderRadius: 999,
                          padding: "3px 10px",
                        }}
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div style={{ marginTop: 10, fontSize: 12, color: COLORS.muted }}>
                  <strong>Recommended path:</strong> {rf.reskillPath}
                  {" · "}<span style={{ color: COLORS.muted2 }}>Target horizon: {rf.timeHorizon}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
