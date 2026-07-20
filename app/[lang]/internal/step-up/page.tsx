import { redirect } from "next/navigation";
import { resolveLocale } from "@/lib/page-meta";
import { getInternalDict } from "@/content/internal/dictionary";
import { getCurrentEmployee } from "@/lib/internal/session";
import styles from "../internal.module.css";
import StepUpForm from "./StepUpForm";

export const dynamic = "force-dynamic";

export default async function StepUpPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ next?: string }>;
}) {
  const { lang } = await params;
  const { next } = await searchParams;
  const locale = resolveLocale(lang);
  const dict = getInternalDict(locale);
  const employee = await getCurrentEmployee();
  if (!employee) redirect(`/${locale}/internal/login`);
  const safeNext = next && next.startsWith(`/${locale}/internal`) ? next : `/${locale}/internal`;

  return (
    <section className={styles.card} style={{ maxWidth: "34rem" }}>
      <h1 className={styles.h1}>{dict.p4b.stepUp.title}</h1>
      <p className={styles.subtle}>{dict.p4b.stepUp.lead}</p>
      <StepUpForm locale={locale} next={safeNext} dict={dict} />
    </section>
  );
}
