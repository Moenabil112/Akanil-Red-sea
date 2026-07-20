import Link from "next/link";
import { getExperience, getForum } from "@/lib/content";
import { forumMetadata, resolveLocale } from "@/lib/page-meta";
import SiteChrome from "@/components/layout/SiteChrome";
import PageHero from "@/components/layout/PageHero";
import PageReceptionBand from "@/components/layout/PageReceptionBand";
import ForumNav from "@/components/forum/ForumNav";
import styles from "@/components/forum/forum-page.module.css";

export const generateMetadata = forumMetadata("prepare", "forum/prepare");

/**
 * /[lang]/forum/prepare — a preparation and qualification guide (P3 §12).
 * A checklist only: no file upload, no document transmitted through the
 * website. Ends with the Forum qualification CTA.
 */
export default async function ForumPreparePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale = resolveLocale(lang);
  const forum = getForum(locale);
  const experience = getExperience(locale);
  const qualHref = `/${locale}/reception?type=forum-qualification`;

  return (
    <SiteChrome locale={locale}>
      <PageHero
        eyebrow={forum.prepare.eyebrow}
        heading={forum.prepare.title}
        lead={forum.prepare.lead}
      />
      <ForumNav
        locale={locale}
        label={forum.navLabel}
        items={forum.nav}
        activeHref="/forum/prepare"
      />

      <div className={styles.page}>
        {/* What to prepare */}
        <section className={styles.section}>
          <div className="container">
            <h2 className={styles.sectionTitle}>{forum.prepare.stepsTitle}</h2>
            <ol className={styles.steps}>
              {forum.prepare.steps.map((step, index) => (
                <li key={step.title} className={styles.step}>
                  <span className={styles.stepIndex} aria-hidden="true">
                    {index + 1}
                  </span>
                  <div>
                    <h3 className={styles.stepTitle}>{step.title}</h3>
                    <p className={styles.stepText}>{step.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Evidence that may be relevant */}
        <section className={styles.section}>
          <div className="container">
            <h2 className={styles.sectionTitle}>{forum.prepare.evidenceTitle}</h2>
            <p className={styles.lead}>{forum.prepare.evidenceLead}</p>
            <ul className={styles.checkItems}>
              {forum.prepare.evidenceItems.map((item) => (
                <li key={item} className={styles.checkItem}>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Claims and confidentiality */}
        <section className={styles.section}>
          <div className="container">
            <h2 className={styles.sectionTitle}>{forum.prepare.privacyTitle}</h2>
            <ul className={styles.privacyItems}>
              {forum.prepare.privacy.map((item) => (
                <li key={item} className={styles.privacyItem}>
                  {item}
                </li>
              ))}
            </ul>
            <div className={styles.ctaBand}>
              <Link className={styles.ctaButton} href={qualHref}>
                {forum.prepare.ctaLabel}
              </Link>
            </div>
          </div>
        </section>
      </div>

      <PageReceptionBand
        locale={locale}
        experience={experience}
        requestType="forum-qualification"
      />
    </SiteChrome>
  );
}
