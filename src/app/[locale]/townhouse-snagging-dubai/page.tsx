import { notFound } from "next/navigation";
import { ContentPage } from "@/components/pages/ContentPage";
import { pageMetadata } from "@/components/pages/pageMetadata";
import { isLocale } from "@/i18n/config";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  return pageMetadata("townhouseSnagging", (await params).locale);
}

export default async function Page({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <ContentPage pageKey="townhouseSnagging" locale={locale} />;
}
