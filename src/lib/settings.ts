import "server-only";
import { cache } from "react";
import { prisma } from "@/lib/db";
import { site } from "@/lib/site";
import { settingFields, statKey } from "@/lib/settings-fields";

/**
 * Site settings = defaults from site.ts, overridden by Admin → Settings (Setting table).
 * Server components call `await getSettings()`; `cache` dedupes it within one render, and pages
 * are regenerated when settings are saved (revalidatePath in admin actions). Falls back to the
 * defaults when MySQL is unreachable, so public pages always render.
 */
export type SiteSettings = {
  phone: string;
  phoneDisplay: string;
  whatsapp: string;
  email: string;
  address: { street: string; locality: string; city: string; country: string };
  mapsUrl: string;
  hours: string;
  googleReviewUrl: string;
  sampleReportUrl: string;
  stats: Array<{ key: (typeof site.stats)[number]["key"]; value: string }>;
};

/** Pure: builds the settings from DB rows (exported for tests). */
export function mergeSettings(rows: Array<{ key: string; value: string }>): SiteSettings {
  const saved = new Map(rows.map((r) => [r.key, r.value.trim()]));
  const get = (key: string) => saved.get(key) || settingFields.find((f) => f.key === key)!.defaultValue;
  return {
    phone: get("phone"),
    phoneDisplay: get("phoneDisplay"),
    whatsapp: get("whatsapp"),
    email: get("email"),
    address: { street: get("addressStreet"), locality: get("addressLocality"), city: get("addressCity"), country: site.address.country },
    mapsUrl: get("mapsUrl"),
    hours: get("hours"),
    googleReviewUrl: get("googleReviewUrl"),
    sampleReportUrl: get("sampleReportUrl"),
    stats: site.stats.map((s) => ({ key: s.key, value: get(statKey(s.key)) })),
  };
}

export const getSettings = cache(async (): Promise<SiteSettings> => {
  try {
    return mergeSettings(await prisma.setting.findMany());
  } catch {
    return mergeSettings([]);
  }
});

/** wa.me link for the configured WhatsApp number */
export const waLink = (s: Pick<SiteSettings, "whatsapp">, text?: string) =>
  `https://wa.me/${s.whatsapp}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
