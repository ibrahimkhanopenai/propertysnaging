import { site } from "@/lib/site";

/**
 * Admin → Settings: every editable key, its default (from site.ts), label and validation.
 * Pure module (no DB) so the admin form, the save action and the tests share one definition.
 * A key with no row in the Setting table uses its default.
 */
export type SettingType = "text" | "phone" | "digits" | "email" | "link";
export type SettingField = { key: string; label: string; type: SettingType; help?: string; defaultValue: string; max?: number };

const statLabels: Record<(typeof site.stats)[number]["key"], string> = {
  inspections: "Properties inspected",
  years: "Years of experience",
  points: "Inspection points checked",
  turnaround: "Report turnaround",
  hours: "Inspection hours per engineer",
};

export const statKey = (k: string) => `stat.${k}`;

export const settingGroups: Array<{ title: string; text?: string; fields: SettingField[] }> = [
  {
    title: "Contact",
    text: "Used in the header, top bar, footer, floating buttons, contact page, forms and Google structured data.",
    fields: [
      { key: "phone", label: "Phone (for call links)", type: "phone", help: "International format, no spaces, e.g. +971581551637", defaultValue: site.phone },
      { key: "phoneDisplay", label: "Phone (as shown on the site)", type: "text", help: "e.g. +971 58 155 1637", defaultValue: site.phoneDisplay, max: 40 },
      { key: "whatsapp", label: "WhatsApp number", type: "digits", help: "Digits only with country code, no + or spaces, e.g. 971581551637", defaultValue: site.whatsapp },
      { key: "email", label: "Email", type: "email", defaultValue: site.email },
    ],
  },
  {
    title: "Office address",
    fields: [
      { key: "addressStreet", label: "Street / building", type: "text", defaultValue: site.address.street, max: 200 },
      { key: "addressLocality", label: "Area", type: "text", defaultValue: site.address.locality, max: 80 },
      { key: "addressCity", label: "City", type: "text", defaultValue: site.address.city, max: 80 },
      { key: "mapsUrl", label: "Google Maps link", type: "link", defaultValue: site.mapsUrl },
      { key: "hours", label: "Opening hours (for Google)", type: "text", help: "Format: Mo-Sa 08:00-20:00", defaultValue: site.hours, max: 80 },
    ],
  },
  {
    title: "Key figures",
    text: "Shown on the homepage and every location page. Client rule: genuine numbers only.",
    fields: site.stats.map((s) => ({ key: statKey(s.key), label: statLabels[s.key], type: "text" as const, help: "e.g. 15,000+", defaultValue: s.value, max: 20 })),
  },
  {
    title: "Links",
    fields: [
      { key: "googleReviewUrl", label: "Google reviews link", type: "link", help: "Your Google Business Profile or “write a review” link", defaultValue: site.googleReviewUrl },
      {
        key: "sampleReportUrl",
        label: "Sample report link",
        type: "link",
        help: "A Google Drive “view only” link, or a path on this site such as /downloads/…pdf. Opens in a new tab.",
        defaultValue: site.pdfs.sampleReport,
      },
    ],
  },
];

export const settingFields: SettingField[] = settingGroups.flatMap((g) => g.fields);

/** Returns an error message, or null when the value is valid. */
export function validateSetting(field: SettingField, value: string): string | null {
  if (value.length > (field.max ?? 1000)) return `${field.label}: too long (max ${field.max ?? 1000} characters).`;
  switch (field.type) {
    case "phone":
      return /^\+\d{8,15}$/.test(value) ? null : `${field.label}: use + and digits only, e.g. +971581551637.`;
    case "digits":
      return /^\d{8,15}$/.test(value) ? null : `${field.label}: digits only with country code, e.g. 971581551637.`;
    case "email":
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? null : `${field.label}: enter a valid email address.`;
    case "link":
      return /^(https:\/\/\S+|\/\S*)$/.test(value) ? null : `${field.label}: must start with https:// or /.`;
    default:
      return /[<>]/.test(value) ? `${field.label}: < and > are not allowed.` : null;
  }
}
