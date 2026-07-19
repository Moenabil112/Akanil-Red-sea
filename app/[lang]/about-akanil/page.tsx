import { getContent, getEcosystem, getExperience } from "@/lib/content";
import { pageMetadata, resolveLocale } from "@/lib/page-meta";
import SiteChrome from "@/components/layout/SiteChrome";
import PageHero from "@/components/layout/PageHero";
import PageReceptionBand from "@/components/layout/PageReceptionBand";
import About from "@/components/sections/About";
import styles from "./about.module.css";

export const generateMetadata = pageMetadata("about-akanil");

/**
 * /about-akanil — Akanil identity: the institutional facts (Moroccan
 * establishment, registered Sudan branch, regional representation via
 * agents), then the founder bridge narrative (P0 §23). Membership claims
 * remain withheld pending evidence (see P0-MISSING-INPUTS-REGISTER); no
 * former alias is used, and representatives are described as agents, not
 * legal branches.
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
  const institution = ecosystem.institution;
  return (
    <SiteChrome locale={locale}>
      <PageHero
        eyebrow={site.about.eyebrow}
        heading={site.about.title}
        lead={site.about.paragraphs[0]}
      />
      <About about={site.about} sectionLabel={site.ui.sectionLabel} number="01" />
      <section className={styles.institution} aria-label={institution.heading}>
        <div className="container">
          <p className={styles.institutionEyebrow}>{institution.eyebrow}</p>
          <h2 className={styles.institutionHeading}>{institution.heading}</h2>
          <p className={styles.institutionLead}>{institution.lead}</p>
          <div className={styles.institutionGrid}>
            <dl className={styles.facts}>
              {institution.facts.map((fact) => (
                <div key={fact.label} className={styles.fact}>
                  <dt className={styles.factLabel}>{fact.label}</dt>
                  <dd className={styles.factValue}>{fact.value}</dd>
                </div>
              ))}
            </dl>
            <div className={styles.network}>
              <h3 className={styles.networkTitle}>{institution.networkTitle}</h3>
              <ul className={styles.representatives}>
                {institution.representatives.map((country) => (
                  <li key={country} className={styles.representative}>
                    {country}
                  </li>
                ))}
              </ul>
              <p className={styles.networkNote}>{institution.networkNote}</p>
            </div>
          </div>
        </div>
      </section>
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
