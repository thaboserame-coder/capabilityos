/**
 * Curriculum data for CapabilityOS.
 *
 * Architectural note: in the original prototype each tier embedded a
 * `lucide-react` component reference directly (`icon: Target`). That couples
 * pure data to a UI library and breaks if this data is ever served from a
 * CMS/API (icons can't be serialised to JSON). Here each tier instead carries
 * an `iconKey` string; `src/theme/icons.js` maps that key to the actual
 * lucide-react component for rendering.
 *
 * @typedef {Object} QuizModule
 * @property {string} id - Unique module id, namespaced per tier (e.g. "t1m1")
 * @property {string} title
 * @property {string} dur - Human-readable duration, e.g. "90 min"
 * @property {string} type - Delivery format, e.g. "Workshop"
 * @property {string} summary - One-line summary shown in module lists
 * @property {string} html - Rich HTML content rendered inside `.ch`
 *
 * @typedef {Object} Tier
 * @property {string} id - Unique tier id ("t1" | "t2" | "t3")
 * @property {string} name - Tier display name
 * @property {string} level - Tier label, e.g. "Tier 1"
 * @property {string} color - Primary accent colour for this tier
 * @property {string} colorLight - Light/translucent variant for backgrounds
 * @property {string} iconKey - Key into ICONS map (see theme/icons.js)
 * @property {string} audience - Who this tier is designed for
 * @property {string} duration - Delivery format / cadence
 * @property {string} description - Tier summary
 * @property {QuizModule[]} mods - Ordered list of modules in this tier
 */

/** @type {Tier[]} */
export const TIERS = [
  {
    id: "t1",
    name: "AI Executive",
    level: "Tier 1",
    color: "#0072C6",
    colorLight: "rgba(0,114,198,0.15)",
    iconKey: "target",
    audience: "Board members, C-suite, Group Executives, NEDs",
    duration: "2-day immersive + platform access",
    description:
      "Strategic AI literacy for the people who set direction, approve investment, and govern risk.",
    mods: [
      {
        id: "t1m1",
        title: "The AI mandate: why boards can no longer delegate",
        dur: "90 min",
        type: "Facilitated discussion",
        summary:
          "Board-level AI governance, three strategic risks of AI investment (over/under/wrong), and the board's shifting accountability",
        html: `<h3>The mandate is no longer optional</h3><p>In 2024, McKinsey estimated that AI could deliver up to $4.4 trillion in annual productivity gains globally. By 2025, 72% of Fortune 500 companies had integrated AI into at least one core business function. The question is no longer whether AI will transform your industry — the question is whether your organisation will lead that transformation, or be led by it.</p><h3>The three strategic risks</h3><p><strong>Over-investment risk</strong> — committing capital without a clear return hypothesis, driven by vendor or peer pressure. This is where most R50m–R200m AI failures happen. <strong>Under-investment risk</strong> — moving too slowly while competitors build data moats and AI-native capabilities. <strong>Wrong-investment risk</strong> — the most common and least discussed: investing at the right scale and timing but in the wrong things — AI tools without data governance, AI talent without change management, AI pilots without a path to production.</p><h3>The board's role has shifted</h3><p>For most of the past decade, AI was considered an IT matter. That delegation is now a strategic liability. When AI systems fail, it is not the CTO who answers to shareholders — it is the board. Your role is not to become a data scientist. It is to ask the questions no one else in the room will ask: Do we have the data to support this? Who is accountable if it fails? What is our liability if this AI model discriminates against a customer? Are we measuring AI outcomes or AI activity?</p>`,
      },
      {
        id: "t1m2",
        title: "How AI actually works — a leader's mental model",
        dur: "90 min",
        type: "Presentation + Q&A",
        summary:
          "Conceptual understanding of ML, generative AI, and automation; the data dependency; why some AI projects fail before they start",
        html: `<h3>Why conceptual literacy matters</h3><p>Understanding how AI works at a conceptual level changes how you allocate budget, evaluate vendor proposals, and manage risk. You do not need to write code. You do need to understand why some AI projects fail before they start — and that knowledge is structural, not technical.</p><h3>The three types you will encounter</h3><p><strong>Machine learning</strong>: systems that learn patterns from historical data and improve with more data — credit scoring, fraud detection, demand forecasting. <strong>Generative AI</strong>: systems that create new content — text, images, code, analysis — based on patterns learned during training. <strong>Automation</strong>: rules-based systems that follow predefined logic, often incorrectly labelled as AI by vendors. The distinction matters because each type has different data requirements, failure modes, and cost profiles. Buying a generative AI tool to solve a machine learning problem is a common and expensive mistake.</p><h3>The data dependency is non-negotiable</h3><p>Every AI system is only as good as the data it receives. An AI predicting credit risk is trained on historical credit data. An AI detecting machinery failure is trained on sensor readings. This is why the most important AI question is not "what AI tool should we buy?" It is "what data do we have, and is it clean enough, complete enough, and governed well enough to support this use case?"</p>`,
      },
      {
        id: "t1m3",
        title: "AI investment decisions: allocating capital without wasting it",
        dur: "90 min",
        type: "Case study workshop",
        summary:
          "Build vs buy vs partner decision framework; vendor red flags; the five questions before any AI investment over R5m",
        html: `<h3>The build / buy / partner decision</h3><p>Build is right when you have a unique data asset and a clear competitive advantage from owning the model. Buy is right when the use case is standard and a commercial solution exists. Partner is right when speed is paramount and you lack the internal capability to evaluate or govern. Most organisations default to Buy when they lack data governance, or to Build when they lack engineering talent — both predictable and expensive failures.</p><h3>Red flags in vendor proposals</h3><p>Be cautious of: accuracy claims not accompanied by test methodology; "AI" labelling on what is clearly a rules engine; proposals that depend on clean, structured data you do not have; contracts that give the vendor ownership of model improvements trained on your data; references from different industries or geographies that do not translate to your context.</p><h3>The five questions before any AI investment</h3><p>Before committing to any AI investment above R5m, your team should be able to answer: What specific outcome will this AI improve? How will we measure it? What is the baseline cost of the current state? What is our hypothesis for the AI-driven improvement? And who is personally accountable for the result? If any answer is missing, the investment is not ready.</p>`,
      },
      {
        id: "t1m4",
        title: "AI governance and the board's accountability",
        dur: "90 min",
        type: "Facilitated discussion",
        summary:
          "POPIA and EU AI Act implications for South African boards; the board's five oversight questions; AI ethics as governance",
        html: `<h3>The regulatory landscape</h3><p>South African organisations operate under POPIA, which governs how AI systems collect, process, and use personal data. The EU AI Act categorises AI systems by risk level and imposes obligations on high-risk applications including credit decisioning, employment screening, and law enforcement. South African regulators are watching its implementation closely, and global enterprises operating here are increasingly required to comply.</p><h3>The board's five oversight questions</h3><p>The board's role is not to govern AI technically. It is to ensure management has the right framework in place and that AI use is consistent with the organisation's values and obligations. Every board should be able to answer: What AI systems are we operating? What data do they use? Who is accountable for their accuracy and fairness? What happens when they fail? And how do we know?</p><h3>AI ethics is a governance issue, not a soft issue</h3><p>A South African financial services firm deploying a credit scoring AI that systematically underscores certain demographic groups is not facing an ethical problem — it is facing a legal and reputational catastrophe. AI bias is difficult to detect without deliberate auditing, which is exactly why it compounds. The board must require regular, independent model audits as a matter of policy, not aspiration.</p>`,
      },
      {
        id: "t1m5",
        title: "AI in your sector: African enterprise case studies",
        dur: "90 min",
        type: "Presentation + discussion",
        summary:
          "AI in production across BFSI, mining, retail, and public sector in South Africa; quantified outcomes; transferable patterns",
        html: `<h3>Financial services</h3><p>South Africa's major banks have moved AI from experimentation to production across three domains: credit decisioning (using ML trained on alternative data to extend credit to previously unscored customers), fraud detection (real-time AI flagging anomalous transaction patterns within milliseconds), and customer personalisation (recommendation engines adapting offers and channels to individual behaviour). Fraud detection AI has reduced losses by 30–50% in documented deployments.</p><h3>Mining</h3><p>South Africa's mining industry creates a compelling AI use case: high-value extraction, dangerous environments, and ageing infrastructure. Predictive maintenance AI — trained on vibration, temperature, and operational data — can identify equipment failure risk 48–72 hours before human operators detect warning signs. Several South African mining houses have reduced unplanned downtime by 15–25% through these systems.</p><h3>Retail and consumer</h3><p>South African retailers face specific supply chain challenges: long lead times, high transport costs, and demand patterns that vary significantly by region and income band. AI-powered demand forecasting — incorporating weather, events, promotional calendars, and historical sales — has become a key capability for major grocery and fashion retailers. The competitive advantage is not cost reduction alone. It is availability: the product on the shelf when the customer walks in, not three days later.</p>`,
      },
      {
        id: "t1m6",
        title: "Building your 90-day AI leadership agenda",
        dur: "90 min",
        type: "Workshop",
        summary:
          "The now/next/later framework; identifying quick wins; stakeholder mapping; making accountability concrete",
        html: `<h3>The mechanism, not the motivation</h3><p>The most dangerous outcome from a leadership programme is motivation without mechanism. You leave energised, return to the office, and within two weeks the pressure of the current state has absorbed the ambition of the future state. The 90-day AI agenda is a mechanism — a personal accountability tool, not a strategy document.</p><h3>The now / next / later framework</h3><p><strong>Now (Days 1–30)</strong>: Actions that signal intent and build internal credibility — visible, low-cost, reversible. Commission an internal AI inventory. Schedule an ExCo AI education session. Nominate a named AI champion from within your function. <strong>Next (Days 31–60)</strong>: Actions that build infrastructure — medium-effort, medium-reversibility. Define your first AI pilot hypothesis. Establish a simple AI risk reporting line. Commit to a data governance baseline review. <strong>Later (Days 61–90)</strong>: Strategic bets, made with the foundation now in place.</p><h3>Your commitment</h3><p>This programme ends today. Your accountability starts tomorrow. Write one sentence: the AI outcome you commit to delivering in 90 days, and the person you will ask to hold you accountable. That sentence is more valuable than anything else in this programme — because it is the moment strategy becomes action.</p>`,
      },
    ],
  },
  {
    id: "t2",
    name: "AI Leader",
    level: "Tier 2",
    color: "#1D9E75",
    colorLight: "rgba(29,158,117,0.15)",
    iconKey: "users",
    audience: "VPs, GMs, Functional Heads, Senior Managers",
    duration: "4-day cohort + platform access",
    description:
      "Operational AI leadership for the layer that executes strategy, manages vendors, and builds team capability.",
    mods: [
      {
        id: "t2m1",
        title: "AI fundamentals for business leaders",
        dur: "90 min",
        type: "Presentation",
        summary:
          "Types of AI, data requirements, and how to participate confidently in AI decisions",
        html: `<h3>The vocabulary problem</h3><p>Every week, someone in your organisation makes a decision about AI without fully understanding what they are approving. Budgets are allocated, vendors are selected, and projects are launched — all in a language most senior leaders have not been taught. This module does not make you technical. It gives you the vocabulary to participate fully in conversations that are currently happening without you, and to recognise the claims that do not survive scrutiny.</p><h3>The three AI types that determine how you invest and govern</h3><p><strong>Machine learning</strong> builds statistical models from historical data and improves with more data over time. Credit scoring, fraud detection, demand forecasting, and equipment failure prediction are all machine learning applications. Data quality and data volume are prerequisites — not nice-to-haves. An ML model trained on incomplete or biased historical data will produce incomplete or biased predictions at scale.</p><p><strong>Generative AI</strong> creates new content — text, summaries, code, analysis — drawn from patterns across vast training datasets. It is versatile, fast, and productive. It is also prone to confident errors. It cannot distinguish between what it knows and what it has plausibly synthesised. Every generative AI output used in a professional context requires human review where accuracy matters.</p><p><strong>Automation</strong> follows predefined rules without learning. Many products labelled as "AI-powered" are primarily automation — valuable, but governed and evaluated differently. The distinction matters because automation is cheap to audit and appropriate for a different class of problem than machine learning or generative AI. Confusing them leads to misplaced investment and governance gaps.</p><h3>What AI cannot do — the part vendors skip</h3><p>AI cannot exercise judgment. It cannot weigh competing values, navigate genuine ethical ambiguity, or decide that a policy is unjust and should be challenged. AI cannot reliably apply knowledge to scenarios outside its training distribution. It cannot explain its reasoning in ways that are always traceable or meaningful. These are not temporary engineering limitations — they are structural features of current AI systems that make human oversight non-negotiable, not optional.</p>`,
      },
      {
        id: "t2m2",
        title: "Identifying AI opportunities in your function",
        dur: "90 min",
        type: "Workshop",
        summary:
          "Structured opportunity-identification method; AI feasibility assessment; prioritisation framework",
        html: `<h3>Where AI value actually lives</h3><p>The highest-value AI use cases share a structural pattern: high volume, historical data, a clear outcome metric, and a current process that relies on human judgment applied repeatedly at scale. Credit scoring, fraud flagging, document classification, demand forecasting, equipment failure prediction — all fit this pattern. The cases that do not tend to produce projects that struggle to show ROI — not because the AI is inadequate, but because the use case was never structured for AI in the first place.</p><p>The practical test: if I removed the AI from this process tomorrow, would the impact be measurable in cost, speed, quality, or risk? If the answer is no, the AI is adding complexity rather than value. Apply this test before any AI initiative advances past the concept stage.</p><h3>The feasibility filter: three questions before any opportunity advances</h3><p>For any AI opportunity identified within your function, apply three filters before it enters your priority list. First: do we have the historical data to support this use case? Data that does not exist cannot be acquired after the contract is signed. Second: is the problem large enough to justify AI investment and the change it requires? Small problems solved elegantly by AI are still small problems. Third: is there a clear, measurable outcome we can use to know whether the AI is working? If the outcome cannot be measured, neither can the return on investment.</p><p>Opportunities that fail any filter are not eliminated — they are placed in a different queue: build the data foundation first, fix the measurement problem first, then return with a redesigned proposal.</p><h3>Building your function's AI shortlist</h3><p>The deliverable from this module is a shortlist of three AI opportunities within your specific function, each passed through the feasibility filter and ranked by potential value. The format is deliberately simple: problem statement, current cost or quality gap, data availability assessment, proposed AI approach, and success metric. Three opportunities, one page, clear enough for an executive conversation. The discipline of limiting to three is not about constraining ambition — it is about preventing the diffuse, unfocused AI investment that characterises organisations where no one has done this work.</p>`,
      },
      {
        id: "t2m3",
        title: "Leading AI initiatives without being technical",
        dur: "90 min",
        type: "Facilitated discussion",
        summary:
          "Problem articulation, vendor accountability, change management, and escalation triggers for AI sponsors",
        html: `<h3>The non-technical leader's genuine advantage</h3><p>The best AI initiative sponsors are not the most technical people in the room. They are the most clear. Clarity about the problem being solved, clarity about the outcome that will signal success, and clarity about who is accountable for delivery — these are leadership functions, not technical ones. In organisations where AI projects succeed, the business leader sponsor can articulate in one sentence what problem the AI is solving and what it will look like when it has been solved. In organisations where projects fail, that sentence does not exist, and no amount of technical sophistication compensates for its absence.</p><h3>Creating accountability structures that work</h3><p>The most common accountability failure in AI initiatives is accountability for activity rather than outcomes: measuring models deployed, data sets ingested, vendor meetings attended. These are inputs, not outcomes. Accountability for outcomes means naming a specific, measurable business result — fraud losses reduced by 15%, credit processing time reduced from five days to same-day, customer service resolution rate improved by 20% — and assigning a named individual who owns it. That individual should be the business leader who benefits from the outcome, not the technical team that builds the capability.</p><p>The second common failure: accountability that sits too low in the organisation. When AI initiative ownership belongs to a VP of Data or a technology function rather than a business leader, the business case disappears at the first sign of complexity. Technology teams have no authority to resolve the process, workflow, or organisational changes that AI deployment typically requires. That authority lives with the business.</p><h3>Recognising and responding to failure signals</h3><p>Most AI projects that ultimately fail showed visible warning signals that were ignored. Pilot phases that keep extending rather than concluding with a decision. Vendors who respond to missed performance metrics with scope expansion rather than remediation. Key performance indicators that change between reporting cycles rather than being hit. These are not technical problems — they are leadership problems that require a leadership response. The most valuable capability an AI sponsor develops is the ability to stop a failing project before it becomes an expensive cautionary tale. That decision requires clarity of judgment that no technical expertise can substitute.</p>`,
      },
      {
        id: "t2m4",
        title: "Data literacy for AI leaders",
        dur: "90 min",
        type: "Presentation",
        summary:
          "Data quality, governance, ownership, and the relationship between enterprise data assets and AI capability",
        html: `<h3>Data is the constraint, not the algorithm</h3><p>The most common cause of AI project failure is not an inadequate model or the wrong vendor. It is poor data — discovered after the contract is signed, the integration is built, and the executive sponsor has publicly committed to the outcome. The way to prevent this is to assess your data readiness before designing your AI initiative, not after. An AI system is only as capable as the data it receives. A sophisticated model fed poor data produces sophisticated errors at scale.</p><p>Data readiness for AI has four dimensions. Quality: is the data accurate, complete, and consistent enough to train or validate a model? Volume: is there sufficient historical data for the use case? Accessibility: can the AI system reach the data in a usable, timely format? Governance: do we have the legal rights and organisational controls to use this data for this AI application under POPIA and applicable regulation? Any dimension that is weak becomes the project constraint — and the most expensive version of discovering a data constraint is during deployment, not during planning.</p><h3>The governance imperative for AI leaders</h3><p>Data governance — the policies, roles, and processes that determine how data is collected, stored, accessed, and used — is frequently treated as an administrative overhead rather than a strategic investment. This view changes when AI enters the picture. Without data governance, AI systems run on data of unknown quality with unclear accountability for what happens when that data is wrong, incomplete, or used outside its consented scope. When an AI model produces a discriminatory outcome, the governance question follows immediately: who knew this data was being used for this purpose, and did they have the authority to authorise it?</p><h3>Three data questions before any AI investment</h3><p>Before any AI initiative moves from proposal to planning, your team must be able to answer three questions. First: what specific data will this AI system use, and where does it currently sit? Second: has that data been assessed for quality, completeness, and regulatory compliance — and by whom? Third: if the AI model degrades or produces problematic outputs, what data audit process exists to diagnose the cause? Initiatives that cannot answer all three questions should not advance until they can. The discipline of asking these questions before commitment is worth significantly more than any mitigation effort after deployment.</p>`,
      },
      {
        id: "t2m5",
        title: "AI vendor selection and management",
        dur: "90 min",
        type: "Case study workshop",
        summary:
          "Vendor evaluation framework, proof of concept design, contract negotiation, ongoing vendor management",
        html: `<h3>Reading an AI vendor proposal with appropriate scepticism</h3><p>AI vendor proposals contain predictable patterns that experienced buyers have learned to question. Accuracy claims without methodology: a vendor claiming 95% model accuracy without specifying what was being predicted, what the test set contained, and what the baseline comparison was is providing a number that carries no useful information. References from different contexts: what produced strong results for a US retailer with 50 million customer transactions does not automatically translate to a South African financial services context with three million. Data ownership ambiguity: any proposal that does not clearly state who owns the model, the training data improvements, and the IP generated during your deployment should be declined by your legal team until it does.</p><h3>Designing the proof of concept that protects you</h3><p>A proof of concept is not a free trial or a relationship-building exercise. It is a structured commercial agreement that establishes a performance threshold the vendor must meet before full deployment proceeds. A well-designed POC specifies the exact data that will be used, the exact outcome metric that will be evaluated, the exact performance threshold that must be met for the project to proceed, the evaluation time frame, and what happens commercially if the threshold is not met. Without these specifications, a POC becomes a six-month delay with no binding decision at the end — and a vendor who has learned your data and your processes at your expense.</p><p>The data you provide for a POC is real organisational data. Treat it with the same governance discipline you would apply to any data-sharing arrangement. Confirm in writing how the vendor will store, use, and dispose of it after the POC concludes.</p><h3>Managing the ongoing vendor relationship</h3><p>AI vendor relationships follow a predictable arc: initial focus and capability demonstration, followed by attention migrating to new client relationships while your deployment is managed by junior staff. Counter this through the contract, not through relationship management. Include model performance review clauses, defined accuracy baselines with remediation obligations, escalation rights when performance degrades, and clear exit provisions if the vendor cannot maintain agreed standards. A degrading AI model can cause significant financial and reputational harm before it is detected without these mechanisms in place. The time to negotiate them is before you sign, not after the first performance decline.</p>`,
      },
      {
        id: "t2m6",
        title: "AI in BFSI, mining, and retail",
        dur: "90 min",
        type: "Presentation",
        summary:
          "Sector-specific AI use cases in production; data requirements; regulatory considerations; competitive dynamics",
        html: `<h3>Financial services: AI across the value chain</h3><p>South Africa's major banks and insurers have moved well beyond AI experimentation. Credit decisioning AI — using machine learning trained on alternative data including mobile payment behaviour, utility payments, and retail transaction patterns — is extending credit to previously unscored segments. The commercial case is compelling: larger addressable markets, faster decisioning, and improved loss rates when models are well-governed. The governance case is equally critical: South African regulators are scrutinising algorithmic credit decisions for evidence of discriminatory outcomes, and institutions have faced compliance consequences. The AI is only as fair as the data it is trained on.</p><p>Real-time fraud detection AI processes transaction volumes that human review cannot match, flagging anomalies within milliseconds. Documented deployments at major South African banks show fraud loss reductions of 30 to 50 percent. The operational challenge is not detection accuracy — it is the false positive rate, which determines how frequently legitimate customer transactions are blocked. Managing this trade-off is a business decision with customer experience implications, not a technical optimisation.</p><h3>Mining and extractive industries</h3><p>South Africa's mining sector combines high-value extraction, dangerous operating environments, ageing infrastructure, and significant maintenance cost structures — conditions that create compelling AI economics. Predictive maintenance AI trained on vibration sensor data, temperature readings, acoustic signatures, and operational parameters identifies equipment failure risk 48 to 72 hours before it becomes detectable by human monitoring. Documented deployments have reduced unplanned downtime by 15 to 25 percent, with corresponding reductions in safety incidents associated with unexpected equipment failures. The prerequisite is sensor infrastructure: organisations without the operational technology to collect real-time equipment data cannot deploy predictive AI regardless of model sophistication. The correct sequence is instrument, then pipeline, then model.</p><h3>Retail and consumer sector</h3><p>South African retail AI is advancing along two primary vectors. Demand forecasting AI incorporates historical sales data, promotional calendars, weather patterns, regional economic indicators, and event schedules to predict store-level inventory requirements. For perishable categories and high-storage-cost products, forecast accuracy improvements deliver direct margin impact. Customer personalisation AI — recommendation engines, dynamic pricing, and channel optimisation — is commercially deployed at major South African grocery, pharmacy, and fashion retailers. The data infrastructure requirements are substantial, which is why smaller retail operators are typically two to three years behind the major chains in AI adoption, regardless of their interest.</p>`,
      },
      {
        id: "t2m7",
        title: "Change management for AI adoption",
        dur: "90 min",
        type: "Workshop",
        summary:
          "Organisational failure modes for AI; narrative design; early adopter strategy; embedding AI in existing workflows",
        html: `<h3>Where AI projects actually fail</h3><p>Technical failure — the model does not work, the accuracy is insufficient, the data pipeline breaks — is the least common cause of AI project failure. The more common causes are organisational: the business case was never clearly defined, the change management was treated as a deployment communication task rather than a sustained programme, or the workforce was informed rather than engaged. When employees experience AI as something being done to them rather than with them, the outcome is compliance without adoption — technically deployed AI that is never used consistently, quietly worked around, or actively undermined by the people who were supposed to benefit from it.</p><h3>Building an adoption narrative that lands</h3><p>People do not resist technology. They resist change that threatens their sense of competence, their working relationships, and their understanding of their own professional value. An effective AI adoption narrative addresses these concerns directly rather than sidestepping them. It is specific about what will change and what will not. It is honest about the transition period, the learning curve, and the support that will be available. It is explicit about the capabilities that become more valuable as AI handles tasks AI can handle — the judgment, the relationship management, the ethical reasoning that no AI system currently replicates.</p><p>The adoption narrative is not a communication task to delegate to HR. It belongs to the business leader sponsoring the AI initiative. Your credibility with your team determines whether they engage with AI as a professional development opportunity or resist it as a threat to their position. The way you talk about AI in front of your team sets the tone for how they experience it on the ground.</p><h3>Making AI stick in existing workflows</h3><p>AI that requires people to significantly change their workflow to use it is AI that will not be used consistently, regardless of its capability. The highest-adoption deployments integrate AI directly into the tools and processes people already use: AI-assisted drafting in the email and document platform, AI-powered search in the CRM, AI-generated summaries in the meeting and collaboration platform. Each integration reduces the activation cost — the effort required to access the AI capability in the flow of work. The practical design question before any AI tool selection: at exactly which step in the current workflow will this AI be accessed, and how many additional actions does accessing it require? If the answer is more than two, adoption will be structurally limited regardless of the tool's quality.</p>`,
      },
      {
        id: "t2m8",
        title: "Building your AI capability roadmap",
        dur: "120 min",
        type: "Capstone workshop",
        summary:
          "12-month AI capability roadmap for your function covering skills, tools, governance, and quick wins",
        html: `<h3>What a 12-month AI capability roadmap looks like</h3><p>An AI capability roadmap is not a technology deployment plan. It is a business capability plan that technology serves. The distinction matters because AI capability is built at the intersection of people, data, process, and governance — not technology alone. A roadmap that plans only the systems to be deployed will fail to address the people capability gaps, data infrastructure weaknesses, and governance requirements on which those systems depend. Those unplanned elements become the delays, cost overruns, and capability gaps that characterise AI initiatives that technically land but commercially disappoint.</p><p>A 12-month AI capability roadmap for a functional leader covers four dimensions across three planning horizons. People: what AI literacy and applied skills does your team need, and through what mechanism will you build it? Data: what foundation improvements are required before your highest-priority AI use cases can be deployed? Governance: what oversight processes, approval flows, and monitoring mechanisms must exist before AI goes into production in your function? Technology: which AI tools and systems will you deploy, in what sequence, and against what specific success criteria?</p><h3>Prioritising: what to put first</h3><p>Every functional leader faces competing demands for the finite change capacity their team can absorb. The prioritisation framework has three inputs: strategic impact (how directly does this AI use case contribute to the function's most important outcome?), data readiness (is the data required already available at sufficient quality?), and change complexity (how much workflow change does adoption require, and how ready is the team for it?). High-impact, data-ready, low-change-complexity use cases lead the roadmap. High-impact, data-poor use cases become the data foundation investment priorities for months three through twelve.</p><h3>The public commitment that makes it real</h3><p>This capstone concludes with each participant presenting their 12-month roadmap to the cohort and making a specific public commitment: the AI capability outcome they will deliver in the first 90 days, and the name of the colleague who will hold them accountable for it. The public commitment is not a presentation exercise — it is a behaviour change mechanism. Research on commitment and accountability consistently demonstrates that specific, public commitments made to named individuals have significantly higher follow-through rates than private intentions, however well-formed and well-documented.</p>`,
      },
    ],
  },
  {
    id: "t3",
    name: "AI Practitioner",
    level: "Tier 3",
    color: "#C17F24",
    colorLight: "rgba(193,127,36,0.15)",
    iconKey: "shield",
    audience: "Analysts, Project Managers, Team Leads, Specialists",
    duration: "Self-paced platform + monthly live Q&A",
    description:
      "Practical AI literacy for professionals who need to work effectively with AI tools in their daily roles.",
    mods: [
      {
        id: "t3m1",
        title: "AI foundations: what it is and isn't",
        dur: "60 min",
        type: "Platform module",
        summary:
          "Types of AI, capabilities and limitations, identifying genuine AI vs marketing claims",
        html: `<h3>Three AI categories any professional needs to understand</h3><p><strong>Machine learning</strong> finds patterns in historical data. When your bank flags a suspicious transaction, when a recommendation engine suggests your next purchase, when a logistics system reroutes a delivery — machine learning is typically at work. It requires historical data to learn from, and it reflects the patterns in that data, including any biases those patterns contain.</p><p><strong>Generative AI</strong> creates new content: text, summaries, code, translations, analysis. The AI tools you may already be using to draft communications, summarise documents, or work through problems are generative AI systems. They are capable and productive, and they produce confident outputs that are sometimes wrong. Verification of important outputs is a professional responsibility, not an optional extra.</p><p><strong>Automation</strong> follows defined rules without learning. Many products marketed as "AI-powered" are primarily automation — valuable, auditable, and appropriate for a different class of problem. Automation does exactly what its rules specify, always. Machine learning and generative AI adapt and generate — which makes them more powerful and more difficult to govern.</p><h3>What AI genuinely cannot do</h3><p>AI cannot verify its own outputs. A generative AI system has no mechanism for checking whether its answer is accurate — it produces the most statistically plausible continuation of the prompt. This is the root cause of hallucination: confident, fluent, well-structured output that is factually wrong. The practical implication: treat AI-generated factual claims the way you treat any unverified information — with appropriate scrutiny before acting on them professionally. AI also cannot exercise judgment, weigh ethical trade-offs, or apply the specific contextual knowledge that makes professional expertise valuable. It supports these capabilities but cannot replace them.</p><h3>Spotting genuine AI in your organisation</h3><p>A quick assessment: does the system adapt its responses based on new information, or does it follow fixed rules? Does it produce varied outputs for similar inputs, or identical ones? Does the vendor describe how the AI learns, or just assert that it uses AI? Systems that follow rules, produce identical outputs, and lack a described learning or generation mechanism are likely automation rebranded. Understanding the difference protects your professional decisions and your organisation's governance.</p>`,
      },
      {
        id: "t3m2",
        title: "Prompt engineering for professionals",
        dur: "60 min",
        type: "Platform module",
        summary:
          "How to write instructions to AI tools that produce useful outputs; role-specific templates and frameworks",
        html: `<h3>The instruction gap and why it matters</h3><p>Most professionals who report that AI tools produce unhelpful outputs are experiencing an instruction gap rather than a capability gap. The tools are capable. The instructions are too vague, too brief, or missing the context the AI needs to produce a useful result. "Write a summary of this document" is a complete instruction. "Write a three-paragraph executive summary of this document for a non-technical CFO, highlighting the two most significant financial risks and the recommended immediate action" is an effective instruction. The gap between those two prompts is the gap between an output you discard and one you use directly.</p><h3>The anatomy of an effective professional prompt</h3><p>An effective professional prompt has four components. <strong>Role</strong>: who or what should the AI behave as? Assigning a role (financial analyst, legal reviewer, executive communications writer) activates relevant patterns in the AI's output. <strong>Context</strong>: what is the situation? Without context, the AI makes assumptions that may not match your needs. <strong>Task</strong>: what specifically should the AI do? The more precise the task, the more useful the output. <strong>Format</strong>: what should the result look like? Specifying length, structure, and tone prevents the AI from making decisions you would have made differently. Instructions that include all four components consistently outperform those that include only the task — which is how most people prompt.</p><h3>When the output is not what you needed</h3><p>When an AI output falls short, the instinct is to try again with the same instruction. A more effective approach is to diagnose which of the four components was insufficient. Generic output usually means missing context. Output that misses the point usually means an ambiguous task description. Output that is too long or poorly structured usually means the format was unspecified. Developing the habit of diagnosing before retrying is the skill that separates professionals who become genuinely productive with AI tools from those who remain frustrated by them.</p>`,
      },
      {
        id: "t3m3",
        title: "AI in your workflow: practical applications",
        dur: "60 min",
        type: "Platform module",
        summary:
          "Role-by-role guide to AI integration; specific tools and use cases for finance, HR, ops, marketing, legal",
        html: `<h3>Finance, analytics, and data work</h3><p>Finance and analytics professionals can use generative AI to draft management account commentary, translate complex financial data into executive-readable language, generate variance explanations, structure financial models, review documents for completeness, and prepare Q&A preparation for board or shareholder presentations. The discipline: AI-generated financial commentary must be reviewed against source data before use. A hallucinated figure in a management report creates professional and organisational risk that the time saved by AI drafting does not offset. The professional standard is AI drafts, human verifies.</p><h3>HR, people, and communications</h3><p>HR and communications professionals can use generative AI to draft job descriptions, adapt performance review frameworks, structure difficult conversation guides, draft internal announcements, summarise engagement survey verbatim responses, and prepare leadership briefings on people topics. The discipline for HR use: AI-generated content that influences decisions about people must be reviewed for potential bias before use. AI systems can reproduce historical hiring and assessment patterns — including patterns that reflect historical bias — when trained on historical data. Every AI-drafted HR document that touches an employment decision requires human review for fairness.</p><h3>Operations, marketing, and legal</h3><p>Operations teams can use AI for process documentation, supplier communications, data analysis narration, and meeting preparation. Marketing teams can use AI for content drafting, campaign briefs, audience segmentation descriptions, and performance report summaries. Legal and compliance professionals can use AI for contract review support, regulatory change summaries, and policy drafting — with the firm professional standard that AI-generated legal content requires qualified human review before any reliance, in every circumstance. Across all functions, the consistent discipline is the same: AI accelerates the draft, human expertise validates the output. The professional who builds this as a habit early compounds a significant productivity advantage over time.</p>`,
      },
      {
        id: "t3m4",
        title: "Data thinking: reading AI outputs critically",
        dur: "45 min",
        type: "Platform module",
        summary:
          "Hallucination, bias, overconfidence; how to interrogate AI outputs; when to trust and when to check",
        html: `<h3>The hallucination problem: what it is and why it happens</h3><p>Generative AI systems produce text that is fluent, confident, and structurally correct regardless of whether it is factually accurate. This is not a design flaw — it is how these systems work. They generate the most statistically plausible continuation of a prompt, not the most factually accurate one. When the model's training data does not contain a reliable answer, it synthesises a plausible one from related patterns. The result looks identical to accurate output. This is hallucination: confident, well-formed text that is wrong.</p><p>The practical defence is straightforward: never rely on an AI-generated factual claim in a professional context without independent verification when accuracy matters. This applies to statistics, regulatory requirements, case precedents, names, dates, and any other domain-specific claim. The time invested in verification is consistently less than the time required to remediate an error that was acted upon as fact.</p><h3>Bias in AI outputs</h3><p>AI systems reflect the patterns in their training data. If historical data contains patterns of human bias — in hiring, lending, language, or representation — the AI system will reproduce those patterns. An AI drafting job descriptions trained on historical postings may use language that signals preference for certain demographic groups. An AI tool that has processed millions of professional documents may associate certain roles with certain demographic characteristics. This is not intentional — it is mechanical reproduction of historical pattern. The professional responsibility is to recognise when AI outputs may carry these patterns and to apply the same critical review you would apply to any other source that might reflect organisational or societal bias.</p><h3>A practical verification approach</h3><p>Before acting on an AI output professionally, ask: Is this a factual claim? If so, have I verified it against an authoritative source? Does this output affect a decision about a person? If so, have I reviewed it for potential bias? Is this output consistent with my professional knowledge? If not, which is wrong — and why? Does this output require specialist expertise to evaluate? If so, has the appropriate expert reviewed it? These questions take thirty seconds to work through. The professional cost of skipping them, when an error reaches a client, a regulator, or a board report, can be considerably higher.</p>`,
      },
      {
        id: "t3m5",
        title: "AI ethics and responsible use",
        dur: "45 min",
        type: "Platform module",
        summary:
          "Privacy in AI context, bias in AI outputs, responsible use policy, escalation channels",
        html: `<h3>Privacy in practice: what changes when AI is involved</h3><p>POPIA governs how personal information is collected, processed, and used in South Africa. When you use an AI tool to process information about colleagues, customers, job applicants, or any individual, POPIA applies — regardless of whether that tool is approved by your organisation or accessed independently. Before passing personal information to any AI tool, confirm: has this tool been approved by your IT and legal functions for this data type? Is the data processed by a third-party AI service that may store or use it for model training? Does using this data with this AI tool fall within the purpose for which it was originally collected and consented? When in doubt, remove or anonymise personal information before using AI on it. The professional default is to treat personal data in AI workflows with the same care you would apply to any other data-handling arrangement.</p><h3>Your personal AI use policy</h3><p>A professional AI use policy is a personal set of standards, not just a reference to your organisation's emerging policy. It has three elements: verification (what you commit to checking before relying on AI outputs for professional decisions), privacy (what categories of information you will not pass to external AI tools), and transparency (when you will disclose that AI was used in producing a deliverable, and to whom). Being clear about these standards in your own practice protects your professional judgment, your organisation, and the people whose information you handle. Most organisations are in the process of developing formal AI use policies — your personal standards should be consistent with those policies and with the professional obligations of your specific role.</p><h3>When and how to raise a concern</h3><p>If you encounter an AI system in your organisation producing outputs that appear biased, factually unreliable, discriminatory, or inconsistent with regulatory requirements, you have a professional obligation to raise it. The appropriate escalation path depends on your organisation, but typically includes your direct manager, the data governance or IT risk function, and in significant cases the legal or compliance team. The principle is consistent: raising a concern when you first notice a potential problem — before a problematic output reaches a customer, a regulator, or an employment decision — is significantly less costly than raising it after the harm has occurred. Your professional judgment is the last line of quality control in any AI-enabled workflow, and it matters.</p>`,
      },
      {
        id: "t3m6",
        title: "AI Practitioner certification assessment",
        dur: "30 min",
        type: "Assessment",
        summary:
          "Knowledge assessment covering all five modules; 80% required to pass; digital certificate shareable on LinkedIn",
        html: `<h3>What this assessment covers</h3><p>The Digilytics AI Practitioner certification assessment covers all five prior modules: AI foundations, prompt engineering for professionals, AI in your workflow, critical evaluation of AI outputs, and AI ethics and responsible use. Questions are drawn proportionally from each module and are designed to test applied understanding — whether you can apply what you have learned to realistic professional scenarios — rather than recall of definitions or terminology.</p><h3>How it works and what to expect</h3><p>Each assessment attempt generates a fresh set of questions using the same AI quiz engine used throughout the programme. No two attempts are identical. You need a score of 80 percent or above to pass. There is no limit on the number of attempts. The recommended approach is to complete all five prior modules in sequence, allow at least one day before attempting the assessment, and approach it when you feel genuinely prepared rather than immediately after completing module five. If you do not pass on the first attempt, review the modules covering the topics where you scored lowest and reattempt.</p><h3>Your Digilytics AI Practitioner Certificate</h3><p>On passing, you receive the Digilytics AI Practitioner Certificate — a digital credential designed to be shared on your LinkedIn profile and professional portfolio. The certificate confirms that you have demonstrated foundational AI literacy appropriate for a professional operating in an AI-enabled organisation: the ability to use AI tools effectively, evaluate AI outputs critically, apply AI to your functional role, and understand the ethical and governance obligations that accompany professional AI use. It is designed to signal applied capability rather than programme completion, and it is the first step toward the Digilytics AI Leader certification for professionals who progress to Tier 2.</p>`,
      },
    ],
  },
];

/**
 * Total number of modules across every tier. Used throughout the dashboard
 * and facilitator views for progress percentages.
 * @returns {number}
 */
export function getTotalModuleCount() {
  return TIERS.reduce((total, tier) => total + tier.mods.length, 0);
}

/**
 * Find a tier by id.
 * @param {string} tierId
 * @returns {Tier|undefined}
 */
export function findTier(tierId) {
  return TIERS.find((tier) => tier.id === tierId);
}

/**
 * Find a module within a tier by id.
 * @param {string} tierId
 * @param {string} modId
 * @returns {{tier: Tier|undefined, mod: QuizModule|undefined, index: number}}
 */
export function findModule(tierId, modId) {
  const tier = findTier(tierId);
  const mod = tier?.mods.find((m) => m.id === modId);
  const index = tier?.mods.findIndex((m) => m.id === modId) ?? -1;
  return { tier, mod, index };
}
