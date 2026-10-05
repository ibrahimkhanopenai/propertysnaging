import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { Kicker } from "@/components/ui/Kicker";
import { Reveal } from "@/components/ui/Reveal";
import type { Dictionary } from "@/i18n/dictionaries";
import { getReviews } from "@/lib/content-db";
import { site } from "@/lib/site";

type Card = { id: string | number; name: string; location: string | null; rating: number; text: string };

/**
 * Editorial testimonial spread (brief: typography-led, not equal cards).
 * A sticky masthead (label + title + aggregate rating + CTAs) sits beside a quotes
 * column: one oversized featured quote with a giant copper quotation mark, then the
 * remaining reviews as smaller copper-numbered supporting quotes with generous whitespace.
 * Data: Admin → Reviews via getReviews(), else real testimonials from site.defaultReviews.
 */
export async function ReviewsMarquee({ dict }: { dict: Dictionary }) {
  const t = dict.home.reviews;
  const rows = await getReviews(20);
  const cards: Card[] = (rows.length
    ? rows.map((r) => ({ id: r.id, name: r.name, location: r.location, rating: r.rating, text: r.text }))
    : site.defaultReviews.map((r, i) => ({ id: `d${i}`, name: r.name, location: r.location, rating: r.rating, text: r.text }))
  ).slice(0, 6);

  const [featured, ...supporting] = cards;
  if (!featured) return null;

  return (
    <section className="border-y border-line bg-mist py-16 md:py-24">
      <Container>
        <div className="grid gap-x-12 gap-y-16 lg:grid-cols-12">
          {/* Masthead — anchored while the quotes scroll past */}
          <div className="lg:col-span-4 lg:sticky lg:top-28 lg:self-start">
            <Reveal className="flex flex-col gap-7">
              <div className="flex flex-col gap-4">
                <Kicker>{dict.nav.reviews}</Kicker>
                <h2 className="font-display text-[clamp(1.9rem,3.4vw,2.6rem)] font-extrabold leading-[1.05] tracking-[-0.03em] text-ink text-balance">
                  {t.title}
                </h2>
              </div>

              {/* Aggregate rating stays hidden while it is a placeholder (client rule: no invented ratings) */}
              {!site.reviews.isPlaceholder ? (
                <div className="flex items-end gap-5">
                  <span className="font-display text-[clamp(3rem,6vw,4.25rem)] font-extrabold leading-[0.85] tracking-[-0.03em] text-ink">
                    {site.reviews.rating}
                  </span>
                  <div className="pb-1.5">
                    <span aria-hidden="true" className="block tracking-[0.15em] text-brand">★★★★★</span>
                    <span className="text-sm text-muted">{t.basedOn}</span>
                  </div>
                </div>
              ) : null}

              <div className="mt-1 flex flex-wrap gap-3">
                <ButtonLink href={site.googleReviewUrl} variant="outline" external className="rounded-full">
                  {t.google}
                </ButtonLink>
                <ButtonLink href={site.googleReviewUrl} external className="rounded-full">
                  {t.write}
                </ButtonLink>
              </div>
            </Reveal>
          </div>

          {/* Quotes */}
          <div className="flex flex-col gap-12 lg:col-span-8">
            {/* Featured quote — oversized, typography-led, copper quotation mark */}
            <Reveal>
              <figure className="relative">
                <span
                  aria-hidden="true"
                  className="pointer-events-none block select-none font-display text-[clamp(4.5rem,11vw,7.5rem)] font-extrabold leading-[0.55] text-brand"
                >
                  &ldquo;
                </span>
                <blockquote className="mt-4">
                  <p className="font-display text-[clamp(1.5rem,2.9vw,2.3rem)] font-extrabold leading-[1.18] tracking-[-0.02em] text-ink text-balance">
                    {featured.text}
                  </p>
                </blockquote>
                <figcaption className="mt-7 flex flex-wrap items-center gap-x-4 gap-y-2">
                  <span aria-hidden="true" className="h-px w-10 bg-brand" />
                  <span className="font-display text-lg font-extrabold tracking-[-0.01em] text-ink">{featured.name}</span>
                  {featured.location ? <span className="text-subtle">{featured.location}</span> : null}
                  <span className="ms-auto tracking-[0.18em] text-ink/80" role="img" aria-label={`${featured.rating}/5`}>
                    <span aria-hidden="true">{"★".repeat(featured.rating)}</span>
                  </span>
                </figcaption>
              </figure>
            </Reveal>

            {/* Supporting quotes — smaller, copper-numbered, separated by whitespace (no cards) */}
            {supporting.length > 0 ? (
              <Reveal as="ul" stagger className="grid gap-x-12 gap-y-9 border-t border-line pt-10 sm:grid-cols-2">
                {supporting.map((c, i) => (
                  <li
                    key={c.id}
                    style={{ ["--i" as string]: i } as React.CSSProperties}
                    className="flex gap-4"
                  >
                    <span
                      aria-hidden="true"
                      className="font-display text-xl font-extrabold leading-none tabular-nums text-brand"
                    >
                      {String(i + 2).padStart(2, "0")}
                    </span>
                    <figure className="flex flex-col gap-3">
                      <blockquote>
                        <p className="leading-relaxed text-muted">{c.text}</p>
                      </blockquote>
                      <figcaption className="text-sm font-semibold text-ink">
                        {c.name}
                        {c.location ? <span className="font-normal text-subtle"> · {c.location}</span> : null}
                      </figcaption>
                    </figure>
                  </li>
                ))}
              </Reveal>
            ) : null}
          </div>
        </div>
      </Container>
    </section>
  );
}
