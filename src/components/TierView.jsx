import { ArrowLeft, Check, ChevronRight, Circle } from "lucide-react";
import { useAppStore } from "../store/useAppStore.js";
import { COLORS, FONT_FAMILY_DISPLAY } from "../theme/tokens.js";
import { findTier } from "../data/tiers.js";
import { getIcon } from "../theme/icons.js";

/**
 * Lists every module in a tier with completion state. `screen: "tier"`,
 * expects `params: { tierId }`.
 */
export default function TierView() {
  const user = useAppStore((state) => state.user);
  const screen = useAppStore((state) => state.screen);
  const navigateTo = useAppStore((state) => state.navigateTo);
  const goBack = useAppStore((state) => state.goBack);

  const tierId = screen.params?.tierId;
  const tier = findTier(tierId);

  if (!user || !tier) {
    return (
      <main style={{ maxWidth: 800, margin: "0 auto", padding: "32px 24px" }}>
        <p style={{ color: COLORS.muted2 }}>Tier not found.</p>
        <button
          type="button"
          className="nb"
          onClick={() => navigateTo("dashboard")}
          style={backButtonStyle}
        >
          <ArrowLeft size={14} aria-hidden="true" /> Back to dashboard
        </button>
      </main>
    );
  }

  const Icon = getIcon(tier.iconKey);
  const completedCount = tier.mods.filter((m) => user.progress.includes(m.id)).length;
  const allComplete = completedCount === tier.mods.length;

  return (
    <main
      className="fade-in"
      style={{ maxWidth: 900, margin: "0 auto", padding: "32px 24px 64px" }}
    >
      <button type="button" className="nb" onClick={goBack} style={backButtonStyle}>
        <ArrowLeft size={14} aria-hidden="true" /> Back
      </button>

      <div
        style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 16, marginBottom: 8 }}
      >
        <span
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 44,
            height: 44,
            borderRadius: 12,
            background: tier.colorLight,
            color: tier.color,
          }}
        >
          <Icon size={22} aria-hidden="true" />
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
            {tier.level} · {tier.audience}
          </p>
          <h1
            style={{
              fontFamily: FONT_FAMILY_DISPLAY,
              fontSize: 26,
              fontWeight: 500,
              color: COLORS.text,
            }}
          >
            {tier.name}
          </h1>
        </div>
      </div>

      <p
        style={{
          fontSize: 14,
          color: COLORS.muted2,
          lineHeight: 1.7,
          maxWidth: 640,
          marginBottom: 8,
        }}
      >
        {tier.description}
      </p>
      <p style={{ fontSize: 12, color: COLORS.muted, marginBottom: 28 }}>{tier.duration}</p>

      {allComplete ? (
        <div
          className="fade-in"
          style={{
            marginBottom: 24,
            padding: "14px 18px",
            borderRadius: 10,
            border: `1px solid ${COLORS.gold}55`,
            background: `${COLORS.gold}1A`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
          }}
        >
          <p style={{ fontSize: 14, color: COLORS.text }}>
            You&apos;ve completed every module in {tier.name}. Your certificate is ready.
          </p>
          <button
            type="button"
            className="nb"
            onClick={() => navigateTo("certificate", { tierId: tier.id })}
            style={{
              padding: "8px 14px",
              borderRadius: 8,
              border: `1px solid ${COLORS.gold}`,
              background: "transparent",
              color: COLORS.gold,
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            View certificate
          </button>
        </div>
      ) : null}

      <ol style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
        {tier.mods.map((mod, index) => {
          const done = user.progress.includes(mod.id);
          return (
            <li key={mod.id}>
              <button
                type="button"
                className="mcard"
                onClick={() => navigateTo("module", { tierId: tier.id, moduleId: mod.id })}
                style={{
                  width: "100%",
                  textAlign: "left",
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  padding: "14px 16px",
                  borderRadius: 10,
                  border: `1px solid ${COLORS.border}`,
                  background: COLORS.surf,
                  cursor: "pointer",
                  color: "inherit",
                }}
              >
                <span
                  aria-hidden="true"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    background: done ? `${COLORS.green}22` : COLORS.surf3,
                    color: done ? COLORS.green : COLORS.muted,
                    flexShrink: 0,
                  }}
                >
                  {done ? <Check size={14} /> : <Circle size={14} />}
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 14, fontWeight: 600, color: COLORS.text }}>
                    {index + 1}. {mod.title}
                  </p>
                  <p style={{ fontSize: 12, color: COLORS.muted, marginTop: 2 }}>
                    {mod.type} · {mod.dur}
                  </p>
                </div>
                <ChevronRight
                  size={16}
                  style={{ color: COLORS.muted, flexShrink: 0 }}
                  aria-hidden="true"
                />
              </button>
            </li>
          );
        })}
      </ol>
    </main>
  );
}

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
