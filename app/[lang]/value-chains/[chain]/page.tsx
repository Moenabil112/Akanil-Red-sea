import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getEcosystem,
  getExperience,
  getForum,
  getValueChains,
} from "@/lib/content";
import {
  valueChainIds,
  isValueChainId,
  platformsForChain,
} from "@/lib/value-chains";
import { tracksForChain, pathsForChain } from "@/lib/forum";
import { resolveLocale } from "@/lib/page-meta";
import type { ValueChainId } from "@/content/value-chains-types";
import SiteChrome from "@/components/layout/SiteChrome";
import PageHero from "@/components/layout/PageHero";
import PageReceptionBand from "@/components/layout/PageReceptionBand";
import ValueChainProfile from "@/components/value-chains/ValueChainProfile";
import ForumEngagement from "@/components/forum/ForumEngagement";

interface ChainParams {
  lang: string;
  chain: string;
}

/** Statically generate the six value-chain profiles per locale (P2 §routes). */
export function generateStaticParams() {
  return valueChainIds.map((chain) => ({ chain }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<ChainParams>;
}): Promise<Metadata> {
  const { lang, chain } = await params;
  if (!isValueChainId(chain)) return {};
  const locale = resolveLocale(lang);
  const content = getValueChains(locale);
  const record = content.items.find((item) => item.id === chain)!;
  const title = `${record.name} — ${content.overviewEyebrow}`;
  const description = record.summary;
  const path = `/${locale}/value-chains/${chain}`;
  return {
    title,
    description,
    alternates: {
      canonical: path,
      languages: {
        ar: `/ar/value-chains/${chain}`,
        fr: `/fr/value-chains/${chain}`,
        en: `/en/value-chains/${chain}`,
      },
    },
    openGraph: {
      title,
      description,
      type: "website",
      locale,
    },
  };
}

/**
 * /[lang]/value-chains/[chain] — dedicated value-chain profile using the
 * shared ValueChainProfile template. Unknown slugs 404 (dynamicParams is
 * false at the layout and isValueChainId guards the render).
 */
export default async function ValueChainProfilePage({
  params,
}: {
  params: Promise<ChainParams>;
}) {
  const { lang, chain } = await params;
  if (!isValueChainId(chain)) notFound();
  const locale = resolveLocale(lang);
  const content = getValueChains(locale);
  const ecosystem = getEcosystem(locale);
  const experience = getExperience(locale);
  const forum = getForum(locale);
  const id = chain as ValueChainId;
  const record = content.items.find((item) => item.id === id)!;

  const relatedPlatforms = platformsForChain(id).map((platformId) => {
    const platform = ecosystem.platforms.items.find((p) => p.id === platformId)!;
    return {
      id: platformId,
      name: platform.name,
      href: `/${locale}/portfolio/${platformId}`,
    };
  });

  const forumTracks = tracksForChain(id).map((trackId) => ({
    id: trackId,
    title: forum.tracks.items.find((t) => t.id === trackId)!.title,
    href: `/${locale}/forum/participation#track-${trackId}`,
  }));
  const forumStakeholders = pathsForChain(id).map(
    (pathId) => forum.participation.paths.find((p) => p.id === pathId)!.title,
  );

  return (
    <SiteChrome locale={locale}>
      <PageHero
        eyebrow={content.profileHeroEyebrow}
        heading={record.name}
        lead={record.summary}
      />
      <ValueChainProfile
        locale={locale}
        chain={record}
        content={content}
        reviewPanel={ecosystem.reviewPanel}
        relatedPlatforms={relatedPlatforms}
        forumEngagement={
          <ForumEngagement
            title={forum.crossLinks.chainTitle}
            lead={forum.crossLinks.chainLead}
            tracksLabel={forum.crossLinks.tracksLabel}
            tracks={forumTracks}
            stakeholders={{
              label: forum.crossLinks.stakeholdersLabel,
              items: forumStakeholders,
            }}
            ctaLabel={forum.crossLinks.ctaLabel}
            ctaHref={`/${locale}/reception?type=forum-qualification&chain=${id}`}
            exploreLabel={forum.crossLinks.exploreLabel}
            exploreHref={`/${locale}/forum/participation`}
            as="h2"
          />
        }
      />
      <PageReceptionBand
        locale={locale}
        experience={experience}
        requestType={record.cta.requestType}
        label={record.cta.label}
      />
    </SiteChrome>
  );
}
