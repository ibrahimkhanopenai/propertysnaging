import { NextResponse } from "next/server";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import crypto from "crypto";
import { getSession } from "@/lib/auth";
import { matchesImageSignature } from "@/lib/image-signature";
import { slugify } from "@/lib/utils";

const ALLOWED: Record<string, string> = { "image/jpeg": ".jpg", "image/png": ".png", "image/webp": ".webp", "image/avif": ".avif", "image/gif": ".gif" };
const MAX_BYTES = 5 * 1024 * 1024;

const uploadRoot = () => path.resolve(process.env.UPLOAD_DIR || "./storage/uploads");

/** Admin-only image upload. Files are stored outside /public and served by /uploads/[...path]. */
export async function POST(req: Request) {
  if (!(await getSession())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "No file" }, { status: 400 });
  const ext = ALLOWED[file.type];
  if (!ext) return NextResponse.json({ error: "Only JPG, PNG, WebP, AVIF or GIF images" }, { status: 400 });
  if (file.size > MAX_BYTES) return NextResponse.json({ error: "Image must be under 5 MB" }, { status: 400 });

  const bytes = new Uint8Array(await file.arrayBuffer());
  if (!matchesImageSignature(file.type, bytes)) return NextResponse.json({ error: "File content is not a valid image" }, { status: 400 });

  const now = new Date();
  const sub = `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, "0")}`;
  const base = slugify(file.name.replace(/\.[^.]+$/, "")).slice(0, 60) || "image";
  const name = `${base}-${crypto.randomBytes(3).toString("hex")}${ext}`;
  const dir = path.join(uploadRoot(), sub);
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, name), bytes);
  return NextResponse.json({ url: `/uploads/${sub}/${name}` });
}
