import type { ReactNode } from "react";
import type { Locale } from "@/content/types";
import { getContent, getExperience } from "@/lib/content";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import styles from "./SiteChrome.module.css";

interface SiteChromeProps {
  locale: Locale;
  children: ReactNode;
}

/** Shared page chrome: skip link, header, main landmark and footer. */
export default function SiteChrome({ locale, children }: SiteChromeProps) {
  const content = getContent(locale);
  const experience = getExperience(locale);
  return (
    <>
      <a href="#main" className={styles.skipLink}>
        {content.ui.skipLink}
      </a>
      <Header locale={locale} ui={content.ui} experience={experience} />
      <main id="main">{children}</main>
      <Footer locale={locale} ui={content.ui} experience={experience} />
    </>
  );
}
