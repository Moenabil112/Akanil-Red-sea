import { describe, expect, it } from "vitest";
import { arValueChains } from "@/content/ar/value-chains";
import { frValueChains } from "@/content/fr/value-chains";
import { enValueChains } from "@/content/en/value-chains";
import { arEcosystem } from "@/content/ar/ecosystem";
import { frEcosystem } from "@/content/fr/ecosystem";
import { enEcosystem } from "@/content/en/ecosystem";
import { enReception } from "@/content/en/reception";
import { arReception } from "@/content/ar/reception";
import type { ValueChainsContent } from "@/content/value-chains-types";
import type { Locale } from "@/content/types";
import {
  valueChainIds,
  isValueChainId,
  chainRequestType,
  platformChainMap,
  chainsForPlatform,
  platformsForChain,
} from "@/lib/value-chains";
import { platformIds } from "@/lib/ecosystem";
import { pageRoutes, switchLocalePath } from "@/lib/routes";
import {
  buildEmailBody,
  buildSubject,
  emptyReceptionRequest,
  parsePreselection,
  type ReceptionRequest,
} from "@/lib/reception";

const records: [Locale, ValueChainsContent][] = [
  ["ar", arValueChains],
  ["fr", frValueChains],
  ["en", enValueChains],
];

/* ---------------- Model completeness and parity ---------------- */

describe("value-chain model", () => {
  it("carries all six chains in canonical order in every locale", () => {
    for (const [locale, record] of records) {
      expect(record.items.map((c) => c.id), locale).toEqual(valueChainIds);
    }
  });

  it("populates every profile field for all six chains", () => {
    for (const [locale, record] of records) {
      for (const chain of record.items) {
        expect(chain.flow.length, `${locale} ${chain.id} flow`).toBeGreaterThanOrEqual(5);
        for (const stage of chain.flow) {
          expect(stage.title.length).toBeGreaterThan(0);
          expect(stage.role.length).toBeGreaterThan(0);
          expect(stage.contribution.length).toBeGreaterThan(0);
        }
        expect(chain.geographicContribution.length).toBe(3);
        expect(chain.enablingLayers.length).toBeGreaterThanOrEqual(3);
        expect(chain.publicScope.length).toBeGreaterThanOrEqual(2);
        expect(chain.verificationScope.length).toBeGreaterThanOrEqual(2);
        expect(chain.limitations.length).toBeGreaterThanOrEqual(3);
        expect(chain.preparationRequirements.length).toBeGreaterThanOrEqual(2);
        expect(chain.sourceBasis.length).toBeGreaterThan(3);
        expect(chain.lastReviewed.length).toBeGreaterThan(3);
      }
    }
  });

  it("uses only the four approved scenario statuses", () => {
    const allowed = new Set([
      "public-pathway-overview",
      "requires-current-verification",
      "additional-information-after-review",
      "regulated-or-sensitive-elements",
    ]);
    for (const [, record] of records) {
      for (const chain of record.items) {
        expect(allowed.has(chain.scenarioStatus)).toBe(true);
      }
    }
  });

  it("keeps the scenario-status labels parallel across locales", () => {
    for (const [, record] of records) {
      expect(Object.keys(record.scenarioStatus).sort()).toEqual(
        Object.keys(enValueChains.scenarioStatus).sort(),
      );
    }
  });

  it("marks mining as regulated/sensitive with a regulatory note", () => {
    for (const [locale, record] of records) {
      const mining = record.items.find((c) => c.id === "mining-mineral-value")!;
      expect(mining.scenarioStatus, locale).toBe(
        "regulated-or-sensitive-elements",
      );
      expect((mining.regulatoryNote ?? "").length).toBeGreaterThan(60);
    }
  });
});

/* ---------------- Level-3 platform ↔ chain mapping ---------------- */

describe("platform ↔ chain mapping (Level-3)", () => {
  it("matches the approved mapping", () => {
    expect(platformChainMap).toEqual({
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
    });
  });

  it("is internally consistent in both directions", () => {
    for (const platform of platformIds) {
      for (const chain of chainsForPlatform(platform)) {
        expect(platformsForChain(chain)).toContain(platform);
      }
    }
    for (const chain of valueChainIds) {
      for (const platform of platformsForChain(chain)) {
        expect(chainsForPlatform(platform)).toContain(chain);
      }
    }
  });

  it("relates IBRIZ/GAAS only to mining and ports, with a never-financing caveat", () => {
    expect(chainsForPlatform("ibriz-gaas")).toEqual([
      "mining-mineral-value",
      "ports-logistics-corridors",
    ]);
    for (const [locale, eco] of [
      ["ar", arEcosystem],
      ["fr", frEcosystem],
      ["en", enEcosystem],
    ] as const) {
      const ibriz = eco.platforms.items.find((p) => p.id === "ibriz-gaas")!;
      expect(ibriz.relatedChainsNote, locale).toBeTruthy();
    }
  });
});

/* ---------------- Reception routing (chain-aware) ---------------- */

describe("chain-aware reception routing", () => {
  it("routes each chain CTA to the approved request type in every locale", () => {
    for (const [locale, record] of records) {
      for (const chain of record.items) {
        expect(chain.cta.requestType, `${locale} ${chain.id}`).toBe(
          chainRequestType[chain.id],
        );
      }
    }
  });

  it("validates a chain query and ignores invalid ones", () => {
    expect(
      parsePreselection({ chain: "oilseeds-agro-processing" }).chain,
    ).toBe("oilseeds-agro-processing");
    expect(parsePreselection({ chain: "nope" }).chain).toBeUndefined();
    expect(isValueChainId("ports-logistics-corridors")).toBe(true);
    expect(isValueChainId("marketplace")).toBe(false);
  });

  it("carries the chain into the email subject and body", () => {
    const request: ReceptionRequest = {
      ...emptyReceptionRequest(
        "supply-offtake-requirement",
        undefined,
        undefined,
        "oilseeds-agro-processing",
      ),
      values: {
        organization: "Atlas Oils",
        country: "Morocco",
        sector: "Food processing",
        contactName: "K. Alaoui",
        role: "Director",
        email: "d@atlas.example",
        assetType: "Sesame seed",
        summary: "We would like to discuss an oilseeds supply pathway scenario.",
      },
      consent: true,
    };
    const chainName = enValueChains.items.find(
      (c) => c.id === "oilseeds-agro-processing",
    )!.shortName;
    const subject = buildSubject(request, enReception, { chainName });
    const body = buildEmailBody("en", request, enReception, { chainName });
    expect(subject).toContain(chainName);
    expect(body).toContain(chainName);
    const arName = arValueChains.items.find(
      (c) => c.id === "oilseeds-agro-processing",
    )!.shortName;
    const arBody = buildEmailBody("ar", request, arReception, {
      chainName: arName,
    });
    expect(arBody).toContain(arName);
  });
});

/* ---------------- Routing and metadata ---------------- */

describe("value-chain routing", () => {
  it("keeps /value-chains a canonical route", () => {
    expect(pageRoutes).toContain("value-chains");
  });

  it("preserves the chain slug across language switches", () => {
    for (const id of valueChainIds) {
      expect(switchLocalePath(`/en/value-chains/${id}`, "fr")).toBe(
        `/fr/value-chains/${id}`,
      );
      expect(switchLocalePath(`/ar/value-chains/${id}`, "en")).toBe(
        `/en/value-chains/${id}`,
      );
    }
  });
});

/* ---------------- Claims control / scenario boundaries ---------------- */

describe("scenario claims control", () => {
  it("frames pathways as scenarios and avoids confirmed-route language", () => {
    const markers: Record<Locale, RegExp> = {
      en: /scenario|pathway/i,
      fr: /scénario|parcours/i,
      ar: /سيناريو|مسار/,
    };
    for (const [locale, record] of records) {
      expect(record.scenarioNote).toMatch(markers[locale]);
    }
  });

  it("never states market volumes, tariffs, transit times or fixed prices", () => {
    // English-scoped numeric/economic claims must not appear in EN copy.
    const banned = [
      /\btonnes?\/day\b/i,
      /\bUSD\s?\d/i,
      /\b\d+\s?%/,
      /\btransit time of\b/i,
      /\btariff of\b/i,
      /\bguaranteed (return|financing|price)\b/i,
    ];
    const text = JSON.stringify(enValueChains);
    for (const pattern of banned) {
      expect(pattern.test(text), `EN value chains match ${pattern}`).toBe(false);
    }
  });

  it("keeps mining traceability-led and free of reserve/grade figures", () => {
    const traceability: Record<Locale, RegExp> = {
      en: /traceab/i,
      fr: /traçab/i,
      ar: /تتبّع|تتبع/,
    };
    for (const [locale, record] of records) {
      const mining = record.items.find((c) => c.id === "mining-mineral-value")!;
      const text = JSON.stringify(mining);
      // Identity/compliance/traceability must be asserted as a prerequisite.
      expect(text, locale).toMatch(traceability[locale]);
      // No reserve/grade/return figures in any locale copy (English tokens).
      expect(
        /\breserve of\b|\bgrade of\b/.test(text.toLowerCase()),
        locale,
      ).toBe(false);
    }
  });

  it("labels corridors as conceptual, not operational (ports pathway)", () => {
    const markers: Record<Locale, RegExp> = {
      en: /conceptual/i,
      fr: /conceptue/i,
      ar: /تصوري/,
    };
    for (const [locale, record] of records) {
      const ports = record.items.find(
        (c) => c.id === "ports-logistics-corridors",
      )!;
      const text = JSON.stringify(ports);
      expect(text, locale).toMatch(markers[locale]);
    }
  });
});
