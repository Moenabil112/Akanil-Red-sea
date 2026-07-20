import { getExperience, getForum } from "@/lib/content";
import { forumMetadata, resolveLocale } from "@/lib/page-meta";
import SiteChrome from "@/components/layout/SiteChrome";
import PageHero from "@/components/layout/PageHero";
import PageReceptionBand from "@/components/layout/PageReceptionBand";
import ForumNav from "@/components/forum/ForumNav";
import ProgrammeTimeline from "@/components/forum/ProgrammeTimeline";
import MeetingPreparation from "@/components/forum/MeetingPreparation";
import OutcomeCategories from "@/components/forum/OutcomeCategories";
import styles from "@/components/forum/forum-page.module.css";

export const generateMetadata = forumMetadata("programme", "forum/programme");

/**
 * /[lang]/forum/programme — the five-day proposed programme (P3 §9), the
 * reusable meeting-preparation model (§10) and the expected-outcome model
 * (§11). Everything is proposed and subject to final confirmation; no
 * date, venue, participant or visit is confirmed.
 */
export default async function ForumProgrammePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale = resolveLocale(lang);
  const forum = getForum(locale);
  const experience = getExperience(locale);

  return (
    <SiteChrome locale={locale}>
      <PageHero
        eyebrow={forum.programme.eyebrow}
        heading={forum.programme.title}
        lead={forum.programme.lead}
      />
      <ForumNav
        locale={locale}
        label={forum.navLabel}
        items={forum.nav}
        activeHref="/forum/programme"
      />

      <div className={styles.page}>
        <section className={styles.section}>
          <div className="container">
            <p className={styles.statusPill}>{forum.programme.statusNote}</p>
            <div className={styles.overviewMore}>
              <ProgrammeTimeline
                programme={forum.programme}
                variant="full"
                as="h2"
              />
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <div className="container">
            <MeetingPreparation content={forum.meeting} as="h2" />
          </div>
        </section>

        <section className={styles.section}>
          <div className="container">
            <OutcomeCategories content={forum.outcomes} as="h2" />
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
