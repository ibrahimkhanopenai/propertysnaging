import { notFound } from "next/navigation";
import { LocationPage } from "@/components/pages/LocationPage";
import { pageMetadata } from "@/components/pages/pageMetadata";
import { isLocale } from "@/i18n/config";

// Areas + communities come from Admin → Locations (saves revalidate at once; this is a safety net)
export const revalidate = 3600;

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  return pageMetadata("fujairah", (await params).locale);
}

export default async function Page({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <LocationPage pageKey="fujairah" locale={locale} />;
}
