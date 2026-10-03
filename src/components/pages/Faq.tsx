import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { JsonLd } from "@/components/seo/JsonLd";
import { faqSchema } from "@/lib/schema";

/**
 * FAQ — editorial "index" composition (brief: large type on one side, a clean
 * numbered accordion on the other, NOT rounded cards).
 *
 * A sticky left masthead carries an oversized heading, a generated copper index
 * range (01 — NN) that mirrors the list, the intro line and the "see all" CTA.
 * The right side is a hairline-ruled ledger: each question is a native <details>
 * row (works without JS) prefixed by a copper ordinal, with a thin copper rail and
 * a "+" that rotates into a copper "×" when the row is open. Questions stay as <h3>
 * in the DOM (crawlable) and the FAQPage JSON-LD is preserved.
 */
export function Faq({
  title,
  text,
  items,
  withSchema = true,
  link,
  as = "h2",
}: {
  title: string;
  text?: string;
  items: Array<{ q: string; a: string }>;
  withSchema?: boolean;
  link?: { href: string; label: string };
  as?: "h1" | "h2";
}) {
  if (!items.length) return null;
  const Heading = as;
  const total = String(items.length).padStart(2, "0");

  return (
    <section className="bg-white py-20 md:py-28">
      <Container className="grid gap-x-12 gap-y-12 lg:grid-cols-[0.82fr_1.4fr] lg:gap-x-20">
        {/* Masthead — anchored while the ledger scrolls past */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <Reveal className="flex flex-col gap-6">
            <span
              aria-hidden="true"
              className="inline-flex items-center gap-2.5 text-[12px] font-semibold uppercase tracking-[0.2em] text-brand tabular-nums"
            >
              <span className="h-px w-6 bg-current opacity-60" />
              01 &mdash; {total}
            </span>

            <Heading className="font-display text-[clamp(2.1rem,4.4vw,3.4rem)] font-extrabold leading-[1.03] tracking-[-0.03em] text-ink text-balance">
              {title}
            </Heading>

            {text ? <p className="max-w-md text-lg leading-relaxed text-muted">{text}</p> : null}

            {link ? (
              <ButtonLink
                href={link.href}
                variant="outline"
                icon="arrow"
                className="mt-1 self-start rounded-full [&_svg]:transition-transform rtl:[&_svg]:rotate-180 [&:hover_svg]:translate-x-0.5"
              >
                {link.label}
              </ButtonLink>
            ) : null}
          </Reveal>
        </div>

        {/* Ledger — hairline-ruled numbered accordion */}
        <Reveal as="ul" stagger className="border-t border-line">
          {items.map((f, i) => (
            <li key={f.q} style={{ ["--i" as string]: i } as React.CSSProperties}>
              <details
                className="group relative border-b border-line ps-5 transition-colors sm:ps-6"
                open={i === 0}
              >
                {/* Copper rail marks the open row along its start edge */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-y-0 start-0 w-0.5 origin-top scale-y-0 bg-brand transition-transform duration-300 group-open:scale-y-100"
                />

                <summary className="flex cursor-pointer list-none items-center gap-4 rounded-lg py-6 outline-none transition-colors focus-visible:ring-2 focus-visible:ring-brand/70 sm:gap-5 [&::-webkit-details-marker]:hidden">
                  <span
                    aria-hidden="true"
                    className="w-8 shrink-0 font-display text-sm font-extrabold tabular-nums text-subtle transition-colors group-open:text-brand sm:w-9"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  <h3 className="flex-1 font-display text-lg font-extrabold leading-snug tracking-[-0.01em] text-ink text-balance sm:text-xl">
                    {f.q}
                  </h3>

                  <span
                    aria-hidden="true"
                    className="grid size-9 shrink-0 place-items-center rounded-full border border-line text-xl font-normal leading-none text-muted transition-all duration-300 group-hover:border-brand-line group-hover:text-ink group-open:rotate-45 group-open:border-brand group-open:text-brand"
                  >
                    +
                  </span>
                </summary>

                <div className="pb-7 pe-4 ps-12 sm:ps-14">
                  <p className="max-w-2xl leading-relaxed text-muted">{f.a}</p>
                </div>
              </details>
            </li>
          ))}
        </Reveal>
      </Container>

      {withSchema ? <JsonLd data={faqSchema(items)} /> : null}
    </section>
  );
}
