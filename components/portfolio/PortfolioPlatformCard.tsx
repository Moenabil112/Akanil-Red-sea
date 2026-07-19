import Link from "next/link";
import type { Locale } from "@/content/types";
import type {
  AudienceId,
  EcosystemContent,
  PortfolioPlatformContent,
} from "@/content/ecosystem-types";
import styles from "./Portfolio.module.css";

interface PortfolioPlatformCardProps {
  locale: Locale;
  platform: PortfolioPlatformContent;
  labels: Omit<EcosystemContent["platforms"], "items">;
  states: EcosystemContent["states"];
  audienceNames: Record<AudienceId, string>;
}

/**
 * Portfolio platform card (P1 reconciliation §6). Concise project card:
 * type, core value, geographic scope, main components, current stage,
 * clearly-labelled preliminary figures where safe, partners sought, the
 * simplified four-state project-file status with a last-reviewed date,
 * the regulatory note where required (IBRIZ/GAAS), and a Request Project
 * Review action routing through the no-backend reception model. Status is
 * carried by text, never colour alone.
 */
export default function PortfolioPlatformCard({
  locale,
  platform,
  labels,
  states,
  audienceNames,
}: PortfolioPlatformCardProps) {
  return (
    <article className={styles.card} data-platform={platform.id}>
      <header className={styles.cardHead}>
        <h3 className={styles.cardName}>{platform.name}</h3>
        <p className={styles.cardCategory}>{platform.category}</p>
      </header>

      <p className={styles.cardPurpose}>{platform.purpose}</p>

      <dl className={styles.cardFacts}>
        <div className={styles.fact}>
          <dt className={styles.factTerm}>{labels.roleLabel}</dt>
          <dd className={styles.factValue}>{platform.operatingRole}</dd>
        </div>
        <div className={styles.fact}>
          <dt className={styles.factTerm}>{labels.scopeLabel}</dt>
          <dd className={styles.factValue}>
            {platform.geographicScope.join(" · ")}
          </dd>
        </div>
        <div className={styles.fact}>
          <dt className={styles.factTerm}>{labels.audiencesLabel}</dt>
          <dd className={styles.factValue}>
            {platform.targetStakeholders
              .map((id) => audienceNames[id])
              .filter(Boolean)
              .join(" · ")}
          </dd>
        </div>
      </dl>

      <div className={styles.capabilities}>
        <span className={styles.factTerm}>{labels.capabilitiesLabel}</span>
        <ul className={styles.capabilityList}>
          {platform.capabilities.map((capability) => (
            <li key={capability} className={styles.capability}>
              {capability}
            </li>
          ))}
        </ul>
      </div>

      <div className={styles.stage}>
        <span className={styles.factTerm}>{labels.stageLabel}</span>
        <p className={styles.stageText}>{platform.stage}</p>
      </div>

      {platform.indicativeFigures ? (
        <div className={styles.figures}>
          <span className={styles.factTerm}>{labels.figuresLabel}</span>
          <ul className={styles.figureList}>
            {platform.indicativeFigures.map((figure) => (
              <li key={figure} className={styles.figure}>
                {figure}
              </li>
            ))}
          </ul>
          {platform.figuresNote ? (
            <p className={styles.figuresNote}>{platform.figuresNote}</p>
          ) : null}
        </div>
      ) : null}

      <div className={styles.partners}>
        <span className={styles.factTerm}>{labels.partnersLabel}</span>
        <ul className={styles.partnerList}>
          {platform.partnersSought.map((partner) => (
            <li key={partner} className={styles.partner}>
              {partner}
            </li>
          ))}
        </ul>
      </div>

      {platform.regulatoryNote ? (
        <p className={styles.regulatoryNote}>
          <strong className={styles.regulatoryLabel}>
            {labels.regulatoryLabel}
          </strong>{" "}
          {platform.regulatoryNote}
        </p>
      ) : null}

      <dl className={styles.statusRow} data-status={platform.projectStatus}>
        <div className={styles.statusCell}>
          <dt className={styles.factTerm}>{labels.fileStatusLabel}</dt>
          <dd className={styles.statusValue}>
            {states.projectStatus[platform.projectStatus]}
            {platform.statusDetail ? ` — ${platform.statusDetail}` : ""}
          </dd>
        </div>
        <div className={styles.statusCell}>
          <dt className={styles.factTerm}>{labels.lastReviewedLabel}</dt>
          <dd className={styles.statusValue}>{platform.lastReviewed}</dd>
        </div>
      </dl>

      <footer className={styles.cardFoot}>
        <Link
          className={styles.cardCta}
          href={`/${locale}/reception?type=${platform.cta.requestType}`}
        >
          {platform.cta.label}
        </Link>
      </footer>
    </article>
  );
}
