import { ChevronRight } from "lucide-react";
import { useAppStore, useBadgeStatus } from "../store/useAppStore.js";
import { COLORS, FONT_FAMILY_DISPLAY } from "../theme/tokens.js";
import { TIERS } from "../data/tiers.js";
import { getIcon } from "../theme/icons.js";

/**
 * Learner home screen: tier overview cards with progress, and the badge
 * shelf. This is the `screen: "dashboard"` view.
 */
export default function LearnerDashboard() {
  const user = useAppStore((state) => state.user);
  const navigateTo = useAppStore((state) => state.navigateTo);
  const badges = useBadgeStatus();

  if (!user) return null;

  return (
    <main
      className="fade-in"
      style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 24px 64px" }}
    >
      <h1
        style={{
          fontFamily: FONT_FAMILY_DISPLAY,
          fontSize: 28,
          fontWeight: 500,
          color: COLORS.text,
        }}
      >
        Welcome back, {user.name.split(" ")[0]}
      </h1>
      <p style={{ fontSize: 14, color: COLORS.muted2, marginTop: 6, marginBottom: 32 }}>
        {user.progress.length} of {TIERS.reduce((n, t) => n + t.mods.length, 0)} modules complete ·{" "}
        {user.industry}
      </p>

      <section aria-label="Learning tiers">
        <h2 style={sectionHeading}>Your tiers</h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 16,
            marginBottom: 40,
          }}
        >
          {TIERS.map((tier) => {
            const completed = tier.mods.filter((m) => user.progress.includes(m.id)).length;
            const Icon = getIcon(tier.iconKey);
            const pct = Math.round((completed / tier.mods.length) * 100);

            return (
              <button
                key={tier.id}
                type="button"
                className="tcard"
                onClick={() => navigateTo("tier", { tierId: tier.id })}
                style={{
                  textAlign: "left",
                  background: COLORS.surf,
                  border: `1px solid ${COLORS.border}`,
                  borderRadius: 14,
                  padding: 20,
                  cursor: "pointer",
                  color: "inherit",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 36,
                      height: 36,
                      borderRadius: 10,
                      background: tier.colorLight,
                      color: tier.color,
                    }}
                  >
                    <Icon size={18} aria-hidden="true" />
                  </span>
                  <div>
                    <p
                      style={{
                        fontSize: 11,
                        color: COLORS.muted,
                        textTransform: "uppercase",
                        letterSpacing: "0.1em",
                      }}
                    >
                      {tier.level}
                    </p>
                    <p style={{ fontSize: 16, fontWeight: 600, color: COLORS.text }}>{tier.name}</p>
                  </div>
                  <ChevronRight
                    size={18}
                    style={{ marginLeft: "auto", color: COLORS.muted }}
                    aria-hidden="true"
                  />
                </div>
                <p
                  style={{ fontSize: 13, color: COLORS.muted2, lineHeight: 1.6, marginBottom: 12 }}
                >
                  {tier.description}
                </p>
                <div
                  role="progressbar"
                  aria-valuenow={pct}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`${completed} of ${tier.mods.length} modules complete`}
                  style={{
                    height: 6,
                    borderRadius: 999,
                    background: COLORS.surf3,
                    overflow: "hidden",
                  }}
                >
                  <div
                    className="xp-bar"
                    style={{ height: "100%", width: `${pct}%`, background: tier.color }}
                  />
                </div>
                <p style={{ fontSize: 12, color: COLORS.muted, marginTop: 6 }}>
                  {completed} / {tier.mods.length} modules
                </p>
              </button>
            );
          })}
        </div>
      </section>

      <section aria-label="Badges earned">
        <h2 style={sectionHeading}>Badges</h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
          {badges.map((badge) => {
            const Icon = getIcon(badge.icon);
            return (
              <div
                key={badge.id}
                className={badge.earned ? "badge-pop" : undefined}
                title={badge.desc}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "10px 14px",
                  borderRadius: 10,
                  border: `1px solid ${badge.earned ? COLORS.gold + "55" : COLORS.border}`,
                  background: badge.earned ? `${COLORS.gold}1A` : COLORS.surf,
                  opacity: badge.earned ? 1 : 0.45,
                  minWidth: 160,
                }}
              >
                <Icon
                  size={16}
                  color={badge.earned ? COLORS.gold : COLORS.muted}
                  aria-hidden="true"
                />
                <div>
                  <p style={{ fontSize: 13, fontWeight: 600, color: COLORS.text }}>{badge.name}</p>
                  <p style={{ fontSize: 11, color: COLORS.muted }}>{badge.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}

const sectionHeading = {
  fontFamily: FONT_FAMILY_DISPLAY,
  fontSize: 18,
  fontWeight: 500,
  color: COLORS.text,
  marginBottom: 14,
};
