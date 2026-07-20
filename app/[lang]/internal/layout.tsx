import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { resolveLocale } from "@/lib/page-meta";
import { getInternalDict } from "@/content/internal/dictionary";
import { getCurrentEmployee } from "@/lib/internal/session";
import { can } from "@/lib/internal/rbac";
import { ROLE_LABELS } from "@/lib/internal/roles";
import { operationMode, pilotSuspended } from "@/lib/internal/env";
import { logoutAction } from "./actions";
import styles from "./internal.module.css";

// Internal pages are always dynamic and never statically generated.
export const dynamic = "force-dynamic";

// Belt-and-suspenders noindex at the route level (middleware also sets headers).
export const metadata: Metadata = {
  robots: { index: false, follow: false, nocache: true },
  title: "Akanil internal operations",
};

export default async function InternalLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale = resolveLocale(lang);
  const dict = getInternalDict(locale);
  const employee = await getCurrentEmployee();

  const nav = employee
    ? [
        { href: `/${locale}/internal`, label: dict.nav.dashboard },
        { href: `/${locale}/internal/cases`, label: dict.nav.cases },
        { href: `/${locale}/internal/organizations`, label: dict.nav.organizations },
        { href: `/${locale}/internal/work`, label: dict.nav.work },
        ...(can(employee.role, "audit.view")
          ? [{ href: `/${locale}/internal/audit`, label: dict.nav.audit }]
          : []),
        ...(can(employee.role, "readiness.view")
          ? [{ href: `/${locale}/internal/readiness`, label: dict.p4b.nav.readiness }]
          : []),
        ...(can(employee.role, "security.event.view")
          ? [{ href: `/${locale}/internal/security`, label: dict.p4b.nav.security }]
          : []),
        ...(can(employee.role, "user.manage")
          ? [{ href: `/${locale}/internal/admin/users`, label: dict.nav.users }]
          : []),
      ]
    : [];

  const mode = operationMode();
  const suspended = pilotSuspended();
  const banner = suspended
    ? { text: dict.p4b.banner.suspended, kind: "suspended" as const }
    : mode === "pilot"
      ? { text: dict.p4b.banner.pilot, kind: "pilot" as const }
      : mode === "validation"
        ? { text: dict.p4b.banner.validation, kind: "validation" as const }
        : null;

  return (
    <div className={styles.app}>
      {employee && banner ? (
        <div
          className={styles.envBanner}
          data-kind={banner.kind}
          role="status"
          aria-live="polite"
        >
          {banner.text}
        </div>
      ) : null}
      <header className={styles.header}>
        <div>
          <Link href={`/${locale}/internal`} className={styles.brand}>
            {dict.appName}
          </Link>
          <span className={styles.badge}>{dict.nav.signedInAs ? "INTERNAL" : ""}</span>
        </div>

        {employee ? (
          <>
            <nav className={styles.nav} aria-label={dict.appName}>
              {nav.map((item) => (
                <Link key={item.href} href={item.href} className={styles.navLink}>
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className={styles.userbox}>
              <span>
                {dict.nav.signedInAs} {employee.displayName} · {ROLE_LABELS[employee.role]}
              </span>
              <form action={logoutAction.bind(null, locale)}>
                <button type="submit" className={styles.logout}>
                  {dict.nav.logout}
                </button>
              </form>
            </div>
          </>
        ) : (
          <span className={styles.subtle}>{dict.restricted}</span>
        )}
      </header>
      <main className={styles.main}>{children}</main>
    </div>
  );
}
