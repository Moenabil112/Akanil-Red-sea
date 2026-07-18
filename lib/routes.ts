import type { Locale, PageRoute } from "@/content/types";
import { locales, isLocale } from "./i18n";

/** Canonical content routes below /[lang] (Phase 4 architecture). */
export const pageRoutes: PageRoute[] = [
  "gateway",
  "morocco",
  "sudan",
  "corridor",
  "value-chains",
  "forum",
  "trust",
  "about-akanil",
  "reception",
];

export function localizedPath(locale: Locale, href: string): string {
  const clean = href.startsWith("/") ? href : `/${href}`;
  return clean === "/" ? `/${locale}` : `/${locale}${clean}`;
}

/**
 * Computes the equivalent path in another locale, preserving the current
 * route and hash: /fr/forum → /en/forum, /ar#chains → /fr#chains.
 * Unknown or missing locale segments fall back to the target root.
 */
export function switchLocalePath(currentPath: string, target: Locale): string {
  const [pathname, hash] = currentPath.split("#");
  const segments = (pathname ?? "/").split("/").filter(Boolean);
  const rest = segments.length > 0 && isLocale(segments[0]!)
    ? segments.slice(1)
    : segments;
  const suffix = rest.length > 0 ? `/${rest.join("/")}` : "";
  return `/${target}${suffix}${hash ? `#${hash}` : ""}`;
}

export { locales };
