import type { Metadata, Viewport } from "next";
import { Cairo, Amiri } from "next/font/google";
import "./globals.css";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["400", "600", "700"],
  variable: "--font-cairo",
  display: "swap",
});

const amiri = Amiri({
  subsets: ["arabic", "latin"],
  weight: ["400", "700"],
  variable: "--font-amiri",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#7A24B2",
};

export const metadata: Metadata = {
  title: "مدارس الأفق العالمية | Horizon International Schools",
  description: "مدارس الأفق العالمية — التميز الأكاديمي في قلب الرياض | Horizon International Schools — Academic excellence in the heart of Riyadh",
  metadataBase: new URL((process.env.NEXT_PUBLIC_SITE_URL ?? "https://horizon-schools.vercel.app").trim()),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html suppressHydrationWarning className={`${cairo.variable} ${amiri.variable}`}>
      <body>{children}</body>
    </html>
  );
}
