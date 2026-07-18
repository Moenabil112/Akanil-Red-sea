import type { SiteContent } from "@/content/types";
import SectionIntro from "@/components/ui/SectionIntro";
import Reveal from "@/components/motion/Reveal";
import styles from "./WhyGateway.module.css";

interface WhyGatewayProps {
  why: SiteContent["why"];
  sectionLabel: string;
  number?: string;
}

export default function WhyGateway({ why, sectionLabel, number = "02" }: WhyGatewayProps) {
  return (
    <section id="why" className={styles.section}>
      <div className="container">
        <SectionIntro
          number={number}
          eyebrow={why.eyebrow}
          title={why.title}
          lead={why.lead}
          tone="light"
          sectionLabel={sectionLabel}
        />

        <div className={styles.split}>
          <div>
            <h3 className={styles.columnTitle}>{why.problemsTitle}</h3>
            <ol className={styles.problems}>
              {why.problems.map((problem, index) => (
                <Reveal as="li" key={problem.title} delay={index * 60} className={styles.problem}>
                  <span className={styles.problemIndex} aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h4 className={styles.problemTitle}>{problem.title}</h4>
                    <p className={styles.problemText}>{problem.text}</p>
                  </div>
                </Reveal>
              ))}
            </ol>
          </div>

          <div className={styles.answerPanel}>
            <h3 className={styles.answerTitle}>{why.answerTitle}</h3>
            <p className={styles.answerLead}>{why.answerLead}</p>
            <ul className={styles.answers}>
              {why.answers.map((answer) => (
                <li key={answer.title} className={styles.answer}>
                  <h4 className={styles.answerItemTitle}>{answer.title}</h4>
                  <p className={styles.answerItemText}>{answer.text}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
