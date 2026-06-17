import React, { useState } from "react";
import { COLORS, TYPE_SCALE, SHADOW, RADIUS } from "../../theme/tokens.js";
import { SYSTEM_METRICS, INTEGRATIONS } from "../../data/enterpriseData.js";

// Extended health state model (Figma spec)
const HEALTH_CONFIG = {
  healthy:   { color: COLORS.green,  label: "Healthy",   icon: "●", bg: COLORS.green + "10"  },
  warning:   { color: "#D4A72C",     label: "Warning",   icon: "◐", bg: "#D4A72C10"           },
  degraded:  { color: "#D4A72C",     label: "Warning",   icon: "◐", bg: "#D4A72C10"           }, // alias
  critical:  { color: COLORS.danger, label: "Critical",  icon: "⬤", bg: COLORS.danger + "08"  },
  offline:   { color: COLORS.danger, label: "Offline",   icon: "○", bg: COLORS.danger + "08"  }, // alias
  repairing: { color: COLORS.acc,    label: "Repairing", icon: "◌", bg: COLORS.acc + "10"     },
  resolved:  { color: COLORS.green,  label: "Resolved",  icon: "✓", bg: COLORS.green + "08"   },
};

// Static auto-heal issue data (What / Why / Who / Fix)
const AUTO_HEAL_ISSUES = [
  {
    id: "i001",
    title: "SharePoint Sync Timeout",
    state: "repairing",
    severity: "warning",
    what: "Incremental sync is timing out on cohorts exceeding 200 records. Batch operations failing silently after 30s.",
    why: "The SharePoint REST API throttle limit was reduced by Microsoft in the March 2025 patch. Our sync job wasn't updated to respect the new Retry-After headers.",
    who: "Platform Engine / Sync Worker v2.1",
    fix: "Exponential backoff added to sync worker. Batch size reduced from 200 to 50 records. Deploying fix v2.1.4 — ETA 25 minutes.",
    ts: "2025-06-17 09:14",
    autoHealPct: 67,
  },
  {
    id: "i002",
    title: "LMS API Key Rotation Needed",
    state: "warning",
    severity: "warning",
    what: "The LMS API key expires in 6 days. After expiry, module completion events will stop being recorded.",
    why: "API keys are rotated on a 90-day policy. This key was issued 84 days ago and the rotation reminder was missed.",
    who: "LMS Connector / Credential Manager",
    fix: "Generate a new API key in the LMS admin panel. Update the connector secret in Platform Settings → Integrations → Cornerstone.",
    ts: "2025-06-17 07:00",
    autoHealPct: null,
  },
  {
    id: "i003",
    title: "High DB Query Latency — Reports Table",
    state: "warning",
    severity: "warning",
    what: "Average query time on the `exco_reports` table has risen from 45ms to 310ms over 48 hours.",
    why: "The reports table crossed 1M rows without a covering index being created. Full table scans are now occurring on the `generated_at` column.",
    who: "Database / Query Optimiser",
    fix: "Index creation queued for off-peak window (02:00 SAST tonight). Estimated duration: 4 minutes. Will restore p95 latency to <80ms.",
    ts: "2025-06-16 22:30",
    autoHealPct: 0,
  },
  {
    id: "i004",
    title: "Sync Worker Memory Leak — Resolved",
    state: "resolved",
    severity: "info",
    what: "Memory usage on sync worker was growing by ~50MB per hour, eventually causing OOM restarts.",
    why: "A circular reference in the learner progress event handler was preventing garbage collection. Introduced in v2.0.9.",
    who: "Platform Engine / Sync Worker v2.1",
    fix: "Circular reference removed in v2.1.2 (deployed 2025-06-14). Memory usage stable at 240MB for 72 hours. Auto-closed.",
    ts: "2025-06-14 15:22",
    autoHealPct: 100,
  },
];

// ─── Auto-Heal Issue Card ─────────────────────────────────────────────────────
function AutoHealCard({ issue }) {
  const [expanded, setExpanded] = useState(false);
  const hc = HEALTH_CONFIG[issue.state] || HEALTH_CONFIG.warning;

  return (
    <div
      style={{
        background: COLORS.surf, border: `1px solid ${hc.color}35`,
        borderLeft: `4px solid ${hc.color}`,
        borderRadius: RADIUS.md, boxShadow: SHADOW.sm, overflow: "hidden",
      }}
    >
      <div
        onClick={() => setExpanded((v) => !v)}
        style={{ padding: "16px 20px", cursor: "pointer", display: "flex", alignItems: "center", gap: 14 }}
      >
        <div
          style={{
            width: 36, height: 36, borderRadius: RADIUS.sm, flexShrink: 0,
            background: hc.bg, display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 16, color: hc.color,
          }}
        >
          {hc.icon}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: 14, color: COLORS.text }}>{issue.title}</div>
          <div style={{ fontSize: 12, color: COLORS.muted, marginTop: 2 }}>
            <span style={{ fontWeight: 700, color: hc.color }}>{hc.label}</span>{" · "}{issue.ts}
          </div>
        </div>
        {issue.autoHealPct !== null && (
          <div style={{ textAlign: "right", flexShrink: 0, marginRight: 8 }}>
            <div style={{ fontWeight: 800, fontSize: 16, color: hc.color }}>{issue.autoHealPct}%</div>
            <div style={{ fontSize: 10, color: COLORS.muted2 }}>auto-heal</div>
          </div>
        )}
        <span style={{ fontSize: 11, color: COLORS.muted2, flexShrink: 0 }}>{expanded ? "▲" : "▼"}</span>
      </div>
      {issue.autoHealPct !== null && issue.autoHealPct > 0 && issue.autoHealPct < 100 && (
        <div style={{ height: 3, background: COLORS.border }}>
          <div style={{ height: "100%", width: `${issue.autoHealPct}%`, background: hc.color }} />
        </div>
      )}
      {expanded && (
        <div style={{ padding: "0 20px 20px", borderTop: `1px solid ${COLORS.border}` }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 16 }}>
            {[
              { label: "What", text: issue.what },
              { label: "Why",  text: issue.why  },
              { label: "Who",  text: issue.who  },
              { label: "Fix",  text: issue.fix  },
            ].map((f) => (
              <div key={f.label} style={{ background: COLORS.bg, borderRadius: RADIUS.sm, padding: "12px 14px" }}>
                <div style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.06em", color: hc.color, marginBottom: 6 }}>
                  {f.label}
                </div>
                <p style={{ fontSize: 12, color: COLORS.muted, lineHeight: 1.6, margin: 0 }}>{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ResolvedCard({ issue }) {
  const [expanded, setExpanded] = useState(false);
  const hc = HEALTH_CONFIG.resolved;
  return (
    <div
      style={{
        background: COLORS.surf, border: `1px solid ${COLORS.border}`,
        borderRadius: RADIUS.md, overflow: "hidden", opacity: 0.8,
      }}
    >
      <div
        onClick={() => setExpanded((v) => !v)}
        style={{ padding: "12px 20px", cursor: "pointer", display: "flex", alignItems: "center", gap: 12 }}
      >
        <span style={{ color: hc.color, fontSize: 12, flexShrink: 0 }}>{hc.icon}</span>
        <div style={{ flex: 1 }}>
          <span style={{ fontWeight: 600, fontSize: 13, color: COLORS.text }}>{issue.title}</span>
          <span style={{ fontSize: 11, color: COLORS.muted2, marginLeft: 8 }}>{issue.ts}</span>
        </div>
        <span style={{ fontSize: 10, fontWeight: 700, color: hc.color, background: hc.bg, borderRadius: 999, padding: "2px 9px" }}>
          Resolved
        </span>
        <span style={{ fontSize: 11, color: COLORS.muted2, marginLeft: 4 }}>{expanded ? "▲" : "▼"}</span>
      </div>
      {expanded && (
        <div style={{ padding: "0 20px 16px", borderTop: `1px solid ${COLORS.border}` }}>
          <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {[{ label: "What", text: issue.what }, { label: "Fix applied", text: issue.fix }].map((f) => (
              <div key={f.label} style={{ background: COLORS.bg, borderRadius: RADIUS.sm, padding: "10px 12px" }}>
                <div style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.06em", color: COLORS.muted2, marginBottom: 4 }}>
                  {f.label}
                </div>
                <p style={{ fontSize: 12, color: COLORS.muted, lineHeight: 1.55, margin: 0 }}>{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

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
  const activeIssues = AUTO_HEAL_ISSUES.filter((i) => i.state !== "resolved");
  const resolvedIssues = AUTO_HEAL_ISSUES.filter((i) => i.state === "resolved");

  // Overall platform state derived from issues
  const overallState =
    activeIssues.some((i) => i.severity === "critical") ? "critical" :
    activeIssues.some((i) => i.state === "repairing") ? "repairing" :
    activeIssues.length > 0 ? "warning" : "healthy";
  const overallHC = HEALTH_CONFIG[overallState];

  return (
    <div style={{ padding: "36px 48px", maxWidth: 1100 }}>
      {/* Page header */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: COLORS.muted2, textTransform: "uppercase", letterSpacing: "0.08em" }}>
          Governance
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 6 }}>
          <h1 style={{ ...TYPE_SCALE.pageTitle, margin: 0 }}>System Health Monitor</h1>
          {/* Overall state badge */}
          <div
            style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "5px 14px",
              background: overallHC.bg,
              border: `1px solid ${overallHC.color}35`,
              borderRadius: 999,
            }}
          >
            <span style={{ color: overallHC.color, fontSize: 10 }}>{overallHC.icon}</span>
            <span style={{ fontWeight: 700, fontSize: 12, color: overallHC.color }}>{overallHC.label}</span>
          </div>
        </div>
        <p style={{ fontSize: 13, color: COLORS.muted, marginTop: 8, maxWidth: 620 }}>
          Platform performance, integration status, and operational health for CapabilityOS v{SYSTEM_METRICS.deploymentVersion}. Last deployment: {SYSTEM_METRICS.lastDeployment}.
        </p>
      </div>

      {/* Auto-Heal Issue Cards */}
      {activeIssues.length > 0 && (
        <section style={{ marginBottom: 32 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <h2 style={{ ...TYPE_SCALE.sectionTitle }}>Active Issues</h2>
            <span style={{ fontSize: 12, color: COLORS.muted }}>
              {activeIssues.length} active · {resolvedIssues.length} resolved
            </span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {activeIssues.map((issue) => (
              <AutoHealCard key={issue.id} issue={issue} />
            ))}
          </div>
        </section>
      )}

      {/* Resolved issues (collapsed) */}
      {resolvedIssues.length > 0 && (
        <section style={{ marginBottom: 32 }}>
          <h2 style={{ ...TYPE_SCALE.sectionTitle, marginBottom: 12 }}>Resolved Issues</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {resolvedIssues.map((issue) => (
              <ResolvedCard key={issue.id} issue={issue} />
            ))}
          </div>
        </section>
      )}

      {/* Critical alert banner (legacy) */}
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
