import { beforeEach, describe, expect, it, vi } from "vitest";

const { session, writeFile, mkdir } = vi.hoisted(() => ({
  session: { current: { email: "a@b.c" } as { email: string } | null },
  writeFile: vi.fn(async () => {}),
  mkdir: vi.fn(async () => undefined),
}));

vi.mock("@/lib/auth", () => ({ getSession: async () => session.current }));
vi.mock("fs/promises", () => ({ writeFile, mkdir, default: { writeFile, mkdir } }));

import { POST } from "@/app/api/admin/upload/route";

const PNG = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

const upload = (file?: File) => {
  const fd = new FormData();
  if (file) fd.set("file", file);
  return POST(new Request("https://x/api/admin/upload/", { method: "POST", body: fd }));
};

beforeEach(() => {
  session.current = { email: "a@b.c" };
  writeFile.mockClear();
});

describe("POST /api/admin/upload", () => {
  it("requires an admin session", async () => {
    session.current = null;
    expect((await upload(new File([PNG], "a.png", { type: "image/png" }))).status).toBe(401);
  });

  it("stores a real image under a dated, slugged, unguessable name", async () => {
    const res = await upload(new File([PNG], "Cracked Tile!.png", { type: "image/png" }));
    expect(res.status).toBe(200);
    const { url } = await res.json();
    expect(url).toMatch(/^\/uploads\/\d{4}\/\d{2}\/cracked-tile-[0-9a-f]{6}\.png$/);
    expect(writeFile).toHaveBeenCalledOnce();
  });

  it("rejects missing files, wrong types, fake images and big files", async () => {
    expect((await upload()).status).toBe(400);
    expect((await upload(new File(["<svg/>"], "a.svg", { type: "image/svg+xml" }))).status).toBe(400);
    expect((await upload(new File(["<html>"], "a.png", { type: "image/png" }))).status).toBe(400);
    const big = new Uint8Array(5 * 1024 * 1024 + 1);
    big.set(PNG);
    expect((await upload(new File([big], "a.png", { type: "image/png" }))).status).toBe(400);
    expect(writeFile).not.toHaveBeenCalled();
  });
});
