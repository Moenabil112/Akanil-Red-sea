import { redirect } from "next/navigation";
import { resolveLocale } from "@/lib/page-meta";
import { getInternalDict } from "@/content/internal/dictionary";
import { getCurrentEmployee } from "@/lib/internal/session";
import ChangePasswordForm from "./ChangePasswordForm";
import styles from "../internal.module.css";

export const dynamic = "force-dynamic";

export default async function ChangePasswordPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale = resolveLocale(lang);
  const dict = getInternalDict(locale);
  const employee = await getCurrentEmployee();
  if (!employee) redirect(`/${locale}/internal/login`);

  return (
    <div className={styles.loginWrap}>
      <div className={styles.loginCard}>
        <h1 className={styles.h1}>{dict.changePassword.title}</h1>
        <p className={styles.subtle} style={{ marginBottom: "1rem" }}>
          {dict.changePassword.lead}
        </p>
        <ChangePasswordForm locale={locale} dict={dict} />
      </div>
    </div>
  );
}
