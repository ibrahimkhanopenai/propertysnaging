import { cn } from "@/lib/utils";

/** Small uppercase section label with a leading rule. Inherits text colour (works on light + dark). */
export function Kicker({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5 text-[12px] font-semibold uppercase tracking-[0.2em] text-brand", className)}>
      <span aria-hidden="true" className="h-px w-6 bg-current opacity-60" />
      {children}
    </span>
  );
}
