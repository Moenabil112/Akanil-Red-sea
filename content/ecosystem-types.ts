/**
 * P0 Red Sea ecosystem model (ADR-012…017).
 * Typed enums and content shapes for the public product architecture:
 * geographical nodes, portfolio platforms, claims/evidence states,
 * the expanded audience and request taxonomy, and technology capabilities.
 * Locale records implement these shapes independently per language.
 */

import type { Locale } from "./types";

/* ---------------- Claims and evidence control (ADR-015) ---------------- */

export type PublicStatus =
  | "public-profile"
  | "structured-project"
  | "controlled-review-available"
  | "institutional-review"
  | "technical-development"
  | "regulated-development"
  | "not-publicly-active";

export type EvidenceState =
  | "public-summary-available"
  | "controlled-evidence-available"
  | "due-diligence-summary-available"
  | "evidence-update-required"
  | "evidence-restricted"
  | "evidence-not-yet-published";

export type CapabilityState =
  | "active-public"
  | "active-controlled"
  | "manual-specialist-review"
  | "prototype"
  | "planned"
  | "regulated";

/**
 * Simplified visitor-facing portfolio status (P1 reconciliation §5).
 * The public experience uses only these four; the richer PublicStatus /
 * EvidenceState vocabulary remains internal to nodes and documentation.
 */
export type ProjectStatusId =
  | "public-profile-available"
  | "additional-information-after-review"
  | "update-required-before-publication"
  | "regulated-or-sensitive-project";

/* ---------------- Audience and request taxonomy (ADR-014) ---------------- */

export type AudienceId =
  | "moroccan-institutions"
  | "moroccan-industry-exporters"
  | "moroccan-finance-investment"
  | "sudanese-decision-makers"
  | "sudanese-producers-asset-owners"
  | "red-sea-ports-economic-zones"
  | "technology-logistics-knowledge-partners";

export type RequestTypeId =
  | "institutional-cooperation"
  | "market-expansion"
  | "project-investment-review"
  | "supply-offtake-requirement"
  | "industrial-partnership"
  | "port-logistics-cooperation"
  | "technology-data-partnership"
  | "forum-qualification"
  | "submit-project-asset";

export type IntakeFieldId =
  | "organization"
  | "organizationType"
  | "country"
  | "region"
  | "sector"
  | "contactName"
  | "role"
  | "email"
  | "phone"
  | "website"
  | "audience"
  | "requestType"
  | "platform"
  | "projectName"
  | "assetType"
  | "location"
  | "productionCapacity"
  | "requiredVolume"
  | "targetMarket"
  | "requiredPartner"
  | "investmentRange"
  | "evidenceAvailable"
  | "licenceStatus"
  | "summary"
  | "requestedNextStep"
  | "preferredLanguage"
  | "consent";

/* ---------------- Portfolio platforms (ADR-013) ---------------- */

export type PlatformId =
  | "trade-chain-africa"
  | "valura"
  | "rwafid"
  | "ibriz-gaas";

export interface PortfolioPlatformContent {
  id: PlatformId;
  name: string;
  category: string;
  purpose: string;
  problemSolved: string;
  operatingRole: string;
  geographicScope: string[];
  targetStakeholders: AudienceId[];
  capabilities: string[];
  /** Current-stage wording (P1 reconciliation §6). */
  stage: string;
  /** Simplified visitor-facing project status shown on the card (§5). */
  projectStatus: ProjectStatusId;
  /** Optional short qualifier appended to the status (e.g. "Preliminary Blueprint"). */
  statusDetail?: string;
  /** Localized last-reviewed date string (§5). */
  lastReviewed: string;
  /** Partners or capabilities sought (§6). */
  partnersSought: string[];
  /** Clearly-labelled preliminary indicative figures, where safe to show (§6). */
  indicativeFigures?: string[];
  /** Source and date qualifier for the indicative figures. */
  figuresNote?: string;
  regulatoryNote?: string;
  cta: {
    label: string;
    requestType: RequestTypeId;
  };
  /* ---- P1 dedicated-profile fields (P1 §6, §13) ---- */
  /** Localized source-document date, where applicable (distinct from lastReviewed). */
  sourceDate?: string;
  /** What is public about the project now. */
  publicInformation: string[];
  /** What may be available only after specialist review. */
  reviewInformation: string[];
  /** Claims and limitations notice, per platform. */
  limitations: string[];
  /** Project-specific preparation for a review request. */
  preparationRequirements: string[];
}

/* ---------------- Geographical nodes (ADR-017) ---------------- */

export type NodeKind =
  | "port"
  | "economic-zone"
  | "industrial-node"
  | "production-region"
  | "logistics-node"
  | "market-access-node"
  | "financial-node";

export type EcosystemNodeId =
  | "tanger-med"
  | "morocco-industry"
  | "morocco-finance"
  | "morocco-market-access"
  | "kaec"
  | "king-abdullah-port"
  | "ain-sokhna"
  | "aswan"
  | "port-sudan"
  | "northern-state"
  | "kassala"
  | "gedaref"
  | "bosaso"
  | "asmara-massawa";

export interface EcosystemNodeContent {
  id: EcosystemNodeId;
  name: string;
  country: string;
  kind: NodeKind;
  role: string;
  platformIds: PlatformId[];
  publicSummary: string;
  evidenceState: EvidenceState;
  publicStatus: PublicStatus;
}

/* ---------------- Audience paths (ADR-014) ---------------- */

export interface AudiencePathContent {
  id: AudienceId;
  title: string;
  whoItIncludes: string[];
  strategicNeed: string;
  gatewayValue: string[];
  relevantPlatforms: PlatformId[];
  allowedRequestTypes: RequestTypeId[];
  defaultRequestType: RequestTypeId;
  preparationRequirements: string[];
  expectedReviewOutput: string;
  ctaLabel: string;
  note?: string;
}

/* ---------------- Request definitions (ADR-014) ---------------- */

export interface RequestTypeContent {
  id: RequestTypeId;
  label: string;
  description: string;
  intendedFor: AudienceId[];
  expectedReviewOutput: string[];
  preparationRequirements: string[];
  disclaimer?: string;
}

/* ---------------- Technology layer ---------------- */

export interface TechnologyCapabilityContent {
  title: string;
  text: string;
  state: CapabilityState;
}

/* ---------------- Founder affiliations (§23) ---------------- */

export interface InstitutionalAffiliation {
  organization: string;
  country: string;
  startYear: number;
  status: "verified-current" | "verified-historical" | "evidence-required";
  publicWording: string;
}

/* ---------------- Locale ecosystem record ---------------- */

export interface EcosystemContent {
  hero: {
    eyebrow: string;
    titleLines: { text: string; emphasis: boolean }[];
    lead: string;
    primary: { label: string; explanation: string };
    secondary: { label: string; explanation: string };
    institutional: { label: string; explanation: string };
  };
  whyRedSea: {
    title: string;
    lead: string;
    layersTitle: string;
    layers: string[];
    bridgeTitle: string;
    bridgeText: string;
    linkLabel: string;
  };
  valueFlow: {
    title: string;
    lead: string;
    steps: string[];
    moroccoPlatformTitle: string;
    moroccoPlatformRoles: string[];
    marketAccessNote: string;
  };
  audiences: {
    eyebrow: string;
    title: string;
    lead: string;
    whoLabel: string;
    valueLabel: string;
    platformsLabel: string;
    preparationLabel: string;
    reviewOutputLabel: string;
    paths: AudiencePathContent[];
  };
  platforms: {
    eyebrow: string;
    title: string;
    lead: string;
    /** Concise note distinguishing the four platforms from ecosystem nodes (§4). */
    nodeDistinction: string;
    /** What a Request Project Review does and does not mean (§7). */
    reviewRequestNote: string;
    categoryLabel: string;
    purposeLabel: string;
    problemLabel: string;
    roleLabel: string;
    scopeLabel: string;
    audiencesLabel: string;
    capabilitiesLabel: string;
    stageLabel: string;
    figuresLabel: string;
    partnersLabel: string;
    fileStatusLabel: string;
    lastReviewedLabel: string;
    /** P1 profile labels (§6). */
    sourceDateLabel: string;
    publicInfoLabel: string;
    reviewInfoLabel: string;
    limitationsLabel: string;
    prepLabel: string;
    snapshotLabel: string;
    reviewPathwayLabel: string;
    profileLinkLabel: string;
    profileHeroEyebrow: string;
    /** Used by the node map for node status/evidence display. */
    statusLabel: string;
    evidenceLabel: string;
    regulatoryLabel: string;
    items: PortfolioPlatformContent[];
  };
  nodes: {
    eyebrow: string;
    title: string;
    lead: string;
    mapLabel: string;
    disclaimer: string;
    kindLabels: Record<NodeKind, string>;
    listTitle: string;
    selectPrompt: string;
    items: EcosystemNodeContent[];
  };
  technology: {
    eyebrow: string;
    title: string;
    lead: string;
    principle: string;
    stateLabel: string;
    capabilities: TechnologyCapabilityContent[];
  };
  review: {
    eyebrow: string;
    title: string;
    lead: string;
    disciplinesTitle: string;
    disciplines: string[];
    routingTitle: string;
    routing: string[];
    guarantees: string[];
  };
  /** Reusable visitor-facing review panel (P1 §11). */
  reviewPanel: {
    eyebrow: string;
    title: string;
    lead: string;
    stepsTitle: string;
    steps: string[];
    statementsTitle: string;
    statements: string[];
  };
  states: {
    publicStatus: Record<PublicStatus, string>;
    evidenceState: Record<EvidenceState, string>;
    capabilityState: Record<CapabilityState, string>;
    projectStatus: Record<ProjectStatusId, string>;
  };
  institution: {
    eyebrow: string;
    heading: string;
    lead: string;
    facts: { label: string; value: string }[];
    networkTitle: string;
    networkNote: string;
    representatives: string[];
    /** Economic-bridge foundation (P1 §4.3): both sides of the bridge. */
    bridgeTitle: string;
    bridgeLead: string;
    bridgeGroups: { title: string; items: string[] }[];
  };
  claims: {
    title: string;
    scope: string[];
  };
  founder: {
    name: string;
    bridgeTitle: string;
    bridgeText: string;
  };
  portfolioPage: {
    title: string;
    description: string;
    heading: string;
    lead: string;
  };
  corridorPage: {
    heading: string;
    lead: string;
    scenariosTitle: string;
    rulesTitle: string;
    rules: string[];
  };
  ui: {
    navPortfolio: string;
    footerPortfolio: string;
    learnMoreWhyRedSea: string;
  };
}

export type EcosystemRecords = Record<Locale, EcosystemContent>;
