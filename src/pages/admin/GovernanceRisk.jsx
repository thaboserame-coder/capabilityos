import React, { useState } from "react";
import { COLORS, TYPE_SCALE, SHADOW, RADIUS } from "../../theme/tokens.js";
import { RISKS, getRiskColor, getRiskLabel } from "../../data/enterpriseData.js";

const STATUS_CONFIG = {
  open:       { color: COLORS.danger, label: "Open"       },
  mitigating: { color: "#E8743B",     label: "Mitigating" },
  monitoring: { color: "#D4A72C",     label: "Monitoring" },
  resolved:   { color: COLORS.green,  label: "Resolved"   },
};

export default function GovernanceRisk() {
  const [selected, setSelected] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterCat, setFilterCat] = useState("all");

  const categories = [...new Set(RISKS.map((r) => r.category))];

  const filtered = RISKS.filter((r) => {
    if (filterStatus !== "all" && r.status !== filterStatus) return false;
    if (filterCat !== "all" && r.category !== filterCat) return false;
    return true;
  }).sort((a, b) => b.riskScore - a.riskScore);

  const detail = selected ? RISKS.find((r) => r.id === selected) : null;

  const criticalCount = RISKS.filter((r) => r.riskScore >= 80).length;
  const openCount = RISKS.filter((r) => r.status === "open").length;
  const avgScore = Math.round(RISKS.reduce((s, r) => s + r.riskScore, 0) / RISKS.length);

  return (
    <div style={{ padding: "36px 48px", maxWidth: 1200 }}>
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: COLORS.muted2, textTransform: "uppercase", letterSpacing: "0.08em" }}>
          Governance
        </div>
        <h1 style={{ ...TYPE_SCALE.pageTitle, marginTop: 6 }}>Governance & Risk</h1>
        <p style={{ fontSize: 13, color: COLORS.muted, marginTop: 8, maxWidth: 660 }}>
          AI transformation risk register. Covers regulatory compliance, workforce readiness, data privacy, model risk, and adoption governance risks across {ORG_NAME}.
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 28 }}>
        {[
          { label: "Total Risks",       value: RISKS.length,   color: COLORS.text     },
          { label: "Critical (80+)",    value: criticalCount,  color: COLORS.danger   },
          { label: "Open / Unmitigated", value: openCount,     color: "#E8743B"       },
          { label: "Avg Risk Score",    value: avgScore,       color: "#D4A72C"       },
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

      {/* Filters */}
      <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          style={{
            padding: "8px 14px",
            border: `1px solid ${COLORS.border}`,
            borderRadius: RADIUS.sm,
            fontSize: 12,
            fontFamily: "inherit",
            color: COLORS.text,
            background: COLORS.surf,
            cursor: "pointer",
          }}
        >
          <option value="all">All Statuses</option>
          {Object.entries(STATUS_CONFIG).map(([k, v]) => (
            <option key={k} value={k}>{v.label}</option>
          ))}
        </select>
        <select
          value={filterCat}
          onChange={(e) => setFilterCat(e.target.value)}
          style={{
            padding: "8px 14px",
            border: `1px solid ${COLORS.border}`,
            borderRadius: RADIUS.sm,
            fontSize: 12,
            fontFamily: "inherit",
            color: COLORS.text,
            background: COLORS.surf,
            cursor: "pointer",
          }}
        >
          <option value="all">All Categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: detail ? "1fr 380px" : "1fr", gap: 20 }}>
        {/* Risk list */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {filtered.map((r) => {
            const rc = getRiskColor(r.riskScore);
            const sc = STATUS_CONFIG[r.status] || STATUS_CONFIG.open;
            const isSelected = selected === r.id;
            return (
              <div
                key={r.id}
                onClick={() => setSelected(isSelected ? null : r.id)}
                style={{
                  background: COLORS.surf,
                  border: `1px solid ${isSelected ? COLORS.acc : COLORS.border}`,
                  borderLeft: `4px solid ${rc}`,
                  borderRadius: RADIUS.md,
                  boxShadow: isSelected ? `0 0 0 2px ${COLORS.acc}20` : SHADOW.sm,
                  padding: "16px 20px",
                  cursor: "pointer",
                  transition: "all 120ms",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                      <span style={{ fontSize: 14, fontWeight: 700, color: COLORS.text }}>{r.title}</span>
                    </div>
                    <div style={{ fontSize: 12, color: COLORS.muted2 }}>
                      {r.category} · Owner: {r.owner.split("—")[0].trim()} · Due: {r.dueDate}
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0, marginLeft: 12 }}>
                    <div
                      style={{
                        textAlign: "center",
                        background: rc + "15",
                        border: `1px solid ${rc}30`,
                        borderRadius: RADIUS.sm,
                        padding: "6px 10px",
                        minWidth: 50,
                      }}
                    >
                      <div style={{ fontSize: 18, fontWeight: 800, color: rc, lineHeight: 1 }}>{r.riskScore}</div>
                      <div style={{ fontSize: 9, fontWeight: 700, color: rc }}>{getRiskLabel(r.riskScore)}</div>
                    </div>
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        color: sc.color,
                        background: sc.color + "15",
                        border: `1px solid ${sc.color}30`,
                        borderRadius: 999,
                        padding: "3px 10px",
                      }}
                    >
                      {sc.label}
                    </span>
                  </div>
                </div>
                <div style={{ fontSize: 12, color: COLORS.muted, lineHeight: 1.4 }}>
                  {r.description.slice(0, 140)}…
                </div>
              </div>
            );
          })}
        </div>

        {/* Detail panel */}
        {detail && (
          <div
            style={{
              background: COLORS.surf,
              border: `1px solid ${COLORS.border}`,
              borderRadius: RADIUS.md,
              boxShadow: SHADOW.sm,
              padding: 24,
              position: "sticky",
              top: 20,
              height: "fit-content",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: getRiskColor(detail.riskScore),
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                }}
              >
                {detail.category} Risk
              </div>
              <button
                onClick={() => setSelected(null)}
                style={{ background: "none", border: "none", cursor: "pointer", fontSize: 16, color: COLORS.muted2 }}
              >
                ×
              </button>
            </div>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: COLORS.text, marginBottom: 14, lineHeight: 1.3 }}>
              {detail.title}
            </h3>

            {/* Score & indicators */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 16 }}>
              {[
                { label: "Risk Score",   value: detail.riskScore,           color: getRiskColor(detail.riskScore) },
                { label: "Likelihood",   value: detail.likelihood,          color: COLORS.muted },
                { label: "Impact",       value: detail.impact,              color: COLORS.muted },
              ].map((m) => (
                <div
                  key={m.label}
                  style={{
                    background: COLORS.bg,
                    borderRadius: RADIUS.sm,
                    padding: "10px 12px",
                    textAlign: "center",
                  }}
                >
                  <div style={{ fontSize: 18, fontWeight: 800, color: m.color }}>{m.value}</div>
                  <div style={{ fontSize: 10, fontWeight: 700, color: COLORS.muted2, marginTop: 3, textTransform: "uppercase" }}>{m.label}</div>
                </div>
              ))}
            </div>

            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: COLORS.muted2, textTransform: "uppercase", marginBottom: 6 }}>Description</div>
              <div style={{ fontSize: 12, color: COLORS.muted, lineHeight: 1.6 }}>{detail.description}</div>
            </div>

            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: COLORS.muted2, textTransform: "uppercase", marginBottom: 6 }}>Owner</div>
              <div style={{ fontSize: 12, fontWeight: 600, color: COLORS.text }}>{detail.owner}</div>
            </div>

            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: COLORS.muted2, textTransform: "uppercase", marginBottom: 6 }}>Mitigation Plan</div>
              <div style={{ fontSize: 12, color: COLORS.muted, lineHeight: 1.6 }}>{detail.mitigation}</div>
            </div>

            <div
              style={{
                background: COLORS.bg,
                borderRadius: RADIUS.sm,
                padding: "10px 14px",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, color: COLORS.muted2, textTransform: "uppercase" }}>Due Date</div>
                <div style={{ fontSize: 12, fontWeight: 600, color: COLORS.text, marginTop: 2 }}>{detail.dueDate}</div>
              </div>
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, color: COLORS.muted2, textTransform: "uppercase" }}>Last Reviewed</div>
                <div style={{ fontSize: 12, fontWeight: 600, color: COLORS.text, marginTop: 2 }}>{detail.lastReviewed}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const ORG_NAME = "Momentum Group";
