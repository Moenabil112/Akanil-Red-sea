"use client";

import { useActionState } from "react";
import { setReadinessGateAction, type GovState } from "../governance-actions";
import type { InternalDict } from "@/content/internal/dictionary";
import styles from "../internal.module.css";

const GATE_STATES = [
  "NOT_READY",
  "READY_FOR_LIMITED_INTERNAL_PILOT",
  "LIMITED_INTERNAL_PILOT_ACTIVE",
  "PILOT_SUSPENDED",
  "PILOT_COMPLETED_PENDING_REVIEW",
];

export function GateForm({ locale, dict }: { locale: string; dict: InternalDict }) {
  const [state, formAction, pending] = useActionState<GovState, FormData>(
    setReadinessGateAction.bind(null, locale),
    {},
  );
  const p = dict.p4b;
  return (
    <form action={formAction} className={styles.form}>
      {state.error ? <p className={styles.error} role="alert">{state.error}</p> : null}
      {state.ok ? <p className={styles.info}>{p.readiness.decide}: OK</p> : null}
      <div className={styles.field}>
        <label className={styles.label} htmlFor="gate-state">{p.readiness.state}</label>
        <select id="gate-state" name="state" className={styles.select} defaultValue="NOT_READY">
          {GATE_STATES.map((gs) => (
            <option key={gs} value={gs}>{p.gateStates[gs] ?? gs}</option>
          ))}
        </select>
      </div>
      <div className={styles.field}>
        <label className={styles.label} htmlFor="gate-rationale">{p.readiness.rationale}</label>
        <textarea id="gate-rationale" name="rationale" required className={styles.textarea} />
      </div>
      <button type="submit" className={styles.button} disabled={pending}>
        {p.readiness.decide}
      </button>
    </form>
  );
}
