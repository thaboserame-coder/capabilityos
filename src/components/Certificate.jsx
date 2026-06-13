import { ArrowLeft, Award, Lock } from "lucide-react";
import { useAppStore } from "../store/useAppStore.js";
import { COLORS, FONT_FAMILY_DISPLAY } from "../theme/tokens.js";
import { TIERS, findTier } from "../data/tiers.js";
import { getIcon } from "../theme/icons.js";

/**
 * Certificates screen. `screen: "certificate"`, with optional
 * `params: { tierId }`.
 *
 * - If `tierId` is provided and that tier is fully completed, renders a
 *   shareable certificate for that tier.
 * - Otherwise, renders an overview of all tiers and their certification
 *   status, each linking to its certificate once unlocked.
 */
export default function Certificate() {
  const user = useAppStore((state) => state.user);
  const screen = useAppStore((state) => state.screen);
  const navigateTo = useAppStore((state) => state.navigateTo);
  const goBack = useAppStore((state) => state.goBack);

  if (!user) return null;

  const tierId = screen.params?.tierId;
  const tier = tierId ? findTier(tierId) : null;

  if (tier) {
    const completed = tier.mods.every((m) => user.progress.includes(m.id));
    if (!completed) {
      return (
        <main style={{ maxWidth: 720, margin: "0 auto", padding: "32px 24px" }}>
          <BackButton onClick={goBack} />
          <p style={{ color: COLORS.muted2, marginTop: 16 }}>
            Complete every module in {tier.name} to unlock this certificate.
          </p>
        </main>
      );
    }

    return (
      <main
        className="fade-in"
        style={{ maxWidth: 720, margin: "0 auto", padding: "32px 24px 64px" }}
      >
        <BackButton onClick={goBack} />
        <CertificateCard tier={tier} learnerName={user.name} />
      </main>
    );
  }

  return (
    <main
      className="fade-in"
      style={{ maxWidth: 900, margin: "0 auto", padding: "32px 24px 64px" }}
    >
      <h1
        style={{
          fontFamily: FONT_FAMILY_DISPLAY,
          fontSize: 26,
          fontWeight: 500,
          color: COLORS.text,
          marginBottom: 24,
        }}
      >
        Certificates
      </h1>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: 16,
        }}
      >
        {TIERS.map((t) => {
          const completed = t.mods.every((m) => user.progress.includes(m.id));
          const Icon = getIcon(t.iconKey);
          return (
            <button
              key={t.id}
              type="button"
              className="tcard"
              onClick={() => completed && navigateTo("certificate", { tierId: t.id })}
              disabled={!completed}
              style={{
                textAlign: "left",
                padding: 20,
                borderRadius: 14,
                border: `1px solid ${completed ? t.color + "55" : COLORS.border}`,
                background: completed ? `${t.color}14` : COLORS.surf,
                cursor: completed ? "pointer" : "default",
                opacity: completed ? 1 : 0.6,
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
                    background: t.colorLight,
                    color: t.color,
                  }}
                >
                  <Icon size={18} aria-hidden="true" />
                </span>
                <p style={{ fontSize: 15, fontWeight: 600, color: COLORS.text }}>{t.name}</p>
                {completed ? (
                  <Award
                    size={16}
                    color={COLORS.gold}
                    style={{ marginLeft: "auto" }}
                    aria-hidden="true"
                  />
                ) : (
                  <Lock
                    size={14}
                    color={COLORS.muted}
                    style={{ marginLeft: "auto" }}
                    aria-hidden="true"
                  />
                )}
              </div>
              <p style={{ fontSize: 12, color: COLORS.muted2 }}>
                {completed
                  ? "Certificate unlocked — select to view"
                  : `${t.mods.filter((m) => user.progress.includes(m.id)).length} / ${t.mods.length} modules complete`}
              </p>
            </button>
          );
        })}
      </div>
    </main>
  );
}

/** @param {{ onClick: () => void }} props */
function BackButton({ onClick }) {
  return (
    <button
      type="button"
      className="nb"
      onClick={onClick}
      style={{
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
      }}
    >
      <ArrowLeft size={14} aria-hidden="true" /> Back
    </button>
  );
}

/**
 * @param {{ tier: import("../data/tiers.js").Tier, learnerName: string }} props
 */
function CertificateCard({ tier, learnerName }) {
  const Icon = getIcon(tier.iconKey);
  const date = new Date().toLocaleDateString("en-ZA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div
      style={{
        marginTop: 24,
        padding: 48,
        borderRadius: 20,
        border: `2px solid ${tier.color}`,
        background: `linear-gradient(160deg, ${tier.colorLight}, ${COLORS.surf})`,
        textAlign: "center",
      }}
    >
      <p
        style={{
          fontSize: 11,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: tier.color,
          marginBottom: 16,
        }}
      >
        Digilytics AI Academy
      </p>
      <Icon size={40} color={tier.color} aria-hidden="true" />
      <h1
        style={{
          fontFamily: FONT_FAMILY_DISPLAY,
          fontSize: 32,
          fontWeight: 500,
          color: COLORS.text,
          margin: "16px 0 6px",
        }}
      >
        Certificate of Completion
      </h1>
      <p style={{ fontSize: 14, color: COLORS.muted2, marginBottom: 24 }}>This certifies that</p>
      <p
        style={{
          fontFamily: FONT_FAMILY_DISPLAY,
          fontSize: 28,
          fontWeight: 500,
          color: tier.color,
          marginBottom: 24,
        }}
      >
        {learnerName}
      </p>
      <p
        style={{
          fontSize: 14,
          color: COLORS.muted2,
          lineHeight: 1.8,
          maxWidth: 440,
          margin: "0 auto 24px",
        }}
      >
        has successfully completed all {tier.mods.length} modules of the{" "}
        <strong style={{ color: COLORS.text }}>{tier.name}</strong> ({tier.level}) programme,
        demonstrating applied AI capability for {tier.audience.toLowerCase()}.
      </p>
      <p style={{ fontSize: 12, color: COLORS.muted }}>
        Issued {date} · CapabilityOS by Digilytics
      </p>
    </div>
  );
}
