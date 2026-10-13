import { Container } from "@/components/ui/Container";
import { Kicker } from "@/components/ui/Kicker";
import { Reveal } from "@/components/ui/Reveal";
import type { Dictionary } from "@/i18n/dictionaries";
import { type Locale } from "@/i18n/config";
import { site } from "@/lib/site";
import { FindingsExplorer, type FindingItem } from "./FindingsExplorer";

type ScopeKey = keyof typeof site.images.scope;

/**
 * "Real findings" — an annotated inspection-report moment, not a card grid.
 * One dominant featured finding (photo with a copper annotation marker + an
 * overlapping report-card caption) sits beside an asymmetric "defect log";
 * clicking a row in the log shows that finding in the featured slot (FindingsExplorer).
 */
export function Findings({ dict }: { locale: Locale; dict: Dictionary }) {
  const t = dict.home.findings;
  const items: FindingItem[] = t.items.map((it) => {
    const photo = it.photo as ScopeKey;
    return { category: it.category, defect: it.defect, fix: it.fix, src: site.images.scope[photo], alt: dict.home.services.photoAlt[photo] };
  });

  return (
    <section className="border-y border-line bg-white py-16 md:py-24">
      <Container>
        {/* Header — editorial split: statement on the left, intro on the right */}
        <Reveal className="mb-10 grid gap-5 md:mb-12 lg:grid-cols-12 lg:items-end">
          <div className="flex flex-col gap-4 lg:col-span-7">
            <Kicker>{t.kicker}</Kicker>
            <h2 className="font-display text-[clamp(1.9rem,3.4vw,2.6rem)] font-extrabold leading-[1.08] tracking-[-0.02em] text-balance">
              {t.title}
            </h2>
          </div>
          <p className="text-lg leading-relaxed text-muted lg:col-span-5 lg:pb-1">{t.text}</p>
        </Reveal>

        <FindingsExplorer items={items} defectLabel={t.defectLabel} fixLabel={t.fixLabel} />
      </Container>
    </section>
  );
}
