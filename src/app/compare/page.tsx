"use client";

import Link from "next/link";
import { PageHeader, Photo } from "@/components/ui";
import { carBySlug } from "@/lib/data";
import { marketPosition } from "@/lib/quotes";
import { usePrefs } from "@/lib/prefs";
import { useStore } from "@/lib/store";
import type { Copy } from "@/lib/types";

const L = (ar: string, en: string): Copy => ({ ar, en });

export default function Page() {
  const { tx, money, number } = usePrefs();
  const { compare, toggleCompare } = useStore();
  const selected = compare.map((slug) => carBySlug(slug)).filter((car) => car !== undefined);

  return (
    <div>
      <PageHeader kicker={L("المقارنة", "Compare")} title={L("ثلاث سيارات، صف واحد.", "Three cars, one row.")} lead={L("أضف من بطاقة السيارة. المقارنة تحفظ في هذا المتصفح.", "Add from a car card. The comparison stays in this browser.")} />
      <div className="page-wrap py-10">
        {selected.length === 0 ? (
          <div className="surface-card px-6 py-16 text-center">
            <p className="text-lg font-semibold text-night">{tx(L("لم تضف سيارات بعد.", "No cars added yet."))}</p>
            <p className="mt-2 text-sm text-muted">{tx(L("من بطاقة أي إعلان اضغط «قارن».", "On any listing card, tap Compare."))}</p>
            <Link href="/cars" className="btn-primary mt-6 inline-flex">{tx(L("اختر من السوق", "Choose from the market"))}</Link>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-[1rem] border border-line bg-paper shadow-[var(--shadow-card)]">
            <table className="w-full min-w-[720px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-line bg-soft/50 text-start">
                  <th className="px-4 py-4 font-normal text-muted">{tx(L("البند", "Item"))}</th>
                  {selected.map((car) => (
                    <th key={car.slug} className="px-4 py-4 text-start">
                      <Photo src={car.images[0]} alt={tx(car.title)} className="mb-3 aspect-[16/10] w-full max-w-[220px] rounded-xl" />
                      <p className="text-base font-semibold text-night">{tx(car.title)}</p>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  [L("السعر", "Price"), (car: NonNullable<(typeof selected)[number]>) => money(car.priceOmr)],
                  [L("السوق", "Market"), (car: NonNullable<(typeof selected)[number]>) => tx({ below: L("أدنى", "Below"), fair: L("متوسط", "Fair"), above: L("أعلى", "Above") }[marketPosition(car.priceOmr, car.marketOmr)])],
                  [L("السنة", "Year"), (car: NonNullable<(typeof selected)[number]>) => String(car.year)],
                  [L("المسافة", "Mileage"), (car: NonNullable<(typeof selected)[number]>) => number(car.mileage)],
                  [L("المدينة", "City"), (car: NonNullable<(typeof selected)[number]>) => tx(car.city)],
                  [L("الوقود", "Fuel"), (car: NonNullable<(typeof selected)[number]>) => tx(car.fuel)],
                  [L("ناقل الحركة", "Gearbox"), (car: NonNullable<(typeof selected)[number]>) => tx(car.gearbox)],
                ].map(([label, render]) => (
                  <tr key={(label as Copy).en} className="border-b border-line">
                    <td className="px-4 py-3 text-muted">{tx(label as Copy)}</td>
                    {selected.map((car) => (
                      <td key={car.slug} className="px-4 py-3 font-medium text-night">
                        {(render as (car: typeof selected[number]) => string)(car)}
                      </td>
                    ))}
                  </tr>
                ))}
                <tr>
                  <td className="px-4 py-4" />
                  {selected.map((car) => (
                    <td key={car.slug} className="px-4 py-4">
                      <div className="flex flex-wrap gap-3">
                        <Link href={`/cars/${car.slug}`} className="text-sm font-medium text-navy hover:text-brass">{tx(L("التفاصيل", "Details"))}</Link>
                        <button type="button" className="text-sm text-muted hover:text-night" onClick={() => toggleCompare(car.slug)}>{tx(L("أزل", "Remove"))}</button>
                      </div>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
