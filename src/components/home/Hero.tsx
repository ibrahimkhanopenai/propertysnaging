import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { Icon, type IconName } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";
import type { Dictionary } from "@/i18n/dictionaries";
import { type Locale } from "@/i18n/config";
import { site, whatsappLink } from "@/lib/site";

const highlightIcons: IconName[] = ["search", "shield", "file", "check"];

/**
 * Cinematic hero recreated from the client's reference mockup: the supplied
 * "city in hand" photo runs full-bleed, content overlays the left over a white
 * readability wash, with a navy corner flourish — not a plain two-column split.
 */
export function Hero({ dict }: { locale: Locale; dict: Dictionary }) {
  const t = dict.home.hero;
  return (
    <section className="relative isolate flex min-h-[620px] items-center overflow-hidden bg-white md:min-h-[600px] lg:min-h-[700px]">
      {/* Full-bleed supplied hero image */}
      <div className="absolute inset-0 -z-20">
        <Image
          src={site.images.hero}
          alt={t.imageAlt}
          fill
          priority
          sizes="100vw"
          className="object-cover object-[72%_20%] md:object-[right_center]"
        />
      </div>

      {/* Readability scrim — strong on the content side so dark text stays legible
          over the photo (incl. the dark suit sleeve), while the skyline stays visible. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 md:hidden"
        style={{ background: "linear-gradient(to bottom, #ffffff 0%, #ffffff 34%, rgba(255,255,255,0.74) 64%, rgba(255,255,255,0.45) 100%)" }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 hidden md:block"
        style={{ background: "linear-gradient(to right, #ffffff 0%, #ffffff 40%, rgba(255,255,255,0.82) 50%, rgba(255,255,255,0.18) 68%, transparent 84%)" }}
      />

      <Container className="relative w-full py-14 md:py-16 lg:py-20">
        <Reveal className="flex max-w-xl flex-col gap-6">
          <div className="flex items-center gap-3 text-[13px] font-semibold uppercase tracking-[0.2em] text-brand">
            <span aria-hidden="true" className="h-px w-8 bg-brand" />
            {t.kicker}
          </div>

          <h1 className="font-display text-[clamp(2.3rem,5vw,3.8rem)] font-extrabold leading-[1.02] tracking-[-0.03em] text-ink text-balance">
            {t.title}
          </h1>

          <p className="max-w-lg text-lg leading-relaxed text-muted">{t.intro}</p>

          <ul className="flex max-w-lg items-stretch">
            {t.highlights.map((h, i) => (
              <li key={h} className={cn("flex flex-1 flex-col items-center gap-2 px-2 text-center", i > 0 && "border-s border-line")}>
                <span className="inline-flex size-10 items-center justify-center rounded-full border border-brand/30 text-brand">
                  <Icon name={highlightIcons[i] ?? "check"} size={18} />
                </span>
                <span className="text-xs font-semibold leading-tight">{h}</span>
              </li>
            ))}
          </ul>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <ButtonLink href="#quote" size="lg" icon="arrow" className="rounded-full [&_svg]:order-last rtl:[&_svg]:rotate-180">
              {t.getQuote}
            </ButtonLink>
            <ButtonLink
              href={whatsappLink(dict.quote.waIntro)}
              variant="outline"
              icon="whatsapp"
              size="lg"
              external
              className="rounded-full border-ink/20 bg-white/85 backdrop-blur hover:bg-ink hover:text-white"
            >
              {t.whatsapp}
            </ButtonLink>
          </div>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 pt-1 text-sm text-muted">
            <a href={`tel:${site.phone}`} data-track="hero" className="inline-flex items-center gap-2 font-semibold text-ink hover:underline">
              <Icon name="phone" size={16} />
              <span>{t.callUs}</span>
              <span dir="ltr">{site.phoneDisplay}</span>
            </a>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
