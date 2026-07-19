import type { EcosystemContent } from "@/content/ecosystem-types";
import Reveal from "@/components/motion/Reveal";
import styles from "./ClaimsBoundaryNotice.module.css";

interface ClaimsBoundaryNoticeProps {
  claims: EcosystemContent["claims"];
  onDark?: boolean;
}

/**
 * Reusable public claims-control notice (P0 §34, ADR-015): one detailed
 * scope block instead of repeating disclaimers after every paragraph.
 */
export default function ClaimsBoundaryNotice({
  claims,
  onDark = false,
}: ClaimsBoundaryNoticeProps) {
  return (
    <Reveal className={onDark ? styles.noticeDark : styles.notice}>
      <h3 className={styles.title}>{claims.title}</h3>
      <ul className={styles.scope}>
        {claims.scope.map((item) => (
          <li key={item} className={styles.item}>
            {item}
          </li>
        ))}
      </ul>
    </Reveal>
  );
}
