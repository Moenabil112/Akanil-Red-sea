import type { ReceptionContent } from "../types";

/** English — reception desk (P0 request taxonomy, ADR-014). */
export const enReception: ReceptionContent = {
  eyebrow: "Institutional reception",
  heading: "Structured institutional reception",
  lead: "A controlled institutional desk — not an open portal. You prepare a structured request, review it, and send it through your own email service. Requests are reviewed by an authorized multidisciplinary team; reception does not mean acceptance.",
  channelsTitle: "Direct channels",
  emailChannelLabel: "Institutional email",
  phoneChannelLabel: "Direct telephone",
  phoneNote: "Telephone remains available as a separate direct channel.",
  noJsNote:
    "If the structured form is unavailable in your browser, contact the desk directly by email or telephone using the channels above.",
  requestTypes: {
    "institutional-cooperation": {
      label: "Institutional cooperation",
      description:
        "For ministries, public institutions, associations and development bodies.",
      expectedReviewOutput: [
        "Preliminary institutional briefing",
        "Cooperation-scope clarification",
        "Evidence or mandate gap request",
        "Recommendation for a specialized discussion where justified",
      ],
      preparationRequirements: [
        "Institutional identity and mandate",
        "Cooperation subject and intended scope",
      ],
    },
    "market-expansion": {
      label: "Market expansion",
      description:
        "For Moroccan and international companies seeking Sudan, Red Sea or Horn of Africa market access.",
      expectedReviewOutput: [
        "Preliminary market-entry relevance review",
        "Stakeholder categories required",
        "Market and evidence gaps",
        "Recommended qualification step",
      ],
      preparationRequirements: [
        "Company profile and sector",
        "Target market definition",
      ],
    },
    "project-investment-review": {
      label: "Project investment review",
      description:
        "For banks, investors, institutions and qualified project sponsors.",
      expectedReviewOutput: [
        "Preliminary project-fit review",
        "Controlled evidence requirements",
        "Project review pathway",
        "Possible transition to a later evidence-review phase",
      ],
      preparationRequirements: [
        "Project identification",
        "Available evidence overview",
      ],
      disclaimer:
        "Reception of a project-review request does not constitute investment approval, investment solicitation, financing availability or project endorsement.",
    },
    "supply-offtake-requirement": {
      label: "Supply or offtake requirement",
      description: "For buyers, producers, exporters and manufacturers.",
      expectedReviewOutput: [
        "Structured supply or purchase requirement",
        "Volume, standards and evidence-gap clarification",
        "Relevant value-chain pathway",
      ],
      preparationRequirements: [
        "Product or asset type",
        "Indicative volumes and standards where available",
      ],
    },
    "industrial-partnership": {
      label: "Industrial partnership",
      description:
        "For processing, manufacturing, packaging, mining, agricultural and industrial cooperation.",
      expectedReviewOutput: [
        "Preliminary industrial-role assessment",
        "Required capabilities and evidence",
        "Proposed value-chain position",
      ],
      preparationRequirements: [
        "Industrial capability profile",
        "Intended cooperation role",
      ],
    },
    "port-logistics-cooperation": {
      label: "Port and logistics cooperation",
      description:
        "For ports, terminals, logistics operators, economic zones and transport providers.",
      expectedReviewOutput: [
        "Preliminary corridor-role assessment",
        "Logistics-data requirements",
        "Relevant platform and stakeholder pathway",
      ],
      preparationRequirements: [
        "Organization profile and operating role",
        "Corridor or zone of interest",
      ],
    },
    "technology-data-partnership": {
      label: "Technology and data partnership",
      description:
        "For AI, telecom, traceability, automation, banking-infrastructure, research and technical partners — including regulated-infrastructure discussion.",
      expectedReviewOutput: [
        "Preliminary technical-role assessment",
        "Integration and evidence requirements",
        "Regulatory or data-governance considerations",
      ],
      preparationRequirements: [
        "Capability profile and reference use cases",
        "Intended ecosystem role",
      ],
    },
    "forum-qualification": {
      label: "Forum qualification",
      description:
        "For potential participants in the Morocco–Sudan Economic Forum.",
      expectedReviewOutput: [
        "Qualification review",
        "Request for company, institution, capability or need evidence",
        "Clarification of programme relevance",
      ],
      preparationRequirements: [
        "Organization profile",
        "Capability or need to bring to the programme",
      ],
      disclaimer:
        "Qualification review does not promise participation or invitation.",
    },
    "submit-project-asset": {
      label: "Submit a project or asset",
      description:
        "For project sponsors, asset owners, landowners, factory owners, producers and economic-zone developers.",
      expectedReviewOutput: [
        "Preliminary classification",
        "Evidence completeness review",
        "Identification of missing legal, technical, financial or market documentation",
        "Decision on whether a controlled project review may proceed",
      ],
      preparationRequirements: [
        "Project or asset identification and location",
        "Overview of available evidence",
      ],
      disclaimer:
        "Submission does not publish the project and does not constitute acceptance; publication never happens automatically.",
    },
  },
  audienceLabel: "Entry path",
  chainLabel: "Relevant value chain",
  participantLabel: "Forum participation path",
  trackLabel: "Forum sector track",
  audienceNames: {
    "moroccan-institutions": "Moroccan institutions",
    "moroccan-industry-exporters": "Moroccan industry and exporters",
    "moroccan-finance-investment": "Moroccan finance and investment",
    "sudanese-decision-makers": "Sudanese decision-makers",
    "sudanese-producers-asset-owners":
      "Sudanese producers, exporters and asset owners",
    "red-sea-ports-economic-zones": "Red Sea ports and economic zones",
    "technology-logistics-knowledge-partners":
      "Technology, logistics and knowledge partners",
  },
  fieldLabels: {
    organization: "Organization name",
    organizationType: "Organization type",
    country: "Organization country",
    region: "Region",
    sector: "Sector",
    contactName: "Contact person (professional name)",
    role: "Professional role or authority",
    email: "Professional email",
    phone: "Telephone number",
    website: "Organization website",
    audience: "Entry path",
    requestType: "Request type",
    platform: "Relevant platform",
    projectName: "Project or asset name",
    assetType: "Asset or product type",
    location: "Location",
    productionCapacity: "Production capacity (indicative)",
    requiredVolume: "Required volume (indicative)",
    targetMarket: "Target market",
    requiredPartner: "Required partner category",
    investmentRange: "Indicative investment range",
    evidenceAvailable: "Evidence available",
    licenceStatus: "Licence or permit status",
    summary: "Concise request summary",
    requestedNextStep: "Requested next step",
    preferredLanguage: "Preferred language",
    consent: "Consent",
  },
  fieldHints: {
    summary: "A few sentences: who you are, what you request, and why.",
    evidenceAvailable:
      "Indicate what exists — documents are never uploaded or emailed automatically; a controlled process follows if review proceeds.",
    productionCapacity: "Approximate figures only; no verified claims implied.",
    requiredVolume: "Approximate figures only; no verified claims implied.",
    investmentRange: "Indicative only; no financing availability is implied.",
  },
  evidenceOptions: [
    { id: "company-profile", label: "Company profile" },
    { id: "legal-documents", label: "Legal documents" },
    { id: "land-asset-documents", label: "Land or asset documents" },
    { id: "licence-permit", label: "Licence or permit documents" },
    { id: "technical-study", label: "Technical study" },
    { id: "financial-model", label: "Financial model" },
    { id: "market-study", label: "Market study" },
    { id: "esg-study", label: "Environmental or social study" },
    { id: "product-specs", label: "Product specifications" },
    { id: "certifications", label: "Certifications" },
    { id: "logistics-data", label: "Logistics data" },
  ],
  expectedReviewLabel: "Expected review output",
  preparationLabel: "Prepare before requesting",
  form: {
    legend: "Structured request",
    optionalLegend: "Optional details",
    consentLabel: "Consent",
    consentText:
      "I consent to the use of the information above to review and respond to this request.",
    requiredMark: "required",
    optionalMark: "optional",
    errors: {
      required: "This field is required.",
      email: "Enter a valid professional email address.",
      consent: "Consent is required to prepare the request.",
      summaryLength: "Please write a short summary (at least 20 characters).",
    },
    reviewButton: "Review the request",
    backButton: "Back",
  },
  review: {
    title: "Review before sending",
    lead: "Check the structured summary below. Nothing has been sent yet.",
    whatHappens: "What happens next",
    steps: [
      "Your email application opens with this request pre-filled, addressed to the reception desk.",
      "You send the email yourself, through your own email service — the website transmits nothing.",
      "The specialized team reviews the request and responds through a controlled channel.",
    ],
    openEmailButton: "Open the request in my email application",
    editButton: "Edit the request",
    copySubjectButton: "Copy the subject",
    copyBodyButton: "Copy the structured request",
    downloadDraftButton: "Download a local draft (.txt)",
    copiedAnnouncement: "Copied to clipboard.",
    downloadedAnnouncement: "Local draft downloaded.",
    missingOptionalNote:
      "Optional information not provided is simply omitted; the review may request it later.",
  },
  afterOpen: {
    title: "Your email application should now be open.",
    text: "The request has been prepared and handed to your email application. It is sent only when you press Send there.",
    notSentWarning:
      "Nothing has been submitted through this website — if your email application did not open, use the direct channels below or the copy and download actions above.",
    directLine: "Direct channels",
  },
  privacy: {
    title: "Privacy and review status",
    points: [
      "Information entered here stays on this page until you open your email application; this website does not store or transmit it.",
      "No cookies, browser storage or analytics are used for this form, and no files can be uploaded.",
      "Transmission happens through your own email service, under your control.",
      "Reception does not mean acceptance, qualification, endorsement or partnership — every request is reviewed by an authorized multidisciplinary team.",
    ],
  },
  email: {
    subjectPrefix: "[Gateway Reception]",
    intro: "Structured institutional request prepared on the public window:",
    fieldLabels: {
      organization: "Organization",
      organizationType: "Organization type",
      country: "Country",
      region: "Region",
      sector: "Sector",
      contactName: "Contact person",
      role: "Role / authority",
      email: "Professional email",
      phone: "Telephone",
      website: "Website",
      audience: "Entry path",
      requestType: "Request type",
      platform: "Relevant platform",
      projectName: "Project / asset name",
      assetType: "Asset / product type",
      location: "Location",
      productionCapacity: "Production capacity (indicative)",
      requiredVolume: "Required volume (indicative)",
      targetMarket: "Target market",
      requiredPartner: "Required partner category",
      investmentRange: "Indicative investment range",
      evidenceAvailable: "Evidence available",
      licenceStatus: "Licence / permit status",
      summary: "Request summary",
      requestedNextStep: "Requested next step",
      preferredLanguage: "Preferred language",
      consent: "Consent",
    },
    outro:
      "This request was prepared on the public window and sent by the requester's own email service. It is subject to specialized human review; reception does not mean acceptance.",
  },
};
