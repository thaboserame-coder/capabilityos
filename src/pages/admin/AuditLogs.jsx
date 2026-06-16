import React, { useState } from "react";
import { COLORS, TYPE_SCALE, SHADOW, RADIUS } from "../../theme/tokens.js";
import { AUDIT_EVENTS } from "../../data/enterpriseData.js";

const SEVERITY_CONFIG = {
  info:    { color: COLORS.acc,    bg: COLORS.acc    + "12", icon: "●" },
  warning: { color: "#D4A72C",     bg: "#D4A72C12",           icon: "◐" },
  error:   { color: COLORS.danger, bg: COLORS.danger + "12", icon: "▲" },
};

export default function AuditLogs() {
  const [search, setSearch] = useState("");
  const [filterSeverity, setFilterSeverity] = useState("all");

  const filtered = AUDIT_EVENTS.filter((e) => {
    if (filterSeverity !== "all" && e.severity !== filterSeverity) return false;
    if (search) {
      const s = search.toLowerCase();
      return (
        e.action.toLowerCase().includes(s) ||
        e.actor.toLowerCase().includes(s) ||
        e.resource.toLowerCase().includes(s) ||
        e.detail.toLowerCase().includes(s)
      );
    }
    return true;
  });

  return (
    <div style={{ padding: "36px 48px", maxWidth: 1100 }}>
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: COLORS.muted2, textTransform: "uppercase", letterSpacing: "0.08em" }}>
          Governance
        </div>
        <h1 style={{ ...TYPE_SCALE.pageTitle, marginTop: 6 }}>Audit Logs</h1>
        <p style={{ fontSize: 13, color: COLORS.muted, marginTop: 8, maxWidth: 620 }}>
          Immutable record of platform events, admin actions, system changes, and integration activity. Used for compliance, governance, and incident investigation.
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 24 }}>
        {[
          { label: "Total Events",  value: AUDIT_EVENTS.length,                               color: COLORS.text   },
          { label: "Info",          value: AUDIT_EVENTS.filter((e) => e.severity === "info").length,    color: COLORS.acc    },
          { label: "Warnings",      value: AUDIT_EVENTS.filter((e) => e.severity === "warning").length, color: "#D4A72C"     },
          { label: "Errors",        value: AUDIT_EVENTS.filter((e) => e.severity === "error").length,   color: COLORS.danger },
        ].map((s) => (
          <div
            key={s.label}
            style={{
              background: COLORS.surf,
              border: `1px solid ${COLORS.border}`,
              borderRadius: RADIUS.md,
              boxShadow: SHADOW.sm,
              padding: "16px 20px",
              flex: 1,
              minWidth: 120,
            }}
          >
            <div style={{ fontSize: 24, fontWeight: 800, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 12, color: COLORS.muted2, marginTop: 3 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 12, marginBottom: 18, alignItems: "center" }}>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search action, actor, resource…"
          style={{
            flex: "1 1 240px",
            padding: "8px 14px",
            border: `1px solid ${COLORS.border}`,
            borderRadius: RADIUS.sm,
            fontSize: 13,
            fontFamily: "inherit",
            color: COLORS.text,
            background: COLORS.surf,
            outline: "none",
          }}
        />
        <select
          value={filterSeverity}
          onChange={(e) => setFilterSeverity(e.target.value)}
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
          <option value="all">All Severities</option>
          <option value="info">Info</option>
          <option value="warning">Warning</option>
          <option value="error">Error</option>
        </select>
        <span style={{ fontSize: 12, color: COLORS.muted2 }}>
          {filtered.length} events
        </span>
      </div>

      {/* Log table */}
      <div
        style={{
          background: COLORS.surf,
          border: `1px solid ${COLORS.border}`,
          borderRadius: RADIUS.md,
          boxShadow: SHADOW.sm,
          overflow: "hidden",
          fontFamily: "'Archivo', monospace",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "140px 80px 1.5fr 1.5fr 2fr",
            padding: "10px 20px",
            background: COLORS.bg,
            borderBottom: `1px solid ${COLORS.border}`,
            fontSize: 11,
            fontWeight: 700,
            color: COLORS.muted2,
            textTransform: "uppercase",
            gap: 16,
          }}
        >
          <div>Timestamp</div>
          <div>Level</div>
          <div>Actor</div>
          <div>Action</div>
          <div>Detail</div>
        </div>

        {filtered.length === 0 && (
          <div style={{ padding: "32px 20px", textAlign: "center", color: COLORS.muted2, fontSize: 13 }}>
            No events match your filters.
          </div>
        )}

        {filtered.map((e) => {
          const sc = SEVERITY_CONFIG[e.severity] || SEVERITY_CONFIG.info;
          return (
            <div
              key={e.id}
              style={{
                display: "grid",
                gridTemplateColumns: "140px 80px 1.5fr 1.5fr 2fr",
                padding: "11px 20px",
                borderBottom: `1px solid ${COLORS.border}`,
                alignItems: "flex-start",
                gap: 16,
                background: e.severity === "error" ? COLORS.danger + "03" : e.severity === "warning" ? "#D4A72C03" : "transparent",
              }}
            >
              {/* Timestamp */}
              <div style={{ fontSize: 11, color: COLORS.muted2, fontFamily: "monospace" }}>
                {e.ts}
              </div>
              {/* Severity */}
              <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <span style={{ fontSize: 8, color: sc.color }}>{sc.icon}</span>
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    color: sc.color,
                    textTransform: "uppercase",
                    letterSpacing: "0.04em",
                  }}
                >
                  {e.severity}
                </span>
              </div>
              {/* Actor */}
              <div style={{ fontSize: 12, color: COLORS.muted, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {e.actor === "system" ? (
                  <span style={{ color: COLORS.muted2, fontStyle: "italic" }}>system</span>
                ) : e.actor}
              </div>
              {/* Action + Resource */}
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: COLORS.text }}>{e.action}</div>
                <div style={{ fontSize: 11, color: COLORS.muted2, marginTop: 1 }}>{e.resource}</div>
              </div>
              {/* Detail */}
              <div style={{ fontSize: 12, color: COLORS.muted, lineHeight: 1.4 }}>{e.detail}</div>
            </div>
          );
        })}
      </div>

      <div style={{ fontSize: 12, color: COLORS.muted2, marginTop: 12, textAlign: "right" }}>
        Showing {filtered.length} of {AUDIT_EVENTS.length} events · Retention: 90 days · Export available on Enterprise tier
      </div>
    </div>
  );
}
