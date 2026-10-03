import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Kicker } from "@/components/ui/Kicker";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import type { Dictionary } from "@/i18n/dictionaries";
import { localePath, type Locale } from "@/i18n/config";
import { site } from "@/lib/site";

/** Dark showcase: how each defect is documented (accent-numbered list) + a layered report composition. */
export function SampleReportSection({ locale, dict, headingLevel = "h2" }: { locale: Locale; dict: Dictionary; headingLevel?: "h2" | "h3" }) {
  const t = dict.home.report;
  const H = headingLevel;
  return (
    <section className="bg-ink py-20 text-white md:py-28">
      <Container className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
        <Reveal className="flex flex-col gap-6">
          <Kicker className="text-brand-light">{dict.nav.sampleReport}</Kicker>
          <H className="font-display text-[clamp(1.9rem,3.4vw,2.6rem)] font-extrabold leading-[1.1] tracking-[-0.02em]">{t.title}</H>
          <p className="text-lg leading-relaxed text-zinc-400">{t.text}</p>
          <ol className="flex flex-col border-y border-white/10">
            {t.fields.map((f, i) => (
              <li key={f.title} className="flex items-center gap-4 border-b border-white/10 py-3.5 last:border-b-0">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-brand/20 font-display text-sm font-extrabold text-brand-light ring-1 ring-inset ring-brand/40" aria-hidden="true">{i + 1}</span>
                <span className="flex flex-col">
                  <span className="font-semibold leading-tight">{f.title}</span>
                  <span className="text-sm text-zinc-400">{f.text}</span>
                </span>
              </li>
            ))}
          </ol>
          <div className="flex flex-wrap gap-3 pt-1">
            <ButtonLink href={`${localePath(locale, "/")}#quote`} variant="light" size="lg" className="rounded-full">{t.book}</ButtonLink>
            <ButtonLink href={localePath(locale, "/sample-report/")} variant="ghostLight" size="lg" className="rounded-full">{t.view}</ButtonLink>
          </div>
        </Reveal>

        {/* Layered report composition */}
        <Reveal delay={120} className="relative mx-auto w-full max-w-sm lg:max-w-md">
          <div className="relative aspect-[5/5]">
            <div className="absolute left-1/2 top-1/2 z-20 h-[80%] w-[60%] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl border border-white/15 shadow-[0_30px_70px_rgba(0,0,0,0.55)] ring-1 ring-brand/40">
              <Image src={site.images.report[1]} alt={`${t.imageAlt} 1`} fill sizes="300px" className="object-cover object-top" />
            </div>
            <div className="absolute left-0 top-1 z-10 h-[44%] w-[44%] -rotate-3 overflow-hidden rounded-xl border border-white/15 shadow-[0_18px_40px_rgba(0,0,0,0.5)]">
              <Image src={site.images.report[0]} alt={`${t.imageAlt} 2`} fill sizes="180px" className="object-cover" />
            </div>
            <div className="absolute bottom-1 right-0 z-30 h-[44%] w-[44%] rotate-3 overflow-hidden rounded-xl border border-white/15 shadow-[0_18px_40px_rgba(0,0,0,0.5)]">
              <Image src={site.images.report[2]} alt={`${t.imageAlt} 3`} fill sizes="180px" className="object-cover" />
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
