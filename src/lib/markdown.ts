import { marked } from "marked";
import { slugify } from "@/lib/utils";

export type TocItem = { id: string; text: string; level: 2 | 3 };

const stripTags = (s: string) => s.replace(/<[^>]+>/g, "").replace(/&amp;/g, "&").replace(/&#39;/g, "'").replace(/&quot;/g, '"');

/**
 * Markdown → HTML (content is written by trusted admins only).
 * Adds ids to h2/h3 and returns a table of contents.
 * Also makes images lazy and external links safe.
 */
export function renderMarkdown(md: string): { html: string; toc: TocItem[] } {
  const raw = marked.parse(md, { async: false, gfm: true }) as string;
  const toc: TocItem[] = [];
  const used = new Set<string>();

  let html = raw.replace(/<h([23])>([\s\S]*?)<\/h\1>/g, (_m, lvl: string, inner: string) => {
    const text = stripTags(inner).trim();
    let id = slugify(text) || `section-${toc.length + 1}`;
    while (used.has(id)) id = `${id}-x`;
    used.add(id);
    toc.push({ id, text, level: Number(lvl) as 2 | 3 });
    return `<h${lvl} id="${id}">${inner}</h${lvl}>`;
  });

  html = html
    .replace(/<img /g, '<img loading="lazy" decoding="async" ')
    .replace(/<a href="(https?:\/\/(?!propertyinspectors\.me)[^"]+)"/g, '<a href="$1" target="_blank" rel="noopener noreferrer"');

  return { html, toc };
}
