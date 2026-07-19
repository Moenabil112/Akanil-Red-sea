/**
 * P2 value-chain and economic-pathway model (ADR-018).
 * Typed enums and content shapes for the six priority value chains:
 * the shared-value flow, scenario status, geographic value contribution,
 * cross-cutting enabling layers and the chain-aware reception routing.
 * Locale records implement these shapes independently per language.
 *
 * Structural relationships (chain ids, the platform↔chain mapping and the
 * approved request-type routing) live in `lib/value-chains.ts`; wording
 * lives here, in the locale records, so the two cannot drift between
 * languages (parity is test-enforced).
 */

import type { RequestTypeId } from "./ecosystem-types";

/* ---------------- Value-chain identity (ADR-018) ---------------- */

export type ValueChainId =
  | "oilseeds-agro-processing"
  | "food-cold-chain"
  | "feed-livestock"
  | "water-energy-agritech"
  | "mining-mineral-value"
  | "ports-logistics-corridors";

/**
 * Scenario status vocabulary for value-chain pathways (P2 §claims). These
 * are explicitly *scenarios* — potential, indicative pathways requiring
 * current commercial, regulatory and logistics review — never confirmed
 * routes, volumes, tariffs, transit times or approvals. Distinct from the
 * platform-level ProjectStatusId.
 */
export type ScenarioStatusId =
  | "public-pathway-overview"
  | "requires-current-verification"
  | "additional-information-after-review"
  | "regulated-or-sensitive-elements";

/** One stage of the shared-value flow (semantic ordered markup first). */
export interface ValueFlowStage {
  /** Stage name, e.g. "Sudanese source and capability". */
  title: string;
  /** What happens at this stage. */
  role: string;
  /** Where the value is contributed (side of the bridge). */
  contribution: string;
}

/** A titled group of items (geographic contribution, scoping lists). */
export interface ValueGroup {
  title: string;
  items: string[];
}

export interface ValueChainProfileContent {
  id: ValueChainId;
  /** Full pathway name for the profile hero and metadata. */
  name: string;
  /** Compact name for overview cards and cross-links. */
  shortName: string;
  category: string;
  /** One-paragraph overview used on the card and profile hero lead. */
  summary: string;
  scenarioStatus: ScenarioStatusId;
  /** Where this scenario is grounded (approved baselines, not market data). */
  sourceBasis: string;
  lastReviewed: string;
  /** The structural problem this pathway addresses. */
  problem: string;
  /** The shared-value opportunity, framed as a potential pathway. */
  opportunity: string;
  /** Ordered shared-value flow: source → qualification → processing → finance/logistics → market → outcome. */
  flow: ValueFlowStage[];
  /** Wording for the related-platforms block (the ids come from lib). */
  relatedPlatformsNote: string;
  /** Geographic value contribution: Morocco / Sudan / corridor. */
  geographicContribution: ValueGroup[];
  /** Cross-cutting enabling layers most relevant to this chain. */
  enablingLayers: string[];
  /** What is a public pathway overview now. */
  publicScope: string[];
  /** What requires current verification or is available only after review. */
  verificationScope: string[];
  /** Scenario boundaries and claim limitations for this chain. */
  limitations: string[];
  /** Preparation before requesting a chain review. */
  preparationRequirements: string[];
  cta: {
    label: string;
    requestType: RequestTypeId;
  };
  /** Optional regulated/sensitive notice (mining, cross-border logistics). */
  regulatoryNote?: string;
}

export interface ValueChainsContent {
  /* ---- Overview page ---- */
  overviewEyebrow: string;
  overviewTitle: string;
  overviewLead: string;
  chainsListLabel: string;
  profileHeroEyebrow: string;
  profileLinkLabel: string;
  learnMoreLabel: string;
  /** Note distinguishing scenarios from confirmed routes (claims control). */
  scenarioNote: string;

  /* ---- Shared labels (both overview and profile) ---- */
  categoryLabel: string;
  scenarioStatusLabel: string;
  sourceBasisLabel: string;
  lastReviewedLabel: string;
  problemLabel: string;
  opportunityLabel: string;
  flowLabel: string;
  flowRoleLabel: string;
  flowContributionLabel: string;
  relatedPlatformsLabel: string;
  geographicLabel: string;
  enablingLayersLabel: string;
  publicScopeLabel: string;
  verificationScopeLabel: string;
  limitationsLabel: string;
  prepLabel: string;
  regulatoryLabel: string;

  /* ---- Scenario status vocabulary ---- */
  scenarioStatus: Record<ScenarioStatusId, string>;

  /* ---- Cross-cutting enabling layers (shared framing on the overview) ---- */
  enabling: {
    eyebrow: string;
    title: string;
    lead: string;
    layers: { title: string; text: string }[];
  };

  /* ---- Geographic value contribution (shared framing on the overview) ---- */
  geographic: {
    eyebrow: string;
    title: string;
    lead: string;
    groups: ValueGroup[];
  };

  items: ValueChainProfileContent[];
}
