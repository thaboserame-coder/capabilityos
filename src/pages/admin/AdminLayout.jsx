import React, { useState } from "react";
import { NavLink, useNavigate, Routes, Route, Navigate } from "react-router-dom";
import { COLORS, TYPE_SCALE, SHADOW, RADIUS, FONT_FAMILY_DISPLAY, FONT_FAMILY_BODY } from "../../theme/tokens.js";
import { useAppStore } from "../../store/AppStore.jsx";
import Toast from "../../components/Toast.jsx";
import AdminDashboard from "./AdminDashboard.jsx";
import AdminLearners from "./AdminLearners.jsx";
import AdminIntelligence from "./AdminIntelligence.jsx";
import CapabilityMap from "./CapabilityMap.jsx";
import SkillsGap from "./SkillsGap.jsx";
import RoleDisruption from "./RoleDisruption.jsx";
import InterventionPlanner from "./InterventionPlanner.jsx";
import AdminReports from "./AdminReports.jsx";
import GovernanceRisk from "./GovernanceRisk.jsx";
import SystemHealth from "./SystemHealth.jsx";
import AuditLogs from "./AuditLogs.jsx";
import AdminModuleNotes from "./AdminModuleNotes.jsx";
import AdminIntegrations from "./AdminIntegrations.jsx";

const NAV_SECTIONS = [
  {
    label: "Command Centre",
    items: [
      { to: "/admin",              label: "Overview",         icon: "⊞", end: true },
      { to: "/admin/learners",     label: "Learners",         icon: "◉" },
      { to: "/admin/intelligence", label: "Intelligence",     icon: "◎" },
    ],
  },
  {
    label: "Workforce Analytics",
    items: [
      { to: "/admin/capability-map",   label: "Capability Map",    icon: "⬡" },
      { to: "/admin/skills-gap",       label: "Skills Gap",        icon: "◈" },
      { to: "/admin/role-disruption",  label: "Role Disruption",   icon: "△" },
      { to: "/admin/interventions",    label: "Interventions",     icon: "◇" },
    ],
  },
  {
    label: "Governance",
    items: [
      { to: "/admin/reports",       label: "Reports & Exco",    icon: "⊟" },
      { to: "/admin/governance",    label: "Governance & Risk", icon: "▣" },
      { to: "/admin/system-health", label: "System Health",     icon: "⬤" },
      { to: "/admin/audit-logs",    label: "Audit Logs",        icon: "▦" },
    ],
  },
  {
    label: "Platform",
    items: [
      { to: "/admin/module-notes",  label: "Module Notes",  icon: "◫" },
      { to: "/admin/integrations",  label: "LXP Setup",     icon: "⊛" },
    ],
  },
];

export default function AdminLayout() {
  const { auth, logout } = useAppStore();
  const navigate = useNavigate();
  const [showLogout, setShowLogout] = useState(false);

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: COLORS.bg,
        fontFamily: FONT_FAMILY_BODY,
        color: COLORS.text,
      }}
    >
      {/* Admin Sidebar */}
      <nav
        style={{
          width: 232,
          flexShrink: 0,
          background: COLORS.text,
          display: "flex",
          flexDirection: "column",
          padding: "24px 0",
          minHeight: "100vh",
          position: "sticky",
          top: 0,
          overflowY: "auto",
        }}
      >
        {/* Wordmark */}
        <div style={{ padding: "0 20px 20px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          <div
            style={{
              fontFamily: FONT_FAMILY_DISPLAY,
              fontWeight: 700,
              fontSize: 17,
              color: "#FFFFFF",
              letterSpacing: "-0.01em",
            }}
          >
            CapabilityOS
          </div>
          <div
            style={{
              fontSize: 11,
              color: COLORS.accSoft,
              marginTop: 2,
              fontWeight: 600,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
            }}
          >
            Admin Portal
          </div>

          {/* Org badge */}
          <div
            style={{
              marginTop: 14,
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: RADIUS.sm,
              padding: "8px 10px",
            }}
          >
            <div style={{ fontSize: 12, fontWeight: 700, color: "#FFFFFF" }}>
              Momentum Group
            </div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.45)", marginTop: 2 }}>
              16,500 employees · Enterprise
            </div>
          </div>
        </div>

        {/* Nav sections */}
        <div style={{ flex: 1, padding: "16px 0", display: "flex", flexDirection: "column", gap: 4 }}>
          {NAV_SECTIONS.map((section) => (
            <div key={section.label} style={{ marginBottom: 8 }}>
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: "rgba(255,255,255,0.3)",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  padding: "6px 20px 4px",
                }}
              >
                {section.label}
              </div>
              {section.items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  style={({ isActive }) => ({
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "8px 20px",
                    fontSize: 13,
                    fontWeight: isActive ? 700 : 400,
                    color: isActive ? "#FFFFFF" : "rgba(255,255,255,0.55)",
                    background: isActive ? "rgba(29,91,216,0.35)" : "transparent",
                    borderLeft: isActive ? `3px solid ${COLORS.acc}` : "3px solid transparent",
                    textDecoration: "none",
                    transition: "all 120ms ease",
                  })}
                >
                  <span style={{ fontSize: 12, opacity: 0.8, width: 14, textAlign: "center" }}>{item.icon}</span>
                  {item.label}
                </NavLink>
              ))}
            </div>
          ))}
        </div>

        {/* Admin user card */}
        <div
          style={{
            margin: "8px 12px 0",
            borderTop: "1px solid rgba(255,255,255,0.08)",
            paddingTop: 16,
            position: "relative",
          }}
        >
          <div
            style={{
              padding: "10px 12px",
              background: "rgba(255,255,255,0.05)",
              borderRadius: RADIUS.sm,
              cursor: "pointer",
            }}
            onClick={() => setShowLogout((v) => !v)}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontWeight: 700, fontSize: 13, color: "#FFFFFF" }}>
                {auth?.name || "Admin"}
              </span>
              <span style={{ fontSize: 9, color: "rgba(255,255,255,0.4)" }}>▾</span>
            </div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>
              Platform Administrator
            </div>

            {showLogout && (
              <div
                style={{
                  position: "absolute",
                  bottom: "105%",
                  left: 0,
                  right: 0,
                  background: COLORS.surf,
                  border: `1px solid ${COLORS.border}`,
                  borderRadius: RADIUS.sm,
                  boxShadow: SHADOW.md,
                  overflow: "hidden",
                  zIndex: 100,
                }}
              >
                <button
                  onClick={(e) => { e.stopPropagation(); handleLogout(); }}
                  style={{
                    display: "block", width: "100%", textAlign: "left",
                    padding: "10px 14px", background: "none", border: "none",
                    cursor: "pointer", fontFamily: "inherit", fontSize: 13,
                    fontWeight: 600, color: "#DC2626",
                  }}
                >
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Admin Content Area */}
      <main style={{ flex: 1, minWidth: 0, overflowY: "auto" }}>
        <Routes>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/learners" element={<AdminLearners />} />
          <Route path="/admin/intelligence" element={<AdminIntelligence />} />
          <Route path="/admin/capability-map" element={<CapabilityMap />} />
          <Route path="/admin/skills-gap" element={<SkillsGap />} />
          <Route path="/admin/role-disruption" element={<RoleDisruption />} />
          <Route path="/admin/interventions" element={<InterventionPlanner />} />
          <Route path="/admin/reports" element={<AdminReports />} />
          <Route path="/admin/governance" element={<GovernanceRisk />} />
          <Route path="/admin/system-health" element={<SystemHealth />} />
          <Route path="/admin/audit-logs" element={<AuditLogs />} />
          <Route path="/admin/module-notes" element={<AdminModuleNotes />} />
          <Route path="/admin/integrations" element={<AdminIntegrations />} />
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
      </main>

      <Toast />
    </div>
  );
}
