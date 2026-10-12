import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ClarityHead } from "@/components/analytics/Clarity";
import { GtmHead, GtmNoScript } from "@/components/analytics/GoogleTagManager";

describe("Google Tag Manager snippet", () => {
  it("renders Google's head snippet and body noscript for a valid ID", () => {
    const head = renderToStaticMarkup(<GtmHead id="GTM-N2BF4B58" />);
    expect(head).toContain("https://www.googletagmanager.com/gtm.js?id=");
    expect(head).toContain("'dataLayer','GTM-N2BF4B58'");
    const body = renderToStaticMarkup(<GtmNoScript id="GTM-N2BF4B58" />);
    expect(body).toContain('<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-N2BF4B58"');
    expect(body).toContain("display:none;visibility:hidden");
  });
  it("renders nothing when the ID is missing or not a GTM ID (no script injection)", () => {
    for (const id of [undefined, "", "G-ABC123", "GTM-X');alert(1);//"]) {
      expect(renderToStaticMarkup(<GtmHead id={id} />)).toBe("");
      expect(renderToStaticMarkup(<GtmNoScript id={id} />)).toBe("");
    }
  });
});

describe("Microsoft Clarity snippet", () => {
  it("renders Microsoft's snippet for a valid project ID", () => {
    const head = renderToStaticMarkup(<ClarityHead id="v5f8ri65o1" />);
    expect(head).toContain('https://www.clarity.ms/tag/"+i');
    expect(head).toContain('"clarity","script","v5f8ri65o1"');
  });
  it("renders nothing when the ID is missing or not alphanumeric (no script injection)", () => {
    for (const id of [undefined, "", "abc", 'v5f8");alert(1);//']) {
      expect(renderToStaticMarkup(<ClarityHead id={id} />)).toBe("");
    }
  });
});
