"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";
import { track } from "@/lib/track";

const KEY = "pi_popup_seen";
const DELAY_MS = 10_000;

/**
 * Client requirement: pop-up ~10 s after entering the site with only Name, Phone and Submit,
 * and a small, discreet close button.
 * Shown once per browser session. On phones it is a bottom sheet (not full-screen) to limit
 * Google's "intrusive interstitial" risk. Never shown on /contact-us/.
 */
export function LeadPopup({ t, locale }: { t: Dictionary["popup"]; locale: Locale }) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const firstInput = useRef<HTMLInputElement>(null);
  const pathname = usePathname() || "";

  useEffect(() => {
    if (pathname.includes("/contact-us")) return;
    let seen = false;
    try {
      seen = sessionStorage.getItem(KEY) === "1";
    } catch {}
    if (seen) return;
    const timer = window.setTimeout(() => {
      setOpen(true);
      try {
        sessionStorage.setItem(KEY, "1");
      } catch {}
    }, DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    firstInput.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  if (!open) return null;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = String(fd.get("name") ?? "").trim();
    const phone = String(fd.get("phone") ?? "").trim();
    if (!name || phone.replace(/\D/g, "").length < 7) return;
    setStatus("sending");
    try {
      const r = await fetch("/api/leads/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, company: String(fd.get("company") ?? ""), source: "popup", locale, pagePath: window.location.pathname }),
      });
      if (!r.ok) throw new Error();
      setStatus("done");
      track("generate_lead", { form_id: "popup" });
      window.setTimeout(() => setOpen(false), 2500);
    } catch {
      setStatus("error");
    }
  }

  const input = "h-12 w-full rounded-xl border border-brand-line px-3.5 text-[15px] outline-none focus:border-brand focus:ring-2 focus:ring-brand/20";

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-ink/40 sm:items-center sm:p-6" onClick={() => setOpen(false)}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="lead-popup-title"
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md rounded-t-3xl border-t-4 border-brand bg-white p-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] shadow-2xl sm:rounded-3xl sm:border-t-0 sm:border-s-4"
      >
        <button type="button" onClick={() => setOpen(false)} aria-label={t.close} className="absolute end-2 top-2 inline-flex size-8 items-center justify-center rounded-full text-sm text-subtle hover:bg-mist">
          ✕
        </button>
        <h2 id="lead-popup-title" className="pe-8 font-display text-xl font-extrabold">{t.title}</h2>
        <p className="mt-1 text-sm text-muted">{t.text}</p>
        {status === "done" ? (
          <p role="status" className="mt-5 rounded-xl bg-brand-tint p-4 font-semibold text-brand-dark">{t.success}</p>
        ) : (
          <form onSubmit={onSubmit} className="mt-5 flex flex-col gap-3" noValidate>
            <label className="sr-only" htmlFor="popup-name">{t.name}</label>
            <input ref={firstInput} id="popup-name" name="name" placeholder={t.name} autoComplete="name" required className={input} />
            <label className="sr-only" htmlFor="popup-phone">{t.phone}</label>
            <input id="popup-phone" name="phone" type="tel" placeholder={t.phone} autoComplete="tel" dir="ltr" required className={input} />
            <input name="company" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
            <button type="submit" disabled={status === "sending"} className="min-h-12 rounded-xl bg-brand font-semibold text-white hover:bg-brand-dark disabled:opacity-60">{t.submit}</button>
            {status === "error" ? <p role="alert" className="text-sm text-snag">{t.error}</p> : null}
          </form>
        )}
      </div>
    </div>
  );
}
