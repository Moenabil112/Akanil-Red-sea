import { getContent, getExperience } from "@/lib/content";
import { pageMetadata, resolveLocale } from "@/lib/page-meta";
import SiteChrome from "@/components/layout/SiteChrome";
import PageHero from "@/components/layout/PageHero";
import PageReceptionBand from "@/components/layout/PageReceptionBand";
import Forum from "@/components/sections/Forum";

export const generateMetadata = pageMetadata("forum");

export default async function ForumPage({
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
        eyebrow={site.forum.eyebrow}
        heading={site.forum.title}
        lead={site.forum.lead}
      />
      <Forum forum={site.forum} sectionLabel={site.ui.sectionLabel} number="01" />
      <PageReceptionBand
        locale={locale}
        experience={experience}
        requestType="forum"
      />
    </SiteChrome>
  );
}
