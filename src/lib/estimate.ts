/** Shared by client calculator and server lead API. Studio (0) counts as 1 bedroom. */
export function estimatePrice(propertyType: string, bedrooms: number, perBedroom: number): number | null {
  if (propertyType === "commercial") return null;
  const beds = Math.max(1, Math.floor(bedrooms || 0));
  return beds * perBedroom;
}
