import type { ForumContent } from "@/content/forum-types";
import Reveal from "@/components/motion/Reveal";
import styles from "./MeetingPreparation.module.css";

interface MeetingPreparationProps {
  content: ForumContent["meeting"];
  as?: "h2" | "h3";
}

/**
 * Reusable meeting-preparation model (P3 §10). Explains the conditions a
 * Forum meeting should meet before it is worth holding, and a visitor
 * preparation checklist. States plainly that the website neither schedules
 * nor confirms meetings — a specialist decides.
 */
export default function MeetingPreparation({
  content,
  as: Heading = "h2",
}: MeetingPreparationProps) {
  return (
    <Reveal as="section" className={styles.panel} aria-label={content.title}>
      <p className={styles.eyebrow}>{content.eyebrow}</p>
      <Heading className={styles.title}>{content.title}</Heading>
      <p className={styles.lead}>{content.lead}</p>

      <ul className={styles.criteria}>
        {content.criteria.map((criterion, index) => (
          <li key={criterion.title} className={styles.criterion}>
            <span className={styles.index} aria-hidden="true">
              {String(index + 1).padStart(2, "0")}
            </span>
            <div>
              <h3 className={styles.criterionTitle}>{criterion.title}</h3>
              <p className={styles.criterionText}>{criterion.text}</p>
            </div>
          </li>
        ))}
      </ul>

      <div className={styles.checklist}>
        <h3 className={styles.checklistTitle}>{content.checklistTitle}</h3>
        <ul className={styles.checklistItems}>
          {content.checklist.map((item) => (
            <li key={item} className={styles.checklistItem}>
              {item}
            </li>
          ))}
        </ul>
      </div>

      <p className={styles.note}>{content.note}</p>
    </Reveal>
  );
}
