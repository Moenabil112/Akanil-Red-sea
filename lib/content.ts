import type {
  ExperienceContent,
  Locale,
  ReceptionContent,
  SiteContent,
} from "@/content/types";
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
