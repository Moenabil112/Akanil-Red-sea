/**
 * Shared, non-locale ecosystem constants (ADR-013/014/017).
 * Locale records carry wording; this module carries structure so the
 * audience/request matrix, intake schemas and node geometry cannot
 * drift between languages. Parity is enforced by tests.
 */

import type {
  AudienceId,
  EcosystemNodeId,
  IntakeFieldId,
  NodeKind,
  PlatformId,
  RequestTypeId,
} from "@/content/ecosystem-types";

export const audienceIds: AudienceId[] = [
  "moroccan-institutions",
  "moroccan-industry-exporters",
  "moroccan-finance-investment",
  "sudanese-decision-makers",
  "sudanese-producers-asset-owners",
  "red-sea-ports-economic-zones",
  "technology-logistics-knowledge-partners",
];

export const requestTypeIds: RequestTypeId[] = [
  "institutional-cooperation",
  "market-expansion",
  "project-investment-review",
  "supply-offtake-requirement",
  "industrial-partnership",
  "port-logistics-cooperation",
  "technology-data-partnership",
  "forum-qualification",
  "submit-project-asset",
];

export const platformIds: PlatformId[] = [
  "valura",
  "rwafid",
  "trade-chain-africa",
  "ibriz-gaas",
];

export function isAudienceId(value: string): value is AudienceId {
  return (audienceIds as string[]).includes(value);
}

export function isRequestTypeId(value: string): value is RequestTypeId {
  return (requestTypeIds as string[]).includes(value);
}

/** Audience → allowed request types (first entry after default ordering). */
export const audienceRequestMatrix: Record<
  AudienceId,
  { allowed: RequestTypeId[]; default: RequestTypeId }
> = {
  "moroccan-institutions": {
    allowed: ["institutional-cooperation", "forum-qualification"],
    default: "institutional-cooperation",
  },
  "moroccan-industry-exporters": {
    allowed: [
      "market-expansion",
      "supply-offtake-requirement",
      "industrial-partnership",
      "forum-qualification",
    ],
    default: "market-expansion",
  },
  "moroccan-finance-investment": {
    allowed: [
      "project-investment-review",
      "institutional-cooperation",
      "forum-qualification",
    ],
    default: "project-investment-review",
  },
  "sudanese-decision-makers": {
    allowed: [
      "institutional-cooperation",
      "industrial-partnership",
      "forum-qualification",
    ],
    default: "institutional-cooperation",
  },
  "sudanese-producers-asset-owners": {
    allowed: [
      "submit-project-asset",
      "supply-offtake-requirement",
      "industrial-partnership",
      "forum-qualification",
    ],
    default: "submit-project-asset",
  },
  "red-sea-ports-economic-zones": {
    allowed: ["port-logistics-cooperation", "institutional-cooperation"],
    default: "port-logistics-cooperation",
  },
  "technology-logistics-knowledge-partners": {
    allowed: [
      "technology-data-partnership",
      "industrial-partnership",
      "port-logistics-cooperation",
    ],
    default: "technology-data-partnership",
  },
};

/* ---------------- Intake schemas (minimum data collection) ---------------- */

export interface IntakeSchema {
  required: IntakeFieldId[];
  optional: IntakeFieldId[];
}

const baseRequired: IntakeFieldId[] = [
  "organization",
  "country",
  "sector",
  "contactName",
  "role",
  "email",
  "summary",
  "consent",
];

const baseOptional: IntakeFieldId[] = [
  "phone",
  "website",
  "preferredLanguage",
  "requestedNextStep",
];

/** Request-type intake schemas; fields beyond these are never shown. */
export const intakeSchemas: Record<RequestTypeId, IntakeSchema> = {
  "institutional-cooperation": {
    required: [...baseRequired, "organizationType"],
    optional: [...baseOptional, "region"],
  },
  "market-expansion": {
    required: [...baseRequired, "targetMarket"],
    optional: [...baseOptional, "region", "requiredPartner"],
  },
  "project-investment-review": {
    required: [...baseRequired, "projectName"],
    optional: [
      ...baseOptional,
      "investmentRange",
      "evidenceAvailable",
      "licenceStatus",
    ],
  },
  "supply-offtake-requirement": {
    required: [...baseRequired, "assetType"],
    optional: [...baseOptional, "requiredVolume", "targetMarket"],
  },
  "industrial-partnership": {
    required: [...baseRequired],
    optional: [
      ...baseOptional,
      "productionCapacity",
      "requiredPartner",
      "platform",
    ],
  },
  "port-logistics-cooperation": {
    required: [...baseRequired, "organizationType"],
    optional: [...baseOptional, "location"],
  },
  "technology-data-partnership": {
    required: [...baseRequired],
    optional: [...baseOptional, "platform"],
  },
  "forum-qualification": {
    required: [...baseRequired],
    optional: [...baseOptional, "evidenceAvailable"],
  },
  "submit-project-asset": {
    required: [...baseRequired, "projectName", "assetType", "location"],
    optional: [
      ...baseOptional,
      "productionCapacity",
      "investmentRange",
      "evidenceAvailable",
      "licenceStatus",
    ],
  },
};

/* ---------------- Node geometry (schematic, LTR-locked) ---------------- */

export const NODE_VIEWBOX = { width: 960, height: 560 } as const;

export interface NodeGeometry {
  x: number;
  y: number;
  kind: NodeKind;
}

/**
 * Schematic west→east positions. This is an architecture diagram, not a
 * legal or technical route map; positions are indicative only.
 */
export const nodeGeometry: Record<EcosystemNodeId, NodeGeometry> = {
  "tanger-med": { x: 60, y: 110, kind: "port" },
  "morocco-industry": { x: 130, y: 185, kind: "industrial-node" },
  "morocco-finance": { x: 100, y: 265, kind: "financial-node" },
  "morocco-market-access": { x: 65, y: 345, kind: "market-access-node" },
  kaec: { x: 810, y: 215, kind: "economic-zone" },
  "king-abdullah-port": { x: 865, y: 160, kind: "port" },
  "ain-sokhna": { x: 560, y: 140, kind: "port" },
  aswan: { x: 520, y: 240, kind: "logistics-node" },
  "port-sudan": { x: 645, y: 320, kind: "port" },
  "northern-state": { x: 505, y: 345, kind: "production-region" },
  kassala: { x: 620, y: 415, kind: "production-region" },
  gedaref: { x: 545, y: 465, kind: "production-region" },
  "asmara-massawa": { x: 715, y: 425, kind: "logistics-node" },
  bosaso: { x: 870, y: 495, kind: "port" },
};

export const ecosystemNodeIds = Object.keys(
  nodeGeometry,
) as EcosystemNodeId[];
