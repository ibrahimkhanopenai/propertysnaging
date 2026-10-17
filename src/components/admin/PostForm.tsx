"use client";

import { useActionState, useMemo, useState } from "react";
import type { Category, Post } from "@prisma/client";
import { savePostAction, type PostState } from "@/app/admin/actions";
import { slugify, toUaeDateTimeInput } from "@/lib/utils";
import { DateInput } from "@/components/ui/DateInput";
import { RichTextEditor } from "./RichTextEditor";

/**
 * Blog editor with full SEO panel. Docs: docs/admin-cms.md
 * Content is stored as Markdown; RichTextEditor edits it visually or as source.
 */

type Faq = { q: string; a: string };
const input = "h-11 w-full rounded-lg border border-zinc-300 bg-white px-3 text-sm outline-none focus:border-ink";
const label = "flex flex-col gap-1.5 text-sm font-semibold";
const card = "flex flex-col gap-4 rounded-2xl border border-line bg-white p-5";

/** One-line explanation under a field. Full guide: docs/blog-post-fields.md */
function Hint({ children }: { children: React.ReactNode }) {
  return <span className="text-xs font-normal leading-snug text-muted">{children}</span>;
}

function Counter({ value, min, max }: { value: string; min: number; max: number }) {
  const n = value.length;
  const color = n === 0 ? "text-subtle" : n < min || n > max ? "text-snag" : "text-wa-dark";
  return <span className={`text-xs font-normal ${color}`}>{n} / {min}–{max} characters</span>;
}

async function uploadImage(file: File): Promise<string> {
  const fd = new FormData();
  fd.append("file", file);
  const res = await fetch("/api/admin/upload/", { method: "POST", body: fd });
  const json = (await res.json()) as { url?: string; error?: string };
  if (!res.ok || !json.url) throw new Error(json.error || "Upload failed");
  return json.url;
}

function ImageField({ name, value, onChange, labelText, hint }: { name: string; value: string; onChange: (v: string) => void; labelText: string; hint?: string }) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  return (
    <div className={label}>
      {labelText}
      <div className="flex gap-2">
        <input name={name} value={value} onChange={(e) => onChange(e.target.value)} placeholder="/uploads/... or /images/..." className={input} />
        <label className="inline-flex h-11 shrink-0 cursor-pointer items-center rounded-lg border border-zinc-300 px-3 text-sm font-semibold hover:bg-mist">
          {busy ? "Uploading…" : "Upload"}
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
            className="sr-only"
            onChange={async (e) => {
              const f = e.target.files?.[0];
              if (!f) return;
              setBusy(true);
              setErr("");
              try {
                onChange(await uploadImage(f));
              } catch (x) {
                setErr((x as Error).message);
              } finally {
                setBusy(false);
              }
            }}
          />
        </label>
      </div>
      {hint ? <Hint>{hint}</Hint> : null}
      {err ? <span className="text-xs font-normal text-snag">{err}</span> : null}
      {value ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={value} alt="" className="mt-1 h-28 w-48 rounded-lg border border-line object-cover" />
      ) : null}
    </div>
  );
}

export function PostForm({ post, categories, services }: { post?: Post; categories: Category[]; services: string[] }) {
  const [state, action, pending] = useActionState<PostState, FormData>(savePostAction, {});

  const [title, setTitle] = useState(post?.title ?? "");
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(post));
  const [content, setContent] = useState(post?.content ?? "");
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? "");
  const [metaTitle, setMetaTitle] = useState(post?.metaTitle ?? "");
  const [metaDescription, setMetaDescription] = useState(post?.metaDescription ?? "");
  const [focusKeyword, setFocusKeyword] = useState(post?.focusKeyword ?? "");
  const [featuredImage, setFeaturedImage] = useState(post?.featuredImage ?? "");
  const [featuredImageAlt, setFeaturedImageAlt] = useState(post?.featuredImageAlt ?? "");
  const [ogImage, setOgImage] = useState(post?.ogImage ?? "");
  const [locale, setLocale] = useState<"en" | "ar">((post?.locale as "en" | "ar") ?? "en");
  const [faqs, setFaqs] = useState<Faq[]>(Array.isArray(post?.faqs) ? (post!.faqs as unknown as Faq[]) : []);

  const effectiveSlug = slugTouched ? slug : slugify(title);
  const serpTitle = metaTitle || title || "Post title";
  const serpDesc = metaDescription || excerpt || "Meta description will appear here.";
  const url = `propertyinspectors.me${locale === "ar" ? "/ar" : ""}/${effectiveSlug || "post-slug"}/`;

  const checks = useMemo(() => {
    const kw = focusKeyword.trim().toLowerCase();
    const has = (s: string) => Boolean(kw) && s.toLowerCase().includes(kw);
    const words = content.trim() ? content.trim().split(/\s+/).length : 0;
    const first = content.split(/\s+/).slice(0, 100).join(" ");
    return [
      { ok: Boolean(kw), text: "Focus keyword set" },
      { ok: has(serpTitle), text: "Keyword in SEO title" },
      { ok: has(metaDescription), text: "Keyword in meta description" },
      { ok: has(effectiveSlug.replace(/-/g, " ")), text: "Keyword in URL slug" },
      { ok: has(first), text: "Keyword in the first 100 words" },
      { ok: serpTitle.length >= 30 && serpTitle.length <= 60, text: "SEO title is 30–60 characters" },
      { ok: metaDescription.length >= 120 && metaDescription.length <= 160, text: "Meta description is 120–160 characters" },
      { ok: /^##\s/m.test(content), text: "Uses H2 subheadings (##)" },
      { ok: /\]\(\/[^)]*\)/.test(content), text: "Has at least one internal link" },
      { ok: !featuredImage || Boolean(featuredImageAlt.trim()), text: "Featured image has alt text" },
      { ok: words >= 600, text: `Length: ${words} words (aim for 600+)` },
    ];
  }, [focusKeyword, serpTitle, metaDescription, effectiveSlug, content, featuredImage, featuredImageAlt]);
  const score = checks.filter((c) => c.ok).length;

  return (
    <form action={action} className="grid gap-6 xl:grid-cols-[1fr_380px]">
      <input type="hidden" name="id" value={post?.id ?? ""} />
      <input type="hidden" name="faqs" value={JSON.stringify(faqs)} />

      {/* ── Main column ── */}
      <div className="flex min-w-0 flex-col gap-6">
        <div className={card}>
          <label className={label}>
            Title (H1)
            <input name="title" value={title} onChange={(e) => setTitle(e.target.value)} required className={`${input} h-12 text-base`} />
            <Hint>The headline at the top of the post and on its /blog/ card.</Hint>
          </label>
          <label className={label}>
            <span className="flex items-center justify-between">URL slug <span className="text-xs font-normal text-subtle">{url}</span></span>
            <input
              name="slug"
              value={effectiveSlug}
              onChange={(e) => {
                setSlugTouched(true);
                setSlug(e.target.value);
              }}
              className={input}
            />
            <Hint>The post&apos;s web address: lowercase words joined by hyphens, filled in from the title. Choose it before publishing and then leave it.</Hint>
            {post && post.status !== "DRAFT" ? <span className="text-xs font-normal text-muted">Changing the slug of a live post creates a 301 redirect automatically.</span> : null}
          </label>
          <label className={label}>
            <span className="flex items-center justify-between">Excerpt <Counter value={excerpt} min={80} max={200} /></span>
            <textarea name="excerpt" value={excerpt} onChange={(e) => setExcerpt(e.target.value)} rows={2} className={`${input} h-auto py-2`} />
            <Hint>1–2 sentence summary, shown under the title and on the /blog/ card. Google uses it when the meta description is empty.</Hint>
          </label>
        </div>

        <div className={card}>
          <p className="text-sm font-semibold">Content</p>
          <input type="hidden" name="content" value={content} />
          <RichTextEditor value={content} onChange={setContent} dir={locale === "ar" ? "rtl" : "ltr"} uploadImage={uploadImage} />
          <p className="text-xs text-muted">Use Heading 2 / Heading 3 for sections (the page H1 is the title). Pasted text from Word or Google Docs is cleaned up automatically. The Markdown tab shows the saved source.</p>
        </div>

        <div className={card}>
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold">FAQ (adds FAQPage schema)</p>
            <button type="button" onClick={() => setFaqs([...faqs, { q: "", a: "" }])} className="rounded-lg border border-zinc-300 px-3 py-1.5 text-sm font-semibold">Add question</button>
          </div>
          <Hint>Questions readers ask about this topic, answered from the article. Shown under the article (with FAQ data for Google). Aim for 5–12.</Hint>
          {faqs.length === 0 ? <p className="text-sm text-muted">No questions yet.</p> : null}
          {faqs.map((f, i) => (
            <div key={i} className="flex flex-col gap-2 rounded-xl bg-mist p-3">
              <input value={f.q} placeholder="Question" onChange={(e) => setFaqs(faqs.map((x, j) => (j === i ? { ...x, q: e.target.value } : x)))} className={input} />
              <textarea value={f.a} placeholder="Answer" rows={2} onChange={(e) => setFaqs(faqs.map((x, j) => (j === i ? { ...x, a: e.target.value } : x)))} className={`${input} h-auto py-2`} />
              <button type="button" onClick={() => setFaqs(faqs.filter((_, j) => j !== i))} className="self-end text-sm text-snag">Remove</button>
            </div>
          ))}
        </div>

        {/* ── SEO panel ── */}
        <div className={card}>
          <p className="text-sm font-semibold">SEO</p>
          <div className="rounded-xl border border-line p-4">
            <p className="text-xs text-subtle">Google preview</p>
            <p className="truncate text-sm text-ink-soft">{url}</p>
            <p className="truncate text-lg text-[#1a0dab]">{serpTitle}</p>
            <p className="line-clamp-2 text-sm text-muted">{serpDesc}</p>
          </div>
          <label className={label}>
            <span className="flex items-center justify-between">SEO title <Counter value={metaTitle || title} min={30} max={60} /></span>
            <input name="metaTitle" value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} placeholder="Leave empty to use the post title" className={input} />
            <Hint>The blue headline in Google results and the browser tab. Empty = the post title.</Hint>
          </label>
          <label className={label}>
            <span className="flex items-center justify-between">Meta description <Counter value={metaDescription} min={120} max={160} /></span>
            <textarea name="metaDescription" value={metaDescription} onChange={(e) => setMetaDescription(e.target.value)} rows={3} className={`${input} h-auto py-2`} />
            <Hint>The grey text under the headline in Google. Say what the reader gets, so they click.</Hint>
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className={label}>Focus keyword<input name="focusKeyword" value={focusKeyword} onChange={(e) => setFocusKeyword(e.target.value)} placeholder="snagging checklist dubai" className={input} />
              <Hint>The main phrase people search for. Only used by the SEO checklist; not shown on the site.</Hint>
            </label>
            <label className={label}>Secondary keywords<input name="secondaryKeywords" defaultValue={post?.secondaryKeywords ?? ""} placeholder="comma, separated" className={input} />
              <Hint>Related phrases to use naturally in the text. A note for writers; not shown on the site.</Hint>
            </label>
            <label className={label}>Canonical URL<input name="canonicalUrl" defaultValue={post?.canonicalUrl ?? ""} placeholder="Leave empty for self-canonical" className={input} />
              <Hint>The original address of this content for Google. Empty = this post&apos;s own URL (right in almost every case).</Hint>
            </label>
            <label className={label}>Breadcrumb title<input name="breadcrumbTitle" defaultValue={post?.breadcrumbTitle ?? ""} placeholder="Short title for breadcrumbs" className={input} />
              <Hint>Short name in the &quot;Home / Resources &amp; blog / …&quot; trail above the title. Empty = the post title.</Hint>
            </label>
            <label className={label}>Schema type
              <select name="schemaType" defaultValue={post?.schemaType ?? "BlogPosting"} className={input}>
                <option value="BlogPosting">BlogPosting</option>
                <option value="Article">Article</option>
                <option value="HowTo">HowTo</option>
              </select>
              <Hint>Page type for Google. BlogPosting or Article for normal posts. Avoid HowTo (Google no longer shows it).</Hint>
            </label>
            <div className="flex flex-col justify-end gap-2 text-sm">
              <label className="flex items-center gap-2"><input type="checkbox" name="robotsIndex" defaultChecked={post?.robotsIndex ?? true} /> Allow Google to index (index)</label>
              <label className="flex items-center gap-2"><input type="checkbox" name="robotsFollow" defaultChecked={post?.robotsFollow ?? true} /> Follow links (follow)</label>
              <Hint>Keep both ticked. Untick index only to keep a post out of Google.</Hint>
            </div>
          </div>
          <p className="pt-2 text-sm font-semibold">Social sharing (Open Graph)</p>
          <Hint>What appears when the post link is shared on WhatsApp, Facebook, LinkedIn or X.</Hint>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className={label}>OG title<input name="ogTitle" defaultValue={post?.ogTitle ?? ""} placeholder="Defaults to SEO title" className={input} />
              <Hint>Headline of the shared link. Empty = SEO title.</Hint>
            </label>
            <label className={label}>OG description<input name="ogDescription" defaultValue={post?.ogDescription ?? ""} placeholder="Defaults to meta description" className={input} />
              <Hint>Text under the shared link. Empty = meta description.</Hint>
            </label>
          </div>
          <ImageField name="ogImage" value={ogImage} onChange={setOgImage} labelText="OG image (1200×630, defaults to featured image)" hint="Picture of the shared link. Empty = featured image. If you replace the featured image, change or clear this too." />
        </div>
      </div>

      {/* ── Sidebar ── */}
      <div className="flex flex-col gap-6">
        <div className={`${card} xl:sticky xl:top-6`}>
          <div className="grid grid-cols-2 gap-3">
            <label className={label}>Status
              <select name="status" defaultValue={post?.status ?? "DRAFT"} className={input}>
                <option value="DRAFT">Draft</option>
                <option value="PUBLISHED">Published</option>
                <option value="SCHEDULED">Scheduled</option>
              </select>
            </label>
            <label className={label}>Language
              <select name="locale" value={locale} onChange={(e) => setLocale(e.target.value as "en" | "ar")} className={input}>
                <option value="en">English</option>
                <option value="ar">Arabic</option>
              </select>
            </label>
          </div>
          <Hint>Draft = hidden. Published = live. Scheduled = goes live on the publish date. Arabic posts are at /ar/…</Hint>
          <label className={label}>Type
            <select name="type" defaultValue={post?.type ?? "POST"} className={input}>
              <option value="POST">Blog article (listed in /blog/)</option>
              <option value="DEVELOPER">Developer / development page</option>
            </select>
            <Hint>Developer pages are listed in /snagging-by-developer/ instead of /blog/.</Hint>
          </label>
          <label className={label}>Publish date (UAE time)<DateInput type="datetime-local" name="publishedAt" defaultValue={toUaeDateTimeInput(post?.publishedAt)} className={input} />
            <Hint>Date shown on the post. Empty + Published = now.</Hint>
          </label>
          {state.error ? <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-snag">{state.error}</p> : null}
          {state.saved ? <p role="status" className="rounded-lg bg-green-50 p-3 text-sm text-wa-dark">Saved.</p> : null}
          <button disabled={pending} className="h-12 rounded-xl bg-ink font-semibold text-white disabled:opacity-60">{pending ? "Saving…" : post ? "Save changes" : "Create post"}</button>
        </div>

        <div className={card}>
          <p className="text-sm font-semibold">SEO checklist <span className="font-normal text-muted">({score}/{checks.length})</span></p>
          <ul className="flex flex-col gap-1.5 text-sm">
            {checks.map((c) => (
              <li key={c.text} className={c.ok ? "text-wa-dark" : "text-muted"}>{c.ok ? "✓" : "○"} {c.text}</li>
            ))}
          </ul>
        </div>

        <div className={card}>
          <ImageField name="featuredImage" value={featuredImage} onChange={setFeaturedImage} labelText="Featured image" hint="Big photo at the top of the post and on its /blog/ card. Landscape, at least 1200 px wide." />
          <label className={label}>Featured image alt text<input name="featuredImageAlt" value={featuredImageAlt} onChange={(e) => setFeaturedImageAlt(e.target.value)} className={input} />
            <Hint>Describe the photo in plain words (for Google and screen readers), e.g. &quot;Inspector checking floor tiles with a moisture meter&quot;.</Hint>
          </label>
        </div>

        <div className={card}>
          <label className={label}>Category
            <select name="categoryId" defaultValue={post?.categoryId ?? ""} className={input}>
              <option value="">None</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            <Hint>Shown on the post&apos;s /blog/ card.</Hint>
          </label>
          <label className={label}>Tags<input name="tags" defaultValue={post?.tags ?? ""} placeholder="handover, dubai, mep" className={input} />
            <Hint>A few topic words, comma separated. For your own sorting; not shown on the site.</Hint>
          </label>
          <label className={label}>Location
            <select name="location" defaultValue={post?.location ?? ""} className={input}>
              <option value="">UAE-wide</option>
              <option value="dubai">Dubai</option>
              <option value="abudhabi">Abu Dhabi</option>
              <option value="sharjah">Sharjah</option>
            </select>
            <Hint>Emirate the post is about. For your own sorting; not shown on the site.</Hint>
          </label>
          <label className={label}>Related service (end-of-post CTA)
            <select name="relatedService" defaultValue={post?.relatedService ?? ""} className={input}>
              <option value="">Homepage quote form</option>
              {services.filter((s) => s !== "/" && s !== "/blog/").map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <Hint>Where the &quot;Book a snagging inspection&quot; button at the end of the post goes. Pick the closest service or emirate page.</Hint>
          </label>
          <label className={label}>Author<input name="authorName" defaultValue={post?.authorName ?? ""} placeholder="Property Inspectors" className={input} />
            <Hint>Author name sent to Google (not shown on the page). E.g. Property Inspector Team.</Hint>
          </label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="tocEnabled" defaultChecked={post?.tocEnabled ?? true} /> Show table of contents</label>
          <Hint>A &quot;Contents&quot; box linking to the post&apos;s headings (shown when it has 3 or more).</Hint>
        </div>
      </div>
    </form>
  );
}
