import type { ReceptionContent } from "@/content/types";
import type { RequestTypeId } from "@/content/ecosystem-types";
import styles from "./ReceptionDesk.module.css";

interface RequestContextPanelProps {
  reception: ReceptionContent;
  requestType: RequestTypeId;
}

/**
 * Context for the selected request type (P0 §33): what the specialized
 * review is expected to produce, what to prepare, and the mandatory
 * disclaimer where one applies (project review, forum qualification,
 * project/asset submission).
 */
export default function RequestContextPanel({
  reception,
  requestType,
}: RequestContextPanelProps) {
  const definition = reception.requestTypes[requestType];
  return (
    <aside className={styles.contextPanel} aria-live="polite">
      <p className={styles.contextDescription}>{definition.description}</p>
      <h4 className={styles.contextTitle}>{reception.expectedReviewLabel}</h4>
      <ul className={styles.contextList}>
        {definition.expectedReviewOutput.map((item) => (
          <li key={item} className={styles.contextItem}>
            {item}
          </li>
        ))}
      </ul>
      <h4 className={styles.contextTitle}>{reception.preparationLabel}</h4>
      <ul className={styles.contextList}>
        {definition.preparationRequirements.map((item) => (
          <li key={item} className={styles.contextItem}>
            {item}
          </li>
        ))}
      </ul>
      {definition.disclaimer ? (
        <p className={styles.contextDisclaimer}>{definition.disclaimer}</p>
      ) : null}
    </aside>
  );
}
