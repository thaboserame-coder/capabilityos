import React, { useState } from "react";
import { COLORS, TYPE_SCALE, SHADOW, RADIUS, FONT_FAMILY_DISPLAY } from "../../theme/tokens.js";
import { EXCO_REPORTS, ORG, ORG_CAPABILITY_SCORES, BUSINESS_UNITS, RISKS, INTERVENTIONS } from "../../data/enterpriseData.js";

export default function AdminReports() {
  const [activeReport, setActiveReport] = useState(EXCO_REPORTS[0]);

  return (
    <div style={{ padding: "36px 48px", maxWidth: 1200 }}>
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: COLORS.muted2, textTransform: "uppercase", letterSpacing: "0.08em" }}>
          Governance
        </div>
        <h1 style={{ ...TYPE_SCALE.pageTitle, marginTop: 6 }}>Reports & Exco Packs</h1>
        <p style={{ fontSize: 13, color: COLORS.muted, marginTop: 8, maxWidth: 660 }}>
          Generate and review executive intelligence packs. Reports are synthesised from live platform data and are ready for board and ExCo presentation.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "240px 1fr", gap: 24 }}>
        {/* Report list */}
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: COLORS.muted2, textTransform: "uppercase", marginBottom: 10 }}>
            Available Reports
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {EXCO_REPORTS.map((r) => (
              <button
                key={r.id}
                onClick={() => setActiveReport(r)}
                style={{
                  textAlign: "left",
                  padding: "12px 14px",
                  borderRadius: RADIUS.md,
                  border: `1px solid ${activeReport.id === r.id ? COLORS.acc : COLORS.border}`,
                  background: activeReport.id === r.id ? COLORS.acc + "08" : COLORS.surf,
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                <div style={{ fontSize: 12, fontWeight: 700, color: COLORS.text }}>{r.title}</div>
                <div style={{ fontSize: 11, color: COLORS.muted2, marginTop: 3 }}>{r.period}</div>
                <div
                  style={{
                    display: "inline-block",
                    marginTop: 6,
                    fontSize: 10,
                    fontWeight: 700,
                    color: r.status === "final" ? COLORS.green : "#D4A72C",
                    background: (r.status === "final" ? COLORS.green : "#D4A72C") + "15",
                    borderRadius: 999,
                    padding: "2px 8px",
                    textTransform: "uppercase",
                  }}
                >
                  {r.status}
                </div>
              </button>
            ))}

            <button
              style={{
                textAlign: "left",
                padding: "12px 14px",
                borderRadius: RADIUS.md,
                border: `2px dashed ${COLORS.border}`,
                background: "transparent",
                cursor: "pointer",
                fontFamily: "inherit",
                marginTop: 4,
              }}
            >
              <div style={{ fontSize: 12, fontWeight: 600, color: COLORS.muted2 }}>+ Generate New Report</div>
              <div style={{ fontSize: 11, color: COLORS.muted2, marginTop: 2 }}>Based on current platform data</div>
            </button>
          </div>
        </div>

        {/* Report viewer */}
        {activeReport && (
          <div
            style={{
              background: COLORS.surf,
              border: `1px solid ${COLORS.border}`,
              borderRadius: RADIUS.md,
              boxShadow: SHADOW.sm,
              overflow: "hidden",
            }}
          >
            {/* Report header */}
            <div
              style={{
                background: `linear-gradient(135deg, ${COLORS.text} 0%, #1a3260 100%)`,
                padding: "28px 36px",
                borderBottom: `3px solid ${COLORS.acc}`,
              }}
            >
              <div style={{ fontSize: 10, fontWeight: 700, color: COLORS.accSoft, textTransform: "uppercase", letterSpacing: "0.1em" }}>
                {activeReport.type} · {activeReport.period}
              </div>
              <h2
                style={{
                  fontFamily: FONT_FAMILY_DISPLAY,
                  fontSize: 22,
                  fontWeight: 700,
                  color: "#FFFFFF",
                  marginTop: 8,
                  lineHeight: 1.2,
                }}
              >
                {activeReport.title}
              </h2>
              <div style={{ display: "flex", gap: 24, marginTop: 20, flexWrap: "wrap" }}>
                {[
                  { label: "Organisation",     value: ORG.name },
                  { label: "Sector",           value: ORG.sector },
                  { label: "Generated",        value: activeReport.generatedDate },
                  { label: "Status",           value: activeReport.status.toUpperCase() },
                ].map((k) => (
                  <div key={k.label}>
                    <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.06em" }}>{k.label}</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#FFFFFF", marginTop: 2 }}>{k.value}</div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ padding: "28px 36px" }}>
              {/* Snapshot metrics */}
              <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 28 }}>
                {[
                  { label: "Overall Readiness",   value: `${ORG.overallReadiness}%`,       sub: "Workforce % at target" },
                  { label: "Active Learners",      value: ORG.activeLearners.toLocaleString(), sub: "30-day active" },
                  { label: "Completion Rate",      value: `${ORG.avgCompletionRate}%`,      sub: "Enrolled learners" },
                  { label: "AI Maturity Score",    value: `${ORG.aiMaturityScore}/100`,     sub: "Platform benchmark" },
                ].map((m) => (
                  <div
                    key={m.label}
                    style={{
                      flex: 1,
                      minWidth: 120,
                      background: COLORS.bg,
                      borderRadius: RADIUS.md,
                      padding: "14px 16px",
                      border: `1px solid ${COLORS.border}`,
                    }}
                  >
                    <div style={{ fontSize: 22, fontWeight: 800, color: COLORS.acc }}>{m.value}</div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: COLORS.text, marginTop: 4 }}>{m.label}</div>
                    <div style={{ fontSize: 11, color: COLORS.muted2, marginTop: 2 }}>{m.sub}</div>
                  </div>
                ))}
              </div>

              {/* BU readiness table */}
              <div style={{ marginBottom: 28 }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: COLORS.text, marginBottom: 12 }}>Business Unit Readiness</h3>
                <div
                  style={{
                    background: COLORS.bg,
                    border: `1px solid ${COLORS.border}`,
                    borderRadius: RADIUS.sm,
                    overflow: "hidden",
                  }}
                >
                  {BUSINESS_UNITS.map((bu, i) => (
                    <div
                      key={bu.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        padding: "11px 16px",
                        borderBottom: i < BUSINESS_UNITS.length - 1 ? `1px solid ${COLORS.border}` : "none",
                        gap: 12,
                      }}
                    >
                      <div style={{ flex: 2, fontSize: 13, fontWeight: 600, color: COLORS.text }}>{bu.name}</div>
                      <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ flex: 1, height: 6, borderRadius: 999, background: COLORS.border, overflow: "hidden" }}>
                          <div
                            style={{
                              height: "100%",
                              width: `${bu.avgReadiness}%`,
                              background: bu.avgReadiness >= 60 ? COLORS.green : bu.avgReadiness >= 40 ? "#D4A72C" : "#E8743B",
                              borderRadius: 999,
                            }}
                          />
                        </div>
                        <span style={{ fontSize: 12, fontWeight: 700, color: COLORS.text, width: 32 }}>{bu.avgReadiness}%</span>
                      </div>
                      <div style={{ flex: 1, fontSize: 12, color: COLORS.muted2 }}>Gap: {bu.topGap}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Highlights */}
              <div style={{ marginBottom: 24 }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: COLORS.text, marginBottom: 12 }}>Key Highlights</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {activeReport.highlights.map((h, i) => (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        gap: 10,
                        padding: "10px 14px",
                        background: COLORS.bg,
                        borderRadius: RADIUS.sm,
                        borderLeft: `3px solid ${COLORS.acc}`,
                      }}
                    >
                      <span style={{ fontSize: 12, color: COLORS.acc, fontWeight: 700, flexShrink: 0 }}>{i + 1}</span>
                      <span style={{ fontSize: 13, color: COLORS.muted, lineHeight: 1.4 }}>{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommendations */}
              <div style={{ marginBottom: 24 }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: COLORS.text, marginBottom: 12 }}>Recommendations</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {activeReport.recommendations.map((rec, i) => (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        gap: 10,
                        padding: "10px 14px",
                        background: COLORS.green + "06",
                        borderRadius: RADIUS.sm,
                        border: `1px solid ${COLORS.green}20`,
                        borderLeft: `3px solid ${COLORS.green}`,
                      }}
                    >
                      <span style={{ fontSize: 12, color: COLORS.green, fontWeight: 700, flexShrink: 0 }}>→</span>
                      <span style={{ fontSize: 13, color: COLORS.muted, lineHeight: 1.4 }}>{rec}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div
                style={{
                  borderTop: `1px solid ${COLORS.border}`,
                  paddingTop: 16,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: 12,
                }}
              >
                <div style={{ fontSize: 12, color: COLORS.muted2 }}>
                  Generated by CapabilityOS · Digilytics Co · {activeReport.generatedDate}
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                  <button
                    style={{
                      padding: "8px 18px",
                      borderRadius: RADIUS.sm,
                      border: `1px solid ${COLORS.border}`,
                      background: COLORS.surf,
                      color: COLORS.muted,
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: "pointer",
                      fontFamily: "inherit",
                    }}
                  >
                    Export PDF
                  </button>
                  <button
                    style={{
                      padding: "8px 18px",
                      borderRadius: RADIUS.sm,
                      border: `1px solid ${COLORS.acc}`,
                      background: COLORS.acc,
                      color: "#FFFFFF",
                      fontSize: 12,
                      fontWeight: 700,
                      cursor: "pointer",
                      fontFamily: "inherit",
                    }}
                  >
                    Share with ExCo
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
