import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Hero } from "@/components/home/Hero";
import { TrustSection } from "@/components/home/TrustSection";
import { ServicesGrid } from "@/components/home/ServicesGrid";
import { WhatWeInspect } from "@/components/home/WhatWeInspect";
import { PhotosSection } from "@/components/home/PhotosSection";
import { SampleReportSection } from "@/components/home/SampleReportSection";
import { Process } from "@/components/home/Process";
import { WhyChoose } from "@/components/home/WhyChoose";
import { Emirates } from "@/components/home/Emirates";
import { ReviewsMarquee } from "@/components/home/ReviewsMarquee";
import { FinalCta } from "@/components/home/FinalCta";
import { Faq } from "@/components/pages/Faq";
import { getDictionary } from "@/i18n/dictionaries";
import { isLocale, localePath } from "@/i18n/config";
import { buildMetadata } from "@/lib/seo";

/**
 * Homepage — section ORDER is a client requirement (docs/client-requirements.md §2):
 * Hero → Trust → Services → What we inspect → Real photos → Sample report → Process →
 * Why choose us → Emirates → Reviews → FAQ → Final booking CTA
 */
export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = getDictionary(locale);
  return buildMetadata({ locale, path: "/", title: dict.meta.homeTitle, description: dict.meta.homeDescription, absoluteTitle: true });
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);
  return (
    <>
      <Hero locale={locale} dict={dict} />
      <TrustSection dict={dict} />
      <ServicesGrid locale={locale} dict={dict} />
      <WhatWeInspect locale={locale} dict={dict} />
      <PhotosSection locale={locale} dict={dict} />
      <SampleReportSection locale={locale} dict={dict} />
      <Process dict={dict} />
      <WhyChoose dict={dict} />
      <Emirates locale={locale} dict={dict} />
      <ReviewsMarquee dict={dict} />
      <Faq title={dict.home.faq.title} text={dict.home.faq.text} items={dict.home.faq.items} link={{ href: localePath(locale, "/faqs/"), label: dict.home.faq.all }} />
      <FinalCta locale={locale} dict={dict} />
    </>
  );
}
