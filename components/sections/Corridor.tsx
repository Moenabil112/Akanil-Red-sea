import type { SiteContent } from "@/content/types";
import SectionIntro from "@/components/ui/SectionIntro";
import CorridorMap from "@/components/maps/CorridorMap";
import styles from "./Corridor.module.css";

interface CorridorProps {
  corridor: SiteContent["corridor"];
  sectionLabel: string;
}

export default function Corridor({ corridor, sectionLabel }: CorridorProps) {
  return (
    <section id="corridor" className={styles.section}>
      <div className="container">
        <SectionIntro
          number="06"
          eyebrow={corridor.eyebrow}
          title={corridor.title}
          lead={corridor.lead}
          sectionLabel={sectionLabel}
        />
        <CorridorMap corridor={corridor} />
      </div>
    </section>
  );
}
