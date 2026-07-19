import styles from "./PublicStatusControl.module.css";

export interface StatusEntry {
  /** Localized label, e.g. "Public status" / "Evidence state". */
  term: string;
  /** Localized explanatory wording for the state. */
  value: string;
  /** Structural tone; styling is subtle and never the only signal. */
  tone: "status" | "evidence" | "capability";
}

interface PublicStatusControlProps {
  entries: StatusEntry[];
  onDark?: boolean;
}

/**
 * Claims-control state display (P0 §27, ADR-015). States are carried by
 * localized explanatory text — no percentages, no gauges, never color
 * alone. Used by platform cards, node details and capability lists.
 */
export default function PublicStatusControl({
  entries,
  onDark = false,
}: PublicStatusControlProps) {
  return (
    <dl className={onDark ? styles.listDark : styles.list}>
      {entries.map((entry) => (
        <div key={entry.term} className={styles.row} data-tone={entry.tone}>
          <dt className={styles.term}>{entry.term}</dt>
          <dd className={styles.value}>{entry.value}</dd>
        </div>
      ))}
    </dl>
  );
}
