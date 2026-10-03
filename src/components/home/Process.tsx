import { Container } from "@/components/ui/Container";
import { Kicker } from "@/components/ui/Kicker";
import { Reveal } from "@/components/ui/Reveal";
import type { Dictionary } from "@/i18n/dictionaries";

/** Four-step inspection journey shown as a connected timeline. */
export function Process({ dict }: { dict: Dictionary }) {
  const t = dict.home.process;
  return (
    <section className="bg-white py-20 md:py-28">
      <Container className="flex flex-col gap-12">
        <Reveal className="flex max-w-2xl flex-col gap-3">
          <Kicker>{t.kicker}</Kicker>
          <h2 className="font-display text-[clamp(1.9rem,3.4vw,2.6rem)] font-extrabold leading-[1.1] tracking-[-0.02em] text-balance">{t.title}</h2>
        </Reveal>

        <Reveal as="ol" stagger className="relative grid gap-10 md:grid-cols-4 md:gap-8">
          {/* connecting line between the step markers (desktop) */}
          <span aria-hidden="true" className="absolute start-[12.5%] end-[12.5%] top-7 hidden h-px bg-line md:block" />
          {t.steps.map((s, i) => (
            <li key={s.title} style={{ ["--i" as string]: i } as React.CSSProperties} className="relative flex flex-col gap-4">
              <span className="relative z-10 inline-flex size-14 items-center justify-center rounded-full border-2 border-brand bg-brand-tint font-display text-xl font-extrabold text-brand">
                {i + 1}
              </span>
              <div className="flex flex-col gap-2">
                <h3 className="font-display text-xl font-extrabold">{s.title}</h3>
                <p className="leading-relaxed text-muted">{s.text}</p>
              </div>
            </li>
          ))}
        </Reveal>
      </Container>
    </section>
  );
}
