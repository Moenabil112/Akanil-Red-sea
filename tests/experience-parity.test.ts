import { describe, expect, it } from "vitest";
import { arExperience } from "@/content/ar/experience";
import { frExperience } from "@/content/fr/experience";
import { enExperience } from "@/content/en/experience";
import { arReception } from "@/content/ar/reception";
import { frReception } from "@/content/fr/reception";
import { enReception } from "@/content/en/reception";
import type {
  ExperienceContent,
  Locale,
  ReceptionContent,
} from "@/content/types";
import { pageRoutes } from "@/lib/routes";
import { audienceIds, requestTypeIds } from "@/lib/reception";

const experiences: [Locale, ExperienceContent][] = [
  ["ar", arExperience],
  ["fr", frExperience],
  ["en", enExperience],
];

const receptions: [Locale, ReceptionContent][] = [
  ["ar", arReception],
  ["fr", frReception],
  ["en", enReception],
];

describe("experience content parity", () => {
  it("declares metadata for all nine content routes in every locale", () => {
    for (const [, experience] of experiences) {
      for (const route of pageRoutes) {
        expect(experience.pages[route].title.length).toBeGreaterThan(8);
        expect(experience.pages[route].description.length).toBeGreaterThan(20);
      }
    }
  });

  it("keeps the seven status items aligned without fabricated metrics", () => {
    for (const [, experience] of experiences) {
      expect(experience.status.items).toHaveLength(7);
      for (const item of experience.status.items) {
        expect(item.state).not.toMatch(/\d+\s*%/);
      }
    }
    const kinds = enExperience.status.items.map((i) => i.kind);
    for (const [, experience] of experiences) {
      expect(experience.status.items.map((i) => i.kind)).toEqual(kinds);
    }
  });

  it("keeps the five audience paths aligned across locales", () => {
    const reference = enExperience.audiences.paths.map((p) => ({
      id: p.id,
      defaultRequestType: p.defaultRequestType,
      requestTypes: p.requestTypes,
    }));
    for (const [, experience] of experiences) {
      expect(experience.audiences.paths).toHaveLength(audienceIds.length);
      expect(
        experience.audiences.paths.map((p) => ({
          id: p.id,
          defaultRequestType: p.defaultRequestType,
          requestTypes: p.requestTypes,
        })),
      ).toEqual(reference);
      for (const path of experience.audiences.paths) {
        expect(path.requestTypes).toContain(path.defaultRequestType);
        expect(path.purposes.length).toBeGreaterThanOrEqual(3);
      }
    }
  });

  it("keeps navigation hrefs identical across locales and within the route set", () => {
    const navHrefs = enExperience.navGroups.map((n) => n.href);
    const footerHrefs = enExperience.footerNav.map((n) => n.href);
    expect(footerHrefs).toEqual(pageRoutes.map((route) => `/${route}`));
    for (const [, experience] of experiences) {
      expect(experience.navGroups.map((n) => n.href)).toEqual(navHrefs);
      expect(experience.footerNav.map((n) => n.href)).toEqual(footerHrefs);
    }
  });
});

describe("reception content parity", () => {
  it("labels all seven request types in every locale", () => {
    for (const [, reception] of receptions) {
      for (const typeId of requestTypeIds) {
        expect(reception.requestTypes[typeId].label.length).toBeGreaterThan(3);
        expect(
          reception.requestTypes[typeId].description.length,
        ).toBeGreaterThan(10);
      }
    }
  });

  it("keeps privacy guarantees and review steps present in every locale", () => {
    for (const [, reception] of receptions) {
      expect(reception.privacy.points.length).toBeGreaterThanOrEqual(4);
      expect(reception.review.steps).toHaveLength(3);
      expect(reception.form.consentText.length).toBeGreaterThan(20);
    }
  });

  it("never claims a submitted state in the after-open copy", () => {
    const banned = [
      "submitted successfully",
      "envoyée avec succès",
      "تم إرسال الطلب بنجاح",
    ];
    for (const [, reception] of receptions) {
      const text = [
        reception.afterOpen.title,
        reception.afterOpen.text,
        reception.afterOpen.notSentWarning,
      ]
        .join(" ")
        .toLowerCase();
      for (const phrase of banned) {
        expect(text).not.toContain(phrase.toLowerCase());
      }
    }
  });
});
