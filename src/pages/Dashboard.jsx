import React from "react";
import { useNavigate } from "react-router-dom";
import { COLORS, TYPE_SCALE, SHADOW, RADIUS, FONT_FAMILY_DISPLAY } from "../theme/tokens.js";
import { useAppStore, BADGES } from "../store/AppStore.jsx";
import { getLevelForXP, getLevelProgress, getNextLevel } from "../data/levels.js";

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
  const earnedBadges = BADGES.filter((b) => b.ok({ xp, progress }));

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
                  <div style={{ fontSize: 11, color: COLORS.muted2 }}>{b.description}</div>
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
