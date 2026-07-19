import {
  getContent,
  getEcosystem,
  getExperience,
  getReception,
} from "@/lib/content";
import { pageMetadata, resolveLocale } from "@/lib/page-meta";
import type { PlatformId } from "@/content/ecosystem-types";
import SiteChrome from "@/components/layout/SiteChrome";
import PageHero from "@/components/layout/PageHero";
import PageReceptionBand from "@/components/layout/PageReceptionBand";
import MoroccoValue from "@/components/sections/MoroccoValue";
import AudienceEntryMatrix from "@/components/sections/home/AudienceEntryMatrix";

export const generateMetadata = pageMetadata("morocco");

/**
 * /morocco — Morocco as an industrial transformation, standards,
 * finance, logistics and market-access platform (P0 §29). The three
 * Moroccan audience paths show what each category may obtain.
 */
export default async function MoroccoPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale = resolveLocale(lang);
  const site = getContent(locale);
  const experience = getExperience(locale);
  const ecosystem = getEcosystem(locale);
  const reception = getReception(locale);

  const platformNames = Object.fromEntries(
    ecosystem.platforms.items.map((platform) => [platform.id, platform.name]),
  ) as Record<PlatformId, string>;

  return (
    <SiteChrome locale={locale}>
      <PageHero
        eyebrow={site.morocco.eyebrow}
        heading={site.morocco.title}
        lead={site.morocco.lead}
      />
      <MoroccoValue
        morocco={site.morocco}
        conceptArtLabel={site.ui.conceptArtLabel}
        sectionLabel={site.ui.sectionLabel}
        number="01"
      />
      <AudienceEntryMatrix
        locale={locale}
        audiences={ecosystem.audiences}
        platformNames={platformNames}
        requestTypes={reception.requestTypes}
        sectionLabel={site.ui.sectionLabel}
        number="02"
        filterIds={[
          "moroccan-institutions",
          "moroccan-industry-exporters",
          "moroccan-finance-investment",
        ]}
      />
      <PageReceptionBand
        locale={locale}
        experience={experience}
        requestType="market-expansion"
      />
    </SiteChrome>
  );
}
