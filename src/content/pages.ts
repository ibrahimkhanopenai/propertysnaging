import type { Locale } from "@/i18n/config";
import { locationsAr } from "./locations.ar";
import { locationsEn } from "./locations.en";
import { pagesAr } from "./pages.ar";
import { pagesEn } from "./pages.en";
import { servicesAr } from "./services.ar";
import { servicesEn } from "./services.en";
import type { PageContent, PageKey } from "./types";

const en: Record<PageKey, PageContent> = { ...pagesEn, ...servicesEn, ...locationsEn };
const ar: Record<PageKey, PageContent> = { ...pagesAr, ...servicesAr, ...locationsAr };

export const getPageContent = (key: PageKey, locale: Locale): PageContent => (locale === "ar" ? ar : en)[key];

export type { PageContent, PageKey };
