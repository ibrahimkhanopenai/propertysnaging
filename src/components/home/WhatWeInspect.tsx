import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Icon, type IconName } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import type { Dictionary } from "@/i18n/dictionaries";
import { localePath, type Locale } from "@/i18n/config";

const icons: Record<string, IconName> = { structural: "wall", electrical: "bolt", plumbing: "drop", hvac: "snow", moisture: "thermo", kitchen: "kitchen", bathroom: "shower", external: "building" };

/** Technical "spec sheet" grid — hairline-divided cells, not free-floating cards. */
export function WhatWeInspect({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const t = dict.home.inspect;
  return (
    <section className="border-y border-line bg-mist py-20 md:py-28">
      <Container className="flex flex-col gap-12">
        <Reveal className="flex flex-wrap items-end justify-between gap-6">
          <h2 className="max-w-2xl font-display text-[clamp(1.9rem,3.4vw,2.6rem)] font-extrabold leading-[1.1] tracking-[-0.02em] text-balance">{t.title}</h2>
          <Link href={localePath(locale, "/scope-of-work/")} className="group inline-flex items-center gap-2 font-semibold underline-offset-4 hover:underline">
            {t.link}
            <Icon name="arrow" size={18} className="transition group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
          </Link>
        </Reveal>

        <Reveal className="grid gap-px overflow-hidden rounded-[22px] border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {t.items.map((it) => (
            <div key={it.key} className="flex flex-col gap-4 bg-white p-6 transition-colors hover:bg-mist">
              <div className="flex items-center gap-3">
                <span className="inline-flex size-11 items-center justify-center rounded-full bg-ink text-white">
                  <Icon name={icons[it.key] ?? "check"} size={22} />
                </span>
                <h3 className="font-display text-lg font-extrabold leading-tight">{it.title}</h3>
              </div>
              <ul className="flex flex-col gap-2 text-sm text-muted">
                {it.points.map((p) => (
                  <li key={p} className="flex gap-2">
                    <Icon name="check" size={16} className="mt-0.5 shrink-0 text-ink" />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </Reveal>
      </Container>
    </section>
  );
}
