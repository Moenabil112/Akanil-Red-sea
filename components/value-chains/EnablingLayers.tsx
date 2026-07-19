import styles from "./EnablingLayers.module.css";

export interface EnablingLayer {
  title: string;
  text?: string;
}

interface EnablingLayersProps {
  layers: EnablingLayer[];
  label: string;
  eyebrow?: string;
  title?: string;
  lead?: string;
  as?: "h2" | "h3";
  /** Render on a dark surface (overview) vs light (profile). */
  onDark?: boolean;
}

/**
 * Cross-cutting enabling layers (P2, ADR-018): the finance, logistics,
 * standards, technology, trust and human-capability layers every pathway
 * depends on. Reused with descriptive text on the overview and as a
 * compact chain-specific list on each profile.
 */
export default function EnablingLayers({
  layers,
  label,
  eyebrow,
  title,
  lead,
  as: Heading = "h2",
  onDark = false,
}: EnablingLayersProps) {
  return (
    <section
      className={onDark ? styles.sectionDark : styles.section}
      aria-label={label}
    >
      {eyebrow ? <p className={styles.eyebrow}>{eyebrow}</p> : null}
      {title ? (
        <Heading className={styles.title}>{title}</Heading>
      ) : (
        <Heading className="visually-hidden">{label}</Heading>
      )}
      {lead ? <p className={styles.lead}>{lead}</p> : null}
      <ul className={styles.grid}>
        {layers.map((layer) => (
          <li key={layer.title} className={styles.layer}>
            <h4 className={styles.layerTitle}>{layer.title}</h4>
            {layer.text ? (
              <p className={styles.layerText}>{layer.text}</p>
            ) : null}
          </li>
        ))}
      </ul>
    </section>
  );
}
