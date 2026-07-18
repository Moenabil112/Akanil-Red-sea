import type { ExperienceContent } from "@/content/types";
import Reveal from "@/components/motion/Reveal";
import styles from "./GatewayStatus.module.css";

interface GatewayStatusProps {
  status: ExperienceContent["status"];
}

/**
 * Calm institutional status layer (Phase 1). A definition list, not a
 * dashboard: no percentages, no gauges, no fabricated metrics. State is
 * carried by text plus a typed marker — never by color alone.
 */
export default function GatewayStatus({ status }: GatewayStatusProps) {
  return (
    <section id="status" className={styles.section} aria-label={status.title}>
      <div className="container">
        <Reveal>
          <p className={styles.eyebrow}>{status.eyebrow}</p>
          <h2 className={styles.title}>{status.title}</h2>
        </Reveal>
        <dl className={styles.list}>
          {status.items.map((item, index) => (
            <Reveal as="div" key={item.label} delay={index * 40} className={styles.row}>
              <dt className={styles.label}>{item.label}</dt>
              <dd className={styles.stateCell}>
                <span className={styles.state} data-kind={item.kind}>
                  {item.state}
                </span>
              </dd>
              <dd className={styles.note}>{item.note}</dd>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  );
}
