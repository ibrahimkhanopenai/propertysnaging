"use client";

import { useId, useMemo, useState } from "react";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";
import { getAttribution } from "@/lib/attribution";
import { estimatePrice } from "@/lib/estimate";
import { track } from "@/lib/track";
import { cn } from "@/lib/utils";

type Props = {
  t: Dictionary["quote"];
  locale: Locale;
  /** AED per sq ft of built-up area (PRICE_PER_SQFT); null = no price shown */
  ratePerSqft: number | null;
  currency: string;
  whatsapp: string;
  /** Stored with the lead + sent with the conversion event */
  source?: "quote_form" | "contact_page";
  className?: string;
};

// Copper accent on form fields (docs/design-system.md)
const field =
  "h-12 w-full rounded-xl border border-brand-line bg-white px-3.5 text-[15px] text-ink outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20";
const label = "flex flex-col gap-2 text-sm font-semibold";

/**
 * Quote / booking form with live price (built-up area × rate per sq ft).
 * Five visible fields; location, emirate, email and handover date sit behind "Add more details".
 * Submit: opens WhatsApp (inside the click, so popup blockers allow it), posts the lead to
 * /api/leads/ in the background (MySQL + email, with gclid/UTM) and fires a `generate_lead` conversion.
 */
export function QuoteForm({ t, locale, ratePerSqft, currency, whatsapp, source = "quote_form", className }: Props) {
  const id = useId();
  const [type, setType] = useState<"apartment" | "villa" | "commercial">("apartment");
  const [bedrooms, setBedrooms] = useState(1);
  const [area, setArea] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error" | "invalid">("idle");

  const areaSqft = Number(area.replace(/[^\d]/g, "")) || undefined;
  const price = useMemo(() => estimatePrice(areaSqft, ratePerSqft), [areaSqft, ratePerSqft]);
  // No price yet: ask for the area when a rate exists, otherwise "price on request" (no rate configured)
  const needsArea = price === null && ratePerSqft !== null;
  const priceLabel = price !== null ? `${currency} ${price.toLocaleString("en-US")}` : needsArea ? t.enterArea : t.onRequest;

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
      areaSqft,
      emirate: String(fd.get("emirate") ?? ""),
      handoverDate: String(fd.get("handoverDate") ?? ""),
      company: String(fd.get("company") ?? ""), // honeypot
      source,
      locale,
      pagePath: window.location.pathname,
      ...getAttribution(),
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
      areaSqft ? `${t.area}: ${areaSqft.toLocaleString("en-US")}` : "",
      data.location ? `${t.location}: ${data.location}` : "",
      `${t.emirate}: ${data.emirate}`,
      data.handoverDate ? `${t.handoverDate}: ${data.handoverDate}` : "",
      price !== null ? `${t.estimated}: ${priceLabel}` : "",
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
        <label className={label}>
          {t.propertyType}
          <select className={field} value={type} onChange={(e) => setType(e.target.value as typeof type)}>
            <option value="apartment">{t.types.apartment}</option>
            <option value="villa">{t.types.villa}</option>
            <option value="commercial">{t.types.commercial}</option>
          </select>
        </label>
        <label className={label}>
          {t.bedrooms}
          <select className={field} value={bedrooms} onChange={(e) => setBedrooms(Number(e.target.value))} disabled={type === "commercial"}>
            <option value={0}>{t.studio}</option>
            {[1, 2, 3, 4, 5, 6, 7].map((n) => (
              <option key={n} value={n}>{n} {t.br}</option>
            ))}
          </select>
        </label>
        <label className={cn(label, "sm:col-span-2")}>
          {t.area}
          <input name="area" inputMode="numeric" value={area} onChange={(e) => setArea(e.target.value)} placeholder={t.areaPlaceholder} className={field} />
        </label>
        <label className={label}>
          {t.name}
          <input name="name" autoComplete="name" required className={field} />
        </label>
        <label className={label}>
          {t.phone}
          <input name="phone" type="tel" autoComplete="tel" required dir="ltr" placeholder="+971" className={cn(field, "rtl:text-end")} />
        </label>
        <div aria-hidden="true" className="absolute start-[-9999px] h-0 w-0 overflow-hidden">
          <label htmlFor={`${id}-company`}>Company</label>
          <input id={`${id}-company`} name="company" tabIndex={-1} autoComplete="off" />
        </div>
      </div>

      {/* Optional fields stay out of the way (fewer visible fields = more leads, CRO audit 2026-10) */}
      <details className="group rounded-xl border border-line px-4 [&_summary::-webkit-details-marker]:hidden">
        <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 text-sm font-semibold text-ink">
          {t.moreDetails}
          <span aria-hidden="true" className="text-xl font-normal leading-none text-muted transition-transform group-open:rotate-45">+</span>
        </summary>
        <div className="grid gap-4 pb-4 pt-1 sm:grid-cols-2">
          <label className={label}>
            {t.location}
            <input name="location" placeholder={t.locationPlaceholder} className={field} />
          </label>
          <label className={label}>
            {t.emirate}
            <select name="emirate" className={field} defaultValue={t.emirates[0]}>
              {t.emirates.map((em) => (
                <option key={em} value={em}>{em}</option>
              ))}
            </select>
          </label>
          <label className={label}>
            {t.email}
            <input name="email" type="email" autoComplete="email" className={field} />
          </label>
          <label className={label}>
            {t.handoverDate}
            <input name="handoverDate" type="date" className={field} />
          </label>
        </div>
      </details>

      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-brand-tint px-5 py-4">
        <div>
          <p className="text-sm text-muted">{t.estimated}</p>
          <p className={cn("font-display font-extrabold text-brand-dark", needsArea ? "text-base" : "text-3xl")} aria-live="polite">
            {priceLabel}
          </p>
        </div>
        <button type="submit" disabled={status === "sending"} className="inline-flex min-h-12 items-center justify-center rounded-xl bg-ink px-7 font-semibold text-white transition hover:bg-ink-soft disabled:opacity-60">
          {status === "sending" ? t.sending : t.submit}
        </button>
      </div>

      <p role="status" className="min-h-6 text-sm">
        {status === "invalid" && <span className="text-snag">{t.required}</span>}
        {status === "done" && <span className="text-wa-dark">{t.success}</span>}
        {status === "error" && <span className="text-snag">{t.error}</span>}
        {status === "idle" && <span className="text-muted">{t.reassurance}</span>}
      </p>
    </form>
  );
}
