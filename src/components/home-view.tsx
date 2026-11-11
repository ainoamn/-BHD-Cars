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

const lanes: { href: string; index: string; title: Copy; text: Copy }[] = [
  { href: "/cars", index: "01", title: L("سيارات جاهزة", "Ready cars"), text: L("معارض وأفراد، مع موقع السعر من متوسط السوق.", "Houses and private sellers, with the price set against the market.") },
  { href: "/auctions", index: "02", title: L("مزاد مباشر", "Live auction"), text: L("مزايدة بخطوة معلنة وعمولة مشتري واضحة.", "Bids with a stated step and a clear buyer's premium.") },
  { href: "/valuation", index: "03", title: L("تثمين معتمد", "Certified valuation"), text: L("طلب يذهب إلى مثمن مرخّص، لا إلى رقم عشوائي.", "The request goes to a licensed appraiser, not a random number.") },
  { href: "/finance", index: "04", title: L("تمويل بنكي", "Bank finance"), text: L("مقارنة أقساط ثم إرسال الملف للجهة المختارة.", "Compare instalments, then send the file to the house you choose.") },
  { href: "/insurance", index: "05", title: L("تأمين مقارن", "Compared insurance"), text: L("شامل أو طرف ثالث أو حدود، من داخل الإعلان.", "Comprehensive, third party, or border cover, from the listing.") },
  { href: "/inspection", index: "06", title: L("فحص بالنيابة", "Proxy inspection"), text: L("موعد في المختبر وتقرير قبل أن تحوّل ريالاً.", "A lab slot and a report before any money moves.") },
  { href: "/import", index: "07", title: L("استيراد وحوادث", "Import and salvage"), text: L("طلب سيارة من الخارج، أو شراء حادث معلن بوضوح.", "Order a car from abroad, or buy a clearly declared salvage.") },
  { href: "/rental", index: "08", title: L("تأجير", "Rental"), text: L("يومي وشهري بسقف كيلومترات وتأمين داخل السعر.", "Daily and monthly, with a mileage cap and cover in the price.") },
  { href: "/parts", index: "09", title: L("قطع وسكراب", "Parts and scrap"), text: L("غيار مطابق لرقم الهيكل، وساحات للسيارات المنتهية.", "Parts matched to a VIN, and yards for end-of-life cars.") },
  { href: "/reports", index: "10", title: L("سجل ومقارنة", "History and compare"), text: L("تقرير هيكل، وصيانة، ومقارنة ثلاث سيارات جنباً إلى جنب.", "A history file, a workshop booking, and three cars side by side.") },
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
      <section className="grid lg:grid-cols-2">
        <div className="flex flex-col justify-end px-5 py-16 md:px-10 lg:min-h-[86vh] lg:py-20">
          <p className="text-xs text-brass">{tx(L("عُمان والخليج، بمعيار واحد", "Oman and the Gulf, on one standard"))}</p>
          <h1 className="mt-4 max-w-xl font-display text-5xl leading-[1.08] text-night md:text-6xl">
            {tx(L("عنوان واحد لكل قرار يخص السيارة.", "One address for every decision a car asks of you."))}
          </h1>
          <p className="mt-6 max-w-md text-base leading-relaxed text-muted">
            {tx(L(
              "الشراء والبيع والمزاد والتثمين والتمويل والتأمين والفحص والاستيراد يبقون هنا. بلا شبكة إعلانات، وبلا تحويل إلى موقع آخر في منتصف الطريق.",
              "Buying, selling, the auction, valuation, finance, insurance, inspection, and import stay here. No classifieds maze, and no hand-off to another site halfway through.",
            ))}
          </p>
          <form onSubmit={search} className="mt-10 grid gap-3 border border-line bg-paper p-3 sm:grid-cols-4">
            <select name="make" aria-label={tx(L("الشركة", "Make"))} className="bg-transparent px-2 py-3 text-sm" defaultValue="">
              <option value="">{tx(L("كل الشركات", "Any make"))}</option>
              {makes.map((make) => <option key={make}>{make}</option>)}
            </select>
            <select name="condition" aria-label={tx(L("الحالة", "Condition"))} className="bg-transparent px-2 py-3 text-sm" defaultValue="">
              <option value="">{tx(L("كل الحالات", "Any condition"))}</option>
              <option value="ready">{tx(L("جاهزة", "Ready"))}</option>
              <option value="new">{tx(L("جديدة", "New"))}</option>
              <option value="accident">{tx(L("حادث معلن", "Declared damage"))}</option>
            </select>
            <select name="budget" aria-label={tx(L("الميزانية", "Budget"))} className="bg-transparent px-2 py-3 text-sm" defaultValue="">
              <option value="">{tx(L("أي ميزانية", "Any budget"))}</option>
              <option value="5000">{tx(L("حتى 5,000 ر.ع", "Up to 5,000 OMR"))}</option>
              <option value="12000">{tx(L("حتى 12,000 ر.ع", "Up to 12,000 OMR"))}</option>
              <option value="20000">{tx(L("حتى 20,000 ر.ع", "Up to 20,000 OMR"))}</option>
              <option value="40000">{tx(L("حتى 40,000 ر.ع", "Up to 40,000 OMR"))}</option>
            </select>
            <button className="bg-night px-4 py-3 text-sm text-ivory">{tx(L("اعرض السيارات", "Show cars"))}</button>
          </form>
        </div>
        <div className="relative min-h-[70vh]">
          <Photo src={cars[4] ? cars[0].images[0] : ""} alt={tx(cars[0].title)} className="absolute inset-0 h-full w-full" />
          <div className="absolute inset-0 bg-gradient-to-t from-night/70 via-night/10 to-transparent" />
          <Link href={`/auctions/${live.slug}`} className="absolute bottom-6 start-6 end-6 border border-white/30 bg-night/80 p-5 text-ivory backdrop-blur-sm md:end-auto md:max-w-sm">
            <p className="flex items-center gap-2 text-xs text-brass-2">
              <span className="pulse-dot inline-block h-2 w-2 rounded-full bg-live" />
              {tx(L("مزاد مفتوح", "Auction open"))}
            </p>
            <p className="mt-2 font-display text-2xl">{tx(live.title)}</p>
            <p className="mt-1 text-sm text-ivory/80">{money(live.bids[0]?.amountOmr ?? live.openingOmr)} · {tx(live.city)}</p>
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16">
        <div className="flex items-end justify-between gap-6">
          <h2 className="font-display text-3xl text-night">{tx(L("عشر مكاتب في عنوان", "Ten desks, one address"))}</h2>
          <Link href="/about" className="hidden text-sm text-brass sm:inline">{tx(L("لماذا هذا الشكل", "Why it is built this way"))}</Link>
        </div>
        <div className="mt-8 divide-y divide-line border-y border-line">
          {lanes.map((lane) => (
            <Link key={lane.href} href={lane.href} className="grid gap-2 py-5 transition hover:bg-paper md:grid-cols-12 md:items-baseline md:gap-6">
              <span className="font-display text-brass md:col-span-1">{lane.index}</span>
              <span className="font-display text-2xl md:col-span-3">{tx(lane.title)}</span>
              <span className="text-sm leading-relaxed text-muted md:col-span-8">{tx(lane.text)}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-night text-ivory">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 md:grid-cols-4">
          {[
            [L("السعر مقابل السوق", "Price against the market"), L("كل إعلان يُظهر إن كان دون المتوسط أو فوقه.", "Every listing shows whether it sits under or over the average.")],
            [L("لا واتساب في المنتصف", "No WhatsApp in the middle"), L("التمويل والتأمين والفحص طلبات برقم متابعة.", "Finance, insurance, and inspection are requests with a reference.")],
            [L("الحادث يُعلن", "Damage is declared"), L("سيارات الاستيراد المتضررة في قسمها، لا مخفية بين الجاهز.", "Damaged imports live in their own section, not hidden among ready cars.")],
            [L("عملة السوق", "The market's currency"), L("بدّل بين الريال والدرهم والريال السعودي والدولار.", "Switch among the rial, dirham, Saudi riyal, and dollar.")],
          ].map(([title, text]) => (
            <div key={title.en}>
              <h3 className="font-display text-2xl">{tx(title)}</h3>
              <p className="mt-3 text-sm leading-relaxed text-ivory/70">{tx(text)}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16">
        <div className="flex items-end justify-between">
          <h2 className="font-display text-3xl text-night">{tx(L("مختارة الآن", "Selected now"))}</h2>
          <Link href="/cars" className="text-sm text-brass">{tx(L("كل السيارات", "All cars"))}</Link>
        </div>
        <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {cars.slice(0, 4).map((car) => <CarCard key={car.slug} car={car} />)}
        </div>
      </section>
    </div>
  );
}
