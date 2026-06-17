import React, { useState } from "react";
import { COLORS, TYPE_SCALE, SHADOW, RADIUS, FONT_FAMILY_DISPLAY } from "../../theme/tokens.js";
import { ORG, BUSINESS_UNITS, ROLE_FAMILIES } from "../../data/enterpriseData.js";

// ─── Tabs ─────────────────────────────────────────────────────────────────────
const TABS = [
  { id: "overview",   label: "Organisation" },
  { id: "units",      label: "Business Units" },
  { id: "roles",      label: "Role Families" },
  { id: "access",     label: "Access Codes" },
  { id: "branding",   label: "Branding" },
];

// ─── Demo access codes ────────────────────────────────────────────────────────
const ACCESS_CODES = [
  { code: "ORG-2025",       role: "learner",     tier: "Tier 1",   status: "active",   uses: 247 },
  { code: "DEMO-2025",      role: "learner",     tier: "Tier 1",   status: "active",   uses: 88  },
  { code: "DIGILYTICS-2025",role: "learner",     tier: "Tier 1–2", status: "active",   uses: 54  },
  { code: "CAPOS-2025",     role: "learner",     tier: "All",      status: "active",   uses: 312 },
  { code: "CAPOS-ADMIN-2025",role:"facilitator", tier: "Admin",    status: "active",   uses: 12  },
  { code: "EXEC-2025",      role: "executive",   tier: "All",      status: "active",   uses: 29  },
  { code: "MGR-2025",       role: "manager",     tier: "Tier 1–2", status: "inactive", uses: 0   },
];

const STATUS_DOT = {
  active:   { color: COLORS.green,  label: "Active"   },
  inactive: { color: COLORS.muted2, label: "Inactive" },
  expired:  { color: COLORS.danger, label: "Expired"  },
};

export default function AdminOrgSetup() {
  const [tab, setTab] = useState("overview");

  return (
    <div style={{ padding: "36px 40px", maxWidth: 1060 }}>
      {/* Header */}
      <div style={{ ...TYPE_SCALE.caption, color: COLORS.muted2, textTransform: "uppercase" }}>
        Platform
      </div>
      <h1
        style={{
          fontFamily: FONT_FAMILY_DISPLAY, fontSize: 26, fontWeight: 700,
          letterSpacing: "-0.02em", color: COLORS.text, marginTop: 6,
        }}
      >
        Organisation Setup
      </h1>
      <p style={{ ...TYPE_SCALE.body, color: COLORS.muted, marginTop: 8, maxWidth: 560 }}>
        Configure your organisation structure, access codes, and platform branding for {ORG.name}.
      </p>

      {/* Tab bar */}
      <div
        style={{
          display: "flex", gap: 4, marginTop: 24,
          borderBottom: `1px solid ${COLORS.border}`, paddingBottom: 0,
        }}
      >
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              padding: "9px 16px", background: "none", border: "none",
              borderBottom: tab === t.id ? `2px solid ${COLORS.acc}` : "2px solid transparent",
              cursor: "pointer", fontFamily: "inherit", fontSize: 13,
              fontWeight: tab === t.id ? 700 : 500,
              color: tab === t.id ? COLORS.acc : COLORS.muted,
              marginBottom: -1, transition: "all .15s",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div style={{ marginTop: 28 }}>
        {tab === "overview"  && <OrgOverview />}
        {tab === "units"     && <BusinessUnits />}
        {tab === "roles"     && <RoleFamilies />}
        {tab === "access"    && <AccessCodes />}
        {tab === "branding"  && <BrandingSettings />}
      </div>
    </div>
  );
}

// ─── Org Overview ──────────────────────────────────────────────────────────────
function OrgOverview() {
  const fields = [
    { label: "Organisation name",        value: ORG.name },
    { label: "Industry sector",          value: ORG.industry },
    { label: "Headcount",                value: ORG.headcount.toLocaleString() + " employees" },
    { label: "AI maturity baseline",     value: ORG.aiMaturity },
    { label: "Programme start date",     value: "1 February 2025" },
    { label: "Contract tier",            value: "Enterprise — Unlimited seats" },
    { label: "Primary admin contact",    value: "l.dlamini@momentumgroup.co.za" },
    { label: "Platform subdomain",       value: "momentumgroup.capabilityos.co.za" },
  ];

  return (
    <div style={{ maxWidth: 640 }}>
      <SectionCard title="Organisation details" desc="Core configuration for this CapabilityOS instance.">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0 }}>
          {fields.map((f, i) => (
            <div
              key={f.label}
              style={{
                padding: "14px 0",
                borderBottom: i < fields.length - 2 ? `1px solid ${COLORS.border}` : "none",
                gridColumn: "span 1",
              }}
            >
              <div style={{ fontSize: 11, fontWeight: 600, color: COLORS.muted2, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                {f.label}
              </div>
              <div style={{ fontWeight: 600, fontSize: 14, color: COLORS.text, marginTop: 4 }}>
                {f.value}
              </div>
            </div>
          ))}
        </div>
        <SaveButton label="Save changes" />
      </SectionCard>
    </div>
  );
}

// ─── Business Units ────────────────────────────────────────────────────────────
function BusinessUnits() {
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
        <div>
          <div style={{ ...TYPE_SCALE.cardTitle }}>{BUSINESS_UNITS.length} business units configured</div>
          <div style={{ fontSize: 12, color: COLORS.muted, marginTop: 2 }}>
            Each unit inherits organisation-wide settings and can override capability targets.
          </div>
        </div>
        <AddButton label="+ Add unit" />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {BUSINESS_UNITS.map((bu) => (
          <div
            key={bu.id}
            style={{
              background: COLORS.surf, border: `1px solid ${COLORS.border}`,
              borderRadius: RADIUS.md, boxShadow: SHADOW.sm,
              padding: "16px 20px",
              display: "flex", alignItems: "center", gap: 16,
            }}
          >
            <div
              style={{
                width: 40, height: 40, borderRadius: RADIUS.sm, flexShrink: 0,
                background: COLORS.acc + "14",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 18,
              }}
            >
              🏢
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 14, color: COLORS.text }}>{bu.name}</div>
              <div style={{ fontSize: 12, color: COLORS.muted, marginTop: 3 }}>
                {bu.headcount.toLocaleString()} employees · Head: {bu.head}
              </div>
            </div>
            <div style={{ textAlign: "right", flexShrink: 0 }}>
              <div style={{ fontWeight: 700, fontSize: 16, color: COLORS.acc }}>{bu.capabilityScore}%</div>
              <div style={{ fontSize: 11, color: COLORS.muted2 }}>Capability score</div>
            </div>
            <button
              style={{
                padding: "6px 14px", background: "none",
                border: `1px solid ${COLORS.border}`, borderRadius: RADIUS.sm,
                cursor: "pointer", fontFamily: "inherit",
                fontSize: 12, fontWeight: 600, color: COLORS.muted,
                flexShrink: 0,
              }}
            >
              Configure
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Role Families ─────────────────────────────────────────────────────────────
function RoleFamilies() {
  const TIER_COLORS = [COLORS.acc, COLORS.purple, COLORS.green, COLORS.gold, COLORS.fire];

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
        <div>
          <div style={{ ...TYPE_SCALE.cardTitle }}>{ROLE_FAMILIES.length} role families</div>
          <div style={{ fontSize: 12, color: COLORS.muted, marginTop: 2 }}>
            Role families map to learning tiers and capability targets.
          </div>
        </div>
        <AddButton label="+ Add family" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 12 }}>
        {ROLE_FAMILIES.map((rf, i) => (
          <div
            key={rf.id}
            style={{
              background: COLORS.surf, border: `1px solid ${COLORS.border}`,
              borderLeft: `3px solid ${TIER_COLORS[i % TIER_COLORS.length]}`,
              borderRadius: RADIUS.md, boxShadow: SHADOW.sm, padding: "16px 18px",
            }}
          >
            <div style={{ fontWeight: 700, fontSize: 14, color: COLORS.text }}>{rf.name}</div>
            <div style={{ fontSize: 12, color: COLORS.muted, marginTop: 5, lineHeight: 1.55 }}>
              {rf.description}
            </div>
            <div style={{ marginTop: 10, display: "flex", gap: 6, flexWrap: "wrap" }}>
              {rf.capabilities?.slice(0, 3).map((c) => (
                <span
                  key={c}
                  style={{
                    fontSize: 11, fontWeight: 600, color: TIER_COLORS[i % TIER_COLORS.length],
                    background: TIER_COLORS[i % TIER_COLORS.length] + "12",
                    padding: "3px 8px", borderRadius: 999,
                  }}
                >
                  {c}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Access Codes ──────────────────────────────────────────────────────────────
function AccessCodes() {
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
        <div>
          <div style={{ ...TYPE_SCALE.cardTitle }}>Platform access codes</div>
          <div style={{ fontSize: 12, color: COLORS.muted, marginTop: 2 }}>
            Share these codes with learners during onboarding. Each code maps to a role and learning tier.
          </div>
        </div>
        <AddButton label="+ Generate code" />
      </div>

      <div
        style={{
          background: COLORS.surf, border: `1px solid ${COLORS.border}`,
          borderRadius: RADIUS.lg, boxShadow: SHADOW.sm, overflow: "hidden",
        }}
      >
        {/* Table header */}
        <div
          style={{
            display: "grid", gridTemplateColumns: "1fr 1fr 1fr 80px 80px 80px",
            background: COLORS.bg, padding: "10px 20px",
            borderBottom: `1px solid ${COLORS.border}`,
            fontSize: 11, fontWeight: 700, color: COLORS.muted2, textTransform: "uppercase", gap: 8,
          }}
        >
          <span>Access Code</span>
          <span>Role</span>
          <span>Tier Access</span>
          <span>Uses</span>
          <span>Status</span>
          <span></span>
        </div>

        {ACCESS_CODES.map((ac, i) => {
          const dot = STATUS_DOT[ac.status] || STATUS_DOT.active;
          return (
            <div
              key={ac.code}
              style={{
                display: "grid", gridTemplateColumns: "1fr 1fr 1fr 80px 80px 80px",
                padding: "14px 20px", alignItems: "center", gap: 8,
                borderBottom: i < ACCESS_CODES.length - 1 ? `1px solid ${COLORS.border}` : "none",
              }}
            >
              <span
                style={{
                  fontFamily: "'Courier New', monospace", fontWeight: 700,
                  fontSize: 13, color: COLORS.text,
                  background: COLORS.bg, padding: "4px 8px", borderRadius: RADIUS.sm,
                  display: "inline-block",
                }}
              >
                {ac.code}
              </span>
              <span style={{ fontSize: 13, color: COLORS.muted, textTransform: "capitalize" }}>{ac.role}</span>
              <span style={{ fontSize: 13, color: COLORS.muted }}>{ac.tier}</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: COLORS.text }}>{ac.uses.toLocaleString()}</span>
              <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <span
                  style={{
                    width: 7, height: 7, borderRadius: "50%",
                    background: dot.color, display: "inline-block",
                  }}
                />
                <span style={{ fontSize: 12, color: dot.color, fontWeight: 600 }}>{dot.label}</span>
              </span>
              <button
                style={{
                  padding: "4px 10px", background: "none",
                  border: `1px solid ${COLORS.border}`, borderRadius: RADIUS.sm,
                  cursor: "pointer", fontFamily: "inherit",
                  fontSize: 11, fontWeight: 600, color: COLORS.muted,
                }}
              >
                Copy
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Branding Settings ─────────────────────────────────────────────────────────
function BrandingSettings() {
  return (
    <div style={{ maxWidth: 640 }}>
      <SectionCard title="Platform branding" desc="Customise how CapabilityOS appears to your learners.">
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {/* Logo */}
          <div>
            <label style={{ fontSize: 12, fontWeight: 700, color: COLORS.muted, display: "block", marginBottom: 8 }}>
              Organisation Logo
            </label>
            <div
              style={{
                width: 120, height: 60, border: `1.5px dashed ${COLORS.border}`,
                borderRadius: RADIUS.md, display: "flex", alignItems: "center",
                justifyContent: "center", cursor: "pointer",
                background: COLORS.bg, color: COLORS.muted2, fontSize: 12,
              }}
            >
              Upload logo
            </div>
          </div>

          {/* Accent colour */}
          <div>
            <label style={{ fontSize: 12, fontWeight: 700, color: COLORS.muted, display: "block", marginBottom: 8 }}>
              Brand accent colour
            </label>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              {["#1D5BD8","#0070F3","#7C5CBF","#1F9D55","#E8743B"].map((c) => (
                <div
                  key={c}
                  style={{
                    width: 28, height: 28, borderRadius: "50%",
                    background: c, cursor: "pointer",
                    border: c === "#1D5BD8" ? `3px solid ${COLORS.text}` : "3px solid transparent",
                    flexShrink: 0,
                  }}
                />
              ))}
              <span style={{ fontSize: 12, color: COLORS.muted2 }}>or enter hex</span>
              <input
                defaultValue="#1D5BD8"
                style={{
                  border: `1px solid ${COLORS.border}`, borderRadius: RADIUS.sm,
                  padding: "5px 10px", fontFamily: "'Courier New', monospace",
                  fontSize: 12, width: 90, color: COLORS.text, background: COLORS.bg,
                }}
              />
            </div>
          </div>

          {/* Platform name */}
          <div>
            <label style={{ fontSize: 12, fontWeight: 700, color: COLORS.muted, display: "block", marginBottom: 8 }}>
              Platform display name
            </label>
            <input
              defaultValue="CapabilityOS"
              style={{
                border: `1px solid ${COLORS.border}`, borderRadius: RADIUS.sm,
                padding: "8px 12px", fontFamily: "inherit",
                fontSize: 13, width: "100%", color: COLORS.text,
                background: COLORS.bg, boxSizing: "border-box",
              }}
            />
          </div>

          {/* Welcome message */}
          <div>
            <label style={{ fontSize: 12, fontWeight: 700, color: COLORS.muted, display: "block", marginBottom: 8 }}>
              Learner welcome message
            </label>
            <textarea
              defaultValue="Welcome to Momentum Group's AI capability programme. Your journey to becoming AI-ready starts here."
              rows={3}
              style={{
                border: `1px solid ${COLORS.border}`, borderRadius: RADIUS.sm,
                padding: "8px 12px", fontFamily: "inherit",
                fontSize: 13, width: "100%", color: COLORS.text,
                background: COLORS.bg, resize: "vertical", boxSizing: "border-box",
                lineHeight: 1.55,
              }}
            />
          </div>
        </div>
        <SaveButton label="Save branding" />
      </SectionCard>
    </div>
  );
}

// ─── Shared helpers ────────────────────────────────────────────────────────────
function SectionCard({ title, desc, children }) {
  return (
    <div
      style={{
        background: COLORS.surf, border: `1px solid ${COLORS.border}`,
        borderRadius: RADIUS.lg, boxShadow: SHADOW.sm, padding: "24px 28px",
      }}
    >
      <div style={{ ...TYPE_SCALE.cardTitle, marginBottom: 4 }}>{title}</div>
      {desc && <div style={{ fontSize: 13, color: COLORS.muted, marginBottom: 20 }}>{desc}</div>}
      {children}
    </div>
  );
}

function SaveButton({ label }) {
  const [saved, setSaved] = useState(false);
  return (
    <button
      onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2000); }}
      style={{
        marginTop: 20, padding: "9px 22px",
        background: saved ? COLORS.green : COLORS.acc,
        color: "#fff", border: "none", borderRadius: RADIUS.sm,
        cursor: "pointer", fontFamily: "inherit",
        fontSize: 13, fontWeight: 700,
        transition: "background .2s",
      }}
    >
      {saved ? "✓ Saved!" : label}
    </button>
  );
}

function AddButton({ label }) {
  return (
    <button
      style={{
        padding: "8px 16px", background: COLORS.acc + "10",
        border: `1px solid ${COLORS.acc}30`, borderRadius: RADIUS.sm,
        cursor: "pointer", fontFamily: "inherit",
        fontSize: 13, fontWeight: 700, color: COLORS.acc,
      }}
    >
      {label}
    </button>
  );
}
