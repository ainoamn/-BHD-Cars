import type { Metadata } from "next";
import Script from "next/script";
import { IBM_Plex_Sans_Arabic } from "next/font/google";
import { AppShell } from "@/components/app-shell";
import { BhdAccountIsolation } from "@/components/bhd/BhdAccountIsolation";
import { PrefsProvider } from "@/lib/prefs";
import { StoreProvider } from "@/lib/store";
import "./globals.css";

const plex = IBM_Plex_Sans_Arabic({
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-plex",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "BHD Cars",
    template: "%s · BHD Cars",
  },
  description:
    "BHD Cars — car marketplace for Oman and the Gulf: buy, sell, auctions, valuation, finance, insurance, inspection, import, rental, and parts. منصة سيارات للشراء والبيع والمزاد مع تثمين وتمويل وتأمين وفحص.",
  icons: {
    icon: "/brand/bhd-mark.svg",
    apple: "/brand/bhd-mark.svg",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover" as const,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" className={`${plex.variable} h-full`}>
      <head>
        <link rel="stylesheet" href="https://id.bhd-om.com/bhd-launcher.css" />
      </head>
      <body className="min-h-full">
        <BhdAccountIsolation />
        <PrefsProvider>
          <StoreProvider>
            <AppShell>{children}</AppShell>
          </StoreProvider>
        </PrefsProvider>
        <Script src="https://id.bhd-om.com/bhd-identity.js" strategy="afterInteractive" />
        <Script src="https://id.bhd-om.com/bhd-launcher.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
