"use client";

import { useEffect, useRef, useState } from "react";
import { marked } from "marked";
import { htmlTreeToMarkdown, type MdNode } from "@/lib/html-to-markdown";

/**
 * Post content editor: a visual (WYSIWYG) mode with a toolbar, and the Markdown source.
 * The post is stored as Markdown either way; the visual mode converts back on every change.
 * Docs: docs/admin-cms.md → "Post editor".
 */

type Props = {
  value: string;
  onChange: (markdown: string) => void;
  dir: "ltr" | "rtl";
  uploadImage: (file: File) => Promise<string>;
};

const domToTree = (node: Node): MdNode[] =>
  Array.from(node.childNodes).flatMap((n): MdNode[] => {
    if (n.nodeType === Node.TEXT_NODE) return [{ type: "text", text: n.textContent ?? "" }];
    if (n.nodeType !== Node.ELEMENT_NODE) return [];
    const el = n as Element;
    return [{ type: "el", tag: el.tagName.toLowerCase(), attrs: Object.fromEntries(Array.from(el.attributes).map((a) => [a.name, a.value])), children: domToTree(el) }];
  });

/** Markdown → HTML for the editing area, without scripts or event handlers (raw HTML is allowed in posts). */
function toEditorHtml(md: string): string {
  const doc = new DOMParser().parseFromString(marked.parse(md, { async: false, gfm: true }) as string, "text/html");
  doc.querySelectorAll("script, style, object, embed").forEach((e) => e.remove());
  doc.querySelectorAll("*").forEach((e) => {
    for (const a of Array.from(e.attributes)) if (/^on/i.test(a.name) || /^\s*javascript:/i.test(a.value)) e.removeAttribute(a.name);
  });
  return doc.body.innerHTML;
}

const htmlToMarkdown = (html: string) => htmlTreeToMarkdown(domToTree(new DOMParser().parseFromString(html, "text/html").body));

const escapeAttr = (s: string) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

const btn = "inline-flex h-8 min-w-8 items-center justify-center rounded-md px-2 text-sm hover:bg-mist disabled:opacity-40";
const active = "bg-ink text-white hover:bg-ink";

export function RichTextEditor({ value, onChange, dir, uploadImage }: Props) {
  const [mode, setMode] = useState<"visual" | "markdown">("visual");
  const [state, setState] = useState({ block: "p", bold: false, italic: false, ul: false, ol: false });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const area = useRef<HTMLDivElement>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  // Last caret/selection inside the editor: the style menu and the link/image prompts take focus away
  const saved = useRef<Range | null>(null);
  const latest = useRef(value);
  latest.current = value;

  // Fill the editing area when it appears. Not on every keystroke: that would move the caret.
  useEffect(() => {
    if (mode === "visual" && area.current) area.current.innerHTML = toEditorHtml(latest.current);
  }, [mode]);

  useEffect(() => {
    const onSel = () => {
      const sel = document.getSelection();
      if (!area.current || !sel?.anchorNode || !area.current.contains(sel.anchorNode)) return;
      saved.current = sel.rangeCount ? sel.getRangeAt(0).cloneRange() : null;
      setState({
        block: String(document.queryCommandValue("formatBlock") || "p").toLowerCase().replace(/[<>]/g, ""),
        bold: document.queryCommandState("bold"),
        italic: document.queryCommandState("italic"),
        ul: document.queryCommandState("insertUnorderedList"),
        ol: document.queryCommandState("insertOrderedList"),
      });
    };
    document.addEventListener("selectionchange", onSel);
    return () => document.removeEventListener("selectionchange", onSel);
  }, []);

  const emit = () => {
    if (!area.current) return;
    // Chrome adds inline styles when editing (e.g. pasting into a heading); they are never saved
    area.current.querySelectorAll("[style]").forEach((e) => e.removeAttribute("style"));
    onChange(htmlToMarkdown(area.current.innerHTML));
  };

  const exec = (cmd: string, arg?: string) => {
    const el = area.current;
    if (!el) return;
    if (document.activeElement !== el) {
      el.focus();
      const sel = document.getSelection();
      if (sel && saved.current && el.contains(saved.current.startContainer)) {
        sel.removeAllRanges();
        sel.addRange(saved.current);
      }
    }
    document.execCommand(cmd, false, arg);
    emit();
  };

  const addLink = () => {
    const url = window.prompt("Link address. Use /path/ for pages on this site, e.g. /snagging-services-in-dubai/", "/");
    if (!url?.trim() || url.trim() === "/") return;
    const href = url.trim();
    if (/^\s*javascript:/i.test(href)) return;
    const sel = document.getSelection();
    if (sel && !sel.isCollapsed) exec("createLink", href);
    else exec("insertHTML", `<a href="${escapeAttr(href)}">${escapeAttr(href)}</a>`);
  };

  const insertImages = async (files: File[]) => {
    setErr("");
    setBusy(true);
    try {
      for (const f of files) {
        const url = await uploadImage(f);
        const alt = window.prompt("Describe the photo (ALT text, required for Google and screen readers):", "") ?? "";
        exec("insertHTML", `<img src="${escapeAttr(url)}" alt="${escapeAttr(alt.trim())}">`);
      }
    } catch (x) {
      setErr((x as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const onPaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    const images = Array.from(e.clipboardData.files).filter((f) => f.type.startsWith("image/"));
    e.preventDefault();
    if (images.length) {
      void insertImages(images);
      return;
    }
    const html = e.clipboardData.getData("text/html");
    if (html) {
      // Paste through Markdown so the editor shows exactly what will be saved (no Word/Docs styles)
      exec("insertHTML", toEditorHtml(htmlToMarkdown(html)));
    } else {
      exec("insertText", e.clipboardData.getData("text/plain"));
    }
  };

  const tool = (label: string, title: string, onClick: () => void, on = false, extra = "") => (
    <button type="button" title={title} aria-label={title} aria-pressed={on} onMouseDown={(e) => e.preventDefault()} onClick={onClick} className={`${btn} ${extra} ${on ? active : ""}`} disabled={mode !== "visual"}>
      {label}
    </button>
  );

  return (
    <div className="flex flex-col gap-2">
      <div className="sticky top-0 z-10 flex flex-wrap items-center gap-1 rounded-lg border border-line bg-white p-1">
        <select
          aria-label="Text style"
          value={["h2", "h3", "h4", "blockquote"].includes(state.block) ? state.block : "p"}
          onChange={(e) => exec("formatBlock", `<${e.target.value}>`)}
          disabled={mode !== "visual"}
          className="h-8 rounded-md border border-line bg-white px-2 text-sm"
        >
          <option value="p">Paragraph</option>
          <option value="h2">Heading 2</option>
          <option value="h3">Heading 3</option>
          <option value="h4">Heading 4</option>
          <option value="blockquote">Quote</option>
        </select>
        <span className="mx-1 h-5 w-px bg-line" />
        {tool("B", "Bold (Ctrl+B)", () => exec("bold"), state.bold, "font-bold")}
        {tool("I", "Italic (Ctrl+I)", () => exec("italic"), state.italic, "font-serif italic")}
        <span className="mx-1 h-5 w-px bg-line" />
        {tool("• List", "Bulleted list", () => exec("insertUnorderedList"), state.ul)}
        {tool("1. List", "Numbered list", () => exec("insertOrderedList"), state.ol)}
        <span className="mx-1 h-5 w-px bg-line" />
        {tool("Link", "Add link", addLink)}
        {tool("Unlink", "Remove link", () => exec("unlink"))}
        {tool(busy ? "Uploading…" : "Image", "Upload an image", () => fileInput.current?.click())}
        {tool("―", "Horizontal line", () => exec("insertHorizontalRule"))}
        {tool("Clear", "Clear formatting", () => exec("removeFormat"))}
        <span className="mx-1 h-5 w-px bg-line" />
        {tool("↶", "Undo (Ctrl+Z)", () => exec("undo"))}
        {tool("↷", "Redo (Ctrl+Y)", () => exec("redo"))}
        <div className="ms-auto flex rounded-md border border-line p-0.5 text-xs">
          {(["visual", "markdown"] as const).map((m) => (
            <button key={m} type="button" onClick={() => setMode(m)} className={`rounded px-2.5 py-1 capitalize ${mode === m ? "bg-ink text-white" : ""}`}>
              {m}
            </button>
          ))}
        </div>
        <input
          ref={fileInput}
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
          className="sr-only"
          tabIndex={-1}
          onChange={(e) => {
            const files = Array.from(e.target.files ?? []);
            e.target.value = "";
            if (files.length) void insertImages(files);
          }}
        />
      </div>
      {err ? <p role="alert" className="text-xs text-snag">{err}</p> : null}

      {mode === "visual" ? (
        <div
          ref={area}
          contentEditable
          suppressContentEditableWarning
          role="textbox"
          aria-multiline="true"
          aria-label="Post content"
          dir={dir}
          data-placeholder="Start writing… Use the toolbar for headings, lists, links and images."
          onFocus={() => document.execCommand("defaultParagraphSeparator", false, "p")}
          onInput={emit}
          onPaste={onPaste}
          onDrop={(e) => {
            const images = Array.from(e.dataTransfer.files).filter((f) => f.type.startsWith("image/"));
            if (!images.length) return;
            e.preventDefault();
            void insertImages(images);
          }}
          className="article-body min-h-96 rounded-lg border border-zinc-300 bg-white p-5 outline-none focus:border-ink empty:before:text-subtle empty:before:content-[attr(data-placeholder)]"
        />
      ) : (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={26}
          dir={dir}
          aria-label="Post content (Markdown)"
          className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-3 font-mono text-[13px] leading-relaxed outline-none focus:border-ink"
          placeholder={"## Section heading\n\nParagraph text with a [link to Dubai snagging](/snagging-services-in-dubai/).\n\n- Bullet one\n- Bullet two\n\n![Alt text](/uploads/2026/10/photo.jpg)"}
        />
      )}
    </div>
  );
}
