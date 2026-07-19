import Link from "next/link";
import type { Locale } from "@/content/types";
import type { EcosystemContent } from "@/content/ecosystem-types";
import Reveal from "@/components/motion/Reveal";
import styles from "./WhyRedSea.module.css";

interface WhyRedSeaProps {
  locale: Locale;
  content: EcosystemContent["whyRedSea"];
  sectionLabel: string;
  number?: string;
}

/**
 * 02 — Why the Red Sea (P0 §4). The core strategic thesis: the Red Sea
 * as the economic space where nine layers meet, plus Akanil's triangular
 * bridge role. Rendered before any limitation or status matrix.
 */
export default function WhyRedSea({
  locale,
  content,
  sectionLabel,
  number = "02",
}: WhyRedSeaProps) {
  return (
    <section id="why-red-sea" className={styles.section}>
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
          <Reveal className={styles.layersBlock}>
            <h3 className={styles.layersTitle}>{content.layersTitle}</h3>
            <ol className={styles.layers}>
              {content.layers.map((layer, index) => (
                <li key={layer} className={styles.layer}>
                  <span className={styles.layerIndex} aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  {layer}
                </li>
              ))}
            </ol>
          </Reveal>
          <Reveal delay={120} className={styles.bridge}>
            <h3 className={styles.bridgeTitle}>{content.bridgeTitle}</h3>
            <p className={styles.bridgeText}>{content.bridgeText}</p>
            <Link className={styles.link} href={`/${locale}/corridor`}>
              {content.linkLabel}
              <span aria-hidden="true"> →</span>
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
