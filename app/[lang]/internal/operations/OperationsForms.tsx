"use client";

import { useActionState } from "react";
import {
  proposeAuthorizationAction, decideAuthorizationAction, createPilotRunAction,
  completePilotRunAction, activatePilotMemberAction, addPilotCaseAction, addPilotMemberAction,
  createObservationAction, runDataQualityScanAction, resolveDataQualityAction,
  acknowledgeProcedureAction, prepareReleaseAction, reviewReleaseAction, type OpsState,
} from "../operations-actions";
import type { InternalDict } from "@/content/internal/dictionary";
import styles from "../internal.module.css";

type Emp = { id: string; displayName: string };
const DATA_CATS = ["SYNTHETIC", "DE_IDENTIFIED"];

function Msg({ state, ok }: { state: OpsState; ok: string }) {
  return (
    <>
      {state.error ? <p className={styles.error} role="alert">{state.error}</p> : null}
      {state.ok ? <p className={styles.info}>{ok}</p> : null}
    </>
  );
}

export function ProposeAuthForm({ locale, dict }: { locale: string; dict: InternalDict }) {
  const [state, action, pending] = useActionState<OpsState, FormData>(proposeAuthorizationAction.bind(null, locale), {});
  const p = dict.p4c.authorization;
  return (
    <form action={action} className={styles.form}>
      <Msg state={state} ok={p.propose} />
      <div className={styles.field}><label className={styles.label} htmlFor="a-title">{dict.cases.caseTitle}</label>
        <input id="a-title" name="title" required className={styles.input} /></div>
      <div className={styles.field}><label className={styles.label} htmlFor="a-scope">{p.scope}</label>
        <input id="a-scope" name="scope" required className={styles.input} /></div>
      <div className={styles.actionsRow}>
        <div className={styles.field}><label className={styles.label} htmlFor="a-emp">{p.employeeLimit}</label>
          <input id="a-emp" name="approvedEmployeeLimit" type="number" min={1} max={6} defaultValue={3} className={styles.input} /></div>
        <div className={styles.field}><label className={styles.label} htmlFor="a-case">{p.caseLimit}</label>
          <input id="a-case" name="approvedCaseLimit" type="number" min={1} max={10} defaultValue={5} className={styles.input} /></div>
      </div>
      <fieldset className={styles.field} style={{ border: 0, padding: 0 }}>
        <legend className={styles.label}>{p.dataCategories}</legend>
        {DATA_CATS.map((c) => (
          <label key={c} style={{ marginInlineEnd: "1rem" }}>
            <input type="checkbox" name="allowedDataCategories" value={c} defaultChecked={c === "SYNTHETIC"} /> {c}
          </label>
        ))}
      </fieldset>
      <div className={styles.actionsRow}>
        <div className={styles.field}><label className={styles.label} htmlFor="a-from">{p.validFrom}</label>
          <input id="a-from" name="validFrom" type="date" className={styles.input} /></div>
        <div className={styles.field}><label className={styles.label} htmlFor="a-until">{p.validUntil}</label>
          <input id="a-until" name="validUntil" type="date" className={styles.input} /></div>
      </div>
      <button type="submit" className={styles.button} disabled={pending}>{p.propose}</button>
      <p className={styles.subtle}>{p.envNotSufficient}</p>
    </form>
  );
}

export function DecideAuthForm({ locale, id, dict }: { locale: string; id: string; dict: InternalDict }) {
  const [state, action, pending] = useActionState<OpsState, FormData>(decideAuthorizationAction.bind(null, locale), {});
  const p = dict.p4c.authorization;
  return (
    <form action={action} className={styles.actionsRow} style={{ marginTop: "0.35rem" }}>
      <Msg state={state} ok={p.decide} />
      <input type="hidden" name="id" value={id} />
      <select name="decision" aria-label={p.decision} className={styles.select} defaultValue="GO_LIMITED_INTERNAL_OPERATIONS">
        {["GO_LIMITED_INTERNAL_OPERATIONS", "CONDITIONAL_GO", "EXTEND_CONTROLLED_PILOT", "SUSPEND_PILOT", "NO_GO"].map((d) => (
          <option key={d} value={d}>{d}</option>
        ))}
      </select>
      <input name="conditions" aria-label={p.conditions} placeholder={p.conditions} className={styles.input} />
      <button type="submit" className={styles.button} disabled={pending}>{p.decide}</button>
    </form>
  );
}

export function CreateRunForm({ locale, dict }: { locale: string; dict: InternalDict }) {
  const [state, action, pending] = useActionState<OpsState, FormData>(createPilotRunAction.bind(null, locale), {});
  const p = dict.p4c.pilot;
  return (
    <form action={action} className={styles.form}>
      <Msg state={state} ok={p.create} />
      <div className={styles.field}><label className={styles.label} htmlFor="r-title">{dict.cases.caseTitle}</label>
        <input id="r-title" name="title" required className={styles.input} /></div>
      <div className={styles.field}><label className={styles.label} htmlFor="r-obj">{p.objective}</label>
        <input id="r-obj" name="objective" required className={styles.input} /></div>
      <div className={styles.actionsRow}>
        <div className={styles.field}><label className={styles.label} htmlFor="r-emp">{p.maxEmployees}</label>
          <input id="r-emp" name="maximumEmployees" type="number" min={1} max={6} defaultValue={3} className={styles.input} /></div>
        <div className={styles.field}><label className={styles.label} htmlFor="r-case">{p.maxCases}</label>
          <input id="r-case" name="maximumCases" type="number" min={1} max={10} defaultValue={5} className={styles.input} /></div>
      </div>
      <fieldset className={styles.field} style={{ border: 0, padding: 0 }}>
        <legend className={styles.label}>{p.dataCategory}</legend>
        {DATA_CATS.map((c) => (
          <label key={c} style={{ marginInlineEnd: "1rem" }}>
            <input type="checkbox" name="allowedDataCategories" value={c} defaultChecked={c === "SYNTHETIC"} /> {c}
          </label>
        ))}
      </fieldset>
      <button type="submit" className={styles.button} disabled={pending}>{p.create}</button>
      <p className={styles.subtle}>{p.proportionNote}</p>
    </form>
  );
}

export function CompleteRunForm({ locale, runId, dict }: { locale: string; runId: string; dict: InternalDict }) {
  const [state, action, pending] = useActionState<OpsState, FormData>(completePilotRunAction.bind(null, locale), {});
  const p = dict.p4c.pilot;
  return (
    <form action={action} className={styles.form}>
      <Msg state={state} ok={p.complete} />
      <input type="hidden" name="pilotRunId" value={runId} />
      <div className={styles.field}><label className={styles.label} htmlFor="c-sum">{p.observationsSummary}</label>
        <textarea id="c-sum" name="observationsSummary" required className={styles.textarea} /></div>
      <div className={styles.field}><label className={styles.label} htmlFor="c-out">{p.outcome}</label>
        <select id="c-out" name="finalOutcome" className={styles.select}>
          {["CONTINUE_PILOT", "CONTINUE_WITH_CONDITIONS", "READY_FOR_LIMITED_INTERNAL_OPERATIONS", "EXTEND_PILOT", "SUSPEND", "NOT_READY"].map((o) => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select></div>
      <button type="submit" className={styles.button} disabled={pending}>{p.complete}</button>
    </form>
  );
}

export function AddMemberForm({ locale, runId, employees, dict }: { locale: string; runId: string; employees: Emp[]; dict: InternalDict }) {
  const p = dict.p4c.pilot;
  return (
    <form action={addPilotMemberAction.bind(null, locale)} className={styles.actionsRow}>
      <input type="hidden" name="pilotRunId" value={runId} />
      <select name="employeeId" aria-label={p.members} className={styles.select}>
        {employees.map((e) => <option key={e.id} value={e.id}>{e.displayName}</option>)}
      </select>
      <input name="operationalRole" aria-label={dict.p4b.access.role} placeholder={dict.p4b.access.role} className={styles.input} />
      <button type="submit" className={styles.buttonGhost}>{p.addMember}</button>
    </form>
  );
}

export function ActivateMemberForm({ locale, runId, memberId, dict }: { locale: string; runId: string; memberId: string; dict: InternalDict }) {
  const [state, action, pending] = useActionState<OpsState, FormData>(activatePilotMemberAction.bind(null, locale), {});
  return (
    <form action={action} style={{ display: "inline" }}>
      {state.error ? <span className={styles.error} role="alert">{state.error}</span> : null}
      <input type="hidden" name="pilotRunId" value={runId} />
      <input type="hidden" name="memberId" value={memberId} />
      <button type="submit" className={styles.button} disabled={pending}>{dict.p4c.pilot.activate}</button>
    </form>
  );
}

export function AddCaseForm({ locale, runId, cases, dict }: { locale: string; runId: string; cases: { id: string; label: string }[]; dict: InternalDict }) {
  const [state, action, pending] = useActionState<OpsState, FormData>(addPilotCaseAction.bind(null, locale), {});
  const p = dict.p4c.pilot;
  const scenarios = ["MOROCCAN_COMPANY_REQUEST", "SUDANESE_PROJECT_OR_OPPORTUNITY", "FORUM_QUALIFICATION", "VALUE_CHAIN_REQUEST", "SPECIALIST_REVIEW_REQUIRED", "NO_PROGRESSION", "MEETING_DECISION_AND_COMMITMENT", "OTHER_CONTROLLED_SCENARIO"];
  return (
    <form action={action} className={styles.actionsRow}>
      <Msg state={state} ok={p.addCase} />
      <input type="hidden" name="pilotRunId" value={runId} />
      <select name="caseId" aria-label={p.cases} className={styles.select}>
        {cases.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
      </select>
      <select name="scenarioType" aria-label={p.scenario} className={styles.select}>
        {scenarios.map((sc) => <option key={sc} value={sc}>{sc}</option>)}
      </select>
      <select name="dataCategory" aria-label={p.dataCategory} className={styles.select}>
        {DATA_CATS.map((c) => <option key={c} value={c}>{c}</option>)}
      </select>
      <button type="submit" className={styles.button} disabled={pending}>{p.addCase}</button>
    </form>
  );
}

export function ObservationForm({ locale, runId, dict }: { locale: string; runId: string; dict: InternalDict }) {
  const [state, action, pending] = useActionState<OpsState, FormData>(createObservationAction.bind(null, locale), {});
  const p = dict.p4c.pilot;
  const cats = ["PROCESS_FRICTION", "USER_EXPERIENCE", "DATA_QUALITY", "ACCESS_CONTROL", "WORKFLOW_GAP", "TRAINING_GAP", "DOCUMENTATION_GAP", "PERFORMANCE", "SECURITY", "OTHER"];
  return (
    <form action={action} className={styles.actionsRow}>
      <Msg state={state} ok={p.recordObservation} />
      <input type="hidden" name="pilotRunId" value={runId} />
      <select name="category" aria-label={dict.p4c.dataQuality.category} className={styles.select}>
        {cats.map((c) => <option key={c} value={c}>{c}</option>)}
      </select>
      <select name="severity" aria-label={dict.p4c.dataQuality.severity} className={styles.select} defaultValue="LOW">
        {["INFORMATIONAL", "LOW", "MEDIUM", "HIGH", "CRITICAL"].map((sv) => <option key={sv} value={sv}>{sv}</option>)}
      </select>
      <input name="title" aria-label={dict.cases.caseTitle} placeholder={dict.cases.caseTitle} required className={styles.input} />
      <input name="description" aria-label={dict.cases.summary} placeholder={dict.cases.summary} required className={styles.input} />
      <button type="submit" className={styles.button} disabled={pending}>{p.recordObservation}</button>
    </form>
  );
}

export function RunScanForm({ locale, dict }: { locale: string; dict: InternalDict }) {
  const [state, action, pending] = useActionState<OpsState, FormData>(runDataQualityScanAction.bind(null, locale), {});
  return (
    <form action={action} style={{ display: "inline" }}>
      {state.ok ? <span className={styles.info}>{state.ok}</span> : null}
      <button type="submit" className={styles.button} disabled={pending}>{dict.p4c.dataQuality.runScan}</button>
    </form>
  );
}

export function ResolveDqForm({ locale, id, dict }: { locale: string; id: string; dict: InternalDict }) {
  const [state, action, pending] = useActionState<OpsState, FormData>(resolveDataQualityAction.bind(null, locale), {});
  const p = dict.p4c.dataQuality;
  return (
    <form action={action} className={styles.actionsRow} style={{ marginTop: "0.35rem" }}>
      {state.error ? <span className={styles.error} role="alert">{state.error}</span> : null}
      <input type="hidden" name="id" value={id} />
      <select name="status" aria-label={p.status} className={styles.select} defaultValue="RESOLVED">
        {["RESOLVED", "FALSE_POSITIVE", "WAIVED"].map((st) => <option key={st} value={st}>{st}</option>)}
      </select>
      <input name="resolution" aria-label={p.resolution} placeholder={p.resolution} className={styles.input} />
      <input name="waiverRationale" aria-label={p.waiver} placeholder={p.waiver} className={styles.input} />
      <button type="submit" className={styles.buttonGhost} disabled={pending}>{p.resolve}</button>
    </form>
  );
}

export function AcknowledgeForm({ locale, procedureKey, version, dict }: { locale: string; procedureKey: string; version: number; dict: InternalDict }) {
  const [state, action, pending] = useActionState<OpsState, FormData>(acknowledgeProcedureAction.bind(null, locale), {});
  const p = dict.p4c.procedures;
  return (
    <form action={action} className={styles.actionsRow} style={{ marginTop: "0.35rem" }}>
      {state.error ? <span className={styles.error} role="alert">{state.error}</span> : null}
      <input type="hidden" name="procedureKey" value={procedureKey} />
      <input type="hidden" name="procedureVersion" value={version} />
      <select name="acknowledgementType" aria-label={p.ackType} className={styles.select} defaultValue="READ_AND_UNDERSTOOD">
        {["READ_AND_UNDERSTOOD", "BRIEFED", "PRACTICAL_EXERCISE_COMPLETED"].map((t) => <option key={t} value={t}>{t}</option>)}
      </select>
      <button type="submit" className={styles.buttonGhost} disabled={pending}>{p.acknowledge}</button>
    </form>
  );
}

export function PrepareReleaseForm({ locale, dict }: { locale: string; dict: InternalDict }) {
  const [state, action, pending] = useActionState<OpsState, FormData>(prepareReleaseAction.bind(null, locale), {});
  const p = dict.p4c.release;
  return (
    <form action={action} className={styles.actionsRow}>
      <Msg state={state} ok={p.prepare} />
      <input name="version" aria-label={p.version} placeholder={p.version} required className={styles.input} />
      <input name="commitSha" aria-label={p.commit} placeholder={p.commit} required className={styles.input} />
      <input name="rollbackPlanVersion" aria-label="rollback plan" placeholder="rollback plan version" className={styles.input} />
      <button type="submit" className={styles.button} disabled={pending}>{p.prepare}</button>
    </form>
  );
}

export function ReviewReleaseForm({ locale, id, sha, dict }: { locale: string; id: string; sha: string; dict: InternalDict }) {
  const [state, action, pending] = useActionState<OpsState, FormData>(reviewReleaseAction.bind(null, locale), {});
  const p = dict.p4c.release;
  return (
    <form action={action} className={styles.actionsRow} style={{ marginTop: "0.35rem" }}>
      {state.error ? <span className={styles.error} role="alert">{state.error}</span> : null}
      <input type="hidden" name="id" value={id} />
      <input name="confirmCommitSha" aria-label={p.confirmCommit} placeholder={p.confirmCommit} defaultValue={sha} className={styles.input} />
      <button type="submit" className={styles.button} disabled={pending}>{p.review}</button>
    </form>
  );
}
