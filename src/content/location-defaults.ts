import { locationsAr } from "./locations.ar";
import { locationsEn, type LocationKey } from "./locations.en";

/**
 * First fill for Admin → Locations (used by `npm run db:seed` and the admin "Load defaults" buttons).
 * After that, everything is edited in the admin — this file is only the starting point.
 *
 * Communities: well-known developments in each emirate where handover snagging is common.
 * Replace / extend them in the admin with the projects you are actually inspecting.
 */
export const suggestedCommunities: Record<LocationKey, Array<{ name: string; nameAr: string; developer: string }>> = {
  dubai: [
    { name: "Dubai Hills Estate", nameAr: "دبي هيلز إستيت", developer: "Emaar" },
    { name: "Emaar Beachfront", nameAr: "إعمار بيتشفرونت", developer: "Emaar" },
    { name: "The Valley", nameAr: "ذا فالي", developer: "Emaar" },
    { name: "Arabian Ranches III", nameAr: "المرابع العربية 3", developer: "Emaar" },
    { name: "DAMAC Lagoons", nameAr: "داماك لاجونز", developer: "DAMAC" },
    { name: "DAMAC Hills 2", nameAr: "داماك هيلز 2", developer: "DAMAC" },
    { name: "Sobha Hartland II", nameAr: "شوبا هارتلاند 2", developer: "Sobha Realty" },
    { name: "Tilal Al Ghaf", nameAr: "تلال الغاف", developer: "Majid Al Futtaim" },
  ],
  abudhabi: [
    { name: "Yas Acres", nameAr: "ياس إيكرز", developer: "Aldar" },
    { name: "Saadiyat Lagoons", nameAr: "السعديات لاجونز", developer: "Aldar" },
    { name: "Noya, Yas Island", nameAr: "نويا، جزيرة ياس", developer: "Aldar" },
    { name: "Reem Hills", nameAr: "ريم هيلز", developer: "Q Properties" },
  ],
  sharjah: [
    { name: "Aljada", nameAr: "الجادة", developer: "Arada" },
    { name: "Masaar", nameAr: "مسار", developer: "Arada" },
    { name: "Tilal City", nameAr: "مدينة تلال", developer: "Tilal Properties" },
    { name: "Sharjah Sustainable City", nameAr: "مدينة الشارقة المستدامة", developer: "Diamond Developers" },
  ],
  ajman: [
    { name: "Al Zorah", nameAr: "الزوراء", developer: "Al Zorah Development" },
    { name: "Ajman One", nameAr: "عجمان ون", developer: "Ajman One" },
  ],
  rak: [
    { name: "Al Marjan Island", nameAr: "جزيرة المرجان", developer: "Marjan" },
    { name: "Mina Al Arab", nameAr: "ميناء العرب", developer: "RAK Properties" },
    { name: "Al Hamra Village", nameAr: "قرية الحمرا", developer: "Al Hamra" },
  ],
  fujairah: [],
  uaq: [{ name: "Sobha Siniya Island", nameAr: "جزيرة السينية من شوبا", developer: "Sobha Realty" }],
};

/** Areas = the current lists in content/locations.*.ts (Arabic paired by position when the lists match). */
export function defaultAreas(key: LocationKey): Array<{ name: string; nameAr: string | null }> {
  const en = locationsEn[key].communities ?? [];
  const ar = locationsAr[key].communities ?? [];
  return en.map((name, i) => ({ name, nameAr: ar.length === en.length ? ar[i] : null }));
}

export const isLocationKey = (k: string): k is LocationKey => k in locationsEn;
