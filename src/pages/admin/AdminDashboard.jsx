import React from "react";
import { Link } from "react-router-dom";
import { COLORS, TYPE_SCALE, SHADOW, RADIUS, FONT_FAMILY_DISPLAY } from "../../theme/tokens.js";
import { useAppStore } from "../../store/AppStore.jsx";
import {
  ORG, BUSINESS_UNITS, INTERVENTIONS, RISKS, AUDIT_EVENTS, SYSTEM_METRICS,
  ORG_CAPABILITY_SCORES, DEMO_LEARNERS,
  getRiskColor, getRiskLabel,
} from "../../data/enterpriseData.js";

// ─── Capability Radar ─────────────────────────────────────────────────────────
function CapabilityRadar({ scores }) {
  const N = scores.length;
  const CX = 180, CY = 180, R = 130;
  const angleStep = (2 * Math.PI) / N;

  function polar(i, radius) {
    const angle = i * angleStep - Math.PI / 2;
    return {
      x: CX + radius * Math.cos(angle),
      y: CY + radius * Math.sin(angle),
    };
  }

  function toPath(values) {
    return values
      .map((v, i) => {
        const pt = polar(i, v);
        return `${i === 0 ? "M" : "L"} ${pt.x.toFixed(1)} ${pt.y.toFixed(1)}`;
      })
      .join(" ") + " Z";
  }

  const orgPath = toPath(scores.map((s) => (s.orgScore / 100) * R));
  const benchPath = toPath(scores.map((s) => (s.benchmark / 100) * R));

  return (
    <div
      style={{
        background: COLORS.surf, border: `1px solid ${COLORS.border}`,
        borderRadius: RADIUS.lg, boxShadow: SHADOW.sm, padding: "24px",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
        <h2 style={{ ...TYPE_SCALE.sectionTitle }}>Capability Radar</h2>
        <Link to="/admin/intelligence" style={{ fontSize: 12, color: COLORS.acc, fontWeight: 600, textDecoration: "none" }}>
          Details →
        </Link>
      </div>
      <p style={{ fontSize: 12, color: COLORS.muted, marginBottom: 16 }}>Org score vs sector benchmark</p>

      <svg viewBox="0 0 360 360" style={{ width: "100%", height: "auto", display: "block" }}>
        {/* Grid rings */}
        {[25, 50, 75, 100].map((pct) => (
          <polygon
            key={pct}
            points={scores.map((_, i) => {
              const pt = polar(i, (pct / 100) * R);
              return `${pt.x.toFixed(1)},${pt.y.toFixed(1)}`;
            }).join(" ")}
            fill="none"
            stroke={COLORS.border}
            strokeWidth="1"
          />
        ))}

        {/* Axis lines */}
        {scores.map((_, i) => {
          const pt = polar(i, R);
          return <line key={i} x1={CX} y1={CY} x2={pt.x.toFixed(1)} y2={pt.y.toFixed(1)} stroke={COLORS.border} strokeWidth="1" />;
        })}

        {/* Benchmark fill */}
        <path d={benchPath} fill={COLORS.muted2 + "20"} stroke={COLORS.muted2} strokeWidth="1.5" strokeDasharray="4,3" />

        {/* Org fill */}
        <path d={orgPath} fill={COLORS.acc + "25"} stroke={COLORS.acc} strokeWidth="2" />

        {/* Data points */}
        {scores.map((s, i) => {
          const pt = polar(i, (s.orgScore / 100) * R);
          return <circle key={i} cx={pt.x.toFixed(1)} cy={pt.y.toFixed(1)} r="4" fill={COLORS.acc} />;
        })}

        {/* Labels */}
        {scores.map((s, i) => {
          const pt = polar(i, R + 22);
          const isLeft = pt.x < CX - 10;
          return (
            <text
              key={i}
              x={pt.x.toFixed(1)}
              y={pt.y.toFixed(1)}
              textAnchor={isLeft ? "end" : pt.x > CX + 10 ? "start" : "middle"}
              dominantBaseline="middle"
              fontSize="9"
              fontWeight="600"
              fill={COLORS.muted}
            >
              {s.name.length > 12 ? s.name.slice(0, 12) + "…" : s.name}
            </text>
          );
        })}

        {/* Score labels */}
        {scores.map((s, i) => {
          const pt = polar(i, (s.orgScore / 100) * R);
          if (Math.abs(s.gap) > 8) {
            return (
              <text
                key={i}
                x={(pt.x - 1).toFixed(1)}
                y={(pt.y - 8).toFixed(1)}
                textAnchor="middle"
                fontSize="8"
                fontWeight="800"
                fill={s.gap < -12 ? COLORS.danger : COLORS.acc}
              >
                {s.orgScore}
              </text>
            );
          }
          return null;
        })}
      </svg>

      {/* Legend */}
      <div style={{ display: "flex", gap: 16, justifyContent: "center", marginTop: 4 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <div style={{ width: 16, height: 3, background: COLORS.acc, borderRadius: 2 }} />
          <span style={{ fontSize: 11, color: COLORS.muted }}>Organisation</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <div style={{ width: 16, height: 3, background: COLORS.muted2, borderRadius: 2, borderTop: "1px dashed" }} />
          <span style={{ fontSize: 11, color: COLORS.muted }}>Benchmark</span>
        </div>
      </div>
    </div>
  );
}

// ─── Learner Attention Table ──────────────────────────────────────────────────
function LearnerAttentionTable({ learners }) {
  // At-risk: low readiness OR inactive more than 3 days OR very low XP
  const atRisk = learners.filter(
    (l) => l.readiness < 40 || l.lastActive === "1 week" || l.lastActive === "2 weeks" || (l.xp < 200 && l.status !== "completed")
  ).slice(0, 8);

  const getBUName = (buId) => {
    const map = {
      bu_claims: "Claims", bu_ops: "Operations", bu_finance: "Finance",
      bu_uw: "Underwriting", bu_invest: "Investments", bu_hr: "HR",
      bu_tech: "Technology", bu_legal: "Legal",
    };
    return map[buId] || buId;
  };

  return (
    <div
      style={{
        background: COLORS.surf, border: `1px solid ${COLORS.border}`,
        borderRadius: RADIUS.lg, boxShadow: SHADOW.sm, overflow: "hidden",
      }}
    >
      <div
        style={{
          padding: "16px 20px",
          borderBottom: `1px solid ${COLORS.border}`,
          display: "flex", justifyContent: "space-between", alignItems: "center",
        }}
      >
        <div>
          <div style={{ fontSize: 15, fontWeight: 700, color: COLORS.text }}>Learners Needing Attention</div>
          <div style={{ fontSize: 12, color: COLORS.muted, marginTop: 2 }}>
            {atRisk.length} learners below threshold or inactive
          </div>
        </div>
        <Link to="/admin/learners" style={{ fontSize: 11, color: COLORS.acc, textDecoration: "none", fontWeight: 600 }}>
          All learners →
        </Link>
      </div>

      {atRisk.length === 0 ? (
        <div style={{ padding: "32px 20px", textAlign: "center", color: COLORS.muted2 }}>
          <div style={{ fontSize: 24, marginBottom: 8 }}>✓</div>
          <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.green }}>All learners on track</div>
        </div>
      ) : (
        <div>
          {atRisk.map((l, i) => {
            const isInactive = l.lastActive === "1 week" || l.lastActive === "2 weeks";
            const isLowScore = l.readiness < 30;
            const flagColor = isLowScore ? COLORS.danger : isInactive ? "#E8743B" : COLORS.gold;
            const flagLabel = isLowScore ? "Low score" : isInactive ? "Inactive" : "Needs nudge";

            return (
              <div
                key={l.id}
                style={{
                  padding: "12px 20px",
                  borderBottom: i < atRisk.length - 1 ? `1px solid ${COLORS.border}` : "none",
                  display: "flex", alignItems: "center", gap: 12,
                }}
              >
                <div
                  style={{
                    width: 32, height: 32, borderRadius: "50%", flexShrink: 0,
                    background: COLORS.acc + "15",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 12, fontWeight: 700, color: COLORS.acc,
                  }}
                >
                  {l.name.split(" ").map((p) => p[0]).join("").slice(0, 2)}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 13, color: COLORS.text }}>{l.name}</div>
                  <div style={{ fontSize: 11, color: COLORS.muted2, marginTop: 1 }}>
                    {getBUName(l.bu)} · Last active: {l.lastActive}
                  </div>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: l.readiness < 30 ? COLORS.danger : l.readiness < 50 ? "#E8743B" : COLORS.gold }}>
                    {l.readiness}%
                  </div>
                  <div
                    style={{
                      fontSize: 10, fontWeight: 700, color: flagColor,
                      background: flagColor + "14", border: `1px solid ${flagColor}30`,
                      borderRadius: 999, padding: "1px 7px", marginTop: 3,
                      display: "inline-block",
                    }}
                  >
                    {flagLabel}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Platform Health Grid ─────────────────────────────────────────────────────
function PlatformHealthGrid({ metrics }) {
  const items = [
    { label: "Platform Uptime",    value: `${metrics.uptime}%`,      status: metrics.uptime > 99.5 ? "healthy" : metrics.uptime > 98 ? "warning" : "critical" },
    { label: "API Latency",        value: `${metrics.apiLatency}ms`,  status: metrics.apiLatency < 200 ? "healthy" : metrics.apiLatency < 500 ? "warning" : "critical" },
    { label: "DB Query Time",      value: `${metrics.dbQueryTime}ms`, status: metrics.dbQueryTime < 100 ? "healthy" : metrics.dbQueryTime < 300 ? "warning" : "critical" },
    { label: "Active Sessions",    value: metrics.activeSessions,     status: "healthy" },
    { label: "Open Tickets",       value: metrics.openTickets,        status: metrics.openTickets < 5 ? "healthy" : metrics.openTickets < 15 ? "warning" : "critical" },
    { label: "Critical Alerts",    value: metrics.criticalAlerts,     status: metrics.criticalAlerts === 0 ? "healthy" : "critical" },
    { label: "Storage Used",       value: `${metrics.storageUsed}%`,  status: metrics.storageUsed < 70 ? "healthy" : metrics.storageUsed < 85 ? "warning" : "critical" },
    { label: "Sync Jobs",          value: metrics.syncJobsQueued,     status: metrics.syncJobsQueued < 3 ? "healthy" : "warning" },
  ];

  const DOT = {
    healthy:  { color: COLORS.green,  icon: "●" },
    warning:  { color: COLORS.gold,   icon: "◐" },
    critical: { color: COLORS.danger, icon: "○" },
  };

  return (
    <div
      style={{
        background: COLORS.surf, border: `1px solid ${COLORS.border}`,
        borderRadius: RADIUS.lg, boxShadow: SHADOW.sm, padding: "20px 24px",
        marginTop: 24,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div style={{ ...TYPE_SCALE.cardTitle }}>Platform Health</div>
        <Link to="/admin/system-health" style={{ fontSize: 12, color: COLORS.acc, fontWeight: 600, textDecoration: "none" }}>
          System Health Monitor →
        </Link>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 10 }}>
        {items.map((item) => {
          const dot = DOT[item.status];
          return (
            <div
              key={item.label}
              style={{
                background: item.status === "critical" ? COLORS.danger + "06" : COLORS.bg,
                border: `1px solid ${item.status === "critical" ? COLORS.danger + "25" : COLORS.border}`,
                borderRadius: RADIUS.md, padding: "12px 14px",
                display: "flex", alignItems: "center", gap: 10,
              }}
            >
              <span style={{ fontSize: 12, color: dot.color, flexShrink: 0 }}>{dot.icon}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 11, color: COLORS.muted2, fontWeight: 600 }}>{item.label}</div>
                <div style={{ fontWeight: 700, fontSize: 14, color: item.status === "critical" ? COLORS.danger : COLORS.text, marginTop: 2 }}>
                  {item.value}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Stat({ label, value, sub, color, badge }) {
  return (
    <div
      style={{
        background: COLORS.surf,
        border: `1px solid ${COLORS.border}`,
        borderRadius: RADIUS.md,
        boxShadow: SHADOW.sm,
        padding: "20px 22px",
        flex: 1,
        minWidth: 140,
      }}
    >
      <div style={{ fontSize: 28, fontWeight: 800, color: color || COLORS.acc, lineHeight: 1 }}>
        {value}
      </div>
      <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.text, marginTop: 6 }}>{label}</div>
      {sub && <div style={{ fontSize: 12, color: COLORS.muted2, marginTop: 3 }}>{sub}</div>}
      {badge && (
        <div
          style={{
            display: "inline-block",
            marginTop: 8,
            fontSize: 10,
            fontWeight: 700,
            color: badge.color,
            background: badge.color + "15",
            border: `1px solid ${badge.color}30`,
            borderRadius: 999,
            padding: "2px 8px",
            textTransform: "uppercase",
            letterSpacing: "0.04em",
          }}
        >
          {badge.label}
        </div>
      )}
    </div>
  );
}

function BURow({ bu }) {
  const riskColors = { critical: "#D64545", high: "#E8743B", medium: "#D4A72C", low: "#1F9D55" };
  const rc = riskColors[bu.riskLevel] || COLORS.muted2;
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        padding: "14px 20px",
        borderBottom: `1px solid ${COLORS.border}`,
        gap: 12,
      }}
    >
      <span style={{ fontSize: 14, width: 20, textAlign: "center", color: COLORS.muted }}>{bu.icon}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: COLORS.text }}>{bu.name}</div>
        <div style={{ fontSize: 11, color: COLORS.muted2, marginTop: 1 }}>{bu.learners} learners · Gap: {bu.topGap}</div>
      </div>
      <div style={{ width: 80, textAlign: "center" }}>
        <div
          style={{
            height: 6,
            borderRadius: 999,
            background: COLORS.border,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${bu.avgReadiness}%`,
              background: bu.avgReadiness >= 60 ? COLORS.green : bu.avgReadiness >= 40 ? "#D4A72C" : "#E8743B",
              borderRadius: 999,
            }}
          />
        </div>
        <div style={{ fontSize: 11, color: COLORS.muted2, marginTop: 3 }}>{bu.avgReadiness}%</div>
      </div>
      <div
        style={{
          fontSize: 10,
          fontWeight: 700,
          color: rc,
          background: rc + "12",
          border: `1px solid ${rc}30`,
          borderRadius: 999,
          padding: "2px 8px",
          textTransform: "capitalize",
          width: 60,
          textAlign: "center",
          flexShrink: 0,
        }}
      >
        {bu.riskLevel}
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const { auth } = useAppStore();

  const criticalRisks = RISKS.filter((r) => r.riskScore >= 70);
  const activeInterventions = INTERVENTIONS.filter((i) => i.status === "active");
  const atRiskBUs = BUSINESS_UNITS.filter((b) => b.riskLevel === "critical" || b.riskLevel === "high");
  const recentEvents = AUDIT_EVENTS.slice(0, 6);

  const today = new Date().toLocaleDateString("en-ZA", { day: "numeric", month: "long", year: "numeric" });

  return (
    <div style={{ minHeight: "100vh" }}>
      {/* Command Centre Header */}
      <div
        style={{
          background: `linear-gradient(135deg, ${COLORS.text} 0%, #1a3260 100%)`,
          padding: "32px 48px 36px",
          borderBottom: `3px solid ${COLORS.acc}`,
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: COLORS.accSoft, textTransform: "uppercase", letterSpacing: "0.1em" }}>
              Admin Command Centre
            </div>
            <h1 style={{ ...TYPE_SCALE.pageTitle, color: "#FFFFFF", marginTop: 6, fontFamily: FONT_FAMILY_DISPLAY }}>
              Momentum Group — Workforce Intelligence
            </h1>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", marginTop: 8 }}>
              {today} · {auth?.name || "Admin"} · Platform v3.4.1
            </p>
          </div>
          {criticalRisks.length > 0 && (
            <Link
              to="/admin/governance"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                background: "#D6454520",
                border: "1px solid #D6454560",
                borderRadius: RADIUS.md,
                padding: "10px 16px",
                color: "#FF8080",
                fontSize: 13,
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              <span>⚠</span>
              {criticalRisks.length} critical risk{criticalRisks.length > 1 ? "s" : ""} open
            </Link>
          )}
        </div>

        {/* Org KPI strip */}
        <div style={{ display: "flex", gap: 40, marginTop: 28, flexWrap: "wrap" }}>
          {[
            { label: "Employees",        value: ORG.employees.toLocaleString() },
            { label: "Enrolled Learners", value: ORG.totalLearners.toLocaleString() },
            { label: "Active Learners",   value: ORG.activeLearners.toLocaleString() },
            { label: "Overall Readiness", value: `${ORG.overallReadiness}%` },
            { label: "Participation Rate", value: `${ORG.participationRate}%` },
            { label: "AI Maturity Score", value: `${ORG.aiMaturityScore}/100` },
          ].map((k) => (
            <div key={k.label}>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                {k.label}
              </div>
              <div style={{ fontSize: 22, fontWeight: 800, color: "#FFFFFF", marginTop: 4, lineHeight: 1 }}>
                {k.value}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: "36px 48px", maxWidth: 1200 }}>

        {/* Stat cards */}
        <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 36 }}>
          <Stat
            label="Completion Rate"
            value={`${ORG.avgCompletionRate}%`}
            sub="Avg across enrolled learners"
            color={COLORS.acc}
            badge={{ label: "+7pp vs Q1", color: COLORS.green }}
          />
          <Stat
            label="Active Interventions"
            value={activeInterventions.length}
            sub="Programmes running now"
            color="#7C5CBF"
          />
          <Stat
            label="Open Risks"
            value={RISKS.filter((r) => r.status !== "resolved").length}
            sub={`${criticalRisks.length} critical — action needed`}
            color={criticalRisks.length > 0 ? COLORS.danger : COLORS.muted}
            badge={criticalRisks.length > 0 ? { label: "Needs attention", color: COLORS.danger } : null}
          />
          <Stat
            label="At-Risk Units"
            value={atRiskBUs.length}
            sub="BUs below 40% readiness"
            color={atRiskBUs.length > 1 ? "#E8743B" : COLORS.muted}
          />
          <Stat
            label="System Health"
            value={`${SYSTEM_METRICS.uptime}%`}
            sub={`${SYSTEM_METRICS.criticalAlerts} alert · ${SYSTEM_METRICS.openTickets} tickets`}
            color={SYSTEM_METRICS.criticalAlerts > 0 ? "#E8743B" : COLORS.green}
          />
        </div>

        {/* Two-column: BU table + sidebar */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 24, alignItems: "start" }}>

          {/* Business Unit Readiness */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <h2 style={{ ...TYPE_SCALE.sectionTitle }}>Business Unit Readiness</h2>
              <Link to="/admin/intelligence" style={{ fontSize: 12, color: COLORS.acc, fontWeight: 600, textDecoration: "none" }}>
                Full intelligence →
              </Link>
            </div>
            <div
              style={{
                background: COLORS.surf,
                border: `1px solid ${COLORS.border}`,
                borderRadius: RADIUS.md,
                boxShadow: SHADOW.sm,
                overflow: "hidden",
              }}
            >
              {/* Header row */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "10px 20px",
                  background: COLORS.bg,
                  borderBottom: `1px solid ${COLORS.border}`,
                  gap: 12,
                }}
              >
                <div style={{ flex: 1, fontSize: 11, fontWeight: 700, color: COLORS.muted2, textTransform: "uppercase" }}>Unit</div>
                <div style={{ width: 80, fontSize: 11, fontWeight: 700, color: COLORS.muted2, textTransform: "uppercase", textAlign: "center" }}>Readiness</div>
                <div style={{ width: 60, fontSize: 11, fontWeight: 700, color: COLORS.muted2, textTransform: "uppercase", textAlign: "center" }}>Risk</div>
              </div>
              {BUSINESS_UNITS.map((bu) => (
                <BURow key={bu.id} bu={bu} />
              ))}
            </div>
            <Link
              to="/admin/capability-map"
              style={{
                display: "block",
                textAlign: "center",
                marginTop: 12,
                fontSize: 12,
                color: COLORS.acc,
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              View Capability Map →
            </Link>
          </div>

          {/* Right column */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

            {/* Active Interventions */}
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
                  padding: "14px 18px",
                  borderBottom: `1px solid ${COLORS.border}`,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span style={{ fontSize: 14, fontWeight: 700, color: COLORS.text }}>Active Interventions</span>
                <Link to="/admin/interventions" style={{ fontSize: 11, color: COLORS.acc, textDecoration: "none", fontWeight: 600 }}>View all →</Link>
              </div>
              {activeInterventions.slice(0, 4).map((iv) => (
                <div
                  key={iv.id}
                  style={{ padding: "12px 18px", borderBottom: `1px solid ${COLORS.border}` }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: COLORS.text, flex: 1, lineHeight: 1.3 }}>
                      {iv.name}
                    </span>
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 700,
                        color: iv.priority === "critical" ? COLORS.danger : iv.priority === "high" ? "#E8743B" : "#D4A72C",
                        flexShrink: 0,
                        marginLeft: 8,
                      }}
                    >
                      {iv.priority.toUpperCase()}
                    </span>
                  </div>
                  <div style={{ marginTop: 8, height: 4, borderRadius: 999, background: COLORS.border, overflow: "hidden" }}>
                    <div
                      style={{
                        height: "100%",
                        width: `${iv.progress}%`,
                        background: COLORS.acc,
                        borderRadius: 999,
                      }}
                    />
                  </div>
                  <div style={{ fontSize: 11, color: COLORS.muted2, marginTop: 4 }}>
                    {iv.enrolled} enrolled · {iv.progress}% complete
                  </div>
                </div>
              ))}
            </div>

            {/* Top Risks */}
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
                  padding: "14px 18px",
                  borderBottom: `1px solid ${COLORS.border}`,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span style={{ fontSize: 14, fontWeight: 700, color: COLORS.text }}>Top Risks</span>
                <Link to="/admin/governance" style={{ fontSize: 11, color: COLORS.acc, textDecoration: "none", fontWeight: 600 }}>Register →</Link>
              </div>
              {RISKS.slice(0, 4).map((r) => {
                const rc = getRiskColor(r.riskScore);
                return (
                  <div
                    key={r.id}
                    style={{
                      padding: "12px 18px",
                      borderBottom: `1px solid ${COLORS.border}`,
                      borderLeft: `3px solid ${rc}`,
                    }}
                  >
                    <div style={{ fontSize: 12, fontWeight: 700, color: COLORS.text, lineHeight: 1.3 }}>
                      {r.title}
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
                      <span style={{ fontSize: 11, color: COLORS.muted2 }}>{r.category}</span>
                      <span style={{ fontSize: 11, fontWeight: 700, color: rc }}>{getRiskLabel(r.riskScore)} · {r.riskScore}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Recent Activity */}
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
                  padding: "14px 18px",
                  borderBottom: `1px solid ${COLORS.border}`,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span style={{ fontSize: 14, fontWeight: 700, color: COLORS.text }}>Recent Activity</span>
                <Link to="/admin/audit-logs" style={{ fontSize: 11, color: COLORS.acc, textDecoration: "none", fontWeight: 600 }}>Full log →</Link>
              </div>
              {recentEvents.map((e) => (
                <div
                  key={e.id}
                  style={{
                    padding: "10px 18px",
                    borderBottom: `1px solid ${COLORS.border}`,
                    display: "flex",
                    gap: 10,
                    alignItems: "flex-start",
                  }}
                >
                  <span
                    style={{
                      fontSize: 8,
                      marginTop: 5,
                      color:
                        e.severity === "error" ? COLORS.danger :
                        e.severity === "warning" ? "#E8743B" :
                        COLORS.muted2,
                    }}
                  >
                    ●
                  </span>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: COLORS.text }}>{e.action}</div>
                    <div style={{ fontSize: 11, color: COLORS.muted2, marginTop: 1 }}>
                      {e.ts.split(" ")[0]} · {e.actor.split("@")[0]}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Capability Radar + Learner Attention */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginTop: 32, alignItems: "start" }}>
          <CapabilityRadar scores={ORG_CAPABILITY_SCORES} />
          <LearnerAttentionTable learners={DEMO_LEARNERS} />
        </div>

        {/* Platform Health Grid */}
        <PlatformHealthGrid metrics={SYSTEM_METRICS} />

        {/* Quick action links */}
        <div style={{ marginTop: 32, display: "flex", gap: 12, flexWrap: "wrap" }}>
          {[
            { to: "/admin/learners",      label: "Manage Learners",    icon: "◉", color: COLORS.acc },
            { to: "/admin/skills-gap",    label: "Skills Gap Analysis", icon: "◈", color: "#7C5CBF" },
            { to: "/admin/role-disruption", label: "Role Disruption",  icon: "△", color: "#E8743B" },
            { to: "/admin/reports",       label: "Generate ExCo Pack",  icon: "⊟", color: COLORS.green },
            { to: "/admin/system-health", label: "System Health",      icon: "⬤", color: COLORS.muted },
          ].map((a) => (
            <Link
              key={a.to}
              to={a.to}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "10px 18px",
                background: COLORS.surf,
                border: `1px solid ${COLORS.border}`,
                borderRadius: RADIUS.md,
                fontSize: 13,
                fontWeight: 600,
                color: COLORS.text,
                textDecoration: "none",
                boxShadow: SHADOW.sm,
                transition: "border-color 120ms",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = COLORS.acc)}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = COLORS.border)}
            >
              <span style={{ color: a.color }}>{a.icon}</span>
              {a.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
