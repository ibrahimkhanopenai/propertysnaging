import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { DM_Sans, IBM_Plex_Sans_Arabic, Manrope } from "next/font/google";
import { GoogleAnalytics, GoogleTagManager } from "@next/third-parties/google";
import "../globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { TopBar } from "@/components/layout/TopBar";
import { FloatingContact } from "@/components/layout/FloatingContact";
import { LeadPopup } from "@/components/forms/LeadPopup";
import { TrackClicks } from "@/components/analytics/TrackClicks";
import { JsonLd } from "@/components/seo/JsonLd";
import { getDictionary } from "@/i18n/dictionaries";
import { isLocale, localeDir, locales } from "@/i18n/config";
import { organizationSchema, websiteSchema } from "@/lib/schema";
import { site } from "@/lib/site";

const manrope = Manrope({ subsets: ["latin"], weight: ["600", "700", "800"], variable: "--font-manrope", display: "swap" });
const dmSans = DM_Sans({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-dmsans", display: "swap" });
const plexArabic = IBM_Plex_Sans_Arabic({ subsets: ["arabic"], weight: ["400", "500", "600", "700"], variable: "--font-plex-ar", display: "swap" });

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const viewport: Viewport = { themeColor: "#ffffff", width: "device-width", initialScale: 1 };

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const dict = getDictionary(isLocale(locale) ? locale : "en");
  return {
    metadataBase: new URL(site.url),
    title: { default: dict.meta.homeTitle, template: `%s | ${dict.meta.titleSuffix}` },
    description: dict.meta.homeDescription,
    applicationName: site.name,
    verification: { google: site.googleVerification },
    icons: { icon: "/wp-content/uploads/2025/12/cropped-property-inspectors-fav-icon-270x270.jpg" },
    formatDetection: { telephone: false },
  };
}

export default async function LocaleLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);
  const fonts = locale === "ar" ? plexArabic.variable : `${manrope.variable} ${dmSans.variable}`;
  const gtm = process.env.NEXT_PUBLIC_GTM_ID;
  const ga = process.env.NEXT_PUBLIC_GA_ID;

  return (
    <html lang={locale} dir={localeDir[locale]} className={fonts}>
      {gtm ? <GoogleTagManager gtmId={gtm} /> : null}
      <body>
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-ink focus:px-4 focus:py-2 focus:text-white">
          {dict.nav.skip}
        </a>
        <TopBar dict={dict} />
        <Header locale={locale} dict={dict} />
        <main id="main">{children}</main>
        <Footer locale={locale} dict={dict} />
        <FloatingContact dict={dict} />
        <LeadPopup t={dict.popup} locale={locale} />
        <TrackClicks />
        <JsonLd data={[organizationSchema(), websiteSchema()]} />
      </body>
      {ga ? <GoogleAnalytics gaId={ga} /> : null}
    </html>
  );
}
