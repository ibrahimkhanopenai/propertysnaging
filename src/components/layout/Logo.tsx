import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

/** Text + icon logo (no image request). Swap for the official SVG logo when available. */
export function Logo({ href, inverted = false }: { href: string; inverted?: boolean }) {
  return (
    <Link href={href} className={cn("flex items-center gap-2.5", inverted ? "text-white" : "text-ink")} aria-label="Property Inspectors home">
      <Icon name="home" size={36} />
      <span className="flex flex-col leading-none">
        <span className="font-display text-[17px] font-extrabold tracking-[0.04em]">PROPERTY</span>
        <span className={cn("text-[10.5px] tracking-[0.3em]", inverted ? "text-white/70" : "text-muted")}>INSPECTORS</span>
      </span>
    </Link>
  );
}
