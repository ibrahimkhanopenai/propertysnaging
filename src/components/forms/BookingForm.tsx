"use client";

import { useId, useState } from "react";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";
import { getAttribution } from "@/lib/attribution";
import { track } from "@/lib/track";

type Props = {
  t: Dictionary["home"]["booking"];
  /** Quote dictionary — reused for the WhatsApp message labels + the property-type options */
  q: Dictionary["quote"];
  locale: Locale;
  /** International format, no "+" (site.whatsapp) */
  whatsapp: string;
};

// Neutral fields with the brand accent on focus (docs/design-system.md)
const field =
  "h-12 w-full rounded-xl border border-line bg-white px-3.5 text-[15px] text-ink outline-none transition placeholder:text-subtle focus:border-brand focus:ring-2 focus:ring-brand/20";

/**
 * One-row short quote form (Name, Phone, Property type → Get my quote). Email was dropped
 * (CRO audit 2026-10: every extra field loses leads). On submit it opens WhatsApp with the
 * details pre-filled (inside the click, so popup blockers allow it), posts the lead to
 * /api/leads/ in the background (MySQL + email, with gclid/UTM) and fires `generate_lead`.
 */
export function BookingForm({ t, q, locale, whatsapp }: Props) {
  const id = useId();
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error" | "invalid">("idle");

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const type = String(fd.get("propertyType") ?? "");
    const data = {
      name: String(fd.get("name") ?? "").trim(),
      phone: String(fd.get("phone") ?? "").trim(),
      propertyType: type === "apartment" || type === "villa" || type === "commercial" ? type : undefined,
      company: String(fd.get("company") ?? ""), // honeypot
      source: "booking_bar",
      locale,
      pagePath: window.location.pathname,
      ...getAttribution(),
    };
    if (!data.name || data.phone.replace(/\D/g, "").length < 7) {
      setStatus("invalid");
      return;
    }

    // Hand off to WhatsApp with the details pre-filled. Opened synchronously inside the
    // click (before the background fetch) so popup blockers let it through — same as QuoteForm.
    const lines = [
      q.waIntro,
      `${q.name}: ${data.name}`,
      `${q.phone}: ${data.phone}`,
      data.propertyType ? `${q.propertyType}: ${q.types[data.propertyType as keyof typeof q.types]}` : "",
    ].filter(Boolean);
    window.open(`https://wa.me/${whatsapp}?text=${encodeURIComponent(lines.join("\n"))}`, "_blank", "noopener");

    setStatus("sending");
    fetch("/api/leads/", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data), keepalive: true })
      .then((r) => {
        if (!r.ok) {
          setStatus("error");
          return;
        }
        setStatus("done");
        form.reset();
        track("generate_lead", { form_id: "booking_bar", property_type: data.propertyType, method: "whatsapp" });
      })
      .catch(() => setStatus("error"));
  }

  return (
    <form onSubmit={onSubmit} noValidate className="relative flex flex-col gap-3">
      <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-[1fr_1fr_1fr_auto]">
        <label className="sr-only" htmlFor={`${id}-name`}>{t.name}</label>
        <input id={`${id}-name`} name="name" placeholder={t.name} autoComplete="name" required className={field} />
        <label className="sr-only" htmlFor={`${id}-phone`}>{t.phone}</label>
        <input id={`${id}-phone`} name="phone" type="tel" placeholder={t.phone} autoComplete="tel" dir="ltr" required className={`${field} rtl:text-end`} />
        <label className="sr-only" htmlFor={`${id}-type`}>{t.type}</label>
        <select id={`${id}-type`} name="propertyType" defaultValue="" className={field}>
          <option value="">{t.type}</option>
          <option value="villa">{q.types.villa}</option>
          <option value="apartment">{q.types.apartment}</option>
          <option value="commercial">{q.types.commercial}</option>
        </select>
        <button type="submit" disabled={status === "sending"} className="min-h-12 rounded-xl bg-ink px-8 font-semibold text-white transition hover:bg-ink-soft disabled:opacity-60 sm:col-span-3 lg:col-span-1">
          {status === "sending" ? t.sending : t.submit}
        </button>
        <div aria-hidden="true" className="absolute start-[-9999px] h-0 w-0 overflow-hidden">
          <label htmlFor={`${id}-company`}>Company</label>
          <input id={`${id}-company`} name="company" tabIndex={-1} autoComplete="off" />
        </div>
      </div>
      <p role="status" className="min-h-5 text-center text-sm">
        {status === "invalid" && <span className="text-snag">{t.required}</span>}
        {status === "done" && <span className="font-semibold text-brand-dark">{t.success}</span>}
        {status === "error" && <span className="text-snag">{t.error}</span>}
        {status === "idle" && <span className="text-muted">{t.reassurance}</span>}
      </p>
    </form>
  );
}
