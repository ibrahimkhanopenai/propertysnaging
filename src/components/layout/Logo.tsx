import Image from "next/image";
import Link from "next/link";
import { site } from "@/lib/site";

/** Official logo (black for the header, white version for the dark footer). */
export function Logo({ href, inverted = false }: { href: string; inverted?: boolean }) {
  return (
    <Link href={href} className="flex shrink-0 items-center" aria-label={`${site.name} home`}>
      <Image
        src={inverted ? site.images.logoWhite : site.images.logo}
        alt={site.name}
        width={1200}
        height={451}
        sizes="(min-width: 768px) 170px, 150px"
        className="h-14 w-auto md:h-16"
      />
    </Link>
  );
}
