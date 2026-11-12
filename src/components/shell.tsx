"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import BhdProgramsStrip from "@/components/bhd/BhdProgramsStrip";
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
  const { compare, requests } = useStore();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  function go(href: string) {
    setOpen(false);
    router.push(href);
  }

  function search(event: FormEvent) {
    event.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    router.push(`/cars?${params.toString()}`);
    setOpen(false);
  }

  return (
    <div className="min-h-screen">
      <div className="border-b border-line/70 bg-night text-ivory">
        <div className="page-wrap flex items-center justify-between gap-3 py-2 text-xs">
          <p className="truncate text-ivory/75">
            {tx(L("منظومة بن حمود · ابنِ أحلامًا أكبر", "Bin Hamood · Build Higher Dreams"))}
          </p>
          <div className="flex items-center gap-2">
            <select
              aria-label={tx(L("السوق", "Market"))}
              value={marketId}
              onChange={(event) => setMarketId(event.target.value as typeof marketId)}
              className="rounded-full border border-white/15 bg-transparent px-2 py-1"
            >
              {markets.map((market) => (
                <option key={market.id} value={market.id} className="text-night">{tx(market.name)}</option>
              ))}
            </select>
            <select
              aria-label={tx(L("العملة", "Currency"))}
              value={currency}
              onChange={(event) => setCurrency(event.target.value as Currency)}
              className="rounded-full border border-white/15 bg-transparent px-2 py-1"
            >
              {currencies.map((code) => (
                <option key={code} value={code} className="text-night">{code}</option>
              ))}
            </select>
            <button type="button" onClick={() => setLocale(locale === "ar" ? "en" : "ar")} className="rounded-full border border-white/15 px-3 py-1">
              {locale === "ar" ? "EN" : "ع"}
            </button>
          </div>
        </div>
      </div>

      <BhdProgramsStrip variant="header" />

      <header className="sticky top-0 z-40 border-b border-line/80 bg-ivory/90 backdrop-blur">
        <div className="page-wrap py-3">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex shrink-0 items-center gap-3" onClick={() => setOpen(false)}>
              <img src="/brand/bhd-mark.svg" alt="BHD" className="bhd-mark" />
              <span className="leading-tight">
                <span className="block text-lg font-bold tracking-wide text-night">BHD Cars</span>
                <span className="hidden text-[11px] text-muted sm:block">{tx(L("منصة السيارات", "The car desk"))}</span>
              </span>
            </Link>

            <form onSubmit={search} className="ms-auto hidden flex-1 items-center gap-2 md:ms-8 md:flex lg:ms-12">
              <div className="relative flex-1">
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  className="field pe-28"
                  placeholder={tx(L("ابحث عن سيارة، موديل، أو رقم هيكل", "Search a car, model, or VIN"))}
                />
                <button type="submit" className="btn-teal absolute end-1.5 top-1.5 bottom-1.5 px-4 text-sm">
                  {tx(L("بحث", "Search"))}
                </button>
              </div>
            </form>

            <div className="ms-auto flex items-center gap-2 md:ms-0">
              <Link href="/requests" className="btn-secondary hidden px-3 py-2 text-xs sm:inline-flex">
                {tx(L("طلباتي", "Requests"))}
                {requests.length > 0 ? ` (${requests.length})` : ""}
              </Link>
              <Link href="/sell" className="btn-primary px-2.5 py-2 text-[11px] sm:px-4 sm:text-xs">
                {tx(L("بيع", "Sell"))}
                <span className="hidden min-[360px]:inline">{locale === "ar" ? " سيارة" : " a car"}</span>
              </Link>
              <button type="button" className="btn-secondary px-3 py-2 text-xs lg:hidden" onClick={() => setOpen((value) => !value)}>
                {open ? tx(L("إغلاق", "Close")) : tx(L("القائمة", "Menu"))}
              </button>
            </div>
          </div>

          <nav className="mt-3 hidden items-center gap-1 overflow-x-auto pb-1 text-sm lg:flex">
            {primary.map((item) => {
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-full px-3 py-2 whitespace-nowrap ${active ? "bg-night text-ivory" : "text-ink/75 hover:bg-soft hover:text-night"}`}
                >
                  {tx(item.label)}
                </Link>
              );
            })}
            <details className="relative">
              <summary className="cursor-pointer list-none rounded-full px-3 py-2 text-ink/75 hover:bg-soft hover:text-night">
                {tx(L("المزيد", "More"))}
              </summary>
              <div className="absolute start-0 z-20 mt-2 w-56 overflow-hidden rounded-2xl border border-line bg-paper p-2 shadow-[var(--shadow-lift)]">
                {more.map((item) => (
                  <Link key={item.href} href={item.href} className="block rounded-xl px-3 py-2.5 text-sm hover:bg-soft">
                    {tx(item.label)}
                  </Link>
                ))}
              </div>
            </details>
          </nav>
        </div>

        {open && (
          <div className="page-wrap max-h-[70vh] overflow-y-auto border-t border-line py-4 lg:hidden">
            <form onSubmit={search} className="mb-4 flex gap-2">
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="field"
                placeholder={tx(L("ابحث عن سيارة", "Search a car"))}
              />
              <button type="submit" className="btn-teal shrink-0 px-4">{tx(L("بحث", "Search"))}</button>
            </form>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {[...primary, ...more, { href: "/about", label: L("عن المنصة", "About") }, { href: "/contact", label: L("تواصل", "Contact") }].map((item) => (
                <button key={item.href} type="button" onClick={() => go(item.href)} className="rounded-2xl border border-line bg-paper px-3 py-3 text-start">
                  {tx(item.label)}
                </button>
              ))}
            </div>
          </div>
        )}
      </header>

      <main>{children}</main>

      {compare.length > 0 && (
        <Link href="/compare" className="fixed bottom-5 left-1/2 z-30 -translate-x-1/2 rounded-full bg-night px-5 py-3 text-sm font-medium text-ivory shadow-[var(--shadow-lift)]">
          {tx(L(`مقارنة ${compare.length} سيارات`, `Compare ${compare.length} cars`))}
        </Link>
      )}

      <footer className="mt-20 bg-night text-ivory">
        <div className="page-wrap grid gap-10 py-14 md:grid-cols-5">
          <div>
            <span className="inline-flex rounded-xl bg-paper px-3 py-2">
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
          <BhdProgramsStrip variant="footer" />
        </div>
        <div className="page-wrap border-t border-white/10 py-4 text-center text-xs text-ivory/50">
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
