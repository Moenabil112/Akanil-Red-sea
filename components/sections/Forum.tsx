import Image from "next/image";
import type { SiteContent } from "@/content/types";
import SectionIntro from "@/components/ui/SectionIntro";
import Reveal from "@/components/motion/Reveal";
import styles from "./Forum.module.css";

interface ForumProps {
  forum: SiteContent["forum"];
  sectionLabel: string;
}

export default function Forum({ forum, sectionLabel }: ForumProps) {
  return (
    <section id="forum" className={styles.section}>
      <div className={`container ${styles.grid}`}>
        <Reveal as="figure" className={styles.poster}>
          <Image
            src="/images/forum/forum-poster-portrait.webp"
            alt={forum.posterAlt}
            width={1055}
            height={1491}
            loading="lazy"
            className={styles.posterImage}
          />
          <figcaption className={styles.posterLabel}>
            {forum.posterLabel}
          </figcaption>
        </Reveal>

        <div className={styles.copy}>
          <SectionIntro
            number="08"
            eyebrow={forum.eyebrow}
            title={forum.title}
            lead={forum.lead}
            sectionLabel={sectionLabel}
          />
          <dl className={styles.facts}>
            {forum.facts.map((fact) => (
              <div key={fact.title} className={styles.fact}>
                <dt className={styles.factTitle}>{fact.title}</dt>
                <dd className={styles.factText}>{fact.text}</dd>
              </div>
            ))}
          </dl>
          <a
            href="#operating"
            className={styles.cta}
            title={forum.cta.explanation}
          >
            {forum.cta.label}
          </a>
        </div>
      </div>
    </section>
  );
}
