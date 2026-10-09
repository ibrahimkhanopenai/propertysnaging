import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { GtmHead, GtmNoScript } from "@/components/analytics/GoogleTagManager";

describe("Google Tag Manager snippet", () => {
  it("renders Google's head snippet and body noscript for a valid ID", () => {
    const head = renderToStaticMarkup(<GtmHead id="GTM-MCTLKNHC" />);
    expect(head).toContain("https://www.googletagmanager.com/gtm.js?id=");
    expect(head).toContain("'dataLayer','GTM-MCTLKNHC'");
    const body = renderToStaticMarkup(<GtmNoScript id="GTM-MCTLKNHC" />);
    expect(body).toContain('<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-MCTLKNHC"');
    expect(body).toContain("display:none;visibility:hidden");
  });
  it("renders nothing when the ID is missing or not a GTM ID (no script injection)", () => {
    for (const id of [undefined, "", "G-ABC123", "GTM-X');alert(1);//"]) {
      expect(renderToStaticMarkup(<GtmHead id={id} />)).toBe("");
      expect(renderToStaticMarkup(<GtmNoScript id={id} />)).toBe("");
    }
  });
});
