import Link from "next/link";
import type { Locale } from "@/content/types";
import type { AudienceId, EcosystemContent } from "@/content/ecosystem-types";
import SectionIntro from "@/components/ui/SectionIntro";
import Reveal from "@/components/motion/Reveal";
import PortfolioPlatformGrid from "@/components/portfolio/PortfolioPlatformGrid";
import styles from "./PortfolioSection.module.css";

interface PortfolioSectionProps {
  locale: Locale;
  ecosystem: EcosystemContent;
  sectionLabel: string;
  number?: string;
}

/** 05 — portfolio platforms on the homepage, linking to the full route. */
export default function PortfolioSection({
  locale,
  ecosystem,
  sectionLabel,
  number = "05",
}: PortfolioSectionProps) {
  const audienceNames = Object.fromEntries(
    ecosystem.audiences.paths.map((path) => [path.id, path.title]),
  ) as Record<AudienceId, string>;

  return (
    <section id="platforms" className={styles.section}>
      <div className="container">
        <SectionIntro
          number={number}
          eyebrow={ecosystem.platforms.eyebrow}
          title={ecosystem.platforms.title}
          lead={ecosystem.platforms.lead}
          tone="light"
          sectionLabel={sectionLabel}
        />
        <PortfolioPlatformGrid
          locale={locale}
          platforms={ecosystem.platforms}
          states={ecosystem.states}
          audienceNames={audienceNames}
        />
        <Reveal className={styles.moreRow}>
          <Link className={styles.more} href={`/${locale}/portfolio`}>
            {ecosystem.ui.footerPortfolio}
            <span aria-hidden="true"> →</span>
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
