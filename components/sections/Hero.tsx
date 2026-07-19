import Image from "next/image";
import Link from "next/link";
import type { Locale, SiteContent } from "@/content/types";
import type { EcosystemContent } from "@/content/ecosystem-types";
import styles from "./Hero.module.css";

interface HeroProps {
  hero: EcosystemContent["hero"];
  scope: Pick<SiteContent["hero"], "scopeLabel" | "scopeNodes">;
  locale: Locale;
}

/**
 * 01 — ecosystem promise (P0, ADR-012). Answers what / where / value /
 * next step within the first viewport. One visual priority: the primary
 * CTA scrolls to the audience entry matrix; portfolio and reception are
 * subordinate actions.
 */
export default function Hero({ hero, scope, locale }: HeroProps) {
  return (
    <section id="top" className={styles.hero}>
      <div className={`container ${styles.grid}`}>
        <div className={styles.copy}>
          <p className={styles.eyebrow}>{hero.eyebrow}</p>
          <h1 className={styles.title}>
            {hero.titleLines.map((line) => (
              <span
                key={line.text}
                className={line.emphasis ? styles.titleEmphasis : styles.titleLine}
              >
                {line.text}
              </span>
            ))}
          </h1>
          <p className={styles.lead}>{hero.lead}</p>

          <div className={styles.actions}>
            <a
              className={styles.primaryCta}
              href="#entry"
              title={hero.primary.explanation}
            >
              {hero.primary.label}
            </a>
            <Link
              className={styles.secondaryCta}
              href={`/${locale}/portfolio`}
              title={hero.secondary.explanation}
            >
              {hero.secondary.label}
            </Link>
          </div>
          <p className={styles.institutionalLine}>
            <Link
              className={styles.institutionalCta}
              href={`/${locale}/reception`}
              title={hero.institutional.explanation}
            >
              {hero.institutional.label}
              <span aria-hidden="true"> →</span>
            </Link>
          </p>
        </div>

        <figure className={styles.visual}>
          <div className={styles.portalFrame}>
            <Image
              src="/images/hero/hero-abstract-flow.webp"
              alt=""
              width={1672}
              height={941}
              priority
              className={styles.portalImage}
            />
            <div className={styles.portalVeil} aria-hidden="true" />
          </div>
          <figcaption className={styles.scope}>
            <span className={styles.scopeLabel}>{scope.scopeLabel}</span>
            <span className={styles.scopeNodes} dir="auto">
              {scope.scopeNodes.map((node, index) => (
                <span key={node} className={styles.scopeNode}>
                  {index > 0 ? (
                    <span aria-hidden="true" className={styles.scopeLink} />
                  ) : null}
                  {node}
                </span>
              ))}
            </span>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
