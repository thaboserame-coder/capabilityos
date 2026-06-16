import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { COLORS, TYPE_SCALE, SHADOW, RADIUS } from "../theme/tokens.js";
import { useAppStore } from "../store/AppStore.jsx";

export default function Learning() {
  const { accessibleTiers, isModuleDone, auth } = useAppStore();
  const navigate = useNavigate();
  const [openTierId, setOpenTierId] = useState(accessibleTiers[0]?.id || null);

  const openTier = accessibleTiers.find((t) => t.id === openTierId);

  if (!accessibleTiers.length) {
    return (
      <div style={{ padding: "48px", maxWidth: 700 }}>
        <h1 style={{ ...TYPE_SCALE.pageTitle }}>Learning</h1>
        <p style={{ ...TYPE_SCALE.body, color: COLORS.muted, marginTop: 12 }}>
          Your role ({auth?.role}) does not have access to any learning tiers. Contact your platform administrator.
        </p>
      </div>
    );
  }

  return (
    <div style={{ padding: "40px 48px", maxWidth: 1100 }}>
      <div style={{ ...TYPE_SCALE.caption, color: COLORS.muted2, textTransform: "uppercase" }}>
        Learning Journey
      </div>
      <h1 style={{ ...TYPE_SCALE.pageTitle, marginTop: 6 }}>Your Learning Path</h1>
      <p style={{ ...TYPE_SCALE.body, color: COLORS.muted, marginTop: 10, maxWidth: 620 }}>
        Role-based AI learning programmes curated for {auth?.role === "executive" ? "board and executive" : auth?.role === "functional" ? "executive leadership" : auth?.role === "manager" ? "senior management" : "professional"} level.
      </p>

      {/* Tier tabs */}
      <div style={{ display: "flex", gap: 8, marginTop: 28, marginBottom: 24 }}>
        {accessibleTiers.map((tier) => {
          const done = tier.mods.filter((m) => isModuleDone(tier.id, m.id)).length;
          const isOpen = tier.id === openTierId;
          return (
            <button
              key={tier.id}
              onClick={() => setOpenTierId(tier.id)}
              style={{
                display: "flex", alignItems: "center", gap: 8,
                padding: "10px 18px", borderRadius: RADIUS.md, cursor: "pointer",
                fontFamily: "inherit",
                border: `2px solid ${isOpen ? tier.color : COLORS.border}`,
                background: isOpen ? tier.color + "12" : COLORS.surf,
                color: isOpen ? tier.color : COLORS.muted,
                fontWeight: isOpen ? 700 : 500, fontSize: 14,
                transition: "all .15s",
              }}
            >
              <span style={{ fontSize: 16 }}>{tier.icon}</span>
              <span>{tier.name}</span>
              <span
                style={{
                  marginLeft: 4, fontSize: 11, fontWeight: 700,
                  background: isOpen ? tier.color : COLORS.border,
                  color: isOpen ? "#fff" : COLORS.muted2,
                  borderRadius: 999, padding: "1px 7px",
                }}
              >
                {done}/{tier.mods.length}
              </span>
            </button>
          );
        })}
      </div>

      {/* Tier detail */}
      {openTier && (
        <div>
          {/* Tier header card */}
          <div
            style={{
              background: COLORS.surf,
              border: `1px solid ${COLORS.border}`,
              borderRadius: RADIUS.lg,
              boxShadow: SHADOW.sm,
              padding: 24,
              marginBottom: 24,
              borderLeft: `4px solid ${openTier.color}`,
            }}
          >
            <div style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
              <div
                style={{
                  width: 48, height: 48, borderRadius: RADIUS.md,
                  background: openTier.color + "18",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 24, flexShrink: 0,
                }}
              >
                {openTier.icon}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ ...TYPE_SCALE.caption, color: openTier.color, textTransform: "uppercase", fontWeight: 700 }}>
                  {openTier.level}
                </div>
                <div style={{ ...TYPE_SCALE.sectionTitle, fontSize: 20, marginTop: 4 }}>{openTier.name}</div>
                <p style={{ ...TYPE_SCALE.body, color: COLORS.muted, marginTop: 6, maxWidth: 560 }}>{openTier.description}</p>
                <div style={{ display: "flex", gap: 20, marginTop: 12 }}>
                  <div style={{ ...TYPE_SCALE.caption, color: COLORS.muted2 }}>
                    👥 {openTier.audience}
                  </div>
                  <div style={{ ...TYPE_SCALE.caption, color: COLORS.muted2 }}>
                    ⏱ {openTier.duration}
                  </div>
                </div>
              </div>
              {/* Progress ring / stat */}
              <div style={{ textAlign: "center", flexShrink: 0 }}>
                <div style={{ fontSize: 28, fontWeight: 800, color: openTier.color }}>
                  {openTier.mods.filter((m) => isModuleDone(openTier.id, m.id)).length}/{openTier.mods.length}
                </div>
                <div style={{ ...TYPE_SCALE.caption, color: COLORS.muted2 }}>modules</div>
              </div>
            </div>

            {/* Progress bar */}
            <div style={{ marginTop: 16, height: 6, borderRadius: 999, background: COLORS.border, overflow: "hidden" }}>
              <div
                style={{
                  height: "100%",
                  width: `${Math.round((openTier.mods.filter((m) => isModuleDone(openTier.id, m.id)).length / openTier.mods.length) * 100)}%`,
                  background: openTier.color, borderRadius: 999,
                  transition: "width .6s",
                }}
              />
            </div>
          </div>

          {/* Module list */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {openTier.mods.map((mod, idx) => {
              const done = isModuleDone(openTier.id, mod.id);
              return (
                <div
                  key={mod.id}
                  style={{
                    display: "flex", alignItems: "center", gap: 16,
                    background: COLORS.surf,
                    border: `1px solid ${done ? COLORS.green + "40" : COLORS.border}`,
                    borderRadius: RADIUS.md,
                    boxShadow: SHADOW.sm,
                    padding: "16px 20px",
                    transition: "border-color .15s",
                  }}
                >
                  {/* Index */}
                  <div
                    style={{
                      width: 32, height: 32, borderRadius: "50%", flexShrink: 0,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      background: done ? COLORS.green + "18" : openTier.color + "12",
                      ...TYPE_SCALE.caption, fontWeight: 800,
                      color: done ? COLORS.green : openTier.color,
                      fontSize: 13,
                    }}
                  >
                    {done ? "✓" : idx + 1}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ ...TYPE_SCALE.caption, color: openTier.color, textTransform: "uppercase", fontWeight: 700 }}>
                      {mod.type}
                    </div>
                    <div style={{ ...TYPE_SCALE.cardTitle, fontSize: 15, marginTop: 3 }}>{mod.title}</div>
                    <div style={{ ...TYPE_SCALE.body, color: COLORS.muted, marginTop: 4, fontSize: 13 }}>
                      {mod.summary}
                    </div>
                    <div style={{ ...TYPE_SCALE.caption, color: COLORS.muted2, marginTop: 6 }}>
                      ⏱ {mod.dur} · {mod.quiz?.length || 0} quiz questions · +{100 + (mod.quiz?.length || 0) * 10} XP
                    </div>
                  </div>

                  <button
                    onClick={() => navigate(`/module/${openTier.id}/${mod.id}`)}
                    style={{
                      flexShrink: 0, border: "none", borderRadius: RADIUS.sm,
                      padding: "10px 18px", fontWeight: 600, fontSize: 14,
                      cursor: "pointer", fontFamily: "inherit",
                      background: done ? COLORS.surf2 : openTier.color,
                      color: done ? COLORS.green : "#FFFFFF",
                      border: done ? `1px solid ${COLORS.border}` : "none",
                      boxShadow: done ? "none" : "0 2px 8px rgba(0,0,0,0.15)",
                    }}
                  >
                    {done ? "✓ Review" : "Start →"}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
