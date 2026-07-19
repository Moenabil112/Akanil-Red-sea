import Link from "next/link";
import type { Locale } from "@/content/types";
import type {
  EcosystemContent,
  PortfolioPlatformContent,
} from "@/content/ecosystem-types";
import type { ValueChainId } from "@/content/value-chains-types";
import Reveal from "@/components/motion/Reveal";
import SpecialistReviewPanel from "@/components/review/SpecialistReviewPanel";
import styles from "./PlatformProfile.module.css";

interface PlatformProfileProps {
  locale: Locale;
  platform: PortfolioPlatformContent;
  labels: Omit<EcosystemContent["platforms"], "items">;
  states: EcosystemContent["states"];
  reviewPanel: EcosystemContent["reviewPanel"];
  /** P2 Level-3 mapping: value chains this platform relates to. */
  relatedChains: { id: ValueChainId; name: string; href: string }[];
}

/**
 * Shared, accessible platform-profile template (P1 §6). Renders the
 * project snapshot, core value, problem, components, scope, stage,
 * labelled preliminary figures, partners sought, what-is-public-now,
 * what-may-be-available-after-review, claims and limitations, the
 * specialist-review pathway, and the Request Project Review CTA — plus
 * source and last-reviewed dates. Content-driven from the single
 * authoritative platform model; no per-platform JSX branching.
 */
export default function PlatformProfile({
  locale,
  platform,
  labels,
  states,
  reviewPanel,
  relatedChains,
}: PlatformProfileProps) {
  const reviewHref = `/${locale}/reception?type=${platform.cta.requestType}&platform=${platform.id}`;

  return (
    <div className={styles.profile}>
      {/* 2. Project snapshot */}
      <Reveal
        as="section"
        className={`container ${styles.snapshot}`}
        aria-label={labels.snapshotLabel}
      >
        <h2 className={styles.snapshotTitle}>{labels.snapshotLabel}</h2>
        <dl className={styles.snapshotGrid}>
          <div className={styles.snapshotCell}>
            <dt>{labels.categoryLabel}</dt>
            <dd>{platform.category}</dd>
          </div>
          <div className={styles.snapshotCell} data-status={platform.projectStatus}>
            <dt>{labels.fileStatusLabel}</dt>
            <dd>
              {states.projectStatus[platform.projectStatus]}
              {platform.statusDetail ? ` — ${platform.statusDetail}` : ""}
            </dd>
          </div>
          {platform.sourceDate ? (
            <div className={styles.snapshotCell}>
              <dt>{labels.sourceDateLabel}</dt>
              <dd>{platform.sourceDate}</dd>
            </div>
          ) : null}
          <div className={styles.snapshotCell}>
            <dt>{labels.lastReviewedLabel}</dt>
            <dd>{platform.lastReviewed}</dd>
          </div>
        </dl>
      </Reveal>

      <div className={`container ${styles.body}`}>
        {/* 3. Core value */}
        <Section title={labels.purposeLabel}>
          <p className={styles.prose}>{platform.purpose}</p>
        </Section>

        {/* 4. Problem addressed */}
        <Section title={labels.problemLabel}>
          <p className={styles.prose}>{platform.problemSolved}</p>
        </Section>

        {/* 5. Main components */}
        <Section title={labels.capabilitiesLabel}>
          <ul className={styles.chips}>
            {platform.capabilities.map((item) => (
              <li key={item} className={styles.chip}>
                {item}
              </li>
            ))}
          </ul>
        </Section>

        {/* 6. Geographic scope */}
        <Section title={labels.scopeLabel}>
          <ul className={styles.bullets}>
            {platform.geographicScope.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </Section>

        {/* 7. Current stage */}
        <Section title={labels.stageLabel}>
          <p className={styles.prose}>{platform.stage}</p>
        </Section>

        {/* 8–9. Indicative figures + qualification note */}
        {platform.indicativeFigures ? (
          <Section title={labels.figuresLabel}>
            <ul className={styles.bullets}>
              {platform.indicativeFigures.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            {platform.figuresNote ? (
              <p className={styles.figuresNote}>{platform.figuresNote}</p>
            ) : null}
          </Section>
        ) : null}

        {/* 10. Partners or capabilities sought */}
        <Section title={labels.partnersLabel}>
          <ul className={styles.bullets}>
            {platform.partnersSought.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </Section>

        {/* 11. What is public now */}
        <Section title={labels.publicInfoLabel}>
          <ul className={styles.bullets}>
            {platform.publicInformation.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </Section>

        {/* 12. What may be available after review */}
        <Section title={labels.reviewInfoLabel}>
          <ul className={styles.bullets}>
            {platform.reviewInformation.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </Section>

        {/* 13. Claims and limitations */}
        <Section title={labels.limitationsLabel}>
          <ul className={styles.limitations}>
            {platform.limitations.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          {platform.regulatoryNote ? (
            <p className={styles.regulatoryNote}>
              <strong className={styles.regulatoryLabel}>
                {labels.regulatoryLabel}
              </strong>{" "}
              {platform.regulatoryNote}
            </p>
          ) : null}
        </Section>
      </div>

      {/* 13b. Related value chains (P2 Level-3 mapping) */}
      {relatedChains.length > 0 ? (
        <Reveal as="section" className={`container ${styles.relatedChains}`}>
          <h2 className={styles.relatedChainsTitle}>
            {labels.relatedChainsLabel}
          </h2>
          {platform.relatedChainsNote ? (
            <p className={styles.relatedChainsNote}>
              {platform.relatedChainsNote}
            </p>
          ) : null}
          <ul className={styles.chainLinks}>
            {relatedChains.map((chain) => (
              <li key={chain.id}>
                <Link className={styles.chainLink} href={chain.href}>
                  {chain.name}
                </Link>
              </li>
            ))}
          </ul>
        </Reveal>
      ) : null}

      {/* 14. Specialist review pathway */}
      <div className={`container ${styles.reviewWrap}`}>
        <h2 className="visually-hidden">{labels.reviewPathwayLabel}</h2>
        <SpecialistReviewPanel content={reviewPanel} as="h3" />
      </div>

      {/* 15–16. Request Project Review + preparation */}
      <Reveal as="section" className={`container ${styles.cta}`} aria-label={platform.cta.label}>
        <div className={styles.ctaPrep}>
          <h2 className={styles.ctaTitle}>{labels.prepLabel}</h2>
          <ul className={styles.bullets}>
            {platform.preparationRequirements.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <Link className={styles.ctaButton} href={reviewHref}>
          {platform.cta.label}
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
