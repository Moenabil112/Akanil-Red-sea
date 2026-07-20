import Link from "next/link";
import { notFound } from "next/navigation";
import { resolveLocale } from "@/lib/page-meta";
import { getInternalDict } from "@/content/internal/dictionary";
import { requireEmployee } from "@/lib/internal/session";
import { can } from "@/lib/internal/rbac";
import { getOrganizationDetail } from "@/lib/internal/services/queries";
import { createContactAction, orgVerifyAction, orgArchiveAction } from "../../actions";
import styles from "../../internal.module.css";

export const dynamic = "force-dynamic";

const VERIFICATION = ["UNREVIEWED", "DECLARED", "PARTIALLY_VERIFIED", "VERIFIED", "CONFLICT_IDENTIFIED"];

export default async function OrganizationDetailPage({
  params,
}: {
  params: Promise<{ lang: string; organizationId: string }>;
}) {
  const { lang, organizationId } = await params;
  const locale = resolveLocale(lang);
  const dict = getInternalDict(locale);
  const employee = await requireEmployee(locale, "view.dashboard");
  const org = await getOrganizationDetail(organizationId);
  if (!org) notFound();
  const manage = can(employee.role, "organization.manage");

  return (
    <>
      <h1 className={styles.h1}>{org.workingName}</h1>
      <p className={styles.subtle}>
        <span className={styles.pill}>{org.verificationStatus}</span> · {org.country ?? "—"}
      </p>

      <div className={styles.card}>
        <h2 className={styles.cardTitle}>{dict.organizations.relatedCases}</h2>
        <ul className={styles.info}>
          {org.cases.map((c) => (
            <li key={c.id}>
              <Link className={styles.link} href={`/${locale}/internal/cases/${c.id}`}>
                {c.internalReference}
              </Link>{" "}
              — {c.title} [{c.status}]
            </li>
          ))}
          {org.cases.length === 0 ? <li>—</li> : null}
        </ul>
      </div>

      <div className={styles.card}>
        <h2 className={styles.cardTitle}>{dict.organizations.contacts}</h2>
        <ul className={styles.info}>
          {org.contacts.map((ct) => (
            <li key={ct.id}>
              {ct.fullName} — {ct.professionalRole ?? "—"} [{ct.authorityStatus}]
            </li>
          ))}
        </ul>
        {can(employee.role, "contact.manage") ? (
          <form action={createContactAction.bind(null, locale)} className={styles.actionsRow}>
            <input type="hidden" name="organizationId" value={org.id} />
            <input name="fullName" placeholder="full name" required className={styles.input} />
            <input name="professionalRole" placeholder="professional role" className={styles.input} />
            <input name="professionalEmail" placeholder="professional email" className={styles.input} />
            <button type="submit" className={styles.button}>
              {dict.detail.add}
            </button>
          </form>
        ) : null}
      </div>

      {manage ? (
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>{dict.organizations.verification}</h2>
          <form action={orgVerifyAction.bind(null, locale)} className={styles.actionsRow}>
            <input type="hidden" name="organizationId" value={org.id} />
            <input type="hidden" name="version" value={org.recordVersion} />
            <select name="verificationStatus" className={styles.select}>
              {VERIFICATION.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
            <button type="submit" className={styles.button}>
              {dict.detail.resolve}
            </button>
          </form>
          {org.verificationStatus !== "ARCHIVED" ? (
            <form action={orgArchiveAction.bind(null, locale)} style={{ marginTop: "0.5rem" }}>
              <input type="hidden" name="organizationId" value={org.id} />
              <input type="hidden" name="version" value={org.recordVersion} />
              <button type="submit" className={`${styles.button} ${styles.buttonGhost}`}>
                {dict.organizations.archive}
              </button>
            </form>
          ) : null}
        </div>
      ) : null}
    </>
  );
}
