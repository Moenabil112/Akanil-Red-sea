import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { arEcosystem } from "@/content/ar/ecosystem";
import { frEcosystem } from "@/content/fr/ecosystem";
import { enEcosystem } from "@/content/en/ecosystem";
import type { EcosystemContent } from "@/content/ecosystem-types";
import type { Locale } from "@/content/types";
import {
  audienceIds,
  audienceRequestMatrix,
  ecosystemNodeIds,
  intakeSchemas,
  nodeGeometry,
  platformIds,
  requestTypeIds,
} from "@/lib/ecosystem";
import { pageRoutes, switchLocalePath } from "@/lib/routes";

const records: [Locale, EcosystemContent][] = [
  ["ar", arEcosystem],
  ["fr", frEcosystem],
  ["en", enEcosystem],
];

/* ---------------- Architecture (P0 §36, §40) ---------------- */

describe("route architecture", () => {
  it("includes /portfolio among the canonical routes", () => {
    expect(pageRoutes).toContain("portfolio");
  });

  it("preserves /portfolio across language switches", () => {
    expect(switchLocalePath("/ar/portfolio", "fr")).toBe("/fr/portfolio");
    expect(switchLocalePath("/en/portfolio", "ar")).toBe("/ar/portfolio");
  });

  it("keeps every legacy route in the canonical set", () => {
    for (const route of [
      "gateway",
      "morocco",
      "sudan",
      "corridor",
      "value-chains",
      "forum",
      "trust",
      "about-akanil",
      "reception",
    ]) {
      expect(pageRoutes).toContain(route);
    }
  });
});

/* ---------------- Product definition (P0 §2–3, §40) ---------------- */

describe("product definition", () => {
  it("identifies Akanil as founder and executive operator in every locale", () => {
    const markers: Record<Locale, string[]> = {
      en: ["founder", "executive operator"],
      fr: ["fondateur", "opérateur exécutif"],
      ar: ["المؤسس", "المشغل التنفيذي"],
    };
    for (const [locale, record] of records) {
      const text = JSON.stringify(record).toLowerCase();
      for (const marker of markers[locale]) {
        expect(text, `${locale} missing "${marker}"`).toContain(
          marker.toLowerCase(),
        );
      }
    }
  });

  it("presents all four portfolio platforms in every locale", () => {
    for (const [, record] of records) {
      expect(record.platforms.items.map((p) => p.id)).toEqual(platformIds);
    }
  });

  it("never describes Akanil as a broker or open marketplace", () => {
    const banned = [
      "broker",
      "open marketplace",
      "courtier",
      "place de marché ouverte",
      "وسيط عمولة",
      "سوق مفتوح",
    ];
    for (const [locale, record] of records) {
      const text = JSON.stringify(record).toLowerCase();
      for (const phrase of banned) {
        expect(text, `${locale} contains "${phrase}"`).not.toContain(
          phrase.toLowerCase(),
        );
      }
    }
  });
});

/* ---------------- Why the Red Sea (P0 §4, §40) ---------------- */

describe("Red Sea narrative", () => {
  it("carries the Why the Red Sea title in every language", () => {
    expect(enEcosystem.whyRedSea.title).toBe("Why the Red Sea?");
    expect(frEcosystem.whyRedSea.title).toBe("Pourquoi la mer Rouge ?");
    expect(arEcosystem.whyRedSea.title).toBe("لماذا البحر الأحمر؟");
  });

  it("lists the nine converging layers in every locale", () => {
    for (const [, record] of records) {
      expect(record.whyRedSea.layers).toHaveLength(9);
      expect(record.valueFlow.steps).toHaveLength(8);
    }
  });

  it("places the narrative before the limitation matrix on the homepage", () => {
    const source = readFileSync(
      join(process.cwd(), "app/[lang]/page.tsx"),
      "utf8",
    );
    const whyIndex = source.indexOf("<WhyRedSea");
    const statusIndex = source.indexOf("<GatewayStatus");
    expect(whyIndex).toBeGreaterThan(-1);
    expect(statusIndex).toBeGreaterThan(-1);
    expect(whyIndex).toBeLessThan(statusIndex);
  });

  it("includes the market-access qualification note in every locale", () => {
    for (const [, record] of records) {
      expect(record.valueFlow.marketAccessNote.length).toBeGreaterThan(40);
    }
  });
});

/* ---------------- Geographical nodes (P0 §5, ADR-017) ---------------- */

describe("Red Sea node normalization", () => {
  it("keeps node ids and kinds aligned across locales and geometry", () => {
    for (const [, record] of records) {
      expect(record.nodes.items.map((n) => n.id)).toEqual(ecosystemNodeIds);
      for (const node of record.nodes.items) {
        expect(node.kind).toBe(nodeGeometry[node.id].kind);
        expect(node.publicSummary.length).toBeGreaterThan(20);
      }
    }
  });

  it("never labels Aswan as a seaport", () => {
    for (const [, record] of records) {
      const aswan = record.nodes.items.find((n) => n.id === "aswan")!;
      expect(aswan.kind).not.toBe("port");
      expect(aswan.name.toLowerCase()).not.toMatch(/\bport\b|ميناء/);
    }
  });

  it("represents Asmara–Massawa as a corridor, never a Port of Asmara", () => {
    for (const [, record] of records) {
      const corridor = record.nodes.items.find(
        (n) => n.id === "asmara-massawa",
      )!;
      expect(corridor.kind).not.toBe("port");
      const text = JSON.stringify(record);
      expect(text).not.toContain("Port of Asmara");
      expect(text).not.toContain("ميناء أسمرا");
      expect(text).not.toContain("port d'Asmara");
      // Massawa must appear (through the corridor naming).
      expect(corridor.name).toMatch(/Massawa|مصوع/);
    }
  });

  it("labels every node kind textually, never by color alone", () => {
    for (const [, record] of records) {
      for (const kind of Object.keys(nodeGeometry).map(
        (id) => nodeGeometry[id as keyof typeof nodeGeometry].kind,
      )) {
        expect(record.nodes.kindLabels[kind].length).toBeGreaterThan(2);
      }
      expect(record.nodes.disclaimer.length).toBeGreaterThan(30);
    }
  });
});

/* ---------------- Audience architecture (P0 §12–19, §40) ---------------- */

describe("audience architecture", () => {
  it("defines all seven audiences in order in every locale", () => {
    for (const [, record] of records) {
      expect(record.audiences.paths.map((p) => p.id)).toEqual(audienceIds);
    }
  });

  it("keeps structural fields aligned with the shared matrix", () => {
    for (const [, record] of records) {
      for (const path of record.audiences.paths) {
        const matrix = audienceRequestMatrix[path.id];
        expect(path.allowedRequestTypes).toEqual(matrix.allowed);
        expect(path.defaultRequestType).toBe(matrix.default);
        expect(path.allowedRequestTypes).toContain(path.defaultRequestType);
        expect(path.whoItIncludes.length).toBeGreaterThanOrEqual(3);
        expect(path.gatewayValue.length).toBeGreaterThanOrEqual(3);
        expect(path.preparationRequirements.length).toBeGreaterThanOrEqual(1);
        expect(path.expectedReviewOutput.length).toBeGreaterThan(10);
        expect(path.ctaLabel.length).toBeGreaterThan(3);
        for (const platform of path.relevantPlatforms) {
          expect(platformIds).toContain(platform);
        }
      }
    }
  });

  it("authors audience titles independently per language", () => {
    const en = enEcosystem.audiences.paths.map((p) => p.title);
    const fr = frEcosystem.audiences.paths.map((p) => p.title);
    const ar = arEcosystem.audiences.paths.map((p) => p.title);
    expect(en).not.toEqual(fr);
    expect(en).not.toEqual(ar);
  });
});

/* ---------------- Request architecture (P0 §20–21, §40) ---------------- */

describe("request architecture", () => {
  it("defines exactly nine request types with schemas", () => {
    expect(requestTypeIds).toHaveLength(9);
    for (const typeId of requestTypeIds) {
      expect(intakeSchemas[typeId]).toBeDefined();
    }
  });

  it("allows no invalid audience/request combination in the matrix", () => {
    for (const audience of audienceIds) {
      const matrix = audienceRequestMatrix[audience];
      for (const type of matrix.allowed) {
        expect(requestTypeIds).toContain(type);
      }
      expect(matrix.allowed).toContain(matrix.default);
    }
  });
});

/* ---------------- Portfolio platforms (P0 §6–10, §26–27, §40) ---------------- */

describe("portfolio platforms", () => {
  it("retains exactly four primary platforms in every locale", () => {
    for (const [, record] of records) {
      expect(record.platforms.items).toHaveLength(4);
      expect(record.platforms.items.map((p) => p.id)).toEqual(platformIds);
    }
  });

  it("gives every platform a resolvable simplified status and a last-reviewed date", () => {
    const valid = new Set([
      "public-profile-available",
      "additional-information-after-review",
      "update-required-before-publication",
      "regulated-or-sensitive-project",
    ]);
    for (const [, record] of records) {
      for (const platform of record.platforms.items) {
        expect(valid.has(platform.projectStatus)).toBe(true);
        expect(
          record.states.projectStatus[platform.projectStatus].length,
        ).toBeGreaterThan(5);
        expect(platform.lastReviewed.length).toBeGreaterThan(3);
        expect(platform.stage.length).toBeGreaterThan(20);
        expect(platform.partnersSought.length).toBeGreaterThanOrEqual(3);
        expect(requestTypeIds).toContain(platform.cta.requestType);
        expect(platform.capabilities.length).toBeGreaterThanOrEqual(3);
        expect(platform.geographicScope.length).toBeGreaterThanOrEqual(1);
      }
    }
  });

  it("maps each platform to its approved simplified public status", () => {
    const expected: Record<string, string> = {
      valura: "public-profile-available",
      rwafid: "update-required-before-publication",
      "trade-chain-africa": "update-required-before-publication",
      "ibriz-gaas": "regulated-or-sensitive-project",
    };
    for (const [, record] of records) {
      for (const platform of record.platforms.items) {
        expect(platform.projectStatus).toBe(expected[platform.id]);
      }
    }
  });

  it("presents VALURA as an agro-industrial complex, not an economic-zone platform", () => {
    for (const [locale, record] of records) {
      const valura = record.platforms.items.find((p) => p.id === "valura")!;
      // Category speaks of agricultural processing / agro-industry.
      expect(valura.category.toLowerCase()).toMatch(
        /agro|agricultural processing|transformation agricole|تصنيع الزراعي|الصناعات التحويلية الزراعية/,
      );
      // No established economic-zone framing anywhere in the record.
      const text = JSON.stringify(valura).toLowerCase();
      expect(text, `${locale} VALURA`).not.toContain("valura economic zone");
      expect(text).not.toMatch(
        /economic-zone development|développement de zones économiques|تطوير المناطق الاقتصادية/,
      );
    }
  });

  it("shows no fixed VALURA site and only labelled preliminary figures", () => {
    for (const [, record] of records) {
      const valura = record.platforms.items.find((p) => p.id === "valura")!;
      // Locations are potential/under study, not established sites.
      expect(valura.geographicScope.join(" ").toLowerCase()).toMatch(
        /potential|under study|قيد الدراسة|محتمل|à l'étude|potentiel/,
      );
      // Figures carry a preliminary label and exclude IRR / payback / revenue.
      expect(valura.figuresNote).toBeTruthy();
      expect(valura.figuresNote!.toLowerCase()).toMatch(
        /preliminary|préliminaire|أولية/,
      );
      const figures = (valura.indicativeFigures ?? []).join(" ").toLowerCase();
      expect(figures).not.toMatch(/irr|payback|revenue|amortissement|عائد/);
    }
  });

  it("withholds RWAFID Q1 2026 pilot and partnership claims as current facts", () => {
    const banned = [
      "q1 2026",
      "100-farmer",
      "100 farmers",
      "5,000 farmers",
      "5000 farmers",
      "ministry of agriculture",
      "letter of intent",
      "beta launch",
      "sehedin",
      "usd 1.5 million",
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
      expect(rwafid.projectStatus).toBe("update-required-before-publication");
    }
  });

  it("keeps Trade-Chain Africa free of legacy partner, currency and return claims", () => {
    const banned = [
      "nilly",
      "attijariwafa",
      "african development bank",
      "qnb",
      "dhl",
      "msc",
      "royal air maroc",
      "suada",
      "animus",
      "series a",
      "25 million",
      "15-25x",
      "15–25x",
      "africa's leading",
      "africa’s leading",
      "blockchain settlement",
      "marketplace",
    ];
    for (const [locale, record] of records) {
      const tca = record.platforms.items.find(
        (p) => p.id === "trade-chain-africa",
      )!;
      const text = JSON.stringify(tca).toLowerCase();
      for (const phrase of banned) {
        expect(
          text,
          `${locale} Trade-Chain Africa contains "${phrase}"`,
        ).not.toContain(phrase);
      }
    }
  });

  it("carries the mandatory IBRIZ/GAAS regulatory note and never a bank claim", () => {
    // Word-boundary regexes for affirmative bank claims. "licensed banking
    // sponsor" (a partner sought) and "not a bank" (a negation) are legit,
    // so \b avoids matching them.
    const banned = [
      /licensed bank\b/,
      /operating bank\b/,
      /gold-backed bank\b/,
      /world'?s first/,
      /banque licenciée/,
      /بنك مرخص/,
    ];
    for (const [locale, record] of records) {
      const ibriz = record.platforms.items.find((p) => p.id === "ibriz-gaas")!;
      expect(
        ibriz.regulatoryNote?.length,
        `${locale} IBRIZ regulatory note`,
      ).toBeGreaterThan(60);
      expect(ibriz.projectStatus).toBe("regulated-or-sensitive-project");
      const text = JSON.stringify(ibriz).toLowerCase();
      for (const pattern of banned) {
        expect(pattern.test(text), `${locale} IBRIZ matches ${pattern}`).toBe(
          false,
        );
      }
    }
  });

  it("gives every platform a Request Project Review action", () => {
    const expected: Record<string, string> = {
      en: "request project review",
      fr: "demander l'examen du projet",
      ar: "طلب مراجعة المشروع",
    };
    for (const [locale, record] of records) {
      for (const platform of record.platforms.items) {
        expect(
          platform.cta.label.toLowerCase(),
          `${locale} ${platform.id} CTA`,
        ).toBe(expected[locale]);
      }
    }
  });

  it("never uses unsupported investment-readiness or guarantee language", () => {
    const banned = [
      "investment ready",
      "investment-ready",
      "fully bankable",
      "guaranteed return",
      "expected return",
      "rendement garanti",
      "prêt à l'investissement",
      "عائد مضمون",
      "جاهز للاستثمار بالكامل",
      "ضمان الاستثمار",
    ];
    for (const [locale, record] of records) {
      const text = JSON.stringify(record.platforms).toLowerCase();
      for (const phrase of banned) {
        expect(text, `${locale} contains "${phrase}"`).not.toContain(
          phrase.toLowerCase(),
        );
      }
    }
  });

  it("distinguishes platforms from nodes in every locale", () => {
    for (const [, record] of records) {
      expect(record.platforms.nodeDistinction.length).toBeGreaterThan(40);
    }
  });

  it("states that a project-review request guarantees nothing (§7)", () => {
    const markers: Record<string, RegExp> = {
      en: /guarantee|confidential documents|specialist team/i,
      fr: /garanti|documents confidentiels|équipe spécialisée/i,
      ar: /يضمن|وثائق سرية|فريق متخصص/,
    };
    for (const [locale, record] of records) {
      const note = record.platforms.reviewRequestNote;
      expect(note.length, `${locale} review note`).toBeGreaterThan(40);
      expect(note, `${locale} review note`).toMatch(markers[locale]!);
    }
  });
});

/* ---------------- Institutional identity (P1 reconciliation §2, §8) ---------------- */

describe("institutional identity", () => {
  it("publishes the Moroccan and Sudan registration facts in every locale", () => {
    for (const [, record] of records) {
      const text = JSON.stringify(record.institution);
      expect(text).toContain("2014");
      expect(text).toContain("10015");
      expect(text).toContain("2017");
      expect(text).toContain("121");
    }
  });

  it("lists the nine regional representatives", () => {
    for (const [, record] of records) {
      expect(record.institution.representatives).toHaveLength(9);
    }
  });

  it("describes the network as agents or representatives, not legal branches", () => {
    const markers: Record<string, RegExp> = {
      en: /agent|representative/i,
      fr: /agent|représentant/i,
      ar: /وكلاء|ممثلين/,
    };
    const forbidden: Record<string, RegExp> = {
      en: /legal branch|subsidiar|incorporated office/i,
      fr: /succursale légale|filiale|bureau constitué/i,
      ar: /فروع قانونية|شركات تابعة/,
    };
    for (const [locale, record] of records) {
      const note = record.institution.networkNote;
      expect(note, `${locale} network note`).toMatch(markers[locale]!);
      // The note only mentions the forbidden terms to negate them, so the
      // representatives list itself must not carry branch/subsidiary labels.
      const list = record.institution.representatives.join(" ");
      expect(list).not.toMatch(forbidden[locale]!);
    }
  });
});

/* ---------------- Founder presentation (P0 §23) ---------------- */

describe("founder presentation", () => {
  it("uses the legal name and no former alias", () => {
    expect(enEcosystem.founder.name).toBe("Mohamed Abderrahim");
    expect(frEcosystem.founder.name).toBe("Mohamed Abderrahim");
    expect(arEcosystem.founder.name).toBe("محمد عبدالرحيم");
  });

  it("publishes no unverified membership claims", () => {
    for (const [, record] of records) {
      const text = JSON.stringify(record.founder);
      expect(text).not.toMatch(/since 2016|since 2017|depuis 2016|منذ 2016/);
    }
  });
});

/* ---------------- Privacy: no backend, storage or analytics ---------------- */

function walk(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) walk(path, out);
    else if (/\.(ts|tsx)$/.test(entry)) out.push(path);
  }
  return out;
}

describe("privacy boundaries in application source", () => {
  const files = ["app", "components", "lib", "content"].flatMap((dir) =>
    walk(join(process.cwd(), dir)),
  );

  it("introduces no storage, cookies, analytics or network submission", () => {
    const banned = [
      /localStorage/,
      /sessionStorage/,
      /document\.cookie\s*=/,
      /\bfetch\s*\(/,
      /XMLHttpRequest/,
      /navigator\.sendBeacon/,
      /gtag|google-analytics|plausible|posthog|mixpanel/i,
      /"use server"/,
      /<input[^>]*type=["']file["']/,
    ];
    for (const file of files) {
      const source = readFileSync(file, "utf8");
      for (const pattern of banned) {
        expect(
          pattern.test(source),
          `${file} matches ${pattern}`,
        ).toBe(false);
      }
    }
  });
});
