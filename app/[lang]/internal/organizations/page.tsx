import Link from "next/link";
import { resolveLocale } from "@/lib/page-meta";
import { getInternalDict } from "@/content/internal/dictionary";
import { requireEmployee } from "@/lib/internal/session";
import { can } from "@/lib/internal/rbac";
import { listOrganizations } from "@/lib/internal/services/queries";
import { createOrgAction } from "../actions";
import styles from "../internal.module.css";

export const dynamic = "force-dynamic";

export default async function OrganizationsPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale = resolveLocale(lang);
  const dict = getInternalDict(locale);
  const employee = await requireEmployee(locale, "view.dashboard");
  const orgs = await listOrganizations();

  return (
    <>
      <h1 className={styles.h1}>{dict.organizations.title}</h1>
      <div className={styles.card}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>{dict.organizations.workingName}</th>
              <th>{dict.organizations.country}</th>
              <th>{dict.organizations.verification}</th>
              <th>{dict.organizations.relatedCases}</th>
            </tr>
          </thead>
          <tbody>
            {orgs.map((o) => (
              <tr key={o.id}>
                <td>
                  <Link className={styles.link} href={`/${locale}/internal/organizations/${o.id}`}>
                    {o.workingName}
                  </Link>
                </td>
                <td>{o.country ?? "—"}</td>
                <td>
                  <span className={styles.pill}>{o.verificationStatus}</span>
                </td>
                <td>{o._count.cases}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {can(employee.role, "organization.manage") ? (
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>{dict.organizations.create}</h2>
          <form action={createOrgAction.bind(null, locale)} className={styles.actionsRow}>
            <input name="workingName" placeholder={dict.organizations.workingName} required className={styles.input} />
            <input name="country" placeholder={dict.organizations.country} className={styles.input} />
            <input name="officialEmail" placeholder="official email" className={styles.input} />
            <button type="submit" className={styles.button}>
              {dict.organizations.create}
            </button>
          </form>
        </div>
      ) : null}
    </>
  );
}
