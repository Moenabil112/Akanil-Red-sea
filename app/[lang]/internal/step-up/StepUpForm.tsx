"use client";

import { useActionState } from "react";
import { stepUpAction, type StepUpState } from "../governance-actions";
import type { InternalDict } from "@/content/internal/dictionary";
import styles from "../internal.module.css";

export default function StepUpForm({
  locale,
  next,
  dict,
}: {
  locale: string;
  next: string;
  dict: InternalDict;
}) {
  const [state, formAction, pending] = useActionState<StepUpState, FormData>(
    stepUpAction.bind(null, locale),
    {},
  );
  return (
    <form action={formAction} className={styles.form}>
      {state.error ? (
        <p className={styles.error} role="alert">
          {dict.p4b.stepUp.error}
        </p>
      ) : null}
      <input type="hidden" name="next" value={next} />
      <div className={styles.field}>
        <label className={styles.label} htmlFor="stepup-password">
          {dict.p4b.stepUp.password}
        </label>
        <input
          id="stepup-password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className={styles.input}
        />
      </div>
      <button type="submit" className={styles.button} disabled={pending}>
        {dict.p4b.stepUp.submit}
      </button>
    </form>
  );
}
