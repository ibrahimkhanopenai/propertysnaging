// Regenerate the self-hosted webfonts in src/fonts/ (see src/fonts/index.ts).
// Pulls the exact woff2 files from Google (via google-webfonts-helper's API, which
// resolves each weight's gstatic woff2 URL) so the build never fetches fonts itself.
//
//   node scripts/download-fonts.mjs
//
// Edit FONTS below to change families, subsets or weights, then update src/fonts/index.ts.
import { mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const OUT = fileURLToPath(new URL("../src/fonts", import.meta.url));

const FONTS = [
  { api: "dm-sans", subset: "latin", prefix: "dm-sans", weights: ["400", "500", "600", "700"] },
  { api: "manrope", subset: "latin", prefix: "manrope", weights: ["600", "700", "800"] },
  { api: "ibm-plex-sans-arabic", subset: "arabic", prefix: "ibm-plex-arabic", weights: ["400", "500", "600", "700"] },
];

await mkdir(OUT, { recursive: true });

for (const f of FONTS) {
  const res = await fetch(`https://gwfh.mranftl.com/api/fonts/${f.api}?subsets=${f.subset}`);
  if (!res.ok) throw new Error(`JSON ${f.api} failed: ${res.status}`);
  const data = await res.json();
  for (const w of f.weights) {
    const v = data.variants.find((x) => x.fontWeight === w && x.fontStyle === "normal");
    if (!v || !v.woff2) throw new Error(`No normal ${w} for ${f.api}`);
    const fontRes = await fetch(v.woff2);
    if (!fontRes.ok) throw new Error(`woff2 ${f.api} ${w} failed: ${fontRes.status}`);
    const buf = Buffer.from(await fontRes.arrayBuffer());
    await writeFile(`${OUT}/${f.prefix}-${w}.woff2`, buf);
    console.log(`${f.prefix}-${w}.woff2  ${(buf.length / 1024).toFixed(1)} KB`);
  }
}
console.log("DONE");
