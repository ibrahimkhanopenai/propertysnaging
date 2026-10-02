import { beforeEach, describe, expect, it, vi } from "vitest";

const { create, update, sendMail, afterTasks } = vi.hoisted(() => ({
  update: vi.fn(async () => ({})),
  create: vi.fn(async ({ data }: { data: Record<string, unknown> }) => ({ id: 1, ...data })),
  sendMail: vi.fn<(o: { subject: string; text: string; html: string }) => Promise<boolean>>(async () => true),
  afterTasks: [] as Array<() => Promise<void>>,
}));

vi.mock("@/lib/db", () => ({ prisma: { lead: { create, update } } }));
vi.mock("@/lib/mail", async (orig) => ({ ...(await orig<typeof import("@/lib/mail")>()), sendMail }));
vi.mock("next/server", async (orig) => ({
  ...(await orig<typeof import("next/server")>()),
  after: (fn: () => Promise<void>) => afterTasks.push(fn),
}));

import { POST } from "@/app/api/leads/route";

let ipCounter = 0;
const post = (body: unknown, ip = `10.0.0.${++ipCounter}`) =>
  POST(
    new Request("https://x/api/leads/", {
      method: "POST",
      headers: { "x-forwarded-for": ip },
      body: typeof body === "string" ? body : JSON.stringify(body),
    }),
  );
const runAfter = () => Promise.all(afterTasks.map((t) => t()));

beforeEach(() => {
  create.mockClear();
  update.mockClear();
  sendMail.mockClear();
  afterTasks.length = 0;
});

describe("POST /api/leads", () => {
  it("saves a valid lead with the price estimate and emails it after the response", async () => {
    const res = await post({ name: "Ali", phone: "+971500000000", propertyType: "villa", bedrooms: 3, source: "quote_form" });
    expect(res.status).toBe(200);
    expect(create).toHaveBeenCalledOnce();
    expect(create.mock.calls[0][0].data).toMatchObject({ name: "Ali", propertyType: "villa", bedrooms: 3, estimatedPrice: 30 });
    expect(sendMail).not.toHaveBeenCalled();
    await runAfter();
    expect(sendMail).toHaveBeenCalledOnce();
    expect(update).toHaveBeenCalledWith({ where: { id: 1 }, data: { emailSent: true } });
  });

  it("escapes HTML in the notification email", async () => {
    await post({ name: "<b>x</b>", phone: "+971500000000" });
    await runAfter();
    const { html } = sendMail.mock.calls[0][0];
    expect(html).not.toContain("<b>x</b>");
    expect(html).toContain("&lt;b&gt;");
  });

  it("drops bedrooms for commercial and stores no price", async () => {
    await post({ name: "Co", phone: "+971500000000", propertyType: "commercial", bedrooms: 5 });
    expect(create.mock.calls[0][0].data).toMatchObject({ bedrooms: null, estimatedPrice: null });
  });

  it("rejects bad JSON and invalid fields", async () => {
    expect((await post("{not json")).status).toBe(400);
    expect((await post({ name: "", phone: "1" })).status).toBe(422);
    expect((await post({ name: "A", phone: "+971500000000", propertyType: "castle" })).status).toBe(422);
    expect(create).not.toHaveBeenCalled();
  });

  it("pretends success for bots that fill the honeypot", async () => {
    const res = await post({ name: "Bot", phone: "+971500000000", company: "spam" });
    expect(await res.json()).toEqual({ ok: true });
    expect(create).not.toHaveBeenCalled();
  });

  it("rate limits after 5 requests per IP", async () => {
    const codes: number[] = [];
    for (let i = 0; i < 6; i++) codes.push((await post({ name: "A", phone: "+971500000000" }, "9.9.9.9")).status);
    expect(codes).toEqual([200, 200, 200, 200, 200, 429]);
  });
});
