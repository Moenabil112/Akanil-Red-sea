import { getContent, getExperience } from "@/lib/content";
import { pageMetadata, resolveLocale } from "@/lib/page-meta";
import SiteChrome from "@/components/layout/SiteChrome";
import PageHero from "@/components/layout/PageHero";
import PageReceptionBand from "@/components/layout/PageReceptionBand";
import WhyGateway from "@/components/sections/WhyGateway";
import Architecture from "@/components/sections/Architecture";
import OperatingLayer from "@/components/sections/OperatingLayer";

export const generateMetadata = pageMetadata("gateway");

export default async function GatewayPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale = resolveLocale(lang);
  const site = getContent(locale);
  const experience = getExperience(locale);
  return (
    <SiteChrome locale={locale}>
      <PageHero
        eyebrow={experience.gatewayPage.eyebrow}
        heading={experience.gatewayPage.heading}
        lead={experience.gatewayPage.lead}
      />
      <WhyGateway
        why={site.why}
        sectionLabel={site.ui.sectionLabel}
        number="01"
      />
      <Architecture
        architecture={site.architecture}
        sectionLabel={site.ui.sectionLabel}
        number="02"
      />
      <OperatingLayer
        operating={site.operating}
        sectionLabel={site.ui.sectionLabel}
        number="03"
      />
      <PageReceptionBand locale={locale} experience={experience} />
    </SiteChrome>
  );
}
