import { beforeEach, describe, expect, it, vi } from "vitest";

const jar = vi.hoisted(() => new Map<string, { value: string; options?: Record<string, unknown> }>());

vi.mock("next/headers", () => ({
  cookies: async () => ({
    get: (name: string) => (jar.has(name) ? { name, value: jar.get(name)!.value } : undefined),
    set: (name: string, value: string, options?: Record<string, unknown>) => jar.set(name, { value, options }),
    delete: (name: string) => jar.delete(name),
  }),
}));

import { createSession, destroySession, getSession, SESSION_COOKIE } from "@/lib/auth";

beforeEach(() => jar.clear());

describe("admin session", () => {
  it("round-trips the email in an httpOnly cookie", async () => {
    await createSession("admin@propertyinspectors.me");
    expect(jar.get(SESSION_COOKIE)?.options).toMatchObject({ httpOnly: true, sameSite: "lax", path: "/", maxAge: 43200 });
    expect(await getSession()).toEqual({ email: "admin@propertyinspectors.me" });
  });

  it("returns null with no cookie, a tampered token, or after logout", async () => {
    expect(await getSession()).toBeNull();
    await createSession("a@b.c");
    jar.set(SESSION_COOKIE, { value: jar.get(SESSION_COOKIE)!.value.slice(0, -2) + "xx" });
    expect(await getSession()).toBeNull();
    await createSession("a@b.c");
    await destroySession();
    expect(await getSession()).toBeNull();
  });

  it("refuses to run with a weak AUTH_SECRET", async () => {
    vi.stubEnv("AUTH_SECRET", "short");
    await expect(createSession("a@b.c")).rejects.toThrow(/AUTH_SECRET/);
    vi.unstubAllEnvs();
  });
});
