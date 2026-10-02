import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { JsonLd } from "@/components/seo/JsonLd";
import { faqSchema } from "@/lib/schema";

/** Accessible FAQ using native <details> (works without JS) + FAQPage JSON-LD */
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
  return (
    <section className="py-20 md:py-28">
      <Container className="grid gap-12 lg:grid-cols-[1fr_1.3fr]">
        <div className="flex flex-col gap-5">
          <SectionHeading title={title} text={text} as={as} />
          {link ? <Link href={link.href} className="font-semibold underline-offset-4 hover:underline">{link.label}</Link> : null}
        </div>
        <div className="divide-y divide-line border-y border-line">
          {items.map((f, i) => (
            <details key={f.q} className="group py-5" open={i === 0}>
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 font-display text-lg font-extrabold [&::-webkit-details-marker]:hidden">
                <h3 className="text-[inherit]">{f.q}</h3>
                <span aria-hidden="true" className="text-2xl font-normal transition group-open:rotate-45">+</span>
              </summary>
              <p className="pt-3 leading-relaxed text-muted">{f.a}</p>
            </details>
          ))}
        </div>
      </Container>
      {withSchema ? <JsonLd data={faqSchema(items)} /> : null}
    </section>
  );
}
