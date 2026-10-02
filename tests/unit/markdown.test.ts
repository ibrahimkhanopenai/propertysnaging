import { describe, expect, it } from "vitest";
import { renderMarkdown } from "@/lib/markdown";

describe("renderMarkdown", () => {
  it("builds a table of contents with unique ids", () => {
    const { html, toc } = renderMarkdown("## Common defects\n\ntext\n\n### Walls\n\n## Common defects");
    expect(toc).toEqual([
      { id: "common-defects", text: "Common defects", level: 2 },
      { id: "walls", text: "Walls", level: 3 },
      { id: "common-defects-x", text: "Common defects", level: 2 },
    ]);
    expect(html).toContain('<h2 id="common-defects">');
  });

  it("strips scripts, event handlers and javascript: links", () => {
    const { html } = renderMarkdown('<script>alert(1)</script>\n\n<img src="x.jpg" onerror="alert(1)" alt="a">\n\n[x](javascript:alert(1))\n\n<p style="color:red" onclick="x()">hi</p>');
    expect(html).not.toMatch(/<script|onerror|onclick|javascript:|style=/i);
    expect(html).toContain("hi");
  });

  it("keeps YouTube embeds but drops other iframes", () => {
    const { html } = renderMarkdown('<iframe src="https://www.youtube.com/embed/abc"></iframe>\n\n<iframe src="https://evil.example/x"></iframe>');
    expect(html).toContain("youtube.com/embed/abc");
    expect(html).not.toContain("evil.example");
  });

  it("lazy-loads images and opens external links safely", () => {
    const { html } = renderMarkdown('![Cracked tile](/wp-content/uploads/a.jpg)\n\n[ext](https://example.com) [int](https://propertyinspectors.me/blog/)');
    expect(html).toContain('<img loading="lazy" decoding="async" src="/wp-content/uploads/a.jpg" alt="Cracked tile"');
    expect(html).toContain('<a href="https://example.com" target="_blank" rel="noopener noreferrer"');
    expect(html).toContain('<a href="https://propertyinspectors.me/blog/">');
  });
});
