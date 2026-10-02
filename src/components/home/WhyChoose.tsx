import { Container } from "@/components/ui/Container";
import { Icon, type IconName } from "@/components/ui/Icon";
import type { Dictionary } from "@/i18n/dictionaries";

const icons: IconName[] = ["users", "search", "shield", "file"];

export function WhyChoose({ dict }: { dict: Dictionary }) {
  const t = dict.home.why;
  return (
    <section className="bg-ink py-20 text-white md:py-24">
      <Container className="flex flex-col gap-10">
        <h2 className="max-w-2xl font-display text-[clamp(1.9rem,3.4vw,2.6rem)] font-extrabold leading-[1.1] tracking-[-0.02em]">{t.title}</h2>
        <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {t.items.map((it, i) => (
            <li key={it.title} className="flex flex-col gap-3">
              <Icon name={icons[i] ?? "check"} size={28} />
              <h3 className="font-display text-lg font-extrabold">{it.title}</h3>
              <p className="leading-relaxed text-zinc-400">{it.text}</p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
