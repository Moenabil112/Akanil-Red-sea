"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { Locale, SiteContent } from "@/content/types";
import { locales } from "@/lib/i18n";
import styles from "./Header.module.css";

interface HeaderProps {
  locale: Locale;
  ui: SiteContent["ui"];
}

/** Returns the id of the section currently nearest the top of the viewport. */
function currentSectionAnchor(): string {
  const sections = document.querySelectorAll<HTMLElement>("main section[id]");
  let current = "";
  for (const section of sections) {
    if (section.getBoundingClientRect().top <= 120) current = section.id;
  }
  return current;
}

export default function Header({ locale, ui }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  /** Language switching preserves the section the reader is currently in. */
  const onLanguageClick = (
    event: React.MouseEvent<HTMLAnchorElement>,
    target: Locale,
  ) => {
    const anchor = currentSectionAnchor();
    if (anchor) {
      event.preventDefault();
      window.location.assign(`/${target}#${anchor}`);
    }
  };

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ""}`}>
      <div className={`container ${styles.bar}`}>
        <a href={`/${locale}#top`} className={styles.brand}>
          <Image
            src="/brand/akanil-emblem.png"
            alt=""
            width={44}
            height={44}
            className={styles.logo}
            priority
          />
          <span className={styles.brandText}>
            <strong className="latin-run">AKANIL</strong>
            <span>{ui.footer.tagline}</span>
          </span>
        </a>

        <nav
          id="site-nav"
          ref={navRef}
          aria-label={ui.navLabel}
          className={`${styles.nav} ${open ? styles.navOpen : ""}`}
        >
          <ul className={styles.navList}>
            {ui.nav.map((item) => (
              <li key={item.anchor}>
                <a
                  href={`#${item.anchor}`}
                  className={styles.navLink}
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <div className={styles.langMobile} aria-label={ui.languageLabel}>
            {locales.map((l) => (
              <a
                key={l}
                href={`/${l}`}
                lang={l}
                hrefLang={l}
                aria-current={l === locale ? "page" : undefined}
                className={l === locale ? styles.langActive : styles.langLink}
                onClick={(event) => onLanguageClick(event, l)}
              >
                {ui.languageNames[l]}
              </a>
            ))}
          </div>
        </nav>

        <div className={styles.actions}>
          <nav aria-label={ui.languageLabel} className={styles.lang}>
            {locales.map((l) => (
              <a
                key={l}
                href={`/${l}`}
                lang={l}
                hrefLang={l}
                aria-current={l === locale ? "page" : undefined}
                className={l === locale ? styles.langActive : styles.langLink}
                onClick={(event) => onLanguageClick(event, l)}
              >
                {l.toUpperCase()}
              </a>
            ))}
          </nav>
          <button
            ref={menuButtonRef}
            type="button"
            className={styles.menuButton}
            aria-expanded={open}
            aria-controls="site-nav"
            onClick={() => setOpen((value) => !value)}
          >
            <span className="visually-hidden">
              {open ? ui.menuClose : ui.menuOpen}
            </span>
            <span aria-hidden="true" className={styles.menuIcon} data-open={open} />
          </button>
        </div>
      </div>
    </header>
  );
}
