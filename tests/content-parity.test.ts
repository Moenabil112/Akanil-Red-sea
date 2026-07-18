import { describe, expect, it } from "vitest";
import { ar } from "@/content/ar/site";
import { fr } from "@/content/fr/site";
import { en } from "@/content/en/site";
import type { Locale, SiteContent } from "@/content/types";
import {
  canonicalNames,
  restrictedPublicTerms,
  bannedMarketingTerms,
} from "@/content/terminology";

const records: [Locale, SiteContent][] = [
  ["ar", ar],
  ["fr", fr],
  ["en", en],
];

function collectStrings(value: unknown, out: string[] = []): string[] {
  if (typeof value === "string") out.push(value);
  else if (Array.isArray(value)) value.forEach((v) => collectStrings(v, out));
  else if (value && typeof value === "object")
    Object.values(value).forEach((v) => collectStrings(v, out));
  return out;
}

describe("trilingual structural parity", () => {
  it("keeps equal collection sizes across locales", () => {
    for (const [, c] of records) {
      expect(c.ui.nav).toHaveLength(en.ui.nav.length);
      expect(c.hero.pillars).toHaveLength(3);
      expect(c.why.problems).toHaveLength(5);
      expect(c.why.answers).toHaveLength(3);
      expect(c.architecture.layers).toHaveLength(3);
      expect(c.morocco.pillars).toHaveLength(6);
      expect(c.sudan.roles).toHaveLength(6);
      expect(c.corridor.nodes).toHaveLength(5);
      expect(c.corridor.routes).toHaveLength(4);
      expect(c.chains.chains).toHaveLength(4);
      for (const chain of c.chains.chains) expect(chain.stages).toHaveLength(6);
      expect(c.operating.steps).toHaveLength(9);
      expect(c.trust.principles).toHaveLength(8);
      expect(c.contact.actions).toHaveLength(4);
      expect(c.ui.footer.hierarchy).toHaveLength(3);
    }
  });

  it("uses identical nav anchors and section targets in every locale", () => {
    const anchors = en.ui.nav.map((n) => n.anchor);
    for (const [, c] of records) {
      expect(c.ui.nav.map((n) => n.anchor)).toEqual(anchors);
    }
  });

  it("keeps corridor route ids, states and endpoints aligned", () => {
    const reference = en.corridor.routes.map(({ id, from, to, via, state }) => ({
      id,
      from,
      to,
      via,
      state,
    }));
    for (const [, c] of records) {
      expect(
        c.corridor.routes.map(({ id, from, to, via, state }) => ({
          id,
          from,
          to,
          via,
          state,
        })),
      ).toEqual(reference);
    }
  });

  it("labels every route state in every locale", () => {
    for (const [, c] of records) {
      for (const route of c.corridor.routes) {
        expect(c.corridor.states[route.state].label.length).toBeGreaterThan(0);
      }
    }
  });
});

describe("approved terminology", () => {
  it("uses the canonical organization, gateway and forum names", () => {
    for (const [locale, c] of records) {
      const text = collectStrings(c).join("\n");
      expect(text).toContain(canonicalNames.organization[locale]);
      expect(text).toContain(canonicalNames.gateway[locale]);
      expect(text).toContain(canonicalNames.forum[locale]);
    }
  });

  it("contains no restricted or inflated public claims", () => {
    for (const [locale, c] of records) {
      const text = collectStrings(c).join("\n").toLowerCase();
      for (const term of restrictedPublicTerms[locale]) {
        expect(text).not.toContain(term.toLowerCase());
      }
      for (const term of bannedMarketingTerms) {
        expect(text).not.toContain(term.toLowerCase());
      }
    }
  });

  it("does not claim any operationally verified route", () => {
    for (const [, c] of records) {
      for (const route of c.corridor.routes) {
        expect(route.state).not.toBe("verified");
        expect(route.state).not.toBe("pilot-qualified");
      }
    }
  });
});
