"use client";

import { useActionState } from "react";
import {
  adminCreateUserAction,
  adminResetPwAction,
  type AdminUserState,
} from "../../actions";
import { EMPLOYEE_ROLES } from "@/lib/internal/roles";
import styles from "../../internal.module.css";

export function CreateUserForm({ locale }: { locale: string }) {
  const [state, formAction, pending] = useActionState<AdminUserState, FormData>(
    adminCreateUserAction.bind(null, locale),
    {},
  );
  return (
    <form action={formAction} className={styles.actionsRow}>
      {state.error ? <p className={styles.error}>{state.error}</p> : null}
      {state.ok ? <p className={styles.info}>Account created.</p> : null}
      <input name="email" type="email" aria-label="Work email" placeholder="work email" required className={styles.input} />
      <input name="name" aria-label="Display name" placeholder="display name" required className={styles.input} />
      <select name="role" aria-label="Role" className={styles.select} defaultValue="CASE_MANAGER">
        {EMPLOYEE_ROLES.map((r) => (
          <option key={r} value={r}>
            {r}
          </option>
        ))}
      </select>
      <input name="password" type="password" aria-label="Temporary password" placeholder="temporary password (≥14)" minLength={14} required className={styles.input} autoComplete="new-password" />
      <button type="submit" className={styles.button} disabled={pending}>
        Create
      </button>
    </form>
  );
}

export function ResetPwForm({
  locale,
  users,
}: {
  locale: string;
  users: { id: string; email: string }[];
}) {
  const [state, formAction, pending] = useActionState<AdminUserState, FormData>(
    adminResetPwAction.bind(null, locale),
    {},
  );
  return (
    <form action={formAction} className={styles.actionsRow}>
      {state.error ? <p className={styles.error}>{state.error}</p> : null}
      {state.ok ? <p className={styles.info}>Password reset; sessions revoked.</p> : null}
      <select name="userId" aria-label="Employee" className={styles.select}>
        {users.map((u) => (
          <option key={u.id} value={u.id}>
            {u.email}
          </option>
        ))}
      </select>
      <input name="password" type="password" aria-label="New temporary password" placeholder="new temporary password (≥14)" minLength={14} required className={styles.input} autoComplete="new-password" />
      <button type="submit" className={styles.button} disabled={pending}>
        Reset password
      </button>
    </form>
  );
}
