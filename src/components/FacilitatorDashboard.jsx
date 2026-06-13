import { useEffect, useMemo, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useAppStore } from "../store/useAppStore.js";
import { COLORS, FONT_FAMILY_DISPLAY } from "../theme/tokens.js";
import { DEMO_COHORT } from "../data/demoCohort.js";
import { INDUSTRY_SHORT_LABELS } from "../data/industries.js";

/**
 * Facilitator view: cohort leaderboard plus a per-learner notes panel.
 * `screen: "facilitator"`.
 *
 * The cohort table merges seed demo learners (`DEMO_COHORT`) with real
 * learner records persisted via the storage adapter, de-duplicated by name
 * so a real learner's progress overrides the seed row once they exist.
 */
export default function FacilitatorDashboard() {
  const board = useAppStore((state) => state.board);
  const refreshBoard = useAppStore((state) => state.refreshBoard);
  const goBack = useAppStore((state) => state.goBack);
  const notesByLearner = useAppStore((state) => state.notesByLearner);
  const loadNotes = useAppStore((state) => state.loadNotes);
  const addNote = useAppStore((state) => state.addNote);

  const cohort = useMemo(() => mergeCohort(DEMO_COHORT, board), [board]);
  const [selected, setSelected] = useState(cohort[0]?.name ?? null);
  const [draft, setDraft] = useState("");

  useEffect(() => {
    refreshBoard();
  }, [refreshBoard]);

  useEffect(() => {
    if (selected) loadNotes(selected);
  }, [selected, loadNotes]);

  const notes = selected ? (notesByLearner[selected] ?? []) : [];

  return (
    <main
      className="fade-in"
      style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 24px 64px" }}
    >
      <button type="button" className="nb" onClick={goBack} style={backButtonStyle}>
        <ArrowLeft size={14} aria-hidden="true" /> Back
      </button>

      <h1
        style={{
          fontFamily: FONT_FAMILY_DISPLAY,
          fontSize: 26,
          fontWeight: 500,
          color: COLORS.text,
          margin: "16px 0 24px",
        }}
      >
        Facilitator dashboard
      </h1>

      <div
        style={{ display: "grid", gridTemplateColumns: "minmax(0, 2fr) minmax(0, 1fr)", gap: 24 }}
      >
        <section aria-label="Cohort overview" style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr
                style={{
                  textAlign: "left",
                  color: COLORS.muted,
                  borderBottom: `1px solid ${COLORS.border}`,
                }}
              >
                <th style={thStyle}>Learner</th>
                <th style={thStyle}>Level</th>
                <th style={thStyle}>XP</th>
                <th style={thStyle}>Modules</th>
                <th style={thStyle}>Streak</th>
                <th style={thStyle}>Industry</th>
                <th style={thStyle}>Last active</th>
              </tr>
            </thead>
            <tbody>
              {cohort.map((learner) => (
                <tr
                  key={learner.name}
                  className="nb"
                  onClick={() => setSelected(learner.name)}
                  aria-selected={selected === learner.name}
                  style={{
                    cursor: "pointer",
                    borderBottom: `1px solid ${COLORS.border}`,
                    background: selected === learner.name ? COLORS.surf2 : "transparent",
                  }}
                >
                  <td style={tdStyle}>{learner.name}</td>
                  <td style={tdStyle}>{learner.lv}</td>
                  <td style={tdStyle}>{learner.xp}</td>
                  <td style={tdStyle}>{learner.mods}</td>
                  <td style={tdStyle}>{learner.streak}</td>
                  <td style={tdStyle}>{INDUSTRY_SHORT_LABELS[learner.ind] ?? learner.ind}</td>
                  <td style={tdStyle}>{learner.last}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section aria-label="Learner notes">
          <h2 style={{ fontSize: 15, fontWeight: 600, color: COLORS.text, marginBottom: 12 }}>
            Notes{selected ? ` — ${selected}` : ""}
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 12 }}>
            {notes.length === 0 ? (
              <p style={{ fontSize: 13, color: COLORS.muted }}>No notes yet.</p>
            ) : (
              notes.map((note) => (
                <div
                  key={note.id}
                  style={{
                    padding: "10px 12px",
                    borderRadius: 8,
                    border: `1px solid ${COLORS.border}`,
                    background: COLORS.surf,
                  }}
                >
                  <p style={{ fontSize: 13, color: COLORS.text }}>{note.text}</p>
                  <p style={{ fontSize: 11, color: COLORS.muted, marginTop: 4 }}>
                    {new Date(note.createdAt).toLocaleString("en-ZA")}
                  </p>
                </div>
              ))
            )}
          </div>

          <form
            onSubmit={(event) => {
              event.preventDefault();
              if (!selected) return;
              addNote(selected, draft);
              setDraft("");
            }}
          >
            <label htmlFor="note-draft" className="visually-hidden">
              Add a note for {selected}
            </label>
            <textarea
              id="note-draft"
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder={selected ? `Add a note for ${selected}…` : "Select a learner first"}
              disabled={!selected}
              rows={3}
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: 8,
                border: `1px solid ${COLORS.border}`,
                background: COLORS.surf2,
                color: COLORS.text,
                fontSize: 13,
                resize: "vertical",
                marginBottom: 8,
              }}
            />
            <button
              type="submit"
              className="nb"
              disabled={!selected || !draft.trim()}
              style={{
                padding: "8px 16px",
                borderRadius: 8,
                border: `1px solid ${COLORS.borderH}`,
                background: COLORS.acc,
                color: COLORS.bg,
                fontSize: 13,
                fontWeight: 600,
                cursor: !selected || !draft.trim() ? "not-allowed" : "pointer",
                opacity: !selected || !draft.trim() ? 0.6 : 1,
              }}
            >
              Add note
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}

const thStyle = { padding: "8px 10px", fontWeight: 500 };
const tdStyle = { padding: "10px 10px", color: COLORS.text };

const backButtonStyle = {
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  padding: "6px 12px",
  borderRadius: 8,
  border: `1px solid ${COLORS.border}`,
  background: "transparent",
  color: COLORS.muted2,
  fontSize: 13,
  cursor: "pointer",
};

/**
 * Merge seed demo learners with real leaderboard entries, de-duplicated by
 * name. Real entries (from `board`) take precedence over demo seed rows.
 * @param {import("../data/demoCohort.js").DemoLearner[]} demo
 * @param {import("../api/storage.js").LeaderboardEntry[]} board
 * @returns {import("../api/storage.js").LeaderboardEntry[]}
 */
function mergeCohort(demo, board) {
  const byName = new Map();
  for (const entry of demo) byName.set(entry.name, entry);
  for (const entry of board) byName.set(entry.name, entry);
  return Array.from(byName.values()).sort((a, b) => b.xp - a.xp);
}
