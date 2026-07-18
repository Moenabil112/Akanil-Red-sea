import { isLocale, defaultLocale } from "@/lib/i18n";
import { getContent } from "@/lib/content";
import type { Locale } from "@/content/types";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ContactNote from "@/components/ui/ContactNote";
import Hero from "@/components/sections/Hero";
import WhyGateway from "@/components/sections/WhyGateway";
import Architecture from "@/components/sections/Architecture";
import MoroccoValue from "@/components/sections/MoroccoValue";
import SudanValue from "@/components/sections/SudanValue";
import Corridor from "@/components/sections/Corridor";
import ValueChains from "@/components/sections/ValueChains";
import Forum from "@/components/sections/Forum";
import OperatingLayer from "@/components/sections/OperatingLayer";
import Trust from "@/components/sections/Trust";
import About from "@/components/sections/About";
import Contact from "@/components/sections/Contact";
import styles from "./page.module.css";

interface PageProps {
  params: Promise<{ lang: string }>;
}

export default async function Page({ params }: PageProps) {
  const { lang } = await params;
  const locale: Locale = isLocale(lang) ? lang : defaultLocale;
  const content = getContent(locale);

  return (
    <>
      <a href="#main" className={styles.skipLink}>
        {content.ui.skipLink}
      </a>
      <Header locale={locale} ui={content.ui} />
      <main id="main">
        <Hero hero={content.hero} />
        <WhyGateway why={content.why} sectionLabel={content.ui.sectionLabel} />
        <Architecture
          architecture={content.architecture}
          sectionLabel={content.ui.sectionLabel}
        />
        <MoroccoValue
          morocco={content.morocco}
          conceptArtLabel={content.ui.conceptArtLabel}
          sectionLabel={content.ui.sectionLabel}
        />
        <SudanValue
          sudan={content.sudan}
          conceptArtLabel={content.ui.conceptArtLabel}
          sectionLabel={content.ui.sectionLabel}
        />
        <Corridor
          corridor={content.corridor}
          sectionLabel={content.ui.sectionLabel}
        />
        <ValueChains
          chains={content.chains}
          sectionLabel={content.ui.sectionLabel}
        />
        <Forum forum={content.forum} sectionLabel={content.ui.sectionLabel} />
        <OperatingLayer
          operating={content.operating}
          sectionLabel={content.ui.sectionLabel}
        />
        <Trust trust={content.trust} sectionLabel={content.ui.sectionLabel} />
        <About about={content.about} sectionLabel={content.ui.sectionLabel} />
        <Contact
          contact={content.contact}
          sectionLabel={content.ui.sectionLabel}
        />
      </main>
      <Footer ui={content.ui} />
      <ContactNote modal={content.contact.modal} />
    </>
  );
}
