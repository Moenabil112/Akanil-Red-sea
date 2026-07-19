import { getExperience, getValueChains } from "@/lib/content";
import { pageMetadata, resolveLocale } from "@/lib/page-meta";
import SiteChrome from "@/components/layout/SiteChrome";
import PageHero from "@/components/layout/PageHero";
import PageReceptionBand from "@/components/layout/PageReceptionBand";
import ValueChainOverview from "@/components/value-chains/ValueChainOverview";

export const generateMetadata = pageMetadata("value-chains");

/**
 * /[lang]/value-chains — the deepened P2 value-chain experience: the six
 * priority pathways, cross-cutting enabling layers and geographic value
 * contribution. The homepage keeps its own concise value-chain teaser.
 */
export default async function ValueChainsPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale = resolveLocale(lang);
  const content = getValueChains(locale);
  const experience = getExperience(locale);
  return (
    <SiteChrome locale={locale}>
      <PageHero
        eyebrow={content.overviewEyebrow}
        heading={content.overviewTitle}
        lead={content.overviewLead}
      />
      <ValueChainOverview locale={locale} content={content} />
      <PageReceptionBand
        locale={locale}
        experience={experience}
        requestType="supply-offtake-requirement"
      />
    </SiteChrome>
  );
}
