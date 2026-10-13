import { Container } from "@/components/ui/Container";
import type { Dictionary } from "@/i18n/dictionaries";
import { getSettings } from "@/lib/settings";

export async function TopBar({ dict }: { dict: Dictionary }) {
  const cfg = await getSettings();
  return (
    <div className="bg-ink text-[13px] text-zinc-300">
      <Container className="flex items-center justify-between gap-4 py-2">
        <p className="hidden gap-5 sm:flex">
          <span>{dict.topbar.ded}</span>
          <span>{dict.topbar.internachi}</span>
          <span className="hidden md:inline">{dict.topbar.areas}</span>
        </p>
        <a href={`tel:${cfg.phone}`} className="ms-auto text-white hover:underline" dir="ltr">
          {cfg.phoneDisplay}
        </a>
      </Container>
    </div>
  );
}
