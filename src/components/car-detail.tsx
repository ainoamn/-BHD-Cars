"use client";

import Link from "next/link";
import { useState } from "react";
import { CarCard } from "@/components/car-card";
import { DemoNote, Field, Ghost, Photo, Primary, Receipt, SpecRow, fieldClass } from "@/components/ui";
import { carBySlug, cars, sellerBySlug } from "@/lib/data";
import { marketPosition } from "@/lib/quotes";
import { usePrefs } from "@/lib/prefs";
import { useStore } from "@/lib/store";
import type { Copy } from "@/lib/types";

const L = (ar: string, en: string): Copy => ({ ar, en });

const positionCopy = {
  below: L("أدنى من متوسط السوق", "Below the market"),
  fair: L("ضمن متوسط السوق", "In line with the market"),
  above: L("أعلى من متوسط السوق", "Above the market"),
};

export function CarDetail({ slug }: { slug: string }) {
  const car = carBySlug(slug);
  const { tx, money, number } = usePrefs();
  const { addRequest, toggleCompare, compare } = useStore();
  const [image, setImage] = useState(0);
  const [sent, setSent] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [tab, setTab] = useState<"overview" | "services">("overview");

  if (!car) {
    return <p className="mx-auto max-w-6xl px-5 py-20 text-muted">{tx(L("هذا الإعلان غير موجود.", "This listing is not here."))}</p>;
  }

  const seller = sellerBySlug(car.seller);
  const position = marketPosition(car.priceOmr, car.marketOmr);
  const related = cars.filter((item) => item.slug !== car.slug && (item.make === car.make || item.condition === car.condition)).slice(0, 3);

  function inquire() {
    const created = addRequest({
      kind: "inquiry",
      title: tx(car!.title),
      detail: note || tx(L("طلب تواصل بخصوص الإعلان.", "A note about this listing.")),
      status: "matching",
    });
    setSent(created.ref);
  }

  return (
    <div className="mx-auto max-w-6xl px-5 py-8">
      <p className="text-xs text-muted">
        <Link href="/cars" className="hover:text-brass">{tx(L("السيارات", "Cars"))}</Link>
        <span className="px-2">/</span>
        {tx(car.title)}
      </p>

      <div className="mt-5 grid gap-6 lg:grid-cols-[1.35fr_0.85fr]">
        <div>
          <div className="surface-card overflow-hidden">
            <Photo src={car.images[image] ?? car.images[0]} alt={tx(car.title)} className="aspect-[16/10] w-full" />
            {car.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto p-3">
                {car.images.map((src, index) => (
                  <button key={src + index} type="button" onClick={() => setImage(index)} className={`overflow-hidden rounded-xl ${index === image ? "ring-2 ring-brass" : "opacity-70"}`}>
                    <Photo src={src} alt="" className="h-16 w-24" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            <button type="button" onClick={() => setTab("overview")} className={tab === "overview" ? "chip chip-active" : "chip"}>
              {tx(L("نظرة عامة", "Overview"))}
            </button>
            <button type="button" onClick={() => setTab("services")} className={tab === "services" ? "chip chip-active" : "chip"}>
              {tx(L("خدمات على هذه السيارة", "Services on this car"))}
            </button>
          </div>

          {tab === "overview" ? (
            <div className="mt-6 space-y-6">
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-night md:text-4xl">{tx(car.title)}</h1>
                <p className="mt-2 text-sm text-muted">
                  {car.year}
                  <span className="mx-1.5">·</span>
                  {tx(car.city)}
                  <span className="mx-1.5">·</span>
                  {number(car.mileage)} {tx(L("كم", "km"))}
                </p>
              </div>

              <p className="max-w-3xl leading-relaxed text-ink/90">{tx(car.description)}</p>

              <SpecRow
                items={[
                  { label: tx(L("الوقود", "Fuel")), value: tx(car.fuel) },
                  { label: tx(L("ناقل الحركة", "Gearbox")), value: tx(car.gearbox) },
                  { label: tx(L("الهيكل", "Body")), value: tx(car.body) },
                  { label: tx(L("الدفع", "Drive")), value: tx(car.drive) },
                  { label: tx(L("اللون", "Colour")), value: tx(car.color) },
                  { label: tx(L("رقم الهيكل", "VIN")), value: car.vin },
                ]}
              />

              <ul className="flex flex-wrap gap-2">
                {car.highlights.map((item) => (
                  <li key={item.en} className="chip bg-soft">{tx(item)}</li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {[
                ["/finance", L("اطلب تمويلاً", "Ask for finance"), L("قارن البنوك وأرسل الملف", "Compare banks and send the file")],
                ["/insurance", L("اطلب تأميناً", "Ask for cover"), L("شامل أو طرف ثالث", "Comprehensive or third party")],
                ["/inspection", L("فحص بالنيابة", "Inspect for me"), L("تقرير قبل التحويل", "A report before transfer")],
                ["/valuation", L("تثمين", "Valuation"), L("رقم من مثمن معتمد", "A figure from a certified appraiser")],
              ].map(([href, title, text]) => (
                <Link key={href as string} href={`${href}?car=${car.slug}`} className="surface-card surface-card-hover p-5">
                  <h3 className="font-semibold text-night">{tx(title as Copy)}</h3>
                  <p className="mt-2 text-sm text-muted">{tx(text as Copy)}</p>
                </Link>
              ))}
            </div>
          )}
        </div>

        <aside className="space-y-4 lg:sticky lg:top-28 lg:self-start">
          <div className="surface-card p-5">
            <p className="text-3xl font-bold tracking-tight text-night">{money(car.priceOmr)}</p>
            <p className="mt-2 text-sm font-medium text-brass">{tx(positionCopy[position])}</p>
            <p className="mt-1 text-xs text-muted">{tx(L("متوسط السوق", "Market average"))} {money(car.marketOmr)}</p>

            <div className="mt-5 grid grid-cols-2 gap-2">
              <Ghost href={`/finance?car=${car.slug}`}>{tx(L("تمويل", "Finance"))}</Ghost>
              <Ghost href={`/insurance?car=${car.slug}`}>{tx(L("تأمين", "Insurance"))}</Ghost>
              <Ghost href={`/inspection?car=${car.slug}`}>{tx(L("فحص", "Inspect"))}</Ghost>
              <Ghost href={`/valuation?car=${car.slug}`}>{tx(L("تثمين", "Value"))}</Ghost>
            </div>

            <button type="button" onClick={() => toggleCompare(car.slug)} className="mt-4 text-xs text-muted hover:text-night">
              {compare.includes(car.slug) ? tx(L("مضافة إلى المقارنة", "Added to compare")) : tx(L("أضف إلى المقارنة", "Add to compare"))}
            </button>
          </div>

          {seller && (
            <div className="surface-card p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs text-muted">{seller.kind === "dealer" ? tx(L("معرض موثّق", "Verified house")) : tx(L("بائع", "Seller"))}</p>
                  <p className="mt-1 text-lg font-semibold">{seller.name}</p>
                </div>
                {seller.verified && <span className="rounded-full bg-soft px-2.5 py-1 text-[11px] font-medium text-brass">{tx(L("موثّق", "Verified"))}</span>}
              </div>
              <p className="mt-1 text-xs text-muted">{tx(seller.city)} · {tx(L("منذ", "Since"))} {seller.since}</p>
              <p className="mt-3 text-sm leading-relaxed text-muted">{tx(seller.about)}</p>
              {seller.kind === "dealer" && (
                <Link href={`/dealers/${seller.slug}`} className="mt-3 inline-block text-sm font-medium text-navy hover:text-brass">
                  {tx(L("إعلانات المعرض", "House listings"))}
                </Link>
              )}
            </div>
          )}

          <div className="surface-card p-5">
            {sent ? (
              <Receipt
                refCode={sent}
                title={tx(L("وصلت رسالتك إلى البائع.", "Your note reached the seller."))}
                detail={tx(L("يظهر الرد في صفحة الطلبات. لا حاجة لنشر رقمك في الإعلان.", "The reply appears on the requests page. Your number does not need to sit on the listing."))}
              />
            ) : (
              <>
                <h2 className="text-base font-semibold text-night">{tx(L("تواصل بخصوص هذه السيارة", "Enquire about this car"))}</h2>
                <div className="mt-3">
                  <Field label={tx(L("رسالتك", "Your note"))}>
                    <textarea value={note} onChange={(event) => setNote(event.target.value)} className={fieldClass} rows={4} placeholder={tx(L("أريد معاينتها مساء الخميس.", "I can see it Thursday evening."))} />
                  </Field>
                </div>
                <div className="mt-3">
                  <Primary onClick={inquire} className="w-full">{tx(L("أرسل الرسالة", "Send the note"))}</Primary>
                </div>
              </>
            )}
          </div>
        </aside>
      </div>

      {related.length > 0 && (
        <section className="mt-14">
          <div className="mb-5 flex items-end justify-between">
            <h2 className="section-title">{tx(L("سيارات قريبة", "Similar cars"))}</h2>
            <Link href="/cars" className="text-sm font-medium text-navy hover:text-brass">{tx(L("المزيد", "More"))}</Link>
          </div>
          <div className="grid gap-5 sm:grid-cols-3">
            {related.map((item) => <CarCard key={item.slug} car={item} />)}
          </div>
        </section>
      )}

      <div className="mt-10"><DemoNote /></div>
    </div>
  );
}
