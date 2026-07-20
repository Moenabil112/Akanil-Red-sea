import type { ForumContent } from "@/content/forum-types";
import styles from "./OutcomeCategories.module.css";

interface OutcomeCategoriesProps {
  content: ForumContent["outcomes"];
  as?: "h2" | "h3";
}

/**
 * The public expected-outcome model (P3 §11). Presents the possible
 * next-step categories a specialist review may reach. States plainly that
 * these are not decisions produced automatically by the website, that only
 * authorized humans determine the outcome, and that no commitment,
 * deadline or workflow state is implied.
 */
export default function OutcomeCategories({
  content,
  as: Heading = "h2",
}: OutcomeCategoriesProps) {
  return (
    <section className={styles.section} aria-label={content.title}>
      <p className={styles.eyebrow}>{content.eyebrow}</p>
      <Heading className={styles.title}>{content.title}</Heading>
      <p className={styles.lead}>{content.lead}</p>
      <ul className={styles.grid}>
        {content.items.map((item) => (
          <li key={item.id} className={styles.item}>
            {item.label}
          </li>
        ))}
      </ul>
      <p className={styles.note}>{content.note}</p>
    </section>
  );
}
