import React, { useState } from "react";
import { COLORS, TYPE_SCALE, SHADOW, RADIUS } from "../theme/tokens.js";
import { useAppStore, PROMPT_TEMPLATES } from "../store/AppStore.jsx";

// AppStore PROMPT_TEMPLATES fields: id, roles, level, cat, icon, color, dur, title, desc, template, tip

const CATEGORIES = ["All", ...Array.from(new Set(PROMPT_TEMPLATES.map((p) => p.cat)))];

export default function PromptLab() {
  const { auth } = useAppStore();
  const [activeCat, setActiveCat] = useState("All");
  const [expanded, setExpanded] = useState(null);
  const [copied, setCopied] = useState(null);

  const filtered = PROMPT_TEMPLATES.filter(
    (p) => activeCat === "All" || p.cat === activeCat
  );

  function copyPrompt(id, text) {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  }

  return (
    <div style={{ padding: "40px 48px", maxWidth: 1000 }}>
      <div style={{ ...TYPE_SCALE.caption, color: COLORS.muted2, textTransform: "uppercase" }}>
        AI Productivity
      </div>
      <h1 style={{ ...TYPE_SCALE.pageTitle, marginTop: 6 }}>Prompt Lab</h1>
      <p style={{ ...TYPE_SCALE.body, color: COLORS.muted, marginTop: 10, maxWidth: 580 }}>
        Curated prompt templates designed for executive and leadership workflows. Copy, adapt, and deploy these in ChatGPT, Copilot, or any AI assistant.
      </p>

      {/* Category filter */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 24, marginBottom: 24 }}>
        {CATEGORIES.map((cat) => {
          const active = cat === activeCat;
          return (
            <button
              key={cat}
              onClick={() => setActiveCat(cat)}
              style={{
                padding: "6px 14px", borderRadius: 999, cursor: "pointer",
                fontFamily: "inherit", fontSize: 13, fontWeight: active ? 700 : 500,
                border: `1.5px solid ${active ? COLORS.acc : COLORS.border}`,
                background: active ? COLORS.acc : COLORS.surf,
                color: active ? "#fff" : COLORS.muted,
                transition: "all .12s",
              }}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(420px, 1fr))", gap: 14 }}>
        {filtered.map((p) => {
          const isExpanded = expanded === p.id;
          return (
            <div
              key={p.id}
              style={{
                background: COLORS.surf,
                border: `1px solid ${COLORS.border}`,
                borderRadius: RADIUS.md, boxShadow: SHADOW.sm,
                overflow: "hidden",
              }}
            >
              {/* Header */}
              <div style={{ padding: "16px 18px", borderBottom: isExpanded ? `1px solid ${COLORS.border}` : "none" }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 10 }}>
                  <span style={{ fontSize: 22, lineHeight: 1.2 }}>{p.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap", marginBottom: 5 }}>
                      <span
                        style={{
                          ...TYPE_SCALE.caption, fontSize: 11, fontWeight: 700,
                          background: COLORS.accSoft + "20",
                          color: COLORS.acc, borderRadius: 999, padding: "2px 8px",
                          textTransform: "uppercase", letterSpacing: "0.05em",
                        }}
                      >
                        {p.cat}
                      </span>
                      <span style={{ fontSize: 11, color: COLORS.muted2 }}>⏱ {p.dur}</span>
                    </div>
                    <div style={{ ...TYPE_SCALE.cardTitle, fontSize: 15 }}>{p.title}</div>
                    <p style={{ ...TYPE_SCALE.body, color: COLORS.muted, marginTop: 4, fontSize: 13 }}>
                      {p.desc}
                    </p>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    onClick={() => setExpanded(isExpanded ? null : p.id)}
                    style={{
                      padding: "6px 12px", borderRadius: RADIUS.sm, cursor: "pointer",
                      fontFamily: "inherit", fontSize: 12, fontWeight: 600,
                      border: `1px solid ${COLORS.border}`,
                      background: isExpanded ? COLORS.acc + "10" : COLORS.surf,
                      color: isExpanded ? COLORS.acc : COLORS.muted,
                    }}
                  >
                    {isExpanded ? "Hide" : "View prompt"}
                  </button>
                  <button
                    onClick={() => copyPrompt(p.id, p.template)}
                    style={{
                      padding: "6px 12px", borderRadius: RADIUS.sm, cursor: "pointer",
                      fontFamily: "inherit", fontSize: 12, fontWeight: 600,
                      border: "none",
                      background: copied === p.id ? COLORS.green + "18" : COLORS.acc,
                      color: copied === p.id ? COLORS.green : "#fff",
                      transition: "all .15s",
                    }}
                  >
                    {copied === p.id ? "✓ Copied!" : "Copy"}
                  </button>
                </div>
              </div>

              {/* Expanded prompt */}
              {isExpanded && (
                <div>
                  <div style={{ padding: "14px 18px", background: "#F8FAFC", borderBottom: `1px solid ${COLORS.border}` }}>
                    <pre
                      style={{
                        margin: 0, fontSize: 12.5, lineHeight: 1.65,
                        whiteSpace: "pre-wrap", wordBreak: "break-word",
                        fontFamily: "'Courier New', monospace",
                        color: "#1E293B",
                      }}
                    >
                      {p.template}
                    </pre>
                  </div>
                  {p.tip && (
                    <div
                      style={{
                        padding: "10px 18px",
                        background: COLORS.acc + "06",
                        display: "flex", gap: 8, alignItems: "flex-start",
                      }}
                    >
                      <span style={{ fontSize: 14 }}>💡</span>
                      <span style={{ fontSize: 12, color: COLORS.muted, lineHeight: 1.5 }}>{p.tip}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div style={{ ...TYPE_SCALE.body, color: COLORS.muted, textAlign: "center", marginTop: 60 }}>
          No prompts in this category yet.
        </div>
      )}
    </div>
  );
}
