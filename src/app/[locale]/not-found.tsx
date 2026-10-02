import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import en from "@/i18n/dictionaries/en";

// not-found cannot read params; English copy with links to both languages.
export default function NotFound() {
  return (
    <section className="py-28">
      <Container className="flex max-w-2xl flex-col items-start gap-5">
        <p className="font-display text-7xl font-extrabold">404</p>
        <h1 className="font-display text-3xl font-extrabold">{en.common.notFoundTitle}</h1>
        <p className="text-lg text-muted">{en.common.notFoundText}</p>
        <div className="flex flex-wrap gap-3">
          <ButtonLink href="/">{en.common.backHome}</ButtonLink>
          <ButtonLink href="/ar/" variant="outline">العربية</ButtonLink>
        </div>
      </Container>
    </section>
  );
}
