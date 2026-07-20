"use client";

import { useActionState } from "react";
import {
  resolveEventAction,
  createIncidentAction,
  closeIncidentAction,
  type GovState,
} from "../governance-actions";
import type { InternalDict } from "@/content/internal/dictionary";
import styles from "../internal.module.css";

const CATEGORIES = ["AUTHENTICATION", "AUTHORIZATION", "DATA_EXPOSURE", "AUDIT_INTEGRITY", "DATABASE", "BACKUP_RESTORE", "AVAILABILITY", "SECRET_HANDLING", "OPERATIONAL_ERROR", "OTHER"];
const SEVERITIES = ["INFORMATIONAL", "LOW", "MEDIUM", "HIGH", "CRITICAL"];

export function ResolveEventForm({ locale, eventId, dict }: { locale: string; eventId: string; dict: InternalDict }) {
  const [state, action, pending] = useActionState<GovState, FormData>(resolveEventAction.bind(null, locale), {});
  const p = dict.p4b.security;
  return (
    <form action={action} className={styles.actionsRow} style={{ marginTop: "0.35rem" }}>
      {state.error ? <span className={styles.error} role="alert">{state.error}</span> : null}
      <input type="hidden" name="eventId" value={eventId} />
      <select name="status" aria-label={p.status} className={styles.select} defaultValue="RESOLVED">
        <option value="RESOLVED">RESOLVED</option>
        <option value="FALSE_POSITIVE">FALSE_POSITIVE</option>
      </select>
      <input name="resolution" aria-label={p.resolution} placeholder={p.resolution} className={styles.input} />
      <button type="submit" className={styles.button} disabled={pending}>{p.resolve}</button>
    </form>
  );
}

export function NewIncidentForm({ locale, dict }: { locale: string; dict: InternalDict }) {
  const [state, action, pending] = useActionState<GovState, FormData>(createIncidentAction.bind(null, locale), {});
  const p = dict.p4b.security;
  return (
    <form action={action} className={styles.form}>
      {state.error ? <p className={styles.error} role="alert">{state.error}</p> : null}
      <div className={styles.field}>
        <label className={styles.label} htmlFor="inc-title">{dict.cases.caseTitle}</label>
        <input id="inc-title" name="title" required className={styles.input} />
      </div>
      <div className={styles.actionsRow}>
        <select name="category" aria-label={p.category} className={styles.select}>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select name="severity" aria-label={p.severity} className={styles.select} defaultValue="MEDIUM">
          {SEVERITIES.map((sv) => <option key={sv} value={sv}>{sv}</option>)}
        </select>
      </div>
      <div className={styles.field}>
        <label className={styles.label} htmlFor="inc-summary">{p.summary}</label>
        <textarea id="inc-summary" name="summary" required className={styles.textarea} />
      </div>
      <button type="submit" className={styles.button} disabled={pending}>{p.newIncident}</button>
    </form>
  );
}

export function CloseIncidentForm({ locale, incidentId, dict }: { locale: string; incidentId: string; dict: InternalDict }) {
  const [state, action, pending] = useActionState<GovState, FormData>(closeIncidentAction.bind(null, locale), {});
  const p = dict.p4b.security;
  return (
    <form action={action} className={styles.form}>
      {state.error ? <p className={styles.error} role="alert">{state.error}</p> : null}
      <input type="hidden" name="incidentId" value={incidentId} />
      <div className={styles.field}>
        <label className={styles.label} htmlFor="inc-lessons">{p.lessons}</label>
        <textarea id="inc-lessons" name="lessonsLearned" required className={styles.textarea} />
      </div>
      <button type="submit" className={styles.button} disabled={pending}>{p.close}</button>
    </form>
  );
}
