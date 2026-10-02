import "server-only";
import type { Locale } from "@/i18n/config";
import en, { type Dictionary } from "./en";
import ar from "./ar";

const dictionaries: Record<Locale, Dictionary> = { en, ar };
export const getDictionary = (locale: Locale): Dictionary => dictionaries[locale];
export type { Dictionary };
