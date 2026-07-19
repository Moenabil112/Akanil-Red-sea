import { getContent, getEcosystem, getExperience } from "@/lib/content";
import { pageMetadata, resolveLocale } from "@/lib/page-meta";
import SiteChrome from "@/components/layout/SiteChrome";
import PageHero from "@/components/layout/PageHero";
import PageReceptionBand from "@/components/layout/PageReceptionBand";
import About from "@/components/sections/About";
import styles from "./about.module.css";

export const generateMetadata = pageMetadata("about-akanil");

/**
 * /about-akanil — Akanil identity plus the founder bridge narrative
 * (P0 §23): experience spanning the Moroccan and Sudanese export
 * ecosystems. Specific membership claims are withheld pending evidence
 * (see P0-MISSING-INPUTS-REGISTER) and no former alias is used.
 */
export default async function AboutPage({
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
        eyebrow={site.about.eyebrow}
        heading={site.about.title}
        lead={site.about.paragraphs[0]}
      />
      <About about={site.about} sectionLabel={site.ui.sectionLabel} number="01" />
      <section
        className={styles.bridge}
        aria-label={ecosystem.founder.bridgeTitle}
      >
        <div className="container">
          <h2 className={styles.bridgeTitle}>
            {ecosystem.founder.bridgeTitle}
          </h2>
          <p className={styles.bridgeName}>{ecosystem.founder.name}</p>
          <p className={styles.bridgeText}>{ecosystem.founder.bridgeText}</p>
        </div>
      </section>
      <PageReceptionBand locale={locale} experience={experience} />
    </SiteChrome>
  );
}
