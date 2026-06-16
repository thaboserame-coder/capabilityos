// CapabilityOS — Tier + Module data
// T1 = AI Executive (Board/C-suite), T2 = AI Leader (VPs/GMs), T3 = AI Practitioner (Analysts/PMs)

export const ROLE_TIERS = {
  executive: ["t1"],
  functional: ["t2"],
  manager: ["t2", "t3"],
  learner: ["t3"],
  emerging: ["t3"],
  facilitator: [],
};

export const ROLE_DISPLAY = {
  executive: "Board & Executive",
  functional: "Executive Leadership",
  manager: "Senior Management",
  learner: "Professional Specialist",
  emerging: "Emerging Talent",
  facilitator: "Platform Administrator",
};

export const MGMT_FUNCTIONS = [
  "HR & People", "Finance & Treasury", "Risk & Compliance",
  "Technology & Engineering", "Operations & Supply Chain",
  "Sales & Customer Experience", "Marketing & Brand",
  "Legal & Governance", "Strategy & Corporate Affairs",
  "Audit & Controls", "Data & Analytics", "Procurement & Commercial",
];

export const TIERS = [
  {
    id: "t1",
    name: "AI Executive",
    level: "Tier 1",
    color: "#0072C6",
    colorLight: "rgba(0,114,198,0.12)",
    icon: "⬡",
    audience: "Board members, C-suite, Group Executives, NEDs",
    duration: "2-day immersive + platform access",
    description: "Strategic AI literacy for the people who set direction, approve investment, and govern risk.",
    mods: [
      {
        id: "t1m1",
        title: "The AI mandate: why boards can no longer delegate",
        dur: "90 min",
        type: "Facilitated discussion",
        summary: "Board-level AI governance, three strategic risks of AI investment (over/under/wrong), and the board's shifting accountability",
        html: `<h3>The mandate is no longer optional</h3><p>In 2024, McKinsey estimated that AI could deliver up to $4.4 trillion in annual productivity gains globally. By 2025, 72% of Fortune 500 companies had integrated AI into at least one core business function. The question is no longer whether AI will transform your industry — the question is whether your organisation will lead that transformation, or be led by it.</p><h3>The three strategic risks</h3><p><strong>Over-investment risk</strong> — committing capital without a clear return hypothesis, driven by vendor or peer pressure. This is where most R50m–R200m AI failures happen. <strong>Under-investment risk</strong> — moving too slowly while competitors build data moats and AI-native capabilities. <strong>Wrong-investment risk</strong> — the most common and least discussed: investing at the right scale and timing but in the wrong things — AI tools without data governance, AI talent without change management, AI pilots without a path to production.</p><h3>The board's role has shifted</h3><p>For most of the past decade, AI was considered an IT matter. That delegation is now a strategic liability. When AI systems fail, it is not the CTO who answers to shareholders — it is the board. Your role is not to become a data scientist. It is to ask the questions no one else in the room will ask: Do we have the data to support this? Who is accountable if it fails? What is our liability if this AI model discriminates against a customer? Are we measuring AI outcomes or AI activity?</p>`,
        quiz: [
          { q: "Which risk describes investing in AI at the right scale but in the wrong capabilities?", opts: ["Over-investment risk", "Under-investment risk", "Wrong-investment risk", "Governance risk"], correct: 2, exp: "Wrong-investment risk is the most common and least discussed — investing at the right scale but in the wrong things." },
          { q: "Who is ultimately accountable to shareholders when an AI system fails?", opts: ["The CTO", "The Head of Data", "The AI vendor", "The board"], correct: 3, exp: "When AI systems fail, it is the board that answers to shareholders — not the technology team." },
          { q: "What percentage of Fortune 500 companies had integrated AI into at least one core function by 2025?", opts: ["42%", "58%", "72%", "89%"], correct: 2, exp: "By 2025, 72% of Fortune 500 companies had integrated AI into at least one core business function." },
        ],
      },
      {
        id: "t1m2",
        title: "How AI actually works — a leader's mental model",
        dur: "90 min",
        type: "Presentation + Q&A",
        summary: "Conceptual understanding of ML, generative AI, and automation; the data dependency; why some AI projects fail before they start",
        html: `<h3>Why conceptual literacy matters</h3><p>Understanding how AI works at a conceptual level changes how you allocate budget, evaluate vendor proposals, and manage risk. You do not need to write code. You do need to understand why some AI projects fail before they start — and that knowledge is structural, not technical.</p><h3>The three types you will encounter</h3><p><strong>Machine learning</strong>: systems that learn patterns from historical data and improve with more data — credit scoring, fraud detection, demand forecasting. <strong>Generative AI</strong>: systems that create new content — text, images, code, analysis — based on patterns learned during training. <strong>Automation</strong>: rules-based systems that follow predefined logic, often incorrectly labelled as AI by vendors. The distinction matters because each type has different data requirements, failure modes, and cost profiles. Buying a generative AI tool to solve a machine learning problem is a common and expensive mistake.</p><h3>The data dependency is non-negotiable</h3><p>Every AI system is only as good as the data it receives. An AI predicting credit risk is trained on historical credit data. An AI detecting machinery failure is trained on sensor readings. This is why the most important AI question is not "what AI tool should we buy?" It is "what data do we have, and is it clean enough, complete enough, and governed well enough to support this use case?"</p>`,
        quiz: [
          { q: "Which AI type creates new content — text, images, code — based on patterns from training data?", opts: ["Machine learning", "Automation", "Generative AI", "Rules engines"], correct: 2, exp: "Generative AI creates new content drawn from patterns learned during training." },
          { q: "What is the most important question to ask before selecting an AI tool?", opts: ["Which vendor is most reputable?", "What data do we have and is it ready?", "Which competitor is using this tool?", "What is the cost per licence?"], correct: 1, exp: "The most important AI question is about data readiness — not the tool selection." },
        ],
      },
      {
        id: "t1m3",
        title: "AI investment decisions: allocating capital without wasting it",
        dur: "90 min",
        type: "Case study workshop",
        summary: "Build vs buy vs partner decision framework; vendor red flags; the five questions before any AI investment over R5m",
        html: `<h3>The build / buy / partner decision</h3><p>Build is right when you have a unique data asset and a clear competitive advantage from owning the model. Buy is right when the use case is standard and a commercial solution exists. Partner is right when speed is paramount and you lack the internal capability to evaluate or govern. Most organisations default to Buy when they lack data governance, or to Build when they lack engineering talent — both predictable and expensive failures.</p><h3>Red flags in vendor proposals</h3><p>Be cautious of: accuracy claims not accompanied by test methodology; "AI" labelling on what is clearly a rules engine; proposals that depend on clean, structured data you do not have; contracts that give the vendor ownership of model improvements trained on your data; references from different industries or geographies that do not translate to your context.</p><h3>The five questions before any AI investment</h3><p>Before committing to any AI investment above R5m, your team should be able to answer: What specific outcome will this AI improve? How will we measure it? What is the baseline cost of the current state? What is our hypothesis for the AI-driven improvement? And who is personally accountable for the result? If any answer is missing, the investment is not ready.</p>`,
        quiz: [
          { q: "When is 'Build' the right choice for an AI investment?", opts: ["When you need speed and lack internal capability", "When you have a unique data asset and competitive advantage", "When the use case is standard and vendors exist", "When budget is constrained"], correct: 1, exp: "Build is right when you have a unique data asset and clear competitive advantage from owning the model." },
          { q: "Which vendor red flag is the most concerning?", opts: ["The proposal is longer than 20 pages", "References from a different industry that may not translate", "The vendor uses technical jargon", "The demo takes longer than expected"], correct: 1, exp: "References from different industries/geographies may not translate to your context — a significant red flag." },
        ],
      },
      {
        id: "t1m4",
        title: "AI governance and the board's accountability",
        dur: "90 min",
        type: "Facilitated discussion",
        summary: "POPIA and EU AI Act implications for South African boards; the board's five oversight questions; AI ethics as governance",
        html: `<h3>The regulatory landscape</h3><p>South African organisations operate under POPIA, which governs how AI systems collect, process, and use personal data. The EU AI Act categorises AI systems by risk level and imposes obligations on high-risk applications including credit decisioning, employment screening, and law enforcement. South African regulators are watching its implementation closely, and global enterprises operating here are increasingly required to comply.</p><h3>The board's five oversight questions</h3><p>The board's role is not to govern AI technically. It is to ensure management has the right framework in place and that AI use is consistent with the organisation's values and obligations. Every board should be able to answer: What AI systems are we operating? What data do they use? Who is accountable for their accuracy and fairness? What happens when they fail? And how do we know?</p><h3>AI ethics is a governance issue, not a soft issue</h3><p>A South African financial services firm deploying a credit scoring AI that systematically underscores certain demographic groups is not facing an ethical problem — it is facing a legal and reputational catastrophe. AI bias is difficult to detect without deliberate auditing, which is exactly why it compounds. The board must require regular, independent model audits as a matter of policy, not aspiration.</p>`,
        quiz: [
          { q: "What South African legislation governs how AI systems collect and use personal data?", opts: ["GDPR", "POPIA", "Consumer Protection Act", "Companies Act"], correct: 1, exp: "POPIA (Protection of Personal Information Act) governs how AI systems collect, process, and use personal data in South Africa." },
          { q: "AI bias in a credit scoring model is primarily a:", opts: ["Technical problem only IT can solve", "Legal and reputational risk requiring board oversight", "Minor operational issue", "Vendor responsibility"], correct: 1, exp: "AI bias creates legal and reputational risk — it is a governance issue, not just a technical one." },
        ],
      },
      {
        id: "t1m5",
        title: "AI in your sector: African enterprise case studies",
        dur: "90 min",
        type: "Presentation + discussion",
        summary: "AI in production across BFSI, mining, retail, and public sector in South Africa; quantified outcomes; transferable patterns",
        html: `<h3>Financial services</h3><p>South Africa's major banks have moved AI from experimentation to production across three domains: credit decisioning (using ML trained on alternative data to extend credit to previously unscored customers), fraud detection (real-time AI flagging anomalous transaction patterns within milliseconds), and customer personalisation. Fraud detection AI has reduced losses by 30–50% in documented deployments.</p><h3>Mining</h3><p>South Africa's mining industry creates a compelling AI use case: high-value extraction, dangerous environments, and ageing infrastructure. Predictive maintenance AI — trained on vibration, temperature, and operational data — can identify equipment failure risk 48–72 hours before human operators detect warning signs. Several South African mining houses have reduced unplanned downtime by 15–25% through these systems.</p><h3>Retail and consumer</h3><p>South African retailers face specific supply chain challenges: long lead times, high transport costs, and demand patterns that vary significantly by region and income band. AI-powered demand forecasting — incorporating weather, events, promotional calendars, and historical sales — has become a key capability for major grocery and fashion retailers. The competitive advantage is not cost reduction alone. It is availability: the product on the shelf when the customer walks in.</p>`,
        quiz: [
          { q: "By how much has fraud detection AI reduced losses in documented South African bank deployments?", opts: ["5–10%", "15–20%", "30–50%", "60–75%"], correct: 2, exp: "Fraud detection AI has reduced losses by 30–50% in documented deployments at major South African banks." },
          { q: "How far in advance can predictive maintenance AI identify mining equipment failure risk?", opts: ["2–4 hours", "12–24 hours", "48–72 hours", "1 week"], correct: 2, exp: "Predictive maintenance AI can identify equipment failure risk 48–72 hours before human operators detect warning signs." },
        ],
      },
      {
        id: "t1m6",
        title: "Building your 90-day AI leadership agenda",
        dur: "90 min",
        type: "Workshop",
        summary: "The now/next/later framework; identifying quick wins; stakeholder mapping; making accountability concrete",
        html: `<h3>The mechanism, not the motivation</h3><p>The most dangerous outcome from a leadership programme is motivation without mechanism. You leave energised, return to the office, and within two weeks the pressure of the current state has absorbed the ambition of the future state. The 90-day AI agenda is a mechanism — a personal accountability tool, not a strategy document.</p><h3>The now / next / later framework</h3><p><strong>Now (Days 1–30)</strong>: Actions that signal intent and build internal credibility — visible, low-cost, reversible. Commission an internal AI inventory. Schedule an ExCo AI education session. Nominate a named AI champion from within your function. <strong>Next (Days 31–60)</strong>: Actions that build infrastructure — medium-effort, medium-reversibility. Define your first AI pilot hypothesis. Establish a simple AI risk reporting line. Commit to a data governance baseline review. <strong>Later (Days 61–90)</strong>: Strategic bets, made with the foundation now in place.</p><h3>Your commitment</h3><p>This programme ends today. Your accountability starts tomorrow. Write one sentence: the AI outcome you commit to delivering in 90 days, and the person you will ask to hold you accountable. That sentence is more valuable than anything else in this programme — because it is the moment strategy becomes action.</p>`,
        quiz: [
          { q: "What is the primary purpose of the 90-day AI agenda?", opts: ["A comprehensive strategy document", "A personal accountability mechanism", "A vendor evaluation framework", "A board reporting template"], correct: 1, exp: "The 90-day AI agenda is a mechanism — a personal accountability tool, not a strategy document." },
          { q: "In the Now/Next/Later framework, what belongs in 'Now' (Days 1–30)?", opts: ["Strategic bets and major investments", "Medium-effort infrastructure building", "Visible, low-cost, reversible actions that signal intent", "Full AI programme rollout"], correct: 2, exp: "Now (Days 1–30) focuses on actions that signal intent and build internal credibility — visible, low-cost, reversible." },
        ],
      },
    ],
  },

  {
    id: "t2",
    name: "AI Leader",
    level: "Tier 2",
    color: "#1D9E75",
    colorLight: "rgba(29,158,117,0.12)",
    icon: "◈",
    audience: "VPs, GMs, Functional Heads, Senior Managers",
    duration: "4-day cohort + platform access",
    description: "Operational AI leadership for the layer that executes strategy, manages vendors, and builds team capability.",
    mods: [
      {
        id: "t2m1",
        title: "AI fundamentals for business leaders",
        dur: "90 min",
        type: "Presentation",
        summary: "Types of AI, data requirements, and how to participate confidently in AI decisions",
        html: `<h3>The vocabulary problem</h3><p>Every week, someone in your organisation makes a decision about AI without fully understanding what they are approving. Budgets are allocated, vendors are selected, and projects are launched — all in a language most senior leaders have not been taught. This module does not make you technical. It gives you the vocabulary to participate fully in conversations that are currently happening without you, and to recognise the claims that do not survive scrutiny.</p><h3>The three AI types that determine how you invest and govern</h3><p><strong>Machine learning</strong> builds statistical models from historical data and improves with more data over time. Credit scoring, fraud detection, demand forecasting, and equipment failure prediction are all machine learning applications. Data quality and data volume are prerequisites — not nice-to-haves. An ML model trained on incomplete or biased historical data will produce incomplete or biased predictions at scale.</p><p><strong>Generative AI</strong> creates new content — text, summaries, code, analysis — drawn from patterns across vast training datasets. It is versatile, fast, and productive. It is also prone to confident errors. Every generative AI output used professionally requires human review where accuracy matters.</p><p><strong>Automation</strong> follows predefined rules without learning. Many products labelled as "AI-powered" are primarily automation — valuable, but governed and evaluated differently. Confusing them leads to misplaced investment and governance gaps.</p><h3>What AI cannot do</h3><p>AI cannot exercise judgment. It cannot weigh competing values or navigate genuine ethical ambiguity. These are not temporary engineering limitations — they are structural features of current AI systems that make human oversight non-negotiable.</p>`,
        quiz: [
          { q: "Which AI type is best described as 'follows predefined rules without learning'?", opts: ["Machine learning", "Generative AI", "Deep learning", "Automation"], correct: 3, exp: "Automation follows predefined rules without learning — many products labelled 'AI-powered' are primarily automation." },
          { q: "Generative AI output used professionally requires:", opts: ["No review if from a reputable vendor", "Peer review only for senior staff", "Human review where accuracy matters", "Automated quality checks only"], correct: 2, exp: "Every generative AI output used professionally requires human review where accuracy matters." },
        ],
      },
      {
        id: "t2m2",
        title: "Identifying AI opportunities in your function",
        dur: "90 min",
        type: "Workshop",
        summary: "Structured opportunity-identification method; AI feasibility assessment; prioritisation framework",
        html: `<h3>Where AI value actually lives</h3><p>The highest-value AI use cases share a structural pattern: high volume, historical data, a clear outcome metric, and a current process that relies on human judgment applied repeatedly at scale. Credit scoring, fraud flagging, document classification, demand forecasting, equipment failure prediction — all fit this pattern. The cases that do not tend to produce projects that struggle to show ROI — not because the AI is inadequate, but because the use case was never structured for AI.</p><p>The practical test: if I removed the AI from this process tomorrow, would the impact be measurable in cost, speed, quality, or risk? If the answer is no, the AI is adding complexity rather than value.</p><h3>The feasibility filter: three questions before any opportunity advances</h3><p>For any AI opportunity, apply three filters: First: do we have the historical data to support this use case? Second: is the problem large enough to justify AI investment and the change it requires? Third: is there a clear, measurable outcome we can use to know whether the AI is working? Opportunities that fail any filter are placed in a different queue: build the data foundation first, then return with a redesigned proposal.</p><h3>Building your function's AI shortlist</h3><p>The deliverable is a shortlist of three AI opportunities within your specific function, each passed through the feasibility filter and ranked by potential value: problem statement, current cost or quality gap, data availability, proposed AI approach, and success metric. Three opportunities, one page, clear enough for an executive conversation.</p>`,
        quiz: [
          { q: "What structural pattern do the highest-value AI use cases share?", opts: ["Low volume, unique data, qualitative outcomes", "High volume, historical data, clear outcome metric, repeated human judgment", "Complex processes with many stakeholders", "Processes where AI is novel and untested"], correct: 1, exp: "Highest-value AI cases share: high volume, historical data, clear outcome metrics, and repeated human judgment at scale." },
          { q: "The practical test for an AI use case is:", opts: ["Would competitors use it?", "If AI were removed, would the impact be measurable?", "Can a vendor deliver it in under 6 months?", "Is the accuracy above 90%?"], correct: 1, exp: "If removing AI from the process would not produce measurable impact, the AI is adding complexity rather than value." },
        ],
      },
      {
        id: "t2m3",
        title: "Leading AI initiatives without being technical",
        dur: "90 min",
        type: "Facilitated discussion",
        summary: "Problem articulation, vendor accountability, change management, and escalation triggers for AI sponsors",
        html: `<h3>The non-technical leader's genuine advantage</h3><p>The best AI initiative sponsors are not the most technical people in the room. They are the most clear. Clarity about the problem being solved, clarity about the outcome that will signal success, and clarity about who is accountable — these are leadership functions, not technical ones. In organisations where AI projects succeed, the business leader sponsor can articulate in one sentence what problem the AI is solving and what it will look like when solved.</p><h3>Creating accountability structures that work</h3><p>The most common accountability failure in AI initiatives is accountability for activity rather than outcomes: measuring models deployed, data sets ingested, vendor meetings attended. These are inputs, not outcomes. Accountability for outcomes means naming a specific, measurable business result — fraud losses reduced by 15%, credit processing time reduced from five days to same-day — and assigning a named individual who owns it. That individual should be the business leader who benefits from the outcome, not the technical team.</p><p>When AI initiative ownership belongs to a VP of Data rather than a business leader, the business case disappears at the first sign of complexity. Technology teams have no authority to resolve the process and organisational changes AI deployment requires.</p><h3>Recognising and responding to failure signals</h3><p>Most AI projects that ultimately fail showed visible warning signals that were ignored. Pilot phases that keep extending. Vendors who respond to missed metrics with scope expansion rather than remediation. KPIs that change between reporting cycles. These are leadership problems requiring a leadership response. The most valuable capability an AI sponsor develops is the ability to stop a failing project before it becomes an expensive cautionary tale.</p>`,
        quiz: [
          { q: "What is the most common accountability failure in AI initiatives?", opts: ["Accountability for outcomes rather than activity", "Too many stakeholders involved", "Accountability for activity rather than outcomes", "Board oversight that is too close"], correct: 2, exp: "The most common failure is measuring activity (models deployed, data ingested) rather than business outcomes." },
          { q: "Which is a warning signal that an AI project may be failing?", opts: ["Pilot phase concludes with a clear decision", "Vendor responds to missed metrics by remediating", "Pilot phases keep extending without a decision", "KPIs remain consistent across reporting cycles"], correct: 2, exp: "Pilot phases that keep extending rather than concluding with a decision are a key failure signal." },
        ],
      },
      {
        id: "t2m4",
        title: "Data literacy for AI leaders",
        dur: "90 min",
        type: "Presentation",
        summary: "Data quality, governance, ownership, and the relationship between enterprise data assets and AI capability",
        html: `<h3>Data is the constraint, not the algorithm</h3><p>The most common cause of AI project failure is not an inadequate model or the wrong vendor. It is poor data — discovered after the contract is signed, the integration is built, and the executive sponsor has publicly committed to the outcome. Data readiness for AI has four dimensions. <strong>Quality</strong>: is the data accurate, complete, and consistent? <strong>Volume</strong>: is there sufficient historical data? <strong>Accessibility</strong>: can the AI system reach the data in a usable, timely format? <strong>Governance</strong>: do we have the legal rights to use this data for this AI application under POPIA?</p><h3>The governance imperative for AI leaders</h3><p>Data governance is frequently treated as an administrative overhead. This view changes when AI enters the picture. Without data governance, AI systems run on data of unknown quality with unclear accountability for what happens when that data is wrong. When an AI model produces a discriminatory outcome, the governance question follows immediately: who knew this data was being used for this purpose, and did they have the authority to authorise it?</p><h3>Three data questions before any AI investment</h3><p>Before any AI initiative moves from proposal to planning: What specific data will this AI system use, and where does it currently sit? Has that data been assessed for quality, completeness, and regulatory compliance? If the AI model degrades or produces problematic outputs, what data audit process exists to diagnose the cause?</p>`,
        quiz: [
          { q: "What is the most common cause of AI project failure?", opts: ["Inadequate model selection", "Poor data quality discovered too late", "Wrong vendor choice", "Insufficient AI talent"], correct: 1, exp: "The most common cause is poor data — discovered after contracts are signed and commitments made." },
          { q: "Which dimension of data readiness covers legal rights to use data under POPIA?", opts: ["Quality", "Volume", "Accessibility", "Governance"], correct: 3, exp: "Governance covers the legal rights and organisational controls to use data for specific AI applications." },
        ],
      },
      {
        id: "t2m5",
        title: "AI vendor selection and management",
        dur: "90 min",
        type: "Case study workshop",
        summary: "Vendor evaluation framework, proof of concept design, contract negotiation, ongoing vendor management",
        html: `<h3>Reading an AI vendor proposal with appropriate scepticism</h3><p>AI vendor proposals contain predictable patterns that experienced buyers have learned to question. <strong>Accuracy claims without methodology</strong>: a vendor claiming 95% model accuracy without specifying what was predicted and what the baseline was is providing a number that carries no useful information. <strong>References from different contexts</strong>: what produced strong results for a US retailer may not translate to a South African financial services context. <strong>Data ownership ambiguity</strong>: any proposal that does not clearly state who owns the model improvements and IP generated during your deployment should be declined by your legal team.</p><h3>Designing the proof of concept that protects you</h3><p>A POC is not a free trial. It is a structured commercial agreement that establishes a performance threshold the vendor must meet before full deployment proceeds. A well-designed POC specifies the exact data used, the exact outcome metric evaluated, the performance threshold that must be met, the evaluation time frame, and what happens commercially if the threshold is not met. Without these specifications, a POC becomes a six-month delay with no binding decision at the end.</p><h3>Managing the ongoing vendor relationship</h3><p>AI vendor relationships follow a predictable arc: initial focus, followed by attention migrating to new clients. Counter this through the contract, not through relationship management. Include model performance review clauses, defined accuracy baselines with remediation obligations, escalation rights when performance degrades, and clear exit provisions if the vendor cannot maintain agreed standards.</p>`,
        quiz: [
          { q: "What makes a proof of concept different from a free trial?", opts: ["It is shorter", "It has a defined performance threshold with commercial consequences", "It is cheaper", "It requires fewer resources"], correct: 1, exp: "A POC is a structured commercial agreement with a performance threshold the vendor must meet before full deployment." },
          { q: "Which contract provision protects you if vendor performance degrades post-deployment?", opts: ["Jurisdiction clause", "Force majeure clause", "Model performance review clauses with remediation obligations", "Limitation of liability clause"], correct: 2, exp: "Model performance review clauses with defined accuracy baselines and remediation obligations protect you from performance degradation." },
        ],
      },
      {
        id: "t2m6",
        title: "AI in BFSI, mining, and retail",
        dur: "90 min",
        type: "Presentation",
        summary: "Sector-specific AI use cases in production; data requirements; regulatory considerations; competitive dynamics",
        html: `<h3>Financial services: AI across the value chain</h3><p>South Africa's major banks and insurers have moved well beyond AI experimentation. Credit decisioning AI — using machine learning trained on alternative data including mobile payment behaviour, utility payments, and retail transaction patterns — is extending credit to previously unscored segments. The governance case is equally critical: South African regulators are scrutinising algorithmic credit decisions for discriminatory outcomes.</p><p>Real-time fraud detection AI flags anomalies within milliseconds. Documented deployments at major South African banks show fraud loss reductions of 30 to 50 percent. Managing the false positive rate is a business decision with customer experience implications, not a technical optimisation.</p><h3>Mining and extractive industries</h3><p>South Africa's mining sector combines high-value extraction, dangerous environments, and ageing infrastructure. Predictive maintenance AI identifies equipment failure risk 48 to 72 hours before it becomes detectable by human monitoring. Documented deployments have reduced unplanned downtime by 15 to 25 percent. The prerequisite is sensor infrastructure. The correct sequence is instrument, then pipeline, then model.</p><h3>Retail and consumer sector</h3><p>South African retail AI is advancing along two primary vectors: demand forecasting AI incorporating historical sales, promotional calendars, weather, and economic indicators; and customer personalisation AI — recommendation engines, dynamic pricing, channel optimisation. The data infrastructure requirements are substantial, which is why smaller retail operators are typically two to three years behind the major chains in AI adoption.</p>`,
        quiz: [
          { q: "What is the correct sequence for deploying predictive maintenance AI in mining?", opts: ["Model → pipeline → instrument", "Pipeline → instrument → model", "Instrument → pipeline → model", "All simultaneously"], correct: 2, exp: "The correct sequence is instrument (set up sensors), then build the data pipeline, then train and deploy the model." },
          { q: "In fraud detection AI, the false positive rate determines:", opts: ["The accuracy of fraud detection", "How frequently legitimate transactions are blocked", "The speed of transaction processing", "The cost of the AI system"], correct: 1, exp: "The false positive rate determines how frequently legitimate customer transactions are blocked — a customer experience business decision." },
        ],
      },
      {
        id: "t2m7",
        title: "Change management for AI adoption",
        dur: "90 min",
        type: "Workshop",
        summary: "Organisational failure modes for AI; narrative design; early adopter strategy; embedding AI in existing workflows",
        html: `<h3>Where AI projects actually fail</h3><p>Technical failure is the least common cause of AI project failure. The more common causes are organisational: the business case was never clearly defined, change management was treated as a deployment communication task, or the workforce was informed rather than engaged. When employees experience AI as something being done to them rather than with them, the outcome is compliance without adoption — technically deployed AI that is never used consistently, quietly worked around, or actively undermined.</p><h3>Building an adoption narrative that lands</h3><p>People do not resist technology. They resist change that threatens their sense of competence, their working relationships, and their understanding of their own professional value. An effective AI adoption narrative is specific about what will change and what will not. It is honest about the transition period, the learning curve, and the support available. It is explicit about the capabilities that become more valuable as AI handles routine tasks — the judgment, the relationship management, the ethical reasoning that no AI system currently replicates.</p><p>The adoption narrative belongs to the business leader, not HR. Your credibility with your team determines whether they engage with AI as a professional development opportunity or resist it as a threat.</p><h3>Making AI stick in existing workflows</h3><p>AI that requires people to significantly change their workflow to use it will not be used consistently. The highest-adoption deployments integrate AI directly into tools people already use: AI-assisted drafting in the email platform, AI-powered search in the CRM, AI-generated summaries in the meeting platform. The design question: at exactly which step in the current workflow will this AI be accessed, and how many additional actions does accessing it require? If the answer is more than two, adoption will be structurally limited.</p>`,
        quiz: [
          { q: "What is the most common cause of AI adoption failure?", opts: ["Technical model failure", "Insufficient budget", "Organisational resistance — workforce informed rather than engaged", "Poor vendor selection"], correct: 2, exp: "Technical failure is the least common cause. Organisational failure — workforce informed rather than engaged — is more common." },
          { q: "AI in a workflow has structurally limited adoption when accessing it requires:", opts: ["One click", "Two steps or fewer", "More than two additional actions", "Integration with existing tools"], correct: 2, exp: "If accessing AI requires more than two additional actions in the current workflow, adoption will be structurally limited." },
        ],
      },
      {
        id: "t2m8",
        title: "Building your AI capability roadmap",
        dur: "120 min",
        type: "Capstone workshop",
        summary: "12-month AI capability roadmap for your function covering skills, tools, governance, and quick wins",
        html: `<h3>What a 12-month AI capability roadmap looks like</h3><p>An AI capability roadmap is not a technology deployment plan. It is a business capability plan that technology serves. A roadmap that plans only systems to be deployed will fail to address the people capability gaps, data infrastructure weaknesses, and governance requirements on which those systems depend. A 12-month AI capability roadmap covers four dimensions: <strong>People</strong> (what AI literacy and applied skills does your team need?), <strong>Data</strong> (what foundation improvements are required?), <strong>Governance</strong> (what oversight processes must exist before AI goes into production?), <strong>Technology</strong> (which AI tools will you deploy, in what sequence, against what success criteria?).</p><h3>Prioritising: what to put first</h3><p>The prioritisation framework has three inputs: strategic impact (how directly does this AI use case contribute to the function's most important outcome?), data readiness (is the required data available at sufficient quality?), and change complexity (how much workflow change does adoption require?). High-impact, data-ready, low-change-complexity use cases lead the roadmap. High-impact, data-poor use cases become the data foundation investment priorities for months three through twelve.</p><h3>The public commitment that makes it real</h3><p>This capstone concludes with each participant making a specific public commitment: the AI capability outcome they will deliver in the first 90 days, and the name of the colleague who will hold them accountable. Research on commitment and accountability consistently demonstrates that specific, public commitments made to named individuals have significantly higher follow-through rates than private intentions.</p>`,
        quiz: [
          { q: "The four dimensions of a 12-month AI capability roadmap are:", opts: ["Strategy, budget, timeline, resources", "People, data, governance, technology", "Vision, pilots, scale, sustain", "Assess, design, build, operate"], correct: 1, exp: "A capability roadmap covers People, Data, Governance, and Technology — not just systems to deploy." },
          { q: "Which use cases should lead the AI capability roadmap?", opts: ["The most technically impressive use cases", "Use cases with the highest vendor support", "High-impact, data-ready, low-change-complexity use cases", "Pilot projects from peer organisations"], correct: 2, exp: "High-impact, data-ready, low-change-complexity use cases lead — they are most likely to deliver early demonstrable value." },
        ],
      },
    ],
  },

  {
    id: "t3",
    name: "AI Practitioner",
    level: "Tier 3",
    color: "#C17F24",
    colorLight: "rgba(193,127,36,0.12)",
    icon: "◉",
    audience: "Analysts, Project Managers, Team Leads, Specialists",
    duration: "Self-paced platform + monthly live Q&A",
    description: "Practical AI literacy for professionals who need to work effectively with AI tools in their daily roles.",
    mods: [
      {
        id: "t3m1",
        title: "AI foundations: what it is and isn't",
        dur: "60 min",
        type: "Platform module",
        summary: "Types of AI, capabilities and limitations, identifying genuine AI vs marketing claims",
        html: `<h3>Three AI categories any professional needs to understand</h3><p><strong>Machine learning</strong> finds patterns in historical data. When your bank flags a suspicious transaction, when a recommendation engine suggests your next purchase, when a logistics system reroutes a delivery — machine learning is typically at work. It requires historical data to learn from, and it reflects the patterns in that data, including any biases those patterns contain.</p><p><strong>Generative AI</strong> creates new content: text, summaries, code, translations, analysis. The AI tools you may already be using to draft communications, summarise documents, or work through problems are generative AI systems. They produce confident outputs that are sometimes wrong. Verification of important outputs is a professional responsibility, not an optional extra.</p><p><strong>Automation</strong> follows defined rules without learning. Many products marketed as "AI-powered" are primarily automation — valuable, auditable, and appropriate for a different class of problem. Automation does exactly what its rules specify, always.</p><h3>What AI genuinely cannot do</h3><p>AI cannot verify its own outputs. A generative AI system produces the most statistically plausible continuation of the prompt, not the most factually accurate one. This is the root cause of hallucination: confident, fluent, well-structured output that is factually wrong. Treat AI-generated factual claims with appropriate scrutiny before acting on them professionally.</p><h3>Spotting genuine AI in your organisation</h3><p>A quick assessment: does the system adapt its responses based on new information, or does it follow fixed rules? Systems that follow rules, produce identical outputs, and lack a described learning mechanism are likely automation rebranded. Understanding the difference protects your professional decisions and your organisation's governance.</p>`,
        quiz: [
          { q: "Which AI type produces 'hallucinations' — confident, well-formed output that is factually wrong?", opts: ["Machine learning", "Automation", "Generative AI", "Rules-based systems"], correct: 2, exp: "Generative AI produces the most statistically plausible continuation of a prompt — not necessarily the most accurate one." },
          { q: "How can you identify automation rebranded as 'AI'?", opts: ["It is more expensive", "It requires no historical data", "It follows fixed rules and produces identical outputs for identical inputs", "It was built by a large tech company"], correct: 2, exp: "Automation follows fixed rules and produces identical outputs for identical inputs — unlike genuine learning AI systems." },
        ],
      },
      {
        id: "t3m2",
        title: "Prompt engineering for professionals",
        dur: "60 min",
        type: "Platform module",
        summary: "How to write instructions to AI tools that produce useful outputs; role-specific templates and frameworks",
        html: `<h3>The instruction gap and why it matters</h3><p>Most professionals who report that AI tools produce unhelpful outputs are experiencing an instruction gap rather than a capability gap. "Write a summary of this document" is a complete instruction. "Write a three-paragraph executive summary for a non-technical CFO, highlighting the two most significant financial risks and the recommended immediate action" is an effective instruction. The gap between those two prompts is the gap between an output you discard and one you use directly.</p><h3>The anatomy of an effective professional prompt</h3><p>An effective professional prompt has four components. <strong>Role</strong>: who or what should the AI behave as? Assigning a role (financial analyst, legal reviewer, executive communications writer) activates relevant patterns in the AI's output. <strong>Context</strong>: what is the situation? Without context, the AI makes assumptions that may not match your needs. <strong>Task</strong>: what specifically should the AI do? The more precise the task, the more useful the output. <strong>Format</strong>: what should the result look like? Specifying length, structure, and tone prevents the AI from making decisions you would have made differently.</p><h3>When the output is not what you needed</h3><p>When an AI output falls short, diagnose which of the four components was insufficient before retrying. Generic output usually means missing context. Output that misses the point usually means an ambiguous task description. Output that is too long or poorly structured usually means the format was unspecified. Developing the habit of diagnosing before retrying is the skill that separates professionals who become genuinely productive with AI tools from those who remain frustrated by them.</p>`,
        quiz: [
          { q: "What are the four components of an effective professional prompt?", opts: ["Length, tone, subject, audience", "Role, context, task, format", "Purpose, data, output, review", "Input, processing, output, verification"], correct: 1, exp: "Role, Context, Task, and Format — all four together consistently produce better outputs than task alone." },
          { q: "Generic AI output that misses the point usually signals:", opts: ["An ambiguous task description", "Missing context", "Unspecified format", "Too long a prompt"], correct: 0, exp: "Output that misses the point usually means the task description was ambiguous — the AI did not know specifically what to do." },
        ],
      },
      {
        id: "t3m3",
        title: "AI in your workflow: practical applications",
        dur: "60 min",
        type: "Platform module",
        summary: "Role-by-role guide to AI integration; specific tools and use cases for finance, HR, ops, marketing, legal",
        html: `<h3>Finance, analytics, and data work</h3><p>Finance and analytics professionals can use generative AI to draft management account commentary, translate complex financial data into executive-readable language, generate variance explanations, structure financial models, review documents for completeness, and prepare Q&A for board presentations. The discipline: AI-generated financial commentary must be reviewed against source data before use. A hallucinated figure in a management report creates professional risk that the time saved by AI drafting does not offset. The professional standard is AI drafts, human verifies.</p><h3>HR, people, and communications</h3><p>HR and communications professionals can use generative AI to draft job descriptions, adapt performance review frameworks, structure difficult conversation guides, draft internal announcements, summarise engagement survey verbatim responses, and prepare leadership briefings. The discipline for HR use: AI-generated content that influences decisions about people must be reviewed for potential bias before use. AI systems can reproduce historical hiring and assessment patterns — including patterns that reflect historical bias.</p><h3>Operations, marketing, and legal</h3><p>Operations teams can use AI for process documentation, supplier communications, data analysis narration, and meeting preparation. Marketing teams for content drafting, campaign briefs, audience segmentation descriptions, and performance report summaries. Legal and compliance professionals for contract review support, regulatory change summaries, and policy drafting — with the firm professional standard that AI-generated legal content requires qualified human review before any reliance, in every circumstance. Across all functions: AI accelerates the draft, human expertise validates the output.</p>`,
        quiz: [
          { q: "The professional standard for AI-generated financial commentary is:", opts: ["AI produces and publishes directly", "AI drafts, human verifies against source data", "Human drafts, AI refines", "AI drafts, manager approves without checking"], correct: 1, exp: "AI drafts, human verifies — a hallucinated figure in a management report creates risk the time savings do not offset." },
          { q: "AI-generated legal content should always:", opts: ["Be used directly if from a reputable AI system", "Be reviewed by qualified humans before any reliance", "Be marked as AI-generated and used without review", "Only be used for low-stakes documents"], correct: 1, exp: "AI-generated legal content requires qualified human review before any reliance, in every circumstance." },
        ],
      },
      {
        id: "t3m4",
        title: "Data thinking: reading AI outputs critically",
        dur: "45 min",
        type: "Platform module",
        summary: "Hallucination, bias, overconfidence; how to interrogate AI outputs; when to trust and when to check",
        html: `<h3>The hallucination problem: what it is and why it happens</h3><p>Generative AI systems produce text that is fluent, confident, and structurally correct regardless of whether it is factually accurate. They generate the most statistically plausible continuation of a prompt, not the most factually accurate one. When the model's training data does not contain a reliable answer, it synthesises a plausible one from related patterns. The result looks identical to accurate output.</p><p>The practical defence: never rely on an AI-generated factual claim in a professional context without independent verification when accuracy matters. This applies to statistics, regulatory requirements, case precedents, names, dates, and any other domain-specific claim. The time invested in verification is consistently less than the time required to remediate an error that was acted upon as fact.</p><h3>Bias in AI outputs</h3><p>AI systems reflect the patterns in their training data. If historical data contains patterns of human bias — in hiring, lending, language, or representation — the AI system will reproduce those patterns. An AI drafting job descriptions trained on historical postings may use language that signals preference for certain demographic groups. The professional responsibility is to recognise when AI outputs may carry these patterns and to apply critical review before use.</p><h3>A practical verification approach</h3><p>Before acting on an AI output professionally, ask: Is this a factual claim? If so, have I verified it? Does this output affect a decision about a person? If so, have I reviewed it for potential bias? Is this output consistent with my professional knowledge? If not, which is wrong — and why? These questions take thirty seconds and could prevent significant professional harm.</p>`,
        quiz: [
          { q: "Hallucination in generative AI means:", opts: ["The AI refuses to answer", "The AI produces confident, well-formed output that is factually wrong", "The AI generates images instead of text", "The AI provides multiple contradictory answers"], correct: 1, exp: "Hallucination is confident, fluent, structurally correct output that is factually wrong — it looks identical to accurate output." },
          { q: "AI bias in outputs occurs because:", opts: ["AI is programmed to discriminate", "AI systems reflect patterns in their training data, including historical biases", "AI cannot process diverse data", "Vendors deliberately introduce bias"], correct: 1, exp: "AI systems mechanically reproduce patterns in their training data — including any historical biases those patterns contain." },
        ],
      },
      {
        id: "t3m5",
        title: "AI ethics and responsible use",
        dur: "45 min",
        type: "Platform module",
        summary: "Privacy in AI context, bias in AI outputs, responsible use policy, escalation channels",
        html: `<h3>Privacy in practice: what changes when AI is involved</h3><p>POPIA governs how personal information is collected, processed, and used in South Africa. When you use an AI tool to process information about colleagues, customers, job applicants, or any individual, POPIA applies — regardless of whether that tool is approved by your organisation. Before passing personal information to any AI tool, confirm: has this tool been approved by your IT and legal functions for this data type? Is the data processed by a third-party AI service that may store or use it for model training? Does using this data with this AI tool fall within the purpose for which it was originally collected and consented? When in doubt, remove or anonymise personal information before using AI on it.</p><h3>Your personal AI use policy</h3><p>A professional AI use policy is a personal set of standards, not just a reference to your organisation's policy. It has three elements: <strong>Verification</strong> (what you commit to checking before relying on AI outputs for professional decisions), <strong>Privacy</strong> (what categories of information you will not pass to external AI tools), and <strong>Transparency</strong> (when you will disclose that AI was used in producing a deliverable, and to whom).</p><h3>When and how to raise a concern</h3><p>If you encounter an AI system producing outputs that appear biased, factually unreliable, discriminatory, or inconsistent with regulatory requirements, you have a professional obligation to raise it. The appropriate escalation path typically includes your direct manager, the data governance or IT risk function, and in significant cases the legal or compliance team. Raising a concern when you first notice a potential problem is significantly less costly than raising it after harm has occurred.</p>`,
        quiz: [
          { q: "Before passing personal information to an AI tool, you should confirm:", opts: ["The AI tool is popular and widely used", "The tool has been approved by IT and legal for this data type", "Your manager used the same tool previously", "The tool's terms of service are available online"], correct: 1, exp: "Confirm the tool is approved by IT and legal for this specific data type, and that use is within POPIA-consented purposes." },
          { q: "Your personal AI use policy should cover:", opts: ["Tool preferences and pricing plans", "Verification, privacy, and transparency standards", "Vendor relationships and renewal dates", "Technical specifications and integration requirements"], correct: 1, exp: "A personal AI use policy covers: what you verify before relying on outputs, what data you won't share, and when you disclose AI use." },
        ],
      },
      {
        id: "t3m6",
        title: "AI Practitioner certification assessment",
        dur: "30 min",
        type: "Assessment",
        summary: "Knowledge assessment covering all five modules; 80% required to pass; digital certificate shareable on LinkedIn",
        html: `<h3>What this assessment covers</h3><p>The Digilytics AI Practitioner certification assessment covers all five prior modules: AI foundations, prompt engineering for professionals, AI in your workflow, critical evaluation of AI outputs, and AI ethics and responsible use. Questions are drawn proportionally from each module and designed to test applied understanding — whether you can apply what you have learned to realistic professional scenarios.</p><h3>How it works and what to expect</h3><p>You need a score of 80 percent or above to pass. There is no limit on the number of attempts. The recommended approach is to complete all five prior modules in sequence, allow at least one day before attempting the assessment, and approach it when you feel genuinely prepared. If you do not pass on the first attempt, review the modules covering the topics where you scored lowest and reattempt.</p><h3>Your Digilytics AI Practitioner Certificate</h3><p>On passing, you receive the Digilytics AI Practitioner Certificate — a digital credential designed to be shared on your LinkedIn profile and professional portfolio. The certificate confirms that you have demonstrated foundational AI literacy appropriate for a professional operating in an AI-enabled organisation: the ability to use AI tools effectively, evaluate AI outputs critically, apply AI to your functional role, and understand the ethical and governance obligations that accompany professional AI use.</p>`,
        quiz: [
          { q: "What score is required to pass the AI Practitioner certification assessment?", opts: ["60%", "70%", "80%", "90%"], correct: 2, exp: "You need a score of 80 percent or above to pass the AI Practitioner certification." },
          { q: "The AI Practitioner Certificate is designed to signal:", opts: ["Programme completion only", "Applied capability: effective use, critical evaluation, ethics, and governance", "Technical programming skill", "Leadership and strategy capability"], correct: 1, exp: "The certificate signals applied capability — using AI effectively, evaluating outputs critically, and understanding governance obligations." },
        ],
      },
    ],
  },
];

export function getTierById(id) {
  return TIERS.find((t) => t.id === id);
}

export function getTiersForRole(role) {
  const ids = ROLE_TIERS[role] || [];
  return TIERS.filter((t) => ids.includes(t.id));
}

export function getModuleById(tierId, moduleId) {
  const tier = getTierById(tierId);
  return tier?.mods.find((m) => m.id === moduleId) || null;
}

// Legacy compat
export function getTierForXP(xp) {
  if (xp >= 3000) return { name: "Authority" };
  if (xp >= 1500) return { name: "Specialist" };
  if (xp >= 500) return { name: "Practitioner" };
  return { name: "Explorer" };
}
