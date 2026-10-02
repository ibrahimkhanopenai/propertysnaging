import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import type { Dictionary } from "@/i18n/dictionaries";
import { getReviews } from "@/lib/content-db";
import { site } from "@/lib/site";

type Card = { id: string | number; name: string; location: string | null; rating: number; text: string };

/** Scrolling reviews (client requirement). Data: Admin → Reviews. Placeholders until real reviews are added. */
export async function ReviewsMarquee({ dict }: { dict: Dictionary }) {
  const t = dict.home.reviews;
  const rows = await getReviews(20);
  const cards: Card[] = rows.length
    ? rows.map((r) => ({ id: r.id, name: r.name, location: r.location, rating: r.rating, text: r.text }))
    : [1, 2, 3, 4, 5].map((n) => ({ id: `p${n}`, name: "—", location: null, rating: 5, text: t.placeholder }));
  const loop = [...cards, ...cards]; // duplicated for a seamless loop

  return (
    <section className="overflow-hidden py-20 md:py-24">
      <Container className="flex flex-wrap items-end justify-between gap-6">
        <h2 className="font-display text-[clamp(1.9rem,3.4vw,2.6rem)] font-extrabold leading-[1.1] tracking-[-0.02em]">{t.title}</h2>
        <div className="flex items-center gap-4 rounded-2xl bg-ink px-5 py-3 text-white">
          <span className="font-display text-3xl font-extrabold">{site.reviews.rating}</span>
          <span>
            <span aria-hidden="true" className="block tracking-[0.15em]">★★★★★</span>
            <span className="text-sm text-zinc-400">{t.basedOn}</span>
          </span>
        </div>
      </Container>
      <div className="marquee mt-10" tabIndex={0} aria-label={t.title}>
        <ul className="marquee-track flex gap-5 px-5">
          {loop.map((c, i) => (
            <li key={`${c.id}-${i}`} aria-hidden={i >= cards.length ? true : undefined} className="flex w-[320px] shrink-0 flex-col gap-3 rounded-[18px] border border-line bg-white p-6">
              <span className="tracking-[0.15em]" aria-label={`${c.rating}/5`}>{"★".repeat(c.rating)}</span>
              <p className="line-clamp-5 leading-relaxed text-muted">{c.text}</p>
              <p className="mt-auto font-semibold">{c.name}{c.location ? <span className="font-normal text-subtle"> · {c.location}</span> : null}</p>
            </li>
          ))}
        </ul>
      </div>
      <Container className="mt-8 flex flex-wrap gap-3">
        <ButtonLink href={site.googleReviewUrl} variant="outline" external>{t.google}</ButtonLink>
        <ButtonLink href={site.googleReviewUrl} external>{t.write}</ButtonLink>
      </Container>
    </section>
  );
}
