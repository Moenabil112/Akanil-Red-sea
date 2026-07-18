import type { SiteContent } from "@/content/types";
import SectionIntro from "@/components/ui/SectionIntro";
import Reveal from "@/components/motion/Reveal";
import styles from "./OperatingLayer.module.css";

interface OperatingLayerProps {
  operating: SiteContent["operating"];
  sectionLabel: string;
}

export default function OperatingLayer({
  operating,
  sectionLabel,
}: OperatingLayerProps) {
  return (
    <section id="operating" className={styles.section}>
      <div className={`container ${styles.grid}`}>
        <div className={styles.sticky}>
          <SectionIntro
            number="09"
            eyebrow={operating.eyebrow}
            title={operating.title}
            lead={operating.lead}
            tone="light"
            sectionLabel={sectionLabel}
          />
          <p className={styles.statusNote}>{operating.statusNote}</p>
        </div>

        <ol className={styles.steps}>
          {operating.steps.map((step, index) => (
            <Reveal
              as="li"
              key={step.title}
              delay={index * 50}
              className={styles.step}
            >
              <span className={styles.stepIndex} aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.stepText}>{step.text}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
