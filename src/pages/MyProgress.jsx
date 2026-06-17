import React, { useState } from "react";
import { Link } from "react-router-dom";
import { COLORS, TYPE_SCALE, SHADOW, RADIUS, FONT_FAMILY_DISPLAY } from "../theme/tokens.js";
import { useAppStore, BADGES, MISSIONS, DEMO_COHORT } from "../store/AppStore.jsx";
import { getLevelForXP, getLevelProgress } from "../data/levels.js";
import { TIERS } from "../data/tiers.js";
import { CAP_DIMS, ROLE_DIMS } from "../data/assessment.js";

// ─── Helpers ──────────────────────────────────────────────────────────────────
function estimateDimScore(dim, xp, role) {
  const roleDimIds = ROLE_DIMS[role] || ROLE_DIMS.learner;
  if (!roleDimIds.includes(dim.id)) return null;
  const dimIndex = parseInt(dim.id.replace("d", ""), 10) - 1;
  const base = Math.max(0, xp - dimIndex * 80);
  return Math.min(100, Math.round(base / 10));
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function MyProgress() {
  const { auth, xp, progress, perfectQuizzes, streak, accessibleTiers, isModuleDone } =
    useAppStore();
  const role = auth?.role || "learner";
  const [activeTab, setActiveTab] = useState("overview"); // overview | badges | leaderboard

  const { current: level, next: nextLevel, pct } = getLevelProgress(xp);

  const earnedBadges = BADGES.filter((b) => b.ok(progress, perfectQuizzes));
  const lockedBadges = BADGES.filter((b) => !b.ok(progress, perfectQuizzes));

  const getMissionProgress = (m) => m.checkFn(progress, streak);
  const completedMissions = MISSIONS.filter((m) => getMissionProgress(m) >= m.totalSteps);

  const totalMods = accessibleTiers.reduce((sum, t) => sum + t.mods.length, 0);
  const doneMods = accessibleTiers.reduce(
    (sum, t) => sum + t.mods.filter((m) => isModuleDone(t.id, m.id)).length,
    0
  );
  const overallPct = totalMods > 0 ? Math.round((doneMods / totalMods) * 100) : 0;

  // Leaderboard
  const allEntries = [
    { name: auth?.name || "You", ind: auth?.industry || "", xp, isYou: true },
    ...DEMO_COHORT,
  ].sort((a, b) => b.xp - a.xp);
  const myRank = allEntries.findIndex((e) => e.isYou) + 1;

  // Skill dims
  const roleDimIds = ROLE_DIMS[role] || ROLE_DIMS.learner;
  const dims = CAP_DIMS.filter((d) => roleDimIds.includes(d.id));

  const TABS = [
    { id: "overview",    label: "Overview" },
    { id: "badges",      label: `Badges (${earnedBadges.length}/${BADGES.length})` },
    { id: "leaderboard", label: "Leaderboard" },
  ];

  return (
    <div style={{ padding: "40px 48px", maxWidth: 1060 }}>
      {/* Header */}
      <div style={{ ...TYPE_SCALE.caption, color: COLORS.muted2, textTransform: "uppercase" }}>
        Progress & Recognition
      </div>
      <h1
        style={{
          fontFamily: FONT_FAMILY_DISPLAY,
          fontSize: 30, fontWeight: 700, letterSpacing: "-0.02em",
          color: COLORS.text, marginTop: 6,
        }}
      >
        My Progress
      </h1>

      {/* Hero — XP + Level + Streak */}
      <div
        style={{
          display: "flex", gap: 14, marginTop: 24, flexWrap: "wrap",
        }}
      >
        {/* Level card */}
        <div
          style={{
            flex: "2 1 280px",
            background: `linear-gradient(135deg, ${COLORS.acc} 0%, #2563EB 100%)`,
            borderRadius: RADIUS.lg, padding: "22px 26px", color: "#fff",
            boxShadow: SHADOW.md,
          }}
        >
          <div style={{ fontSize: 11, fontWeight: 700, opacity: 0.75, textTransform: "uppercase", letterSpacing: "0.06em" }}>
            Current Level
          </div>
          <div style={{ fontFamily: FONT_FAMILY_DISPLAY, fontSize: 28, fontWeight: 800, marginTop: 6 }}>
            {level.name}
          </div>
          <div style={{ fontSize: 13, opacity: 0.8, marginTop: 4 }}>
            {xp.toLocaleString()} XP accumulated
          </div>
          {/* XP bar */}
          <div style={{ marginTop: 16, height: 6, borderRadius: 999, background: "rgba(255,255,255,0.25)", overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${pct}%`, background: "#fff", borderRadius: 999, transition: "width .6s" }} />
          </div>
          <div style={{ fontSize: 11, opacity: 0.7, marginTop: 7 }}>
            {nextLevel
              ? `${(nextLevel.min - xp).toLocaleString()} XP to ${nextLevel.name}`
              : "Maximum level reached 🎉"}
          </div>
        </div>

        {/* Stats column */}
        <div style={{ flex: "1 1 140px", display: "flex", flexDirection: "column", gap: 10 }}>
          <MiniStat label="Modules done" value={`${doneMods}/${totalMods}`} sub={`${overallPct}% complete`} accent={COLORS.acc} />
          <MiniStat label="Badges earned" value={earnedBadges.length} sub={`of ${BADGES.length} total`} accent="#E8B84B" />
          <MiniStat label="Cohort rank" value={`#${myRank}`} sub={`of ${allEntries.length} learners`} accent={COLORS.green} />
        </div>

        {/* Streak card */}
        <div
          style={{
            flex: "1 1 140px",
            background: COLORS.surf, border: `1px solid ${COLORS.border}`,
            borderRadius: RADIUS.lg, boxShadow: SHADOW.sm,
            padding: "22px 20px", textAlign: "center",
          }}
        >
          <div style={{ fontSize: 40, lineHeight: 1 }}>🔥</div>
          <div style={{ fontFamily: FONT_FAMILY_DISPLAY, fontSize: 32, fontWeight: 800, color: COLORS.fire, marginTop: 8 }}>
            {streak || 0}
          </div>
          <div style={{ fontSize: 12, color: COLORS.muted, marginTop: 4 }}>Day streak</div>
          <div style={{ ...TYPE_SCALE.caption, color: COLORS.muted2, marginTop: 6 }}>
            {completedMissions.length} missions complete
          </div>
        </div>
      </div>

      {/* Tier completion bars */}
      <section style={{ marginTop: 32 }}>
        <h2 style={{ ...TYPE_SCALE.sectionTitle, marginBottom: 14 }}>Learning pathway</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, maxWidth: 700 }}>
          {accessibleTiers.map((tier) => {
            const done = tier.mods.filter((m) => isModuleDone(tier.id, m.id)).length;
            const tierPct = tier.mods.length ? Math.round((done / tier.mods.length) * 100) : 0;
            return (
              <Link
                key={tier.id}
                to="/learning"
                style={{ textDecoration: "none" }}
              >
                <div
                  style={{
                    background: COLORS.surf, border: `1px solid ${COLORS.border}`,
                    borderRadius: RADIUS.md, boxShadow: SHADOW.sm,
                    padding: "14px 18px",
                    display: "flex", alignItems: "center", gap: 14,
                  }}
                >
                  <div
                    style={{
                      width: 40, height: 40, borderRadius: RADIUS.sm, flexShrink: 0,
                      background: tier.color + "18",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 18,
                    }}
                  >
                    {tier.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 7 }}>
                      <span style={{ fontWeight: 700, fontSize: 14, color: COLORS.text }}>{tier.name}</span>
                      <span style={{ fontSize: 12, color: tier.color, fontWeight: 700 }}>
                        {done}/{tier.mods.length} modules
                        {done === tier.mods.length && tier.mods.length > 0 && (
                          <span style={{ marginLeft: 8, color: COLORS.green }}>✓ Complete</span>
                        )}
                      </span>
                    </div>
                    <div style={{ height: 6, borderRadius: 999, background: COLORS.border, overflow: "hidden" }}>
                      <div
                        style={{
                          height: "100%", width: `${tierPct}%`,
                          background: done === tier.mods.length && tier.mods.length > 0 ? COLORS.green : tier.color,
                          borderRadius: 999, transition: "width .6s",
                        }}
                      />
                    </div>
                  </div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: COLORS.muted2, flexShrink: 0 }}>{tierPct}%</div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Tab navigation */}
      <div style={{ display: "flex", gap: 4, marginTop: 40, borderBottom: `1px solid ${COLORS.border}`, paddingBottom: 0 }}>
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            style={{
              padding: "9px 18px",
              background: "none", border: "none",
              borderBottom: activeTab === t.id ? `2px solid ${COLORS.acc}` : "2px solid transparent",
              cursor: "pointer", fontFamily: "inherit",
              fontSize: 14, fontWeight: activeTab === t.id ? 700 : 500,
              color: activeTab === t.id ? COLORS.acc : COLORS.muted,
              marginBottom: -1,
              transition: "all .15s",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div style={{ marginTop: 24 }}>
        {activeTab === "overview" && (
          <SkillPassport dims={dims} xp={xp} role={role} />
        )}
        {activeTab === "badges" && (
          <BadgesPanel earnedBadges={earnedBadges} lockedBadges={lockedBadges} />
        )}
        {activeTab === "leaderboard" && (
          <LeaderboardPanel allEntries={allEntries} myRank={myRank} />
        )}
      </div>
    </div>
  );
}

// ─── Mini Stat ─────────────────────────────────────────────────────────────────
function MiniStat({ label, value, sub, accent }) {
  return (
    <div
      style={{
        background: COLORS.surf, border: `1px solid ${COLORS.border}`,
        borderRadius: RADIUS.md, boxShadow: SHADOW.sm,
        padding: "14px 16px", flex: 1,
      }}
    >
      <div style={{ ...TYPE_SCALE.caption, color: COLORS.muted2, textTransform: "uppercase" }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 800, color: accent, marginTop: 4 }}>{value}</div>
      <div style={{ fontSize: 11, color: COLORS.muted2, marginTop: 3 }}>{sub}</div>
    </div>
  );
}

// ─── Skill Passport ────────────────────────────────────────────────────────────
function SkillPassport({ dims, xp, role }) {
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h2 style={{ ...TYPE_SCALE.sectionTitle }}>Capability Passport</h2>
        <Link to="/assess" style={{ fontSize: 13, color: COLORS.acc, fontWeight: 600, textDecoration: "none" }}>
          Full assessment →
        </Link>
      </div>
      <p style={{ fontSize: 13, color: COLORS.muted, marginBottom: 20, marginTop: -8 }}>
        Estimated capability levels based on your learning activity.
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 12 }}>
        {dims.map((d) => {
          const score = (() => {
            const roleDimIds = ROLE_DIMS[role] || ROLE_DIMS.learner;
            if (!roleDimIds.includes(d.id)) return null;
            const dimIndex = parseInt(d.id.replace("d", ""), 10) - 1;
            const base = Math.max(0, xp - dimIndex * 80);
            return Math.min(100, Math.round(base / 10));
          })();
          if (score === null) return null;
          const label =
            score < 25 ? "Aware" :
            score < 50 ? "Developing" :
            score < 75 ? "Proficient" : "Advanced";
          const labelColor =
            score < 25 ? COLORS.muted2 :
            score < 50 ? COLORS.gold :
            score < 75 ? COLORS.acc : COLORS.green;

          return (
            <div
              key={d.id}
              style={{
                background: COLORS.surf, border: `1px solid ${COLORS.border}`,
                borderLeft: `3px solid ${d.color}`, borderRadius: RADIUS.md,
                padding: "14px 16px", boxShadow: SHADOW.sm,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontWeight: 700, fontSize: 13, color: COLORS.text }}>{d.name}</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: labelColor }}>{label}</span>
              </div>
              <div style={{ height: 6, borderRadius: 999, background: COLORS.border, overflow: "hidden", marginBottom: 6 }}>
                <div
                  style={{
                    height: "100%", width: `${score}%`, background: d.color,
                    borderRadius: 999, transition: "width 600ms ease",
                  }}
                />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: 11, color: COLORS.muted2 }}>{d.skills.slice(0, 2).join(" · ")}</span>
                <span style={{ fontSize: 11, color: COLORS.muted2, fontWeight: 600 }}>{score}%</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Badges Panel ──────────────────────────────────────────────────────────────
function BadgesPanel({ earnedBadges, lockedBadges }) {
  return (
    <div>
      {earnedBadges.length > 0 && (
        <div style={{ marginBottom: 28 }}>
          <div
            style={{
              ...TYPE_SCALE.caption, color: COLORS.green, fontWeight: 700,
              textTransform: "uppercase", marginBottom: 12,
            }}
          >
            ✓ Earned ({earnedBadges.length})
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 10 }}>
            {earnedBadges.map((b) => (
              <BadgeCard key={b.id} badge={b} earned />
            ))}
          </div>
        </div>
      )}

      {earnedBadges.length === 0 && (
        <div
          style={{
            background: COLORS.surf, border: `1px dashed ${COLORS.border}`,
            borderRadius: RADIUS.md, padding: "32px 24px", textAlign: "center",
            marginBottom: 24,
          }}
        >
          <div style={{ fontSize: 36, marginBottom: 10 }}>🏆</div>
          <div style={{ fontWeight: 700, fontSize: 14, color: COLORS.text }}>No badges yet</div>
          <div style={{ fontSize: 13, color: COLORS.muted, marginTop: 6 }}>
            Complete modules to start earning badges.
          </div>
          <Link
            to="/learning"
            style={{
              display: "inline-block", marginTop: 14,
              padding: "8px 20px", background: COLORS.acc, color: "#fff",
              borderRadius: RADIUS.sm, fontWeight: 700, fontSize: 13,
              textDecoration: "none",
            }}
          >
            Start learning →
          </Link>
        </div>
      )}

      {lockedBadges.length > 0 && (
        <div>
          <div
            style={{
              ...TYPE_SCALE.caption, color: COLORS.muted2,
              textTransform: "uppercase", marginBottom: 12,
            }}
          >
            Locked ({lockedBadges.length})
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 10 }}>
            {lockedBadges.map((b) => (
              <BadgeCard key={b.id} badge={b} earned={false} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function BadgeCard({ badge, earned }) {
  return (
    <div
      style={{
        display: "flex", gap: 12, alignItems: "flex-start",
        background: earned ? "#FFFBEB" : COLORS.surf,
        border: `1px solid ${earned ? "#E8B84B40" : COLORS.border}`,
        borderRadius: RADIUS.md, padding: "14px 16px",
        opacity: earned ? 1 : 0.5,
        filter: earned ? "none" : "grayscale(0.7)",
      }}
    >
      <span style={{ fontSize: 28, lineHeight: 1 }}>{badge.icon}</span>
      <div>
        <div style={{ fontWeight: 700, fontSize: 14, color: COLORS.text }}>{badge.name}</div>
        <div style={{ fontSize: 12, color: COLORS.muted, marginTop: 3, lineHeight: 1.4 }}>{badge.desc}</div>
        <div style={{ fontSize: 11, marginTop: 5, fontWeight: 700, color: earned ? COLORS.green : COLORS.muted2 }}>
          {earned ? "✓ Earned" : "🔒 Keep learning to unlock"}
        </div>
      </div>
    </div>
  );
}

// ─── Leaderboard Panel ─────────────────────────────────────────────────────────
const MEDAL = ["🥇", "🥈", "🥉"];

function LeaderboardPanel({ allEntries, myRank }) {
  const topXP = allEntries[0]?.xp || 1;

  return (
    <div style={{ maxWidth: 680 }}>
      <p style={{ fontSize: 13, color: COLORS.muted, marginBottom: 20 }}>
        Rankings based on total XP earned across modules, quizzes, and challenges.
      </p>

      {/* Top 3 podium */}
      {allEntries.length >= 3 && (
        <div
          style={{
            display: "flex", gap: 10, marginBottom: 28,
            alignItems: "flex-end", justifyContent: "center",
          }}
        >
          {[allEntries[1], allEntries[0], allEntries[2]].map((entry, podiumIdx) => {
            if (!entry) return <div key={podiumIdx} style={{ width: 100 }} />;
            const realRank = allEntries.indexOf(entry);
            const heights = [80, 110, 60];
            const level = getLevelForXP(entry.xp);
            return (
              <div
                key={entry.name}
                style={{
                  display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
                  flex: 1, maxWidth: 140,
                }}
              >
                <div style={{ fontSize: 22 }}>{MEDAL[realRank] || ""}</div>
                <div style={{ fontWeight: 700, fontSize: 13, color: entry.isYou ? COLORS.acc : COLORS.text, textAlign: "center" }}>
                  {entry.name.split(" ")[0]}{entry.isYou ? " (You)" : ""}
                </div>
                <div style={{ fontSize: 11, color: COLORS.muted2 }}>{level.name}</div>
                <div
                  style={{
                    width: "100%", height: heights[podiumIdx],
                    background: entry.isYou ? COLORS.acc + "25" : COLORS.bg,
                    border: `1px solid ${entry.isYou ? COLORS.acc + "40" : COLORS.border}`,
                    borderRadius: `${RADIUS.sm} ${RADIUS.sm} 0 0`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexDirection: "column",
                  }}
                >
                  <div style={{ fontWeight: 800, fontSize: 15, color: entry.isYou ? COLORS.acc : COLORS.text }}>
                    {entry.xp.toLocaleString()}
                  </div>
                  <div style={{ fontSize: 10, color: COLORS.muted2 }}>XP</div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Full list */}
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {allEntries.map((entry, i) => {
          const level = getLevelForXP(entry.xp);
          const barW = Math.round((entry.xp / topXP) * 100);
          const isYou = entry.isYou;
          return (
            <div
              key={entry.name + i}
              style={{
                background: isYou ? COLORS.acc + "08" : COLORS.surf,
                border: `1px solid ${isYou ? COLORS.acc + "30" : COLORS.border}`,
                borderRadius: RADIUS.md,
                padding: "12px 16px",
                display: "flex", alignItems: "center", gap: 14,
              }}
            >
              <div
                style={{
                  width: 28, textAlign: "center", flexShrink: 0,
                  fontWeight: 800, fontSize: 14,
                  color: i < 3 ? ["#D4AC0D", "#8D9098", "#A85328"][i] : COLORS.muted2,
                }}
              >
                {i < 3 ? MEDAL[i] : `#${i + 1}`}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}>
                  <span style={{ fontWeight: isYou ? 700 : 500, fontSize: 14, color: isYou ? COLORS.acc : COLORS.text }}>
                    {entry.name}{isYou ? " (You)" : ""}
                  </span>
                  <span style={{ fontWeight: 700, fontSize: 13, color: COLORS.text }}>
                    {entry.xp.toLocaleString()} XP
                  </span>
                </div>
                <div style={{ height: 4, borderRadius: 999, background: COLORS.border, overflow: "hidden" }}>
                  <div
                    style={{
                      height: "100%", width: `${barW}%`,
                      background: isYou ? COLORS.acc : COLORS.muted2 + "60",
                      borderRadius: 999, transition: "width .6s",
                    }}
                  />
                </div>
                <div style={{ fontSize: 11, color: COLORS.muted2, marginTop: 4 }}>
                  {level.name}{entry.ind ? ` · ${entry.ind}` : ""}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
