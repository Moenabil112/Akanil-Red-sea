import type { ForumContent } from "../forum-types";

/**
 * English Forum content — independently edited (P3, ADR-019).
 * The Morocco–Sudan Economic Forum is a proposed qualification and
 * engagement programme; participation is subject to review and
 * invitation. No event date, venue, speaker, participant, sponsor,
 * ministry or visit is presented as confirmed.
 */
export const enForum: ForumContent = {
  programmeName: "Morocco–Sudan Economic Forum",
  publicStatus:
    "Proposed qualification and engagement programme — participation subject to review and invitation.",
  positioningLead:
    "A qualification, meeting and decision programme connecting Moroccan and Sudanese institutions, companies and qualified regional specialists with the relevant projects and value chains. It is private, invitation-based and project- and value-chain-oriented — not an open public conference, a marketplace or a guarantee of meetings, contracts, finance or partnership.",
  gatewayRelationTitle: "The first activation of the permanent Gateway",
  gatewayRelation:
    "The Forum is the first activation programme of the permanent Akanil Morocco–Red Sea Economic Gateway — not a separate institution. Akanil is its founder and executive operator: qualification and programme coordinator, stakeholder and meeting-logic coordinator, project and value-chain alignment operator, and owner of the follow-up framework. Akanil is not a ministry or public authority, and nothing here implies governmental endorsement.",
  qualificationFirstTitle: "Why qualification comes before participation",
  qualificationFirst:
    "Meetings are only useful when both sides are prepared. Qualification establishes identity, mandate, purpose and the linked project, platform or value chain before any meeting is proposed — so time at the Forum is spent on prepared, relevant conversations rather than open networking.",

  navLabel: "Forum programme navigation",
  nav: [
    { href: "/forum", label: "Forum hub" },
    { href: "/forum/programme", label: "Programme" },
    { href: "/forum/participation", label: "Participation paths" },
    { href: "/forum/prepare", label: "Prepare" },
  ],

  hub: {
    eyebrow: "First activation programme",
    title: "Morocco–Sudan Economic Forum",
    lead: "A private, invitation-based and qualification-led programme built around preparation, meetings, decisions and follow-up.",
    beforeDuringAfterTitle: "Before, during and after the programme",
    phases: [
      {
        title: "Before the Forum",
        items: [
          "Stakeholder orientation and participant qualification",
          "Institutional and company profiling",
          "Need, capability, project and value-chain alignment",
          "Meeting preparation and evidence-gap review",
        ],
      },
      {
        title: "During the Forum",
        items: [
          "Institutional framework and sector workshops",
          "Prepared B2B and B2G meetings",
          "Categories of industrial and institutional visits",
          "Technical, financing and value-chain discussions",
        ],
      },
      {
        title: "After the Forum",
        items: [
          "Expected-outcome categories recorded by a specialist",
          "Information gaps identified",
          "Recommended next step per file",
          "Structured follow-up through approved channels",
        ],
      },
    ],
    participationOverviewTitle: "Which participation path applies to you",
    participationOverviewLead:
      "Six participation paths orient institutions, companies, producers, financiers and specialist partners toward the right preparation and the right kind of meeting.",
    tracksOverviewTitle: "Which sector track is relevant",
    tracksOverviewLead:
      "Five sector tracks organize discussions and meetings across the Gateway's platforms and value chains. Tracks organize engagement; they do not replace the six value-chain pathways.",
    programmeSummaryTitle: "A five-day proposed programme",
    programmeSummaryLead:
      "A proposed structure, subject to final confirmation: institutional framework, sector workshops, prepared meetings, categories of visits, and decisions with a follow-up plan.",
    meetingLogicTitle: "How a meeting is prepared",
    meetingLogicLead:
      "A Forum meeting is proposed only when it has a defined purpose, qualified participants, a linked project or value chain, minimum preparation, the questions or decisions sought and a realistic expected outcome — all under human review.",
    outcomeTitle: "What outcome may follow",
    outcomeLead:
      "A specialist review may reach one of several possible next-step categories. These are not decisions produced automatically by the website, and participation does not guarantee a positive outcome.",
    qualificationNoticeTitle: "Before you request qualification",
    qualificationNotice: [
      "Submitting a request does not confirm participation.",
      "Qualification does not guarantee an invitation.",
      "An invitation does not guarantee a meeting with a specific entity.",
      "A meeting does not confirm partnership, financing or contracting.",
      "Programme details remain subject to final approval.",
      "Participant information is not publicly listed.",
    ],
    ctaLabel: "Request Forum qualification",
    ctaExplanation:
      "Opens the controlled reception with a Forum qualification context; reception is not acceptance.",
  },

  participation: {
    eyebrow: "Participation paths",
    title: "Six paths into a qualified programme.",
    lead: "Each path explains who it includes, the objectives it can serve, and the information to prepare. Choosing a path preselects a Forum qualification context; it does not confirm participation.",
    whoLabel: "Who it includes",
    objectivesLabel: "Potential objectives",
    preparationLabel: "Prepare before requesting",
    tracksLabel: "Relevant sector tracks",
    platformsLabel: "Related platforms",
    chainsLabel: "Related value chains",
    outcomesLabel: "Possible outcomes",
    ctaLabel: "Request qualification for this path",
    paths: [
      {
        id: "moroccan-institutions",
        title: "Moroccan institutions",
        summary:
          "Public and semi-public institutions, development and cooperation bodies, standards, training and sector institutions, and territorial or economic-development actors.",
        whoItIncludes: [
          "Government institutions",
          "Semi-public institutions",
          "Development and cooperation bodies",
          "Standards, training and sector institutions",
          "Territorial or economic-development actors",
        ],
        potentialObjectives: [
          "Institutional cooperation and sector coordination",
          "South–South cooperation and programme support",
          "Technical and capacity-building engagement",
          "Review of qualified Sudanese needs or projects",
        ],
        preparationRequirements: [
          "Institution identity and mandate",
          "Relevant sector and purpose of engagement",
          "Type of Sudanese counterpart sought",
          "Expected institutional outcome",
        ],
        expectedOutcomes: [
          "institutional-discussion-recommended",
          "specialist-review-recommended",
          "additional-information-required",
          "follow-up-after-forum",
        ],
        requestType: "forum-qualification",
      },
      {
        id: "moroccan-companies-exporters",
        title: "Moroccan companies, exporters and manufacturers",
        summary:
          "Exporters, manufacturers, processing companies, equipment and agricultural-input suppliers, food companies, mining and industrial suppliers, technology providers and logistics or cold-chain companies.",
        whoItIncludes: [
          "Exporters, manufacturers and processing companies",
          "Equipment and agricultural-input suppliers",
          "Food companies and mining or industrial suppliers",
          "Technology, logistics and cold-chain companies",
        ],
        potentialObjectives: [
          "Market expansion and qualified-demand review",
          "Supply or offtake discussion and industrial cooperation",
          "Distribution and technology deployment",
          "Project participation",
        ],
        preparationRequirements: [
          "Company profile and products or capabilities",
          "Target market and required counterpart",
          "Production or delivery capacity",
          "Standards or certifications where relevant, and the desired meeting outcome",
        ],
        expectedOutcomes: [
          "supply-offtake-discussion-recommended",
          "industrial-cooperation-review-recommended",
          "technical-meeting-recommended",
          "additional-information-required",
        ],
        requestType: "forum-qualification",
        note: "Qualification does not imply automatic access to the Sudanese market.",
      },
      {
        id: "sudanese-institutions-decision-makers",
        title: "Sudanese institutions and decision-makers",
        summary:
          "Public and sector bodies, regional and local authorities, development entities, institutions with documented sector needs, and project-sponsoring or coordinating organizations.",
        whoItIncludes: [
          "Public and sector bodies",
          "Regional and local authorities",
          "Development entities",
          "Institutions with documented sector needs or coordinating roles",
        ],
        potentialObjectives: [
          "Presenting qualified needs and sector cooperation",
          "Institutional partnerships",
          "Technical and capacity-building engagement",
          "Project or infrastructure review and Moroccan capability sourcing",
        ],
        preparationRequirements: [
          "Institutional identity, mandate and authority",
          "Sector need and project context",
          "Required capability and implementation geography",
          "Expected institutional decision",
        ],
        expectedOutcomes: [
          "institutional-discussion-recommended",
          "project-review-recommended",
          "additional-information-required",
          "follow-up-after-forum",
        ],
        requestType: "forum-qualification",
        note: "Not every governmental or regional request is approved; each is reviewed on its merits.",
      },
      {
        id: "sudanese-producers-project-sponsors",
        title: "Sudanese producers, project sponsors and asset owners",
        summary:
          "Producers, cooperatives, exporters, industrial project sponsors, land or facility owners, mining project sponsors, agricultural and livestock operators, and holders of documented project opportunities.",
        whoItIncludes: [
          "Producers, cooperatives and exporters",
          "Industrial, mining and infrastructure project sponsors",
          "Land or facility owners and agricultural or livestock operators",
          "Holders of documented project opportunities",
        ],
        potentialObjectives: [
          "Project review and industrial partnership",
          "Supply or offtake discussion",
          "Technology or equipment access",
          "Processing and value-addition, logistics or market-access review",
        ],
        preparationRequirements: [
          "Identity and authority",
          "Project or asset description and ownership or representation basis",
          "Current stage and available evidence",
          "Required partner and expected next step",
        ],
        expectedOutcomes: [
          "project-review-recommended",
          "supply-offtake-discussion-recommended",
          "industrial-cooperation-review-recommended",
          "additional-information-required",
        ],
        requestType: "forum-qualification",
        note: "Anonymous assets, minerals, land or projects are never accepted or presented; identity and documentation come first.",
      },
      {
        id: "finance-investment-development",
        title: "Finance, investment and development institutions",
        summary:
          "Development-finance organizations, commercial banks, investment institutions, insurers, trade-finance specialists and strategic investors.",
        whoItIncludes: [
          "Development-finance organizations",
          "Commercial banks and investment institutions",
          "Insurers and trade-finance specialists",
          "Strategic investors",
        ],
        potentialObjectives: [
          "Review of qualified projects",
          "Financing-requirement and risk or evidence-gap review",
          "Trade-finance pathway discussion",
          "Project-development cooperation",
        ],
        preparationRequirements: [
          "Institutional mandate, sector and geography",
          "Ticket or programme preference where appropriate",
          "Risk and evidence requirements and regulatory limitations",
          "Desired type of opportunity and expected review output",
        ],
        expectedOutcomes: [
          "project-review-recommended",
          "specialist-review-recommended",
          "additional-information-required",
          "follow-up-after-forum",
        ],
        requestType: "forum-qualification",
        note: "No opportunity is automatically investment-ready, financeable, approved or open for public subscription.",
      },
      {
        id: "technology-logistics-knowledge",
        title: "Technology, logistics and knowledge partners",
        summary:
          "Technology companies, logistics providers, port and storage specialists, research and knowledge institutions, training organizations, laboratories, and engineering or advisory firms.",
        whoItIncludes: [
          "Technology companies and logistics providers",
          "Port and storage specialists",
          "Research, knowledge and training institutions",
          "Laboratories and engineering or advisory firms",
        ],
        potentialObjectives: [
          "Solution partnership and technical review",
          "Data and technology cooperation",
          "Logistics design and testing or standards support",
          "Training and capacity development",
        ],
        preparationRequirements: [
          "Organization profile and capability description",
          "Geographic coverage and implementation references where available",
          "Required local counterpart and target project or chain",
          "Expected collaboration outcome",
        ],
        expectedOutcomes: [
          "technical-meeting-recommended",
          "specialist-review-recommended",
          "industrial-cooperation-review-recommended",
          "additional-information-required",
        ],
        requestType: "forum-qualification",
        note: "Proposed technology or logistics providers are not described as confirmed Forum partners.",
      },
    ],
  },

  tracks: {
    eyebrow: "Sector tracks",
    title: "Five tracks that organize discussions and meetings.",
    lead: "Sector tracks group preparation and meetings across the Gateway's platforms and value chains. They organize engagement; they do not replace the six value-chain pathways.",
    discussionsLabel: "Potential discussions",
    platformsLabel: "Related platforms",
    chainsLabel: "Related value chains",
    ctaLabel: "Request qualification for this track",
    items: [
      {
        id: "agriculture-food-industrialization",
        title: "Agriculture and food industrialization",
        summary:
          "Qualified production, oil and food processing, packaging, inputs, cold storage and buyer requirements — from source to industrial partnership.",
        potentialDiscussions: [
          "Production qualification and agricultural inputs",
          "Oil and food processing and packaging",
          "Cold storage and buyer requirements",
          "Technology and industrial partnerships",
        ],
      },
      {
        id: "feed-livestock-animal-value",
        title: "Feed, livestock and animal value",
        summary:
          "Feed inputs, animal production, veterinary and traceability requirements, transport, processing and market requirements.",
        potentialDiscussions: [
          "Feed inputs and animal production",
          "Veterinary, quarantine and traceability requirements",
          "Transport and processing",
          "Market requirements",
        ],
        note: "Nothing here implies veterinary, quarantine or import approval.",
      },
      {
        id: "water-energy-agritech",
        title: "Water, energy and agritech",
        summary:
          "Irrigation, solar agricultural infrastructure, farm data, monitoring, digital agriculture, cold-storage energy, and training with local operation.",
        potentialDiscussions: [
          "Irrigation and solar agricultural infrastructure",
          "Farm data, monitoring and digital agriculture",
          "Cold-storage energy",
          "Training and local operations",
        ],
      },
      {
        id: "mining-industrial-value",
        title: "Mining and industrial value addition",
        summary:
          "Project evidence, technical review, testing and assay, processing and beneficiation, equipment, environmental and regulatory requirements, traceability and qualified industrial buyers.",
        potentialDiscussions: [
          "Project evidence and technical review",
          "Testing, assay, processing and beneficiation",
          "Equipment and environmental or regulatory requirements",
          "Traceability and qualified industrial buyers",
        ],
        note: "IBRIZ / GAAS appears here only as a potential regulated infrastructure concept — never as active project finance.",
      },
      {
        id: "ports-logistics-finance-technology",
        title: "Ports, logistics, finance and technology",
        summary:
          "Production-to-port pathways, storage and cold chain, documentation, customs and standards preparation, insurance and trade-finance requirements, logistics visibility, and technology and data.",
        potentialDiscussions: [
          "Production-to-port pathways and storage or cold chain",
          "Documentation, customs and standards preparation",
          "Insurance and trade-finance requirements",
          "Logistics visibility and technology or data",
        ],
        note: "No confirmed port agreements or live routes are implied; corridors are conceptual.",
      },
    ],
  },

  programme: {
    eyebrow: "Proposed programme",
    title: "A five-day proposed structure.",
    lead: "The following is a proposed structure, subject to final confirmation. Formats are indicative and no date, venue, speaker, participant or visit is confirmed.",
    statusNote:
      "Proposed structure — subject to final confirmation. Dates, venue, participants and visits are not confirmed.",
    purposeLabel: "Purpose",
    formatsLabel: "Possible formats",
    days: [
      {
        id: "institutional-framework",
        dayLabel: "Day 1",
        title: "Institutional framework and qualification",
        purpose: [
          "Align the Forum with the Gateway",
          "Introduce qualified participants and working rules",
          "Clarify sector needs and capabilities",
          "Define decision objectives",
        ],
        formats: [
          "Institutional opening",
          "Ecosystem orientation",
          "Qualified participant briefings",
          "Value-chain and project orientation, and meeting preparation",
        ],
      },
      {
        id: "sector-workshops",
        dayLabel: "Day 2",
        title: "Sector workshops",
        purpose: [
          "Examine problems, opportunities and evidence gaps by sector",
          "Distinguish general interest from actionable files",
          "Prepare relevant meeting questions",
        ],
        formats: [
          "Agriculture and food workshop",
          "Feed and livestock workshop",
          "Water, energy and agritech workshop",
          "Mining and industry workshop",
          "Logistics, finance and technology workshop",
        ],
      },
      {
        id: "b2b-b2g-meetings",
        dayLabel: "Day 3",
        title: "B2B and B2G meetings",
        purpose: [
          "Conduct prepared meetings with a defined objective",
          "Link each request to a capability, project or value chain",
          "Identify evidence gaps and next actions",
        ],
        formats: [
          "Each meeting has a defined purpose and appropriate participants",
          "A related project, chain or institutional request",
          "Preparation notes and the questions or decisions sought",
          "An expected outcome category",
        ],
        note: "The website does not schedule or confirm meetings; there is no appointment booking.",
      },
      {
        id: "industrial-institutional-visits",
        dayLabel: "Day 4",
        title: "Industrial and institutional visits",
        purpose: [
          "Expose qualified participants to relevant Moroccan capabilities",
          "Support technical understanding",
          "Examine potential cooperation contexts",
        ],
        formats: [
          "Categories of industrial facilities",
          "Processing facilities",
          "Logistics or storage platforms",
          "Technology, training or relevant sector organizations",
        ],
        note: "Only categories of potential visits are shown. No facility or institution is published as a confirmed visit.",
      },
      {
        id: "decisions-follow-up",
        dayLabel: "Day 5",
        title: "Decisions and follow-up plan",
        purpose: [
          "Record the result of discussions",
          "Identify missing evidence and assign the next step",
          "Distinguish interest from commitment",
          "Prepare post-Forum follow-up",
        ],
        formats: [
          "Additional information requested",
          "Technical meeting or project review recommended",
          "Institutional or supply-and-offtake discussion recommended",
          "Industrial cooperation review recommended, or no progression at this stage",
        ],
        note: "P3 presents outcome categories only; it does not implement decision records or commitment tracking.",
      },
    ],
  },

  meeting: {
    eyebrow: "Meeting preparation",
    title: "What makes a Forum meeting worth holding.",
    lead: "A meeting is proposed only when it is prepared. These are the conditions a meeting should meet before it is worth anyone's time — all under human review.",
    criteria: [
      {
        title: "A defined purpose",
        text: "A clear business or institutional reason to meet.",
      },
      {
        title: "Qualified participants",
        text: "Appropriate participant categories on both sides.",
      },
      {
        title: "A linked file",
        text: "A related project, platform, value chain or request.",
      },
      {
        title: "Minimum preparation",
        text: "The minimum information needed to make the meeting useful.",
      },
      {
        title: "Questions or decisions",
        text: "The key questions or decisions sought.",
      },
      {
        title: "A realistic outcome",
        text: "An expected outcome category, reviewed by a person.",
      },
    ],
    checklistTitle: "Visitor preparation checklist",
    checklist: [
      "I can state a defined purpose for the meeting.",
      "I know which participant categories are relevant.",
      "I can link a project, platform or value chain.",
      "I can provide the minimum preparation information.",
      "I know the key questions or decisions I am seeking.",
      "I have a realistic expected outcome in mind.",
    ],
    note: "The website does not schedule or confirm meetings; a specialist determines whether a meeting is appropriate.",
  },

  outcomes: {
    eyebrow: "Expected outcomes",
    title: "Possible next-step categories.",
    lead: "A specialist review may reach one of the following categories. They are possible next steps, not decisions produced automatically by the website; only authorized humans determine the outcome, and participation does not guarantee a positive one.",
    items: [
      {
        id: "additional-information-required",
        label: "Additional information required",
      },
      {
        id: "specialist-review-recommended",
        label: "Specialist review recommended",
      },
      {
        id: "technical-meeting-recommended",
        label: "Technical meeting recommended",
      },
      {
        id: "institutional-discussion-recommended",
        label: "Institutional discussion recommended",
      },
      { id: "project-review-recommended", label: "Project review recommended" },
      {
        id: "supply-offtake-discussion-recommended",
        label: "Supply or offtake discussion recommended",
      },
      {
        id: "industrial-cooperation-review-recommended",
        label: "Industrial cooperation review recommended",
      },
      { id: "follow-up-after-forum", label: "Follow-up after the Forum" },
      {
        id: "no-progression-at-this-stage",
        label: "No progression at this stage",
      },
    ],
    note: "These categories describe possible reviews and discussions. They do not create commitments, deadlines or workflow states.",
  },

  prepare: {
    eyebrow: "Prepare for the Forum",
    title: "A preparation and qualification guide.",
    lead: "Prepare the information a specialist needs to review your request. No document is uploaded or transmitted through this website — you indicate only what exists.",
    stepsTitle: "What to prepare",
    steps: [
      {
        title: "Organizational identity",
        text: "Organization name, type and country.",
      },
      {
        title: "Authority and representative",
        text: "Representative name and role or authority.",
      },
      {
        title: "Participation path",
        text: "The participation path that best describes you.",
      },
      {
        title: "Sector track",
        text: "The relevant sector track.",
      },
      {
        title: "Related project or platform",
        text: "A related portfolio platform, where applicable.",
      },
      {
        title: "Related value chain",
        text: "A related value-chain pathway, where applicable.",
      },
      {
        title: "Purpose of participation",
        text: "Why you wish to engage, and the counterpart sought.",
      },
      {
        title: "Information available",
        text: "What information you currently have, and the desired outcome.",
      },
    ],
    evidenceTitle: "Evidence that may be relevant",
    evidenceLead:
      "You may indicate what evidence exists. Documents are never uploaded or emailed automatically; a controlled process follows only if review proceeds.",
    evidenceItems: [
      "Organization or company profile",
      "Mandate, authority or representation basis",
      "Project, asset or capability documentation",
      "Standards, certifications or technical references",
      "Ownership, licence or permit status where applicable",
    ],
    privacyTitle: "Claims and confidentiality",
    privacy: [
      "No participant directory is public and no submitted request is publicly visible.",
      "Your organization profile is not published through the qualification form.",
      "No automatic introduction, matching or acceptance is made.",
      "Do not enter confidential or sensitive information into the public form.",
      "Additional controlled exchange may occur later through approved channels.",
    ],
    ctaLabel: "Request Forum qualification",
  },

  metrics: {
    eyebrow: "How the Forum is measured",
    title: "Quality of outcomes, not attendance volume.",
    lead: "The Forum is measured by the quality of what it produces, not by how many people attend. These are the categories of value it aims to create.",
    items: [
      "Qualified organization files",
      "Documented needs and capabilities",
      "Prepared meetings with a defined purpose",
      "Projects progressed to specialist review",
      "Information gaps identified",
      "Decisions or next steps recorded",
      "Commitments requiring follow-up",
      "Post-Forum progress",
    ],
    note: "No targets or achieved numbers are published, and there is no metrics dashboard.",
  },

  crossLinks: {
    platformTitle: "Engage with this platform through the Forum",
    platformLead:
      "The Forum organizes qualified meetings and discussions around this platform. These are the relevant sector tracks; qualification precedes any meeting.",
    chainTitle: "Discuss this value chain at the Forum",
    chainLead:
      "The Forum organizes qualified discussions along this value chain. These are the relevant sector track and the stakeholder categories typically involved; qualification precedes any meeting.",
    tracksLabel: "Relevant sector tracks",
    stakeholdersLabel: "Stakeholder categories typically relevant",
    ctaLabel: "Request Forum qualification",
    exploreLabel: "Explore participation paths",
  },

  pages: {
    hub: {
      title: "Morocco–Sudan Economic Forum — qualification and engagement programme",
      description:
        "A private, invitation-based and qualification-led programme activating the permanent Gateway through preparation, meetings, decisions and structured follow-up.",
    },
    programme: {
      title: "Forum programme — a five-day proposed structure",
      description:
        "A proposed five-day structure, subject to final confirmation: institutional framework, sector workshops, prepared B2B and B2G meetings, categories of visits, and decisions with a follow-up plan.",
    },
    participation: {
      title: "Forum participation paths — who the Forum is for",
      description:
        "Six participation paths for Moroccan and Sudanese institutions, companies, producers, financiers and specialist partners — each with objectives, preparation and a qualification context.",
    },
    prepare: {
      title: "Prepare for the Forum — qualification guide",
      description:
        "A preparation and qualification guide for the Morocco–Sudan Economic Forum. Prepare the information a specialist needs; no document is uploaded through the website.",
    },
  },
};
