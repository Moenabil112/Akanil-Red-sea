import type { ForumContent } from "@/content/forum-types";
import Reveal from "@/components/motion/Reveal";
import styles from "./ProgrammeTimeline.module.css";

interface ProgrammeTimelineProps {
  programme: ForumContent["programme"];
  /** "full" shows purpose + formats; "summary" shows the day titles only. */
  variant?: "full" | "summary";
  /** Heading level for each day title (keeps one H1 per page). */
  as?: "h2" | "h3";
}

/**
 * The five-day proposed programme as a semantic ordered list (P3 §9, §21).
 * Readable and keyboard-navigable without motion or styling; the day
 * sequence is conveyed by markup order and explicit day labels, not by
 * colour. Reused as a compact summary on the hub and in full on the
 * programme page.
 */
export default function ProgrammeTimeline({
  programme,
  variant = "full",
  as: Heading = "h3",
}: ProgrammeTimelineProps) {
  return (
    <ol className={styles.timeline} aria-label={programme.title}>
      {programme.days.map((day) => (
        <li key={day.id} className={styles.day}>
          <Reveal as="article" className={styles.dayInner}>
            <p className={styles.dayLabel}>{day.dayLabel}</p>
            <Heading className={styles.dayTitle}>{day.title}</Heading>
            {variant === "full" ? (
              <div className={styles.dayBody}>
                <div>
                  <h4 className={styles.subLabel}>{programme.purposeLabel}</h4>
                  <ul className={styles.list}>
                    {day.purpose.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className={styles.subLabel}>{programme.formatsLabel}</h4>
                  <ul className={styles.list}>
                    {day.formats.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
                {day.note ? <p className={styles.note}>{day.note}</p> : null}
              </div>
            ) : null}
          </Reveal>
        </li>
      ))}
    </ol>
  );
}
