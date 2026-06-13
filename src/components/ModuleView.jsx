import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { useAppStore } from "../store/useAppStore.js";
import { COLORS, FONT_FAMILY_DISPLAY } from "../theme/tokens.js";
import { findModule } from "../data/tiers.js";

/**
 * Renders a single module's content and lets the learner mark it complete
 * or jump into its quiz. `screen: "module"`, expects
 * `params: { tierId, moduleId }`.
 *
 * Security note: `mod.html` is rendered via `dangerouslySetInnerHTML`. This
 * is acceptable here because module content is static, author-controlled
 * data shipped in `src/data/tiers.js` — it is never user-supplied or fetched
 * from an untrusted source. If module content is ever moved to a CMS that
 * accepts external input, it MUST be sanitised (e.g. with DOMPurify) before
 * reaching this component.
 */
export default function ModuleView() {
  const user = useAppStore((state) => state.user);
  const screen = useAppStore((state) => state.screen);
  const navigateTo = useAppStore((state) => state.navigateTo);
  const goBack = useAppStore((state) => state.goBack);
  const completeModule = useAppStore((state) => state.completeModule);

  const { tierId, moduleId } = screen.params ?? {};
  const { tier, mod, index } = findModule(tierId, moduleId);

  if (!user || !tier || !mod) {
    return (
      <main style={{ maxWidth: 800, margin: "0 auto", padding: "32px 24px" }}>
        <p style={{ color: COLORS.muted2 }}>Module not found.</p>
        <button
          type="button"
          className="nb"
          onClick={() => navigateTo("dashboard")}
          style={navButtonStyle}
        >
          <ArrowLeft size={14} aria-hidden="true" /> Back to dashboard
        </button>
      </main>
    );
  }

  const done = user.progress.includes(mod.id);
  const nextMod = tier.mods[index + 1];
  const prevMod = tier.mods[index - 1];

  return (
    <main
      className="fade-in"
      style={{ maxWidth: 760, margin: "0 auto", padding: "32px 24px 64px" }}
    >
      <button type="button" className="nb" onClick={goBack} style={navButtonStyle}>
        <ArrowLeft size={14} aria-hidden="true" /> Back to {tier.name}
      </button>

      <p
        style={{
          fontSize: 11,
          color: tier.color,
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          marginTop: 18,
        }}
      >
        {tier.level} · Module {index + 1} of {tier.mods.length}
      </p>
      <h1
        style={{
          fontFamily: FONT_FAMILY_DISPLAY,
          fontSize: 26,
          fontWeight: 500,
          color: COLORS.text,
          margin: "6px 0 4px",
        }}
      >
        {mod.title}
      </h1>
      <p style={{ fontSize: 13, color: COLORS.muted, marginBottom: 24 }}>
        {mod.type} · {mod.dur}
      </p>

      <div className="ch" dangerouslySetInnerHTML={{ __html: mod.html }} />

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 12,
          marginTop: 32,
          paddingTop: 24,
          borderTop: `1px solid ${COLORS.border}`,
        }}
      >
        {!done ? (
          <button
            type="button"
            className="nb"
            onClick={() => completeModule(tier.id, mod.id)}
            style={primaryButtonStyle}
          >
            <Check size={15} aria-hidden="true" /> Mark as complete
          </button>
        ) : (
          <span
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "10px 16px",
              borderRadius: 8,
              border: `1px solid ${COLORS.green}55`,
              color: COLORS.green,
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            <Check size={15} aria-hidden="true" /> Completed
          </span>
        )}

        <button
          type="button"
          className="nb"
          onClick={() => navigateTo("quiz", { tierId: tier.id, moduleId: mod.id })}
          style={secondaryButtonStyle}
        >
          Take the quiz
        </button>

        <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
          {prevMod ? (
            <button
              type="button"
              className="nb"
              onClick={() => navigateTo("module", { tierId: tier.id, moduleId: prevMod.id })}
              style={navButtonStyle}
            >
              <ArrowLeft size={14} aria-hidden="true" /> Previous
            </button>
          ) : null}
          {nextMod ? (
            <button
              type="button"
              className="nb"
              onClick={() => navigateTo("module", { tierId: tier.id, moduleId: nextMod.id })}
              style={navButtonStyle}
            >
              Next <ArrowRight size={14} aria-hidden="true" />
            </button>
          ) : null}
        </div>
      </div>
    </main>
  );
}

const navButtonStyle = {
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  padding: "8px 12px",
  borderRadius: 8,
  border: `1px solid ${COLORS.border}`,
  background: "transparent",
  color: COLORS.muted2,
  fontSize: 13,
  cursor: "pointer",
};

const primaryButtonStyle = {
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  padding: "10px 18px",
  borderRadius: 8,
  border: `1px solid ${COLORS.acc}`,
  background: COLORS.acc,
  color: COLORS.bg,
  fontSize: 13,
  fontWeight: 600,
  cursor: "pointer",
};

const secondaryButtonStyle = {
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  padding: "10px 18px",
  borderRadius: 8,
  border: `1px solid ${COLORS.borderH}`,
  background: COLORS.surf2,
  color: COLORS.text,
  fontSize: 13,
  fontWeight: 600,
  cursor: "pointer",
};
