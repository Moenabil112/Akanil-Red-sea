import { redirect } from "next/navigation";
import { resolveLocale } from "@/lib/page-meta";
import { getInternalDict } from "@/content/internal/dictionary";
import { getCurrentEmployee } from "@/lib/internal/session";
import { internalEnabled } from "@/lib/internal/env";
import LoginForm from "./LoginForm";
import styles from "../internal.module.css";

export const dynamic = "force-dynamic";

export default async function LoginPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale = resolveLocale(lang);
  const dict = getInternalDict(locale);

  // Fail closed when the internal system is disabled.
  if (!internalEnabled()) {
    return (
      <div className={styles.loginWrap}>
        <div className={styles.loginCard}>
          <h1 className={styles.h1}>{dict.appName}</h1>
          <p className={styles.subtle}>{dict.restricted}</p>
        </div>
      </div>
    );
  }

  const employee = await getCurrentEmployee();
  if (employee) {
    redirect(
      employee.mustChangePassword
        ? `/${locale}/internal/change-password`
        : `/${locale}/internal`,
    );
  }

  return (
    <div className={styles.loginWrap}>
      <div className={styles.loginCard}>
        <h1 className={styles.h1}>{dict.login.title}</h1>
        <p className={styles.subtle} style={{ marginBottom: "1rem" }}>
          {dict.login.lead}
        </p>
        <LoginForm locale={locale} dict={dict} />
      </div>
    </div>
  );
}
