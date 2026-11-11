"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent } from "react";
import { CarCard } from "@/components/car-card";
import { Photo } from "@/components/ui";
import { auctions, cars, makes } from "@/lib/data";
import { usePrefs } from "@/lib/prefs";
import type { Copy } from "@/lib/types";

const L = (ar: string, en: string): Copy => ({ ar, en });

const categories: { href: string; title: Copy; text: Copy; image: string; count: Copy }[] = [
  {
    href: "/cars?condition=ready",
    title: L("سيارات للبيع", "Cars for sale"),
    text: L("جاهزة من المعارض والأفراد", "Ready stock from houses and private sellers"),
    image: cars[0].images[0],
    count: L("سوق يومي", "Daily market"),
  },
  {
    href: "/import",
    title: L("حوادث واستيراد", "Salvage & import"),
    text: L("ضرر معلن وطلب استيراد واضح", "Declared damage and clear import requests"),
    image: cars.find((car) => car.condition === "accident")?.images[0] ?? cars[0].images[0],
    count: L("ملف شفاف", "Clear file"),
  },
  {
    href: "/auctions",
    title: L("مزادات مباشرة", "Live auctions"),
    text: L("خطوة معلنة وعمولة واضحة", "Stated step and clear premium"),
    image: auctions[0].image,
    count: L("مباشر الآن", "Live now"),
  },
  {
    href: "/rental",
    title: L("تأجير", "Rental"),
    text: L("يومي وشهري مع تأمين", "Daily and monthly with cover"),
    image: cars[2].images[0],
    count: L("حجز سريع", "Quick booking"),
  },
  {
    href: "/parts",
    title: L("قطع غيار", "Spare parts"),
    text: L("جديد ومستعمل مطابق للهيكل", "New and used, matched to VIN"),
    image: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=1200&q=80",
    count: L("طلب قطعة", "Part request"),
  },
  {
    href: "/finance",
    title: L("تمويل وتأمين وفحص", "Finance, cover, inspection"),
    text: L("من داخل الإعلان، برقم متابعة", "From the listing, with a reference"),
    image: cars[1].images[0],
    count: L("خدمات مكتملة", "Full services"),
  },
];

const services: { href: string; title: Copy; text: Copy }[] = [
  { href: "/valuation", title: L("تثمين معتمد", "Certified valuation"), text: L("مثمن مرخّص حسب المدينة", "Licensed appraiser by city") },
  { href: "/finance", title: L("تمويل بنكي", "Bank finance"), text: L("قارن الأقساط ثم أرسل الملف", "Compare instalments, then send the file") },
  { href: "/insurance", title: L("تأمين مقارن", "Compared insurance"), text: L("شامل أو طرف ثالث أو حدود", "Comprehensive, third party, or border") },
  { href: "/inspection", title: L("فحص بالنيابة", "Proxy inspection"), text: L("تقرير قبل تحويل أي مبلغ", "A report before any money moves") },
];

export function HomeView() {
  const { tx, money } = usePrefs();
  const router = useRouter();
  const live = auctions[0];

  function search(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const params = new URLSearchParams();
    for (const [key, value] of data.entries()) {
      if (String(value)) params.set(key, String(value));
    }
    router.push(`/cars?${params.toString()}`);
  }

  return (
    <div>
      <section className="relative min-h-[78vh] overflow-hidden border-b border-line">
        <Photo
          src={cars[0].images[0]}
          alt={tx(cars[0].title)}
          className="absolute inset-0 h-full w-full scale-[1.02]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-night/90 via-night/55 to-night/25" />
        <div className="absolute inset-0 bg-gradient-to-l from-night/70 via-transparent to-transparent md:from-night/75" />

        <div className="relative mx-auto flex min-h-[78vh] max-w-6xl flex-col justify-end px-5 pb-10 pt-24 md:justify-center md:pb-16 md:pt-20">
          <div className="max-w-2xl text-ivory">
            <p className="text-xs font-semibold tracking-[0.18em] text-brass">
              {tx(L("BHD CARS · عُمان والخليج", "BHD CARS · Oman & the Gulf"))}
            </p>
            <h1 className="mt-4 text-4xl font-bold leading-[1.12] tracking-tight md:text-6xl">
              {tx(L("ابحث. قارن. اشترِ بثقة.", "Search. Compare. Buy with clarity."))}
            </h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-ivory/80 md:text-lg">
              {tx(L(
                "سوق سيارات مرتّب، مع تمويل وتأمين وفحص من داخل الإعلان — لا واتساب ضائع ولا صفحة منفصلة.",
                "A tidy car market, with finance, insurance, and inspection on the listing — no lost WhatsApp, no separate page.",
              ))}
            </p>
          </div>

          <form
            onSubmit={search}
            className="mt-8 grid w-full max-w-4xl gap-2 rounded-[1.25rem] border border-white/15 bg-ivory/95 p-2 shadow-[var(--shadow-lift)] backdrop-blur sm:grid-cols-[1.1fr_1fr_1fr_auto]"
          >
            <select name="make" aria-label={tx(L("الشركة", "Make"))} className="field border-0 bg-transparent" defaultValue="">
              <option value="">{tx(L("كل الشركات", "Any make"))}</option>
              {makes.map((make) => <option key={make}>{make}</option>)}
            </select>
            <select name="condition" aria-label={tx(L("الحالة", "Condition"))} className="field border-0 bg-transparent" defaultValue="">
              <option value="">{tx(L("كل الحالات", "Any condition"))}</option>
              <option value="ready">{tx(L("جاهزة", "Ready"))}</option>
              <option value="new">{tx(L("جديدة", "New"))}</option>
              <option value="accident">{tx(L("حادث معلن", "Declared damage"))}</option>
            </select>
            <select name="budget" aria-label={tx(L("الميزانية", "Budget"))} className="field border-0 bg-transparent" defaultValue="">
              <option value="">{tx(L("أي ميزانية", "Any budget"))}</option>
              <option value="5000">{tx(L("حتى 5,000", "Up to 5,000"))}</option>
              <option value="12000">{tx(L("حتى 12,000", "Up to 12,000"))}</option>
              <option value="20000">{tx(L("حتى 20,000", "Up to 20,000"))}</option>
              <option value="40000">{tx(L("حتى 40,000", "Up to 40,000"))}</option>
            </select>
            <button className="btn-teal px-6">{tx(L("اعرض", "Show"))}</button>
          </form>

          <div className="mt-5 flex flex-wrap gap-2">
            {makes.slice(0, 6).map((make) => (
              <Link key={make} href={`/cars?make=${encodeURIComponent(make)}`} className="rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs text-ivory backdrop-blur hover:bg-white/20">
                {make}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-12">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="eyebrow">{tx(L("تصفّح سريع", "Quick browse"))}</p>
            <h2 className="section-title mt-2">{tx(L("ماذا تريد اليوم؟", "What do you need today?"))}</h2>
          </div>
          <Link href="/cars" className="text-sm font-medium text-navy hover:text-brass">{tx(L("كل السيارات", "All cars"))}</Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Link key={category.href} href={category.href} className="surface-card surface-card-hover group overflow-hidden">
              <div className="relative aspect-[16/9] overflow-hidden">
                <Photo src={category.image} alt={tx(category.title)} className="h-full w-full transition duration-700 group-hover:scale-[1.04]" />
                <div className="absolute inset-0 bg-gradient-to-t from-night/70 via-night/10 to-transparent" />
                <span className="absolute start-3 bottom-3 rounded-full bg-paper/95 px-2.5 py-1 text-[11px] font-medium text-night">
                  {tx(category.count)}
                </span>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-night">{tx(category.title)}</h3>
                <p className="mt-1 text-sm text-muted">{tx(category.text)}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-y border-line bg-paper/70">
        <div className="mx-auto grid max-w-6xl gap-4 px-5 py-10 md:grid-cols-4">
          {services.map((service) => (
            <Link key={service.href} href={service.href} className="rounded-2xl border border-line bg-ivory px-4 py-5 transition hover:border-brass/40 hover:bg-soft">
              <h3 className="text-base font-semibold text-night">{tx(service.title)}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{tx(service.text)}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-12">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="eyebrow">{tx(L("مختارة الآن", "Selected now"))}</p>
            <h2 className="section-title mt-2">{tx(L("أحدث السيارات المعروضة", "Latest listed cars"))}</h2>
          </div>
          <Link href="/cars" className="text-sm font-medium text-navy hover:text-brass">{tx(L("عرض الكل", "View all"))}</Link>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {cars.slice(0, 4).map((car) => <CarCard key={car.slug} car={car} />)}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-14">
        <Link href={`/auctions/${live.slug}`} className="surface-card surface-card-hover grid overflow-hidden md:grid-cols-[1.2fr_0.8fr]">
          <div className="relative min-h-[240px]">
            <Photo src={live.image} alt={tx(live.title)} className="absolute inset-0 h-full w-full" />
          </div>
          <div className="flex flex-col justify-center p-6 md:p-8">
            <p className="flex items-center gap-2 text-xs font-medium text-live">
              <span className="pulse-dot inline-block h-2 w-2 rounded-full bg-live" />
              {tx(L("مزاد مفتوح الآن", "Auction open now"))}
            </p>
            <h2 className="mt-3 text-2xl font-bold tracking-tight text-night md:text-3xl">{tx(live.title)}</h2>
            <p className="mt-2 text-sm text-muted">{tx(live.city)} · {tx(live.specs)}</p>
            <p className="mt-4 text-2xl font-bold text-night">{money(live.bids[0]?.amountOmr ?? live.openingOmr)}</p>
            <p className="mt-4 text-sm font-medium text-navy">{tx(L("ادخل اللوت", "Enter the lot"))}</p>
          </div>
        </Link>
      </section>
    </div>
  );
}
