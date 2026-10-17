export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\u0600-\u06ff\s-]/g, "")
    .trim()
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Ensures "/x/" form */
export function normalizePath(path: string): string {
  let p = path.trim();
  if (!p.startsWith("/")) p = `/${p}`;
  if (!p.endsWith("/")) p = `${p}/`;
  return p.replace(/\/{2,}/g, "/");
}

/**
 * Admin date-time fields (`<input type="datetime-local">`) are always UAE time (UTC+4, no DST), on the server
 * and in the browser. Using the browser's timezone to show the value while the server parsed it as its own (UTC)
 * moved the publish date by the admin's UTC offset on every save.
 */
const UAE_OFFSET_MS = 4 * 60 * 60 * 1000;

/** Date → "YYYY-MM-DDTHH:mm" in UAE time, for a datetime-local input. */
export function toUaeDateTimeInput(d?: Date | null): string {
  if (!d) return "";
  return new Date(d.getTime() + UAE_OFFSET_MS).toISOString().slice(0, 16);
}

/** "YYYY-MM-DDTHH:mm[:ss]" in UAE time → Date. Returns null for anything else. */
export function parseUaeDateTimeInput(value: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2})?$/.test(value)) return null;
  const d = new Date(`${value.length === 16 ? `${value}:00` : value}+04:00`);
  return Number.isNaN(d.getTime()) ? null : d;
}

export function readingMinutes(text: string): number {
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 220));
}
