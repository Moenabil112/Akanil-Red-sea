import { getContent, getExperience } from "@/lib/content";
import { pageMetadata, resolveLocale } from "@/lib/page-meta";
import SiteChrome from "@/components/layout/SiteChrome";
import PageHero from "@/components/layout/PageHero";
import PageReceptionBand from "@/components/layout/PageReceptionBand";
import Trust from "@/components/sections/Trust";

export const generateMetadata = pageMetadata("trust");

export default async function TrustPage({
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
        eyebrow={site.trust.eyebrow}
        heading={site.trust.title}
        lead={site.trust.lead}
      />
      <Trust trust={site.trust} sectionLabel={site.ui.sectionLabel} number="01" />
      <PageReceptionBand locale={locale} experience={experience} />
    </SiteChrome>
  );
}
