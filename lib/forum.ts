/**
 * Shared, non-locale Forum constants (ADR-019).
 * Locale records carry wording; this module carries structure so the
 * participation-path and sector-track order, the track↔platform and
 * track↔chain mappings, the path↔track mapping and the qualification
 * routing cannot drift between languages. Parity is enforced by tests.
 */

import type { PlatformId, RequestTypeId } from "@/content/ecosystem-types";
import type { ValueChainId } from "@/content/value-chains-types";
import type {
  ForumParticipationPathId,
  ForumProgrammeDayId,
  ForumSectorTrackId,
} from "@/content/forum-types";

/** The Forum-qualification request type (P3 §13). */
export const FORUM_REQUEST_TYPE: RequestTypeId = "forum-qualification";

/** Public order of the six participation paths (P3 §7). */
export const participationPathIds: ForumParticipationPathId[] = [
  "moroccan-institutions",
  "moroccan-companies-exporters",
  "sudanese-institutions-decision-makers",
  "sudanese-producers-project-sponsors",
  "finance-investment-development",
  "technology-logistics-knowledge",
];

/** Public order of the five sector tracks (P3 §8). */
export const sectorTrackIds: ForumSectorTrackId[] = [
  "agriculture-food-industrialization",
  "feed-livestock-animal-value",
  "water-energy-agritech",
  "mining-industrial-value",
  "ports-logistics-finance-technology",
];

/** Public order of the five proposed programme days (P3 §9). */
export const programmeDayIds: ForumProgrammeDayId[] = [
  "institutional-framework",
  "sector-workshops",
  "b2b-b2g-meetings",
  "industrial-institutional-visits",
  "decisions-follow-up",
];

export function isParticipationPathId(
  value: string,
): value is ForumParticipationPathId {
  return (participationPathIds as string[]).includes(value);
}

export function isSectorTrackId(value: string): value is ForumSectorTrackId {
  return (sectorTrackIds as string[]).includes(value);
}

/**
 * Sector track → related P1 portfolio platforms (P3 §8). Single source of
 * truth. IBRIZ/GAAS appears against the mining track only as a potential
 * regulated infrastructure concept, never active project finance.
 */
export const trackPlatformMap: Record<ForumSectorTrackId, PlatformId[]> = {
  "agriculture-food-industrialization": [
    "valura",
    "rwafid",
    "trade-chain-africa",
  ],
  "feed-livestock-animal-value": ["rwafid", "trade-chain-africa"],
  "water-energy-agritech": ["valura", "rwafid"],
  "mining-industrial-value": ["trade-chain-africa", "ibriz-gaas"],
  "ports-logistics-finance-technology": ["trade-chain-africa", "ibriz-gaas"],
};

/**
 * Sector track → related P2 value chains (P3 §8). Single source of truth.
 */
export const trackChainMap: Record<ForumSectorTrackId, ValueChainId[]> = {
  "agriculture-food-industrialization": [
    "oilseeds-agro-processing",
    "food-cold-chain",
    "water-energy-agritech",
  ],
  "feed-livestock-animal-value": [
    "feed-livestock",
    "food-cold-chain",
    "ports-logistics-corridors",
  ],
  "water-energy-agritech": ["water-energy-agritech"],
  "mining-industrial-value": ["mining-mineral-value"],
  "ports-logistics-finance-technology": ["ports-logistics-corridors"],
};

/** Participation path → relevant sector tracks (P3 §7/§16). */
export const pathTrackMap: Record<
  ForumParticipationPathId,
  ForumSectorTrackId[]
> = {
  "moroccan-institutions": [
    "agriculture-food-industrialization",
    "water-energy-agritech",
    "mining-industrial-value",
    "ports-logistics-finance-technology",
  ],
  "moroccan-companies-exporters": [
    "agriculture-food-industrialization",
    "feed-livestock-animal-value",
    "water-energy-agritech",
    "mining-industrial-value",
    "ports-logistics-finance-technology",
  ],
  "sudanese-institutions-decision-makers": [
    "agriculture-food-industrialization",
    "water-energy-agritech",
    "mining-industrial-value",
    "ports-logistics-finance-technology",
  ],
  "sudanese-producers-project-sponsors": [
    "agriculture-food-industrialization",
    "feed-livestock-animal-value",
    "water-energy-agritech",
    "mining-industrial-value",
  ],
  "finance-investment-development": [
    "agriculture-food-industrialization",
    "mining-industrial-value",
    "ports-logistics-finance-technology",
  ],
  "technology-logistics-knowledge": [
    "water-energy-agritech",
    "mining-industrial-value",
    "ports-logistics-finance-technology",
  ],
};

/** Sector tracks relevant to a participation path, in canonical order. */
export function tracksForPath(
  path: ForumParticipationPathId,
): ForumSectorTrackId[] {
  const set = new Set(pathTrackMap[path]);
  return sectorTrackIds.filter((id) => set.has(id));
}

/** Platforms relevant to a participation path (via its tracks), deduped. */
export function platformsForPath(
  path: ForumParticipationPathId,
): PlatformId[] {
  const order: PlatformId[] = [
    "valura",
    "rwafid",
    "trade-chain-africa",
    "ibriz-gaas",
  ];
  const set = new Set<PlatformId>();
  for (const track of tracksForPath(path)) {
    for (const platform of trackPlatformMap[track]) set.add(platform);
  }
  return order.filter((platform) => set.has(platform));
}

/** Value chains relevant to a participation path (via its tracks), deduped. */
export function chainsForPath(
  path: ForumParticipationPathId,
): ValueChainId[] {
  const order: ValueChainId[] = [
    "oilseeds-agro-processing",
    "food-cold-chain",
    "feed-livestock",
    "water-energy-agritech",
    "mining-mineral-value",
    "ports-logistics-corridors",
  ];
  const set = new Set<ValueChainId>();
  for (const track of tracksForPath(path)) {
    for (const chain of trackChainMap[track]) set.add(chain);
  }
  return order.filter((chain) => set.has(chain));
}

/** Sector tracks that relate to a given platform (reverse of trackPlatformMap). */
export function tracksForPlatform(platform: PlatformId): ForumSectorTrackId[] {
  return sectorTrackIds.filter((id) =>
    trackPlatformMap[id].includes(platform),
  );
}

/** Sector tracks that relate to a given value chain (reverse of trackChainMap). */
export function tracksForChain(chain: ValueChainId): ForumSectorTrackId[] {
  return sectorTrackIds.filter((id) => trackChainMap[id].includes(chain));
}

/** Participation paths relevant to a sector track (reverse of pathTrackMap). */
export function pathsForTrack(
  track: ForumSectorTrackId,
): ForumParticipationPathId[] {
  return participationPathIds.filter((id) => pathTrackMap[id].includes(track));
}

/** Participation paths relevant to any track a value chain belongs to. */
export function pathsForChain(chain: ValueChainId): ForumParticipationPathId[] {
  const set = new Set<ForumParticipationPathId>();
  for (const track of tracksForChain(chain)) {
    for (const path of pathsForTrack(track)) set.add(path);
  }
  return participationPathIds.filter((id) => set.has(id));
}

/** Non-localized Forum subroute slugs (P3 §5). */
export const forumSubroutes = ["programme", "participation", "prepare"] as const;
