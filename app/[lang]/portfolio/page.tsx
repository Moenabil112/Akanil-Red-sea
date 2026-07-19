import { getEcosystem, getExperience } from "@/lib/content";
import { pageMetadata, resolveLocale } from "@/lib/page-meta";
import type { AudienceId } from "@/content/ecosystem-types";
import SiteChrome from "@/components/layout/SiteChrome";
import PageHero from "@/components/layout/PageHero";
import PageReceptionBand from "@/components/layout/PageReceptionBand";
import PortfolioPlatformGrid from "@/components/portfolio/PortfolioPlatformGrid";
import ClaimsBoundaryNotice from "@/components/ui/ClaimsBoundaryNotice";
import SpecialistReviewPanel from "@/components/review/SpecialistReviewPanel";
import styles from "./portfolio.module.css";

export const generateMetadata = pageMetadata("portfolio");

/**
 * /portfolio — the four platforms operated, developed or structured
 * within the ecosystem (P0 §6, §26, ADR-013). Statically generated in
 * all locales; every card carries public status, evidence state and a
 * controlled CTA. IBRIZ/GAAS carries the mandatory regulatory note.
 */
export default async function PortfolioPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale = resolveLocale(lang);
  const experience = getExperience(locale);
  const ecosystem = getEcosystem(locale);

  const audienceNames = Object.fromEntries(
    ecosystem.audiences.paths.map((path) => [path.id, path.title]),
  ) as Record<AudienceId, string>;

  return (
    <SiteChrome locale={locale}>
      <PageHero
        eyebrow={ecosystem.platforms.eyebrow}
        heading={ecosystem.portfolioPage.heading}
        lead={ecosystem.portfolioPage.lead}
      />
      <section
        className={styles.section}
        aria-label={ecosystem.portfolioPage.heading}
      >
        <div className="container">
          <PortfolioPlatformGrid
            locale={locale}
            platforms={ecosystem.platforms}
            states={ecosystem.states}
            audienceNames={audienceNames}
          />
          <div className={styles.reviewPanel}>
            <SpecialistReviewPanel content={ecosystem.reviewPanel} />
          </div>
          <div className={styles.claims}>
            <ClaimsBoundaryNotice claims={ecosystem.claims} />
          </div>
        </div>
      </section>
      <PageReceptionBand
        locale={locale}
        experience={experience}
        requestType="technology-data-partnership"
      />
    </SiteChrome>
  );
}
