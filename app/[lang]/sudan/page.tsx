import { getContent, getExperience } from "@/lib/content";
import { pageMetadata, resolveLocale } from "@/lib/page-meta";
import SiteChrome from "@/components/layout/SiteChrome";
import PageHero from "@/components/layout/PageHero";
import PageReceptionBand from "@/components/layout/PageReceptionBand";
import SudanValue from "@/components/sections/SudanValue";

export const generateMetadata = pageMetadata("sudan");

export default async function SudanPage({
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
      <PageReceptionBand
        locale={locale}
        experience={experience}
        requestType="need-opportunity"
      />
    </SiteChrome>
  );
}
