/**
 * Trilingual content model. Every locale record implements SiteContent,
 * so a missing or extra key in any language fails type checking (ADR-003).
 * Records are plain serializable data — no JSX, no runtime translation.
 */

export type Locale = "ar" | "fr" | "en";

export type RouteState =
  | "conceptual"
  | "under-study"
  | "pilot-qualified"
  | "verified"
  | "constrained"
  | "alternative";

export type CorridorNodeId = "morocco" | "egypt" | "saudi" | "red-sea" | "sudan";

export interface Cta {
  label: string;
  /** What happens next — CTAs must be specific and non-promissory. */
  explanation: string;
}

export interface TitledText {
  title: string;
  text: string;
}

export interface CorridorNodeContent {
  id: CorridorNodeId;
  name: string;
  role: string;
  description: string;
}

export interface CorridorRouteContent {
  /** Route register id from P1-04 (CR-01 …). */
  id: string;
  from: CorridorNodeId;
  to: CorridorNodeId;
  /** Optional intermediate stop for multi-leg scenarios. */
  via?: CorridorNodeId;
  state: RouteState;
  label: string;
  summary: string;
}

export interface ValueChainContent {
  name: string;
  summary: string;
  stages: TitledText[];
  outcome: string;
}

export interface SiteContent {
  meta: {
    title: string;
    description: string;
    ogAlt: string;
  };
  ui: {
    skipLink: string;
    languageLabel: string;
    languageNames: Record<Locale, string>;
    menuOpen: string;
    menuClose: string;
    close: string;
    sectionLabel: string;
    conceptArtLabel: string;
    navLabel: string;
    nav: { anchor: string; label: string }[];
    footer: {
      entity: string;
      tagline: string;
      note: string;
      hierarchy: string[];
    };
  };
  hero: {
    eyebrow: string;
    titleLines: { text: string; emphasis: boolean }[];
    lead: string;
    primary: Cta;
    secondary: Cta;
    pillars: TitledText[];
    scopeLabel: string;
    scopeNodes: string[];
    motto: string;
  };
  why: {
    eyebrow: string;
    title: string;
    lead: string;
    problemsTitle: string;
    problems: TitledText[];
    answerTitle: string;
    answerLead: string;
    answers: TitledText[];
  };
  architecture: {
    eyebrow: string;
    title: string;
    lead: string;
    layers: {
      badge: string;
      name: string;
      role: string;
      text: string;
      keywords: string;
    }[];
    chamberNote: string;
  };
  morocco: {
    eyebrow: string;
    title: string;
    lead: string;
    statement: string;
    pillars: TitledText[];
    audienceTitle: string;
    audiences: string[];
  };
  sudan: {
    eyebrow: string;
    title: string;
    lead: string;
    roles: TitledText[];
    equationTitle: string;
    equationParts: string[];
    equationResult: string;
    partnershipNote: string;
  };
  corridor: {
    eyebrow: string;
    title: string;
    lead: string;
    disclaimer: string;
    mapAria: string;
    legendTitle: string;
    states: Record<RouteState, { label: string; description: string }>;
    nodes: CorridorNodeContent[];
    routes: CorridorRouteContent[];
    summaryTitle: string;
    selectPrompt: string;
    nodeListTitle: string;
    principle: string;
  };
  chains: {
    eyebrow: string;
    title: string;
    lead: string;
    tabListLabel: string;
    stageFlowLabel: string;
    chains: ValueChainContent[];
    outcomeLabel: string;
  };
  forum: {
    eyebrow: string;
    title: string;
    lead: string;
    facts: TitledText[];
    posterAlt: string;
    posterLabel: string;
    cta: Cta;
  };
  operating: {
    eyebrow: string;
    title: string;
    lead: string;
    statusNote: string;
    steps: TitledText[];
  };
  trust: {
    eyebrow: string;
    title: string;
    lead: string;
    quote: string;
    principles: TitledText[];
  };
  about: {
    eyebrow: string;
    title: string;
    paragraphs: string[];
    rolesTitle: string;
    roles: string[];
    founderQuote: string;
    founderName: string;
    founderRole: string;
  };
  contact: {
    eyebrow: string;
    title: string;
    lead: string;
    actionsTitle: string;
    actions: TitledText[];
    open: Cta;
    modal: {
      title: string;
      body: string;
      privacyNote: string;
      referenceLabel: string;
      reference: string;
      close: string;
    };
  };
}

/* ================================================================
   Gateway experience extension (Phases 1–4):
   status layer, audience entry paths, homepage summaries,
   per-route metadata and the Digital Reception Lite desk.
   ================================================================ */

export type PageRoute =
  | "gateway"
  | "morocco"
  | "sudan"
  | "corridor"
  | "value-chains"
  | "forum"
  | "trust"
  | "about-akanil"
  | "reception";

export type StatusKind =
  | "approved"
  | "live"
  | "active"
  | "controlled"
  | "conceptual"
  | "future";

export type AudienceId =
  | "moroccan-institution"
  | "moroccan-company"
  | "sudanese-organization"
  | "financial-partner"
  | "sector-partner";

export type RequestTypeId =
  | "briefing"
  | "qualification"
  | "value-chain"
  | "meeting"
  | "capability"
  | "need-opportunity"
  | "forum";

export interface AudiencePathContent {
  id: AudienceId;
  name: string;
  forWho: string;
  purposes: string[];
  requestTypes: RequestTypeId[];
  defaultRequestType: RequestTypeId;
  ctaLabel: string;
  note?: string;
}

export interface SummaryBlock {
  title: string;
  text: string;
  linkLabel: string;
}

export interface ExperienceContent {
  status: {
    eyebrow: string;
    title: string;
    items: { label: string; state: string; kind: StatusKind; note: string }[];
  };
  audiences: {
    eyebrow: string;
    title: string;
    lead: string;
    statesLegend: Record<StatusKind, string>;
    paths: AudiencePathContent[];
  };
  summaries: {
    value: SummaryBlock & { morocco: SummaryBlock; sudan: SummaryBlock };
    journey: SummaryBlock & { stepsShown: number };
    chains: SummaryBlock;
    corridor: SummaryBlock;
    forum: SummaryBlock;
    trust: SummaryBlock;
    about: SummaryBlock;
  };
  receptionCta: {
    eyebrow: string;
    title: string;
    text: string;
    emailLabel: string;
    phoneLabel: string;
    openLabel: string;
    reviewNote: string;
  };
  pages: Record<PageRoute, { title: string; description: string }>;
  gatewayPage: {
    eyebrow: string;
    heading: string;
    lead: string;
  };
  navGroups: { href: string; label: string }[];
  footerNav: { href: string; label: string }[];
  learnMore: string;
}

export interface ReceptionContent {
  eyebrow: string;
  heading: string;
  lead: string;
  channelsTitle: string;
  emailChannelLabel: string;
  phoneChannelLabel: string;
  phoneNote: string;
  noJsNote: string;
  requestTypes: Record<RequestTypeId, { label: string; description: string }>;
  audienceLabel: string;
  form: {
    legend: string;
    requestType: string;
    organization: string;
    country: string;
    sector: string;
    contactName: string;
    role: string;
    email: string;
    summary: string;
    summaryHint: string;
    phone: string;
    website: string;
    preferredLanguage: string;
    valueChain: string;
    valueChainNone: string;
    optionalLegend: string;
    consentLabel: string;
    consentText: string;
    requiredMark: string;
    optionalMark: string;
    errors: {
      required: string;
      email: string;
      consent: string;
      summaryLength: string;
    };
    reviewButton: string;
    backButton: string;
  };
  review: {
    title: string;
    lead: string;
    whatHappens: string;
    steps: string[];
    openEmailButton: string;
    editButton: string;
  };
  afterOpen: {
    title: string;
    text: string;
    notSentWarning: string;
    directLine: string;
  };
  privacy: {
    title: string;
    points: string[];
  };
  email: {
    subjectPrefix: string;
    intro: string;
    fieldLabels: Record<
      | "requestType"
      | "audience"
      | "organization"
      | "country"
      | "sector"
      | "contactName"
      | "role"
      | "email"
      | "phone"
      | "website"
      | "preferredLanguage"
      | "valueChain"
      | "summary",
      string
    >;
    outro: string;
  };
}
