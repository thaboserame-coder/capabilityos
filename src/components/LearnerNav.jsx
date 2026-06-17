import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { COLORS, SHADOW, RADIUS, FONT_FAMILY_DISPLAY, TYPE_SCALE } from "../theme/tokens.js";
import { useAppStore } from "../store/AppStore.jsx";
import { getLevelForXP, getLevelProgress } from "../data/levels.js";

const ALL_NAV = [
  { to: "/",            label: "Home",             icon: "⊞", roles: null },
  { to: "/learning",    label: "My Learning",      icon: "◎", roles: null },
  { to: "/assess",      label: "Capability Check", icon: "◉", roles: null },
  { to: "/missions",    label: "My Challenges",    icon: "⚡", roles: null },
  { to: "/use-cases",   label: "AI at Work",       icon: "◈", roles: null },
  { to: "/prompt-lab",  label: "AI Toolkit",       icon: "⌘", roles: null },
  { to: "/progress",    label: "My Progress",      icon: "▲", roles: null },
  { to: "/reports",     label: "Reports",          icon: "⊟", roles: ["executive", "functional", "facilitator"] },
];

export default function LearnerNav() {
  const { auth, xp, logout } = useAppStore();
  const navigate = useNavigate();
  const [showLogout, setShowLogout] = useState(false);

  const level = getLevelForXP(xp);
  const { pct } = getLevelProgress(xp);
  const next = getLevelProgress(xp).next;

  const navItems = ALL_NAV.filter(
    (item) => !item.roles || (auth?.role && item.roles.includes(auth.role))
  );

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <nav
      style={{
        width: 240,
        flexShrink: 0,
        background: COLORS.surf,
        borderRight: `1px solid ${COLORS.border}`,
        display: "flex",
        flexDirection: "column",
        padding: "24px 16px",
        gap: 24,
        minHeight: "100vh",
        position: "sticky",
        top: 0,
      }}
    >
      {/* Wordmark */}
      <div style={{ paddingLeft: 4 }}>
        <div
          style={{
            fontFamily: FONT_FAMILY_DISPLAY,
            fontWeight: 700,
            fontSize: 19,
            color: COLORS.text,
            letterSpacing: "-0.01em",
          }}
        >
          CapabilityOS
        </div>
        <div style={{ ...TYPE_SCALE.caption, color: COLORS.muted2, marginTop: 2 }}>
          Digilytics Co
        </div>
      </div>

      {/* Nav links */}
      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/"}
            style={({ isActive }) => ({
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "9px 12px",
              borderRadius: RADIUS.sm,
              fontSize: 14,
              fontWeight: isActive ? 700 : 500,
              color: isActive ? COLORS.acc : COLORS.muted,
              background: isActive ? COLORS.acc + "10" : "transparent",
              transition: "background 120ms ease, color 120ms ease",
              textDecoration: "none",
            })}
          >
            <span style={{ fontSize: 13, opacity: 0.7 }}>{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </div>

      {/* User card */}
      <div style={{ marginTop: "auto" }}>
        <div
          style={{
            border: `1px solid ${COLORS.border}`,
            borderRadius: RADIUS.md,
            padding: 14,
            background: COLORS.bg,
            boxShadow: SHADOW.sm,
            cursor: "pointer",
            position: "relative",
          }}
          onClick={() => setShowLogout((v) => !v)}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontWeight: 700, fontSize: 14, color: COLORS.text }}>
              {auth?.name || "Guest"}
            </span>
            <span style={{ fontSize: 10, color: COLORS.muted2 }}>▾</span>
          </div>
          <div style={{ ...TYPE_SCALE.caption, color: COLORS.muted2, marginTop: 2 }}>
            {auth?.role} · {level.name}
          </div>

          {/* XP progress */}
          <div style={{ marginTop: 10, height: 5, borderRadius: 999, background: COLORS.border, overflow: "hidden" }}>
            <div
              style={{
                height: "100%",
                width: `${pct}%`,
                background: COLORS.acc,
                borderRadius: 999,
                transition: "width 300ms ease",
              }}
            />
          </div>
          <div style={{ ...TYPE_SCALE.caption, color: COLORS.muted2, marginTop: 5, display: "flex", justifyContent: "space-between" }}>
            <span>{xp.toLocaleString()} XP</span>
            {next && <span>→ {next.name}</span>}
          </div>

          {/* Logout dropdown */}
          {showLogout && (
            <div
              style={{
                position: "absolute", bottom: "110%", left: 0, right: 0,
                background: COLORS.surf, border: `1px solid ${COLORS.border}`,
                borderRadius: RADIUS.sm, boxShadow: SHADOW.md,
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
  );
}
