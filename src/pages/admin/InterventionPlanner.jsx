import React, { useState } from "react";
import { COLORS, TYPE_SCALE, SHADOW, RADIUS } from "../../theme/tokens.js";
import { INTERVENTIONS, BUSINESS_UNITS } from "../../data/enterpriseData.js";

const STATUS_CONFIG = {
  active:    { color: COLORS.green,   bg: COLORS.green   + "12", label: "Active"    },
  planning:  { color: "#D4A72C",      bg: "#D4A72C12",           label: "Planning"  },
  completed: { color: COLORS.muted2,  bg: COLORS.border,         label: "Completed" },
  paused:    { color: "#E8743B",      bg: "#E8743B12",           label: "Paused"    },
};

const PRIORITY_CONFIG = {
  critical: { color: COLORS.danger, label: "Critical" },
  high:     { color: "#E8743B",     label: "High"     },
  medium:   { color: "#D4A72C",     label: "Medium"   },
  low:      { color: COLORS.green,  label: "Low"      },
};

export default function InterventionPlanner() {
  const [filterStatus, setFilterStatus] = useState("all");
  const [selected, setSelected] = useState(null);

  const filtered = filterStatus === "all"
    ? INTERVENTIONS
    : INTERVENTIONS.filter((i) => i.status === filterStatus);

  const activeCount = INTERVENTIONS.filter((i) => i.status === "active").length;
  const totalEnrolled = INTERVENTIONS.reduce((s, i) => s + i.enrolled, 0);
  const avgProgress = Math.round(INTERVENTIONS.filter((i) => i.status === "active").reduce((s, i) => s + i.progress, 0) / activeCount);

  const detail = selected ? INTERVENTIONS.find((i) => i.id === selected) : null;

  return (
    <div style={{ padding: "36px 48px", maxWidth: 1200 }}>
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: COLORS.muted2, textTransform: "uppercase", letterSpacing: "0.08em" }}>
          Workforce Analytics
        </div>
        <h1 style={{ ...TYPE_SCALE.pageTitle, marginTop: 6 }}>Intervention Planner</h1>
        <p style={{ fontSize: 13, color: COLORS.muted, marginTop: 8, maxWidth: 660 }}>
          Design, track, and evaluate workforce transformation interventions. Each intervention maps to a specific capability gap and disruption risk identified in the workforce intelligence layer.
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 28 }}>
        {[
          { label: "Total Interventions", value: INTERVENTIONS.length,       color: COLORS.text },
          { label: "Active",              value: activeCount,                  color: COLORS.green },
          { label: "Total Enrolled",      value: totalEnrolled.toLocaleString(), color: COLORS.acc },
          { label: "Avg Completion",      value: `${avgProgress}%`,           color: "#7C5CBF" },
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

      {/* Filter */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {[{ id: "all", label: "All" }, { id: "active", label: "Active" }, { id: "planning", label: "Planning" }, { id: "completed", label: "Completed" }].map((f) => (
          <button
            key={f.id}
            onClick={() => setFilterStatus(f.id)}
            style={{
              padding: "7px 16px",
              borderRadius: RADIUS.sm,
              border: `1px solid ${filterStatus === f.id ? COLORS.acc : COLORS.border}`,
              background: filterStatus === f.id ? COLORS.acc + "12" : COLORS.surf,
              color: filterStatus === f.id ? COLORS.acc : COLORS.muted,
              fontSize: 12,
              fontWeight: filterStatus === f.id ? 700 : 500,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: detail ? "1fr 380px" : "1fr", gap: 20 }}>
        {/* List */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {filtered.map((iv) => {
            const sc = STATUS_CONFIG[iv.status] || STATUS_CONFIG.active;
            const pc = PRIORITY_CONFIG[iv.priority] || PRIORITY_CONFIG.medium;
            const bu = BUSINESS_UNITS.find((b) => b.id === iv.bu);
            const isSelected = selected === iv.id;

            return (
              <div
                key={iv.id}
                onClick={() => setSelected(isSelected ? null : iv.id)}
                style={{
                  background: COLORS.surf,
                  border: `1px solid ${isSelected ? COLORS.acc : COLORS.border}`,
                  borderRadius: RADIUS.md,
                  boxShadow: isSelected ? `0 0 0 2px ${COLORS.acc}20` : SHADOW.sm,
                  padding: "18px 22px",
                  cursor: "pointer",
                  transition: "border-color 120ms, box-shadow 120ms",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                      <span style={{ fontSize: 14, fontWeight: 700, color: COLORS.text }}>{iv.name}</span>
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 700,
                          color: pc.color,
                          background: pc.color + "15",
                          border: `1px solid ${pc.color}30`,
                          borderRadius: 999,
                          padding: "2px 8px",
                          textTransform: "uppercase",
                        }}
                      >
                        {pc.label}
                      </span>
                    </div>
                    <div style={{ fontSize: 12, color: COLORS.muted2 }}>
                      {iv.type} · {bu ? bu.name : "All BUs"} · {iv.targetHeadcount.toLocaleString()} target
                    </div>
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: sc.color,
                      background: sc.bg,
                      border: `1px solid ${sc.color}30`,
                      borderRadius: 999,
                      padding: "3px 10px",
                      flexShrink: 0,
                    }}
                  >
                    {sc.label}
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ height: 6, borderRadius: 999, background: COLORS.border, overflow: "hidden" }}>
                      <div
                        style={{
                          height: "100%",
                          width: `${iv.progress}%`,
                          background: iv.status === "active" ? COLORS.acc : COLORS.muted2,
                          borderRadius: 999,
                        }}
                      />
                    </div>
                    <div style={{ fontSize: 11, color: COLORS.muted2, marginTop: 4 }}>
                      {iv.enrolled} of {iv.targetHeadcount} enrolled · {iv.progress}% complete
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: COLORS.text }}>{iv.cost}</div>
                    <div style={{ fontSize: 10, color: COLORS.muted2 }}>Programme cost</div>
                  </div>
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
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: COLORS.text, flex: 1, lineHeight: 1.3 }}>{detail.name}</h3>
              <button
                onClick={() => setSelected(null)}
                style={{ background: "none", border: "none", cursor: "pointer", fontSize: 16, color: COLORS.muted2, padding: "0 0 0 12px" }}
              >
                ×
              </button>
            </div>

            {/* Key metrics */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
              {[
                { label: "Type",          value: detail.type },
                { label: "Status",        value: STATUS_CONFIG[detail.status]?.label || detail.status },
                { label: "Facilitator",   value: detail.facilitator },
                { label: "Priority",      value: PRIORITY_CONFIG[detail.priority]?.label || detail.priority },
                { label: "Enrolled",      value: `${detail.enrolled} / ${detail.targetHeadcount}` },
                { label: "Completion",    value: `${detail.progress}%` },
                { label: "Start Date",    value: detail.startDate },
                { label: "End Date",      value: detail.endDate },
              ].map((m) => (
                <div
                  key={m.label}
                  style={{
                    background: COLORS.bg,
                    borderRadius: RADIUS.sm,
                    padding: "10px 12px",
                  }}
                >
                  <div style={{ fontSize: 10, fontWeight: 700, color: COLORS.muted2, textTransform: "uppercase", marginBottom: 3 }}>
                    {m.label}
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: COLORS.text }}>{m.value}</div>
                </div>
              ))}
            </div>

            <div style={{ borderTop: `1px solid ${COLORS.border}`, paddingTop: 16, marginBottom: 14 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: COLORS.muted2, textTransform: "uppercase", marginBottom: 6 }}>Objective</div>
              <div style={{ fontSize: 13, color: COLORS.muted, lineHeight: 1.5 }}>{detail.objective}</div>
            </div>

            <div style={{ borderTop: `1px solid ${COLORS.border}`, paddingTop: 14, marginBottom: 14 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: COLORS.muted2, textTransform: "uppercase", marginBottom: 6 }}>Target Roles</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {detail.targetRoles.map((r) => (
                  <span
                    key={r}
                    style={{
                      fontSize: 11,
                      background: COLORS.acc + "10",
                      color: COLORS.acc,
                      border: `1px solid ${COLORS.acc}25`,
                      borderRadius: 999,
                      padding: "3px 10px",
                      fontWeight: 600,
                    }}
                  >
                    {r}
                  </span>
                ))}
              </div>
            </div>

            <div
              style={{
                background: COLORS.green + "08",
                border: `1px solid ${COLORS.green}30`,
                borderRadius: RADIUS.sm,
                padding: "12px 14px",
              }}
            >
              <div style={{ fontSize: 11, fontWeight: 700, color: COLORS.green, textTransform: "uppercase", marginBottom: 4 }}>
                Projected ROI
              </div>
              <div style={{ fontSize: 12, color: COLORS.muted, lineHeight: 1.4 }}>{detail.roi}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
