import { describe, expect, it } from "vitest";
import { arForum } from "@/content/ar/forum";
import { frForum } from "@/content/fr/forum";
import { enForum } from "@/content/en/forum";
import { enReception } from "@/content/en/reception";
import { arReception } from "@/content/ar/reception";
import type { ForumContent } from "@/content/forum-types";
import type { Locale } from "@/content/types";
import { platformIds } from "@/lib/ecosystem";
import { valueChainIds } from "@/lib/value-chains";
import {
  participationPathIds,
  sectorTrackIds,
  programmeDayIds,
  isParticipationPathId,
  isSectorTrackId,
  trackPlatformMap,
  trackChainMap,
  pathTrackMap,
  tracksForPath,
  platformsForPath,
  chainsForPath,
} from "@/lib/forum";
import { pageRoutes, switchLocalePath } from "@/lib/routes";
import {
  buildEmailBody,
  buildSubject,
  emptyReceptionRequest,
  parsePreselection,
  type ReceptionRequest,
} from "@/lib/reception";

const records: [Locale, ForumContent][] = [
  ["ar", arForum],
  ["fr", frForum],
  ["en", enForum],
];

/* ---------------- Baseline: P3 adds no platforms or chains ---------------- */

describe("P3 baseline preservation", () => {
  it("keeps exactly four platforms and six value chains", () => {
    expect(platformIds).toHaveLength(4);
    expect(valueChainIds).toHaveLength(6);
  });

  it("keeps /forum a canonical route", () => {
    expect(pageRoutes).toContain("forum");
  });
});

/* ---------------- Model completeness and parity ---------------- */

describe("Forum model", () => {
  it("carries six participation paths in canonical order in every locale", () => {
    for (const [locale, forum] of records) {
      expect(forum.participation.paths.map((p) => p.id), locale).toEqual(
        participationPathIds,
      );
    }
  });

  it("carries five sector tracks in canonical order in every locale", () => {
    for (const [locale, forum] of records) {
      expect(forum.tracks.items.map((t) => t.id), locale).toEqual(
        sectorTrackIds,
      );
    }
  });

  it("carries five proposed programme days in canonical order", () => {
    for (const [locale, forum] of records) {
      expect(forum.programme.days.map((d) => d.id), locale).toEqual(
        programmeDayIds,
      );
    }
  });

  it("populates preparation and objectives for every path, routed to forum-qualification", () => {
    for (const [locale, forum] of records) {
      for (const path of forum.participation.paths) {
        expect(
          path.preparationRequirements.length,
          `${locale} ${path.id}`,
        ).toBeGreaterThanOrEqual(3);
        expect(path.potentialObjectives.length).toBeGreaterThanOrEqual(3);
        expect(path.whoItIncludes.length).toBeGreaterThanOrEqual(3);
        expect(path.expectedOutcomes.length).toBeGreaterThanOrEqual(2);
        expect(path.requestType).toBe("forum-qualification");
      }
    }
  });

  it("gives the finance path a mandatory non-guarantee notice", () => {
    for (const [locale, forum] of records) {
      const finance = forum.participation.paths.find(
        (p) => p.id === "finance-investment-development",
      )!;
      expect(finance.note, locale).toBeTruthy();
    }
    expect(
      enForum.participation.paths.find(
        (p) => p.id === "finance-investment-development",
      )!.note,
    ).toMatch(/not automatically|investment-ready|subscription/i);
  });
});

/* ---------------- Sector-track mappings (valid, IBRIZ never financing) ---------------- */

describe("sector-track mappings", () => {
  it("maps every track to valid P2 chains and P1 platforms", () => {
    for (const track of sectorTrackIds) {
      for (const chain of trackChainMap[track]) {
        expect(valueChainIds).toContain(chain);
      }
      for (const platform of trackPlatformMap[track]) {
        expect(platformIds).toContain(platform);
      }
    }
  });

  it("relates IBRIZ/GAAS only to mining and ports tracks", () => {
    for (const track of sectorTrackIds) {
      if (trackPlatformMap[track].includes("ibriz-gaas")) {
        expect([
          "mining-industrial-value",
          "ports-logistics-finance-technology",
        ]).toContain(track);
      }
    }
  });

  it("marks IBRIZ/GAAS on the mining track as never active project finance", () => {
    for (const [locale, forum] of records) {
      const mining = forum.tracks.items.find(
        (t) => t.id === "mining-industrial-value",
      )!;
      expect(mining.note, locale).toBeTruthy();
    }
    expect(
      enForum.tracks.items.find((t) => t.id === "mining-industrial-value")!.note,
    ).toMatch(/never.*(active project finance|financ)/i);
  });
});

/* ---------------- Participation-path derived links ---------------- */

describe("participation-path mappings", () => {
  it("maps every path only to valid tracks, platforms and chains", () => {
    for (const path of participationPathIds) {
      expect(isParticipationPathId(path)).toBe(true);
      for (const track of pathTrackMap[path]) {
        expect(sectorTrackIds).toContain(track);
      }
      expect(tracksForPath(path).length).toBeGreaterThan(0);
      for (const platform of platformsForPath(path)) {
        expect(platformIds).toContain(platform);
      }
      for (const chain of chainsForPath(path)) {
        expect(valueChainIds).toContain(chain);
      }
    }
  });
});

/* ---------------- Programme model ---------------- */

describe("programme model", () => {
  it("gives Day 3 meeting-preparation formats and a no-scheduling note", () => {
    const day3 = enForum.programme.days.find((d) => d.id === "b2b-b2g-meetings")!;
    expect(day3.formats.length).toBeGreaterThanOrEqual(3);
    expect(day3.note).toMatch(/not schedule|no appointment/i);
  });

  it("keeps Day 4 free of confirmed-visit claims", () => {
    for (const [locale, forum] of records) {
      const day4 = forum.programme.days.find(
        (d) => d.id === "industrial-institutional-visits",
      )!;
      expect(day4.note, locale).toBeTruthy();
    }
    const day4 = enForum.programme.days.find(
      (d) => d.id === "industrial-institutional-visits",
    )!;
    // Visits are framed as categories and explicitly not confirmed.
    expect(day4.note).toMatch(/categories/i);
    expect(day4.note).toMatch(/no facility or institution is published as a confirmed visit/i);
    // No positive confirmed-visit claim (only the negation above).
    expect(JSON.stringify(day4)).not.toMatch(/confirmed visits to|a confirmed visit is/i);
  });

  it("uses outcome categories on Day 5 and implements no workflow", () => {
    const day5 = enForum.programme.days.find(
      (d) => d.id === "decisions-follow-up",
    )!;
    expect(day5.note).toMatch(/outcome categories only|does not implement/i);
  });

  it("offers nine possible outcome categories and no automatic decision", () => {
    for (const [, forum] of records) {
      expect(forum.outcomes.items).toHaveLength(9);
    }
    expect(enForum.outcomes.lead).toMatch(/not decisions produced automatically/i);
  });
});

/* ---------------- Forum-aware reception ---------------- */

describe("Forum-aware reception", () => {
  it("validates participant and track queries and ignores invalid ones", () => {
    const parsed = parsePreselection({
      type: "forum-qualification",
      participant: "moroccan-companies-exporters",
      track: "agriculture-food-industrialization",
    });
    expect(parsed.participant).toBe("moroccan-companies-exporters");
    expect(parsed.track).toBe("agriculture-food-industrialization");
    expect(parsePreselection({ participant: "nope" }).participant).toBeUndefined();
    expect(parsePreselection({ track: "nope" }).track).toBeUndefined();
    expect(isSectorTrackId("mining-industrial-value")).toBe(true);
    expect(isParticipationPathId("finance-investment-development")).toBe(true);
  });

  it("carries participant and track context into the subject and body", () => {
    const request: ReceptionRequest = {
      ...emptyReceptionRequest(
        "forum-qualification",
        undefined,
        undefined,
        undefined,
        "sudanese-producers-project-sponsors",
        "mining-industrial-value",
      ),
      values: {
        organization: "Nile Minerals Co.",
        country: "Sudan",
        sector: "Mining",
        contactName: "A. Osman",
        role: "Sponsor",
        email: "a@nile.example",
        summary: "We would like to qualify a documented mineral project for review.",
      },
      consent: true,
    };
    const participantName = enForum.participation.paths.find(
      (p) => p.id === "sudanese-producers-project-sponsors",
    )!.title;
    const trackName = enForum.tracks.items.find(
      (t) => t.id === "mining-industrial-value",
    )!.title;
    const names = { participantName, trackName };
    const subject = buildSubject(request, enReception, names);
    const body = buildEmailBody("en", request, enReception, names);
    expect(subject).toContain(participantName);
    expect(subject).toContain(trackName);
    expect(body).toContain(participantName);
    expect(body).toContain(trackName);

    // Arabic body isolates and includes the participant/track lines too.
    const arNames = {
      participantName: arForum.participation.paths.find(
        (p) => p.id === "sudanese-producers-project-sponsors",
      )!.title,
      trackName: arForum.tracks.items.find(
        (t) => t.id === "mining-industrial-value",
      )!.title,
    };
    const arBody = buildEmailBody("ar", request, arReception, arNames);
    expect(arBody).toContain(arNames.participantName);
    expect(arBody).toContain(arNames.trackName);
  });
});

/* ---------------- Routing ---------------- */

describe("Forum routing", () => {
  it("preserves the Forum subroute across language switches", () => {
    for (const sub of ["programme", "participation", "prepare"]) {
      expect(switchLocalePath(`/en/forum/${sub}`, "fr")).toBe(`/fr/forum/${sub}`);
      expect(switchLocalePath(`/ar/forum/${sub}`, "en")).toBe(`/en/forum/${sub}`);
    }
    expect(switchLocalePath("/en/forum", "ar")).toBe("/ar/forum");
  });
});

/* ---------------- Claims control ---------------- */

describe("Forum claims control", () => {
  it("never publishes open-registration or confirmed-participation claims", () => {
    const banned = [
      /registration is open/i,
      /your place is confirmed/i,
      /guaranteed meeting/i,
      /confirmed (investor|ministry|sponsor|factory visit|delegation)/i,
      /financing available/i,
      /partnership secured/i,
      /automatic matchmaking/i,
      /approved delegation/i,
    ];
    for (const [locale, forum] of [["en", enForum]] as const) {
      const text = JSON.stringify(forum);
      for (const pattern of banned) {
        expect(pattern.test(text), `${locale} Forum matches ${pattern}`).toBe(
          false,
        );
      }
    }
  });

  it("states the Forum is a proposed programme, not a confirmed event", () => {
    const markers: Record<Locale, RegExp> = {
      en: /proposed/i,
      fr: /proposé/i,
      ar: /مقترح/,
    };
    for (const [locale, forum] of records) {
      expect(forum.publicStatus).toMatch(markers[locale]);
    }
  });
});

/* ---------------- Privacy ---------------- */

describe("Forum privacy boundaries", () => {
  it("states no public participant directory and no public request exposure", () => {
    const markers: Record<Locale, RegExp> = {
      en: /no participant directory|not publicly (visible|listed)/i,
      fr: /aucun annuaire|pas (visible|publié) publiquement|n'est visible publiquement/i,
      ar: /لا دليل مشاركين|ليست منشورة|مرئي للعموم/,
    };
    for (const [locale, forum] of records) {
      const text = JSON.stringify(forum.prepare.privacy);
      expect(text, locale).toMatch(markers[locale]);
    }
  });
});
