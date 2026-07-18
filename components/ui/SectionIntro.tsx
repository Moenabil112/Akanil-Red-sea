import Reveal from "@/components/motion/Reveal";
import styles from "./SectionIntro.module.css";

interface SectionIntroProps {
  number: string;
  eyebrow: string;
  title: string;
  lead?: string;
  tone?: "dark" | "light";
  /** Visually-hidden prefix for the section number, localized. */
  sectionLabel: string;
}

/** Editorial section opening: numbered eyebrow, heading and lead. */
export default function SectionIntro({
  number,
  eyebrow,
  title,
  lead,
  tone = "dark",
  sectionLabel,
}: SectionIntroProps) {
  return (
    <Reveal className={`${styles.intro} ${tone === "light" ? styles.light : ""}`}>
      <p className={styles.eyebrow}>
        <span className={styles.number}>
          <span className="visually-hidden">{sectionLabel} </span>
          {number}
        </span>
        <span aria-hidden="true" className={styles.rule} />
        {eyebrow}
      </p>
      <h2 className={styles.title}>{title}</h2>
      {lead ? <p className={styles.lead}>{lead}</p> : null}
    </Reveal>
  );
}
