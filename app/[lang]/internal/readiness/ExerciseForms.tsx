"use client";

import { useActionState } from "react";
import {
  recordExerciseResultAction,
  approveExerciseAction,
  verifyCorrectiveAction2,
  acceptRiskAction,
  type GovState,
} from "../governance-actions";
import type { InternalDict } from "@/content/internal/dictionary";
import styles from "../internal.module.css";

export function RecordResultForm({ locale, exerciseId, dict }: { locale: string; exerciseId: string; dict: InternalDict }) {
  const [state, action, pending] = useActionState<GovState, FormData>(recordExerciseResultAction.bind(null, locale), {});
  const p = dict.p4b.exercises;
  return (
    <form action={action} className={styles.actionsRow} style={{ marginTop: "0.35rem" }}>
      {state.error ? <span className={styles.error} role="alert">{state.error}</span> : null}
      <input type="hidden" name="exerciseId" value={exerciseId} />
      <select name="status" aria-label={p.result} className={styles.select} defaultValue="PASSED">
        {["PASSED", "PASSED_WITH_OBSERVATIONS", "FAILED", "BLOCKED"].map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
      <input name="actualResult" aria-label={p.actual} placeholder={p.actual} required className={styles.input} />
      <input name="deviation" aria-label={p.deviation} placeholder={p.deviation} className={styles.input} />
      <button type="submit" className={styles.button} disabled={pending}>{p.record}</button>
    </form>
  );
}

export function ApproveExerciseForm({ locale, exerciseId, dict }: { locale: string; exerciseId: string; dict: InternalDict }) {
  const [state, action, pending] = useActionState<GovState, FormData>(approveExerciseAction.bind(null, locale), {});
  const p = dict.p4b.exercises;
  return (
    <form action={action} style={{ display: "inline" }}>
      {state.error ? <span className={styles.error} role="alert">{state.error}</span> : null}
      <input type="hidden" name="exerciseId" value={exerciseId} />
      <button type="submit" className={styles.buttonGhost} disabled={pending}>{p.approve}</button>
    </form>
  );
}

export function VerifyCorrectiveForm({ locale, id, dict }: { locale: string; id: string; dict: InternalDict }) {
  const [state, action, pending] = useActionState<GovState, FormData>(verifyCorrectiveAction2.bind(null, locale), {});
  const p = dict.p4b.exercises;
  return (
    <form action={action} style={{ display: "inline" }}>
      {state.error ? <span className={styles.error} role="alert">{state.error}</span> : null}
      <input type="hidden" name="id" value={id} />
      <button type="submit" className={styles.button} disabled={pending}>{p.verify}</button>
    </form>
  );
}

export function AcceptRiskForm({ locale, id, dict }: { locale: string; id: string; dict: InternalDict }) {
  const [state, action, pending] = useActionState<GovState, FormData>(acceptRiskAction.bind(null, locale), {});
  const p = dict.p4b.exercises;
  return (
    <form action={action} className={styles.actionsRow} style={{ marginTop: "0.35rem" }}>
      {state.error ? <span className={styles.error} role="alert">{state.error}</span> : null}
      <input type="hidden" name="id" value={id} />
      <input name="rationale" aria-label={dict.p4b.readiness.rationale} placeholder={dict.p4b.readiness.rationale} required className={styles.input} />
      <button type="submit" className={styles.buttonGhost} disabled={pending}>{p.acceptRisk}</button>
    </form>
  );
}
