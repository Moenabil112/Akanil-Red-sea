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
