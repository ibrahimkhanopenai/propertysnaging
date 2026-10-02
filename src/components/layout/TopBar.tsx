import { Container } from "@/components/ui/Container";
import type { Dictionary } from "@/i18n/dictionaries";
import { site } from "@/lib/site";

export function TopBar({ dict }: { dict: Dictionary }) {
  return (
    <div className="bg-ink text-[13px] text-zinc-300">
      <Container className="flex items-center justify-between gap-4 py-2">
        <p className="hidden gap-5 sm:flex">
          <span>{dict.topbar.ded}</span>
          <span>{dict.topbar.internachi}</span>
          <span className="hidden md:inline">{dict.topbar.areas}</span>
        </p>
        <a href={`tel:${site.phone}`} className="ms-auto text-white hover:underline" dir="ltr">
          {site.phoneDisplay}
        </a>
      </Container>
    </div>
  );
}
