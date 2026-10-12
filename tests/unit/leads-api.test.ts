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
  process.env.PRICE_PER_SQFT = "0.70";
  create.mockClear();
  update.mockClear();
  sendMail.mockClear();
  afterTasks.length = 0;
});

describe("POST /api/leads", () => {
  it("saves a valid lead with the price estimate (area × rate) and emails it after the response", async () => {
    const res = await post({ name: "Ali", phone: "+971500000000", propertyType: "villa", bedrooms: 3, areaSqft: 1250, source: "quote_form" });
    expect(res.status).toBe(200);
    expect(create).toHaveBeenCalledOnce();
    expect(create.mock.calls[0][0].data).toMatchObject({ name: "Ali", propertyType: "villa", bedrooms: 3, areaSqft: 1250, estimatedPrice: 875 });
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

  it("drops bedrooms for commercial but prices it by area like any property", async () => {
    await post({ name: "Co", phone: "+971500000000", propertyType: "commercial", bedrooms: 5, areaSqft: 2000 });
    expect(create.mock.calls[0][0].data).toMatchObject({ bedrooms: null, estimatedPrice: 1400 });
  });

  it("stores no price without an area or without a configured rate", async () => {
    await post({ name: "A", phone: "+971500000000", propertyType: "apartment", bedrooms: 2 });
    expect(create.mock.calls[0][0].data).toMatchObject({ estimatedPrice: null });
    delete process.env.PRICE_PER_SQFT;
    await post({ name: "B", phone: "+971500000000", propertyType: "apartment", areaSqft: 900 });
    expect(create.mock.calls[1][0].data).toMatchObject({ estimatedPrice: null });
  });

  it("stores the handover date and Google Ads attribution and puts them in the email", async () => {
    await post({
      name: "Ad", phone: "+971500000000", handoverDate: "2026-11-15",
      gclid: "abc123", utmSource: "google", utmMedium: "cpc", utmCampaign: "handover", utmTerm: "snagging dubai",
    });
    expect(create.mock.calls[0][0].data).toMatchObject({
      handoverDate: new Date("2026-11-15T00:00:00Z"),
      gclid: "abc123", utmSource: "google", utmMedium: "cpc", utmCampaign: "handover", utmTerm: "snagging dubai",
    });
    await runAfter();
    const { text } = sendMail.mock.calls[0][0];
    expect(text).toContain("Handover date: 2026-11-15");
    expect(text).toContain("abc123");
    expect(text).toContain("google / cpc / handover / snagging dubai");
  });

  it("rejects a malformed handover date", async () => {
    const res = await post({ name: "X", phone: "+971500000000", handoverDate: "next week" });
    expect(res.status).toBe(422);
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
