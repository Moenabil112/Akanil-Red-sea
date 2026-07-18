import type { SiteContent } from "@/content/types";
import SectionIntro from "@/components/ui/SectionIntro";
import Reveal from "@/components/motion/Reveal";
import styles from "./About.module.css";

interface AboutProps {
  about: SiteContent["about"];
  sectionLabel: string;
}

export default function About({ about, sectionLabel }: AboutProps) {
  return (
    <section id="about" className={styles.section}>
      <div className={`container ${styles.grid}`}>
        <div>
          <SectionIntro
            number="11"
            eyebrow={about.eyebrow}
            title={about.title}
            sectionLabel={sectionLabel}
          />
          {about.paragraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 24)} className={styles.paragraph}>
              {paragraph}
            </p>
          ))}
          <div className={styles.roles}>
            <h3 className={styles.rolesTitle}>{about.rolesTitle}</h3>
            <ul className={styles.rolesList}>
              {about.roles.map((role) => (
                <li key={role} className={styles.role}>
                  {role}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Reveal className={styles.founder}>
          <blockquote className={styles.founderQuote}>
            <p>{about.founderQuote}</p>
          </blockquote>
          <footer className={styles.founderMeta}>
            <strong>{about.founderName}</strong>
            <span>{about.founderRole}</span>
          </footer>
        </Reveal>
      </div>
    </section>
  );
}
