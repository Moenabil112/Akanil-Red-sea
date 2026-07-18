import Link from "next/link";
import type { ExperienceContent, Locale } from "@/content/types";
import SectionIntro from "@/components/ui/SectionIntro";
import Reveal from "@/components/motion/Reveal";
import styles from "./AudienceEntry.module.css";

interface AudienceEntryProps {
  locale: Locale;
  audiences: ExperienceContent["audiences"];
  sectionLabel: string;
  requestTypeLabels: Record<string, { label: string }>;
}

/**
 * Phase 2 — authored audience entry paths. Each path routes to Digital
 * Reception Lite with the audience and default request type preselected.
 * Deliberately editorial rows, not a SaaS pricing grid.
 */
export default function AudienceEntry({
  locale,
  audiences,
  sectionLabel,
  requestTypeLabels,
}: AudienceEntryProps) {
  return (
    <section id="entry" className={styles.section}>
      <div className="container">
        <SectionIntro
          number="03"
          eyebrow={audiences.eyebrow}
          title={audiences.title}
          lead={audiences.lead}
          tone="light"
          sectionLabel={sectionLabel}
        />
        <ol className={styles.paths}>
          {audiences.paths.map((path, index) => (
            <Reveal as="li" key={path.id} delay={index * 60} className={styles.path}>
              <div className={styles.pathHead}>
                <span className={styles.pathIndex} aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className={styles.pathName}>{path.name}</h3>
              </div>
              <p className={styles.forWho}>{path.forWho}</p>
              <ul className={styles.purposes}>
                {path.purposes.map((purpose) => (
                  <li key={purpose} className={styles.purpose}>
                    {purpose}
                  </li>
                ))}
              </ul>
              <div className={styles.pathFoot}>
                <Link
                  className={styles.cta}
                  href={`/${locale}/reception?type=${path.defaultRequestType}&audience=${path.id}`}
                >
                  {path.ctaLabel}
                </Link>
                <span className={styles.requestTypes}>
                  {path.requestTypes
                    .map((t) => requestTypeLabels[t]?.label)
                    .filter(Boolean)
                    .join(" · ")}
                </span>
              </div>
              {path.note ? <p className={styles.note}>{path.note}</p> : null}
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
