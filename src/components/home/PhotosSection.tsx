import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Kicker } from "@/components/ui/Kicker";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import type { Dictionary } from "@/i18n/dictionaries";
import { localePath, type Locale } from "@/i18n/config";
import { getGallery } from "@/lib/content-db";
import { cn } from "@/lib/utils";

/**
 * Editorial inspection gallery — an art-directed mosaic (one wide feature frame,
 * one tall portrait, and smaller supporting frames) instead of a uniform square grid.
 * Each frame carries a copper "inspection marker" ordinal; real captions render as
 * small copper-accented tags. Data: Admin → Gallery "featured" (falls back to
 * site.defaultGallery). The tile pattern tiles a clean rectangle at 2 cols (mobile)
 * and 6 cols (md+); grid-auto-flow: dense backfills if fewer frames come back.
 */
const LAYOUT = [
  // 0 — wide landscape feature
  { cls: "col-span-2 row-span-2 md:col-span-4 md:row-span-2", sizes: "(min-width: 768px) 56vw, 100vw" },
  // 1 — tall portrait feature
  { cls: "col-span-1 row-span-2 md:col-span-2 md:row-span-3", sizes: "(min-width: 768px) 28vw, 50vw" },
  { cls: "col-span-1 md:col-span-2", sizes: "(min-width: 768px) 28vw, 50vw" },
  { cls: "col-span-1 md:col-span-2", sizes: "(min-width: 768px) 28vw, 50vw" },
  // 4 — full-width band on mobile for rhythm
  { cls: "col-span-2 md:col-span-2", sizes: "(min-width: 768px) 28vw, 100vw" },
  { cls: "col-span-1 md:col-span-2", sizes: "(min-width: 768px) 28vw, 50vw" },
  { cls: "col-span-1 md:col-span-2", sizes: "(min-width: 768px) 28vw, 50vw" },
] as const;

export async function PhotosSection({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const t = dict.home.photos;
  const photos = await getGallery({ featuredOnly: true, take: 7 });

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

        <Reveal
          as="ul"
          stagger
          className="grid auto-rows-[7.25rem] grid-cols-2 gap-3 [grid-auto-flow:dense] md:auto-rows-[9rem] md:grid-cols-6 md:gap-4"
        >
          {photos.map((p, i) => {
            const spec = LAYOUT[i % LAYOUT.length];
            const ordinal = String(i + 1).padStart(2, "0");
            return (
              <li
                key={p.id}
                style={{ ["--i" as string]: i } as React.CSSProperties}
                className={cn(
                  "group relative overflow-hidden rounded-2xl bg-mist ring-1 ring-black/5 transition duration-300 hover:ring-2 hover:ring-brand/40",
                  spec.cls,
                )}
              >
                <figure className="absolute inset-0">
                  <Image
                    src={p.url}
                    alt={p.alt}
                    fill
                    sizes={spec.sizes}
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
                    {ordinal}
                  </span>

                  {p.caption ? (
                    <figcaption className="absolute inset-x-3 bottom-3">
                      <span className="inline-flex max-w-full items-center gap-2 rounded-full bg-paper/95 px-3 py-1.5 text-[11px] font-semibold text-ink shadow-sm ring-1 ring-black/5 backdrop-blur">
                        <span aria-hidden="true" className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
                        <span className="truncate">{p.caption}</span>
                      </span>
                    </figcaption>
                  ) : null}
                </figure>
              </li>
            );
          })}
        </Reveal>
      </Container>
    </section>
  );
}
