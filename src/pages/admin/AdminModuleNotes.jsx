import React, { useState } from "react";
import { COLORS, TYPE_SCALE, SHADOW, RADIUS } from "../../theme/tokens.js";
import { useAppStore } from "../../store/AppStore.jsx";
import { TIERS } from "../../data/tiers.js";

const INIT_NOTES = {};
TIERS.forEach((t) => {
  t.mods.forEach((m) => {
    INIT_NOTES[`${t.id}:${m.id}`] = {
      tierId: t.id,
      tierName: t.name,
      modId: m.id,
      modTitle: m.title,
      note: "",
      lastEdited: null,
    };
  });
});

export default function AdminModuleNotes() {
  const [notes, setNotes] = useState(INIT_NOTES);
  const [activeKey, setActiveKey] = useState(null);
  const [draft, setDraft] = useState("");
  const [saved, setSaved] = useState(null);
  const [filterTier, setFilterTier] = useState("all");
  const [search, setSearch] = useState("");

  function openNote(key) {
    setActiveKey(key);
    setDraft(notes[key]?.note || "");
  }

  function saveNote() {
    if (!activeKey) return;
    setNotes((prev) => ({
      ...prev,
      [activeKey]: { ...prev[activeKey], note: draft, lastEdited: new Date().toISOString().split("T")[0] },
    }));
    setSaved(activeKey);
    setTimeout(() => setSaved(null), 2000);
  }

  const allKeys = Object.keys(notes).filter((k) => {
    const n = notes[k];
    if (filterTier !== "all" && n.tierId !== filterTier) return false;
    if (search && !n.modTitle.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const withNotes = Object.keys(notes).filter((k) => notes[k].note).length;

  return (
    <div style={{ padding: "36px 48px", maxWidth: 1100 }}>
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: COLORS.muted2, textTransform: "uppercase", letterSpacing: "0.08em" }}>
          Platform
        </div>
        <h1 style={{ ...TYPE_SCALE.pageTitle, marginTop: 6 }}>Module Notes</h1>
        <p style={{ fontSize: 13, color: COLORS.muted, marginTop: 8, maxWidth: 620 }}>
          Add facilitator context, Momentum-specific examples, and cohort notes to any module. Notes appear as an instructor callout within the module reading experience.
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 24 }}>
        {[
          { label: "Total Modules",     value: Object.keys(notes).length, color: COLORS.text },
          { label: "Notes Added",       value: withNotes,                  color: COLORS.acc  },
          { label: "Tiers",             value: TIERS.length,               color: COLORS.muted2 },
        ].map((s) => (
          <div
            key={s.label}
            style={{
              background: COLORS.surf,
              border: `1px solid ${COLORS.border}`,
              borderRadius: RADIUS.md,
              boxShadow: SHADOW.sm,
              padding: "16px 20px",
              flex: 1,
              minWidth: 120,
            }}
          >
            <div style={{ fontSize: 24, fontWeight: 800, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 12, color: COLORS.muted2, marginTop: 3 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 10, marginBottom: 18 }}>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search modules…"
          style={{
            flex: 1,
            padding: "8px 14px",
            border: `1px solid ${COLORS.border}`,
            borderRadius: RADIUS.sm,
            fontSize: 13,
            fontFamily: "inherit",
            color: COLORS.text,
            background: COLORS.surf,
            outline: "none",
          }}
        />
        <select
          value={filterTier}
          onChange={(e) => setFilterTier(e.target.value)}
          style={{
            padding: "8px 14px",
            border: `1px solid ${COLORS.border}`,
            borderRadius: RADIUS.sm,
            fontSize: 13,
            fontFamily: "inherit",
            color: COLORS.text,
            background: COLORS.surf,
            cursor: "pointer",
          }}
        >
          <option value="all">All Tiers</option>
          {TIERS.map((t) => (
            <option key={t.id} value={t.id}>{t.name}</option>
          ))}
        </select>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: activeKey ? "1fr 400px" : "1fr", gap: 20 }}>
        {/* Module list */}
        <div
          style={{
            background: COLORS.surf,
            border: `1px solid ${COLORS.border}`,
            borderRadius: RADIUS.md,
            boxShadow: SHADOW.sm,
            overflow: "hidden",
          }}
        >
          {TIERS.filter((t) => filterTier === "all" || t.id === filterTier).map((tier) => {
            const tierMods = allKeys.filter((k) => notes[k].tierId === tier.id);
            if (tierMods.length === 0) return null;
            return (
              <div key={tier.id}>
                <div
                  style={{
                    padding: "10px 18px",
                    background: COLORS.bg,
                    borderBottom: `1px solid ${COLORS.border}`,
                    fontSize: 11,
                    fontWeight: 700,
                    color: COLORS.muted2,
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <span>{tier.icon}</span>
                  {tier.name}
                </div>
                {tierMods.map((key) => {
                  const n = notes[key];
                  const isActive = activeKey === key;
                  const hasNote = !!n.note;
                  return (
                    <div
                      key={key}
                      onClick={() => openNote(key)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        padding: "13px 18px",
                        borderBottom: `1px solid ${COLORS.border}`,
                        cursor: "pointer",
                        background: isActive ? COLORS.acc + "08" : "transparent",
                        borderLeft: isActive ? `3px solid ${COLORS.acc}` : "3px solid transparent",
                        transition: "background 120ms",
                      }}
                    >
                      <div
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          background: hasNote ? COLORS.green : COLORS.border,
                          flexShrink: 0,
                        }}
                      />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: COLORS.text }}>{n.modTitle}</div>
                        {n.lastEdited && (
                          <div style={{ fontSize: 11, color: COLORS.muted2, marginTop: 1 }}>
                            Last edited: {n.lastEdited}
                          </div>
                        )}
                      </div>
                      {hasNote && (
                        <span style={{ fontSize: 10, color: COLORS.green, fontWeight: 700 }}>✓ Note</span>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* Editor */}
        {activeKey && (
          <div
            style={{
              background: COLORS.surf,
              border: `1px solid ${COLORS.border}`,
              borderRadius: RADIUS.md,
              boxShadow: SHADOW.sm,
              padding: 24,
              position: "sticky",
              top: 20,
              height: "fit-content",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
              <div>
                <div style={{ fontSize: 11, color: COLORS.muted2, textTransform: "uppercase", fontWeight: 700 }}>
                  {notes[activeKey].tierName}
                </div>
                <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.text, marginTop: 3, lineHeight: 1.3 }}>
                  {notes[activeKey].modTitle}
                </div>
              </div>
              <button
                onClick={() => setActiveKey(null)}
                style={{ background: "none", border: "none", cursor: "pointer", fontSize: 18, color: COLORS.muted2 }}
              >
                ×
              </button>
            </div>

            <div style={{ fontSize: 12, color: COLORS.muted, marginBottom: 14, lineHeight: 1.5 }}>
              Add context, Momentum-specific examples, or cohort instructions. Notes appear in the module as a facilitator callout visible to all learners.
            </div>

            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="e.g. For the Momentum cohort: reference the claims AI pilot in Operations when discussing automation use cases. Remind participants of the Q3 2026 deployment timeline…"
              rows={8}
              style={{
                width: "100%",
                padding: "12px 14px",
                border: `1px solid ${COLORS.border}`,
                borderRadius: RADIUS.sm,
                fontSize: 13,
                fontFamily: "inherit",
                color: COLORS.text,
                background: COLORS.bg,
                resize: "vertical",
                outline: "none",
                lineHeight: 1.6,
                boxSizing: "border-box",
              }}
            />

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 14 }}>
              <div style={{ fontSize: 12, color: COLORS.muted2 }}>
                {draft.length} characters
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  onClick={() => { setDraft(""); }}
                  style={{
                    padding: "8px 16px",
                    borderRadius: RADIUS.sm,
                    border: `1px solid ${COLORS.border}`,
                    background: "none",
                    color: COLORS.muted,
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: "pointer",
                    fontFamily: "inherit",
                  }}
                >
                  Clear
                </button>
                <button
                  onClick={saveNote}
                  style={{
                    padding: "8px 18px",
                    borderRadius: RADIUS.sm,
                    border: `1px solid ${saved === activeKey ? COLORS.green : COLORS.acc}`,
                    background: saved === activeKey ? COLORS.green : COLORS.acc,
                    color: "#FFFFFF",
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: "pointer",
                    fontFamily: "inherit",
                    transition: "background 120ms",
                  }}
                >
                  {saved === activeKey ? "✓ Saved" : "Save Note"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
