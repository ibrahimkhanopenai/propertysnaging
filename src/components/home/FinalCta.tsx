import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { Kicker } from "@/components/ui/Kicker";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { QuoteForm } from "@/components/forms/QuoteForm";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";
import { getPricing } from "@/lib/pricing";
import { site, whatsappLink } from "@/lib/site";

/**
 * Final booking CTA (anchor #quote — every "Get a quote" button points here).
 * The page's closing SCENE: white hands over to black at a copper seam; the sign-off
 * statement + contact actions sit on the start column and the bright quote card rides
 * the end column from the top so the dark field is filled, with the office/phone/email
 * running as a numbered colophon across the foot.
 */
export function FinalCta({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const pricing = getPricing();

  const assurances = [dict.topbar.ded, dict.topbar.internachi, `${dict.home.trust.stats.turnaround}: 6–24h`];
  const contacts = [
    { icon: "pin" as const, label: dict.home.cta.address, value: `${site.address.street}, ${site.address.locality}, ${site.address.city}`, href: site.mapsUrl, external: true },
    { icon: "phone" as const, label: dict.home.cta.phone, value: site.phoneDisplay, href: `tel:${site.phone}`, ltr: true },
    { icon: "mail" as const, label: dict.home.cta.email, value: site.email, href: `mailto:${site.email}` },
  ];

  return (
    <section id="quote" className="relative scroll-mt-24 overflow-hidden bg-ink text-white">
      {/* Copper seam marking the white → black handover */}
      <span aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand to-transparent opacity-80" />

      <Container className="py-16 md:py-24">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-start lg:gap-16">
          {/* Start column: sign-off statement + contact actions */}
          <Reveal className="lg:col-span-5 lg:pt-1">
            <Kicker className="text-brand-light">{dict.nav.getQuote}</Kicker>
            <h2 className="mt-6 max-w-[16ch] font-display text-[clamp(2.1rem,4.4vw,3.6rem)] font-extrabold leading-[1.03] tracking-[-0.03em] text-balance">
              {dict.home.cta.title}
            </h2>
            {/* 'Sign-here' copper rule */}
            <span aria-hidden="true" className="mt-7 block h-px w-28 bg-brand" />

            <p className="mt-7 max-w-md text-lg leading-relaxed text-zinc-400">{dict.home.cta.text}</p>

            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href={`tel:${site.phone}`} variant="light" icon="phone" size="lg" className="rounded-full">{site.phoneDisplay}</ButtonLink>
              <ButtonLink href={whatsappLink(dict.quote.waIntro)} variant="whatsapp" icon="whatsapp" size="lg" external className="rounded-full">{dict.home.hero.whatsapp}</ButtonLink>
            </div>

            <ul className="mt-9 flex flex-wrap gap-2.5">
              {assurances.map((x) => (
                <li key={x} className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-2 text-sm text-zinc-300">
                  <Icon name="check" size={14} className="text-brand-light" />
                  {x}
                </li>
              ))}
            </ul>
          </Reveal>

          {/* End column: the bright quote card, top-aligned so it fills the dark field */}
          <Reveal delay={150} className="lg:col-span-7">
            <div className="relative">
              {/* Soft copper halo lifting the card off the black field */}
              <span aria-hidden="true" className="pointer-events-none absolute -inset-3 rounded-[30px] bg-brand/15 blur-3xl" />
              <div className="relative rounded-[24px] bg-white p-6 text-ink md:p-9">
                <div className="mb-6 flex items-start justify-between gap-4 border-b border-line pb-5">
                  <div>
                    <span className="inline-flex items-center gap-2.5 text-[12px] font-semibold uppercase tracking-[0.2em] text-brand-dark">
                      <span aria-hidden="true" className="h-px w-6 bg-current opacity-60" />
                      {dict.quote.label}
                    </span>
                    <h3 className="mt-2 font-display text-2xl font-extrabold tracking-[-0.02em]">{dict.quote.title}</h3>
                  </div>
                  <span aria-hidden="true" className="hidden size-12 shrink-0 items-center justify-center rounded-xl bg-brand-tint text-brand sm:inline-flex">
                    <Icon name="file" size={22} />
                  </span>
                </div>
                <QuoteForm t={dict.quote} locale={locale} perBedroom={pricing.perBedroom} currency={pricing.currency} whatsapp={site.whatsapp} />
                {/* Survey tick tying the card into the page's inspection system */}
                <span aria-hidden="true" className="pointer-events-none absolute end-4 top-4 size-5 border-e-2 border-t-2 border-brand/50" />
              </div>
            </div>
          </Reveal>
        </div>

        {/* Colophon: office / phone / email as a numbered contact index across the foot */}
        <Reveal as="ul" stagger className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-white/10 sm:grid-cols-3">
          {contacts.map((c, i) => (
            <li key={c.icon} style={{ ["--i" as string]: i } as React.CSSProperties} className="bg-white/[0.02]">
              <a
                href={c.href}
                {...(c.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="group flex h-full items-start gap-4 p-5 transition-colors hover:bg-white/[0.05] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand"
              >
                <span className="font-display text-xl font-extrabold tabular-nums leading-none text-brand">{String(i + 1).padStart(2, "0")}</span>
                <span className="flex flex-col">
                  <span className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.12em] text-zinc-400">
                    <Icon name={c.icon} size={13} className="text-brand-light" />
                    {c.label}
                  </span>
                  <span className="mt-1 font-semibold leading-snug text-zinc-100 group-hover:text-white group-hover:underline" dir={c.ltr ? "ltr" : undefined}>{c.value}</span>
                </span>
              </a>
            </li>
          ))}
        </Reveal>
      </Container>
    </section>
  );
}
