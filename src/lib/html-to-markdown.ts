/**
 * HTML → Markdown for the admin visual editor (docs/admin-cms.md → "Post editor").
 * Posts are stored as Markdown; the editor shows HTML and converts back on every change.
 * Works on a plain node tree so it runs in the browser (from the DOM) and in tests (from htmlparser2).
 *
 * Covers what the toolbar and normal pasting produce: headings, paragraphs, bold/italic, links,
 * lists (nested), quotes, images, tables, code, rules and line breaks. Anything else (iframes,
 * figures, sup/sub) is kept as raw HTML; the public renderer sanitizes it.
 */

export type MdNode = { type: "text"; text: string } | { type: "el"; tag: string; attrs: Record<string, string>; children: MdNode[] };

type Inline = { bold: boolean; italic: boolean };

/** Hard line break inside a paragraph; becomes "  \n" once the lines are trimmed. */
const BR = "\u0000";

const CONTAINERS = new Set(["div", "p", "section", "article", "main", "header", "footer", "aside", "nav", "body", "center"]);
const BLOCKS = new Set([...CONTAINERS, "h1", "h2", "h3", "h4", "h5", "h6", "ul", "ol", "blockquote", "pre", "hr", "table", "figure", "iframe", "dl"]);
const RAW_INLINE = new Set(["sup", "sub", "iframe"]);
const DROP = new Set(["script", "style", "noscript", "template", "head", "meta", "link", "title", "button", "input", "select", "textarea", "svg", "object", "embed"]);
const VOID = new Set(["img", "br", "hr", "source", "input", "meta", "link", "wbr"]);

const isEl = (n: MdNode, ...tags: string[]): n is Extract<MdNode, { type: "el" }> => n.type === "el" && (tags.length === 0 || tags.includes(n.tag));

const escapeHtml = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** Raw HTML for elements Markdown has no syntax for. */
export function serializeHtml(n: MdNode): string {
  if (n.type === "text") return escapeHtml(n.text);
  if (DROP.has(n.tag)) return "";
  const attrs = Object.entries(n.attrs)
    .filter(([k]) => !/^on/i.test(k) && k !== "style" && k !== "class" && k !== "id")
    .map(([k, v]) => (v === "" ? ` ${k}` : ` ${k}="${escapeHtml(v)}"`))
    .join("");
  if (VOID.has(n.tag)) return `<${n.tag}${attrs}>`;
  return `<${n.tag}${attrs}>${n.children.map(serializeHtml).join("")}</${n.tag}>`;
}

const textOf = (n: MdNode): string => (n.type === "text" ? n.text : n.tag === "br" ? "\n" : n.children.map(textOf).join(""));

/** Characters that would start Markdown formatting inside running text. */
const escapeText = (s: string) => s.replace(/[\\`*_[\]<]/g, (c) => `\\${c}`);

/** A line that Markdown would read as a heading, quote, list or rule gets its first character escaped. */
function escapeLineStart(line: string): string {
  if (/^(#{1,6}(\s|$)|>|[-+](\s|$)|=+\s*$|-+\s*$)/.test(line)) return `\\${line}`;
  return line.replace(/^(\d+)([.)])(\s|$)/, "$1\\$2$3");
}

/** Wraps text in a marker, keeping edge spaces outside it (`** a**` is not bold in Markdown). */
function wrap(marker: string, inner: string): string {
  const m = /^(\s*)([\s\S]*?)(\s*)$/.exec(inner)!;
  if (!m[2] || m[2] === BR) return inner;
  return `${m[1]}${marker}${m[2]}${marker}${m[3]}`;
}

const styleOf = (n: Extract<MdNode, { type: "el" }>) => (n.attrs.style ?? "").toLowerCase().replace(/\s+/g, "");

const linkTarget = (href: string) => href.trim().replace(/ /g, "%20").replace(/\(/g, "%28").replace(/\)/g, "%29");

/** `<b>A</b><b>B</b>` would become `**A****B**`; join neighbours with the same formatting first. */
function mergeAdjacent(nodes: MdNode[]): MdNode[] {
  const out: MdNode[] = [];
  for (const n of nodes) {
    const prev = out[out.length - 1];
    if (prev && isEl(prev) && isEl(n, "strong", "b", "em", "i", "del", "s", "strike", "span") && prev.tag === n.tag && styleOf(prev) === styleOf(n)) {
      out[out.length - 1] = { ...prev, children: [...prev.children, ...n.children] };
    } else out.push(n);
  }
  return out;
}

function inline(nodes: MdNode[], st: Inline): string {
  let out = "";
  for (const n of mergeAdjacent(nodes)) {
    if (n.type === "text") {
      out += escapeText(n.text.replace(/\s+/g, " "));
      continue;
    }
    if (DROP.has(n.tag)) continue;
    const style = styleOf(n);
    switch (n.tag) {
      case "br":
        out += BR;
        break;
      case "strong":
      case "b": {
        // Google Docs wraps a whole paste in <b style="font-weight:normal">
        const bold = !/font-weight:(normal|400)/.test(style);
        out += bold && !st.bold ? wrap("**", inline(n.children, { ...st, bold: true })) : inline(n.children, st);
        break;
      }
      case "em":
      case "i":
        out += st.italic ? inline(n.children, st) : wrap("*", inline(n.children, { ...st, italic: true }));
        break;
      case "del":
      case "s":
      case "strike":
        out += wrap("~~", inline(n.children, st));
        break;
      case "code":
        out += `\`${textOf(n).replace(/`/g, "")}\``;
        break;
      case "a": {
        const text = inline(n.children, st);
        const href = n.attrs.href?.trim();
        out += href && text.trim() ? `[${text.trim()}](${linkTarget(href)})` : text;
        break;
      }
      case "img": {
        const src = n.attrs.src?.trim();
        // Pasted base64 images would bloat the post; the editor uploads image files instead
        if (src && !src.startsWith("data:")) out += `![${escapeText(n.attrs.alt ?? "")}](${linkTarget(src)})`;
        break;
      }
      default: {
        if (RAW_INLINE.has(n.tag)) {
          out += serializeHtml(n);
          break;
        }
        // <span style="font-weight:700"> etc. from pasted documents
        const bold = !st.bold && /font-weight:(bold|[6-9]00)/.test(style);
        const italic = !st.italic && /font-style:italic/.test(style);
        let inner = inline(n.children, { bold: st.bold || bold, italic: st.italic || italic });
        if (italic) inner = wrap("*", inner);
        if (bold) inner = wrap("**", inner);
        out += inner;
      }
    }
  }
  return out;
}

/** Inline content → one paragraph (lines joined by hard breaks), or "" when empty. */
function paragraph(nodes: MdNode[]): string {
  const lines = inline(nodes, { bold: false, italic: false })
    .split(BR)
    .map((l) => l.replace(/ +/g, " ").trim());
  while (lines.length && !lines[lines.length - 1]) lines.pop();
  while (lines.length && !lines[0]) lines.shift();
  return lines.map(escapeLineStart).join("  \n");
}

function listItems(n: Extract<MdNode, { type: "el" }>, depthMarker: (i: number) => string): string {
  const items: string[] = [];
  let i = 0;
  for (const li of n.children) {
    if (!isEl(li)) continue;
    // A list pasted straight inside another list (no <li> around it) belongs to the previous item
    if ((li.tag === "ul" || li.tag === "ol") && items.length) {
      items[items.length - 1] += `\n${indent(list(li), depthMarker(i - 1).length)}`;
      continue;
    }
    const parts = convertBlocks(li.tag === "li" ? li.children : [li]);
    if (!parts.length) continue;
    const marker = depthMarker(i++);
    let body = parts[0];
    for (let p = 1; p < parts.length; p++) body += (/^(- |\d+\. )/.test(parts[p]) ? "\n" : "\n\n") + parts[p];
    items.push(marker + indent(body, marker.length).trimStart());
  }
  return items.join("\n");
}

const indent = (s: string, n: number) =>
  s
    .split("\n")
    .map((l) => (l ? " ".repeat(n) + l : l))
    .join("\n");

function list(n: Extract<MdNode, { type: "el" }>): string {
  if (n.tag === "ol") {
    const start = Number.parseInt(n.attrs.start ?? "1", 10) || 1;
    return listItems(n, (i) => `${start + i}. `);
  }
  return listItems(n, () => "- ");
}

function table(n: Extract<MdNode, { type: "el" }>): string {
  const rows: MdNode[][] = [];
  const collect = (nodes: MdNode[]) => {
    for (const c of nodes) {
      if (c.type !== "el") continue;
      if (c.tag === "tr") rows.push(c.children.filter((x) => isEl(x, "td", "th")));
      else if (["thead", "tbody", "tfoot"].includes(c.tag)) collect(c.children);
    }
  };
  collect(n.children);
  if (!rows.length) return "";
  const cols = Math.max(...rows.map((r) => r.length));
  const cell = (c: MdNode | undefined) =>
    c && c.type === "el"
      ? convertBlocks(c.children)
          .join(" ")
          .replace(/ {2}\n/g, "<br>")
          .replace(/\n/g, " ")
          .replace(/\|/g, "\\|")
      : "";
  const line = (r: MdNode[]) => `| ${Array.from({ length: cols }, (_, i) => cell(r[i])).join(" | ")} |`;
  return [line(rows[0]), `| ${Array(cols).fill("---").join(" | ")} |`, ...rows.slice(1).map(line)].join("\n");
}

function block(n: Extract<MdNode, { type: "el" }>): string[] {
  if (CONTAINERS.has(n.tag)) return convertBlocks(n.children);
  const h = /^h([1-6])$/.exec(n.tag);
  if (h) {
    // The page H1 is the post title, so content headings start at H2
    const level = Math.min(Math.max(Number(h[1]), 2), 4);
    const text = paragraph(n.children).replace(/ {2}\n/g, " ").replace(/^\\(?=#)/, "");
    return text ? [`${"#".repeat(level)} ${text}`] : [];
  }
  switch (n.tag) {
    case "ul":
    case "ol": {
      const l = list(n);
      return l ? [l] : [];
    }
    case "blockquote": {
      const inner = convertBlocks(n.children).join("\n\n");
      return inner ? [inner.split("\n").map((l) => (l ? `> ${l}` : ">")).join("\n")] : [];
    }
    case "pre": {
      const code = textOf(n).replace(/\n$/, "");
      return code.trim() ? ["```\n" + code + "\n```"] : [];
    }
    case "hr":
      return ["---"];
    case "table": {
      const t = table(n);
      return t ? [t] : [];
    }
    default:
      return [serializeHtml(n)];
  }
}

/** Inline wrappers around blocks (pasted `<b><p>…</p></b>`, `<span><div>…`) are read as containers. */
const hasBlock = (n: MdNode): boolean => n.type === "el" && n.children.some((c) => c.type === "el" && (BLOCKS.has(c.tag) || hasBlock(c)));

function convertBlocks(nodes: MdNode[]): string[] {
  const out: string[] = [];
  let run: MdNode[] = [];
  const flush = () => {
    const p = paragraph(run);
    if (p) out.push(p);
    run = [];
  };
  for (const n of nodes) {
    if (n.type === "el" && DROP.has(n.tag)) continue;
    if (n.type === "el" && BLOCKS.has(n.tag)) {
      flush();
      out.push(...block(n));
    } else if (n.type === "el" && n.tag !== "a" && hasBlock(n)) {
      flush();
      out.push(...convertBlocks(n.children));
    } else run.push(n);
  }
  flush();
  return out;
}

/** Converts editor HTML (as a node tree) to Markdown. */
export function htmlTreeToMarkdown(nodes: MdNode[]): string {
  return convertBlocks(nodes).join("\n\n");
}
