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
        height={463}
        sizes="140px"
        className="h-11 w-auto md:h-12"
      />
    </Link>
  );
}
