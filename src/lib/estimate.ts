/** Smallest built-up area that gets a price (avoids "AED 1" for typos). */
export const MIN_PRICED_SQFT = 100;

/**
 * Shared by client calculator and server lead API: built-up area (sq ft) × rate per sq ft.
 * Same rate for every property type, commercial included (client, 2026-10-12).
 * null = no price shown: no/invalid area ("add the area"), or no rate configured ("price on request").
 */
export function estimatePrice(areaSqft: number | undefined, ratePerSqft: number | null): number | null {
  if (ratePerSqft === null) return null;
  if (!areaSqft || areaSqft < MIN_PRICED_SQFT) return null;
  return Math.round(areaSqft * ratePerSqft);
}
