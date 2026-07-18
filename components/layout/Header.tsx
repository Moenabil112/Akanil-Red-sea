"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ExperienceContent, Locale, SiteContent } from "@/content/types";
import { locales } from "@/lib/i18n";
import { localizedPath, switchLocalePath } from "@/lib/routes";
import styles from "./Header.module.css";

interface HeaderProps {
  locale: Locale;
  ui: SiteContent["ui"];
  experience: ExperienceContent;
}

export default function Header({ locale, ui, experience }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname() ?? `/${locale}`;
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

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

  /** Language switching preserves the current route and hash (Phase 4). */
  const onLanguageClick = (
    event: React.MouseEvent<HTMLAnchorElement>,
    target: Locale,
  ) => {
    event.preventDefault();
    const hash = window.location.hash.replace(/^#/, "");
    window.location.assign(
      switchLocalePath(`${pathname}${hash ? `#${hash}` : ""}`, target),
    );
  };

  const isActive = (href: string) =>
    pathname === localizedPath(locale, href) ||
    pathname.startsWith(`${localizedPath(locale, href)}/`);

  const languageLinks = (variant: "desktop" | "mobile") =>
    locales.map((l) => (
      <a
        key={l}
        href={switchLocalePath(pathname, l)}
        lang={l}
        hrefLang={l}
        aria-current={l === locale ? "page" : undefined}
        className={l === locale ? styles.langActive : styles.langLink}
        onClick={(event) => onLanguageClick(event, l)}
      >
        {variant === "desktop" ? l.toUpperCase() : ui.languageNames[l]}
      </a>
    ));

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ""}`}>
      <div className={`container ${styles.bar}`}>
        <Link href={`/${locale}`} className={styles.brand}>
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
        </Link>

        <nav
          id="site-nav"
          aria-label={ui.navLabel}
          className={`${styles.nav} ${open ? styles.navOpen : ""}`}
        >
          <ul className={styles.navList}>
            {experience.navGroups.map((item) => (
              <li key={item.href}>
                <Link
                  href={localizedPath(locale, item.href)}
                  className={styles.navLink}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  data-active={isActive(item.href) || undefined}
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <ul className={styles.navListSecondary}>
            {experience.footerNav
              .filter(
                (item) =>
                  !experience.navGroups.some((g) => g.href === item.href),
              )
              .map((item) => (
                <li key={item.href}>
                  <Link
                    href={localizedPath(locale, item.href)}
                    className={styles.navLinkSecondary}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    onClick={() => setOpen(false)}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
          </ul>
          <div className={styles.langMobile} aria-label={ui.languageLabel}>
            {languageLinks("mobile")}
          </div>
        </nav>

        <div className={styles.actions}>
          <nav aria-label={ui.languageLabel} className={styles.lang}>
            {languageLinks("desktop")}
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
