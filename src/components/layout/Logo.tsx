import Image from "next/image";
import Link from "next/link";
import { site } from "@/lib/site";

/** Official logo (black for the header, white version for the dark footer). `large` = footer size, so the small "INSPECTORS.ME" line stays legible. */
export function Logo({ href, inverted = false, large = false }: { href: string; inverted?: boolean; large?: boolean }) {
  return (
    <Link href={href} className="flex shrink-0 items-center" aria-label={`${site.name} home`}>
      <Image
        src={inverted ? site.images.logoWhite : site.images.logo}
        alt={site.name}
        width={1200}
        height={451}
        sizes={large ? "(min-width: 768px) 260px, 215px" : "(min-width: 768px) 170px, 150px"}
        className={large ? "h-20 w-auto md:h-24" : "h-14 w-auto md:h-16"}
      />
    </Link>
  );
}
