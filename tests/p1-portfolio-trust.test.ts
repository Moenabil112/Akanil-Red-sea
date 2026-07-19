import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { arEcosystem } from "@/content/ar/ecosystem";
import { frEcosystem } from "@/content/fr/ecosystem";
import { enEcosystem } from "@/content/en/ecosystem";
import { enReception } from "@/content/en/reception";
import { arReception } from "@/content/ar/reception";
import type { EcosystemContent } from "@/content/ecosystem-types";
import type { Locale } from "@/content/types";
import { platformIds } from "@/lib/ecosystem";
import { pageRoutes, switchLocalePath } from "@/lib/routes";
import {
  buildEmailBody,
  buildSubject,
  emptyReceptionRequest,
  parsePreselection,
  type ReceptionRequest,
} from "@/lib/reception";

const records: [Locale, EcosystemContent][] = [
  ["ar", arEcosystem],
  ["fr", frEcosystem],
  ["en", enEcosystem],
];

/* ---------------- Institutional identity (P1 §4) ---------------- */

describe("institutional identity", () => {
  it("publishes Morocco 2014 / CR 10015 and Sudan 2017 / CR 121", () => {
    for (const [, record] of records) {
      const text = JSON.stringify(record.institution);
      expect(text).toContain("2014");
      expect(text).toContain("10015");
      expect(text).toContain("2017");
      expect(text).toContain("121");
    }
  });

  it("lists nine representatives, none labelled a legal branch", () => {
    const forbidden: Record<Locale, RegExp> = {
      en: /legal branch|subsidiar|incorporated/i,
      fr: /succursale légale|filiale|bureau constitué/i,
      ar: /فرع قانوني|شركة تابعة/,
    };
    const marker: Record<Locale, RegExp> = {
      en: /agent|representative/i,
      fr: /agent|représentant/i,
      ar: /وكلاء|ممثلين/,
    };
    for (const [locale, record] of records) {
      expect(record.institution.representatives).toHaveLength(9);
      expect(record.institution.representatives.join(" ")).not.toMatch(
        forbidden[locale],
      );
      expect(record.institution.networkNote).toMatch(marker[locale]);
    }
  });

  it("explains both sides of the economic bridge", () => {
    for (const [, record] of records) {
      expect(record.institution.bridgeGroups).toHaveLength(3);
      for (const group of record.institution.bridgeGroups) {
        expect(group.items.length).toBeGreaterThanOrEqual(3);
      }
    }
  });
});

/* ---------------- Reusable specialist-review panel (P1 §11) ---------------- */

describe("specialist review panel", () => {
  it("carries six steps and eight statements in every locale", () => {
    for (const [, record] of records) {
      expect(record.reviewPanel.steps).toHaveLength(6);
      expect(record.reviewPanel.statements).toHaveLength(8);
    }
  });

  it("states the non-guarantees (reception ≠ acceptance, etc.)", () => {
    const markers: Record<Locale, RegExp[]> = {
      en: [/not acceptance/i, /not guaranteed/i, /not approved/i],
      fr: [/pas acceptation/i, /pas garanti/i, /pas approuvé/i],
      ar: [/لا يعني القبول/, /غير مضمون/, /غير معتمدة/],
    };
    for (const [locale, record] of records) {
      const text = record.reviewPanel.statements.join(" ");
      for (const marker of markers[locale]) {
        expect(text, `${locale}`).toMatch(marker);
      }
    }
  });
});

/* ---------------- Dedicated profiles (P1 §6) ---------------- */

describe("platform profiles", () => {
  it("populates every P1 profile field for all four platforms", () => {
    for (const [, record] of records) {
      expect(record.platforms.items.map((p) => p.id)).toEqual(platformIds);
      for (const platform of record.platforms.items) {
        expect(platform.publicInformation.length).toBeGreaterThanOrEqual(2);
        expect(platform.reviewInformation.length).toBeGreaterThanOrEqual(2);
        expect(platform.limitations.length).toBeGreaterThanOrEqual(2);
        expect(
          platform.preparationRequirements.length,
        ).toBeGreaterThanOrEqual(2);
        expect(platform.lastReviewed.length).toBeGreaterThan(3);
      }
    }
  });

  it("gives VALURA, RWAFID and IBRIZ a source date distinct from last reviewed", () => {
    for (const [, record] of records) {
      for (const id of ["valura", "rwafid", "ibriz-gaas"] as const) {
        const platform = record.platforms.items.find((p) => p.id === id)!;
        expect(platform.sourceDate).toBeTruthy();
        expect(platform.sourceDate).not.toBe(platform.lastReviewed);
      }
      // Trade-Chain Africa has no source date (repositioning, not a dated file).
      const tca = record.platforms.items.find(
        (p) => p.id === "trade-chain-africa",
      )!;
      expect(tca.sourceDate).toBeUndefined();
    }
  });

  it("keeps VALURA figures preliminary and free of IRR/payback/return", () => {
    for (const [, record] of records) {
      const valura = record.platforms.items.find((p) => p.id === "valura")!;
      const figures = (valura.indicativeFigures ?? []).join(" ").toLowerCase();
      expect(figures).not.toMatch(/irr|payback|revenue|return|amortissement|عائد/);
      expect(valura.figuresNote?.toLowerCase()).toMatch(
        /preliminary|préliminaire|أولية/,
      );
    }
  });

  it("withholds RWAFID historical milestones from the profile", () => {
    const banned = [
      "q1 2026",
      "100-farmer",
      "5,000",
      "5000",
      "ministry of agriculture",
      "sehedin",
      "1.5 million",
    ];
    for (const [locale, record] of records) {
      const rwafid = record.platforms.items.find((p) => p.id === "rwafid")!;
      const text = JSON.stringify(rwafid).toLowerCase();
      for (const phrase of banned) {
        expect(text, `${locale} RWAFID contains "${phrase}"`).not.toContain(
          phrase,
        );
      }
    }
  });

  it("keeps Trade-Chain Africa free of legacy claims in the profile", () => {
    const banned = [
      "nilly",
      "series a",
      "15-25x",
      "15–25x",
      "attijariwafa",
      "dhl",
      "blockchain settlement",
      "africa's leading",
    ];
    for (const [locale, record] of records) {
      const tca = record.platforms.items.find(
        (p) => p.id === "trade-chain-africa",
      )!;
      const text = JSON.stringify(tca).toLowerCase();
      for (const phrase of banned) {
        expect(text, `${locale} TCA contains "${phrase}"`).not.toContain(phrase);
      }
    }
  });

  it("never describes IBRIZ as a licensed or operating bank", () => {
    const banned = [/licensed bank\b/, /operating bank\b/, /gold-backed bank\b/];
    for (const [locale, record] of records) {
      const ibriz = record.platforms.items.find((p) => p.id === "ibriz-gaas")!;
      const text = JSON.stringify(ibriz).toLowerCase();
      for (const pattern of banned) {
        expect(pattern.test(text), `${locale} IBRIZ ${pattern}`).toBe(false);
      }
      expect(ibriz.regulatoryNote?.length).toBeGreaterThan(60);
      expect(ibriz.cta.requestType).toBe("technology-data-partnership");
    }
  });
});

/* ---------------- Routing (P1 §6, §15) ---------------- */

describe("profile routing", () => {
  it("keeps /portfolio a canonical route", () => {
    expect(pageRoutes).toContain("portfolio");
  });

  it("preserves the platform slug across language switches", () => {
    for (const id of platformIds) {
      expect(switchLocalePath(`/en/portfolio/${id}`, "fr")).toBe(
        `/fr/portfolio/${id}`,
      );
      expect(switchLocalePath(`/ar/portfolio/${id}`, "en")).toBe(
        `/en/portfolio/${id}`,
      );
    }
  });

  it("maps each platform CTA to the approved request type (§12)", () => {
    const expected: Record<string, string> = {
      valura: "project-investment-review",
      rwafid: "technology-data-partnership",
      "trade-chain-africa": "port-logistics-cooperation",
      "ibriz-gaas": "technology-data-partnership",
    };
    for (const platform of enEcosystem.platforms.items) {
      expect(platform.cta.requestType).toBe(expected[platform.id]);
    }
  });
});

/* ---------------- Reception platform context (P1 §12) ---------------- */

describe("reception platform context", () => {
  it("recognizes a valid platform query and ignores invalid ones", () => {
    expect(
      parsePreselection({ type: null, audience: null, platform: "valura" })
        .platform,
    ).toBe("valura");
    expect(
      parsePreselection({ type: null, audience: null, platform: "nope" })
        .platform,
    ).toBeUndefined();
  });

  it("carries the platform into the request and the email subject/body", () => {
    const request: ReceptionRequest = {
      ...emptyReceptionRequest("project-investment-review", undefined, "valura"),
      values: {
        organization: "Atlas Industries",
        country: "Morocco",
        sector: "Food processing",
        contactName: "K. Alaoui",
        role: "Director",
        email: "d@atlas.example",
        projectName: "Northern hub",
        summary:
          "We would like a structured project-review discussion about VALURA.",
      },
      consent: true,
    };
    const platformName = enEcosystem.platforms.items.find(
      (p) => p.id === "valura",
    )!.name;
    const subject = buildSubject(request, enReception, platformName);
    const body = buildEmailBody("en", request, enReception, platformName);
    expect(subject).toContain(platformName);
    expect(body).toContain(platformName);
    // Arabic body isolates the platform label line too.
    const arName = arEcosystem.platforms.items.find(
      (p) => p.id === "valura",
    )!.name;
    const arBody = buildEmailBody("ar", request, arReception, arName);
    expect(arBody).toContain(arName);
  });
});

/* ---------------- CI workflow present (P1 §3) ---------------- */

describe("CI quality workflow", () => {
  it("runs the required gates on PRs and feature pushes without deploy/secrets", () => {
    const yml = readFileSync(
      join(process.cwd(), ".github/workflows/quality.yml"),
      "utf8",
    );
    expect(yml).toMatch(/pull_request/);
    expect(yml).toMatch(/branches-ignore:\s*\[main\]|push:/);
    for (const gate of [
      "npm ci",
      "npm run typecheck",
      "npm test",
      "npm run build",
      "npm run lint",
    ]) {
      expect(yml).toContain(gate);
    }
    expect(yml).not.toMatch(/secrets\./);
    // No deploy actions (the comment may mention "deployment" as a negation).
    expect(yml).not.toMatch(/vercel|netlify|gh-pages|deploy-pages|peaceiris/i);
  });
});
