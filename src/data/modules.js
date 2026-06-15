// Learning modules — sample content catalogue for CapabilityOS Academy.
// Each module maps to a capability and carries XP rewards consistent
// with XP.MODULE / XP.QUIZ_Q / XP.PERFECT in theme/tokens.js.

export const MODULES = [
  {
    id: "mod-credit-risk-101",
    title: "Foundations of AI-Assisted Credit Risk",
    capabilityId: "credit-risk-ai",
    industryId: "financial-services",
    durationMins: 35,
    quizQuestions: 8,
    description:
      "How machine-learning risk scores complement, not replace, underwriting judgement.",
  },
  {
    id: "mod-route-optimisation-101",
    title: "AI Route Optimisation: Principles & Pitfalls",
    capabilityId: "route-optimisation",
    industryId: "transportation-logistics",
    durationMins: 40,
    quizQuestions: 10,
    description:
      "From static routing to dynamic, demand-aware network optimisation.",
  },
  {
    id: "mod-fleet-intelligence-101",
    title: "Fleet Intelligence Fundamentals",
    capabilityId: "fleet-intelligence",
    industryId: "transportation-logistics",
    durationMins: 30,
    quizQuestions: 6,
    description:
      "Telematics, utilisation signals, and what 'fleet intelligence' means in practice.",
  },
  {
    id: "mod-predictive-maintenance-101",
    title: "Predictive Maintenance for Logistics Fleets",
    capabilityId: "predictive-maintenance",
    industryId: "transportation-logistics",
    durationMins: 45,
    quizQuestions: 10,
    description:
      "Reading the early-warning signals that prevent costly downtime.",
  },
  {
    id: "mod-data-governance-101",
    title: "Data Governance & Lineage Essentials",
    capabilityId: "data-governance",
    industryId: "financial-services",
    durationMins: 25,
    quizQuestions: 6,
    description: "Why lineage and stewardship are prerequisites for trustworthy AI.",
  },
  {
    id: "mod-clinical-decision-support-101",
    title: "Clinical Decision Support: A Literacy Primer",
    capabilityId: "clinical-decision-support",
    industryId: "healthcare",
    durationMins: 35,
    quizQuestions: 8,
    description: "What clinicians need to know before trusting model output.",
  },
  {
    id: "mod-predictive-quality-101",
    title: "Predictive Quality on the Plant Floor",
    capabilityId: "predictive-quality",
    industryId: "manufacturing",
    durationMins: 35,
    quizQuestions: 8,
    description: "Using sensor data to anticipate yield issues before they occur.",
  },
];

export function getModuleById(id) {
  return MODULES.find((m) => m.id === id);
}

export function getModulesForIndustry(industryId) {
  return MODULES.filter((m) => m.industryId === industryId);
}
