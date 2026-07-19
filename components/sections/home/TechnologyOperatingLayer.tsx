import type { EcosystemContent } from "@/content/ecosystem-types";
import SectionIntro from "@/components/ui/SectionIntro";
import Reveal from "@/components/motion/Reveal";
import styles from "./TechnologyOperatingLayer.module.css";

interface TechnologyOperatingLayerProps {
  technology: EcosystemContent["technology"];
  states: EcosystemContent["states"];
  sectionLabel: string;
  number?: string;
}

/**
 * 09 — technology and operating intelligence (P0 §11). Every capability
 * carries an explicit localized state (ADR-015); nothing is presented as
 * active unless it is. Technology is explained as governance, not
 * decoration.
 */
export default function TechnologyOperatingLayer({
  technology,
  states,
  sectionLabel,
  number = "09",
}: TechnologyOperatingLayerProps) {
  return (
    <section id="technology" className={styles.section}>
      <div className="container">
        {/* Legacy anchor (ADR-011): the operating journey lived here. */}
        <div id="operating" className={styles.anchor} aria-hidden="true" />
        <SectionIntro
          number={number}
          eyebrow={technology.eyebrow}
          title={technology.title}
          lead={technology.lead}
          sectionLabel={sectionLabel}
        />
        <Reveal className={styles.principle}>
          <p>{technology.principle}</p>
        </Reveal>
        <ul className={styles.capabilities}>
          {technology.capabilities.map((capability, index) => (
            <Reveal
              as="li"
              key={capability.title}
              delay={index * 40}
              className={styles.capability}
            >
              <h3 className={styles.capabilityTitle}>{capability.title}</h3>
              <p className={styles.capabilityText}>{capability.text}</p>
              <p className={styles.capabilityState} data-state={capability.state}>
                <span className={styles.stateLabel}>
                  {technology.stateLabel}
                </span>{" "}
                {states.capabilityState[capability.state]}
              </p>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
