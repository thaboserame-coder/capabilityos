import React from "react";
import { COLORS, SHADOW, RADIUS, TYPE_SCALE } from "../theme/tokens.js";
import { getModulesForIndustry } from "../data/modules.js";
import { XP } from "../theme/tokens.js";

export default function RecommendationRail({ industryId, completedModuleIds = [], onSelect }) {
  const modules = getModulesForIndustry(industryId).filter(
    (m) => !completedModuleIds.includes(m.id)
  );

  if (modules.length === 0) {
    return (
      <div
        style={{
          border: `1px solid ${COLORS.border}`,
          borderRadius: RADIUS.md,
          background: COLORS.surf,
          padding: 24,
          ...TYPE_SCALE.body,
          color: COLORS.muted,
        }}
      >
        You're up to date — no recommended modules for this industry right now.
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        gap: 16,
        overflowX: "auto",
        paddingBottom: 4,
      }}
    >
      {modules.map((module) => (
        <button
          key={module.id}
          onClick={() => onSelect && onSelect(module)}
          style={{
            flex: "0 0 260px",
            textAlign: "left",
            background: COLORS.surf,
            border: `1px solid ${COLORS.border}`,
            borderRadius: RADIUS.md,
            boxShadow: SHADOW.sm,
            padding: 18,
            cursor: "pointer",
            transition: "border-color 120ms ease, box-shadow 120ms ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = COLORS.borderH;
            e.currentTarget.style.boxShadow = SHADOW.md;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = COLORS.border;
            e.currentTarget.style.boxShadow = SHADOW.sm;
          }}
        >
          <div
            style={{
              ...TYPE_SCALE.caption,
              color: COLORS.acc,
              textTransform: "uppercase",
            }}
          >
            Recommended
          </div>
          <div style={{ ...TYPE_SCALE.cardTitle, color: COLORS.text, marginTop: 6 }}>
            {module.title}
          </div>
          <div style={{ ...TYPE_SCALE.body, color: COLORS.muted, marginTop: 8 }}>
            {module.description}
          </div>
          <div
            style={{
              ...TYPE_SCALE.caption,
              color: COLORS.muted2,
              marginTop: 12,
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <span>{module.durationMins} min</span>
            <span>+{XP.MODULE} XP</span>
          </div>
        </button>
      ))}
    </div>
  );
}
