"use client";

import Link from "next/link";
import { useState } from "react";
import { CarCard } from "@/components/car-card";
import { DemoNote, Field, Ghost, Photo, Primary, Receipt, fieldClass } from "@/components/ui";
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
    <div className="mx-auto max-w-6xl px-5 py-10">
      <p className="text-xs text-muted">
        <Link href="/cars">{tx(L("السيارات", "Cars"))}</Link>
        <span className="px-2">/</span>
        {tx(car.title)}
      </p>
      <div className="mt-6 grid gap-10 lg:grid-cols-[1.4fr_0.8fr]">
        <div>
          <Photo src={car.images[image] ?? car.images[0]} alt={tx(car.title)} className="aspect-[16/10] w-full" />
          {car.images.length > 1 && (
            <div className="mt-3 flex gap-3">
              {car.images.map((src, index) => (
                <button key={src} type="button" onClick={() => setImage(index)} className={index === image ? "ring-1 ring-night" : "opacity-70"}>
                  <Photo src={src} alt="" className="h-16 w-24" />
                </button>
              ))}
            </div>
          )}
          <h1 className="mt-8 font-display text-4xl text-night">{tx(car.title)}</h1>
          <p className="mt-2 text-sm text-muted">{car.year} · {tx(car.city)} · {number(car.mileage)} {tx(L("كم", "km"))}</p>
          <p className="mt-6 max-w-2xl leading-relaxed">{tx(car.description)}</p>
          <dl className="mt-8 grid grid-cols-2 gap-px border border-line bg-line sm:grid-cols-3">
            {[
              [L("الوقود", "Fuel"), car.fuel],
              [L("ناقل الحركة", "Gearbox"), car.gearbox],
              [L("الهيكل", "Body"), car.body],
              [L("الدفع", "Drive"), car.drive],
              [L("اللون", "Colour"), car.color],
              [L("رقم الهيكل", "VIN"), { ar: car.vin, en: car.vin }],
            ].map(([label, value]) => (
              <div key={(label as Copy).en} className="bg-paper p-4">
                <dt className="text-xs text-muted">{tx(label as Copy)}</dt>
                <dd className="mt-1 text-sm">{tx(value as Copy)}</dd>
              </div>
            ))}
          </dl>
          <ul className="mt-6 flex flex-wrap gap-2">
            {car.highlights.map((item) => (
              <li key={item.en} className="border border-line px-3 py-1 text-xs">{tx(item)}</li>
            ))}
          </ul>
        </div>
        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <div className="border border-line bg-paper p-5">
            <p className="font-display text-4xl">{money(car.priceOmr)}</p>
            <p className="mt-2 text-sm text-brass">{tx(positionCopy[position])}</p>
            <p className="mt-1 text-xs text-muted">{tx(L("متوسط السوق", "Market average"))} {money(car.marketOmr)}</p>
            <div className="mt-5 grid grid-cols-2 gap-2 text-sm">
              <Ghost href={`/finance?car=${car.slug}`}>{tx(L("اطلب تمويلاً", "Ask for finance"))}</Ghost>
              <Ghost href={`/insurance?car=${car.slug}`}>{tx(L("اطلب تأميناً", "Ask for cover"))}</Ghost>
              <Ghost href={`/inspection?car=${car.slug}`}>{tx(L("فحص بالنيابة", "Inspect for me"))}</Ghost>
              <Ghost href={`/valuation?car=${car.slug}`}>{tx(L("تثمين", "Valuation"))}</Ghost>
            </div>
            <button type="button" onClick={() => toggleCompare(car.slug)} className="mt-3 text-xs text-muted">
              {compare.includes(car.slug) ? tx(L("مضافة إلى المقارنة", "Added to compare")) : tx(L("أضف إلى المقارنة", "Add to compare"))}
            </button>
          </div>
          {seller && (
            <div className="border border-line p-5">
              <p className="text-xs text-muted">{seller.kind === "dealer" ? tx(L("معرض موثّق", "Verified house")) : tx(L("بائع", "Seller"))}</p>
              <p className="mt-1 text-lg">{seller.verified ? seller.name : seller.name}</p>
              <p className="mt-1 text-xs text-muted">{tx(seller.city)} · {tx(L("منذ", "Since"))} {seller.since}</p>
              <p className="mt-3 text-sm leading-relaxed text-muted">{tx(seller.about)}</p>
              {seller.kind === "dealer" && (
                <Link href={`/dealers/${seller.slug}`} className="mt-3 inline-block text-sm text-brass">{tx(L("إعلانات المعرض", "House listings"))}</Link>
              )}
            </div>
          )}
          <div className="border border-line p-5">
            {sent ? <Receipt refCode={sent} title={tx(L("وصلت رسالتك إلى البائع.", "Your note reached the seller."))} detail={tx(L("يظهر الرد في صفحة الطلبات. لا حاجة لنشر رقمك في الإعلان.", "The reply appears on the requests page. Your number does not need to sit on the listing."))} /> : (
              <>
                <Field label={tx(L("رسالة إلى البائع", "Note to the seller"))}>
                  <textarea value={note} onChange={(event) => setNote(event.target.value)} className={fieldClass} rows={4} placeholder={tx(L("أريد معاينتها مساء الخميس.", "I can see it Thursday evening."))} />
                </Field>
                <div className="mt-3">
                  <Primary onClick={inquire}>{tx(L("أرسل الرسالة", "Send the note"))}</Primary>
                </div>
              </>
            )}
          </div>
        </aside>
      </div>
      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="font-display text-3xl">{tx(L("قريبة منها", "Near this car"))}</h2>
          <div className="mt-6 grid gap-8 sm:grid-cols-3">
            {related.map((item) => <CarCard key={item.slug} car={item} />)}
          </div>
        </section>
      )}
      <div className="mt-10"><DemoNote /></div>
    </div>
  );
}
