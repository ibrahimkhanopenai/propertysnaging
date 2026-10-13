import { SettingsForm } from "@/components/admin/SettingsForm";
import { prisma } from "@/lib/db";
import { settingFields } from "@/lib/settings-fields";

export const metadata = { title: "Settings" };

/** Admin → Settings: contact details, key figures and links used across the whole site. */
export default async function SettingsAdmin() {
  const saved = new Map((await prisma.setting.findMany()).map((r) => [r.key, r.value]));
  const values = Object.fromEntries(settingFields.map((f) => [f.key, saved.get(f.key) ?? f.defaultValue]));
  return (
    <div className="flex max-w-4xl flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-sm text-muted">
          Used on every page (header, footer, contact page, homepage, location pages) and in Google structured data. Saving updates the whole site.
        </p>
      </div>
      <SettingsForm values={values} />
    </div>
  );
}
