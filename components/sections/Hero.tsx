import Image from "next/image";
import Link from "next/link";
import type { Locale, SiteContent } from "@/content/types";
import styles from "./Hero.module.css";

interface HeroProps {
  hero: SiteContent["hero"];
  locale: Locale;
}

export default function Hero({ hero, locale }: HeroProps) {
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
            <Link
              className={styles.primaryCta}
              href={`/${locale}/reception`}
              title={hero.primary.explanation}
            >
              {hero.primary.label}
            </Link>
            <a
              className={styles.secondaryCta}
              href="#entry"
              title={hero.secondary.explanation}
            >
              {hero.secondary.label}
            </a>
          </div>

          <p className={styles.motto}>{hero.motto}</p>
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
            <span className={styles.scopeLabel}>{hero.scopeLabel}</span>
            <span className={styles.scopeNodes} dir="auto">
              {hero.scopeNodes.map((node, index) => (
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

      <div className={`container ${styles.pillars}`}>
        {hero.pillars.map((pillar) => (
          <div key={pillar.title} className={styles.pillar}>
            <h2 className={styles.pillarTitle}>{pillar.title}</h2>
            <p className={styles.pillarText}>{pillar.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
