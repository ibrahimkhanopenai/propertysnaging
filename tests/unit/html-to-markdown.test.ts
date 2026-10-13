import { describe, expect, it } from "vitest";
import { marked } from "marked";
import { parseDocument } from "htmlparser2";
import type { ChildNode } from "domhandler";
import { htmlTreeToMarkdown, serializeHtml, type MdNode } from "@/lib/html-to-markdown";

/** Same node tree the editor builds from the browser DOM. */
function toTree(nodes: ChildNode[]): MdNode[] {
  const out: MdNode[] = [];
  for (const n of nodes) {
    if (n.type === "text") out.push({ type: "text", text: n.data });
    else if (n.type === "tag" || n.type === "script" || n.type === "style") out.push({ type: "el", tag: n.name.toLowerCase(), attrs: { ...n.attribs }, children: toTree(n.children) });
  }
  return out;
}

const md = (html: string) => htmlTreeToMarkdown(toTree(parseDocument(html, { decodeEntities: true }).children));
const render = (m: string) => (marked.parse(m, { async: false, gfm: true }) as string).replace(/>\s+</g, "><").replace(/\s+/g, " ").trim();
/** Markdown → HTML (as the editor shows it) → Markdown must render the same page. */
const roundTrip = (m: string) => expect(render(md(render(m)))).toBe(render(m));

describe("htmlTreeToMarkdown", () => {
  it("round-trips the formatting used by the imported posts", () => {
    roundTrip(
      "When purchasing a new property in Dubai, most buyers focus on **finishes**. Definitely that’s important.\n\n" +
        "**Why Civil and Structural Snagging Is Important**\n\n" +
        "• Ensures structural stability  \n• Identifies construction defects  \n• Protects buyers\n\n" +
        "Read our [Dubai snagging](/snagging-services-in-dubai/) page or [the checklist](https://propertyinspectors.me/blog/).",
    );
  });

  it("round-trips headings, nested lists, quotes, images, code, rules and tables", () => {
    roundTrip("## Walls\n\n### Cracks\n\n#### Hairline\n\ntext *italic* and ***both*** and ~~old~~ and `code`");
    roundTrip("- one\n- two\n  - two a\n  - two b\n- three\n\n1. first\n2. second\n   1. inner\n\ntext\n\n5. five\n6. six");
    roundTrip("> quoted **text**\n>\n> second paragraph");
    roundTrip("![Cracked tile in a Dubai villa](/uploads/2026/10/a.jpg)\n\n---\n\n```\nconst a = 1;\n```");
    roundTrip("| Area | Defects |\n| --- | --- |\n| Kitchen | 4 |\n| Bath *room* | 2 |");
  });

  it("escapes text that Markdown would read as formatting", () => {
    roundTrip("Price 2*3 = 6, file_name_here, [not a link] and a <b typed as text");
    const out = md("<p># not a heading</p><p>- not a list</p><p>1. not a list</p><p>&gt; not a quote</p><p>---</p>");
    expect(render(out)).toBe("<p># not a heading</p><p>- not a list</p><p>1. not a list</p><p>&gt; not a quote</p><p>---</p>");
  });

  it("cleans pasted documents: divs, spans with bold/italic styles, Google Docs wrapper, nbsp, empty blocks", () => {
    const out = md(
      '<b style="font-weight:normal" id="docs-internal-guid-1"><div><span style="font-weight:700">Bold</span>&nbsp;and <span style="font-style:italic">italic</span></div>' +
        '<div><br></div><p class="x" style="color:red"> spaced   text </p><h1>Title</h1><h6>Small</h6><script>alert(1)</script><style>p{}</style></b>',
    );
    expect(out).toBe("**Bold** and *italic*\n\nspaced text\n\n## Title\n\n#### Small");
  });

  it("keeps marker spaces outside bold/italic and ignores empty formatting", () => {
    expect(md("<p><strong>Note: </strong>text <em> </em><b><b>double</b></b></p>")).toBe("**Note:** text **double**");
    expect(md('<p><strong>A</strong><strong>B</strong> <em>c</em><em>d</em> <span style="font-weight:700">e</span><span style="font-weight:700">f</span></p>')).toBe("**AB** *cd* **ef**");
  });

  it("turns line breaks into hard breaks and drops leading/trailing ones", () => {
    expect(md("<p><br>one<br>two<br><br></p>")).toBe("one  \ntwo");
  });

  it("handles links and images: encoded targets, empty links, base64 images", () => {
    expect(md('<p><a href="/a b(1)/">x</a> <a href="">plain</a> <a href="/y/"> </a></p>')).toBe("[x](/a%20b%281%29/) plain");
    expect(md('<p><img src="data:image/png;base64,AAA" alt="x"><img src="/uploads/a.jpg"></p>')).toBe("![](/uploads/a.jpg)");
  });

  it("keeps iframes, figures and sup/sub as raw HTML without handlers or styles", () => {
    expect(md('<iframe src="https://www.youtube.com/embed/abc" allowfullscreen="" onload="x()" style="a"></iframe>')).toBe('<iframe src="https://www.youtube.com/embed/abc" allowfullscreen></iframe>');
    expect(md("<p>m<sup>2</sup></p>")).toBe("m<sup>2</sup>");
    expect(serializeHtml({ type: "el", tag: "figure", attrs: { class: "c" }, children: [{ type: "el", tag: "img", attrs: { src: "/a.jpg", alt: 'say "hi"' }, children: [] }, { type: "text", text: "a<b" }] })).toBe(
      '<figure><img src="/a.jpg" alt="say &quot;hi&quot;">a&lt;b</figure>',
    );
    expect(serializeHtml({ type: "el", tag: "script", attrs: {}, children: [] })).toBe("");
  });

  it("handles lists pasted without <li> wrappers and list items with several paragraphs", () => {
    expect(md("<ul><li>a</li><ul><li>a1</li></ul><li>b</li></ul>")).toBe("- a\n  - a1\n- b");
    expect(md('<ol start="3"><li><p>first</p><p>more</p></li><li></li></ol>')).toBe("3. first\n\n   more");
  });

  it("handles tables with a header section, ragged rows, pipes and line breaks", () => {
    expect(md("<table><thead><tr><th>A</th><th>B</th></tr></thead><tbody><tr><td>x|y</td></tr><tr><td>1<br>2</td><td></td></tr></tbody></table>")).toBe(
      "| A | B |\n| --- | --- |\n| x\\|y |  |\n| 1<br>2 |  |",
    );
    expect(md("<table></table><blockquote></blockquote><pre> </pre><h2> </h2><ul></ul>")).toBe("");
  });
});
