import type { SiteContent } from "@/content/types";
import SectionIntro from "@/components/ui/SectionIntro";
import Reveal from "@/components/motion/Reveal";
import styles from "./Architecture.module.css";

interface ArchitectureProps {
  architecture: SiteContent["architecture"];
  sectionLabel: string;
}

/**
 * Three-layer institutional architecture. The layers are rendered as a
 * descending hierarchy — not three equal sibling cards — so ownership
 * (Akanil → Gateway → Forum) reads structurally.
 */
export default function Architecture({
  architecture,
  sectionLabel,
}: ArchitectureProps) {
  return (
    <section id="architecture" className={styles.section}>
      <div className="container">
        <SectionIntro
          number="03"
          eyebrow={architecture.eyebrow}
          title={architecture.title}
          lead={architecture.lead}
          sectionLabel={sectionLabel}
        />

        <ol className={styles.layers}>
          {architecture.layers.map((layer, index) => (
            <Reveal
              as="li"
              key={layer.name}
              delay={index * 120}
              className={styles.layer}
            >
              <div className={styles.layerRail} aria-hidden="true">
                <span className={styles.layerDot} />
                {index < architecture.layers.length - 1 ? (
                  <span className={styles.layerLine} />
                ) : null}
              </div>
              <div className={styles.layerBody} data-depth={index}>
                <p className={styles.layerBadge}>{layer.badge}</p>
                <h3 className={styles.layerName}>{layer.name}</h3>
                <p className={styles.layerRole}>{layer.role}</p>
                <p className={styles.layerText}>{layer.text}</p>
                <p className={styles.layerKeywords}>{layer.keywords}</p>
              </div>
            </Reveal>
          ))}
        </ol>

        <p className={styles.chamberNote}>{architecture.chamberNote}</p>
      </div>
    </section>
  );
}
