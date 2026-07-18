import { getContent, getExperience } from "@/lib/content";
import { pageMetadata, resolveLocale } from "@/lib/page-meta";
import SiteChrome from "@/components/layout/SiteChrome";
import PageHero from "@/components/layout/PageHero";
import PageReceptionBand from "@/components/layout/PageReceptionBand";
import MoroccoValue from "@/components/sections/MoroccoValue";

export const generateMetadata = pageMetadata("morocco");

export default async function MoroccoPage({
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
      <PageReceptionBand
        locale={locale}
        experience={experience}
        requestType="qualification"
      />
    </SiteChrome>
  );
}
