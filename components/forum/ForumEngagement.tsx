import Link from "next/link";
import type { ForumSectorTrackId } from "@/content/forum-types";
import Reveal from "@/components/motion/Reveal";
import styles from "./ForumEngagement.module.css";

interface ForumEngagementProps {
  title: string;
  lead: string;
  tracksLabel: string;
  tracks: { id: ForumSectorTrackId; title: string; href: string }[];
  /** Optional stakeholder categories (used on value-chain profiles). */
  stakeholders?: { label: string; items: string[] };
  ctaLabel: string;
  ctaHref: string;
  exploreLabel: string;
  exploreHref: string;
  as?: "h2" | "h3";
}

/**
 * Concise Forum-engagement cross-link (P3 §16), reused on platform and
 * value-chain profiles. Surfaces the relevant Forum sector tracks (and,
 * for value chains, the stakeholder categories typically involved) and a
 * qualification CTA. Qualification precedes any meeting.
 */
export default function ForumEngagement({
  title,
  lead,
  tracksLabel,
  tracks,
  stakeholders,
  ctaLabel,
  ctaHref,
  exploreLabel,
  exploreHref,
  as: Heading = "h2",
}: ForumEngagementProps) {
  return (
    <Reveal as="section" className={styles.panel} aria-label={title}>
      <Heading className={styles.title}>{title}</Heading>
      <p className={styles.lead}>{lead}</p>

      {tracks.length > 0 ? (
        <div className={styles.block}>
          <h3 className={styles.blockLabel}>{tracksLabel}</h3>
          <ul className={styles.links}>
            {tracks.map((track) => (
              <li key={track.id}>
                <Link className={styles.pill} href={track.href}>
                  {track.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {stakeholders && stakeholders.items.length > 0 ? (
        <div className={styles.block}>
          <h3 className={styles.blockLabel}>{stakeholders.label}</h3>
          <ul className={styles.chips}>
            {stakeholders.items.map((item) => (
              <li key={item} className={styles.chip}>
                {item}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className={styles.actions}>
        <Link className={styles.cta} href={ctaHref}>
          {ctaLabel}
        </Link>
        <Link className={styles.textLink} href={exploreHref}>
          {exploreLabel}
        </Link>
      </div>
    </Reveal>
  );
}
