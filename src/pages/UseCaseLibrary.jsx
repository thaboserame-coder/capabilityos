import React, { useState } from "react";
import { COLORS, TYPE_SCALE, SHADOW, RADIUS } from "../theme/tokens.js";
import { USE_CASES } from "../store/AppStore.jsx";

// USE_CASES fields: id, country, flag, sector, roles, title, challenge, solution, impact, roi

const SECTORS = ["All", ...Array.from(new Set(USE_CASES.map((u) => u.sector)))];

export default function UseCaseLibrary() {
  const [activeSector, setActiveSector] = useState("All");
  const [expanded, setExpanded] = useState(null);

  const filtered = USE_CASES.filter(
    (u) => activeSector === "All" || u.sector === activeSector
  );

  return (
    <div style={{ padding: "40px 48px", maxWidth: 1060 }}>
      <div style={{ ...TYPE_SCALE.caption, color: COLORS.muted2, textTransform: "uppercase" }}>
        Pan-African AI Applications
      </div>
      <h1 style={{ ...TYPE_SCALE.pageTitle, marginTop: 6 }}>Use Case Library</h1>
      <p style={{ ...TYPE_SCALE.body, color: COLORS.muted, marginTop: 10, maxWidth: 600 }}>
        Real-world AI deployments from African enterprises and public institutions. Use these to identify opportunities and build the business case for AI investment.
      </p>

      {/* Sector filters */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 24, marginBottom: 24 }}>
        {SECTORS.map((s) => {
          const active = s === activeSector;
          return (
            <button
              key={s}
              onClick={() => setActiveSector(s)}
              style={{
                padding: "6px 14px", borderRadius: 999, cursor: "pointer",
                fontFamily: "inherit", fontSize: 13, fontWeight: active ? 700 : 500,
                border: `1.5px solid ${active ? COLORS.acc : COLORS.border}`,
                background: active ? COLORS.acc : COLORS.surf,
                color: active ? "#fff" : COLORS.muted,
                transition: "all .12s",
              }}
            >
              {s}
            </button>
          );
        })}
      </div>

      {/* Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 14 }}>
        {filtered.map((uc) => {
          const isExpanded = expanded === uc.id;
          return (
            <div
              key={uc.id}
              style={{
                background: COLORS.surf,
                border: `1px solid ${COLORS.border}`,
                borderRadius: RADIUS.md, boxShadow: SHADOW.sm,
                display: "flex", flexDirection: "column",
                overflow: "hidden",
              }}
            >
              {/* Accent bar */}
              <div style={{ height: 3, background: COLORS.acc }} />

              <div style={{ padding: "16px 18px", flex: 1, display: "flex", flexDirection: "column" }}>
                {/* Tags */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 10 }}>
                  <span style={{ fontSize: 14 }}>{uc.flag}</span>
                  <span
                    style={{
                      fontSize: 11, fontWeight: 700, padding: "2px 8px",
                      background: COLORS.acc + "14", color: COLORS.acc,
                      borderRadius: 999, textTransform: "uppercase", letterSpacing: "0.04em",
                    }}
                  >
                    {uc.sector}
                  </span>
                  <span style={{ fontSize: 11, color: COLORS.muted2, padding: "2px 0" }}>
                    {uc.country}
                  </span>
                </div>

                <div style={{ ...TYPE_SCALE.cardTitle, fontSize: 15, lineHeight: 1.4 }}>{uc.title}</div>

                <p style={{ ...TYPE_SCALE.body, color: COLORS.muted, marginTop: 8, fontSize: 13, flex: 1, lineHeight: 1.55 }}>
                  {uc.challenge}
                </p>

                {/* ROI badge */}
                {uc.roi && (
                  <div
                    style={{
                      display: "inline-flex", alignItems: "center", gap: 4,
                      background: COLORS.green + "12", border: `1px solid ${COLORS.green}30`,
                      borderRadius: 999, padding: "3px 10px", marginTop: 8,
                      fontSize: 12, fontWeight: 700, color: COLORS.green,
                      alignSelf: "flex-start",
                    }}
                  >
                    📈 {uc.roi}
                  </div>
                )}

                {/* Expanded detail */}
                {isExpanded && (
                  <div style={{ marginTop: 14, paddingTop: 14, borderTop: `1px solid ${COLORS.border}` }}>
                    <div style={{ marginBottom: 10 }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: COLORS.muted2, textTransform: "uppercase", marginBottom: 4 }}>
                        Solution
                      </div>
                      <div style={{ fontSize: 13, color: COLORS.text, lineHeight: 1.55 }}>{uc.solution}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: COLORS.muted2, textTransform: "uppercase", marginBottom: 4 }}>
                        Impact
                      </div>
                      <div style={{ fontSize: 13, color: COLORS.text, lineHeight: 1.55 }}>{uc.impact}</div>
                    </div>
                  </div>
                )}

                <button
                  onClick={() => setExpanded(isExpanded ? null : uc.id)}
                  style={{
                    marginTop: 12, padding: "7px 0",
                    background: "none", border: "none", cursor: "pointer",
                    fontFamily: "inherit", fontSize: 12, fontWeight: 600,
                    color: COLORS.acc, textAlign: "left",
                  }}
                >
                  {isExpanded ? "↑ Show less" : "↓ Show solution & impact"}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div style={{ ...TYPE_SCALE.body, color: COLORS.muted, textAlign: "center", marginTop: 60 }}>
          No use cases found for this sector.
        </div>
      )}
    </div>
  );
}
