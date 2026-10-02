import Image from "next/image";
import { Container } from "@/components/ui/Container";
import type { Dictionary } from "@/i18n/dictionaries";
import { site } from "@/lib/site";

/** Directly after the hero (client rule). Only genuine stats — see site.stats `genuine` flags. */
export function TrustSection({ dict }: { dict: Dictionary }) {
  const t = dict.home.trust;
  return (
    <section aria-labelledby="trust-title" className="border-y border-line bg-mist">
      <Container className="flex flex-col gap-8 py-10">
        <h2 id="trust-title" className="sr-only">{t.title}</h2>
        <ul className="grid grid-cols-2 gap-x-6 gap-y-6 sm:grid-cols-3 lg:grid-cols-5">
          {site.stats.map((s) => (
            <li key={s.key} className="flex flex-col gap-1">
              <span className="font-display text-[clamp(1.7rem,3vw,2.3rem)] font-extrabold tracking-[-0.02em]" dir="ltr">{s.value}</span>
              <span className="text-sm text-muted">{t.stats[s.key]}</span>
            </li>
          ))}
        </ul>
        <ul className="flex flex-wrap items-center gap-x-8 gap-y-4 border-t border-line pt-6">
          {site.credentials.map((c) => (
            <li key={c.key} className="flex items-center gap-3">
              <span className="relative block h-14 w-20 overflow-hidden rounded-lg border border-line bg-white">
                <Image src={c.image} alt={t.credentials[c.key as keyof typeof t.credentials]} fill sizes="80px" className="object-contain p-1" />
              </span>
              <span className="max-w-48 text-sm font-semibold leading-snug">{t.credentials[c.key as keyof typeof t.credentials]}</span>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
