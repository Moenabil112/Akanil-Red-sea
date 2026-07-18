import type { SiteContent } from "../types";

/**
 * English content record — independently edited.
 * International business-development register; no startup jargon.
 * Grounded in the approved Phase 1/2 baselines (P1-00/01/03/04, P2-16).
 */
export const en: SiteContent = {
  meta: {
    title: "Akanil Morocco–Red Sea Economic Gateway",
    description:
      "A permanent Moroccan business-development infrastructure connecting Moroccan industrial, financial and technological capabilities with qualified opportunities across Sudan and the Red Sea economic space. Founded and operated by Akanil for Development and Investment.",
    ogAlt:
      "Conceptual gateway artwork for the Akanil Morocco–Red Sea Economic Gateway.",
  },
  ui: {
    skipLink: "Skip to content",
    languageLabel: "Language",
    languageNames: { ar: "العربية", fr: "Français", en: "English" },
    menuOpen: "Open menu",
    menuClose: "Close menu",
    close: "Close",
    sectionLabel: "Section",
    conceptArtLabel: "Concept illustration — not documentary evidence",
    nav: [
      { anchor: "why", label: "The Gateway" },
      { anchor: "morocco", label: "Morocco" },
      { anchor: "corridor", label: "Corridor" },
      { anchor: "chains", label: "Value chains" },
      { anchor: "forum", label: "Forum" },
      { anchor: "trust", label: "Trust" },
      { anchor: "about", label: "Akanil" },
      { anchor: "contact", label: "Contact" },
    ],
    footer: {
      entity: "Akanil Morocco–Red Sea Economic Gateway",
      tagline: "Institutional introduction window",
      note: "No external institution, partner, sponsor, investment, route or opportunity is presented on this page as confirmed. Corridor visuals are conceptual. This window is based on Akanil's approved strategic and knowledge baselines.",
      hierarchy: [
        "Akanil for Development and Investment — founder and executive operator",
        "Akanil Morocco–Red Sea Economic Gateway — permanent economic infrastructure",
        "Morocco–Sudan Economic Forum — first activation programme",
      ],
    },
  },
  hero: {
    eyebrow: "Institutional introduction window",
    titleLines: [
      { text: "Akanil Morocco–Red Sea", emphasis: false },
      { text: "Economic Gateway", emphasis: true },
    ],
    lead: "A permanent Moroccan infrastructure for business development, qualification and follow-up — connecting Moroccan industrial, financial and technological capabilities with qualified opportunities across Sudan and the Red Sea economic space.",
    primary: {
      label: "Request an institutional briefing",
      explanation:
        "Opens a contact note describing the controlled briefing path. No commitment is created.",
    },
    secondary: {
      label: "Explore the Gateway model",
      explanation: "Moves to the institutional architecture below.",
    },
    pillars: [
      {
        title: "Founder and executive operator",
        text: "Akanil for Development and Investment owns the operating model and the institutional memory.",
      },
      {
        title: "Permanent infrastructure",
        text: "Designed to qualify, connect and follow opportunities well beyond a single event.",
      },
      {
        title: "Human-governed decisions",
        text: "Data and AI support authorized people; they do not replace their authority.",
      },
    ],
    scopeLabel: "Economic scope",
    scopeNodes: ["Morocco", "Sudan", "Red Sea"],
    motto: "From Access to Trust. From Resources to Shared Value Chains.",
  },
  why: {
    eyebrow: "Why the Gateway",
    title: "Cross-border opportunity is lost in unstructured relationships.",
    lead: "Between Morocco, Sudan and the Red Sea markets, capable enterprises and real demand already exist. What is missing is a governed path between them.",
    problemsTitle: "The operating problem",
    problems: [
      {
        title: "Fragmented access",
        text: "Introductions depend on individual relationships rather than an institutional channel.",
      },
      {
        title: "Weak qualification",
        text: "Companies and opportunities arrive without verified identity, capability or maturity.",
      },
      {
        title: "Lost follow-up",
        text: "Decisions and commitments disappear inside meetings and message threads.",
      },
      {
        title: "Unstructured relationships",
        text: "No shared record of who owns a relationship, its context or its permissions.",
      },
      {
        title: "Unclear status",
        text: "No one can say whether an opportunity is an idea, under study, or ready to progress.",
      },
    ],
    answerTitle: "What Akanil operates instead",
    answerLead:
      "The Gateway is an operating memory: every organization, request and opportunity becomes a governed record with a source, an owner, a status and a next step.",
    answers: [
      {
        title: "Operating memory",
        text: "Requests, correspondence, meetings and commitments are recorded and retrievable — nothing depends on one inbox.",
      },
      {
        title: "Structured progression",
        text: "Opportunities move through explicit stages — registration, verification, qualification, matching, meeting, follow-up.",
      },
      {
        title: "Governed relationships",
        text: "Introductions are made deliberately, with consent, purpose and a documented owner on each side.",
      },
    ],
  },
  architecture: {
    eyebrow: "One architecture, three layers",
    title: "Institutional continuity before and after any event.",
    lead: "The founder, the permanent infrastructure and the first activation programme remain distinct, so ownership, authority and institutional memory stay clear.",
    layers: [
      {
        badge: "Founder and operator",
        name: "Akanil for Development and Investment",
        role: "Moroccan enterprise, established 2014",
        text: "Founder and executive operator: owner of the operating model, the qualification method, the data governance rules and the relationship coordination.",
        keywords: "Ownership · governance · continuity",
      },
      {
        badge: "Permanent infrastructure",
        name: "Akanil Morocco–Red Sea Economic Gateway",
        role: "Year-round economic infrastructure",
        text: "A permanent reception, qualification, matchmaking and follow-up structure for organizations, requests, opportunities and shared value chains.",
        keywords: "Reception · qualification · follow-up",
      },
      {
        badge: "First activation programme",
        name: "Morocco–Sudan Economic Forum",
        role: "Activation of the permanent Gateway",
        text: "A private, invitation-based programme that brings qualified decision-makers, companies and institutions into structured meetings, visits and commitments.",
        keywords: "Activation · meetings · commitments",
      },
    ],
    chamberNote:
      "A future Morocco–Sudan business chamber is a separate future legal and institutional pathway. It is not presented here as an existing entity.",
  },
  morocco: {
    eyebrow: "The Morocco value proposition",
    title: "Morocco is the industrial and financial platform of the Gateway.",
    lead: "For Moroccan institutions, manufacturers, exporters, banks and service providers, the Gateway is a practical instrument of South–South economic cooperation — organized access to qualified counterparts, recorded opportunity files and followable outcomes.",
    statement:
      "Akanil offers Moroccan stakeholders an executable mechanism that converts scattered relationships into an organized pathway: qualified decision-makers, documented opportunities, defined responsibilities and followed results.",
    pillars: [
      {
        title: "Industry and processing",
        text: "Moroccan plants transform qualified resources into higher-value products — contract manufacturing, refining, packaging and co-production models.",
      },
      {
        title: "Standards and quality",
        text: "Testing, certification, traceability and accreditation capabilities anchor every qualified pathway in verifiable quality.",
      },
      {
        title: "Finance and insurance",
        text: "Moroccan banks, insurers and advisory institutions structure payment, coverage and financing around documented counterparts.",
      },
      {
        title: "Logistics and export capability",
        text: "Export platforms toward Europe, West Africa and Atlantic markets, with corridor scenarios designed per opportunity.",
      },
      {
        title: "Technology and skills",
        text: "Water, energy, agritech and digital solutions, plus training and capacity development delivered as exportable expertise.",
      },
      {
        title: "Regional distribution",
        text: "Structured reach into African and Gulf markets through qualified distribution and multi-market value-chain design.",
      },
    ],
    audienceTitle: "Designed for",
    audiences: [
      "Public and economic institutions",
      "Industrial groups and manufacturers",
      "Exporters and investors",
      "Banks and insurers",
      "Logistics operators",
      "Technology and training providers",
    ],
  },
  sudan: {
    eyebrow: "The Sudan shared-value proposition",
    title: "Sudan is a value-chain partner — not a raw-material source.",
    lead: "The Gateway is built on a partnership logic: Sudanese production capability, resources and market depth joined with Moroccan processing, finance and technology, with measurable value retained and added on both sides.",
    roles: [
      {
        title: "Production capability",
        text: "Agricultural, livestock and mineral production capacity with room for joint development.",
      },
      {
        title: "Resources",
        text: "Qualified resources entering documented value chains — never anonymous commodity flows.",
      },
      {
        title: "A market of its own",
        text: "Real demand for Moroccan solutions: equipment, inputs, technology, training and services.",
      },
      {
        title: "Local value addition",
        text: "Primary processing, sorting and aggregation in Sudan so value is retained at origin.",
      },
      {
        title: "Red Sea and East Africa bridge",
        text: "A connection toward Red Sea trade routes and East African markets.",
      },
      {
        title: "Capacity development",
        text: "Training, technology transfer and joint ventures that build durable Sudanese capability.",
      },
    ],
    equationTitle: "The shared-value logic",
    equationParts: [
      "Sudanese resource or capability",
      "Moroccan processing and expertise",
      "Finance and logistics",
      "Regional distribution",
    ],
    equationResult: "Measurable shared value",
    partnershipNote:
      "Every pathway is assessed for the value it retains in Sudan and adds in Morocco. Extractive, one-way models are excluded by design.",
  },
  corridor: {
    eyebrow: "Corridor intelligence",
    title: "A network of scenarios — not one fixed route.",
    lead: "The corridor is a method for choosing the best arrangement of production, processing, finance, transit and distribution for each opportunity. Routes are designed per case and re-assessed as conditions change.",
    disclaimer:
      "Conceptual diagram. No route shown here is operationally verified today; every scenario requires current commercial, logistical and compliance verification before use. This is not live tracking.",
    mapAria:
      "Conceptual diagram of the Morocco–Red Sea economic network with selectable country nodes.",
    legendTitle: "Route states",
    states: {
      conceptual: {
        label: "Conceptual",
        description: "A strategic possibility only.",
      },
      "under-study": {
        label: "Under study",
        description: "Data collection or route analysis underway.",
      },
      "pilot-qualified": {
        label: "Pilot-qualified",
        description: "Ready for a limited, controlled test.",
      },
      verified: {
        label: "Operationally verified",
        description: "Current evidence supports operation.",
      },
      constrained: {
        label: "Constrained",
        description: "A known material constraint applies.",
      },
      alternative: {
        label: "Alternative",
        description: "A fallback scenario for resilience.",
      },
    },
    nodes: [
      {
        id: "morocco",
        name: "Morocco",
        role: "Value node",
        description:
          "Industrial transformation, standards, finance, technology and the export platform toward Europe, Africa and Atlantic markets.",
      },
      {
        id: "egypt",
        name: "Egypt",
        role: "Potential transit node",
        description:
          "A potential node for transit, storage, aggregation or partial processing — used only where it adds real value.",
      },
      {
        id: "saudi",
        name: "Saudi Arabia",
        role: "Investment and market node",
        description:
          "A potential node for investment, Gulf market depth and Red Sea connectivity in three-party models.",
      },
      {
        id: "red-sea",
        name: "Red Sea",
        role: "Trade and investment corridor",
        description:
          "The maritime space connecting Africa and the Gulf; ports, carriers, insurance and costs are studied per scenario.",
      },
      {
        id: "sudan",
        name: "Sudan",
        role: "Value-chain partner",
        description:
          "Production, resources, market and the bridge toward East Africa — a partner in shared value, not a raw-material source.",
      },
    ],
    routes: [
      {
        id: "CR-01",
        from: "sudan",
        to: "morocco",
        state: "conceptual",
        label: "Sudan ↔ Morocco direct",
        summary:
          "Direct exchange: qualified Sudanese supply toward Moroccan processing, and Moroccan products and solutions toward the Sudanese market.",
      },
      {
        id: "CR-02",
        from: "sudan",
        to: "morocco",
        via: "egypt",
        state: "alternative",
        label: "Via Egypt",
        summary:
          "A fallback scenario using Egyptian transit, storage or partial processing when it adds measurable value.",
      },
      {
        id: "CR-03",
        from: "sudan",
        to: "morocco",
        via: "saudi",
        state: "conceptual",
        label: "Three-party with Saudi Arabia",
        summary:
          "A triangular scenario combining a Sudanese opportunity, Moroccan expertise and Gulf investment or market depth.",
      },
      {
        id: "CR-05",
        from: "morocco",
        to: "sudan",
        state: "conceptual",
        label: "Moroccan solutions → Sudan",
        summary:
          "Moroccan equipment, inputs, technology, training and services supplied toward qualified Sudanese demand.",
      },
    ],
    summaryTitle: "Selected node",
    selectPrompt: "Select a node to read its role and related route scenarios.",
    nodeListTitle: "Network nodes",
    principle:
      "Value before distance: no shipment without a business model, and every route remains reviewable as security, costs, ports or markets change.",
  },
  chains: {
    eyebrow: "Priority value chains",
    title: "From resources to measurable shared value.",
    lead: "Four chains where Sudanese production and Moroccan industrial, financial and technological capability can be combined responsibly and executably.",
    tabListLabel: "Priority value chains",
    stageFlowLabel: "Chain stages",
    chains: [
      {
        name: "Feed and livestock",
        summary:
          "Connecting inputs, animal production, processing, quality and market access in a model that distributes value and risk across partners.",
        stages: [
          {
            title: "Source and capability",
            text: "Qualified producers and suppliers with verified identity.",
          },
          {
            title: "Qualification",
            text: "Specifications, volumes, continuity and compliance checks.",
          },
          {
            title: "Processing and expertise",
            text: "Feed manufacturing, veterinary standards and packaging in Morocco.",
          },
          {
            title: "Finance and logistics",
            text: "Payment structures, insurance and per-case corridor design.",
          },
          {
            title: "Market",
            text: "Documented demand in Morocco, Africa and Gulf markets.",
          },
          {
            title: "Shared-value outcome",
            text: "Traceable results with value on both sides of the chain.",
          },
        ],
        outcome:
          "A recorded pathway from qualified supply to followed outcomes.",
      },
      {
        name: "Oilseeds and food processing",
        summary:
          "Pathways for oilseeds, oils and meals through quality testing, refining, packaging and shared processing with clear markets.",
        stages: [
          {
            title: "Source and capability",
            text: "Sesame, groundnut and oilseed production with documented origin.",
          },
          {
            title: "Qualification",
            text: "Grading, laboratory testing and food-safety compliance.",
          },
          {
            title: "Processing and expertise",
            text: "Crushing, refining and food manufacturing in Moroccan facilities.",
          },
          {
            title: "Finance and logistics",
            text: "Trade finance, insurance and studied transport scenarios.",
          },
          {
            title: "Market",
            text: "Food industries and consumer markets across the region.",
          },
          {
            title: "Shared-value outcome",
            text: "Higher-value products with retained origin value.",
          },
        ],
        outcome:
          "Food-security relevance with measurable value addition in both countries.",
      },
      {
        name: "Water, energy and agritech",
        summary:
          "Moroccan irrigation, renewable-energy and agritech solutions matched to diagnosed Sudanese needs, with operation and training included.",
        stages: [
          {
            title: "Need diagnosis",
            text: "Documented Sudanese requirements in water, energy and farming.",
          },
          {
            title: "Qualification",
            text: "Site, feasibility and counterpart verification.",
          },
          {
            title: "Solutions and expertise",
            text: "Moroccan equipment, engineering and digital agriculture.",
          },
          {
            title: "Finance and logistics",
            text: "Project finance and delivery structured per case.",
          },
          {
            title: "Operation and training",
            text: "Installation, local operation and skills transfer.",
          },
          {
            title: "Shared-value outcome",
            text: "Productivity, resilience and durable local capability.",
          },
        ],
        outcome:
          "Solutions delivered with training — capability stays where it is built.",
      },
      {
        name: "Mining and value addition",
        summary:
          "From a mineral resource or opportunity to analysis, standards, processing, equipment and a responsible, traceable market pathway.",
        stages: [
          {
            title: "Source qualification",
            text: "Verified ownership, identity and documentation first.",
          },
          {
            title: "Analysis and standards",
            text: "Assaying, classification and regulatory compliance.",
          },
          {
            title: "Processing and equipment",
            text: "Value-addition steps and Moroccan equipment or expertise.",
          },
          {
            title: "Finance and logistics",
            text: "Structured finance with documented risk assessment.",
          },
          {
            title: "Market",
            text: "Qualified industrial buyers under traceability rules.",
          },
          {
            title: "Shared-value outcome",
            text: "Responsible pathways that raise value at origin.",
          },
        ],
        outcome:
          "No anonymous flows: identity, compliance and traceability throughout.",
      },
    ],
    outcomeLabel: "Outcome",
  },
  forum: {
    eyebrow: "First activation programme",
    title: "Morocco–Sudan Economic Forum",
    lead: "A private, invitation-based and qualified programme connecting Sudanese decision-makers with Moroccan companies and institutions through B2B and B2G meetings, industrial visits and structured follow-up that continues after the programme days.",
    facts: [
      {
        title: "Position",
        text: "An activation of the permanent Gateway — not a separate project or a public conference.",
      },
      {
        title: "Method",
        text: "Private, qualified, invitation-based participation.",
      },
      {
        title: "Working modes",
        text: "B2B and B2G meetings, workshops and industrial visits.",
      },
      {
        title: "Measure of success",
        text: "Decisions, commitments and followed progress after the event.",
      },
    ],
    posterAlt:
      "Conceptual identity artwork for the Morocco–Sudan Economic Forum.",
    posterLabel: "Concept identity artwork — not documentary evidence of an event.",
    cta: {
      label: "Review the follow-up model",
      explanation: "Moves to the digital operating layer below.",
    },
  },
  operating: {
    eyebrow: "The digital operating layer",
    title: "Relationships do not disappear inside conversations.",
    lead: "The Gateway's operating model turns every engagement into a governed case that preserves source, context, permissions, decisions and the next step.",
    statusNote:
      "Presented as the Gateway's operating model. The public portal features described here are an operating vision — they are not live on this introduction window.",
    steps: [
      {
        title: "Reception",
        text: "Every organization, request and document enters through a recorded channel.",
      },
      {
        title: "Verification",
        text: "Professional identity, authority and source are checked before anything moves.",
      },
      {
        title: "Qualification",
        text: "Need, capability, maturity and risk are classified against explicit criteria.",
      },
      {
        title: "Controlled introductions",
        text: "Counterparts meet only after human review and consent on both sides.",
      },
      {
        title: "Meetings",
        text: "Sessions have a defined purpose, participants and record.",
      },
      {
        title: "Decisions",
        text: "Outcomes are documented with an owner and a date — not remembered.",
      },
      {
        title: "Commitments",
        text: "Undertakings carry a responsible party, a deadline and evidence.",
      },
      {
        title: "Follow-up",
        text: "Progress is tracked until results, expansion or documented closure.",
      },
      {
        title: "Audit trail",
        text: "Every step remains attributable, reviewable and accountable.",
      },
    ],
  },
  trust: {
    eyebrow: "Trust, data and AI",
    title: "Data and AI support decisions. They do not replace authority.",
    lead: "Information inside the Gateway is governed by purpose, consent and human accountability, and artificial intelligence works under explicit limits.",
    quote: "AI proposes; an authorized human reviews and decides.",
    principles: [
      {
        title: "Defined purpose",
        text: "Data is collected and used only for a stated business purpose.",
      },
      {
        title: "Consent",
        text: "Sharing follows documented consent from the data's owner.",
      },
      {
        title: "Classification",
        text: "Records carry confidentiality levels that control their handling.",
      },
      {
        title: "Least privilege",
        text: "Access is limited by role, purpose and time.",
      },
      {
        title: "Source attribution",
        text: "The origin of opportunities, relationships and evidence stays traceable.",
      },
      {
        title: "Human review",
        text: "AI output remains a proposal until an authorized person reviews it.",
      },
      {
        title: "Controlled access",
        text: "Sensitive files and data rooms open only under documented authorization.",
      },
      {
        title: "Auditability",
        text: "Actions and decisions are logged and reviewable.",
      },
    ],
  },
  about: {
    eyebrow: "Founder and executive operator",
    title: "Akanil for Development and Investment",
    paragraphs: [
      "Akanil for Development and Investment is a Moroccan enterprise established in 2014, specializing in business development, economic-corridor structuring, and the connection of Moroccan industrial, financial and technological capabilities with African and Gulf opportunities through field intelligence, institutional engagement and digitally governed operations.",
      "Within the Gateway, Akanil is the founder and executive operator: designer of the business model and the economic corridor, manager of B2B and B2G relationships, qualifier of companies and opportunities, and keeper of the operating memory under documented rights and consents.",
    ],
    rolesTitle: "Akanil operates as",
    roles: [
      "Moroccan institutional operator",
      "Business-development platform",
      "Economic-corridor designer",
      "Field-intelligence and relationship operator",
      "Founder and executive operator of the Gateway",
    ],
    founderQuote:
      "The Gateway is designed to transform relationships and knowledge into qualified, governed and followable economic pathways.",
    founderName: "Mohamed Nabil",
    founderRole: "Founder and CEO — Akanil",
  },
  contact: {
    eyebrow: "Institutional contact",
    title: "A structured entry point for economic cooperation.",
    lead: "This window presents the institutional model. Formal participation, partnerships, opportunity qualification and data access remain subject to controlled review and documented authorization.",
    actionsTitle: "Appropriate requests",
    actions: [
      {
        title: "Request an institutional briefing",
        text: "For Moroccan institutions and organizations that want a structured presentation of the Gateway.",
      },
      {
        title: "Discuss company qualification",
        text: "For enterprises that want to understand the qualification path before any introduction.",
      },
      {
        title: "Explore a priority value chain",
        text: "For counterparts with a concrete interest in one of the four priority chains.",
      },
      {
        title: "Request a controlled meeting",
        text: "For qualified decision-makers seeking a purposeful, documented session.",
      },
    ],
    open: {
      label: "Open the institutional contact note",
      explanation:
        "Opens a local note describing how contact will be established. Nothing is transmitted from this page.",
    },
    modal: {
      title: "Institutional contact note",
      body: "The public contact channel will be connected after final content, legal and publication review. Requests will then follow the Gateway's reception and verification path: every inquiry receives a reference, an owner and a defined next step.",
      privacyNote:
        "This introduction window does not transmit or store any personal information.",
      referenceLabel: "Reference",
      reference: "AKANIL-GATEWAY / INSTITUTIONAL-WINDOW / V1.0",
      close: "Close the note",
    },
  },
};
