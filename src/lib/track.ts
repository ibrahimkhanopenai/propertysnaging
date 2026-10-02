/**
 * Conversion tracking helper (client side). Pushes to GTM dataLayer and GA4 gtag if present.
 * Events: generate_lead (forms), click_call, click_whatsapp. See docs/tracking.md.
 */
type Params = Record<string, string | number | undefined>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function track(event: string, params: Params = {}) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...params });
  if (typeof window.gtag === "function") window.gtag("event", event, params);
}
