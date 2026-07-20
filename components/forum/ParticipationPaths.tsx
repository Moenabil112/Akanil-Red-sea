import Link from "next/link";
import type { ForumContent, ForumOutcomeId, ForumParticipationPathId } from "@/content/forum-types";
import type { PlatformId } from "@/content/ecosystem-types";
import type { ValueChainId } from "@/content/value-chains-types";
import Reveal from "@/components/motion/Reveal";
import styles from "./ParticipationPaths.module.css";

export interface PathLinks {
  trackTitles: string[];
  platforms: { id: PlatformId; name: string; href: string }[];
  chains: { id: ValueChainId; name: string; href: string }[];
  qualificationHref: string;
}

interface ParticipationPathsProps {
  content: ForumContent["participation"];
  outcomeLabels: Record<ForumOutcomeId, string>;
  links: Record<ForumParticipationPathId, PathLinks>;
}

/**
 * The six participation paths in full (P3 §7): who each includes, the
 * objectives it can serve, the information to prepare, the relevant sector
 * tracks and related platforms/chains, the possible outcomes, and a
 * qualification CTA that preselects the path context. Choosing a path
 * never confirms participation.
 */
export default function ParticipationPaths({
  content,
  outcomeLabels,
  links,
}: ParticipationPathsProps) {
  return (
    <ul className={styles.grid}>
      {content.paths.map((path) => {
        const link = links[path.id];
        return (
          <li key={path.id}>
            <Reveal as="article" className={styles.card}>
              <h3 className={styles.title} id={`path-${path.id}`}>
                {path.title}
              </h3>
              <p className={styles.summary}>{path.summary}</p>

              <Block label={content.whoLabel}>
                <ul className={styles.bullets}>
                  {path.whoItIncludes.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </Block>

              <Block label={content.objectivesLabel}>
                <ul className={styles.bullets}>
                  {path.potentialObjectives.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </Block>

              <Block label={content.preparationLabel}>
                <ul className={styles.bullets}>
                  {path.preparationRequirements.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </Block>

              {link.trackTitles.length > 0 ? (
                <Block label={content.tracksLabel}>
                  <ul className={styles.chips}>
                    {link.trackTitles.map((title) => (
                      <li key={title} className={styles.chip}>
                        {title}
                      </li>
                    ))}
                  </ul>
                </Block>
              ) : null}

              {link.platforms.length > 0 ? (
                <Block label={content.platformsLabel}>
                  <ul className={styles.links}>
                    {link.platforms.map((platform) => (
                      <li key={platform.id}>
                        <Link className={styles.pill} href={platform.href}>
                          {platform.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </Block>
              ) : null}

              {link.chains.length > 0 ? (
                <Block label={content.chainsLabel}>
                  <ul className={styles.links}>
                    {link.chains.map((chain) => (
                      <li key={chain.id}>
                        <Link className={styles.pill} href={chain.href}>
                          {chain.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </Block>
              ) : null}

              <Block label={content.outcomesLabel}>
                <ul className={styles.outcomes}>
                  {path.expectedOutcomes.map((id) => (
                    <li key={id} className={styles.outcome}>
                      {outcomeLabels[id]}
                    </li>
                  ))}
                </ul>
              </Block>

              {path.note ? <p className={styles.note}>{path.note}</p> : null}

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

function Block({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className={styles.block}>
      <h4 className={styles.blockLabel}>{label}</h4>
      {children}
    </div>
  );
}
