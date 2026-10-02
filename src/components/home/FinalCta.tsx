import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { QuoteForm } from "@/components/forms/QuoteForm";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";
import { getPricing } from "@/lib/pricing";
import { site, whatsappLink } from "@/lib/site";

/** Final booking CTA with the quote form (anchor #quote — every "Get a quote" button points here). */
export function FinalCta({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const pricing = getPricing();
  return (
    <section id="quote" className="scroll-mt-24 bg-ink py-20 md:py-24">
      <Container className="grid items-start gap-10 lg:grid-cols-[1fr_1.15fr]">
        <div className="flex flex-col gap-5 text-white lg:sticky lg:top-28">
          <h2 className="font-display text-[clamp(1.9rem,3.4vw,2.6rem)] font-extrabold leading-[1.1] tracking-[-0.02em] text-balance">{dict.home.cta.title}</h2>
          <p className="text-lg text-zinc-400">{dict.home.cta.text}</p>
          <div className="flex flex-wrap gap-3">
            <ButtonLink href={`tel:${site.phone}`} variant="light" icon="phone" size="lg">{site.phoneDisplay}</ButtonLink>
            <ButtonLink href={whatsappLink(dict.quote.waIntro)} variant="whatsapp" icon="whatsapp" size="lg" external>{dict.home.hero.whatsapp}</ButtonLink>
          </div>
          <ul className="mt-2 flex flex-col gap-2 text-zinc-300">
            {[dict.topbar.ded, dict.topbar.internachi, `${dict.home.trust.stats.turnaround}: 6–24h`].map((x) => (
              <li key={x} className="flex items-center gap-2"><Icon name="check" size={18} />{x}</li>
            ))}
          </ul>
          <ul className="mt-4 flex flex-col gap-4 border-t border-zinc-800 pt-6">
            {[
              { icon: "pin" as const, label: dict.home.cta.address, value: `${site.address.street}, ${site.address.locality}, ${site.address.city}`, href: site.mapsUrl, external: true },
              { icon: "phone" as const, label: dict.home.cta.phone, value: site.phoneDisplay, href: `tel:${site.phone}`, ltr: true },
              { icon: "mail" as const, label: dict.home.cta.email, value: site.email, href: `mailto:${site.email}` },
            ].map((c) => (
              <li key={c.icon}>
                <a href={c.href} {...(c.external ? { target: "_blank", rel: "noopener noreferrer" } : {})} className="group flex items-start gap-4">
                  <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-white/10 transition group-hover:bg-white group-hover:text-ink">
                    <Icon name={c.icon} size={20} />
                  </span>
                  <span className="flex flex-col">
                    <span className="text-sm text-zinc-400">{c.label}</span>
                    <span className="font-semibold group-hover:underline" dir={c.ltr ? "ltr" : undefined}>{c.value}</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-[22px] border-t-4 border-brand bg-white p-6 md:p-9">
          <p className="text-[15px] font-semibold text-brand-dark">{dict.quote.label}</p>
          <h3 className="mb-5 font-display text-2xl font-extrabold">{dict.quote.title}</h3>
          <QuoteForm t={dict.quote} locale={locale} perBedroom={pricing.perBedroom} currency={pricing.currency} whatsapp={site.whatsapp} />
        </div>
      </Container>
    </section>
  );
}
