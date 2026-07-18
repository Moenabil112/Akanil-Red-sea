import Link from "next/link";
import type { ExperienceContent, Locale, RequestTypeId } from "@/content/types";
import styles from "./PageReceptionBand.module.css";

interface PageReceptionBandProps {
  locale: Locale;
  experience: ExperienceContent;
  /** Preselected request type carried into the reception desk. */
  requestType?: RequestTypeId;
  /** Override the button label (defaults to the global reception label). */
  label?: string;
}

/** Consistent controlled next-step band at the end of content pages. */
export default function PageReceptionBand({
  locale,
  experience,
  requestType,
  label,
}: PageReceptionBandProps) {
  const cta = experience.receptionCta;
  const href = requestType
    ? `/${locale}/reception?type=${requestType}`
    : `/${locale}/reception`;
  return (
    <aside className={styles.band} aria-label={cta.eyebrow}>
      <div className={`container ${styles.inner}`}>
        <div>
          <p className={styles.eyebrow}>{cta.eyebrow}</p>
          <p className={styles.text}>{cta.text}</p>
        </div>
        <Link className={styles.button} href={href}>
          {label ?? cta.openLabel}
        </Link>
      </div>
    </aside>
  );
}
