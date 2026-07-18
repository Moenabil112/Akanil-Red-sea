import type { ReceptionContent } from "../types";

/** English — Digital Reception Lite desk. */
export const enReception: ReceptionContent = {
  eyebrow: "Institutional reception",
  heading: "Digital Reception Lite",
  lead: "A controlled institutional desk — not an open portal. You prepare a structured request, review it, and send it through your own email service. Every request is reviewed by an authorized person; reception does not mean acceptance.",
  channelsTitle: "Direct channels",
  emailChannelLabel: "Institutional email",
  phoneChannelLabel: "Direct telephone",
  phoneNote: "Telephone remains available as a separate direct channel.",
  noJsNote:
    "If the structured form is unavailable in your browser, contact the desk directly by email or telephone using the channels above.",
  requestTypes: {
    briefing: {
      label: "Institutional briefing",
      description:
        "A structured presentation of the Gateway for an institution or organization.",
    },
    qualification: {
      label: "Company qualification",
      description:
        "Understand and begin the qualification path for your company.",
    },
    "value-chain": {
      label: "Priority value-chain inquiry",
      description:
        "A concrete interest in one of the four priority value chains.",
    },
    meeting: {
      label: "Controlled meeting",
      description:
        "A purposeful, documented session with a defined agenda.",
    },
    capability: {
      label: "Capability presentation",
      description:
        "Present an industrial, technological, logistical or knowledge capability.",
    },
    "need-opportunity": {
      label: "Qualified need or opportunity discussion",
      description:
        "Present a documented need or discuss a qualified opportunity.",
    },
    forum: {
      label: "Forum qualification inquiry",
      description:
        "Ask about qualification for the private Morocco–Sudan Economic Forum.",
    },
  },
  audienceLabel: "Entry path",
  form: {
    legend: "Structured request",
    requestType: "Request type",
    organization: "Organization name",
    country: "Organization country",
    sector: "Sector",
    contactName: "Contact person (professional name)",
    role: "Professional role or authority",
    email: "Professional email",
    summary: "Concise request summary",
    summaryHint: "A few sentences: who you are, what you request, and why.",
    phone: "Telephone number",
    website: "Organization website",
    preferredLanguage: "Preferred language",
    valueChain: "Relevant value chain",
    valueChainNone: "Not specific to one chain",
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
      "An authorized person reviews the request and responds through a controlled channel.",
    ],
    openEmailButton: "Open the request in my email application",
    editButton: "Edit the request",
  },
  afterOpen: {
    title: "Your email application should now be open.",
    text: "The request has been prepared and handed to your email application. It is sent only when you press Send there.",
    notSentWarning:
      "Nothing has been submitted through this website — if your email application did not open, use the direct channels below.",
    directLine: "Direct channels",
  },
  privacy: {
    title: "Privacy and review status",
    points: [
      "Information entered here stays on this page until you open your email application; this website does not store or transmit it.",
      "No cookies, browser storage or analytics are used for this form.",
      "Transmission happens through your own email service, under your control.",
      "Reception does not mean acceptance, qualification or partnership — every request remains subject to human review.",
    ],
  },
  email: {
    subjectPrefix: "[Gateway Reception]",
    intro: "Structured institutional request submitted via the Gateway introduction window:",
    fieldLabels: {
      requestType: "Request type",
      audience: "Entry path",
      organization: "Organization",
      country: "Country",
      sector: "Sector",
      contactName: "Contact person",
      role: "Role / authority",
      email: "Professional email",
      phone: "Telephone",
      website: "Website",
      preferredLanguage: "Preferred language",
      valueChain: "Relevant value chain",
      summary: "Request summary",
    },
    outro:
      "This request was prepared on the public introduction window and sent by the requester's own email service. It is subject to human review; reception does not mean acceptance.",
  },
};
