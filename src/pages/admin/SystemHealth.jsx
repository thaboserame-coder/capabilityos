import React from "react";
import { COLORS, TYPE_SCALE, SHADOW, RADIUS } from "../../theme/tokens.js";
import { SYSTEM_METRICS, INTEGRATIONS } from "../../data/enterpriseData.js";

const HEALTH_CONFIG = {
  healthy:   { color: COLORS.green, label: "Healthy",   icon: "●" },
  degraded:  { color: "#D4A72C",   label: "Degraded",  icon: "◐" },
  offline:   { color: COLORS.danger, label: "Offline",  icon: "○" },
};

function Metric({ label, value, sub, color }) {
  return (
    <div
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
      <div style={{ fontSize: 26, fontWeight: 800, color: color || COLORS.acc, lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.text, marginTop: 6 }}>{label}</div>
      {sub && <div style={{ fontSize: 11, color: COLORS.muted2, marginTop: 3 }}>{sub}</div>}
    </div>
  );
}

export default function SystemHealth() {
  const storageUsedPct = Math.round((SYSTEM_METRICS.storageUsedGb / SYSTEM_METRICS.storageTotalGb) * 100);

  return (
    <div style={{ padding: "36px 48px", maxWidth: 1100 }}>
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: COLORS.muted2, textTransform: "uppercase", letterSpacing: "0.08em" }}>
          Governance
        </div>
        <h1 style={{ ...TYPE_SCALE.pageTitle, marginTop: 6 }}>System Health & Diagnostics</h1>
        <p style={{ fontSize: 13, color: COLORS.muted, marginTop: 8, maxWidth: 620 }}>
          Platform performance, integration status, and operational health for CapabilityOS v{SYSTEM_METRICS.deploymentVersion}. Last deployment: {SYSTEM_METRICS.lastDeployment}.
        </p>
      </div>

      {/* Critical alert */}
      {SYSTEM_METRICS.criticalAlerts > 0 && (
        <div
          style={{
            background: "#D4A72C08",
            border: "1px solid #D4A72C40",
            borderRadius: RADIUS.md,
            padding: "14px 18px",
            marginBottom: 24,
            display: "flex",
            gap: 12,
            alignItems: "flex-start",
          }}
        >
          <span style={{ fontSize: 18, color: "#D4A72C" }}>⚠</span>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#D4A72C" }}>
              {SYSTEM_METRICS.criticalAlerts} active alert — SharePoint sync degraded
            </div>
            <div style={{ fontSize: 12, color: COLORS.muted, marginTop: 3 }}>
              Incremental sync timeout on cohorts &gt;200 records. Investigation in progress. No data loss reported.
            </div>
          </div>
        </div>
      )}

      {/* Platform metrics */}
      <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 32 }}>
        <Metric
          label="Platform Uptime"
          value={`${SYSTEM_METRICS.uptime}%`}
          sub="Rolling 30 days"
          color={SYSTEM_METRICS.uptime >= 99.9 ? COLORS.green : "#D4A72C"}
        />
        <Metric
          label="Avg Response Time"
          value={`${SYSTEM_METRICS.avgResponseMs}ms`}
          sub="p50 across all routes"
          color={SYSTEM_METRICS.avgResponseMs < 300 ? COLORS.green : "#D4A72C"}
        />
        <Metric
          label="Active Sessions"
          value={SYSTEM_METRICS.activeSessionsNow}
          sub="Current live sessions"
          color={COLORS.acc}
        />
        <Metric
          label="Error Rate"
          value={`${SYSTEM_METRICS.errorRate}%`}
          sub="5xx across all requests"
          color={SYSTEM_METRICS.errorRate < 1 ? COLORS.green : COLORS.danger}
        />
        <Metric
          label="Open Tickets"
          value={SYSTEM_METRICS.openTickets}
          sub={`${SYSTEM_METRICS.criticalAlerts} critical`}
          color={SYSTEM_METRICS.criticalAlerts > 0 ? "#D4A72C" : COLORS.text}
        />
      </div>

      {/* Storage */}
      <div
        style={{
          background: COLORS.surf,
          border: `1px solid ${COLORS.border}`,
          borderRadius: RADIUS.md,
          boxShadow: SHADOW.sm,
          padding: "20px 24px",
          marginBottom: 28,
        }}
      >
        <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.text, marginBottom: 14 }}>Storage</div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ flex: 1, height: 10, borderRadius: 999, background: COLORS.border, overflow: "hidden" }}>
            <div
              style={{
                height: "100%",
                width: `${storageUsedPct}%`,
                background: storageUsedPct > 80 ? COLORS.danger : storageUsedPct > 60 ? "#D4A72C" : COLORS.acc,
                borderRadius: 999,
              }}
            />
          </div>
          <div style={{ fontSize: 13, fontWeight: 700, color: COLORS.text, flexShrink: 0 }}>
            {SYSTEM_METRICS.storageUsedGb} GB / {SYSTEM_METRICS.storageTotalGb} GB ({storageUsedPct}% used)
          </div>
        </div>
      </div>

      {/* Integrations */}
      <div>
        <h2 style={{ ...TYPE_SCALE.sectionTitle, marginBottom: 16 }}>Integration Status</h2>
        <div
          style={{
            background: COLORS.surf,
            border: `1px solid ${COLORS.border}`,
            borderRadius: RADIUS.md,
            boxShadow: SHADOW.sm,
            overflow: "hidden",
          }}
        >
          {/* Header */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "2fr 1.2fr 1fr 1fr 1fr 1fr",
              padding: "10px 20px",
              background: COLORS.bg,
              borderBottom: `1px solid ${COLORS.border}`,
              fontSize: 11,
              fontWeight: 700,
              color: COLORS.muted2,
              textTransform: "uppercase",
              gap: 12,
            }}
          >
            <div>Integration</div>
            <div>Type</div>
            <div>Status</div>
            <div>Last Sync</div>
            <div>Records</div>
            <div>Frequency</div>
          </div>

          {INTEGRATIONS.map((int, i) => {
            const hc = HEALTH_CONFIG[int.health] || HEALTH_CONFIG.offline;
            return (
              <div key={int.id}>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "2fr 1.2fr 1fr 1fr 1fr 1fr",
                    padding: "14px 20px",
                    borderBottom: `1px solid ${COLORS.border}`,
                    alignItems: "center",
                    gap: 12,
                  }}
                >
                  <div style={{ fontSize: 13, fontWeight: 700, color: COLORS.text }}>{int.name}</div>
                  <div style={{ fontSize: 12, color: COLORS.muted }}>{int.type}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ fontSize: 10, color: hc.color }}>{hc.icon}</span>
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        color: hc.color,
                      }}
                    >
                      {hc.label}
                    </span>
                  </div>
                  <div style={{ fontSize: 12, color: COLORS.muted }}>{int.lastSync}</div>
                  <div style={{ fontSize: 12, color: COLORS.muted }}>{int.records ? int.records.toLocaleString() : "—"}</div>
                  <div style={{ fontSize: 12, color: COLORS.muted }}>{int.syncFreq}</div>
                </div>
                {int.issue && (
                  <div
                    style={{
                      padding: "8px 20px",
                      background: (int.health === "offline" ? COLORS.danger : "#D4A72C") + "06",
                      borderBottom: `1px solid ${COLORS.border}`,
                      borderLeft: `3px solid ${int.health === "offline" ? COLORS.danger : "#D4A72C"}`,
                      fontSize: 11,
                      color: COLORS.muted,
                    }}
                  >
                    ⚠ {int.issue}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
