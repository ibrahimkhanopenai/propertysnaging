import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { Kicker } from "@/components/ui/Kicker";
import { Reveal } from "@/components/ui/Reveal";
import type { Dictionary } from "@/i18n/dictionaries";
import { site } from "@/lib/site";
import { getSettings } from "@/lib/settings";
import { GoogleReviewsWidget } from "./GoogleReviewsWidget";

/**
 * Homepage reviews: heading + Google CTAs, then the live Google reviews
 * (SociableKit widget, `site.googleReviewsWidget`) full width below.
 */
export async function ReviewsMarquee({ dict }: { dict: Dictionary }) {
  const cfg = await getSettings();
  const t = dict.home.reviews;
  return (
    <section className="border-y border-line bg-mist py-16 md:py-24">
      <Container>
        <Reveal className="flex flex-wrap items-end justify-between gap-x-12 gap-y-7">
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

          <div className="flex flex-wrap gap-3">
            <ButtonLink href={cfg.googleReviewUrl} variant="outline" external className="rounded-full">
              {t.google}
            </ButtonLink>
            <ButtonLink href={cfg.googleReviewUrl} external className="rounded-full">
              {t.write}
            </ButtonLink>
          </div>
        </Reveal>

        <div className="mt-12">
          <GoogleReviewsWidget embedId={site.googleReviewsWidget.embedId} src={site.googleReviewsWidget.src} />
        </div>
      </Container>
    </section>
  );
}
