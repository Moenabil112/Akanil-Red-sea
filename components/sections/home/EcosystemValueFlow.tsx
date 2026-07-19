import type { EcosystemContent } from "@/content/ecosystem-types";
import Reveal from "@/components/motion/Reveal";
import styles from "./EcosystemValueFlow.module.css";

interface EcosystemValueFlowProps {
  content: EcosystemContent["valueFlow"];
  sectionLabel: string;
  number?: string;
}

/**
 * 03 — how the ecosystem creates value (P0 §4). The eight-step chain from
 * African production and assets to regional and international markets,
 * with Morocco presented as a transformation and market-access platform
 * and the mandatory market-access qualification note.
 */
export default function EcosystemValueFlow({
  content,
  sectionLabel,
  number = "03",
}: EcosystemValueFlowProps) {
  return (
    <section id="value-flow" className={styles.section}>
      <div className="container">
        <Reveal className={styles.intro}>
          <p className={styles.numberRow}>
            <span className={styles.number}>
              <span className="visually-hidden">{sectionLabel} </span>
              {number}
            </span>
            <span aria-hidden="true" className={styles.rule} />
          </p>
          <h2 className={styles.title}>{content.title}</h2>
          <p className={styles.lead}>{content.lead}</p>
        </Reveal>

        <div className={styles.grid}>
          <ol className={styles.flow}>
            {content.steps.map((step, index) => (
              <Reveal
                as="li"
                key={step}
                delay={index * 50}
                className={styles.step}
              >
                <span className={styles.stepIndex} aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className={styles.stepText}>{step}</span>
                {index < content.steps.length - 1 ? (
                  <span aria-hidden="true" className={styles.connector} />
                ) : null}
              </Reveal>
            ))}
          </ol>

          <Reveal delay={150} className={styles.moroccoPanel}>
            <h3 className={styles.panelTitle}>{content.moroccoPlatformTitle}</h3>
            <ul className={styles.roles}>
              {content.moroccoPlatformRoles.map((role) => (
                <li key={role} className={styles.role}>
                  {role}
                </li>
              ))}
            </ul>
            <p className={styles.qualification}>{content.marketAccessNote}</p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
