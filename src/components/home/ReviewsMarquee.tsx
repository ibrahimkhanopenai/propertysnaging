import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { Kicker } from "@/components/ui/Kicker";
import { Reveal } from "@/components/ui/Reveal";
import type { Dictionary } from "@/i18n/dictionaries";
import { getReviews } from "@/lib/content-db";
import { site } from "@/lib/site";

type Card = { id: string | number; name: string; location: string | null; rating: number; text: string };

/**
 * Client testimonials as a clean editorial grid (brief: avoid carousel UI).
 * Admin → Reviews, else real testimonials from site.defaultReviews. Shows up to 6.
 */
export async function ReviewsMarquee({ dict }: { dict: Dictionary }) {
  const t = dict.home.reviews;
  const rows = await getReviews(20);
  const cards: Card[] = (rows.length
    ? rows.map((r) => ({ id: r.id, name: r.name, location: r.location, rating: r.rating, text: r.text }))
    : site.defaultReviews.map((r, i) => ({ id: `d${i}`, name: r.name, location: r.location, rating: r.rating, text: r.text }))
  ).slice(0, 6);

  return (
    <section className="border-y border-line bg-mist py-20 md:py-28">
      <Container className="flex flex-col gap-12">
        <Reveal className="flex flex-wrap items-end justify-between gap-6">
          <div className="flex flex-col gap-3">
            <Kicker>{dict.nav.reviews}</Kicker>
            <h2 className="font-display text-[clamp(1.9rem,3.4vw,2.6rem)] font-extrabold leading-[1.1] tracking-[-0.02em]">{t.title}</h2>
          </div>
          {/* Aggregate rating is hidden while it is a placeholder (client rule: no invented ratings) */}
          {!site.reviews.isPlaceholder ? (
            <div className="flex items-center gap-4 rounded-2xl bg-ink px-5 py-3 text-white">
              <span className="font-display text-3xl font-extrabold">{site.reviews.rating}</span>
              <span>
                <span aria-hidden="true" className="block tracking-[0.15em]">★★★★★</span>
                <span className="text-sm text-zinc-400">{t.basedOn}</span>
              </span>
            </div>
          ) : null}
        </Reveal>

        <Reveal as="ul" stagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((c, i) => (
            <li
              key={c.id}
              style={{ ["--i" as string]: i } as React.CSSProperties}
              className="flex flex-col gap-4 rounded-[20px] border border-line bg-white p-6 md:p-7"
            >
              <span className="tracking-[0.2em] text-ink" aria-label={`${c.rating}/5`}>{"★".repeat(c.rating)}</span>
              <p className="leading-relaxed text-muted">{c.text}</p>
              <p className="mt-auto pt-1 font-semibold">
                {c.name}
                {c.location ? <span className="font-normal text-subtle"> · {c.location}</span> : null}
              </p>
            </li>
          ))}
        </Reveal>

        <Reveal className="flex flex-wrap gap-3">
          <ButtonLink href={site.googleReviewUrl} variant="outline" external className="rounded-full">{t.google}</ButtonLink>
          <ButtonLink href={site.googleReviewUrl} external className="rounded-full">{t.write}</ButtonLink>
        </Reveal>
      </Container>
    </section>
  );
}
