import React, { useState } from "react";
import { COLORS, TYPE_SCALE, SHADOW, RADIUS } from "../../theme/tokens.js";
import { INTEGRATIONS, ORG } from "../../data/enterpriseData.js";

const HEALTH_CONFIG = {
  healthy:   { color: COLORS.green,   label: "Healthy",   dot: "●" },
  degraded:  { color: "#D4A72C",      label: "Degraded",  dot: "◐" },
  offline:   { color: COLORS.danger,  label: "Offline",   dot: "○" },
};

const TYPE_ICONS = {
  "HRIS": "◈",
  "SSO / Identity": "⬡",
  "LMS Integration": "◎",
  "Content Provider": "◇",
  "ITSM / Helpdesk": "▣",
  "Analytics / BI": "⊟",
};

export default function AdminIntegrations() {
  const [selected, setSelected] = useState(null);

  const healthyCount = INTEGRATIONS.filter((i) => i.health === "healthy").length;
  const offlineCount = INTEGRATIONS.filter((i) => i.health === "offline").length;
  const degradedCount = INTEGRATIONS.filter((i) => i.health === "degraded").length;

  const detail = selected ? INTEGRATIONS.find((i) => i.id === selected) : null;

  return (
    <div style={{ padding: "36px 48px", maxWidth: 1100 }}>
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: COLORS.muted2, textTransform: "uppercase", letterSpacing: "0.08em" }}>
          Platform
        </div>
        <h1 style={{ ...TYPE_SCALE.pageTitle, marginTop: 6 }}>LXP Setup & Integrations</h1>
        <p style={{ fontSize: 13, color: COLORS.muted, marginTop: 8, maxWidth: 640 }}>
          Manage data connections between CapabilityOS and {ORG.name}'s enterprise systems. Integrations power learner sync, SSO, reporting pipelines, and content delivery.
        </p>
      </div>

      {/* Status overview */}
      <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 28 }}>
        {[
          { label: "Total Integrations", value: INTEGRATIONS.length, color: COLORS.text   },
          { label: "Healthy",            value: healthyCount,         color: COLORS.green  },
          { label: "Degraded",           value: degradedCount,        color: "#D4A72C"     },
          { label: "Offline",            value: offlineCount,         color: COLORS.danger },
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
              minWidth: 130,
            }}
          >
            <div style={{ fontSize: 26, fontWeight: 800, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 12, color: COLORS.muted2, marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: detail ? "1fr 360px" : "1fr", gap: 20 }}>
        {/* Integration cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 14, alignContent: "start" }}>
          {INTEGRATIONS.map((int) => {
            const hc = HEALTH_CONFIG[int.health] || HEALTH_CONFIG.offline;
            const typeIcon = TYPE_ICONS[int.type] || "◈";
            const isSelected = selected === int.id;

            return (
              <div
                key={int.id}
                onClick={() => setSelected(isSelected ? null : int.id)}
                style={{
                  background: COLORS.surf,
                  border: `1px solid ${isSelected ? COLORS.acc : COLORS.border}`,
                  borderTop: `3px solid ${hc.color}`,
                  borderRadius: RADIUS.md,
                  boxShadow: isSelected ? `0 0 0 2px ${COLORS.acc}20` : SHADOW.sm,
                  padding: "18px 20px",
                  cursor: "pointer",
                  transition: "border-color 120ms, box-shadow 120ms",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 18, color: COLORS.muted }}>{typeIcon}</span>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.text }}>{int.name}</div>
                      <div style={{ fontSize: 11, color: COLORS.muted2 }}>{int.type}</div>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <span style={{ fontSize: 10, color: hc.color }}>{hc.dot}</span>
                    <span style={{ fontSize: 11, fontWeight: 700, color: hc.color }}>{hc.label}</span>
                  </div>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <div>
                    <div style={{ fontSize: 10, fontWeight: 700, color: COLORS.muted2, textTransform: "uppercase" }}>Last Sync</div>
                    <div style={{ fontSize: 12, color: COLORS.text, marginTop: 2 }}>{int.lastSync}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: COLORS.muted2, textTransform: "uppercase" }}>Frequency</div>
                    <div style={{ fontSize: 12, color: COLORS.text, marginTop: 2 }}>{int.syncFreq}</div>
                  </div>
                </div>

                {int.issue && (
                  <div
                    style={{
                      marginTop: 10,
                      padding: "7px 10px",
                      background: (int.health === "offline" ? COLORS.danger : "#D4A72C") + "10",
                      borderRadius: RADIUS.sm,
                      fontSize: 11,
                      color: int.health === "offline" ? COLORS.danger : "#D4A72C",
                      lineHeight: 1.4,
                    }}
                  >
                    ⚠ {int.issue.slice(0, 80)}
                  </div>
                )}
              </div>
            );
          })}

          {/* Add integration card */}
          <div
            style={{
              background: "transparent",
              border: `2px dashed ${COLORS.border}`,
              borderRadius: RADIUS.md,
              padding: "18px 20px",
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              minHeight: 120,
            }}
          >
            <div style={{ fontSize: 20, color: COLORS.muted2 }}>+</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.muted2 }}>Add Integration</div>
            <div style={{ fontSize: 11, color: COLORS.muted2, textAlign: "center" }}>
              Connect HRIS, LMS, content provider, or BI tool
            </div>
          </div>
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
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: COLORS.text }}>{detail.name}</h3>
              <button
                onClick={() => setSelected(null)}
                style={{ background: "none", border: "none", cursor: "pointer", fontSize: 18, color: COLORS.muted2 }}
              >
                ×
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                { label: "Type",        value: detail.type        },
                { label: "Status",      value: HEALTH_CONFIG[detail.health]?.label || detail.health },
                { label: "Last Sync",   value: detail.lastSync    },
                { label: "Frequency",   value: detail.syncFreq    },
                { label: "Records",     value: detail.records ? detail.records.toLocaleString() : "—" },
              ].map((m) => (
                <div
                  key={m.label}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "10px 12px",
                    background: COLORS.bg,
                    borderRadius: RADIUS.sm,
                  }}
                >
                  <span style={{ fontSize: 12, fontWeight: 700, color: COLORS.muted2 }}>{m.label}</span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: COLORS.text }}>{m.value}</span>
                </div>
              ))}
            </div>

            {detail.issue && (
              <div
                style={{
                  marginTop: 14,
                  padding: "12px 14px",
                  background: (detail.health === "offline" ? COLORS.danger : "#D4A72C") + "08",
                  border: `1px solid ${(detail.health === "offline" ? COLORS.danger : "#D4A72C")}30`,
                  borderRadius: RADIUS.sm,
                }}
              >
                <div style={{ fontSize: 11, fontWeight: 700, color: detail.health === "offline" ? COLORS.danger : "#D4A72C", marginBottom: 4, textTransform: "uppercase" }}>
                  Active Issue
                </div>
                <div style={{ fontSize: 12, color: COLORS.muted, lineHeight: 1.5 }}>{detail.issue}</div>
              </div>
            )}

            <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
              <button
                style={{
                  flex: 1,
                  padding: "9px 14px",
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
                Configure
              </button>
              <button
                style={{
                  flex: 1,
                  padding: "9px 14px",
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
                Sync Now
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
