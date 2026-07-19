import Link from "next/link";
import type { Locale, ReceptionContent } from "@/content/types";
import type { EcosystemContent, PlatformId } from "@/content/ecosystem-types";
import SectionIntro from "@/components/ui/SectionIntro";
import Reveal from "@/components/motion/Reveal";
import styles from "./AudienceEntryMatrix.module.css";

interface AudienceEntryMatrixProps {
  locale: Locale;
  audiences: EcosystemContent["audiences"];
  platformNames: Record<PlatformId, string>;
  requestTypes: ReceptionContent["requestTypes"];
  sectionLabel: string;
  number?: string;
  /** Restrict the matrix to specific audience paths (Morocco/Sudan pages). */
  filterIds?: EcosystemContent["audiences"]["paths"][number]["id"][];
}

/**
 * 04 — choose your role in the ecosystem (P0 §12–19). Seven authored
 * audience paths; each routes to reception with the audience and default
 * request type preselected. Preparation requirements and the expected
 * review output live behind a native disclosure, keeping the matrix
 * scannable without JavaScript.
 */
export default function AudienceEntryMatrix({
  locale,
  audiences,
  platformNames,
  requestTypes,
  sectionLabel,
  number = "04",
  filterIds,
}: AudienceEntryMatrixProps) {
  const paths = filterIds
    ? audiences.paths.filter((path) => filterIds.includes(path.id))
    : audiences.paths;
  return (
    <section id="entry" className={styles.section}>
      <div className="container">
        <SectionIntro
          number={number}
          eyebrow={audiences.eyebrow}
          title={audiences.title}
          lead={audiences.lead}
          tone="light"
          sectionLabel={sectionLabel}
        />
        <ol className={styles.paths}>
          {paths.map((path, index) => (
            <Reveal as="li" key={path.id} delay={index * 50} className={styles.path}>
              <div className={styles.pathHead}>
                <span className={styles.pathIndex} aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className={styles.pathName}>{path.title}</h3>
              </div>

              <p className={styles.need}>{path.strategicNeed}</p>
              <p className={styles.who}>
                <span className={styles.metaLabel}>{audiences.whoLabel}</span>{" "}
                {path.whoItIncludes.join(" · ")}
              </p>

              <div className={styles.valueBlock}>
                <span className={styles.metaLabel}>{audiences.valueLabel}</span>
                <ul className={styles.valueList}>
                  {path.gatewayValue.map((value) => (
                    <li key={value} className={styles.valueItem}>
                      {value}
                    </li>
                  ))}
                </ul>
              </div>

              <div className={styles.pathFoot}>
                <Link
                  className={styles.cta}
                  href={`/${locale}/reception?type=${path.defaultRequestType}&audience=${path.id}`}
                >
                  {path.ctaLabel}
                </Link>
                <span className={styles.requestTypes}>
                  {path.allowedRequestTypes
                    .map((type) => requestTypes[type]?.label)
                    .filter(Boolean)
                    .join(" · ")}
                </span>
                <span className={styles.platforms}>
                  <span className={styles.metaLabel}>
                    {audiences.platformsLabel}
                  </span>{" "}
                  {path.relevantPlatforms
                    .map((id) => platformNames[id])
                    .filter(Boolean)
                    .join(" · ")}
                </span>
              </div>

              <details className={styles.details}>
                <summary className={styles.summary}>
                  {audiences.preparationLabel}
                </summary>
                <div className={styles.detailsBody}>
                  <ul className={styles.prepList}>
                    {path.preparationRequirements.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                  <p className={styles.reviewOutput}>
                    <span className={styles.metaLabel}>
                      {audiences.reviewOutputLabel}
                    </span>{" "}
                    {path.expectedReviewOutput}
                  </p>
                </div>
              </details>

              {path.note ? <p className={styles.note}>{path.note}</p> : null}
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
