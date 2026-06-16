import React, { useState } from "react";
import { useAppStore } from "../store/AppStore.jsx";
import { INDUSTRIES } from "../data/industries.js";
import { MGMT_FUNCTIONS, ROLE_DISPLAY, TIERS } from "../data/tiers.js";

const ROLES = [
  { id: "executive",  label: "Board & Executive",        tier: "Tier 1 — AI Executive",    color: "#0072C6", icon: "⬡" },
  { id: "functional", label: "Executive Leadership",     tier: "Tier 2 — AI Leader",        color: "#1D9E75", icon: "◈" },
  { id: "manager",    label: "Senior Management",        tier: "Tier 2 + 3",                color: "#7C3AED", icon: "◇" },
  { id: "learner",    label: "Professional Specialist",  tier: "Tier 3 — AI Practitioner",  color: "#C17F24", icon: "◉" },
  { id: "emerging",   label: "Emerging Talent",          tier: "Tier 3 — AI Practitioner",  color: "#5AC8FA", icon: "○" },
  { id: "facilitator",label: "Platform Administrator",   tier: "Admin Portal",              color: "#FF9500", icon: "◎" },
];

const VALID_CODES = ["ORG-2025", "DEMO-2025", "DIGILYTICS-2025", "CAPOS-2025"];
const ADMIN_CODE = "CAPOS-ADMIN-2025";

const PILLARS = [
  { icon: "◎", c: "#5AC8FA", label: "Assess Readiness",    desc: "8-dimension capability diagnostic" },
  { icon: "◈", c: "#7C3AED", label: "Develop Capability",  desc: "Role-based AI learning journeys" },
  { icon: "⬡", c: "#E8B84B", label: "Govern Responsibly",  desc: "AI ethics, POPIA, compliance" },
  { icon: "◊", c: "#34C759", label: "Measure Impact",       desc: "Executive workforce intelligence" },
  { icon: "◉", c: "#0072C6", label: "Accelerate Adoption",  desc: "From literacy to transformation" },
];

export default function Login() {
  const { login } = useAppStore();
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [industry, setIndustry] = useState("");
  const [fn, setFn] = useState("");
  const [accessCode, setAccessCode] = useState("");
  const [codeError, setCodeError] = useState("");
  const [step, setStep] = useState(1);

  const selRole = ROLES.find((r) => r.id === role);
  const isAdmin = role === "facilitator";
  const ok1 = name.trim().length > 0 && role.length > 0;

  function handleContinue() {
    if (step === 1) {
      if (ok1) setStep(isAdmin ? 3 : 2);
    } else if (step === 2) {
      setStep(3);
    } else if (step === 3) {
      setCodeError("");
      if (isAdmin) {
        if (accessCode.trim() !== ADMIN_CODE) {
          setCodeError("Invalid access code. Contact your system administrator.");
          return;
        }
        login(name.trim(), role, industry, fn);
      } else {
        if (
          accessCode.trim() &&
          !VALID_CODES.map((x) => x.toLowerCase()).includes(accessCode.trim().toLowerCase())
        ) {
          setCodeError("Invalid access code. Contact your platform administrator.");
          return;
        }
        login(name.trim(), role, industry, fn);
      }
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        background: "linear-gradient(160deg,#04080F 0%,#060E1E 50%,#050B18 100%)",
        fontFamily: "'Archivo', 'Inter', sans-serif",
      }}
    >
      {/* ── Left marketing panel ── */}
      <div
        className="mob-hide"
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "60px 64px",
          maxWidth: 520,
          borderRight: "1px solid rgba(255,255,255,0.04)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute", inset: 0,
            backgroundImage: "linear-gradient(rgba(0,102,255,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(0,102,255,0.03) 1px,transparent 1px)",
            backgroundSize: "40px 40px", pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute", top: -120, left: -80, width: 400, height: 400,
            borderRadius: "50%",
            background: "radial-gradient(circle,rgba(0,102,255,0.08) 0%,transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <div style={{ position: "relative" }}>
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 36 }}>
            <div
              style={{
                width: 36, height: 36, borderRadius: 9,
                background: "linear-gradient(135deg,#0052FF,#0085FF)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 18,
              }}
            >
              ◎
            </div>
            <div>
              <div style={{ fontSize: 18, fontWeight: 800, color: "#FFFFFF", letterSpacing: "-0.03em" }}>
                CapabilityOS
              </div>
              <div style={{ fontSize: 9, fontWeight: 600, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: ".12em" }}>
                by Digilytics Co.
              </div>
            </div>
          </div>

          <div style={{ fontSize: 10, fontWeight: 700, color: "rgba(0,150,255,0.7)", textTransform: "uppercase", letterSpacing: ".14em", marginBottom: 12 }}>
            Workforce Intelligence Platform
          </div>
          <div style={{ fontSize: 28, fontWeight: 800, color: "#FFFFFF", letterSpacing: "-0.04em", lineHeight: 1.1, marginBottom: 12 }}>
            Workforce<br />Intelligence for<br />
            <span style={{ color: "#5AB4FF" }}>the Future of Work</span>
          </div>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", lineHeight: 1.75, marginBottom: 32 }}>
            Assess capability. Accelerate adoption.<br />
            Measure impact. Transform Data, Analytics<br />
            and AI readiness across your organisation.
          </div>

          {PILLARS.map((p, i) => (
            <div
              key={i}
              style={{
                display: "flex", alignItems: "center", gap: 12,
                padding: "10px 14px", borderRadius: 8,
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.05)",
                marginBottom: 5,
              }}
            >
              <span style={{ fontSize: 14, color: p.c, flexShrink: 0, width: 18, textAlign: "center" }}>{p.icon}</span>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.85)" }}>{p.label}</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", marginTop: 1 }}>{p.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Right form panel ── */}
      <div
        style={{
          width: "min(500px,100vw)",
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: "clamp(12px,4vw,24px)", flexShrink: 0, boxSizing: "border-box",
        }}
      >
        <div
          style={{
            width: "100%",
            background: "rgba(255,255,255,0.97)",
            borderRadius: 16,
            boxShadow: "0 30px 90px rgba(0,0,0,0.5)",
            overflow: "hidden",
          }}
        >
          {/* Card header */}
          <div style={{ padding: "20px 26px 14px", background: "linear-gradient(135deg,#060E1E,#0A1832)" }}>
            <div style={{ fontSize: 16, fontWeight: 800, color: "#FFFFFF", letterSpacing: "-0.03em", marginBottom: 2 }}>
              {step === 1 ? "Let's Understand Your Role" : step === 2 ? "Personalise Your Journey" : isAdmin ? "Admin Access" : "Confirm & Enter"}
            </div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>
              {step === 1 ? "Select your role to see your learning path" : step === 2 ? "Your industry and function tailor your content" : isAdmin ? "Enter your platform administrator access code" : "Review your selection and confirm access"}
            </div>
            {/* Step progress */}
            <div style={{ display: "flex", gap: 4, marginTop: 12 }}>
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  style={{
                    height: 3, flex: 1, borderRadius: 2,
                    background: s <= step
                      ? (s === 1 ? "#E8B84B" : s === 2 ? "#7C3AED" : "#34C759")
                      : "rgba(255,255,255,0.12)",
                    transition: "background .3s",
                  }}
                />
              ))}
            </div>
          </div>

          {/* Card body */}
          <div style={{ padding: "18px 26px 22px" }}>
            {/* Step 1: Name + Role */}
            {step === 1 && (
              <>
                <div style={{ marginBottom: 12 }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: "#3A3A3C", marginBottom: 5 }}>Full name</div>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && ok1 && handleContinue()}
                    placeholder="Enter your full name"
                    autoFocus
                    style={{
                      width: "100%", padding: "10px 12px",
                      border: "1.5px solid #E5E5EA", borderRadius: 9,
                      fontSize: 14, color: "#1D1D1F", outline: "none",
                      fontFamily: "inherit", boxSizing: "border-box",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "#1D5BD8")}
                    onBlur={(e) => (e.target.style.borderColor = "#E5E5EA")}
                  />
                </div>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: "#3A3A3C", marginBottom: 3 }}>Your role</div>
                  <div style={{ fontSize: 10, color: "#AEAEB2", marginBottom: 8 }}>
                    Your role determines your learning pathway and assessments.
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                    {ROLES.map((r) => (
                      <div
                        key={r.id}
                        onClick={() => setRole(r.id)}
                        style={{
                          padding: "9px 12px", borderRadius: 9, cursor: "pointer",
                          display: "flex", alignItems: "center", gap: 10,
                          border: `1.5px solid ${role === r.id ? r.color : "#E5E5EA"}`,
                          background: role === r.id ? r.color + "10" : "#FAFAFA",
                          transition: "all .12s",
                        }}
                      >
                        <span style={{ fontSize: 14, flexShrink: 0, color: role === r.id ? r.color : "rgba(0,0,0,0.2)" }}>{r.icon}</span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 13, fontWeight: 700, color: role === r.id ? r.color : "#1D1D1F" }}>{r.label}</div>
                          <div style={{ fontSize: 10, color: "#AEAEB2", marginTop: 1 }}>{r.tier}</div>
                        </div>
                        {role === r.id && (
                          <div style={{ width: 7, height: 7, borderRadius: "50%", background: r.color, flexShrink: 0 }} />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Step 2: Industry + Function */}
            {step === 2 && !isAdmin && (
              <>
                <div style={{ marginBottom: 12 }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: "#3A3A3C", marginBottom: 5 }}>
                    Your industry <span style={{ fontSize: 11, color: "#AEAEB2", fontWeight: 400 }}>— optional</span>
                  </div>
                  <select
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    style={{
                      width: "100%", padding: "10px 12px",
                      border: "1.5px solid #E5E5EA", borderRadius: 9,
                      fontSize: 13, color: industry ? "#1D1D1F" : "#AEAEB2",
                      background: "#FAFAFA", fontFamily: "inherit",
                      cursor: "pointer", outline: "none", boxSizing: "border-box",
                      appearance: "none",
                    }}
                  >
                    <option value="">Select your industry</option>
                    {INDUSTRIES.map((ind) => (
                      <option key={ind} value={ind}>{ind}</option>
                    ))}
                  </select>
                </div>
                <div style={{ marginBottom: 14 }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: "#3A3A3C", marginBottom: 5 }}>
                    Your function <span style={{ fontSize: 11, color: "#AEAEB2", fontWeight: 400 }}>— optional</span>
                  </div>
                  <select
                    value={fn}
                    onChange={(e) => setFn(e.target.value)}
                    style={{
                      width: "100%", padding: "10px 12px",
                      border: "1.5px solid #E5E5EA", borderRadius: 9,
                      fontSize: 13, color: fn ? "#1D1D1F" : "#AEAEB2",
                      background: "#FAFAFA", fontFamily: "inherit",
                      cursor: "pointer", outline: "none", boxSizing: "border-box",
                      appearance: "none",
                    }}
                  >
                    <option value="">Select your function</option>
                    {MGMT_FUNCTIONS.map((f) => (
                      <option key={f} value={f}>{f}</option>
                    ))}
                  </select>
                </div>
                <div style={{ fontSize: 11, color: "#AEAEB2" }}>Both optional — skip to continue.</div>
              </>
            )}

            {/* Step 3A: Admin access code */}
            {step === 3 && isAdmin && (
              <>
                <div
                  style={{
                    padding: "14px 16px",
                    background: "rgba(255,149,0,0.06)",
                    border: "1.5px solid rgba(255,149,0,0.2)",
                    borderRadius: 10, marginBottom: 16,
                  }}
                >
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#FF9500", marginBottom: 3 }}>🔐 Administrator Access Required</div>
                  <div style={{ fontSize: 12, color: "#6E6E73", lineHeight: 1.5 }}>
                    The Platform Administrator portal requires an access code issued by Digilytics Co.
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: "#3A3A3C", marginBottom: 5 }}>Platform Access Code</div>
                  <input
                    type="password"
                    value={accessCode}
                    onChange={(e) => { setAccessCode(e.target.value); setCodeError(""); }}
                    onKeyDown={(e) => e.key === "Enter" && handleContinue()}
                    placeholder="Enter access code"
                    style={{
                      width: "100%", padding: "10px 12px",
                      border: `1.5px solid ${codeError ? "#FF3B30" : "#E5E5EA"}`,
                      borderRadius: 9, fontSize: 14, color: "#1D1D1F",
                      outline: "none", fontFamily: "monospace",
                      boxSizing: "border-box", letterSpacing: ".05em",
                    }}
                  />
                  {codeError && <div style={{ fontSize: 12, color: "#FF3B30", marginTop: 5 }}>⚠ {codeError}</div>}
                  <div style={{ fontSize: 11, color: "#AEAEB2", marginTop: 8 }}>Contact hello@digilyticsco.com to request admin credentials.</div>
                </div>
              </>
            )}

            {/* Step 3B: Learner confirm + access code */}
            {step === 3 && !isAdmin && selRole && (
              <>
                <div style={{ marginBottom: 12 }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: "#3A3A3C", marginBottom: 5 }}>
                    Organisation Access Code{" "}
                    <span style={{ fontSize: 10, color: "#AEAEB2", fontWeight: 400 }}>— provided by your administrator</span>
                  </div>
                  <input
                    value={accessCode}
                    onChange={(e) => { setAccessCode(e.target.value); setCodeError(""); }}
                    onKeyDown={(e) => e.key === "Enter" && handleContinue()}
                    placeholder="Enter your organisation code (e.g. ORG-2025)"
                    style={{
                      width: "100%", padding: "10px 12px",
                      border: `1.5px solid ${codeError ? "#FF3B30" : "#E5E5EA"}`,
                      borderRadius: 9, fontSize: 13, color: "#1D1D1F",
                      outline: "none", fontFamily: "monospace",
                      boxSizing: "border-box", letterSpacing: ".04em",
                    }}
                  />
                  {codeError && <div style={{ fontSize: 11, color: "#FF3B30", marginTop: 4 }}>⚠ {codeError}</div>}
                  <div style={{ fontSize: 10, color: "#AEAEB2", marginTop: 4 }}>
                    Demo code: <code style={{ background: "#F2F2F7", padding: "1px 5px", borderRadius: 4 }}>ORG-2025</code>
                  </div>
                </div>

                {/* Summary card */}
                <div
                  style={{
                    padding: "14px 16px",
                    background: selRole.color + "0D",
                    border: `1.5px solid ${selRole.color}30`,
                    borderRadius: 10, marginBottom: 14,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                    <span style={{ fontSize: 20 }}>{selRole.icon}</span>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 800, color: "#1D1D1F" }}>{selRole.label}</div>
                      <div style={{ fontSize: 11, color: "#6E6E73" }}>{selRole.tier}</div>
                    </div>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                    {[
                      { l: "Name", v: name },
                      { l: "Role", v: selRole.label },
                      { l: "Industry", v: industry || "All industries" },
                      { l: "Function", v: fn || "All functions" },
                    ].map((r, i) => (
                      <div key={i} style={{ padding: "5px 8px", background: "rgba(255,255,255,0.6)", borderRadius: 6 }}>
                        <div style={{ fontSize: 9, fontWeight: 700, color: "#AEAEB2", textTransform: "uppercase", letterSpacing: ".06em" }}>{r.l}</div>
                        <div style={{ fontSize: 12, fontWeight: 600, color: "#1D1D1F", marginTop: 1 }}>{r.v}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ padding: "10px 14px", background: "#F2F2F7", borderRadius: 8 }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: "#1D1D1F", marginBottom: 4 }}>What's included</div>
                  {[
                    "Role-based AI learning programme",
                    "Daily intelligence briefings",
                    "Readiness assessment (8 dimensions)",
                    "Prompt engineering lab",
                    "Pan-African use case library",
                  ].map((item, i) => (
                    <div key={i} style={{ fontSize: 11, color: "#6E6E73", display: "flex", alignItems: "center", gap: 5, marginTop: 3 }}>
                      <span style={{ color: selRole.color, fontWeight: 700 }}>✓</span>
                      {item}
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* CTA buttons */}
            <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
              {step > 1 && (
                <button
                  onClick={() => setStep((s) => s - 1)}
                  style={{
                    width: 52, padding: "11px 0", borderRadius: 9,
                    border: "1.5px solid #E5E5EA", background: "transparent",
                    fontSize: 14, fontWeight: 600, color: "#3A3A3C",
                    cursor: "pointer", fontFamily: "inherit",
                  }}
                >
                  ←
                </button>
              )}
              <button
                onClick={handleContinue}
                disabled={step === 1 && !ok1}
                style={{
                  flex: 1, padding: "11px", borderRadius: 9, border: "none",
                  background: step === 1 && !ok1 ? "#E5E5EA" : selRole ? selRole.color : "#1D5BD8",
                  color: step === 1 && !ok1 ? "#AEAEB2" : "#FFFFFF",
                  fontSize: 14, fontWeight: 700,
                  cursor: step === 1 && !ok1 ? "not-allowed" : "pointer",
                  fontFamily: "inherit",
                  boxShadow: step === 1 && !ok1 ? "none" : "0 4px 16px rgba(0,0,0,0.2)",
                  transition: "all .15s",
                }}
              >
                {step < 3 ? "Continue →" : isAdmin ? "Enter Admin Portal →" : "Enter CapabilityOS →"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
