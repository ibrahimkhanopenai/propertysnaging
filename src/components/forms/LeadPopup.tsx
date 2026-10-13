"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import type { Dictionary } from "@/i18n/dictionaries";
import { track } from "@/lib/track";

const KEY = "pi_popup_seen";
const DELAY_MS = 10_000;

/**
 * Client requirement: pop-up ~10 s after entering the site with Name, No. of bedrooms and
 * BUA (sq ft); Submit opens WhatsApp with those details, and a small, discreet close button.
 * Nothing is posted to /api/leads/ (no phone field — WhatsApp gives us the number).
 * Shown once per browser session. On phones it is a bottom sheet (not full-screen) to limit
 * Google's "intrusive interstitial" risk. Never shown on /contact-us/.
 */
export function LeadPopup({ t, whatsapp }: { t: Dictionary["popup"]; whatsapp: string }) {
  const [open, setOpen] = useState(false);
  const [invalid, setInvalid] = useState(false);
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

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = String(fd.get("name") ?? "").trim();
    const bedroomsRaw = String(fd.get("bedrooms") ?? "");
    const area = Number(String(fd.get("area") ?? "").replace(/[^\d]/g, "")) || undefined;
    if (!name || bedroomsRaw === "") {
      setInvalid(true);
      return;
    }
    const bedrooms = Number(bedroomsRaw);
    const lines = [
      t.waIntro,
      `${t.name}: ${name}`,
      `${t.bedrooms}: ${bedrooms === 0 ? t.studio : `${bedrooms} ${t.br}`}`,
      area ? `${t.area}: ${area}` : "",
    ].filter(Boolean);
    // Opened inside the submit handler so popup blockers allow it
    window.open(`https://wa.me/${whatsapp}?text=${encodeURIComponent(lines.join("\n"))}`, "_blank", "noopener");
    track("generate_lead", { form_id: "popup", method: "whatsapp" });
    setOpen(false);
  }

  const input = "h-12 w-full rounded-xl border border-brand-line bg-white px-3.5 text-[15px] text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/20";

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
        <form onSubmit={onSubmit} className="mt-5 flex flex-col gap-3" noValidate>
          <label className="sr-only" htmlFor="popup-name">{t.name}</label>
          <input ref={firstInput} id="popup-name" name="name" placeholder={t.name} autoComplete="name" required className={input} />
          <label className="sr-only" htmlFor="popup-bedrooms">{t.bedrooms}</label>
          <select id="popup-bedrooms" name="bedrooms" required defaultValue="" className={`${input} invalid:text-subtle`}>
            <option value="" disabled>{t.bedrooms}</option>
            <option value={0}>{t.studio}</option>
            {[1, 2, 3, 4, 5, 6, 7].map((n) => (
              <option key={n} value={n}>{n} {t.br}</option>
            ))}
          </select>
          <label className="sr-only" htmlFor="popup-area">{t.area}</label>
          <input id="popup-area" name="area" inputMode="numeric" placeholder={t.areaPlaceholder} className={input} />
          <button type="submit" className="min-h-12 rounded-xl bg-ink font-semibold text-white hover:bg-ink-soft">{t.submit}</button>
          {invalid ? <p role="alert" className="text-sm text-snag">{t.required}</p> : null}
        </form>
      </div>
    </div>
  );
}
