"use client";

import { useEffect, useRef } from "react";

/**
 * SociableKit Google Reviews embed (live reviews from the Google Business Profile).
 * The vendor script is injected only when the section nears the viewport, so it costs
 * nothing on first load. It is re-injected on every mount: next/script would run it once
 * per session, leaving the widget empty after client-side navigation back to the homepage.
 */
export function GoogleReviewsWidget({ embedId, src }: { embedId: string; src: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let script: HTMLScriptElement | undefined;
    const load = () => {
      script = document.createElement("script");
      script.src = src;
      script.defer = true;
      document.body.appendChild(script);
    };
    if (typeof IntersectionObserver === "undefined") {
      load();
      return () => script?.remove();
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          io.disconnect();
          load();
        }
      },
      { rootMargin: "800px 0px" },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      script?.remove();
    };
  }, [src]);

  return <div ref={ref} className="sk-ww-google-reviews min-h-[420px]" data-embed-id={embedId} />;
}
