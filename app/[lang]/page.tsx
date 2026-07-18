import { isLocale, defaultLocale } from "@/lib/i18n";
import { getContent } from "@/lib/content";
import type { Locale } from "@/content/types";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ContactNote from "@/components/ui/ContactNote";
import Hero from "@/components/sections/Hero";
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
      </main>
      <Footer ui={content.ui} />
      <ContactNote modal={content.contact.modal} />
    </>
  );
}
