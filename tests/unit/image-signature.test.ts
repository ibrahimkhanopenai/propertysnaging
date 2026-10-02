import { describe, expect, it } from "vitest";
import { matchesImageSignature } from "@/lib/image-signature";

const bytes = (...parts: Array<number[] | string>) =>
  new Uint8Array(parts.flatMap((p) => (typeof p === "string" ? [...p].map((c) => c.charCodeAt(0)) : p)));

describe("matchesImageSignature", () => {
  it.each([
    ["image/jpeg", bytes([0xff, 0xd8, 0xff, 0xe0])],
    ["image/png", bytes([0x89], "PNG\r\n")],
    ["image/gif", bytes("GIF89a")],
    ["image/webp", bytes("RIFF", [0, 0, 0, 0], "WEBP")],
    ["image/avif", bytes([0, 0, 0, 0x1c], "ftypavif")],
  ])("accepts a real %s", (type, b) => expect(matchesImageSignature(type, b)).toBe(true));

  it("rejects HTML/SVG disguised as an image", () => {
    expect(matchesImageSignature("image/png", bytes("<svg onload=alert(1)>"))).toBe(false);
    expect(matchesImageSignature("image/jpeg", bytes("<html>"))).toBe(false);
  });
  it("rejects unknown types and empty files", () => {
    expect(matchesImageSignature("image/svg+xml", bytes("<svg>"))).toBe(false);
    expect(matchesImageSignature("image/png", new Uint8Array())).toBe(false);
  });
});
