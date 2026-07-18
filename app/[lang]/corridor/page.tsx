import { getContent, getExperience } from "@/lib/content";
import { pageMetadata, resolveLocale } from "@/lib/page-meta";
import SiteChrome from "@/components/layout/SiteChrome";
import PageHero from "@/components/layout/PageHero";
import PageReceptionBand from "@/components/layout/PageReceptionBand";
import Corridor from "@/components/sections/Corridor";

export const generateMetadata = pageMetadata("corridor");

export default async function CorridorPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale = resolveLocale(lang);
  const site = getContent(locale);
  const experience = getExperience(locale);
  return (
    <SiteChrome locale={locale}>
      <PageHero
        eyebrow={site.corridor.eyebrow}
        heading={site.corridor.title}
        lead={site.corridor.lead}
      />
      <Corridor
        corridor={site.corridor}
        sectionLabel={site.ui.sectionLabel}
        number="01"
      />
      <PageReceptionBand
        locale={locale}
        experience={experience}
        requestType="value-chain"
      />
    </SiteChrome>
  );
}
