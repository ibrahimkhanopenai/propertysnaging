import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Kicker } from "@/components/ui/Kicker";
import { Reveal } from "@/components/ui/Reveal";
import { Icon } from "@/components/ui/Icon";
import type { Dictionary } from "@/i18n/dictionaries";
import { site } from "@/lib/site";

/**
 * Certification moment: an oversized "InterNACHI" wordmark statement set against
 * a copper-framed credential plate — the three official seals on a hairline-divided
 * row with generated ordinals and small labels. Asymmetric 5/7 layout, bg-mist,
 * uncluttered and premium (replaces the old centred row of 3 identical badge cards).
 */
export function CertifiedSection({ dict }: { dict: Dictionary }) {
  const t = dict.home.certified;
  // Same order as the current site: InterNACHI seal, CPI seal, Government of Dubai
  const badges = ["internachi1", "internachi2", "ded"] as const;

  return (
    <section className="border-y border-line bg-mist py-16 md:py-24">
      <Container>
        <div className="grid items-start gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Oversized statement — the wordmark is the hero of the section */}
          <Reveal className="lg:col-span-5">
            <Kicker>{t.label}</Kicker>
            <h2 className="mt-5 font-display text-[clamp(2.6rem,6vw,4.5rem)] font-extrabold leading-[0.95] tracking-[-0.03em] text-balance">
              {t.title}
            </h2>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-muted">{t.text}</p>
          </Reveal>

          {/* Credential plate */}
          <div className="lg:col-span-7">
            {/* copper technical line — the plate's top frame */}
            <div aria-hidden="true" className="mb-6 flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-brand" />
              <span className="h-px flex-1 bg-brand-line" />
            </div>
            <Reveal
              as="ul"
              stagger
              className="grid grid-cols-1 border-b border-brand-line sm:grid-cols-3"
            >
              {badges.map((key, i) => {
                const c = site.credentials.find((x) => x.key === key);
                if (!c) return null;
                return (
                  <li
                    key={key}
                    style={{ ["--i" as string]: i } as React.CSSProperties}
                    className="group relative flex flex-col items-center gap-5 px-5 py-9 text-center [&:not(:first-child)]:border-t [&:not(:first-child)]:border-line sm:[&:not(:first-child)]:border-t-0 sm:[&:not(:first-child)]:border-s sm:[&:not(:first-child)]:border-brand-line"
                  >
                    {/* generated ordinal — technical annotation */}
                    <span className="absolute start-5 top-4 font-display text-xs font-semibold tabular-nums tracking-[0.25em] text-brand">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="relative mt-3 flex aspect-[4/3] w-full max-w-[13rem] items-center justify-center rounded-xl bg-white shadow-[0_1px_0_rgba(10,10,10,0.04)] transition duration-300 group-hover:shadow-[0_16px_34px_rgba(10,10,10,0.08)]">
                      <Image
                        src={c.image}
                        alt={t.badges[key]}
                        fill
                        sizes="(max-width: 640px) 60vw, 200px"
                        className="object-contain p-5"
                      />
                    </span>
                    <span className="flex items-start gap-2">
                      <Icon name="check" size={15} className="mt-0.5 shrink-0 text-brand" />
                      <h3 className="text-sm font-medium leading-snug text-ink text-start">{t.badges[key]}</h3>
                    </span>
                  </li>
                );
              })}
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  );
}
