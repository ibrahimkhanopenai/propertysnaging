import "server-only";

/** ratePerSqft is null when PRICE_PER_SQFT is missing/invalid → the form shows "price on request" instead of a wrong price. */
export type PricingConfig = { ratePerSqft: number | null; currency: string };

export function getPricing(): PricingConfig {
  const rate = Number(process.env.PRICE_PER_SQFT);
  return {
    ratePerSqft: Number.isFinite(rate) && rate > 0 ? rate : null,
    currency: process.env.PRICE_CURRENCY ?? "AED",
  };
}
