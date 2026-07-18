import { isLocale, defaultLocale } from "@/lib/i18n";
import { getContent, getExperience, getReception } from "@/lib/content";
import type { Locale } from "@/content/types";
import SiteChrome from "@/components/layout/SiteChrome";
import Hero from "@/components/sections/Hero";
import GatewayStatus from "@/components/sections/home/GatewayStatus";
import AudienceEntry from "@/components/sections/home/AudienceEntry";
import {
  ValueSummary,
  JourneySummary,
  ChainsCorridorSummary,
  ForumSummary,
  TrustAboutSummary,
  ReceptionCta,
} from "@/components/sections/home/HomeSummaries";

interface PageProps {
  params: Promise<{ lang: string }>;
}

/**
 * Phase 1 homepage — the clarity journey:
 * hero → status → audience entry → value → journey → chains/corridor
 * → forum → trust/about → reception. Detailed content lives on the
 * dedicated routes (Phase 4); legacy anchors are preserved.
 */
export default async function Page({ params }: PageProps) {
  const { lang } = await params;
  const locale: Locale = isLocale(lang) ? lang : defaultLocale;
  const site = getContent(locale);
  const experience = getExperience(locale);
  const reception = getReception(locale);

  return (
    <SiteChrome locale={locale}>
      <Hero hero={site.hero} locale={locale} />
      <GatewayStatus status={experience.status} />
      <AudienceEntry
        locale={locale}
        audiences={experience.audiences}
        sectionLabel={site.ui.sectionLabel}
        requestTypeLabels={reception.requestTypes}
      />
      <ValueSummary locale={locale} experience={experience} site={site} />
      <JourneySummary locale={locale} experience={experience} site={site} />
      <ChainsCorridorSummary
        locale={locale}
        experience={experience}
        site={site}
      />
      <ForumSummary locale={locale} experience={experience} site={site} />
      <TrustAboutSummary locale={locale} experience={experience} site={site} />
      <ReceptionCta locale={locale} experience={experience} />
    </SiteChrome>
  );
}
