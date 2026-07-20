"use client";

import { useActionState } from "react";
import {
  requestPilotAccessAction,
  createAccessChangeAction,
  conductAccessReviewAction,
  completeOffboardingAction,
  type GovState,
} from "../governance-actions";
import type { InternalDict } from "@/content/internal/dictionary";
import { EMPLOYEE_ROLES } from "@/lib/internal/roles";
import styles from "../internal.module.css";

type Emp = { id: string; email: string; displayName: string };

const CHANGE_TYPES = [
  "CHANGE_ROLE",
  "ENABLE_ACCOUNT",
  "DISABLE_ACCOUNT",
  "REVOKE_SESSIONS",
  "RESET_PASSWORD",
];

export function PilotRequestForm({ locale, employees, dict }: { locale: string; employees: Emp[]; dict: InternalDict }) {
  const [state, action, pending] = useActionState<GovState, FormData>(requestPilotAccessAction.bind(null, locale), {});
  const p = dict.p4b.access;
  return (
    <form action={action} className={styles.actionsRow}>
      {state.error ? <p className={styles.error} role="alert">{state.error}</p> : null}
      {state.ok ? <p className={styles.info}>{p.requestPilot}: OK</p> : null}
      <select name="employeeId" aria-label={p.employee} className={styles.select} required>
        {employees.map((e) => <option key={e.id} value={e.id}>{e.displayName}</option>)}
      </select>
      <select name="approvedRole" aria-label={p.role} className={styles.select} defaultValue="CASE_MANAGER">
        {EMPLOYEE_ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
      </select>
      <input name="justification" aria-label={p.justification} placeholder={p.justification} required className={styles.input} />
      <button type="submit" className={styles.button} disabled={pending}>{p.requestPilot}</button>
    </form>
  );
}

export function AccessChangeForm({ locale, employees, dict }: { locale: string; employees: Emp[]; dict: InternalDict }) {
  const [state, action, pending] = useActionState<GovState, FormData>(createAccessChangeAction.bind(null, locale), {});
  const p = dict.p4b.access;
  return (
    <form action={action} className={styles.actionsRow}>
      {state.error ? <p className={styles.error} role="alert">{state.error}</p> : null}
      {state.ok ? <p className={styles.info}>{p.propose}: OK</p> : null}
      <select name="targetEmployeeId" aria-label={p.employee} className={styles.select} required>
        {employees.map((e) => <option key={e.id} value={e.id}>{e.displayName}</option>)}
      </select>
      <select name="changeType" aria-label={p.changeType} className={styles.select} defaultValue="CHANGE_ROLE">
        {CHANGE_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
      </select>
      <select name="proposedRole" aria-label={p.proposedRole} className={styles.select} defaultValue="CASE_MANAGER">
        {EMPLOYEE_ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
      </select>
      <input name="justification" aria-label={p.justification} placeholder={p.justification} required className={styles.input} />
      <button type="submit" className={styles.button} disabled={pending}>{p.propose}</button>
    </form>
  );
}

export function ReviewForm({ locale, reviewId, dict }: { locale: string; reviewId: string; dict: InternalDict }) {
  const [state, action, pending] = useActionState<GovState, FormData>(conductAccessReviewAction.bind(null, locale), {});
  const p = dict.p4b.access;
  return (
    <form action={action} className={styles.actionsRow} style={{ marginTop: "0.35rem" }}>
      {state.error ? <p className={styles.error} role="alert">{state.error}</p> : null}
      <input type="hidden" name="reviewId" value={reviewId} />
      <select name="outcome" aria-label={p.outcome} className={styles.select} defaultValue="RETAIN">
        {["RETAIN", "MODIFY", "SUSPEND", "REVOKE", "FURTHER_REVIEW_REQUIRED"].map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
      <input name="rationale" aria-label={dict.p4b.readiness.rationale} placeholder={dict.p4b.readiness.rationale} required className={styles.input} />
      <button type="submit" className={styles.button} disabled={pending}>{p.conduct}</button>
    </form>
  );
}

export function CompleteOffboardingForm({ locale, employeeId, dict }: { locale: string; employeeId: string; dict: InternalDict }) {
  const [state, action, pending] = useActionState<GovState, FormData>(completeOffboardingAction.bind(null, locale), {});
  const p = dict.p4b.access;
  return (
    <form action={action} style={{ display: "inline" }}>
      {state.error ? <span className={styles.error} role="alert">{state.error}</span> : null}
      <input type="hidden" name="employeeId" value={employeeId} />
      <button type="submit" className={styles.button} disabled={pending}>{p.complete}</button>
    </form>
  );
}
