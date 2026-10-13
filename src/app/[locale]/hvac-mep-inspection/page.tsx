import { notFound } from "next/navigation";
import { ContentPage } from "@/components/pages/ContentPage";
import { pageMetadata } from "@/components/pages/pageMetadata";
import { isLocale } from "@/i18n/config";

// Intro, sections and FAQs can come from the admin (saves revalidate at once; this is a safety net)
export const revalidate = 3600;

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  return pageMetadata("hvacMep", (await params).locale);
}

export default async function Page({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <ContentPage pageKey="hvacMep" locale={locale} />;
}
