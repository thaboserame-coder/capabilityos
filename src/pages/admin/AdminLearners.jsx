import React, { useState, useMemo } from "react";
import { COLORS, TYPE_SCALE, SHADOW, RADIUS } from "../../theme/tokens.js";
import { DEMO_LEARNERS, BUSINESS_UNITS, getStatusColor } from "../../data/enterpriseData.js";

const STATUS_LABELS = { active: "Active", "at-risk": "At Risk", inactive: "Inactive" };

function Avatar({ name }) {
  const initials = name.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase();
  const colors = ["#1D5BD8", "#7C3AED", "#1F9D55", "#E8743B", "#D4A72C"];
  const color = colors[name.charCodeAt(0) % colors.length];
  return (
    <div
      style={{
        width: 32,
        height: 32,
        borderRadius: "50%",
        background: color + "20",
        border: `1px solid ${color}40`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 11,
        fontWeight: 700,
        color,
        flexShrink: 0,
      }}
    >
      {initials}
    </div>
  );
}

export default function AdminLearners() {
  const [search, setSearch] = useState("");
  const [filterBU, setFilterBU] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("xp");

  const filtered = useMemo(() => {
    let list = [...DEMO_LEARNERS];
    if (search) {
      const s = search.toLowerCase();
      list = list.filter((l) => l.name.toLowerCase().includes(s) || l.role.toLowerCase().includes(s));
    }
    if (filterBU !== "all") list = list.filter((l) => l.bu === filterBU);
    if (filterStatus !== "all") list = list.filter((l) => l.status === filterStatus);
    list.sort((a, b) => {
      if (sortBy === "xp") return b.xp - a.xp;
      if (sortBy === "readiness") return b.readiness - a.readiness;
      if (sortBy === "mods") return b.mods - a.mods;
      if (sortBy === "name") return a.name.localeCompare(b.name);
      return 0;
    });
    return list;
  }, [search, filterBU, filterStatus, sortBy]);

  const stats = useMemo(() => ({
    total: DEMO_LEARNERS.length,
    active: DEMO_LEARNERS.filter((l) => l.status === "active").length,
    atRisk: DEMO_LEARNERS.filter((l) => l.status === "at-risk").length,
    inactive: DEMO_LEARNERS.filter((l) => l.status === "inactive").length,
    avgReadiness: Math.round(DEMO_LEARNERS.reduce((s, l) => s + l.readiness, 0) / DEMO_LEARNERS.length),
    avgXp: Math.round(DEMO_LEARNERS.reduce((s, l) => s + l.xp, 0) / DEMO_LEARNERS.length),
  }), []);

  return (
    <div style={{ padding: "36px 48px", maxWidth: 1200 }}>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: COLORS.muted2, textTransform: "uppercase", letterSpacing: "0.08em" }}>
          Enterprise Learner Management
        </div>
        <h1 style={{ ...TYPE_SCALE.pageTitle, marginTop: 6 }}>Learners</h1>
        <p style={{ fontSize: 13, color: COLORS.muted, marginTop: 8, maxWidth: 600 }}>
          Monitor engagement, readiness progress, and intervention flags across {stats.total} enrolled learners.
        </p>
      </div>

      {/* Stat cards */}
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 28 }}>
        {[
          { label: "Total Enrolled",    value: stats.total,         color: COLORS.text },
          { label: "Active (30 days)",  value: stats.active,        color: COLORS.green },
          { label: "At Risk",           value: stats.atRisk,        color: "#E8743B" },
          { label: "Inactive",          value: stats.inactive,      color: COLORS.muted2 },
          { label: "Avg Readiness",     value: `${stats.avgReadiness}%`, color: COLORS.acc },
          { label: "Avg XP",            value: stats.avgXp.toLocaleString(), color: "#7C5CBF" },
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
            <div style={{ fontSize: 12, color: COLORS.muted2, marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div
        style={{
          display: "flex",
          gap: 12,
          flexWrap: "wrap",
          marginBottom: 18,
          alignItems: "center",
        }}
      >
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search name or role…"
          style={{
            flex: "1 1 200px",
            padding: "9px 14px",
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
          value={filterBU}
          onChange={(e) => setFilterBU(e.target.value)}
          style={{
            padding: "9px 14px",
            border: `1px solid ${COLORS.border}`,
            borderRadius: RADIUS.sm,
            fontSize: 13,
            fontFamily: "inherit",
            color: COLORS.text,
            background: COLORS.surf,
            cursor: "pointer",
          }}
        >
          <option value="all">All Business Units</option>
          {BUSINESS_UNITS.map((b) => (
            <option key={b.id} value={b.id}>{b.name}</option>
          ))}
        </select>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          style={{
            padding: "9px 14px",
            border: `1px solid ${COLORS.border}`,
            borderRadius: RADIUS.sm,
            fontSize: 13,
            fontFamily: "inherit",
            color: COLORS.text,
            background: COLORS.surf,
            cursor: "pointer",
          }}
        >
          <option value="all">All Statuses</option>
          <option value="active">Active</option>
          <option value="at-risk">At Risk</option>
          <option value="inactive">Inactive</option>
        </select>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          style={{
            padding: "9px 14px",
            border: `1px solid ${COLORS.border}`,
            borderRadius: RADIUS.sm,
            fontSize: 13,
            fontFamily: "inherit",
            color: COLORS.text,
            background: COLORS.surf,
            cursor: "pointer",
          }}
        >
          <option value="xp">Sort: XP (High)</option>
          <option value="readiness">Sort: Readiness</option>
          <option value="mods">Sort: Modules</option>
          <option value="name">Sort: Name A–Z</option>
        </select>
        <div style={{ fontSize: 12, color: COLORS.muted2, marginLeft: "auto", flexShrink: 0 }}>
          {filtered.length} of {stats.total}
        </div>
      </div>

      {/* Table */}
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
            gridTemplateColumns: "2fr 1.4fr 0.8fr 0.8fr 0.8fr 1fr 0.9fr",
            padding: "10px 20px",
            background: COLORS.bg,
            borderBottom: `1px solid ${COLORS.border}`,
            fontSize: 11,
            fontWeight: 700,
            color: COLORS.muted2,
            textTransform: "uppercase",
            letterSpacing: "0.04em",
            gap: 12,
          }}
        >
          <div>Name</div>
          <div>Business Unit</div>
          <div>Role</div>
          <div>Modules</div>
          <div>XP</div>
          <div>Readiness</div>
          <div>Status</div>
        </div>

        {filtered.length === 0 && (
          <div style={{ padding: "32px 20px", textAlign: "center", color: COLORS.muted2, fontSize: 13 }}>
            No learners match your filters.
          </div>
        )}

        {filtered.map((l) => {
          const bu = BUSINESS_UNITS.find((b) => b.id === l.bu);
          const sc = getStatusColor(l.status);
          return (
            <div
              key={l.id}
              style={{
                display: "grid",
                gridTemplateColumns: "2fr 1.4fr 0.8fr 0.8fr 0.8fr 1fr 0.9fr",
                padding: "12px 20px",
                borderBottom: `1px solid ${COLORS.border}`,
                alignItems: "center",
                gap: 12,
              }}
            >
              {/* Name */}
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Avatar name={l.name} />
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: COLORS.text }}>{l.name}</div>
                  <div style={{ fontSize: 11, color: COLORS.muted2 }}>Last: {l.lastActive}</div>
                </div>
              </div>
              {/* BU */}
              <div style={{ fontSize: 12, color: COLORS.muted }}>{bu?.name || l.bu}</div>
              {/* Role */}
              <div style={{ fontSize: 12, color: COLORS.muted, textTransform: "capitalize" }}>{l.role}</div>
              {/* Mods */}
              <div style={{ fontSize: 13, fontWeight: 700, color: COLORS.text }}>{l.mods}</div>
              {/* XP */}
              <div style={{ fontSize: 13, fontWeight: 700, color: "#7C5CBF" }}>{l.xp.toLocaleString()}</div>
              {/* Readiness */}
              <div>
                <div
                  style={{
                    height: 5,
                    borderRadius: 999,
                    background: COLORS.border,
                    overflow: "hidden",
                    marginBottom: 4,
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${l.readiness}%`,
                      background: l.readiness >= 60 ? COLORS.green : l.readiness >= 40 ? "#D4A72C" : "#E8743B",
                      borderRadius: 999,
                    }}
                  />
                </div>
                <div style={{ fontSize: 11, color: COLORS.muted2 }}>{l.readiness}%</div>
              </div>
              {/* Status */}
              <div>
                <span
                  style={{
                    display: "inline-block",
                    fontSize: 10,
                    fontWeight: 700,
                    color: sc,
                    background: sc + "15",
                    border: `1px solid ${sc}30`,
                    borderRadius: 999,
                    padding: "2px 8px",
                    textTransform: "capitalize",
                  }}
                >
                  {STATUS_LABELS[l.status] || l.status}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ fontSize: 12, color: COLORS.muted2, marginTop: 12, textAlign: "right" }}>
        Showing {filtered.length} learners from demo cohort · Full sync: SAP SuccessFactors (16,500 employees)
      </div>
    </div>
  );
}
