import type { EcosystemContent } from "@/content/ecosystem-types";
import SectionIntro from "@/components/ui/SectionIntro";
import Reveal from "@/components/motion/Reveal";
import styles from "./SpecialistReviewProcess.module.css";

interface SpecialistReviewProcessProps {
  review: EcosystemContent["review"];
  sectionLabel: string;
  number?: string;
}

/**
 * 11 — specialized review process (P0 §22). Discipline categories (not
 * individual names), the controlled routing model, and the guarantees:
 * reception is not acceptance, review is not endorsement, only
 * authorized humans decide.
 */
export default function SpecialistReviewProcess({
  review,
  sectionLabel,
  number = "11",
}: SpecialistReviewProcessProps) {
  return (
    <section id="review" className={styles.section}>
      <div className="container">
        <SectionIntro
          number={number}
          eyebrow={review.eyebrow}
          title={review.title}
          lead={review.lead}
          tone="light"
          sectionLabel={sectionLabel}
        />
        <div className={styles.grid}>
          <Reveal className={styles.disciplinesBlock}>
            <h3 className={styles.subTitle}>{review.disciplinesTitle}</h3>
            <ul className={styles.disciplines}>
              {review.disciplines.map((discipline) => (
                <li key={discipline} className={styles.discipline}>
                  {discipline}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={80} className={styles.routingBlock}>
            <h3 className={styles.subTitle}>{review.routingTitle}</h3>
            <ol className={styles.routing}>
              {review.routing.map((step, index) => (
                <li key={step} className={styles.routingStep}>
                  <span className={styles.routingIndex} aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </Reveal>
        </div>

        <Reveal delay={120} className={styles.guarantees}>
          <ul className={styles.guaranteeList}>
            {review.guarantees.map((guarantee) => (
              <li key={guarantee} className={styles.guarantee}>
                {guarantee}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
