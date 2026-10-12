import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Kicker } from "@/components/ui/Kicker";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import type { Dictionary } from "@/i18n/dictionaries";
import { localePath, type Locale } from "@/i18n/config";
import { getGallery } from "@/lib/content-db";
import { Lightbox } from "@/components/ui/Lightbox";

/**
 * Inspection photo grid: uniform 4:5 portrait frames (our photos are portrait phone shots, so
 * almost nothing is cropped — client feedback 2026-10-09: "photos are not complete"). Every
 * frame opens the full photo in the Lightbox. Each frame carries a copper ordinal marker; real
 * captions render as small tags. Data: Admin → Gallery "featured" (falls back to
 * site.defaultGallery). 8 photos = 4 full rows on mobile (2 cols) and 2 on md+ (4 cols).
 */
export async function PhotosSection({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const t = dict.home.photos;
  const photos = await getGallery({ featuredOnly: true, take: 8 });

  return (
    <section className="bg-white py-16 md:py-24">
      <Container className="flex flex-col gap-8 md:gap-10">
        <Reveal className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <Kicker>{dict.nav.gallery}</Kicker>
            <h2 className="mt-5 font-display text-[clamp(2rem,4.5vw,3.4rem)] font-extrabold leading-[1.05] tracking-[-0.03em] text-balance">
              {t.title}
            </h2>
            <p className="mt-4 max-w-xl text-lg leading-relaxed text-muted">{t.text}</p>
          </div>
          <Link
            href={localePath(locale, "/gallery/")}
            className="group inline-flex shrink-0 items-center gap-2 self-start rounded-full border border-ink/15 bg-white px-5 py-2.5 text-sm font-semibold text-ink transition hover:border-brand hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 md:self-auto"
          >
            {t.link}
            <Icon name="arrow" size={18} className="transition group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
          </Link>
        </Reveal>

        {/* copper hairline — carries the eye from the header into the mosaic */}
        <div aria-hidden="true" className="h-px w-full bg-gradient-to-r from-brand/50 via-line to-transparent" />

        <Lightbox items={photos.map(({ url, alt, caption }) => ({ url, alt, caption }))} t={dict.lightbox}>
          <Reveal as="ul" stagger className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
            {photos.map((p, i) => (
              <li
                key={p.id}
                style={{ ["--i" as string]: i } as React.CSSProperties}
                className="group relative aspect-[4/5] overflow-hidden rounded-2xl bg-mist ring-1 ring-black/5 transition duration-300 hover:ring-2 hover:ring-brand/40"
              >
                <button
                  type="button"
                  data-lightbox={i}
                  aria-label={`${dict.lightbox.open}: ${p.alt}`}
                  className="absolute inset-0 cursor-zoom-in rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand"
                >
                  <Image
                    src={p.url}
                    alt={p.alt}
                    fill
                    sizes="(min-width: 768px) 24vw, 50vw"
                    className="object-cover transition duration-700 ease-out group-hover:scale-[1.04]"
                  />
                  {/* bottom scrim only where a caption sits, for legibility */}
                  {p.caption ? (
                    <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-ink/55 to-transparent" />
                  ) : null}

                  {/* inspection marker: copper frame number */}
                  <span
                    aria-hidden="true"
                    className="absolute end-3 top-3 grid h-6 min-w-[1.5rem] place-items-center rounded-full bg-ink/70 px-1.5 font-display text-[11px] font-bold tabular-nums text-brand-light backdrop-blur-sm"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  {/* "tap to enlarge" hint: always on touch screens, on hover for mouse */}
                  <span
                    aria-hidden="true"
                    className="absolute bottom-3 end-3 grid size-8 place-items-center rounded-full bg-paper/90 text-ink shadow-sm transition md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100"
                  >
                    <Icon name="search" size={16} />
                  </span>

                  {p.caption ? (
                    <span className="absolute bottom-3 end-14 start-3 text-start">
                      <span className="inline-flex max-w-full items-center gap-2 rounded-full bg-paper/95 px-3 py-1.5 text-[13px] font-semibold text-ink shadow-sm ring-1 ring-black/5 backdrop-blur">
                        <span aria-hidden="true" className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
                        <span className="truncate">{p.caption}</span>
                      </span>
                    </span>
                  ) : null}
                </button>
              </li>
            ))}
          </Reveal>
        </Lightbox>
      </Container>
    </section>
  );
}
