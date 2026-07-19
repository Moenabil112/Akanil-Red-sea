import { getContent, getExperience } from "@/lib/content";
import { pageMetadata, resolveLocale } from "@/lib/page-meta";
import SiteChrome from "@/components/layout/SiteChrome";
import PageHero from "@/components/layout/PageHero";
import PageReceptionBand from "@/components/layout/PageReceptionBand";
import ValueChains from "@/components/sections/ValueChains";

export const generateMetadata = pageMetadata("value-chains");

export default async function ValueChainsPage({
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
        eyebrow={site.chains.eyebrow}
        heading={site.chains.title}
        lead={site.chains.lead}
      />
      <ValueChains
        chains={site.chains}
        sectionLabel={site.ui.sectionLabel}
        number="01"
      />
      <PageReceptionBand
        locale={locale}
        experience={experience}
        requestType="supply-offtake-requirement"
      />
    </SiteChrome>
  );
}
