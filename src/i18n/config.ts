export const locales = ["en", "ar"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

export const localeDir: Record<Locale, "ltr" | "rtl"> = { en: "ltr", ar: "rtl" };
export const ogLocale: Record<Locale, string> = { en: "en_US", ar: "ar_AE" };

/**
 * Public URL for a path in a locale.
 * English has NO prefix (keeps the old site URLs). Arabic lives under /ar/.
 * Always pass paths with leading + trailing slash: "/about-us/".
 */
export function localePath(locale: Locale, path: string): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  if (locale === "en") return clean;
  return clean === "/" ? "/ar/" : `/ar${clean}`;
}

/**
 * Same page in the other language, for the language switch.
 * `pathname` may carry the internal /en/ prefix (English pages are rewritten to /en/... and
 * usePathname() returns that path while rendering), so any locale prefix is stripped first.
 */
export function switchLocalePath(current: Locale, pathname: string): string {
  const path = pathname.replace(/^\/(en|ar)(?=\/|$)/, "") || "/";
  return localePath(current === "ar" ? "en" : "ar", path);
}
