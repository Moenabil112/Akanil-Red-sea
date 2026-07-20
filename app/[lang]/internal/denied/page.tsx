import { resolveLocale } from "@/lib/page-meta";
import { getInternalDict } from "@/content/internal/dictionary";
import styles from "../internal.module.css";

export const dynamic = "force-dynamic";

export default async function DeniedPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dict = getInternalDict(resolveLocale(lang));
  return (
    <>
      <h1 className={styles.h1}>{dict.denied.title}</h1>
      <p className={styles.subtle}>{dict.denied.body}</p>
    </>
  );
}
