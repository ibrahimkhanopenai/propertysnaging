import Link from "next/link";
import { JsonLd } from "./JsonLd";
import { breadcrumbSchema } from "@/lib/schema";

export function Breadcrumbs({ items }: { items: Array<{ name: string; url: string }> }) {
  return (
    <>
      <nav aria-label="Breadcrumb" className="text-sm text-subtle">
        <ol className="flex flex-wrap items-center gap-2">
          {items.map((it, i) => (
            <li key={it.url} className="flex items-center gap-2">
              {i > 0 ? <span aria-hidden="true">/</span> : null}
              {i === items.length - 1 ? (
                <span aria-current="page" className="text-ink">{it.name}</span>
              ) : (
                <Link href={it.url} className="hover:text-ink">{it.name}</Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
      <JsonLd data={breadcrumbSchema(items)} />
    </>
  );
}
