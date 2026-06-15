import React from "react";
import { NavLink } from "react-router-dom";
import { COLORS, SHADOW, RADIUS, FONT_FAMILY_DISPLAY, TYPE_SCALE } from "../theme/tokens.js";
import { useAppStore } from "../store/AppStore.jsx";
import { getTierForXP } from "../data/tiers.js";
import { getLevelForXP, getLevelProgress } from "../data/levels.js";

const NAV_ITEMS = [
  { to: "/", label: "Dashboard" },
  { to: "/capability-map", label: "Capability Map" },
  { to: "/academy", label: "Academy" },
  { to: "/reports", label: "Reports & Exco" },
];

export default function LearnerNav() {
  const { learner } = useAppStore();
  const tier = getTierForXP(learner.xp);
  const level = getLevelForXP(learner.xp);
  const progress = getLevelProgress(learner.xp);

  return (
    <nav
      style={{
        width: 248,
        flexShrink: 0,
        background: COLORS.surf,
        borderRight: `1px solid ${COLORS.border}`,
        display: "flex",
        flexDirection: "column",
        padding: "28px 20px",
        gap: 28,
      }}
    >
      <div>
        <div
          style={{
            fontFamily: FONT_FAMILY_DISPLAY,
            fontWeight: 700,
            fontSize: 20,
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

      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            style={({ isActive }) => ({
              display: "block",
              padding: "10px 12px",
              borderRadius: RADIUS.sm,
              fontSize: 14,
              fontWeight: 600,
              color: isActive ? COLORS.acc : COLORS.muted,
              background: isActive ? COLORS.surf3 : "transparent",
              transition: "background 120ms ease, color 120ms ease",
            })}
          >
            {item.label}
          </NavLink>
        ))}
      </div>

      <div style={{ marginTop: "auto" }}>
        <div
          style={{
            border: `1px solid ${COLORS.border}`,
            borderRadius: RADIUS.md,
            padding: 16,
            background: COLORS.surf2,
            boxShadow: SHADOW.sm,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ ...TYPE_SCALE.cardTitle, color: COLORS.text }}>{learner.name}</span>
            <span
              style={{
                ...TYPE_SCALE.caption,
                color: tier.color,
                border: `1px solid ${tier.color}`,
                borderRadius: 999,
                padding: "2px 8px",
              }}
            >
              {tier.name}
            </span>
          </div>
          <div style={{ ...TYPE_SCALE.caption, color: COLORS.muted2, marginTop: 4 }}>
            Level {level.level} · {level.title}
          </div>
          <div
            style={{
              marginTop: 10,
              height: 6,
              borderRadius: 999,
              background: COLORS.border,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${Math.round(progress * 100)}%`,
                background: COLORS.acc,
                borderRadius: 999,
                transition: "width 240ms ease",
              }}
            />
          </div>
          <div style={{ ...TYPE_SCALE.caption, color: COLORS.muted2, marginTop: 6 }}>
            {learner.xp.toLocaleString()} XP
          </div>
        </div>
      </div>
    </nav>
  );
}
