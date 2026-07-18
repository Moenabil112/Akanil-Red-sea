import Image from "next/image";
import type { SiteContent } from "@/content/types";
import styles from "./Footer.module.css";

interface FooterProps {
  ui: SiteContent["ui"];
}

export default function Footer({ ui }: FooterProps) {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.grid}`}>
        <div className={styles.brand}>
          <Image
            src="/brand/akanil-logo.png"
            alt=""
            width={56}
            height={56}
            className={styles.logo}
          />
          <div>
            <strong className={styles.entity}>{ui.footer.entity}</strong>
            <span className={styles.tagline}>{ui.footer.tagline}</span>
          </div>
        </div>
        <ol className={styles.hierarchy}>
          {ui.footer.hierarchy.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ol>
        <p className={styles.note}>{ui.footer.note}</p>
      </div>
    </footer>
  );
}
