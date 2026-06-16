// Capability dimensions for AI Readiness Assessment
export const CAP_DIMS = [
  {
    id: "d1",
    name: "Digital Literacy",
    short: "Digital",
    color: "#6B8EAD",
    desc: "Foundational digital skills — tools, cyber awareness, productivity, collaboration",
    skills: ["Digital tools", "Cyber awareness", "Productivity apps", "Digital communication", "Remote collaboration"],
    questions: [
      {
        q: "How confidently do you use cloud-based collaboration tools (e.g. Teams, Slack, SharePoint)?",
        opts: ["Rarely or never", "Basic use only", "Regular confident user", "Advanced power user"],
        scores: [1, 2, 3, 4],
      },
      {
        q: "When you receive a suspicious email requesting urgent action, you typically:",
        opts: [
          "Click the link to investigate",
          "Ignore it but take no further action",
          "Report it to IT and delete it",
          "Analyse headers and report with full context",
        ],
        scores: [1, 2, 3, 4],
      },
      {
        q: "How often do you use digital tools to automate repetitive tasks in your role?",
        opts: ["Never considered it", "Occasionally, when prompted", "Regularly for routine tasks", "Actively seek automation opportunities"],
        scores: [1, 2, 3, 4],
      },
    ],
  },
  {
    id: "d2",
    name: "Data Literacy",
    short: "Data",
    color: "#4AA8D4",
    desc: "Reading, interpreting, and questioning data — KPIs, dashboards, data ethics",
    skills: ["Data fundamentals", "Dashboard reading", "Data ethics", "Data quality", "KPI interpretation"],
    questions: [
      {
        q: "When reviewing a dashboard, you can independently identify the key insight it is communicating:",
        opts: ["Rarely — I need assistance", "Sometimes with guidance", "Usually on my own", "Always, and I question the data's validity"],
        scores: [1, 2, 3, 4],
      },
      {
        q: "How comfortable are you discussing data quality issues with your analytics team?",
        opts: ["Not comfortable — I don't know the terminology", "I follow the conversation but can't lead it", "Comfortable discussing common issues", "I proactively identify and escalate data quality risks"],
        scores: [1, 2, 3, 4],
      },
      {
        q: "When a KPI unexpectedly improves, your first instinct is to:",
        opts: ["Celebrate and report it upward", "Accept it at face value", "Probe whether the measurement changed", "Investigate the full causal chain before reporting"],
        scores: [1, 2, 3, 4],
      },
    ],
  },
  {
    id: "d3",
    name: "Analytics Literacy",
    short: "Analytics",
    color: "#0072C6",
    desc: "Analytical thinking, BI tools, data visualisation, performance measurement",
    skills: ["Business intelligence", "Analytical thinking", "Data visualisation", "Root cause analysis", "Statistical thinking"],
    questions: [
      {
        q: "How confidently do you use BI tools (Power BI, Tableau, Looker) to answer business questions?",
        opts: ["I consume reports others build", "I can navigate existing reports", "I build and modify reports independently", "I design analytical frameworks for the organisation"],
        scores: [1, 2, 3, 4],
      },
      {
        q: "When two metrics trend in opposite directions, you typically:",
        opts: ["Report both without comment", "Pick the one that tells a better story", "Explain the likely relationship between them", "Build a causal model to test the relationship"],
        scores: [1, 2, 3, 4],
      },
      {
        q: "How often do you apply root cause analysis when a business problem is escalated to you?",
        opts: ["Rarely — I address the symptom", "Occasionally when prompted", "Regularly as part of my process", "It is my default problem-solving approach"],
        scores: [1, 2, 3, 4],
      },
    ],
  },
  {
    id: "d4",
    name: "AI Literacy",
    short: "AI Literacy",
    color: "#00D4E8",
    desc: "How AI works, its limits, responsible use, and enterprise implications",
    skills: ["AI fundamentals", "Generative AI", "ML concepts", "Responsible AI", "AI risk awareness"],
    questions: [
      {
        q: "Which best describes your understanding of how large language models (LLMs) generate responses?",
        opts: [
          "I know they exist but not how they work",
          "They search the internet for answers",
          "They predict likely next tokens based on training data",
          "I understand attention mechanisms, tokenisation, and emergent capabilities",
        ],
        scores: [1, 2, 3, 4],
      },
      {
        q: "When a generative AI tool produces a confident but incorrect answer, this is called:",
        opts: ["A bug", "A bias", "A hallucination", "An error of omission"],
        scores: [2, 2, 4, 1],
      },
      {
        q: "How would you assess the responsible AI maturity of your organisation?",
        opts: ["No formal policy exists", "Guidelines exist but are rarely enforced", "Policies exist with some governance", "Comprehensive AI ethics framework with active oversight"],
        scores: [1, 2, 3, 4],
      },
    ],
  },
  {
    id: "d5",
    name: "AI Productivity",
    short: "AI Productivity",
    color: "#1D9E75",
    desc: "AI-assisted workflows, role-based AI applications, departmental use cases",
    skills: ["AI-assisted workflows", "Role-based AI apps", "Productivity acceleration", "Workflow automation", "Dept use cases"],
    questions: [
      {
        q: "How frequently do you use AI tools (ChatGPT, Copilot, Claude) to assist with your daily work?",
        opts: ["Never", "A few times a month", "Several times a week", "Multiple times daily as a core work tool"],
        scores: [1, 2, 3, 4],
      },
      {
        q: "In your department, you have identified and documented AI use cases that could save measurable time:",
        opts: ["We haven't explored this", "We have informal ideas", "We have documented 1–3 use cases", "We have a prioritised use-case roadmap"],
        scores: [1, 2, 3, 4],
      },
      {
        q: "When drafting a complex document, you use AI to:",
        opts: ["I don't use AI for writing", "Ask it to write the whole document", "Generate a first draft I then heavily edit", "Use it for specific sections, structure, and iteration"],
        scores: [1, 1, 2, 4],
      },
    ],
  },
  {
    id: "d6",
    name: "AI Practitioner",
    short: "Practitioner",
    color: "#C17F24",
    desc: "Advanced prompting, AI solution design, automation implementation",
    skills: ["Advanced prompting", "AI solution design", "Automation implementation", "AI-enabled processes", "Dept AI leadership"],
    questions: [
      {
        q: "When writing a prompt for a complex analytical task, you typically include:",
        opts: [
          "A short question",
          "Context and a clear task",
          "Role, context, task, format, and constraints",
          "Chain-of-thought instructions, examples, and output validation criteria",
        ],
        scores: [1, 2, 3, 4],
      },
      {
        q: "You have designed or implemented an AI-enabled workflow that measurably improved a business process:",
        opts: ["Not yet", "In prototype only", "One deployed solution", "Multiple deployed solutions with measured ROI"],
        scores: [1, 2, 3, 4],
      },
      {
        q: "How comfortable are you evaluating AI vendor proposals for your department?",
        opts: ["Not comfortable", "I rely entirely on IT", "I can assess use-case fit and risk", "I conduct full technical, commercial, and ethical evaluations"],
        scores: [1, 2, 3, 4],
      },
    ],
  },
  {
    id: "d7",
    name: "AI Leader",
    short: "AI Leader",
    color: "#7C3AED",
    desc: "AI strategy, governance, operating models, investment prioritisation",
    skills: ["AI strategy", "AI governance", "AI operating models", "Investment prioritisation", "Change leadership"],
    questions: [
      {
        q: "Your organisation's AI strategy is:",
        opts: [
          "Not formally defined",
          "Referenced in the digital strategy",
          "A standalone strategy with executive sponsorship",
          "An integrated enterprise strategy with governance, funding, and KPIs",
        ],
        scores: [1, 2, 3, 4],
      },
      {
        q: "How do you currently prioritise which AI investments to fund?",
        opts: [
          "Ad hoc based on vendor pitches",
          "Based on department requests",
          "Using a defined ROI and risk framework",
          "Portfolio approach balancing quick wins, capability build, and transformation",
        ],
        scores: [1, 2, 3, 4],
      },
      {
        q: "AI governance in your organisation includes:",
        opts: [
          "No formal governance",
          "IT owns all AI decisions",
          "A cross-functional AI steering committee",
          "A full AI governance framework with policies, controls, and board reporting",
        ],
        scores: [1, 2, 3, 4],
      },
    ],
  },
  {
    id: "d8",
    name: "Transformation Leader",
    short: "Transform",
    color: "#E8B84B",
    desc: "Enterprise transformation, data strategy, AI transformation, future of work",
    skills: ["Enterprise transformation", "Data strategy", "AI transformation", "Workforce transformation", "Future of work"],
    questions: [
      {
        q: "Your organisation's data strategy is:",
        opts: [
          "Fragmented with no central ownership",
          "Managed by IT with limited business alignment",
          "A business-led strategy with an active CDO",
          "A board-level strategic priority with enterprise-wide data governance",
        ],
        scores: [1, 2, 3, 4],
      },
      {
        q: "How are you preparing your workforce for AI-driven change?",
        opts: [
          "We haven't started",
          "Individual upskilling on request",
          "Structured capability programmes for key roles",
          "Enterprise-wide AI transformation programme with skills mapping and reskilling pathways",
        ],
        scores: [1, 2, 3, 4],
      },
      {
        q: "When you think about the 'future of work' in your organisation, you:",
        opts: [
          "See it as an HR issue",
          "Have concerns but no plan",
          "Have a workforce planning strategy that accounts for automation",
          "Lead an active transformation agenda that redesigns roles, culture, and operating models",
        ],
        scores: [1, 2, 3, 4],
      },
    ],
  },
];

// Which dimensions each role is assessed on
export const ROLE_DIMS = {
  executive:  ["d3", "d4", "d5", "d6", "d7", "d8"],
  functional: ["d2", "d3", "d4", "d5", "d6", "d7"],
  manager:    ["d2", "d3", "d4", "d5", "d6"],
  emerging:   ["d1", "d2", "d3", "d4"],
  learner:    ["d1", "d2", "d3", "d4", "d5", "d6", "d7", "d8"],
  facilitator:["d1", "d2", "d3", "d4", "d5", "d6", "d7", "d8"],
};

// Peer benchmark scores by role (0–100 scale)
export const BENCHMARKS = {
  executive:  { d3: 72, d4: 65, d5: 60, d6: 70, d7: 55, d8: 50 },
  functional: { d2: 68, d3: 65, d4: 60, d5: 58, d6: 55, d7: 50 },
  manager:    { d2: 65, d3: 62, d4: 58, d5: 55, d6: 52 },
  emerging:   { d1: 65, d2: 55, d3: 50, d4: 45 },
  learner:    { d1: 70, d2: 65, d3: 60, d4: 55, d5: 50, d6: 45, d7: 40, d8: 35 },
  facilitator:{ d1: 70, d2: 65, d3: 60, d4: 55, d5: 50, d6: 45, d7: 40, d8: 35 },
};

// Score raw answers (0–3 per question, max 12 per dim of 3 qs) → 0–100
export function scoreToPercent(raw, maxRaw) {
  return Math.round((raw / maxRaw) * 100);
}
