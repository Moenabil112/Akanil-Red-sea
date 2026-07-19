import type { EcosystemContent, PlatformId } from "@/content/ecosystem-types";
import SectionIntro from "@/components/ui/SectionIntro";
import RedSeaNodeMap from "@/components/maps/RedSeaNodeMap";
import styles from "./NodesSection.module.css";

interface NodesSectionProps {
  ecosystem: EcosystemContent;
  sectionLabel: string;
  number?: string;
}

/** 08 — Red Sea nodes and trade-chain architecture (P0 §5, ADR-017). */
export default function NodesSection({
  ecosystem,
  sectionLabel,
  number = "08",
}: NodesSectionProps) {
  const platformNames = Object.fromEntries(
    ecosystem.platforms.items.map((platform) => [platform.id, platform.name]),
  ) as Record<PlatformId, string>;

  return (
    <section id="nodes" className={styles.section}>
      <div className="container">
        {/* Legacy anchor (ADR-011): the corridor summary lived here. */}
        <div id="corridor" className={styles.anchor} aria-hidden="true" />
        <SectionIntro
          number={number}
          eyebrow={ecosystem.nodes.eyebrow}
          title={ecosystem.nodes.title}
          lead={ecosystem.nodes.lead}
          sectionLabel={sectionLabel}
        />
        <RedSeaNodeMap
          nodes={ecosystem.nodes}
          states={ecosystem.states}
          statusLabel={ecosystem.platforms.statusLabel}
          evidenceLabel={ecosystem.platforms.evidenceLabel}
          platformNames={platformNames}
        />
      </div>
    </section>
  );
}
