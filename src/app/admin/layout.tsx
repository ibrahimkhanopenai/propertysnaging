import type { Metadata } from "next";
import { dmSans } from "@/fonts";
import "../globals.css";

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
