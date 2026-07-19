/**
 * Shared, non-locale value-chain constants (ADR-018).
 * Locale records carry wording; this module carries structure so the
 * chain order, the platform↔chain mapping and the approved request-type
 * routing cannot drift between languages. Parity is enforced by tests.
 */

import type { PlatformId, RequestTypeId } from "@/content/ecosystem-types";
import type { ValueChainId } from "@/content/value-chains-types";

/** Public order of the six priority value chains (P2). */
export const valueChainIds: ValueChainId[] = [
  "oilseeds-agro-processing",
  "food-cold-chain",
  "feed-livestock",
  "water-energy-agritech",
  "mining-mineral-value",
  "ports-logistics-corridors",
];

export function isValueChainId(value: string): value is ValueChainId {
  return (valueChainIds as string[]).includes(value);
}

/**
 * Level-3 platform → related value chains (P2). Single source of truth:
 * the reverse chain → platforms view is derived from it, so the two
 * directions can never disagree.
 *
 * IBRIZ/GAAS relates to mining and ports only as a *potential regulated
 * enabling layer* — never as active financing (see `platformChainCaveats`).
 */
export const platformChainMap: Record<PlatformId, ValueChainId[]> = {
  valura: [
    "oilseeds-agro-processing",
    "food-cold-chain",
    "water-energy-agritech",
  ],
  rwafid: [
    "oilseeds-agro-processing",
    "food-cold-chain",
    "feed-livestock",
    "water-energy-agritech",
  ],
  "trade-chain-africa": [
    "oilseeds-agro-processing",
    "food-cold-chain",
    "feed-livestock",
    "mining-mineral-value",
    "ports-logistics-corridors",
  ],
  "ibriz-gaas": ["mining-mineral-value", "ports-logistics-corridors"],
};

/**
 * Platforms whose relation to a chain is qualified rather than direct.
 * Used to render the "potential regulated enabling layer only" caveat
 * for IBRIZ/GAAS (never active financing).
 */
export const platformChainCaveat: Partial<Record<PlatformId, boolean>> = {
  "ibriz-gaas": true,
};

/** Value chains related to a given platform, in canonical order. */
export function chainsForPlatform(platform: PlatformId): ValueChainId[] {
  const set = new Set(platformChainMap[platform]);
  return valueChainIds.filter((id) => set.has(id));
}

/** Platforms related to a given value chain, in canonical order. */
export function platformsForChain(chain: ValueChainId): PlatformId[] {
  const platformOrder: PlatformId[] = [
    "valura",
    "rwafid",
    "trade-chain-africa",
    "ibriz-gaas",
  ];
  return platformOrder.filter((platform) =>
    platformChainMap[platform].includes(chain),
  );
}

/**
 * Approved reception routing per chain (P2). The locale `cta.requestType`
 * must match this map (test-enforced), so the visitor-facing wording never
 * routes a chain to an unapproved request type.
 */
export const chainRequestType: Record<ValueChainId, RequestTypeId> = {
  "oilseeds-agro-processing": "supply-offtake-requirement",
  "food-cold-chain": "industrial-partnership",
  "feed-livestock": "supply-offtake-requirement",
  "water-energy-agritech": "technology-data-partnership",
  "mining-mineral-value": "submit-project-asset",
  "ports-logistics-corridors": "port-logistics-cooperation",
};
