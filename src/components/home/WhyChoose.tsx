import { Container } from "@/components/ui/Container";
import { Kicker } from "@/components/ui/Kicker";
import { Icon, type IconName } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import type { Dictionary } from "@/i18n/dictionaries";

const icons: IconName[] = ["users", "search", "shield", "file", "camera", "home"];

/** Light editorial reasons — sticky intro on the left, open icon grid on the right. */
export function WhyChoose({ dict }: { dict: Dictionary }) {
  const t = dict.home.why;
  return (
    <section className="bg-white py-20 md:py-28">
      <Container className="grid gap-12 lg:grid-cols-[1fr_1.55fr] lg:gap-16">
        <Reveal className="flex flex-col gap-4 lg:sticky lg:top-28 lg:self-start">
          <Kicker>{t.kicker}</Kicker>
          <h2 className="font-display text-[clamp(1.9rem,3.4vw,2.6rem)] font-extrabold leading-[1.1] tracking-[-0.02em] text-balance">{t.title}</h2>
          <p className="text-lg leading-relaxed text-muted">{t.text}</p>
        </Reveal>

        <Reveal as="ul" stagger className="grid gap-x-8 gap-y-10 sm:grid-cols-2">
          {t.items.map((it, i) => (
            <li key={it.title} style={{ ["--i" as string]: i } as React.CSSProperties} className="flex flex-col gap-3">
              <span className="inline-flex size-12 items-center justify-center rounded-full bg-ink text-white">
                <Icon name={icons[i] ?? "check"} size={22} />
              </span>
              <h3 className="font-display text-lg font-extrabold">{it.title}</h3>
              <p className="leading-relaxed text-muted">{it.text}</p>
            </li>
          ))}
        </Reveal>
      </Container>
    </section>
  );
}
