import Link from "next/link";
import type { Locale } from "@/content/types";
import type {
  AudienceId,
  EcosystemContent,
  PortfolioPlatformContent,
} from "@/content/ecosystem-types";
import PublicStatusControl from "@/components/ui/PublicStatusControl";
import styles from "./Portfolio.module.css";

interface PortfolioPlatformCardProps {
  locale: Locale;
  platform: PortfolioPlatformContent;
  labels: Omit<EcosystemContent["platforms"], "items">;
  states: EcosystemContent["states"];
  audienceNames: Record<AudienceId, string>;
}

/**
 * Portfolio platform card (P0 §6, §26, ADR-013). Shows the mandated
 * fields — category, purpose, problem solved, Akanil role, geographies,
 * audiences, public status, evidence state — plus the regulatory note
 * where required (IBRIZ/GAAS, ADR-016). CTA routes to reception with the
 * platform's controlled request type; never a consumer or investment CTA.
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
          <dt className={styles.factTerm}>{labels.problemLabel}</dt>
          <dd className={styles.factValue}>{platform.problemSolved}</dd>
        </div>
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

      <PublicStatusControl
        entries={[
          {
            term: labels.statusLabel,
            value: states.publicStatus[platform.publicStatus],
            tone: "status",
          },
          {
            term: labels.evidenceLabel,
            value: states.evidenceState[platform.evidenceState],
            tone: "evidence",
          },
        ]}
      />

      {platform.regulatoryNote ? (
        <p className={styles.regulatoryNote}>
          <strong className={styles.regulatoryLabel}>
            {labels.regulatoryLabel}
          </strong>{" "}
          {platform.regulatoryNote}
        </p>
      ) : null}

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
