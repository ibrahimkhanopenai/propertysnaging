import { getPageContent, type PageKey } from "@/content/pages";
import { staticRoutes } from "@/lib/routes";

/**
 * Service + location pages whose FAQs (Admin → FAQs) and body text (Admin → Page text) can be edited.
 * Labels are for the admin (English only).
 */
export type EditablePage = { key: PageKey; group: "service" | "location"; label: string; path: string };

export const editablePages: EditablePage[] = staticRoutes
  .filter((r) => r.group === "service" || r.group === "location")
  .map((r) => {
    const key = r.key as PageKey;
    const c = getPageContent(key, "en");
    return { key, group: r.group as "service" | "location", label: c.navLabel ?? c.breadcrumb, path: r.path };
  });

export const getEditablePage = (key: string): EditablePage | undefined => editablePages.find((p) => p.key === key);
