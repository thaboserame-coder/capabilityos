import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { useAppStore } from "../store/useAppStore.js";
import { COLORS, FONT_FAMILY_DISPLAY } from "../theme/tokens.js";
import { INDUSTRIES } from "../data/industries.js";

/**
 * Sign-in / sign-up screen. CapabilityOS has no real authentication backend
 * in this scaffold — `name` doubles as the learner identifier, matching the
 * original prototype's behaviour. A returning learner who enters the same
 * name resumes their saved progress (see `useAppStore.login`).
 *
 * Documented as a known gap for production: see docs/ARCHITECTURE.md
 * "Authentication" for the recommended path (SSO via the organisation's
 * identity provider) before this is used with real cohorts.
 */
export default function Login() {
  const login = useAppStore((state) => state.login);
  const [name, setName] = useState("");
  const [industry, setIndustry] = useState(INDUSTRIES[0]);
  const [error, setError] = useState("");

  /** @param {React.FormEvent<HTMLFormElement>} event */
  function handleSubmit(event) {
    event.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setError("Please enter your name to continue.");
      return;
    }
    setError("");
    login(trimmed, industry);
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
    >
      <div
        className="fade-in"
        style={{
          width: "100%",
          maxWidth: 440,
          background: COLORS.surf,
          border: `1px solid ${COLORS.border}`,
          borderRadius: 16,
          padding: 40,
        }}
      >
        <p
          style={{
            fontSize: 12,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: COLORS.acc,
            marginBottom: 8,
          }}
        >
          Digilytics AI Academy
        </p>
        <h1
          style={{
            fontFamily: FONT_FAMILY_DISPLAY,
            fontSize: 32,
            fontWeight: 500,
            color: COLORS.text,
            marginBottom: 8,
          }}
        >
          CapabilityOS
        </h1>
        <p style={{ fontSize: 14, color: COLORS.muted2, marginBottom: 32, lineHeight: 1.6 }}>
          Enter your name and industry to start, or resume, your AI capability journey.
        </p>

        <form onSubmit={handleSubmit} noValidate>
          <label htmlFor="learner-name" style={labelStyle}>
            Full name
          </label>
          <input
            id="learner-name"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="e.g. Thabo Serame"
            autoComplete="name"
            aria-invalid={Boolean(error)}
            aria-describedby={error ? "name-error" : undefined}
            style={inputStyle}
          />

          <label htmlFor="learner-industry" style={{ ...labelStyle, marginTop: 16 }}>
            Industry
          </label>
          <select
            id="learner-industry"
            value={industry}
            onChange={(event) => setIndustry(event.target.value)}
            style={inputStyle}
          >
            {INDUSTRIES.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>

          {error ? (
            <p
              id="name-error"
              role="alert"
              style={{ color: COLORS.danger, fontSize: 13, marginTop: 12 }}
            >
              {error}
            </p>
          ) : null}

          <button type="submit" className="nb" style={submitStyle}>
            Continue <ArrowRight size={16} aria-hidden="true" />
          </button>
        </form>
      </div>
    </main>
  );
}

const labelStyle = {
  display: "block",
  fontSize: 12,
  fontWeight: 500,
  color: COLORS.muted2,
  marginBottom: 6,
};

const inputStyle = {
  width: "100%",
  padding: "12px 14px",
  borderRadius: 8,
  border: `1px solid ${COLORS.border}`,
  background: COLORS.surf2,
  color: COLORS.text,
  fontSize: 14,
  outline: "none",
};

const submitStyle = {
  width: "100%",
  marginTop: 28,
  padding: "13px 16px",
  borderRadius: 8,
  border: `1px solid ${COLORS.borderH}`,
  background: COLORS.acc,
  color: COLORS.bg,
  fontSize: 14,
  fontWeight: 600,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
};
