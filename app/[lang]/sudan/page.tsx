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
import SudanValue from "@/components/sections/SudanValue";
import AudienceEntryMatrix from "@/components/sections/home/AudienceEntryMatrix";

export const generateMetadata = pageMetadata("sudan");

/**
 * /sudan — from production and assets to structured value chains,
 * manufacturing partnerships and new market access (P0 §30). The two
 * Sudanese audience paths route decision-makers and producers/asset
 * owners to the right structured request.
 */
export default async function SudanPage({
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
        eyebrow={site.sudan.eyebrow}
        heading={site.sudan.title}
        lead={site.sudan.lead}
      />
      <SudanValue
        sudan={site.sudan}
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
        filterIds={["sudanese-decision-makers", "sudanese-producers-asset-owners"]}
      />
      <PageReceptionBand
        locale={locale}
        experience={experience}
        requestType="submit-project-asset"
      />
    </SiteChrome>
  );
}
