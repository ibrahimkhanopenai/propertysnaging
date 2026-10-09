/* Creates the first admin user + default categories. Safe to run multiple times. */
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) throw new Error("Set ADMIN_EMAIL and ADMIN_PASSWORD in .env");
  if (password.length < 10) throw new Error("ADMIN_PASSWORD must be at least 10 characters");

  const passwordHash = await bcrypt.hash(password, 12);
  await prisma.adminUser.upsert({
    where: { email: email.toLowerCase() },
    update: { passwordHash },
    create: { email: email.toLowerCase(), passwordHash, name: "Admin" },
  });

  const categories = [
    { name: "Snagging Guides", slug: "snagging-guides" },
    { name: "Handover", slug: "handover" },
    { name: "MEP & Technical", slug: "mep-technical" },
    { name: "UAE Property", slug: "uae-property" },
  ];
  for (const c of categories) {
    await prisma.category.upsert({ where: { slug: c.slug }, update: {}, create: c });
  }
  // Gallery: seed with real photos from the current site (only if empty)
  if ((await prisma.galleryImage.count()) === 0) {
    const photos = [
      { url: "/images/gallery/external-works-inspection.jpg", alt: "Engineer inspecting external works during a snagging inspection", category: "inspection" },
      { url: "/images/gallery/wall-finish-defect.jpg", alt: "Wall finish defect marked during snagging", category: "defects" },
      { url: "/images/gallery/wall-level-check.jpg", alt: "Checking wall level and finish", category: "inspection" },
      { url: "/images/gallery/wall-surface-check.jpg", alt: "Wall surface check with inspection tools", category: "equipment" },
      { url: "/images/gallery/mirror-fixture-check.jpg", alt: "Mirror and fixture installation check", category: "defects" },
      { url: "/images/scope/hvac.jpg", alt: "AC diffuser temperature test", category: "equipment" },
      { url: "/images/scope/plumbing.jpg", alt: "Plumbing fixture inspection", category: "inspection" },
      { url: "/images/scope/electrical.jpg", alt: "Socket alignment and polarity test", category: "equipment" },
      { url: "/images/scope/tiling.jpg", alt: "Hollow floor tile identified with tapping test", category: "defects" },
      { url: "/images/reports/sample-report-page-1.jpg", alt: "Page from a snagging report showing defect photos", category: "reporting" },
    ];
    await prisma.galleryImage.createMany({ data: photos.map((p, i) => ({ ...p, featured: i < 8, sortOrder: i })) });
  }

  console.log(`Seed complete. Admin: ${email}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
