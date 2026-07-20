import type { Metadata } from "next";
import type { Locale, PageRoute } from "@/content/types";
import type { ForumContent } from "@/content/forum-types";
import { defaultLocale, isLocale } from "./i18n";
import { getExperience, getForum } from "./content";

/**
 * Localized metadata factory for the Phase 4 content routes.
 * Canonicals and language alternates stay relative; metadataBase is set
 * once in the root layout from NEXT_PUBLIC_SITE_URL when configured.
 */
export function pageMetadata(route: PageRoute) {
  return async function generateMetadata({
    params,
  }: {
    params: Promise<{ lang: string }>;
  }): Promise<Metadata> {
    const { lang } = await params;
    const locale: Locale = isLocale(lang) ? lang : defaultLocale;
    const page = getExperience(locale).pages[route];
    return {
      title: page.title,
      description: page.description,
      alternates: {
        canonical: `/${locale}/${route}`,
        languages: {
          ar: `/ar/${route}`,
          fr: `/fr/${route}`,
          en: `/en/${route}`,
        },
      },
      openGraph: {
        title: page.title,
        description: page.description,
        type: "website",
        locale,
      },
    };
  };
}

export function resolveLocale(lang: string): Locale {
  return isLocale(lang) ? lang : defaultLocale;
}

/**
 * Localized metadata for the four Forum routes (P3 §5). `subpath` is the
 * path below /[lang] (e.g. "forum" or "forum/programme"); `key` selects
 * the localized title/description from the Forum content record.
 */
export function forumMetadata(
  key: keyof ForumContent["pages"],
  subpath: string,
) {
  return async function generateMetadata({
    params,
  }: {
    params: Promise<{ lang: string }>;
  }): Promise<Metadata> {
    const { lang } = await params;
    const locale: Locale = isLocale(lang) ? lang : defaultLocale;
    const page = getForum(locale).pages[key];
    return {
      title: page.title,
      description: page.description,
      alternates: {
        canonical: `/${locale}/${subpath}`,
        languages: {
          ar: `/ar/${subpath}`,
          fr: `/fr/${subpath}`,
          en: `/en/${subpath}`,
        },
      },
      openGraph: {
        title: page.title,
        description: page.description,
        type: "website",
        locale,
      },
    };
  };
}
