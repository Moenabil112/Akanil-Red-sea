import type { EcosystemContent } from "@/content/ecosystem-types";
import Reveal from "@/components/motion/Reveal";
import styles from "./SpecialistReviewPanel.module.css";

interface SpecialistReviewPanelProps {
  content: EcosystemContent["reviewPanel"];
  /** Render on a dark surface (About) vs light (portfolio/profile). */
  onDark?: boolean;
  /** Heading level for the panel title; keeps one H1 per page. */
  as?: "h2" | "h3";
}

/**
 * Reusable visitor-facing specialist-review panel (P1 §11). Shows the
 * six-step review path and the eight what-this-means statements
 * (reception ≠ acceptance, review ≠ endorsement, financing not
 * guaranteed, partnership not approved, confidential info not shared
 * automatically, more info may be requested, only humans decide, AI
 * assists but never approves). Used on About, the portfolio overview and
 * each platform profile.
 */
export default function SpecialistReviewPanel({
  content,
  onDark = false,
  as: Heading = "h2",
}: SpecialistReviewPanelProps) {
  return (
    <Reveal
      as="section"
      className={onDark ? styles.panelDark : styles.panel}
      aria-label={content.title}
    >
      <p className={styles.eyebrow}>{content.eyebrow}</p>
      <Heading className={styles.title}>{content.title}</Heading>
      <p className={styles.lead}>{content.lead}</p>
      <div className={styles.grid}>
        <div>
          <h4 className={styles.subTitle}>{content.stepsTitle}</h4>
          <ol className={styles.steps}>
            {content.steps.map((step, index) => (
              <li key={step} className={styles.step}>
                <span className={styles.stepIndex} aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </div>
        <div>
          <h4 className={styles.subTitle}>{content.statementsTitle}</h4>
          <ul className={styles.statements}>
            {content.statements.map((statement) => (
              <li key={statement} className={styles.statement}>
                {statement}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Reveal>
  );
}
