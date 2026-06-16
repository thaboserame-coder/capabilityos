import React, { useState, useMemo } from "react";
import { COLORS, TYPE_SCALE, SHADOW, RADIUS } from "../theme/tokens.js";
import { useAppStore } from "../store/AppStore.jsx";
import { CAP_DIMS, ROLE_DIMS, BENCHMARKS, scoreToPercent } from "../data/assessment.js";

// ─── SVG Radar Chart ──────────────────────────────────────────────────────────
function SvgRadar({ dims, scores, benchmarks, size = 340 }) {
  const cx = size / 2;
  const cy = size / 2;
  const r = size * 0.36;
  const n = dims.length;
  if (n < 3) return null;

  function angleFor(i) {
    return (Math.PI * 2 * i) / n - Math.PI / 2;
  }
  function pt(i, radius) {
    const a = angleFor(i);
    return [cx + radius * Math.cos(a), cy + radius * Math.sin(a)];
  }
  function polyPts(values) {
    return values.map((v, i) => pt(i, (v / 100) * r).join(",")).join(" ");
  }

  const rings = [20, 40, 60, 80, 100];
  const userScores = dims.map((d) => scores[d.id] ?? 0);
  const benchScores = dims.map((d) => benchmarks[d.id] ?? 0);

  return (
    <svg width={size} height={size} style={{ overflow: "visible" }}>
      {/* Grid rings */}
      {rings.map((pct) => (
        <polygon
          key={pct}
          points={dims.map((_, i) => pt(i, (pct / 100) * r).join(",")).join(" ")}
          fill="none"
          stroke={COLORS.border}
          strokeWidth={1}
        />
      ))}

      {/* Spokes */}
      {dims.map((_, i) => {
        const [x, y] = pt(i, r);
        return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke={COLORS.border} strokeWidth={1} />;
      })}

      {/* Benchmark polygon */}
      {benchScores.some((s) => s > 0) && (
        <polygon
          points={polyPts(benchScores)}
          fill={COLORS.muted2 + "18"}
          stroke={COLORS.muted2}
          strokeWidth={1.5}
          strokeDasharray="4 3"
        />
      )}

      {/* User polygon */}
      <polygon
        points={polyPts(userScores)}
        fill={COLORS.acc + "22"}
        stroke={COLORS.acc}
        strokeWidth={2}
      />

      {/* Vertex dots */}
      {dims.map((d, i) => {
        const [x, y] = pt(i, (userScores[i] / 100) * r);
        return <circle key={d.id} cx={x} cy={y} r={4} fill={COLORS.acc} />;
      })}

      {/* Labels */}
      {dims.map((d, i) => {
        const [lx, ly] = pt(i, r + 26);
        const anchor = lx < cx - 10 ? "end" : lx > cx + 10 ? "start" : "middle";
        return (
          <text
            key={d.id}
            x={lx}
            y={ly}
            textAnchor={anchor}
            dominantBaseline="middle"
            fontSize={10}
            fontFamily="inherit"
            fontWeight={600}
            fill={COLORS.muted}
          >
            {d.short}
          </text>
        );
      })}

      {/* Ring labels */}
      {[40, 80].map((pct) => {
        const [lx, ly] = pt(0, (pct / 100) * r);
        return (
          <text
            key={pct}
            x={lx + 4}
            y={ly}
            fontSize={8}
            fontFamily="inherit"
            fill={COLORS.muted2}
          >
            {pct}
          </text>
        );
      })}
    </svg>
  );
}

// ─── Development plan generator ───────────────────────────────────────────────
function buildPlan(dims, scores, role) {
  // Sort dims by gap (lowest score first)
  const sorted = [...dims].sort((a, b) => (scores[a.id] ?? 0) - (scores[b.id] ?? 0));
  const top3 = sorted.slice(0, Math.min(3, sorted.length));

  const months = [
    { label: "Month 1–2", focus: "Foundation", action: "Prioritise quick-win learning" },
    { label: "Month 3–4", focus: "Application", action: "Apply in real workflows" },
    { label: "Month 5–6", focus: "Leadership", action: "Influence and scale" },
  ];

  return top3.map((d, i) => ({
    dim: d,
    score: scores[d.id] ?? 0,
    month: months[i] || months[2],
    actions: d.skills.slice(0, 3).map((s) => `Build ${s.toLowerCase()} capability`),
  }));
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function ReadinessAssessment() {
  const { auth } = useAppStore();
  const role = auth?.role || "learner";

  // Get dims for this role
  const dimIds = ROLE_DIMS[role] || ROLE_DIMS.learner;
  const dims = CAP_DIMS.filter((d) => dimIds.includes(d.id));
  const benchmarks = BENCHMARKS[role] || {};

  const [phase, setPhase] = useState("intro"); // intro | assess | results
  const [dimIdx, setDimIdx] = useState(0);     // current dimension
  const [qIdx, setQIdx] = useState(0);          // current question within dim
  const [answers, setAnswers] = useState({});   // dimId → total score (0–100)
  const [dimAnswers, setDimAnswers] = useState({}); // dimId → [qScore, ...]
  const [selected, setSelected] = useState(null);

  const currentDim = dims[dimIdx];

  // Computed scores (0–100 per dim)
  const scores = useMemo(() => {
    const result = {};
    dims.forEach((d) => {
      const ans = dimAnswers[d.id];
      if (!ans) return;
      const raw = ans.reduce((sum, s) => sum + s, 0);
      const maxRaw = d.questions.length * 4;
      result[d.id] = scoreToPercent(raw, maxRaw);
    });
    return result;
  }, [dimAnswers, dims]);

  const overallScore = useMemo(() => {
    const vals = Object.values(scores);
    if (!vals.length) return 0;
    return Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
  }, [scores]);

  const benchmarkAvg = useMemo(() => {
    const vals = dims.map((d) => benchmarks[d.id] ?? 0).filter((v) => v > 0);
    if (!vals.length) return 0;
    return Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
  }, [dims, benchmarks]);

  function handleAnswer(scoreVal) {
    setSelected(scoreVal);
  }

  function handleNext() {
    if (selected === null) return;
    const d = currentDim;
    const q = d.questions[qIdx];
    const scoreVal = q.scores[selected]; // selected is option index
    const existingAnswers = dimAnswers[d.id] || [];
    const updatedAnswers = [...existingAnswers, scoreVal];

    if (qIdx < d.questions.length - 1) {
      // More questions in this dim
      setDimAnswers((prev) => ({ ...prev, [d.id]: updatedAnswers }));
      setQIdx(qIdx + 1);
      setSelected(null);
    } else {
      // Last question in dim — save and move to next dim
      const newDimAnswers = { ...dimAnswers, [d.id]: updatedAnswers };
      setDimAnswers(newDimAnswers);

      if (dimIdx < dims.length - 1) {
        setDimIdx(dimIdx + 1);
        setQIdx(0);
        setSelected(null);
      } else {
        // All done
        setPhase("results");
      }
    }
  }

  const plan = useMemo(
    () => (phase === "results" ? buildPlan(dims, scores, role) : []),
    [phase, dims, scores, role]
  );

  const totalQs = dims.reduce((sum, d) => sum + d.questions.length, 0);
  const answeredQs = Object.entries(dimAnswers).reduce((sum, [id, arr]) => {
    const d = dims.find((x) => x.id === id);
    return sum + (d ? Math.min(arr.length, d.questions.length) : 0);
  }, 0);
  const progressPct = totalQs > 0 ? Math.round((answeredQs / totalQs) * 100) : 0;

  // ── INTRO ──
  if (phase === "intro") {
    return (
      <div style={{ padding: "40px 48px", maxWidth: 700 }}>
        <div style={{ ...TYPE_SCALE.caption, color: COLORS.muted2, textTransform: "uppercase" }}>
          Self-Assessment
        </div>
        <h1 style={{ ...TYPE_SCALE.pageTitle, marginTop: 6 }}>AI Readiness Assessment</h1>
        <p style={{ ...TYPE_SCALE.body, color: COLORS.muted, marginTop: 10, maxWidth: 580, lineHeight: 1.7 }}>
          Benchmark your organisation's AI capability across {dims.length} dimensions tailored to your {role} role.
          Takes approximately {Math.round(totalQs * 0.5)} minutes.
        </p>

        {/* Dimension previews */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 10, marginTop: 28 }}>
          {dims.map((d) => (
            <div
              key={d.id}
              style={{
                padding: "14px 16px",
                background: COLORS.surf,
                border: `1px solid ${COLORS.border}`,
                borderRadius: RADIUS.md,
                borderLeft: `3px solid ${d.color}`,
              }}
            >
              <div style={{ fontWeight: 700, fontSize: 13, color: COLORS.text }}>{d.name}</div>
              <div style={{ fontSize: 11, color: COLORS.muted, marginTop: 4, lineHeight: 1.4 }}>{d.desc.split("—")[0]}</div>
            </div>
          ))}
        </div>

        <div
          style={{
            marginTop: 28, padding: "14px 18px",
            background: COLORS.acc + "08",
            border: `1px solid ${COLORS.acc}25`,
            borderRadius: RADIUS.md,
          }}
        >
          <div style={{ fontSize: 13, color: COLORS.muted, lineHeight: 1.6 }}>
            <strong style={{ color: COLORS.acc }}>How it works:</strong> Answer {totalQs} questions across {dims.length} dimensions.
            Your responses are compared against executive peer benchmarks.
            You'll receive a personalised 90-day development plan at the end.
          </div>
        </div>

        <button
          onClick={() => setPhase("assess")}
          style={{
            marginTop: 28,
            padding: "12px 32px",
            background: COLORS.acc,
            color: "#fff",
            border: "none",
            borderRadius: RADIUS.md,
            cursor: "pointer",
            fontFamily: "inherit",
            fontWeight: 700,
            fontSize: 15,
            boxShadow: SHADOW.sm,
          }}
        >
          Start Assessment →
        </button>
      </div>
    );
  }

  // ── ASSESS ──
  if (phase === "assess") {
    const q = currentDim.questions[qIdx];
    const dimProgress = ((dimIdx + qIdx / currentDim.questions.length) / dims.length) * 100;

    return (
      <div style={{ padding: "40px 48px", maxWidth: 640 }}>
        {/* Overall progress bar */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{ fontSize: 12, color: COLORS.muted2, fontWeight: 600 }}>
              Dimension {dimIdx + 1} of {dims.length}: <span style={{ color: currentDim.color }}>{currentDim.name}</span>
            </span>
            <span style={{ fontSize: 12, color: COLORS.muted2 }}>{progressPct}% complete</span>
          </div>
          <div style={{ height: 5, borderRadius: 999, background: COLORS.border, overflow: "hidden" }}>
            <div
              style={{
                height: "100%",
                width: `${progressPct}%`,
                background: currentDim.color,
                borderRadius: 999,
                transition: "width 300ms ease",
              }}
            />
          </div>
        </div>

        {/* Dimension header */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "6px 14px",
            borderRadius: 999,
            background: currentDim.color + "15",
            border: `1px solid ${currentDim.color}30`,
            marginBottom: 20,
          }}
        >
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: currentDim.color }} />
          <span style={{ fontSize: 12, fontWeight: 700, color: currentDim.color }}>{currentDim.name}</span>
          <span style={{ fontSize: 11, color: COLORS.muted2 }}>Q{qIdx + 1} of {currentDim.questions.length}</span>
        </div>

        {/* Question */}
        <div
          style={{
            background: COLORS.surf,
            border: `1px solid ${COLORS.border}`,
            borderRadius: RADIUS.lg,
            padding: "28px 32px",
            boxShadow: SHADOW.sm,
          }}
        >
          <p style={{ fontSize: 17, fontWeight: 600, color: COLORS.text, lineHeight: 1.6, margin: 0, marginBottom: 24 }}>
            {q.q}
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {q.opts.map((opt, i) => {
              const isSelected = selected === i;
              return (
                <button
                  key={i}
                  onClick={() => setSelected(i)}
                  style={{
                    padding: "12px 16px",
                    textAlign: "left",
                    background: isSelected ? COLORS.acc + "10" : COLORS.bg,
                    border: `1.5px solid ${isSelected ? COLORS.acc : COLORS.border}`,
                    borderRadius: RADIUS.sm,
                    cursor: "pointer",
                    fontFamily: "inherit",
                    fontSize: 14,
                    color: COLORS.text,
                    lineHeight: 1.5,
                    transition: "all .1s",
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 10,
                  }}
                >
                  <span style={{
                    flexShrink: 0,
                    width: 20, height: 20,
                    borderRadius: "50%",
                    border: `2px solid ${isSelected ? COLORS.acc : COLORS.border}`,
                    background: isSelected ? COLORS.acc : "transparent",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    marginTop: 1,
                  }}>
                    {isSelected && (
                      <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#fff" }} />
                    )}
                  </span>
                  {opt}
                </button>
              );
            })}
          </div>

          <button
            onClick={handleNext}
            disabled={!selected}
            style={{
              marginTop: 22,
              padding: "11px 28px",
              background: selected ? COLORS.acc : COLORS.border,
              color: selected ? "#fff" : COLORS.muted2,
              border: "none",
              borderRadius: RADIUS.md,
              cursor: selected ? "pointer" : "not-allowed",
              fontFamily: "inherit",
              fontWeight: 700,
              fontSize: 14,
              transition: "all .15s",
            }}
          >
            {dimIdx === dims.length - 1 && qIdx === currentDim.questions.length - 1
              ? "View My Results →"
              : "Next →"}
          </button>
        </div>
      </div>
    );
  }

  // ── RESULTS ──
  return (
    <div style={{ padding: "40px 48px", maxWidth: 860 }}>
      <div style={{ ...TYPE_SCALE.caption, color: COLORS.muted2, textTransform: "uppercase" }}>
        Assessment Complete
      </div>
      <h1 style={{ ...TYPE_SCALE.pageTitle, marginTop: 6 }}>Your AI Readiness Profile</h1>

      {/* Score summary cards */}
      <div style={{ display: "flex", gap: 16, marginTop: 24, flexWrap: "wrap" }}>
        <div
          style={{
            flex: "1 1 160px",
            background: COLORS.surf,
            border: `2px solid ${COLORS.acc}`,
            borderRadius: RADIUS.lg,
            padding: "20px 24px",
            textAlign: "center",
            boxShadow: SHADOW.sm,
          }}
        >
          <div style={{ fontSize: 40, fontWeight: 900, color: COLORS.acc }}>{overallScore}</div>
          <div style={{ fontSize: 12, fontWeight: 700, color: COLORS.muted2, textTransform: "uppercase", marginTop: 4 }}>
            Your Score
          </div>
        </div>
        <div
          style={{
            flex: "1 1 160px",
            background: COLORS.surf,
            border: `1px solid ${COLORS.border}`,
            borderRadius: RADIUS.lg,
            padding: "20px 24px",
            textAlign: "center",
            boxShadow: SHADOW.sm,
          }}
        >
          <div style={{ fontSize: 40, fontWeight: 900, color: COLORS.muted }}>{benchmarkAvg}</div>
          <div style={{ fontSize: 12, fontWeight: 700, color: COLORS.muted2, textTransform: "uppercase", marginTop: 4 }}>
            Peer Benchmark
          </div>
        </div>
        <div
          style={{
            flex: "1 1 160px",
            background: COLORS.surf,
            border: `1px solid ${COLORS.border}`,
            borderRadius: RADIUS.lg,
            padding: "20px 24px",
            textAlign: "center",
            boxShadow: SHADOW.sm,
          }}
        >
          <div
            style={{
              fontSize: 40,
              fontWeight: 900,
              color: overallScore >= benchmarkAvg ? COLORS.green : COLORS.danger,
            }}
          >
            {overallScore >= benchmarkAvg ? "+" : ""}{overallScore - benchmarkAvg}
          </div>
          <div style={{ fontSize: 12, fontWeight: 700, color: COLORS.muted2, textTransform: "uppercase", marginTop: 4 }}>
            vs Benchmark
          </div>
        </div>
      </div>

      {/* Radar + dimension scores */}
      <div style={{ display: "flex", gap: 32, marginTop: 36, flexWrap: "wrap", alignItems: "flex-start" }}>
        {/* Radar */}
        <div
          style={{
            background: COLORS.surf,
            border: `1px solid ${COLORS.border}`,
            borderRadius: RADIUS.lg,
            padding: "24px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            boxShadow: SHADOW.sm,
            flex: "0 0 auto",
          }}
        >
          <SvgRadar dims={dims} scores={scores} benchmarks={benchmarks} size={300} />
          <div style={{ display: "flex", gap: 16, marginTop: 14, fontSize: 11, color: COLORS.muted2 }}>
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <span style={{ display: "inline-block", width: 20, height: 2, background: COLORS.acc }} />
              You
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <span style={{ display: "inline-block", width: 20, height: 0, borderTop: `2px dashed ${COLORS.muted2}` }} />
              Peer avg
            </span>
          </div>
        </div>

        {/* Dimension score bars */}
        <div style={{ flex: 1, minWidth: 260 }}>
          <div style={{ fontWeight: 700, fontSize: 14, color: COLORS.text, marginBottom: 14 }}>
            Dimension Breakdown
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {dims.map((d) => {
              const score = scores[d.id] ?? 0;
              const bench = benchmarks[d.id] ?? 0;
              const gap = score - bench;
              return (
                <div key={d.id}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: COLORS.text }}>{d.name}</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: gap >= 0 ? COLORS.green : COLORS.danger }}>
                      {score} <span style={{ color: COLORS.muted2, fontWeight: 400 }}>/ 100</span>
                    </span>
                  </div>
                  <div style={{ position: "relative", height: 7, borderRadius: 999, background: COLORS.border, overflow: "hidden" }}>
                    {/* benchmark marker */}
                    {bench > 0 && (
                      <div
                        style={{
                          position: "absolute",
                          left: `${bench}%`,
                          top: 0,
                          height: "100%",
                          width: 2,
                          background: COLORS.muted2,
                          zIndex: 2,
                        }}
                      />
                    )}
                    <div
                      style={{
                        height: "100%",
                        width: `${score}%`,
                        background: gap >= 0 ? d.color : COLORS.danger,
                        borderRadius: 999,
                        transition: "width 600ms ease",
                      }}
                    />
                  </div>
                  {bench > 0 && (
                    <div style={{ fontSize: 10, color: COLORS.muted2, marginTop: 2 }}>
                      Peer benchmark: {bench} · Gap: {gap >= 0 ? "+" : ""}{gap}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 90-Day Development Plan */}
      <div style={{ marginTop: 40 }}>
        <div style={{ fontWeight: 700, fontSize: 18, color: COLORS.text, marginBottom: 6 }}>
          Your 90-Day AI Development Plan
        </div>
        <p style={{ fontSize: 13, color: COLORS.muted, marginBottom: 20 }}>
          Based on your lowest-scoring dimensions, here's your personalised development roadmap.
        </p>
        <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
          {plan.map(({ dim, score, month, actions }, i) => (
            <div
              key={dim.id}
              style={{
                flex: "1 1 220px",
                background: COLORS.surf,
                border: `1px solid ${COLORS.border}`,
                borderTop: `3px solid ${dim.color}`,
                borderRadius: RADIUS.md,
                padding: "18px 20px",
                boxShadow: SHADOW.sm,
              }}
            >
              <div style={{ fontSize: 11, fontWeight: 700, color: COLORS.muted2, textTransform: "uppercase", marginBottom: 6 }}>
                {month.label} · {month.focus}
              </div>
              <div style={{ fontWeight: 700, fontSize: 15, color: COLORS.text, marginBottom: 4 }}>{dim.name}</div>
              <div style={{ fontSize: 12, color: COLORS.muted2, marginBottom: 12 }}>Current score: {score}/100</div>
              <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 6 }}>
                {actions.map((a, j) => (
                  <li key={j} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                    <span style={{ color: dim.color, fontWeight: 700, fontSize: 14, lineHeight: 1.3 }}>→</span>
                    <span style={{ fontSize: 12, color: COLORS.muted, lineHeight: 1.4 }}>{a}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* CTA buttons */}
      <div style={{ display: "flex", gap: 12, marginTop: 32, flexWrap: "wrap" }}>
        <button
          onClick={() => { setPhase("intro"); setDimIdx(0); setQIdx(0); setAnswers({}); setDimAnswers({}); setSelected(null); }}
          style={{
            padding: "10px 22px",
            background: COLORS.surf,
            border: `1.5px solid ${COLORS.border}`,
            borderRadius: RADIUS.md,
            cursor: "pointer",
            fontFamily: "inherit",
            fontWeight: 600,
            fontSize: 14,
            color: COLORS.muted,
          }}
        >
          Retake Assessment
        </button>
        <a
          href="/learning"
          style={{
            padding: "10px 22px",
            background: COLORS.acc,
            border: "none",
            borderRadius: RADIUS.md,
            cursor: "pointer",
            fontFamily: "inherit",
            fontWeight: 700,
            fontSize: 14,
            color: "#fff",
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
          }}
        >
          Go to Learning →
        </a>
      </div>
    </div>
  );
}
