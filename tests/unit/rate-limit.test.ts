import { describe, expect, it } from "vitest";
import { clientIp, createRateLimiter } from "@/lib/rate-limit";

describe("createRateLimiter", () => {
  it("blocks after the limit inside the window", () => {
    const l = createRateLimiter({ limit: 2, windowMs: 1000 });
    expect(l.hit("ip", 0)).toBe(false);
    expect(l.hit("ip", 1)).toBe(false);
    expect(l.hit("ip", 2)).toBe(true);
  });
  it("allows again once the window passes", () => {
    const l = createRateLimiter({ limit: 1, windowMs: 1000 });
    l.hit("ip", 0);
    expect(l.hit("ip", 10)).toBe(true);
    expect(l.hit("ip", 2000)).toBe(false);
  });
  it("counts keys separately and can reset", () => {
    const l = createRateLimiter({ limit: 1, windowMs: 1000 });
    l.hit("a", 0);
    expect(l.hit("b", 0)).toBe(false);
    l.reset("a");
    expect(l.hit("a", 1)).toBe(false);
  });
  it("never keeps more than maxKeys", () => {
    const l = createRateLimiter({ limit: 1, windowMs: 1000, maxKeys: 3 });
    for (let i = 0; i < 10; i++) l.hit(`ip${i}`, 0);
    // the oldest key was evicted, so it starts fresh
    expect(l.hit("ip0", 1)).toBe(false);
  });
});

describe("clientIp", () => {
  it("uses the first x-forwarded-for hop", () => {
    expect(clientIp(new Headers({ "x-forwarded-for": "1.1.1.1, 10.0.0.1" }))).toBe("1.1.1.1");
  });
  it("falls back to x-real-ip, then local", () => {
    expect(clientIp(new Headers({ "x-real-ip": "2.2.2.2" }))).toBe("2.2.2.2");
    expect(clientIp(new Headers())).toBe("local");
  });
});
