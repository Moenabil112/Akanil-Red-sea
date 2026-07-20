import Link from "next/link";
import type { Locale } from "@/content/types";
import styles from "./ForumNav.module.css";

interface ForumNavProps {
  locale: Locale;
  label: string;
  items: { href: string; label: string }[];
  /** The non-localized href of the current Forum route (e.g. "/forum"). */
  activeHref: string;
}

/**
 * Contextual secondary navigation within the Forum experience (P3 §5).
 * The four Forum routes are not added to the primary header; this nav
 * lives inside the Forum pages. Server-rendered, keyboard-accessible, and
 * the current route is marked with aria-current — not by colour alone.
 */
export default function ForumNav({
  locale,
  label,
  items,
  activeHref,
}: ForumNavProps) {
  return (
    <nav className={styles.nav} aria-label={label}>
      <div className={`container ${styles.inner}`}>
        <ul className={styles.list}>
          {items.map((item) => {
            const active = item.href === activeHref;
            return (
              <li key={item.href}>
                <Link
                  href={`/${locale}${item.href}`}
                  className={active ? styles.linkActive : styles.link}
                  aria-current={active ? "page" : undefined}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
