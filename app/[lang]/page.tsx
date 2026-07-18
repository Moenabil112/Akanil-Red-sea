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
      </main>
      <Footer ui={content.ui} />
      <ContactNote modal={content.contact.modal} />
    </>
  );
}
