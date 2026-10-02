import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Icon, type IconName } from "@/components/ui/Icon";
import type { Dictionary } from "@/i18n/dictionaries";
import { localePath, type Locale } from "@/i18n/config";

const icons: Record<string, IconName> = { structural: "wall", electrical: "bolt", plumbing: "drop", hvac: "snow", moisture: "thermo", kitchen: "kitchen", bathroom: "shower", external: "building" };

export function WhatWeInspect({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const t = dict.home.inspect;
  return (
    <section className="border-y border-line bg-mist py-20 md:py-24">
      <Container className="flex flex-col gap-10">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading title={t.title} />
          <Link href={localePath(locale, "/scope-of-work/")} className="font-semibold underline-offset-4 hover:underline">{t.link}</Link>
        </div>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {t.items.map((it) => (
            <li key={it.key}>
              <Link href={`${localePath(locale, "/scope-of-work/")}#${it.key}`} className="flex h-full flex-col gap-3 rounded-2xl border border-line bg-white p-6 hover:border-ink">
                <Icon name={icons[it.key] ?? "check"} size={28} />
                <h3 className="font-display text-lg font-extrabold">{it.title}</h3>
                <ul className="flex flex-col gap-1.5 text-sm text-muted">
                  {it.points.map((p) => (
                    <li key={p} className="flex gap-2"><Icon name="check" size={16} className="mt-0.5 shrink-0 text-ink" />{p}</li>
                  ))}
                </ul>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
