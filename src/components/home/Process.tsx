import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { Dictionary } from "@/i18n/dictionaries";

export function Process({ dict }: { dict: Dictionary }) {
  const t = dict.home.process;
  return (
    <section className="py-20 md:py-24">
      <Container className="flex flex-col gap-10">
        <SectionHeading title={t.title} />
        <ol className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {t.steps.map((s, i) => (
            <li key={s.title} className="flex flex-col gap-3 border-t-2 border-ink pt-5">
              <span className="font-display text-sm font-extrabold text-subtle" aria-hidden="true">0{i + 1}</span>
              <h3 className="font-display text-xl font-extrabold">{s.title}</h3>
              <p className="leading-relaxed text-muted">{s.text}</p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
