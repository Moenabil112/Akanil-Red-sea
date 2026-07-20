import type {
  ExperienceContent,
  Locale,
  ReceptionContent,
  SiteContent,
} from "@/content/types";
import type { EcosystemContent } from "@/content/ecosystem-types";
import type { ValueChainsContent } from "@/content/value-chains-types";
import type { ForumContent } from "@/content/forum-types";
import { arEcosystem } from "@/content/ar/ecosystem";
import { frEcosystem } from "@/content/fr/ecosystem";
import { enEcosystem } from "@/content/en/ecosystem";
import { arValueChains } from "@/content/ar/value-chains";
import { frValueChains } from "@/content/fr/value-chains";
import { enValueChains } from "@/content/en/value-chains";
import { arForum } from "@/content/ar/forum";
import { frForum } from "@/content/fr/forum";
import { enForum } from "@/content/en/forum";
import { ar } from "@/content/ar/site";
import { fr } from "@/content/fr/site";
import { en } from "@/content/en/site";
import { arExperience } from "@/content/ar/experience";
import { frExperience } from "@/content/fr/experience";
import { enExperience } from "@/content/en/experience";
import { arReception } from "@/content/ar/reception";
import { frReception } from "@/content/fr/reception";
import { enReception } from "@/content/en/reception";

const records: Record<Locale, SiteContent> = { ar, fr, en };

const experienceRecords: Record<Locale, ExperienceContent> = {
  ar: arExperience,
  fr: frExperience,
  en: enExperience,
};

const receptionRecords: Record<Locale, ReceptionContent> = {
  ar: arReception,
  fr: frReception,
  en: enReception,
};

export function getContent(locale: Locale): SiteContent {
  return records[locale];
}

export function getExperience(locale: Locale): ExperienceContent {
  return experienceRecords[locale];
}

export function getReception(locale: Locale): ReceptionContent {
  return receptionRecords[locale];
}

const ecosystemRecords: Record<Locale, EcosystemContent> = {
  ar: arEcosystem,
  fr: frEcosystem,
  en: enEcosystem,
};

export function getEcosystem(locale: Locale): EcosystemContent {
  return ecosystemRecords[locale];
}

const valueChainRecords: Record<Locale, ValueChainsContent> = {
  ar: arValueChains,
  fr: frValueChains,
  en: enValueChains,
};

export function getValueChains(locale: Locale): ValueChainsContent {
  return valueChainRecords[locale];
}

const forumRecords: Record<Locale, ForumContent> = {
  ar: arForum,
  fr: frForum,
  en: enForum,
};

export function getForum(locale: Locale): ForumContent {
  return forumRecords[locale];
}
