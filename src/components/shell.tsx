"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { markets } from "@/lib/data";
import { usePrefs } from "@/lib/prefs";
import { useStore } from "@/lib/store";
import type { Copy, Currency } from "@/lib/types";

const L = (ar: string, en: string): Copy => ({ ar, en });

const primary = [
  { href: "/cars", label: L("السيارات", "Cars") },
  { href: "/auctions", label: L("المزادات", "Auctions") },
  { href: "/finance", label: L("التمويل", "Finance") },
  { href: "/insurance", label: L("التأمين", "Insurance") },
  { href: "/inspection", label: L("الفحص", "Inspection") },
  { href: "/import", label: L("الاستيراد", "Import") },
  { href: "/rental", label: L("التأجير", "Rental") },
];

const more = [
  { href: "/valuation", label: L("التثمين", "Valuation") },
  { href: "/parts", label: L("قطع الغيار", "Parts") },
  { href: "/scrap", label: L("السكراب", "Scrap") },
  { href: "/plates", label: L("اللوحات", "Plates") },
  { href: "/reports", label: L("سجل السيارة", "History") },
  { href: "/service", label: L("الصيانة", "Service") },
  { href: "/dealers", label: L("المعارض", "Houses") },
  { href: "/requests", label: L("طلباتي", "Requests") },
];

const currencies: Currency[] = ["OMR", "AED", "SAR", "QAR", "BHD", "KWD", "USD", "EUR"];

export function Shell({ children }: { children: React.ReactNode }) {
  const { locale, setLocale, marketId, setMarketId, currency, setCurrency, tx } = usePrefs();
  const { compare } = useStore();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  function go(href: string) {
    setOpen(false);
    router.push(href);
  }

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b border-line/80 bg-ivory/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-5 py-3">
          <Link href="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
            <img src="/brand/bhd-mark.svg" alt="BHD" className="bhd-mark" />
            <span className="leading-tight">
              <span className="block text-lg font-semibold tracking-wide text-night">BHD Cars</span>
              <span className="block text-[11px] text-muted">{tx(L("منصة السيارات", "The car desk"))}</span>
            </span>
          </Link>

          <nav className="ms-auto hidden items-center gap-5 text-sm lg:flex">
            {primary.map((item) => (
              <Link key={item.href} href={item.href} className="text-ink/80 hover:text-night">
                {tx(item.label)}
              </Link>
            ))}
            <details className="relative">
              <summary className="cursor-pointer list-none text-ink/80 hover:text-night">{tx(L("المزيد", "More"))}</summary>
              <div className="absolute end-0 z-20 mt-3 w-52 border border-line bg-paper p-2 shadow-sm">
                {more.map((item) => (
                  <Link key={item.href} href={item.href} className="block px-3 py-2 text-sm hover:bg-sand/60">
                    {tx(item.label)}
                  </Link>
                ))}
              </div>
            </details>
          </nav>

          <div className="ms-auto hidden items-center gap-2 lg:flex">
            <select
              aria-label={tx(L("السوق", "Market"))}
              value={marketId}
              onChange={(event) => setMarketId(event.target.value as typeof marketId)}
              className="border border-line bg-transparent px-2 py-2 text-xs"
            >
              {markets.map((market) => (
                <option key={market.id} value={market.id}>{tx(market.name)}</option>
              ))}
            </select>
            <select
              aria-label={tx(L("العملة", "Currency"))}
              value={currency}
              onChange={(event) => setCurrency(event.target.value as Currency)}
              className="border border-line bg-transparent px-2 py-2 text-xs"
            >
              {currencies.map((code) => (
                <option key={code} value={code}>{code}</option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => setLocale(locale === "ar" ? "en" : "ar")}
              className="border border-line px-3 py-2 text-xs"
            >
              {locale === "ar" ? "English" : "العربية"}
            </button>
            <Link href="/sell" className="bg-night px-4 py-2 text-xs text-ivory">
              {tx(L("بيع سيارة", "Sell a car"))}
            </Link>
          </div>

          <button type="button" className="ms-auto border border-line px-3 py-2 text-xs lg:hidden" onClick={() => setOpen((value) => !value)}>
            {open ? tx(L("إغلاق", "Close")) : tx(L("القائمة", "Menu"))}
          </button>
        </div>
        {open && (
          <div className="max-h-[70vh] overflow-y-auto border-t border-line px-5 py-4 lg:hidden">
            <div className="grid grid-cols-2 gap-2 text-sm">
              {[...primary, ...more, { href: "/sell", label: L("بيع سيارة", "Sell a car") }, { href: "/about", label: L("عن المنصة", "About") }].map((item) => (
                <button key={item.href} type="button" onClick={() => go(item.href)} className="border border-line px-3 py-3 text-start">
                  {tx(item.label)}
                </button>
              ))}
            </div>
            <div className="mt-3 flex gap-2">
              <select aria-label={tx(L("السوق", "Market"))} value={marketId} onChange={(event) => setMarketId(event.target.value as typeof marketId)} className="flex-1 border border-line bg-transparent px-2 py-2 text-xs">
                {markets.map((market) => (
                  <option key={market.id} value={market.id}>{tx(market.name)}</option>
                ))}
              </select>
              <select aria-label={tx(L("العملة", "Currency"))} value={currency} onChange={(event) => setCurrency(event.target.value as Currency)} className="border border-line bg-transparent px-2 py-2 text-xs">
                {currencies.map((code) => (
                  <option key={code} value={code}>{code}</option>
                ))}
              </select>
              <button type="button" onClick={() => setLocale(locale === "ar" ? "en" : "ar")} className="border border-line px-3 py-2 text-xs">
                {locale === "ar" ? "EN" : "ع"}
              </button>
            </div>
          </div>
        )}
      </header>

      <main>{children}</main>

      {compare.length > 0 && (
        <Link href="/compare" className="fixed bottom-4 left-1/2 z-30 -translate-x-1/2 border border-night bg-night px-5 py-3 text-sm text-ivory">
          {tx(L(`مقارنة ${compare.length} سيارات`, `Compare ${compare.length} cars`))}
        </Link>
      )}

      <footer className="mt-20 bg-night text-ivory">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 md:grid-cols-4">
          <div>
            <span className="inline-flex rounded-md bg-paper px-3 py-2">
              <img src="/brand/bhd-mark.svg" alt="BHD" className="bhd-mark" />
            </span>
            <p className="mt-4 text-xl font-semibold">BHD Cars</p>
            <p className="mt-2 text-xs tracking-[0.14em] text-brass">{tx(L("ابنِ أحلامًا أكبر.", "Build Higher Dreams."))}</p>
            <p className="mt-3 text-sm leading-relaxed text-ivory/70">
              {tx(L(
                "منصة واحدة للشراء والبيع والمزاد، مع تثمين وفحص وتمويل وتأمين واستيراد. الأرقام في هذه النسخة توضيحية حتى ربط الشركاء.",
                "One desk for buying, selling, and auctions, with valuation, inspection, finance, insurance, and import. Figures in this version are illustrative until partners are connected.",
              ))}
            </p>
          </div>
          <FooterCol title={tx(L("السوق", "Market"))} links={[["/cars", L("السيارات", "Cars")], ["/auctions", L("المزادات", "Auctions")], ["/rental", L("التأجير", "Rental")], ["/plates", L("اللوحات", "Plates")], ["/dealers", L("المعارض", "Houses")]]} />
          <FooterCol title={tx(L("الخدمات", "Services"))} links={[["/valuation", L("التثمين", "Valuation")], ["/finance", L("التمويل", "Finance")], ["/insurance", L("التأمين", "Insurance")], ["/inspection", L("الفحص", "Inspection")], ["/import", L("الاستيراد", "Import")], ["/parts", L("القطع", "Parts")], ["/scrap", L("السكراب", "Scrap")]]} />
          <FooterCol title={tx(L("الشركة", "House"))} links={[["/about", L("عن المنصة", "About")], ["/contact", L("تواصل", "Contact")], ["/requests", L("متابعة الطلب", "Track a request")], ["/reports", L("سجل السيارة", "History")], ["/service", L("الصيانة", "Service")]]} />
        </div>
        <div className="border-t border-white/10 px-5 py-4 text-center text-xs text-ivory/50">
          BHD Cars · Bin Hamood Development · {new Date().getFullYear()}
        </div>
      </footer>
    </div>
  );
}

function FooterCol({ title, links }: { title: string; links: [string, Copy][] }) {
  const { tx } = usePrefs();
  return (
    <div>
      <p className="text-xs tracking-[0.18em] text-brass">{title}</p>
      <ul className="mt-3 space-y-2 text-sm text-ivory/80">
        {links.map(([href, label]) => (
          <li key={href}><Link href={href} className="hover:text-ivory">{tx(label)}</Link></li>
        ))}
      </ul>
    </div>
  );
}
