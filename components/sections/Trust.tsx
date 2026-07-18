import type { SiteContent } from "@/content/types";
import SectionIntro from "@/components/ui/SectionIntro";
import Reveal from "@/components/motion/Reveal";
import styles from "./Trust.module.css";

interface TrustProps {
  trust: SiteContent["trust"];
  sectionLabel: string;
  number?: string;
}

export default function Trust({ trust, sectionLabel, number = "10" }: TrustProps) {
  return (
    <section id="trust" className={styles.section}>
      <div className="container">
        <div className={styles.head}>
          <SectionIntro
            number={number}
            eyebrow={trust.eyebrow}
            title={trust.title}
            lead={trust.lead}
            sectionLabel={sectionLabel}
          />
          <Reveal className={styles.quote}>
            <blockquote>
              <p>{trust.quote}</p>
            </blockquote>
          </Reveal>
        </div>

        <ul className={styles.principles}>
          {trust.principles.map((principle, index) => (
            <Reveal
              as="li"
              key={principle.title}
              delay={(index % 4) * 70}
              className={styles.principle}
            >
              <span className={styles.principleIndex} aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className={styles.principleTitle}>{principle.title}</h3>
              <p className={styles.principleText}>{principle.text}</p>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
