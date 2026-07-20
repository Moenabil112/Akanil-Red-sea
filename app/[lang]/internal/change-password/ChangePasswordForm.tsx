"use client";

import { useActionState } from "react";
import { changePasswordAction, type ChangePwState } from "../actions";
import type { InternalDict } from "@/content/internal/dictionary";
import styles from "../internal.module.css";

export default function ChangePasswordForm({
  locale,
  dict,
}: {
  locale: string;
  dict: InternalDict;
}) {
  const [state, formAction, pending] = useActionState<ChangePwState, FormData>(
    changePasswordAction.bind(null, locale),
    {},
  );
  const message =
    state.error === "mismatch"
      ? dict.changePassword.mismatch
      : state.error === "weak"
        ? dict.changePassword.weak
        : state.error === "invalid"
          ? dict.changePassword.invalidCurrent
          : null;

  return (
    <form action={formAction} className={styles.form}>
      {message ? (
        <p className={styles.error} role="alert">
          {message}
        </p>
      ) : null}
      <div className={styles.field}>
        <label className={styles.label} htmlFor="current">
          {dict.changePassword.current}
        </label>
        <input id="current" name="current" type="password" required autoComplete="current-password" className={styles.input} />
      </div>
      <div className={styles.field}>
        <label className={styles.label} htmlFor="next">
          {dict.changePassword.next}
        </label>
        <input id="next" name="next" type="password" required minLength={14} autoComplete="new-password" className={styles.input} />
        <span className={styles.info}>{dict.changePassword.policy}</span>
      </div>
      <div className={styles.field}>
        <label className={styles.label} htmlFor="confirm">
          {dict.changePassword.confirm}
        </label>
        <input id="confirm" name="confirm" type="password" required minLength={14} autoComplete="new-password" className={styles.input} />
      </div>
      <button type="submit" className={styles.button} disabled={pending}>
        {dict.changePassword.submit}
      </button>
    </form>
  );
}
