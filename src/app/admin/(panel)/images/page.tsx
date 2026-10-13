import { prisma } from "@/lib/db";
import { imageGroups, imageSlots } from "@/lib/image-slots";
import { slotFormValues } from "@/lib/site-images";
import { ImageSlotForm } from "@/components/admin/ImageSlotForm";

export const metadata = { title: "Images" };

/** Admin → Images: replace site photos and their ALT text (EN/AR). Slots: src/lib/image-slots.ts */
export default async function ImagesAdmin() {
  const rows = new Map((await prisma.siteImage.findMany()).map((r) => [r.key, r]));
  return (
    <div className="flex flex-col gap-10">
      <div>
        <h1 className="text-2xl font-bold">Images</h1>
        <p className="max-w-3xl text-sm text-muted">
          Replace a photo and its ALT text. Changes go live as soon as you save. Use genuine inspection photos (no stock images or
          personal data). ALT text describes what the photo shows, in one plain sentence, without keyword stuffing. The original
          photo is kept: <b>Reset to default</b> brings it back.
        </p>
      </div>
      {imageGroups.map((g) => (
        <section key={g.key} className="flex flex-col gap-4">
          <div>
            <h2 className="text-lg font-bold">{g.title}</h2>
            <p className="text-sm text-muted">{g.help}</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
            {imageSlots
              .filter((s) => s.group === g.key)
              .map((s) => (
                <ImageSlotForm
                  key={s.key}
                  slotKey={s.key}
                  label={s.label}
                  where={s.where}
                  defaults={{ src: s.src, alt: s.alt("en") }}
                  initial={slotFormValues(s, rows.get(s.key))}
                />
              ))}
          </div>
        </section>
      ))}
    </div>
  );
}
