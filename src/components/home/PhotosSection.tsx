import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Kicker } from "@/components/ui/Kicker";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import type { Dictionary } from "@/i18n/dictionaries";
import { localePath, type Locale } from "@/i18n/config";
import { getGallery } from "@/lib/content-db";

/** Real inspection photos (Admin → Gallery, "featured"; falls back to site.defaultGallery). */
export async function PhotosSection({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const t = dict.home.photos;
  const photos = await getGallery({ featuredOnly: true, take: 8 });
  return (
    <section className="bg-white py-20 md:py-28">
      <Container className="flex flex-col gap-12">
        <Reveal className="flex flex-wrap items-end justify-between gap-6">
          <div className="flex max-w-2xl flex-col gap-3">
            <Kicker>{dict.nav.gallery}</Kicker>
            <h2 className="font-display text-[clamp(1.9rem,3.4vw,2.6rem)] font-extrabold leading-[1.1] tracking-[-0.02em] text-balance">{t.title}</h2>
            <p className="text-lg leading-relaxed text-muted">{t.text}</p>
          </div>
          <Link href={localePath(locale, "/gallery/")} className="group inline-flex items-center gap-2 font-semibold underline-offset-4 hover:underline">
            {t.link}
            <Icon name="arrow" size={18} className="transition group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
          </Link>
        </Reveal>

        <Reveal as="ul" stagger className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {photos.map((p, i) => (
            <li
              key={p.id}
              style={{ ["--i" as string]: i } as React.CSSProperties}
              className="group relative aspect-square overflow-hidden rounded-2xl bg-mist"
            >
              <Image src={p.url} alt={p.alt} fill sizes="(min-width: 768px) 24vw, 48vw" className="object-cover transition duration-500 group-hover:scale-105" />
              {p.caption ? (
                <span className="absolute inset-x-2 bottom-2 rounded-lg bg-ink/85 px-2.5 py-1.5 text-xs font-semibold text-white backdrop-blur">{p.caption}</span>
              ) : null}
            </li>
          ))}
        </Reveal>
      </Container>
    </section>
  );
}
