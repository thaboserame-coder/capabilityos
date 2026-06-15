import React from "react";
import { COLORS, TYPE_SCALE, SHADOW, RADIUS, XP } from "../theme/tokens.js";
import { useAppStore } from "../store/AppStore.jsx";
import { getModulesForIndustry } from "../data/modules.js";

export default function Academy() {
  const { learner, currentIndustry, completeModule } = useAppStore();
  const modules = getModulesForIndustry(currentIndustry.id);

  return (
    <div style={{ padding: "40px 48px", maxWidth: 1100 }}>
      <div style={{ ...TYPE_SCALE.caption, color: COLORS.muted2, textTransform: "uppercase" }}>
        {currentIndustry.name}
      </div>
      <h1 style={{ ...TYPE_SCALE.pageTitle, marginTop: 6 }}>Academy</h1>
      <p style={{ ...TYPE_SCALE.body, color: COLORS.muted, marginTop: 10, maxWidth: 620 }}>
        Curated modules that build the capabilities behind {currentIndustry.name.toLowerCase()}
        {" "}transformation programmes.
      </p>

      <div style={{ marginTop: 32, display: "flex", flexDirection: "column", gap: 12 }}>
        {modules.map((module) => {
          const isComplete = learner.completedModuleIds.includes(module.id);
          const capability = currentIndustry.capabilities.find(
            (c) => c.id === module.capabilityId
          );

          return (
            <div
              key={module.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 20,
                background: COLORS.surf,
                border: `1px solid ${COLORS.border}`,
                borderRadius: RADIUS.md,
                boxShadow: SHADOW.sm,
                padding: 20,
              }}
            >
              <div style={{ flex: 1 }}>
                {capability && (
                  <div
                    style={{
                      ...TYPE_SCALE.caption,
                      color: COLORS.acc,
                      textTransform: "uppercase",
                    }}
                  >
                    {capability.name}
                  </div>
                )}
                <div style={{ ...TYPE_SCALE.cardTitle, fontSize: 16, marginTop: 4 }}>
                  {module.title}
                </div>
                <div style={{ ...TYPE_SCALE.body, color: COLORS.muted, marginTop: 6 }}>
                  {module.description}
                </div>
                <div style={{ ...TYPE_SCALE.caption, color: COLORS.muted2, marginTop: 10 }}>
                  {module.durationMins} min · {module.quizQuestions} quiz questions · up to{" "}
                  {XP.MODULE + module.quizQuestions * XP.QUIZ_Q + XP.PERFECT} XP
                </div>
              </div>

              <button
                disabled={isComplete}
                onClick={() => completeModule(module.id, XP.MODULE)}
                style={{
                  flexShrink: 0,
                  border: "none",
                  borderRadius: RADIUS.sm,
                  padding: "10px 18px",
                  fontWeight: 600,
                  fontSize: 14,
                  cursor: isComplete ? "default" : "pointer",
                  background: isComplete ? COLORS.surf2 : COLORS.acc,
                  color: isComplete ? COLORS.green : "#FFFFFF",
                  border: isComplete ? `1px solid ${COLORS.border}` : "none",
                }}
              >
                {isComplete ? "Completed" : `Start · +${XP.MODULE} XP`}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
