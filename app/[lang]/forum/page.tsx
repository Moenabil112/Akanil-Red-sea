import Link from "next/link";
import { getExperience, getForum } from "@/lib/content";
import { forumMetadata, resolveLocale } from "@/lib/page-meta";
import SiteChrome from "@/components/layout/SiteChrome";
import PageHero from "@/components/layout/PageHero";
import PageReceptionBand from "@/components/layout/PageReceptionBand";
import ForumNav from "@/components/forum/ForumNav";
import ProgrammeTimeline from "@/components/forum/ProgrammeTimeline";
import styles from "@/components/forum/forum-page.module.css";

export const generateMetadata = forumMetadata("hub", "forum");

/**
 * /[lang]/forum — the deepened Forum Hub (P3 §6). Identity and positioning,
 * relationship to the permanent Gateway, why qualification precedes
 * participation, the before/during/after model, participation-path and
 * sector-track overviews, a five-day programme summary, meeting logic,
 * expected outcomes, the qualification notice and the qualification CTA.
 */
export default async function ForumHubPage({
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
        eyebrow={forum.hub.eyebrow}
        heading={forum.programmeName}
        lead={forum.hub.lead}
      />
      <ForumNav
        locale={locale}
        label={forum.navLabel}
        items={forum.nav}
        activeHref="/forum"
      />

      <div className={styles.page}>
        {/* Identity and positioning */}
        <section className={styles.section}>
          <div className="container">
            <p className={styles.statusPill}>{forum.publicStatus}</p>
            <p className={styles.prose}>{forum.positioningLead}</p>
          </div>
        </section>

        {/* Gateway relation + qualification-first */}
        <section className={styles.section}>
          <div className="container">
            <div className={styles.relationGrid}>
              <div className={styles.relationCard}>
                <h2 className={styles.relationTitle}>
                  {forum.gatewayRelationTitle}
                </h2>
                <p className={styles.relationText}>{forum.gatewayRelation}</p>
              </div>
              <div className={styles.relationCard}>
                <h2 className={styles.relationTitle}>
                  {forum.qualificationFirstTitle}
                </h2>
                <p className={styles.relationText}>{forum.qualificationFirst}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Before / during / after */}
        <section className={styles.section}>
          <div className="container">
            <h2 className={styles.sectionTitle}>
              {forum.hub.beforeDuringAfterTitle}
            </h2>
            <div className={styles.phases}>
              {forum.hub.phases.map((phase) => (
                <article key={phase.title} className={styles.phase}>
                  <h3 className={styles.phaseTitle}>{phase.title}</h3>
                  <ul className={styles.phaseItems}>
                    {phase.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Participation overview */}
        <section className={styles.section}>
          <div className="container">
            <p className={styles.eyebrow}>{forum.participation.eyebrow}</p>
            <h2 className={styles.sectionTitle}>
              {forum.hub.participationOverviewTitle}
            </h2>
            <p className={styles.lead}>
              {forum.hub.participationOverviewLead}
            </p>
            <ul className={styles.overviewGrid}>
              {forum.participation.paths.map((path) => (
                <li key={path.id} className={styles.overviewCard}>
                  <h3 className={styles.overviewCardTitle}>
                    <Link
                      className={styles.overviewCardLink}
                      href={`/${locale}/forum/participation#path-${path.id}`}
                    >
                      {path.title}
                    </Link>
                  </h3>
                  <p className={styles.overviewCardText}>{path.summary}</p>
                </li>
              ))}
            </ul>
            <p className={styles.overviewMore}>
              <Link
                className={styles.textLink}
                href={`/${locale}/forum/participation`}
              >
                {forum.participation.title}
              </Link>
            </p>
          </div>
        </section>

        {/* Sector-track overview */}
        <section className={styles.section}>
          <div className="container">
            <p className={styles.eyebrow}>{forum.tracks.eyebrow}</p>
            <h2 className={styles.sectionTitle}>
              {forum.hub.tracksOverviewTitle}
            </h2>
            <p className={styles.lead}>{forum.hub.tracksOverviewLead}</p>
            <ul className={styles.overviewGrid}>
              {forum.tracks.items.map((track) => (
                <li key={track.id} className={styles.overviewCard}>
                  <h3 className={styles.overviewCardTitle}>
                    <Link
                      className={styles.overviewCardLink}
                      href={`/${locale}/forum/participation#track-${track.id}`}
                    >
                      {track.title}
                    </Link>
                  </h3>
                  <p className={styles.overviewCardText}>{track.summary}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Programme summary */}
        <section className={styles.section}>
          <div className="container">
            <p className={styles.eyebrow}>{forum.programme.eyebrow}</p>
            <h2 className={styles.sectionTitle}>
              {forum.hub.programmeSummaryTitle}
            </h2>
            <p className={styles.lead}>{forum.hub.programmeSummaryLead}</p>
            <div className={styles.overviewMore}>
              <ProgrammeTimeline programme={forum.programme} variant="summary" />
            </div>
            <p className={styles.overviewMore}>
              <Link
                className={styles.textLink}
                href={`/${locale}/forum/programme`}
              >
                {forum.programme.title}
              </Link>
            </p>
          </div>
        </section>

        {/* Meeting logic + expected outcomes */}
        <section className={styles.section}>
          <div className="container">
            <h2 className={styles.sectionTitle}>{forum.hub.meetingLogicTitle}</h2>
            <p className={styles.lead}>{forum.hub.meetingLogicLead}</p>
            <h3 className={`${styles.phaseTitle} ${styles.overviewMore}`}>
              {forum.hub.outcomeTitle}
            </h3>
            <p className={styles.prose}>{forum.hub.outcomeLead}</p>
            <ul className={styles.metrics}>
              {forum.outcomes.items.map((item) => (
                <li key={item.id} className={styles.metric}>
                  {item.label}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Forum metrics */}
        <section className={styles.section}>
          <div className="container">
            <p className={styles.eyebrow}>{forum.metrics.eyebrow}</p>
            <h2 className={styles.sectionTitle}>{forum.metrics.title}</h2>
            <p className={styles.lead}>{forum.metrics.lead}</p>
            <ul className={styles.metrics}>
              {forum.metrics.items.map((item) => (
                <li key={item} className={styles.metric}>
                  {item}
                </li>
              ))}
            </ul>
            <p className={styles.metricNote}>{forum.metrics.note}</p>
          </div>
        </section>

        {/* Qualification notice + CTA */}
        <section className={styles.section}>
          <div className="container">
            <h2 className={styles.sectionTitle}>
              {forum.hub.qualificationNoticeTitle}
            </h2>
            <div className={styles.notice}>
              <ul className={styles.noticeList}>
                {forum.hub.qualificationNotice.map((item) => (
                  <li key={item} className={styles.noticeItem}>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className={styles.ctaBand}>
              <Link className={styles.ctaButton} href={qualHref}>
                {forum.hub.ctaLabel}
              </Link>
              <Link
                className={styles.textLink}
                href={`/${locale}/forum/prepare`}
              >
                {forum.prepare.title}
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
