import Link from "next/link";
import Image from "next/image";
import type { ExperienceContent, Locale, SiteContent } from "@/content/types";
import {
  RECEPTION_EMAIL,
  RECEPTION_PHONE_DISPLAY,
  RECEPTION_TEL_HREF,
} from "@/lib/reception";
import Reveal from "@/components/motion/Reveal";
import styles from "./HomeSummaries.module.css";

/**
 * Phase 1 condensed homepage sections. Each block keeps the legacy anchor
 * id of the detailed section it replaced, and links to the dedicated
 * route that now carries the full content (Phase 4).
 */

interface CommonProps {
  locale: Locale;
  experience: ExperienceContent;
  site: SiteContent;
}

function MoreLink({
  locale,
  href,
  label,
  tone = "dark",
}: {
  locale: Locale;
  href: string;
  label: string;
  tone?: "dark" | "light";
}) {
  return (
    <Link
      className={tone === "dark" ? styles.moreDark : styles.moreLight}
      href={`/${locale}${href}`}
    >
      {label}
      <span aria-hidden="true" className={styles.moreArrow}>
        →
      </span>
    </Link>
  );
}

/** 04 — value proposition summary (legacy anchors: #why, #morocco, #sudan). */
export function ValueSummary({ locale, experience, site }: CommonProps) {
  const value = experience.summaries.value;
  return (
    <section id="why" className={styles.valueSection}>
      <div className="container">
        <Reveal>
          <h2 className={styles.valueTitle}>{value.title}</h2>
          <p className={styles.valueLead}>{value.text}</p>
          <MoreLink locale={locale} href="/gateway" label={value.linkLabel} />
        </Reveal>
        <div className={styles.valueGrid}>
          <Reveal as="article" className={styles.valueCard}>
            <div id="morocco" className={styles.anchor} aria-hidden="true" />
            <h3 className={styles.valueCardTitle}>{value.morocco.title}</h3>
            <p className={styles.valueCardText}>{value.morocco.text}</p>
            <ul className={styles.pillarList}>
              {site.morocco.pillars.slice(0, 6).map((pillar) => (
                <li key={pillar.title}>{pillar.title}</li>
              ))}
            </ul>
            <MoreLink
              locale={locale}
              href="/morocco"
              label={value.morocco.linkLabel}
            />
          </Reveal>
          <Reveal as="article" delay={100} className={styles.valueCard}>
            <div id="sudan" className={styles.anchor} aria-hidden="true" />
            <h3 className={styles.valueCardTitle}>{value.sudan.title}</h3>
            <p className={styles.valueCardText}>{value.sudan.text}</p>
            <p className={styles.equation}>
              {site.sudan.equationParts.join(" + ")} ={" "}
              <strong>{site.sudan.equationResult}</strong>
            </p>
            <MoreLink
              locale={locale}
              href="/sudan"
              label={value.sudan.linkLabel}
            />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/** 05 — operating journey summary (legacy anchor: #operating). */
export function JourneySummary({ locale, experience, site }: CommonProps) {
  const journey = experience.summaries.journey;
  const steps = site.operating.steps.slice(0, journey.stepsShown);
  return (
    <section id="operating" className={styles.journeySection}>
      <div className="container">
        <Reveal>
          <h2 className={styles.blockTitle}>{journey.title}</h2>
          <p className={styles.blockLead}>{journey.text}</p>
        </Reveal>
        <ol className={styles.journeySteps}>
          {steps.map((step, index) => (
            <Reveal as="li" key={step.title} delay={index * 60} className={styles.journeyStep}>
              <span className={styles.journeyIndex} aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className={styles.journeyLabel}>{step.title}</span>
            </Reveal>
          ))}
        </ol>
        <MoreLink locale={locale} href="/gateway" label={journey.linkLabel} />
      </div>
    </section>
  );
}

/** 06 — chains + corridor summaries (legacy anchors: #chains, #corridor). */
export function ChainsCorridorSummary({ locale, experience, site }: CommonProps) {
  const chains = experience.summaries.chains;
  const corridor = experience.summaries.corridor;
  return (
    <section id="chains" className={styles.chainsSection}>
      <div className={`container ${styles.chainsGrid}`}>
        <Reveal className={styles.chainsBlock}>
          <h2 className={styles.blockTitleLight}>{chains.title}</h2>
          <ul className={styles.chainList}>
            {site.chains.chains.map((chain, index) => (
              <li key={chain.name} className={styles.chainItem}>
                <span className={styles.chainIndex} aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                {chain.name}
              </li>
            ))}
          </ul>
          <MoreLink
            locale={locale}
            href="/value-chains"
            label={chains.linkLabel}
            tone="light"
          />
        </Reveal>
        <Reveal delay={100} className={styles.corridorBlock}>
          <div id="corridor" className={styles.anchor} aria-hidden="true" />
          <h2 className={styles.blockTitleLight}>{corridor.title}</h2>
          <p className={styles.blockLeadLight}>{corridor.text}</p>
          <p className={styles.corridorScope} dir="auto">
            {site.hero.scopeNodes.join(" — ")}
          </p>
          <MoreLink
            locale={locale}
            href="/corridor"
            label={corridor.linkLabel}
            tone="light"
          />
        </Reveal>
      </div>
    </section>
  );
}

/** 07 — Forum summary (legacy anchor: #forum). */
export function ForumSummary({ locale, experience, site }: CommonProps) {
  const forum = experience.summaries.forum;
  return (
    <section id="forum" className={styles.forumSection}>
      <div className={`container ${styles.forumGrid}`}>
        <Reveal as="figure" className={styles.forumPoster}>
          <Image
            src="/images/forum/forum-poster-portrait.webp"
            alt={site.forum.posterAlt}
            width={1055}
            height={1491}
            loading="lazy"
            className={styles.forumImage}
          />
          <figcaption className={styles.forumLabel}>
            {site.forum.posterLabel}
          </figcaption>
        </Reveal>
        <Reveal delay={80}>
          <h2 className={styles.blockTitle}>{forum.title}</h2>
          <p className={styles.blockLead}>{forum.text}</p>
          <dl className={styles.forumFacts}>
            {site.forum.facts.slice(0, 2).map((fact) => (
              <div key={fact.title} className={styles.forumFact}>
                <dt>{fact.title}</dt>
                <dd>{fact.text}</dd>
              </div>
            ))}
          </dl>
          <MoreLink locale={locale} href="/forum" label={forum.linkLabel} />
        </Reveal>
      </div>
    </section>
  );
}

/** 08 — trust summary + about strip (legacy anchors: #trust, #about). */
export function TrustAboutSummary({ locale, experience, site }: CommonProps) {
  const trust = experience.summaries.trust;
  const about = experience.summaries.about;
  return (
    <section id="trust" className={styles.trustSection}>
      <div className={`container ${styles.trustGrid}`}>
        <Reveal>
          <h2 className={styles.blockTitle}>{trust.title}</h2>
          <blockquote className={styles.trustQuote}>
            <p>{site.trust.quote}</p>
          </blockquote>
          <ul className={styles.principleChips}>
            {site.trust.principles.map((principle) => (
              <li key={principle.title} className={styles.principleChip}>
                {principle.title}
              </li>
            ))}
          </ul>
          <MoreLink locale={locale} href="/trust" label={trust.linkLabel} />
        </Reveal>
        <Reveal delay={100} className={styles.aboutBlock}>
          <div id="about" className={styles.anchor} aria-hidden="true" />
          <h2 className={styles.blockTitle}>{about.title}</h2>
          <p className={styles.blockLead}>{about.text}</p>
          <MoreLink locale={locale} href="/about-akanil" label={about.linkLabel} />
        </Reveal>
      </div>
    </section>
  );
}

/** 09 — institutional reception call (legacy anchor: #contact). */
export function ReceptionCta({ locale, experience }: Omit<CommonProps, "site">) {
  const cta = experience.receptionCta;
  return (
    <section id="contact" className={styles.receptionSection}>
      <div className={`container ${styles.receptionInner}`}>
        <Reveal>
          <p className={styles.receptionEyebrow}>{cta.eyebrow}</p>
          <h2 className={styles.receptionTitle}>{cta.title}</h2>
          <p className={styles.receptionText}>{cta.text}</p>
          <p className={styles.reviewNote}>{cta.reviewNote}</p>
        </Reveal>
        <Reveal delay={100} className={styles.receptionPanel}>
          <Link className={styles.receptionButton} href={`/${locale}/reception`}>
            {cta.openLabel}
          </Link>
          <dl className={styles.channels}>
            <div className={styles.channel}>
              <dt>{cta.emailLabel}</dt>
              <dd>
                <a className="latin-run" href={`mailto:${RECEPTION_EMAIL}`}>
                  {RECEPTION_EMAIL}
                </a>
              </dd>
            </div>
            <div className={styles.channel}>
              <dt>{cta.phoneLabel}</dt>
              <dd>
                <a className="latin-run" href={RECEPTION_TEL_HREF} dir="ltr">
                  {RECEPTION_PHONE_DISPLAY}
                </a>
              </dd>
            </div>
          </dl>
        </Reveal>
      </div>
    </section>
  );
}
