"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";

export type FindingItem = { category: string; defect: string; fix: string; src: string; alt: string };

/**
 * Interactive part of "Defects we find": the featured photo + report card show the
 * selected finding; every row in the defect log is a button that swaps it in
 * (client request 2026-10-13). Photos are stacked and cross-faded so a click never
 * shows an empty frame. Severity uses `snag` red (red = defects only); copper `brand`
 * tokens carry markers, ordinals and the active-row rule.
 */
export function FindingsExplorer({ items, defectLabel, fixLabel }: { items: FindingItem[]; defectLabel: string; fixLabel: string }) {
  const [active, setActive] = useState(0);
  const figureRef = useRef<HTMLElement>(null);
  const current = items[active];

  function select(i: number) {
    setActive(i);
    // Mobile: the log sits below the photo — bring the photo back into view
    const el = figureRef.current;
    if (el && el.getBoundingClientRect().top < 0) {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-12 lg:items-start lg:gap-8">
      {/* FEATURED finding — annotated photo with an overlapping report card */}
      <Reveal className="lg:col-span-7">
        <figure ref={figureRef} className="relative scroll-mt-28">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[22px] bg-ink sm:aspect-[16/11]">
            {items.map((it, i) => (
              <Image
                key={it.src}
                src={it.src}
                alt={i === active ? it.alt : ""}
                aria-hidden={i === active ? undefined : true}
                fill
                sizes="(min-width: 1024px) 58vw, 100vw"
                className={cn("object-cover transition-opacity duration-500", i === active ? "opacity-100" : "opacity-0")}
              />
            ))}
            {/* legibility wash for the top overlays */}
            <div aria-hidden="true" className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-ink/55 to-transparent" />

            {/* severity tag (real defect semantics → snag red) */}
            <span className="absolute start-4 top-4 inline-flex items-center gap-2 rounded-full bg-white/95 px-3 py-1.5 text-[13px] font-bold uppercase tracking-[0.12em] text-snag shadow-sm backdrop-blur">
              <span aria-hidden="true" className="size-2 rounded-full bg-snag" />
              {defectLabel}
            </span>

            {/* finding ordinal */}
            <span aria-hidden="true" className="absolute end-4 top-3 font-display text-[clamp(2.4rem,5vw,3.4rem)] font-extrabold leading-none tracking-[-0.04em] text-brand-light/90">
              {String(active + 1).padStart(2, "0")}
            </span>

            {/* copper annotation marker + leader line + category callout (md+), placed for the
                first photo only: the dot sits on the wall where the inspector's torch is lit.
                Physical right/ltr on purpose: the photo is not mirrored in RTL. */}
            {active === 0 ? (
              <div
                aria-hidden="true"
                dir="ltr"
                className="absolute right-[calc(15%-14px)] top-[21%] hidden -translate-y-1/2 items-center md:flex"
              >
                <span className="whitespace-nowrap rounded-full border border-brand-line bg-white/95 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-brand-dark shadow-sm">
                  {current.category}
                </span>
                <span className="h-px w-6 bg-brand/80" />
                <span className="relative flex size-7 items-center justify-center rounded-full border-2 border-brand bg-brand/15 backdrop-blur-sm">
                  <span className="size-1.5 rounded-full bg-brand" />
                </span>
              </div>
            ) : null}

            {/* viewfinder corner ticks */}
            <span aria-hidden="true" className="absolute bottom-4 start-4 hidden size-5 border-b-2 border-s-2 border-white/70 md:block" />
            <span aria-hidden="true" className="absolute top-4 end-4 hidden size-5 border-t-2 border-e-2 border-white/40 md:block" />
          </div>

          {/* overlapping report card — announces the newly selected finding */}
          <figcaption
            aria-live="polite"
            className="relative z-10 -mt-12 me-4 ms-4 rounded-2xl border border-line bg-white p-5 shadow-[0_24px_60px_rgba(10,10,10,0.12)] sm:-mt-16 sm:me-8 sm:ms-8 sm:p-6"
          >
            <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-line bg-brand-tint px-2.5 py-1 text-[13px] font-semibold uppercase tracking-[0.1em] text-brand-dark">
              <Icon name="search" size={13} />
              {current.category}
            </span>
            <h3 className="mt-3 font-display text-xl font-extrabold leading-snug tracking-[-0.02em] text-ink text-balance sm:text-2xl">
              {current.defect}
            </h3>
            <div className="mt-4 flex gap-3 border-t border-line pt-4">
              <span aria-hidden="true" className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-brand-tint text-brand">
                <Icon name="check" size={15} />
              </span>
              <div className="min-w-0">
                <span className="text-[13px] font-bold uppercase tracking-[0.12em] text-muted">{fixLabel}</span>
                <p className="mt-0.5 text-[15px] leading-relaxed text-muted">{current.fix}</p>
              </div>
            </div>
          </figcaption>
        </figure>
      </Reveal>

      {/* Defect log — every row selects its finding */}
      <Reveal
        as="ul"
        stagger
        className="divide-y divide-line overflow-hidden rounded-[22px] border border-line bg-white lg:col-span-5"
      >
        {items.map((it, i) => {
          const isActive = i === active;
          return (
            <li key={it.src} style={{ ["--i" as string]: i } as React.CSSProperties}>
              <button
                type="button"
                onClick={() => select(i)}
                aria-pressed={isActive}
                className={cn(
                  "group relative flex w-full cursor-pointer items-start gap-4 p-4 text-start transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand sm:gap-5 sm:px-5",
                  isActive ? "bg-mist" : "hover:bg-mist/60",
                )}
              >
                {/* active rule */}
                <span
                  aria-hidden="true"
                  className={cn("absolute inset-y-0 start-0 w-0.5 bg-brand transition-opacity", isActive ? "opacity-100" : "opacity-0")}
                />
                <span
                  aria-hidden="true"
                  className={cn(
                    "w-6 shrink-0 pt-1 font-display text-sm font-extrabold tabular-nums transition-colors",
                    isActive ? "text-brand-dark" : "text-brand group-hover:text-brand-dark",
                  )}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>

                <span
                  className={cn(
                    "relative block size-16 shrink-0 overflow-hidden rounded-xl bg-mist sm:size-[72px]",
                    isActive && "ring-2 ring-brand ring-offset-2 ring-offset-mist",
                  )}
                >
                  <Image
                    src={it.src}
                    alt=""
                    fill
                    sizes="72px"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* severity marker (red = defects only) */}
                  <span aria-hidden="true" className="absolute end-1 top-1 size-2 rounded-full bg-snag ring-2 ring-white" />
                </span>

                <span className="block min-w-0 flex-1">
                  <span className="block text-[12px] font-bold uppercase tracking-[0.14em] text-brand-dark">{it.category}</span>
                  <span className="mt-1 block text-[15px] font-semibold leading-snug text-ink">{it.defect}</span>
                  <span className="mt-1.5 flex items-start gap-1.5 text-[13px] leading-relaxed text-muted">
                    <Icon name="check" size={14} className="mt-0.5 shrink-0 text-brand" />
                    <span className="min-w-0">{it.fix}</span>
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </Reveal>
    </div>
  );
}
