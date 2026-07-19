import { Suspense } from "react";
import { getEcosystem, getReception } from "@/lib/content";
import { pageMetadata, resolveLocale } from "@/lib/page-meta";
import {
  RECEPTION_EMAIL,
  RECEPTION_PHONE_DISPLAY,
  RECEPTION_TEL_HREF,
} from "@/lib/reception";
import SiteChrome from "@/components/layout/SiteChrome";
import PageHero from "@/components/layout/PageHero";
import ReceptionDesk from "@/components/reception/ReceptionDesk";
import styles from "./reception.module.css";

export const generateMetadata = pageMetadata("reception");

export default async function ReceptionPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale = resolveLocale(lang);
  const reception = getReception(locale);
  const ecosystem = getEcosystem(locale);

  return (
    <SiteChrome locale={locale}>
      <PageHero
        eyebrow={reception.eyebrow}
        heading={reception.heading}
        lead={reception.lead}
      />

      <div className={styles.page}>
        <div className={`container ${styles.grid}`}>
          <aside className={styles.side}>
            {/* Direct channels stay server-rendered: the no-JS fallback. */}
            <section
              aria-label={reception.channelsTitle}
              className={styles.channelsPanel}
            >
              <h2 className={styles.sideTitle}>{reception.channelsTitle}</h2>
              <dl className={styles.channelList}>
                <div className={styles.channel}>
                  <dt>{reception.emailChannelLabel}</dt>
                  <dd>
                    <a className="latin-run" href={`mailto:${RECEPTION_EMAIL}`}>
                      {RECEPTION_EMAIL}
                    </a>
                  </dd>
                </div>
                <div className={styles.channel}>
                  <dt>{reception.phoneChannelLabel}</dt>
                  <dd>
                    <a className="latin-run" dir="ltr" href={RECEPTION_TEL_HREF}>
                      {RECEPTION_PHONE_DISPLAY}
                    </a>
                  </dd>
                </div>
              </dl>
              <p className={styles.phoneNote}>{reception.phoneNote}</p>
              <noscript>
                <p className={styles.noJs}>{reception.noJsNote}</p>
              </noscript>
            </section>

            <section
              aria-label={reception.privacy.title}
              className={styles.privacyPanel}
            >
              <h2 className={styles.sideTitle}>{reception.privacy.title}</h2>
              <ul className={styles.privacyList}>
                {reception.privacy.points.map((point) => (
                  <li key={point} className={styles.privacyPoint}>
                    {point}
                  </li>
                ))}
              </ul>
            </section>
          </aside>

          <div className={styles.desk}>
            <Suspense fallback={null}>
              <ReceptionDesk
                locale={locale}
                reception={reception}
                ecosystem={ecosystem}
              />
            </Suspense>
          </div>
        </div>
      </div>
    </SiteChrome>
  );
}
