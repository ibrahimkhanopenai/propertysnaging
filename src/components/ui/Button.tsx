import Link from "next/link";
import { cn } from "@/lib/utils";
import { Icon, type IconName } from "./Icon";

type Variant = "primary" | "outline" | "whatsapp" | "light" | "ghostLight";

const variants: Record<Variant, string> = {
  primary: "bg-ink text-white hover:bg-ink-soft",
  outline: "border-[1.5px] border-ink text-ink hover:bg-ink hover:text-white",
  whatsapp: "bg-wa text-white hover:bg-wa-dark",
  light: "bg-white text-ink hover:bg-mist",
  ghostLight: "border-[1.5px] border-white/40 text-white hover:border-white",
};

type Props = {
  href: string;
  children: React.ReactNode;
  variant?: Variant;
  size?: "md" | "lg";
  icon?: IconName;
  className?: string;
  /** Opens in new tab (external) */
  external?: boolean;
  download?: boolean;
};

export function ButtonLink({ href, children, variant = "primary", size = "md", icon, className, external, download }: Props) {
  const cls = cn(
    "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl font-semibold transition-colors",
    size === "lg" ? "px-6 py-3.5 text-base" : "px-5 py-2.5 text-[15px]",
    variants[variant],
    className,
  );
  const content = (
    <>
      {icon ? <Icon name={icon} size={18} /> : null}
      <span>{children}</span>
    </>
  );
  const isExternal = external || /^(https?:|tel:|mailto:)/.test(href) || download;
  if (isExternal) {
    return (
      <a href={href} className={cls} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})} {...(download ? { download: "" } : {})}>
        {content}
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {content}
    </Link>
  );
}
