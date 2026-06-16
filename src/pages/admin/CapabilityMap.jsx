import React, { useState } from "react";
import { COLORS, TYPE_SCALE, SHADOW, RADIUS } from "../../theme/tokens.js";
import { BUSINESS_UNITS, ORG_CAPABILITY_SCORES } from "../../data/enterpriseData.js";

const DIMS = ORG_CAPABILITY_SCORES;
const BUS = BUSINESS_UNITS;

// Simulated BU × dimension heatmap scores (rough heuristic from readiness data)
function buDimScore(bu, dim) {
  const base = bu.avgReadiness;
  const dimIdx = parseInt(dim.replace("d", ""), 10) - 1;
  const offset = [8, 5, 0, -3, -8, -14, -18, -22][dimIdx] || 0;
  const buFactor = bu.riskLevel === "critical" ? -8 : bu.riskLevel === "high" ? -4 : bu.riskLevel === "low" ? 6 : 0;
  return Math.max(5, Math.min(95, base + offset + buFactor));
}

function heatColor(score) {
  if (score >= 70) return { bg: "#1F9D5520", text: "#1F9D55", border: "#1F9D5540" };
  if (score >= 55) return { bg: "#1D5BD820", text: "#1D5BD8", border: "#1D5BD840" };
  if (score >= 40) return { bg: "#D4A72C20", text: "#D4A72C", border: "#D4A72C40" };
  if (score >= 25) return { bg: "#E8743B20", text: "#E8743B", border: "#E8743B40" };
  return { bg: "#D6454520", text: "#D64545", border: "#D6454540" };
}

export default function CapabilityMap() {
  const [highlight, setHighlight] = useState(null);
  const [view, setView] = useState("heatmap"); // heatmap | bars

  return (
    <div style={{ padding: "36px 48px", maxWidth: 1200 }}>
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: COLORS.muted2, textTransform: "uppercase", letterSpacing: "0.08em" }}>
          Workforce Analytics
        </div>
        <h1 style={{ ...TYPE_SCALE.pageTitle, marginTop: 6 }}>Capability Map</h1>
        <p style={{ fontSize: 13, color: COLORS.muted, marginTop: 8, maxWidth: 660 }}>
          Cross-dimensional capability heat map across all business units. Identify where the organisation is strong, where it is critical, and where to prioritise intervention.
        </p>
      </div>

      {/* View toggle */}
      <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
        {[{ id: "heatmap", label: "Heat Map" }, { id: "bars", label: "Bar Comparison" }].map((v) => (
          <button
            key={v.id}
            onClick={() => setView(v.id)}
            style={{
              padding: "8px 16px",
              borderRadius: RADIUS.sm,
              border: `1px solid ${view === v.id ? COLORS.acc : COLORS.border}`,
              background: view === v.id ? COLORS.acc : COLORS.surf,
              color: view === v.id ? "#FFFFFF" : COLORS.muted,
              fontSize: 13,
              fontWeight: view === v.id ? 700 : 500,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            {v.label}
          </button>
        ))}
      </div>

      {view === "heatmap" && (
        <div
          style={{
            background: COLORS.surf,
            border: `1px solid ${COLORS.border}`,
            borderRadius: RADIUS.md,
            boxShadow: SHADOW.sm,
            overflow: "auto",
          }}
        >
          {/* Column headers — dimensions */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: `180px repeat(${DIMS.length}, 1fr)`,
              borderBottom: `1px solid ${COLORS.border}`,
              position: "sticky",
              top: 0,
              background: COLORS.bg,
              zIndex: 1,
            }}
          >
            <div style={{ padding: "12px 16px", fontSize: 11, color: COLORS.muted2 }}>Business Unit</div>
            {DIMS.map((d) => (
              <div
                key={d.dim}
                style={{
                  padding: "10px 8px",
                  fontSize: 10,
                  fontWeight: 700,
                  color: highlight === d.dim ? COLORS.acc : COLORS.muted2,
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                  textAlign: "center",
                  cursor: "pointer",
                  borderBottom: highlight === d.dim ? `2px solid ${COLORS.acc}` : "2px solid transparent",
                  transition: "color 120ms",
                }}
                onClick={() => setHighlight(highlight === d.dim ? null : d.dim)}
              >
                {d.name.split(" ").map((w) => w[0]).join("")}
                <div style={{ fontSize: 9, fontWeight: 400, color: COLORS.muted2, marginTop: 2 }}>
                  {d.name.split(" ")[0]}
                </div>
              </div>
            ))}
          </div>

          {/* BU rows */}
          {BUS.map((bu) => (
            <div
              key={bu.id}
              style={{
                display: "grid",
                gridTemplateColumns: `180px repeat(${DIMS.length}, 1fr)`,
                borderBottom: `1px solid ${COLORS.border}`,
              }}
            >
              <div
                style={{
                  padding: "12px 16px",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  borderRight: `1px solid ${COLORS.border}`,
                }}
              >
                <span style={{ fontSize: 12, color: COLORS.muted }}>{bu.icon}</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: COLORS.text }}>{bu.name.split(" ")[0]}</span>
              </div>
              {DIMS.map((d) => {
                const score = buDimScore(bu, d.dim);
                const c = heatColor(score);
                const isHighlighted = highlight === d.dim;
                return (
                  <div
                    key={d.dim}
                    title={`${bu.name} / ${d.name}: ${score}%`}
                    style={{
                      padding: "10px 6px",
                      textAlign: "center",
                      background: isHighlighted ? c.bg + "cc" : c.bg,
                      borderRight: `1px solid ${COLORS.border}`,
                      transition: "background 120ms",
                      cursor: "default",
                    }}
                  >
                    <div
                      style={{
                        fontSize: 12,
                        fontWeight: 800,
                        color: c.text,
                      }}
                    >
                      {score}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}

          {/* Legend */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              padding: "12px 16px",
              background: COLORS.bg,
              borderTop: `1px solid ${COLORS.border}`,
              fontSize: 11,
              color: COLORS.muted2,
              flexWrap: "wrap",
            }}
          >
            <span>Scale 0–100 · </span>
            {[
              { range: "70+", color: "#1F9D55", label: "Strong" },
              { range: "55–69", color: "#1D5BD8", label: "Developing" },
              { range: "40–54", color: "#D4A72C", label: "Below target" },
              { range: "25–39", color: "#E8743B", label: "At risk" },
              { range: "<25", color: "#D64545", label: "Critical" },
            ].map((l) => (
              <div key={l.range} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <div style={{ width: 10, height: 10, borderRadius: 2, background: l.color + "30", border: `1px solid ${l.color}60` }} />
                <span>{l.range}: {l.label}</span>
              </div>
            ))}
            <span style={{ marginLeft: "auto" }}>Click column header to highlight</span>
          </div>
        </div>
      )}

      {view === "bars" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {DIMS.map((d) => (
            <div
              key={d.dim}
              style={{
                background: COLORS.surf,
                border: `1px solid ${COLORS.border}`,
                borderRadius: RADIUS.md,
                boxShadow: SHADOW.sm,
                padding: "20px 24px",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
                <div>
                  <span style={{ fontSize: 14, fontWeight: 700, color: COLORS.text }}>{d.name}</span>
                  <span style={{ fontSize: 12, color: COLORS.muted2, marginLeft: 10 }}>
                    Org avg: <strong style={{ color: COLORS.acc }}>{d.orgScore}%</strong>
                    {" · "}Benchmark: <strong style={{ color: COLORS.muted }}>{d.benchmark}%</strong>
                    {" · "}Gap: <strong style={{ color: d.gap < -15 ? COLORS.danger : "#E8743B" }}>{d.gap}pp</strong>
                  </span>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {BUS.map((bu) => {
                  const score = buDimScore(bu, d.dim);
                  const c = heatColor(score);
                  return (
                    <div key={bu.id} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ width: 160, fontSize: 12, color: COLORS.muted, textAlign: "right", flexShrink: 0 }}>
                        {bu.name}
                      </div>
                      <div style={{ flex: 1, height: 18, borderRadius: 4, background: COLORS.border, overflow: "hidden", position: "relative" }}>
                        <div
                          style={{
                            height: "100%",
                            width: `${score}%`,
                            background: c.bg,
                            borderRight: `2px solid ${c.text}`,
                            transition: "width 600ms ease",
                          }}
                        />
                        {/* Benchmark line */}
                        <div
                          style={{
                            position: "absolute",
                            top: 0,
                            left: `${d.benchmark}%`,
                            width: 2,
                            height: "100%",
                            background: COLORS.muted2,
                          }}
                        />
                      </div>
                      <div style={{ width: 36, fontSize: 12, fontWeight: 700, color: c.text, flexShrink: 0 }}>
                        {score}%
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
