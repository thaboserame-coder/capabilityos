import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { TIERS, ROLE_TIERS, getTiersForRole } from "../data/tiers.js";
import { getLevelForXP, getNextLevel, getLevelProgress } from "../data/levels.js";

// ─── Badge definitions ────────────────────────────────────────────────────────
export const BADGES = [
  { id: "first",  icon: "🎯", name: "First Step",   desc: "Completed your first module",       ok: (p) => Object.keys(p).length >= 1 },
  { id: "five",   icon: "📚", name: "On a Roll",    desc: "5 modules completed",               ok: (p) => Object.keys(p).length >= 5 },
  { id: "ten",    icon: "🔥", name: "Momentum",     desc: "10 modules completed",              ok: (p) => Object.keys(p).length >= 10 },
  { id: "sharp",  icon: "💡", name: "Sharp Mind",   desc: "Scored 100% on a quiz",             ok: (_, q) => q >= 1 },
  { id: "t1",     icon: "👔", name: "Executive",    desc: "All Tier 1 modules complete",       ok: (p) => TIERS[0]?.mods.every((m) => p[`t1:${m.id}`]) },
  { id: "t2",     icon: "🚀", name: "AI Leader",    desc: "All Tier 2 modules complete",       ok: (p) => TIERS[1]?.mods.every((m) => p[`t2:${m.id}`]) },
  { id: "t3",     icon: "⭐", name: "Practitioner", desc: "All Tier 3 modules complete",       ok: (p) => TIERS[2]?.mods.every((m) => p[`t3:${m.id}`]) },
  { id: "all",    icon: "🏆", name: "Champion",     desc: "All three tiers complete",          ok: (p) => TIERS.every((t) => t.mods.every((m) => p[`${t.id}:${m.id}`])) },
];

// ─── Demo leaderboard cohort ──────────────────────────────────────────────────
export const DEMO_COHORT = [
  { name: "Nomsa Khumalo",        xp: 2100, level: "AI Productive",   mods: 14, streak: 7, last: "30 min ago",   ind: "Mining & Resources" },
  { name: "James Okonkwo",        xp: 1450, level: "AI Literate",     mods: 9,  streak: 3, last: "2 hours ago",  ind: "Financial Services" },
  { name: "Sarah Dlamini",        xp: 980,  level: "Analytics Literate", mods: 6, streak: 2, last: "1 day ago",  ind: "Healthcare & Life Sciences" },
  { name: "Michael van der Berg", xp: 700,  level: "Analytics Literate", mods: 5, streak: 1, last: "1 day ago",  ind: "Manufacturing & Engineering" },
  { name: "Thandi Molefe",        xp: 300,  level: "Data Aware",      mods: 3,  streak: 0, last: "3 days ago",   ind: "Retail & Consumer Goods" },
  { name: "Sipho Ndlovu",         xp: 150,  level: "Digital Literate",mods: 1,  streak: 1, last: "5 days ago",   ind: "Telecommunications" },
];

// ─── Prompt templates ─────────────────────────────────────────────────────────
export const PROMPT_TEMPLATES = [
  { id: "p_exec1", roles: ["executive"], level: "Executive", cat: "Governance", icon: "⬡", color: "#E8B84B", dur: "5 min",
    title: "Board AI Risk Assessment",
    desc: "Prepare a board-level risk register for an AI initiative with regulatory exposure.",
    template: "Act as a board risk adviser. For [AI initiative] at a [industry] company in South Africa: Assess risks across (1) regulatory/POPIA exposure, (2) reputational risk, (3) financial model risk, (4) staff displacement risk. Rate each HIGH/MEDIUM/LOW. Recommend board oversight actions.",
    tip: "Use before any AI project requiring board sign-off." },
  { id: "p_exec2", roles: ["executive"], level: "Executive", cat: "Strategy", icon: "⬡", color: "#E8B84B", dur: "8 min",
    title: "AI Investment Decision Brief",
    desc: "Structure a 1-page AI investment recommendation for executive committee.",
    template: "Write a 1-page ExCo investment brief for [AI initiative] at [company] in [industry]. Include: Strategic rationale, 3-year ROI hypothesis, key risks, governance requirements, and the single question the board must answer before approving. Tone: direct, evidence-based, no jargon.",
    tip: "The 'single question' framing forces clarity on the real constraint." },
  { id: "p_func1", roles: ["functional", "executive"], level: "Leadership", cat: "Strategy", icon: "◈", color: "#7C3AED", dur: "6 min",
    title: "AI Adoption Business Case",
    desc: "Build a compelling internal business case for AI adoption in your function.",
    template: "Build a business case for AI adoption in [function] at a [industry] company with [N] employees. Include: Problem statement, 3 comparable industry examples with outcomes, cost-benefit over 2 years, implementation risk mitigation, and success metrics. Audience: CFO and COO.",
    tip: "Lead with the cost of inaction, not the cost of the solution." },
  { id: "p_func2", roles: ["functional", "manager"], level: "Leadership", cat: "Change", icon: "◈", color: "#7C3AED", dur: "4 min",
    title: "AI Change Communication",
    desc: "Write a team communication that builds AI adoption confidence, not anxiety.",
    template: "Write a communication to my [function] team of [N] people about introducing [AI tool/change]. Address: What is changing, what is NOT changing, what we will do together, how we will support people through the transition. Tone: honest, human, forward-looking. NO corporate jargon.",
    tip: "Name the fear before they name it. It builds trust." },
  { id: "p_mgr1", roles: ["manager", "functional"], level: "Management", cat: "Productivity", icon: "◇", color: "#1D9E75", dur: "3 min",
    title: "AI Productivity Sprint Plan",
    desc: "Design a 4-week team AI productivity sprint with measurable outcomes.",
    template: "Design a 4-week AI productivity sprint for a [function] team of [N] people at a [industry] company. Week-by-week plan: tools to trial, skills to build, workflows to redesign. Success metric for each week. What does 'good' look like at day 30?",
    tip: "Focus on 1-2 tools maximum. Breadth kills adoption." },
  { id: "p_mgr2", roles: ["manager"], level: "Management", cat: "Governance", icon: "◇", color: "#1D9E75", dur: "5 min",
    title: "Team AI Use Policy",
    desc: "Draft an enforceable team-level AI use policy with clear dos and don'ts.",
    template: "Draft a practical AI use policy for a [function] team at a [industry] company. Include: Approved tools and use cases, data handling rules (especially client/personal data), quality check requirements before using AI outputs, escalation process for edge cases. Make it a 1-page document people will actually read.",
    tip: "A policy no one reads is no policy at all. Keep it to 1 page." },
  { id: "p_spec1", roles: ["learner", "manager"], level: "Professional", cat: "Productivity", icon: "○", color: "#34C759", dur: "2 min",
    title: "Meeting to Action Items",
    desc: "Extract decisions, actions, and owners from raw meeting notes instantly.",
    template: "Here are my meeting notes from a [meeting type] with [stakeholders]: [paste notes]. Extract: 1) Key decisions made 2) Action items with owner names and deadlines 3) Open questions still unresolved 4) Any items needing escalation. Format as a clean table.",
    tip: "Paste messy notes — the model handles the structure." },
  { id: "p_spec2", roles: ["learner", "functional"], level: "Professional", cat: "Communication", icon: "○", color: "#34C759", dur: "3 min",
    title: "Stakeholder Status Update",
    desc: "Write a crisp stakeholder update that builds confidence without overselling.",
    template: "Write a weekly status update email for [project] to [stakeholder level]. Include: What we said we'd do, what we actually did, what's at risk, what we need. Tone: professional, specific, no spin. Stakeholder context: [their main concern].",
    tip: "Name the risk before they ask. Proactive honesty builds trust." },
  { id: "p_em1", roles: ["emerging"], level: "Beginner", cat: "Learning", icon: "◉", color: "#5AC8FA", dur: "2 min",
    title: "Concept Explainer",
    desc: "Get any AI or data concept explained in plain language with a real example.",
    template: "Explain [concept] to me as if I'm a graduate working in [industry]. Use a real example from [industry] that I might see at work. Tell me: what it is, why it matters for my career, and one thing I can do tomorrow to learn more about it.",
    tip: "Start with concepts from the Readiness Assessment you scored lowest on." },
  { id: "p_em2", roles: ["emerging"], level: "Beginner", cat: "Career", icon: "◉", color: "#5AC8FA", dur: "3 min",
    title: "Career AI Positioning",
    desc: "Write a LinkedIn-ready statement showing your AI capability to employers.",
    template: "Help me write a LinkedIn summary section that positions me as AI-capable in [industry/function]. My background: [1-2 sentences]. AI skills I'm building: [from my learning]. The role I'm targeting: [job title]. Make it specific, credible, and not generic. No buzzwords.",
    tip: "Specificity beats polish. Mention actual tools you've used." },
];

// ─── Pan-African use cases (static) ──────────────────────────────────────────
export const USE_CASES = [
  { id: "fs1", country: "South Africa", flag: "🇿🇦", sector: "Financial Services", roles: ["executive", "functional"], title: "AI Credit Scoring at Unbanked Scale", challenge: "SA's major banks needed to extend credit to 11M previously unscored adults without traditional credit history.", solution: "ML models trained on mobile payment patterns, utility payments, and retail behaviour predict creditworthiness with 78% accuracy vs 71% for traditional scoring.", impact: "R4.2bn in new credit extended in 12 months. Default rates 18% lower than predicted by traditional models.", roi: "3.8x ROI" },
  { id: "fs2", country: "Nigeria", flag: "🇳🇬", sector: "Financial Services", roles: ["executive", "functional", "manager"], title: "Real-Time Fraud Detection — GTBank", challenge: "Nigerian digital banking fraud losses exceeded $500M in 2023. Traditional rule-based systems flagged 40% false positives.", solution: "Deep learning model processing 2M+ daily transactions in real time. Identifies anomalous patterns within 80ms.", impact: "Fraud losses reduced 52%. False positive rate dropped from 40% to 6%.", roi: "5.1x ROI" },
  { id: "fs3", country: "Kenya", flag: "🇰🇪", sector: "Financial Services", roles: ["functional", "manager", "learner"], title: "M-Pesa AI Dispute Resolution", challenge: "Safaricom processed 30M+ monthly M-Pesa transactions with 180,000+ monthly disputes each requiring human review.", solution: "NLP model classifies and auto-resolves 68% of disputes without human review. Escalates complex cases with full context.", impact: "Dispute resolution: 72 hours → 4 minutes for auto-resolved cases. Agent productivity up 3.4x.", roi: "4.6x ROI" },
  { id: "mn1", country: "South Africa", flag: "🇿🇦", sector: "Mining & Resources", roles: ["functional", "manager", "learner"], title: "Predictive Maintenance — Anglo American Platinum", challenge: "Underground conveyor failures cause unplanned stoppages averaging R12M per incident at Mogalakwena mine.", solution: "IoT sensor network + ML model predicts mechanical failure 48–72 hours before occurrence. 94% accuracy.", impact: "Unplanned downtime reduced 24%. Three major failures prevented in first 6 months. Safety incidents down 31%.", roi: "6.2x ROI" },
  { id: "mn2", country: "Ghana", flag: "🇬🇭", sector: "Mining & Resources", roles: ["executive", "functional"], title: "AI-Powered Gold Grade Prediction — Newmont Ghana", challenge: "Drilling decisions at Ahafo mine required 48-hour lab analysis per sample, slowing extraction planning.", solution: "Hyperspectral imaging AI predicts gold grade from drill core images in 3 minutes vs 48 hours. 89% accuracy.", impact: "Drilling planning cycle 10x faster. Over-drilling reduced 18%. $28M in annual cost savings.", roi: "7.4x ROI" },
  { id: "ag1", country: "Kenya", flag: "🇰🇪", sector: "Agriculture", roles: ["functional", "manager", "learner"], title: "Crop Disease Detection via SMS", challenge: "Smallholder farmers in Western Kenya lost 30–50% of yields annually to preventable crop diseases.", solution: "AI model on feature phones: farmer photographs leaf via SMS. Returns disease diagnosis in Swahili within 60 seconds.", impact: "15,000 farmers enrolled. Average yield improvement 28%. Input cost reduction 22%.", roi: "NGO/Commercial hybrid" },
  { id: "hc1", country: "Rwanda", flag: "🇷🇼", sector: "Healthcare & Life Sciences", roles: ["executive", "functional"], title: "AI Diagnostics in Rural Health — Rwanda Biomedical Centre", challenge: "Rural Rwanda has 1 doctor per 10,000 people. Delayed TB and malaria diagnosis leads to preventable deaths.", solution: "AI on tablets analyses chest X-rays for TB with 92% sensitivity. Malaria detection via blood smear photo in 2 minutes.", impact: "Diagnosis time: 2 weeks → 2 hours in rural facilities. TB detection rate up 34%.", roi: "$18M in avoided hospitalisation costs" },
  { id: "hc2", country: "South Africa", flag: "🇿🇦", sector: "Healthcare & Life Sciences", roles: ["executive", "functional", "manager"], title: "Nurse Burnout Prediction — Life Healthcare", challenge: "Life Healthcare lost 1,200 nurses in 2022 to burnout-related resignation. Replacement cost per nurse: R85,000.", solution: "ML model analyses shift patterns, leave requests, and patient load. Flags at-risk nurses 6 weeks before resignation.", impact: "Nurse attrition reduced 29%. R102M in avoided recruitment costs in 12 months.", roi: "4.1x ROI" },
  { id: "rt1", country: "South Africa", flag: "🇿🇦", sector: "Retail & Consumer Goods", roles: ["functional", "manager"], title: "Demand Forecasting — Shoprite Group", challenge: "Shoprite operates 2,800+ stores across 12 countries. Stockouts cost R1.8bn annually.", solution: "ML demand forecast per SKU per store, incorporating weather, local events, promotions, and payday cycles.", impact: "Forecast accuracy improved from 71% to 89%. Stockouts reduced 23%. Waste reduced 18% for perishables.", roi: "5.3x ROI" },
  { id: "rt2", country: "Nigeria", flag: "🇳🇬", sector: "Retail & Consumer Goods", roles: ["functional", "manager", "learner"], title: "Conversational Commerce — Jumia Nigeria", challenge: "Jumia's 3M+ customers in Nigeria had low repeat purchase rates due to complex checkout.", solution: "WhatsApp AI agent handles product discovery, order tracking, and returns in Pidgin English, Yoruba, and Hausa.", impact: "Repeat purchase rate up 41%. Customer support cost reduced 58%. Average order value up 22%.", roi: "3.7x ROI" },
  { id: "tc1", country: "South Africa", flag: "🇿🇦", sector: "Telecommunications", roles: ["functional", "manager", "learner"], title: "Network Fault Prediction — MTN South Africa", challenge: "MTN SA's 40M+ subscribers experience 220,000+ network incidents annually. Average resolution time: 4.2 hours.", solution: "ML model on network telemetry data predicts cell tower failures 6–12 hours before occurrence.", impact: "Proactive resolution rate up from 8% to 67%. Mean time to repair reduced 44%.", roi: "4.8x ROI" },
  { id: "gv1", country: "Rwanda", flag: "🇷🇼", sector: "Government & Public Sector", roles: ["executive", "functional"], title: "Kigali Smart City AI Platform", challenge: "Kigali needed to optimise traffic, waste collection, and public safety across a city of 1.3M.", solution: "Integrated AI platform: traffic signal optimisation, waste truck routing, CCTV anomaly detection.", impact: "Traffic flow efficiency up 28%. Waste collection cost down 22%. Emergency response time reduced 35%.", roi: "$45M government savings over 5 years" },
  { id: "en1", country: "South Africa", flag: "🇿🇦", sector: "Energy & Utilities", roles: ["executive", "functional", "manager"], title: "Eskom AI Load Forecasting", challenge: "Eskom's load forecasting errors contributed to unnecessary loadshedding. 1% forecast error = 500MW curtailment.", solution: "Ensemble ML model integrating weather, industrial load patterns, and economic indicators. Updated every 15 minutes.", impact: "Forecast accuracy improved from 94.1% to 97.8%. Estimated 340 hours of unnecessary loadshedding avoided.", roi: "R2.8bn in avoided economic cost" },
];

// ─── Missions ─────────────────────────────────────────────────────────────────
export const MISSIONS = [
  { id: "m1", name: "Foundation Sprint", type: "Sprint", icon: "🚀", xp: 300, desc: "Complete 3 modules and earn 300 XP.", totalSteps: 3, checkFn: (p) => Math.min(Object.keys(p).length, 3) },
  { id: "m2", name: "African Enterprise Challenge", type: "Mastery", icon: "🌍", xp: 500, desc: "Explore 5 AI deployments from different African countries.", totalSteps: 5, checkFn: (p) => Math.min(Object.keys(p).length, 5) },
  { id: "m3", name: "Prompt Mastery", type: "Mastery", icon: "💡", xp: 400, desc: "Complete the Prompt Engineering Lab and try 3 templates.", totalSteps: 3, checkFn: (p) => Math.min(Object.keys(p).length, 3) },
  { id: "m4", name: "AI Leader Championship", type: "Championship", icon: "🏆", xp: 1000, desc: "Complete 14 modules across the platform.", totalSteps: 14, checkFn: (p) => Object.keys(p).length },
  { id: "m5", name: "7-Day Streak", type: "Daily", icon: "🔥", xp: 250, desc: "Log in and complete a module 7 days in a row.", totalSteps: 7, checkFn: (_, streak) => Math.min(streak || 0, 7) },
];

// ─── Storage key ──────────────────────────────────────────────────────────────
const STORAGE_KEY = "capabilityos_v3";

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {}
}

// ─── Context ──────────────────────────────────────────────────────────────────
const AppContext = createContext(null);

export function AppProvider({ children }) {
  const saved = loadState();

  const [auth, setAuth] = useState(
    saved?.auth || null
    // auth: { name, role, industry, fn }
  );
  const [progress, setProgress] = useState(saved?.progress || {}); // "t1:t1m1" → true
  const [perfectQuizzes, setPerfectQuizzes] = useState(saved?.perfectQuizzes || 0);
  const [xp, setXp] = useState(saved?.xp || 0);
  const [badges, setBadges] = useState(saved?.badges || []);
  const [streak, setStreak] = useState(saved?.streak || 0);
  const [toasts, setToasts] = useState([]);

  // Persist to localStorage whenever key state changes
  useEffect(() => {
    if (!auth) return;
    saveState({ auth, progress, perfectQuizzes, xp, badges, streak });
  }, [auth, progress, perfectQuizzes, xp, badges, streak]);

  const addToast = useCallback((toast) => {
    const id = Date.now();
    setToasts((t) => [...t, { ...toast, id }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3500);
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  const login = useCallback((name, role, industry, fn) => {
    setAuth({ name, role, industry, fn });
  }, []);

  const logout = useCallback(() => {
    setAuth(null);
    setProgress({});
    setPerfectQuizzes(0);
    setXp(0);
    setBadges([]);
    setStreak(0);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const completeModule = useCallback(
    (tierId, moduleId, earnedXP, perfect = false) => {
      const key = `${tierId}:${moduleId}`;
      if (progress[key]) return; // already done

      const newProgress = { ...progress, [key]: true };
      const newPerfect = perfect ? perfectQuizzes + 1 : perfectQuizzes;
      const newXP = xp + earnedXP;

      // Check for new badges
      const newBadges = BADGES.filter(
        (b) => !badges.includes(b.id) && b.ok(newProgress, newPerfect)
      );

      setProgress(newProgress);
      if (perfect) setPerfectQuizzes(newPerfect);
      setXp(newXP);
      if (newBadges.length) {
        setBadges((prev) => [...prev, ...newBadges.map((b) => b.id)]);
        newBadges.forEach((b) => addToast({ type: "badge", badge: b }));
      }

      addToast({
        type: "xp",
        amt: earnedXP,
        msg: `Module complete${perfect ? " — perfect score!" : ""}`,
      });
    },
    [progress, perfectQuizzes, xp, badges, addToast]
  );

  const levelData = useMemo(() => getLevelProgress(xp), [xp]);
  const accessibleTierIds = auth ? ROLE_TIERS[auth.role] || [] : [];
  const accessibleTiers = TIERS.filter((t) => accessibleTierIds.includes(t.id));

  const value = useMemo(
    () => ({
      auth,
      login,
      logout,
      progress,
      perfectQuizzes,
      xp,
      badges,
      streak,
      toasts,
      addToast,
      dismissToast,
      completeModule,
      levelData,
      accessibleTiers,
      isModuleDone: (tierId, moduleId) => !!progress[`${tierId}:${moduleId}`],
    }),
    [auth, login, logout, progress, perfectQuizzes, xp, badges, streak, toasts, addToast, dismissToast, completeModule, levelData, accessibleTiers]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppStore() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppStore must be used inside AppProvider");
  return ctx;
}
