import type { Locale } from "@/content/types";
import type { AudienceId, EcosystemContent } from "@/content/ecosystem-types";
import Reveal from "@/components/motion/Reveal";
import PortfolioPlatformCard from "./PortfolioPlatformCard";
import styles from "./Portfolio.module.css";

interface PortfolioPlatformGridProps {
  locale: Locale;
  platforms: EcosystemContent["platforms"];
  states: EcosystemContent["states"];
  audienceNames: Record<AudienceId, string>;
}

/** The four portfolio platforms (ADR-013), rendered as full claim-controlled cards. */
export default function PortfolioPlatformGrid({
  locale,
  platforms,
  states,
  audienceNames,
}: PortfolioPlatformGridProps) {
  const { items, ...labels } = platforms;
  return (
    <div className={styles.grid}>
      {items.map((platform, index) => (
        <Reveal key={platform.id} delay={index * 60}>
          <PortfolioPlatformCard
            locale={locale}
            platform={platform}
            labels={labels}
            states={states}
            audienceNames={audienceNames}
          />
        </Reveal>
      ))}
    </div>
  );
}
