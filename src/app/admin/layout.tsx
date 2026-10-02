import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "../globals.css";

const dmSans = DM_Sans({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-dmsans", display: "swap" });

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s | Admin · Property Inspectors" },
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${dmSans.variable} admin-root`}>
      <body className="bg-mist">{children}</body>
    </html>
  );
}
