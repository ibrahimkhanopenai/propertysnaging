"use client";

import { useId, useState } from "react";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";
import { track } from "@/lib/track";

type Props = {
  t: Dictionary["home"]["booking"];
  types: Dictionary["quote"]["types"];
  locale: Locale;
};

// Purple = client rule for forms (docs/design-system.md)
const field =
  "h-12 w-full rounded-xl border border-brand-line bg-white px-3.5 text-[15px] text-ink outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20";

/**
 * One-row booking form (Name, Email, Phone, Property type → Send), carried over from the current site.
 * Posts to /api/leads/ (saved in MySQL + emailed to LEAD_NOTIFY_TO) and fires `generate_lead`.
 */
export function BookingForm({ t, types, locale }: Props) {
  const id = useId();
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error" | "invalid">("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const type = String(fd.get("propertyType") ?? "");
    const data = {
      name: String(fd.get("name") ?? "").trim(),
      email: String(fd.get("email") ?? "").trim(),
      phone: String(fd.get("phone") ?? "").trim(),
      propertyType: type === "apartment" || type === "villa" || type === "commercial" ? type : undefined,
      company: String(fd.get("company") ?? ""), // honeypot
      source: "booking_bar",
      locale,
      pagePath: window.location.pathname,
    };
    if (!data.name || !/^\S+@\S+\.\S+$/.test(data.email) || data.phone.replace(/\D/g, "").length < 7) {
      setStatus("invalid");
      return;
    }
    setStatus("sending");
    try {
      const r = await fetch("/api/leads/", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      if (!r.ok) throw new Error();
      setStatus("done");
      form.reset();
      track("generate_lead", { form_id: "booking_bar", property_type: data.propertyType });
    } catch {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate className="relative flex flex-col gap-3">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_1fr_auto]">
        <label className="sr-only" htmlFor={`${id}-name`}>{t.name}</label>
        <input id={`${id}-name`} name="name" placeholder={t.name} autoComplete="name" required className={field} />
        <label className="sr-only" htmlFor={`${id}-email`}>{t.email}</label>
        <input id={`${id}-email`} name="email" type="email" placeholder={t.email} autoComplete="email" required className={field} />
        <label className="sr-only" htmlFor={`${id}-phone`}>{t.phone}</label>
        <input id={`${id}-phone`} name="phone" type="tel" placeholder={t.phone} autoComplete="tel" dir="ltr" required className={`${field} rtl:text-end`} />
        <label className="sr-only" htmlFor={`${id}-type`}>{t.type}</label>
        <select id={`${id}-type`} name="propertyType" defaultValue="" className={field}>
          <option value="">{t.type}</option>
          <option value="villa">{types.villa}</option>
          <option value="apartment">{types.apartment}</option>
          <option value="commercial">{types.commercial}</option>
        </select>
        <button type="submit" disabled={status === "sending"} className="min-h-12 rounded-xl bg-brand px-8 font-semibold text-white transition hover:bg-brand-dark disabled:opacity-60 sm:col-span-2 lg:col-span-1">
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
      </p>
    </form>
  );
}
