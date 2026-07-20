"use client";

import { useActionState } from "react";
import { loginAction, type LoginState } from "../actions";
import type { InternalDict } from "@/content/internal/dictionary";
import styles from "../internal.module.css";

export default function LoginForm({
  locale,
  dict,
}: {
  locale: string;
  dict: InternalDict;
}) {
  const [state, formAction, pending] = useActionState<LoginState, FormData>(
    loginAction.bind(null, locale),
    {},
  );

  return (
    <form action={formAction} className={styles.form}>
      {state.error ? (
        <p className={styles.error} role="alert">
          {dict.login.error}
        </p>
      ) : null}
      <div className={styles.field}>
        <label className={styles.label} htmlFor="email">
          {dict.login.email}
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="username"
          required
          className={styles.input}
        />
      </div>
      <div className={styles.field}>
        <label className={styles.label} htmlFor="password">
          {dict.login.password}
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className={styles.input}
        />
      </div>
      <button type="submit" className={styles.button} disabled={pending}>
        {dict.login.submit}
      </button>
      <p className={styles.info}>{dict.login.noSelfSignup}</p>
    </form>
  );
}
