import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getEcosystem } from "@/lib/content";
import { platformIds, isPlatformId } from "@/lib/ecosystem";
import { resolveLocale } from "@/lib/page-meta";
import type { PlatformId } from "@/content/ecosystem-types";
import SiteChrome from "@/components/layout/SiteChrome";
import PageHero from "@/components/layout/PageHero";
import PageReceptionBand from "@/components/layout/PageReceptionBand";
import PlatformProfile from "@/components/portfolio/PlatformProfile";
import { getExperience } from "@/lib/content";

interface ProfileParams {
  lang: string;
  platform: string;
}

/** Statically generate the four platform profiles per locale (P1 §6). */
export function generateStaticParams() {
  return platformIds.map((platform) => ({ platform }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<ProfileParams>;
}): Promise<Metadata> {
  const { lang, platform } = await params;
  if (!isPlatformId(platform)) return {};
  const locale = resolveLocale(lang);
  const ecosystem = getEcosystem(locale);
  const record = ecosystem.platforms.items.find((p) => p.id === platform)!;
  const title = `${record.name} — ${ecosystem.portfolioPage.heading}`;
  const description = record.purpose;
  const path = `/${locale}/portfolio/${platform}`;
  return {
    title,
    description,
    alternates: {
      canonical: path,
      languages: {
        ar: `/ar/portfolio/${platform}`,
        fr: `/fr/portfolio/${platform}`,
        en: `/en/portfolio/${platform}`,
      },
    },
    openGraph: {
      title,
      description,
      type: "website",
      locale,
    },
  };
}

/**
 * /[lang]/portfolio/[platform] — dedicated platform profile using the
 * shared PlatformProfile template. Unknown slugs 404 (dynamicParams is
 * false at the layout and isPlatformId guards the render).
 */
export default async function PlatformProfilePage({
  params,
}: {
  params: Promise<ProfileParams>;
}) {
  const { lang, platform } = await params;
  if (!isPlatformId(platform)) notFound();
  const locale = resolveLocale(lang);
  const ecosystem = getEcosystem(locale);
  const experience = getExperience(locale);
  const id = platform as PlatformId;
  const record = ecosystem.platforms.items.find((p) => p.id === id)!;

  return (
    <SiteChrome locale={locale}>
      <PageHero
        eyebrow={ecosystem.platforms.profileHeroEyebrow}
        heading={record.name}
        lead={record.purpose}
      />
      <PlatformProfile
        locale={locale}
        platform={record}
        labels={ecosystem.platforms}
        states={ecosystem.states}
        reviewPanel={ecosystem.reviewPanel}
      />
      <PageReceptionBand
        locale={locale}
        experience={experience}
        requestType={record.cta.requestType}
        label={record.cta.label}
      />
    </SiteChrome>
  );
}
