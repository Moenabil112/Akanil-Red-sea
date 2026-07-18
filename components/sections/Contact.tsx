import type { SiteContent } from "@/content/types";
import SectionIntro from "@/components/ui/SectionIntro";
import Reveal from "@/components/motion/Reveal";
import OpenContactLink from "@/components/ui/OpenContactLink";
import styles from "./Contact.module.css";

interface ContactProps {
  contact: SiteContent["contact"];
  sectionLabel: string;
}

export default function Contact({ contact, sectionLabel }: ContactProps) {
  return (
    <section id="contact" className={styles.section}>
      <div className="container">
        <SectionIntro
          number="12"
          eyebrow={contact.eyebrow}
          title={contact.title}
          lead={contact.lead}
          tone="light"
          sectionLabel={sectionLabel}
        />

        <h3 className={styles.actionsTitle}>{contact.actionsTitle}</h3>
        <ul className={styles.actions}>
          {contact.actions.map((action, index) => (
            <Reveal
              as="li"
              key={action.title}
              delay={(index % 2) * 80}
              className={styles.action}
            >
              <h4 className={styles.actionTitle}>{action.title}</h4>
              <p className={styles.actionText}>{action.text}</p>
            </Reveal>
          ))}
        </ul>

        <div className={styles.openRow}>
          <OpenContactLink
            className={styles.openButton}
            title={contact.open.explanation}
          >
            {contact.open.label}
          </OpenContactLink>
          <p className={styles.openExplanation}>{contact.open.explanation}</p>
        </div>
      </div>
    </section>
  );
}
