import type { ValueGroup } from "@/content/value-chains-types";
import styles from "./GeographicValue.module.css";

interface GeographicValueProps {
  groups: ValueGroup[];
  /** Accessible label / section heading. */
  label: string;
  eyebrow?: string;
  title?: string;
  lead?: string;
  /** Heading level for the section title (keeps one H1 per page). */
  as?: "h2" | "h3";
}

/**
 * Geographic value contribution (P2, ADR-018). Shows how value is
 * contributed on each side of the bridge — Sudan, Morocco and the Red Sea
 * corridor — as titled lists. Reused with the shared framing on the
 * overview and with a chain-specific breakdown on each profile.
 */
export default function GeographicValue({
  groups,
  label,
  eyebrow,
  title,
  lead,
  as: Heading = "h2",
}: GeographicValueProps) {
  return (
    <section className={styles.section} aria-label={label}>
      {eyebrow ? <p className={styles.eyebrow}>{eyebrow}</p> : null}
      {title ? (
        <Heading className={styles.title}>{title}</Heading>
      ) : (
        <Heading className="visually-hidden">{label}</Heading>
      )}
      {lead ? <p className={styles.lead}>{lead}</p> : null}
      <div className={styles.grid}>
        {groups.map((group) => (
          <div key={group.title} className={styles.group}>
            <h4 className={styles.groupTitle}>{group.title}</h4>
            <ul className={styles.items}>
              {group.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
