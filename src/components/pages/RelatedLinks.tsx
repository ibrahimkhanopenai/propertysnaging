import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { locationOrder } from "@/components/layout/nav";
import { getDictionary } from "@/i18n/dictionaries";
import { localePath, type Locale } from "@/i18n/config";
import { getPageContent, type PageKey } from "@/content/pages";
import { routePath, type RouteKey } from "@/lib/routes";

/** Internal links block: "Related services" + (location pages) "Other emirates we cover". */
export function RelatedLinks({ pageKey, locale, related, showEmirates }: { pageKey: PageKey; locale: Locale; related?: RouteKey[]; showEmirates?: boolean }) {
  if (!related?.length && !showEmirates) return null;
  const dict = getDictionary(locale);
  return (
    <section className="border-t border-line py-16">
      <Container className="grid gap-10 md:grid-cols-2">
        {related?.length ? (
          <nav aria-labelledby="related-title">
            <h2 id="related-title" className="mb-4 font-display text-xl font-extrabold">{dict.pageUi.related}</h2>
            <ul className="flex flex-col divide-y divide-line border-y border-line">
              {related.map((k) => {
                const rc = getPageContent(k as PageKey, locale);
                return (
                  <li key={k}>
                    <Link href={localePath(locale, routePath(k))} className="flex items-center justify-between gap-4 py-3.5 hover:underline">
                      {rc.navLabel || rc.breadcrumb}
                      <Icon name="arrow" size={18} className="shrink-0 rtl:rotate-180" />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        ) : null}
        {showEmirates ? (
          <nav aria-labelledby="emirates-title">
            <h2 id="emirates-title" className="mb-4 font-display text-xl font-extrabold">{dict.pageUi.otherEmirates}</h2>
            <ul className="flex flex-wrap gap-2">
              {locationOrder.filter((k) => k !== pageKey).map((k) => (
                <li key={k}>
                  <Link href={localePath(locale, routePath(k))} className="inline-flex min-h-11 items-center rounded-full border border-line px-4 hover:border-ink">
                    {getPageContent(k, locale).navLabel}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ) : null}
      </Container>
    </section>
  );
}
