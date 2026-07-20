import Link from "next/link";
import type { ForumContent, ForumSectorTrackId } from "@/content/forum-types";
import type { PlatformId } from "@/content/ecosystem-types";
import type { ValueChainId } from "@/content/value-chains-types";
import Reveal from "@/components/motion/Reveal";
import styles from "./SectorTracks.module.css";

export interface TrackLinks {
  platforms: { id: PlatformId; name: string; href: string }[];
  chains: { id: ValueChainId; name: string; href: string }[];
  qualificationHref: string;
}

interface SectorTracksProps {
  content: ForumContent["tracks"];
  links: Record<ForumSectorTrackId, TrackLinks>;
}

/**
 * The five sector tracks in full (P3 §8): potential discussions and the
 * related P1 platforms and P2 value chains, with a qualification CTA that
 * preselects the track context. Tracks organize discussions; they do not
 * replace the six value-chain pathways. IBRIZ/GAAS appears against the
 * mining track only as a potential regulated concept, never active
 * financing (see each track's note).
 */
export default function SectorTracks({ content, links }: SectorTracksProps) {
  return (
    <ul className={styles.grid}>
      {content.items.map((track) => {
        const link = links[track.id];
        return (
          <li key={track.id}>
            <Reveal as="article" className={styles.card}>
              <h3 className={styles.title} id={`track-${track.id}`}>
                {track.title}
              </h3>
              <p className={styles.summary}>{track.summary}</p>

              <div className={styles.block}>
                <h4 className={styles.blockLabel}>{content.discussionsLabel}</h4>
                <ul className={styles.bullets}>
                  {track.potentialDiscussions.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>

              {link.platforms.length > 0 ? (
                <div className={styles.block}>
                  <h4 className={styles.blockLabel}>{content.platformsLabel}</h4>
                  <ul className={styles.links}>
                    {link.platforms.map((platform) => (
                      <li key={platform.id}>
                        <Link className={styles.pill} href={platform.href}>
                          {platform.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {link.chains.length > 0 ? (
                <div className={styles.block}>
                  <h4 className={styles.blockLabel}>{content.chainsLabel}</h4>
                  <ul className={styles.links}>
                    {link.chains.map((chain) => (
                      <li key={chain.id}>
                        <Link className={styles.pill} href={chain.href}>
                          {chain.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {track.note ? <p className={styles.note}>{track.note}</p> : null}

              <Link className={styles.cta} href={link.qualificationHref}>
                {content.ctaLabel}
              </Link>
            </Reveal>
          </li>
        );
      })}
    </ul>
  );
}
