import React, { useState } from "react";
import { COLORS, TYPE_SCALE, SHADOW, RADIUS } from "../theme/tokens.js";
import { useAppStore } from "../store/AppStore.jsx";
import { getModulesForIndustry } from "../data/modules.js";
import CapabilityDetailDrawer from "../components/CapabilityDetailDrawer.jsx";

const LEVEL_COLOR = {
  Foundational: COLORS.muted2,
  Core: COLORS.acc,
  Advanced: COLORS.purple,
};

export default function CapabilityMap() {
  const { learner, currentIndustry } = useAppStore();
  const [selected, setSelected] = useState(null);
  const modules = getModulesForIndustry(currentIndustry.id);

  return (
    <div style={{ padding: "40px 48px", maxWidth: 1100 }}>
      <div style={{ ...TYPE_SCALE.caption, color: COLORS.muted2, textTransform: "uppercase" }}>
        {currentIndustry.name}
      </div>
      <h1 style={{ ...TYPE_SCALE.pageTitle, marginTop: 6 }}>Capability Map</h1>
      <p style={{ ...TYPE_SCALE.body, color: COLORS.muted, marginTop: 10, maxWidth: 620 }}>
        The capability areas that define readiness for {currentIndustry.name.toLowerCase()}.
        Select a capability to see related learning modules.
      </p>

      <div
        style={{
          marginTop: 32,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
          gap: 16,
        }}
      >
        {currentIndustry.capabilities.map((cap) => {
          const capModules = modules.filter((m) => m.capabilityId === cap.id);
          const capCompleted = capModules.filter((m) =>
            learner.completedModuleIds.includes(m.id)
          );
          const pct = capModules.length ? capCompleted.length / capModules.length : 0;

          return (
            <button
              key={cap.id}
              onClick={() => setSelected(cap)}
              style={{
                textAlign: "left",
                background: COLORS.surf,
                border: `1px solid ${COLORS.border}`,
                borderRadius: RADIUS.md,
                boxShadow: SHADOW.sm,
                padding: 20,
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
                  display: "inline-block",
                  ...TYPE_SCALE.caption,
                  color: LEVEL_COLOR[cap.level] || COLORS.muted,
                  border: `1px solid ${LEVEL_COLOR[cap.level] || COLORS.border}`,
                  borderRadius: 999,
                  padding: "2px 8px",
                }}
              >
                {cap.level}
              </div>
              <div style={{ ...TYPE_SCALE.sectionTitle, fontSize: 17, marginTop: 12 }}>
                {cap.name}
              </div>
              <div
                style={{
                  marginTop: 16,
                  height: 6,
                  borderRadius: 999,
                  background: COLORS.border,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${Math.round(pct * 100)}%`,
                    background: pct >= 1 ? COLORS.green : COLORS.acc,
                    borderRadius: 999,
                  }}
                />
              </div>
              <div style={{ ...TYPE_SCALE.caption, color: COLORS.muted2, marginTop: 8 }}>
                {capModules.length
                  ? `${capCompleted.length}/${capModules.length} modules complete`
                  : "No modules mapped yet"}
              </div>
            </button>
          );
        })}
      </div>

      <CapabilityDetailDrawer
        capability={selected}
        industryId={currentIndustry.id}
        onClose={() => setSelected(null)}
      />
    </div>
  );
}
