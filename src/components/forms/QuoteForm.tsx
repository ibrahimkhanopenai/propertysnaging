"use client";

import { useId, useMemo, useState } from "react";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";
import { estimatePrice } from "@/lib/estimate";
import { track } from "@/lib/track";
import { cn } from "@/lib/utils";

type Props = {
  t: Dictionary["quote"];
  locale: Locale;
  perBedroom: number;
  currency: string;
  whatsapp: string;
  /** Stored with the lead + sent with the conversion event */
  source?: "quote_form" | "contact_page";
  className?: string;
};

// Purple = client rule for forms (docs/design-system.md)
const field =
  "h-12 w-full rounded-xl border border-brand-line bg-white px-3.5 text-[15px] text-ink outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20";

/**
 * Quote / booking form with live price.
 * Submit: opens WhatsApp (inside the click, so popup blockers allow it), posts the lead to
 * /api/leads/ in the background (MySQL + email) and fires a `generate_lead` conversion.
 */
export function QuoteForm({ t, locale, perBedroom, currency, whatsapp, source = "quote_form", className }: Props) {
  const id = useId();
  const [type, setType] = useState<"apartment" | "villa" | "commercial">("apartment");
  const [bedrooms, setBedrooms] = useState(1);
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error" | "invalid">("idle");

  const price = useMemo(() => estimatePrice(type, bedrooms, perBedroom), [type, bedrooms, perBedroom]);
  const priceLabel = price === null ? t.onRequest : `${currency} ${price.toLocaleString("en-US")}`;

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data = {
      name: String(fd.get("name") ?? "").trim(),
      phone: String(fd.get("phone") ?? "").trim(),
      email: String(fd.get("email") ?? "").trim(),
      propertyType: type,
      bedrooms,
      location: String(fd.get("location") ?? "").trim(),
      areaSqft: Number(String(fd.get("area") ?? "").replace(/[^\d]/g, "")) || undefined,
      emirate: String(fd.get("emirate") ?? ""),
      message: String(fd.get("message") ?? "").trim(),
      company: String(fd.get("company") ?? ""), // honeypot
      source,
      locale,
      pagePath: window.location.pathname,
    };
    if (!data.name || data.phone.replace(/\D/g, "").length < 7) {
      setStatus("invalid");
      return;
    }

    const bedLabel = bedrooms === 0 ? t.studio : `${bedrooms} ${t.br}`;
    const lines = [
      t.waIntro,
      `${t.name}: ${data.name}`,
      `${t.phone}: ${data.phone}`,
      `${t.propertyType}: ${t.types[type]}${type !== "commercial" ? ` (${bedLabel})` : ""}`,
      data.location ? `${t.location}: ${data.location}` : "",
      `${t.emirate}: ${data.emirate}`,
      data.areaSqft ? `${t.area}: ${data.areaSqft}` : "",
      `${t.estimated}: ${priceLabel}`,
      data.message ? `${t.message}: ${data.message}` : "",
    ].filter(Boolean);
    window.open(`https://wa.me/${whatsapp}?text=${encodeURIComponent(lines.join("\n"))}`, "_blank", "noopener");

    setStatus("sending");
    fetch("/api/leads/", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data), keepalive: true })
      .then((r) => {
        setStatus(r.ok ? "done" : "error");
        if (r.ok) track("generate_lead", { form_id: source, property_type: type, value: price ?? undefined, currency });
      })
      .catch(() => setStatus("error"));
  }

  return (
    <form onSubmit={onSubmit} noValidate className={cn("relative flex flex-col gap-5", className)}>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-2 text-sm font-semibold">
          {t.propertyType}
          <select className={field} value={type} onChange={(e) => setType(e.target.value as typeof type)}>
            <option value="apartment">{t.types.apartment}</option>
            <option value="villa">{t.types.villa}</option>
            <option value="commercial">{t.types.commercial}</option>
          </select>
        </label>
        <label className="flex flex-col gap-2 text-sm font-semibold">
          {t.bedrooms}
          <select className={field} value={bedrooms} onChange={(e) => setBedrooms(Number(e.target.value))} disabled={type === "commercial"}>
            <option value={0}>{t.studio}</option>
            {[1, 2, 3, 4, 5, 6, 7].map((n) => (
              <option key={n} value={n}>{n} {t.br}</option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-2 text-sm font-semibold">
          {t.location}
          <input name="location" placeholder={t.locationPlaceholder} className={field} />
        </label>
        <label className="flex flex-col gap-2 text-sm font-semibold">
          {t.emirate}
          <select name="emirate" className={field} defaultValue={t.emirates[0]}>
            {t.emirates.map((em) => (
              <option key={em} value={em}>{em}</option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-2 text-sm font-semibold">
          {t.name}
          <input name="name" autoComplete="name" required className={field} />
        </label>
        <label className="flex flex-col gap-2 text-sm font-semibold">
          {t.phone}
          <input name="phone" type="tel" autoComplete="tel" required dir="ltr" placeholder="+971" className={field} />
        </label>
        <label className="flex flex-col gap-2 text-sm font-semibold">
          {t.area}
          <input name="area" inputMode="numeric" placeholder={t.areaPlaceholder} className={field} />
        </label>
        <label className="flex flex-col gap-2 text-sm font-semibold">
          {t.email}
          <input name="email" type="email" autoComplete="email" className={field} />
        </label>
        <label className="flex flex-col gap-2 text-sm font-semibold sm:col-span-2">
          {t.message}
          <textarea name="message" rows={2} className={cn(field, "h-auto py-3")} />
        </label>
        <div aria-hidden="true" className="absolute start-[-9999px] h-0 w-0 overflow-hidden">
          <label htmlFor={`${id}-company`}>Company</label>
          <input id={`${id}-company`} name="company" tabIndex={-1} autoComplete="off" />
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-brand-tint px-5 py-4">
        <div>
          <p className="text-[13px] text-muted">{t.estimated}</p>
          <p className="font-display text-3xl font-extrabold text-brand-dark" aria-live="polite">{priceLabel}</p>
        </div>
        <button type="submit" disabled={status === "sending"} className="inline-flex min-h-12 items-center justify-center rounded-xl bg-brand px-7 font-semibold text-white transition hover:bg-brand-dark disabled:opacity-60">
          {status === "sending" ? t.sending : t.submit}
        </button>
      </div>

      <p role="status" className="min-h-6 text-sm">
        {status === "invalid" && <span className="text-snag">{t.required}</span>}
        {status === "done" && <span className="text-wa-dark">{t.success}</span>}
        {status === "error" && <span className="text-snag">{t.error}</span>}
      </p>
    </form>
  );
}
