"use client";

import { useActionState, useMemo, useState } from "react";
import { marked } from "marked";
import type { Category, Post } from "@prisma/client";
import { savePostAction, type PostState } from "@/app/admin/actions";
import { slugify } from "@/lib/utils";

/**
 * Blog editor with full SEO panel. Docs: docs/admin-cms.md
 * Content is Markdown (headings ##/###, lists, links, images, tables).
 */

type Faq = { q: string; a: string };
const input = "h-11 w-full rounded-lg border border-zinc-300 bg-white px-3 text-sm outline-none focus:border-ink";
const label = "flex flex-col gap-1.5 text-sm font-semibold";
const card = "flex flex-col gap-4 rounded-2xl border border-line bg-white p-5";

const toLocalInput = (d?: Date | null) => {
  if (!d) return "";
  const z = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
  return z.toISOString().slice(0, 16);
};

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

function ImageField({ name, value, onChange, labelText }: { name: string; value: string; onChange: (v: string) => void; labelText: string }) {
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
  const [tab, setTab] = useState<"write" | "preview">("write");
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
            {post && post.status !== "DRAFT" ? <span className="text-xs font-normal text-muted">Changing the slug of a live post creates a 301 redirect automatically.</span> : null}
          </label>
          <label className={label}>
            <span className="flex items-center justify-between">Excerpt <Counter value={excerpt} min={80} max={200} /></span>
            <textarea name="excerpt" value={excerpt} onChange={(e) => setExcerpt(e.target.value)} rows={2} className={`${input} h-auto py-2`} />
          </label>
        </div>

        <div className={card}>
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold">Content (Markdown)</p>
            <div className="flex rounded-lg border border-line p-0.5 text-sm">
              {(["write", "preview"] as const).map((t) => (
                <button key={t} type="button" onClick={() => setTab(t)} className={`rounded-md px-3 py-1 capitalize ${tab === t ? "bg-ink text-white" : ""}`}>
                  {t}
                </button>
              ))}
            </div>
          </div>
          <textarea
            name="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={26}
            dir={locale === "ar" ? "rtl" : "ltr"}
            className={`${input} h-auto py-3 font-mono text-[13px] leading-relaxed ${tab === "preview" ? "hidden" : ""}`}
            placeholder={"## Section heading\n\nParagraph text with a [link to Dubai snagging](/snagging-services-in-dubai/).\n\n- Bullet one\n- Bullet two\n\n![Alt text](/uploads/2026/10/photo.jpg)"}
          />
          {tab === "preview" ? (
            <div className="article-body min-h-96 rounded-lg border border-line p-5" dir={locale === "ar" ? "rtl" : "ltr"} dangerouslySetInnerHTML={{ __html: marked.parse(content || "*Nothing to preview*", { async: false }) as string }} />
          ) : null}
          <p className="text-xs text-muted">Tip: use ## for H2 and ### for H3 (the page H1 is the title). Upload images in the sidebar, then paste the URL as ![alt](url).</p>
        </div>

        <div className={card}>
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold">FAQ (adds FAQPage schema)</p>
            <button type="button" onClick={() => setFaqs([...faqs, { q: "", a: "" }])} className="rounded-lg border border-zinc-300 px-3 py-1.5 text-sm font-semibold">Add question</button>
          </div>
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
          </label>
          <label className={label}>
            <span className="flex items-center justify-between">Meta description <Counter value={metaDescription} min={120} max={160} /></span>
            <textarea name="metaDescription" value={metaDescription} onChange={(e) => setMetaDescription(e.target.value)} rows={3} className={`${input} h-auto py-2`} />
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className={label}>Focus keyword<input name="focusKeyword" value={focusKeyword} onChange={(e) => setFocusKeyword(e.target.value)} placeholder="snagging checklist dubai" className={input} /></label>
            <label className={label}>Secondary keywords<input name="secondaryKeywords" defaultValue={post?.secondaryKeywords ?? ""} placeholder="comma, separated" className={input} /></label>
            <label className={label}>Canonical URL<input name="canonicalUrl" defaultValue={post?.canonicalUrl ?? ""} placeholder="Leave empty for self-canonical" className={input} /></label>
            <label className={label}>Breadcrumb title<input name="breadcrumbTitle" defaultValue={post?.breadcrumbTitle ?? ""} placeholder="Short title for breadcrumbs" className={input} /></label>
            <label className={label}>Schema type
              <select name="schemaType" defaultValue={post?.schemaType ?? "BlogPosting"} className={input}>
                <option value="BlogPosting">BlogPosting</option>
                <option value="Article">Article</option>
                <option value="HowTo">HowTo</option>
              </select>
            </label>
            <div className="flex flex-col justify-end gap-2 text-sm">
              <label className="flex items-center gap-2"><input type="checkbox" name="robotsIndex" defaultChecked={post?.robotsIndex ?? true} /> Allow Google to index (index)</label>
              <label className="flex items-center gap-2"><input type="checkbox" name="robotsFollow" defaultChecked={post?.robotsFollow ?? true} /> Follow links (follow)</label>
            </div>
          </div>
          <p className="pt-2 text-sm font-semibold">Social sharing (Open Graph)</p>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className={label}>OG title<input name="ogTitle" defaultValue={post?.ogTitle ?? ""} placeholder="Defaults to SEO title" className={input} /></label>
            <label className={label}>OG description<input name="ogDescription" defaultValue={post?.ogDescription ?? ""} placeholder="Defaults to meta description" className={input} /></label>
          </div>
          <ImageField name="ogImage" value={ogImage} onChange={setOgImage} labelText="OG image (1200×630, defaults to featured image)" />
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
          <label className={label}>Type
            <select name="type" defaultValue={post?.type ?? "POST"} className={input}>
              <option value="POST">Blog article (listed in /blog/)</option>
              <option value="DEVELOPER">Developer / development page</option>
            </select>
          </label>
          <label className={label}>Publish date<input type="datetime-local" name="publishedAt" defaultValue={toLocalInput(post?.publishedAt)} className={input} /></label>
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
          <ImageField name="featuredImage" value={featuredImage} onChange={setFeaturedImage} labelText="Featured image" />
          <label className={label}>Featured image alt text<input name="featuredImageAlt" value={featuredImageAlt} onChange={(e) => setFeaturedImageAlt(e.target.value)} className={input} /></label>
        </div>

        <div className={card}>
          <label className={label}>Category
            <select name="categoryId" defaultValue={post?.categoryId ?? ""} className={input}>
              <option value="">None</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </label>
          <label className={label}>Tags<input name="tags" defaultValue={post?.tags ?? ""} placeholder="handover, dubai, mep" className={input} /></label>
          <label className={label}>Location
            <select name="location" defaultValue={post?.location ?? ""} className={input}>
              <option value="">UAE-wide</option>
              <option value="dubai">Dubai</option>
              <option value="abudhabi">Abu Dhabi</option>
              <option value="sharjah">Sharjah</option>
            </select>
          </label>
          <label className={label}>Related service (end-of-post CTA)
            <select name="relatedService" defaultValue={post?.relatedService ?? ""} className={input}>
              <option value="">Homepage quote form</option>
              {services.filter((s) => s !== "/" && s !== "/blog/").map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </label>
          <label className={label}>Author<input name="authorName" defaultValue={post?.authorName ?? ""} placeholder="Property Inspectors" className={input} /></label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="tocEnabled" defaultChecked={post?.tocEnabled ?? true} /> Show table of contents</label>
        </div>
      </div>
    </form>
  );
}
