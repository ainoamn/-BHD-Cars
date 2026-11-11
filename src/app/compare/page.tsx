"use client";

import Link from "next/link";
import { PageHeader } from "@/components/ui";
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
      <div className="mx-auto max-w-6xl px-5 py-12">
        {selected.length === 0 ? (
          <Link href="/cars" className="text-sm text-brass">{tx(L("اختر من السوق", "Choose from the market"))}</Link>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-line text-start">
                  <th className="py-3 pe-4 font-normal text-muted">{tx(L("البند", "Item"))}</th>
                  {selected.map((car) => <th key={car.slug} className="py-3 pe-4 text-start font-display text-xl font-normal">{tx(car.title)}</th>)}
                </tr>
              </thead>
              <tbody>
                {[
                  [L("السعر", "Price"), (car: NonNullable<(typeof selected)[number]>) => money(car.priceOmr)],
                  [L("السوق", "Market"), (car: NonNullable<(typeof selected)[number]>) => tx({ below: L("أدنى", "Below"), fair: L("متوسط", "Fair"), above: L("أعلى", "Above") }[marketPosition(car.priceOmr, car.marketOmr)])],
                  [L("السنة", "Year"), (car: NonNullable<(typeof selected)[number]>) => String(car.year)],
                  [L("المسافة", "Mileage"), (car: NonNullable<(typeof selected)[number]>) => number(car.mileage)],
                  [L("المدينة", "City"), (car: NonNullable<(typeof selected)[number]>) => tx(car.city)],
                ].map(([label, render]) => (
                  <tr key={(label as Copy).en} className="border-b border-line">
                    <td className="py-3 pe-4 text-muted">{tx(label as Copy)}</td>
                    {selected.map((car) => <td key={car.slug} className="py-3 pe-4">{(render as (car: typeof selected[number]) => string)(car)}</td>)}
                  </tr>
                ))}
                <tr>
                  <td />
                  {selected.map((car) => (
                    <td key={car.slug} className="py-3">
                      <button type="button" className="text-xs text-muted" onClick={() => toggleCompare(car.slug)}>{tx(L("أزل", "Remove"))}</button>
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
