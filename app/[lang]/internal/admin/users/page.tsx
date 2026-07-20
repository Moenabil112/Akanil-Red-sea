import { resolveLocale } from "@/lib/page-meta";
import { getInternalDict } from "@/content/internal/dictionary";
import { requireEmployee } from "@/lib/internal/session";
import { listEmployees } from "@/lib/internal/services/users";
import { ROLE_LABELS } from "@/lib/internal/roles";
import { adminDisableUserAction } from "../../actions";
import { CreateUserForm, ResetPwForm } from "./UserAdminForms";
import styles from "../../internal.module.css";

export const dynamic = "force-dynamic";

export default async function UsersAdminPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale = resolveLocale(lang);
  const dict = getInternalDict(locale);
  await requireEmployee(locale, "user.manage");
  const users = await listEmployees();

  return (
    <>
      <h1 className={styles.h1}>{dict.users.title}</h1>
      <p className={styles.subtle}>
        {dict.users.adminOnly} {dict.users.noExternal}
      </p>

      <div className={styles.card}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>{dict.users.email}</th>
              <th>{dict.users.name}</th>
              <th>{dict.users.role}</th>
              <th>{dict.users.status}</th>
              <th>{dict.users.lastLogin}</th>
              <th>{dict.users.mustChange}</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>{u.email}</td>
                <td>{u.displayName}</td>
                <td>{ROLE_LABELS[u.role]}</td>
                <td>
                  <span className={styles.pill}>{u.status}</span>
                </td>
                <td>{u.lastLoginAt ? u.lastLoginAt.toISOString().slice(0, 10) : "—"}</td>
                <td>{u.mustChangePassword ? "yes" : "no"}</td>
                <td>
                  {u.status !== "DISABLED" ? (
                    <form action={adminDisableUserAction.bind(null, locale)}>
                      <input type="hidden" name="userId" value={u.id} />
                      <button type="submit" className={`${styles.button} ${styles.buttonGhost}`}>
                        Disable
                      </button>
                    </form>
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={styles.card}>
        <h2 className={styles.cardTitle}>Create employee account</h2>
        <CreateUserForm locale={locale} />
      </div>

      <div className={styles.card}>
        <h2 className={styles.cardTitle}>Reset password</h2>
        <ResetPwForm locale={locale} users={users.map((u) => ({ id: u.id, email: u.email }))} />
      </div>
    </>
  );
}
