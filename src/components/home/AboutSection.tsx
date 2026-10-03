import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Kicker } from "@/components/ui/Kicker";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import type { Dictionary } from "@/i18n/dictionaries";
import { localePath, type Locale } from "@/i18n/config";
import { site } from "@/lib/site";

/**
 * "About us" editorial dossier: an oversized statement headline, a tall asymmetric
 * portrait of the handover with copper inspection-marker annotations, and the genuine
 * 10,000+ inspection-hours fact set as an outsized pull-stat beside the story.
 */
export function AboutSection({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const t = dict.home.about;
  return (
    <section className="relative overflow-hidden border-y border-line bg-mist py-20 md:py-28">
      <Container>
        {/* Label + oversized statement set hard to the start for a strong top-left entry */}
        <Reveal className="max-w-3xl">
          <Kicker>{t.label}</Kicker>
          <h2 className="mt-6 max-w-[18ch] font-display text-[clamp(2rem,4.6vw,3.4rem)] font-extrabold leading-[1.03] tracking-[-0.03em] text-balance text-ink">
            {t.title}
          </h2>
          <span aria-hidden="true" className="mt-6 block h-px w-16 bg-brand" />
        </Reveal>

        {/* Asymmetric body: tall annotated image at the start, offset story column at the end */}
        <div className="mt-12 grid gap-10 lg:mt-16 lg:grid-cols-12 lg:items-start lg:gap-16">
          <Reveal delay={120} className="lg:col-span-6">
            <figure className="relative">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[28px] border border-line bg-white sm:aspect-[16/11] lg:aspect-[4/5]">
                <Image
                  src={site.images.about}
                  alt={t.imageAlt}
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover"
                />
                {/* Copper survey corner ticks — framing the inspection, logical for RTL */}
                <span aria-hidden="true" className="pointer-events-none absolute start-4 top-4 size-7 border-s-2 border-t-2 border-brand/85" />
                <span aria-hidden="true" className="pointer-events-none absolute bottom-4 end-4 size-7 border-b-2 border-e-2 border-brand/85" />
                {/* Overlaid coordinate-style inspection marker */}
                <span
                  dir="ltr"
                  aria-hidden="true"
                  className="absolute bottom-4 start-4 inline-flex items-center gap-2 rounded-full bg-ink/85 px-3 py-1.5 text-[11px] font-medium tracking-[0.08em] text-white backdrop-blur-sm"
                >
                  <Icon name="pin" size={13} className="text-brand-light" />
                  25.2048° · 55.2708°
                </span>
              </div>
            </figure>
          </Reveal>

          {/* Story + outsized genuine stat, dropped down to pull the eye across and down */}
          <Reveal delay={180} className="lg:col-span-6 lg:pt-14">
            <p className="max-w-prose text-lg leading-relaxed text-muted">{t.text}</p>

            <div className="mt-10 border-s-[3px] border-brand ps-5">
              <div dir="ltr" className="font-display text-[clamp(3rem,7vw,5rem)] font-extrabold leading-[0.9] tracking-[-0.03em] text-ink">
                10,000<span className="text-brand">+</span>
              </div>
              <div className="mt-3 text-sm font-medium uppercase tracking-[0.16em] text-muted">
                {dict.home.trust.stats.hours}
              </div>
            </div>

            <div className="mt-10 flex flex-wrap gap-3">
              <ButtonLink href="#quote" size="lg" className="rounded-full">{t.cta}</ButtonLink>
              <ButtonLink href={localePath(locale, "/about-us/")} variant="outline" size="lg" className="rounded-full">{t.more}</ButtonLink>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
