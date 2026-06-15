import React from "react";
import { COLORS, TYPE_SCALE, SHADOW, RADIUS } from "../theme/tokens.js";
import { useAppStore } from "../store/AppStore.jsx";
import { getTierForXP, getNextTier } from "../data/tiers.js";
import { getLevelForXP, getLevelProgress, getNextLevel } from "../data/levels.js";
import { getModulesForIndustry } from "../data/modules.js";
import RecommendationRail from "../components/RecommendationRail.jsx";

export default function Dashboard() {
  const { learner, currentIndustry } = useAppStore();
  const tier = getTierForXP(learner.xp);
  const nextTier = getNextTier(learner.xp);
  const level = getLevelForXP(learner.xp);
  const nextLevel = getNextLevel(learner.xp);
  const progress = getLevelProgress(learner.xp);

  const modules = getModulesForIndustry(currentIndustry.id);
  const completed = modules.filter((m) => learner.completedModuleIds.includes(m.id));
  const capabilityProgress = currentIndustry.capabilities.map((cap) => {
    const capModules = modules.filter((m) => m.capabilityId === cap.id);
    const capCompleted = capModules.filter((m) => learner.completedModuleIds.includes(m.id));
    const pct = capModules.length ? capCompleted.length / capModules.length : 0;
    return { ...cap, pct, total: capModules.length, completed: capCompleted.length };
  });

  return (
    <div style={{ padding: "40px 48px", maxWidth: 1100 }}>
      <div style={{ ...TYPE_SCALE.caption, color: COLORS.muted2, textTransform: "uppercase" }}>
        {currentIndustry.name}
      </div>
      <h1 style={{ ...TYPE_SCALE.display, marginTop: 6 }}>Welcome back, {firstName(learner.name)}</h1>
      <p style={{ ...TYPE_SCALE.body, color: COLORS.muted, marginTop: 10, maxWidth: 620 }}>
        {currentIndustry.summary}
      </p>

      {/* Status row */}
      <div style={{ display: "flex", gap: 16, marginTop: 32 }}>
        <StatCard
          label="Current tier"
          value={tier.name}
          accent={tier.color}
          footnote={
            nextTier
              ? `${(nextTier.minXP - learner.xp).toLocaleString()} XP to ${nextTier.name}`
              : "Highest tier reached"
          }
        />
        <StatCard
          label="Level"
          value={`Level ${level.level}`}
          accent={COLORS.acc}
          footnote={level.title}
          progress={progress}
        />
        <StatCard
          label="Modules completed"
          value={`${completed.length} / ${modules.length}`}
          accent={COLORS.green}
          footnote={nextLevel ? `${(nextLevel.xpRequired - learner.xp).toLocaleString()} XP to Level ${nextLevel.level}` : "Max level reached"}
        />
      </div>

      {/* Capability progress */}
      <section style={{ marginTop: 40 }}>
        <h2 style={{ ...TYPE_SCALE.sectionTitle, marginBottom: 16 }}>Capability progress</h2>
        <div
          style={{
            background: COLORS.surf,
            border: `1px solid ${COLORS.border}`,
            borderRadius: RADIUS.md,
            boxShadow: SHADOW.sm,
            padding: 8,
          }}
        >
          {capabilityProgress.map((cap, i) => (
            <div
              key={cap.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                padding: "14px 16px",
                borderTop: i === 0 ? "none" : `1px solid ${COLORS.border}`,
              }}
            >
              <div style={{ flex: "0 0 220px", ...TYPE_SCALE.cardTitle }}>{cap.name}</div>
              <div
                style={{
                  flex: 1,
                  height: 6,
                  borderRadius: 999,
                  background: COLORS.border,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${Math.round(cap.pct * 100)}%`,
                    background: cap.pct >= 1 ? COLORS.green : COLORS.acc,
                    borderRadius: 999,
                  }}
                />
              </div>
              <div style={{ flex: "0 0 90px", textAlign: "right", ...TYPE_SCALE.caption, color: COLORS.muted2 }}>
                {cap.completed}/{cap.total} modules
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Recommendations */}
      <section style={{ marginTop: 40, marginBottom: 40 }}>
        <h2 style={{ ...TYPE_SCALE.sectionTitle, marginBottom: 16 }}>Recommended for you</h2>
        <RecommendationRail
          industryId={currentIndustry.id}
          completedModuleIds={learner.completedModuleIds}
        />
      </section>
    </div>
  );
}

function StatCard({ label, value, accent, footnote, progress }) {
  return (
    <div
      style={{
        flex: 1,
        background: COLORS.surf,
        border: `1px solid ${COLORS.border}`,
        borderRadius: RADIUS.md,
        boxShadow: SHADOW.sm,
        padding: 20,
      }}
    >
      <div style={{ ...TYPE_SCALE.caption, color: COLORS.muted2, textTransform: "uppercase" }}>
        {label}
      </div>
      <div style={{ ...TYPE_SCALE.pageTitle, fontSize: 24, marginTop: 6, color: accent }}>
        {value}
      </div>
      {typeof progress === "number" && (
        <div
          style={{
            marginTop: 10,
            height: 4,
            borderRadius: 999,
            background: COLORS.border,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${Math.round(progress * 100)}%`,
              background: accent,
              borderRadius: 999,
            }}
          />
        </div>
      )}
      <div style={{ ...TYPE_SCALE.caption, color: COLORS.muted2, marginTop: 10 }}>{footnote}</div>
    </div>
  );
}

function firstName(name) {
  return name.split(" ")[0];
}
