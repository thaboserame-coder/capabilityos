import React from "react";
import { COLORS, SHADOW, RADIUS, TYPE_SCALE } from "../theme/tokens.js";
import { getModulesForIndustry } from "../data/modules.js";

// A focused side drawer for capability detail. The drawer surface itself
// follows the light executive theme; only the backdrop scrim is dark,
// which is standard modal practice and keeps focus on the drawer content.
export default function CapabilityDetailDrawer({ capability, industryId, onClose }) {
  if (!capability) return null;

  const relatedModules = getModulesForIndustry(industryId).filter(
    (m) => m.capabilityId === capability.id
  );

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1100,
        display: "flex",
        justifyContent: "flex-end",
      }}
    >
      {/* Backdrop scrim — intentionally dark, per design system */}
      <div
        onClick={onClose}
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(15, 27, 45, 0.45)",
        }}
      />

      <aside
        style={{
          position: "relative",
          width: 420,
          maxWidth: "90vw",
          height: "100%",
          background: COLORS.surf,
          boxShadow: SHADOW.lg,
          padding: 28,
          overflowY: "auto",
        }}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          style={{
            position: "absolute",
            top: 20,
            right: 20,
            border: "none",
            background: "transparent",
            color: COLORS.muted,
            fontSize: 20,
            cursor: "pointer",
            lineHeight: 1,
          }}
        >
          ×
        </button>

        <div
          style={{
            ...TYPE_SCALE.caption,
            color: COLORS.purple,
            textTransform: "uppercase",
          }}
        >
          {capability.level} Capability
        </div>
        <h2 style={{ ...TYPE_SCALE.pageTitle, marginTop: 8 }}>{capability.name}</h2>

        <div style={{ ...TYPE_SCALE.sectionTitle, marginTop: 28, marginBottom: 12 }}>
          Related modules
        </div>

        {relatedModules.length === 0 ? (
          <div style={{ ...TYPE_SCALE.body, color: COLORS.muted }}>
            No modules currently mapped to this capability.
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {relatedModules.map((module) => (
              <div
                key={module.id}
                style={{
                  border: `1px solid ${COLORS.border}`,
                  borderRadius: RADIUS.md,
                  padding: 14,
                }}
              >
                <div style={{ ...TYPE_SCALE.cardTitle }}>{module.title}</div>
                <div style={{ ...TYPE_SCALE.caption, color: COLORS.muted2, marginTop: 4 }}>
                  {module.durationMins} min · {module.quizQuestions} quiz questions
                </div>
              </div>
            ))}
          </div>
        )}
      </aside>
    </div>
  );
}
