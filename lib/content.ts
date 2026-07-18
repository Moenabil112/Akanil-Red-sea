import type { Locale, SiteContent } from "@/content/types";
import { ar } from "@/content/ar/site";
import { fr } from "@/content/fr/site";
import { en } from "@/content/en/site";

const records: Record<Locale, SiteContent> = { ar, fr, en };

export function getContent(locale: Locale): SiteContent {
  return records[locale];
}
