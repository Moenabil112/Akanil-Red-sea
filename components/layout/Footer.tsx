import Image from "next/image";
import Link from "next/link";
import type { ExperienceContent, Locale, SiteContent } from "@/content/types";
import { localizedPath } from "@/lib/routes";
import {
  RECEPTION_EMAIL,
  RECEPTION_PHONE_DISPLAY,
  RECEPTION_TEL_HREF,
} from "@/lib/reception";
import styles from "./Footer.module.css";

interface FooterProps {
  locale: Locale;
  ui: SiteContent["ui"];
  experience: ExperienceContent;
}

export default function Footer({ locale, ui, experience }: FooterProps) {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.grid}`}>
        <div className={styles.brand}>
          <Image
            src="/brand/akanil-emblem.png"
            alt=""
            width={56}
            height={56}
            className={styles.logo}
          />
          <div>
            <strong className={styles.entity}>{ui.footer.entity}</strong>
            <span className={styles.tagline}>{ui.footer.tagline}</span>
          </div>
        </div>

        <nav aria-label={ui.navLabel} className={styles.nav}>
          <ul className={styles.navList}>
            {experience.footerNav.map((item) => (
              <li key={item.href}>
                <Link
                  className={styles.navLink}
                  href={localizedPath(locale, item.href)}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.meta}>
          <ol className={styles.hierarchy}>
            {ui.footer.hierarchy.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ol>
          <p className={styles.channels}>
            <a className="latin-run" href={`mailto:${RECEPTION_EMAIL}`}>
              {RECEPTION_EMAIL}
            </a>
            <span aria-hidden="true"> · </span>
            <a className="latin-run" dir="ltr" href={RECEPTION_TEL_HREF}>
              {RECEPTION_PHONE_DISPLAY}
            </a>
          </p>
        </div>

        <p className={styles.note}>{ui.footer.note}</p>
      </div>
    </footer>
  );
}
