"use client";

import { useEffect } from "react";

/**
 * Global page-section animator. Tags every top-level `<section>` under
 * `<main>` with one of five reveal variants (fade-up, zoom, focus-blur,
 * slide-from-start, slide-from-end) so no two adjacent sections share the
 * same entrance, then uses an IntersectionObserver to add `.is-in` the first
 * time each enters the viewport — sections already visible on load animate
 * immediately, anything further down animates when the user reaches it.
 * Pairs with the `.section-reveal*` CSS in globals.css (0.3s, shared easing,
 * honouring prefers-reduced-motion).
 *
 * One tiny client island mounted in the root layout; no deps, no wrapper
 * DOM — the sections keep their own tags and layout. If the host page sets
 * `data-reveal` on a section (e.g. `data-reveal="zoom"`) that variant wins
 * so a one-off section can override the cycle without touching this file.
 */
type Variant = "" | "zoom" | "blur" | "start" | "end";

/**
 * Cycle order chosen so near neighbours contrast (direction + scale + blur
 * never repeat back-to-back) and the 5-step pattern reads as a soft rhythm
 * rather than an obvious repeat.
 */
const CYCLE: Variant[] = ["zoom", "", "start", "blur", "end"];

function classFor(v: Variant): string {
  return v ? `section-reveal-${v}` : "section-reveal";
}

export function SectionReveal() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const main = document.getElementById("main");
    if (!main) return;

    const sections = Array.from(main.querySelectorAll<HTMLElement>(":scope > section"));
    if (!sections.length) return;

    // Tag each section with its reveal variant (data-reveal override wins).
    sections.forEach((s, i) => {
      const override = s.dataset.reveal as Variant | undefined;
      const variant: Variant =
        override !== undefined && ["", "zoom", "blur", "start", "end"].includes(override)
          ? override
          : CYCLE[i % CYCLE.length];
      s.classList.add(classFor(variant));
    });

    if (reduced || typeof IntersectionObserver === "undefined") {
      sections.forEach((s) => s.classList.add("is-in"));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.08, rootMargin: "0px 0px -4% 0px" },
    );

    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  return null;
}
