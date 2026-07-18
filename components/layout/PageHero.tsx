import styles from "./PageHero.module.css";

interface PageHeroProps {
  eyebrow: string;
  heading: string;
  lead?: string;
}

/** Subpage opening: the page's single H1 with eyebrow and lead. */
export default function PageHero({ eyebrow, heading, lead }: PageHeroProps) {
  return (
    <header className={styles.hero}>
      <div className="container">
        <p className={styles.eyebrow}>{eyebrow}</p>
        <h1 className={styles.heading}>{heading}</h1>
        {lead ? <p className={styles.lead}>{lead}</p> : null}
      </div>
    </header>
  );
}
