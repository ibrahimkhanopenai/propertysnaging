import { cn } from "@/lib/utils";

export function SectionHeading({
  title,
  text,
  as: Tag = "h2",
  className,
  id,
}: {
  title: string;
  text?: string;
  as?: "h1" | "h2";
  className?: string;
  id?: string;
}) {
  return (
    <div className={cn("flex max-w-2xl flex-col gap-3", className)}>
      <Tag id={id} className="font-display text-[clamp(1.9rem,3.4vw,2.6rem)] font-extrabold leading-[1.1] tracking-[-0.02em] text-balance">
        {title}
      </Tag>
      {text ? <p className="text-lg leading-relaxed text-muted">{text}</p> : null}
    </div>
  );
}
