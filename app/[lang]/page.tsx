import { isLocale, defaultLocale } from "@/lib/i18n";
import {
  getContent,
  getEcosystem,
  getExperience,
  getReception,
} from "@/lib/content";
import type { Locale } from "@/content/types";
import type { PlatformId } from "@/content/ecosystem-types";
import SiteChrome from "@/components/layout/SiteChrome";
import Hero from "@/components/sections/Hero";
import WhyRedSea from "@/components/sections/home/WhyRedSea";
import EcosystemValueFlow from "@/components/sections/home/EcosystemValueFlow";
import AudienceEntryMatrix from "@/components/sections/home/AudienceEntryMatrix";
import PortfolioSection from "@/components/sections/home/PortfolioSection";
import NodesSection from "@/components/sections/home/NodesSection";
import TechnologyOperatingLayer from "@/components/sections/home/TechnologyOperatingLayer";
import SpecialistReviewProcess from "@/components/sections/home/SpecialistReviewProcess";
import GatewayStatus from "@/components/sections/home/GatewayStatus";
import {
  ValueSummary,
  ForumSummary,
  TrustAboutSummary,
  ReceptionCta,
} from "@/components/sections/home/HomeSummaries";

interface PageProps {
  params: Promise<{ lang: string }>;
}

/**
 * P0 homepage — the ecosystem architecture order (directive §24):
 * 01 hero · 02 why the Red Sea · 03 value flow · 04 audience matrix ·
 * 05 portfolio · 06–07 value for Morocco / Sudan · 08 Red Sea nodes ·
 * 09 technology · 10 Forum · 11 specialized review · 12 reception ·
 * 13 public scope and status · 14 trust and Akanil identity.
 * The limitation matrix never precedes the value proposition.
 */
export default async function Page({ params }: PageProps) {
  const { lang } = await params;
  const locale: Locale = isLocale(lang) ? lang : defaultLocale;
  const site = getContent(locale);
  const experience = getExperience(locale);
  const reception = getReception(locale);
  const ecosystem = getEcosystem(locale);

  const platformNames = Object.fromEntries(
    ecosystem.platforms.items.map((platform) => [platform.id, platform.name]),
  ) as Record<PlatformId, string>;

  return (
    <SiteChrome locale={locale}>
      <Hero
        hero={ecosystem.hero}
        scope={{
          scopeLabel: site.hero.scopeLabel,
          scopeNodes: site.hero.scopeNodes,
        }}
        locale={locale}
      />
      <WhyRedSea
        locale={locale}
        content={ecosystem.whyRedSea}
        sectionLabel={site.ui.sectionLabel}
      />
      <EcosystemValueFlow
        content={ecosystem.valueFlow}
        sectionLabel={site.ui.sectionLabel}
      />
      <AudienceEntryMatrix
        locale={locale}
        audiences={ecosystem.audiences}
        platformNames={platformNames}
        requestTypes={reception.requestTypes}
        sectionLabel={site.ui.sectionLabel}
      />
      <PortfolioSection
        locale={locale}
        ecosystem={ecosystem}
        sectionLabel={site.ui.sectionLabel}
      />
      <ValueSummary locale={locale} experience={experience} site={site} />
      <NodesSection ecosystem={ecosystem} sectionLabel={site.ui.sectionLabel} />
      <TechnologyOperatingLayer
        technology={ecosystem.technology}
        states={ecosystem.states}
        sectionLabel={site.ui.sectionLabel}
      />
      <ForumSummary locale={locale} experience={experience} site={site} />
      <SpecialistReviewProcess
        review={ecosystem.review}
        sectionLabel={site.ui.sectionLabel}
      />
      <ReceptionCta locale={locale} experience={experience} />
      <GatewayStatus status={experience.status} claims={ecosystem.claims} />
      <TrustAboutSummary locale={locale} experience={experience} site={site} />
    </SiteChrome>
  );
}
