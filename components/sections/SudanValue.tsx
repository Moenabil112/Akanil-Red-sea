import Image from "next/image";
import type { SiteContent } from "@/content/types";
import SectionIntro from "@/components/ui/SectionIntro";
import Reveal from "@/components/motion/Reveal";
import styles from "./SudanValue.module.css";

interface SudanValueProps {
  sudan: SiteContent["sudan"];
  conceptArtLabel: string;
  sectionLabel: string;
}

export default function SudanValue({
  sudan,
  conceptArtLabel,
  sectionLabel,
}: SudanValueProps) {
  return (
    <section id="sudan" className={styles.section}>
      <div className="container">
        <SectionIntro
          number="05"
          eyebrow={sudan.eyebrow}
          title={sudan.title}
          lead={sudan.lead}
          sectionLabel={sectionLabel}
        />

        <div className={styles.grid}>
          <ul className={styles.roles}>
            {sudan.roles.map((role, index) => (
              <Reveal
                as="li"
                key={role.title}
                delay={(index % 2) * 80}
                className={styles.role}
              >
                <h3 className={styles.roleTitle}>{role.title}</h3>
                <p className={styles.roleText}>{role.text}</p>
              </Reveal>
            ))}
          </ul>

          <div className={styles.side}>
            <Reveal className={styles.equation}>
              <h3 className={styles.equationTitle}>{sudan.equationTitle}</h3>
              <ol className={styles.equationList}>
                {sudan.equationParts.map((part, index) => (
                  <li key={part} className={styles.equationPart}>
                    {index > 0 ? (
                      <span className={styles.plus} aria-hidden="true">
                        +
                      </span>
                    ) : null}
                    <span>{part}</span>
                  </li>
                ))}
                <li className={styles.equationResult}>
                  <span className={styles.equals} aria-hidden="true">
                    =
                  </span>
                  <strong>{sudan.equationResult}</strong>
                </li>
              </ol>
            </Reveal>

            <Reveal as="figure" className={styles.visual} delay={100}>
              <Image
                src="/images/chains/shared-value-chains.webp"
                alt=""
                width={1672}
                height={941}
                loading="lazy"
                className={styles.visualImage}
              />
              <figcaption className={styles.visualLabel}>
                {conceptArtLabel}
              </figcaption>
            </Reveal>
          </div>
        </div>

        <p className={styles.partnershipNote}>{sudan.partnershipNote}</p>
      </div>
    </section>
  );
}
