import type { Metadata } from "next";
import type { ReactNode } from "react";
import { locales, isLocale, defaultLocale, dirFor } from "@/lib/i18n";
import { getContent } from "@/lib/content";
import type { Locale } from "@/content/types";
import "@/styles/globals.css";

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

interface LayoutProps {
  children: ReactNode;
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const locale: Locale = isLocale(lang) ? lang : defaultLocale;
  const content = getContent(locale);
  return {
    title: content.meta.title,
    description: content.meta.description,
    alternates: {
      canonical: `/${locale}`,
      languages: {
        ar: "/ar",
        fr: "/fr",
        en: "/en",
      },
    },
    openGraph: {
      title: content.meta.title,
      description: content.meta.description,
      type: "website",
      locale,
      images: [
        {
          url: "/images/hero/hero-abstract-flow.webp",
          width: 1672,
          height: 941,
          alt: content.meta.ogAlt,
        },
      ],
    },
    icons: { icon: "/brand/akanil-emblem.png" },
  };
}

export default async function LangLayout({ children, params }: LayoutProps) {
  const { lang } = await params;
  const locale: Locale = isLocale(lang) ? lang : defaultLocale;
  return (
    <html lang={locale} dir={dirFor(locale)}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        {/* Alexandria (Arabic) + Inter (Latin); no font binaries in the repo (ADR-005). */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Alexandria:wght@300;400;500;700;800&family=Inter:wght@400;500;600;700;800&display=swap"
        />
        <meta name="theme-color" content="#07192a" />
      </head>
      <body>{children}</body>
    </html>
  );
}
