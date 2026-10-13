import Link from "next/link";
import { prisma } from "@/lib/db";
import { getPageContent } from "@/content/pages";
import { editablePages } from "@/lib/admin-pages";
import { pageTextFormValues } from "@/lib/page-text";
import { PageTextForm } from "@/components/admin/PageTextForm";

export const metadata = { title: "Page text" };
const groups = [
  { key: "service", title: "Service pages" },
  { key: "location", title: "Location pages" },
] as const;

/** Admin → Page text: hook, intro and sections of the service + location pages, per language. */
export default async function PageTextAdmin({ searchParams }: { searchParams: Promise<{ p?: string; l?: string }> }) {
  const { p, l } = await searchParams;
  const current = editablePages.find((x) => x.key === p) ?? editablePages[0];
  const locale = l === "ar" ? "ar" : "en";
  const [row, edited] = await Promise.all([
    prisma.pageText.findUnique({ where: { page_locale: { page: current.key, locale } } }),
    prisma.pageText.findMany({ select: { page: true } }),
  ]);
  const editedPages = new Set(edited.map((r) => r.page));
  const isLocation = current.group === "location";
  const viewPath = locale === "ar" ? `/ar${current.path}` : current.path;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold">Page text</h1>
        <p className="max-w-3xl text-sm text-muted">
          Edit the body text of a service or location page. Each page keeps its own unique text (client rule: no copied pages
          with the city name swapped). URLs, page titles, meta descriptions, H1s and FAQs are not edited here (FAQs: Admin → FAQs).
        </p>
      </div>

      <nav className="flex flex-col gap-3">
        {groups.map((g) => (
          <div key={g.key} className="flex flex-wrap items-center gap-2">
            <span className="w-32 shrink-0 text-xs font-semibold uppercase tracking-wide text-subtle">{g.title}</span>
            {editablePages
              .filter((x) => x.group === g.key)
              .map((x) => (
                <Link
                  key={x.key}
                  href={`/admin/page-text/?p=${x.key}&l=${locale}`}
                  className={`rounded-full border px-3 py-1.5 text-sm font-semibold ${x.key === current.key ? "border-ink bg-ink text-white" : "border-line bg-white hover:border-ink"}`}
                >
                  {x.label}
                  {editedPages.has(x.key) ? <span className="ms-1.5 text-[10px] uppercase opacity-70">edited</span> : null}
                </Link>
              ))}
          </div>
        ))}
      </nav>

      <div className="flex flex-wrap items-center gap-3">
        <h2 className="text-lg font-bold">{current.label}</h2>
        <div className="flex gap-1 rounded-full border border-line bg-white p-1">
          {(["en", "ar"] as const).map((x) => (
            <Link
              key={x}
              href={`/admin/page-text/?p=${current.key}&l=${x}`}
              className={`rounded-full px-3 py-1 text-sm font-semibold ${x === locale ? "bg-ink text-white" : "hover:bg-mist"}`}
            >
              {x === "en" ? "English" : "Arabic"}
            </Link>
          ))}
        </div>
        <a href={viewPath} target="_blank" className="text-sm font-semibold text-ink underline">View the page ↗</a>
      </div>

      <PageTextForm
        key={`${current.key}-${locale}`}
        page={current.key}
        locale={locale}
        isLocation={isLocation}
        sectionsHelp={
          isLocation
            ? "On location pages these are the local tips, shown in two columns above the communities and areas."
            : "On service pages these are the text blocks below the hero, in two columns."
        }
        initial={pageTextFormValues(getPageContent(current.key, locale), row)}
      />
    </div>
  );
}
