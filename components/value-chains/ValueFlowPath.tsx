import type { ValueFlowStage } from "@/content/value-chains-types";
import styles from "./ValueFlowPath.module.css";

interface ValueFlowPathProps {
  stages: ValueFlowStage[];
  flowLabel: string;
  roleLabel: string;
  contributionLabel: string;
}

/**
 * Reusable shared-value flow (P2, ADR-018). Semantic ordered markup
 * first: an ordered list of stages readable and keyboard-navigable
 * without motion, with a connector rendered only as decoration. Used on
 * every value-chain profile; direction-aware for native Arabic RTL.
 */
export default function ValueFlowPath({
  stages,
  flowLabel,
  roleLabel,
  contributionLabel,
}: ValueFlowPathProps) {
  return (
    <ol className={styles.flow} aria-label={flowLabel}>
      {stages.map((stage, index) => (
        <li key={stage.title} className={styles.stage}>
          <span className={styles.index} aria-hidden="true">
            {index + 1}
          </span>
          <div className={styles.stageBody}>
            <h3 className={styles.stageTitle}>{stage.title}</h3>
            <p className={styles.stageRole}>
              <span className="visually-hidden">{roleLabel}: </span>
              {stage.role}
            </p>
            <p className={styles.contribution}>
              <span className={styles.contributionLabel}>
                {contributionLabel}
              </span>
              {stage.contribution}
            </p>
          </div>
          {index < stages.length - 1 ? (
            <span className={styles.connector} aria-hidden="true" />
          ) : null}
        </li>
      ))}
    </ol>
  );
}
