"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import type { Dictionary } from "@/i18n/dictionaries";
import { Icon } from "./Icon";

export type LightboxItem = { url: string; alt: string; caption?: string | null };

/**
 * Full-photo viewer for photo grids. The grid stays server-rendered: any element inside
 * `children` with `data-lightbox="<index>"` (a <button>) opens items[index]. Prev/next buttons,
 * arrow keys (mirrored in RTL), Esc / backdrop to close, focus returns to the clicked tile.
 * The viewer is portalled to <body>: sections animate with `transform`, which would otherwise
 * trap `position: fixed` inside the section instead of covering the screen.
 */
export function Lightbox({ items, t, className, children }: { items: LightboxItem[]; t: Dictionary["lightbox"]; className?: string; children: React.ReactNode }) {
  const [index, setIndex] = useState<number | null>(null);
  const dialog = useRef<HTMLDivElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const count = items.length;
  const open = index !== null;

  const go = useCallback((step: number) => setIndex((i) => (i === null ? i : (i + step + count) % count)), [count]);

  function onGridClick(e: React.MouseEvent) {
    const el = (e.target as HTMLElement).closest<HTMLElement>("[data-lightbox]");
    const i = Number(el?.dataset.lightbox);
    if (!el || !Number.isInteger(i) || !items[i]) return;
    opener.current = el;
    setIndex(i);
  }

  useEffect(() => {
    if (!open) return;
    closeBtn.current?.focus();
    const rtl = document.documentElement.dir === "rtl";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIndex(null);
      else if (e.key === "ArrowRight") go(rtl ? -1 : 1);
      else if (e.key === "ArrowLeft") go(rtl ? 1 : -1);
      else if (e.key === "Tab" && dialog.current) {
        // keep focus inside the dialog
        const f = dialog.current.querySelectorAll<HTMLElement>("button");
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
      opener.current?.focus();
    };
  }, [open, go]);

  const item = index === null ? null : items[index];
  const navBtn =
    "absolute top-1/2 z-10 inline-flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition hover:bg-white/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white";

  return (
    <>
      <div onClick={onGridClick} className={className}>
        {children}
      </div>
      {item
        ? createPortal(
            <div
              ref={dialog}
              role="dialog"
              aria-modal="true"
              aria-label={item.alt}
              onClick={() => setIndex(null)}
              className="fixed inset-0 z-[70] flex flex-col bg-ink pb-[env(safe-area-inset-bottom)] pt-[env(safe-area-inset-top)] text-white"
            >
              <div className="flex items-center justify-between px-4 py-3">
                <span className="text-sm tabular-nums text-zinc-300" dir="ltr">
                  {index! + 1} / {count}
                </span>
                <button
                  ref={closeBtn}
                  type="button"
                  onClick={() => setIndex(null)}
                  aria-label={t.close}
                  className="inline-flex size-11 items-center justify-center rounded-full bg-white/10 transition hover:bg-white/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  <Icon name="close" size={22} />
                </button>
              </div>

              <div className="relative flex-1 px-4 md:px-20">
                <div className="relative h-full w-full">
                  <Image
                    key={item.url}
                    src={item.url}
                    alt={item.alt}
                    fill
                    sizes="100vw"
                    className="object-contain"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
                {count > 1 ? (
                  <>
                    <button type="button" onClick={(e) => (e.stopPropagation(), go(-1))} aria-label={t.prev} className={`${navBtn} start-2 md:start-5`}>
                      <Icon name="arrow" size={22} className="rotate-180 rtl:rotate-0" />
                    </button>
                    <button type="button" onClick={(e) => (e.stopPropagation(), go(1))} aria-label={t.next} className={`${navBtn} end-2 md:end-5`}>
                      <Icon name="arrow" size={22} className="rtl:rotate-180" />
                    </button>
                  </>
                ) : null}
              </div>

              <p className="min-h-12 px-4 py-3 text-center text-sm text-zinc-300">{item.caption}</p>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
