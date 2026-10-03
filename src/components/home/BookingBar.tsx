import { Container } from "@/components/ui/Container";
import { BookingForm } from "@/components/forms/BookingForm";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";

/** Booking card that sits on the bottom edge of the hero (layout from the current site). */
export function BookingBar({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const t = dict.home.booking;
  return (
    <section aria-labelledby="booking-title" className="bg-white pb-12">
      <Container>
        <div className="rounded-3xl border border-brand-line border-t-4 border-t-brand bg-white p-6 shadow-[0_18px_50px_rgba(10,10,10,0.08)] md:p-8">
          <h2 id="booking-title" className="mb-6 text-center font-display text-xl font-extrabold md:text-2xl">{t.title}</h2>
          <BookingForm t={t} types={dict.quote.types} locale={locale} />
        </div>
      </Container>
    </section>
  );
}
