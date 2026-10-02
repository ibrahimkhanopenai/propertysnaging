"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import type { NavItem } from "./nav";

export function MobileMenu({ items, openLabel, closeLabel, quoteHref, quoteLabel }: { items: NavItem[]; openLabel: string; closeLabel: string; quoteHref: string; quoteLabel: string }) {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="xl:hidden">
      <button type="button" onClick={() => setOpen(true)} aria-expanded={open} aria-controls="mobile-nav" aria-label={openLabel} className="inline-flex size-11 items-center justify-center rounded-xl border border-line">
        <Icon name="menu" size={22} />
      </button>
      {open ? (
        <nav id="mobile-nav" aria-label="Mobile" className="fixed inset-0 z-50 overflow-y-auto bg-white px-5 pb-28 pt-4">
          <div className="flex justify-end">
            <button type="button" onClick={() => setOpen(false)} aria-label={closeLabel} className="inline-flex size-11 items-center justify-center rounded-xl border border-line">
              <Icon name="close" size={22} />
            </button>
          </div>
          <ul className="flex flex-col divide-y divide-line">
            {items.map((item) => {
              const sub = item.groups ? item.groups.flatMap((g) => g.items) : item.children;
              const isOpen = expanded === item.label;
              return (
                <li key={item.label} className="py-2">
                  <div className="flex items-center justify-between">
                    <Link href={item.href} className="block flex-1 py-2.5 font-display text-lg font-bold">{item.label}</Link>
                    {sub ? (
                      <button type="button" onClick={() => setExpanded(isOpen ? null : item.label)} aria-expanded={isOpen} aria-label={item.label} className="inline-flex size-11 items-center justify-center">
                        <Icon name="chevron" size={20} className={isOpen ? "rotate-180" : ""} />
                      </button>
                    ) : null}
                  </div>
                  {sub && isOpen ? (
                    <ul className="mb-2 flex flex-col">
                      {sub.map((c) => (
                        <li key={c.href}>
                          <Link href={c.href} className="block py-2 ps-3 text-muted">{c.label}</Link>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </li>
              );
            })}
          </ul>
          <Link href={quoteHref} className="mt-6 flex min-h-12 items-center justify-center rounded-xl bg-ink font-semibold text-white">{quoteLabel}</Link>
        </nav>
      ) : null}
    </div>
  );
}
