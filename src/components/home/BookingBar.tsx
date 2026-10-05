import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { BookingForm } from "@/components/forms/BookingForm";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";

/** Premium split booking card that bridges the hero and the page (layout from the current site). */
export function BookingBar({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const t = dict.home.booking;
  return (
    <section aria-labelledby="booking-title" className="relative z-10 -mt-10 bg-white pb-16 md:-mt-14 md:pb-20">
      <Container>
        <Reveal className="overflow-hidden rounded-[24px] border border-line bg-white shadow-[0_24px_60px_rgba(10,10,10,0.12)]">
          <div className="grid lg:grid-cols-[0.8fr_2fr]">
            <div className="flex flex-col justify-center gap-4 bg-ink p-7 text-white md:p-9">
              <h2 id="booking-title" className="font-display text-xl font-extrabold leading-tight md:text-2xl">{t.title}</h2>
              <ul className="flex flex-col gap-2.5 text-sm text-zinc-300">
                {[dict.topbar.ded, dict.topbar.internachi, dict.topbar.areas].map((x) => (
                  <li key={x} className="flex items-center gap-2.5">
                    <Icon name="check" size={16} className="shrink-0 text-brand-light" />
                    {x}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex items-center p-6 md:p-9">
              <div className="w-full">
                <BookingForm t={t} types={dict.quote.types} locale={locale} />
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
