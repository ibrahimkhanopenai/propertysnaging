"use client";

import { useEffect } from "react";
import { track } from "@/lib/track";

/** One global listener: every tel: and WhatsApp link on every page is tracked as a conversion. */
export function TrackClicks() {
  useEffect(() => {
    function onClick(e: MouseEvent) {
      const a = (e.target as HTMLElement | null)?.closest?.("a");
      if (!a) return;
      const href = a.getAttribute("href") || "";
      const location = a.getAttribute("data-track") || window.location.pathname;
      if (href.startsWith("tel:")) track("click_call", { location });
      else if (href.includes("wa.me/") || href.includes("api.whatsapp.com")) track("click_whatsapp", { location });
    }
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);
  return null;
}
