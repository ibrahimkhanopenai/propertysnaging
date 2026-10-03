import { Container } from "@/components/ui/Container";
import { Kicker } from "@/components/ui/Kicker";
import { Reveal } from "@/components/ui/Reveal";
import type { Dictionary } from "@/i18n/dictionaries";

/**
 * Why choose us as an editorial feature spread: an asymmetric masthead
 * (oversized statement + a standfirst set under a copper rule) over a two-column
 * ruled index where each reason leads with an oversized copper numeral and a
 * copper marker ticking the hairline — magazine typography, not icon cards.
 */
export function WhyChoose({ dict }: { dict: Dictionary }) {
  const t = dict.home.why;

  return (
    <section className="bg-white py-20 md:py-28">
      <Container>
        {/* Masthead — asymmetric: big statement + standfirst under a copper rule */}
        <Reveal className="grid gap-y-8 lg:grid-cols-12 lg:items-end lg:gap-x-16">
          <div className="flex flex-col gap-5 lg:col-span-7">
            <Kicker>{t.kicker}</Kicker>
            <h2 className="max-w-3xl font-display text-[clamp(2.2rem,5vw,3.6rem)] font-extrabold leading-[1.02] tracking-[-0.03em] text-balance">
              {t.title}
            </h2>
          </div>
          <p className="border-t-2 border-brand pt-5 text-lg leading-relaxed text-muted lg:col-span-4 lg:col-start-9">
            {t.text}
          </p>
        </Reveal>

        {/* Ruled index — oversized copper numerals across two editorial columns */}
        <Reveal
          as="ol"
          stagger
          className="mt-16 grid gap-x-12 gap-y-12 sm:grid-cols-2 lg:mt-20 lg:gap-x-20 lg:gap-y-14"
        >
          {t.items.map((it, i) => {
            const n = String(i + 1).padStart(2, "0");
            return (
              <li
                key={it.title}
                style={{ ["--i" as string]: i } as React.CSSProperties}
                className="group relative border-t border-line pt-8 sm:pt-9"
              >
                {/* copper accent segment on the hairline — an inspection marker */}
                <span aria-hidden="true" className="absolute -top-px start-0 h-0.5 w-10 bg-brand" />
                <div className="flex items-start gap-5 sm:gap-7">
                  <span className="font-display text-[clamp(3rem,7vw,5rem)] font-extrabold leading-[0.8] tracking-[-0.04em] tabular-nums text-brand transition-colors duration-300 group-hover:text-brand-dark">
                    {n}
                  </span>
                  <div className="min-w-0 flex-1 pt-1.5">
                    <h3 className="font-display text-xl font-extrabold leading-tight tracking-[-0.01em] sm:text-2xl">
                      {it.title}
                    </h3>
                    <p className="mt-3 leading-relaxed text-muted">{it.text}</p>
                  </div>
                </div>
              </li>
            );
          })}
        </Reveal>
      </Container>
    </section>
  );
}
