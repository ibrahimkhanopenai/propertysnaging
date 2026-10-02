import "server-only";

export type PricingConfig = { perBedroom: number; currency: string };

export function getPricing(): PricingConfig {
  const perBedroom = Number(process.env.PRICE_PER_BEDROOM ?? 10);
  return {
    perBedroom: Number.isFinite(perBedroom) && perBedroom > 0 ? perBedroom : 10,
    currency: process.env.PRICE_CURRENCY ?? "AED",
  };
}
