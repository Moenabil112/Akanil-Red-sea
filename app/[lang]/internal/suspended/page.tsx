import { redirect } from "next/navigation";
import { resolveLocale } from "@/lib/page-meta";
import { getInternalDict } from "@/content/internal/dictionary";
import { getCurrentEmployee } from "@/lib/internal/session";
import styles from "../internal.module.css";

export const dynamic = "force-dynamic";

export default async function SuspendedPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale = resolveLocale(lang);
  const dict = getInternalDict(locale);
  // Uses getCurrentEmployee (not requireEmployee) to avoid a redirect loop
  // while the pilot is suspended.
  const employee = await getCurrentEmployee();
  if (!employee) redirect(`/${locale}/internal/login`);

  return (
    <section className={styles.card} style={{ maxWidth: "40rem" }}>
      <h1 className={styles.h1}>{dict.p4b.suspended.title}</h1>
      <p>{dict.p4b.suspended.body}</p>
    </section>
  );
}
