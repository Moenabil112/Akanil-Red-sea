import Image from "next/image";
import type { SiteContent } from "@/content/types";
import SectionIntro from "@/components/ui/SectionIntro";
import Reveal from "@/components/motion/Reveal";
import styles from "./MoroccoValue.module.css";

interface MoroccoValueProps {
  morocco: SiteContent["morocco"];
  conceptArtLabel: string;
  sectionLabel: string;
  number?: string;
}

/** Major authored section for Moroccan stakeholders — not a small card list. */
export default function MoroccoValue({
  morocco,
  conceptArtLabel,
  sectionLabel,
  number = "04",
}: MoroccoValueProps) {
  return (
    <section id="morocco" className={styles.section}>
      <div className="container">
        <SectionIntro
          number={number}
          eyebrow={morocco.eyebrow}
          title={morocco.title}
          lead={morocco.lead}
          tone="light"
          sectionLabel={sectionLabel}
        />

        <div className={styles.statementRow}>
          <Reveal className={styles.statement}>
            <p>{morocco.statement}</p>
          </Reveal>
          <Reveal as="figure" className={styles.visual} delay={120}>
            <Image
              src="/images/morocco/energy-global-connections.webp"
              alt=""
              width={1672}
              height={941}
              loading="lazy"
              className={styles.visualImage}
            />
            <figcaption className={styles.visualLabel}>
              {conceptArtLabel}
            </figcaption>
          </Reveal>
        </div>

        <ol className={styles.pillars}>
          {morocco.pillars.map((pillar, index) => (
            <Reveal
              as="li"
              key={pillar.title}
              delay={(index % 3) * 80}
              className={styles.pillar}
            >
              <span className={styles.pillarIndex} aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className={styles.pillarTitle}>{pillar.title}</h3>
              <p className={styles.pillarText}>{pillar.text}</p>
            </Reveal>
          ))}
        </ol>

        <div className={styles.audience}>
          <h3 className={styles.audienceTitle}>{morocco.audienceTitle}</h3>
          <ul className={styles.audienceList}>
            {morocco.audiences.map((audience) => (
              <li key={audience} className={styles.audienceItem}>
                {audience}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
