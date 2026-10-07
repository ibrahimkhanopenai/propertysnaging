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
const ALL: Variant[] = ["", "zoom", "blur", "start", "end"];

/**
 * Cycle order chosen so adjacent sections contrast on both direction AND
 * effect kind — no two slides, zooms or blurs land back-to-back. Wraps
 * cleanly across a long page.
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

    // Tag each section with its reveal variant and index its direct children
    // so the shared `--child-i` CSS stagger kicks in. The children's hidden
    // state is only applied as long as `.is-in` is absent on the parent, and
    // the safety net below guarantees `.is-in` lands within 2 seconds no
    // matter what, so no content can stay hidden.
    sections.forEach((s, i) => {
      const override = s.dataset.reveal as Variant | undefined;
      const variant: Variant =
        override !== undefined && ALL.includes(override) ? override : CYCLE[i % CYCLE.length];
      s.classList.add(classFor(variant));
      Array.from(s.children).forEach((child, ci) => {
        if (child instanceof HTMLElement) {
          child.style.setProperty("--child-i", String(ci));
        }
      });
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
      { threshold: 0.05, rootMargin: "0px 0px -3% 0px" },
    );

    sections.forEach((s) => io.observe(s));

    // Safety net — any section that is already fully above the viewport when
    // the user lands here (e.g. on an in-page anchor, back-forward restore,
    // or a slow IO on some mobile browsers) must still be visible. Force
    // `is-in` on anything whose top is above the fold at mount, and once more
    // on the first user scroll in case layout shifted.
    const forceVisibleAbove = () => {
      for (const s of sections) {
        if (s.classList.contains("is-in")) continue;
        const rect = s.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.95) {
          s.classList.add("is-in");
          io.unobserve(s);
        }
      }
    };
    forceVisibleAbove();
    // Give the browser one frame to settle layout, then re-check.
    requestAnimationFrame(forceVisibleAbove);

    const onScroll = () => {
      forceVisibleAbove();
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    // Hard safety: after 2 seconds, flip anything still hidden to is-in no
    // matter what. Covers broken IntersectionObserver implementations and
    // any edge case where a section never enters the viewport trigger zone.
    const safetyTimeout = window.setTimeout(() => {
      sections.forEach((s) => {
        if (!s.classList.contains("is-in")) {
          s.classList.add("is-in");
          io.unobserve(s);
        }
      });
    }, 2000);

    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.clearTimeout(safetyTimeout);
    };
  }, []);

  return null;
}
