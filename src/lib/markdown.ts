import { marked } from "marked";
import sanitizeHtml from "sanitize-html";
import { slugify } from "@/lib/utils";

export type TocItem = { id: string; text: string; level: 2 | 3 };

/** Allow-list for post HTML: Markdown output, WordPress-imported markup and YouTube embeds. No scripts, styles or event handlers. */
const SANITIZE: sanitizeHtml.IOptions = {
  allowedTags: [...sanitizeHtml.defaults.allowedTags, "img", "figure", "figcaption", "picture", "source", "iframe", "del", "ins", "sup", "sub"],
  allowedAttributes: {
    a: ["href", "title", "name"],
    img: ["src", "srcset", "sizes", "alt", "title", "width", "height"],
    source: ["srcset", "type", "media"],
    iframe: ["src", "title", "width", "height", "allow", "allowfullscreen", "loading"],
    th: ["align", "colspan", "rowspan"],
    td: ["align", "colspan", "rowspan"],
    ol: ["start"],
  },
  allowedSchemes: ["http", "https", "mailto", "tel"],
  allowedSchemesByTag: { img: ["http", "https", "data"] },
  allowedIframeHostnames: ["www.youtube.com", "www.youtube-nocookie.com", "player.vimeo.com"],
  allowProtocolRelative: false,
};

const stripTags = (s: string) => s.replace(/<[^>]+>/g, "").replace(/&amp;/g, "&").replace(/&#39;/g, "'").replace(/&quot;/g, '"');

/**
 * Markdown → sanitized HTML (defence in depth: admins and WordPress imports can paste raw HTML).
 * Adds ids to h2/h3 and returns a table of contents.
 * Also makes images lazy and external links safe.
 */
export function renderMarkdown(md: string): { html: string; toc: TocItem[] } {
  const raw = sanitizeHtml(marked.parse(md, { async: false, gfm: true }) as string, SANITIZE);
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
