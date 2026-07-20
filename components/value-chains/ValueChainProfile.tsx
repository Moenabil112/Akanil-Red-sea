import Link from "next/link";
import type { Locale } from "@/content/types";
import type { EcosystemContent, PlatformId } from "@/content/ecosystem-types";
import type {
  ValueChainProfileContent,
  ValueChainsContent,
} from "@/content/value-chains-types";
import Reveal from "@/components/motion/Reveal";
import SpecialistReviewPanel from "@/components/review/SpecialistReviewPanel";
import ValueFlowPath from "./ValueFlowPath";
import GeographicValue from "./GeographicValue";
import EnablingLayers from "./EnablingLayers";
import styles from "./ValueChainProfile.module.css";

interface ValueChainProfileProps {
  locale: Locale;
  chain: ValueChainProfileContent;
  content: ValueChainsContent;
  reviewPanel: EcosystemContent["reviewPanel"];
  relatedPlatforms: { id: PlatformId; name: string; href: string }[];
  /** P3 concise Forum-discussion cross-link. */
  forumEngagement?: React.ReactNode;
}

/**
 * Shared, accessible value-chain profile template (P2, ADR-018). Renders
 * the scenario snapshot, the structural problem and shared-value
 * opportunity, the reusable ValueFlowPath, geographic value contribution,
 * chain-specific enabling layers, related portfolio platforms, public
 * vs verification scope, scenario boundaries, the specialist-review
 * pathway and the chain-aware Request-a-review CTA. Content-driven from
 * the single authoritative value-chain model; no per-chain JSX branching.
 */
export default function ValueChainProfile({
  locale,
  chain,
  content,
  reviewPanel,
  relatedPlatforms,
  forumEngagement,
}: ValueChainProfileProps) {
  const reviewHref = `/${locale}/reception?type=${chain.cta.requestType}&chain=${chain.id}`;

  return (
    <div className={styles.profile}>
      {/* Scenario snapshot */}
      <Reveal
        as="section"
        className={`container ${styles.snapshot}`}
        aria-label={content.scenarioStatusLabel}
      >
        <dl className={styles.snapshotGrid}>
          <div className={styles.snapshotCell}>
            <dt>{content.categoryLabel}</dt>
            <dd>{chain.category}</dd>
          </div>
          <div
            className={styles.snapshotCell}
            data-status={chain.scenarioStatus}
          >
            <dt>{content.scenarioStatusLabel}</dt>
            <dd>{content.scenarioStatus[chain.scenarioStatus]}</dd>
          </div>
          <div className={styles.snapshotCell}>
            <dt>{content.sourceBasisLabel}</dt>
            <dd>{chain.sourceBasis}</dd>
          </div>
          <div className={styles.snapshotCell}>
            <dt>{content.lastReviewedLabel}</dt>
            <dd>{chain.lastReviewed}</dd>
          </div>
        </dl>
      </Reveal>

      <div className={`container ${styles.body}`}>
        <Section title={content.problemLabel}>
          <p className={styles.prose}>{chain.problem}</p>
        </Section>
        <Section title={content.opportunityLabel}>
          <p className={styles.prose}>{chain.opportunity}</p>
        </Section>
      </div>

      {/* Shared-value flow */}
      <Reveal as="section" className={`container ${styles.flowWrap}`}>
        <h2 className={styles.blockTitle}>{content.flowLabel}</h2>
        <ValueFlowPath
          stages={chain.flow}
          flowLabel={content.flowLabel}
          roleLabel={content.flowRoleLabel}
          contributionLabel={content.flowContributionLabel}
        />
      </Reveal>

      {/* Geographic value contribution */}
      <Reveal as="div" className={`container ${styles.block}`}>
        <GeographicValue
          groups={chain.geographicContribution}
          label={content.geographicLabel}
          title={content.geographicLabel}
          as="h2"
        />
      </Reveal>

      {/* Chain-specific enabling layers */}
      <Reveal as="div" className={`container ${styles.block}`}>
        <EnablingLayers
          layers={chain.enablingLayers.map((title) => ({ title }))}
          label={content.enablingLayersLabel}
          title={content.enablingLayersLabel}
          as="h2"
        />
      </Reveal>

      {/* Related portfolio platforms (Level-3 mapping) */}
      {relatedPlatforms.length > 0 ? (
        <Reveal as="section" className={`container ${styles.block}`}>
          <h2 className={styles.blockTitle}>{content.relatedPlatformsLabel}</h2>
          <p className={styles.prose}>{chain.relatedPlatformsNote}</p>
          <ul className={styles.platformLinks}>
            {relatedPlatforms.map((platform) => (
              <li key={platform.id}>
                <Link className={styles.platformLink} href={platform.href}>
                  {platform.name}
                </Link>
              </li>
            ))}
          </ul>
        </Reveal>
      ) : null}

      <div className={`container ${styles.body}`}>
        <Section title={content.publicScopeLabel}>
          <ul className={styles.bullets}>
            {chain.publicScope.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </Section>
        <Section title={content.verificationScopeLabel}>
          <ul className={styles.bullets}>
            {chain.verificationScope.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </Section>
      </div>

      {/* Scenario boundaries */}
      <Reveal as="section" className={`container ${styles.block}`}>
        <h2 className={styles.blockTitle}>{content.limitationsLabel}</h2>
        <ul className={styles.limitations}>
          {chain.limitations.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        {chain.regulatoryNote ? (
          <p className={styles.regulatoryNote}>
            <strong className={styles.regulatoryLabel}>
              {content.regulatoryLabel}
            </strong>{" "}
            {chain.regulatoryNote}
          </p>
        ) : null}
      </Reveal>

      {/* Forum discussion (P3 cross-link) */}
      {forumEngagement ? (
        <div className={`container ${styles.block}`}>{forumEngagement}</div>
      ) : null}

      {/* Specialist review pathway */}
      <div className={`container ${styles.reviewWrap}`}>
        <SpecialistReviewPanel content={reviewPanel} as="h2" />
      </div>

      {/* Prepare + chain-aware Request-a-review CTA */}
      <Reveal
        as="section"
        className={`container ${styles.cta}`}
        aria-label={chain.cta.label}
      >
        <div className={styles.ctaPrep}>
          <h2 className={styles.ctaTitle}>{content.prepLabel}</h2>
          <ul className={styles.bullets}>
            {chain.preparationRequirements.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <Link className={styles.ctaButton} href={reviewHref}>
          {chain.cta.label}
        </Link>
      </Reveal>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Reveal as="section" className={styles.section}>
      <h2 className={styles.sectionTitle}>{title}</h2>
      {children}
    </Reveal>
  );
}
