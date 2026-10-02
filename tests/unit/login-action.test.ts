import bcrypt from "bcryptjs";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { findUnique, createSession, ip } = vi.hoisted(() => ({
  findUnique: vi.fn(),
  createSession: vi.fn(async () => {}),
  ip: { current: "1.1.1.1" },
}));

vi.mock("@/lib/db", () => ({ prisma: { adminUser: { findUnique } } }));
vi.mock("@/lib/auth", () => ({ createSession, destroySession: vi.fn(), getSession: vi.fn() }));
vi.mock("next/headers", () => ({ headers: async () => new Headers({ "x-forwarded-for": ip.current }) }));
// The real cost-12 dummy hash (timing protection for unknown emails) is too slow for 20+ calls
vi.mock("bcryptjs", async (orig) => {
  const real = (await orig<{ default: typeof import("bcryptjs") }>()).default;
  return { default: { ...real, hash: async () => "dummy" } };
});
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
vi.mock("next/navigation", () => ({
  redirect: (to: string) => {
    throw Object.assign(new Error("NEXT_REDIRECT"), { to });
  },
}));

import { loginAction } from "@/app/admin/actions";

const hash = bcrypt.hashSync("right-password", 4);
const form = (email: string, password: string) => {
  const fd = new FormData();
  fd.set("email", email);
  fd.set("password", password);
  return fd;
};

beforeEach(() => {
  findUnique.mockReset();
  createSession.mockClear();
  findUnique.mockImplementation(async ({ where }: { where: { email: string } }) =>
    ["admin@pi.me", "reset@pi.me"].includes(where.email) ? { email: where.email, passwordHash: hash } : null,
  );
});

describe("loginAction", () => {
  it("logs in with the right password (email is case-insensitive)", async () => {
    ip.current = "1.0.0.1";
    await expect(loginAction({}, form(" Admin@PI.me ", "right-password"))).rejects.toMatchObject({ to: "/admin/" });
    expect(createSession).toHaveBeenCalledWith("admin@pi.me");
  });

  it("gives the same message for an unknown email and a wrong password", async () => {
    ip.current = "1.0.0.2";
    const a = await loginAction({}, form("nobody@pi.me", "x"));
    const b = await loginAction({}, form("admin@pi.me", "wrong"));
    expect(a).toEqual(b);
    expect(createSession).not.toHaveBeenCalled();
  });

  it("blocks an IP after 10 attempts, even with the right password", async () => {
    ip.current = "6.6.6.6";
    for (let i = 0; i < 10; i++) await loginAction({}, form(`guess${i}@pi.me`, "x"));
    expect(await loginAction({}, form("admin@pi.me", "right-password"))).toEqual({ error: expect.stringMatching(/Too many/) });
    expect(createSession).not.toHaveBeenCalled();
  });

  it("blocks one email being guessed from many IPs", async () => {
    for (let i = 0; i < 10; i++) {
      ip.current = `7.7.7.${i}`;
      await loginAction({}, form("target@pi.me", "x"));
    }
    ip.current = "7.7.8.1";
    expect(await loginAction({}, form("target@pi.me", "x"))).toEqual({ error: expect.stringMatching(/Too many/) });
  });

  it("a successful login resets the counter", async () => {
    // limiter state lives for the whole file, so this test uses its own IP and user
    ip.current = "8.8.8.8";
    for (let i = 0; i < 9; i++) await loginAction({}, form("reset@pi.me", "wrong"));
    await expect(loginAction({}, form("reset@pi.me", "right-password"))).rejects.toMatchObject({ to: "/admin/" });
    expect(await loginAction({}, form("reset@pi.me", "wrong"))).toEqual({ error: "Email or password is incorrect." });
  });
});
