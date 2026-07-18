import type { Metadata } from "next";
import type { Locale, PageRoute } from "@/content/types";
import { defaultLocale, isLocale } from "./i18n";
import { getExperience } from "./content";

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
