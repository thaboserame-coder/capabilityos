// Industry capability frameworks — Digilytics Co CapabilityOS
// Each industry defines the capability areas tracked for learners
// operating in that sector, plus a short executive framing.

export const INDUSTRIES = [
  {
    id: "financial-services",
    name: "Financial Services",
    summary:
      "Lending, underwriting, and risk capabilities for banks and non-bank lenders adopting AI-driven decisioning.",
    capabilities: [
      { id: "credit-risk-ai", name: "AI-Assisted Credit Risk", level: "Core" },
      { id: "regulatory-compliance", name: "Regulatory & Compliance Intelligence", level: "Core" },
      { id: "loan-ops-automation", name: "Loan Operations Automation", level: "Advanced" },
      { id: "data-governance", name: "Data Governance & Lineage", level: "Foundational" },
    ],
  },
  {
    id: "transportation-logistics",
    name: "Transportation & Logistics",
    summary:
      "Fleet intelligence, route optimisation, and supply-chain visibility capabilities for logistics operators scaling AI adoption.",
    capabilities: [
      { id: "fleet-intelligence", name: "Fleet & Asset Intelligence", level: "Core" },
      { id: "route-optimisation", name: "AI Route & Network Optimisation", level: "Advanced" },
      { id: "supply-chain-visibility", name: "Supply Chain Visibility", level: "Core" },
      { id: "predictive-maintenance", name: "Predictive Maintenance", level: "Advanced" },
      { id: "logistics-data-governance", name: "Logistics Data Governance", level: "Foundational" },
    ],
  },
  {
    id: "healthcare",
    name: "Healthcare",
    summary:
      "Clinical and operational AI capabilities for providers and payers focused on safe, governed adoption.",
    capabilities: [
      { id: "clinical-decision-support", name: "Clinical Decision Support Literacy", level: "Core" },
      { id: "patient-data-privacy", name: "Patient Data Privacy & Ethics", level: "Foundational" },
      { id: "operational-efficiency-ai", name: "Operational Efficiency AI", level: "Advanced" },
    ],
  },
  {
    id: "manufacturing",
    name: "Manufacturing",
    summary:
      "Plant-floor and supply intelligence capabilities supporting Industry 4.0 transformation programmes.",
    capabilities: [
      { id: "predictive-quality", name: "Predictive Quality & Yield", level: "Advanced" },
      { id: "supply-planning-ai", name: "AI-Assisted Supply Planning", level: "Core" },
      { id: "plant-data-foundations", name: "Plant Data Foundations", level: "Foundational" },
    ],
  },
];

export function getIndustryById(id) {
  return INDUSTRIES.find((industry) => industry.id === id);
}
