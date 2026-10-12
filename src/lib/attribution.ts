/**
 * Ad attribution (client side). The landing URL's Google Ads click id (gclid, or gbraid/wbraid
 * on iOS) and UTM tags are saved in localStorage, so a lead sent later — on another page or
 * another visit — can still be tied to the ad and keyword. Last ad click wins; kept 90 days
 * (Google Ads' longest click-through window). See docs/tracking.md.
 */
const KEY = "pi_attribution";
const TTL_MS = 90 * 24 * 60 * 60 * 1000;

export type Attribution = {
  gclid?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
};

const params: Array<[keyof Attribution, string[]]> = [
  ["gclid", ["gclid", "gbraid", "wbraid"]],
  ["utmSource", ["utm_source"]],
  ["utmMedium", ["utm_medium"]],
  ["utmCampaign", ["utm_campaign"]],
  ["utmTerm", ["utm_term"]],
];

/** Call once per page load (TrackClicks does). Only overwrites when the URL carries ad tags. */
export function captureAttribution() {
  try {
    const url = new URLSearchParams(window.location.search);
    const found: Attribution = {};
    for (const [field, names] of params) {
      const value = names.map((n) => url.get(n)).find(Boolean);
      if (value) found[field] = value.slice(0, field === "gclid" ? 255 : 191);
    }
    if (Object.keys(found).length) localStorage.setItem(KEY, JSON.stringify({ ...found, at: Date.now() }));
  } catch {
    // storage blocked (private mode) — leads still send, just without attribution
  }
}

/** Saved attribution for the lead payload ({} when none or expired). */
export function getAttribution(): Attribution {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return {};
    const { at, ...saved } = JSON.parse(raw) as Attribution & { at?: number };
    if (!at || Date.now() - at > TTL_MS) {
      localStorage.removeItem(KEY);
      return {};
    }
    return saved;
  } catch {
    return {};
  }
}
