import { getContent, getEcosystem, getExperience } from "@/lib/content";
import { pageMetadata, resolveLocale } from "@/lib/page-meta";
import SiteChrome from "@/components/layout/SiteChrome";
import PageHero from "@/components/layout/PageHero";
import PageReceptionBand from "@/components/layout/PageReceptionBand";
import WhyRedSea from "@/components/sections/home/WhyRedSea";
import NodesSection from "@/components/sections/home/NodesSection";
import Corridor from "@/components/sections/Corridor";
import ClaimsBoundaryNotice from "@/components/ui/ClaimsBoundaryNotice";
import styles from "./corridor.module.css";

export const generateMetadata = pageMetadata("corridor");

/**
 * /corridor — the Red Sea supply-chain architecture (P0 §28): Why the
 * Red Sea, the node architecture with platform-to-node relationships,
 * scenario-based route design, and the evidence and verification rules.
 */
export default async function CorridorPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale = resolveLocale(lang);
  const site = getContent(locale);
  const experience = getExperience(locale);
  const ecosystem = getEcosystem(locale);
  return (
    <SiteChrome locale={locale}>
      <PageHero
        eyebrow={site.corridor.eyebrow}
        heading={ecosystem.corridorPage.heading}
        lead={ecosystem.corridorPage.lead}
      />
      <WhyRedSea
        locale={locale}
        content={ecosystem.whyRedSea}
        sectionLabel={site.ui.sectionLabel}
        number="01"
      />
      <NodesSection
        ecosystem={ecosystem}
        sectionLabel={site.ui.sectionLabel}
        number="02"
      />
      <Corridor
        corridor={site.corridor}
        sectionLabel={site.ui.sectionLabel}
        number="03"
      />
      <section className={styles.rules} aria-label={ecosystem.corridorPage.rulesTitle}>
        <div className="container">
          <h2 className={styles.rulesTitle}>
            {ecosystem.corridorPage.rulesTitle}
          </h2>
          <ul className={styles.rulesList}>
            {ecosystem.corridorPage.rules.map((rule) => (
              <li key={rule} className={styles.rule}>
                {rule}
              </li>
            ))}
          </ul>
          <div className={styles.claims}>
            <ClaimsBoundaryNotice claims={ecosystem.claims} />
          </div>
        </div>
      </section>
      <PageReceptionBand
        locale={locale}
        experience={experience}
        requestType="port-logistics-cooperation"
      />
    </SiteChrome>
  );
}
