"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Locale } from "@/i18n/config";

/** Links to the same page in the other language (EN has no prefix, AR uses /ar/). */
export function LanguageSwitch({ locale, label, ariaLabel }: { locale: Locale; label: string; ariaLabel: string }) {
  const pathname = usePathname() || "/";
  const target =
    locale === "ar"
      ? pathname.replace(/^\/ar(?=\/|$)/, "") || "/"
      : `/ar${pathname === "/" ? "/" : pathname}`;
  return (
    <Link
      href={target}
      hrefLang={locale === "ar" ? "en" : "ar"}
      aria-label={ariaLabel}
      className="inline-flex min-h-11 items-center rounded-full px-3 text-[15px] font-semibold hover:bg-mist"
    >
      {label}
    </Link>
  );
}
