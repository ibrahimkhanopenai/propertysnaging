import { Container } from "@/components/ui/Container";
import { Kicker } from "@/components/ui/Kicker";
import { Reveal } from "@/components/ui/Reveal";
import type { Dictionary } from "@/i18n/dictionaries";

/**
 * Four-step inspection journey. Oversized editorial ordinals (01–04) ride a
 * single copper checkpoint rail — horizontal on desktop, a vertical spine on
 * mobile — so the four steps read as one continuous path rather than a row of
 * identical cards. Numbers sit above the rail, the scene copy below it.
 */
export function Process({ dict }: { dict: Dictionary }) {
  const t = dict.home.process;
  return (
    <section className="bg-white py-16 md:py-24">
      <Container className="flex flex-col gap-12">
        <Reveal className="flex max-w-2xl flex-col gap-3">
          <Kicker>{t.kicker}</Kicker>
          <h2 className="font-display text-[clamp(1.9rem,3.4vw,2.6rem)] font-extrabold leading-[1.08] tracking-[-0.02em] text-balance">
            {t.title}
          </h2>
        </Reveal>

        <div className="relative">
          {/* vertical spine (mobile) */}
          <span
            aria-hidden="true"
            className="absolute start-[19px] top-1 bottom-4 w-px bg-gradient-to-b from-brand-line via-line to-transparent md:hidden"
          />
          {/* horizontal rail (desktop) */}
          <span
            aria-hidden="true"
            className="absolute inset-x-0 top-28 hidden h-px bg-gradient-to-r from-brand-line via-line to-transparent md:block"
          />

          <Reveal as="ol" stagger className="grid gap-12 md:grid-cols-4 md:gap-8">
            {t.steps.map((s, i) => (
              <li
                key={s.title}
                style={{ ["--i" as string]: i } as React.CSSProperties}
                className="relative ps-14 md:ps-0"
              >
                {/* checkpoint marker — copper ring on the rail */}
                <span
                  aria-hidden="true"
                  className="absolute start-[13px] top-1 z-10 grid size-3.5 place-items-center rounded-full border-2 border-brand bg-white md:start-0 md:top-28 md:-translate-y-1/2"
                >
                  <span className="size-1 rounded-full bg-brand" />
                </span>

                {/* oversized ordinal — ghost zero + copper index */}
                <span
                  aria-hidden="true"
                  dir="ltr"
                  className="block font-display text-[clamp(3rem,6.5vw,5.25rem)] font-extrabold leading-none tracking-[-0.04em] md:flex md:h-24 md:items-end"
                >
                  <span className="text-ink/15">0</span>
                  <span className="text-brand">{i + 1}</span>
                </span>

                {/* the step itself */}
                <div className="mt-5 flex flex-col gap-2 md:mt-10">
                  <h3 className="font-display text-xl font-extrabold tracking-[-0.01em] text-ink">{s.title}</h3>
                  <p className="leading-relaxed text-muted md:max-w-[22ch]">{s.text}</p>
                </div>
              </li>
            ))}
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
