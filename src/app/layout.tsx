import type { Metadata } from "next";
import { IBM_Plex_Sans_Arabic } from "next/font/google";
import { Shell } from "@/components/shell";
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
    "منصة سيارات للشراء والبيع والمزاد، مع تثمين معتمد وتمويل وتأمين وفحص بالنيابة واستيراد وتأجير وقطع غيار.",
  icons: {
    icon: "/brand/bhd-mark.svg",
    apple: "/brand/bhd-mark.svg",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" className={plex.variable}>
      <body>
        <PrefsProvider>
          <StoreProvider>
            <Shell>{children}</Shell>
          </StoreProvider>
        </PrefsProvider>
      </body>
    </html>
  );
}
