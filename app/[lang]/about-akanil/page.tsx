import { getContent, getExperience } from "@/lib/content";
import { pageMetadata, resolveLocale } from "@/lib/page-meta";
import SiteChrome from "@/components/layout/SiteChrome";
import PageHero from "@/components/layout/PageHero";
import PageReceptionBand from "@/components/layout/PageReceptionBand";
import About from "@/components/sections/About";

export const generateMetadata = pageMetadata("about-akanil");

export default async function AboutPage({
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
        eyebrow={site.about.eyebrow}
        heading={site.about.title}
        lead={site.about.paragraphs[0]}
      />
      <About about={site.about} sectionLabel={site.ui.sectionLabel} number="01" />
      <PageReceptionBand locale={locale} experience={experience} />
    </SiteChrome>
  );
}
