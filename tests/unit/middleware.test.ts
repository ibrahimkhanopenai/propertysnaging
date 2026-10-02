import { SignJWT } from "jose";
import { NextRequest } from "next/server";
import { describe, expect, it } from "vitest";
import { middleware } from "@/middleware";

const req = (p: string, cookie?: string) =>
  new NextRequest(new URL(p, "https://propertyinspectors.me"), cookie ? { headers: { cookie: `pi_admin=${cookie}` } } : undefined);

const token = (secret = process.env.AUTH_SECRET!) =>
  new SignJWT({ email: "a@b.c" }).setProtectedHeader({ alg: "HS256" }).setExpirationTime("1h").sign(new TextEncoder().encode(secret));

describe("i18n routing", () => {
  it("rewrites English URLs to /en internally without changing the public URL", async () => {
    const res = await middleware(req("/about-us/"));
    expect(res.headers.get("x-middleware-rewrite")).toBe("https://propertyinspectors.me/en/about-us/");
  });
  it("301s /en/... so English never has two URLs", async () => {
    const res = await middleware(req("/en/about-us/"));
    expect(res.status).toBe(301);
    expect(res.headers.get("location")).toBe("https://propertyinspectors.me/about-us/");
    expect((await middleware(req("/en"))).headers.get("location")).toBe("https://propertyinspectors.me/");
  });
  it("serves Arabic as-is", async () => {
    const res = await middleware(req("/ar/about-us/"));
    expect(res.headers.get("x-middleware-rewrite")).toBeNull();
    expect(res.headers.get("location")).toBeNull();
  });
});

describe("admin protection", () => {
  it("lets the login page through", async () => {
    expect((await middleware(req("/admin/login/"))).headers.get("location")).toBeNull();
  });
  it("redirects without a valid session", async () => {
    for (const cookie of [undefined, "garbage", await token("another-secret-that-is-at-least-32-chars!!")]) {
      const res = await middleware(req("/admin/posts/?x=1", cookie));
      expect(res.headers.get("location")).toBe("https://propertyinspectors.me/admin/login/");
    }
  });
  it("allows a valid session", async () => {
    const res = await middleware(req("/admin/", await token()));
    expect(res.headers.get("location")).toBeNull();
  });
});
