import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/pages/PageHero";
import { CtaBand } from "@/components/home/CtaBand";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { getDictionary } from "@/i18n/dictionaries";
import { isLocale, localePath } from "@/i18n/config";
import { getReviews } from "@/lib/content-db";
import { buildMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

export const revalidate = 3600;
type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const d = getDictionary(locale);
  return buildMetadata({ locale, path: "/reviews/", title: d.reviewsPage.metaTitle, description: d.reviewsPage.metaDescription });
}

/** Layout follows the client's reference image: hero + Google rating badge, review cards, "write a review" banner. */
export default async function ReviewsPage({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const d = getDictionary(locale);
  const reviews = await getReviews();
  return (
    <>
      <PageHero
        h1={d.reviewsPage.title}
        intro={d.reviewsPage.intro}
        breadcrumbs={[{ name: d.common.home, url: localePath(locale, "/") }, { name: d.nav.reviews, url: localePath(locale, "/reviews/") }]}
      >
        <span className="inline-flex items-center gap-4 rounded-2xl bg-ink px-5 py-3 text-white">
          <span className="font-display text-3xl font-extrabold">{site.reviews.rating}</span>
          <span>
            <span aria-hidden="true" className="block tracking-[0.15em]">★★★★★</span>
            <span className="text-sm text-zinc-400">{d.home.reviews.basedOn}</span>
          </span>
        </span>
        <ButtonLink href={site.googleReviewUrl} variant="outline" size="lg" external>{d.home.reviews.google}</ButtonLink>
      </PageHero>
      <section className="py-16 md:py-20">
        <Container>
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {(reviews.length ? reviews : []).map((r) => (
              <li key={r.id} className="flex flex-col gap-3 rounded-[18px] border border-line p-6">
                <div className="flex items-center gap-3">
                  <span className="flex size-10 items-center justify-center rounded-full bg-ink font-bold text-white">{r.name.charAt(0)}</span>
                  <span>
                    <span className="block font-semibold">{r.name}</span>
                    <span className="text-sm tracking-[0.1em]" aria-label={`${r.rating}/5`}>{"★".repeat(r.rating)}</span>
                  </span>
                </div>
                <p className="leading-relaxed text-muted">{r.text}</p>
                {r.location ? <p className="mt-auto flex items-center gap-1.5 text-sm text-subtle"><Icon name="pin" size={14} />{r.location}</p> : null}
              </li>
            ))}
            {reviews.length === 0 ? <li className="text-muted sm:col-span-2">{d.home.reviews.placeholder}</li> : null}
          </ul>
          <div className="mt-12 flex flex-wrap items-center justify-between gap-6 rounded-3xl bg-ink p-8 text-white">
            <div className="flex items-center gap-4">
              <span className="relative block size-14 overflow-hidden rounded-xl bg-white/10"><Image src={site.images.report[0]} alt="" fill sizes="56px" className="object-cover" /></span>
              <div>
                <p className="font-display text-xl font-extrabold">{d.reviewsPage.writeTitle}</p>
                <p className="text-zinc-400">{d.reviewsPage.writeText}</p>
              </div>
            </div>
            <ButtonLink href={site.googleReviewUrl} variant="ghostLight" external>{d.reviewsPage.writeButton}</ButtonLink>
          </div>
        </Container>
      </section>
      <CtaBand dict={d} quoteHref={`${localePath(locale, "/")}#quote`} />
    </>
  );
}
