/**
 * Canonical approved names (P2-16 §3) and restricted public terminology
 * (P2-16 §8). Referenced by components and enforced by tests.
 */

import type { Locale } from "./types";

export const canonicalNames: Record<
  "organization" | "gateway" | "forum" | "corridor",
  Record<Locale, string>
> = {
  organization: {
    ar: "أكانيل للتنمية والاستثمار",
    fr: "Akanil Développement et Investissement",
    en: "Akanil for Development and Investment",
  },
  gateway: {
    ar: "بوابة أكانيل الاقتصادية بين المغرب والبحر الأحمر",
    fr: "Passerelle économique Akanil Maroc–mer Rouge",
    en: "Akanil Morocco–Red Sea Economic Gateway",
  },
  forum: {
    ar: "المنتدى الاقتصادي المغربي السوداني",
    fr: "Forum Économique Maroc–Soudan",
    en: "Morocco–Sudan Economic Forum",
  },
  corridor: {
    ar: "ممر أكانيل الاقتصادي بين المغرب والبحر الأحمر",
    fr: "Corridor économique Akanil Maroc–mer Rouge",
    en: "Akanil Morocco–Red Sea Economic Corridor",
  },
};

/**
 * Terms that must not appear in public copy without documented evidence
 * and explicit approval (P2-16 §8 restricted terminology).
 */
export const restrictedPublicTerms: Record<Locale, string[]> = {
  ar: ["شريك رسمي", "تحت الرعاية", "جاهز للاستثمار", "نضمن", "شراكة مؤكدة"],
  fr: [
    "partenaire officiel",
    "sous le patronage",
    "prêt à l'investissement",
    "nous garantissons",
    "partenariat confirmé",
  ],
  en: [
    "official partner",
    "under the patronage",
    "investment-ready",
    "we guarantee",
    "confirmed partnership",
  ],
};

/** Inflated-claim vocabulary the editorial skill bans. */
export const bannedMarketingTerms: string[] = [
  "revolutionary",
  "world-leading",
  "unmatched",
  "révolutionnaire",
  "leader mondial",
  "inégalé",
];
