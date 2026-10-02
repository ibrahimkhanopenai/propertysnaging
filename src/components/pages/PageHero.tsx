import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";

export function PageHero({
  h1,
  intro,
  breadcrumbs,
  image,
  imageAlt,
  children,
}: {
  h1: string;
  intro: string;
  breadcrumbs: Array<{ name: string; url: string }>;
  image?: string;
  imageAlt?: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="border-b border-line bg-white">
      <Container className={image ? "grid items-center gap-10 py-12 md:py-16 lg:grid-cols-2" : "py-12 md:py-16"}>
        <div className="flex max-w-3xl flex-col gap-5">
          <Breadcrumbs items={breadcrumbs} />
          <h1 className="font-display text-[clamp(2.1rem,4.4vw,3.2rem)] font-extrabold leading-[1.06] tracking-[-0.025em] text-balance">{h1}</h1>
          <p className="text-lg leading-relaxed text-muted">{intro}</p>
          {children ? <div className="flex flex-wrap gap-3 pt-1">{children}</div> : null}
        </div>
        {image ? (
          <div className="relative aspect-[4/3] overflow-hidden rounded-[22px] bg-mist">
            <Image src={image} alt={imageAlt || h1} fill priority sizes="(min-width: 1024px) 580px, 100vw" className="object-cover" />
          </div>
        ) : null}
      </Container>
    </section>
  );
}
