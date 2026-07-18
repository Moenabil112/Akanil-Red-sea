import type { Locale } from "@/content/types";

export const locales: Locale[] = ["ar", "fr", "en"];

export const defaultLocale: Locale = "ar";

export function isLocale(value: string): value is Locale {
  return (locales as string[]).includes(value);
}

export function dirFor(locale: Locale): "rtl" | "ltr" {
  return locale === "ar" ? "rtl" : "ltr";
}
