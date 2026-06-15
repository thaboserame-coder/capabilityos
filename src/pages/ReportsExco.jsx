import React from "react";
import { COLORS, TYPE_SCALE, SHADOW, RADIUS } from "../theme/tokens.js";
import { useAppStore } from "../store/AppStore.jsx";
import { INDUSTRIES } from "../data/industries.js";
import { getModulesForIndustry } from "../data/modules.js";
import { getTierForXP } from "../data/tiers.js";

// Reports & Exco — the admin "command centre" view.
// Per design principles: admin surfaces may feel firmer/more structured
// than the learner portal. A single dark header band signals "command
// centre" while the report body stays light, calm, and boardroom-ready.
export default function ReportsExco() {
  const { learner } = useAppStore();
  const tier = getTierForXP(learner.xp);

  const rows = INDUSTRIES.map((industry) => {
    const modules = getModulesForIndustry(industry.id);
    const completed = modules.filter((m) => learner.completedModuleIds.includes(m.id));
    const readiness = modules.length ? completed.length / modules.length : 0;
    return { industry, total: modules.length, completed: completed.length, readiness };
  });

  return (
    <div>
      {/* Command-centre header band */}
      <div
        style={{
          background: COLORS.text,
          color: "#FFFFFF",
          padding: "32px 48px",
        }}
      >
        <div style={{ ...TYPE_SCALE.caption, color: COLORS.accSoft, textTransform: "uppercase" }}>
          Reports &amp; Exco
        </div>
        <h1 style={{ ...TYPE_SCALE.pageTitle, color: "#FFFFFF", marginTop: 6 }}>
          Capability Readiness Overview
        </h1>
        <p style={{ ...TYPE_SCALE.body, color: "rgba(255,255,255,0.7)", marginTop: 8, maxWidth: 620 }}>
          A consolidated view of capability development across industries, for governance
          and executive review.
        </p>

        <div style={{ display: "flex", gap: 32, marginTop: 28 }}>
          <HeaderStat label="Learner" value={learner.name} />
          <HeaderStat label="Current tier" value={tier.name} />
          <HeaderStat label="Total XP" value={learner.xp.toLocaleString()} />
          <HeaderStat label="Industries tracked" value={String(INDUSTRIES.length)} />
        </div>
      </div>

      {/* Report body — light, calm, boardroom-ready */}
      <div style={{ padding: "40px 48px", maxWidth: 1100 }}>
        <h2 style={{ ...TYPE_SCALE.sectionTitle, marginBottom: 16 }}>
          Readiness by industry
        </h2>

        <div
          style={{
            background: COLORS.surf,
            border: `1px solid ${COLORS.border}`,
            borderRadius: RADIUS.md,
            boxShadow: SHADOW.sm,
            overflow: "hidden",
          }}
        >
          <ReportHeaderRow />
          {rows.map((row, i) => (
            <ReportRow key={row.industry.id} row={row} isLast={i === rows.length - 1} />
          ))}
        </div>

        <h2 style={{ ...TYPE_SCALE.sectionTitle, marginTop: 40, marginBottom: 16 }}>
          Capability detail — {rows[0]?.industry.name}
        </h2>
        <CapabilityBreakdown
          industry={INDUSTRIES[0]}
          completedModuleIds={learner.completedModuleIds}
        />
      </div>
    </div>
  );
}

function HeaderStat({ label, value }) {
  return (
    <div>
      <div style={{ ...TYPE_SCALE.caption, color: "rgba(255,255,255,0.55)", textTransform: "uppercase" }}>
        {label}
      </div>
      <div style={{ ...TYPE_SCALE.cardTitle, color: "#FFFFFF", fontSize: 17, marginTop: 4 }}>
        {value}
      </div>
    </div>
  );
}

function ReportHeaderRow() {
  return (
    <div
      style={{
        display: "flex",
        padding: "12px 20px",
        background: COLORS.surf2,
        borderBottom: `1px solid ${COLORS.border}`,
        ...TYPE_SCALE.caption,
        color: COLORS.muted2,
        textTransform: "uppercase",
      }}
    >
      <div style={{ flex: 2 }}>Industry</div>
      <div style={{ flex: 1, textAlign: "right" }}>Modules completed</div>
      <div style={{ flex: 2, textAlign: "right" }}>Readiness</div>
    </div>
  );
}

function ReportRow({ row, isLast }) {
  const pctLabel = `${Math.round(row.readiness * 100)}%`;
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        padding: "16px 20px",
        borderBottom: isLast ? "none" : `1px solid ${COLORS.border}`,
      }}
    >
      <div style={{ flex: 2, ...TYPE_SCALE.cardTitle }}>{row.industry.name}</div>
      <div style={{ flex: 1, textAlign: "right", ...TYPE_SCALE.body, color: COLORS.muted }}>
        {row.completed} / {row.total}
      </div>
      <div style={{ flex: 2, display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 12 }}>
        <div
          style={{
            width: 140,
            height: 6,
            borderRadius: 999,
            background: COLORS.border,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              width: pctLabel,
              background: row.readiness >= 1 ? COLORS.green : COLORS.acc,
              borderRadius: 999,
            }}
          />
        </div>
        <span style={{ ...TYPE_SCALE.caption, color: COLORS.muted2, width: 36, textAlign: "right" }}>
          {pctLabel}
        </span>
      </div>
    </div>
  );
}

function CapabilityBreakdown({ industry, completedModuleIds }) {
  const modules = getModulesForIndustry(industry.id);

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
        gap: 16,
      }}
    >
      {industry.capabilities.map((cap) => {
        const capModules = modules.filter((m) => m.capabilityId === cap.id);
        const capCompleted = capModules.filter((m) => completedModuleIds.includes(m.id));
        const pct = capModules.length ? capCompleted.length / capModules.length : 0;

        return (
          <div
            key={cap.id}
            style={{
              background: COLORS.surf,
              border: `1px solid ${COLORS.border}`,
              borderRadius: RADIUS.md,
              boxShadow: SHADOW.sm,
              padding: 16,
            }}
          >
            <div style={{ ...TYPE_SCALE.cardTitle, fontSize: 14 }}>{cap.name}</div>
            <div
              style={{
                ...TYPE_SCALE.display,
                fontSize: 32,
                marginTop: 8,
                color: pct >= 1 ? COLORS.green : COLORS.acc,
              }}
            >
              {Math.round(pct * 100)}%
            </div>
            <div style={{ ...TYPE_SCALE.caption, color: COLORS.muted2, marginTop: 4 }}>
              {capCompleted.length}/{capModules.length || 0} modules
            </div>
          </div>
        );
      })}
    </div>
  );
}
