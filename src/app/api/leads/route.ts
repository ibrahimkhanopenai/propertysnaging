import { NextResponse, after } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { estimatePrice } from "@/lib/estimate";
import { escapeHtml, sendMail } from "@/lib/mail";
import { getPricing } from "@/lib/pricing";
import { clientIp, createRateLimiter } from "@/lib/rate-limit";

const schema = z.object({
  name: z.string().trim().min(1).max(120),
  phone: z.string().trim().min(7).max(40),
  email: z.union([z.string().trim().email().max(191), z.literal("")]).optional(),
  propertyType: z.enum(["apartment", "villa", "commercial"]).optional(),
  location: z.string().trim().max(191).optional(),
  source: z.enum(["quote_form", "popup", "contact_page"]).optional(),
  bedrooms: z.number().int().min(0).max(20).optional(),
  areaSqft: z.number().int().min(0).max(1_000_000).optional(),
  emirate: z.string().max(60).optional(),
  message: z.string().max(2000).optional(),
  company: z.string().optional(), // honeypot
  locale: z.string().max(5).optional(),
  pagePath: z.string().max(255).optional(),
});

// 5 requests / 10 min / IP (single server — see src/lib/rate-limit.ts)
const limiter = createRateLimiter({ limit: 5, windowMs: 10 * 60_000 });

export async function POST(req: Request) {
  if (limiter.hit(clientIp(req.headers))) return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429 });

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "bad_json" }, { status: 400 });
  }
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ ok: false, error: "invalid" }, { status: 422 });
  const d = parsed.data;
  if (d.company) return NextResponse.json({ ok: true }); // bot: pretend success

  const { perBedroom, currency } = getPricing();
  const price = d.propertyType ? estimatePrice(d.propertyType, d.bedrooms ?? 1, perBedroom) : null;

  const lead = await prisma.lead.create({
    data: {
      name: d.name,
      phone: d.phone,
      email: d.email || null,
      propertyType: d.propertyType ?? null,
      bedrooms: !d.propertyType || d.propertyType === "commercial" ? null : (d.bedrooms ?? null),
      location: d.location || null,
      source: d.source ?? null,
      areaSqft: d.areaSqft ?? null,
      emirate: d.emirate || null,
      message: d.message || null,
      estimatedPrice: price,
      locale: d.locale || null,
      pagePath: d.pagePath || null,
    },
  });

  // Email is sent AFTER the response so the visitor never waits for SMTP.
  after(async () => {
    try {
      const rows: Array<[string, string]> = [
        ["Name", d.name],
        ["Phone", d.phone],
        ["Email", d.email || "-"],
        ["Source", d.source || "-"],
        ["Property", d.propertyType ? `${d.propertyType}${d.propertyType !== "commercial" ? ` · ${d.bedrooms === 0 ? "Studio" : `${d.bedrooms} BR`}` : ""}` : "-"],
        ["Location", d.location || "-"],
        ["Area (sq ft)", d.areaSqft ? String(d.areaSqft) : "-"],
        ["Emirate", d.emirate || "-"],
        ["Estimate", price === null ? "-" : `${currency} ${price}`],
        ["Message", d.message || "-"],
        ["Page", d.pagePath || "-"],
      ];
      const sent = await sendMail({
        subject: `New lead (${d.source === "popup" ? "callback pop-up" : "quote form"}): ${d.name}`,
        replyTo: d.email || undefined,
        text: rows.map(([k, v]) => `${k}: ${v}`).join("\n"),
        html: `<table cellpadding="6">${rows.map(([k, v]) => `<tr><td><b>${escapeHtml(k)}</b></td><td>${escapeHtml(v)}</td></tr>`).join("")}</table>`,
      });
      if (sent) await prisma.lead.update({ where: { id: lead.id }, data: { emailSent: true } });
    } catch (e) {
      console.error("[leads] email failed", e);
    }
  });

  return NextResponse.json({ ok: true });
}
