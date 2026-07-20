import {
  getEcosystem,
  getExperience,
  getForum,
  getValueChains,
} from "@/lib/content";
import { forumMetadata, resolveLocale } from "@/lib/page-meta";
import {
  participationPathIds,
  sectorTrackIds,
  tracksForPath,
  platformsForPath,
  chainsForPath,
  trackPlatformMap,
  trackChainMap,
} from "@/lib/forum";
import type {
  ForumOutcomeId,
  ForumParticipationPathId,
  ForumSectorTrackId,
} from "@/content/forum-types";
import SiteChrome from "@/components/layout/SiteChrome";
import PageHero from "@/components/layout/PageHero";
import PageReceptionBand from "@/components/layout/PageReceptionBand";
import ForumNav from "@/components/forum/ForumNav";
import ParticipationPaths, {
  type PathLinks,
} from "@/components/forum/ParticipationPaths";
import SectorTracks, {
  type TrackLinks,
} from "@/components/forum/SectorTracks";
import styles from "@/components/forum/forum-page.module.css";

export const generateMetadata = forumMetadata("participation", "forum/participation");

/**
 * /[lang]/forum/participation — the six participation paths and five
 * sector tracks in full (P3 §7, §8, §16). Platform and value-chain links
 * are derived from the structural maps in lib/forum.ts; names come from the
 * P1 and P2 content records.
 */
export default async function ForumParticipationPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale = resolveLocale(lang);
  const forum = getForum(locale);
  const ecosystem = getEcosystem(locale);
  const valueChains = getValueChains(locale);
  const experience = getExperience(locale);

  const platformName = (id: string) =>
    ecosystem.platforms.items.find((p) => p.id === id)!.name;
  const chainName = (id: string) =>
    valueChains.items.find((c) => c.id === id)!.shortName;
  const trackTitle = (id: ForumSectorTrackId) =>
    forum.tracks.items.find((t) => t.id === id)!.title;

  const qualBase = `/${locale}/reception?type=forum-qualification`;

  const outcomeLabels = Object.fromEntries(
    forum.outcomes.items.map((item) => [item.id, item.label]),
  ) as Record<ForumOutcomeId, string>;

  const pathLinks = Object.fromEntries(
    participationPathIds.map((id) => {
      const links: PathLinks = {
        trackTitles: tracksForPath(id).map(trackTitle),
        platforms: platformsForPath(id).map((pid) => ({
          id: pid,
          name: platformName(pid),
          href: `/${locale}/portfolio/${pid}`,
        })),
        chains: chainsForPath(id).map((cid) => ({
          id: cid,
          name: chainName(cid),
          href: `/${locale}/value-chains/${cid}`,
        })),
        qualificationHref: `${qualBase}&participant=${id}`,
      };
      return [id, links];
    }),
  ) as Record<ForumParticipationPathId, PathLinks>;

  const trackLinks = Object.fromEntries(
    sectorTrackIds.map((id) => {
      const links: TrackLinks = {
        platforms: trackPlatformMap[id].map((pid) => ({
          id: pid,
          name: platformName(pid),
          href: `/${locale}/portfolio/${pid}`,
        })),
        chains: trackChainMap[id].map((cid) => ({
          id: cid,
          name: chainName(cid),
          href: `/${locale}/value-chains/${cid}`,
        })),
        qualificationHref: `${qualBase}&track=${id}`,
      };
      return [id, links];
    }),
  ) as Record<ForumSectorTrackId, TrackLinks>;

  return (
    <SiteChrome locale={locale}>
      <PageHero
        eyebrow={forum.participation.eyebrow}
        heading={forum.participation.title}
        lead={forum.participation.lead}
      />
      <ForumNav
        locale={locale}
        label={forum.navLabel}
        items={forum.nav}
        activeHref="/forum/participation"
      />

      <div className={styles.page}>
        <section className={styles.section}>
          <div className="container">
            <ParticipationPaths
              content={forum.participation}
              outcomeLabels={outcomeLabels}
              links={pathLinks}
            />
          </div>
        </section>

        <section className={styles.section}>
          <div className="container">
            <p className={styles.eyebrow}>{forum.tracks.eyebrow}</p>
            <h2 className={styles.sectionTitle}>{forum.tracks.title}</h2>
            <p className={styles.lead}>{forum.tracks.lead}</p>
            <div className={styles.overviewMore}>
              <SectorTracks content={forum.tracks} links={trackLinks} />
            </div>
          </div>
        </section>
      </div>

      <PageReceptionBand
        locale={locale}
        experience={experience}
        requestType="forum-qualification"
      />
    </SiteChrome>
  );
}
