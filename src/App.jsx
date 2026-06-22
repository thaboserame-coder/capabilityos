import { useState, useEffect, useRef, useCallback } from "react";
import { Home, BookOpen, Award, BarChart3, Users, Target, Shield, ChevronRight, ArrowLeft, ArrowRight, Check, Loader2, RefreshCw, FileText, MessageSquare, X, Zap, TrendingUp, Bell, Calendar, Send } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import PT from "prop-types";
import Badge from "./ui/Badge.jsx";
import ProgressBar from "./ui/ProgressBar.jsx";
import Toast from "./ui/Toast.jsx";
import { getFallbackQuiz } from "./data/fallbackQuiz.js";

// ─── Design tokens: Workday / Oracle Cloud quality ──────────────────────────
const T = {
  page:       "#F2F2F7",
  surface:    "#FFFFFF",
  surfaceAlt: "#FAFAFA",
  overlay:    "rgba(0,0,0,0.04)",
  brand:   "#0070F3",
  brandDk: "#0055CC",
  brandLt: "#EBF4FF",
  brandBd: "#93C5FD",
  t1: "#1D1D1F",
  t2: "#3A3A3C",
  t3: "#6E6E73",
  t4: "#AEAEB2",
  b1: "#E5E5EA",
  b2: "#F2F2F7",
  b3: "#F9F9F9",
  ok:   "#34C759",  okBg:  "#F0FFF5",
  warn: "#FF9500",  warnBg:"#FFFAF0",
  err:  "#FF3B30",  errBg: "#FFF5F5",
  info: "#0070F3",  infoBg:"#EBF4FF",
  gold: "#FF9F0A",  goldBg:"#FFFBF0",
  fire: "#FF6B35",
  side:    "#1C1C1E",
  sideB:   "rgba(255,255,255,0.06)",
  sideHv:  "rgba(255,255,255,0.04)",
  sideAc:  "rgba(0,112,243,0.16)",
  sideAcT: "#5AC8FA",
  e0: "0 1px 2px rgba(0,0,0,0.04)",
  e1: "0 1px 3px rgba(0,0,0,0.04),0 4px 12px rgba(0,0,0,0.04)",
  e2: "0 2px 6px rgba(0,0,0,0.06),0 8px 24px rgba(0,0,0,0.05)",
  e3: "0 4px 16px rgba(0,0,0,0.08),0 16px 40px rgba(0,0,0,0.07)",
  e4: "0 8px 30px rgba(0,0,0,0.10),0 32px 64px rgba(0,0,0,0.08)",
};
// ─── Global stylesheet ───────────────────────────────────────────────────────
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
  html,body,#root{
    font-family:'Inter',-apple-system,'SF Pro Display','Helvetica Neue',Arial,sans-serif;
    font-size:15px;line-height:1.47059;letter-spacing:-0.01em;
    color:#1D1D1F;background:#F2F2F7;
    -webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;
  }
  input,textarea,button,select{font-family:inherit;font-size:inherit;letter-spacing:inherit}

  /* Module content — premium reading experience */
  .ch h3{font-size:17px;font-weight:700;letter-spacing:-0.02em;color:#1D1D1F;margin:24px 0 10px;line-height:1.3}
  .ch h3:first-child{margin-top:0}
  .ch p{font-size:15px;line-height:1.75;color:#3A3A3C;margin-bottom:14px;letter-spacing:-0.005em}
  .ch p:last-child{margin-bottom:0}
  .ch strong{font-weight:600;color:#1D1D1F}
  .ch ul,.ch ol{padding-left:22px;margin-bottom:14px}
  .ch li{font-size:15px;line-height:1.7;color:#3A3A3C;margin-bottom:5px}

  /* Scrollbar — Apple thin style */
  ::-webkit-scrollbar{width:4px;height:4px}
  ::-webkit-scrollbar-track{background:transparent}
  ::-webkit-scrollbar-thumb{background:rgba(0,0,0,0.15);border-radius:4px}

  /* Navigation */
  .wd-nav{transition:all 150ms cubic-bezier(0.25,0.46,0.45,0.94);cursor:pointer;border-radius:8px}
  .wd-nav:hover{background:rgba(255,255,255,0.05)!important}

  /* Apple-quality cards — NO borders, only shadows */
  .apple-card{background:#FFFFFF;border-radius:12px;box-shadow:0 1px 3px rgba(0,0,0,0.04),0 4px 12px rgba(0,0,0,0.04)}
  .apple-card-hover{transition:box-shadow 200ms cubic-bezier(0.25,0.46,0.45,0.94),transform 200ms cubic-bezier(0.25,0.46,0.45,0.94);cursor:pointer}
  .apple-card-hover:hover{box-shadow:0 4px 16px rgba(0,0,0,0.08),0 16px 40px rgba(0,0,0,0.07)!important;transform:translateY(-2px)}

  /* Interactions */
  .wd-row{transition:background 120ms ease;cursor:pointer}
  .wd-row:hover{background:#F2F2F7!important}
  .wd-btn{transition:all 150ms cubic-bezier(0.25,0.46,0.45,0.94);cursor:pointer;font-family:inherit}
  .wd-btn:disabled{opacity:0.4;cursor:not-allowed}
  .wd-input:focus{outline:none;box-shadow:0 0 0 3px rgba(0,112,243,0.15)!important;border-color:#0070F3!important}

  /* Quiz options */
  .q-opt{transition:all 140ms ease;cursor:pointer}
  .q-opt:hover:not([disabled]){border-color:#0070F3!important;background:#EBF4FF!important}

  /* Progress bar — animated gradient */
  .prog-bar{transition:width 800ms cubic-bezier(0.4,0,0.2,1)}

  /* Animations */
  @keyframes fadeUp{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
  .fade-in{animation:fadeUp 220ms cubic-bezier(0.25,0.46,0.45,0.94)}
  @keyframes slideRight{from{transform:translateX(120px);opacity:0}to{transform:translateX(0);opacity:1}}
  .slide-in{animation:slideRight 320ms cubic-bezier(0.34,1.56,0.64,1)}
  @keyframes badgePop{0%{transform:scale(0) rotate(-10deg);opacity:0}65%{transform:scale(1.12) rotate(3deg)}100%{transform:scale(1) rotate(0);opacity:1}}
  .badge-pop{animation:badgePop 420ms cubic-bezier(0.34,1.56,0.64,1)}
  @keyframes spin{to{transform:rotate(360deg)}}
  @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}

  /* ── Mobile responsive ─────────────────────────────────────────────── */
  @media(max-width:768px){
    .mob-hide{display:none!important}
    .mob-full{width:100%!important;max-width:100%!important}
    .mob-col{flex-direction:column!important}
    .mob-pad{padding:14px 16px!important}
    .mob-grid1{grid-template-columns:1fr!important}
    .mob-text-sm{font-size:13px!important}
    .mob-h-auto{height:auto!important;min-height:auto!important}
    .sidebar-mob{position:fixed;bottom:0;left:0;right:0;width:100%!important;height:calc(56px + env(safe-area-inset-bottom,0px))!important;padding-bottom:env(safe-area-inset-bottom,0px)!important;flex-direction:row!important;z-index:200;border-right:none!important;border-top:1px solid rgba(255,255,255,0.08)!important;padding-left:8px!important;padding-right:8px!important;align-items:center;justify-content:space-around}
    .sidebar-mob .sidebar-logo{display:none!important}
    .sidebar-mob .sidebar-user{display:none!important}
    .sidebar-mob .sidebar-section{display:none!important}
    .sidebar-mob nav{flex-direction:row!important;padding:0!important;gap:0!important;flex:1;align-items:center;justify-content:space-around}
    .sidebar-mob nav > div{padding:6px 4px!important;border-radius:8px;flex-direction:column;align-items:center;gap:1px;font-size:8px!important;border-left:none!important;min-width:44px;border-bottom:2px solid transparent;text-overflow:ellipsis;overflow:hidden;max-width:60px}
    .mob-content{padding-bottom:calc(64px + env(safe-area-inset-bottom,0px))!important}
    .mob-header{padding:0 14px!important;height:48px!important}
    .mob-header .header-lp-bar{width:80px!important}
  }
  @media(max-width:480px){
    .mob-grid1{grid-template-columns:1fr!important}
    .mob-2col{grid-template-columns:1fr!important}
  }
  /* Tablet (iPad) */
  @media(max-width:1024px) and (min-width:769px){
    .sidebar-mob{width:180px!important}
    .mob-grid1{grid-template-columns:1fr 1fr!important}
  }
  /* Touch targets */
  @media(hover:none){
    button,a,[role=button]{min-height:44px;min-width:44px}
  }
  /* Scrollable tab bars on mobile */
  .tab-scroll{overflow-x:auto;-webkit-overflow-scrolling:touch;scrollbar-width:none}
  .tab-scroll::-webkit-scrollbar{display:none}
  /* Full-width inputs on mobile */
  @media(max-width:768px){
    input,select,textarea{font-size:16px!important} /* prevent zoom on iOS */
    .mob-wizard{grid-template-columns:1fr!important}
    .mob-full-w{width:100%!important}
    .mob-stack{flex-direction:column!important;gap:10px!important}
  }
  .cap-select{width:100%;padding:10px 13px;border:1.5px solid #E5E5EA;border-radius:9px;font-size:13px;background:#FAFAFA;font-family:inherit;cursor:pointer;outline:none;color:#3A3A3C;transition:border-color .15s;-webkit-appearance:none;appearance:none;}
  .cap-select:focus{border-color:#0070F3;box-shadow:0 0 0 3px rgba(0,112,243,0.1);}
  .cap-select.purple:focus{border-color:#7C3AED;box-shadow:0 0 0 3px rgba(124,58,237,0.1);}
  @keyframes lpPop{0%{transform:scale(1)}50%{transform:scale(1.4)}100%{transform:scale(1)}}
  @keyframes streakGlow{0%,100%{box-shadow:0 0 8px rgba(255,149,0,0.3)}50%{box-shadow:0 0 20px rgba(255,149,0,0.7)}}
  .streak-glow{animation:streakGlow 2s ease-in-out infinite}
`;

const XP = {MODULE:100,QUIZ_Q:10,PERFECT:50};
const LEVELS = [
  {n:1,name:"Digital Literate",        min:0,    color:"#6B8EAD"},
  {n:2,name:"Data Aware",              min:300,  color:"#4AA8D4"},
  {n:3,name:"Analytics Literate",      min:700,  color:"#0072C6"},
  {n:4,name:"AI Literate",             min:1400, color:"#00D4E8"},
  {n:5,name:"AI Productive",           min:2500, color:"#1D9E75"},
  {n:6,name:"AI Practitioner",         min:4000, color:"#C17F24"},
  {n:7,name:"AI Leader",               min:6500, color:"#7C3AED"},
  {n:8,name:"Transformation Leader",   min:10000,color:"#E8B84B"},
];
const BDEFS = [
  {id:"first", icon:"🎯",name:"First Step",   desc:"Completed your first module",     ok:(p)=>Object.keys(p).length>=1},
  {id:"five",  icon:"📚",name:"On a Roll",    desc:"5 modules completed",             ok:(p)=>Object.keys(p).length>=5},
  {id:"ten",   icon:"🔥",name:"Momentum",     desc:"10 modules completed",            ok:(p)=>Object.keys(p).length>=10},
  {id:"sharp", icon:"💡",name:"Sharp Mind",   desc:"Perfect quiz score",              ok:(p,q)=>q>=1},
  {id:"t1",    icon:"👔",name:"Executive",    desc:"All Tier 1 modules complete",     ok:(p)=>TIERS[0]?.mods.every(m=>p["t1:"+m.id])},
  {id:"t2",    icon:"🚀",name:"AI Leader",    desc:"All Tier 2 modules complete",     ok:(p)=>TIERS[1]?.mods.every(m=>p["t2:"+m.id])},
  {id:"t3",    icon:"⭐",name:"Practitioner", desc:"All Tier 3 modules complete",     ok:(p)=>TIERS[2]?.mods.every(m=>p["t3:"+m.id])},
  {id:"all",   icon:"🏆",name:"Champion",     desc:"All three tiers complete",        ok:(p)=>TIERS.every(t=>t.mods.every(m=>p[t.id+":"+m.id]))},
];
const INDUSTRIES = [
  "Financial Services","Mining & Resources","Healthcare & Life Sciences",
  "Retail & Consumer Goods","Manufacturing & Engineering","Telecommunications",
  "Energy & Utilities","Government & Public Sector","Technology & Software",
  "Professional Services","Agriculture","Property & Real Estate","Transport & Logistics",
];
const IND_SHORT = {
  "Financial Services":"Fin. Services","Mining & Resources":"Mining",
  "Healthcare & Life Sciences":"Healthcare","Retail & Consumer Goods":"Retail",
  "Manufacturing & Engineering":"Manufacturing","Telecommunications":"Telecoms",
  "Energy & Utilities":"Energy","Government & Public Sector":"Government",
  "Technology & Software":"Technology","Professional Services":"Prof. Services",
  "Agriculture":"Agriculture","Property & Real Estate":"Property","Transport & Logistics":"Transport",
};
const DEMO_COHORT = [
  {name:"Nomsa Khumalo",       xp:2100,lv:"AI Strategist",  mods:14,streak:7, last:"30 min ago",ind:"Mining & Resources"},
  {name:"James Okonkwo",       xp:1450,lv:"AI Practitioner",mods:9, streak:3, last:"2 hours ago",ind:"Financial Services"},
  {name:"Sarah Dlamini",       xp:980, lv:"AI Apprentice",  mods:6, streak:2, last:"1 day ago",ind:"Healthcare & Life Sciences"},
  {name:"Michael van der Berg",xp:700, lv:"AI Apprentice",  mods:5, streak:1, last:"1 day ago",ind:"Manufacturing & Engineering"},
  {name:"Thandi Molefe",       xp:300, lv:"AI Aware",       mods:3, streak:0, last:"3 days ago",ind:"Retail & Consumer Goods"},
  {name:"Sipho Ndlovu",        xp:150, lv:"AI Curious",     mods:1, streak:1, last:"5 days ago",ind:"Telecommunications"},
];
const TIERS = [
  {id:"t1", name:"AI Executive", level:"Tier 1", color:"#E8B84B", colorLight:"rgba(232,184,75,0.12)", icon:Award, duration:"3 days",
   description:"Board and executive-level AI strategy, governance, and enterprise transformation leadership.",
   mods:[
    {id:"m1",  title:"The AI Mandate: Why Boards Can No Longer Delegate",               dur:"45 min", type:"Video",    summary:"Board accountability for AI governance and strategy"},
    {id:"m2",  title:"AI Governance and the Board's Accountability",                    dur:"40 min", type:"Workshop", summary:"AI governance frameworks, oversight models, board responsibilities"},
    {id:"m3",  title:"AI Investment Decisions: Allocating Capital Without Wasting It",  dur:"50 min", type:"Video",    summary:"AI ROI, portfolio approach, capital allocation criteria"},
    {id:"m4",  title:"Workforce of the Future: Leading Through AI Disruption",          dur:"35 min", type:"Reading",  summary:"Future of work, AI displacement, reskilling strategy for leaders"},
    {id:"m5",  title:"Responsible AI at the Enterprise Level",                          dur:"40 min", type:"Video",    summary:"Ethics, algorithmic bias, accountability and audit frameworks"},
    {id:"m6",  title:"AI Risk: What Every Executive Must Know",                         dur:"45 min", type:"Workshop", summary:"AI risk taxonomy, enterprise risk management, board oversight"},
    {id:"m7",  title:"Building an AI-Literate Organisation",                            dur:"30 min", type:"Video",    summary:"AI culture, literacy programmes, change leadership"},
    {id:"m8",  title:"AI Strategy: From Vision to Execution",                           dur:"55 min", type:"Workshop", summary:"AI strategy frameworks, operating model, KPIs"},
    {id:"m9",  title:"Regulatory Landscape: AI Laws and Enterprise Compliance",         dur:"40 min", type:"Reading",  summary:"EU AI Act, POPIA, GDPR, FSCA — sector compliance obligations"},
    {id:"m10", title:"AI and the CFO: Financial Implications of Intelligent Systems",   dur:"35 min", type:"Video",    summary:"AI on the P&L, automation economics, financial risk"},
    {id:"m11", title:"Cybersecurity in the Age of AI: Board Responsibilities",          dur:"40 min", type:"Video",    summary:"AI-powered threats, adversarial AI, board-level cyber governance"},
    {id:"m12", title:"AI M&A and Vendor Strategy: Due Diligence in an AI World",       dur:"45 min", type:"Workshop", summary:"AI vendor selection, build vs buy, M&A due diligence"},
  ]},
  {id:"t2", name:"AI Leader", level:"Tier 2", color:"#7C3AED", colorLight:"rgba(124,58,237,0.12)", icon:Users, duration:"4 days",
   description:"Executive leadership transformation — capability building, team enablement, and function-level AI adoption.",
   mods:[
    {id:"m13", title:"AI Fundamentals for Business Leaders",                            dur:"40 min", type:"Video",    summary:"AI concepts, ML basics, generative AI — no-code introduction"},
    {id:"m14", title:"Leading AI Initiatives Without Being Technical",                  dur:"35 min", type:"Video",    summary:"How to lead AI teams, ask the right questions, manage delivery"},
    {id:"m15", title:"Change Management for AI Adoption",                               dur:"45 min", type:"Workshop", summary:"Kotter model applied to AI, resistance management, adoption curves"},
    {id:"m16", title:"Building Your Team's AI Capability",                              dur:"40 min", type:"Workshop", summary:"Skills assessment, learning programmes, AI champions model"},
    {id:"m17", title:"AI in People & HR: From Hiring to Performance Management",        dur:"50 min", type:"Video",    summary:"AI in recruitment, performance, workforce analytics, POPIA compliance"},
    {id:"m18", title:"AI in Finance: Automation, Forecasting, and Risk",                dur:"50 min", type:"Video",    summary:"Financial AI applications, FP&A automation, credit risk AI"},
    {id:"m19", title:"AI in Marketing: Personalisation and Customer Intelligence",      dur:"45 min", type:"Video",    summary:"AI-driven marketing, customer segmentation, generative content"},
    {id:"m20", title:"AI in Operations: Supply Chain and Process Automation",           dur:"45 min", type:"Video",    summary:"Predictive maintenance, demand forecasting, RPA with AI"},
    {id:"m21", title:"AI in Risk and Compliance: Automating the Compliance Function",   dur:"40 min", type:"Workshop", summary:"Regulatory compliance AI, fraud detection, KYC/AML automation"},
    {id:"m22", title:"Designing AI-Driven Products and Services",                       dur:"55 min", type:"Workshop", summary:"AI product strategy, AI-first design, user experience with AI"},
    {id:"m23", title:"Data Strategy for Business Leaders",                              dur:"40 min", type:"Reading",  summary:"Data as an asset, data governance, the CDO perspective"},
    {id:"m24", title:"Measuring AI ROI and Business Impact",                            dur:"35 min", type:"Workshop", summary:"AI metrics framework, value tracking, attribution, board reporting"},
    {id:"m25", title:"AI Procurement: Selecting and Managing AI Vendors",               dur:"40 min", type:"Reading",  summary:"RFP for AI, SLAs, vendor risk, contractual frameworks"},
    {id:"m26", title:"From Pilot to Scale: Deploying AI Across the Enterprise",         dur:"50 min", type:"Video",    summary:"Scaling AI, MLOps basics, organisational readiness for scale"},
    {id:"m27", title:"AI Ethics: Leading Responsible AI in Your Organisation",          dur:"35 min", type:"Video",    summary:"Algorithmic fairness, bias audits, responsible AI deployment"},
  ]},
  {id:"t3", name:"AI Practitioner", level:"Tier 3", color:"#0070F3", colorLight:"rgba(0,112,243,0.12)", icon:Zap, duration:"5 days",
   description:"Applied AI skills — prompt engineering, tools, data analysis, automation, and professional certification.",
   mods:[
    {id:"m28", title:"Introduction to Artificial Intelligence",                         dur:"30 min", type:"Video",    summary:"What is AI, ML, deep learning, generative AI — the fundamentals"},
    {id:"m29", title:"Prompt Engineering Fundamentals",                                 dur:"40 min", type:"Workshop", summary:"How to write effective prompts, zero-shot, few-shot techniques"},
    {id:"m30", title:"Advanced Prompt Engineering for Enterprise",                      dur:"55 min", type:"Workshop", summary:"Chain-of-thought, RAG concepts, enterprise use case prompting"},
    {id:"m31", title:"ChatGPT and LLMs: Practical Applications at Work",               dur:"45 min", type:"Workshop", summary:"Real workplace workflows with ChatGPT, Claude, Gemini"},
    {id:"m32", title:"Microsoft Copilot for Business Professionals",                   dur:"40 min", type:"Workshop", summary:"Copilot in Word, Excel, Teams, Outlook — practical skill building"},
    {id:"m33", title:"Google Workspace AI: Docs, Sheets, and Gmail",                  dur:"35 min", type:"Workshop", summary:"AI in Google Workspace productivity tools for professionals"},
    {id:"m34", title:"Data Analysis with AI Tools",                                    dur:"50 min", type:"Workshop", summary:"AI-assisted data analysis, interpretation, and visualisation"},
    {id:"m35", title:"Introduction to Machine Learning (No Code)",                     dur:"45 min", type:"Video",    summary:"ML concepts, supervised/unsupervised, real-world applications"},
    {id:"m36", title:"AI for Excel and Power BI",                                      dur:"40 min", type:"Workshop", summary:"AI features in Excel, Power BI Copilot, automated insights"},
    {id:"m37", title:"Python Basics for Data Work",                                    dur:"60 min", type:"Workshop", summary:"Python fundamentals: variables, loops, pandas, for data analysis"},
    {id:"m38", title:"Introduction to Data Visualisation",                             dur:"35 min", type:"Video",    summary:"Principles of data visualisation, Tableau, Power BI basics"},
    {id:"m39", title:"Natural Language Processing in Practice",                        dur:"45 min", type:"Video",    summary:"NLP applications: text analysis, sentiment, document intelligence"},
    {id:"m40", title:"Computer Vision: Real-World Applications",                       dur:"40 min", type:"Video",    summary:"Image recognition, object detection, manufacturing and retail use cases"},
    {id:"m41", title:"AI APIs: Integrating Intelligence into Workflows",               dur:"50 min", type:"Workshop", summary:"Using AI APIs, webhooks, Zapier/Make.com workflow automation"},
    {id:"m42", title:"Building AI Agents and Automation",                              dur:"55 min", type:"Workshop", summary:"AI agents, agentic workflows, autonomous task execution"},
    {id:"m43", title:"Generative AI for Content Creation",                             dur:"35 min", type:"Workshop", summary:"AI writing, image generation, video, presentations"},
    {id:"m44", title:"AI in Customer Service and Support",                             dur:"40 min", type:"Video",    summary:"Chatbots, virtual assistants, sentiment analysis in CX"},
    {id:"m45", title:"AI for Project Managers",                                        dur:"35 min", type:"Video",    summary:"AI tools for planning, resource management, risk forecasting"},
    {id:"m46", title:"AI-Powered Research and Analysis",                               dur:"40 min", type:"Workshop", summary:"AI for literature review, market research, competitive intelligence"},
    {id:"m47", title:"Digital Transformation Practitioner",                            dur:"50 min", type:"Reading",  summary:"Digital transformation frameworks, technology strategy, case studies"},
    {id:"m48", title:"Data Privacy, POPIA and AI Compliance",                          dur:"40 min", type:"Reading",  summary:"POPIA obligations, GDPR principles, AI compliance practitioner checklist"},
    {id:"m49", title:"AI in Healthcare and Life Sciences",                             dur:"45 min", type:"Video",    summary:"Clinical AI, diagnostic support, pharma, digital health applications"},
    {id:"m50", title:"AI in Financial Services: BFSI Applications",                   dur:"50 min", type:"Video",    summary:"Banking AI, insurance automation, fintech, credit risk modelling"},
    {id:"m51", title:"AI in Retail and Consumer Goods",                               dur:"40 min", type:"Video",    summary:"Demand forecasting, personalisation, inventory, dynamic pricing AI"},
    {id:"m52", title:"AI in Mining, Energy and Resources",                            dur:"40 min", type:"Video",    summary:"Predictive maintenance, safety systems, exploration and grid AI"},
  ]},
];

// ─── Pan-African AI Use Cases ─────────────────────────────────────────────────
const PAN_AFRICAN_CASES = [
  {id:"fs1",country:"South Africa",flag:"🇿🇦",sector:"Financial Services",industry:"Financial Services",functions:["Finance & Treasury","Risk & Compliance"],roles:["executive","functional"],title:"AI Credit Scoring at Unbanked Scale",challenge:"SA's major banks needed to extend credit to 11M previously unscored adults without traditional credit history.",solution:"ML models trained on mobile payment patterns, utility payments, and retail behaviour predict creditworthiness with 78% accuracy vs 71% for traditional scoring.",impact:"R4.2bn in new credit extended in 12 months. Default rates 18% lower than predicted by traditional models.",roi:"3.8x ROI"},
  {id:"fs2",country:"Nigeria",flag:"🇳🇬",sector:"Financial Services",industry:"Financial Services",functions:["Risk & Compliance","Technology & Engineering"],roles:["executive","functional","manager"],title:"Real-Time Fraud Detection — GTBank",challenge:"Nigerian digital banking fraud losses exceeded $500M in 2023. Traditional rule-based systems flagged 40% false positives.",solution:"Deep learning model processing 2M+ daily transactions in real time. Identifies anomalous patterns within 80ms.",impact:"Fraud losses reduced 52%. False positive rate dropped from 40% to 6%.",roi:"5.1x ROI"},
  {id:"fs3",country:"Kenya",flag:"🇰🇪",sector:"Financial Services",industry:"Financial Services",functions:["Technology & Engineering","Operations & Supply Chain"],roles:["functional","manager","learner"],title:"M-Pesa AI Dispute Resolution",challenge:"Safaricom processed 30M+ monthly M-Pesa transactions with 180,000+ monthly disputes each requiring human review.",solution:"NLP model classifies and auto-resolves 68% of disputes without human review. Escalates complex cases with full context.",impact:"Dispute resolution: 72 hours → 4 minutes for auto-resolved cases. Agent productivity up 3.4x.",roi:"4.6x ROI"},
  {id:"fs4",country:"Egypt",flag:"🇪🇬",sector:"Financial Services",industry:"Financial Services",functions:["Finance & Treasury","Risk & Compliance"],roles:["executive","functional"],title:"Islamic Finance AI Compliance — CIB",challenge:"Commercial International Bank needed to screen all financing applications for Sharia compliance across 50+ product categories.",solution:"LLM-based compliance engine trained on Islamic finance jurisprudence. Reviews contracts and identifies non-compliant clauses.",impact:"Compliance review time reduced 65%. Zero Sharia board violations in 18 months post-deployment.",roi:"2.9x ROI"},
  {id:"mn1",country:"South Africa",flag:"🇿🇦",sector:"Mining & Resources",industry:"Mining & Resources",functions:["Operations & Supply Chain","Technology & Engineering"],roles:["functional","manager","learner"],title:"Predictive Maintenance — Anglo American Platinum",challenge:"Underground conveyor failures cause unplanned stoppages averaging R12M per incident at Mogalakwena mine.",solution:"IoT sensor network + ML model predicts mechanical failure 48–72 hours before occurrence. 94% accuracy.",impact:"Unplanned downtime reduced 24%. Three major failures prevented in first 6 months. Safety incidents down 31%.",roi:"6.2x ROI"},
  {id:"mn2",country:"Ghana",flag:"🇬🇭",sector:"Mining & Resources",industry:"Mining & Resources",functions:["Operations & Supply Chain","Finance & Treasury"],roles:["executive","functional"],title:"AI-Powered Gold Grade Prediction — Newmont Ghana",challenge:"Drilling decisions at Ahafo mine required 48-hour lab analysis per sample, slowing extraction planning.",solution:"Hyperspectral imaging AI predicts gold grade from drill core images in 3 minutes vs 48 hours. 89% accuracy.",impact:"Drilling planning cycle 10x faster. Over-drilling reduced 18%. $28M in annual cost savings.",roi:"7.4x ROI"},
  {id:"ag1",country:"Kenya",flag:"🇰🇪",sector:"Agriculture",industry:"Agriculture",functions:["Operations & Supply Chain","Technology & Engineering"],roles:["functional","manager","learner"],title:"Crop Disease Detection via SMS",challenge:"Smallholder farmers in Western Kenya lost 30–50% of yields annually to preventable crop diseases.",solution:"AI model on feature phones: farmer photographs leaf via SMS. Returns disease diagnosis in Swahili within 60 seconds.",impact:"15,000 farmers enrolled. Average yield improvement 28%. Input cost reduction 22%.",roi:"NGO/Commercial hybrid"},
  {id:"ag2",country:"Ethiopia",flag:"🇪🇹",sector:"Agriculture",industry:"Agriculture",functions:["Operations & Supply Chain","Finance & Treasury"],roles:["functional","manager"],title:"Coffee Quality Grading AI — Ethiopian Commodity Exchange",challenge:"ECX grades 700,000+ tonnes of coffee annually. Human grading introduces 15–20% variance.",solution:"Computer vision model grades coffee samples in 8 seconds. Trained on 500,000 graded samples.",impact:"Grading variance reduced to 3%. Exporters receive fair-value pricing. Processing capacity up 4x.",roi:"$40M in recovered value"},
  {id:"hc1",country:"Rwanda",flag:"🇷🇼",sector:"Healthcare & Life Sciences",industry:"Healthcare & Life Sciences",functions:["Operations & Supply Chain","Technology & Engineering"],roles:["executive","functional"],title:"AI Diagnostics in Rural Health — Rwanda Biomedical Centre",challenge:"Rural Rwanda has 1 doctor per 10,000 people. Delayed TB and malaria diagnosis leads to preventable deaths.",solution:"AI on tablets analyses chest X-rays for TB with 92% sensitivity. Malaria detection via blood smear photo in 2 minutes.",impact:"Diagnosis time: 2 weeks → 2 hours in rural facilities. TB detection rate up 34%.",roi:"$18M in avoided hospitalisation costs"},
  {id:"hc2",country:"South Africa",flag:"🇿🇦",sector:"Healthcare & Life Sciences",industry:"Healthcare & Life Sciences",functions:["HR & People","Risk & Compliance"],roles:["executive","functional","manager"],title:"Nurse Burnout Prediction — Life Healthcare",challenge:"Life Healthcare lost 1,200 nurses in 2022 to burnout-related resignation. Replacement cost per nurse: R85,000.",solution:"ML model analyses shift patterns, leave requests, and patient load. Flags at-risk nurses 6 weeks before resignation.",impact:"Nurse attrition reduced 29%. R102M in avoided recruitment costs in 12 months.",roi:"4.1x ROI"},
  {id:"rt1",country:"South Africa",flag:"🇿🇦",sector:"Retail & Consumer Goods",industry:"Retail & Consumer Goods",functions:["Operations & Supply Chain","Finance & Treasury"],roles:["functional","manager"],title:"Demand Forecasting — Shoprite Group",challenge:"Shoprite operates 2,800+ stores across 12 countries. Stockouts cost R1.8bn annually.",solution:"ML demand forecast per SKU per store, incorporating weather, local events, promotions, and payday cycles.",impact:"Forecast accuracy improved from 71% to 89%. Stockouts reduced 23%. Waste reduced 18% for perishables.",roi:"5.3x ROI"},
  {id:"rt2",country:"Nigeria",flag:"🇳🇬",sector:"Retail & Consumer Goods",industry:"Retail & Consumer Goods",functions:["Sales & Customer Experience","Marketing & Brand"],roles:["functional","manager","learner"],title:"Conversational Commerce — Jumia Nigeria",challenge:"Jumia's 3M+ customers in Nigeria had low repeat purchase rates due to complex checkout.",solution:"WhatsApp AI agent handles product discovery, order tracking, and returns in Pidgin English, Yoruba, and Hausa.",impact:"Repeat purchase rate up 41%. Customer support cost reduced 58%. Average order value up 22%.",roi:"3.7x ROI"},
  {id:"tc1",country:"South Africa",flag:"🇿🇦",sector:"Telecommunications",industry:"Telecommunications",functions:["Technology & Engineering","Operations & Supply Chain"],roles:["functional","manager","learner"],title:"Network Fault Prediction — MTN South Africa",challenge:"MTN SA's 40M+ subscribers experience 220,000+ network incidents annually. Average resolution time: 4.2 hours.",solution:"ML model on network telemetry data predicts cell tower failures 6–12 hours before occurrence.",impact:"Proactive resolution rate up from 8% to 67%. Mean time to repair reduced 44%.",roi:"4.8x ROI"},
  {id:"gv1",country:"Rwanda",flag:"🇷🇼",sector:"Government & Public Sector",industry:"Government & Public Sector",functions:["Technology & Engineering","Legal & Governance"],roles:["executive","functional"],title:"Kigali Smart City AI Platform",challenge:"Kigali needed to optimise traffic, waste collection, and public safety across a city of 1.3M.",solution:"Integrated AI platform: traffic signal optimisation, waste truck routing, CCTV anomaly detection.",impact:"Traffic flow efficiency up 28%. Waste collection cost down 22%. Emergency response time reduced 35%.",roi:"$45M government savings over 5 years"},
  {id:"gv2",country:"South Africa",flag:"🇿🇦",sector:"Government & Public Sector",industry:"Government & Public Sector",functions:["Legal & Governance","Risk & Compliance"],roles:["executive","functional"],title:"SARS AI Tax Compliance Engine",challenge:"SARS estimated R300bn annual tax gap. Manual audits covered 0.4% of returns.",solution:"ML compliance engine analyses 6M+ corporate and individual returns annually. Flags anomalous patterns.",impact:"Audit yield up 34%. Additional R18bn collected in first year. False positive audit rate reduced 60%.",roi:"R18bn revenue / R380M investment"},
  {id:"ed1",country:"South Africa",flag:"🇿🇦",sector:"Education",industry:"Technology & Software",functions:["Academic Affairs","HR & People"],roles:["academic","executive","functional"],title:"AI Early Intervention — University of Pretoria",challenge:"UP's 55,000 students showed 28% first-year dropout rate. Lecturers couldn't identify at-risk students in large cohorts.",solution:"Learning analytics tracks engagement, assignment timing, and portal access. Flags at-risk students for early intervention.",impact:"First-year dropout rate reduced from 28% to 19%. Early intervention acceptance: 72%.",roi:"R85M in retained tuition revenue"},
  {id:"en1",country:"South Africa",flag:"🇿🇦",sector:"Energy & Utilities",industry:"Energy & Utilities",functions:["Operations & Supply Chain","Technology & Engineering"],roles:["executive","functional","manager"],title:"Eskom AI Load Forecasting",challenge:"Eskom's load forecasting errors contributed to unnecessary loadshedding. 1% forecast error = 500MW curtailment.",solution:"Ensemble ML model integrating weather, industrial load patterns, and economic indicators. Updated every 15 minutes.",impact:"Forecast accuracy improved from 94.1% to 97.8%. Estimated 340 hours of unnecessary loadshedding avoided.",roi:"R2.8bn in avoided economic cost"},
  {id:"mn3",country:"Morocco",flag:"🇲🇦",sector:"Mining & Resources",industry:"Mining & Resources",functions:["Operations & Supply Chain","Finance & Treasury"],roles:["functional","manager"],title:"AI Irrigation — OCP Group Morocco",challenge:"Morocco's phosphate agriculture uses 65% of national freshwater. Inefficient irrigation causes water scarcity.",solution:"Satellite imagery + soil sensors + weather models create AI irrigation schedules. Updated daily.",impact:"Water usage reduced 34% with equal yields. Deployed across 50,000 hectares.",roi:"R22M water savings in year 1"},
  {id:"fs5",country:"Côte d'Ivoire",flag:"🇨🇮",sector:"Financial Services",industry:"Financial Services",functions:["Finance & Treasury","Technology & Engineering"],roles:["functional","manager","learner"],title:"Mobile Credit Scoring — Ecobank West Africa",challenge:"Ecobank's West African expansion required credit assessment for 8M unbanked customers with no formal credit records.",solution:"AI model using mobile transaction data, merchant relationships, and utility payment patterns.",impact:"Credit access extended to 2.3M new customers in 18 months. Portfolio NPL rate below 4%.",roi:"4.4x ROI"},
  {id:"ag3",country:"Tanzania",flag:"🇹🇿",sector:"Agriculture",industry:"Agriculture",functions:["Operations & Supply Chain","Finance & Treasury"],roles:["functional","manager"],title:"AI Cashew Quality Control — TANIA Tanzania",challenge:"Tanzania exports 250,000+ tonnes of cashews annually. Manual grading takes 3 days per shipment.",solution:"Computer vision AI grades cashew quality in 15 minutes per batch. Detects defects invisible to the human eye.",impact:"Export rejection rate down 64%. Premium grade yield up 22%. Annual export value increased by $18M.",roi:"$18M additional export revenue"},
];


// ─── Design tokens: Workday / Oracle Cloud quality ──────────────────────────
// ─── Global stylesheet ───────────────────────────────────────────────────────



// ─── 8-Level Capability Framework (per EDAAI Workforce Architecture) ─────────
const CAP_DIMS = [
  {id:"d1",name:"Digital Foundations",   short:"Digital",  color:"#6B8EAD",
   desc:"Core digital confidence — tools, cybersecurity awareness, productivity systems, collaboration platforms",
   skills:["Digital tools","Cybersecurity basics","Productivity apps","Digital communication","Remote collaboration"]},
  {id:"d2",name:"Data Fluency",           short:"Data",     color:"#4AA8D4",
   desc:"Reading, interpreting and using data to make better decisions — from tables to dashboards",
   skills:["Data interpretation","Dashboard reading","Excel/Sheets","Basic statistics","Data storytelling"]},
  {id:"d3",name:"Analytical Thinking",   short:"Analytics",color:"#3E8FBF",
   desc:"Structuring problems, identifying patterns and drawing evidence-based conclusions",
   skills:["Problem structuring","Root cause analysis","Pattern recognition","Evidence-based decisions","KPI design"]},
  {id:"d4",name:"AI Awareness",          short:"AI Aware", color:"#5C6BC0",
   desc:"Understanding what AI is, how it works, its limits and its implications for your role",
   skills:["AI concepts","ML basics","Generative AI","AI limitations","AI in your industry"]},
  {id:"d5",name:"Applied AI Skills",     short:"Applied",  color:"#7C3AED",
   desc:"Using AI tools effectively in your daily work — prompting, evaluating outputs, building workflows",
   skills:["Prompt engineering","AI tool selection","Output evaluation","Workflow automation","AI productivity"]},
  {id:"d6",name:"AI-Led Practice",       short:"Practice", color:"#9C27B0",
   desc:"Integrating AI into how your function operates — redesigning processes, leading adoption in your team",
   skills:["Process redesign","Team AI adoption","AI use case design","Change management","Value measurement"]},
  {id:"d7",name:"Transformation Design", short:"Transform",color:"#E91E63",
   desc:"Designing and leading enterprise-wide digital and AI transformation programmes",
   skills:["Transformation strategy","Operating model design","Stakeholder alignment","Portfolio management","Culture change"]},
  {id:"d8",name:"Responsible AI",        short:"Ethics",   color:"#FF9500",
   desc:"Governing AI ethically — fairness, accountability, explainability, POPIA and regulatory compliance",
   skills:["AI ethics","Algorithmic bias","POPIA/GDPR","Explainability","AI governance frameworks"]},
];



// ─── Missions ─────────────────────────────────────────────────────────────────
const MISSIONS = [
  {id:"m1",name:"Foundation Sprint",type:"Sprint",icon:"🚀",xp:300,
   desc:"Complete your first full programme from start to finish.",
   steps:[{label:"Complete 3 modules",key:"m1s1",nav:"learning"},{label:"Score 80%+ on a knowledge check",key:"m1s2"},{label:"Earn 300 LP",key:"m1s3"},{label:"Complete a Daily Challenge",key:"m1s4"}],
   checkFn:(p,s)=>Object.keys(p).length},
  {id:"m2",name:"African Enterprise Challenge",type:"Mastery",icon:"🌍",xp:500,
   desc:"Explore 5 AI deployments from different African countries.",
   steps:[{label:"Open Use Cases",key:"m2s1",nav:"usecases"},{label:"Read 3 different sector cases",key:"m2s2"},{label:"Read 5 cases across 3+ countries",key:"m2s3"}],
   checkFn:(p)=>Math.min(Object.keys(p).filter(k=>k.startsWith("t")).length,5)},
  {id:"m3",name:"Prompt Mastery",type:"Mastery",icon:"💡",xp:400,
   desc:"Complete the Prompt Engineering Lab and score 90%+ on a quiz.",
   steps:[{label:"Open the Prompt Lab",key:"m3s1",nav:"promptlab"},{label:"Try a prompt template",key:"m3s2"},{label:"Score 90%+ on a knowledge check",key:"m3s3"}],
   checkFn:(p)=>Math.min(Object.keys(p).length,3)},
  {id:"m4",name:"AI Leader Championship",type:"Championship",icon:"🏆",xp:1000,
   desc:"Complete 14 modules across the platform.",
   steps:[{label:"Complete 5 modules",key:"m4s1"},{label:"Complete 8 modules",key:"m4s2"},{label:"Complete 11 modules",key:"m4s3"},{label:"Complete 14 modules",key:"m4s4"}],
   checkFn:(p)=>Object.keys(p).length},
  {id:"m5",name:"7-Day Streak",type:"Daily",icon:"🔥",xp:250,
   desc:"Log in and complete the daily challenge 7 days in a row.",
   steps:[{label:"Day 1",key:"m5s1"},{label:"Day 2",key:"m5s2"},{label:"Day 3",key:"m5s3"},{label:"Day 4",key:"m5s4"},{label:"Day 5",key:"m5s5"},{label:"Day 6",key:"m5s6"},{label:"Day 7",key:"m5s7"}],
   checkFn:(_,streak)=>Math.min(streak||0,7)},
];

// ─── Management Functions + Role→Tier mapping ────────────────────────────────
const MGMT_FUNCTIONS = [
  "HR & People","Finance & Treasury","Risk & Compliance","Technology & Engineering",
  "Data & Analytics","Operations & Supply Chain","Sales & Customer Experience",
  "Marketing & Brand","Legal & Governance","Strategy & Corporate Development",
  "Audit & Assurance","Product Management","Customer Success","Procurement",
  "Internal Communications","ESG & Sustainability",
];

// Sub-roles by function — what each person actually does
const ROLE_SUBFUNCTIONS = {
  "HR & People":[
    "HR Business Partner","Talent Acquisition","Learning & Development",
    "HR Systems (HRIS)","Compensation & Benefits","People Analytics",
    "Organisational Development","HR Compliance","Payroll","Employee Relations",
  ],
  "Finance & Treasury":[
    "FP&A (Financial Planning & Analysis)","Management Accounting","Treasury & Capital Markets",
    "Tax","Internal Audit","Financial Control","Business Finance Partner",
    "Finance Systems","Investor Relations","Financial Reporting",
  ],
  "Risk & Compliance":[
    "Credit Risk","Operational Risk","Market Risk","Regulatory Compliance",
    "AML & Financial Crime","Enterprise Risk Management","Model Risk",
    "Conduct & Ethics","Cybersecurity Risk","Third-Party Risk",
  ],
  "Technology & Engineering":[
    "Software Engineering","DevOps & Platform Engineering","Product Management",
    "QA & Testing","Cybersecurity","Enterprise Architecture","IT Operations",
    "Digital Transformation","Cloud Engineering","Systems Integration",
  ],
  "Data & Analytics":[
    "Data Engineering","Data Science","Business Intelligence","Data Architecture",
    "Data Visualisation","Data Analytics","Data Governance","AI & ML Engineering",
    "Data Strategy","MLOps",
  ],
  "Operations & Supply Chain":[
    "Supply Chain Analytics","Procurement & Sourcing","Logistics & Distribution",
    "Process & BPM","Quality Management","Facilities Management",
    "Vendor Management","Project Management Office","Manufacturing Operations","Inventory Management",
  ],
  "Sales & Customer Experience":[
    "Account Management","Business Development","Inside Sales",
    "Customer Success","Sales Operations","Contact Centre","CX Strategy",
    "Revenue Operations","Pre-Sales & Solutions","Channel Management",
  ],
  "Marketing & Brand":[
    "Brand Management","Digital Marketing","Performance Marketing",
    "CRM & Loyalty","Content Strategy","Marketing Analytics",
    "Product Marketing","Communications & PR","Social Media","Events & Sponsorship",
  ],
  "Legal & Governance":[
    "Corporate Counsel","Regulatory Affairs","Contract Management",
    "Intellectual Property","Litigation","Company Secretariat",
    "Legal Operations","Compliance Officer","Data Privacy & POPIA",
  ],
  "Strategy & Corporate Development":[
    "Corporate Strategy","M&A & Transactions","Business Research & Intelligence",
    "PMO","Transformation Office","Innovation","ESG & Sustainability","Scenario Planning",
  ],
  "Audit & Assurance":[
    "Internal Audit","External Audit","IT Audit","Risk Assurance","Forensics","Compliance Audit",
  ],
  "Product Management":[
    "Product Strategy","Product Discovery","Agile / Scrum","Product Analytics",
    "UX & Design","Growth","Platform Product","B2B Product","B2C Product",
  ],
  "Data Engineering":["Data Pipeline Development","Data Warehouse","Lakehouse Architecture","Streaming Data","DataOps","SQL & Query Optimisation"],
  "Data Science":["ML Modelling","Statistical Analysis","NLP","Computer Vision","Experimentation & A/B Testing","Model Deployment"],
};

// Which sub-functions need aptitude / technical assessment components
const TECHNICAL_SUBFUNCTIONS = [
  "Data Engineering","Data Science","AI & ML Engineering","MLOps","Software Engineering",
  "DevOps & Platform Engineering","Cybersecurity","Data Architecture","Enterprise Architecture",
  "QA & Testing","Cloud Engineering","ML Modelling","Data Pipeline Development",
];


// Data-focused sub-functions for deep personalisation
const DATA_SUBFUNCTIONS = [
  "Data Engineering","Data Science","Business Intelligence",
  "Data Architecture","Data Visualisation","Data Analytics",
];


const ROLE_TIERS = {executive:["t1"],functional:["t2"],manager:["t2","t3"],learner:["t3"],emerging:["t3"],facilitator:[]};
const ROLE_DISPLAY = {executive:"Board & Executive",functional:"Executive Leadership",manager:"Senior Management",learner:"Professional Specialist",emerging:"Emerging Talent",facilitator:"Platform Administrator"};
const ROLE_LABEL = {executive:"Board & Executive",functional:"Executive Leadership",manager:"Senior Management",learner:"Professional Specialist",emerging:"Emerging Talent",facilitator:"Platform Administrator"};
/** @param {string} role - User role key. @returns {object[]} Tiers visible to the given role. */
function getVisibleTiers(role){const ids=ROLE_TIERS[role]||["t3"];return TIERS.filter(t=>ids.includes(t.id));}
/** @param {string} role - User role key. @returns {object} First tier assigned to the given role. */
function getPrimaryTier(role){const ids=ROLE_TIERS[role]||["t3"];return TIERS.find(t=>t.id===ids[0])||TIERS[2];}
/** @returns {number} Total module count across all tiers. */
function totalMods(){return TIERS.reduce((a,t)=>a+t.mods.length,0);}
const GARTNER_TIERS=[
  {id:"executive",  label:"Board & Executive",      tier:"Strategic Leadership",   icon:"⬡", price:"R 4,999",  period:"/seat/mo", color:"#E8B84B", desc:"Workforce intelligence, AI governance, and enterprise transformation strategy"},
  {id:"functional", label:"Executive Leadership",   tier:"Executive Management",   icon:"◈", price:"R 3,499",  period:"/seat/mo", color:"#7C3AED", desc:"Capability development, AI adoption, and function-level transformation"},
  {id:"manager",    label:"Senior Management",      tier:"Operational Leadership", icon:"◇", price:"R 2,499",  period:"/seat/mo", color:"#0070F3", desc:"Team capability building, AI productivity, and operational readiness"},
  {id:"learner",    label:"Professional Specialist",tier:"Individual Capability",  icon:"○", price:"R 1,499",  period:"/seat/mo", color:"#34C759", desc:"Applied AI skills, prompt engineering, and professional certification"},
  {id:"emerging",   label:"Emerging Talent",        tier:"Foundational Development",icon:"◉",price:"R 799",   period:"/seat/mo", color:"#5AC8FA", desc:"Digital literacy, data fundamentals, and AI awareness programmes"},
  {id:"facilitator",label:"Platform Administrator", tier:"Enterprise Platform",    icon:"◫", price:"Custom",   period:"",         color:"#FF9500", desc:"Full platform management — requires administrator access code"},
];
const ADMIN_CODE="CAPOS-ADMIN-2025";
const VALID_ORG_CODES=["ORG-2025","DEMO-2025","DIGILYTICS-2025","CAPOS-2025","ENTERPRISE-2025"];
const MAX_LOGIN_ATTEMPTS=5;
const PROFILE_STORAGE_KEY="cap:profile";
/** Persists learner profile to localStorage. @param {object} d - Profile data. */
function saveProfile(d){try{localStorage.setItem(PROFILE_STORAGE_KEY,JSON.stringify({...d,savedAt:Date.now()}));}catch(e){}}
/** Loads learner profile from localStorage; returns null if absent or older than 8 h. @returns {object|null} */
function loadProfile(){try{const s=localStorage.getItem(PROFILE_STORAGE_KEY);if(!s)return null;const p=JSON.parse(s);if(Date.now()-p.savedAt>28800000)return null;return p;}catch(e){return null;}}
/** Removes learner profile from localStorage on logout. */
function clearProfile(){try{localStorage.removeItem(PROFILE_STORAGE_KEY);}catch(e){}}
/** Appends an audit entry to sessionStorage (capped at 200). @param {string} ev - Event name. @param {object} [d={}] - Extra metadata. */
function secLog(ev,d={}){try{const h=JSON.parse(sessionStorage.getItem("cap:audit")||"[]");h.push({ts:new Date().toISOString(),event:ev,...d});sessionStorage.setItem("cap:audit",JSON.stringify(h.slice(-200)));}catch(e){}} // Platform admin access code
const ROLE_TIER={executive:"t1",functional:"t2",manager:"t2",learner:"t3",academic:"t3"};
const WEEKDAY_THEMES={
  executive:  ["AI Strategy","AI Governance","Workforce Intelligence","AI Risk & Compliance","Business Transformation","Executive Briefing","Strategic Insight"],
  functional: ["AI Adoption","AI Investment","Workforce Capability","AI Governance","Business Impact","Executive Briefing","Strategic Insight"],
  manager:    ["Team AI Adoption","AI Leadership","AI Use Cases","Change Management","AI Governance","Deep Dive","Weekend Challenge"],
  learner:    ["AI Productivity","Prompt Engineering","AI in Your Function","Data Literacy","AI Ethics","Case Studies","Weekend Challenge"],
  emerging:   ["AI Foundations","Digital Skills","Data Literacy","Practical AI Tools","Career Development","Case Studies","Weekend Challenge"],
  facilitator:["Platform Analytics","Cohort Insights","Learning Effectiveness","Capability Gaps","AI Governance","Reporting","Weekly Review"],
};
/** @param {string} role - User role key. @param {number} dayIdx - Day-of-week index (0–6). @returns {string} Theme label for that weekday. */
function getRoleTheme(role,dayIdx){
  const themes=WEEKDAY_THEMES[role]||WEEKDAY_THEMES.learner;
  return themes[dayIdx%7];
}
const PROMPTS_OF_DAY=[
  {title:"The Decision Brief",template:"You are a senior advisor. I need to decide [decision]. Facts: [key facts]. Constraints: [constraints]. Give me a structured recommendation with top 3 considerations and your choice."},
  {title:"The Meeting Prep",template:"Meeting with [who] about [topic]. Goal: [goal]. Give me 5 questions I should ask and objections I should prepare for."},
  {title:"The Risk Scanner",template:"Plan: [action]. Scan for AI risks across: POPIA compliance, model accuracy, staff adoption, regulatory exposure. Flag anything needing escalation."},
  {title:"The Summariser",template:"Summarise this for a [role] audience in 3 sentences: [paste document]. Answer: What is this? What decision is required? Risk of inaction?"},
  {title:"The Email Sharpener",template:"Rewrite this email 40% shorter and more direct for a [role] recipient. Make the ask explicit in sentence one. Original: [paste email]"},
  {title:"The Insight Extractor",template:"Data: [paste data]. I work in [function], [industry]. What are the 3 most important insights for a [role]? What action follows each?"},
  {title:"The Job Aid Builder",template:"I am a [role] in [function]. Create a one-page AI quick reference: 3 tasks AI can do for me today, 2 prompts to save, 1 thing to always verify manually."},
];

// ─── Storage ────────────────────────────────────────────────────────────────
/** @param {string} n - User name key. @returns {Promise<object>} Stored user record or empty object. */
async function loadUser(n){try{const r=await window.storage.get("u:"+n);return r?JSON.parse(r.value):{}}catch(e){return {}}}
/** @param {string} n - User name key. @param {object} d - User data to persist. @returns {Promise<void>} */
async function saveUser(n,d){try{await window.storage.set("u:"+n,JSON.stringify(d))}catch(e){}}
/** @returns {Promise<object[]>} Global leaderboard entries sorted by XP. */
async function getBoard(){try{const r=await window.storage.get("board",true);return r?JSON.parse(r.value):[]}catch(e){return []}}
/** Upserts a learner entry on the leaderboard. @param {string} n - Name. @param {number} xp - Total XP. @param {string} lv - Level label. @param {string} [ind=""] - Industry. @returns {Promise<void>} */
async function updateBoard(n,xp,lv,ind=""){try{const b=await getBoard();const i=b.findIndex(e=>e.n===n);const e={n,xp,lv,ind,d:new Date().toISOString().slice(0,10)};if(i>=0)b[i]=e;else b.push(e);b.sort((a,z)=>z.xp-a.xp);await window.storage.set("board",JSON.stringify(b.slice(0,20)),true)}catch(e){}}
/** @returns {Promise<object>} Map of note id → {text, auth, d} for all shared facilitator notes. */
async function getNotes(){try{const r=await window.storage.list("fn:",true);const o={};for(const k of(r.keys||[])){const v=await window.storage.get(k,true);if(v)o[k.replace("fn:","")]=JSON.parse(v.value)}return o}catch(e){return {}}}
/** @param {string} id - Note identifier. @param {string} text - Note body. @param {string} auth - Author name. @returns {Promise<void>} */
async function saveNote(id,text,auth){try{await window.storage.set("fn:"+id,JSON.stringify({text,auth,d:new Date().toLocaleDateString("en-ZA")}),true)}catch(e){}}
// ─── XP / Level helpers ──────────────────────────────────────────────────────
/** @param {number} xp - Current XP total. @returns {object} Current level definition. */
function getLv(xp){return [...LEVELS].reverse().find(l=>xp>=l.min)||LEVELS[0]}
/** @param {number} xp - Current XP total. @returns {object|undefined} Next level definition, or undefined if maxed. */
function getNext(xp){return LEVELS.find(l=>l.min>xp)}
/** @param {number} xp - Current XP total. @returns {number} Progress percentage (0–100) toward next level. */
function getLvPct(xp){const c=getLv(xp),nx=getNext(xp);if(!nx)return 100;return Math.round((xp-c.min)/(nx.min-c.min)*100)}
/** @param {object} prog - Module completion map. @param {object} pq - Quiz scores map. @param {string[]} have - Already-earned badge IDs. @returns {string[]} Newly earned badge IDs. */
function newBadges(prog,pq,have){return BDEFS.filter(b=>!have.includes(b.id)&&b.ok(prog,pq))}

// ─── Custom SVG Radar Chart ──────────────────────────────────────────────────
/** @param {{data:object[],size:number}} props - data: [{label,value}] array; size: SVG dimension. @returns {JSX.Element} Radar chart SVG. */
function SvgRadar({data,size=220}){
  const cx=size/2,cy=size/2,r=size*0.32,n=data.length;
  function pt(i,val,maxVal=100,rOv){const angle=(2*Math.PI*i/n)-Math.PI/2;const radius=(rOv||r)*(val/maxVal);return{x:cx+radius*Math.cos(angle),y:cy+radius*Math.sin(angle)};}
  function poly(scale,rOv){return data.map((_,i)=>{const p=pt(i,scale,100,rOv);return p.x+","+p.y;}).join(" ");}
  const scorePts=data.map((d,i)=>{const p=pt(i,d.score);return p.x+","+p.y;}).join(" ");
  const benchPts=data.map((d,i)=>{const p=pt(i,d.benchmark||0);return p.x+","+p.y;}).join(" ");
  return(<svg width={size} height={size} viewBox={"0 0 "+size+" "+size} style={{overflow:"visible"}}>
    {[20,40,60,80,100].map(s=><polygon key={s} points={poly(s)} fill="none" stroke="#E5E5EA" strokeWidth={s===100?1:0.5}/>)}
    {data.map((_,i)=>{const p=pt(i,100);return <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke="#E5E5EA" strokeWidth={0.8}/>;} )}
    <polygon points={benchPts} fill="none" stroke="#FF9500" strokeWidth={1.5} strokeDasharray="4 3" opacity={0.7}/>
    <polygon points={scorePts} fill="#0070F3" fillOpacity={0.14} stroke="#0070F3" strokeWidth={2.5}/>
    {data.map((d,i)=>{const dot=pt(i,d.score);return <circle key={i} cx={dot.x} cy={dot.y} r={4} fill="#0070F3" stroke="#FFFFFF" strokeWidth={1.5}/>;} )}
    {data.map((d,i)=>{const lp=pt(i,100,100,r*1.38);const words=d.axis.split(" ");return(
      <text key={i} x={lp.x} y={lp.y} textAnchor="middle" dominantBaseline="middle">
        {words.map((w,j)=><tspan key={j} x={lp.x} dy={j===0?(words.length>1?-6:0):12} fontSize={9} fill="#6E6E73" fontFamily="Inter,sans-serif" fontWeight={500}>{w}</tspan>)}
      </text>);})}
  </svg>);
}

// ─── Utility components ─────────────────────────────────────────────────────────
// Badge and ProgressBar now live in ./ui/Badge.jsx and ./ui/ProgressBar.jsx (Section 11 decomposition).
/** @returns {JSX.Element} Animated loading spinner. */
function Spin(){return <div style={{width:14,height:14,border:"2px solid #E5E5EA",borderTopColor:"#0070F3",borderRadius:"50%",animation:"spin 0.8s linear infinite",flexShrink:0}}/>;}
/** @returns {object} A deterministically selected module for today's date. */
function getDailyMod(){const d=new Date();const idx=(d.getDate()+d.getMonth())%totalMods();let c=0;for(const tier of TIERS){for(const mod of tier.mods){if(c===idx)return{...mod,tier};c++;}}return TIERS[0].mods[0];}


// ─── Daily Engagement Stack ───────────────────────────────────────────────────
/** @param {{role:string,userFn:string,industry:string,xp:number}} props @returns {JSX.Element} Daily AI briefing card. */
function DailyBriefing({role,userFn,industry,xp}){
  const [state,setState]=useState({content:null,loading:false,read:false});
  const today=new Date().toDateString();
  const dayIdx=new Date().getDay();
  const theme=getRoleTheme(role,dayIdx);
  const prompt=PROMPTS_OF_DAY[new Date().getDate()%PROMPTS_OF_DAY.length];
  const storageKey="brief:"+today+(role||"l")+(userFn||"")+(industry||"");

  useEffect(()=>{try{const s=localStorage.getItem(storageKey);if(s)setState(st=>({...st,content:s,read:true}));}catch(e){}},[]);

  async function loadBriefing(){
    setState(s=>({...s,loading:true}));
    try{
      const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",
        headers:{"Content-Type":"application/json","anthropic-version":"2023-06-01"},
        body:JSON.stringify({model:"claude-haiku-4-5-20251001",max_tokens:200,
          system:"You are an AI intelligence briefing for enterprise leaders. Write 2–3 direct sentences. End with: 'Your action today: [one specific action].' No disclaimers. No bullet points.",
          messages:[{role:"user",content:"Today's theme: "+theme+". Write a focused, practical intelligence briefing for a "+(ROLE_DISPLAY[role]||"professional")+" in "+(userFn||"enterprise")+" function, "+(industry||"enterprise")+" sector. Keep it directly relevant to this specific role level. Do not discuss strategy topics for operational roles or basics for executive roles."}]})});
      const d=await res.json();
      const text=d.content?.find(b=>b.type==="text")?.text||"";
      setState(s=>({...s,content:text,loading:false,read:true}));
      try{localStorage.setItem(storageKey,text);}catch(e){}
    }catch(e){setState(s=>({...s,loading:false,content:"Briefing unavailable. Check your connection."}));}
  }

  return(
    <div style={{background:"#FFFFFF",borderRadius:12,boxShadow:"0 1px 3px rgba(0,0,0,0.04),0 4px 12px rgba(0,0,0,0.04)",overflow:"hidden",marginBottom:14}}>
      <div style={{background:"linear-gradient(90deg,#1C1C1E,#2A2A2C)",padding:"10px 16px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <span style={{fontSize:13}}>📡</span>
          <span style={{fontSize:12,fontWeight:700,color:"#FFFFFF"}}>CapabilityOS · Daily Intelligence</span>
          <Badge label={theme} color="#5AC8FA" bg="rgba(90,200,250,0.15)"/>
        </div>
        <div style={{display:"flex",gap:8,alignItems:"center"}}>
          <span style={{fontSize:11,color:"rgba(255,255,255,0.4)"}}>{new Date().toLocaleDateString("en-ZA",{weekday:"short",day:"numeric",month:"short"})}</span>
          {state.read&&<Badge label="Read" color="#34C759" bg="rgba(52,199,89,0.12)"/>}
        </div>
      </div>
      <div style={{padding:"13px 16px"}}>
        {!state.content&&!state.loading&&(
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <div>
              <div style={{fontSize:13,fontWeight:600,color:"#1D1D1F",marginBottom:1}}>Your {theme} briefing is ready</div>
              <div style={{fontSize:12,color:"#AEAEB2"}}>2-min read · Personalised to your role &amp; industry</div>
            </div>
            <button onClick={loadBriefing} style={{padding:"8px 14px",borderRadius:9,border:"none",background:"linear-gradient(135deg,#0070F3,#0055CC)",color:"#FFF",fontSize:12,fontWeight:700,cursor:"pointer"}}>Read →</button>
          </div>
        )}
        {state.loading&&<div style={{display:"flex",alignItems:"center",gap:8,color:"#6E6E73",fontSize:13}}><Spin/>Generating...</div>}
        {state.content&&(
          <div>
            <div style={{fontSize:14,color:"#1D1D1F",lineHeight:1.7,marginBottom:10}}>{state.content}</div>
            <div style={{background:"#F2F2F7",borderRadius:8,padding:"10px 12px",border:"1px solid #E5E5EA"}}>
              <div style={{fontSize:10,fontWeight:700,color:"#7C3AED",textTransform:"uppercase",letterSpacing:".06em",marginBottom:4}}>Prompt of the Day · {prompt.title}</div>
              <div style={{fontSize:11,color:"#6E6E73",lineHeight:1.6,fontFamily:"'SF Mono',Monaco,monospace",marginBottom:6,wordBreak:"break-word"}}>{prompt.template}</div>
              <button onClick={()=>{try{navigator.clipboard.writeText(prompt.template);}catch(e){}}} style={{fontSize:10,fontWeight:600,padding:"3px 8px",borderRadius:5,border:"1px solid #7C3AED40",background:"rgba(124,58,237,0.08)",color:"#7C3AED",cursor:"pointer",fontFamily:"inherit"}}>Copy</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/** @param {{progress:object,completedToday:boolean,onComplete:Function,xp:number}} props @returns {JSX.Element} Daily challenge widget. */
function DailyChallenge({progress,completedToday,onComplete,xp}){
  const dm=getDailyMod();
  const [q,setQ]=useState(null);const [sel,setSel]=useState(null);const [submitted,setSubmitted]=useState(false);const [loading,setLoading]=useState(false);const [earned,setEarned]=useState(0);
  const dayStr=new Date().toLocaleDateString("en-ZA",{weekday:"long",day:"numeric",month:"short"});

  async function start(){
    if(!dm||loading)return;setLoading(true);
    // Same-origin serverless proxy first (keeps the API key server-side —
    // see src/api/quizClient.js for the rationale). Falls back to the local
    // question bank if the endpoint is unreachable or not configured, so
    // the challenge always produces a question either way.
    try{
      const r=await fetch("/api/quiz",{method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({tierId:dm.tier&&dm.tier.id,moduleId:dm.id,moduleTitle:dm.title,moduleSummary:dm.summary})});
      if(!r.ok)throw new Error("Quiz API responded with status "+r.status);
      const data=await r.json();
      const picked=(data.questions||[])[0];
      if(!picked)throw new Error("No questions returned");
      setQ({q:picked.q,opts:picked.options,correct:picked.correct,exp:picked.explanation});
    }catch(e){
      const fb=getFallbackQuiz({moduleTitle:dm.title,count:1})[0];
      if(fb)setQ({q:fb.q,opts:fb.options,correct:fb.correct,exp:fb.explanation});
    }
    setLoading(false);
  }

  function submit(){
    if(sel===null||!q)return;const correct=sel===q.correct;const lp=correct?15:5;
    setSubmitted(true);setEarned(lp);if(onComplete)onComplete(lp);
  }

  if(completedToday)return(
    <div style={{background:"#FFFFFF",borderRadius:12,boxShadow:"0 1px 3px rgba(0,0,0,0.04),0 4px 12px rgba(0,0,0,0.04)",padding:"13px 16px",display:"flex",alignItems:"center",gap:12,marginBottom:14}}>
      <div style={{width:32,height:32,borderRadius:"50%",background:"rgba(52,199,89,0.1)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>✓</div>
      <div style={{flex:1}}>
        <div style={{fontSize:13,fontWeight:600,color:"#34C759"}}>Daily challenge complete</div>
        <div style={{fontSize:12,color:"#AEAEB2"}}>Come back tomorrow to keep your streak alive</div>
      </div>
      <Badge label="+15 LP" color="#34C759" bg="rgba(52,199,89,0.1)"/>
    </div>
  );

  return(
    <div style={{background:"#FFFFFF",borderRadius:12,boxShadow:"0 1px 3px rgba(0,0,0,0.04),0 4px 12px rgba(0,0,0,0.04)",overflow:"hidden",marginBottom:14}}>
      <div style={{background:"rgba(0,112,243,0.05)",padding:"10px 16px",borderBottom:"1px solid #E5E5EA",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div style={{display:"flex",alignItems:"center",gap:7}}><span>⚡</span><span style={{fontSize:13,fontWeight:700,color:"#1D1D1F"}}>Daily Challenge</span><Badge label="+15 LP" color="#0070F3" bg="#EBF4FF"/></div>
        <span style={{fontSize:11,color:"#AEAEB2"}}>{dayStr}</span>
      </div>
      <div style={{padding:"13px 16px"}}>
        {!q&&!loading&&(<div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div><div style={{fontSize:13,fontWeight:600,color:"#1D1D1F",marginBottom:1}}>One question. Thirty seconds.</div>
          <div style={{fontSize:12,color:"#AEAEB2"}}>From: {dm?.title?.slice(0,40)}{dm?.title?.length>40?"…":""}</div></div>
          <button onClick={start} style={{padding:"8px 16px",borderRadius:9,border:"none",background:"linear-gradient(135deg,#0070F3,#0055CC)",color:"#FFF",fontSize:13,fontWeight:700,cursor:"pointer"}}>Start →</button>
        </div>)}
        {loading&&<div style={{display:"flex",gap:8,alignItems:"center",color:"#6E6E73",fontSize:13}}><Spin/>Generating...</div>}
        {q&&(<>
          <div style={{fontSize:14,fontWeight:600,color:"#1D1D1F",marginBottom:10,lineHeight:1.5}}>{q.q}</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6,marginBottom:10}}>
            {(q.opts||[]).map((opt,i)=>{
              let bg="#FFFFFF",bd="#E5E5EA",cl="#3A3A3C";
              if(submitted){if(i===q.correct){bg="rgba(52,199,89,0.1)";bd="#34C759";cl="#34C759";}else if(sel===i&&i!==q.correct){bg="rgba(255,59,48,0.1)";bd="#FF3B30";cl="#FF3B30";}}
              else if(sel===i){bg="#EBF4FF";bd="#0070F3";cl="#0070F3";}
              return <button key={i} disabled={submitted} onClick={()=>setSel(i)} style={{padding:"9px 11px",border:"1.5px solid "+bd,borderRadius:9,background:bg,color:cl,fontSize:12,fontWeight:500,cursor:submitted?"default":"pointer",textAlign:"left",fontFamily:"inherit"}}>{opt}</button>;
            })}
          </div>
          {submitted&&q.exp&&<div style={{fontSize:12,color:"#6E6E73",padding:"7px 10px",background:"#F2F2F7",borderRadius:7,lineHeight:1.55,marginBottom:8}}>{q.exp}</div>}
          {submitted?<span style={{fontSize:13,fontWeight:600,color:sel===q.correct?"#34C759":"#FF9500"}}>
            {sel===q.correct?"Correct! ":"Incorrect — "}+{earned} LP earned</span>
          :<button onClick={submit} disabled={sel===null} style={{padding:"8px 16px",borderRadius:9,border:"none",background:sel!==null?"linear-gradient(135deg,#0070F3,#0055CC)":"#E5E5EA",color:sel!==null?"#FFF":"#AEAEB2",fontSize:13,fontWeight:700,cursor:sel!==null?"pointer":"not-allowed"}}>Submit</button>}
        </>)}
      </div>
    </div>
  );
}


// ─── Storage helpers ──────────────────────────────────────────────────────────

// ─── XP / Level helpers ──────────────────────────────────────────────────────


// ─── Auth screen — CapabilityOS ──────────────────────────────────────────────
/** @param {{onLogin:Function}} props - Callback invoked with user record on successful login/register. @returns {JSX.Element} Login/registration screen. */
function AuthScreen({onLogin}){
  const saved=loadProfile();
  const [name,setName]=useState(saved?.name||"");
  const [role,setRole]=useState(saved?.role||"");
  const [ind,setInd]=useState(saved?.industry||"");
  const [fn,setFn]=useState(saved?.fn||"");
  const [subFn,setSubFn]=useState(saved?.subFn||"");
  const [accessCode,setAccessCode]=useState("");
  const [codeError,setCodeError]=useState("");
  const [loginAttempts,setLoginAttempts]=useState(0);
  const [twoFAInput,setTwoFAInput]=useState("");
  const [twoFAError,setTwoFAError]=useState("");
  const [generatedOTP,setGeneratedOTP]=useState("");
  const isReturning=!!(saved?.name&&saved?.role);
  const isAdmin=role==="facilitator";
  const [step,setStep]=useState(isReturning&&!isAdmin?3:1);
  const ok1=name.trim().length>0&&role.length>0;
  const selTier=GARTNER_TIERS.find(t=>t.id===role);

  function handleContinue(){
    if(loginAttempts>=MAX_LOGIN_ATTEMPTS){setCodeError("Too many attempts. Contact your administrator.");return;}
    if(step===1){if(ok1)setStep(isAdmin?3:2);}
    else if(step===2){setStep(3);}
    else if(step===3){
      if(isAdmin){
        if(accessCode.trim()!==ADMIN_CODE){setLoginAttempts(a=>a+1);setCodeError("Invalid administrator code. ("+(loginAttempts+1)+"/"+MAX_LOGIN_ATTEMPTS+")");return;}
      } else {
        if(accessCode.trim()&&!VALID_ORG_CODES.map(x=>x.toLowerCase()).includes(accessCode.trim().toLowerCase())){
          setLoginAttempts(a=>a+1);setCodeError("Invalid access code. ("+(loginAttempts+1)+"/"+MAX_LOGIN_ATTEMPTS+")");return;
        }
      }
      const otp=Math.floor(100000+Math.random()*900000).toString();
      setGeneratedOTP(otp);
      setStep(4);
    }
    else if(step===4){
      if(twoFAInput.trim()!==generatedOTP){setLoginAttempts(a=>a+1);setTwoFAError("Incorrect code. ("+(loginAttempts+1)+"/"+MAX_LOGIN_ATTEMPTS+")");return;}
      secLog("LOGIN",{role,ts:new Date().toISOString()});
      saveProfile({name:name.trim(),role,industry:ind,fn,subFn,savedAt:Date.now()});
      onLogin(name.trim(),role,ind,fn,subFn);
    }
  }

  const pillars=[
    {icon:"◎",c:"#5AC8FA",label:"Assess Readiness",    desc:"8-dimension capability diagnostic"},
    {icon:"◈",c:"#7C3AED",label:"Develop Capability",  desc:"Role-based AI learning journeys"},
    {icon:"⬡",c:"#E8B84B",label:"Govern Responsibly",  desc:"AI ethics, POPIA, compliance"},
    {icon:"◊",c:"#34C759",label:"Measure Impact",       desc:"Executive workforce intelligence"},
    {icon:"◉",c:"#0070F3",label:"Accelerate Adoption",  desc:"From literacy to transformation"},
  ];

  const SECURITY_BADGES=[
    {l:"POPIA Compliant",c:"#34C759"},{l:"ISO 27001 Aligned",c:"#5AC8FA"},
    {l:"GDPR Ready",c:"#0070F3"},{l:"SOC 2 Type II",c:"#7C3AED"},
    {l:"Enterprise MFA",c:"#E8B84B"},{l:"256-bit Encrypted",c:"#FF9500"},
  ];

  return(
    <div style={{minHeight:"100vh",display:"flex",background:"linear-gradient(160deg,#04080F 0%,#060E1E 50%,#050B18 100%)",fontFamily:"'DM Sans',-apple-system,sans-serif"}}>
      {/* ── Left panel ── */}
      <div className="mob-hide" style={{flex:1,display:"flex",flexDirection:"column",justifyContent:"center",padding:"48px 56px",maxWidth:520,borderRight:"1px solid rgba(255,255,255,0.04)",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",inset:0,backgroundImage:"linear-gradient(rgba(0,102,255,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(0,102,255,0.03) 1px,transparent 1px)",backgroundSize:"40px 40px",pointerEvents:"none"}}/>
        <div style={{position:"absolute",top:-100,left:-80,width:380,height:380,borderRadius:"50%",background:"radial-gradient(circle,rgba(0,102,255,0.1) 0%,transparent 70%)",pointerEvents:"none"}}/>
        <div style={{position:"relative"}}>
          <div style={{marginBottom:32}}>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:6}}>
              <div style={{width:32,height:32,borderRadius:8,background:"linear-gradient(135deg,#0052FF,#0085FF)",display:"flex",alignItems:"center",justifyContent:"center"}}>
                <svg width="16" height="16" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="7" stroke="rgba(255,255,255,0.9)" strokeWidth="1.5" fill="none"/><circle cx="9" cy="9" r="3" fill="rgba(255,255,255,0.9)"/><line x1="9" y1="2" x2="9" y2="16" stroke="rgba(255,255,255,0.35)" strokeWidth="1"/><line x1="2" y1="9" x2="16" y2="9" stroke="rgba(255,255,255,0.35)" strokeWidth="1"/></svg>
              </div>
              <div>
                <div style={{fontSize:16,fontWeight:800,color:"#FFFFFF",letterSpacing:"-0.03em"}}>CapabilityOS</div>
                <div style={{fontSize:9,fontWeight:600,color:"rgba(255,255,255,0.3)",textTransform:"uppercase",letterSpacing:".12em"}}>by Digilytics Co.</div>
              </div>
            </div>
          </div>
          <div style={{fontSize:10,fontWeight:700,color:"rgba(0,150,255,0.7)",textTransform:"uppercase",letterSpacing:".14em",marginBottom:10}}>Workforce Intelligence Platform</div>
          <div style={{fontSize:25,fontWeight:800,color:"#FFFFFF",letterSpacing:"-0.04em",lineHeight:1.15,marginBottom:10}}>Not a skills audit.<br/>Not an LMS.<br/><span style={{color:"#5AB4FF"}}>A living capability<br/>intelligence platform.</span></div>
          <div style={{fontSize:12,color:"rgba(255,255,255,0.4)",lineHeight:1.75,marginBottom:16}}>CapabilityOS continuously assesses, develops and tracks AI readiness across your entire workforce — by role, function and industry.</div>
          {/* What makes it digitalised, not digitised */}
          <div style={{marginBottom:12}}>
            <div style={{fontSize:9,fontWeight:700,color:"rgba(0,180,255,0.5)",textTransform:"uppercase",letterSpacing:".12em",marginBottom:8}}>Why this is different</div>
            {[
              {icon:"⬡",c:"#5AB4FF",label:"Continuous intelligence",desc:"Your capability profile updates in real time — not once a year"},
              {icon:"◈",c:"#7C3AED",label:"Adaptive assessment",desc:"AI generates questions specific to your role, industry and function"},
              {icon:"◎",c:"#34C759",label:"Personalised journeys",desc:"Netflix-style recommendations adapt to your progress and gaps"},
              {icon:"◊",c:"#FF9500",label:"Organisational intelligence",desc:"Executives see workforce readiness across the entire organisation"},
              {icon:"◉",c:"#E8B84B",label:"Measurable transformation",desc:"Track capability improvement from baseline to target — with evidence"},
            ].map(function(p,i){return(
              <div key={i} style={{display:"flex",alignItems:"flex-start",gap:10,padding:"8px 12px",borderRadius:8,background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.05)",marginBottom:4}}>
                <span style={{fontSize:12,color:p.c,flexShrink:0,marginTop:1}}>{p.icon}</span>
                <div>
                  <div style={{fontSize:11,fontWeight:700,color:"rgba(255,255,255,0.85)"}}>{p.label}</div>
                  <div style={{fontSize:10,color:"rgba(255,255,255,0.3)",lineHeight:1.4,marginTop:1}}>{p.desc}</div>
                </div>
              </div>
            );})}
          </div>
          {/* Security badges */}
          <div style={{marginTop:20,borderTop:"1px solid rgba(255,255,255,0.06)",paddingTop:14}}>
            <div style={{fontSize:9,fontWeight:700,color:"rgba(255,255,255,0.2)",textTransform:"uppercase",letterSpacing:".1em",marginBottom:8}}>Enterprise Security</div>
            <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
              {SECURITY_BADGES.map((b,i)=><span key={i} style={{fontSize:9,fontWeight:700,padding:"2px 8px",borderRadius:10,background:b.c+"15",color:b.c,border:"1px solid "+b.c+"30"}}>{b.l}</span>)}
            </div>
          </div>
        </div>
      </div>

      {/* ── Right panel ── */}
      <div style={{width:"min(480px,100vw)",display:"flex",alignItems:"center",justifyContent:"center",padding:"clamp(12px,4vw,24px)",flexShrink:0,boxSizing:"border-box"}}>
        <div style={{width:"100%",background:"rgba(255,255,255,0.97)",borderRadius:16,boxShadow:"0 30px 90px rgba(0,0,0,0.5)",overflow:"hidden"}}>
          {/* Card header */}
          <div style={{padding:"18px 24px 14px",background:"linear-gradient(135deg,#060E1E,#0A1832)"}}>
            <div style={{fontSize:15,fontWeight:800,color:"#FFFFFF",letterSpacing:"-0.03em",marginBottom:2}}>
              {step===1?"Let's Understand Your Role":step===2?"Personalise Your Journey":step===3?"Organisation Access":step===4?"Two-Factor Verification":""}
            </div>
            <div style={{fontSize:11,color:"rgba(255,255,255,0.4)"}}>
              {step===1?"Select your role to begin":step===2?"Industry and function personalise your content":step===3?"Enter your organisation access code":step===4?"Enter the verification code sent to your device":""}
            </div>
            <div style={{display:"flex",gap:3,marginTop:12}}>
              {[1,2,3,4].map(s=><div key={s} style={{height:3,flex:1,borderRadius:2,background:s<=step?"#5AC8FA":"rgba(255,255,255,0.12)",transition:"background .3s"}}/>)}
            </div>
          </div>

          <div style={{padding:"16px 24px 20px"}}>
            {/* Returning user banner */}
            {isReturning&&step===3&&!isAdmin&&(
              <div style={{padding:"10px 13px",background:"rgba(0,112,243,0.07)",border:"1.5px solid rgba(0,112,243,0.2)",borderRadius:9,marginBottom:12}}>
                <div style={{fontSize:12,fontWeight:700,color:"#0070F3",marginBottom:2}}>👋 Welcome back, {name}</div>
                <div style={{fontSize:11,color:"#6E6E73"}}>{selTier?.label||role}{ind?" · "+ind:""}{fn?" · "+fn:""}</div>
                <button onClick={()=>{clearProfile();setName("");setRole("");setInd("");setFn("");setStep(1);setAccessCode("");}}
                  style={{fontSize:10,color:"#AEAEB2",background:"none",border:"none",cursor:"pointer",textDecoration:"underline",padding:"3px 0 0",fontFamily:"inherit"}}>
                  Not you? Switch profile
                </button>
              </div>
            )}

            {/* STEP 1 */}
            {step===1&&(<>
              <div style={{marginBottom:12}}>
                <div style={{fontSize:11,fontWeight:600,color:"#3A3A3C",marginBottom:5}}>Full name</div>
                <input value={name} onChange={e=>setName(e.target.value)} onKeyDown={e=>e.key==="Enter"&&ok1&&handleContinue()} placeholder="Enter your full name" autoFocus
                  style={{width:"100%",padding:"9px 12px",border:"1.5px solid #E5E5EA",borderRadius:9,fontSize:14,color:"#1D1D1F",outline:"none",fontFamily:"inherit",boxSizing:"border-box",fontSize:"16px"}}
                  onFocus={e=>e.target.style.borderColor="#0070F3"} onBlur={e=>e.target.style.borderColor="#E5E5EA"}/>
              </div>
              <div style={{marginBottom:4}}>
                <div style={{fontSize:11,fontWeight:600,color:"#3A3A3C",marginBottom:3}}>Your role</div>
                <div style={{fontSize:10,color:"#AEAEB2",marginBottom:8}}>Determines your learning pathway, assessments, and dashboards.</div>
                <div style={{display:"flex",flexDirection:"column",gap:5}}>
                  {GARTNER_TIERS.map(t=>(
                    <div key={t.id} onClick={()=>setRole(t.id)} role="button" tabIndex={0} onKeyDown={e=>{if(e.key==="Enter"||e.key===" ")setRole(t.id);}}
                      style={{padding:"8px 12px",borderRadius:9,cursor:"pointer",display:"flex",alignItems:"center",gap:10,
                        border:"1.5px solid "+(role===t.id?(t.color||"#0070F3"):"#E5E5EA"),
                        background:role===t.id?(t.color||"#0070F3")+"10":"#FAFAFA",transition:"all .12s"}}>
                      <span style={{fontSize:14,flexShrink:0,color:role===t.id?(t.color||"#0070F3"):"rgba(0,0,0,0.25)"}}>{t.icon}</span>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{fontSize:13,fontWeight:700,color:role===t.id?(t.color||"#0070F3"):"#1D1D1F"}}>{t.label}</div>
                        <div style={{fontSize:10,color:"#AEAEB2",marginTop:1}}>{t.tier}</div>
                      </div>
                      {role===t.id&&<div style={{width:7,height:7,borderRadius:"50%",background:t.color||"#0070F3",flexShrink:0}}/>}
                    </div>
                  ))}
                </div>
              </div>
            </>)}

            {/* STEP 2 */}
            {step===2&&!isAdmin&&(<>
              <div style={{marginBottom:12}}>
                <div style={{fontSize:11,fontWeight:600,color:"#3A3A3C",marginBottom:5}}>Your industry <span style={{fontSize:11,color:"#AEAEB2",fontWeight:400}}>— optional</span></div>
                <select value={ind} onChange={e=>setInd(e.target.value)} className="cap-select"
                  style={{width:"100%",padding:"9px 12px",border:"1.5px solid #E5E5EA",borderRadius:9,fontSize:"16px",color:ind?"#1D1D1F":"#AEAEB2",background:"#FAFAFA",fontFamily:"inherit",cursor:"pointer",outline:"none",boxSizing:"border-box"}}>
                  <option value="">Select your industry</option>
                  {INDUSTRIES.map(i=><option key={i} value={i}>{i}</option>)}
                </select>
              </div>
              <div style={{marginBottom:12}}>
                <div style={{fontSize:11,fontWeight:600,color:"#3A3A3C",marginBottom:5}}>Your function <span style={{fontSize:11,color:"#AEAEB2",fontWeight:400}}>— optional</span></div>
                <select value={fn} onChange={e=>setFn(e.target.value)} className="cap-select"
                  style={{width:"100%",padding:"9px 12px",border:"1.5px solid #E5E5EA",borderRadius:9,fontSize:"16px",color:fn?"#1D1D1F":"#AEAEB2",background:"#FAFAFA",fontFamily:"inherit",cursor:"pointer",outline:"none",boxSizing:"border-box"}}>
                  <option value="">Select your function</option>
                  {MGMT_FUNCTIONS.map(function(f){return <option key={f} value={f}>{f}</option>;})}
                </select>
              </div>
              <div style={{fontSize:11,color:"#AEAEB2",marginBottom:4}}>These personalise your assessment and learning. Update anytime.</div>
                {fn&&ROLE_SUBFUNCTIONS[fn]&&(
                  <div style={{marginTop:10}}>
                    <div style={{fontSize:11,fontWeight:600,color:"#3A3A3C",marginBottom:5}}>Your specific role <span style={{fontSize:11,color:"#AEAEB2",fontWeight:400}}>— optional</span></div>
                    <select value={subFn} onChange={e=>setSubFn(e.target.value)}
                      style={{width:"100%",padding:"9px 12px",border:"1.5px solid #E5E5EA",borderRadius:9,fontSize:"16px",color:subFn?"#1D1D1F":"#AEAEB2",background:"#FAFAFA",fontFamily:"inherit",cursor:"pointer",outline:"none",boxSizing:"border-box"}}>
                      <option value="">Select your specific role within {fn}</option>
                      {(ROLE_SUBFUNCTIONS[fn]||[]).map(function(sf){return <option key={sf} value={sf}>{sf}</option>;})}
                    </select>
                  </div>
                )}
            </>)}

            {/* STEP 3: Access code */}
            {step===3&&(<>
              {isAdmin&&(
                <div style={{padding:"12px 14px",background:"rgba(255,149,0,0.06)",border:"1.5px solid rgba(255,149,0,0.2)",borderRadius:10,marginBottom:12}}>
                  <div style={{fontSize:11,fontWeight:700,color:"#FF9500",marginBottom:2}}>🔐 Administrator Access Required</div>
                  <div style={{fontSize:11,color:"#6E6E73",lineHeight:1.5}}>Enter the platform administrator access code issued by Digilytics Co.</div>
                </div>
              )}
              <div style={{marginBottom:4}}>
                <div style={{fontSize:11,fontWeight:600,color:"#3A3A3C",marginBottom:5}}>{isAdmin?"Platform Access Code":"Organisation Access Code"} <span style={{fontSize:10,color:"#AEAEB2",fontWeight:400}}>— provided by your administrator</span></div>
                <input type="password" value={accessCode} onChange={e=>{setAccessCode(e.target.value);setCodeError("");}} onKeyDown={e=>e.key==="Enter"&&handleContinue()}
                  placeholder={isAdmin?"Enter administrator code":"Enter your organisation code"}
                  style={{width:"100%",padding:"9px 12px",border:"1.5px solid "+(codeError?"#FF3B30":"#E5E5EA"),borderRadius:9,fontSize:"16px",color:"#1D1D1F",outline:"none",fontFamily:"monospace",boxSizing:"border-box",letterSpacing:".05em"}}
                  onFocus={e=>e.target.style.borderColor=codeError?"#FF3B30":"#0070F3"} onBlur={e=>e.target.style.borderColor=codeError?"#FF3B30":"#E5E5EA"}/>
                {codeError&&<div style={{fontSize:11,color:"#FF3B30",marginTop:4}}>⚠ {codeError}</div>}
                <div style={{fontSize:10,color:"#AEAEB2",marginTop:5}}>
                  {isAdmin?"Contact hello@digilyticsco.com to request credentials.":"Demo code: ORG-2025 · Contact your admin for your organisation's code."}
                </div>
              </div>
            </>)}

            {/* STEP 4: 2FA */}
            {step===4&&(<>
              <div style={{padding:"12px 14px",background:"rgba(0,112,243,0.06)",border:"1.5px solid rgba(0,112,243,0.2)",borderRadius:10,marginBottom:14}}>
                <div style={{fontSize:12,fontWeight:700,color:"#0070F3",marginBottom:3}}>🔒 Two-Factor Verification</div>
                <div style={{fontSize:11,color:"#6E6E73",lineHeight:1.5,marginBottom:8}}>In production, this code is sent to your registered device or authenticator app.</div>
                <div style={{padding:"7px 11px",background:"#FFF9E6",border:"1px solid rgba(232,184,75,0.4)",borderRadius:7,fontSize:11,color:"#6E4F00"}}>
                  <strong>Demo mode — your code:</strong> <code style={{fontWeight:800,letterSpacing:".1em",fontSize:14}}>{generatedOTP}</code>
                </div>
              </div>
              <div style={{marginBottom:4}}>
                <div style={{fontSize:11,fontWeight:600,color:"#3A3A3C",marginBottom:5}}>6-digit verification code</div>
                <input value={twoFAInput} onChange={e=>{setTwoFAInput(e.target.value.replace(/\D/g,"").slice(0,6));setTwoFAError("");}} onKeyDown={e=>e.key==="Enter"&&handleContinue()}
                  placeholder="000000" maxLength={6} inputMode="numeric"
                  style={{width:"100%",padding:"11px 12px",border:"1.5px solid "+(twoFAError?"#FF3B30":"#E5E5EA"),borderRadius:9,fontSize:"20px",letterSpacing:".3em",textAlign:"center",color:"#1D1D1F",fontFamily:"monospace",outline:"none",boxSizing:"border-box"}}
                  onFocus={e=>e.target.style.borderColor=twoFAError?"#FF3B30":"#0070F3"} onBlur={e=>e.target.style.borderColor=twoFAError?"#FF3B30":"#E5E5EA"}/>
                {twoFAError&&<div style={{fontSize:11,color:"#FF3B30",marginTop:4}}>⚠ {twoFAError}</div>}
                <div style={{fontSize:10,color:"#AEAEB2",marginTop:5,display:"flex",justifyContent:"space-between"}}>
                  <span>Code expires in 5 minutes.</span>
                  <span style={{color:"#0070F3",cursor:"pointer"}} role="button" tabIndex={0} onClick={()=>{const o=Math.floor(100000+Math.random()*900000).toString();setGeneratedOTP(o);setTwoFAInput("");}} onKeyDown={e=>{if(e.key==="Enter"||e.key===" "){const o=Math.floor(100000+Math.random()*900000).toString();setGeneratedOTP(o);setTwoFAInput("");}}}>Resend code</span>
                </div>
              </div>
            </>)}

            {/* CTA */}
            <div style={{display:"flex",gap:8,marginTop:14}}>
              {step>1&&<button onClick={()=>{setStep(s=>s-1);setCodeError("");setTwoFAError("");}} style={{width:50,padding:"10px 0",borderRadius:9,border:"1.5px solid #E5E5EA",background:"transparent",fontSize:13,fontWeight:600,color:"#3A3A3C",cursor:"pointer",fontFamily:"inherit"}}>←</button>}
              <button onClick={handleContinue} disabled={step===1&&!ok1}
                style={{flex:1,padding:"11px",borderRadius:9,border:"none",
                  background:(step===1&&!ok1)?"#E5E5EA":(selTier?.color||"#0052FF"),
                  color:(step===1&&!ok1)?"#AEAEB2":"#FFFFFF",
                  fontSize:14,fontWeight:700,cursor:(step===1&&!ok1)?"not-allowed":"pointer",
                  fontFamily:"inherit",boxShadow:(step===1&&!ok1)?"none":"0 4px 16px rgba(0,0,0,0.2)",transition:"all .15s"}}>
                {step===1?"Continue →":step===2?"Continue →":step===3?"Verify Identity →":isAdmin?"Enter Admin Portal →":"Enter CapabilityOS →"}
              </button>
            </div>
            {loginAttempts>=3&&loginAttempts<MAX_LOGIN_ATTEMPTS&&(
              <div style={{fontSize:10,color:"#FF9500",textAlign:"center",marginTop:6}}>⚠ {MAX_LOGIN_ATTEMPTS-loginAttempts} attempt{MAX_LOGIN_ATTEMPTS-loginAttempts!==1?"s":""} remaining before lockout.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


// Toast notification now lives in ./ui/Toast.jsx (Section 11 decomposition).


// ─── Sidebar ─────────────────────────────────────────────────────────────────
/** @param {{role:string,view:string,onNav:Function,user:string,xp:number,industry:string,userFn:string}} props @returns {JSX.Element} Learner sidebar navigation. */
function Sidebar({role,view,onNav,user,xp,industry,userFn}){
  const lv=getLv(xp);
  const mainNav=[
    {id:"dashboard",Icon:Home,label:"Home"},
    {id:"learning",Icon:BookOpen,label:"My Learning"},
    {id:"assess",Icon:BarChart3,label:"Capability Check"},
    {id:"missions",Icon:Zap,label:"My Challenges"},
    {id:"usecases",Icon:TrendingUp,label:"AI at Work"},
    {id:"promptlab",Icon:MessageSquare,label:"AI Toolkit"},
    {id:"achievements",Icon:Award,label:"My Progress"},
    {id:"disruption",Icon:Shield,label:"Role Disruption"},
    {id:"skillsgap",Icon:Target,label:"Skills Gap"},
  ];
  return(
    <aside className="sidebar-mob" style={{width:208,background:"#1C1C1E",display:"flex",flexDirection:"column",height:"100vh",flexShrink:0,borderRight:"1px solid rgba(255,255,255,0.06)"}}>
      <div className="sidebar-logo" style={{padding:"20px 16px 16px",borderBottom:"1px solid rgba(255,255,255,0.06)"}}>
        <div style={{fontSize:9,fontWeight:700,color:"rgba(255,255,255,0.25)",textTransform:"uppercase",letterSpacing:".13em",marginBottom:3}}>by Digilytics Co.</div>
        <div style={{fontSize:15,fontWeight:800,color:"#FFFFFF",letterSpacing:"-0.03em"}}>CapabilityOS</div>
        <div style={{fontSize:10,fontWeight:600,color:"#5AC8FA",marginTop:7,padding:"2px 8px",borderRadius:5,background:"rgba(0,112,243,0.16)",display:"inline-block"}}>{ROLE_DISPLAY[role]||"Learner"}</div>
      </div>
      <nav style={{flex:1,padding:"8px 6px",overflowY:"auto"}}>
        <div style={{fontSize:10,fontWeight:600,color:"rgba(255,255,255,0.2)",textTransform:"uppercase",letterSpacing:".09em",padding:"8px 10px 4px"}}>LEARN</div>
        {mainNav.map(({id,Icon,label})=>{
          const active=view===id;
          return(<div key={id} onClick={()=>onNav(id)} role="button" tabIndex={0} onKeyDown={e=>{if(e.key==="Enter"||e.key===" ")onNav(id);}} style={{display:"flex",alignItems:"center",gap:9,padding:"8px 10px",marginBottom:1,borderRadius:8,background:active?"rgba(0,112,243,0.16)":"transparent",borderLeft:active?"2px solid #5AC8FA":"2px solid transparent",color:active?"#5AC8FA":"rgba(255,255,255,0.5)",cursor:"pointer",fontSize:13,fontWeight:active?600:400}}>
            <Icon size={15}/>{label}
            {active&&<div style={{marginLeft:"auto",width:5,height:5,borderRadius:"50%",background:"#5AC8FA"}}/>}
          </div>);
        })}
      </nav>
      <div className="sidebar-user" style={{padding:"12px 16px",borderTop:"1px solid rgba(255,255,255,0.06)"}}>
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
          <div style={{width:28,height:28,borderRadius:"50%",background:lv.color+"20",border:"1.5px solid "+lv.color,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:lv.color,flexShrink:0}}>{user?.name?.[0]?.toUpperCase()||"?"}</div>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontSize:13,fontWeight:600,color:"#FFFFFF",letterSpacing:"-0.01em",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{user?.name||"Learner"}</div>
            <div style={{fontSize:11,color:"rgba(255,255,255,0.35)"}}>{ROLE_DISPLAY[role]||"Learner"}{userFn?" · "+userFn.split(" ")[0]:""}</div>
          </div>
        </div>
        <div style={{display:"flex",justifyContent:"space-between",fontSize:11,color:"rgba(255,255,255,0.3)"}}>
          <span>{lv.name}</span><span>{xp.toLocaleString()} LP</span>
        </div>
      </div>
      <div style={{padding:"8px 14px 10px",borderTop:"1px solid rgba(255,255,255,0.05)"}}>
        <button onClick={()=>{clearProfile();window.location.reload?.();}} style={{fontSize:10,color:"rgba(255,255,255,0.25)",background:"none",border:"none",cursor:"pointer",fontFamily:"inherit",width:"100%",textAlign:"left",padding:"3px 0",transition:"color .15s"}} onMouseEnter={e=>e.target.style.color="rgba(255,255,255,0.5)"} onMouseLeave={e=>e.target.style.color="rgba(255,255,255,0.25)"}>
          ↩ Sign out / switch profile
        </button>
      </div>
    </aside>
  );
}

// ─── Header ───────────────────────────────────────────────────────────────────
/** @param {{title:string,xp:number,streak:number,onNav:Function}} props @returns {JSX.Element} Top header bar for learner portal. */
function Header({title,xp,streak,onNav}){
  const lv=getLv(xp),nx=getNext(xp),pct=getLvPct(xp);
  return(
    <div style={{height:52,background:"rgba(242,242,247,0.9)",backdropFilter:"blur(20px)",borderBottom:"1px solid rgba(0,0,0,0.06)",padding:"0 24px",display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0,position:"sticky",top:0,zIndex:10}}>
      <div style={{fontSize:16,fontWeight:700,color:"#1D1D1F",letterSpacing:"-0.02em"}}>{title}</div>
      <div style={{display:"flex",alignItems:"center",gap:12}}>
        {streak>0&&<div style={{display:"flex",alignItems:"center",gap:4}}>
          <span style={{fontSize:13,color:"#FF6B35",fontWeight:700}}>🔥{streak}</span>
          {streak>=7&&<span style={{fontSize:10,fontWeight:700,color:"#FF9500",background:"rgba(255,149,0,0.15)",padding:"1px 5px",borderRadius:4}}>{streak>=14?"3×":"2×"}</span>}
        </div>}
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <div style={{width:100}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:2,fontSize:10,color:"#AEAEB2"}}>
              <span>{lv.name}</span><span>{xp.toLocaleString()} LP</span>
            </div>
            <div style={{height:3,background:"#E5E5EA",borderRadius:2,overflow:"hidden"}}><div className="prog-bar" style={{width:pct+"%",height:"100%",background:lv.color}}/></div>
          </div>
          <div style={{width:30,height:30,borderRadius:"50%",background:lv.color+"20",border:"2px solid "+lv.color,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:lv.color}}>{lv.n}</div>
        </div>
      </div>
    </div>
  );
}

// ─── Learner Dashboard ──────────────────────────────────────────────────────
/** @param {{user:string,userFn:string,xp:number,badges:string[],streak:number,board:object[],progress:object,industry:string,onNav:Function,dailyDone:boolean,onDailyComplete:Function}} props @returns {JSX.Element} Learner dashboard home. */
function LDashboard({user,userFn,xp,badges,streak,board,progress,industry,onNav,dailyDone,onDailyComplete}){
  const lv=getLv(xp),nx=getNext(xp),pct=getLvPct(xp);
  const tm=totalMods(),done=Object.keys(progress).length;
  const earnedBadges=BDEFS.filter(b=>badges.includes(b.id));
  // "Continue" — find last incomplete module
  let continueItem=null;
  for(const tier of TIERS){for(const mod of tier.mods){if(!progress[tier.id+":"+mod.id]){continueItem={tier,mod};break;}}if(continueItem)break;}
  // Certificate countdown
  const certCountdowns=TIERS.map(t=>{const left=t.mods.filter(m=>!progress[t.id+":"+m.id]).length;return{tier:t,left};}).filter(x=>x.left>0&&x.left<=3);
  const chartData=TIERS.map(t=>({name:t.level,done:t.mods.filter(m=>progress[t.id+":"+m.id]).length,total:t.mods.length,color:t.color}));

  return(
    <div className="fade-in" style={{overflowY:"auto",flex:1,background:T.page}}>
      <div style={{padding:"16px 20px"}}>
        <RecommendationRail role={user?.role} industry={industry} userFn={userFn} progress={progress} xp={xp} badges={badges} onNav={onNav}/>

      {/* Welcome row */}
      <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:20}}>
        <div>
          <div style={{fontSize:21,fontWeight:700,color:T.t1,marginBottom:3}}>Welcome back, {user?.name?.split(" ")[0]}.</div>
          <div style={{fontSize:13,color:T.t3}}>{industry||"All industries"} · {done} of {tm} modules complete</div>
        </div>
        {continueItem&&(
          <button onClick={()=>onNav("mod_"+continueItem.tier.id+"_"+continueItem.mod.id)} className="wd-btn" style={{display:"flex",alignItems:"center",gap:6,padding:"8px 16px",borderRadius:4,border:"none",background:T.brand,color:"#FFFFFF",fontSize:13,fontWeight:500,cursor:"pointer",flexShrink:0}}>
            <BookOpen size={13}/>Continue learning
          </button>
        )}
      </div>

      {/* KPI row */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:16}}>
        {[
          {v:xp.toLocaleString(),l:"Learning Points",s:nx?(nx.min-xp).toLocaleString()+" LP to "+nx.name:"Max level",c:T.brand},
          {v:done+"/"+tm,l:"Modules",s:Math.round(done/tm*100)+"% complete",c:T.t1},
          {v:lv.name,l:"Level",s:"Level "+lv.n+" of "+LEVELS.length,c:lv.color},
          {v:streak>0?streak+"d":"-",l:"Streak",s:streak>0?"Keep it going":"Start today",c:streak>2?T.fire:T.t4},
        ].map((s,i)=>(
          <div key={i} style={{background:T.surface,border:"1px solid "+T.b1,borderRadius:6,padding:"14px 16px"}}>
            <div style={{fontSize:20,fontWeight:700,color:s.c,marginBottom:2}}>{s.v}</div>
            <div style={{fontSize:12,fontWeight:500,color:T.t1,marginBottom:1}}>{s.l}</div>
            <div style={{fontSize:11,color:T.t4}}>{s.s}</div>
          </div>
        ))}
      </div>

      {/* Level bar */}
      <div style={{background:T.surface,border:"1px solid "+T.b1,borderRadius:6,padding:"14px 18px",marginBottom:16}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
          <div style={{fontSize:13,fontWeight:500,color:T.t1}}>Level Progress — <span style={{color:lv.color}}>{lv.name}</span></div>
          <div style={{fontSize:12,color:T.t3}}>{pct}%{nx?" toward "+nx.name:""}</div>
        </div>
        <ProgressBar pct={pct} color={lv.color} h={7}/>
        <div style={{display:"flex",justifyContent:"space-between",marginTop:5,fontSize:11,color:T.t4}}>
          <span>{xp.toLocaleString()} LP</span>{nx&&<span>{nx.min.toLocaleString()} LP</span>}
        </div>
      </div>

      {/* Certificate countdown alerts */}
      {certCountdowns.map(({tier,left})=>(
        <div key={tier.id} onClick={()=>onNav("tier_"+tier.id)} role="button" tabIndex={0} onKeyDown={e=>{if(e.key==="Enter"||e.key===" ")onNav("tier_"+tier.id);}} style={{background:tier.colorLight,border:"1px solid "+tier.color+"40",borderRadius:6,padding:"10px 16px",marginBottom:10,display:"flex",alignItems:"center",justifyContent:"space-between",cursor:"pointer"}}>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <Award size={14} color={tier.color}/>
            <span style={{fontSize:13,fontWeight:500,color:tier.color}}>{left===1?"1 module":""+left+" modules"} until your <strong>{tier.name}</strong> certificate</span>
          </div>
          <ChevronRight size={13} color={tier.color}/>
        </div>
      ))}

      {/* Daily challenge */}
      <div style={{marginBottom:16}}>
        <DailyBriefing role={user?.role} userFn={userFn} industry={industry} xp={xp}/>
      <DailyChallenge progress={progress} completedToday={dailyDone} onComplete={onDailyComplete} xp={xp}/>
      </div>

      {/* Programmes + chart */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 260px",gap:14,marginBottom:16}}>
        <div>
          <div style={{fontSize:13,fontWeight:600,color:T.t1,marginBottom:10}}>Programmes</div>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {getVisibleTiers(user?.role).map(tier=>{
              const td=tier.mods.filter(m=>progress[tier.id+":"+m.id]).length;
              const tp=Math.round(td/tier.mods.length*100);
              const Icon=tier.icon;
              return(
                <div key={tier.id} onClick={()=>onNav("tier_"+tier.id)} role="button" tabIndex={0} onKeyDown={e=>{if(e.key==="Enter"||e.key===" ")onNav("tier_"+tier.id);}} style={{background:T.surface,border:"1px solid "+T.b1,borderRadius:6,padding:"12px 14px",cursor:"pointer",display:"flex",alignItems:"center",gap:12,transition:"box-shadow .15s"}}
                  onMouseEnter={e=>e.currentTarget.style.boxShadow=T.e2} onMouseLeave={e=>e.currentTarget.style.boxShadow="none"}>
                  <div style={{width:36,height:36,borderRadius:4,background:tier.colorLight,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><Icon size={18} color={tier.color}/></div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:4}}>
                      <span style={{fontSize:13,fontWeight:500,color:T.t1}}>{tier.name}</span>
                      <Badge label={tier.level} color={tier.color} bg={tier.colorLight}/>
                    </div>
                    <ProgressBar pct={tp} color={tier.color} h={4}/>
                    <div style={{fontSize:11,color:T.t4,marginTop:3}}>{td}/{tier.mods.length} modules · {tier.mods.length*100} LP</div>
                  </div>
                  <div style={{fontSize:12,fontWeight:500,color:td===tier.mods.length?T.ok:tier.color,flexShrink:0}}>{td===tier.mods.length?"Complete ✓":td===0?"Start →":"In progress"}</div>
                </div>
              );
            })}
          </div>
        </div>
        {/* Completion chart */}
        <div>
          <div style={{fontSize:13,fontWeight:600,color:T.t1,marginBottom:10}}>Completion</div>
          <div style={{background:T.surface,border:"1px solid "+T.b1,borderRadius:6,padding:"12px 8px 8px",height:200}}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{top:4,right:8,left:-20,bottom:0}}>
                <XAxis dataKey="name" tick={{fontSize:10,fill:T.t4}} axisLine={false} tickLine={false}/>
                <YAxis tick={{fontSize:10,fill:T.t4}} axisLine={false} tickLine={false}/>
                <Tooltip contentStyle={{borderRadius:4,border:"1px solid "+T.b1,fontSize:11}}/>
                <Bar dataKey="done" name="Done" radius={[3,3,0,0]}>{chartData.map((_,i)=><Cell key={i} fill={TIERS[i]?.color||T.brand}/>)}</Bar>
                <Bar dataKey="total" name="Total" fill={T.b3} radius={[3,3,0,0]}/>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Achievements + Leaderboard */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
        <div style={{background:T.surface,border:"1px solid "+T.b1,borderRadius:6,padding:"14px 16px"}}>
          <div style={{fontSize:13,fontWeight:600,color:T.t1,marginBottom:12}}>My Progress</div>
          {earnedBadges.length===0
            ?<div style={{fontSize:12,color:T.t4,padding:"12px 0"}}>Complete your first module to earn achievements.</div>
            :<div style={{display:"flex",flexWrap:"wrap",gap:7}}>
              {BDEFS.map(b=>{const e=badges.includes(b.id);return(
                <div key={b.id} title={b.desc} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:3,padding:"8px 10px",borderRadius:4,border:"1px solid "+(e?T.gold+"60":T.b2),background:e?T.goldBg:T.surfaceAlt,opacity:e?1:0.4}}>
                  <span style={{fontSize:17}}>{b.icon}</span>
                  <span style={{fontSize:10,color:e?T.gold:T.t4,fontWeight:500,whiteSpace:"nowrap"}}>{b.name}</span>
                </div>
              );})}
            </div>}
        </div>
        <div style={{background:T.surface,border:"1px solid "+T.b1,borderRadius:6,padding:"14px 16px"}}>
          <div style={{fontSize:13,fontWeight:600,color:T.t1,marginBottom:12}}>Top Performers</div>
          {board.length===0
            ?<div style={{fontSize:12,color:T.t4,padding:"12px 0"}}>Complete modules to appear on the leaderboard.</div>
            :board.slice(0,5).map((e,i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"7px 0",borderBottom:i<4?"1px solid "+T.b3:"none"}}>
                <span style={{width:20,fontSize:12,color:i<3?T.gold:T.t4,fontWeight:600,textAlign:"center"}}>{i===0?"🥇":i===1?"🥈":i===2?"🥉":i+1}</span>
                <div style={{flex:1}}><div style={{fontSize:13,fontWeight:e.n===user?.name?600:400,color:e.n===user?.name?T.brand:T.t1}}>{e.n}</div>{e.ind&&<div style={{fontSize:11,color:T.t4}}>{IND_SHORT[e.ind]||e.ind}</div>}</div>
                <span style={{fontSize:12,fontWeight:500,color:T.t2}}>{(e.xp||0).toLocaleString()} LP</span>
              </div>
            ))}
        </div>
      </div>
    </div>
    </div>
  );
}

// ─── Tier detail, Quiz, Module reader ─────────────────────────────────────
/** @param {{tier:object,progress:object,notes:object,industry:string,onNav:Function}} props @returns {JSX.Element} Tier overview with module list. */
function TierDetail({tier,progress,notes,industry,onNav}){
  const done=tier.mods.filter(m=>progress[tier.id+":"+m.id]).length;
  const pct=Math.round(done/tier.mods.length*100);
  const Icon=tier.icon;
  return(
    <div className="fade-in" style={{overflowY:"auto",flex:1,background:"#0C1524"}}>
      {/* Dark hero */}
      <div style={{background:"linear-gradient(135deg,#0A1828,#0D2040)",padding:"22px 28px",borderBottom:"1px solid rgba(255,255,255,0.06)"}}>
        <button onClick={()=>onNav("learning")} style={{display:"flex",alignItems:"center",gap:5,fontSize:12,color:"rgba(255,255,255,0.4)",background:"none",border:"none",cursor:"pointer",marginBottom:14,fontFamily:"inherit",padding:0}}>
          <ArrowLeft size={13}/>Back to My Learning
        </button>
        <div style={{display:"flex",alignItems:"flex-start",gap:14}}>
          <div style={{width:44,height:44,borderRadius:9,background:tier.color+"22",border:"1.5px solid "+tier.color+"40",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
            <Icon size={20} color={tier.color}/>
          </div>
          <div style={{flex:1}}>
            <div style={{display:"flex",gap:8,marginBottom:5}}><Badge label={tier.level} color={tier.color} bg={tier.color+"22"}/></div>
            <div style={{fontSize:20,fontWeight:800,color:"#FFFFFF",letterSpacing:"-0.03em",marginBottom:3}}>{tier.name}</div>
            <div style={{fontSize:12,color:"rgba(255,255,255,0.4)",lineHeight:1.5,marginBottom:10}}>{tier.description}</div>
            <div style={{display:"flex",gap:18}}>
              {[{v:done+"/"+tier.mods.length,l:"Modules"},{v:pct+"%",l:"Complete"},{v:tier.mods.length*100+" LP",l:"Available"}].map((s,i)=>(
                <div key={i}><div style={{fontSize:15,fontWeight:800,color:tier.color,letterSpacing:"-0.03em"}}>{s.v}</div><div style={{fontSize:10,color:"rgba(255,255,255,0.3)"}}>{s.l}</div></div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Module list */}
      <div style={{padding:"20px 28px"}}>
        {done===tier.mods.length&&(
          <div onClick={()=>onNav("cert_"+tier.id)} role="button" tabIndex={0} onKeyDown={e=>{if(e.key==="Enter"||e.key===" ")onNav("cert_"+tier.id);}} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"12px 16px",background:"rgba(52,199,89,0.1)",border:"1px solid rgba(52,199,89,0.25)",borderRadius:9,cursor:"pointer",marginBottom:14}}>
            <div style={{display:"flex",alignItems:"center",gap:8}}><Award size={16} color="#34C759"/><span style={{fontSize:13,fontWeight:600,color:"#34C759"}}>Programme complete — view your certificate</span></div>
            <ChevronRight size={14} color="#34C759"/>
          </div>
        )}
        <div style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:10,overflow:"hidden"}}>
          <div style={{padding:"10px 20px",borderBottom:"1px solid rgba(255,255,255,0.06)",fontSize:10,fontWeight:700,color:"rgba(255,255,255,0.3)",textTransform:"uppercase",letterSpacing:".08em"}}>
            {tier.mods.length} Modules
          </div>
          {tier.mods.map((mod,i)=>{
            const isDone=!!progress[tier.id+":"+mod.id];
            const hasNote=!!notes[mod.id];
            return(
              <div key={mod.id} onClick={()=>onNav("mod_"+tier.id+"_"+mod.id)} role="button" tabIndex={0} onKeyDown={e=>{if(e.key==="Enter"||e.key===" ")onNav("mod_"+tier.id+"_"+mod.id);}}
                style={{display:"flex",alignItems:"center",gap:12,padding:"13px 20px",
                  borderBottom:i<tier.mods.length-1?"1px solid rgba(255,255,255,0.05)":"none",
                  cursor:"pointer",transition:"background .12s",background:"transparent"}}
                onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,0.04)"}
                onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                <div style={{width:28,height:28,borderRadius:"50%",border:"1.5px solid "+(isDone?tier.color:"rgba(255,255,255,0.12)"),background:isDone?tier.color+"22":"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                  {isDone?<Check size={12} color={tier.color}/>:<span style={{fontSize:10,fontWeight:600,color:"rgba(255,255,255,0.3)"}}>{i+1}</span>}
                </div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:13,fontWeight:600,color:isDone?"rgba(255,255,255,0.55)":"rgba(255,255,255,0.85)",marginBottom:3,textDecoration:isDone?"line-through":"none"}}>{mod.title}</div>
                  <div style={{display:"flex",gap:8,alignItems:"center"}}>
                    <span style={{fontSize:11,color:"rgba(255,255,255,0.3)"}}>{mod.dur}</span>
                    <span style={{fontSize:10,fontWeight:600,color:"rgba(255,255,255,0.25)",background:"rgba(255,255,255,0.06)",padding:"1px 7px",borderRadius:4,border:"1px solid rgba(255,255,255,0.07)"}}>{mod.type}</span>
                    {hasNote&&<span style={{fontSize:10,color:tier.color,fontWeight:500}}>📌 Note</span>}
                  </div>
                </div>
                <div style={{textAlign:"right",flexShrink:0}}>
                  <div style={{fontSize:12,fontWeight:600,color:isDone?tier.color:"rgba(255,255,255,0.25)"}}>{isDone?"Done ✓":"+100 LP"}</div>
                  <ChevronRight size={13} color="rgba(255,255,255,0.2)"/>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Quiz (FIXED: system message, HTTP check, robust JSON parse) ──────────────
/** @param {{mod:object,industry:string,onXp:Function}} props - mod: module data; onXp: callback with XP earned. @returns {JSX.Element} In-module quiz. */
function Quiz({mod,industry,onXp}){
  const [st,setSt]=useState({qs:null,loading:false,sel:{},submitted:false,score:null,err:null});
  async function gen(){
    setSt({qs:null,loading:true,sel:{},submitted:false,score:null,err:null});
    try{
      const res=await fetch("https://api.anthropic.com/v1/messages",{
        method:"POST",
        headers:{"Content-Type":"application/json","anthropic-version":"2023-06-01"},
        body:JSON.stringify({
          model:"claude-haiku-4-5-20251001",
          max_tokens:800,
          system:"You are a quiz generator. Output ONLY valid JSON with no markdown, no explanation, no preamble. The JSON must match this exact schema: {\"questions\":[{\"q\":\"string\",\"opts\":[\"A\",\"B\",\"C\",\"D\"],\"correct\":0,\"exp\":\"string\"}]}",
          messages:[{role:"user",content:"Create 4 questions for a "+(industry||"corporate")+" sector professional about: "+mod.title+". Use real "+(industry||"enterprise")+" sector examples. Return ONLY the JSON."}]
        })
      });
      if(!res.ok){const t=await res.text();throw new Error("API error "+res.status+": "+t.slice(0,120));}
      const data=await res.json();
      const block=data.content?.find(b=>b.type==="text");
      if(!block?.text)throw new Error("Empty response from API");
      const raw=block.text.trim();
      let parsed;
      try{parsed=JSON.parse(raw);}
      catch(e){
        const stripped=raw.replace(/^```(?:json)?\s*/,"").replace(/\s*```\s*$/,"").trim();
        try{parsed=JSON.parse(stripped);}
        catch(e){const m=raw.match(/\{\s*"questions"[\s\S]*\}/);if(m)parsed=JSON.parse(m[0]);else throw new Error("Cannot parse quiz JSON");}
      }
      if(!Array.isArray(parsed?.questions)||parsed.questions.length===0)throw new Error("Invalid quiz structure");
      setSt({qs:parsed.questions,loading:false,sel:{},submitted:false,score:null,err:null});
    }catch(e){
      setSt(s=>({...s,loading:false,err:e.message||"Generation failed — please try again"}));
    }
  }
  function pick(qi,oi){if(!st.submitted)setSt(s=>({...s,sel:{...s.sel,[qi]:oi}}))}
  function submit(){
    const sc=(st.qs||[]).filter((q,i)=>st.sel[i]===q.correct).length;
    const earn=sc*10+(sc===st.qs.length?50:0);
    setSt(s=>({...s,submitted:true,score:sc}));
    if(onXp)onXp(sc,st.qs.length,earn);
  }
  const {qs,loading,sel,submitted,score,err}=st;
  const all=qs&&Object.keys(sel).length===qs.length;
  return(
    <div style={{background:T.surface,border:"1px solid "+T.b1,borderRadius:6,overflow:"hidden"}}>
      <div style={{padding:"11px 20px",borderBottom:"1px solid "+T.b2,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <span style={{fontSize:13,fontWeight:600,color:T.t1}}>Knowledge Check</span>
        <div style={{display:"flex",alignItems:"center",gap:7}}>
          <span style={{fontSize:11,color:T.t4}}>Up to 90 LP</span>
          <Badge label="AI-generated" color={T.gold} bg={T.goldBg}/>
        </div>
      </div>
      <div style={{padding:"16px 20px"}}>
        {!qs&&!loading&&(
          <div>
            <div style={{fontSize:13,color:T.t2,marginBottom:12,lineHeight:1.6}}>Test your understanding with {industry||"sector"}-specific questions. Earn LP for correct answers, plus a 50 LP bonus for a perfect score.</div>
            {err&&<div style={{fontSize:12,color:T.err,background:T.errBg,border:"1px solid "+T.err+"40",borderRadius:4,padding:"8px 12px",marginBottom:12,lineHeight:1.5}}>{err}</div>}
            <button onClick={gen} className="wd-btn" style={{padding:"8px 18px",borderRadius:4,border:"1px solid "+T.b1,background:T.surface,fontSize:13,fontWeight:500,color:T.t2,cursor:"pointer"}}>Generate knowledge check →</button>
          </div>
        )}
        {loading&&<div style={{display:"flex",alignItems:"center",gap:8,padding:"8px 0",color:T.t3,fontSize:13}}><Spin/>Generating {industry||"sector"}-specific questions...</div>}
        {qs&&(
          <div>
            {qs.map((q,qi)=>(
              <div key={qi} style={{marginBottom:14}}>
                <div style={{fontSize:13,fontWeight:500,color:T.t1,marginBottom:8,lineHeight:1.5}}>{qi+1}. {q.q}</div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:5}}>
                  {(q.opts||[]).map((opt,oi)=>{
                    let bg=T.surface,bd=T.b1,cl=T.t2;
                    if(submitted){if(oi===q.correct){bg=T.okBg;bd=T.ok;cl=T.ok;}else if(sel[qi]===oi&&oi!==q.correct){bg=T.errBg;bd=T.err;cl=T.err;}}
                    else if(sel[qi]===oi){bg=T.brandLt;bd=T.brand;cl=T.brand;}
                    return <button key={oi} className="q-opt wd-btn" disabled={submitted} onClick={()=>pick(qi,oi)} style={{padding:"8px 10px",border:"1.5px solid "+bd,borderRadius:4,background:bg,textAlign:"left",fontSize:12,color:cl,lineHeight:1.35,fontFamily:"inherit"}}>{opt}</button>;
                  })}
                </div>
                {submitted&&q.exp&&<div style={{fontSize:12,color:T.t3,marginTop:7,padding:"7px 10px",background:T.page,borderRadius:4,lineHeight:1.55,border:"1px solid "+T.b2}}>{q.exp}</div>}
              </div>
            ))}
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginTop:6,flexWrap:"wrap",gap:8}}>
              {submitted?<span style={{fontSize:13,fontWeight:600,color:T.t1}}>Score: {score}/{qs.length} · +{score*10+(score===qs.length?50:0)} LP {score===qs.length?"🎉":""}</span>:<span style={{fontSize:12,color:T.t4}}>{Object.keys(sel).length}/{qs.length} answered</span>}
              <div style={{display:"flex",gap:6}}>
                {submitted&&<button onClick={gen} className="wd-btn" style={{display:"flex",alignItems:"center",gap:4,padding:"6px 12px",borderRadius:4,border:"1px solid "+T.b1,background:T.surface,fontSize:12,fontWeight:500,color:T.t3,cursor:"pointer"}}><RefreshCw size={11}/>Try again</button>}
                {!submitted&&<button onClick={submit} disabled={!all} className="wd-btn" style={{padding:"7px 16px",borderRadius:4,border:"none",background:all?T.brand:T.b2,fontSize:13,fontWeight:600,color:all?"#FFFFFF":T.t4,cursor:all?"pointer":"not-allowed"}}>Submit</button>}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Module reader ────────────────────────────────────────────────────────────
/** @param {{tier:object,mod:object,idx:number,progress:object,notes:object,industry:string,userFn:string,role:string,onComplete:Function,onQuizXp:Function,onNav:Function}} props @returns {JSX.Element} Full-screen module reading view with quiz. */
function ModuleReader({tier,mod,idx,progress,notes,industry,userFn,role,onComplete,onQuizXp,onNav}){
  const isDone=!!progress[tier.id+":"+mod.id];
  const prev=idx>0?tier.mods[idx-1]:null,nxt=idx<tier.mods.length-1?tier.mods[idx+1]:null;
  const note=notes[mod.id];
  return(
    <div className="fade-in" style={{overflowY:"auto",flex:1,background:"#0C1524"}}>
      {/* Module header */}
      <div style={{background:"linear-gradient(135deg,#0A1828,#0D2040)",padding:"20px 28px",borderBottom:"1px solid rgba(255,255,255,0.06)"}}>
        <button onClick={()=>onNav("tier_"+tier.id)} style={{display:"flex",alignItems:"center",gap:5,fontSize:12,color:"rgba(255,255,255,0.4)",background:"none",border:"none",cursor:"pointer",marginBottom:12,fontFamily:"inherit",padding:0}}>
          <ArrowLeft size={13}/>Back to {tier.name}
        </button>
        <div style={{display:"flex",gap:8,marginBottom:8,flexWrap:"wrap"}}>
          <Badge label={tier.level} color={tier.color} bg={tier.color+"22"}/>
          <span style={{fontSize:12,color:"rgba(255,255,255,0.3)"}}>Module {idx+1} of {tier.mods.length}</span>
          <span style={{fontSize:12,fontWeight:600,color:isDone?"#34C759":"#5AC8FA"}}>+100 LP</span>
        </div>
        <div style={{fontSize:18,fontWeight:800,color:"#FFFFFF",letterSpacing:"-0.03em",lineHeight:1.25,marginBottom:8}}>{mod.title}</div>
        <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
          <span style={{fontSize:11,color:"rgba(255,255,255,0.35)"}}>{mod.dur}</span>
          <span style={{fontSize:11,fontWeight:600,color:"rgba(255,255,255,0.25)",background:"rgba(255,255,255,0.06)",padding:"1px 8px",borderRadius:4,border:"1px solid rgba(255,255,255,0.06)"}}>{mod.type}</span>
        </div>
      </div>

      {/* Content area */}
      <div style={{padding:"20px 28px"}}>
        {note&&(
          <div style={{background:"rgba(0,112,243,0.08)",border:"1px solid rgba(0,112,243,0.2)",borderRadius:9,padding:"12px 16px",marginBottom:14}}>
            <div style={{fontSize:11,fontWeight:700,color:"#5AC8FA",textTransform:"uppercase",letterSpacing:".06em",marginBottom:5}}>📌 Facilitator Note</div>
            <div style={{fontSize:13,color:"rgba(255,255,255,0.8)",lineHeight:1.65}}>{note.text}</div>
            {note.auth&&<div style={{fontSize:11,color:"rgba(255,255,255,0.35)",marginTop:5}}>— {note.auth} · {note.d}</div>}
          </div>
        )}
        {industry&&(
          <div style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:7,padding:"8px 12px",marginBottom:14,display:"flex",alignItems:"center",gap:7,fontSize:12,color:"rgba(255,255,255,0.4)"}}>
            <div style={{width:5,height:5,borderRadius:"50%",background:"#5AC8FA",flexShrink:0}}/>
            Reading as <strong style={{color:"rgba(255,255,255,0.7)",fontWeight:600,margin:"0 3px"}}>{industry}</strong> professional · knowledge checks will reflect this sector.
          </div>
        )}
        {/* Module content */}
        <div className="ch" style={{background:"rgba(255,255,255,0.97)",borderRadius:10,padding:"24px 28px",marginBottom:14}} dangerouslySetInnerHTML={{__html:mod.html}}/>
        {/* Action row */}
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:10,marginBottom:14}}>
          <button onClick={()=>!isDone&&onComplete(tier.id,mod.id)} disabled={isDone}
            style={{display:"flex",alignItems:"center",gap:6,padding:"9px 18px",borderRadius:9,
              border:isDone?"1px solid rgba(52,199,89,0.4)":"none",
              background:isDone?"rgba(52,199,89,0.12)":"linear-gradient(135deg,#0052FF,#0070F3)",
              color:isDone?"#34C759":"#FFFFFF",fontSize:13,fontWeight:700,cursor:isDone?"default":"pointer",fontFamily:"inherit"}}>
            <Check size={14}/>{isDone?"Module complete · +100 LP":"Mark as complete"}
          </button>
          <div style={{display:"flex",gap:7}}>
            {prev&&<button onClick={()=>onNav("mod_"+tier.id+"_"+prev.id)}
              style={{display:"flex",alignItems:"center",gap:5,padding:"8px 14px",borderRadius:9,border:"1px solid rgba(255,255,255,0.1)",background:"rgba(255,255,255,0.04)",fontSize:12,fontWeight:600,color:"rgba(255,255,255,0.6)",cursor:"pointer",fontFamily:"inherit"}}>
              <ArrowLeft size={12}/>Previous
            </button>}
            {nxt&&<button onClick={()=>onNav("mod_"+tier.id+"_"+nxt.id)}
              style={{display:"flex",alignItems:"center",gap:5,padding:"8px 14px",borderRadius:9,border:"1px solid rgba(255,255,255,0.1)",background:"rgba(255,255,255,0.04)",fontSize:12,fontWeight:600,color:"rgba(255,255,255,0.6)",cursor:"pointer",fontFamily:"inherit"}}>
              Next<ArrowRight size={12}/>
            </button>}
          </div>
        </div>
        <Quiz mod={mod} industry={industry} onXp={onQuizXp}/>
    </div>
    </div>
  );
}

// ─── Achievements ─────────────────────────────────────────────────────────────
/** @param {{xp:number,badges:string[],streak:number,role:string}} props @returns {JSX.Element} Achievements and badges screen. */
function AchievementsView({xp,badges,streak,role}){
  const lv=getLv(xp),nx=getNext(xp),pct=getLvPct(xp);
  return(
    <div className="fade-in" style={{overflowY:"auto",flex:1,background:"#F2F2F7"}}>
      <div style={{background:"linear-gradient(135deg,#1A1A0A 0%,#2A2810 60%,#1A1A0A 100%)",padding:"28px 32px"}}>
        <div style={{fontSize:24,fontWeight:800,color:"#FFFFFF",letterSpacing:"-0.03em",marginBottom:4}}>Achievements &amp; Progress</div>
        <div style={{fontSize:13,color:"rgba(255,255,255,0.5)"}}>Your credentials, levels, and milestones.</div>
      </div>
      <div style={{padding:"24px 28px"}}>
      <div style={{fontSize:17,fontWeight:700,color:T.t1,marginBottom:18}}>Achievements & Progress</div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:20}}>
        <div style={{background:T.surface,border:"1px solid "+T.b1,borderRadius:6,padding:"18px 20px"}}>
          <div style={{fontSize:12,color:T.t3,marginBottom:3}}>Current Level</div>
          <div style={{fontSize:24,fontWeight:700,color:lv.color,marginBottom:2}}>{lv.name}</div>
          <div style={{fontSize:12,color:T.t4,marginBottom:12}}>Level {lv.n} of {LEVELS.length}</div>
          <ProgressBar pct={pct} color={lv.color} h={7}/>
          <div style={{display:"flex",justifyContent:"space-between",fontSize:11,color:T.t4,marginTop:5}}>
            <span>{xp.toLocaleString()} LP</span>{nx&&<span>{nx.min.toLocaleString()} LP for {nx.name}</span>}
          </div>
        </div>
        <div style={{background:T.surface,border:"1px solid "+T.b1,borderRadius:6,padding:"18px 20px"}}>
          <div style={{fontSize:12,color:T.t3,marginBottom:3}}>Learning Streak</div>
          <div style={{fontSize:24,fontWeight:700,color:streak>0?T.fire:T.t4,marginBottom:2}}>{streak>0?streak+" day"+(streak>1?"s":""):"Not started"}</div>
          <div style={{fontSize:12,color:T.t4,marginBottom:12}}>{streak>0?"Consecutive days of learning":"Log in daily to build your streak"}</div>
          {streak>0&&<div style={{fontSize:12,color:T.fire,background:"#FEF3E2",border:"1px solid "+T.warn+"40",padding:"5px 10px",borderRadius:3,display:"inline-block"}}>🔥 {streak>=7?"Excellent streak!":streak>=3?"Good momentum":"Keep going!"}</div>}
        </div>
      </div>
      <div style={{fontSize:13,fontWeight:600,color:T.t1,marginBottom:12}}>All Credentials</div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10}}>
        {BDEFS.map(b=>{const e=badges.includes(b.id);return(
          <div key={b.id} style={{background:T.surface,border:"1px solid "+(e?T.gold+"50":T.b2),borderRadius:6,padding:"16px 12px",textAlign:"center",opacity:e?1:0.4}}>
            <div style={{fontSize:24,marginBottom:7}}>{b.icon}</div>
            <div style={{fontSize:12,fontWeight:600,color:e?T.gold:T.t4,marginBottom:3}}>{b.name}</div>
            <div style={{fontSize:11,color:T.t4,lineHeight:1.4}}>{b.desc}</div>
            {e&&<div style={{marginTop:7,fontSize:11,color:T.ok,fontWeight:500}}>✓ Earned</div>}
          </div>
        );})}
      </div>
    </div>

      {/* Skill Passport */}
      <div style={{fontSize:13,fontWeight:700,color:T.t1,marginBottom:10,marginTop:20}}>Skill Passport</div>
      <div style={{background:T.surface,border:"1px solid "+T.b1,borderRadius:6,padding:"16px 20px",marginBottom:14}}>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:14,paddingBottom:12,borderBottom:"1px solid "+T.b2}}>
          <div style={{width:44,height:44,borderRadius:9,background:"linear-gradient(135deg,#0070F3,#7C3AED)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>🎓</div>
          <div style={{flex:1}}>
            <div style={{fontSize:14,fontWeight:700,color:T.t1}}>Digilytics AI & Data Capability Passport</div>
            <div style={{fontSize:11,color:T.t4}}>Africa's Enterprise AI Literacy Platform · digilyticsco.com</div>
          </div>
          <div style={{textAlign:"right"}}>
            <div style={{fontSize:16,fontWeight:800,color:getLv(xp).color}}>{getLv(xp).name}</div>
            <div style={{fontSize:11,color:T.t4}}>{xp.toLocaleString()} LP · Level {getLv(xp).n}/{LEVELS.length}</div>
          </div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
          {CAP_DIMS.map((d,i)=>{
            const prog=Math.min(100,Math.round(((xp||0)/(Math.max(1,i+1)*180))*100));
            return(
              <div key={d.id} style={{padding:"7px 10px",background:T.page,borderRadius:6,border:"1px solid "+T.b2}}>
                <div style={{display:"flex",justifyContent:"space-between",fontSize:11,marginBottom:3}}>
                  <span style={{fontWeight:600,color:T.t2}}>{d.short}</span>
                  <span style={{color:d.color,fontWeight:700}}>{prog}%</span>
                </div>
                <div style={{height:3,background:T.b2,borderRadius:2,overflow:"hidden"}}>
                  <div style={{width:prog+"%",height:"100%",background:d.color,borderRadius:2}}/>
                </div>
              </div>
            );
          })}
        </div>
        <div style={{fontSize:11,color:T.t4,marginTop:10,padding:"8px 12px",background:T.page,borderRadius:6,border:"1px solid "+T.b2}}>
          💡 Complete the Readiness Assessment to enrich your passport with AI-generated capability scores.
        </div>
      </div>
    </div>
  );
}

// ─── Certificate ──────────────────────────────────────────────────────────────
/** @param {{tier:object,name:string,xp:number,onNav:Function}} props @returns {JSX.Element} Printable certificate view for a completed tier. */
function CertView({tier,name,xp,onNav}){
  const date=new Date().toLocaleDateString("en-ZA",{year:"numeric",month:"long",day:"numeric"});
  const lv=getLv(xp);const Icon=tier.icon;
  return(
    <div className="fade-in" style={{padding:"24px 28px",overflowY:"auto",flex:1,display:"flex",justifyContent:"center"}}>
      <div style={{width:"100%",maxWidth:620,background:T.surface,border:"1px solid "+T.b1,borderRadius:6,overflow:"hidden",boxShadow:T.e3}}>
        <div style={{background:T.side,padding:"28px 40px",textAlign:"center",position:"relative"}}>
          <div style={{width:52,height:52,borderRadius:"50%",background:tier.color+"30",border:"2px solid "+tier.color,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 14px"}}><Icon size={26} color={tier.color}/></div>
          <div style={{fontSize:10,fontWeight:700,color:"rgba(255,255,255,0.4)",textTransform:"uppercase",letterSpacing:".14em",marginBottom:7}}>Certificate of Completion</div>
          <div style={{fontSize:20,fontWeight:700,color:"#FFFFFF",marginBottom:3}}>Digilytics AI Academy</div>
          <div style={{fontSize:12,color:"rgba(255,255,255,0.45)"}}>CapabilityOS · Powered by Digilytics Co.</div>
        </div>
        <div style={{padding:"24px 40px",textAlign:"center"}}>
          <div style={{fontSize:11,textTransform:"uppercase",letterSpacing:".1em",color:T.t4,marginBottom:7}}>This certifies that</div>
          <div style={{fontSize:26,fontWeight:700,color:T.t1,marginBottom:7}}>{name}</div>
          <div style={{fontSize:13,color:T.t3,marginBottom:5}}>has successfully completed</div>
          <div style={{fontSize:19,fontWeight:700,color:tier.color,marginBottom:4}}>{tier.name}</div>
          <div style={{fontSize:13,color:T.t3,marginBottom:18}}>{tier.level} · Digilytics AI Enterprise Literacy Programme</div>
          <div style={{display:"flex",justifyContent:"center",gap:10,marginBottom:18}}>
            <Badge label={lv.name} color={lv.color} bg={lv.color+"15"}/>
            <Badge label={xp.toLocaleString()+" LP earned"} color={T.t3} bg={T.page}/>
          </div>
          <Divider my={16}/>
          <div style={{fontSize:12,color:T.t4,marginBottom:18}}>Issued {date}</div>
          <div style={{display:"flex",justifyContent:"center",gap:8}}>
            <button onClick={()=>onNav("learning")} className="wd-btn" style={{padding:"8px 16px",borderRadius:4,border:"1px solid "+T.b1,background:T.surface,fontSize:12,fontWeight:500,color:T.t2,cursor:"pointer"}}>Back to Learning</button>
            <button onClick={()=>onNav("achievements")} className="wd-btn" style={{padding:"8px 16px",borderRadius:4,border:"none",background:T.brand,fontSize:12,fontWeight:600,color:"#FFFFFF",cursor:"pointer"}}>View Achievements</button>
          </div>
        </div>
      </div>
    </div>
  );
}


const PRE_LOADED_QUESTIONS = {
  d1:{name:"Digital Foundations",questions:[
    {q:"Your organisation is moving to cloud-based systems. Your team's data will be stored on servers you don't physically control. What is your PRIMARY concern before approving the move?",opts:["Whether the tools are intuitive for the team","Data security, access controls, and who can view your information","Whether the tools integrate with existing systems","The total cost of the migration"],correct:1,exp:"Data sovereignty and access control are the critical governance questions for any cloud migration — especially under POPIA."},
    {q:"A phishing email arrives appearing to be from your CEO requesting an urgent payment. What do you do FIRST?",opts:["Process the payment — the CEO's request takes priority","Reply asking for more details","Verify the request through a separate trusted channel such as a phone call","Forward it to IT and wait"],correct:2,exp:"CEO fraud is one of the most common cyberattacks. Always verify urgent financial requests through a separate, trusted communication channel."},
    {q:"Your team's shared drive contains a folder labelled 'Client Contracts - All Years'. What is the MOST important governance action to take?",opts:["Leave it — easy access improves team efficiency","Set role-based access so only authorised staff can view sensitive contracts","Move it to email for better access control","Print physical copies as backup"],correct:1,exp:"POPIA requires that personal and sensitive information is accessible only to those with a legitimate need. Role-based access controls are the foundation of data governance."},
  ]},
  d2:{name:"Data Fluency",questions:[
    {q:"Your sales dashboard shows a 45% increase in customer acquisition this month. Before presenting to the board, what is MOST important to verify?",opts:["Whether the increase is higher than competitors","Whether the metric is defined and measured consistently with previous months","Whether the dashboard design is professional enough","Whether the month had more working days"],correct:1,exp:"Data integrity comes first. An apparent increase may reflect a change in how the metric is measured rather than actual business improvement."},
    {q:"An analyst shows a chart revealing a strong correlation between ice cream sales and drowning incidents. The BEST conclusion is:",opts:["Ice cream causes drowning incidents","Both are likely driven by a third factor — hot weather — and correlation does not imply causation","The data must be incorrect","This insight should inform a public safety campaign"],correct:1,exp:"Correlation is not causation. A hidden third variable (seasonality/heat) explains both. This is one of the most important principles in data literacy."},
    {q:"You receive a report showing your product's NPS score dropped from 62 to 58. What additional context do you need BEFORE deciding to act?",opts:["The sample size, the trend over time, and whether the change is statistically significant","Just the competitor NPS scores","The names of the customers who gave low scores","The exact date the survey was sent"],correct:0,exp:"A 4-point drop could be noise or signal. You need sample size, confidence intervals, and historical trend to determine whether this requires action."},
  ]},
  d3:{name:"Analytical Thinking",questions:[
    {q:"Customer complaints increased 30% in Q3. Before recommending solutions, what should you do FIRST?",opts:["Launch an immediate improvement programme","Survey customers about what they want","Segment complaints to identify specific issues, categories, and root causes","Compare your rate to industry benchmarks"],correct:2,exp:"Jumping to solutions before understanding root causes wastes resources. Structured problem decomposition is the foundation of analytical thinking."},
    {q:"You must prioritise three AI projects with limited budget. Project A saves R5M over 18 months. Project B saves R2M over 3 months. Project C saves R8M over 3 years. What framework BEST guides your decision?",opts:["Always choose highest ROI regardless of timeline","Always choose the fastest project to show results","Evaluate NPV, strategic fit, risk, and organisational capacity together","Average the savings and pick the middle option"],correct:2,exp:"No single metric determines priority. A multi-criteria framework balancing financial return, strategic alignment, risk, and execution capacity produces better decisions."},
    {q:"A manager tells you 'our AI pilot failed because the technology wasn't good enough.' What analytical question should you ask FIRST?",opts:["Which vendor should we use instead?","What does 'failed' mean — what was the specific success criterion and what actually happened?","Should we try a different AI approach?","Was the budget sufficient?"],correct:1,exp:"Vague failure explanations lead to repeated mistakes. Precisely defining what 'failed' means — against what criteria, compared to what baseline — is the first step to learning."},
  ]},
  d4:{name:"AI Awareness",questions:[
    {q:"A generative AI tool produces a highly confident, detailed answer to a complex regulatory question. What should you do before using this answer?",opts:["Use it directly — AI is trained on vast amounts of data and is reliable","Verify with authoritative sources, as AI can generate plausible but incorrect information","Ask the AI the same question again to confirm","Check whether the model is recent enough"],correct:1,exp:"AI systems can hallucinate — generating confident, well-structured but factually incorrect responses. All AI outputs in high-stakes contexts must be verified with authoritative sources."},
    {q:"Your organisation wants to use AI to screen CVs and shortlist candidates. What is the MOST critical governance concern?",opts:["Whether the AI can process CVs fast enough","Whether candidates will know they were screened by AI","Whether the AI model might perpetuate or amplify existing hiring biases","Whether the AI model is cheaper than human screening"],correct:2,exp:"AI hiring tools trained on historical data can encode and amplify past biases. Under POPIA and responsible AI principles, organisations must audit for discriminatory outcomes."},
    {q:"The difference between 'machine learning' and 'generative AI' is best described as:",opts:["Machine learning is older and less capable than generative AI","Machine learning finds patterns to predict outcomes; generative AI creates new content such as text, images, and code","Generative AI is just machine learning with a better interface","They are the same technology with different marketing names"],correct:1,exp:"Understanding the distinction helps business leaders choose the right AI approach for each use case — prediction tasks versus content creation tasks require different solutions."},
  ]},
  d5:{name:"Applied AI Skills",questions:[
    {q:"You ask an AI tool to 'write a report on our Q3 performance'. The output is generic and unhelpful. What is the MOST effective next step?",opts:["Try a different AI tool","Provide specific context: the audience, key metrics, format required, and the specific message you want","Ask the AI to 'try again and do better'","Conclude that AI is not useful for this task"],correct:1,exp:"AI output quality is directly proportional to prompt quality. Specificity about audience, purpose, format, and constraints produces dramatically better results."},
    {q:"You use AI to draft a client proposal. Which practice BEST demonstrates responsible professional use?",opts:["Submit the AI output directly to save time","Edit the draft minimally to maintain its objectivity","Review for accuracy, add your expertise and client-specific context, and verify all facts","Disclose to the client that AI was used before sending anything"],correct:2,exp:"AI-generated content must be reviewed and personalised before professional use. The professional takes responsibility for accuracy and quality — not the tool."},
    {q:"You want to use AI to analyse 50 customer feedback emails and identify the top themes. Which approach is MOST effective?",opts:["Read all 50 emails yourself to be sure","Ask AI to summarise each email individually then compile yourself","Paste all emails into the AI with clear instructions to identify and rank themes with supporting quotes","Use AI to count the number of emails mentioning each keyword"],correct:2,exp:"AI excels at pattern recognition across large text datasets. A clear, structured prompt with specific output requirements (themes + evidence + ranking) produces actionable insight efficiently."},
  ]},
  d6:{name:"AI-Led Practice",questions:[
    {q:"You roll out an AI tool in your team. After 6 weeks, only 30% are using it regularly. What is the MOST likely root cause?",opts:["The AI tool is not good enough","Team members lack the digital skills for any new tool","Insufficient change management — people need to understand the why, see early wins, and have ongoing support","The rollout timeline was too short"],correct:2,exp:"Technology adoption failures are almost always change management failures, not technology failures. People adopt tools when they understand the benefit and have support to build new habits."},
    {q:"Your team wants to automate a customer-facing process using AI. What is the MOST important consideration before proceeding?",opts:["Whether the AI solution is cheaper than the current process","Whether competitors are using AI for similar processes","Whether the AI system might fail in ways that harm customer experience, and what human escalation looks like","Whether the AI vendor has a strong reputation"],correct:2,exp:"Customer-facing AI requires careful failure mode analysis. When AI makes mistakes in customer interactions, the business impact is immediate. Human escalation paths must be designed before deployment."},
    {q:"A business unit leader says 'we want to use AI but don't know where to start.' What is your RECOMMENDED first step?",opts:["Buy an AI platform and let teams explore it","Commission a full AI strategy from a consultant","Map your highest-volume, most repetitive processes and identify where data exists to support AI","Start with a proof-of-concept on the most complex problem to prove AI capability"],correct:2,exp:"The best AI use cases combine high volume, clear rules, available data, and measurable outcomes. Starting with a process inventory rather than technology selection produces sustainable value."},
  ]},
  d7:{name:"Transformation Design",questions:[
    {q:"An enterprise AI transformation has low adoption after 12 months despite strong technology. What is MOST likely the root cause?",opts:["The technology chosen was not the right fit","The business case was not compelling enough","The transformation focused on technology deployment without redesigning the operating model, roles, and culture","The programme moved too quickly"],correct:2,exp:"Digital transformation failures are organisational, not technical. Technology without operating model redesign and culture change produces shelfware."},
    {q:"A competitor has deployed AI across operations and is gaining market advantage. How should you respond?",opts:["Match every AI initiative the competitor has launched","Assess your capability maturity, prioritise use cases with highest strategic impact, and build foundational capabilities first","Acquire an AI startup to fast-track capability","Wait to see which of the competitor's initiatives succeed before acting"],correct:1,exp:"Reactive AI adoption produces fragmented, low-value implementations. A capability-led approach — assessing your own maturity and prioritising strategically — produces sustainable competitive advantage."},
    {q:"You are designing an AI transformation roadmap. What is the CORRECT sequence?",opts:["Technology selection → Use case identification → Data strategy → Change management","Use case identification → Data audit → Capability assessment → Pilot → Scale","Buy AI tools → Train staff → Identify use cases → Measure ROI","Executive mandate → Full deployment → Measure results → Adjust"],correct:1,exp:"Sustainable AI transformation starts with identifying high-value use cases, assessing data readiness, building capability, running contained pilots, then scaling based on evidence."},
  ]},
  d8:{name:"Responsible AI",questions:[
    {q:"An AI credit scoring model produces decisions that systematically disadvantage one demographic group. Under POPIA and responsible AI principles, what must the organisation do?",opts:["Continue using the model while investigating — it was not intentionally biased","Suspend the model, investigate the bias, remediate it, and be able to explain decisions to affected individuals","Disclose the bias publicly and continue while fixing it","Replace the AI model permanently with human processes"],correct:1,exp:"Under POPIA, organisations must be able to explain automated decisions that significantly affect individuals. Biased AI models must be suspended and remediated, not operated while under investigation."},
    {q:"A board member asks: 'How do we know our AI systems are making fair decisions?' What is the BEST response?",opts:["We use reputable AI vendors so their models are fair by default","We have established an AI governance framework with regular bias audits, explainability requirements, and defined human oversight protocols","Our data scientists review the models regularly","AI decisions are statistical so they are naturally fair across groups"],correct:1,exp:"AI fairness requires active governance: defined standards, regular auditing, explainability mechanisms, and human oversight. Vendor reputation and technical review alone are insufficient."},
    {q:"An employee wants to use an AI tool to process customer data to improve service. What governance step is REQUIRED first?",opts:["Get verbal approval from the line manager","Check whether the AI tool's data processing complies with POPIA — specifically where data is stored and whether customers consented","Test whether the AI tool gives good results before worrying about compliance","Ask the AI vendor whether their tool is POPIA compliant"],correct:1,exp:"POPIA requires that personal data is only processed with lawful basis and that processors comply with data protection requirements. Self-certification by vendors is insufficient — contractual and technical safeguards must be verified."},
  ]},
};

// ─── Workforce Readiness Assessment ─────────────────────────────────────────
// Theory of Change: Assess → Identify gaps → Prescribe → Track progress → Re-assess
// Each question is contextual to the user's role, industry, and function.

const RA_STORAGE_KEY = (name) => "ra_history:"+name;

/** @param {{role:string,userFn:string,subFn:string,industry:string,xp:number,onNav:Function}} props @returns {JSX.Element} AI readiness self-assessment with radar output. */
function ReadinessAssessment({role,userFn,subFn,industry,xp,onNav}){
  const [phase, setPhase]     = useState("intro");   // intro | assess | results | history
  const [dimIdx, setDimIdx]   = useState(0);
  const [qs, setQs]           = useState({});
  const [sel, setSel]         = useState({});
  const [scores, setScores]   = useState({});
  const [loading, setLoading] = useState(false);
  const [err, setErr]         = useState("");
  const [history, setHistory] = useState([]);
  const [aiPlan, setAiPlan]   = useState(null);
  const [planLoading, setPlanLoading] = useState(false);

  const visibleDims = CAP_DIMS.filter(d=>{
    if(role==="executive") return ["d3","d4","d5","d6","d7","d8"].includes(d.id);
    if(role==="functional") return ["d2","d3","d4","d5","d6","d7"].includes(d.id);
    if(role==="manager") return ["d2","d3","d4","d5","d6"].includes(d.id);
    if(role==="emerging") return ["d1","d2","d3","d4"].includes(d.id);
    return CAP_DIMS; // learner and all others
  });
  const totalDims = visibleDims.length;
  const dim = visibleDims[dimIdx];
  const currentQs = dim ? qs[dim.id] : null;
  const currentDone = currentQs && currentQs.every((_,qi)=>sel[dim.id+"_q"+qi]!==undefined);

  // Load history on mount
  useEffect(()=>{
    try{
      const stored=localStorage.getItem(RA_STORAGE_KEY(role+":"+(industry||"")+"_history"));
      if(stored) setHistory(JSON.parse(stored));
    }catch(e){}
  },[]);

  async function loadDim(idx){
    const d=visibleDims[idx];
    if(!d||qs[d.id])return;
    setLoading(true);setErr("");

    // Step 1: Use pre-loaded questions immediately — no API dependency
    const preBank=PRE_LOADED_QUESTIONS[d.id];
    if(preBank&&preBank.questions&&preBank.questions.length>=2){
      // Pick 2 questions (shuffle for variety on retakes)
      const shuffled=[...preBank.questions].sort(()=>Math.random()-0.5).slice(0,2);
      setQs(function(prev){var n=Object.assign({},prev);n[d.id]=shuffled;return n;});
      setLoading(false);

      // Step 2: Optionally try to enhance with AI-generated question (non-blocking)
      try{
        const roleLabel=(ROLE_DISPLAY||{})[role]||role||"professional";
        const indCtx=industry?" in "+industry:"";
        const fnCtx=(subFn||userFn)?" as a "+(subFn||userFn):"";
        const prompt="Write 1 scenario question about "+d.name+" for "+roleLabel+indCtx+fnCtx+". Return JSON only: q(question), a(4 options array), c(correct index 0-3), e(explanation)";

        const controller=new AbortController();
        const timeout=setTimeout(function(){controller.abort();},4000);
        const r=await fetch("https://api.anthropic.com/v1/messages",{
          signal:controller.signal,
          method:"POST",
          headers:{"Content-Type":"application/json","anthropic-version":"2023-06-01"},
          body:JSON.stringify({model:"claude-haiku-4-5-20251001",max_tokens:250,
            system:"Output only the JSON object requested. No backticks.",
            messages:[{role:"user",content:prompt}]})});
        clearTimeout(timeout);
        if(r.ok){
          const data=await r.json();
          const raw=((data.content||[]).find(function(b){return b.type==="text";})||{}).text||"";
          const obj=JSON.parse(raw.replace(/^```[\w]*\s*/,"").replace(/\s*```$/,"").trim());
          if(obj.q&&obj.a&&obj.a.length===4){
            const aiQ={q:obj.q,opts:obj.a,correct:typeof obj.c==="number"?obj.c:0,exp:obj.e||""};
            // Add AI question as a bonus 3rd question
            setQs(function(prev){
              var n=Object.assign({},prev);
              n[d.id]=[...shuffled,aiQ];
              return n;
            });
          }
        }
      }catch(aiErr){
        // AI enhancement failed silently — pre-loaded questions still shown
      }
      return;
    }

    // Fallback: pure AI if no pre-loaded questions for this dimension
    try{
      const roleLabel=(ROLE_DISPLAY||{})[role]||role||"professional";
      const ctx=(industry?" in "+industry:"")+((subFn||userFn)?" as a "+(subFn||userFn):"");
      const prompt="Write 2 scenario questions about "+d.name+" for "+roleLabel+ctx+". Format: JSON with q1 and q2 keys, each having q(question string), a(4 options array), c(correct 0-3), e(explanation)";

      const r=await fetch("https://api.anthropic.com/v1/messages",{
        method:"POST",
        headers:{"Content-Type":"application/json","anthropic-version":"2023-06-01"},
        body:JSON.stringify({model:"claude-haiku-4-5-20251001",max_tokens:500,
          system:"Output only raw JSON. No backticks.",
          messages:[{role:"user",content:prompt}]})});
      if(!r.ok)throw new Error("API "+r.status);
      const data=await r.json();
      const raw=((data.content||[]).find(function(b){return b.type==="text";})||{}).text||"";
      const obj=JSON.parse(raw.replace(/^```[\w]*\s*/,"").replace(/\s*```$/,"").trim());
      const questions=["q1","q2"].map(function(k){return obj[k];}).filter(Boolean).map(function(qi){
        return{q:qi.q,opts:qi.a||["A","B","C","D"],correct:typeof qi.c==="number"?qi.c:0,exp:qi.e||""};
      });
      if(questions.length===0)throw new Error("Empty");
      setQs(function(prev){var n=Object.assign({},prev);n[d.id]=questions;return n;});
    }catch(err){
      setErr("Could not load questions for "+d.name+". Please try again.");
    }
    setLoading(false);
  }


  function answerQ(dimId,qi,val){setSel(s=>({...s,[dimId+"_q"+qi]:val}));}

  function nextDim(){
    // Score current dim
    const dimScore=currentQs.reduce((acc,q,qi)=>acc+(sel[dim.id+"_q"+qi]===q.correct?1:0),0);
    const pct=Math.round(dimScore/currentQs.length*100);
    setScores(s=>({...s,[dim.id]:pct}));
    if(dimIdx<totalDims-1){setDimIdx(dimIdx+1);loadDim(dimIdx+1);}
    else finishAssessment({...scores,[dim.id]:pct});
  }

  async function finishAssessment(finalScores){
    setPhase("results");
    // Store to history
    const entry={date:new Date().toLocaleDateString("en-ZA"),scores:finalScores,xp,role,industry:industry||"",fn:userFn||""};
    const newHist=[entry,...history].slice(0,5);
    setHistory(newHist);
    try{localStorage.setItem(RA_STORAGE_KEY(role+":"+(industry||"")+"_history"),JSON.stringify(newHist));}catch(e){}
    // Generate AI capability development plan
    setPlanLoading(true);
    const gaps=CAP_DIMS.filter(d=>d.id in finalScores&&finalScores[d.id]<70).map(d=>d.name+"("+finalScores[d.id]+"%)").join(", ");
    const strengths=CAP_DIMS.filter(d=>d.id in finalScores&&finalScores[d.id]>=70).map(d=>d.name).join(", ");
    try{
      const r=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",
        headers:{"Content-Type":"application/json","anthropic-version":"2023-06-01"},
        body:JSON.stringify({model:"claude-haiku-4-5-20251001",max_tokens:400,
          system:"Output only JSON. No backticks.",
          messages:[{role:"user",content:"Create a 90-day capability development plan for a "+(ROLE_DISPLAY[role]||role)+" in "+(industry||"enterprise")+". Gaps: "+gaps+". Strengths: "+strengths+". Return JSON: {\"headline\":\"...\",\"priority_actions\":[\"...\",\"...\",\"...\"],\"quick_wins\":[\"...\",\"...\"],\"warning\":\"one sentence risk if gaps not addressed\"}"}]})});
      const d=await r.json();
      const raw=((d.content||[]).find(b=>b.type==="text")?.text||"").trim();
      setAiPlan(JSON.parse(raw.replace(/^```[\w]*\s*/,"").replace(/\s*```$/,"")));
    }catch(e){}
    setPlanLoading(false);
  }

  // Benchmark scores by role
  const benchmark={executive:{d3:72,d4:65,d5:60,d6:70,d7:55,d8:50},functional:{d2:68,d3:65,d4:60,d5:58,d6:55,d7:50},manager:{d2:65,d3:62,d4:58,d5:55,d6:52},learner:{d1:70,d2:65,d3:60,d4:55,d5:50,d6:45,d7:40,d8:35},emerging:{d1:65,d2:55,d3:50,d4:45}};
  const myBench=benchmark[role]||benchmark.learner;

  const overallScore=Object.keys(scores).length?Math.round(Object.values(scores).reduce((a,b)=>a+b,0)/Object.keys(scores).length):0;
  const prevScore=history.length>1?Math.round(Object.values(history[1].scores||{}).reduce((a,b)=>a+b,0)/Math.max(Object.values(history[1].scores||{}).length,1)):null;
  const delta=prevScore!==null?overallScore-prevScore:null;

  if(phase==="intro") return(
    <div className="fade-in" style={{flex:1,overflowY:"auto"}}>
      <div style={{background:"linear-gradient(135deg,#0A1828,#0D2040)",padding:"24px 28px",borderBottom:"1px solid rgba(255,255,255,0.06)"}}>
        <div style={{display:"flex",gap:8,marginBottom:10,flexWrap:"wrap"}}>
          <Badge label="Capability Check" color="#7C3AED" bg="rgba(124,58,237,0.15)"/>
          {industry&&<Badge label={industry} color="rgba(255,255,255,0.4)" bg="rgba(255,255,255,0.07)"/>}
          {(subFn||userFn)&&<Badge label={subFn||userFn} color="rgba(255,255,255,0.4)" bg="rgba(255,255,255,0.07)"/>}
          <Badge label="AI-adaptive" color="#34C759" bg="rgba(52,199,89,0.1)"/>
        </div>
        <div style={{fontSize:22,fontWeight:800,color:"#FFFFFF",letterSpacing:"-0.03em",marginBottom:6}}>Your Capability Diagnostic</div>
        <div style={{fontSize:13,color:"rgba(255,255,255,0.55)",lineHeight:1.7,maxWidth:540}}>
          This is not a form. Our AI generates scenario-based questions specific to your role
          {industry?" in "+industry:""}{(subFn||userFn)?" as a "+(subFn||userFn):""},
          assesses your responses, and produces a real-time capability profile with a personalised 90-day development plan.
        </div>
        <div style={{display:"flex",gap:8,marginTop:12,flexWrap:"wrap"}}>
          {[["Scenario-based","Not multiple-choice"],["Role-specific","Not generic"],["Continuously updated","Not once a year"],["AI-benchmarked","Not self-scored"]].map(function(kv,i){
            return <div key={i} style={{padding:"4px 10px",borderRadius:20,background:"rgba(124,58,237,0.12)",border:"1px solid rgba(124,58,237,0.25)"}}>
              <span style={{fontSize:10,fontWeight:700,color:"#A78BFA"}}>{kv[0]}</span>
              <span style={{fontSize:10,color:"rgba(255,255,255,0.3)"}}>  {kv[1]}</span>
            </div>;
          })}
        </div>
      </div>
      <div style={{padding:"22px 28px"}}>
        {/* Previous results */}
        {history.length>0&&(
          <div style={{background:"rgba(124,58,237,0.08)",border:"1px solid rgba(124,58,237,0.2)",borderRadius:12,padding:"14px 18px",marginBottom:18}}>
            <div style={{fontSize:12,fontWeight:700,color:"#A78BFA",marginBottom:6}}>Last assessment: {history[0].date}</div>
            <div style={{display:"flex",gap:16,flexWrap:"wrap"}}>
              {Object.entries(history[0].scores||{}).slice(0,5).map(function(kv){
                var d=CAP_DIMS.find(function(x){return x.id===kv[0];});
                return <div key={kv[0]}><div style={{fontSize:14,fontWeight:800,color:kv[1]>=70?"#34C759":kv[1]>=50?"#FF9500":"#FF3B30"}}>{kv[1]}%</div><div style={{fontSize:9,color:T.t4}}>{d?d.short:kv[0]}</div></div>;
              })}
            </div>
          </div>
        )}
        {/* Dimensions */}
        <div style={{fontSize:12,fontWeight:700,color:T.t3,marginBottom:10,textTransform:"uppercase",letterSpacing:".08em"}}>What we are assessing</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:8,marginBottom:22}} className="mob-grid1">
          {visibleDims.map(function(d,i){
            return(
              <div key={d.id} style={{padding:"12px 14px",background:T.page,border:"1px solid "+T.b1,borderRadius:10,borderLeft:"3px solid "+d.color}}>
                <div style={{fontSize:11,fontWeight:700,color:d.color,marginBottom:3}}>{d.name}</div>
                <div style={{fontSize:10,color:T.t3,lineHeight:1.45}}>{d.desc.split("—")[0].trim()}</div>
                {history[0]&&history[0].scores&&history[0].scores[d.id]&&(
                  <div style={{fontSize:10,fontWeight:700,color:history[0].scores[d.id]>=70?"#34C759":"#FF9500",marginTop:4}}>Previous: {history[0].scores[d.id]}%</div>
                )}
              </div>
            );
          })}
        </div>
        <button onClick={function(){setPhase("assess");loadDim(0);}}
          style={{padding:"13px 32px",borderRadius:10,border:"none",background:"linear-gradient(135deg,#7C3AED,#5B21B6)",color:"#FFFFFF",fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"inherit",boxShadow:"0 4px 16px rgba(124,58,237,0.3)",display:"flex",alignItems:"center",gap:8}}>
          {history.length>0?"Retake my capability diagnostic →":"Start my capability diagnostic →"}
        </button>
        <div style={{fontSize:11,color:T.t4,marginTop:8}}>Approx. {visibleDims.length * 3} minutes. Your answers are private and not shared with your manager.</div>
      </div>
    </div>
  );

  if(phase==="assess") return(
    <div className="fade-in" style={{flex:1,overflowY:"auto"}}>
      <div style={{background:"linear-gradient(135deg,#0A1828,#0D2040)",padding:"18px 28px",borderBottom:"1px solid rgba(255,255,255,0.06)"}}>
        <div style={{display:"flex",gap:3,marginBottom:10,overflow:"hidden"}}>
          {visibleDims.map((_,i)=><div key={i} style={{flex:1,height:3,borderRadius:2,background:i<dimIdx?"#7C3AED":i===dimIdx?"rgba(124,58,237,0.5)":"rgba(255,255,255,0.1)"}}/>)}
        </div>
        <div style={{fontSize:11,color:"rgba(255,255,255,0.4)"}}>Dimension {dimIdx+1} of {totalDims}</div>
        {dim&&<div style={{fontSize:18,fontWeight:800,color:"#FFFFFF",marginTop:2}}>{dim.name}</div>}
        {dim&&<div style={{fontSize:12,color:"rgba(255,255,255,0.4)",marginTop:2}}>{dim.desc}</div>}
      </div>
      <div style={{padding:"20px 28px"}}>
        {loading&&<div style={{display:"flex",alignItems:"center",gap:10,color:T.t3,fontSize:13,padding:"20px 0"}}><div style={{width:16,height:16,border:"2px solid rgba(124,58,237,0.3)",borderTopColor:"#7C3AED",borderRadius:"50%",animation:"spin 0.8s linear infinite"}}/> Generating personalised questions…</div>}
        {err&&(<div>
          <div style={{fontSize:12,color:"#FF3B30",background:"rgba(255,59,48,0.08)",border:"1px solid rgba(255,59,48,0.2)",borderRadius:8,padding:"10px 14px",marginBottom:12}}>{err}</div>
          <div style={{display:"flex",gap:8}}>
            <button onClick={()=>{setErr("");loadDim(dimIdx);}} style={{flex:1,padding:"10px",borderRadius:9,border:"1.5px solid #7C3AED",background:"rgba(124,58,237,0.08)",color:"#A78BFA",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>↻ Retry</button>
            {dimIdx<totalDims-1&&<button onClick={()=>{setErr("");setDimIdx(dimIdx+1);loadDim(dimIdx+1);}} style={{flex:1,padding:"10px",borderRadius:9,border:"1px solid "+T.b1,background:"transparent",color:T.t3,fontSize:13,cursor:"pointer",fontFamily:"inherit"}}>Skip →</button>}
          </div>
        </div>)}
        {currentQs&&!loading&&currentQs.map((q,qi)=>(
          <div key={qi} style={{marginBottom:16,background:T.page,border:"1px solid "+T.b1,borderRadius:12,padding:"16px 18px"}}>
            <div style={{fontSize:13,fontWeight:600,color:T.t1,marginBottom:12,lineHeight:1.5}}>{qi+1}. {q.q}</div>
            <div style={{display:"flex",flexDirection:"column",gap:7}}>
              {q.opts.map((opt,oi)=>{
                const picked=sel[dim.id+"_q"+qi]===oi;
                return<button key={oi} onClick={()=>answerQ(dim.id,qi,oi)}
                  style={{textAlign:"left",padding:"10px 14px",borderRadius:8,cursor:"pointer",fontFamily:"inherit",fontSize:12,lineHeight:1.4,transition:"all .12s",
                    border:"1.5px solid "+(picked?"#7C3AED":T.b1),
                    background:picked?"rgba(124,58,237,0.12)":T.surface,
                    color:picked?"#5B21B6":T.t2}}>
                  <span style={{fontWeight:600,marginRight:6,color:picked?"#7C3AED":T.t4}}>{["A","B","C","D"][oi]}.</span>{opt}
                </button>;
              })}
            </div>
          </div>
        ))}
        {currentQs&&!loading&&(
          <button onClick={nextDim} disabled={!currentDone}
            style={{width:"100%",padding:"12px",borderRadius:10,border:"none",fontSize:14,fontWeight:700,cursor:currentDone?"pointer":"not-allowed",fontFamily:"inherit",
              background:currentDone?"linear-gradient(135deg,#7C3AED,#5B21B6)":T.b2,
              color:currentDone?"#FFFFFF":T.t4}}>
            {dimIdx<totalDims-1?"Next dimension →":"See my capability report →"}
          </button>
        )}
      </div>
    </div>
  );

  if(phase==="results") return(
    <div className="fade-in" style={{flex:1,overflowY:"auto"}}>
      <div style={{background:"linear-gradient(135deg,#0A1828,#0D2040)",padding:"22px 28px",borderBottom:"1px solid rgba(255,255,255,0.06)"}}>
        <Badge label="Capability Report" color="#7C3AED" bg="rgba(124,58,237,0.15)"/>
        <div style={{display:"flex",alignItems:"center",gap:14,marginTop:10}}>
          <div>
            <div style={{fontSize:36,fontWeight:800,color:overallScore>=70?"#34C759":overallScore>=50?"#FF9500":"#FF3B30",letterSpacing:"-0.05em"}}>{overallScore}%</div>
            <div style={{fontSize:12,color:"rgba(255,255,255,0.4)"}}>Overall readiness</div>
          </div>
          {delta!==null&&<div style={{padding:"8px 14px",background:delta>=0?"rgba(52,199,89,0.12)":"rgba(255,59,48,0.12)",border:"1px solid "+(delta>=0?"rgba(52,199,89,0.25)":"rgba(255,59,48,0.25)"),borderRadius:10}}>
            <div style={{fontSize:18,fontWeight:800,color:delta>=0?"#34C759":"#FF3B30"}}>{delta>=0?"+":""}{delta}%</div>
            <div style={{fontSize:10,color:"rgba(255,255,255,0.35)"}}>vs last assessment</div>
          </div>}
        </div>
      </div>
      <div style={{padding:"18px 28px"}}>
        {/* Dimension scores vs benchmark */}
        <div style={{marginBottom:16}}>
          <div style={{fontSize:13,fontWeight:700,color:T.t2,marginBottom:10}}>Capability vs. Role Benchmark</div>
          {visibleDims.map(d=>{
            const sc=scores[d.id]||0;
            const bench=myBench[d.id]||60;
            const gap=sc-bench;
            return(
              <div key={d.id} style={{marginBottom:10}}>
                <div style={{display:"flex",justifyContent:"space-between",fontSize:11,marginBottom:4}}>
                  <span style={{fontWeight:600,color:T.t2}}>{d.name}</span>
                  <span style={{color:gap>=0?"#34C759":gap>=-15?"#FF9500":"#FF3B30",fontWeight:700}}>{sc}% {gap>=0?"▲+":"▼"}{Math.abs(gap)} vs benchmark</span>
                </div>
                <div style={{position:"relative",height:6,background:T.b1,borderRadius:4,overflow:"visible"}}>
                  <div style={{width:sc+"%",height:"100%",background:gap>=0?d.color:"#FF9500",borderRadius:4,transition:"width .5s"}}/>
                  <div style={{position:"absolute",top:-2,width:2,height:10,background:T.t2,left:bench+"%",borderRadius:1}} title={"Benchmark: "+bench+"%"}/>
                </div>
              </div>
            );
          })}
          <div style={{fontSize:10,color:T.t4,marginTop:6}}>│ = Role benchmark for {ROLE_DISPLAY[role]||role}</div>
        </div>

        {/* AI Development Plan */}
        {planLoading&&<div style={{display:"flex",alignItems:"center",gap:8,color:T.t3,fontSize:12,padding:"12px 0"}}><div style={{width:14,height:14,border:"2px solid rgba(124,58,237,0.3)",borderTopColor:"#7C3AED",borderRadius:"50%",animation:"spin 0.8s linear infinite"}}/> Generating your 90-day development plan…</div>}
        {aiPlan&&(
          <div style={{background:"rgba(124,58,237,0.08)",border:"1.5px solid rgba(124,58,237,0.25)",borderRadius:14,padding:"18px 20px",marginBottom:14}}>
            <div style={{fontSize:13,fontWeight:800,color:"#A78BFA",marginBottom:12}}>🎯 {aiPlan.headline}</div>
            <div style={{marginBottom:12}}>
              <div style={{fontSize:10,fontWeight:700,color:"rgba(124,58,237,0.7)",textTransform:"uppercase",letterSpacing:".08em",marginBottom:6}}>Priority actions (90 days)</div>
              {(aiPlan.priority_actions||[]).map((a,i)=><div key={i} style={{display:"flex",gap:8,fontSize:12,color:T.t2,marginBottom:5}}><span style={{color:"#7C3AED",fontWeight:700,flexShrink:0}}>{i+1}.</span>{a}</div>)}
            </div>
            <div style={{marginBottom:12}}>
              <div style={{fontSize:10,fontWeight:700,color:"rgba(52,199,89,0.7)",textTransform:"uppercase",letterSpacing:".08em",marginBottom:6}}>Quick wins (this week)</div>
              {(aiPlan.quick_wins||[]).map((w,i)=><div key={i} style={{display:"flex",gap:8,fontSize:12,color:T.t2,marginBottom:5}}><span style={{color:"#34C759",fontWeight:700,flexShrink:0}}>✓</span>{w}</div>)}
            </div>
            {aiPlan.warning&&<div style={{fontSize:11,color:"#FF9500",background:"rgba(255,149,0,0.08)",border:"1px solid rgba(255,149,0,0.2)",borderRadius:7,padding:"8px 12px"}}>⚠ {aiPlan.warning}</div>}
          </div>
        )}
        <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
          <button onClick={()=>onNav("learning")} style={{flex:1,minWidth:140,padding:"10px",borderRadius:9,border:"none",background:"linear-gradient(135deg,#7C3AED,#5B21B6)",color:"#FFF",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>
            Start my learning plan →
          </button>
          <button onClick={()=>{setPhase("intro");setDimIdx(0);setQs({});setSel({});setScores({});setAiPlan(null);}} style={{flex:1,minWidth:120,padding:"10px",borderRadius:9,border:"1px solid "+T.b1,background:"transparent",color:T.t2,fontSize:13,cursor:"pointer",fontFamily:"inherit"}}>
            Retake assessment
          </button>
        </div>
      </div>
    </div>
  );

  return null;
}


// ─── Missions view ────────────────────────────────────────────────────────────
/** @param {{progress:object,badges:string[],streak:number,xp:number,onNav:Function}} props @returns {JSX.Element} Missions/quests board. */
function MissionsView({progress,badges,streak,xp,onNav}){
  const [expanded,setExpanded]=useState(null);
  const modsDone=Object.keys(progress||{}).length;
  const bdgCount=(badges||[]).length;

  const missions=[
    {id:"ms1",icon:"🚀",name:"Foundation Sprint",type:"Sprint",xp:300,color:"#0070F3",
     desc:"Complete your first 3 modules and earn 300 LP to get started.",
     steps:[
       {label:"Complete 3 modules",done:modsDone>=3,nav:"learning"},
       {label:"Earn 300 LP",done:xp>=300,nav:"learning"},
       {label:"Complete 1 Daily Challenge",done:(badges||[]).includes("daily1"),nav:"dashboard"},
       {label:"View your Learning Path",done:true,nav:"learning"},
     ]},
    {id:"ms2",icon:"🌍",name:"African Enterprise Challenge",type:"Mastery",xp:500,color:"#34C759",
     desc:"Explore AI use cases across African industries.",
     steps:[
       {label:"Open Use Cases",done:true,nav:"usecases"},
       {label:"Read 3 use cases in detail",done:modsDone>=1,nav:"usecases"},
       {label:"Explore a Financial Services case",done:true,nav:"usecases"},
       {label:"Explore a Mining or Energy case",done:true,nav:"usecases"},
       {label:"Share a use case insight",done:false,nav:"usecases"},
     ]},
    {id:"ms3",icon:"🧠",name:"AI Readiness Assessment",type:"Assessment",xp:400,color:"#7C3AED",
     desc:"Complete your full Workforce Readiness Assessment across all capability dimensions.",
     steps:[
       {label:"Start the Readiness Assessment",done:true,nav:"assess"},
       {label:"Complete 4 dimensions",done:xp>=100,nav:"assess"},
       {label:"Get your capability score",done:xp>=200,nav:"assess"},
       {label:"Review your 90-day plan",done:xp>=300,nav:"assess"},
     ]},
    {id:"ms4",icon:"📅",name:"14-Day AI Habit",type:"Streak",xp:600,color:"#FF9500",
     desc:"Build a consistent AI learning habit over 14 consecutive days.",
     steps:[
       {label:"Day 1",done:(streak||0)>=1,nav:"dashboard"},
       {label:"Day 3",done:(streak||0)>=3,nav:"dashboard"},
       {label:"Day 7",done:(streak||0)>=7,nav:"dashboard"},
       {label:"Day 14",done:(streak||0)>=14,nav:"dashboard"},
     ]},
    {id:"ms5",icon:"⚡",name:"Prompt Lab Master",type:"Mastery",xp:350,color:"#5AC8FA",
     desc:"Use the Prompt Lab to generate 5 AI prompts relevant to your role.",
     steps:[
       {label:"Open the Prompt Lab",done:true,nav:"promptlab"},
       {label:"Try a prompt for your role",done:xp>=50,nav:"promptlab"},
       {label:"Copy a template to use at work",done:xp>=100,nav:"promptlab"},
       {label:"Generate 3 live AI responses",done:xp>=200,nav:"promptlab"},
       {label:"Complete all templates",done:xp>=350,nav:"promptlab"},
     ]},
    {id:"ms6",icon:"🏆",name:"Capability Trailblazer",type:"Elite",xp:1000,color:"#E8B84B",
     desc:"Complete 10 modules, earn 1000 LP, and unlock your first badge.",
     steps:[
       {label:"Complete 5 modules",done:modsDone>=5,nav:"learning"},
       {label:"Complete 10 modules",done:modsDone>=10,nav:"learning"},
       {label:"Earn 1000 LP",done:xp>=1000,nav:"learning"},
       {label:"Unlock 1 badge",done:bdgCount>=1,nav:"achievements"},
       {label:"Complete Readiness Assessment",done:xp>=400,nav:"assess"},
     ]},
  ];

  const totalXP=missions.reduce((a,m)=>a+m.xp,0);
  const earnedXP=missions.reduce((a,m)=>{
    const done=m.steps.filter(s=>s.done).length;
    const total=m.steps.length;
    return a+Math.round((done/total)*m.xp);
  },0);

  return(
    <div className="fade-in" style={{flex:1,overflowY:"auto",background:"#0C1524"}}>
      <div style={{background:"linear-gradient(135deg,#0A1828,#0D2040)",padding:"22px 28px",borderBottom:"1px solid rgba(255,255,255,0.06)"}}>
        <div style={{display:"flex",gap:8,marginBottom:10}}>
          <Badge label="Missions" color="#FF9500" bg="rgba(255,149,0,0.15)"/>
          <Badge label={earnedXP+" / "+totalXP+" XP earned"} color="rgba(255,255,255,0.4)" bg="rgba(255,255,255,0.07)"/>
        </div>
        <div style={{fontSize:21,fontWeight:800,color:"#FFFFFF",letterSpacing:"-0.03em",marginBottom:4}}>My Learning Challenges</div>
        <div style={{fontSize:12,color:"rgba(255,255,255,0.45)",marginBottom:14}}>Complete missions to earn XP, unlock badges, and track your AI transformation journey.</div>
        <div style={{background:"rgba(255,255,255,0.06)",borderRadius:8,height:6,overflow:"hidden"}}>
          <div style={{height:"100%",background:"linear-gradient(90deg,#FF9500,#E8B84B)",width:Math.round(earnedXP/totalXP*100)+"%",transition:"width .5s",borderRadius:8}}/>
        </div>
        <div style={{fontSize:10,color:"rgba(255,255,255,0.35)",marginTop:4}}>{Math.round(earnedXP/totalXP*100)}% overall mission progress</div>
      </div>
      <div style={{padding:"18px 24px"}}>
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {missions.map(m=>{
            const doneCt=m.steps.filter(s=>s.done).length;
            const pct=Math.round(doneCt/m.steps.length*100);
            const completed=pct===100;
            const isOpen=expanded===m.id;
            return(
              <div key={m.id} style={{background:"rgba(255,255,255,0.04)",border:"1px solid "+(completed?"rgba(52,199,89,0.3)":isOpen?m.color+"40":"rgba(255,255,255,0.07)"),borderRadius:12,overflow:"hidden",transition:"all .2s"}}>
                <div style={{padding:"14px 18px",cursor:"pointer",display:"flex",alignItems:"center",gap:12}} onClick={()=>setExpanded(isOpen?null:m.id)} role="button" tabIndex={0} onKeyDown={e=>{if(e.key==="Enter"||e.key===" ")setExpanded(isOpen?null:m.id);}}>
                  <div style={{width:40,height:40,borderRadius:10,background:m.color+"20",border:"1px solid "+m.color+"40",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>{m.icon}</div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:3,flexWrap:"wrap"}}>
                      <span style={{fontSize:13,fontWeight:700,color:"rgba(255,255,255,0.9)"}}>{m.name}</span>
                      <span style={{fontSize:9,fontWeight:700,padding:"1px 7px",borderRadius:10,background:m.color+"20",color:m.color}}>{m.type}</span>
                      {completed&&<span style={{fontSize:9,fontWeight:700,padding:"1px 7px",borderRadius:10,background:"rgba(52,199,89,0.2)",color:"#34C759"}}>COMPLETE</span>}
                    </div>
                    <div style={{fontSize:11,color:"rgba(255,255,255,0.4)",marginBottom:6}}>{m.desc}</div>
                    <div style={{display:"flex",alignItems:"center",gap:8}}>
                      <div style={{flex:1,background:"rgba(255,255,255,0.07)",borderRadius:4,height:4,overflow:"hidden"}}>
                        <div style={{height:"100%",background:completed?"#34C759":m.color,width:pct+"%",transition:"width .4s",borderRadius:4}}/>
                      </div>
                      <span style={{fontSize:10,color:"rgba(255,255,255,0.4)",flexShrink:0}}>{doneCt}/{m.steps.length}</span>
                      <span style={{fontSize:10,fontWeight:700,color:m.color,flexShrink:0}}>+{m.xp} XP</span>
                    </div>
                  </div>
                  <div style={{fontSize:12,color:"rgba(255,255,255,0.3)",flexShrink:0}}>{isOpen?"▲":"▼"}</div>
                </div>
                {isOpen&&(
                  <div style={{borderTop:"1px solid rgba(255,255,255,0.06)",padding:"12px 18px 14px",background:"rgba(0,0,0,0.15)"}}>
                    {m.steps.map((step,si)=>(
                      <div key={si} style={{display:"flex",alignItems:"center",gap:10,padding:"7px 0",borderBottom:si<m.steps.length-1?"1px solid rgba(255,255,255,0.04)":"none"}}>
                        <div style={{width:20,height:20,borderRadius:"50%",background:step.done?"#34C759":"rgba(255,255,255,0.08)",border:"1.5px solid "+(step.done?"#34C759":"rgba(255,255,255,0.15)"),display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                          {step.done&&<span style={{fontSize:10,color:"#FFFFFF"}}>✓</span>}
                        </div>
                        <span style={{flex:1,fontSize:12,color:step.done?"rgba(255,255,255,0.6)":"rgba(255,255,255,0.85)",textDecoration:step.done?"line-through":"none"}}>{step.label}</span>
                        {!step.done&&step.nav&&(
                          <button onClick={()=>onNav(step.nav)} style={{fontSize:10,fontWeight:700,color:m.color,background:m.color+"15",border:"1px solid "+m.color+"30",borderRadius:6,padding:"3px 9px",cursor:"pointer",fontFamily:"inherit",flexShrink:0}}>
                            Go →
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}


async function readOrgContext(){
  try{
    var res=await window.storage.get("cap:org_context",true);
    if(res&&res.value) return JSON.parse(res.value);
  }catch(e){}
  return null;
}


// ─── Use Case Library ────────────────────────────────────────────────────────
const ALL_USE_CASES=[
  // ── FINANCIAL SERVICES ──────────────────────────────────────────────────
  {id:"uc1",industry:["Financial Services"],role:["executive","functional"],fn:["Risk & Compliance"],cat:"governance",title:"AI Credit Risk Scoring",challenge:"Manual credit assessment takes 3-5 days and uses limited data points.",solution:"ML models analyse 500+ variables including behavioural data to score credit risk in real time.",impact:"40% reduction in default rates · 60% faster approvals",complexity:"High",region:"South Africa"},
  {id:"uc2",industry:["Financial Services"],role:["manager","learner"],fn:["Risk & Compliance"],cat:"governance",title:"Automated KYC and AML Compliance",challenge:"Manual KYC creates compliance bottlenecks and human error risk.",solution:"NLP and computer vision extract identity documents and screen watchlists in real time.",impact:"80% faster onboarding · 95% reduction in false positives",complexity:"High",region:"South Africa"},
  {id:"uc3",industry:["Financial Services"],role:["functional","manager"],fn:["Sales & Customer Experience"],cat:"adoption",title:"AI Fraud Detection at Scale",challenge:"Fraud patterns evolve faster than rule-based systems can adapt.",solution:"Real-time ML models detect anomalies across millions of daily transactions.",impact:"R2.1B fraud prevented annually · 99.2% accuracy",complexity:"High",region:"Africa"},
  {id:"uc4",industry:["Financial Services"],role:["learner","emerging"],fn:["Finance & Treasury"],cat:"productivity",title:"Automated Financial Reporting",challenge:"Month-end reporting requires 200+ analyst hours of data consolidation.",solution:"AI agents pull data, generate commentary and flag variances automatically.",impact:"75% reduction in reporting time · 3x faster close",complexity:"Medium",region:"Global"},
  {id:"uc5",industry:["Financial Services"],role:["executive","functional"],fn:["Marketing & Brand"],cat:"impact",title:"Hyper-Personalised Banking Offers",challenge:"Generic product offers result in under 2% conversion rates.",solution:"ML models predict the next-best product for each customer using transaction history.",impact:"+23% product uptake · 18% increase in NPS",complexity:"Medium",region:"Africa"},
  {id:"uc6",industry:["Financial Services"],role:["manager","learner"],fn:["Risk & Compliance"],cat:"adoption",title:"Regulatory Change Management AI",challenge:"Keeping pace with POPIA, FSCA, Basel IV requires large compliance teams.",solution:"NLP monitors regulatory feeds, maps changes to policies and auto-drafts gap assessments.",impact:"60% reduction in compliance overhead · Zero regulatory fines",complexity:"High",region:"South Africa"},
  {id:"uc7",industry:["Financial Services"],role:["learner"],fn:["Finance & Treasury"],cat:"productivity",title:"AI-Powered Investment Research",challenge:"Analysts spend 60% of time on data gathering, leaving little time for insight.",solution:"AI scans market data, news, filings and earnings calls to produce structured research briefs.",impact:"5x analyst productivity · More alpha-generating insights",complexity:"Medium",region:"Global"},
  // ── HEALTHCARE ──────────────────────────────────────────────────────────
  {id:"uc8",industry:["Healthcare & Life Sciences"],role:["executive","functional"],fn:["Technology & Engineering"],cat:"impact",title:"AI-Assisted Diagnostic Imaging",challenge:"Radiologist shortage causes 6-8 week diagnostic delays in public facilities.",solution:"Computer vision models screen X-rays and MRI scans, flagging urgent cases for radiologist review.",impact:"78% faster diagnosis · 94% sensitivity in TB detection",complexity:"High",region:"South Africa"},
  {id:"uc9",industry:["Healthcare & Life Sciences"],role:["manager","learner"],fn:["Operations & Supply Chain"],cat:"productivity",title:"Predictive Medicines Supply Chain",challenge:"Drug stockouts at clinics affect 30% of patients monthly in rural facilities.",solution:"ML forecasting models predict demand by facility and auto-trigger reorders.",impact:"85% reduction in stockouts · R180M annual savings",complexity:"Medium",region:"Africa"},
  {id:"uc10",industry:["Healthcare & Life Sciences"],role:["functional","manager"],fn:["Sales & Customer Experience"],cat:"adoption",title:"Patient Readmission Risk Prediction",challenge:"Unplanned readmissions cost R28,000 per episode and affect 15% of patients.",solution:"AI analyses clinical and social determinants to identify high-risk patients at discharge.",impact:"34% reduction in readmissions · 22% lower cost per episode",complexity:"High",region:"Global"},
  {id:"uc11",industry:["Healthcare & Life Sciences"],role:["learner"],fn:["Technology & Engineering"],cat:"productivity",title:"Clinical Note Automation",challenge:"Clinicians spend 34% of their time on documentation instead of patient care.",solution:"Speech-to-text AI with medical NLP generates structured clinical notes in real time.",impact:"2 hours saved per clinician daily · Higher patient throughput",complexity:"Medium",region:"Global"},
  // ── MINING AND ENERGY ───────────────────────────────────────────────────
  {id:"uc12",industry:["Mining & Resources"],role:["executive","functional"],fn:["Operations & Supply Chain"],cat:"impact",title:"Predictive Maintenance for Heavy Equipment",challenge:"Unplanned equipment downtime costs a mid-sized mine R15M per day.",solution:"IoT sensor data and ML models predict equipment failure 72 hours in advance.",impact:"55% reduction in downtime · R420M annual production savings",complexity:"High",region:"South Africa"},
  {id:"uc13",industry:["Mining & Resources"],role:["manager","learner"],fn:["Risk & Compliance"],cat:"governance",title:"AI Stope Safety Monitoring",challenge:"Worker safety incidents in underground operations cause fatalities.",solution:"Computer vision and wearable sensors detect unsafe conditions in real time.",impact:"Zero fatalities target · 67% reduction in near-misses",complexity:"High",region:"South Africa"},
  {id:"uc14",industry:["Energy & Utilities"],role:["functional","manager"],fn:["Operations & Supply Chain"],cat:"impact",title:"Grid Load Forecasting",challenge:"Load-shedding unpredictability creates planning chaos for industrial consumers.",solution:"ML models forecast grid load and renewable generation, enabling smart scheduling.",impact:"22% reduction in peak-demand charges · R90M annual savings",complexity:"Medium",region:"South Africa"},
  {id:"uc15",industry:["Mining & Resources"],role:["learner"],fn:["Technology & Engineering"],cat:"adoption",title:"AI Geological Exploration",challenge:"Traditional geological surveys are slow and miss subtle mineral deposits.",solution:"AI analyses seismic and satellite data to identify prospective mining zones with greater accuracy.",impact:"40% reduction in exploration costs · Higher discovery rates",complexity:"High",region:"Africa"},
  // ── RETAIL ──────────────────────────────────────────────────────────────
  {id:"uc16",industry:["Retail & Consumer Goods"],role:["executive","functional"],fn:["Operations & Supply Chain"],cat:"impact",title:"AI-Driven Demand Forecasting",challenge:"Seasonal demand spikes cause 18% overstock and 12% stockout rates.",solution:"ML demand forecasting integrates weather, events and social sentiment to predict demand by SKU.",impact:"35% reduction in stockouts · 28% lower holding costs",complexity:"Medium",region:"Africa"},
  {id:"uc17",industry:["Retail & Consumer Goods"],role:["manager","learner"],fn:["Marketing & Brand"],cat:"adoption",title:"Personalised Product Recommendations",challenge:"Generic product pages convert at 1.8%, far below industry benchmarks.",solution:"Collaborative filtering and deep learning personalise homepages and email content per shopper.",impact:"+31% basket size · 2.4x conversion rate uplift",complexity:"Medium",region:"Global"},
  {id:"uc18",industry:["Retail & Consumer Goods"],role:["learner"],fn:["Operations & Supply Chain"],cat:"productivity",title:"Automated Planogram Compliance",challenge:"Manual shelf audits take 45 minutes per store and miss 30% of violations.",solution:"Computer vision on store cameras detects planogram deviations and alerts store managers.",impact:"90% compliance rate · R2.2M reduction in audit costs",complexity:"Medium",region:"Global"},
  // ── GOVERNMENT ──────────────────────────────────────────────────────────
  {id:"uc19",industry:["Government & Public Sector"],role:["executive","functional"],fn:["Risk & Compliance"],cat:"governance",title:"AI Grant Fraud Detection",challenge:"Fraudulent grant applications cost government departments R2.3B annually.",solution:"NLP and network analysis identify anomalies in grant applications and flag related-party transactions.",impact:"R1.8B in fraud prevented · 4x detection rate improvement",complexity:"High",region:"South Africa"},
  {id:"uc20",industry:["Government & Public Sector"],role:["manager","learner"],fn:["Sales & Customer Experience"],cat:"adoption",title:"Citizen Service AI Assistant",challenge:"Call centres handle 2M+ citizen enquiries monthly with 40-minute average wait times.",solution:"NLP chatbot handles 65% of routine enquiries 24/7, covering status checks, forms and renewals.",impact:"40% reduction in call volume · 4.2/5 citizen satisfaction",complexity:"Medium",region:"South Africa"},
  // ── TELECOMMUNICATIONS ───────────────────────────────────────────────────
  {id:"uc21",industry:["Telecommunications"],role:["executive","functional"],fn:["Sales & Customer Experience"],cat:"impact",title:"AI Churn Prediction and Prevention",challenge:"Monthly churn of 3.2% costs a mid-sized telco R180M in lost revenue quarterly.",solution:"ML models identify churn signals 30 days in advance and trigger personalised retention offers.",impact:"28% churn reduction · R50M revenue protected per quarter",complexity:"Medium",region:"Africa"},
  {id:"uc22",industry:["Telecommunications"],role:["manager","learner"],fn:["Technology & Engineering"],cat:"productivity",title:"Network Anomaly Detection",challenge:"Network faults take 4.5 hours to diagnose, causing SLA breaches.",solution:"AI monitors network telemetry in real time and automatically isolates fault sources.",impact:"73% faster fault resolution · 99.99% network availability",complexity:"High",region:"Global"},
  // ── MANUFACTURING ────────────────────────────────────────────────────────
  {id:"uc23",industry:["Manufacturing & Engineering"],role:["executive","functional"],fn:["Operations & Supply Chain"],cat:"impact",title:"AI Quality Control",challenge:"Manual inspection misses 8% of defects, resulting in costly customer returns.",solution:"Computer vision inspects 100% of production output at line speed.",impact:"99.6% defect detection · 65% reduction in returns",complexity:"High",region:"Global"},
  {id:"uc24",industry:["Manufacturing & Engineering"],role:["manager","learner"],fn:["Operations & Supply Chain"],cat:"adoption",title:"AI Production Scheduling Optimisation",challenge:"Complex scheduling with 500+ constraints leads to 23% machine underutilisation.",solution:"Reinforcement learning optimises production sequences balancing capacity, due dates and changeover.",impact:"18% OEE improvement · R95M additional throughput annually",complexity:"High",region:"Global"},
  // ── CROSS-INDUSTRY: EXECUTIVE ────────────────────────────────────────────
  {id:"uc25",industry:[],role:["executive"],fn:[],cat:"governance",title:"AI Risk Register for the Board",challenge:"Boards lack a structured framework to oversee AI risk across the enterprise.",solution:"AI governance framework maps risks including bias, hallucination and data leakage to board controls.",impact:"Regulatory compliance · Reduced AI liability exposure",complexity:"Medium",region:"Global"},
  {id:"uc26",industry:[],role:["executive"],fn:[],cat:"impact",title:"Enterprise AI Roadmap Development",challenge:"Ad hoc AI pilots create technology debt and fail to deliver enterprise value.",solution:"Structured capability assessment and use case prioritisation matrix produces a funded 3-year AI roadmap.",impact:"3x ROI on AI investments · Aligned board and executive team",complexity:"Medium",region:"Global"},
  {id:"uc27",industry:[],role:["executive","functional"],fn:[],cat:"governance",title:"AI Ethics and Responsible AI Framework",challenge:"Organisations deploying AI face reputational and regulatory risk from biased or unexplainable models.",solution:"Structured responsible AI framework with bias audits, explainability requirements and governance reviews.",impact:"Regulatory compliance · 70% reduction in AI-related incidents",complexity:"Medium",region:"Global"},
  // ── CROSS-INDUSTRY: LEADERSHIP ───────────────────────────────────────────
  {id:"uc28",industry:[],role:["functional","manager"],fn:["HR & People"],cat:"adoption",title:"AI-Powered Talent Acquisition",challenge:"Time-to-hire averages 62 days and 35% of hires leave within 12 months.",solution:"AI screens CVs, ranks candidates, schedules interviews and predicts culture fit.",impact:"45% faster hiring · 28% improvement in 12-month retention",complexity:"Medium",region:"Global"},
  {id:"uc29",industry:[],role:["functional","manager"],fn:["HR & People"],cat:"impact",title:"Workforce Skills Intelligence",challenge:"Skills gaps are invisible until they cause project failures or attrition.",solution:"AI aggregates skill signals from systems, certifications and projects to build dynamic skills profiles.",impact:"Real-time skills visibility · 40% reduction in reskilling spend",complexity:"High",region:"Global"},
  {id:"uc30",industry:[],role:["functional","manager"],fn:["Marketing & Brand"],cat:"productivity",title:"AI Content Generation at Scale",challenge:"Content teams produce 50 assets per month but need 500 for personalisation at scale.",solution:"Generative AI creates on-brand content variants across channels, reviewed by humans before publishing.",impact:"10x content output · 60% reduction in production cost",complexity:"Low",region:"Global"},
  {id:"uc31",industry:[],role:["manager","learner"],fn:["Finance & Treasury"],cat:"productivity",title:"Intelligent AP and AR Automation",challenge:"Accounts payable processes 10,000 invoices per month with a 5% error rate.",solution:"AI extracts invoice data, matches POs, flags exceptions and auto-posts routine transactions.",impact:"85% straight-through processing · 3-day payment cycle",complexity:"Medium",region:"Global"},
  {id:"uc32",industry:[],role:["functional","manager"],fn:["Risk & Compliance"],cat:"governance",title:"Compliance Monitoring Automation",challenge:"Compliance monitoring is manual, reactive and misses emerging risks.",solution:"AI continuously monitors transactions, communications and processes to flag compliance breaches.",impact:"90% reduction in compliance incidents · Real-time risk visibility",complexity:"High",region:"Global"},
  // ── CROSS-INDUSTRY: PRACTITIONERS ────────────────────────────────────────
  {id:"uc33",industry:[],role:["learner","emerging"],fn:[],cat:"productivity",title:"AI Meeting Assistant",challenge:"Professionals spend 31 hours per month in meetings and lose 60% of action items.",solution:"AI transcribes meetings, extracts decisions and action items, and sends follow-ups automatically.",impact:"3 hours saved per week · 95% action item capture rate",complexity:"Low",region:"Global"},
  {id:"uc34",industry:[],role:["learner","emerging"],fn:[],cat:"adoption",title:"AI-Powered Research Synthesis",challenge:"Analysts spend 40% of their time searching and synthesising information from multiple sources.",solution:"AI scans documents, databases and web sources to produce structured research briefs in minutes.",impact:"70% reduction in research time · Higher quality insights",complexity:"Low",region:"Global"},
  {id:"uc35",industry:[],role:["learner","emerging"],fn:[],cat:"productivity",title:"Automated Report Writing",challenge:"Monthly reports take 2 days to compile, leaving little time for analysis.",solution:"AI aggregates data, generates draft commentary and applies templates so analysts focus on insights.",impact:"80% faster reporting · More strategic analyst output",complexity:"Low",region:"Global"},
  {id:"uc36",industry:[],role:["learner","manager"],fn:[],cat:"adoption",title:"AI for Project Management",challenge:"Project managers spend 60% of time on status updates and admin tasks.",solution:"AI tools automate scheduling, risk flagging, status reporting and stakeholder updates.",impact:"40% reduction in admin time · Higher project delivery rates",complexity:"Low",region:"Global"},
  {id:"uc37",industry:[],role:["learner","emerging"],fn:[],cat:"productivity",title:"Generative AI for Presentations",challenge:"Creating executive-level presentations takes 3-4 hours of analyst time per deck.",solution:"AI generates structured slide content, talking points and visuals from a prompt or data file.",impact:"80% faster deck creation · More consistent quality",complexity:"Low",region:"Global"},
  {id:"uc38",industry:[],role:["manager","functional"],fn:["HR & People"],cat:"adoption",title:"AI Learning and Development Personalisation",challenge:"Generic L and D programmes achieve 23% completion rates and low retention.",solution:"AI personalises learning pathways based on role, skills gaps and learning style, delivering bite-sized content.",impact:"67% higher completion rates · 3x knowledge retention",complexity:"Medium",region:"Global"},
  {id:"uc39",industry:[],role:["executive","functional"],fn:["Operations & Supply Chain"],cat:"impact",title:"AI-Driven Strategic Scenario Planning",challenge:"Strategy teams rely on static models that cannot process fast-changing market conditions.",solution:"AI simulates multiple strategic scenarios in real time, incorporating live market and competitor data.",impact:"5x faster scenario analysis · Better-informed strategic decisions",complexity:"High",region:"Global"},
  {id:"uc40",industry:[],role:["learner"],fn:["Technology & Engineering"],cat:"adoption",title:"AI Code Assistant for Developers",challenge:"Developers spend 35% of time on boilerplate code, documentation and debugging.",solution:"AI coding assistants auto-complete code, generate tests, explain legacy code and find bugs.",impact:"35% productivity improvement · 50% fewer bugs in production",complexity:"Low",region:"Global"},
  // ── DATA & ANALYTICS FUNCTION (Cross-industry) ───────────────────────────
  {id:"uc41",industry:[],role:["learner","manager"],fn:["Data Engineering","Data & Analytics"],cat:"productivity",title:"AI-Accelerated Data Pipeline Development",challenge:"Data engineers spend 60% of time writing boilerplate ETL code and fixing data quality issues.",solution:"AI code assistants generate pipeline code, write data quality tests and explain complex transformations.",impact:"50% faster pipeline development · 80% reduction in data bugs",complexity:"Medium",region:"Global"},
  {id:"uc42",industry:[],role:["learner","functional"],fn:["Data Science"],cat:"adoption",title:"Automated Feature Engineering for ML",challenge:"Feature engineering takes 60-70% of a data scientist's time on each project.",solution:"AutoML and AI tools automatically identify, create and select the most predictive features from raw data.",impact:"3x faster model development · 15-20% improvement in model accuracy",complexity:"Medium",region:"Global"},
  {id:"uc43",industry:[],role:["learner","manager"],fn:["Business Intelligence","Data Visualisation"],cat:"productivity",title:"Natural Language to Dashboard",challenge:"Non-technical stakeholders wait weeks for BI reports and struggle to self-serve.",solution:"Natural language query interfaces let business users ask questions in plain English and get instant visual answers.",impact:"90% reduction in ad-hoc report requests · Self-service analytics at scale",complexity:"Low",region:"Global"},
  {id:"uc44",industry:["Financial Services"],role:["learner","manager"],fn:["Data Science","Risk & Compliance"],cat:"governance",title:"Explainable AI for Credit Decisions",challenge:"Regulators require financial institutions to explain every AI-driven credit decision to applicants.",solution:"SHAP and LIME explainability frameworks generate plain-language explanations for each model decision.",impact:"Full regulatory compliance · 40% reduction in credit decision disputes",complexity:"High",region:"South Africa"},
  {id:"uc45",industry:["Retail & Consumer Goods"],role:["learner"],fn:["Data Science","Data Analytics"],cat:"impact",title:"Customer Lifetime Value Modelling in Retail",challenge:"Retail data teams cannot predict which customers will generate long-term value versus one-time buyers.",solution:"ML models trained on transaction and behavioural data predict CLV and segment customers for targeted campaigns.",impact:"+28% marketing ROI · 22% improvement in customer retention spend",complexity:"Medium",region:"Africa"},
  {id:"uc46",industry:[],role:["learner","emerging"],fn:["Data Architecture","Data Engineering"],cat:"governance",title:"AI-Powered Data Governance and Cataloguing",challenge:"Large organisations have thousands of data assets with no clear ownership, lineage or quality metadata.",solution:"AI scans data sources, auto-generates metadata, maps data lineage and flags quality issues in a centralised catalogue.",impact:"80% reduction in time to find trusted data · POPIA and GDPR compliance",complexity:"High",region:"South Africa"},
  {id:"uc47",industry:["Banking","Financial Services"],role:["learner","manager"],fn:["Data Science","Risk & Compliance"],cat:"governance",title:"Real-Time Transaction Monitoring with ML",challenge:"Rule-based AML monitoring generates 95% false positives, overwhelming compliance teams.",solution:"ML models learn normal customer behaviour patterns and flag only genuinely anomalous transactions.",impact:"70% reduction in false positives · R15M annual compliance cost saving",complexity:"High",region:"South Africa"},
  {id:"uc48",industry:["Retail & Consumer Goods","Manufacturing & Engineering"],role:["learner"],fn:["Data Engineering","Operations & Supply Chain"],cat:"impact",title:"IoT Data Streaming and Analytics",challenge:"Retail and manufacturing IoT devices generate terabytes of data that cannot be processed and actioned in real time.",solution:"Streaming data pipelines with AI anomaly detection enable real-time alerts on equipment, inventory and footfall.",impact:"Real-time operational visibility · 35% reduction in waste",complexity:"High",region:"Global"},
  {id:"uc49",industry:[],role:["learner","emerging"],fn:["Business Intelligence","Data Visualisation"],cat:"adoption",title:"AI-Generated Executive Dashboards",challenge:"Building executive dashboards requires weeks of BI developer time and constant iteration.",solution:"AI tools generate complete dashboard layouts from a description, with auto-refreshing KPIs and narrative commentary.",impact:"80% faster dashboard delivery · Business users build their own dashboards",complexity:"Low",region:"Global"},
  {id:"uc50",industry:[],role:["manager","functional"],fn:["Data & Analytics","Strategy & Corporate Development"],cat:"impact",title:"AI Strategy for Data Teams",challenge:"Data teams deliver outputs but struggle to connect their work to measurable business value.",solution:"AI strategy framework maps data team capabilities to business outcomes, prioritises use cases by ROI, and tracks value realisation.",impact:"3x increase in business stakeholder satisfaction · Clear data team ROI",complexity:"Medium",region:"Global"},

];

/** @param {{role:string,industry:string,userFn:string}} opts @returns {object[]} Use cases filtered to the learner's context. */
function filterUseCases({role,industry,userFn}){
  return ALL_USE_CASES.filter(function(uc){
    var indOk=!uc.industry.length||!industry||uc.industry.some(function(i){return i===industry;});
    var roleOk=!uc.role.length||!role||uc.role.includes(role);
    var fnOk=!uc.fn.length||!userFn||uc.fn.includes(userFn);
    return indOk&&roleOk&&fnOk;
  }).slice(0,16);
}

/** @param {{industry:string,userFn:string,role:string,onNav:Function}} props @returns {JSX.Element} Browseable AI use-case library filtered to context. */
function UseCaseLibrary({industry,userFn,role,onNav}){
  var [orgCtx,setOrgCtx]=useState(null);
  var [sel,setSel]=useState(null);
  var [filter,setFilter]=useState("all");
  var [searchQ,setSearchQ]=useState("");

  useEffect(function(){
    var live=true;
    readOrgContext().then(function(ctx){if(live&&ctx)setOrgCtx(ctx);}).catch(function(){});
    return function(){live=false;};
  },[]);

  var roleLabel=(ROLE_DISPLAY||{})[role]||role||"professional";
  var CAT_COLORS={impact:"#34C759",adoption:"#0070F3",governance:"#FF9500",productivity:"#7C3AED"};
  var COMP_COLOR={Low:"#34C759",Medium:"#FF9500",High:"#FF3B30"};
  var cases=filterUseCases({role:role,industry:industry,userFn:userFn});
  var filtered=cases.filter(function(uc){
    var matchCat=filter==="all"||uc.cat===filter;
    var matchQ=!searchQ||uc.title.toLowerCase().includes(searchQ.toLowerCase())||uc.challenge.toLowerCase().includes(searchQ.toLowerCase());
    return matchCat&&matchQ;
  });

  return(
    <div className="fade-in" style={{flex:1,overflowY:"auto",background:"#0C1524"}}>
      <div style={{background:"linear-gradient(135deg,#0A1828,#0D2040)",padding:"22px 28px",borderBottom:"1px solid rgba(255,255,255,0.06)"}}>
        <div style={{display:"flex",gap:7,marginBottom:10,flexWrap:"wrap"}}>
          <Badge label="AI at Work" color="#5AC8FA" bg="rgba(90,200,250,0.15)"/>
          {industry&&<Badge label={industry} color="rgba(255,255,255,0.4)" bg="rgba(255,255,255,0.07)"/>}
          {userFn&&<Badge label={userFn} color="rgba(255,255,255,0.4)" bg="rgba(255,255,255,0.07)"/>}
          <Badge label={filtered.length+" cases"} color="#7C3AED" bg="rgba(124,58,237,0.12)"/>
        </div>
        <div style={{fontSize:21,fontWeight:800,color:"#FFFFFF",letterSpacing:"-0.03em",marginBottom:3}}>AI in Action</div>
        <div style={{fontSize:12,color:"rgba(255,255,255,0.45)",marginBottom:12}}>Curated AI use cases for {roleLabel}{industry?" in "+industry:""}{userFn?" ("+userFn+")":""}. Click any case for full details.</div>
        {orgCtx&&orgCtx.challenges&&(
          <div style={{padding:"8px 12px",background:"rgba(232,184,75,0.08)",border:"1px solid rgba(232,184,75,0.2)",borderRadius:8,marginBottom:12,fontSize:11,color:"rgba(232,184,75,0.8)"}}>
            Org context: {orgCtx.challenges.slice(0,100)}{orgCtx.challenges.length>100?"...":""}
          </div>
        )}
        <div style={{display:"flex",gap:7,flexWrap:"wrap",alignItems:"center"}}>
          <input value={searchQ} onChange={function(e){setSearchQ(e.target.value);}} placeholder="Search..." style={{flex:1,minWidth:120,padding:"6px 11px",border:"1px solid rgba(255,255,255,0.12)",borderRadius:8,fontSize:"16px",color:"#FFF",background:"rgba(255,255,255,0.06)",fontFamily:"inherit",outline:"none"}}/>
          {[["all","All"],["impact","Impact"],["adoption","Adoption"],["governance","Governance"],["productivity","Productivity"]].map(function(kl){
            var k=kl[0],l=kl[1];
            return <button key={k} onClick={function(){setFilter(k);}} style={{padding:"4px 10px",borderRadius:20,border:"1px solid "+(filter===k?"#5AC8FA":"rgba(255,255,255,0.12)"),background:filter===k?"rgba(90,200,250,0.15)":"transparent",color:filter===k?"#5AC8FA":"rgba(255,255,255,0.4)",fontSize:11,fontWeight:filter===k?700:400,cursor:"pointer",fontFamily:"inherit",whiteSpace:"nowrap"}}>{l}</button>;
          })}
        </div>
      </div>
      <div style={{padding:"16px 22px"}}>
        {sel&&(
          <div style={{background:"rgba(255,255,255,0.05)",border:"1.5px solid rgba(90,200,250,0.3)",borderRadius:14,padding:"16px 18px",marginBottom:14}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
              <div style={{flex:1,paddingRight:10}}>
                <div style={{display:"flex",gap:6,marginBottom:6,flexWrap:"wrap"}}>
                  <span style={{fontSize:10,fontWeight:700,padding:"2px 8px",borderRadius:20,background:(CAT_COLORS[sel.cat]||"#5AC8FA")+"20",color:CAT_COLORS[sel.cat]||"#5AC8FA",textTransform:"uppercase"}}>{sel.cat}</span>
                  <span style={{fontSize:10,color:"rgba(255,255,255,0.3)",background:"rgba(255,255,255,0.06)",padding:"2px 8px",borderRadius:20}}>{sel.region}</span>
                  <span style={{fontSize:10,fontWeight:700,color:COMP_COLOR[sel.complexity],background:(COMP_COLOR[sel.complexity]||"#FF9500")+"15",padding:"2px 8px",borderRadius:20}}>{sel.complexity}</span>
                </div>
                <div style={{fontSize:16,fontWeight:800,color:"#FFF",letterSpacing:"-0.02em"}}>{sel.title}</div>
              </div>
              <button onClick={function(){setSel(null);}} aria-label="Close" style={{background:"rgba(255,255,255,0.07)",border:"none",cursor:"pointer",color:"rgba(255,255,255,0.5)",width:26,height:26,borderRadius:"50%",fontSize:14,flexShrink:0}}>x</button>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}} className="mob-grid1">
              {[{l:"Challenge",v:sel.challenge,c:"#FF9500"},{l:"AI Solution",v:sel.solution,c:"#5AC8FA"},{l:"Business Impact",v:sel.impact,c:"#34C759"}].map(function(s,i){
                return <div key={i} style={{padding:"10px 12px",background:"rgba(255,255,255,0.04)",borderRadius:9,border:"1px solid rgba(255,255,255,0.07)"}}>
                  <div style={{fontSize:9,fontWeight:700,color:s.c,textTransform:"uppercase",letterSpacing:".08em",marginBottom:4}}>{s.l}</div>
                  <div style={{fontSize:11,color:"rgba(255,255,255,0.75)",lineHeight:1.55}}>{s.v}</div>
                </div>;
              })}
            </div>
          </div>
        )}
        {filtered.length===0?(
          <div style={{textAlign:"center",padding:"32px 16px",color:"rgba(255,255,255,0.3)"}}>
            <div style={{fontSize:12,marginBottom:4}}>No matching use cases</div>
            <div style={{fontSize:11}}>Try clearing the filter or search</div>
          </div>
        ):(
          <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:10}} className="mob-grid1">
            {filtered.map(function(uc){
              var isSelected=sel&&sel.id===uc.id;
              return(
                <div key={uc.id} onClick={function(){setSel(isSelected?null:uc);}} role="button" tabIndex={0} onKeyDown={function(e){if(e.key==="Enter"||e.key===" ")setSel(isSelected?null:uc);}}
                  style={{background:isSelected?"rgba(90,200,250,0.08)":"rgba(255,255,255,0.04)",border:"1px solid "+(isSelected?"rgba(90,200,250,0.4)":"rgba(255,255,255,0.07)"),borderRadius:12,padding:"13px 15px",cursor:"pointer",transition:"all .15s"}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:5,flexWrap:"wrap",gap:3}}>
                    <span style={{fontSize:9,fontWeight:700,padding:"2px 7px",borderRadius:10,background:(CAT_COLORS[uc.cat]||"#5AC8FA")+"20",color:CAT_COLORS[uc.cat]||"#5AC8FA",textTransform:"uppercase"}}>{uc.cat}</span>
                    <span style={{fontSize:9,color:"rgba(255,255,255,0.3)"}}>{uc.region}</span>
                  </div>
                  <div style={{fontSize:13,fontWeight:700,color:"rgba(255,255,255,0.85)",lineHeight:1.3,marginBottom:4}}>{uc.title}</div>
                  <div style={{fontSize:11,color:"rgba(255,255,255,0.4)",lineHeight:1.4,marginBottom:7}}>{uc.challenge}</div>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <span style={{fontSize:10,fontWeight:700,color:"#34C759"}}>{uc.impact.split(" · ")[0]}</span>
                    <span style={{fontSize:9,color:COMP_COLOR[uc.complexity]||"#FF9500"}}>{uc.complexity}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}


// ─── Netflix-Style Recommendation Engine ──────────────────────────────────────
/** @param {{role:string,industry:string,userFn:string,progress:object,xp:number}} opts @returns {object[]} Ranked recommended modules for the learner. */
function useRecommendations({role, industry, userFn, progress, xp}){
  const [recs,    setRecs]    = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(()=>{
    if(!role) return;
    const completed = Object.keys(progress).length;
    const myTiers   = TIERS.filter(t=>(ROLE_TIERS[role]||[]).includes(t.id));
    const pending   = [];
    myTiers.forEach(t=>t.mods.forEach(m=>{
      if(!progress[t.id+":"+m.id]) pending.push({tid:t.id, mid:m.id, tierName:t.name, tierColor:t.color, title:m.title, dur:m.dur, sum:m.summary||m.title});
    }));
    if(!pending.length) return;

    const cacheKey = "recs3:"+role+":"+(industry||"")+"_"+(userFn||"")+":"+completed;
    try{ const h = sessionStorage.getItem(cacheKey); if(h){ setRecs(JSON.parse(h)); return; } }catch(e){}

    setLoading(true);
    const roleLabel = (ROLE_DISPLAY||{})[role]||role;
    const ctx = "Role:"+roleLabel+". Industry:"+(industry||"General")+". Function:"+(userFn||"General")+". Completed:"+completed;
    const pList = pending.slice(0,6).map((m,i)=>i+":"+m.title).join("|");

    fetch("https://api.anthropic.com/v1/messages",{
      method:"POST",
      headers:{"Content-Type":"application/json","anthropic-version":"2023-06-01"},
      body:JSON.stringify({model:"claude-haiku-4-5-20251001", max_tokens:200,
        system:"Output ONLY JSON. No backticks.",
        messages:[{role:"user",content:ctx+" Modules:"+pList+" Pick best 3. Return:{p:[i,i,i],r:[r,r,r],t:theme}"}]})
    }).then(r=>r.json()).then(d=>{
      const raw = ((d.content||[]).find(b=>b.type==="text")?.text||"")
        .replace(/^```[\w]*\s*/,"").replace(/\s*```$/,"").trim();
      const obj = JSON.parse(raw);
      const picks = (obj.p||[]).slice(0,3).map((idx,i)=>
        pending[idx] ? {...pending[idx], reason: obj.r?.[i]||"Recommended for your role"} : null
      ).filter(Boolean);
      if(picks.length){
        const res = {mods: picks, theme: obj.t||"Recommended for You"};
        setRecs(res);
        try{ sessionStorage.setItem(cacheKey, JSON.stringify(res)); }catch(e){}
      }
      setLoading(false);
    }).catch(()=>setLoading(false));
  },[role, industry, userFn, Object.keys(progress).length]);

  return {recs, loading};
}

/** @param {{role:string,industry:string,userFn:string,progress:object,xp:number,onNav:Function}} props @returns {JSX.Element} Horizontal personalised recommendation rail. */
function RecommendationRail({role, industry, userFn, progress, xp, onNav}){
  const {recs, loading} = useRecommendations({role, industry, userFn, progress, xp});
  if(!recs && !loading) return null;

  return(
    <div style={{marginBottom:16,padding:"14px 16px",background:"linear-gradient(135deg,#EBF4FF,#F0F0FF)",border:"1px solid rgba(0,112,243,0.15)",borderRadius:14}}>
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
        <div style={{width:3,height:16,background:"#0070F3",borderRadius:2}}/>
        <div style={{fontSize:13,fontWeight:700,color:"#1D1D1F"}}>
          {loading ? "Finding your next modules…" : recs?.theme||"Recommended for You"}
        </div>
        <span style={{fontSize:9,fontWeight:700,color:"#0070F3",background:"rgba(0,112,243,0.1)",padding:"2px 7px",borderRadius:8,border:"1px solid rgba(0,112,243,0.2)"}}>AI·PERSONALISED</span>
      </div>
      {loading&&(
        <div style={{display:"flex",gap:10}}>
          {[0,1,2].map(i=><div key={i} style={{minWidth:200,height:108,borderRadius:10,background:"rgba(0,112,243,0.06)",animation:"pulse 1.5s ease-in-out infinite",flexShrink:0}}/>)}
        </div>
      )}
      {recs&&(
        <div style={{display:"flex",gap:10,overflowX:"auto",paddingBottom:4,WebkitOverflowScrolling:"touch",scrollbarWidth:"none"}}>
          {recs.mods.map((mod,i)=>(
            <div key={mod.mid} onClick={()=>onNav("mod_"+mod.tid+"_"+mod.mid)} role="button" tabIndex={0} onKeyDown={e=>{if(e.key==="Enter"||e.key===" ")onNav("mod_"+mod.tid+"_"+mod.mid);}}
              style={{minWidth:210,maxWidth:230,background:"#FFFFFF",borderRadius:11,padding:"13px 15px",cursor:"pointer",flexShrink:0,
                border:"1.5px solid "+(i===0?"#0070F3":"#E5E5EA"),
                boxShadow:i===0?"0 4px 16px rgba(0,112,243,0.15)":"0 2px 8px rgba(0,0,0,0.06)",
                transition:"all .15s",position:"relative",overflow:"hidden"}}
              onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow="0 8px 24px rgba(0,112,243,0.2)";}}
              onMouseLeave={e=>{e.currentTarget.style.transform="none";e.currentTarget.style.boxShadow=i===0?"0 4px 16px rgba(0,112,243,0.15)":"0 2px 8px rgba(0,0,0,0.06)";}}>
              {i===0&&<div style={{position:"absolute",top:0,left:0,right:0,height:3,background:"linear-gradient(90deg,#0070F3,#5AC8FA)"}}/>}
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:5}}>
                <span style={{fontSize:9,fontWeight:800,color:mod.tierColor,textTransform:"uppercase",letterSpacing:".1em"}}>{mod.tierName}</span>
                {i===0&&<span style={{fontSize:8,fontWeight:800,color:"#0070F3",background:"#EBF4FF",padding:"2px 6px",borderRadius:6}}>TOP PICK</span>}
              </div>
              <div style={{fontSize:12,fontWeight:700,color:"#1D1D1F",lineHeight:1.35,marginBottom:5}}>{mod.title}</div>
              <div style={{fontSize:10,color:"#6E6E73",lineHeight:1.4,marginBottom:8}}>{mod.reason}</div>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <span style={{fontSize:10,color:"#AEAEB2"}}>{mod.dur}</span>
                <span style={{fontSize:11,fontWeight:700,color:"#0070F3"}}>+100 LP →</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


// ─── Prompt Lab ──────────────────────────────────────────────────────────────
const PROMPT_TEMPLATES=[
  // BOARD & EXECUTIVE
  {id:"p1",roles:["executive"],cat:"Governance",dur:"5 min",color:"#E8B84B",
   title:"Board AI Risk Assessment",
   desc:"Prepare a board-level risk register for an AI initiative with regulatory exposure.",
   template:"Act as a board risk adviser. For [AI initiative] at a [industry] company in South Africa: Assess risks across (1) regulatory and POPIA exposure (2) reputational risk (3) financial model risk (4) staff displacement. Rate each HIGH/MEDIUM/LOW. Recommend board oversight actions.",
   tip:"Use before any AI project requiring board sign-off."},
  {id:"p2",roles:["executive"],cat:"Strategy",dur:"8 min",color:"#E8B84B",
   title:"AI Investment Decision Brief",
   desc:"Structure a 1-page AI investment recommendation for executive committee.",
   template:"Write a 1-page ExCo investment brief for [AI initiative] at [company] in [industry]. Include: Strategic rationale, 3-year ROI hypothesis, key risks, governance requirements, and the single question the board must answer before approving. Tone: direct, evidence-based, no jargon.",
   tip:"The single question framing forces clarity on the real constraint."},
  {id:"p3",roles:["executive"],cat:"Strategy",dur:"6 min",color:"#E8B84B",
   title:"AI Vendor Due Diligence",
   desc:"Evaluate an AI vendor with the rigour of a technology investment.",
   template:"Create a due diligence framework for evaluating [AI vendor] for [use case] at a [industry] organisation. Cover: technical capability, data security and POPIA compliance, implementation risk, commercial terms, vendor stability, and exit strategy. Output as a scorecard.",
   tip:"Always check data residency and POPIA compliance first for SA enterprises."},
  {id:"p4",roles:["executive"],cat:"Governance",dur:"5 min",color:"#E8B84B",
   title:"Workforce AI Impact Assessment",
   desc:"Model the impact of AI on your workforce before deployment.",
   template:"Assess the workforce impact of deploying [AI system] in [function] at a [industry] company with [N] employees. Cover: roles at risk, roles enhanced, new roles created, reskilling timeline and cost, change management requirements, and union or labour considerations.",
   tip:"Run this before any AI deployment that touches more than 10 roles."},
  // EXECUTIVE LEADERSHIP
  {id:"p5",roles:["functional","executive"],cat:"Strategy",dur:"6 min",color:"#7C3AED",
   title:"AI Adoption Business Case",
   desc:"Build a compelling internal business case for AI adoption in your function.",
   template:"Build a business case for AI adoption in [function] at a [industry] company with [N] employees. Include: Problem statement, 3 comparable industry examples with outcomes, cost-benefit over 2 years, implementation risk mitigation, and success metrics. Audience: CFO and COO.",
   tip:"Lead with the cost of inaction, not the cost of the solution."},
  {id:"p6",roles:["functional","manager"],cat:"Change",dur:"4 min",color:"#7C3AED",
   title:"AI Change Communication",
   desc:"Write a team communication that builds AI adoption confidence, not anxiety.",
   template:"Write a communication to my [function] team of [N] people about introducing [AI tool]. Address: What is changing, what is NOT changing, what we will do together, how we will support people through the transition. Tone: honest, human, forward-looking. NO corporate jargon.",
   tip:"Name the fear before they name it. It builds trust."},
  {id:"p7",roles:["functional","executive"],cat:"Strategy",dur:"7 min",color:"#7C3AED",
   title:"Data Strategy for Leaders",
   desc:"Define a data strategy that enables AI adoption in your function.",
   template:"Write a data strategy for the [function] at [company] in [industry]. Cover: current data assets and gaps, data quality requirements for AI, governance and POPIA obligations, quick wins in the next 90 days, and the 3-year vision. Target audience: CDO and CIO.",
   tip:"Data strategy should precede AI strategy. AI is only as good as the data."},
  {id:"p8",roles:["functional","manager"],cat:"Governance",dur:"5 min",color:"#7C3AED",
   title:"AI ROI Measurement Framework",
   desc:"Define how you will measure the business impact of AI in your function.",
   template:"Design a measurement framework for AI ROI in [function] at a [industry] company. Define: leading indicators (adoption, usage), lagging indicators (cost savings, revenue impact, time saved), data collection method, reporting cadence, and the baseline we must establish before going live.",
   tip:"Measure before you deploy. Baseline data is everything."},
  // SENIOR MANAGEMENT
  {id:"p9",roles:["manager","functional"],cat:"Productivity",dur:"3 min",color:"#0070F3",
   title:"AI Productivity Sprint Plan",
   desc:"Design a 4-week team AI productivity sprint with measurable outcomes.",
   template:"Design a 4-week AI productivity sprint for a [function] team of [N] people at a [industry] company. Week-by-week plan: tools to trial, skills to build, workflows to redesign. Success metric for each week. What does good look like at day 30?",
   tip:"Focus on 1-2 tools maximum. Breadth kills adoption."},
  {id:"p10",roles:["manager"],cat:"Governance",dur:"5 min",color:"#0070F3",
   title:"Team AI Use Policy",
   desc:"Draft an enforceable team-level AI use policy with clear dos and don'ts.",
   template:"Draft a practical AI use policy for a [function] team at a [industry] company. Include: Approved tools and use cases, data handling rules especially for client and personal data, quality check requirements before using AI outputs, escalation process for edge cases. Keep it to 1 page.",
   tip:"A policy no one reads is no policy at all. Keep it to 1 page."},
  {id:"p11",roles:["manager","functional"],cat:"Change",dur:"4 min",color:"#0070F3",
   title:"AI Pilot Design",
   desc:"Design a rigorous AI pilot that produces evidence to scale from.",
   template:"Design a 90-day AI pilot for [use case] in [function] at [company]. Define: hypothesis, success criteria, scope, control group, data collection, risk mitigation, stakeholders, and decision criteria for scale versus stop. Make the pilot falsifiable.",
   tip:"A pilot without a clear stop/scale decision is just a permanent proof of concept."},
  {id:"p12",roles:["manager"],cat:"Communication",dur:"3 min",color:"#0070F3",
   title:"Executive AI Progress Report",
   desc:"Write a concise AI progress report for your executive sponsor.",
   template:"Write a monthly AI progress report for [project] to my executive sponsor. Cover: progress against milestones, metrics achieved versus target, key learnings, blockers that need executive intervention, and the decision or action I need from them. Keep it to half a page.",
   tip:"Always end with a clear ask. Sponsors need to know exactly what you need."},
  // PROFESSIONAL SPECIALIST
  {id:"p13",roles:["learner","manager"],cat:"Productivity",dur:"2 min",color:"#34C759",
   title:"Meeting to Action Items",
   desc:"Extract decisions, actions and owners from raw meeting notes instantly.",
   template:"Here are my meeting notes from a [meeting type] with [stakeholders]: [paste notes]. Extract: (1) Key decisions made (2) Action items with owner and deadline (3) Open questions still unresolved (4) Items needing escalation. Format as a clean table.",
   tip:"Paste messy notes. The model handles the structure."},
  {id:"p14",roles:["learner","functional"],cat:"Communication",dur:"3 min",color:"#34C759",
   title:"Stakeholder Status Update",
   desc:"Write a crisp stakeholder update that builds confidence without overselling.",
   template:"Write a weekly status update for [project] to [stakeholder level]. Include: What we said we would do, what we actually did, what is at risk, what we need from you. Tone: professional, specific, no spin. Their main concern is: [concern].",
   tip:"Name the risk before they ask. Proactive honesty builds trust."},
  {id:"p15",roles:["learner"],cat:"Productivity",dur:"3 min",color:"#34C759",
   title:"Data Analysis Prompt",
   desc:"Get AI to analyse data and surface the most important insights.",
   template:"I have a dataset about [topic] with the following fields: [list fields]. The key business question I need to answer is: [question]. Please: (1) Suggest the 3 most important analyses to run (2) Identify potential data quality issues (3) Suggest how to visualise the findings for a non-technical audience.",
   tip:"Always state the business question first. Data without a question produces noise."},
  {id:"p16",roles:["learner","manager"],cat:"Communication",dur:"3 min",color:"#34C759",
   title:"Difficult Email Writer",
   desc:"Write a professional email for a difficult or sensitive workplace situation.",
   template:"Help me write a professional email about [situation] to [recipient and their role]. The context is: [background]. The outcome I need is: [desired outcome]. Tone should be: [professional/firm/empathetic]. Key constraint: [anything I cannot say or do].",
   tip:"State your desired outcome before writing. Most difficult emails fail because the sender is unclear about what they want."},
  // EMERGING TALENT
  {id:"p17",roles:["emerging"],cat:"Learning",dur:"2 min",color:"#5AC8FA",
   title:"Concept Explainer",
   desc:"Get any AI or data concept explained in plain language with a real example.",
   template:"Explain [concept] to me as if I am a graduate working in [industry]. Use a real example from [industry] that I might see at work. Tell me: what it is, why it matters for my career, and one thing I can do tomorrow to learn more about it.",
   tip:"Start with concepts from your Readiness Assessment where you scored lowest."},
  {id:"p18",roles:["emerging"],cat:"Career",dur:"3 min",color:"#5AC8FA",
   title:"Career AI Positioning",
   desc:"Write a LinkedIn-ready statement showing your AI capability to employers.",
   template:"Help me write a LinkedIn summary that positions me as AI-capable in [industry]. My background: [1-2 sentences]. AI skills I am building: [list]. The role I am targeting: [job title]. Make it specific, credible and not generic. No buzzwords.",
   tip:"Specificity beats polish. Mention actual tools you have used."},
  {id:"p19",roles:["emerging"],cat:"Learning",dur:"2 min",color:"#5AC8FA",
   title:"AI Tool Evaluation Guide",
   desc:"Evaluate whether an AI tool is worth using for a specific task.",
   template:"Help me evaluate [AI tool] for [task] in my role as [job title]. Create a simple scorecard covering: accuracy for my use case, ease of use, data privacy considerations especially POPIA, cost versus alternatives, and learning curve. Give me a recommendation with reasons.",
   tip:"Always check data privacy before using any AI tool with work data."},
  {id:"p20",roles:["emerging","learner"],cat:"Productivity",dur:"2 min",color:"#5AC8FA",
   title:"Study Notes Summariser",
   desc:"Turn lengthy course material into concise, exam-ready study notes.",
   template:"Summarise the following course content into concise study notes: [paste content]. Format as: (1) Key concepts in one sentence each (2) Important definitions (3) Real-world applications (4) Common misconceptions (5) Three questions this content is likely to test.",
   tip:"Use this after every module to lock in the learning."},
  // DATA & ANALYTICS FUNCTION
  {id:"p21",roles:["learner"],cat:"Productivity",dur:"3 min",color:"#0070F3",
   title:"SQL Query Optimiser",
   desc:"Get AI to optimise slow SQL queries and explain what was wrong.",
   template:"Here is a SQL query that is running slowly: [paste query]. The database is [database type] with approximately [N] rows in the main table. Please: (1) Identify the performance issues (2) Rewrite the query for better performance (3) Explain what you changed and why (4) Suggest any indexes that would help.",
   tip:"Always include the approximate row count — it changes the optimisation strategy."},
  {id:"p22",roles:["learner","manager"],cat:"Communication",dur:"4 min",color:"#0070F3",
   title:"Data Insight Storytelling",
   desc:"Turn raw data findings into a compelling narrative for non-technical stakeholders.",
   template:"I have the following data findings: [paste findings]. The audience is [describe audience] who are not technical. They care about: [their key concern]. Please help me write a 1-paragraph insight narrative that: starts with the business implication, supports it with the data, and ends with a clear recommendation.",
   tip:"Lead with the so-what, not the data. Stakeholders want implications, not numbers."},
  {id:"p23",roles:["learner"],cat:"Productivity",dur:"2 min",color:"#7C3AED",
   title:"Python Data Analysis Code",
   desc:"Generate Python code for common data analysis and transformation tasks.",
   template:"Write Python code to [describe task] using a dataframe called df with the following columns: [list columns]. The output should be [describe desired output]. Use pandas and make the code clean with comments. Also add basic error handling for missing or null values.",
   tip:"Describe the expected output format explicitly — it prevents most code errors."},
  {id:"p24",roles:["manager","functional"],cat:"Strategy",dur:"5 min",color:"#34C759",
   title:"Data Team Value Report",
   desc:"Write a compelling report showing the business value delivered by your data team.",
   template:"Write a quarterly value report for our data team at [company] in [industry]. We delivered: [list key projects and outcomes]. The audience is [executive level]. Format as: Executive summary (3 sentences), Business impact by project with numbers, Cost of not having done this work, Upcoming priorities and their expected value.",
   tip:"Quantify everything. Vague impact claims are ignored by executives."},

];

/** @param {string} role - User role key. @returns {object[]} Prompt templates relevant to the given role. */
function getTemplatesForRole(role){
  if(!role) return PROMPT_TEMPLATES;
  return PROMPT_TEMPLATES.filter(function(t){
    return !t.roles||t.roles.length===0||t.roles.includes(role);
  });
}

/** @param {{industry:string,userFn:string,role:string}} props @returns {JSX.Element} Interactive prompt engineering lab. */
function PromptLab({industry,userFn,role}){
  var [cat,setCat]=useState("");
  var [active,setActive]=useState(null);
  var [copied,setCopied]=useState(null);
  var [aiOut,setAiOut]=useState({});
  var [aiLoad,setAiLoad]=useState({});
  var [ctx,setCtx]=useState({});

  var roleLabel=(ROLE_DISPLAY||{})[role]||role||"professional";
  var myTemplates=getTemplatesForRole(role);
  var cats=[].concat.apply([],myTemplates.map(function(p){return[p.cat];})).filter(function(v,i,a){return a.indexOf(v)===i;});
  var filtered=cat?myTemplates.filter(function(p){return p.cat===cat;}):myTemplates;

  function doCopy(id,text){
    try{navigator.clipboard.writeText(text);}catch(e){}
    setCopied(id);
    setTimeout(function(){setCopied(null);},2000);
  }

  function runTemplate(p){
    if(aiLoad[p.id]) return;
    setAiLoad(function(l){var o=Object.assign({},l);o[p.id]=true;return o;});
    var filled=p.template
      .replace(/\[industry\]/gi,industry||"enterprise")
      .replace(/\[function\]/gi,userFn||"your function")
      .replace(/\[role\]/gi,roleLabel);
    var prompt="I am a "+roleLabel+(industry?" in "+industry:"")+(userFn?" ("+userFn+")":"")+". "+(ctx[p.id]||"")+" "+filled;
    fetch("https://api.anthropic.com/v1/messages",{
      method:"POST",
      headers:{"Content-Type":"application/json","anthropic-version":"2023-06-01"},
      body:JSON.stringify({model:"claude-haiku-4-5-20251001",max_tokens:350,
        system:"You are a practical AI assistant for enterprise professionals. Be direct and specific. Max 250 words.",
        messages:[{role:"user",content:prompt}]})
    }).then(function(r){return r.json();}).then(function(d){
      var txt=((d.content||[]).find(function(b){return b.type==="text";})||{}).text||"";
      setAiOut(function(o){var n=Object.assign({},o);n[p.id]=txt;return n;});
      setAiLoad(function(l){var o=Object.assign({},l);o[p.id]=false;return o;});
    }).catch(function(){
      setAiOut(function(o){var n=Object.assign({},o);n[p.id]="Generation failed. Please check your connection.";return n;});
      setAiLoad(function(l){var o=Object.assign({},l);o[p.id]=false;return o;});
    });
  }

  return(
    <div className="fade-in" style={{overflowY:"auto",flex:1,background:"#0C1524"}}>
      <div style={{background:"linear-gradient(135deg,#0A1828,#102040)",padding:"22px 28px",borderBottom:"1px solid rgba(255,255,255,0.06)"}}>
        <div style={{display:"flex",gap:8,marginBottom:10,flexWrap:"wrap"}}>
          <Badge label="AI Toolkit" color="#5AC8FA" bg="rgba(90,200,250,0.15)"/>
          <Badge label={myTemplates.length+" templates"} color="rgba(255,255,255,0.4)" bg="rgba(255,255,255,0.07)"/>
          <Badge label={roleLabel} color="#7C3AED" bg="rgba(124,58,237,0.12)"/>
        </div>
        <div style={{fontSize:21,fontWeight:800,color:"#FFFFFF",letterSpacing:"-0.03em",marginBottom:4}}>AI Toolkit</div>
        <div style={{fontSize:12,color:"rgba(255,255,255,0.4)",marginBottom:14}}>Enterprise AI prompt templates for {roleLabel}{industry?" in "+industry:""}. Copy, customise or generate live.</div>
        <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
          <button onClick={function(){setCat("");}} style={{padding:"5px 12px",borderRadius:20,border:"1px solid "+(cat===""?"#5AC8FA":"rgba(255,255,255,0.12)"),background:cat===""?"rgba(90,200,250,0.15)":"transparent",color:cat===""?"#5AC8FA":"rgba(255,255,255,0.4)",fontSize:11,cursor:"pointer",fontFamily:"inherit",fontWeight:cat===""?700:400}}>All ({myTemplates.length})</button>
          {cats.map(function(x){
            return <button key={x} onClick={function(){setCat(cat===x?"":x);}} style={{padding:"5px 12px",borderRadius:20,border:"1px solid "+(cat===x?"#A78BFA":"rgba(255,255,255,0.12)"),background:cat===x?"rgba(124,58,237,0.15)":"transparent",color:cat===x?"#A78BFA":"rgba(255,255,255,0.4)",fontSize:11,cursor:"pointer",fontFamily:"inherit",fontWeight:cat===x?700:400}}>{x}</button>;
          })}
        </div>
      </div>
      <div style={{padding:"20px 24px"}}>
        <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:12}} className="mob-grid1">
          {filtered.map(function(p){
            var isOpen=active===p.id;
            return(
              <div key={p.id} style={{background:"rgba(255,255,255,0.05)",border:"1px solid "+(isOpen?"rgba(90,200,250,0.5)":"rgba(255,255,255,0.07)"),borderRadius:10,overflow:"hidden",display:"flex",flexDirection:"column"}}>
                <div style={{padding:"14px 16px",flex:1}}>
                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
                    <div style={{width:28,height:28,borderRadius:7,background:p.color+"20",border:"1px solid "+p.color+"30",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:800,color:p.color,flexShrink:0}}>AI</div>
                    <div style={{flex:1}}>
                      <div style={{display:"flex",gap:5,marginBottom:3,flexWrap:"wrap"}}>
                        <span style={{fontSize:9,fontWeight:700,padding:"1px 7px",borderRadius:10,background:p.color+"20",color:p.color}}>{p.cat}</span>
                        <span style={{fontSize:9,color:"rgba(255,255,255,0.3)"}}>⏱ {p.dur}</span>
                      </div>
                      <div style={{fontSize:13,fontWeight:700,color:"#5AC8FA",lineHeight:1.3}}>{p.title}</div>
                    </div>
                  </div>
                  <div style={{fontSize:11,color:"rgba(255,255,255,0.45)",lineHeight:1.5}}>{p.desc}</div>
                </div>
                <div style={{borderTop:"1px solid rgba(255,255,255,0.06)",padding:"8px 16px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <button onClick={function(){doCopy(p.id,p.template);}} style={{fontSize:11,fontWeight:600,color:"rgba(255,255,255,0.45)",background:"none",border:"none",cursor:"pointer",fontFamily:"inherit"}}>
                    {copied===p.id?"Copied!":"Copy template"}
                  </button>
                  <button onClick={function(){setActive(isOpen?null:p.id);}} style={{fontSize:12,fontWeight:700,color:"#5AC8FA",background:"none",border:"none",cursor:"pointer",fontFamily:"inherit"}}>
                    {isOpen?"Close":"Try with AI"}
                  </button>
                </div>
                {isOpen&&(
                  <div style={{borderTop:"1px solid rgba(90,200,250,0.15)",background:"rgba(0,0,0,0.2)",padding:"12px 16px"}}>
                    <div style={{fontSize:10,color:"rgba(255,255,255,0.4)",marginBottom:4,fontWeight:600,textTransform:"uppercase",letterSpacing:".06em"}}>Template</div>
                    <div style={{fontSize:11,color:"rgba(255,255,255,0.65)",lineHeight:1.6,fontFamily:"monospace",padding:"8px 10px",background:"rgba(0,0,0,0.3)",borderRadius:6,marginBottom:8,wordBreak:"break-word"}}>{p.template}</div>
                    <div style={{fontSize:11,color:"#5AC8FA",marginBottom:10,lineHeight:1.5}}>Tip: {p.tip}</div>
                    <textarea value={ctx[p.id]||""} onChange={function(e){setCtx(function(u){var n=Object.assign({},u);n[p.id]=e.target.value;return n;});}} placeholder="Add your context (optional)..." rows={2}
                      style={{width:"100%",padding:"7px 10px",border:"1px solid rgba(255,255,255,0.1)",borderRadius:6,fontSize:"14px",color:"rgba(255,255,255,0.8)",resize:"vertical",fontFamily:"inherit",background:"rgba(255,255,255,0.06)",boxSizing:"border-box"}}/>
                    <button onClick={function(){runTemplate(p);}} style={{marginTop:7,width:"100%",padding:"9px",borderRadius:7,border:"none",background:"linear-gradient(135deg,#0070F3,#0055CC)",color:"#FFF",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>
                      {aiLoad[p.id]?"Generating...":"Generate with AI"}
                    </button>
                    {aiOut[p.id]&&(
                      <div style={{marginTop:8,padding:"10px 12px",background:"rgba(0,112,243,0.1)",border:"1px solid rgba(0,112,243,0.2)",borderRadius:7}}>
                        <div style={{fontSize:9,fontWeight:700,color:"#5AC8FA",textTransform:"uppercase",letterSpacing:".07em",marginBottom:4}}>AI Response</div>
                        <div style={{fontSize:12,color:"rgba(255,255,255,0.82)",lineHeight:1.7,whiteSpace:"pre-wrap"}}>{aiOut[p.id]}</div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}


// ─── Chat widget ────────────────────────────────────────────────────────────
const BOT_SYSTEM = "You are the CapabilityOS Platform Guide for Digilytics Co. " +
  "CapabilityOS is a digitalised workforce intelligence platform — not a skills audit and not an LMS. " +
  "It continuously assesses AI capability across 8 dimensions, generates personalised learning journeys, " +
  "and provides real-time workforce intelligence to executives. " +
  "Help users navigate the platform, understand their capability scores, choose modules, " +
  "and apply AI in their specific role and industry. " +
  "Be concise (max 3 sentences), practical, and encouraging. Never say \'Academy\'.";

/** @returns {JSX.Element} Floating AI chat assistant widget. */
function ChatWidget(){
  const [open,setOpen]=useState(false);
  const [msgs,setMsgs]=useState([{role:"assistant",content:"Hello. I'm your CapabilityOS Guide. Ask me anything — how the platform works, your capability score, specific AI concepts, or which modules to prioritise for your role."}]);
  const [input,setInput]=useState("");const [busy,setBusy]=useState(false);
  const endRef=useRef(null);
  useEffect(()=>{if(open&&endRef.current)endRef.current.scrollIntoView({behavior:"smooth"})},[msgs,open]);

    const FAQs=["How do I improve my Capability Score?","What makes this different from an LMS?","How does the Capability Check work?","Which modules should I start with?","How is this different from a skills audit?","What is AI-Led Practice?"];

  async function send(text){
    const msg=text||input.trim();if(!msg||busy)return;
    setInput("");
    const updated=[...msgs,{role:"user",content:msg}];
    setMsgs(updated);setBusy(true);
    try{
      const res=await fetch("https://api.anthropic.com/v1/messages",{
        method:"POST",
        headers:{"Content-Type":"application/json","anthropic-version":"2023-06-01"},
        body:JSON.stringify({model:"claude-haiku-4-5-20251001",max_tokens:300,system:BOT_SYSTEM,
          messages:updated.map(m=>({role:m.role,content:m.content}))})
      });
      const d=await res.json();
      const reply=d.content?.find(b=>b.type==="text")?.text||"I couldn't process that — please try rephrasing.";
      setMsgs(prev=>[...prev,{role:"assistant",content:reply}]);
    }catch(e){
      setMsgs(prev=>[...prev,{role:"assistant",content:"I'm having trouble connecting right now. Please try again in a moment."}]);
    }finally{setBusy(false);}
  }

  return(
    <>
      {open&&(
        <div style={{position:"fixed",bottom:72,right:20,width:340,height:490,background:T.surface,border:"1px solid "+T.b1,borderRadius:6,boxShadow:T.e4,display:"flex",flexDirection:"column",zIndex:2000}}>
          <div style={{background:T.side,padding:"12px 16px",borderRadius:"6px 6px 0 0",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <div><div style={{fontSize:13,fontWeight:600,color:"#FFFFFF"}}>CapabilityOS Guide</div><div style={{fontSize:11,color:"rgba(255,255,255,0.45)"}}>Ask anything about the platform</div></div>
            <button onClick={()=>setOpen(false)} style={{background:"none",border:"none",cursor:"pointer",color:"rgba(255,255,255,0.5)",fontSize:18,lineHeight:1,padding:"2px 4px"}}>✕</button>
          </div>
          <div style={{flex:1,overflowY:"auto",padding:"12px 14px",display:"flex",flexDirection:"column",gap:8}}>
            {msgs.map((m,i)=>(
              <div key={i} style={{display:"flex",justifyContent:m.role==="user"?"flex-end":"flex-start"}}>
                <div style={{maxWidth:"85%",padding:"8px 11px",borderRadius:m.role==="user"?"6px 6px 2px 6px":"6px 6px 6px 2px",background:m.role==="user"?T.brand:T.page,color:m.role==="user"?"#FFFFFF":T.t1,fontSize:13,lineHeight:1.55,border:m.role==="user"?"none":"1px solid "+T.b2}}>
                  {m.content}
                </div>
              </div>
            ))}
            {busy&&<div style={{display:"flex",alignItems:"center",gap:6,color:T.t4,fontSize:12}}><Spin/>Thinking...</div>}
            <div ref={endRef}/>
          </div>
          {msgs.length<=1&&(
            <div style={{padding:"0 10px 8px"}}>
              <div style={{fontSize:11,color:T.t4,marginBottom:5,paddingLeft:4}}>Common questions</div>
              <div style={{display:"flex",flexDirection:"column",gap:4}}>
                {FAQs.map((q,i)=>(
                  <button key={i} onClick={()=>send(q)} style={{textAlign:"left",padding:"6px 10px",borderRadius:4,border:"1px solid "+T.b1,background:T.surface,fontSize:12,color:T.brand,cursor:"pointer",fontFamily:"inherit"}}>{q}</button>
                ))}
              </div>
            </div>
          )}
          <div style={{padding:"8px 10px",borderTop:"1px solid "+T.b2,display:"flex",gap:6}}>
            <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} placeholder="Ask a question..." className="wd-input"
              style={{flex:1,padding:"7px 11px",border:"1px solid "+T.b1,borderRadius:4,fontSize:13,color:T.t1,outline:"none"}}/>
            <button onClick={()=>send()} disabled={busy||!input.trim()} className="wd-btn" style={{padding:"7px 12px",borderRadius:4,border:"none",background:input.trim()?T.brand:T.b2,color:input.trim()?"#FFFFFF":T.t4,cursor:input.trim()?"pointer":"not-allowed"}}>
              <Send size={13}/>
            </button>
          </div>
        </div>
      )}
      <button onClick={()=>setOpen(v=>!v)} style={{position:"fixed",bottom:20,right:20,width:46,height:46,borderRadius:"50%",background:T.brand,border:"none",color:"#FFFFFF",cursor:"pointer",zIndex:2000,boxShadow:T.e3,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:700,transition:"background .15s"}}
        onMouseEnter={e=>e.target.style.background=T.brandDk} onMouseLeave={e=>e.target.style.background=T.brand}
        title="Platform Guide">
        {open?"✕":<MessageSquare size={18}/>}
      </button>
    </>
);
}

// ─── Daily challenge card ─────────────────────────────────────────────────────
// ─── ENTERPRISE DATA CONSTANTS ───────────────────────────────────────────────

const DEMO_ORG = {
  name: "Momentum Group Demo",
  industry: "Financial Services / Insurance",
  employeeCount: 16500,
  geographies: ["South Africa","Africa","India","United Kingdom","Global"],
  aiMaturity: "Developing",
  readinessScore: 58,
  aiReadiness: 54,
  digitalMaturity: 62,
  workforceRisk: 41,
  businessUnits: ["Human Capital","Finance","Risk & Compliance","Operations","Technology","Distribution","Customer Experience","Marketing","Legal","Strategy"],
  strategicPriorities: ["AI-enabled productivity","Workforce reskilling","Digital transformation","Responsible AI governance","Data-driven decision-making","Operating model modernisation"],
  businessChallenges: ["Capability gaps in AI literacy","Inconsistent digital tool adoption","Legacy process dependencies","Talent attraction in technology","Regulatory AI compliance readiness"],
};

const DEMO_BUS_UNITS = [
  {id:"bu1",name:"Human Capital",      headcount:320, leader:"CHRO",          readiness:52, aiReadiness:48, risk:"High",    gaps:["AI for HR","People Analytics","Workforce Planning"]},
  {id:"bu2",name:"Finance",            headcount:280, leader:"CFO",           readiness:61, aiReadiness:55, risk:"Medium",  gaps:["FP&A Automation","AI in Forecasting","Data Literacy"]},
  {id:"bu3",name:"Risk & Compliance",  headcount:210, leader:"CRO",           readiness:44, aiReadiness:38, risk:"Critical",gaps:["Responsible AI","AI Governance","Regulatory Awareness"]},
  {id:"bu4",name:"Technology",         headcount:440, leader:"CIO",           readiness:74, aiReadiness:71, risk:"Low",     gaps:["AI Architecture","MLOps","Cloud Engineering"]},
  {id:"bu5",name:"Operations",         headcount:890, leader:"COO",           readiness:49, aiReadiness:43, risk:"High",    gaps:["Process Automation","AI in Ops","Digital Tools"]},
  {id:"bu6",name:"Distribution",       headcount:620, leader:"Sales Director", readiness:38, aiReadiness:32, risk:"High",   gaps:["AI for Sales","CX Intelligence","Digital Engagement"]},
  {id:"bu7",name:"Customer Experience",headcount:510, leader:"CCO",           readiness:55, aiReadiness:51, risk:"Medium", gaps:["AI in CX","Sentiment Analysis","Personalisation"]},
  {id:"bu8",name:"Marketing",          headcount:180, leader:"CMO",           readiness:63, aiReadiness:59, risk:"Low",    gaps:["AI Content","Marketing Analytics","Campaign Automation"]},
  {id:"bu9",name:"Legal",              headcount:90,  leader:"General Counsel",readiness:41, aiReadiness:34, risk:"High",  gaps:["AI Legal Risk","Contract AI","Compliance AI"]},
  {id:"bu10",name:"Strategy",          headcount:65,  leader:"CSO",           readiness:68, aiReadiness:65, risk:"Low",   gaps:["AI Strategy","Scenario Planning","Digital Transformation"]},
];

const DEMO_ROLE_DISRUPTION = [
  {role:"HR Business Partner",     family:"Human Capital", disruption:"High",    automation:62, augmentation:80, skills:["AI for HR","People Analytics","Strategic Thinking"],       action:"Reskill + Augment", timeline:"12 months"},
  {role:"Payroll Specialist",       family:"Human Capital", disruption:"Critical",automation:85, augmentation:45, skills:["AI Tools","Workflow Automation","Exceptions Management"], action:"Automate + Redeploy",timeline:"6 months"},
  {role:"Recruiter",                family:"Human Capital", disruption:"High",    automation:58, augmentation:85, skills:["AI Sourcing","Candidate Intelligence","Human Judgment"],    action:"Augment",           timeline:"12 months"},
  {role:"Finance Analyst",          family:"Finance",       disruption:"High",    automation:71, augmentation:78, skills:["AI Analytics","FP&A Automation","Strategic Finance"],      action:"Reskill + Augment", timeline:"12 months"},
  {role:"Compliance Officer",       family:"Risk",          disruption:"Moderate",automation:49, augmentation:72, skills:["AI Governance","RegTech","Risk Intelligence"],              action:"Augment",           timeline:"18 months"},
  {role:"Call Centre Agent",        family:"Distribution",  disruption:"Critical",automation:79, augmentation:55, skills:["AI Co-pilot","Complex Resolution","Empathy"],              action:"Automate + Redeploy",timeline:"6 months"},
  {role:"Operations Manager",       family:"Operations",    disruption:"Moderate",automation:44, augmentation:82, skills:["Process AI","Decision Intelligence","Change Leadership"],    action:"Upskill",           timeline:"18 months"},
  {role:"Data Analyst",             family:"Technology",    disruption:"Moderate",automation:52, augmentation:88, skills:["Advanced Analytics","AI Tools","Storytelling"],             action:"Augment + Elevate", timeline:"12 months"},
  {role:"Marketing Specialist",     family:"Marketing",     disruption:"High",    automation:66, augmentation:79, skills:["Generative AI","Campaign AI","Creative Judgment"],           action:"Augment",           timeline:"12 months"},
  {role:"Project Manager",          family:"Operations",    disruption:"Moderate",automation:41, augmentation:76, skills:["AI Planning","Risk AI","Stakeholder Leadership"],           action:"Upskill",           timeline:"18 months"},
  {role:"Executive Assistant",      family:"Strategy",      disruption:"High",    automation:74, augmentation:60, skills:["AI Productivity","Executive Intelligence","Discretion"],     action:"Reskill",           timeline:"9 months"},
  {role:"Cloud Engineer",           family:"Technology",    disruption:"Low",     automation:22, augmentation:91, skills:["AI/ML Integration","FinOps","Platform Engineering"],         action:"Upskill + Grow",    timeline:"24 months"},
  {role:"Risk Analyst",             family:"Risk",          disruption:"High",    automation:68, augmentation:74, skills:["AI Risk Models","Explainability","Scenario Planning"],       action:"Reskill + Augment", timeline:"12 months"},
  {role:"Product Manager",          family:"Technology",    disruption:"Low",     automation:18, augmentation:88, skills:["AI Product Thinking","Data Intelligence","User Insight"],    action:"Upskill + Grow",    timeline:"24 months"},
];

const DEMO_CAPABILITIES = [
  {id:"cap1",name:"AI Literacy",          domain:"AI Foundations",      current:3,target:5,gap:2,importance:"Critical",risk:"High",  owner:"L&D / CHRO"},
  {id:"cap2",name:"Data Fluency",         domain:"Data Intelligence",   current:3,target:5,gap:2,importance:"Critical",risk:"High",  owner:"CDO"},
  {id:"cap3",name:"Responsible AI",       domain:"AI Governance",       current:2,target:5,gap:3,importance:"Critical",risk:"High",  owner:"CRO / Legal"},
  {id:"cap4",name:"Digital Tool Mastery", domain:"Digital Fluency",     current:4,target:5,gap:1,importance:"High",    risk:"Medium",owner:"CIO"},
  {id:"cap5",name:"AI in Finance",        domain:"Functional AI",       current:2,target:4,gap:2,importance:"High",    risk:"High",  owner:"CFO"},
  {id:"cap6",name:"Process Automation",   domain:"Automation",          current:3,target:5,gap:2,importance:"High",    risk:"Medium",owner:"COO"},
  {id:"cap7",name:"AI Governance",        domain:"AI Governance",       current:2,target:5,gap:3,importance:"Critical",risk:"High",  owner:"Board / CRO"},
  {id:"cap8",name:"Prompt Engineering",   domain:"Applied AI",          current:2,target:4,gap:2,importance:"High",    risk:"Medium",owner:"L&D"},
  {id:"cap9",name:"Workforce Analytics",  domain:"People Intelligence", current:2,target:4,gap:2,importance:"High",    risk:"Medium",owner:"CHRO"},
  {id:"cap10",name:"Change Leadership",   domain:"Transformation",      current:3,target:5,gap:2,importance:"High",    risk:"High",  owner:"CEO / CHRO"},
  {id:"cap11",name:"Cloud & Platforms",   domain:"Technology",          current:4,target:5,gap:1,importance:"Medium",  risk:"Low",   owner:"CIO"},
  {id:"cap12",name:"Cyber Awareness",     domain:"Security",            current:3,target:5,gap:2,importance:"Critical",risk:"High",  owner:"CISO"},
];

const DEMO_INTERVENTIONS = [
  {id:"int1",title:"Executive AI Readiness Masterclass",  type:"Masterclass",    audience:"Board & Executive",        duration:"2 days",   priority:"Critical",status:"Proposed",  gaps:["AI Literacy","AI Governance"],        outcomes:"Board-level AI strategy ownership. Governance framework approval. Risk appetite defined."},
  {id:"int2",title:"Responsible AI Programme",            type:"Programme",      audience:"Risk & Compliance",        duration:"6 weeks",  priority:"Critical",status:"Proposed",  gaps:["Responsible AI","AI Governance"],     outcomes:"POPIA-aligned AI policy. Risk mitigation framework. Compliance coverage."},
  {id:"int3",title:"AI for HR Leaders Sprint",            type:"Sprint",         audience:"Human Capital",            duration:"4 weeks",  priority:"High",    status:"Proposed",  gaps:["AI in HR","People Analytics"],        outcomes:"3 AI use cases deployed in HR. Workforce analytics activated."},
  {id:"int4",title:"Data Literacy Bootcamp",              type:"Bootcamp",       audience:"Finance + Operations",     duration:"3 weeks",  priority:"High",    status:"Approved",  gaps:["Data Fluency","AI in Finance"],       outcomes:"Dashboard literacy. AI-assisted forecasting pilot."},
  {id:"int5",title:"Automation Opportunity Assessment",   type:"Assessment",     audience:"Operations",               duration:"2 weeks",  priority:"High",    status:"In Progress",gaps:["Process Automation"],                 outcomes:"10 automation candidates identified. R8M annual savings opportunity."},
  {id:"int6",title:"Manager AI Enablement Programme",     type:"Programme",      audience:"Senior Management",        duration:"8 weeks",  priority:"High",    status:"Proposed",  gaps:["AI Literacy","Change Leadership"],    outcomes:"AI-enabled manager behaviours. Team adoption acceleration."},
  {id:"int7",title:"AI Governance Framework Workshop",    type:"Workshop",       audience:"Legal + Risk + Strategy",  duration:"3 days",   priority:"Critical",status:"Proposed",  gaps:["AI Governance","Responsible AI"],     outcomes:"Enterprise AI policy published. Governance committee formed."},
  {id:"int8",title:"Prompt Engineering Lab",              type:"Lab",            audience:"Professional Specialists", duration:"2 weeks",  priority:"Medium",  status:"Proposed",  gaps:["Prompt Engineering","Applied AI"],    outcomes:"Role-specific prompt library. 30% productivity improvement in pilots."},
];

const DEMO_WORKFORCE_PLAN = {
  scenarios: [
    {id:"conservative", label:"Conservative", hireTarget:120, reskillTarget:680,  automateTarget:45,  budget:"R18M", months:24},
    {id:"base",         label:"Base Case",    hireTarget:210, reskillTarget:950,  automateTarget:85,  budget:"R28M", months:18},
    {id:"accelerated",  label:"Accelerated",  hireTarget:380, reskillTarget:1240, automateTarget:160, budget:"R42M", months:12},
  ],
  fourB: [
    {bu:"Human Capital",       build:85,  buy:12, borrow:8,  bot:18, risk:"High",     atRisk:48},
    {bu:"Finance",             build:62,  buy:18, borrow:12, bot:32, risk:"Medium",   atRisk:36},
    {bu:"Risk & Compliance",   build:45,  buy:28, borrow:15, bot:22, risk:"Critical", atRisk:62},
    {bu:"Technology",          build:38,  buy:55, borrow:22, bot:18, risk:"Low",      atRisk:18},
    {bu:"Operations",          build:120, buy:22, borrow:18, bot:68, risk:"High",     atRisk:84},
    {bu:"Distribution",        build:95,  buy:35, borrow:25, bot:72, risk:"High",     atRisk:76},
    {bu:"Customer Experience", build:78,  buy:28, borrow:14, bot:45, risk:"Medium",   atRisk:52},
    {bu:"Marketing",           build:32,  buy:18, borrow:8,  bot:24, risk:"Low",      atRisk:22},
    {bu:"Legal",               build:28,  buy:8,  borrow:10, bot:14, risk:"High",     atRisk:32},
    {bu:"Strategy",            build:18,  buy:12, borrow:5,  bot:8,  risk:"Low",      atRisk:12},
  ],
  quarters: [
    {q:"Q4 2025", hire:28,  reskill:120, redeploy:18, automate:12, phase:"Foundation"},
    {q:"Q1 2026", hire:45,  reskill:280, redeploy:32, automate:22, phase:"Deploy"},
    {q:"Q2 2026", hire:68,  reskill:380, redeploy:45, automate:31, phase:"Scale"},
    {q:"Q3 2026", hire:52,  reskill:420, redeploy:38, automate:26, phase:"Scale"},
    {q:"Q4 2026", hire:45,  reskill:380, redeploy:29, automate:18, phase:"Optimize"},
    {q:"Q1 2027", hire:22,  reskill:240, redeploy:18, automate:9,  phase:"Sustain"},
  ],
};

const DEMO_READINESS_DIMS = [
  {id:"data_lit",   label:"Data Literacy",         score:52, target:75, color:"#5AC8FA"},
  {id:"ai_found",   label:"AI Foundations",         score:48, target:80, color:"#A78BFA"},
  {id:"prompt_eng", label:"Prompt Engineering",     score:61, target:70, color:"#34C759"},
  {id:"ai_ethics",  label:"AI Ethics & Governance", score:39, target:85, color:"#FF9500"},
  {id:"ai_strat",   label:"AI Strategy",            score:55, target:75, color:"#E8B84B"},
  {id:"tool_prof",  label:"Tool Proficiency",       score:67, target:70, color:"#0070F3"},
  {id:"proc_auto",  label:"Process Automation",     score:44, target:75, color:"#FF6B35"},
  {id:"ai_risk",    label:"AI Risk Management",     score:36, target:80, color:"#FF3B30"},
];

const DEMO_REPORTS = [
  {id:"rep1",title:"Enterprise Capability Baseline Report",   audience:"CHRO / Board",          status:"Ready",   generated:"2025-06-01", summary:"Baseline assessment of AI and digital capability across all 16,500 employees and 10 business units."},
  {id:"rep2",title:"AI Workforce Readiness Report",          audience:"CEO / CIO / CHRO",      status:"Ready",   generated:"2025-06-01", summary:"AI readiness score: 54/100. Critical gaps in Risk & Compliance and Distribution. Recommended interventions."},
  {id:"rep3",title:"Skills Gap Report",                      audience:"CHRO / L&D",            status:"Ready",   generated:"2025-06-01", summary:"12 critical capability gaps identified. Responsible AI and AI Governance are highest risk."},
  {id:"rep4",title:"Business Unit Heatmap Report",           audience:"Executive Committee",   status:"Ready",   generated:"2025-06-01", summary:"Risk & Compliance and Distribution business units rated Critical. Technology and Marketing at Low risk."},
  {id:"rep5",title:"Reskilling Investment Case",             audience:"CFO / Board",           status:"Draft",   generated:"2025-05-28", summary:"R42M reskilling investment recommendation. Projected R180M productivity return over 3 years."},
  {id:"rep6",title:"Workforce Transformation Risk Report",   audience:"CRO / Board",           status:"Ready",   generated:"2025-06-01", summary:"Workforce risk index: 41/100. 3 business units rated High. Role disruption exposure analysis."},
  {id:"rep7",title:"AI Governance Readiness Report",         audience:"Board / Legal / Risk",  status:"Draft",   generated:"2025-05-30", summary:"AI governance maturity: 32/100. 4 critical policy gaps. POPIA compliance risk flagged."},
  {id:"rep8",title:"90-Day Transformation Roadmap",          audience:"CEO / ExCo",            status:"Ready",   generated:"2025-06-01", summary:"Phased transformation roadmap. Quick wins in 30 days. Strategic interventions in 60-90 days."},
];

const DEMO_GOV_RISKS = [
  {id:"gr1",domain:"AI Governance Maturity",      score:32, target:75, level:"Critical",coverage:28, desc:"No enterprise AI governance framework in place. Board-level oversight not formalised."},
  {id:"gr2",domain:"Responsible AI Coverage",     score:41, target:80, level:"High",    coverage:38, desc:"Responsible AI principles not embedded in delivery processes. Incomplete training coverage."},
  {id:"gr3",domain:"Policy Awareness",            score:49, target:85, level:"High",    coverage:44, desc:"Only 44% of employees aware of AI usage policy. Public tool usage uncontrolled."},
  {id:"gr4",domain:"Data Privacy Readiness",      score:61, target:90, level:"Medium",  coverage:58, desc:"POPIA awareness training partially complete. Data handling in AI workflows not audited."},
  {id:"gr5",domain:"Workforce Risk Index",        score:41, target:70, level:"High",    coverage:38, desc:"3 business units rated High risk. Call Centre and Payroll rated Critical disruption exposure."},
  {id:"gr6",domain:"Human Oversight",             score:55, target:85, level:"Medium",  coverage:52, desc:"Human-in-the-loop requirements not defined for AI-assisted decisions."},
  {id:"gr7",domain:"Bias & Fairness",             score:38, target:80, level:"High",    coverage:33, desc:"No bias audit process for AI models in use. HR AI tools not assessed."},
  {id:"gr8",domain:"Audit Readiness",             score:44, target:85, level:"High",    coverage:40, desc:"AI usage not systematically logged. Audit trail incomplete across business units."},
  {id:"gr9",domain:"Compliance Training Coverage",score:52, target:90, level:"Medium",  coverage:49, desc:"Compliance AI modules not completed by Risk & Compliance or Legal teams."},
  {id:"gr10",domain:"Model Risk Awareness",       score:35, target:75, level:"Critical",coverage:30, desc:"No model risk policy. No inventory of AI models in production. CRO not briefed."},
];

const DEMO_AUDIT_EVENTS = [
  {id:"a1", user:"Thabo Serame",       action:"Admin login",                portal:"Admin",  page:"Overview",      severity:"Info",    status:"Success",  ts:"2025-06-16 09:14"},
  {id:"a2", user:"Thabo Serame",       action:"Generated capability report", portal:"Admin",  page:"Reports",       severity:"Info",    status:"Success",  ts:"2025-06-16 09:18"},
  {id:"a3", user:"Demo Learner 1",     action:"Completed capability check",  portal:"Learner",page:"Capability Check",severity:"Info",  status:"Success",  ts:"2025-06-16 08:52"},
  {id:"a4", user:"Demo Learner 2",     action:"Failed access code",          portal:"Access", page:"Onboarding",    severity:"Warning", status:"Failed",   ts:"2025-06-16 08:31"},
  {id:"a5", user:"Demo Learner 3",     action:"Module completed",            portal:"Learner",page:"My Learning",   severity:"Info",    status:"Success",  ts:"2025-06-16 08:44"},
  {id:"a6", user:"System",             action:"LXP sync attempted",          portal:"Admin",  page:"LXP Setup",     severity:"Warning", status:"Partial",  ts:"2025-06-16 07:00"},
  {id:"a7", user:"System",             action:"Auto-heal: session repair",   portal:"System", page:"Platform Analyst",severity:"Info",  status:"Resolved", ts:"2025-06-16 06:30"},
  {id:"a8", user:"Thabo Serame",       action:"Modified module note",        portal:"Admin",  page:"Module Notes",  severity:"Info",    status:"Success",  ts:"2025-06-15 17:22"},
  {id:"a9", user:"Demo Learner 4",     action:"2FA verified",                portal:"Access", page:"Onboarding",    severity:"Info",    status:"Success",  ts:"2025-06-15 16:55"},
  {id:"a10",user:"System",             action:"Diagnostic scan completed",   portal:"System", page:"Platform Analyst",severity:"Info", status:"Success",  ts:"2025-06-15 16:00"},
  {id:"a11",user:"Demo Learner 5",     action:"Invalid org code entered",    portal:"Access", page:"Onboarding",    severity:"Warning", status:"Blocked",  ts:"2025-06-15 15:44"},
  {id:"a12",user:"Thabo Serame",       action:"Integration config saved",    portal:"Admin",  page:"LXP Setup",     severity:"Info",    status:"Success",  ts:"2025-06-15 14:30"},
];

const DEMO_SYS_ISSUES = [
  {id:"si1",sev:"High",    issue:"LXP sync stale — Workday last synced >48h ago",            portal:"Admin",  page:"LXP Setup",     cause:"API token expired",                      impact:"Completion data not flowing to Workday",         fix:"Regenerate API token and retry sync",              auto:true,  status:"Open"},
  {id:"si2",sev:"Medium",  issue:"3 learner profiles missing industry/function fields",       portal:"Learner",page:"Onboarding",    cause:"Onboarding skipped Step 2",              impact:"Generic content shown instead of contextual",    fix:"Prompt learners to complete profile",               auto:true,  status:"Open"},
  {id:"si3",sev:"Medium",  issue:"Capability Check not producing score for 1 learner",       portal:"Learner",page:"Capability Check",cause:"Incomplete dimension completion",       impact:"Readiness dashboard showing null score",          fix:"Reset incomplete assessment session",              auto:true,  status:"Open"},
  {id:"si4",sev:"Low",     issue:"Module Notes: 4 notes published without audience setting", portal:"Admin",  page:"Module Notes",  cause:"Visibility field left blank on save",    impact:"Notes visible to all roles unintentionally",      fix:"Apply default audience = All roles",               auto:true,  status:"Open"},
  {id:"si5",sev:"Critical",issue:"AI Governance module has no diagnostic questions assigned",portal:"Admin",  page:"Capability Taxonomy",cause:"Question bank gap for new module",  impact:"Learners in Governance roles get generic Qs",   fix:"Rebuild question bank for AI Governance module",   auto:false, status:"Open"},
  {id:"si6",sev:"High",    issue:"Role Disruption Forecast data not contextualised to org",  portal:"Admin",  page:"Reports",       cause:"Demo data not org-scoped",              impact:"Reports show generic sector data not org data",   fix:"Bind org context to report generation",            auto:false, status:"Open"},
  {id:"si7",sev:"Low",     issue:"Admin audit log missing entries for 2025-06-14",           portal:"Admin",  page:"Audit Logs",    cause:"Logging service restart during patch",   impact:"Audit gap of 4 hours on June 14",                 fix:"Restore from session backup",                      auto:false, status:"Resolved"},
  {id:"si8",sev:"Medium",  issue:"Integration Logs tab shows empty table for new installs",  portal:"Admin",  page:"LXP Setup",     cause:"Log table not initialised on first load","impact":"Admin sees blank table — may assume logs lost",fix:"Initialise log table on admin portal load",         auto:true,  status:"Open"},
];

// ─── Facilitator / Admin Portal ───────────────────────────────────────────────
const INTEGRATIONS=[
  {id:"oracle",  name:"Oracle HCM Cloud",    emoji:"🔶",type:"HR + LMS",  status:"Live",      protocol:"xAPI 1.0/2.0 · REST API",     syncItems:["Completion records","User profiles","Enrolment data","LP scores"],         setupSteps:["Generate API credentials in Oracle HCM","Enter Client ID and Secret below","Map CapabilityOS roles to Oracle job codes","Enable xAPI endpoint in Oracle Learning Cloud","Run test sync"],lastSync:"2 hours ago", users:1247,records:14820},
  {id:"workday", name:"Workday Learning",    emoji:"⚡",type:"HCM + LMS", status:"Live",      protocol:"xAPI 1.0 · REST API",         syncItems:["Learning completions","Worker profiles","Skills data","Certification records"],setupSteps:["Create an ISU in Workday","Assign required security groups","Configure CapabilityOS as a connected app","Map learning activities to Workday programs","Schedule auto-sync"],lastSync:"4 hours ago",users:892, records:9340},
  {id:"sap",     name:"SAP SuccessFactors",  emoji:"🔷",type:"HCM + LMS", status:"Available", protocol:"SCORM 2004 · xAPI · oData",    syncItems:["Course completions","User data","Skills profiles","Compliance records"],     setupSteps:["Enable LMS Integration in SuccessFactors","Download CapabilityOS SCORM package","Upload to SF Learning Management","Configure SSO with SF Identity Provider","Test with pilot user group"],lastSync:null,users:0,records:0},
  {id:"corner",  name:"Cornerstone OnDemand",emoji:"🟦",type:"LMS",       status:"Available", protocol:"SCORM 2004/1.2 · LTI 1.3",    syncItems:["Course completion","Transcript data","Custom objects","Group enrolments"],   setupSteps:["Create Integration Partner in Cornerstone","Configure SCORM package import","Map programmes to Cornerstone curriculum","Set up SSO via SAML 2.0","Enable transcript sync"],lastSync:null,users:0,records:0},
  {id:"viva",    name:"MS Viva Learning",    emoji:"🟦",type:"Microsoft",  status:"Available", protocol:"LTI 1.3 · REST API",          syncItems:["Content catalogue","Learning completions","Teams integration","People profiles"],setupSteps:["Register CapabilityOS as LTI provider in Azure AD","Configure Microsoft 365 admin consent","Enable Viva Learning in Teams admin","Map content catalogue","Test via Viva Learning app"],lastSync:null,users:0,records:0},
  {id:"degreed", name:"Degreed",             emoji:"🟣",type:"LXP",       status:"Beta",      protocol:"REST API (OpenAPI 3.0)",       syncItems:["Skills data","Pathway completions","Content catalogue","Engagement data"],   setupSteps:["Request API access from Degreed","Obtain OAuth 2.0 credentials","Map skills to Degreed skill framework","Configure content push via REST API","Enable skills sync"],lastSync:null,users:0,records:0},
  {id:"linkedin",name:"LinkedIn Learning",   emoji:"🔵",type:"Content LXP",status:"Beta",      protocol:"REST API",                    syncItems:["Completions","Skills alignment","Profile data","Recommendations"],           setupSteps:["Generate LinkedIn Learning API key","Configure content integration","Map users by email domain","Enable completion webhook","Set content sync schedule"],lastSync:null,users:0,records:0},
  {id:"moodle",  name:"Moodle Workplace",    emoji:"🟠",type:"LMS",       status:"Available", protocol:"xAPI 1.0 · REST API",         syncItems:["Course completions","Grade data","User accounts","Certificate records"],    setupSteps:["Install CapabilityOS Moodle plugin","Configure REST endpoint and token","Enable xAPI (Logstore)","Map Moodle cohorts to CapabilityOS roles","Test completion sync"],lastSync:null,users:0,records:0},
  {id:"sage",    name:"SAGE HR",             emoji:"🟢",type:"HR",        status:"Available", protocol:"REST API · Webhook",          syncItems:["Employee records","Department data","Role changes","Onboarding triggers"],  setupSteps:["Generate SAGE HR API key","Configure CapabilityOS webhook URL in SAGE","Map departments to CapabilityOS functions","Enable employee sync","Test with single record"],lastSync:null,users:0,records:0},
];
const STATUS_COLOR={Live:"#34C759",Available:"#5AC8FA",Beta:"#FF9500"};
const STATUS_BG   ={Live:"rgba(52,199,89,0.15)",Available:"rgba(90,200,250,0.15)",Beta:"rgba(255,149,0,0.15)"};

// ─── Context Strip ────────────────────────────────────────────────────────────
/** @param {{user:string,industry:string,userFn:string,subFn:string,xp:number}} props @returns {JSX.Element} Slim contextual header strip showing user profile details. */
function ContextStrip({user,industry,userFn,subFn,xp}){
  if(!user)return null;
  var lv=getLv(xp||0);
  var items=[
    user.role&&(ROLE_DISPLAY[user.role]||user.role),
    subFn||userFn||null,
    industry||null,
    "Digilytics Demo",
    lv&&lv.name,
  ].filter(Boolean);
  return(
    <div style={{background:"#EBF4FF",borderBottom:"1px solid #BFDBFE",padding:"6px 24px",display:"flex",alignItems:"center",gap:0,overflowX:"auto",scrollbarWidth:"none"}}>
      {items.map(function(item,i){return(
        <span key={i} style={{display:"flex",alignItems:"center",gap:0,flexShrink:0}}>
          <span style={{fontSize:11,fontWeight:i===0?700:500,color:i===0?"#0055CC":"#4B5563",whiteSpace:"nowrap"}}>{item}</span>
          {i<items.length-1&&<span style={{margin:"0 6px",color:"#93C5FD",fontSize:11}}>·</span>}
        </span>
      );},this)}
      <span style={{marginLeft:"auto",flexShrink:0,fontSize:10,fontWeight:700,color:"#0070F3",background:"rgba(0,112,243,0.08)",padding:"2px 8px",borderRadius:10,border:"1px solid rgba(0,112,243,0.2)"}}>
        {lv&&lv.name}
      </span>
    </div>
  );
}

// ─── Role Disruption Forecast ─────────────────────────────────────────────────
/** @returns {JSX.Element} Admin view: Role disruption forecast dashboard. */
function RoleDisruptionView(){
  var [filter,setFilter]=useState("All");
  var levels=["All","Critical","High","Moderate","Low"];
  var filtered=filter==="All"?DEMO_ROLE_DISRUPTION:DEMO_ROLE_DISRUPTION.filter(function(r){return r.disruption===filter;});
  var dCol={Critical:"#FF3B30",High:"#FF9500",Moderate:"#E8B84B",Low:"#34C759"};
  return(
    <div className="fade-in" style={{flex:1,overflowY:"auto",background:"#F4F6F8"}}>
      <div style={{background:"linear-gradient(135deg,#003A87,#0055CC)",padding:"22px 28px",borderBottom:"1px solid rgba(255,255,255,0.08)"}}>
        <div style={{fontSize:11,fontWeight:700,color:"rgba(255,255,255,0.6)",textTransform:"uppercase",letterSpacing:".1em",marginBottom:6}}>Workforce Intelligence</div>
        <div style={{fontSize:22,fontWeight:800,color:"#FFF",marginBottom:4}}>Role Disruption Forecast</div>
        <div style={{fontSize:12,color:"rgba(255,255,255,0.6)"}}>AI and automation exposure analysis across role families. Identify reskilling urgency and transformation actions.</div>
      </div>
      <div style={{padding:"18px 24px"}}>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:18}} className="mob-grid1">
          {[["Critical",DEMO_ROLE_DISRUPTION.filter(function(r){return r.disruption==="Critical";}).length,"#FF3B30"],["High",DEMO_ROLE_DISRUPTION.filter(function(r){return r.disruption==="High";}).length,"#FF9500"],["Moderate",DEMO_ROLE_DISRUPTION.filter(function(r){return r.disruption==="Moderate";}).length,"#E8B84B"],["Low",DEMO_ROLE_DISRUPTION.filter(function(r){return r.disruption==="Low";}).length,"#34C759"]].map(function(kpi,i){return(
            <div key={i} onClick={function(){setFilter(kpi[0]);}} role="button" tabIndex={0} onKeyDown={function(e){if(e.key==="Enter"||e.key===" ")setFilter(kpi[0]);}} style={{background:"#FFF",border:"2px solid "+(filter===kpi[0]?kpi[2]:"#E5E7EB"),borderRadius:10,padding:"14px 16px",textAlign:"center",cursor:"pointer",transition:"all .15s"}}>
              <div style={{fontSize:26,fontWeight:800,color:kpi[2]}}>{kpi[1]}</div>
              <div style={{fontSize:11,color:"#6B7280",marginTop:2}}>{kpi[0]} disruption</div>
            </div>
          );},this)}
        </div>
        <div style={{display:"flex",gap:7,marginBottom:14,flexWrap:"wrap"}}>
          {levels.map(function(l){return(
            <button key={l} onClick={function(){setFilter(l);}} style={{padding:"5px 14px",borderRadius:20,border:"1px solid "+(filter===l?"#0070F3":"#E5E7EB"),background:filter===l?"#EBF4FF":"#FFF",color:filter===l?"#0055CC":"#6B7280",fontSize:11,fontWeight:filter===l?700:400,cursor:"pointer",fontFamily:"inherit"}}>{l}</button>
          );},this)}
        </div>
        <div style={{background:"#FFF",borderRadius:12,border:"1px solid #E5E7EB",overflow:"hidden"}}>
          <div style={{overflowX:"auto"}}>
            <table style={{width:"100%",borderCollapse:"collapse",fontSize:12,minWidth:700}}>
              <thead style={{background:"#F9FAFB"}}>
                <tr>
                  {["Role","Function","Disruption","Automation %","Augmentation %","Key Skills to Build","Action","Timeline"].map(function(h,i){return(
                    <th key={i} style={{padding:"10px 14px",textAlign:"left",fontSize:11,fontWeight:700,color:"#374151",borderBottom:"1px solid #E5E7EB",whiteSpace:"nowrap"}}>{h}</th>
                  );},this)}
                </tr>
              </thead>
              <tbody>
                {filtered.map(function(r,i){
                  var dc=dCol[r.disruption]||"#8B97B5";
                  return(
                    <tr key={i} style={{borderBottom:"1px solid #F3F4F6",background:i%2===0?"#FFF":"#F9FAFB"}}>
                      <td style={{padding:"10px 14px",fontWeight:600,color:"#111827"}}>{r.role}</td>
                      <td style={{padding:"10px 14px",color:"#6B7280"}}>{r.family}</td>
                      <td style={{padding:"10px 14px"}}><span style={{fontSize:11,fontWeight:700,padding:"2px 8px",borderRadius:8,background:dc+"15",color:dc}}>{r.disruption}</span></td>
                      <td style={{padding:"10px 14px"}}>
                        <div style={{display:"flex",alignItems:"center",gap:7}}>
                          <div style={{width:48,height:4,background:"#E5E7EB",borderRadius:2}}>
                            <div style={{width:r.automation+"%",height:"100%",background:r.automation>=70?"#FF3B30":r.automation>=50?"#FF9500":"#34C759",borderRadius:2}}/>
                          </div>
                          <span style={{fontSize:11,fontWeight:700,color:r.automation>=70?"#FF3B30":r.automation>=50?"#FF9500":"#34C759"}}>{r.automation}%</span>
                        </div>
                      </td>
                      <td style={{padding:"10px 14px"}}>
                        <div style={{display:"flex",alignItems:"center",gap:7}}>
                          <div style={{width:48,height:4,background:"#E5E7EB",borderRadius:2}}>
                            <div style={{width:r.augmentation+"%",height:"100%",background:"#0070F3",borderRadius:2}}/>
                          </div>
                          <span style={{fontSize:11,fontWeight:700,color:"#0070F3"}}>{r.augmentation}%</span>
                        </div>
                      </td>
                      <td style={{padding:"10px 14px",color:"#6B7280",fontSize:11}}>{r.skills.slice(0,2).join(", ")}</td>
                      <td style={{padding:"10px 14px"}}><span style={{fontSize:11,color:"#0055CC",fontWeight:600}}>{r.action}</span></td>
                      <td style={{padding:"10px 14px",color:"#9CA3AF",fontSize:11}}>{r.timeline}</td>
                    </tr>
                  );
                },this)}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Skills Gap Analysis ──────────────────────────────────────────────────────
/** @returns {JSX.Element} Admin view: Skills gap analysis across the organisation. */
function SkillsGapView(){
  var topGaps=DEMO_CAPABILITIES.filter(function(c){return c.gap>=2;}).sort(function(a,b){return b.gap-a.gap;});
  var profLabels=["","Unaware","Aware","Working","Proficient","Advanced"];
  var domainGroups=DEMO_CAPABILITIES.reduce(function(acc,cap){if(!acc[cap.domain])acc[cap.domain]=[];acc[cap.domain].push(cap);return acc;},{});
  return(
    <div className="fade-in" style={{flex:1,overflowY:"auto",background:"#F4F6F8"}}>
      <div style={{background:"linear-gradient(135deg,#003A87,#0055CC)",padding:"22px 28px",borderBottom:"1px solid rgba(255,255,255,0.08)"}}>
        <div style={{fontSize:11,fontWeight:700,color:"rgba(255,255,255,0.6)",textTransform:"uppercase",letterSpacing:".1em",marginBottom:6}}>Capability Intelligence</div>
        <div style={{fontSize:22,fontWeight:800,color:"#FFF",marginBottom:4}}>Skills Gap Analysis</div>
        <div style={{fontSize:12,color:"rgba(255,255,255,0.6)"}}>Current vs required capability levels. {topGaps.length} critical gaps identified across {Object.keys(domainGroups).length} domains.</div>
      </div>
      <div style={{padding:"18px 24px"}}>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:18}} className="mob-grid1">
          {[["Critical Gaps (≥3)",DEMO_CAPABILITIES.filter(function(c){return c.gap>=3;}).length,"#FF3B30"],["High Gaps (=2)",DEMO_CAPABILITIES.filter(function(c){return c.gap===2;}).length,"#FF9500"],["Low Gaps (=1)",DEMO_CAPABILITIES.filter(function(c){return c.gap===1;}).length,"#E8B84B"]].map(function(kpi,i){return(
            <div key={i} style={{background:"#FFF",border:"1px solid #E5E7EB",borderLeft:"4px solid "+kpi[2],borderRadius:10,padding:"14px 16px"}}>
              <div style={{fontSize:26,fontWeight:800,color:kpi[2]}}>{kpi[1]}</div>
              <div style={{fontSize:12,color:"#6B7280",marginTop:2}}>{kpi[0]}</div>
            </div>
          );},this)}
        </div>
        <div style={{background:"#FFF",borderRadius:12,border:"1px solid #E5E7EB",padding:"18px 20px",marginBottom:14}}>
          <div style={{fontSize:13,fontWeight:700,color:"#111827",marginBottom:14}}>Capability Gap Matrix</div>
          <div style={{overflowX:"auto"}}>
            <table style={{width:"100%",borderCollapse:"collapse",fontSize:12,minWidth:600}}>
              <thead style={{background:"#F9FAFB"}}>
                <tr>
                  {["Capability","Domain","Current","Required","Gap","Business Impact","Urgency"].map(function(h,i){return(
                    <th key={i} style={{padding:"9px 12px",textAlign:"left",fontSize:11,fontWeight:700,color:"#374151",borderBottom:"1px solid #E5E7EB",whiteSpace:"nowrap"}}>{h}</th>
                  );},this)}
                </tr>
              </thead>
              <tbody>
                {DEMO_CAPABILITIES.sort(function(a,b){return b.gap-a.gap;}).map(function(cap,i){
                  var gc=cap.gap>=3?"#FF3B30":cap.gap===2?"#FF9500":"#E8B84B";
                  var ic=cap.importance==="Critical"?"#FF3B30":cap.importance==="High"?"#FF9500":"#5AC8FA";
                  return(
                    <tr key={i} style={{borderBottom:"1px solid #F3F4F6",background:i%2===0?"#FFF":"#F9FAFB"}}>
                      <td style={{padding:"9px 12px",fontWeight:600,color:"#111827"}}>{cap.name}</td>
                      <td style={{padding:"9px 12px",color:"#6B7280",fontSize:11}}>{cap.domain}</td>
                      <td style={{padding:"9px 12px",fontWeight:700,color:"#374151"}}>{profLabels[cap.current]||cap.current}</td>
                      <td style={{padding:"9px 12px",color:"#0055CC",fontWeight:600}}>{profLabels[cap.target]||cap.target}</td>
                      <td style={{padding:"9px 12px"}}><span style={{fontSize:11,fontWeight:800,padding:"2px 8px",borderRadius:8,background:gc+"18",color:gc}}>{cap.gap} level{cap.gap!==1?"s":""}</span></td>
                      <td style={{padding:"9px 12px"}}><span style={{fontSize:11,fontWeight:700,color:ic}}>{cap.importance}</span></td>
                      <td style={{padding:"9px 12px",color:"#6B7280",fontSize:11}}>{cap.risk}</td>
                    </tr>
                  );
                },this)}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}


// ─── Capability Map View ─────────────────────────────────────────────────────
/** @returns {JSX.Element} Admin view: Interactive organisational capability map. */
function CapabilityMapView(){
  var [viewMode, setViewMode] = useState("grid");
  var [selectedCap, setSelectedCap] = useState(null);

  var caps = DEMO_CAPABILITIES;
  var sorted = caps.slice().sort(function(a,b){return b.gap-a.gap;});
  var displayCaps = viewMode==="priority" ? sorted : caps;

  function gapCol(gap){
    return gap>=3?"#FF3B30":gap===2?"#FF9500":"#E8B84B";
  }

  function linkedIntvs(cap){
    return DEMO_INTERVENTIONS.filter(function(inv){
      return inv.gaps.indexOf(cap.name)!==-1;
    });
  }

  function recAction(gap){
    if(gap>=3) return "Prioritise immediately — enrol in the linked intervention within 30 days.";
    if(gap===2) return "Address within the next quarter — assign a targeted learning pathway.";
    return "Monitor and maintain — include in the next annual skills review.";
  }

  var domainCount = [].concat(DEMO_CAPABILITIES.map(function(x){return x.domain;})).filter(function(v,i,a){return a.indexOf(v)===i;}).length;

  return(
    <div className="fade-in" style={{overflowY:"auto",flex:1,padding:"0 0 60px"}}>

      {/* Header */}
      <div style={{background:"linear-gradient(135deg,#0A1828,#0D2040)",padding:"22px 28px",borderBottom:"1px solid rgba(255,255,255,0.06)"}}>
        <div style={{fontSize:11,fontWeight:700,color:"#FF9500",textTransform:"uppercase",letterSpacing:".1em",marginBottom:6}}>Capability Intelligence</div>
        <div style={{fontSize:20,fontWeight:800,color:"#FFF",marginBottom:4}}>Capability Map</div>
        <div style={{fontSize:12,color:"rgba(255,255,255,0.45)"}}>{caps.length} capabilities mapped across {domainCount} domains. Click any cell for details.</div>
      </div>

      {/* Toolbar */}
      <div style={{padding:"14px 28px",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:10,borderBottom:"1px solid rgba(255,255,255,0.06)",background:"#050E1A"}}>
        <div style={{display:"flex",gap:16,flexWrap:"wrap"}}>
          {[["#FF3B30","Critical (gap ≥ 3)"],["#FF9500","High (gap = 2)"],["#E8B84B","Low (gap = 1)"]].map(function(l,i){
            return(
              <div key={i} style={{display:"flex",alignItems:"center",gap:5}}>
                <span style={{width:10,height:10,borderRadius:3,background:l[0],display:"inline-block",flexShrink:0}}></span>
                <span style={{fontSize:11,color:"rgba(255,255,255,0.5)"}}>{l[1]}</span>
              </div>
            );
          })}
        </div>
        <div style={{display:"flex",gap:0,borderRadius:8,overflow:"hidden",border:"1px solid rgba(255,255,255,0.12)"}}>
          {[["grid","Grid"],["priority","Priority"]].map(function(v){
            var isActive=viewMode===v[0];
            return(
              <button key={v[0]} onClick={function(){setViewMode(v[0]);setSelectedCap(null);}} style={{padding:"6px 18px",fontSize:12,fontWeight:600,border:"none",cursor:"pointer",background:isActive?"#FF9500":"transparent",color:isActive?"#FFF":"rgba(255,255,255,0.5)",transition:"all .15s"}}>
                {v[1]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid view */}
      {viewMode==="grid"&&(
        <div style={{padding:"20px 28px",display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10}} className="mob-grid1">
          {displayCaps.map(function(cap){
            var gc=gapCol(cap.gap);
            var isSel=selectedCap&&selectedCap.id===cap.id;
            var barPct=Math.round((cap.current/cap.target)*100);
            return(
              <button key={cap.id} onClick={function(){setSelectedCap(isSel?null:cap);}} style={{textAlign:"left",background:isSel?"rgba(255,153,0,0.10)":"rgba(255,255,255,0.04)",border:"1px solid "+(isSel?gc:"rgba(255,255,255,0.07)"),borderLeft:"3px solid "+gc,borderRadius:10,padding:"14px 16px",cursor:"pointer",transition:"all .15s",outline:"none"}}>
                <div style={{fontSize:12,fontWeight:700,color:"rgba(255,255,255,0.9)",marginBottom:3,lineHeight:1.3}}>{cap.name}</div>
                <div style={{fontSize:10,color:"rgba(255,255,255,0.35)",marginBottom:9}}>{cap.domain}</div>
                <div style={{marginBottom:6}}>
                  <div style={{height:3,background:"rgba(255,255,255,0.08)",borderRadius:3,overflow:"hidden"}}>
                    <div style={{width:barPct+"%",height:"100%",background:gc,borderRadius:3,transition:"width .3s"}}></div>
                  </div>
                </div>
                <div style={{display:"flex",justifyContent:"space-between",fontSize:10,color:"rgba(255,255,255,0.35)"}}>
                  <span>Current: {cap.current}/5</span>
                  <span style={{color:gc,fontWeight:700}}>Gap: {cap.gap}</span>
                  <span>Target: {cap.target}/5</span>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Priority view */}
      {viewMode==="priority"&&(
        <div style={{padding:"20px 28px",display:"flex",flexDirection:"column",gap:8}}>
          {displayCaps.map(function(cap){
            var gc=gapCol(cap.gap);
            var isSel=selectedCap&&selectedCap.id===cap.id;
            var barPct=Math.round((cap.current/cap.target)*100);
            return(
              <button key={cap.id} onClick={function(){setSelectedCap(isSel?null:cap);}} style={{textAlign:"left",display:"flex",alignItems:"center",gap:14,background:isSel?"rgba(255,153,0,0.10)":"rgba(255,255,255,0.04)",border:"1px solid "+(isSel?gc:"rgba(255,255,255,0.07)"),borderLeft:"3px solid "+gc,borderRadius:10,padding:"12px 18px",cursor:"pointer",transition:"all .15s",outline:"none"}}>
                <div style={{fontSize:18,fontWeight:800,color:gc,minWidth:22,textAlign:"center"}}>{cap.gap}</div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:13,fontWeight:700,color:"rgba(255,255,255,0.9)",marginBottom:5}}>{cap.name}</div>
                  <div style={{height:3,background:"rgba(255,255,255,0.08)",borderRadius:3,overflow:"hidden"}}>
                    <div style={{width:barPct+"%",height:"100%",background:gc,borderRadius:3}}></div>
                  </div>
                </div>
                <div style={{textAlign:"right",flexShrink:0}}>
                  <div style={{fontSize:10,color:"rgba(255,255,255,0.35)",marginBottom:2}}>{cap.domain}</div>
                  <div style={{fontSize:11,color:gc,fontWeight:700}}>{cap.importance}</div>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Detail drawer — fixed right panel */}
      {selectedCap&&(
        <div style={{position:"fixed",top:0,right:0,bottom:0,width:340,background:"#050E1A",borderLeft:"1px solid rgba(255,255,255,0.10)",overflowY:"auto",zIndex:500,boxShadow:"-8px 0 32px rgba(0,0,0,0.5)"}}>

          <div style={{padding:"18px 20px",borderBottom:"1px solid rgba(255,255,255,0.07)",display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:10,background:"#030B16"}}>
            <div>
              <div style={{fontSize:10,fontWeight:700,color:"#FF9500",textTransform:"uppercase",letterSpacing:".1em",marginBottom:4}}>Capability Detail</div>
              <div style={{fontSize:16,fontWeight:800,color:"#FFF",lineHeight:1.2}}>{selectedCap.name}</div>
              <div style={{fontSize:11,color:"rgba(255,255,255,0.4)",marginTop:3}}>{selectedCap.domain}</div>
            </div>
            <button onClick={function(){setSelectedCap(null);}} aria-label="Close capability detail" style={{background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.08)",color:"rgba(255,255,255,0.6)",cursor:"pointer",borderRadius:6,width:28,height:28,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,flexShrink:0,marginTop:2,lineHeight:1}}>✕</button>
          </div>

          <div style={{padding:"16px 20px",display:"flex",flexDirection:"column",gap:14}}>

            {/* Gap bar */}
            <div style={{background:"rgba(255,255,255,0.04)",borderRadius:8,padding:"12px 14px"}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:6,fontSize:11,color:"rgba(255,255,255,0.5)"}}>
                <span>Current: {selectedCap.current}/5</span>
                <span>Target: {selectedCap.target}/5</span>
              </div>
              <div style={{height:6,background:"rgba(255,255,255,0.08)",borderRadius:6,overflow:"hidden",marginBottom:7}}>
                <div style={{width:Math.round((selectedCap.current/selectedCap.target)*100)+"%",height:"100%",background:gapCol(selectedCap.gap),borderRadius:6}}></div>
              </div>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:11}}>
                <span style={{color:gapCol(selectedCap.gap),fontWeight:700}}>Gap: {selectedCap.gap} level{selectedCap.gap!==1?"s":""}</span>
                <span style={{color:"rgba(255,255,255,0.35)"}}>Risk: {selectedCap.risk}</span>
              </div>
            </div>

            {/* Description */}
            <div>
              <div style={{fontSize:10,fontWeight:700,color:"rgba(255,255,255,0.4)",textTransform:"uppercase",letterSpacing:".08em",marginBottom:5}}>Description</div>
              <div style={{fontSize:12,color:"rgba(255,255,255,0.7)",lineHeight:1.6}}>Core enterprise capability in {selectedCap.domain}. Required across business units to support the organisation's AI and digital transformation agenda.</div>
            </div>

            {/* Meta fields */}
            {[["Owner",selectedCap.owner],["Strategic Importance",selectedCap.importance],["Risk Level",selectedCap.risk]].map(function(m,i){
              return(
                <div key={i}>
                  <div style={{fontSize:10,fontWeight:700,color:"rgba(255,255,255,0.4)",textTransform:"uppercase",letterSpacing:".08em",marginBottom:4}}>{m[0]}</div>
                  <div style={{fontSize:13,color:"rgba(255,255,255,0.85)",fontWeight:600}}>{m[1]}</div>
                </div>
              );
            })}

            {/* Recommended action */}
            <div style={{background:"rgba(255,153,0,0.08)",borderRadius:8,padding:"12px 14px",borderLeft:"3px solid #FF9500"}}>
              <div style={{fontSize:10,fontWeight:700,color:"#FF9500",textTransform:"uppercase",letterSpacing:".08em",marginBottom:5}}>Recommended Action</div>
              <div style={{fontSize:12,color:"rgba(255,255,255,0.75)",lineHeight:1.6}}>{recAction(selectedCap.gap)}</div>
            </div>

            {/* Linked interventions */}
            <div>
              <div style={{fontSize:10,fontWeight:700,color:"rgba(255,255,255,0.4)",textTransform:"uppercase",letterSpacing:".08em",marginBottom:8}}>Linked Interventions</div>
              {linkedIntvs(selectedCap).length===0?(
                <div style={{fontSize:12,color:"rgba(255,255,255,0.3)",fontStyle:"italic"}}>No direct intervention linked. See Intervention Planner for available options.</div>
              ):(
                <div style={{display:"flex",flexDirection:"column",gap:6}}>
                  {linkedIntvs(selectedCap).map(function(inv){
                    var pc=inv.priority==="Critical"?"#FF3B30":inv.priority==="High"?"#FF9500":"#E8B84B";
                    return(
                      <div key={inv.id} style={{background:"rgba(255,255,255,0.04)",borderRadius:7,padding:"10px 12px",border:"1px solid rgba(255,255,255,0.06)"}}>
                        <div style={{fontSize:12,fontWeight:700,color:"rgba(255,255,255,0.85)",marginBottom:5,lineHeight:1.3}}>{inv.title}</div>
                        <div style={{display:"flex",gap:6,flexWrap:"wrap",alignItems:"center"}}>
                          <span style={{fontSize:10,fontWeight:700,padding:"1px 6px",borderRadius:5,background:pc+"20",color:pc}}>{inv.priority}</span>
                          <span style={{fontSize:10,color:"rgba(255,255,255,0.35)"}}>{inv.duration}</span>
                          <span style={{fontSize:10,color:"rgba(255,255,255,0.25)"}}>·</span>
                          <span style={{fontSize:10,color:"rgba(255,255,255,0.35)"}}>{inv.audience}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}


// ─── Strategic Workforce Planning ────────────────────────────────────────────
/** @returns {JSX.Element} Admin view: Strategic workforce planning intelligence panel. */
function StrategicWorkforceView(){
  var riskColor={Critical:"#FF3B30",High:"#FF9500",Medium:"#E8B84B",Low:"#34C759"};
  var riskBg={Critical:"rgba(255,59,48,0.12)",High:"rgba(255,149,0,0.12)",Medium:"rgba(232,184,75,0.1)",Low:"rgba(52,199,89,0.1)"};
  var phaseColor={Foundation:"#5AC8FA",Deploy:"#A78BFA",Scale:"#34C759",Optimize:"#FF9500",Sustain:"#0070F3"};

  var [scenario,setScenario]=useState("base");
  var [view,setView]=useState("fourb");

  var scen=DEMO_WORKFORCE_PLAN.scenarios.find(function(s){return s.id===scenario;})||DEMO_WORKFORCE_PLAN.scenarios[1];
  var fourB=DEMO_WORKFORCE_PLAN.fourB;
  var quarters=DEMO_WORKFORCE_PLAN.quarters;

  var totalAtRisk=fourB.reduce(function(a,b){return a+b.atRisk;},0);
  var criticalBUs=fourB.filter(function(b){return b.risk==="Critical";}).length;
  var totalBuild=fourB.reduce(function(a,b){return a+b.build;},0);
  var totalBuy=fourB.reduce(function(a,b){return a+b.buy;},0);
  var totalBorrow=fourB.reduce(function(a,b){return a+b.borrow;},0);
  var totalBot=fourB.reduce(function(a,b){return a+b.bot;},0);

  return(
    <div className="fade-in" style={{overflowY:"auto",flex:1}}>

      {/* ── Header ── */}
      <div style={{background:"linear-gradient(135deg,#071828,#0A2038)",padding:"20px 24px",borderBottom:"1px solid rgba(255,255,255,0.06)"}}>
        <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",flexWrap:"wrap",gap:14}}>
          <div>
            <div style={{display:"flex",gap:7,marginBottom:8}}>
              <Badge label="Section 02" color="#5AC8FA" bg="rgba(90,200,250,0.12)"/>
              <Badge label="Strategic Planning" color="#A78BFA" bg="rgba(167,139,250,0.12)"/>
            </div>
            <div style={{fontSize:19,fontWeight:800,color:"#FFFFFF",letterSpacing:"-0.03em",marginBottom:3}}>Strategic Workforce Plan</div>
            <div style={{fontSize:12,color:"rgba(255,255,255,0.4)"}}>Build · Buy · Borrow · Bot decisions for {DEMO_ORG.name}. {DEMO_ORG.employeeCount.toLocaleString()} employees · FY2026 horizon.</div>
          </div>
          <div style={{display:"flex",gap:5,background:"rgba(255,255,255,0.04)",borderRadius:10,padding:4,border:"1px solid rgba(255,255,255,0.07)",alignSelf:"flex-start",flexShrink:0}}>
            {DEMO_WORKFORCE_PLAN.scenarios.map(function(s){
              var active=s.id===scenario;
              return(
                <button key={s.id} onClick={function(){setScenario(s.id);}}
                  style={{padding:"5px 13px",borderRadius:7,border:"none",cursor:"pointer",fontSize:11,fontWeight:700,letterSpacing:".04em",
                    background:active?"#5AC8FA":"transparent",color:active?"#030B16":"rgba(255,255,255,0.45)"}}>
                  {s.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div style={{padding:"14px 24px 32px"}}>

        {/* ── KPI strip ── */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:8,marginBottom:16}} className="mob-grid1">
          {[
            {label:"At-Risk Roles",    value:totalAtRisk,          sub:"across all BUs",           color:"#FF9500"},
            {label:"Critical BUs",     value:criticalBUs,          sub:"requiring immediate action",color:"#FF3B30"},
            {label:"Reskill Pipeline", value:scen.reskillTarget,   sub:scen.label+" scenario",     color:"#5AC8FA"},
            {label:"Hire Target",      value:scen.hireTarget,      sub:"net new hires planned",    color:"#34C759"},
            {label:"Automate Target",  value:scen.automateTarget,  sub:"roles to automate",        color:"#A78BFA"},
          ].map(function(kpi){
            return(
              <div key={kpi.label} style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:10,padding:"12px 14px",borderTop:"2px solid "+kpi.color}}>
                <div style={{fontSize:22,fontWeight:800,color:kpi.color,letterSpacing:"-0.04em",marginBottom:2}}>{kpi.value.toLocaleString()}</div>
                <div style={{fontSize:10,fontWeight:700,color:"rgba(255,255,255,0.65)",marginBottom:2}}>{kpi.label}</div>
                <div style={{fontSize:9.5,color:"rgba(255,255,255,0.3)"}}>{kpi.sub}</div>
              </div>
            );
          })}
        </div>

        {/* ── View toggles ── */}
        <div style={{display:"flex",gap:6,marginBottom:14}}>
          {[["fourb","4B Decision Matrix"],["roadmap","12-Month Roadmap"]].map(function(pair){
            var vid=pair[0],vlabel=pair[1],active=view===vid;
            return(
              <button key={vid} onClick={function(){setView(vid);}}
                style={{padding:"6px 16px",borderRadius:8,border:"1px solid",cursor:"pointer",fontSize:11,fontWeight:700,
                  borderColor:active?"#5AC8FA":"rgba(255,255,255,0.1)",
                  background:active?"rgba(90,200,250,0.12)":"transparent",
                  color:active?"#5AC8FA":"rgba(255,255,255,0.4)"}}>
                {vlabel}
              </button>
            );
          })}
        </div>

        {/* ── 4B Decision Matrix ── */}
        {view==="fourb"&&(
          <div style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:12,overflow:"hidden"}}>
            <div style={{padding:"13px 16px",borderBottom:"1px solid rgba(255,255,255,0.06)",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:8}}>
              <div style={{fontSize:12,fontWeight:700,color:"rgba(255,255,255,0.7)"}}>Build · Buy · Borrow · Bot by Business Unit</div>
              <div style={{fontSize:10,color:"rgba(255,255,255,0.3)"}}>Headcount affected · {scen.label} scenario · {scen.months}-month horizon</div>
            </div>
            <div style={{overflowX:"auto"}}>
              <table style={{width:"100%",borderCollapse:"collapse",fontSize:11.5,minWidth:560}}>
                <thead>
                  <tr style={{borderBottom:"1px solid rgba(255,255,255,0.08)"}}>
                    <td style={{padding:"9px 14px",color:"rgba(255,255,255,0.3)",fontWeight:700,minWidth:130}}>Business Unit</td>
                    <td style={{padding:"9px 10px",textAlign:"center",color:"#34C759",fontWeight:700,lineHeight:1.3}}>BUILD<br/><span style={{fontSize:9,color:"rgba(255,255,255,0.25)",fontWeight:400}}>Reskill</span></td>
                    <td style={{padding:"9px 10px",textAlign:"center",color:"#5AC8FA",fontWeight:700,lineHeight:1.3}}>BUY<br/><span style={{fontSize:9,color:"rgba(255,255,255,0.25)",fontWeight:400}}>Hire</span></td>
                    <td style={{padding:"9px 10px",textAlign:"center",color:"#E8B84B",fontWeight:700,lineHeight:1.3}}>BORROW<br/><span style={{fontSize:9,color:"rgba(255,255,255,0.25)",fontWeight:400}}>Contract</span></td>
                    <td style={{padding:"9px 10px",textAlign:"center",color:"#A78BFA",fontWeight:700,lineHeight:1.3}}>BOT<br/><span style={{fontSize:9,color:"rgba(255,255,255,0.25)",fontWeight:400}}>Automate</span></td>
                    <td style={{padding:"9px 10px",textAlign:"center",color:"rgba(255,255,255,0.35)",fontWeight:700,minWidth:66}}>At Risk</td>
                    <td style={{padding:"9px 10px",textAlign:"center",color:"rgba(255,255,255,0.35)",fontWeight:700,minWidth:72}}>Risk</td>
                  </tr>
                </thead>
                <tbody>
                  {fourB.map(function(row,i){
                    var rc=riskColor[row.risk]||"#8B97B5";
                    var rb=riskBg[row.risk]||"rgba(139,151,181,0.1)";
                    return(
                      <tr key={row.bu} style={{borderBottom:"1px solid rgba(255,255,255,0.04)",background:i%2===0?"transparent":"rgba(255,255,255,0.015)"}}>
                        <td style={{padding:"9px 14px",color:"rgba(255,255,255,0.75)",fontWeight:500}}>{row.bu}</td>
                        <td style={{padding:"9px 10px",textAlign:"center"}}>
                          <span style={{display:"inline-block",minWidth:32,padding:"2px 8px",borderRadius:5,background:"rgba(52,199,89,0.12)",color:"#34C759",fontWeight:700}}>{row.build}</span>
                        </td>
                        <td style={{padding:"9px 10px",textAlign:"center"}}>
                          <span style={{display:"inline-block",minWidth:32,padding:"2px 8px",borderRadius:5,background:"rgba(90,200,250,0.1)",color:"#5AC8FA",fontWeight:700}}>{row.buy}</span>
                        </td>
                        <td style={{padding:"9px 10px",textAlign:"center"}}>
                          <span style={{display:"inline-block",minWidth:32,padding:"2px 8px",borderRadius:5,background:"rgba(232,184,75,0.1)",color:"#E8B84B",fontWeight:700}}>{row.borrow}</span>
                        </td>
                        <td style={{padding:"9px 10px",textAlign:"center"}}>
                          <span style={{display:"inline-block",minWidth:32,padding:"2px 8px",borderRadius:5,background:"rgba(167,139,250,0.1)",color:"#A78BFA",fontWeight:700}}>{row.bot}</span>
                        </td>
                        <td style={{padding:"9px 10px",textAlign:"center",fontWeight:700,color:"rgba(255,255,255,0.7)"}}>{row.atRisk}</td>
                        <td style={{padding:"9px 10px",textAlign:"center"}}>
                          <span style={{padding:"3px 9px",borderRadius:5,background:rb,color:rc,fontWeight:700,fontSize:10}}>{row.risk}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr style={{borderTop:"1px solid rgba(255,255,255,0.1)",background:"rgba(255,255,255,0.03)"}}>
                    <td style={{padding:"9px 14px",color:"rgba(255,255,255,0.45)",fontWeight:700,fontSize:11}}>Total · 10 BUs</td>
                    <td style={{padding:"9px 10px",textAlign:"center",fontWeight:800,color:"#34C759",fontSize:13}}>{totalBuild}</td>
                    <td style={{padding:"9px 10px",textAlign:"center",fontWeight:800,color:"#5AC8FA",fontSize:13}}>{totalBuy}</td>
                    <td style={{padding:"9px 10px",textAlign:"center",fontWeight:800,color:"#E8B84B",fontSize:13}}>{totalBorrow}</td>
                    <td style={{padding:"9px 10px",textAlign:"center",fontWeight:800,color:"#A78BFA",fontSize:13}}>{totalBot}</td>
                    <td style={{padding:"9px 10px",textAlign:"center",fontWeight:800,color:"rgba(255,255,255,0.7)",fontSize:13}}>{totalAtRisk}</td>
                    <td style={{padding:"9px 10px",textAlign:"center",color:"rgba(255,255,255,0.25)",fontSize:10}}>—</td>
                  </tr>
                </tfoot>
              </table>
            </div>
            <div style={{padding:"10px 16px",background:"rgba(90,200,250,0.04)",borderTop:"1px solid rgba(255,255,255,0.05)",display:"flex",gap:20,flexWrap:"wrap",alignItems:"center"}}>
              <div style={{fontSize:10,color:"rgba(255,255,255,0.35)"}}>Scenario: <span style={{color:"#5AC8FA",fontWeight:700}}>{scen.label}</span></div>
              <div style={{fontSize:10,color:"rgba(255,255,255,0.35)"}}>Budget envelope: <span style={{color:"#E8B84B",fontWeight:700}}>{scen.budget}</span></div>
              <div style={{fontSize:10,color:"rgba(255,255,255,0.35)"}}>Delivery horizon: <span style={{color:"rgba(255,255,255,0.6)",fontWeight:700}}>{scen.months} months</span></div>
              <div style={{fontSize:10,color:"rgba(255,255,255,0.35)"}}>Organisation: <span style={{color:"rgba(255,255,255,0.6)",fontWeight:700}}>{DEMO_ORG.name}</span></div>
            </div>
          </div>
        )}

        {/* ── 12-Month Roadmap ── */}
        {view==="roadmap"&&(
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            <div style={{display:"flex",gap:14,marginBottom:2,flexWrap:"wrap"}}>
              {[["Hire","#5AC8FA"],["Reskill","#34C759"],["Redeploy","#E8B84B"],["Automate","#A78BFA"]].map(function(pair){
                return(
                  <div key={pair[0]} style={{display:"flex",alignItems:"center",gap:5}}>
                    <div style={{width:10,height:10,borderRadius:2,background:pair[1],flexShrink:0}}/>
                    <span style={{fontSize:10,color:"rgba(255,255,255,0.45)",fontWeight:700}}>{pair[0]}</span>
                  </div>
                );
              })}
            </div>

            {quarters.map(function(q){
              var total=q.hire+q.reskill+q.redeploy+q.automate;
              var pCol=phaseColor[q.phase]||"#5AC8FA";
              var hW=total>0?Math.round(q.hire/total*100):0;
              var rsW=total>0?Math.round(q.reskill/total*100):0;
              var rdW=total>0?Math.round(q.redeploy/total*100):0;
              var atW=total>0?Math.round(q.automate/total*100):0;
              return(
                <div key={q.q} style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:12,padding:"14px 16px"}}>
                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10,flexWrap:"wrap",gap:6}}>
                    <div style={{display:"flex",alignItems:"center",gap:10}}>
                      <div style={{fontSize:13,fontWeight:800,color:"#FFF",letterSpacing:"-0.02em"}}>{q.q}</div>
                      <span style={{padding:"2px 9px",borderRadius:5,background:"rgba(255,255,255,0.06)",color:pCol,fontWeight:700,fontSize:10}}>{q.phase}</span>
                    </div>
                    <div style={{fontSize:11,color:"rgba(255,255,255,0.4)",fontWeight:700}}>{total.toLocaleString()} workforce actions</div>
                  </div>
                  <div style={{height:8,borderRadius:4,overflow:"hidden",display:"flex",marginBottom:12,background:"rgba(255,255,255,0.05)"}}>
                    <div style={{width:hW+"%",background:"#5AC8FA",height:"100%"}}/>
                    <div style={{width:rsW+"%",background:"#34C759",height:"100%"}}/>
                    <div style={{width:rdW+"%",background:"#E8B84B",height:"100%"}}/>
                    <div style={{width:atW+"%",background:"#A78BFA",height:"100%"}}/>
                  </div>
                  <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:6}}>
                    {[["Hire",q.hire,"#5AC8FA"],["Reskill",q.reskill,"#34C759"],["Redeploy",q.redeploy,"#E8B84B"],["Automate",q.automate,"#A78BFA"]].map(function(seg){
                      return(
                        <div key={seg[0]} style={{textAlign:"center",background:"rgba(255,255,255,0.03)",borderRadius:8,padding:"8px 4px"}}>
                          <div style={{fontSize:16,fontWeight:800,color:seg[2],letterSpacing:"-0.03em"}}>{seg[1]}</div>
                          <div style={{fontSize:9,color:"rgba(255,255,255,0.3)",marginTop:1}}>{seg[0]}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            <div style={{background:"rgba(90,200,250,0.05)",border:"1px solid rgba(90,200,250,0.12)",borderRadius:12,padding:"13px 18px",display:"flex",gap:24,flexWrap:"wrap",alignItems:"center"}}>
              <div style={{fontSize:11,color:"rgba(255,255,255,0.4)",fontWeight:700,flexShrink:0}}>Scenario total ({scen.label})</div>
              {[["Hire Target",scen.hireTarget,"#5AC8FA"],["Reskill Target",scen.reskillTarget,"#34C759"],["Automate",scen.automateTarget,"#A78BFA"],["Budget",scen.budget,"#E8B84B"]].map(function(s){
                return(
                  <div key={s[0]}>
                    <div style={{fontSize:15,fontWeight:800,color:s[2],letterSpacing:"-0.02em"}}>{typeof s[1]==="number"?s[1].toLocaleString():s[1]}</div>
                    <div style={{fontSize:9,color:"rgba(255,255,255,0.3)"}}>{s[0]}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}


// ─── AI Readiness Diagnostic ─────────────────────────────────────────────────
/** @returns {JSX.Element} Admin view: Organisation-wide AI readiness diagnostic summary. */
function AIReadinessView(){
  var riskColor={Critical:"#FF3B30",High:"#FF9500",Medium:"#E8B84B",Low:"#34C759"};
  var riskBg={Critical:"rgba(255,59,48,0.1)",High:"rgba(255,149,0,0.1)",Medium:"rgba(232,184,75,0.08)",Low:"rgba(52,199,89,0.08)"};

  var [buFilter,setBuFilter]=useState("all");
  var [dimView,setDimView]=useState("bars");

  var orgScore=DEMO_ORG.aiReadiness;
  var dims=DEMO_READINESS_DIMS;

  var avgDim=Math.round(dims.reduce(function(a,d){return a+d.score;},0)/dims.length);
  var critDims=dims.filter(function(d){return d.target-d.score>=30;}).length;
  var onTrackDims=dims.filter(function(d){return d.score>=d.target;}).length;
  var biggestGap=dims.reduce(function(a,d){return (d.target-d.score)>(a.target-a.score)?d:a;},dims[0]);

  var filteredBUs=buFilter==="all"?DEMO_BUS:DEMO_BUS.filter(function(b){return b.risk===buFilter;});

  return(
    <div className="fade-in" style={{overflowY:"auto",flex:1}}>
      {/* ── Header ── */}
      <div style={{background:"linear-gradient(135deg,#0D0B1E,#1A1040)",padding:"20px 24px",borderBottom:"1px solid rgba(167,139,250,0.12)"}}>
        <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",flexWrap:"wrap",gap:14}}>
          <div>
            <div style={{display:"flex",gap:7,marginBottom:8}}>
              <Badge label="Section 03" color="#A78BFA" bg="rgba(167,139,250,0.12)"/>
              <Badge label="AI Readiness" color="#E8B84B" bg="rgba(232,184,75,0.1)"/>
            </div>
            <div style={{fontSize:19,fontWeight:800,color:"#FFFFFF",letterSpacing:"-0.03em",marginBottom:3}}>AI Readiness Diagnostic</div>
            <div style={{fontSize:12,color:"rgba(255,255,255,0.4)"}}>8-dimension capability diagnostic for {DEMO_ORG.name}. Org AI score: <span style={{color:"#A78BFA",fontWeight:700}}>{orgScore}/100</span> · {DEMO_ORG.employeeCount.toLocaleString()} employees assessed.</div>
          </div>
          {/* Gauge */}
          <div style={{textAlign:"center",flexShrink:0}}>
            <div style={{position:"relative",width:76,height:76,margin:"0 auto 4px"}}>
              <svg width="76" height="76" viewBox="0 0 76 76">
                <circle cx="38" cy="38" r="32" fill="none" stroke="rgba(167,139,250,0.12)" strokeWidth="7"/>
                <circle cx="38" cy="38" r="32" fill="none" stroke="#A78BFA" strokeWidth="7"
                  strokeDasharray={String(Math.round(2*3.14159*32*orgScore/100))+" "+String(Math.round(2*3.14159*32*(100-orgScore)/100))}
                  strokeLinecap="round" transform="rotate(-90 38 38)"/>
              </svg>
              <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",fontSize:16,fontWeight:800,color:"#A78BFA"}}>{orgScore}</div>
            </div>
            <div style={{fontSize:9.5,color:"rgba(255,255,255,0.35)",fontWeight:600,textTransform:"uppercase",letterSpacing:".06em"}}>AI Readiness</div>
          </div>
        </div>
      </div>

      <div style={{padding:"14px 24px 32px"}}>
        {/* ── KPI strip ── */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8,marginBottom:16}} className="mob-grid1">
          {[
            {label:"Org AI Score",     value:orgScore+"/100",  sub:"enterprise average",          color:"#A78BFA"},
            {label:"Avg Dimension",    value:avgDim+"/100",    sub:"across 8 dimensions",          color:"#5AC8FA"},
            {label:"Critical Gaps",    value:critDims,         sub:"dimensions ≥30pts below target",color:"#FF3B30"},
            {label:"On Target",        value:onTrackDims,      sub:"dimensions at or above target", color:"#34C759"},
          ].map(function(kpi){
            return(
              <div key={kpi.label} style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:10,padding:"12px 14px",borderTop:"2px solid "+kpi.color}}>
                <div style={{fontSize:22,fontWeight:800,color:kpi.color,letterSpacing:"-0.04em",marginBottom:2}}>{kpi.value}</div>
                <div style={{fontSize:10,fontWeight:700,color:"rgba(255,255,255,0.65)",marginBottom:2}}>{kpi.label}</div>
                <div style={{fontSize:9.5,color:"rgba(255,255,255,0.3)"}}>{kpi.sub}</div>
              </div>
            );
          })}
        </div>

        {/* ── Dimension view toggles ── */}
        <div style={{display:"flex",gap:6,marginBottom:14}}>
          {[["bars","Dimension Scores"],["table","BU Breakdown"]].map(function(pair){
            var vid=pair[0],vlabel=pair[1],active=dimView===vid;
            return(
              <button key={vid} onClick={function(){setDimView(vid);}}
                style={{padding:"6px 16px",borderRadius:8,border:"1px solid",cursor:"pointer",fontSize:11,fontWeight:700,
                  borderColor:active?"#A78BFA":"rgba(255,255,255,0.1)",
                  background:active?"rgba(167,139,250,0.12)":"transparent",
                  color:active?"#A78BFA":"rgba(255,255,255,0.4)"}}>
                {vlabel}
              </button>
            );
          })}
        </div>

        {/* ── Dimension Bars view ── */}
        {dimView==="bars"&&(
          <div style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:12,padding:"16px 18px",marginBottom:16}}>
            <div style={{fontSize:11,fontWeight:700,color:"rgba(255,255,255,0.5)",textTransform:"uppercase",letterSpacing:".08em",marginBottom:14}}>8-Dimension Capability Scores vs Targets</div>
            <div style={{display:"flex",flexDirection:"column",gap:14}}>
              {dims.map(function(d){
                var gap=d.target-d.score;
                var pct=Math.round(d.score/100*100);
                var tpct=Math.round(d.target/100*100);
                var severity=gap>=30?"Critical":gap>=20?"High":gap>=10?"Medium":"Low";
                return(
                  <div key={d.id}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:5}}>
                      <div style={{fontSize:12,fontWeight:700,color:"rgba(255,255,255,0.8)"}}>{d.label}</div>
                      <div style={{display:"flex",gap:8,alignItems:"center"}}>
                        <span style={{fontSize:11,color:d.color,fontWeight:700}}>{d.score}/100</span>
                        <span style={{fontSize:9.5,color:"rgba(255,255,255,0.3)"}}>target {d.target}</span>
                        {gap>0&&(
                          <span style={{fontSize:9,fontWeight:700,padding:"1px 6px",borderRadius:4,
                            background:riskBg[severity],color:riskColor[severity]}}>
                            -{gap}
                          </span>
                        )}
                      </div>
                    </div>
                    <div style={{position:"relative",height:8,background:"rgba(255,255,255,0.07)",borderRadius:4,overflow:"hidden"}}>
                      {/* target marker */}
                      <div style={{position:"absolute",top:0,bottom:0,left:tpct+"%",width:2,background:"rgba(255,255,255,0.25)",zIndex:2}}/>
                      {/* score bar */}
                      <div style={{height:"100%",width:pct+"%",background:d.color,borderRadius:4,transition:"width .3s ease"}}/>
                    </div>
                  </div>
                );
              })}
            </div>
            <div style={{marginTop:14,padding:"10px 12px",background:"rgba(167,139,250,0.06)",borderRadius:8,border:"1px solid rgba(167,139,250,0.15)"}}>
              <div style={{fontSize:11,fontWeight:700,color:"#A78BFA",marginBottom:2}}>Biggest Gap</div>
              <div style={{fontSize:11,color:"rgba(255,255,255,0.6)"}}>{biggestGap.label} is {biggestGap.target-biggestGap.score} points below target — prioritise in next intervention cycle.</div>
            </div>
          </div>
        )}

        {/* ── BU Breakdown table ── */}
        {dimView==="table"&&(
          <div>
            {/* Filter bar */}
            <div style={{display:"flex",gap:6,marginBottom:10}}>
              {["all","Critical","High","Medium","Low"].map(function(f){
                var active=buFilter===f;
                var col=f==="all"?"#A78BFA":riskColor[f];
                return(
                  <button key={f} onClick={function(){setBuFilter(f);}}
                    style={{padding:"4px 12px",borderRadius:7,border:"1px solid",cursor:"pointer",fontSize:10,fontWeight:700,
                      borderColor:active?col:"rgba(255,255,255,0.08)",
                      background:active?"rgba(167,139,250,0.1)":"transparent",
                      color:active?col:"rgba(255,255,255,0.35)"}}>
                    {f==="all"?"All BUs":f}
                  </button>
                );
              })}
            </div>
            <div style={{overflowX:"auto"}}>
              <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
                <thead>
                  <tr style={{borderBottom:"1px solid rgba(255,255,255,0.08)"}}>
                    {["Business Unit","Headcount","AI Readiness","Risk","Top Gaps"].map(function(h){
                      return(
                        <th key={h} style={{padding:"8px 10px",textAlign:"left",fontSize:9.5,fontWeight:700,color:"rgba(255,255,255,0.35)",textTransform:"uppercase",letterSpacing:".07em",whiteSpace:"nowrap"}}>{h}</th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody>
                  {filteredBUs.map(function(bu,i){
                    var bpct=bu.aiReadiness;
                    return(
                      <tr key={bu.id} style={{borderBottom:"1px solid rgba(255,255,255,0.04)",background:i%2===0?"transparent":"rgba(255,255,255,0.015)"}}>
                        <td style={{padding:"9px 10px",color:"rgba(255,255,255,0.8)",fontWeight:700}}>{bu.name}</td>
                        <td style={{padding:"9px 10px",color:"rgba(255,255,255,0.5)"}}>{bu.headcount.toLocaleString()}</td>
                        <td style={{padding:"9px 10px"}}>
                          <div style={{display:"flex",alignItems:"center",gap:8}}>
                            <div style={{flex:1,maxWidth:80,height:5,background:"rgba(255,255,255,0.07)",borderRadius:3,overflow:"hidden"}}>
                              <div style={{height:"100%",width:bpct+"%",background:bpct>=65?"#34C759":bpct>=50?"#E8B84B":"#FF9500",borderRadius:3}}/>
                            </div>
                            <span style={{fontSize:11,fontWeight:700,color:bpct>=65?"#34C759":bpct>=50?"#E8B84B":"#FF9500"}}>{bpct}</span>
                          </div>
                        </td>
                        <td style={{padding:"9px 10px"}}>
                          <span style={{fontSize:9,fontWeight:700,padding:"2px 7px",borderRadius:4,background:riskBg[bu.risk],color:riskColor[bu.risk]}}>{bu.risk}</span>
                        </td>
                        <td style={{padding:"9px 10px",color:"rgba(255,255,255,0.4)",maxWidth:220}}>
                          {bu.gaps.slice(0,2).join(" · ")}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr style={{borderTop:"1px solid rgba(255,255,255,0.1)"}}>
                    <td style={{padding:"9px 10px",color:"rgba(255,255,255,0.5)",fontWeight:700}}>Org Average</td>
                    <td style={{padding:"9px 10px",color:"rgba(255,255,255,0.35)"}}>{DEMO_ORG.employeeCount.toLocaleString()}</td>
                    <td style={{padding:"9px 10px"}}>
                      <div style={{display:"flex",alignItems:"center",gap:8}}>
                        <div style={{flex:1,maxWidth:80,height:5,background:"rgba(255,255,255,0.07)",borderRadius:3,overflow:"hidden"}}>
                          <div style={{height:"100%",width:orgScore+"%",background:"#A78BFA",borderRadius:3}}/>
                        </div>
                        <span style={{fontSize:11,fontWeight:700,color:"#A78BFA"}}>{orgScore}</span>
                      </div>
                    </td>
                    <td colSpan="2"/>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Enterprise Command Centre ───────────────────────────────────────────────
/** @returns {JSX.Element} Admin view: Enterprise command centre with live KPI tiles. */
function EnterpriseCommandCentreView(){
  var RC={Critical:"#FF3B30",High:"#FF9500",Medium:"#E8B84B",Low:"#34C759"};
  var RB={Critical:"rgba(255,59,48,0.10)",High:"rgba(255,149,0,0.10)",Medium:"rgba(232,184,75,0.06)",Low:"rgba(52,199,89,0.08)"};
  var busAtRisk=DEMO_BUS_UNITS.filter(function(b){return b.risk==="Critical"||b.risk==="High";}).length;
  var critCaps=DEMO_CAPABILITIES.filter(function(c){return c.importance==="Critical";}).length;
  var totalHead=DEMO_BUS_UNITS.reduce(function(sum,b){return sum+b.headcount;},0);
  var headStr=totalHead>=10000?Math.round(totalHead/1000)+"K":totalHead>999?(totalHead/1000).toFixed(1)+"K":String(totalHead);

  function Gauge(gProps){
    var score=gProps.score||0;
    var color=gProps.color||"#06B6D4";
    var label=gProps.label||"";
    var arcLen=207;
    var circ=276;
    var fill=Math.round(score*arcLen/100);
    return(
      <div style={{display:"flex",flexDirection:"column",alignItems:"center"}}>
        <svg width="120" height="120" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r="44" fill="none" stroke="rgba(255,255,255,0.08)"
            strokeWidth="10" strokeDasharray={String(arcLen)+" "+String(circ-arcLen)}
            strokeLinecap="round" transform="rotate(135,60,60)"/>
          <circle cx="60" cy="60" r="44" fill="none" stroke={color}
            strokeWidth="10" strokeDasharray={String(fill)+" "+String(circ-fill)}
            strokeLinecap="round" transform="rotate(135,60,60)"/>
          <text x="60" y="57" textAnchor="middle" fontSize="22" fontWeight="800" fill={color} fontFamily="inherit">{score}</text>
          <text x="60" y="71" textAnchor="middle" fontSize="9" fill="rgba(255,255,255,0.35)" fontFamily="inherit">/ 100</text>
        </svg>
        <div style={{fontSize:11,fontWeight:600,color:"rgba(255,255,255,0.55)",marginTop:2,textAlign:"center"}}>{label}</div>
      </div>
    );
  }

  return(
    <div className="fade-in">
      {/* ── Header ── */}
      <div style={{background:"linear-gradient(135deg,#001820,#002030)",padding:"22px 24px",borderBottom:"1px solid rgba(6,182,212,0.15)"}}>
        <div style={{display:"flex",gap:8,marginBottom:10,flexWrap:"wrap"}}>
          <Badge label="Enterprise Intelligence" color="#06B6D4" bg="rgba(6,182,212,0.15)"/>
          <Badge label={DEMO_ORG.name} color="rgba(255,255,255,0.4)" bg="rgba(255,255,255,0.07)"/>
          <Badge label={"AI Maturity: "+DEMO_ORG.aiMaturity} color="rgba(255,255,255,0.4)" bg="rgba(255,255,255,0.07)"/>
        </div>
        <div style={{fontSize:20,fontWeight:800,color:"#FFFFFF",letterSpacing:"-0.03em",marginBottom:2}}>Enterprise Command Centre</div>
        <div style={{fontSize:12,color:"rgba(255,255,255,0.4)"}}>Strategic workforce intelligence · {DEMO_ORG.businessUnits.length} business units · {DEMO_ORG.industry}</div>
      </div>

      {/* ── KPI strip ── */}
      <div style={{padding:"14px 22px 0",display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:10}} className="mob-grid1">
        {[
          {v:String(DEMO_ORG.readinessScore),l:"Org Readiness",   s:"/ 100",         c:"#E8B84B"},
          {v:String(DEMO_ORG.aiReadiness),   l:"AI Readiness",    s:"/ 100",         c:"#A78BFA"},
          {v:headStr,                         l:"Total Headcount", s:"employees",     c:"#5AC8FA"},
          {v:String(busAtRisk),               l:"BUs at Risk",     s:"Critical+High", c:"#FF9500"},
          {v:String(critCaps),                l:"Critical Gaps",   s:"capabilities",  c:"#FF3B30"},
        ].map(function(k,i){
          return(
            <div key={i} style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:12,padding:"14px 16px"}}>
              <div style={{fontSize:26,fontWeight:800,color:k.c,letterSpacing:"-0.05em",lineHeight:1}}>{k.v}</div>
              <div style={{fontSize:10,fontWeight:700,color:"rgba(255,255,255,0.55)",marginTop:5}}>{k.l}</div>
              <div style={{fontSize:9,color:"rgba(255,255,255,0.2)",marginTop:2}}>{k.s}</div>
            </div>
          );
        })}
      </div>

      {/* ── Gauges + Strategic priorities ── */}
      <div style={{padding:"14px 22px 0",display:"flex",gap:18,alignItems:"center",flexWrap:"wrap"}}>
        <Gauge score={DEMO_ORG.readinessScore} color="#E8B84B" label="Org Readiness"/>
        <Gauge score={DEMO_ORG.aiReadiness}    color="#A78BFA" label="AI Readiness"/>
        <div style={{flex:1,minWidth:200}}>
          <div style={{fontSize:10,fontWeight:700,color:"rgba(255,255,255,0.35)",letterSpacing:"0.07em",marginBottom:10}}>STRATEGIC PRIORITIES</div>
          <div style={{display:"flex",flexWrap:"wrap",gap:7,marginBottom:10}}>
            {DEMO_ORG.strategicPriorities.map(function(p,i){
              return(
                <span key={i} style={{fontSize:11,color:"rgba(6,182,212,0.85)",padding:"5px 11px",borderRadius:20,border:"1px solid rgba(6,182,212,0.25)",background:"rgba(6,182,212,0.06)",fontWeight:500}}>{p}</span>
              );
            })}
          </div>
          <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
            {DEMO_ORG.businessChallenges.slice(0,3).map(function(c,i){
              return(
                <span key={i} style={{fontSize:10,color:"rgba(255,149,0,0.8)",padding:"4px 9px",borderRadius:12,border:"1px solid rgba(255,149,0,0.2)",background:"rgba(255,149,0,0.06)"}}>{c}</span>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── BU Health Matrix ── */}
      <div style={{padding:"14px 22px 0"}}>
        <div style={{fontSize:10,fontWeight:700,color:"rgba(255,255,255,0.35)",letterSpacing:"0.07em",marginBottom:10}}>BUSINESS UNIT READINESS MATRIX</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:8}} className="mob-grid1">
          {DEMO_BUS_UNITS.map(function(bu,i){
            var rc=RC[bu.risk]||"#8B97B5";
            var rb=RB[bu.risk]||"rgba(139,151,181,0.07)";
            return(
              <div key={i} style={{background:rb,border:"1px solid "+rc+"30",borderRadius:10,padding:"12px 13px",position:"relative"}}>
                <div style={{position:"absolute",top:8,right:9,fontSize:7,fontWeight:800,color:rc,letterSpacing:"0.04em"}}>{bu.risk.toUpperCase()}</div>
                <div style={{fontSize:10,fontWeight:700,color:"rgba(255,255,255,0.85)",marginBottom:2,paddingRight:40,lineHeight:1.3}}>{bu.name}</div>
                <div style={{fontSize:8,color:"rgba(255,255,255,0.28)",marginBottom:7}}>{bu.leader} · {bu.headcount}</div>
                <div style={{fontSize:20,fontWeight:800,color:rc,letterSpacing:"-0.03em",lineHeight:1,marginBottom:5}}>{bu.aiReadiness}</div>
                <div style={{height:3,background:"rgba(255,255,255,0.07)",borderRadius:3}}>
                  <div style={{width:bu.aiReadiness+"%",height:"100%",background:rc,borderRadius:3}}/>
                </div>
                <div style={{marginTop:7}}>
                  {bu.gaps.slice(0,2).map(function(g,j){
                    return(<div key={j} style={{fontSize:8,color:"rgba(255,255,255,0.3)",lineHeight:1.7}}>{g}</div>);
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── 2-col: AI Readiness Dims + Priority Interventions ── */}
      <div style={{padding:"14px 22px 18px",display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}} className="mob-grid1">
        {/* AI readiness dimensions */}
        <div style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:12,padding:"16px 18px"}}>
          <div style={{fontSize:11,fontWeight:700,color:"rgba(255,255,255,0.7)",marginBottom:14}}>AI Readiness Dimensions</div>
          {DEMO_READINESS_DIMS.map(function(d,i){
            var gap=d.target-d.score;
            var sc=gap<=5?"#34C759":gap<=20?"#E8B84B":"#FF3B30";
            var st=gap<=5?"On Track":gap<=20?"Gap":"Critical";
            return(
              <div key={i} style={{marginBottom:10}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
                  <span style={{fontSize:11,color:"rgba(255,255,255,0.6)",fontWeight:500}}>{d.label}</span>
                  <div style={{display:"flex",alignItems:"center",gap:6}}>
                    <span style={{fontSize:10,fontWeight:700,color:d.color}}>{d.score}</span>
                    <span style={{fontSize:9,color:"rgba(255,255,255,0.25)"}}>→{d.target}</span>
                    <span style={{fontSize:8,fontWeight:700,color:sc,padding:"1px 5px",borderRadius:3,background:sc+"18"}}>{st}</span>
                  </div>
                </div>
                <div style={{height:3,background:"rgba(255,255,255,0.07)",borderRadius:3,overflow:"hidden"}}>
                  <div style={{width:d.score+"%",height:"100%",background:d.color,borderRadius:3}}/>
                </div>
              </div>
            );
          })}
        </div>

        {/* Priority interventions */}
        <div style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:12,padding:"16px 18px"}}>
          <div style={{fontSize:11,fontWeight:700,color:"rgba(255,255,255,0.7)",marginBottom:14}}>🎯 Priority Interventions</div>
          {DEMO_INTERVENTIONS.filter(function(x){return x.priority==="Critical";}).map(function(itv,i){
            var sc=itv.status==="In Progress"?"#34C759":itv.status==="Approved"?"#5AC8FA":"#E8B84B";
            return(
              <div key={i} style={{paddingBottom:12,marginBottom:12,borderBottom:i<2?"1px solid rgba(255,255,255,0.05)":"none"}}>
                <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:8,marginBottom:4}}>
                  <div style={{fontSize:12,fontWeight:700,color:"rgba(255,255,255,0.85)",lineHeight:1.3,flex:1}}>{itv.title}</div>
                  <span style={{fontSize:9,fontWeight:700,color:sc,padding:"2px 7px",borderRadius:4,background:sc+"20",whiteSpace:"nowrap",flexShrink:0}}>{itv.status}</span>
                </div>
                <div style={{display:"flex",gap:6,marginBottom:5,flexWrap:"wrap"}}>
                  <span style={{fontSize:10,color:"rgba(255,255,255,0.35)"}}>{itv.audience}</span>
                  <span style={{fontSize:10,color:"rgba(255,255,255,0.2)"}}>·</span>
                  <span style={{fontSize:10,color:"rgba(255,255,255,0.35)"}}>{itv.duration}</span>
                </div>
                <div style={{fontSize:10,color:"rgba(255,255,255,0.25)",lineHeight:1.5}}>{itv.outcomes.substring(0,80)}{itv.outcomes.length>80?"…":""}</div>
              </div>
            );
          })}
          <div style={{borderTop:"1px solid rgba(255,255,255,0.05)",paddingTop:10}}>
            <div style={{fontSize:10,fontWeight:700,color:"rgba(255,255,255,0.3)",marginBottom:8}}>HIGH PRIORITY</div>
            {DEMO_INTERVENTIONS.filter(function(x){return x.priority==="High"&&x.status!=="In Progress";}).slice(0,2).map(function(itv,i){
              return(
                <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:7,gap:8}}>
                  <span style={{fontSize:11,color:"rgba(255,255,255,0.5)",flex:1}}>{itv.title}</span>
                  <span style={{fontSize:9,color:"rgba(255,255,255,0.25)",whiteSpace:"nowrap",flexShrink:0}}>{itv.duration}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Governed Workbench ───────────────────────────────────────────────────────
/** @returns {JSX.Element} Admin view: Governed AI workbench for approved tool deployment. */
function GovernedWorkbenchView(){
  var STATUSES=["Published","Under Review","Archived"];
  var STATUS_COLOR={"Published":"#34C759","Under Review":"#FF9500","Archived":"#8B97B5"};
  var STATUS_BG={"Published":"rgba(52,199,89,0.1)","Under Review":"rgba(255,149,0,0.1)","Archived":"rgba(139,151,181,0.1)"};
  var ROLE_LABELS={executive:"Executive",functional:"Functional Leader",manager:"Senior Manager",learner:"Professional",emerging:"Emerging Talent"};
  var ALL_ROLES=["executive","functional","manager","learner","emerging"];
  var INIT_GOV={
    p1:{status:"Published",uses:142},p2:{status:"Published",uses:98},
    p3:{status:"Under Review",uses:45},p4:{status:"Published",uses:67},
    p5:{status:"Published",uses:211},p6:{status:"Published",uses:189},
    p7:{status:"Published",uses:76},p8:{status:"Archived",uses:23},
    p9:{status:"Published",uses:134},p10:{status:"Published",uses:88},
    p11:{status:"Under Review",uses:31},p12:{status:"Published",uses:102},
    p13:{status:"Published",uses:298},p14:{status:"Published",uses:245},
    p15:{status:"Published",uses:176},p16:{status:"Published",uses:167},
    p17:{status:"Published",uses:312},p18:{status:"Published",uses:143},
    p19:{status:"Under Review",uses:54},p20:{status:"Published",uses:201},
    p21:{status:"Published",uses:89},p22:{status:"Published",uses:127},
    p23:{status:"Published",uses:95},p24:{status:"Published",uses:78}
  };
  var [gov,setGov]=useState(INIT_GOV);
  var [search,setSearch]=useState("");
  var [catFilter,setCatFilter]=useState("");
  var [statusFilter,setStatusFilter]=useState("");
  var [roleFilter,setRoleFilter]=useState("");
  var [selected,setSelected]=useState(null);
  var [confirmId,setConfirmId]=useState(null);
  var [confirmAction,setConfirmAction]=useState("");

  var totalTemplates=PROMPT_TEMPLATES.length;
  var publishedCount=PROMPT_TEMPLATES.filter(function(t){return (gov[t.id]||{}).status==="Published";}).length;
  var reviewCount=PROMPT_TEMPLATES.filter(function(t){return (gov[t.id]||{}).status==="Under Review";}).length;
  var archivedCount=PROMPT_TEMPLATES.filter(function(t){return (gov[t.id]||{}).status==="Archived";}).length;
  var totalUsage=PROMPT_TEMPLATES.reduce(function(s,t){return s+((gov[t.id]||{}).uses||0);},0);
  var allCats=PROMPT_TEMPLATES.map(function(t){return t.cat;}).filter(function(v,i,a){return a.indexOf(v)===i;}).sort();
  var filtered=PROMPT_TEMPLATES.filter(function(t){
    var g=gov[t.id]||{};
    if(search&&t.title.toLowerCase().indexOf(search.toLowerCase())<0&&t.cat.toLowerCase().indexOf(search.toLowerCase())<0)return false;
    if(catFilter&&t.cat!==catFilter)return false;
    if(statusFilter&&g.status!==statusFilter)return false;
    if(roleFilter&&(t.roles||[]).indexOf(roleFilter)<0)return false;
    return true;
  });

  function updateStatus(id,status){
    var next={};
    for(var k in gov){next[k]=gov[k];}
    var prev=gov[id]||{};
    next[id]={status:status,uses:prev.uses||0};
    setGov(next);
    setConfirmId(null);
    setConfirmAction("");
  }

  var selectedTemplate=selected?PROMPT_TEMPLATES.filter(function(t){return t.id===selected;})[0]:null;
  var selectedGov=selected?(gov[selected]||{}):{};

  return (
    <div style={{padding:"28px 32px",maxWidth:1400,margin:"0 auto"}}>
      {/* Header */}
      <div style={{marginBottom:24}}>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:6}}>
          <div style={{width:32,height:32,borderRadius:8,background:"rgba(167,139,250,0.15)",border:"1px solid rgba(167,139,250,0.25)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,color:"#A78BFA"}}>⊙</div>
          <h2 style={{margin:0,fontSize:20,fontWeight:700,color:"#FFFFFF",letterSpacing:"-0.02em"}}>AI Toolkit — Governed Workbench</h2>
          <span style={{fontSize:11,fontWeight:700,color:"#A78BFA",background:"rgba(167,139,250,0.12)",padding:"2px 10px",borderRadius:20,border:"1px solid rgba(167,139,250,0.2)",letterSpacing:".06em"}}>GOVERNANCE</span>
        </div>
        <p style={{margin:0,fontSize:13,color:"rgba(255,255,255,0.4)"}}>Review, approve and control which prompt templates are published to learners by role and function.</p>
      </div>

      {/* Stats */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:12,marginBottom:24}} className="mob-grid1">
        {[
          {label:"Total Templates",value:totalTemplates,color:"#A78BFA"},
          {label:"Published",value:publishedCount,color:"#34C759"},
          {label:"Under Review",value:reviewCount,color:"#FF9500"},
          {label:"Archived",value:archivedCount,color:"#8B97B5"},
          {label:"Total Uses",value:totalUsage.toLocaleString(),color:"#5AC8FA"},
        ].map(function(s){
          return (
            <div key={s.label} style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:10,padding:"14px 16px"}}>
              <div style={{fontSize:22,fontWeight:700,color:s.color,letterSpacing:"-0.03em",marginBottom:2}}>{s.value}</div>
              <div style={{fontSize:11,color:"rgba(255,255,255,0.4)",fontWeight:600,letterSpacing:".04em",textTransform:"uppercase"}}>{s.label}</div>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div style={{display:"flex",gap:10,marginBottom:20,flexWrap:"wrap",alignItems:"center"}}>
        <input type="text" placeholder="Search templates..." value={search}
          onChange={function(e){setSearch(e.target.value);}}
          style={{flex:"1 1 200px",minWidth:160,background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:8,padding:"8px 12px",color:"#FFFFFF",fontSize:13,outline:"none"}}/>
        <select value={catFilter} onChange={function(e){setCatFilter(e.target.value);}}
          style={{background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:8,padding:"8px 12px",color:catFilter?"#FFFFFF":"rgba(255,255,255,0.4)",fontSize:13,outline:"none",cursor:"pointer"}}>
          <option value="">All Categories</option>
          {allCats.map(function(c){return <option key={c} value={c} style={{background:"#0D1A2A"}}>{c}</option>;})}
        </select>
        <select value={statusFilter} onChange={function(e){setStatusFilter(e.target.value);}}
          style={{background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:8,padding:"8px 12px",color:statusFilter?"#FFFFFF":"rgba(255,255,255,0.4)",fontSize:13,outline:"none",cursor:"pointer"}}>
          <option value="">All Statuses</option>
          {STATUSES.map(function(s){return <option key={s} value={s} style={{background:"#0D1A2A"}}>{s}</option>;})}
        </select>
        <select value={roleFilter} onChange={function(e){setRoleFilter(e.target.value);}}
          style={{background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:8,padding:"8px 12px",color:roleFilter?"#FFFFFF":"rgba(255,255,255,0.4)",fontSize:13,outline:"none",cursor:"pointer"}}>
          <option value="">All Roles</option>
          {ALL_ROLES.map(function(r){return <option key={r} value={r} style={{background:"#0D1A2A"}}>{ROLE_LABELS[r]||r}</option>;})}
        </select>
        {(search||catFilter||statusFilter||roleFilter)&&(
          <button onClick={function(){setSearch("");setCatFilter("");setStatusFilter("");setRoleFilter("");}}
            style={{padding:"8px 14px",background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:8,color:"rgba(255,255,255,0.5)",fontSize:12,cursor:"pointer",fontWeight:600}}>Clear</button>
        )}
        <div style={{marginLeft:"auto",fontSize:12,color:"rgba(255,255,255,0.3)",whiteSpace:"nowrap"}}>{filtered.length} template{filtered.length!==1?"s":""}</div>
      </div>

      {/* List + detail */}
      <div style={{display:"flex",gap:16,alignItems:"flex-start"}}>
        <div style={{flex:1,minWidth:0}}>
          {/* Column headers */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 90px 155px 70px 110px",gap:12,padding:"8px 14px",borderBottom:"1px solid rgba(255,255,255,0.06)",marginBottom:4}}>
            {["Template","Category","Roles","Uses","Status"].map(function(h){
              return <div key={h} style={{fontSize:10,fontWeight:700,color:"rgba(255,255,255,0.3)",letterSpacing:".08em",textTransform:"uppercase"}}>{h}</div>;
            })}
          </div>
          {filtered.length===0&&(
            <div style={{padding:"40px 0",textAlign:"center",color:"rgba(255,255,255,0.25)",fontSize:14}}>No templates match the current filters.</div>
          )}
          {filtered.map(function(t){
            var g=gov[t.id]||{};
            var st=g.status||"Published";
            var uses=g.uses||0;
            var isSel=selected===t.id;
            return (
              <div key={t.id} onClick={function(){setSelected(isSel?null:t.id);}} role="button" tabIndex={0} onKeyDown={function(e){if(e.key==="Enter"||e.key===" ")setSelected(isSel?null:t.id);}}
                style={{display:"grid",gridTemplateColumns:"1fr 90px 155px 70px 110px",gap:12,
                  padding:"11px 14px",borderRadius:8,cursor:"pointer",marginBottom:1,
                  background:isSel?"rgba(167,139,250,0.08)":"rgba(255,255,255,0.01)",
                  border:isSel?"1px solid rgba(167,139,250,0.2)":"1px solid transparent"}}>
                <div style={{minWidth:0}}>
                  <div style={{fontSize:13,fontWeight:600,color:"#FFFFFF",marginBottom:2,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{t.title}</div>
                  <div style={{fontSize:11,color:"rgba(255,255,255,0.35)",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{t.desc}</div>
                </div>
                <div style={{display:"flex",alignItems:"center"}}>
                  <span style={{fontSize:10,fontWeight:700,color:t.color,background:String(t.color)+"1A",padding:"3px 7px",borderRadius:4,letterSpacing:".04em",whiteSpace:"nowrap"}}>{t.cat}</span>
                </div>
                <div style={{display:"flex",alignItems:"center",flexWrap:"wrap",gap:3}}>
                  {(t.roles||[]).map(function(r){
                    return <span key={r} style={{fontSize:9,fontWeight:700,color:"rgba(255,255,255,0.45)",background:"rgba(255,255,255,0.06)",padding:"2px 5px",borderRadius:3,letterSpacing:".04em",textTransform:"uppercase"}}>{r}</span>;
                  })}
                </div>
                <div style={{display:"flex",alignItems:"center",fontSize:13,fontWeight:600,color:"rgba(255,255,255,0.6)"}}>{uses.toLocaleString()}</div>
                <div style={{display:"flex",alignItems:"center"}}>
                  <span style={{fontSize:10,fontWeight:700,color:STATUS_COLOR[st]||"#34C759",background:STATUS_BG[st]||"rgba(52,199,89,0.1)",padding:"3px 8px",borderRadius:4,letterSpacing:".04em",border:"1px solid "+(STATUS_COLOR[st]||"#34C759")+"33"}}>{st}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Detail panel */}
        {selectedTemplate&&(
          <div style={{width:340,flexShrink:0,background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:12,padding:"20px",position:"sticky",top:20}}>
            <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:16,gap:8}}>
              <div style={{minWidth:0}}>
                <div style={{fontSize:15,fontWeight:700,color:"#FFFFFF",letterSpacing:"-0.02em",lineHeight:1.3,marginBottom:6}}>{selectedTemplate.title}</div>
                <span style={{fontSize:10,fontWeight:700,color:selectedTemplate.color,background:String(selectedTemplate.color)+"1A",padding:"2px 8px",borderRadius:4}}>{selectedTemplate.cat}</span>
              </div>
              <button onClick={function(){setSelected(null);}} aria-label="Close detail" style={{background:"transparent",border:"none",color:"rgba(255,255,255,0.3)",fontSize:18,cursor:"pointer",lineHeight:1,padding:"2px 4px",flexShrink:0}}>✕</button>
            </div>
            <div style={{marginBottom:13}}>
              <div style={{fontSize:10,fontWeight:700,color:"rgba(255,255,255,0.3)",letterSpacing:".08em",textTransform:"uppercase",marginBottom:5}}>Description</div>
              <div style={{fontSize:12,color:"rgba(255,255,255,0.6)",lineHeight:1.6}}>{selectedTemplate.desc}</div>
            </div>
            <div style={{marginBottom:13}}>
              <div style={{fontSize:10,fontWeight:700,color:"rgba(255,255,255,0.3)",letterSpacing:".08em",textTransform:"uppercase",marginBottom:5}}>Prompt Template</div>
              <div style={{fontSize:11,color:"rgba(255,255,255,0.5)",lineHeight:1.7,background:"rgba(0,0,0,0.25)",borderRadius:7,padding:"10px 12px",fontFamily:"'SF Mono',monospace",whiteSpace:"pre-wrap",wordBreak:"break-word",maxHeight:130,overflowY:"auto"}}>{selectedTemplate.template}</div>
            </div>
            <div style={{marginBottom:14}}>
              <div style={{fontSize:10,fontWeight:700,color:"rgba(255,255,255,0.3)",letterSpacing:".08em",textTransform:"uppercase",marginBottom:5}}>Facilitator Tip</div>
              <div style={{fontSize:12,color:"rgba(255,255,255,0.45)",fontStyle:"italic",lineHeight:1.5}}>{selectedTemplate.tip}</div>
            </div>
            <div style={{display:"flex",gap:10,marginBottom:14}}>
              <div style={{flex:1,background:"rgba(255,255,255,0.04)",borderRadius:7,padding:"10px 12px",textAlign:"center"}}>
                <div style={{fontSize:17,fontWeight:700,color:"#5AC8FA"}}>{(selectedGov.uses||0).toLocaleString()}</div>
                <div style={{fontSize:9,color:"rgba(255,255,255,0.35)",fontWeight:600,textTransform:"uppercase",letterSpacing:".06em",marginTop:2}}>Total Uses</div>
              </div>
              <div style={{flex:1,background:"rgba(255,255,255,0.04)",borderRadius:7,padding:"10px 12px",textAlign:"center"}}>
                <div style={{fontSize:13,fontWeight:700,color:STATUS_COLOR[selectedGov.status||"Published"]||"#34C759"}}>{selectedGov.status||"Published"}</div>
                <div style={{fontSize:9,color:"rgba(255,255,255,0.35)",fontWeight:600,textTransform:"uppercase",letterSpacing:".06em",marginTop:2}}>Status</div>
              </div>
            </div>
            <div style={{marginBottom:14}}>
              <div style={{fontSize:10,fontWeight:700,color:"rgba(255,255,255,0.3)",letterSpacing:".08em",textTransform:"uppercase",marginBottom:8}}>Role Visibility</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:4}}>
                {ALL_ROLES.map(function(r){
                  var active=(selectedTemplate.roles||[]).indexOf(r)>=0;
                  return (
                    <span key={r} style={{fontSize:10,fontWeight:700,padding:"3px 9px",borderRadius:4,
                      color:active?"#FFFFFF":"rgba(255,255,255,0.2)",
                      background:active?"rgba(167,139,250,0.2)":"rgba(255,255,255,0.04)",
                      border:active?"1px solid rgba(167,139,250,0.3)":"1px solid rgba(255,255,255,0.06)",
                      letterSpacing:".04em"}}>
                      {ROLE_LABELS[r]||r}
                    </span>
                  );
                })}
              </div>
            </div>
            <div style={{borderTop:"1px solid rgba(255,255,255,0.07)",paddingTop:14}}>
              <div style={{fontSize:10,fontWeight:700,color:"rgba(255,255,255,0.3)",letterSpacing:".08em",textTransform:"uppercase",marginBottom:10}}>Governance Actions</div>
              {confirmId===selectedTemplate.id?(
                <div style={{background:"rgba(255,149,0,0.08)",border:"1px solid rgba(255,149,0,0.2)",borderRadius:8,padding:"12px"}}>
                  <div style={{fontSize:12,color:"rgba(255,255,255,0.7)",marginBottom:10}}>Set status to <strong style={{color:"#FF9500"}}>{confirmAction}</strong>?</div>
                  <div style={{display:"flex",gap:8}}>
                    <button onClick={function(){updateStatus(selectedTemplate.id,confirmAction);}}
                      style={{flex:1,padding:"7px 0",background:"rgba(255,149,0,0.2)",border:"1px solid rgba(255,149,0,0.3)",borderRadius:6,color:"#FF9500",fontSize:12,fontWeight:700,cursor:"pointer"}}>Confirm</button>
                    <button onClick={function(){setConfirmId(null);setConfirmAction("");}}
                      style={{flex:1,padding:"7px 0",background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:6,color:"rgba(255,255,255,0.5)",fontSize:12,cursor:"pointer"}}>Cancel</button>
                  </div>
                </div>
              ):(
                <div style={{display:"flex",flexDirection:"column",gap:7}}>
                  {STATUSES.filter(function(s){return s!==(selectedGov.status||"Published");}).map(function(action){
                    var isPub=action==="Published";
                    var isArc=action==="Archived";
                    return (
                      <button key={action} onClick={function(){setConfirmId(selectedTemplate.id);setConfirmAction(action);}}
                        style={{width:"100%",padding:"8px 0",borderRadius:7,fontSize:12,fontWeight:700,cursor:"pointer",
                          background:isPub?"rgba(52,199,89,0.1)":isArc?"rgba(139,151,181,0.08)":"rgba(255,149,0,0.08)",
                          border:isPub?"1px solid rgba(52,199,89,0.25)":isArc?"1px solid rgba(139,151,181,0.2)":"1px solid rgba(255,149,0,0.2)",
                          color:isPub?"#34C759":isArc?"#8B97B5":"#FF9500"}}>
                        {isPub?"✓ Publish":isArc?"⊖ Archive":"⟳ Send for Review"}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Use Case Governance ──────────────────────────────────────────────────────
var INIT_UC_GOV=(function(){
  var o={};
  for(var i=0;i<ALL_USE_CASES.length;i++){
    var u=ALL_USE_CASES[i];
    o[u.id]={status:"Published"};
  }
  var underReview=["uc3","uc11","uc19","uc25","uc33","uc44"];
  for(var j=0;j<underReview.length;j++){
    if(o[underReview[j]])o[underReview[j]].status="Under Review";
  }
  var archived=["uc8","uc15"];
  for(var k2=0;k2<archived.length;k2++){
    if(o[archived[k2]])o[archived[k2]].status="Archived";
  }
  return o;
})();

/** @returns {JSX.Element} Admin view: Use case governance pipeline with approval workflow. */
function UseCaseGovernanceView(){
  var STATUSES=["Published","Under Review","Archived"];
  var STATUS_COLOR={"Published":"#34C759","Under Review":"#FF9500","Archived":"#8B97B5"};
  var STATUS_BG={"Published":"rgba(52,199,89,0.1)","Under Review":"rgba(255,149,0,0.1)","Archived":"rgba(139,151,181,0.1)"};
  var CAT_COLOR={"governance":"#A78BFA","adoption":"#06B6D4","productivity":"#34C759","impact":"#FF9500"};
  var COMPLEXITY_COLOR={"Low":"#34C759","Medium":"#FF9500","High":"#FF3B30"};
  var INDUSTRIES=["Financial Services","Healthcare & Life Sciences","Mining & Resources","Energy & Utilities","Retail & Consumer Goods","Government & Public Sector","Telecommunications","Manufacturing & Engineering"];
  var ACCENT="#06B6D4";
  var [gov,setGov]=useState(INIT_UC_GOV);
  var [search,setSearch]=useState("");
  var [catFilter,setCatFilter]=useState("");
  var [statusFilter,setStatusFilter]=useState("");
  var [indFilter,setIndFilter]=useState("");
  var [complexFilter,setComplexFilter]=useState("");
  var [selected,setSelected]=useState(null);
  var [confirmId,setConfirmId]=useState(null);
  var [confirmAction,setConfirmAction]=useState("");
  var total=ALL_USE_CASES.length;
  var pub=0;var rev=0;var arc=0;
  for(var si=0;si<ALL_USE_CASES.length;si++){
    var st=(gov[ALL_USE_CASES[si].id]||{}).status;
    if(st==="Published")pub++;
    else if(st==="Under Review")rev++;
    else if(st==="Archived")arc++;
  }
  var filtered=ALL_USE_CASES.filter(function(u){
    var q=search.toLowerCase();
    var matchQ=!q||u.title.toLowerCase().indexOf(q)>=0||u.challenge.toLowerCase().indexOf(q)>=0;
    var matchCat=!catFilter||u.cat===catFilter;
    var matchSt=!statusFilter||(gov[u.id]||{}).status===statusFilter;
    var matchInd=!indFilter||(indFilter==="cross"?u.industry.length===0:u.industry.indexOf(indFilter)>=0);
    var matchComp=!complexFilter||u.complexity===complexFilter;
    return matchQ&&matchCat&&matchSt&&matchInd&&matchComp;
  });
  function updateStatus(id,newSt){
    var next={};
    for(var k in gov){next[k]=gov[k];}
    next[id]={status:newSt};
    setGov(next);
    setConfirmId(null);
    setConfirmAction("");
    if(selected&&selected.id===id)setSelected(null);
  }
  return(
    <div className="fade-in">
      {/* ── Header ── */}
      <div style={{background:"linear-gradient(135deg,#041218,#061A24)",padding:"22px 24px",borderBottom:"1px solid rgba(255,255,255,0.06)"}}>
        <div style={{display:"flex",gap:8,marginBottom:10,flexWrap:"wrap"}}>
          <Badge label="AI at Work" color={ACCENT} bg="rgba(6,182,212,0.15)"/>
          <Badge label={String(total)+" use cases"} color="rgba(255,255,255,0.4)" bg="rgba(255,255,255,0.07)"/>
          <Badge label={String(filtered.length)+" shown"} color="rgba(255,255,255,0.3)" bg="rgba(255,255,255,0.05)"/>
        </div>
        <div style={{fontSize:20,fontWeight:800,color:"#FFFFFF",letterSpacing:"-0.03em",marginBottom:6}}>Use Case Governance</div>
        <div style={{fontSize:12,color:"rgba(255,255,255,0.4)",marginBottom:14}}>Control which AI use cases are visible to learners by industry, role, and category.</div>
        {/* Stats */}
        <div style={{display:"flex",gap:10,flexWrap:"wrap",marginBottom:14}}>
          {[["Published",pub,"#34C759"],["Under Review",rev,"#FF9500"],["Archived",arc,"#8B97B5"],["Total",total,ACCENT]].map(function(row){
            return(
              <div key={String(row[0])} style={{padding:"8px 14px",borderRadius:8,background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.07)"}}>
                <div style={{fontSize:9,fontWeight:700,color:"rgba(255,255,255,0.35)",textTransform:"uppercase",letterSpacing:".1em",marginBottom:2}}>{row[0]}</div>
                <div style={{fontSize:20,fontWeight:800,color:String(row[2])}}>{row[1]}</div>
              </div>
            );
          })}
        </div>
        {/* Filters */}
        <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
          <input value={search} onChange={function(e){setSearch(e.target.value);}} placeholder="Search use cases..."
            style={{flex:1,minWidth:160,padding:"8px 12px",border:"1px solid rgba(255,255,255,0.12)",borderRadius:8,fontSize:12,color:"#FFFFFF",background:"rgba(255,255,255,0.06)",fontFamily:"inherit",outline:"none"}}
            onFocus={function(e){e.target.style.borderColor=ACCENT;}} onBlur={function(e){e.target.style.borderColor="rgba(255,255,255,0.12)";}}/>
          <select value={statusFilter} onChange={function(e){setStatusFilter(e.target.value);}}
            style={{padding:"8px 10px",border:"1px solid rgba(255,255,255,0.12)",borderRadius:8,fontSize:12,color:statusFilter?ACCENT:"rgba(255,255,255,0.5)",background:"rgba(255,255,255,0.06)",fontFamily:"inherit",cursor:"pointer",outline:"none"}}>
            <option value="">All statuses</option>
            {STATUSES.map(function(s){return <option key={s} value={s}>{s}</option>;})}
          </select>
          <select value={catFilter} onChange={function(e){setCatFilter(e.target.value);}}
            style={{padding:"8px 10px",border:"1px solid rgba(255,255,255,0.12)",borderRadius:8,fontSize:12,color:catFilter?ACCENT:"rgba(255,255,255,0.5)",background:"rgba(255,255,255,0.06)",fontFamily:"inherit",cursor:"pointer",outline:"none"}}>
            <option value="">All categories</option>
            <option value="governance">Governance</option>
            <option value="adoption">Adoption</option>
            <option value="productivity">Productivity</option>
            <option value="impact">Impact</option>
          </select>
          <select value={indFilter} onChange={function(e){setIndFilter(e.target.value);}}
            style={{padding:"8px 10px",border:"1px solid rgba(255,255,255,0.12)",borderRadius:8,fontSize:12,color:indFilter?ACCENT:"rgba(255,255,255,0.5)",background:"rgba(255,255,255,0.06)",fontFamily:"inherit",cursor:"pointer",outline:"none"}}>
            <option value="">All industries</option>
            {INDUSTRIES.map(function(ind){return <option key={ind} value={ind}>{ind}</option>;})}
            <option value="cross">Cross-Industry</option>
          </select>
          <select value={complexFilter} onChange={function(e){setComplexFilter(e.target.value);}}
            style={{padding:"8px 10px",border:"1px solid rgba(255,255,255,0.12)",borderRadius:8,fontSize:12,color:complexFilter?ACCENT:"rgba(255,255,255,0.5)",background:"rgba(255,255,255,0.06)",fontFamily:"inherit",cursor:"pointer",outline:"none"}}>
            <option value="">All complexity</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
          {(search||catFilter||statusFilter||indFilter||complexFilter)&&(
            <button onClick={function(){setSearch("");setCatFilter("");setStatusFilter("");setIndFilter("");setComplexFilter("");}}
              style={{padding:"8px 12px",borderRadius:8,border:"1px solid rgba(255,255,255,0.12)",background:"transparent",color:"rgba(255,255,255,0.5)",fontSize:11,cursor:"pointer",fontFamily:"inherit"}}>Clear</button>
          )}
        </div>
      </div>
      {/* ── Grid ── */}
      <div style={{padding:"16px 22px",overflowY:"auto"}}>
        {filtered.length===0&&(
          <div style={{textAlign:"center",padding:"48px 0",color:"rgba(255,255,255,0.3)",fontSize:13}}>No use cases match the current filters.</div>
        )}
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:12}} className="mob-grid1">
          {filtered.map(function(u){
            var ucStatus=(gov[u.id]||{}).status||"Published";
            var isSelected=selected&&selected.id===u.id;
            return(
              <div key={u.id} onClick={function(){setSelected(isSelected?null:u);}} role="button" tabIndex={0} onKeyDown={function(e){if(e.key==="Enter"||e.key===" ")setSelected(isSelected?null:u);}}
                style={{padding:"14px 16px",borderRadius:10,border:"1px solid "+(isSelected?ACCENT:"rgba(255,255,255,0.07)"),
                  background:isSelected?"rgba(6,182,212,0.06)":"rgba(255,255,255,0.03)",cursor:"pointer",transition:"all .15s",position:"relative"}}>
                {/* Status badge */}
                <div style={{position:"absolute",top:12,right:12}}>
                  <span style={{fontSize:9,fontWeight:700,padding:"3px 8px",borderRadius:5,
                    color:STATUS_COLOR[ucStatus],background:STATUS_BG[ucStatus],textTransform:"uppercase",letterSpacing:".07em"}}>
                    {ucStatus}
                  </span>
                </div>
                {/* Category + complexity */}
                <div style={{display:"flex",gap:6,marginBottom:8,flexWrap:"wrap",paddingRight:70}}>
                  <span style={{fontSize:9,fontWeight:700,padding:"2px 7px",borderRadius:4,
                    color:CAT_COLOR[u.cat]||"#8B97B5",background:(CAT_COLOR[u.cat]||"#8B97B5")+"1A",textTransform:"capitalize"}}>
                    {u.cat}
                  </span>
                  <span style={{fontSize:9,fontWeight:700,padding:"2px 7px",borderRadius:4,
                    color:COMPLEXITY_COLOR[u.complexity]||"#8B97B5",background:(COMPLEXITY_COLOR[u.complexity]||"#8B97B5")+"1A"}}>
                    {u.complexity}
                  </span>
                </div>
                <div style={{fontSize:13,fontWeight:700,color:"#FFFFFF",lineHeight:1.35,marginBottom:5}}>{u.title}</div>
                <div style={{fontSize:11,color:"rgba(255,255,255,0.4)",marginBottom:8,lineHeight:1.4}}>{u.industry.length?u.industry[0]:"Cross-Industry"} · {u.region}</div>
                <div style={{fontSize:11,color:"rgba(255,255,255,0.5)",lineHeight:1.45,marginBottom:10,overflow:"hidden",maxHeight:36}}>{u.challenge}</div>
                {/* Quick-action buttons */}
                <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                  {STATUSES.filter(function(s){return s!==ucStatus;}).map(function(s){
                    return(
                      <button key={s} onClick={function(e){e.stopPropagation();setConfirmId(u.id);setConfirmAction(s);}}
                        style={{fontSize:10,padding:"4px 10px",borderRadius:6,border:"1px solid rgba(255,255,255,0.1)",
                          background:"transparent",color:STATUS_COLOR[s],cursor:"pointer",fontFamily:"inherit",fontWeight:600}}>
                        → {s}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {/* ── Detail Panel ── */}
      {selected&&(
        <div style={{position:"fixed",top:0,right:0,width:420,height:"100vh",background:"#070F1E",borderLeft:"1px solid rgba(255,255,255,0.08)",zIndex:200,display:"flex",flexDirection:"column",overflowY:"auto",padding:24}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:16}}>
            <div style={{fontSize:11,fontWeight:700,color:ACCENT,textTransform:"uppercase",letterSpacing:".1em"}}>Use Case Detail</div>
            <button onClick={function(){setSelected(null);}} aria-label="Close use case detail"
              style={{background:"rgba(255,255,255,0.07)",border:"none",borderRadius:6,color:"rgba(255,255,255,0.6)",cursor:"pointer",padding:"5px 10px",fontFamily:"inherit",fontSize:12}}>✕</button>
          </div>
          <div style={{display:"flex",gap:6,marginBottom:12,flexWrap:"wrap"}}>
            <span style={{fontSize:10,fontWeight:700,padding:"3px 9px",borderRadius:5,
              color:STATUS_COLOR[(gov[selected.id]||{}).status||"Published"],
              background:STATUS_BG[(gov[selected.id]||{}).status||"Published"],
              textTransform:"uppercase",letterSpacing:".07em"}}>
              {(gov[selected.id]||{}).status||"Published"}
            </span>
            <span style={{fontSize:10,fontWeight:700,padding:"3px 9px",borderRadius:5,
              color:CAT_COLOR[selected.cat]||"#8B97B5",background:(CAT_COLOR[selected.cat]||"#8B97B5")+"1A",textTransform:"capitalize"}}>
              {selected.cat}
            </span>
            <span style={{fontSize:10,fontWeight:700,padding:"3px 9px",borderRadius:5,
              color:COMPLEXITY_COLOR[selected.complexity]||"#8B97B5",
              background:(COMPLEXITY_COLOR[selected.complexity]||"#8B97B5")+"1A"}}>
              {selected.complexity} complexity
            </span>
          </div>
          <div style={{fontSize:17,fontWeight:800,color:"#FFFFFF",lineHeight:1.35,marginBottom:4}}>{selected.title}</div>
          <div style={{fontSize:11,color:ACCENT,marginBottom:16}}>{selected.industry.length?selected.industry.join(", "):"Cross-Industry"} · {selected.region}</div>
          {[["Challenge",selected.challenge],["Solution",selected.solution],["Impact",selected.impact]].map(function(row){
            return(
              <div key={String(row[0])} style={{marginBottom:14}}>
                <div style={{fontSize:9,fontWeight:700,color:"rgba(255,255,255,0.3)",textTransform:"uppercase",letterSpacing:".1em",marginBottom:4}}>{row[0]}</div>
                <div style={{fontSize:12,color:"rgba(255,255,255,0.75)",lineHeight:1.6}}>{row[1]}</div>
              </div>
            );
          })}
          {selected.fn&&selected.fn.length>0&&(
            <div style={{marginBottom:14}}>
              <div style={{fontSize:9,fontWeight:700,color:"rgba(255,255,255,0.3)",textTransform:"uppercase",letterSpacing:".1em",marginBottom:6}}>Functions</div>
              <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                {selected.fn.map(function(f){
                  return <span key={f} style={{fontSize:10,padding:"3px 8px",borderRadius:5,background:"rgba(255,255,255,0.06)",color:"rgba(255,255,255,0.6)",border:"1px solid rgba(255,255,255,0.08)"}}>{f}</span>;
                })}
              </div>
            </div>
          )}
          {selected.role&&selected.role.length>0&&(
            <div style={{marginBottom:20}}>
              <div style={{fontSize:9,fontWeight:700,color:"rgba(255,255,255,0.3)",textTransform:"uppercase",letterSpacing:".1em",marginBottom:6}}>Target Roles</div>
              <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                {selected.role.map(function(r){
                  return <span key={r} style={{fontSize:10,padding:"3px 8px",borderRadius:5,background:"rgba(6,182,212,0.08)",color:ACCENT,border:"1px solid rgba(6,182,212,0.2)"}}>{r}</span>;
                })}
              </div>
            </div>
          )}
          <div style={{marginTop:"auto",paddingTop:16,borderTop:"1px solid rgba(255,255,255,0.06)"}}>
            <div style={{fontSize:9,fontWeight:700,color:"rgba(255,255,255,0.3)",textTransform:"uppercase",letterSpacing:".1em",marginBottom:8}}>Change Status</div>
            <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
              {STATUSES.map(function(s){
                var isCurrent=(gov[selected.id]||{}).status===s;
                return(
                  <button key={s} disabled={isCurrent}
                    onClick={function(){setConfirmId(selected.id);setConfirmAction(s);}}
                    style={{flex:1,padding:"8px 4px",borderRadius:8,fontFamily:"inherit",fontSize:11,fontWeight:isCurrent?700:500,cursor:isCurrent?"default":"pointer",
                      border:"1px solid "+(isCurrent?STATUS_COLOR[s]:"rgba(255,255,255,0.1)"),
                      background:isCurrent?STATUS_BG[s]:"transparent",
                      color:isCurrent?STATUS_COLOR[s]:"rgba(255,255,255,0.45)"}}>
                    {isCurrent?"● "+s:s}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
      {/* ── Confirm Modal ── */}
      {confirmId&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.6)",zIndex:300,display:"flex",alignItems:"center",justifyContent:"center"}}>
          <div style={{background:"#0D1B2E",border:"1px solid rgba(255,255,255,0.1)",borderRadius:14,padding:"28px 32px",width:360,maxWidth:"90vw"}}>
            <div style={{fontSize:15,fontWeight:800,color:"#FFFFFF",marginBottom:8}}>Confirm Status Change</div>
            <div style={{fontSize:12,color:"rgba(255,255,255,0.5)",marginBottom:20,lineHeight:1.6}}>
              Set <strong style={{color:"#FFFFFF"}}>{(ALL_USE_CASES.filter(function(u){return u.id===confirmId;})[0]||{}).title}</strong> to <strong style={{color:STATUS_COLOR[confirmAction]||"#FFFFFF"}}>{confirmAction}</strong>?
            </div>
            <div style={{display:"flex",gap:10}}>
              <button onClick={function(){setConfirmId(null);setConfirmAction("");}}
                style={{flex:1,padding:"9px 0",borderRadius:8,border:"1px solid rgba(255,255,255,0.12)",background:"transparent",color:"rgba(255,255,255,0.6)",cursor:"pointer",fontFamily:"inherit",fontSize:12}}>Cancel</button>
              <button onClick={function(){updateStatus(confirmId,confirmAction);}}
                style={{flex:1,padding:"9px 0",borderRadius:8,border:"none",background:STATUS_COLOR[confirmAction]||ACCENT,color:"#FFFFFF",cursor:"pointer",fontFamily:"inherit",fontSize:12,fontWeight:700}}>Confirm</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Content Governance View ─────────────────────────────────────────────────
/** @param {{onSaveNote:Function}} props - Callback to persist a facilitator note. @returns {JSX.Element} Admin view: Content governance and facilitator notes editor. */
function ContentGovernanceView({onSaveNote}){
  var ACCENT="#E8B84B";
  var AUDIENCE_OPTS=["All Roles","Executive","Learner"];
  var STATUS_OPTS=["Published","Draft","Hidden"];
  var STATUS_COLOR={"Published":"#34C759","Draft":"#FF9500","Hidden":"rgba(255,255,255,0.3)"};
  var STATUS_BG={"Published":"rgba(52,199,89,0.12)","Draft":"rgba(255,149,0,0.12)","Hidden":"rgba(255,255,255,0.06)"};

  var [tid,setTid]=useState("");
  var [mid,setMid]=useState("");
  var [noteText,setNoteText]=useState("");
  var [audience,setAudience]=useState("All Roles");
  var [pubStatus,setPubStatus]=useState("Published");
  var [saved,setSaved]=useState(false);
  var [localNotes,setLocalNotes]=useState({});
  var [govMeta,setGovMeta]=useState({});

  useEffect(function(){
    getNotes().then(function(n){setLocalNotes(n||{});});
  },[]);

  useEffect(function(){
    var selTierObj=null;
    for(var i=0;i<TIERS.length;i++){if(TIERS[i].id===tid){selTierObj=TIERS[i];break;}}
    if(selTierObj&&selTierObj.mods&&selTierObj.mods.length>0){
      setMid(selTierObj.mods[0].id);
    }
  },[tid]);

  useEffect(function(){
    if(!mid)return;
    var n=localNotes[mid];
    setNoteText(n&&n.text?n.text:"");
    var meta=govMeta[mid];
    setAudience(meta&&meta.audience?meta.audience:"All Roles");
    setPubStatus(meta&&meta.status?meta.status:"Published");
  },[mid]);

  var selTierObj=null;
  for(var ti=0;ti<TIERS.length;ti++){if(TIERS[ti].id===tid){selTierObj=TIERS[ti];break;}}
  var selModObj=null;
  if(selTierObj){for(var mi=0;mi<selTierObj.mods.length;mi++){if(selTierObj.mods[mi].id===mid){selModObj=selTierObj.mods[mi];break;}}}

  var totalNotes=0;var publishedCount=0;var draftCount=0;
  for(var nk in localNotes){
    totalNotes++;
    var nm=govMeta[nk];
    var nst=nm&&nm.status?nm.status:"Published";
    if(nst==="Published")publishedCount++;
    else if(nst==="Draft")draftCount++;
  }

  function handleSave(){
    if(!mid||!noteText.trim())return;
    var nextNotes={};
    for(var k in localNotes){nextNotes[k]=localNotes[k];}
    nextNotes[mid]={text:noteText.trim(),auth:"Facilitator",d:new Date().toLocaleDateString("en-ZA")};
    setLocalNotes(nextNotes);
    var nextMeta={};
    for(var k2 in govMeta){nextMeta[k2]=govMeta[k2];}
    nextMeta[mid]={audience:audience,status:pubStatus};
    setGovMeta(nextMeta);
    onSaveNote(mid,noteText.trim());
    setSaved(true);
    setTimeout(function(){setSaved(false);},2500);
  }

  return(
    <div className="fade-in">
      <div style={{background:"linear-gradient(135deg,#1A1400,#2A1E00)",padding:"22px 24px",borderBottom:"1px solid rgba(255,255,255,0.06)"}}>
        <div style={{display:"flex",gap:8,marginBottom:10,justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap"}}>
          <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
            <Badge label="Module Notes" color={ACCENT} bg="rgba(232,184,75,0.15)"/>
            <Badge label={String(totalNotes)+" notes"} color="rgba(255,255,255,0.5)" bg="rgba(255,255,255,0.07)"/>
            <Badge label={String(publishedCount)+" Published"} color="#34C759" bg="rgba(52,199,89,0.12)"/>
            {draftCount>0&&<Badge label={String(draftCount)+" Draft"} color="#FF9500" bg="rgba(255,149,0,0.12)"/>}
          </div>
        </div>
        <div style={{fontSize:20,fontWeight:800,color:"#FFFFFF",letterSpacing:"-0.03em",marginBottom:2}}>Facilitator Notes</div>
        <div style={{fontSize:12,color:"rgba(255,255,255,0.4)"}}>Set visibility, audience, and publish status per module. Only Published notes are shown to learners.</div>
      </div>
      <div style={{padding:"16px 22px",display:"grid",gridTemplateColumns:"200px 1fr",gap:12}} className="mob-grid1">
        <div style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:10,overflow:"hidden"}}>
          {TIERS.map(function(t){return(
            <div key={t.id}>
              <div onClick={function(){setTid(t.id);}} role="button" tabIndex={0} onKeyDown={function(e){if(e.key==="Enter"||e.key===" ")setTid(t.id);}} style={{padding:"8px 12px",fontSize:10,fontWeight:700,color:tid===t.id?t.color:"rgba(255,255,255,0.35)",textTransform:"uppercase",letterSpacing:".08em",cursor:"pointer",background:tid===t.id?t.color+"15":"transparent",borderBottom:"1px solid rgba(255,255,255,0.05)"}}>
                {t.level}
              </div>
              {tid===t.id&&t.mods.map(function(m){return(
                <div key={m.id} onClick={function(){setMid(m.id);}} role="button" tabIndex={0} onKeyDown={function(e){if(e.key==="Enter"||e.key===" ")setMid(m.id);}} style={{padding:"7px 12px",cursor:"pointer",background:mid===m.id?"rgba(255,255,255,0.06)":"transparent",display:"flex",justifyContent:"space-between",alignItems:"center",borderBottom:"1px solid rgba(255,255,255,0.03)"}}>
                  <span style={{fontSize:11,color:mid===m.id?"rgba(255,255,255,0.85)":"rgba(255,255,255,0.4)",lineHeight:1.35}}>{m.title.length>28?m.title.slice(0,28)+"…":m.title}</span>
                  {localNotes[m.id]&&<span style={{fontSize:10,color:t.color,flexShrink:0}}>●</span>}
                </div>
              );})}
            </div>
          );})}
        </div>
        <div>
          {selModObj?(
            <div style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:12,padding:"18px 20px"}}>
              <div style={{fontSize:14,fontWeight:700,color:"rgba(255,255,255,0.85)",marginBottom:2}}>{selModObj.title}</div>
              <div style={{fontSize:11,color:"rgba(255,255,255,0.3)",marginBottom:14}}>{selTierObj&&selTierObj.level}</div>
              <textarea value={noteText} onChange={function(e){setNoteText(e.target.value);}} placeholder="Add a facilitator note — e.g. 'Pay attention to the build/buy/partner framework. We will workshop this in Thursday's live session.'" rows={5}
                style={{width:"100%",padding:"10px 12px",border:"1px solid rgba(255,255,255,0.1)",borderRadius:9,fontSize:13,resize:"vertical",fontFamily:"inherit",color:"rgba(255,255,255,0.85)",background:"rgba(255,255,255,0.06)",outline:"none",lineHeight:1.65,boxSizing:"border-box"}}
                onFocus={function(e){e.target.style.borderColor="rgba(232,184,75,0.4)";}} onBlur={function(e){e.target.style.borderColor="rgba(255,255,255,0.1)";}}/>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginTop:12,marginBottom:12}}>
                <div>
                  <div style={{fontSize:10,fontWeight:700,color:"rgba(255,255,255,0.35)",textTransform:"uppercase",letterSpacing:".08em",marginBottom:6}}>Audience</div>
                  <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                    {AUDIENCE_OPTS.map(function(opt){return(
                      <button key={opt} onClick={function(){setAudience(opt);}} style={{padding:"5px 10px",borderRadius:6,fontSize:11,fontWeight:600,fontFamily:"inherit",cursor:"pointer",border:audience===opt?"1px solid "+ACCENT:"1px solid rgba(255,255,255,0.1)",background:audience===opt?"rgba(232,184,75,0.15)":"transparent",color:audience===opt?ACCENT:"rgba(255,255,255,0.45)"}}>
                        {opt}
                      </button>
                    );})}
                  </div>
                </div>
                <div>
                  <div style={{fontSize:10,fontWeight:700,color:"rgba(255,255,255,0.35)",textTransform:"uppercase",letterSpacing:".08em",marginBottom:6}}>Publish Status</div>
                  <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                    {STATUS_OPTS.map(function(opt){return(
                      <button key={opt} onClick={function(){setPubStatus(opt);}} style={{padding:"5px 10px",borderRadius:6,fontSize:11,fontWeight:600,fontFamily:"inherit",cursor:"pointer",border:pubStatus===opt?"1px solid "+(STATUS_COLOR[opt]||"rgba(255,255,255,0.3)"):"1px solid rgba(255,255,255,0.1)",background:pubStatus===opt?(STATUS_BG[opt]||"rgba(255,255,255,0.06)"):"transparent",color:pubStatus===opt?(STATUS_COLOR[opt]||"rgba(255,255,255,0.5)"):"rgba(255,255,255,0.45)"}}>
                        {opt}
                      </button>
                    );})}
                  </div>
                </div>
              </div>
              {localNotes[mid]&&(
                <div style={{fontSize:10,color:"rgba(255,255,255,0.25)",marginBottom:10,padding:"6px 10px",background:"rgba(255,255,255,0.03)",borderRadius:6,border:"1px solid rgba(255,255,255,0.05)"}}>
                  Last saved by {localNotes[mid].auth||"Facilitator"} · {localNotes[mid].d||"—"}
                  {govMeta[mid]&&(<span> · <span style={{color:STATUS_COLOR[govMeta[mid].status]||"rgba(255,255,255,0.3)"}}>{govMeta[mid].status}</span> · {govMeta[mid].audience}</span>)}
                </div>
              )}
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:4}}>
                <span style={{fontSize:11,color:"rgba(255,255,255,0.3)"}}>{pubStatus==="Published"?"Visible to "+audience:pubStatus==="Draft"?"Draft — not yet visible to learners":"Hidden from all learners"}</span>
                <button onClick={handleSave} style={{padding:"8px 18px",borderRadius:9,background:saved?"rgba(52,199,89,0.15)":"linear-gradient(135deg,#E8B84B,#C17F24)",border:saved?"1px solid rgba(52,199,89,0.3)":"none",color:saved?"#34C759":"#1A0800",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>{saved?"✓ Saved":"Save note"}</button>
              </div>
            </div>
          ):(
            <div style={{display:"flex",alignItems:"center",justifyContent:"center",height:200,color:"rgba(255,255,255,0.25)",fontSize:13}}>Select a module from the left to add a note</div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Intelligence Tab Component ──────────────────────────────────────────────
/** @param {{all:object[],avgLP:number,active:number}} props - all: learner records; avgLP: avg learning progress; active: active learner count. @returns {JSX.Element} Facilitator intelligence analytics tab. */
function IntelligenceTab({all, avgLP, active}){
  const safe=n=>Math.min(Math.max(n||0,0),100);
  const metrics=[
    ["Workforce Readiness", safe(Math.round(avgLP/100)), "#5AC8FA"],
    ["Data Literacy",       safe(Math.round(avgLP/80)),  "#0070F3"],
    ["AI Literacy",         safe(Math.round((all.filter(l=>l.mods>3).length/Math.max(all.length,1))*100)), "#7C3AED"],
    ["AI Adoption",         safe(Math.round((all.filter(l=>l.mods>0).length/Math.max(all.length,1))*100)), "#34C759"],
    ["Compliance",          72, "#FF9500"],
    ["AI Productivity",     safe(Math.round(avgLP/90)),  "#1D9E75"],
    ["Learning Eff.",       safe(Math.round((active/Math.max(all.length,1))*100+50)), "#FF6B35"],
    ["Maturity",            safe(Math.round(avgLP/120)), "#C17F24"],
    ["Transformation",      safe(Math.round((all.filter(l=>l.mods>8).length/Math.max(all.length,1))*100)), "#E8B84B"],
    ["Analytics",           safe(Math.round(avgLP/70)),  "#FF9F0A"],
  ];
  return(
    <div className="fade-in" style={{overflowY:"auto",flex:1}}>
      <div style={{background:"linear-gradient(135deg,#120A28,#1E0A40)",padding:"20px 22px",borderBottom:"1px solid rgba(255,255,255,0.06)"}}>
        <div style={{display:"flex",gap:8,marginBottom:8}}><Badge label="Exec Intelligence" color="#7C3AED" bg="rgba(124,58,237,0.15)"/></div>
        <div style={{fontSize:19,fontWeight:800,color:"#FFFFFF",letterSpacing:"-0.03em",marginBottom:2}}>Workforce Capability Intelligence</div>
        <div style={{fontSize:12,color:"rgba(255,255,255,0.4)"}}>Live readiness metrics for CHRO, CIO, CDO and Board reporting.</div>
      </div>
      <div style={{padding:"16px 20px"}}>
        <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:8,marginBottom:12}} className="mob-grid1">
          {metrics.map(function(item){
            var label=item[0], score=item[1], clr=item[2];
            return(
              <div key={label} style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:10,padding:"11px 13px",borderTop:"2px solid "+clr}}>
                <div style={{fontSize:19,fontWeight:800,color:score>=70?"#34C759":score>=50?"#FF9500":"#FF3B30",letterSpacing:"-0.04em",marginBottom:2}}>{score}%</div>
                <div style={{height:3,background:"rgba(255,255,255,0.07)",borderRadius:2,marginBottom:3}}>
                  <div style={{width:score+"%",height:"100%",background:clr,borderRadius:2}}/>
                </div>
                <div style={{fontSize:10,color:"rgba(255,255,255,0.35)",lineHeight:1.3}}>{label}</div>
              </div>
            );
          })}
        </div>
        <div style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:12,padding:"14px 16px",overflowX:"auto"}}>
          <div style={{fontSize:12,fontWeight:700,color:"rgba(255,255,255,0.7)",marginBottom:10}}>Capability Heatmap by Function</div>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:11,minWidth:480}}>
            <thead>
              <tr style={{borderBottom:"1px solid rgba(255,255,255,0.07)"}}>
                <td style={{padding:"5px 9px",color:"rgba(255,255,255,0.3)",fontWeight:700,minWidth:90}}>Function</td>
                {CAP_DIMS.slice(0,6).map(function(d){
                  return <td key={d.id} style={{padding:"5px 7px",color:d.color,fontWeight:700,textAlign:"center",minWidth:58,fontSize:10}}>{d.short}</td>;
                })}
                <td style={{padding:"5px 7px",color:"rgba(255,255,255,0.3)",fontWeight:700,textAlign:"center"}}>Avg</td>
              </tr>
            </thead>
            <tbody>
              {MGMT_FUNCTIONS.slice(0,8).map(function(fn,fi){
                var scores=CAP_DIMS.slice(0,6).map(function(_,di){return Math.max(20,Math.min(95,45+(fi*7+di*11)%50));});
                var avg=Math.round(scores.reduce(function(a,b){return a+b;},0)/scores.length);
                return(
                  <tr key={fn} style={{borderBottom:"1px solid rgba(255,255,255,0.04)"}}>
                    <td style={{padding:"6px 9px",color:"rgba(255,255,255,0.6)",fontWeight:500}}>{fn.split(" ")[0]}</td>
                    {scores.map(function(sc,si){
                      var bg=sc>=70?"rgba(52,199,89,0.15)":sc>=50?"rgba(255,149,0,0.12)":"rgba(255,59,48,0.12)";
                      var cl=sc>=70?"#34C759":sc>=50?"#FF9500":"#FF3B30";
                      return <td key={si} style={{padding:"5px 7px",textAlign:"center"}}><div style={{background:bg,color:cl,fontWeight:700,borderRadius:4,padding:"2px 4px",display:"inline-block",fontSize:10}}>{sc}%</div></td>;
                    })}
                    <td style={{padding:"5px 7px",textAlign:"center",fontWeight:800,color:avg>=60?"#34C759":"#FF9500",fontSize:12}}>{avg}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}


// ─── Platform Analyst Component (System Health / Self-Healing) ───────────────
/** @returns {JSX.Element} Admin view: Platform usage analyst with engagement metrics. */
function PlatformAnalyst(){
  var [running,setRunning]=useState(false);
  var [healing,setHealing]=useState(null);
  var [healed,setHealed]=useState([]);
  var [lastRun,setLastRun]=useState("2025-06-16 09:14:22");
  var [issues,setIssues]=useState(DEMO_SYS_ISSUES.slice());

  var openCount=issues.filter(function(x){return x.status==="Open";}).length;
  var critCount=issues.filter(function(x){return x.sev==="Critical"&&x.status==="Open";}).length;
  var highCount=issues.filter(function(x){return x.sev==="High"&&x.status==="Open";}).length;
  var healthScore=Math.max(0,100-critCount*20-highCount*8-openCount*3);
  var autoHealable=issues.filter(function(x){return x.auto&&x.status==="Open";}).length;

  function runDiagnostic(){
    setRunning(true);
    setTimeout(function(){
      setLastRun(new Date().toLocaleString("en-ZA"));
      setRunning(false);
    },2800);
  }

  function healIssue(idx){
    setHealing(idx);
    setTimeout(function(){
      setIssues(function(prev){
        var next=prev.slice();
        var updated=Object.assign({},next[idx],{status:"Resolved"});
        next[idx]=updated;
        return next;
      });
      setHealed(function(prev){return prev.concat([idx]);});
      setHealing(null);
    },1800);
  }

  function healAll(){
    var autoIdx=issues.reduce(function(acc,x,i){if(x.auto&&x.status==="Open")acc.push(i);return acc;},[]);
    var delay=0;
    autoIdx.forEach(function(idx){
      delay+=1200;
      setTimeout(function(){healIssue(idx);},delay);
    });
  }

  var sevColor={Critical:"#FF3B30",High:"#FF9500",Medium:"#E8B84B",Low:"#5AC8FA"};
  var hColor=healthScore>=80?"#34C759":healthScore>=60?"#FF9500":"#FF3B30";

  return(
    <div className="fade-in" style={{overflowY:"auto",flex:1,padding:"0 0 40px"}}>
      <div style={{background:"linear-gradient(135deg,#0F0A1E,#1A0A2E)",padding:"22px 28px",borderBottom:"1px solid rgba(255,59,48,0.15)"}}>
        <div style={{fontSize:11,fontWeight:700,color:"#FF3B30",textTransform:"uppercase",letterSpacing:".1em",marginBottom:6}}>Platform Analyst · Self-Healing</div>
        <div style={{fontSize:20,fontWeight:800,color:"#FFF",marginBottom:4}}>System Health & Diagnostics</div>
        <div style={{fontSize:12,color:"rgba(255,255,255,0.45)",marginBottom:14}}>Detect. Diagnose. Explain. Repair. Last diagnostic run: {lastRun}</div>
        <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
          <button onClick={runDiagnostic} disabled={running}
            style={{padding:"8px 18px",borderRadius:8,border:"none",background:running?"rgba(255,255,255,0.08)":"linear-gradient(135deg,#0070F3,#0055CC)",color:"#FFF",fontSize:12,fontWeight:700,cursor:running?"wait":"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",gap:7}}>
            {running?"Running diagnostic...":"Run Full Diagnostic"}
          </button>
          {autoHealable>0&&(
            <button onClick={healAll}
              style={{padding:"8px 18px",borderRadius:8,border:"1px solid rgba(52,199,89,0.3)",background:"rgba(52,199,89,0.1)",color:"#34C759",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>
              Auto-Heal {autoHealable} Issue{autoHealable!==1?"s":""}
            </button>
          )}
          <button style={{padding:"8px 18px",borderRadius:8,border:"1px solid rgba(255,255,255,0.12)",background:"transparent",color:"rgba(255,255,255,0.5)",fontSize:12,cursor:"pointer",fontFamily:"inherit"}}>
            Export Diagnostic Report
          </button>
        </div>
      </div>
      <div style={{padding:"20px 28px"}}>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:20}} className="mob-grid1">
          {[
            {label:"Platform Health",  val:healthScore+"%",        color:hColor},
            {label:"Open Issues",      val:openCount+"",           color:openCount===0?"#34C759":openCount<=2?"#FF9500":"#FF3B30"},
            {label:"Critical Issues",  val:critCount+"",           color:critCount===0?"#34C759":"#FF3B30"},
            {label:"Auto-Healable",    val:autoHealable+"",        color:"#5AC8FA"},
          ].map(function(kpi,i){return(
            <div key={i} style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba("+kpi.color.slice(1).match(/../g).map(function(x){return parseInt(x,16);}).join(",")+",0.25)",borderRadius:10,padding:"14px 16px",textAlign:"center"}}>
              <div style={{fontSize:28,fontWeight:800,color:kpi.color,letterSpacing:"-0.04em"}}>{kpi.val}</div>
              <div style={{fontSize:11,color:"rgba(255,255,255,0.4)",marginTop:3}}>{kpi.label}</div>
            </div>
          );},this)}
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:9}}>
          {issues.map(function(iss,i){
            var sc=sevColor[iss.sev]||"#5AC8FA";
            var resolved=iss.status==="Resolved";
            return(
              <div key={iss.id} style={{background:resolved?"rgba(52,199,89,0.04)":"rgba(255,255,255,0.03)",border:"1px solid "+(resolved?"rgba(52,199,89,0.15)":"rgba(255,255,255,0.07)"),borderRadius:10,padding:"14px 16px",opacity:resolved?0.7:1,transition:"all .3s"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:12}}>
                  <div style={{flex:1}}>
                    <div style={{display:"flex",gap:7,marginBottom:7,flexWrap:"wrap",alignItems:"center"}}>
                      <span style={{fontSize:10,fontWeight:700,padding:"2px 8px",borderRadius:8,background:sc+"20",color:sc}}>{iss.sev}</span>
                      <span style={{fontSize:10,padding:"2px 8px",borderRadius:8,background:resolved?"rgba(52,199,89,0.15)":"rgba(255,255,255,0.07)",color:resolved?"#34C759":"rgba(255,255,255,0.45)"}}>{iss.status}</span>
                      <span style={{fontSize:10,color:"rgba(255,255,255,0.3)"}}>{iss.portal} · {iss.page}</span>
                    </div>
                    <div style={{fontSize:13,fontWeight:700,color:resolved?"rgba(255,255,255,0.5)":"rgba(255,255,255,0.88)",marginBottom:5,textDecoration:resolved?"line-through":"none"}}>{iss.issue}</div>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"2px 20px",marginBottom:7}}>
                      <div style={{fontSize:11,color:"rgba(255,255,255,0.4)"}}><strong style={{color:"rgba(255,255,255,0.55)"}}>Root cause:</strong> {iss.cause}</div>
                      <div style={{fontSize:11,color:"rgba(255,255,255,0.4)"}}><strong style={{color:"rgba(255,255,255,0.55)"}}>Impact:</strong> {iss.impact}</div>
                    </div>
                    <div style={{fontSize:11,color:"#5AC8FA",background:"rgba(0,112,243,0.08)",padding:"6px 10px",borderRadius:6}}><strong>Fix:</strong> {iss.fix}</div>
                  </div>
                  <div style={{flexShrink:0,display:"flex",flexDirection:"column",gap:6,alignItems:"flex-end"}}>
                    {!resolved&&iss.auto&&(
                      <button onClick={function(){healIssue(i);}} disabled={healing===i}
                        style={{padding:"6px 14px",borderRadius:7,border:"none",background:healing===i?"rgba(255,255,255,0.08)":"linear-gradient(135deg,#34C759,#28A745)",color:"#FFF",fontSize:11,fontWeight:700,cursor:healing===i?"wait":"pointer",fontFamily:"inherit",whiteSpace:"nowrap"}}>
                        {healing===i?"Healing...":"Auto-Heal"}
                      </button>
                    )}
                    {!resolved&&!iss.auto&&(
                      <button style={{padding:"6px 14px",borderRadius:7,background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.1)",color:"rgba(255,255,255,0.5)",fontSize:11,fontFamily:"inherit",cursor:"pointer",whiteSpace:"nowrap"}}>Manual fix</button>
                    )}
                    {resolved&&<span style={{fontSize:11,color:"#34C759",fontWeight:700}}>Resolved</span>}
                  </div>
                </div>
              </div>
            );
          },this)}
        </div>
      </div>
    </div>
  );
}


/** @param {{user:string,notes:object,onSaveNote:Function,board:object[]}} props @returns {JSX.Element} Facilitator/admin dashboard shell with tabbed views. */
function FacilDash({user,notes,onSaveNote,board}){
  const [tab,setTab]=useState("overview");
  const [activeInt,setActiveInt]=useState(null);
  const [connStep,setConnStep]=useState(0);
  const [connData,setConnData]=useState({});
  const [testResult,setTestResult]=useState(null);
  const [search,setSearch]=useState("");
  const [sectorFilter,setSectorFilter]=useState("");
  const [mobMenu,setMobMenu]=useState(false);
  const [orgCtx,setOrgCtx]=useState({orgName:"",challenges:"",priorities:"",aiMaturity:"developing"});
  const [orgSaved,setOrgSaved]=useState(false);


  const realL=(board||[]).map(e=>({name:e.n,xp:e.xp,lv:e.lv||"Digital Literate",mods:Math.min(Math.floor(e.xp/100),totalMods()),last:"Recently",ind:e.ind||""}));
  const all=[...realL,...DEMO_COHORT.filter(d=>!realL.find(r=>r.name===d.name))].sort((a,z)=>z.xp-a.xp);
  const tm=totalMods();
  const avgLP=all.length?Math.round(all.reduce((a,l)=>a+l.xp,0)/all.length):0;
  const avgPct=all.length?Math.round(all.reduce((a,l)=>a+(l.mods/tm*100),0)/all.length):0;
  const active=all.filter(l=>l.last.includes("hour")||l.last.includes("min")||l.last==="Recently").length;
  const atRisk=all.filter(l=>l.mods===0||l.last?.includes("day")||l.last?.includes("days")).length;
  const filtered=all.filter(l=>{
    if(sectorFilter&&l.ind!==sectorFilter)return false;
    if(search&&!l.name.toLowerCase().includes(search.toLowerCase()))return false;
    return true;
  });
  const sectors=[...new Set(all.filter(l=>l.ind).map(l=>l.ind))].sort();

  useEffect(()=>{
    async function loadOrgCtx(){
      try{
        const res=await window.storage.get("cap:org_context",true);
        if(res?.value) setOrgCtx(JSON.parse(res.value));
      }catch(e){}
    }
    loadOrgCtx();
  },[]);

  async function saveOrgCtx(){
    try{
      await window.storage.set("cap:org_context",JSON.stringify(orgCtx),true);
      setOrgSaved(true); setTimeout(()=>setOrgSaved(false),3000);
    }catch(e){alert("Save failed: "+e.message);}
  }

  const TABS=[
    {id:"overview",     icon:"◎", label:"Overview"},
    {id:"commandcentre",icon:"⊞", label:"Command Centre"},
    {id:"learners",     icon:"◈", label:"Learners"},
    {id:"intelligence", icon:"⬡", label:"Intelligence"},
    {id:"content",      icon:"◇", label:"Module Notes"},
    {id:"integration",  icon:"◉", label:"LXP Setup"},
    {id:"orgsetup",     icon:"◑", label:"Organisation"},
    {id:"bizunits",     icon:"▣", label:"Business Units"},
    {id:"captax",       icon:"◆", label:"Capabilities"},
    {id:"capmap",         icon:"⬥", label:"Capability Map"},
    {id:"workforceplan",  icon:"◫", label:"Workforce Plan"},
    {id:"aireadiness",    icon:"◈", label:"AI Readiness"},
    {id:"aitoolkit",      icon:"⊙", label:"AI Toolkit"},
    {id:"usecasegov",    icon:"◧", label:"AI at Work"},
    {id:"intervention",  icon:"◐", label:"Interventions"},
    {id:"reports",      icon:"▤", label:"Reports"},
    {id:"govrisk",      icon:"⬗", label:"Gov & Risk"},
    {id:"syshealth",    icon:"◩", label:"Platform Health"},
    {id:"auditlogs",    icon:"▥", label:"Audit Logs"},
  ];

  const accentByTab={overview:"#5AC8FA",commandcentre:"#06B6D4",learners:"#34C759",intelligence:"#7C3AED",content:"#E8B84B",integration:"#0070F3",orgsetup:"#0070F3",bizunits:"#5AC8FA",captax:"#A78BFA",capmap:"#FF9500",workforceplan:"#5AC8FA",aireadiness:"#A78BFA",aitoolkit:"#A78BFA",usecasegov:"#06B6D4",intervention:"#34C759",reports:"#E8B84B",govrisk:"#FF6B35",syshealth:"#FF3B30",auditlogs:"#8B97B5"};
  const accent=accentByTab[tab]||"#5AC8FA";

  return(
    <div style={{display:"flex",height:"100vh",background:"#030B16",overflow:"hidden",fontFamily:"'DM Sans',-apple-system,sans-serif"}}>

      {/* ── Sidebar ── */}
      <aside style={{width:220,background:"#050E1A",borderRight:"1px solid rgba(255,255,255,0.06)",display:"flex",flexDirection:"column",flexShrink:0,overflow:"hidden"}}
        className="sidebar-mob">
        {/* Logo */}
        <div className="sidebar-logo" style={{padding:"20px 18px 16px",borderBottom:"1px solid rgba(255,255,255,0.06)"}}>
          <div style={{display:"flex",alignItems:"center",gap:9,marginBottom:4}}>
            <div style={{width:28,height:28,borderRadius:7,background:"linear-gradient(135deg,#0052FF,#0085FF)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
              <svg width="14" height="14" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="7" stroke="rgba(255,255,255,0.9)" strokeWidth="1.5" fill="none"/><circle cx="9" cy="9" r="3" fill="rgba(255,255,255,0.9)"/><line x1="9" y1="2" x2="9" y2="16" stroke="rgba(255,255,255,0.35)" strokeWidth="1"/><line x1="2" y1="9" x2="16" y2="9" stroke="rgba(255,255,255,0.35)" strokeWidth="1"/></svg>
            </div>
            <div>
              <div style={{fontSize:14,fontWeight:800,color:"#FFFFFF",letterSpacing:"-0.03em"}}>CapabilityOS</div>
              <div style={{fontSize:9,color:"rgba(255,255,255,0.3)",fontWeight:600,textTransform:"uppercase",letterSpacing:".1em"}}>by Digilytics Co.</div>
            </div>
          </div>
          <span style={{fontSize:10,fontWeight:700,color:"#FF9500",background:"rgba(255,149,0,0.12)",padding:"2px 8px",borderRadius:4,border:"1px solid rgba(255,149,0,0.2)"}}>Admin Portal</span>
        </div>

        {/* Nav */}
        <nav style={{flex:1,padding:"10px 8px",overflow:"auto"}} className="sidebar-section">
          <div style={{fontSize:9,fontWeight:700,color:"rgba(255,255,255,0.25)",textTransform:"uppercase",letterSpacing:".12em",padding:"6px 10px",marginBottom:2}}>Management</div>
          {TABS.map(t=>{
            const isActive=tab===t.id;
            const c2=accentByTab[t.id]||"#5AC8FA";
            return(
              <div key={t.id} onClick={()=>setTab(t.id)} role="button" tabIndex={0} onKeyDown={e=>{if(e.key==="Enter"||e.key===" ")setTab(t.id);}} style={{display:"flex",alignItems:"center",gap:10,padding:"9px 10px",borderRadius:8,cursor:"pointer",marginBottom:2,
                background:isActive?c2+"18":"transparent",borderLeft:"2px solid "+(isActive?c2:"transparent"),transition:"all .15s"}}>
                <span style={{fontSize:14,color:isActive?c2:"rgba(255,255,255,0.4)"}}>{t.icon}</span>
                <span style={{fontSize:13,fontWeight:isActive?700:400,color:isActive?c2:"rgba(255,255,255,0.55)"}}>{t.label}</span>
              </div>
            );
          })}
        </nav>

        {/* Admin user footer */}
        <div className="sidebar-user" style={{padding:"12px 14px",borderTop:"1px solid rgba(255,255,255,0.06)"}}>
          <div style={{display:"flex",alignItems:"center",gap:9}}>
            <div style={{width:30,height:30,borderRadius:"50%",background:"rgba(255,149,0,0.18)",border:"1.5px solid rgba(255,149,0,0.4)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700,color:"#FF9500",flexShrink:0}}>
              {user?.name?.[0]?.toUpperCase()||"A"}
            </div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:12,fontWeight:600,color:"rgba(255,255,255,0.85)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{user?.name||"Administrator"}</div>
              <div style={{fontSize:10,color:"rgba(255,255,255,0.35)"}}>Platform Admin</div>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Main content ── */}
      <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>

        {/* Top header */}
        <div style={{background:"#050E1A",borderBottom:"1px solid rgba(255,255,255,0.06)",padding:"0 22px",display:"flex",alignItems:"center",justifyContent:"space-between",height:52,flexShrink:0}}>
          <div>
            <div style={{fontSize:15,fontWeight:700,color:"#FFFFFF",letterSpacing:"-0.02em"}}>{TABS.find(t=>t.id===tab)?.label}</div>
            <div style={{fontSize:10,color:"rgba(255,255,255,0.3)"}}>{new Date().toLocaleDateString("en-ZA",{weekday:"short",year:"numeric",month:"short",day:"numeric"})}</div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{fontSize:11,color:"rgba(255,255,255,0.35)",padding:"4px 10px",background:"rgba(255,255,255,0.05)",borderRadius:6,border:"1px solid rgba(255,255,255,0.08)"}}>
              {all.length} learners enrolled
            </div>
            <div style={{width:8,height:8,borderRadius:"50%",background:"#34C759",boxShadow:"0 0 6px #34C759"}}/>
            <span style={{fontSize:11,color:"#34C759"}}>Live</span>
          </div>
        </div>

        {/* Scrollable content */}
        <div style={{flex:1,overflowY:"auto",background:"#030B16"}}>

          {/* ─── OVERVIEW ─────────────────────────────────────────────────────── */}
          {tab==="overview"&&(
            <div className="fade-in">
              {/* Dark hero */}
              <div style={{background:"linear-gradient(135deg,#0A1828,#0D2040)",padding:"22px 24px",borderBottom:"1px solid rgba(255,255,255,0.06)"}}>
                <div style={{display:"flex",gap:8,marginBottom:10,flexWrap:"wrap"}}>
                  <Badge label="Cohort Overview" color="#5AC8FA" bg="rgba(90,200,250,0.15)"/>
                  <Badge label={all.length+" enrolled"} color="rgba(255,255,255,0.4)" bg="rgba(255,255,255,0.07)"/>
                </div>
                <div style={{fontSize:20,fontWeight:800,color:"#FFFFFF",letterSpacing:"-0.03em",marginBottom:2}}>Workforce Intelligence Summary</div>
                <div style={{fontSize:12,color:"rgba(255,255,255,0.4)",marginBottom:14}}>Real-time capability and engagement metrics for your organisation.</div>
                <div style={{display:"flex",gap:20,flexWrap:"wrap"}}>
                  {[{v:all.length,l:"Total Learners",c:"#5AC8FA"},{v:avgPct+"%",l:"Avg Completion",c:"#34C759"},{v:active,l:"Active Today",c:"#FF9500"},{v:atRisk,l:"Need Attention",c:"#FF3B30"},{v:avgLP+" LP",l:"Avg Learning Points",c:"#7C3AED"}].map((s,i)=>(
                    <div key={i}><div style={{fontSize:22,fontWeight:800,color:s.c,letterSpacing:"-0.04em"}}>{s.v}</div><div style={{fontSize:10,color:"rgba(255,255,255,0.3)",marginTop:1}}>{s.l}</div></div>
                  ))}
                </div>
              </div>

              <div style={{padding:"18px 22px",display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}} className="mob-grid1">
                {/* Programme completion */}
                <div style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:12,padding:"16px 18px"}}>
                  <div style={{fontSize:12,fontWeight:700,color:"rgba(255,255,255,0.7)",marginBottom:12}}>Programme Completion</div>
                  {TIERS.map(t=>{
                    const pct=Math.min(Math.round(avgLP/(t.mods.length*100)*100),100);
                    return(<div key={t.id} style={{marginBottom:10}}>
                      <div style={{display:"flex",justifyContent:"space-between",fontSize:11,marginBottom:3}}>
                        <span style={{color:"rgba(255,255,255,0.55)",fontWeight:500}}>{t.name}</span>
                        <span style={{color:t.color,fontWeight:700}}>{pct}%</span>
                      </div>
                      <div style={{height:4,background:"rgba(255,255,255,0.07)",borderRadius:3,overflow:"hidden"}}>
                        <div style={{width:pct+"%",height:"100%",background:t.color,borderRadius:3}}/>
                      </div>
                    </div>);
                  })}
                </div>
                {/* Top performers */}
                <div style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:12,padding:"16px 18px"}}>
                  <div style={{fontSize:12,fontWeight:700,color:"rgba(255,255,255,0.7)",marginBottom:12}}>Top Performers</div>
                  {all.slice(0,5).map((l,i)=>{
                    const lv=LEVELS.slice().reverse().find(lvl=>(l.xp||0)>=lvl.min)||LEVELS[0];
                    return(<div key={i} style={{display:"flex",alignItems:"center",gap:9,paddingBottom:8,marginBottom:8,borderBottom:i<4?"1px solid rgba(255,255,255,0.05)":"none"}}>
                      <span style={{width:18,fontSize:12,color:i<3?"#E8B84B":"rgba(255,255,255,0.3)"}}>{i===0?"🥇":i===1?"🥈":i===2?"🥉":i+1}</span>
                      <div style={{width:26,height:26,borderRadius:"50%",background:lv.color+"20",border:"1.5px solid "+lv.color,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,color:lv.color,flexShrink:0}}>{l.name[0]}</div>
                      <div style={{flex:1}}>
                        <div style={{fontSize:12,fontWeight:600,color:"rgba(255,255,255,0.85)"}}>{l.name}</div>
                        <div style={{fontSize:10,color:"rgba(255,255,255,0.3)"}}>{lv.name}</div>
                      </div>
                      <div style={{fontSize:12,fontWeight:700,color:lv.color}}>{(l.xp||0).toLocaleString()} LP</div>
                    </div>);
                  })}
                </div>
              </div>
              {/* Daily challenge broadcast */}
              <div style={{margin:"0 22px 14px",padding:"14px 18px",background:"rgba(0,112,243,0.06)",border:"1px solid rgba(0,112,243,0.2)",borderRadius:12}}>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:8}}>
                  <div>
                    <div style={{fontSize:12,fontWeight:700,color:"#5AC8FA",marginBottom:2}}>📡 Daily Challenge Broadcast</div>
                    <div style={{fontSize:11,color:"rgba(255,255,255,0.4)"}}>Push today's AI challenge to all {all.length} enrolled learners immediately.</div>
                  </div>
                  <button onClick={async()=>{
                    try{
                      const today=new Date().toDateString();
                      await window.storage.set("broadcast:challenge",JSON.stringify({date:today,pushedBy:user?.name||"Admin",pushedAt:new Date().toLocaleTimeString("en-ZA")}),true);
                      alert("✓ Daily challenge broadcast to all "+all.length+" learners.");
                    }catch(e){alert("Broadcast failed: "+e.message);}
                  }} style={{padding:"8px 16px",borderRadius:8,border:"1px solid rgba(90,200,250,0.3)",background:"rgba(90,200,250,0.1)",color:"#5AC8FA",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit",whiteSpace:"nowrap"}}>
                    📡 Broadcast Now
                  </button>
                </div>
              </div>
              {/* Org Context panel */}
              <div style={{margin:"0 22px 14px",background:"rgba(232,184,75,0.06)",border:"1px solid rgba(232,184,75,0.18)",borderRadius:12,padding:"16px 18px"}}>
                <div style={{fontSize:12,fontWeight:700,color:"#E8B84B",marginBottom:2}}>🏢 Organisation Context for AI Use Cases</div>
                <div style={{fontSize:11,color:"rgba(255,255,255,0.4)",marginBottom:12,lineHeight:1.5}}>Set your org's context here. Learners' Use Case Library will reflect these challenges and priorities.</div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}} className="mob-grid1">
                  <div>
                    <div style={{fontSize:10,fontWeight:600,color:"rgba(255,255,255,0.4)",marginBottom:4}}>Organisation Name</div>
                    <input value={orgCtx.orgName} onChange={e=>setOrgCtx(d=>({...d,orgName:e.target.value}))} placeholder="e.g. Acme Financial Services"
                      style={{width:"100%",padding:"7px 10px",border:"1px solid rgba(255,255,255,0.1)",borderRadius:8,fontSize:12,color:"rgba(255,255,255,0.85)",background:"rgba(255,255,255,0.06)",fontFamily:"inherit",outline:"none",boxSizing:"border-box"}}/>
                  </div>
                  <div>
                    <div style={{fontSize:10,fontWeight:600,color:"rgba(255,255,255,0.4)",marginBottom:4}}>AI Maturity</div>
                    <select value={orgCtx.aiMaturity} onChange={e=>setOrgCtx(d=>({...d,aiMaturity:e.target.value}))}
                      style={{width:"100%",padding:"7px 10px",border:"1px solid rgba(255,255,255,0.1)",borderRadius:8,fontSize:12,color:"rgba(255,255,255,0.85)",background:"rgba(0,10,20,0.8)",fontFamily:"inherit",outline:"none"}}>
                      <option value="exploring">Exploring AI</option>
                      <option value="developing">Developing capability</option>
                      <option value="scaling">Scaling AI adoption</option>
                      <option value="leading">AI-led organisation</option>
                    </select>
                  </div>
                </div>
                <div style={{marginBottom:10}}>
                  <div style={{fontSize:10,fontWeight:600,color:"rgba(255,255,255,0.4)",marginBottom:4}}>Key Business Challenges <span style={{color:"rgba(232,184,75,0.6)"}}>— shapes the use cases learners see</span></div>
                  <textarea value={orgCtx.challenges} onChange={e=>setOrgCtx(d=>({...d,challenges:e.target.value}))} rows={3}
                    placeholder="e.g. Reducing credit risk assessment time, automating KYC, improving AI adoption across 2000 employees by Q3..."
                    style={{width:"100%",padding:"7px 10px",border:"1px solid rgba(255,255,255,0.1)",borderRadius:8,fontSize:12,color:"rgba(255,255,255,0.85)",background:"rgba(255,255,255,0.06)",fontFamily:"inherit",outline:"none",resize:"vertical",lineHeight:1.5,boxSizing:"border-box"}}/>
                </div>
                <button onClick={saveOrgCtx}
                  style={{padding:"7px 18px",borderRadius:8,border:orgSaved?"1px solid rgba(52,199,89,0.3)":"none",
                    background:orgSaved?"rgba(52,199,89,0.12)":"linear-gradient(135deg,#E8B84B,#C17F24)",
                    color:orgSaved?"#34C759":"#1A0800",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>
                  {orgSaved?"✓ Context saved — learners' use cases updated":"Save Organisation Context"}
                </button>
              </div>

              {atRisk>0&&(
                <div style={{margin:"0 22px 18px",padding:"14px 18px",background:"rgba(255,59,48,0.06)",border:"1.5px solid rgba(255,59,48,0.2)",borderRadius:12}}>
                  <div style={{fontSize:12,fontWeight:700,color:"#FF3B30",marginBottom:8}}>⚠ {atRisk} Learner{atRisk>1?"s":""} Needing Attention</div>
                  <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8}} className="mob-grid1">
                    {all.filter(l=>l.mods===0||l.last?.includes("day")).slice(0,6).map((l,i)=>(
                      <div key={i} style={{background:"rgba(255,255,255,0.04)",borderRadius:8,padding:"9px 12px"}}>
                        <div style={{fontSize:12,fontWeight:600,color:"rgba(255,255,255,0.8)"}}>{l.name}</div>
                        <div style={{fontSize:10,color:"rgba(255,255,255,0.35)",marginTop:2}}>{l.mods===0?"No modules started":"Last active: "+l.last}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ─── ENTERPRISE COMMAND CENTRE ──────────────────────────────────── */}
          {tab==="commandcentre"&&<EnterpriseCommandCentreView/>}
          {tab==="aitoolkit"&&<GovernedWorkbenchView/>}
          {tab==="usecasegov"&&<UseCaseGovernanceView/>}

          {/* ─── LEARNERS ────────────────────────────────────────────────────── */}
          {tab==="learners"&&(
            <div className="fade-in">
              <div style={{background:"linear-gradient(135deg,#0A2010,#0D3018)",padding:"22px 24px",borderBottom:"1px solid rgba(255,255,255,0.06)"}}>
                <div style={{display:"flex",gap:8,marginBottom:10}}>
                  <Badge label="Learner Roster" color="#34C759" bg="rgba(52,199,89,0.15)"/>
                  <Badge label={all.length+" enrolled"} color="rgba(255,255,255,0.4)" bg="rgba(255,255,255,0.07)"/>
                </div>
                <div style={{fontSize:20,fontWeight:800,color:"#FFFFFF",letterSpacing:"-0.03em",marginBottom:10}}>Cohort Management</div>
                <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                  <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search by name..."
                    style={{flex:1,minWidth:160,padding:"8px 12px",border:"1px solid rgba(255,255,255,0.12)",borderRadius:8,fontSize:12,color:"#FFFFFF",background:"rgba(255,255,255,0.06)",fontFamily:"inherit",outline:"none"}}
                    onFocus={e=>e.target.style.borderColor="#34C759"} onBlur={e=>e.target.style.borderColor="rgba(255,255,255,0.12)"}/>
                  <select value={sectorFilter} onChange={e=>setSectorFilter(e.target.value)}
                    style={{padding:"8px 12px",border:"1px solid rgba(255,255,255,0.12)",borderRadius:8,fontSize:12,color:sectorFilter?"#34C759":"rgba(255,255,255,0.5)",background:"rgba(255,255,255,0.06)",fontFamily:"inherit",cursor:"pointer",outline:"none"}}>
                    <option value="">All industries</option>
                    {sectors.map(s=><option key={s} value={s}>{s}</option>)}
                  </select>
                  {(search||sectorFilter)&&<button onClick={()=>{setSearch("");setSectorFilter("");}} style={{padding:"8px 12px",borderRadius:8,border:"1px solid rgba(255,255,255,0.12)",background:"transparent",color:"rgba(255,255,255,0.5)",fontSize:11,cursor:"pointer",fontFamily:"inherit"}}>Clear</button>}
                  <span style={{fontSize:11,color:"rgba(255,255,255,0.3)",alignSelf:"center",whiteSpace:"nowrap"}}>{filtered.length} learners</span>
                </div>
              </div>
              <div style={{padding:"16px 22px"}}>
                {/* Table header */}
                <div style={{display:"grid",gridTemplateColumns:"2fr 1.2fr 100px 1fr 70px",gap:0,padding:"8px 14px",borderBottom:"1px solid rgba(255,255,255,0.07)",marginBottom:4}}>
                  {["Learner","Level","Progress","Industry","Status"].map(h=><div key={h} style={{fontSize:9,fontWeight:700,color:"rgba(255,255,255,0.25)",textTransform:"uppercase",letterSpacing:".08em"}}>{h}</div>)}
                </div>
                {filtered.map((l,i)=>{
                  const lv=LEVELS.slice().reverse().find(lvl=>(l.xp||0)>=lvl.min)||LEVELS[0];
                  const pct=Math.min(Math.round((l.mods||0)/tm*100),100);
                  const attn=l.mods===0||(l.last?.includes("day")&&!l.last?.includes("1 day"));
                  return(
                    <div key={i} style={{display:"grid",gridTemplateColumns:"2fr 1.2fr 100px 1fr 70px",gap:0,padding:"10px 14px",borderBottom:"1px solid rgba(255,255,255,0.04)",alignItems:"center",borderRadius:8,transition:"background .12s"}}
                      onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,0.03)"}
                      onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                      <div style={{display:"flex",alignItems:"center",gap:9}}>
                        <div style={{width:28,height:28,borderRadius:"50%",background:lv.color+"20",border:"1.5px solid "+lv.color,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:lv.color,flexShrink:0}}>{l.name[0]}</div>
                        <div>
                          <div style={{fontSize:12,fontWeight:600,color:"rgba(255,255,255,0.85)"}}>{l.name}</div>
                          <div style={{fontSize:10,color:"rgba(255,255,255,0.3)"}}>{(l.xp||0).toLocaleString()} LP</div>
                        </div>
                      </div>
                      <div>
                        <div style={{fontSize:11,fontWeight:600,color:lv.color}}>{lv.name}</div>
                        <div style={{fontSize:10,color:"rgba(255,255,255,0.25)"}}>Level {lv.n} of {LEVELS.length}</div>
                      </div>
                      <div>
                        <div style={{height:3,background:"rgba(255,255,255,0.07)",borderRadius:2,overflow:"hidden",width:80,marginBottom:3}}>
                          <div style={{width:pct+"%",height:"100%",background:lv.color,borderRadius:2}}/>
                        </div>
                        <div style={{fontSize:10,color:"rgba(255,255,255,0.3)"}}>{pct}%</div>
                      </div>
                      <div style={{fontSize:11,color:"rgba(255,255,255,0.4)"}}>{l.ind||"—"}</div>
                      <div><span style={{fontSize:10,fontWeight:600,padding:"2px 8px",borderRadius:20,background:attn?"rgba(255,59,48,0.12)":"rgba(52,199,89,0.12)",color:attn?"#FF3B30":"#34C759"}}>{attn?"At risk":"Active"}</span></div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ─── EXEC INTELLIGENCE ───────────────────────────────────────────── */}
          {tab==="intelligence"&&(
            <IntelligenceTab all={all} avgLP={avgLP} active={active}/>
          )}

          {tab==="content"&&<ContentGovernanceView onSaveNote={onSaveNote}/>}

          {/* ─── LXP SETUP ────────────────────────────────────────────────────── */}
          {tab==="integration"&&(<div className="fade-in">
            <div style={{background:"linear-gradient(135deg,#040E28,#071832)",padding:"22px 24px",borderBottom:"1px solid rgba(255,255,255,0.06)"}}>
              <div style={{display:"flex",gap:8,marginBottom:10,justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap"}}>
                <div style={{display:"flex",gap:8}}>
                  <Badge label="LXP Setup" color="#0070F3" bg="rgba(0,112,243,0.15)"/>
                  <Badge label={INTEGRATIONS.filter(i=>i.status==="Live").length+" Live"} color="#34C759" bg="rgba(52,199,89,0.12)"/>
                </div>
              </div>
              <div style={{fontSize:20,fontWeight:800,color:"#FFFFFF",letterSpacing:"-0.03em",marginBottom:2}}>Enterprise Integrations</div>
              <div style={{fontSize:12,color:"rgba(255,255,255,0.4)"}}>Click any platform to configure the connection and run the setup wizard.</div>
            </div>
            <div style={{padding:"18px 22px"}}>

              {/* Active integration wizard */}
              {activeInt&&(
                <div style={{background:"rgba(255,255,255,0.04)",border:"1.5px solid rgba(0,112,243,0.3)",borderRadius:14,overflow:"hidden",marginBottom:18,boxShadow:"0 8px 32px rgba(0,0,0,0.4)"}}>
                  {/* Wizard header */}
                  <div style={{background:"linear-gradient(135deg,#060E1E,#0A1832)",padding:"16px 22px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                    <div style={{display:"flex",alignItems:"center",gap:12}}>
                      <div style={{fontSize:26}}>{activeInt.emoji}</div>
                      <div>
                        <div style={{fontSize:15,fontWeight:800,color:"#FFFFFF",letterSpacing:"-0.02em"}}>{activeInt.name}</div>
                        <div style={{display:"flex",gap:6,marginTop:3}}>
                          <span style={{fontSize:10,fontWeight:700,padding:"1px 7px",borderRadius:10,background:STATUS_BG[activeInt.status],color:STATUS_COLOR[activeInt.status]}}>{activeInt.status}</span>
                          <span style={{fontSize:10,color:"rgba(255,255,255,0.3)",background:"rgba(255,255,255,0.07)",padding:"1px 7px",borderRadius:10}}>{activeInt.type}</span>
                          <span style={{fontSize:9,color:"rgba(255,255,255,0.25)",background:"rgba(255,255,255,0.05)",padding:"1px 7px",borderRadius:10,fontFamily:"monospace"}}>{activeInt.protocol}</span>
                        </div>
                      </div>
                    </div>
                    <button onClick={()=>{setActiveInt(null);setConnStep(0);setTestResult(null);setConnData({});}} aria-label="Close integration wizard" style={{background:"rgba(255,255,255,0.08)",border:"none",cursor:"pointer",color:"rgba(255,255,255,0.6)",width:30,height:30,borderRadius:"50%",fontSize:16,fontWeight:600,display:"flex",alignItems:"center",justifyContent:"center"}}>×</button>
                  </div>
                  {/* Step tabs */}
                  <div style={{display:"flex",borderBottom:"1px solid rgba(255,255,255,0.07)",overflowX:"auto"}}>
                    {activeInt.setupSteps.map((step,si)=>(
                      <div key={si} onClick={()=>si<=connStep&&setConnStep(si)} role="button" tabIndex={0} onKeyDown={e=>{if((e.key==="Enter"||e.key===" ")&&si<=connStep)setConnStep(si);}}
                        style={{flex:1,minWidth:60,padding:"10px 6px",textAlign:"center",cursor:si<=connStep?"pointer":"default",borderBottom:"2px solid "+(si===connStep?"#0070F3":"transparent"),background:si===connStep?"rgba(0,112,243,0.08)":"transparent",transition:"all .15s"}}>
                        <div style={{width:18,height:18,borderRadius:"50%",margin:"0 auto 3px",background:si<connStep?"#0070F3":si===connStep?"rgba(0,112,243,0.2)":"rgba(255,255,255,0.08)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:700,color:si<connStep?"#FFF":si===connStep?"#5AC8FA":"rgba(255,255,255,0.3)"}}>
                          {si<connStep?"✓":si+1}
                        </div>
                        <div style={{fontSize:9,fontWeight:si===connStep?700:400,color:si===connStep?"#5AC8FA":"rgba(255,255,255,0.3)",lineHeight:1.2}}>{step.split(" ").slice(0,2).join(" ")}</div>
                      </div>
                    ))}
                  </div>
                  {/* Step content */}
                  <div style={{padding:"22px 24px",minHeight:200}}>
                    {connStep===0&&(
                      <div>
                        <div style={{fontSize:14,fontWeight:700,color:"rgba(255,255,255,0.85)",marginBottom:6}}>Step 1 — {activeInt.setupSteps[0]}</div>
                        <div style={{fontSize:12,color:"rgba(255,255,255,0.45)",lineHeight:1.7,marginBottom:20}}>Generate a unique Client ID and Secret for your organisation. These authenticate CapabilityOS as a trusted partner in {activeInt.name}.</div>
                        {connData.clientId?(
                          <div>
                            <div style={{background:"rgba(255,255,255,0.04)",borderRadius:10,padding:"16px",marginBottom:12,border:"1px solid rgba(255,255,255,0.08)"}}>
                              {[{l:"Client ID",v:connData.clientId},{l:"Client Secret",v:connData.secret}].map((row,ri)=>(
                                <div key={ri} style={{marginBottom:ri===0?12:0}}>
                                  <div style={{fontSize:10,fontWeight:700,color:"rgba(255,255,255,0.35)",textTransform:"uppercase",letterSpacing:".07em",marginBottom:4}}>{row.l}</div>
                                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                                    <code style={{flex:1,fontSize:12,fontWeight:600,color:"#5AC8FA",background:"rgba(0,0,0,0.3)",padding:"8px 12px",borderRadius:7,border:"1px solid rgba(255,255,255,0.08)",letterSpacing:".03em",wordBreak:"break-all"}}>{row.v}</code>
                                    <button onClick={()=>{try{navigator.clipboard.writeText(row.v);}catch(e){}}} style={{padding:"6px 10px",borderRadius:7,border:"1px solid rgba(255,255,255,0.12)",background:"rgba(255,255,255,0.06)",fontSize:10,fontWeight:600,color:"rgba(255,255,255,0.6)",cursor:"pointer",fontFamily:"inherit",whiteSpace:"nowrap"}}>Copy</button>
                                  </div>
                                </div>
                              ))}
                            </div>
                            <div style={{fontSize:11,color:"#FF9500",background:"rgba(255,149,0,0.08)",padding:"9px 12px",borderRadius:7,border:"1px solid rgba(255,149,0,0.2)"}}>⚠ Save your Client Secret now — it will not be shown again.</div>
                          </div>
                        ):(
                          <button onClick={()=>{
                            const id="CAPOS-"+Math.random().toString(36).slice(2,8).toUpperCase()+"-"+Math.random().toString(36).slice(2,6).toUpperCase();
                            const sec=(Math.random().toString(36).slice(2)+Math.random().toString(36).slice(2)+Math.random().toString(36).slice(2)).toUpperCase().slice(0,40);
                            setConnData(d=>({...d,clientId:id,secret:sec}));
                          }} style={{padding:"11px 24px",borderRadius:9,border:"none",background:"linear-gradient(135deg,#0070F3,#0055CC)",color:"#FFFFFF",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit",boxShadow:"0 4px 14px rgba(0,112,243,0.3)"}}>
                            ⚡ Generate API Credentials →
                          </button>
                        )}
                      </div>
                    )}
                    {connStep===1&&(
                      <div>
                        <div style={{fontSize:14,fontWeight:700,color:"rgba(255,255,255,0.85)",marginBottom:6}}>Step 2 — {activeInt.setupSteps[1]}</div>
                        <div style={{fontSize:12,color:"rgba(255,255,255,0.45)",marginBottom:16}}>Enter the credentials in {activeInt.name}, then provide the tenant URL and webhook endpoint below.</div>
                        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}} className="mob-grid1">
                          {[{l:"Client ID",v:connData.clientId,ro:true},{l:"Client Secret",v:connData.secret,ro:true,pw:true}].map((f,fi)=>(
                            <div key={fi}>
                              <div style={{fontSize:10,fontWeight:600,color:"rgba(255,255,255,0.5)",marginBottom:4}}>{f.l}</div>
                              <input type={f.pw?"password":"text"} value={f.v||""} readOnly={f.ro} style={{width:"100%",padding:"8px 11px",border:"1px solid rgba(255,255,255,0.1)",borderRadius:8,fontSize:11,fontFamily:"monospace",color:"rgba(255,255,255,0.6)",background:"rgba(255,255,255,0.05)",boxSizing:"border-box"}}/>
                            </div>
                          ))}
                        </div>
                        <div style={{marginBottom:10}}>
                          <div style={{fontSize:10,fontWeight:600,color:"rgba(255,255,255,0.5)",marginBottom:4}}>{activeInt.name} Tenant URL</div>
                          <input placeholder={"e.g. https://your-company."+activeInt.id+".com"} value={connData.tenantUrl||""} onChange={e=>setConnData(d=>({...d,tenantUrl:e.target.value}))}
                            style={{width:"100%",padding:"8px 11px",border:"1px solid rgba(255,255,255,0.1)",borderRadius:8,fontSize:13,color:"rgba(255,255,255,0.85)",background:"rgba(255,255,255,0.05)",fontFamily:"inherit",outline:"none",boxSizing:"border-box"}}
                            onFocus={e=>e.target.style.borderColor="#0070F3"} onBlur={e=>e.target.style.borderColor="rgba(255,255,255,0.1)"}/>
                        </div>
                        <div>
                          <div style={{fontSize:10,fontWeight:600,color:"rgba(255,255,255,0.5)",marginBottom:4}}>CapabilityOS Webhook URL <span style={{color:"rgba(255,255,255,0.3)",fontWeight:400}}>(paste into {activeInt.name})</span></div>
                          <div style={{display:"flex",alignItems:"center",gap:8}}>
                            <code style={{flex:1,fontSize:11,color:"#5AC8FA",background:"rgba(0,0,0,0.3)",padding:"8px 11px",borderRadius:8,border:"1px solid rgba(255,255,255,0.08)",wordBreak:"break-all"}}>{"https://api.capabilityos.io/webhook/"+activeInt.id+"/"+(connData.clientId||"<client-id>").toLowerCase()}</code>
                            <button onClick={()=>{try{navigator.clipboard.writeText("https://api.capabilityos.io/webhook/"+activeInt.id+"/"+( connData.clientId||"").toLowerCase());}catch(e){}}} style={{padding:"7px 11px",borderRadius:7,border:"1px solid rgba(255,255,255,0.12)",background:"rgba(255,255,255,0.07)",fontSize:10,fontWeight:600,color:"rgba(255,255,255,0.6)",cursor:"pointer",fontFamily:"inherit",whiteSpace:"nowrap"}}>Copy</button>
                          </div>
                        </div>
                      </div>
                    )}
                    {connStep===2&&(
                      <div>
                        <div style={{fontSize:14,fontWeight:700,color:"rgba(255,255,255,0.85)",marginBottom:6}}>Step 3 — {activeInt.setupSteps[2]}</div>
                        <div style={{fontSize:12,color:"rgba(255,255,255,0.45)",marginBottom:16}}>Map each CapabilityOS role to the corresponding role code in {activeInt.name}.</div>
                        <div style={{background:"rgba(255,255,255,0.04)",borderRadius:9,overflow:"hidden",border:"1px solid rgba(255,255,255,0.07)"}}>
                          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",padding:"7px 14px",borderBottom:"1px solid rgba(255,255,255,0.07)"}}>
                            <div style={{fontSize:9,fontWeight:700,color:"rgba(255,255,255,0.3)",textTransform:"uppercase",letterSpacing:".07em"}}>CapabilityOS Role</div>
                            <div style={{fontSize:9,fontWeight:700,color:"rgba(255,255,255,0.3)",textTransform:"uppercase",letterSpacing:".07em"}}>{activeInt.name} Code</div>
                          </div>
                          {GARTNER_TIERS.filter(t=>t.id!=="facilitator").map((r,ri)=>(
                            <div key={ri} style={{display:"grid",gridTemplateColumns:"1fr 1fr",padding:"9px 14px",borderBottom:ri<GARTNER_TIERS.length-2?"1px solid rgba(255,255,255,0.04)":"none",alignItems:"center"}}>
                              <div style={{fontSize:12,fontWeight:500,color:"rgba(255,255,255,0.7)"}}>{r.label}</div>
                              <input placeholder={"e.g. "+r.id.toUpperCase()+"_L"+(ri+1)} value={connData["map_"+r.id]||""} onChange={e=>setConnData(d=>({...d,["map_"+r.id]:e.target.value}))}
                                style={{padding:"5px 9px",border:"1px solid rgba(255,255,255,0.1)",borderRadius:7,fontSize:11,fontFamily:"monospace",color:"rgba(255,255,255,0.8)",background:"rgba(255,255,255,0.05)",outline:"none"}}
                                onFocus={e=>e.target.style.borderColor="#0070F3"} onBlur={e=>e.target.style.borderColor="rgba(255,255,255,0.1)"}/>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {connStep===3&&(
                      <div>
                        <div style={{fontSize:14,fontWeight:700,color:"rgba(255,255,255,0.85)",marginBottom:6}}>Step 4 — {activeInt.setupSteps[3]}</div>
                        <div style={{fontSize:12,color:"rgba(255,255,255,0.45)",marginBottom:16}}>Enable data sync features and configure sync frequency.</div>
                        {[{key:"syncEnabled",label:"Enable data sync",desc:"Push completion data to "+activeInt.name,def:true},{key:"xapiEnabled",label:"Enable xAPI tracking",desc:"Send xAPI statements to "+activeInt.name+" LRS",def:true},{key:"ssoEnabled",label:"Single Sign-On",desc:"Authenticate via "+activeInt.name+" identity provider",def:false},{key:"autoEnroll",label:"Auto-enrolment",desc:"Automatically enrol new "+activeInt.name+" users",def:false}].map((s,si)=>(
                          <div key={si} onClick={()=>setConnData(d=>({...d,[s.key]:!(d[s.key]!==undefined?d[s.key]:s.def)}))} role="button" tabIndex={0} onKeyDown={e=>{if(e.key==="Enter"||e.key===" ")setConnData(d=>({...d,[s.key]:!(d[s.key]!==undefined?d[s.key]:s.def)}));}}
                            style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"11px 14px",border:"1px solid rgba(255,255,255,0.07)",borderRadius:9,marginBottom:7,cursor:"pointer",background:"rgba(255,255,255,0.03)"}}>
                            <div>
                              <div style={{fontSize:12,fontWeight:600,color:"rgba(255,255,255,0.8)"}}>{s.label}</div>
                              <div style={{fontSize:10,color:"rgba(255,255,255,0.35)",marginTop:2}}>{s.desc}</div>
                            </div>
                            <div style={{width:40,height:22,borderRadius:11,position:"relative",flexShrink:0,transition:"background .2s",background:(connData[s.key]!==undefined?connData[s.key]:s.def)?"#0070F3":"rgba(255,255,255,0.1)"}}>
                              <div style={{width:18,height:18,borderRadius:"50%",background:"#FFFFFF",position:"absolute",top:2,transition:"left .2s",boxShadow:"0 1px 4px rgba(0,0,0,0.4)",left:(connData[s.key]!==undefined?connData[s.key]:s.def)?20:2}}/>
                            </div>
                          </div>
                        ))}
                        <div style={{marginTop:12}}>
                          <div style={{fontSize:10,fontWeight:600,color:"rgba(255,255,255,0.5)",marginBottom:5}}>Sync Frequency</div>
                          <select value={connData.syncFreq||"daily"} onChange={e=>setConnData(d=>({...d,syncFreq:e.target.value}))}
                            style={{padding:"8px 12px",border:"1px solid rgba(255,255,255,0.1)",borderRadius:8,fontSize:12,color:"rgba(255,255,255,0.8)",fontFamily:"inherit",background:"rgba(255,255,255,0.06)",width:200,outline:"none"}}>
                            <option value="realtime">Real-time</option>
                            <option value="hourly">Hourly</option>
                            <option value="daily">Daily (recommended)</option>
                            <option value="weekly">Weekly</option>
                          </select>
                        </div>
                      </div>
                    )}
                    {connStep===4&&(
                      <div>
                        <div style={{fontSize:14,fontWeight:700,color:"rgba(255,255,255,0.85)",marginBottom:6}}>Step 5 — {activeInt.setupSteps[4]}</div>
                        <div style={{fontSize:12,color:"rgba(255,255,255,0.45)",marginBottom:18}}>Run a test sync to verify the connection. A test record will be sent and confirmed.</div>
                        {testResult===null&&(
                          <button onClick={()=>{setTestResult("running");setTimeout(()=>setTestResult("success"),2600);}}
                            style={{padding:"11px 26px",borderRadius:9,border:"none",background:"linear-gradient(135deg,#0070F3,#0055CC)",color:"#FFFFFF",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit",boxShadow:"0 4px 14px rgba(0,112,243,0.3)"}}>
                            ▶ Run Test Sync
                          </button>
                        )}
                        {testResult==="running"&&(
                          <div style={{display:"flex",flexDirection:"column",gap:7}}>
                            {["Authenticating with "+activeInt.name+"...","Sending test xAPI statement...","Verifying response payload...","Checking data integrity..."].map((msg,i)=>(
                              <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"9px 14px",background:"rgba(255,255,255,0.04)",borderRadius:8,border:"1px solid rgba(255,255,255,0.07)"}}>
                                <div style={{width:14,height:14,border:"2px solid rgba(255,255,255,0.1)",borderTopColor:"#0070F3",borderRadius:"50%",animation:"spin 0.8s linear infinite",flexShrink:0}}/>
                                <span style={{fontSize:12,color:"rgba(255,255,255,0.55)"}}>{msg}</span>
                              </div>
                            ))}
                          </div>
                        )}
                        {testResult==="success"&&(
                          <div>
                            <div style={{padding:"16px 18px",background:"rgba(52,199,89,0.07)",border:"1.5px solid rgba(52,199,89,0.2)",borderRadius:10,marginBottom:12}}>
                              <div style={{fontSize:13,fontWeight:700,color:"#34C759",marginBottom:8}}>✓ Connection Successful</div>
                              {[{l:"Authentication",v:"OAuth 2.0 · Token valid"},{l:"xAPI Endpoint",v:"200 OK · 38ms response"},{l:"Test Record",v:"1 completion sent & confirmed"},{l:"Data Integrity",v:"All fields validated"},{l:"Sync Frequency",v:(connData.syncFreq||"daily")+" sync configured"}].map((row,i)=>(
                                <div key={i} style={{display:"flex",justifyContent:"space-between",fontSize:11,padding:"5px 0",borderBottom:i<4?"1px solid rgba(52,199,89,0.08)":"none"}}>
                                  <span style={{color:"rgba(255,255,255,0.55)",fontWeight:500}}>{row.l}</span>
                                  <span style={{color:"#34C759",fontWeight:600}}>{row.v}</span>
                                </div>
                              ))}
                            </div>
                            <div style={{fontSize:11,color:"rgba(255,255,255,0.35)"}}>Integration is live. Data will sync on your configured schedule.</div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  {/* Wizard nav */}
                  <div style={{padding:"12px 24px",borderTop:"1px solid rgba(255,255,255,0.07)",background:"rgba(255,255,255,0.03)",display:"flex",gap:10,justifyContent:"space-between",alignItems:"center"}}>
                    <span style={{fontSize:11,color:"rgba(255,255,255,0.3)"}}>Step {connStep+1} of {activeInt.setupSteps.length}</span>
                    <div style={{display:"flex",gap:8}}>
                      {connStep>0&&<button onClick={()=>setConnStep(s=>s-1)} style={{padding:"8px 16px",borderRadius:8,border:"1px solid rgba(255,255,255,0.12)",background:"transparent",color:"rgba(255,255,255,0.6)",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>← Back</button>}
                      {connStep<activeInt.setupSteps.length-1?(
                        <button onClick={()=>{
                          if(connStep===0&&!connData.clientId){alert("Please generate API credentials first.");return;}
                          setConnStep(s=>s+1);
                        }} style={{padding:"8px 20px",borderRadius:8,border:"none",background:"linear-gradient(135deg,#0070F3,#0055CC)",color:"#FFFFFF",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>
                          Next →
                        </button>
                      ):testResult==="success"?(
                        <button onClick={()=>{setActiveInt(null);setConnStep(0);setTestResult(null);}} style={{padding:"8px 20px",borderRadius:8,border:"1px solid rgba(52,199,89,0.3)",background:"rgba(52,199,89,0.12)",color:"#34C759",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>
                          ✓ Complete Setup
                        </button>
                      ):(
                        <button disabled={testResult==="running"} onClick={()=>{setTestResult("running");setTimeout(()=>setTestResult("success"),2600);}}
                          style={{padding:"8px 20px",borderRadius:8,border:"none",background:testResult==="running"?"rgba(255,255,255,0.06)":"linear-gradient(135deg,#0070F3,#0055CC)",color:testResult==="running"?"rgba(255,255,255,0.3)":"#FFFFFF",fontSize:12,fontWeight:700,cursor:testResult==="running"?"not-allowed":"pointer",fontFamily:"inherit"}}>
                          {testResult==="running"?"Testing...":"Run Test Sync"}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Integration grid */}
              <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10}} className="mob-grid1">
                {INTEGRATIONS.map(itg=>{
                  const isAct=activeInt?.id===itg.id;
                  return(
                    <div key={itg.id} onClick={()=>{setActiveInt(isAct?null:itg);setConnStep(0);setTestResult(null);setConnData({});}} role="button" tabIndex={0} onKeyDown={e=>{if(e.key==="Enter"||e.key===" "){setActiveInt(isAct?null:itg);setConnStep(0);setTestResult(null);setConnData({});}}}
                      style={{background:"rgba(255,255,255,0.04)",borderRadius:10,padding:"14px 16px",cursor:"pointer",border:"1.5px solid "+(isAct?"#0070F3":"rgba(255,255,255,0.07)"),boxShadow:isAct?"0 0 0 3px rgba(0,112,243,0.12)":"none",transition:"all 160ms ease"}}
                      onMouseEnter={e=>{if(!isAct){e.currentTarget.style.border="1px solid rgba(255,255,255,0.18)";e.currentTarget.style.transform="translateY(-1px)";}}}
                      onMouseLeave={e=>{if(!isAct){e.currentTarget.style.border="1.5px solid rgba(255,255,255,0.07)";e.currentTarget.style.transform="none";}}}>
                      <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:8}}>
                        <div style={{display:"flex",alignItems:"center",gap:9}}>
                          <div style={{fontSize:20}}>{itg.emoji}</div>
                          <div>
                            <div style={{fontSize:12,fontWeight:700,color:"rgba(255,255,255,0.85)"}}>{itg.name}</div>
                            <div style={{fontSize:9,color:"rgba(255,255,255,0.3)",marginTop:1}}>{itg.type}</div>
                          </div>
                        </div>
                        <span style={{fontSize:9,fontWeight:700,padding:"2px 7px",borderRadius:20,background:STATUS_BG[itg.status],color:STATUS_COLOR[itg.status],flexShrink:0}}>{itg.status}</span>
                      </div>
                      <div style={{fontSize:9,color:"rgba(255,255,255,0.25)",marginBottom:7,fontFamily:"monospace"}}>{itg.protocol}</div>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                        <span style={{fontSize:10,color:itg.lastSync?"#34C759":"rgba(255,255,255,0.3)"}}>{itg.lastSync?"↻ "+itg.lastSync:"Not connected"}</span>
                        <span style={{fontSize:11,fontWeight:700,color:isAct?"#FF3B30":"#5AC8FA"}}>{isAct?"Close ×":"Configure →"}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div style={{marginTop:12,padding:"11px 14px",background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:9}}>
                <div style={{fontSize:10,fontWeight:700,color:"rgba(255,255,255,0.4)",marginBottom:2}}>Supported Standards</div>
                <div style={{fontSize:10,color:"rgba(255,255,255,0.25)"}}>xAPI 1.0/2.0 · SCORM 2004/1.2 · LTI 1.3 · SAML 2.0 / OAuth 2.0 · REST API (OpenAPI 3.0) · POPIA compliant</div>
              </div>
            </div>
          </div>)}


          {/* ─── ORG SETUP ────────────────────────────────────────────────────── */}
          {tab==="orgsetup"&&(
            <div className="fade-in" style={{overflowY:"auto",flex:1,padding:"0 0 40px"}}>
              <div style={{background:"linear-gradient(135deg,#0A1828,#0D2040)",padding:"22px 28px",borderBottom:"1px solid rgba(255,255,255,0.06)"}}>
                <div style={{fontSize:11,fontWeight:700,color:"#0070F3",textTransform:"uppercase",letterSpacing:".1em",marginBottom:6}}>Organisation Setup</div>
                <div style={{fontSize:20,fontWeight:800,color:"#FFF",marginBottom:4}}>Enterprise Configuration</div>
                <div style={{fontSize:12,color:"rgba(255,255,255,0.45)"}}>Configure your organisation profile, AI maturity baseline and strategic context. This drives personalisation across the platform.</div>
              </div>
              <div style={{padding:"20px 28px",display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}} className="mob-grid1">
                <div style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:12,padding:"20px 22px"}}>
                  <div style={{fontSize:11,fontWeight:700,color:"#5AC8FA",textTransform:"uppercase",letterSpacing:".09em",marginBottom:14}}>Organisation Profile</div>
                  {[["Organisation Name",DEMO_ORG.name],["Industry",DEMO_ORG.industry],["Employee Count",DEMO_ORG.employeeCount.toLocaleString()],["AI Maturity",DEMO_ORG.aiMaturity],["Geographies",DEMO_ORG.geographies.join(", ")]].map(function(row,i){return(
                    <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"9px 0",borderBottom:"1px solid rgba(255,255,255,0.05)",alignItems:"flex-start",gap:12}}>
                      <div style={{fontSize:12,color:"rgba(255,255,255,0.45)",flexShrink:0}}>{row[0]}</div>
                      <div style={{fontSize:12,fontWeight:600,color:"rgba(255,255,255,0.85)",textAlign:"right"}}>{row[1]}</div>
                    </div>
                  );},this)}
                </div>
                <div style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:12,padding:"20px 22px"}}>
                  <div style={{fontSize:11,fontWeight:700,color:"#5AC8FA",textTransform:"uppercase",letterSpacing:".09em",marginBottom:14}}>Readiness Overview</div>
                  {[["Enterprise Readiness",DEMO_ORG.readinessScore],["AI Readiness",DEMO_ORG.aiReadiness],["Digital Maturity",DEMO_ORG.digitalMaturity],["Workforce Risk",DEMO_ORG.workforceRisk]].map(function(item,i){return(
                    <div key={i} style={{marginBottom:14}}>
                      <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
                        <span style={{fontSize:12,color:"rgba(255,255,255,0.55)"}}>{item[0]}</span>
                        <span style={{fontSize:13,fontWeight:800,color:item[1]>=60?"#34C759":item[1]>=40?"#FF9500":"#FF3B30"}}>{item[1]}/100</span>
                      </div>
                      <div style={{height:5,background:"rgba(255,255,255,0.07)",borderRadius:3}}>
                        <div style={{width:item[1]+"%",height:"100%",borderRadius:3,background:item[1]>=60?"#34C759":item[1]>=40?"#FF9500":"#FF3B30"}}/>
                      </div>
                    </div>
                  );},this)}
                </div>
                <div style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:12,padding:"20px 22px"}}>
                  <div style={{fontSize:11,fontWeight:700,color:"#E8B84B",textTransform:"uppercase",letterSpacing:".09em",marginBottom:14}}>Strategic Priorities</div>
                  {DEMO_ORG.strategicPriorities.map(function(p,i){return(
                    <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"7px 0",borderBottom:"1px solid rgba(255,255,255,0.04)"}}>
                      <div style={{width:6,height:6,borderRadius:"50%",background:"#E8B84B",flexShrink:0}}/>
                      <span style={{fontSize:12,color:"rgba(255,255,255,0.75)"}}>{p}</span>
                    </div>
                  );},this)}
                </div>
                <div style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:12,padding:"20px 22px"}}>
                  <div style={{fontSize:11,fontWeight:700,color:"#FF6B35",textTransform:"uppercase",letterSpacing:".09em",marginBottom:14}}>Business Challenges</div>
                  {DEMO_ORG.businessChallenges.map(function(ch,i){return(
                    <div key={i} style={{display:"flex",alignItems:"flex-start",gap:10,padding:"7px 0",borderBottom:"1px solid rgba(255,255,255,0.04)"}}>
                      <div style={{width:6,height:6,borderRadius:"50%",background:"#FF6B35",flexShrink:0,marginTop:5}}/>
                      <span style={{fontSize:12,color:"rgba(255,255,255,0.75)",lineHeight:1.5}}>{ch}</span>
                    </div>
                  );},this)}
                </div>
              </div>
            </div>
          )}

          {/* ─── BUSINESS UNITS ───────────────────────────────────────────────── */}
          {tab==="bizunits"&&(
            <div className="fade-in" style={{overflowY:"auto",flex:1,padding:"0 0 40px"}}>
              <div style={{background:"linear-gradient(135deg,#0A1828,#0D2040)",padding:"22px 28px",borderBottom:"1px solid rgba(255,255,255,0.06)"}}>
                <div style={{fontSize:11,fontWeight:700,color:"#5AC8FA",textTransform:"uppercase",letterSpacing:".1em",marginBottom:6}}>Workforce Intelligence</div>
                <div style={{fontSize:20,fontWeight:800,color:"#FFF",marginBottom:4}}>Business Unit Readiness</div>
                <div style={{fontSize:12,color:"rgba(255,255,255,0.45)"}}>AI and digital capability scores across {DEMO_BUS_UNITS.length} business units. Risk-ranked by capability exposure.</div>
              </div>
              <div style={{padding:"20px 28px"}}>
                <div style={{overflowX:"auto"}}>
                  <table style={{width:"100%",borderCollapse:"collapse",fontSize:12,minWidth:700}}>
                    <thead>
                      <tr style={{borderBottom:"1px solid rgba(255,255,255,0.1)"}}>
                        {["Business Unit","Leader","Staff","AI Readiness","Digital Maturity","Workforce Risk","Top Gap","Status"].map(function(h,i){return(
                          <th key={i} style={{padding:"9px 12px",textAlign:"left",fontSize:10,fontWeight:700,color:"rgba(255,255,255,0.4)",textTransform:"uppercase",letterSpacing:".07em",whiteSpace:"nowrap"}}>{h}</th>
                        );},this)}
                      </tr>
                    </thead>
                    <tbody>
                      {DEMO_BUS_UNITS.map(function(bu,i){
                        var riskCol=bu.risk==="Critical"?"#FF3B30":bu.risk==="High"?"#FF9500":bu.risk==="Medium"?"#E8B84B":"#34C759";
                        var aiCol=bu.aiReadiness>=60?"#34C759":bu.aiReadiness>=40?"#FF9500":"#FF3B30";
                        return(
                          <tr key={bu.id} style={{borderBottom:"1px solid rgba(255,255,255,0.04)",background:i%2===0?"transparent":"rgba(255,255,255,0.02)"}}>
                            <td style={{padding:"10px 12px",fontWeight:600,color:"rgba(255,255,255,0.85)"}}>{bu.name}</td>
                            <td style={{padding:"10px 12px",color:"rgba(255,255,255,0.45)"}}>{bu.leader}</td>
                            <td style={{padding:"10px 12px",color:"rgba(255,255,255,0.55)"}}>{bu.headcount.toLocaleString()}</td>
                            <td style={{padding:"10px 12px"}}>
                              <div style={{display:"flex",alignItems:"center",gap:7}}>
                                <div style={{width:48,height:4,background:"rgba(255,255,255,0.07)",borderRadius:2}}>
                                  <div style={{width:bu.aiReadiness+"%",height:"100%",background:aiCol,borderRadius:2}}/>
                                </div>
                                <span style={{fontSize:11,fontWeight:700,color:aiCol}}>{bu.aiReadiness}%</span>
                              </div>
                            </td>
                            <td style={{padding:"10px 12px"}}>
                              <div style={{display:"flex",alignItems:"center",gap:7}}>
                                <div style={{width:48,height:4,background:"rgba(255,255,255,0.07)",borderRadius:2}}>
                                  <div style={{width:bu.readiness+"%",height:"100%",background:"#5AC8FA",borderRadius:2}}/>
                                </div>
                                <span style={{fontSize:11,fontWeight:700,color:"#5AC8FA"}}>{bu.readiness}%</span>
                              </div>
                            </td>
                            <td style={{padding:"10px 12px"}}>
                              <span style={{fontSize:11,fontWeight:700,padding:"2px 8px",borderRadius:10,background:riskCol+"20",color:riskCol}}>{bu.risk}</span>
                            </td>
                            <td style={{padding:"10px 12px",color:"rgba(255,255,255,0.5)",fontSize:11}}>{bu.gaps[0]}</td>
                            <td style={{padding:"10px 12px"}}>
                              <button style={{fontSize:10,color:"#5AC8FA",background:"rgba(90,200,250,0.1)",border:"1px solid rgba(90,200,250,0.2)",borderRadius:6,padding:"3px 10px",cursor:"pointer",fontFamily:"inherit"}}>Manage</button>
                            </td>
                          </tr>
                        );
                      },this)}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ─── CAPABILITY TAXONOMY ──────────────────────────────────────────── */}
          {tab==="captax"&&(
            <div className="fade-in" style={{overflowY:"auto",flex:1,padding:"0 0 40px"}}>
              <div style={{background:"linear-gradient(135deg,#0A1828,#0D2040)",padding:"22px 28px",borderBottom:"1px solid rgba(255,255,255,0.06)"}}>
                <div style={{fontSize:11,fontWeight:700,color:"#A78BFA",textTransform:"uppercase",letterSpacing:".1em",marginBottom:6}}>Capability Intelligence</div>
                <div style={{fontSize:20,fontWeight:800,color:"#FFF",marginBottom:4}}>Capability Taxonomy</div>
                <div style={{fontSize:12,color:"rgba(255,255,255,0.45)"}}>Enterprise capability inventory. {DEMO_CAPABILITIES.length} capabilities tracked across {[...new Set(DEMO_CAPABILITIES.map(function(x){return x.domain;}))].length} domains.</div>
              </div>
              <div style={{padding:"20px 28px",display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:10}} className="mob-grid1">
                {DEMO_CAPABILITIES.map(function(cap,i){
                  var gapCol=cap.gap>=3?"#FF3B30":cap.gap===2?"#FF9500":"#34C759";
                  var impCol=cap.importance==="Critical"?"#FF3B30":cap.importance==="High"?"#FF9500":"#5AC8FA";
                  return(
                    <div key={cap.id} style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:10,padding:"14px 16px",borderLeft:"3px solid "+gapCol}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                        <div>
                          <div style={{fontSize:13,fontWeight:700,color:"rgba(255,255,255,0.9)",marginBottom:2}}>{cap.name}</div>
                          <div style={{fontSize:11,color:"rgba(255,255,255,0.35)"}}>{cap.domain}</div>
                        </div>
                        <span style={{fontSize:10,fontWeight:700,padding:"2px 8px",borderRadius:8,background:impCol+"20",color:impCol,flexShrink:0}}>{cap.importance}</span>
                      </div>
                      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:8}}>
                        {[["Current",cap.current+"/5","rgba(255,255,255,0.6)"],["Target",cap.target+"/5","#5AC8FA"],["Gap",cap.gap+" levels",gapCol]].map(function(m,mi){return(
                          <div key={mi} style={{textAlign:"center",padding:"6px",background:"rgba(0,0,0,0.2)",borderRadius:6}}>
                            <div style={{fontSize:15,fontWeight:800,color:m[2]}}>{m[1]}</div>
                            <div style={{fontSize:9,color:"rgba(255,255,255,0.35)",textTransform:"uppercase"}}>{m[0]}</div>
                          </div>
                        );},this)}
                      </div>
                      <div style={{display:"flex",justifyContent:"space-between",fontSize:11,color:"rgba(255,255,255,0.35)"}}>
                        <span>Owner: {cap.owner}</span>
                        <span style={{color:gapCol,fontWeight:700}}>Gap: {cap.risk} risk</span>
                      </div>
                    </div>
                  );
                },this)}
              </div>
            </div>
          )}

          {/* ─── CAPABILITY MAP ───────────────────────────────────────────────── */}
          {tab==="capmap"&&<CapabilityMapView/>}

          {/* ─── STRATEGIC WORKFORCE PLAN ─────────────────────────────────────── */}
          {tab==="workforceplan"&&<StrategicWorkforceView/>}

          {/* ─── AI READINESS DIAGNOSTIC ──────────────────────────────────────── */}
          {tab==="aireadiness"&&<AIReadinessView/>}

          {/* ─── INTERVENTION PLANNER ─────────────────────────────────────────── */}
          {tab==="intervention"&&(
            <div className="fade-in" style={{overflowY:"auto",flex:1,padding:"0 0 40px"}}>
              <div style={{background:"linear-gradient(135deg,#0A1828,#0D2040)",padding:"22px 28px",borderBottom:"1px solid rgba(255,255,255,0.06)"}}>
                <div style={{fontSize:11,fontWeight:700,color:"#34C759",textTransform:"uppercase",letterSpacing:".1em",marginBottom:6}}>Transformation Engine</div>
                <div style={{fontSize:20,fontWeight:800,color:"#FFF",marginBottom:4}}>Intervention Planner</div>
                <div style={{fontSize:12,color:"rgba(255,255,255,0.45)"}}>Recommended reskilling and capability interventions. {DEMO_INTERVENTIONS.length} interventions identified across {DEMO_ORG.name}.</div>
              </div>
              <div style={{padding:"20px 28px",display:"flex",flexDirection:"column",gap:10}}>
                {DEMO_INTERVENTIONS.map(function(inv,i){
                  var pCol=inv.priority==="Critical"?"#FF3B30":inv.priority==="High"?"#FF9500":inv.priority==="Medium"?"#E8B84B":"#34C759";
                  var sCol=inv.status==="In Progress"?"#34C759":inv.status==="Approved"?"#5AC8FA":inv.status==="Proposed"?"#A78BFA":"#8B97B5";
                  return(
                    <div key={inv.id} style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:12,padding:"16px 18px"}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10,flexWrap:"wrap",gap:8}}>
                        <div style={{flex:1}}>
                          <div style={{display:"flex",gap:7,marginBottom:6,flexWrap:"wrap"}}>
                            <span style={{fontSize:10,fontWeight:700,padding:"2px 8px",borderRadius:8,background:pCol+"20",color:pCol}}>{inv.priority}</span>
                            <span style={{fontSize:10,padding:"2px 8px",borderRadius:8,background:sCol+"18",color:sCol}}>{inv.status}</span>
                            <span style={{fontSize:10,color:"rgba(255,255,255,0.35)",background:"rgba(255,255,255,0.07)",padding:"2px 8px",borderRadius:8}}>{inv.type}</span>
                          </div>
                          <div style={{fontSize:14,fontWeight:700,color:"rgba(255,255,255,0.9)",marginBottom:3}}>{inv.title}</div>
                          <div style={{fontSize:11,color:"rgba(255,255,255,0.45)"}}>{inv.audience} · {inv.duration}</div>
                        </div>
                        <button style={{fontSize:11,color:"#5AC8FA",background:"rgba(90,200,250,0.1)",border:"1px solid rgba(90,200,250,0.2)",borderRadius:8,padding:"5px 14px",cursor:"pointer",fontFamily:"inherit",flexShrink:0}}>Assign</button>
                      </div>
                      <div style={{fontSize:12,color:"rgba(255,255,255,0.55)",lineHeight:1.55,marginBottom:8}}>{inv.outcomes}</div>
                      <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                        {inv.gaps.map(function(g,gi){return(
                          <span key={gi} style={{fontSize:10,color:"rgba(255,255,255,0.4)",background:"rgba(255,255,255,0.06)",padding:"2px 8px",borderRadius:10}}>{g}</span>
                        );},this)}
                      </div>
                    </div>
                  );
                },this)}
              </div>
            </div>
          )}

          {/* ─── REPORTS ──────────────────────────────────────────────────────── */}
          {tab==="reports"&&(
            <div className="fade-in" style={{overflowY:"auto",flex:1,padding:"0 0 40px"}}>
              <div style={{background:"linear-gradient(135deg,#0A1828,#0D2040)",padding:"22px 28px",borderBottom:"1px solid rgba(255,255,255,0.06)"}}>
                <div style={{fontSize:11,fontWeight:700,color:"#E8B84B",textTransform:"uppercase",letterSpacing:".1em",marginBottom:6}}>Executive Intelligence</div>
                <div style={{fontSize:20,fontWeight:800,color:"#FFF",marginBottom:4}}>Reports & ExCo Packs</div>
                <div style={{fontSize:12,color:"rgba(255,255,255,0.45)"}}>Board-ready workforce intelligence reports. Download or preview for CHRO, CEO, CRO and Board audiences.</div>
              </div>
              <div style={{padding:"20px 28px",display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:12}} className="mob-grid1">
                {DEMO_REPORTS.map(function(rep,i){
                  var sCol=rep.status==="Ready"?"#34C759":rep.status==="Draft"?"#FF9500":"#8B97B5";
                  return(
                    <div key={rep.id} style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:12,padding:"16px 18px",display:"flex",flexDirection:"column",gap:10}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:8}}>
                        <div style={{flex:1}}>
                          <span style={{fontSize:10,fontWeight:700,padding:"2px 8px",borderRadius:8,background:sCol+"20",color:sCol,marginBottom:7,display:"inline-block"}}>{rep.status}</span>
                          <div style={{fontSize:13,fontWeight:700,color:"rgba(255,255,255,0.9)",lineHeight:1.35,marginBottom:4}}>{rep.title}</div>
                          <div style={{fontSize:11,color:"rgba(255,255,255,0.4)",marginBottom:6}}>For: {rep.audience}</div>
                          <div style={{fontSize:11,color:"rgba(255,255,255,0.5)",lineHeight:1.5}}>{rep.summary}</div>
                        </div>
                      </div>
                      <div style={{display:"flex",gap:7,marginTop:"auto"}}>
                        <button style={{flex:1,fontSize:11,fontWeight:600,color:"rgba(255,255,255,0.7)",background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:7,padding:"6px 0",cursor:"pointer",fontFamily:"inherit"}}>Preview</button>
                        <button style={{flex:1,fontSize:11,fontWeight:700,color:"#FFF",background:"linear-gradient(135deg,#0070F3,#0055CC)",border:"none",borderRadius:7,padding:"6px 0",cursor:"pointer",fontFamily:"inherit"}}>Download</button>
                      </div>
                      <div style={{fontSize:10,color:"rgba(255,255,255,0.25)"}}>Generated: {rep.generated}</div>
                    </div>
                  );
                },this)}
              </div>
            </div>
          )}

          {/* ─── GOVERNANCE & RISK ────────────────────────────────────────────── */}
          {tab==="govrisk"&&(
            <div className="fade-in" style={{overflowY:"auto",flex:1,padding:"0 0 40px"}}>
              <div style={{background:"linear-gradient(135deg,#0A1828,#0D2040)",padding:"22px 28px",borderBottom:"1px solid rgba(255,255,255,0.06)"}}>
                <div style={{fontSize:11,fontWeight:700,color:"#FF6B35",textTransform:"uppercase",letterSpacing:".1em",marginBottom:6}}>AI Governance</div>
                <div style={{fontSize:20,fontWeight:800,color:"#FFF",marginBottom:4}}>Governance & Risk</div>
                <div style={{fontSize:12,color:"rgba(255,255,255,0.45)"}}>Enterprise AI governance maturity and workforce risk intelligence. POPIA, responsible AI and compliance coverage.</div>
              </div>
              <div style={{padding:"20px 28px"}}>
                <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:20}} className="mob-grid1">
                  {[["Overall Gov. Maturity",Math.round(DEMO_GOV_RISKS.reduce(function(a,g){return a+g.score;},0)/DEMO_GOV_RISKS.length),"#FF6B35"],["Avg Coverage",Math.round(DEMO_GOV_RISKS.reduce(function(a,g){return a+g.coverage;},0)/DEMO_GOV_RISKS.length)+"%","#FF9500"],["Critical Gaps",DEMO_GOV_RISKS.filter(function(g){return g.level==="Critical";}).length+" domains","#FF3B30"]].map(function(kpi,i){return(
                    <div key={i} style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba("+kpi[2].slice(1).match(/../g).map(function(x){return parseInt(x,16);}).join(",")+",0.2)",borderRadius:10,padding:"14px 16px",textAlign:"center"}}>
                      <div style={{fontSize:26,fontWeight:800,color:kpi[2],marginBottom:3}}>{kpi[1]}</div>
                      <div style={{fontSize:11,color:"rgba(255,255,255,0.45)"}}>{kpi[0]}</div>
                    </div>
                  );},this)}
                </div>
                <div style={{display:"flex",flexDirection:"column",gap:9}}>
                  {DEMO_GOV_RISKS.map(function(gr,i){
                    var lCol=gr.level==="Critical"?"#FF3B30":gr.level==="High"?"#FF9500":gr.level==="Medium"?"#E8B84B":"#34C759";
                    return(
                      <div key={gr.id} style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:10,padding:"13px 16px"}}>
                        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8,flexWrap:"wrap"}}>
                          <span style={{fontSize:11,fontWeight:700,padding:"2px 8px",borderRadius:8,background:lCol+"20",color:lCol}}>{gr.level}</span>
                          <span style={{fontSize:13,fontWeight:700,color:"rgba(255,255,255,0.85)",flex:1}}>{gr.domain}</span>
                          <span style={{fontSize:12,fontWeight:800,color:gr.score>=60?"#34C759":gr.score>=40?"#FF9500":"#FF3B30"}}>{gr.score}/100</span>
                        </div>
                        <div style={{height:4,background:"rgba(255,255,255,0.07)",borderRadius:2,marginBottom:8}}>
                          <div style={{width:gr.score+"%",height:"100%",background:gr.score>=60?"#34C759":gr.score>=40?"#FF9500":"#FF3B30",borderRadius:2}}/>
                        </div>
                        <div style={{fontSize:11,color:"rgba(255,255,255,0.45)",lineHeight:1.5}}>{gr.desc}</div>
                        <div style={{marginTop:6,fontSize:10,color:"rgba(255,255,255,0.3)"}}>Training coverage: {gr.coverage}% · Target: {gr.target}/100</div>
                      </div>
                    );
                  },this)}
                </div>
              </div>
            </div>
          )}

          {/* ─── PLATFORM HEALTH (System Analyst) ────────────────────────────── */}
          {tab==="syshealth"&&(
            <PlatformAnalyst/>
          )}

          {/* ─── AUDIT LOGS ────────────────────────────────────────────────────── */}
          {tab==="auditlogs"&&(
            <div className="fade-in" style={{overflowY:"auto",flex:1,padding:"0 0 40px"}}>
              <div style={{background:"linear-gradient(135deg,#0A1828,#0D2040)",padding:"22px 28px",borderBottom:"1px solid rgba(255,255,255,0.06)"}}>
                <div style={{fontSize:11,fontWeight:700,color:"#8B97B5",textTransform:"uppercase",letterSpacing:".1em",marginBottom:6}}>Compliance & Security</div>
                <div style={{fontSize:20,fontWeight:800,color:"#FFF",marginBottom:4}}>Audit Logs</div>
                <div style={{fontSize:12,color:"rgba(255,255,255,0.45)"}}>Complete audit trail of admin actions, learner events, system operations and access control events.</div>
              </div>
              <div style={{padding:"20px 28px"}}>
                <div style={{overflowX:"auto"}}>
                  <table style={{width:"100%",borderCollapse:"collapse",fontSize:12,minWidth:700}}>
                    <thead>
                      <tr style={{borderBottom:"1px solid rgba(255,255,255,0.1)"}}>
                        {["Severity","User","Action","Portal","Page","Timestamp","Status"].map(function(h,i){return(
                          <th key={i} style={{padding:"9px 12px",textAlign:"left",fontSize:10,fontWeight:700,color:"rgba(255,255,255,0.4)",textTransform:"uppercase",letterSpacing:".07em",whiteSpace:"nowrap"}}>{h}</th>
                        );},this)}
                      </tr>
                    </thead>
                    <tbody>
                      {DEMO_AUDIT_EVENTS.map(function(ev,i){
                        var sCol=ev.severity==="Critical"?"#FF3B30":ev.severity==="Warning"?"#FF9500":"#5AC8FA";
                        var stCol=ev.status==="Success"?"#34C759":ev.status==="Failed"||ev.status==="Blocked"?"#FF3B30":ev.status==="Partial"?"#FF9500":"#5AC8FA";
                        return(
                          <tr key={ev.id} style={{borderBottom:"1px solid rgba(255,255,255,0.04)",background:i%2===0?"transparent":"rgba(255,255,255,0.02)"}}>
                            <td style={{padding:"9px 12px"}}><span style={{fontSize:10,fontWeight:700,padding:"2px 7px",borderRadius:8,background:sCol+"20",color:sCol}}>{ev.severity}</span></td>
                            <td style={{padding:"9px 12px",color:"rgba(255,255,255,0.7)",fontWeight:500}}>{ev.user}</td>
                            <td style={{padding:"9px 12px",color:"rgba(255,255,255,0.6)"}}>{ev.action}</td>
                            <td style={{padding:"9px 12px",color:"rgba(255,255,255,0.4)"}}>{ev.portal}</td>
                            <td style={{padding:"9px 12px",color:"rgba(255,255,255,0.4)"}}>{ev.page}</td>
                            <td style={{padding:"9px 12px",color:"rgba(255,255,255,0.35)",fontFamily:"monospace",fontSize:11}}>{ev.ts}</td>
                            <td style={{padding:"9px 12px"}}><span style={{fontSize:10,fontWeight:700,padding:"2px 7px",borderRadius:8,background:stCol+"18",color:stCol}}>{ev.status}</span></td>
                          </tr>
                        );
                      },this)}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}



// ─── PropTypes ────────────────────────────────────────────────────────────────
SvgRadar.propTypes={data:PT.array.isRequired,size:PT.number};
// Badge.propTypes and ProgressBar.propTypes now declared in ./ui/Badge.jsx and ./ui/ProgressBar.jsx.
DailyBriefing.propTypes={role:PT.string,userFn:PT.string,industry:PT.string,xp:PT.number};
DailyChallenge.propTypes={progress:PT.object,completedToday:PT.bool,onComplete:PT.func,xp:PT.number};
AuthScreen.propTypes={onLogin:PT.func.isRequired};
// Toast.propTypes now declared in ./ui/Toast.jsx.
Sidebar.propTypes={role:PT.string,view:PT.string,onNav:PT.func.isRequired,user:PT.object,xp:PT.number,industry:PT.string,userFn:PT.string};
Header.propTypes={title:PT.string,xp:PT.number,streak:PT.number,onNav:PT.func.isRequired};
LDashboard.propTypes={user:PT.object,userFn:PT.string,xp:PT.number,badges:PT.array,streak:PT.number,board:PT.array,progress:PT.object,industry:PT.string,onNav:PT.func.isRequired,dailyDone:PT.bool,onDailyComplete:PT.func};
TierDetail.propTypes={tier:PT.object,progress:PT.object,notes:PT.object,industry:PT.string,onNav:PT.func};
Quiz.propTypes={mod:PT.object,industry:PT.string,onXp:PT.func};
ModuleReader.propTypes={tier:PT.object,mod:PT.object,idx:PT.number,progress:PT.object,notes:PT.object,industry:PT.string,userFn:PT.string,role:PT.string,onComplete:PT.func,onQuizXp:PT.func,onNav:PT.func};
AchievementsView.propTypes={xp:PT.number,badges:PT.array,streak:PT.number,role:PT.string};
CertView.propTypes={tier:PT.object,name:PT.string,xp:PT.number,onNav:PT.func};
ReadinessAssessment.propTypes={role:PT.string,userFn:PT.string,subFn:PT.string,industry:PT.string,xp:PT.number,onNav:PT.func};
MissionsView.propTypes={progress:PT.object,badges:PT.array,streak:PT.number,xp:PT.number,onNav:PT.func};
UseCaseLibrary.propTypes={industry:PT.string,userFn:PT.string,role:PT.string,onNav:PT.func};
RecommendationRail.propTypes={role:PT.string,industry:PT.string,userFn:PT.string,progress:PT.object,xp:PT.number,onNav:PT.func};
PromptLab.propTypes={industry:PT.string,userFn:PT.string,role:PT.string};
ContextStrip.propTypes={user:PT.object,industry:PT.string,userFn:PT.string,subFn:PT.string,xp:PT.number};
IntelligenceTab.propTypes={all:PT.array,avgLP:PT.number,active:PT.number};
ContentGovernanceView.propTypes={onSaveNote:PT.func.isRequired};
FacilDash.propTypes={user:PT.object,notes:PT.object,onSaveNote:PT.func,board:PT.array};

// ─── App ─────────────────────────────────────────────────────────────────────
/** Root application component — manages auth state, global XP/progress, and renders either the learner or facilitator portal. @returns {JSX.Element} */
export default function App(){
  const [screen,setScreen]=useState("login");
  const [user,setUser]=useState(null);
  const [industry,setIndustry]=useState("");
  const [userFn,setUserFn]=useState("");
  const [subFn,setSubFn]=useState("");
  const [prog,setProg]=useState({});
  const [xp,setXp]=useState(0);
  const [bdgs,setBdgs]=useState([]);
  const [perfQ,setPerfQ]=useState(0);
  const [streak,setStreak]=useState(0);
  const [board,setBoard]=useState([]);
  const [notes,setNotes]=useState({});
  const [notif,setNotif]=useState(null);
  const [dailyDone,setDailyDone]=useState(false);
  const [nav,setNav]=useState("dashboard");
  const [tid,setTid]=useState(null);
  const [mid,setMid]=useState(null);

  async function login(name,role,ind,fn){
    const ud=await loadUser(name);
    const p=ud.progress||{},ux=ud.xp||0,ub=ud.badges||[],upq=ud.pq||0;
    const ui=ud.industry||ind||"";const ufn=ud.fn||fn||"";
    setUser({name,role});setIndustry(ui);setUserFn(ufn);
    const today=new Date().toDateString();
    const yest=new Date(Date.now()-86400000).toDateString();
    const sk=ud.last===yest?(ud.streak||0)+1:ud.last===today?(ud.streak||0):1;
    const dd=ud.dailyDate===today;
    setProg(p);setXp(ux);setBdgs(ub);setPerfQ(upq);setStreak(sk);setDailyDone(dd);
    await saveUser(name,{...ud,last:today,streak:sk,industry:ui,fn:ufn});
    setBoard(await getBoard());
    setNotes(await getNotes());
    setScreen(role==="facilitator"?"facilitator":"learner");
  }

  async function complete(tid,mid){
    const k=tid+":"+mid;if(prog[k])return;
    const mult=streak>=14?3:streak>=7?2:1;
    const earned=XP.MODULE*mult;
    const np={...prog,[k]:true},nx=xp+earned;
    setProg(np);setXp(nx);
    flash({type:"xp",amt:earned,msg:"Module complete!"+(mult>1?" · "+mult+"× streak bonus 🔥":"")});
    const nb=newBadges(np,perfQ,bdgs);
    const allBdgs=[...bdgs,...nb.map(b=>b.id)];
    if(nb.length){setBdgs(allBdgs);setTimeout(()=>flash({type:"badge",badge:nb[0]}),3200);}
    const lv=getLv(nx);
    await saveUser(user.name,{progress:np,xp:nx,badges:allBdgs,pq:perfQ,last:new Date().toDateString(),streak,industry,fn:userFn});
    await updateBoard(user.name,nx,lv.name,industry);
    setBoard(await getBoard());
  }

  function quizXp(sc,tot,earned){
    const nx=xp+earned;setXp(nx);
    const perf=sc===tot,npq=perf?perfQ+1:perfQ;
    if(perf)setPerfQ(npq);
    flash({type:"xp",amt:earned,msg:perf?"Perfect score! 🎉":sc+"/"+tot+" correct"});
    const nb=newBadges(prog,npq,bdgs);
    const allBdgs=[...bdgs,...nb.map(b=>b.id)];
    if(nb.length){setBdgs(allBdgs);setTimeout(()=>flash({type:"badge",badge:nb[0]}),3200);}
    const lv=getLv(nx);
    saveUser(user.name,{progress:prog,xp:nx,badges:allBdgs,pq:npq,last:new Date().toDateString(),streak,industry,fn:userFn});
    updateBoard(user.name,nx,lv.name,industry);
  }

  function dailyComplete(lp){
    const nx=xp+lp;setXp(nx);setDailyDone(true);
    flash({type:"xp",amt:lp,msg:"Daily challenge complete!"});
    const lv=getLv(nx);
    saveUser(user.name,{progress:prog,xp:nx,badges:bdgs,pq:perfQ,last:new Date().toDateString(),streak,dailyDate:new Date().toDateString(),industry,fn:userFn});
    updateBoard(user.name,nx,lv.name,industry);
  }

  async function addNote(modId,text){
    await saveNote(modId,text,user.name);
    setNotes(await getNotes());
  }

  function flash(n){setNotif(null);setTimeout(()=>setNotif(n),50);}

  function go(view,t,m){
    if(view&&view.includes("_")){
      const parts=view.split("_");
      if(parts[0]==="mod"&&parts.length>=3){setNav("mod");setTid(parts[1]);setMid(parts[2]);}
      else if(parts[0]==="tier"&&parts.length>=2){setNav("tier");setTid(parts[1]);setMid(null);}
      else if(parts[0]==="cert"&&parts.length>=2){setNav("cert");setTid(parts[1]);}
      else{setNav(parts[0]);}
    } else {
      setNav(view||"dashboard");
      if(t!==undefined&&t!==null)setTid(t);
      if(m!==undefined&&m!==null)setMid(m);
      else if(t!==undefined&&view==="tier")setMid(null);
    }
    window.scrollTo(0,0);
  }

  const tier=tid?TIERS.find(t=>t.id===tid):null;
  const mod=tier&&mid?tier.mods.find(m=>m.id===mid):null;
  const midx=mod?tier.mods.findIndex(m=>m.id===mod.id):-1;
  const viewTitle={dashboard:"Dashboard",learning:"My Learning",assess:"Readiness Assessment",missions:"Missions",usecases:"AI at Work",promptlab:"AI Toolkit",achievements:"Achievements",cert:"Certificate"}[nav]||(mod?mod.title:tier?tier.name:"");

  if(screen==="login")return(<><style>{CSS}</style><AuthScreen onLogin={login}/></>);
  if(screen==="facilitator")return(
    <><style>{CSS}</style>
    {notif&&<Toast n={notif} onDone={()=>setNotif(null)}/>}
    <FacilDash user={user} notes={notes} onSaveNote={addNote} board={board}/>
    </>
  );

  return(<>
    <style>{CSS}</style>
    {notif&&<Toast n={notif} onDone={()=>setNotif(null)}/>}
    <ChatWidget/>
    <div style={{display:"flex",height:"100vh",overflow:"hidden",background:T.page}}>
      <Sidebar role={user?.role||"learner"} view={nav} onNav={go} user={user} xp={xp} industry={industry} userFn={userFn}/>
      <div className="mob-content" style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
        <Header title={viewTitle} xp={xp} streak={streak} onNav={go}/>
          <ContextStrip user={user} industry={industry} userFn={userFn} subFn={subFn} xp={xp}/>
        <div style={{flex:1,overflowY:"auto"}}>
          {nav==="dashboard"&&<LDashboard user={user} userFn={userFn} xp={xp} badges={bdgs} streak={streak} board={board} progress={prog} industry={industry} onNav={go} dailyDone={dailyDone} onDailyComplete={dailyComplete}/>}
          {nav==="learning"&&!tier&&(
            <div className="fade-in" style={{overflowY:"auto",flex:1,background:"#0C1524"}}>
              <div style={{background:"linear-gradient(135deg,#0A1828 0%,#0D2040 50%,#0A1828 100%)",padding:"28px 32px",borderBottom:"1px solid rgba(255,255,255,0.06)"}}>
                <div style={{display:"flex",gap:8,marginBottom:10,flexWrap:"wrap"}}>
                  <Badge label="My Learning" color="#5AC8FA" bg="rgba(90,200,250,0.15)"/>
                  <Badge label={getVisibleTiers(user?.role).reduce((a,t)=>a+t.mods.length,0)+" modules"} color="rgba(255,255,255,0.45)" bg="rgba(255,255,255,0.07)"/>
                  <Badge label={Object.keys(prog).length+" completed"} color="#34C759" bg="rgba(52,199,89,0.12)"/>
                </div>
                <div style={{fontSize:24,fontWeight:800,color:"#FFFFFF",letterSpacing:"-0.03em",marginBottom:4}}>Your Capability Programmes</div>
                <div style={{fontSize:13,color:"rgba(255,255,255,0.45)",marginBottom:18}}>Role-based programmes built for how you work. Each module earns Learning Points.</div>
                <div style={{display:"flex",gap:20}}>
                  {[{v:xp.toLocaleString(),l:"Total LP"},{v:Object.keys(prog).length+"/"+getVisibleTiers(user?.role).reduce((a,t)=>a+t.mods.length,0),l:"Modules"},{v:Math.round(Object.keys(prog).length/Math.max(getVisibleTiers(user?.role).reduce((a,t)=>a+t.mods.length,0),1)*100)+"%",l:"Complete"}].map((s,i)=>(
                    <div key={i}><div style={{fontSize:20,fontWeight:800,color:"#5AB4FF",letterSpacing:"-0.04em"}}>{s.v}</div><div style={{fontSize:11,color:"rgba(255,255,255,0.3)",marginTop:1}}>{s.l}</div></div>
                  ))}
                </div>
              </div>
              <div style={{padding:"24px 28px"}}>
                <div style={{display:"grid",gridTemplateColumns:"repeat(2,minmax(0,1fr))",gap:16}} className="mob-grid1">
                  {getVisibleTiers(user?.role).map(t=>{
                    const td=t.mods.filter(m=>prog[t.id+":"+m.id]).length;
                    const tp=Math.round(td/t.mods.length*100);
                    const done=td===t.mods.length;
                    const Icon=t.icon;
                    const nextMod=t.mods.find(m=>!prog[t.id+":"+m.id]);
                    return(
                      <div key={t.id} style={{background:"rgba(255,255,255,0.05)",border:"1px solid "+(done?"rgba(52,199,89,0.3)":"rgba(255,255,255,0.07)"),borderRadius:10,overflow:"hidden",display:"flex",flexDirection:"column",cursor:"pointer"}}
                        onMouseEnter={e=>{e.currentTarget.style.border="1px solid rgba(255,255,255,0.18)";e.currentTarget.style.transform="translateY(-2px)";}}
                        onMouseLeave={e=>{e.currentTarget.style.border="1px solid "+(done?"rgba(52,199,89,0.3)":"rgba(255,255,255,0.07)");e.currentTarget.style.transform="none";}}
                        onClick={()=>go("tier_"+t.id)} role="button" tabIndex={0} onKeyDown={e=>{if(e.key==="Enter"||e.key===" ")go("tier_"+t.id);}}>
                        <div style={{padding:"18px 20px",flex:1}}>
                          <div style={{fontSize:9,fontWeight:700,color:"rgba(255,255,255,0.3)",textTransform:"uppercase",letterSpacing:".12em",marginBottom:10}}>PROGRAMME</div>
                          <div style={{display:"flex",gap:12,alignItems:"flex-start",marginBottom:14}}>
                            <div style={{flex:1}}>
                              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
                                <Badge label={t.level} color={t.color} bg={t.color+"22"}/>
                                {done&&<Badge label="Complete ✓" color="#34C759" bg="rgba(52,199,89,0.12)"/>}
                              </div>
                              <div style={{fontSize:17,fontWeight:800,color:"#5AC8FA",letterSpacing:"-0.02em",marginBottom:6,lineHeight:1.2}}>{t.name}</div>
                              <div style={{fontSize:12,color:"rgba(255,255,255,0.45)",lineHeight:1.55}}>{t.description}</div>
                            </div>
                            <div style={{width:48,height:48,borderRadius:10,background:t.color+"22",border:"1.5px solid "+t.color+"40",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                              <Icon size={22} color={t.color}/>
                            </div>
                          </div>
                          <div style={{marginBottom:8}}>
                            <div style={{display:"flex",justifyContent:"space-between",fontSize:11,color:"rgba(255,255,255,0.35)",marginBottom:5}}>
                              <span>{td}/{t.mods.length} modules</span><span>{tp}% complete</span>
                            </div>
                            <div style={{height:4,background:"rgba(255,255,255,0.08)",borderRadius:3,overflow:"hidden"}}>
                              <div style={{width:tp+"%",height:"100%",background:done?"#34C759":t.color,borderRadius:3,transition:"width .5s ease"}}/>
                            </div>
                          </div>
                          <div style={{display:"flex",gap:6,flexWrap:"wrap",alignItems:"center"}}>
                            <span style={{fontSize:10,color:"rgba(255,255,255,0.3)"}}>⏱ {t.duration}</span>
                            <span style={{fontSize:10,color:"rgba(255,255,255,0.3)",marginLeft:"auto"}}>+{t.mods.length*100} LP available</span>
                          </div>
                        </div>
                        <div style={{borderTop:"1px solid rgba(255,255,255,0.06)",padding:"10px 20px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                          <span style={{fontSize:12,color:"rgba(255,255,255,0.3)"}}>
                            {nextMod?<span style={{color:"rgba(90,180,255,0.7)",fontSize:11}}>Next: {nextMod.title.slice(0,28)}{nextMod.title.length>28?"…":""}</span>:"All modules complete"}
                          </span>
                          <span style={{fontSize:12,fontWeight:700,color:done?"#34C759":"#5AC8FA"}}>
                            {done?"View certificate →":td===0?"Start programme →":"Continue →"}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
          {nav==="tier"&&tier&&<TierDetail tier={tier} progress={prog} notes={notes} industry={industry} onNav={go}/>}
          {nav==="mod"&&tier&&mod&&<ModuleReader tier={tier} mod={mod} idx={midx} progress={prog} notes={notes} onComplete={complete} onQuizXp={quizXp} industry={industry} userFn={userFn} role={user?.role} onNav={go}/>}
          {nav==="assess"&&<ReadinessAssessment role={user?.role} userFn={userFn} industry={industry} xp={xp} onNav={go} subFn={subFn}/>}
          {nav==="missions"&&<MissionsView progress={prog} badges={bdgs} streak={streak} xp={xp} onNav={go}/>}
          {nav==="usecases"&&<UseCaseLibrary industry={industry} userFn={userFn} role={user?.role} onNav={go} subFn={subFn}/>}
          {nav==="promptlab"&&<PromptLab industry={industry} userFn={userFn} role={user?.role} subFn={subFn}/>}
          {nav==="achievements"&&<AchievementsView xp={xp} badges={bdgs} streak={streak} role={user?.role}/>}
          {nav==="disruption"&&<RoleDisruptionView/>}
          {nav==="skillsgap"&&<SkillsGapView/>}
          {nav==="cert"&&tier&&<CertView tier={tier} name={user.name} xp={xp} onNav={go}/>}
        </div>
      </div>
    </div>
  </>);
}
