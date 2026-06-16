import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { COLORS, TYPE_SCALE, SHADOW, RADIUS, FONT_FAMILY_DISPLAY } from "../theme/tokens.js";
import { useAppStore, BADGES } from "../store/AppStore.jsx";
import { getLevelForXP, getLevelProgress, getNextLevel } from "../data/levels.js";
import { TIERS } from "../data/tiers.js";

export default function Dashboard() {
  const { auth, xp, progress, accessibleTiers, isModuleDone } = useAppStore();
  const navigate = useNavigate();

  const { current: level, next: nextLevel, pct } = getLevelProgress(xp);

  // Aggregate module stats across all accessible tiers
  const totalMods = accessibleTiers.reduce((sum, t) => sum + t.mods.length, 0);
  const doneMods = accessibleTiers.reduce(
    (sum, t) => sum + t.mods.filter((m) => isModuleDone(t.id, m.id)).length,
    0
  );

  // Next recommended module (first incomplete across tiers)
  let nextMod = null;
  let nextModTier = null;
  outer: for (const tier of accessibleTiers) {
    for (const mod of tier.mods) {
      if (!isModuleDone(tier.id, mod.id)) {
        nextMod = mod;
        nextModTier = tier;
        break outer;
      }
    }
  }

  // Earned badges
  const earnedBadges = BADGES.filter((b) => b.ok(progress, 0));

  const roleLabel = {
    executive: "Executive",
    functional: "Executive Leadership",
    manager: "Senior Management",
    learner: "Professional",
    emerging: "Emerging Professional",
    facilitator: "Facilitator",
  }[auth?.role] || auth?.role;

  return (
    <div style={{ padding: "40px 48px", maxWidth: 1100 }}>
      {/* Header */}
      <div style={{ ...TYPE_SCALE.caption, color: COLORS.muted2, textTransform: "uppercase" }}>
        {roleLabel}
      </div>
      <h1
        style={{
          fontFamily: FONT_FAMILY_DISPLAY,
          fontSize: 32, fontWeight: 700, letterSpacing: "-0.02em",
          color: COLORS.text, marginTop: 6, marginBottom: 0,
        }}
      >
        Welcome back, {firstName(auth?.name)}
      </h1>
      <p style={{ ...TYPE_SCALE.body, color: COLORS.muted, marginTop: 10, maxWidth: 580 }}>
        {getWelcomeText(auth?.role)}
      </p>

      {/* Stat cards */}
      <div style={{ display: "flex", gap: 14, marginTop: 28, flexWrap: "wrap" }}>
        <StatCard
          label="Level"
          value={level.name}
          accent={level.color}
          sub={`Level ${level.n} · ${xp.toLocaleString()} XP`}
          progress={pct}
          progressLabel={nextLevel ? `${(nextLevel.min - xp).toLocaleString()} XP to ${nextLevel.name}` : "Max level"}
        />
        <StatCard
          label="Modules completed"
          value={`${doneMods} / ${totalMods}`}
          accent={COLORS.acc}
          sub={totalMods > 0 ? `${Math.round((doneMods / totalMods) * 100)}% complete` : "No modules yet"}
          progress={totalMods > 0 ? Math.round((doneMods / totalMods) * 100) : 0}
        />
        <StatCard
          label="Badges earned"
          value={`${earnedBadges.length} / ${BADGES.length}`}
          accent="#E8B84B"
          sub={earnedBadges.length ? earnedBadges.map((b) => b.icon).join(" ") : "Complete modules to earn badges"}
        />
      </div>

      {/* Daily Briefing + Daily Challenge */}
      <div style={{ display: "flex", gap: 16, marginTop: 32, flexWrap: "wrap" }}>
        <DailyBriefing role={auth?.role} name={auth?.name} />
        <DailyChallenge progress={progress} />
      </div>

      {/* Next up */}
      {nextMod && (
        <section style={{ marginTop: 36 }}>
          <h2 style={{ ...TYPE_SCALE.sectionTitle, marginBottom: 14 }}>Continue learning</h2>
          <div
            onClick={() => navigate(`/module/${nextModTier.id}/${nextMod.id}`)}
            style={{
              background: COLORS.surf,
              border: `1px solid ${COLORS.border}`,
              borderLeft: `4px solid ${nextModTier.color}`,
              borderRadius: RADIUS.md, boxShadow: SHADOW.sm,
              padding: "18px 22px",
              display: "flex", alignItems: "center", gap: 18,
              cursor: "pointer",
              maxWidth: 680,
              transition: "box-shadow .15s",
            }}
          >
            <div
              style={{
                width: 44, height: 44, borderRadius: RADIUS.sm, flexShrink: 0,
                background: nextModTier.color + "18",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 20,
              }}
            >
              {nextModTier.icon}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ ...TYPE_SCALE.caption, color: nextModTier.color, fontWeight: 700, textTransform: "uppercase" }}>
                {nextModTier.name} · Up next
              </div>
              <div style={{ ...TYPE_SCALE.cardTitle, fontSize: 15, marginTop: 4 }}>{nextMod.title}</div>
              <div style={{ ...TYPE_SCALE.caption, color: COLORS.muted2, marginTop: 4 }}>
                ⏱ {nextMod.dur} · +{100 + (nextMod.quiz?.length || 0) * 10} XP
              </div>
            </div>
            <div
              style={{
                padding: "10px 18px", background: nextModTier.color, color: "#fff",
                borderRadius: RADIUS.sm, fontWeight: 700, fontSize: 13,
                flexShrink: 0,
              }}
            >
              Start →
            </div>
          </div>
        </section>
      )}

      {/* Tier progress */}
      {accessibleTiers.length > 0 && (
        <section style={{ marginTop: 36 }}>
          <h2 style={{ ...TYPE_SCALE.sectionTitle, marginBottom: 14 }}>Learning tiers</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, maxWidth: 680 }}>
            {accessibleTiers.map((tier) => {
              const done = tier.mods.filter((m) => isModuleDone(tier.id, m.id)).length;
              const tierPct = tier.mods.length ? Math.round((done / tier.mods.length) * 100) : 0;
              return (
                <div
                  key={tier.id}
                  onClick={() => navigate("/learning")}
                  style={{
                    background: COLORS.surf, border: `1px solid ${COLORS.border}`,
                    borderRadius: RADIUS.md, boxShadow: SHADOW.sm,
                    padding: "14px 18px", cursor: "pointer",
                    display: "flex", alignItems: "center", gap: 14,
                  }}
                >
                  <span style={{ fontSize: 20 }}>{tier.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                      <span style={{ fontWeight: 700, fontSize: 14, color: COLORS.text }}>{tier.name}</span>
                      <span style={{ fontSize: 12, color: tier.color, fontWeight: 700 }}>{done}/{tier.mods.length}</span>
                    </div>
                    <div style={{ height: 5, borderRadius: 999, background: COLORS.border, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${tierPct}%`, background: tier.color, borderRadius: 999, transition: "width .6s" }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Recent badges */}
      {earnedBadges.length > 0 && (
        <section style={{ marginTop: 36, marginBottom: 48 }}>
          <h2 style={{ ...TYPE_SCALE.sectionTitle, marginBottom: 14 }}>Your badges</h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {earnedBadges.map((b) => (
              <div
                key={b.id}
                style={{
                  display: "flex", alignItems: "center", gap: 8,
                  background: "#FFFBEB", border: "1px solid #E8B84B40",
                  borderRadius: RADIUS.sm, padding: "8px 14px",
                }}
              >
                <span style={{ fontSize: 20 }}>{b.icon}</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 13 }}>{b.name}</div>
                  <div style={{ fontSize: 11, color: COLORS.muted2 }}>{b.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function StatCard({ label, value, accent, sub, progress, progressLabel }) {
  return (
    <div
      style={{
        flex: "1 1 180px", minWidth: 180,
        background: COLORS.surf, border: `1px solid ${COLORS.border}`,
        borderRadius: RADIUS.md, boxShadow: SHADOW.sm, padding: 20,
      }}
    >
      <div style={{ ...TYPE_SCALE.caption, color: COLORS.muted2, textTransform: "uppercase" }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 800, marginTop: 6, color: accent }}>{value}</div>
      {typeof progress === "number" && (
        <div style={{ marginTop: 10, height: 4, borderRadius: 999, background: COLORS.border, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${progress}%`, background: accent, borderRadius: 999 }} />
        </div>
      )}
      <div style={{ ...TYPE_SCALE.caption, color: COLORS.muted2, marginTop: 8 }}>
        {progressLabel || sub}
      </div>
    </div>
  );
}

// ─── Daily Briefings (static, rotated by day-of-week + role) ────────────────
const BRIEFINGS = {
  executive: [
    { day: 0, title: "AI Governance in the Boardroom", insight: "74% of boards globally now have AI on the agenda, yet fewer than 30% have a defined AI risk framework. The gap between AI enthusiasm and AI governance remains the defining boardroom challenge of 2025.", prompt: "Ask an AI: Summarise the top 3 AI governance failures of the past 12 months and what boards could have done differently." },
    { day: 1, title: "The CFO's AI Imperative", insight: "McKinsey estimates generative AI could add $2.6–4.4 trillion annually to the global economy. CFOs who delay AI investment decisions risk ceding competitive advantage to peers moving now.", prompt: "Ask an AI: Draft a 3-question AI investment readiness checklist for an executive committee meeting." },
    { day: 2, title: "AI and the Talent Equation", insight: "The World Economic Forum projects 85 million jobs displaced by AI by 2030 — but 97 million new roles created. Leaders who invest in workforce transformation now will shape the talent landscape.", prompt: "Ask an AI: Design a 90-day AI capability sprint for a 500-person organisation in financial services." },
    { day: 3, title: "Data as a Strategic Asset", insight: "Organisations that treat data as a balance-sheet asset — with defined ownership, quality standards, and monetisation strategies — outperform peers by 2.5x on digital transformation KPIs.", prompt: "Ask an AI: What are the five critical questions a CDO should ask before approving a new AI initiative?" },
    { day: 4, title: "Responsible AI Leadership", insight: "The EU AI Act and SA's forthcoming AI Policy Framework signal a new era of algorithmic accountability. Leaders who get ahead of compliance will avoid the reputational and financial costs of remediation.", prompt: "Ask an AI: Create a responsible AI policy one-pager suitable for board distribution at an African listed company." },
    { day: 5, title: "AI in African Markets", insight: "Africa's AI market is projected to grow at 35% CAGR through 2030. Mobile-first, data-scarce, and infrastructure-constrained environments are driving uniquely African AI innovation.", prompt: "Ask an AI: Identify 3 AI opportunities specific to the South African financial services sector in 2025." },
    { day: 6, title: "The Operating Model Question", insight: "The question is no longer whether to use AI — it's how to redesign your operating model around it. Centralised AI CoEs are giving way to federated models where every function has embedded AI capability.", prompt: "Ask an AI: Compare centralised vs federated AI operating models and recommend one for a 3,000-person mining company." },
  ],
  functional: [
    { day: 0, title: "AI in Your Function", insight: "Every function — Finance, HR, Marketing, Operations — now has documented AI use cases delivering 20–40% productivity gains. The question is which to prioritise and how to build the business case.", prompt: "Ask an AI: List the 5 highest-ROI AI use cases for a [your function] department at a mid-size African company." },
    { day: 1, title: "Building Your AI Business Case", insight: "The most successful AI business cases quantify the cost of inaction, not just the cost of implementation. Leaders who frame AI as risk mitigation alongside opportunity tend to get faster approval.", prompt: "Ask an AI: Write the opening paragraph of an AI investment business case for a CFO audience." },
    { day: 2, title: "Cross-Functional AI Governance", insight: "Data silos remain the #1 barrier to AI ROI in organisations. Functions that invest in data quality and cross-functional data sharing see 3x better AI outcomes.", prompt: "Ask an AI: Design a data-sharing governance protocol between Finance, HR, and Operations." },
    { day: 3, title: "AI Change Management", insight: "87% of employees report anxiety about AI in the workplace. Leaders who communicate clearly — naming fears before employees do — achieve 2x faster AI adoption rates.", prompt: "Ask an AI: Write a team FAQ addressing the top 5 AI concerns employees raise in town halls." },
    { day: 4, title: "Measuring AI ROI", insight: "The KPIs that matter for AI are not vanity metrics. Track time-saved-per-task, error rate reduction, cost per outcome, and employee AI adoption rate as your core scorecard.", prompt: "Ask an AI: Build a 1-page AI ROI scorecard template for a functional leadership team." },
    { day: 5, title: "AI Vendor Evaluation", insight: "Not all AI tools are equal. The best functional AI investments are those that integrate with existing workflows, require minimal change management, and have clear data residency policies.", prompt: "Ask an AI: Create a 10-question RFP scorecard for evaluating AI vendors in an African enterprise context." },
    { day: 6, title: "The Skills Gap in Your Team", insight: "A 2024 Korn Ferry study found that 64% of employees feel unprepared for AI-driven change. Functional leaders who invest in structured capability building see stronger retention and engagement.", prompt: "Ask an AI: Design a 3-month AI upskilling plan for a 20-person functional team with mixed digital skill levels." },
  ],
  learner: [
    { day: 0, title: "Why AI Literacy Matters for Your Career", insight: "The World Economic Forum ranks AI and big data skills as the #2 fastest-growing skill cluster globally. Professionals who build AI literacy now will be 40% more promotable by 2027.", prompt: "Ask an AI: How can a [your role] in [your industry] use AI tools to stand out in their next performance review?" },
    { day: 1, title: "Prompting as a Core Skill", insight: "The ability to communicate clearly with AI models is becoming as fundamental as spreadsheet literacy was in the 1990s. Professionals who master prompting can multiply their output 3–5x.", prompt: "Ask an AI: Teach me 3 advanced prompting techniques using an example from my daily work." },
    { day: 2, title: "AI Won't Replace You — Someone Using AI Might", insight: "The most cited finding from the 2024 LinkedIn Skills Report: roles are evolving faster than ever, and AI-adjacent skills are the fastest growing. The risk isn't displacement — it's irrelevance.", prompt: "Ask an AI: What AI skills should someone with [your background] prioritise learning in the next 6 months?" },
    { day: 3, title: "Using AI for Learning Itself", insight: "AI can personalise your learning in ways that traditional training can't. Learners who use AI as a study partner — for explanations, practice questions, and feedback — progress 2x faster.", prompt: "Ask an AI: Quiz me on [the last module topic you studied] using 5 application-focused questions." },
    { day: 4, title: "Build Your AI Portfolio", insight: "The most compelling career signal isn't a certificate — it's a portfolio of real AI applications. Document 3–5 ways you've used AI to solve real problems at work.", prompt: "Ask an AI: Help me write a LinkedIn post about a problem I solved using AI at work." },
    { day: 5, title: "Data Literacy as Career Insurance", insight: "Professionals who can read, interpret, and question data dashboards are consistently rated as higher performers by their managers. Data literacy is the foundation of AI literacy.", prompt: "Ask an AI: Explain the difference between correlation and causation using an example from retail." },
    { day: 6, title: "The African AI Opportunity", insight: "Africa's unique context — mobile-first populations, high informality, diverse languages — is creating AI solutions that leapfrog Western models. Understanding this landscape is a competitive advantage.", prompt: "Ask an AI: What are the most impactful AI deployments across Africa in 2024?" },
  ],
};

function getDayBriefing(role) {
  const day = new Date().getDay();
  const pool = BRIEFINGS[role] || BRIEFINGS.learner;
  return pool.find((b) => b.day === day) || pool[0];
}

function DailyBriefing({ role, name }) {
  const briefing = getDayBriefing(role);
  const [copied, setCopied] = useState(false);
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const today = days[new Date().getDay()];

  function copyPrompt() {
    navigator.clipboard.writeText(briefing.prompt).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div
      style={{
        flex: "2 1 320px",
        background: COLORS.surf,
        border: `1px solid ${COLORS.border}`,
        borderRadius: RADIUS.lg,
        boxShadow: SHADOW.sm,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          padding: "14px 18px",
          background: COLORS.acc,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.7)", textTransform: "uppercase" }}>
            {today}'s Intelligence Brief
          </div>
        </div>
        <span style={{ fontSize: 18 }}>📰</span>
      </div>

      <div style={{ padding: "16px 18px" }}>
        <div style={{ fontWeight: 700, fontSize: 15, color: COLORS.text, marginBottom: 8 }}>
          {briefing.title}
        </div>
        <p style={{ fontSize: 13, color: COLORS.muted, lineHeight: 1.65, marginBottom: 14 }}>
          {briefing.insight}
        </p>
        <div
          style={{
            background: COLORS.accSoft + "15",
            border: `1px solid ${COLORS.acc}25`,
            borderRadius: RADIUS.sm,
            padding: "10px 14px",
            marginBottom: 10,
          }}
        >
          <div style={{ fontSize: 11, fontWeight: 700, color: COLORS.acc, textTransform: "uppercase", marginBottom: 4 }}>
            Prompt of the Day
          </div>
          <p style={{ fontSize: 12.5, color: COLORS.muted, lineHeight: 1.55, margin: 0 }}>{briefing.prompt}</p>
        </div>
        <button
          onClick={copyPrompt}
          style={{
            padding: "6px 14px",
            background: copied ? COLORS.green + "15" : COLORS.surf,
            border: `1px solid ${copied ? COLORS.green + "40" : COLORS.border}`,
            borderRadius: RADIUS.sm,
            cursor: "pointer",
            fontFamily: "inherit",
            fontSize: 12,
            fontWeight: 600,
            color: copied ? COLORS.green : COLORS.muted,
          }}
        >
          {copied ? "✓ Copied!" : "Copy prompt"}
        </button>
      </div>
    </div>
  );
}

// ─── Daily Challenge (picks from static quiz data) ───────────────────────────
function DailyChallenge({ progress }) {
  const [phase, setPhase] = useState("idle"); // idle | active | done
  const [selected, setSelected] = useState(null);
  const [revealed, setRevealed] = useState(false);

  // Pick a deterministic quiz question based on today's date
  const today = new Date();
  const dayNum = Math.floor(today.getTime() / 86400000);
  const allQuestions = TIERS.flatMap((t) =>
    t.mods.flatMap((m) =>
      (m.quiz || []).map((q) => ({ ...q, modTitle: m.title, tierName: t.name }))
    )
  );
  const q = allQuestions.length > 0 ? allQuestions[dayNum % allQuestions.length] : null;

  if (!q) return null;

  const isCorrect = selected !== null && selected === q.correct;

  return (
    <div
      style={{
        flex: "1 1 260px",
        background: COLORS.surf,
        border: `1px solid ${COLORS.border}`,
        borderRadius: RADIUS.lg,
        boxShadow: SHADOW.sm,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          padding: "14px 18px",
          background: COLORS.fire + "18",
          borderBottom: `1px solid ${COLORS.fire}25`,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: COLORS.fire, textTransform: "uppercase" }}>
            Daily Challenge
          </div>
          <div style={{ fontSize: 11, color: COLORS.muted2, marginTop: 1 }}>+15 LP on completion</div>
        </div>
        <span style={{ fontSize: 18 }}>⚡</span>
      </div>

      <div style={{ padding: "16px 18px" }}>
        {phase === "idle" && (
          <>
            <p style={{ fontSize: 13, color: COLORS.muted, lineHeight: 1.55, marginBottom: 14 }}>
              Test your knowledge with today's question from <strong>{q.modTitle}</strong>.
            </p>
            <button
              onClick={() => setPhase("active")}
              style={{
                padding: "8px 18px",
                background: COLORS.fire,
                color: "#fff",
                border: "none",
                borderRadius: RADIUS.sm,
                cursor: "pointer",
                fontFamily: "inherit",
                fontWeight: 700,
                fontSize: 13,
              }}
            >
              Take Today's Challenge
            </button>
          </>
        )}

        {phase === "active" && (
          <>
            <p style={{ fontSize: 13, fontWeight: 600, color: COLORS.text, lineHeight: 1.55, marginBottom: 14 }}>
              {q.q}
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
              {q.opts.map((opt, i) => {
                let bg = COLORS.bg;
                let border = COLORS.border;
                let color = COLORS.text;
                if (revealed) {
                  if (i === q.correct) { bg = COLORS.green + "12"; border = COLORS.green + "50"; color = COLORS.green; }
                  else if (i === selected) { bg = COLORS.danger + "10"; border = COLORS.danger + "40"; color = COLORS.danger; }
                } else if (selected === i) {
                  bg = COLORS.acc + "10"; border = COLORS.acc;
                }
                return (
                  <button
                    key={i}
                    disabled={revealed}
                    onClick={() => !revealed && setSelected(i)}
                    style={{
                      padding: "8px 12px", textAlign: "left",
                      background: bg, border: `1.5px solid ${border}`,
                      borderRadius: RADIUS.sm, cursor: revealed ? "default" : "pointer",
                      fontFamily: "inherit", fontSize: 12.5, color, lineHeight: 1.4,
                    }}
                  >
                    {opt}
                    {revealed && i === q.correct && " ✓"}
                    {revealed && i === selected && i !== q.correct && " ✗"}
                  </button>
                );
              })}
            </div>
            {!revealed && selected !== null && (
              <button
                onClick={() => { setRevealed(true); setPhase("done"); }}
                style={{
                  marginTop: 12,
                  padding: "7px 16px",
                  background: COLORS.acc,
                  color: "#fff",
                  border: "none",
                  borderRadius: RADIUS.sm,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  fontWeight: 700,
                  fontSize: 12,
                }}
              >
                Submit Answer
              </button>
            )}
          </>
        )}

        {phase === "done" && (
          <>
            <div
              style={{
                padding: "10px 14px",
                background: isCorrect ? COLORS.green + "10" : COLORS.danger + "08",
                border: `1px solid ${isCorrect ? COLORS.green + "30" : COLORS.danger + "25"}`,
                borderRadius: RADIUS.sm,
                marginBottom: 10,
              }}
            >
              <div style={{ fontWeight: 700, fontSize: 14, color: isCorrect ? COLORS.green : COLORS.danger }}>
                {isCorrect ? "🎉 Correct! +15 LP" : "✗ Not quite"}
              </div>
              {q.exp && (
                <p style={{ fontSize: 12, color: COLORS.muted, marginTop: 4, lineHeight: 1.5 }}>{q.exp}</p>
              )}
            </div>
            <div style={{ fontSize: 11, color: COLORS.muted2 }}>Come back tomorrow for a new challenge.</div>
          </>
        )}
      </div>
    </div>
  );
}

function firstName(name) {
  if (!name) return "there";
  return name.split(" ")[0];
}

function getWelcomeText(role) {
  const map = {
    executive: "Your AI leadership dashboard. Track organisational capability, review key metrics, and drive transformation from the top.",
    functional: "Track your team's AI readiness, complete leadership modules, and build the case for AI investment.",
    manager: "Build your AI management capability. Lead your team through the transition with confidence.",
    learner: "Develop your AI skills, complete modules, and earn recognition as an AI-capable professional.",
    emerging: "Start your AI journey. Complete foundational modules and build in-demand skills for the future of work.",
    facilitator: "Manage your cohorts and access programme analytics.",
  };
  return map[role] || "Track your AI capability progress and continue your learning journey.";
}
