import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import type { Dictionary } from "@/i18n/dictionaries";
import { type Locale } from "@/i18n/config";
import { site, whatsappLink } from "@/lib/site";

/**
 * Cinematic hero recreated from the client's reference mockup: the supplied
 * "city in hand" photo runs full-bleed, content overlays the left over a white
 * readability wash, with a navy corner flourish — not a plain two-column split.
 * From md up the hero height grows with the width (50vw, 600–900px) and the photo is
 * anchored at right 65%, so the whole hand and the Burj Khalifa tip stay in frame.
 * CRO audit (2026-10): hook line under the H1, three hard proofs, ONE copper primary
 * action ("Get my free quote") + WhatsApp with a pre-filled message, phone as a text link.
 */
export function Hero({ dict }: { locale: Locale; dict: Dictionary }) {
  const t = dict.home.hero;
  return (
    <section className="relative isolate flex min-h-[620px] items-center overflow-hidden bg-white md:min-h-[clamp(600px,50vw,900px)]">
      {/* Full-bleed supplied hero image */}
      <div className="absolute inset-0 -z-20">
        <Image
          src={site.images.hero}
          alt={t.imageAlt}
          fill
          priority
          sizes="100vw"
          className="object-cover object-[72%_20%] md:object-[right_65%]"
        />
      </div>

      {/* Readability scrim — light enough that the photo still shows behind the text
          (client feedback 2026-10-09: "too white"), strong enough for dark text.
          Mirrored in Arabic so the wash sits behind the right-aligned text. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 md:hidden"
        style={{ background: "linear-gradient(to bottom, rgba(255,255,255,0.86) 0%, rgba(255,255,255,0.8) 40%, rgba(255,255,255,0.66) 70%, rgba(255,255,255,0.4) 100%)" }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 hidden md:block rtl:-scale-x-100"
        style={{ background: "linear-gradient(to right, rgba(255,255,255,0.82) 0%, rgba(255,255,255,0.72) 38%, rgba(255,255,255,0.4) 52%, rgba(255,255,255,0.08) 66%, transparent 78%)" }}
      />

      <Container className="relative w-full py-14 md:py-16 lg:py-20">
        <Reveal className="flex max-w-xl flex-col gap-6">
          <div className="flex items-center gap-3 text-[13px] font-semibold uppercase tracking-[0.2em] text-brand">
            <span aria-hidden="true" className="h-px w-8 bg-brand" />
            {t.kicker}
          </div>

          <h1 className="font-display text-[clamp(1.75rem,3.6vw,2.75rem)] font-extrabold leading-[1.1] tracking-[-0.03em] text-ink text-balance">
            {t.title}
          </h1>

          <p className="-mt-2 font-display text-xl font-bold leading-snug tracking-[-0.01em] text-ink text-balance md:text-2xl">{t.hook}</p>

          <p className="max-w-lg text-lg leading-relaxed text-muted">{t.intro}</p>

          <ul className="flex flex-wrap gap-x-5 gap-y-2.5">
            {t.highlights.map((h) => (
              <li key={h} className="inline-flex items-center gap-2 text-[15px] font-semibold text-ink">
                <span aria-hidden="true" className="inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-brand-tint text-brand-dark">
                  <Icon name="check" size={14} />
                </span>
                {h}
              </li>
            ))}
          </ul>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <ButtonLink href="#quote" variant="cta" size="lg" icon="arrow" className="rounded-full [&_svg]:order-last rtl:[&_svg]:rotate-180">
              {t.getQuote}
            </ButtonLink>
            <ButtonLink href={whatsappLink(t.waMessage)} variant="whatsapp" icon="whatsapp" size="lg" external className="rounded-full">
              {t.whatsapp}
            </ButtonLink>
          </div>

          <a href={`tel:${site.phone}`} data-track="hero" className="inline-flex w-fit items-center gap-2 text-[15px] text-muted hover:text-ink">
            <Icon name="phone" size={16} />
            <span>{t.callUs}</span>
            <span dir="ltr" className="font-semibold text-ink underline-offset-4 hover:underline">{site.phoneDisplay}</span>
          </a>
        </Reveal>
      </Container>
    </section>
  );
}
