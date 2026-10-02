/**
 * Sliding-window rate limiter kept in process memory.
 * Fine for the single self-hosted Node server (docs/deployment-local.md). If the site ever
 * runs on several instances, move the store to MySQL/Redis — each instance would count separately.
 */
export type RateLimiter = {
  /** Records a hit for `key` and returns true when the key is over the limit. */
  hit(key: string, now?: number): boolean;
  /** Clears a key (e.g. after a successful login). */
  reset(key: string): void;
};

export function createRateLimiter({ limit, windowMs, maxKeys = 10_000 }: { limit: number; windowMs: number; maxKeys?: number }): RateLimiter {
  const hits = new Map<string, number[]>();

  function prune(now: number) {
    for (const [k, ts] of hits) if (!ts.length || now - ts[ts.length - 1] >= windowMs) hits.delete(k);
  }

  return {
    hit(key, now = Date.now()) {
      const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
      recent.push(now);
      hits.set(key, recent);
      // Bound memory: drop expired keys, then the oldest ones if a flood of IPs keeps it full
      if (hits.size > maxKeys) {
        prune(now);
        for (const k of hits.keys()) {
          if (hits.size <= maxKeys) break;
          hits.delete(k);
        }
      }
      return recent.length > limit;
    },
    reset(key) {
      hits.delete(key);
    },
  };
}

/** Client IP from the reverse proxy header (first hop), or "local" in dev. */
export function clientIp(headers: Headers): string {
  return headers.get("x-forwarded-for")?.split(",")[0]?.trim() || headers.get("x-real-ip")?.trim() || "local";
}
