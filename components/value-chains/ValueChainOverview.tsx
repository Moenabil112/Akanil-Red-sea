import Link from "next/link";
import type { Locale } from "@/content/types";
import type { ValueChainsContent } from "@/content/value-chains-types";
import { valueChainIds } from "@/lib/value-chains";
import Reveal from "@/components/motion/Reveal";
import GeographicValue from "./GeographicValue";
import EnablingLayers from "./EnablingLayers";
import styles from "./ValueChainOverview.module.css";

interface ValueChainOverviewProps {
  locale: Locale;
  content: ValueChainsContent;
}

/**
 * The /value-chains full experience (P2, ADR-018). Presents the six
 * pathways as an editorial grid linking to dedicated profiles, states the
 * scenario-control note up front, and adds the cross-cutting enabling
 * layers and the geographic value contribution. The homepage keeps its
 * own concise value-chain teaser; this is the deepened destination.
 */
export default function ValueChainOverview({
  locale,
  content,
}: ValueChainOverviewProps) {
  const byId = new Map(content.items.map((item) => [item.id, item]));
  const ordered = valueChainIds
    .map((id) => byId.get(id))
    .filter((item): item is NonNullable<typeof item> => Boolean(item));

  return (
    <>
      <section className={styles.intro} aria-label={content.chainsListLabel}>
        <div className="container">
          <p className={styles.scenarioNote}>{content.scenarioNote}</p>

          <ul className={styles.grid}>
            {ordered.map((chain, index) => (
              <li key={chain.id}>
                <Reveal
                  as="article"
                  className={styles.card}
                  delay={index * 60}
                >
                  <p className={styles.cardCategory}>{chain.category}</p>
                  <h2 className={styles.cardTitle}>
                    <Link
                      className={styles.cardLink}
                      href={`/${locale}/value-chains/${chain.id}`}
                    >
                      {chain.shortName}
                    </Link>
                  </h2>
                  <p className={styles.cardSummary}>{chain.summary}</p>
                  <p
                    className={styles.cardStatus}
                    data-status={chain.scenarioStatus}
                  >
                    <span className={styles.cardStatusLabel}>
                      {content.scenarioStatusLabel}
                    </span>
                    {content.scenarioStatus[chain.scenarioStatus]}
                  </p>
                  <span className={styles.cardCta} aria-hidden="true">
                    {content.profileLinkLabel}
                  </span>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <div className={styles.geographic}>
        <div className="container">
          <GeographicValue
            groups={content.geographic.groups}
            label={content.geographic.title}
            eyebrow={content.geographic.eyebrow}
            title={content.geographic.title}
            lead={content.geographic.lead}
            as="h2"
          />
        </div>
      </div>

      <div className={styles.enabling}>
        <div className="container">
          <EnablingLayers
            layers={content.enabling.layers}
            label={content.enabling.title}
            eyebrow={content.enabling.eyebrow}
            title={content.enabling.title}
            lead={content.enabling.lead}
            as="h2"
            onDark
          />
        </div>
      </div>
    </>
  );
}
