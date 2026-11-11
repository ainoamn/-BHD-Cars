"use client";

import Link from "next/link";
import { marketPosition } from "@/lib/quotes";
import { sellerBySlug } from "@/lib/data";
import { usePrefs } from "@/lib/prefs";
import { useStore } from "@/lib/store";
import type { Car, Copy } from "@/lib/types";
import { Photo } from "./ui";

const L = (ar: string, en: string): Copy => ({ ar, en });

const positionCopy = {
  below: L("أقل من السوق", "Below market"),
  fair: L("سعر عادل", "Fair price"),
  above: L("أعلى من السوق", "Above market"),
};

const conditionCopy = {
  accident: L("حادث معلن", "Declared damage"),
  new: L("جديدة", "New"),
  ready: L("جاهزة", "Ready"),
};

export function CarCard({ car, dense = false }: { car: Car; dense?: boolean }) {
  const { tx, money, number } = usePrefs();
  const { compare, toggleCompare } = useStore();
  const seller = sellerBySlug(car.seller);
  const position = marketPosition(car.priceOmr, car.marketOmr);
  const selected = compare.includes(car.slug);

  return (
    <article className={`group surface-card surface-card-hover flex flex-col overflow-hidden ${dense ? "" : ""}`}>
      <Link href={`/cars/${car.slug}`} className="relative block aspect-[16/11] overflow-hidden bg-soft">
        <Photo src={car.images[0]} alt={tx(car.title)} className="h-full w-full transition duration-700 group-hover:scale-[1.03]" />
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-night/45 to-transparent" />
        <span className="absolute start-3 top-3 rounded-full bg-paper/95 px-2.5 py-1 text-[11px] font-medium text-night shadow-sm">
          {tx(conditionCopy[car.condition])}
        </span>
        {seller?.verified && (
          <span className="absolute end-3 top-3 rounded-full bg-brass px-2.5 py-1 text-[11px] font-medium text-white">
            {tx(L("موثّق", "Verified"))}
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xl font-bold tracking-tight text-night">{money(car.priceOmr)}</p>
            <p className="mt-1 text-xs font-medium text-brass">{tx(positionCopy[position])}</p>
          </div>
          <button
            type="button"
            onClick={() => toggleCompare(car.slug)}
            className={`rounded-full border px-3 py-1.5 text-[11px] ${selected ? "border-night bg-night text-ivory" : "border-line text-muted hover:border-brass hover:text-night"}`}
          >
            {selected ? tx(L("مقارنة", "Compared")) : tx(L("قارن", "Compare"))}
          </button>
        </div>

        <h3 className="mt-3 text-lg font-semibold leading-snug text-night">
          <Link href={`/cars/${car.slug}`}>{tx(car.title)}</Link>
        </h3>

        <p className="mt-2 text-sm text-muted">
          {car.year}
          <span className="mx-1.5 text-line">·</span>
          {number(car.mileage)} {tx(L("كم", "km"))}
          <span className="mx-1.5 text-line">·</span>
          {tx(car.city)}
        </p>

        <div className="mt-3 flex flex-wrap gap-2">
          <span className="chip">{tx(car.gearbox)}</span>
          <span className="chip">{tx(car.fuel)}</span>
          <span className="chip">{tx(car.body)}</span>
        </div>

        <div className="mt-4 flex items-center justify-between gap-3 border-t border-line pt-3 text-xs text-muted">
          <span className="truncate">{seller?.name}</span>
          <Link href={`/cars/${car.slug}`} className="font-medium text-navy hover:text-brass">
            {tx(L("التفاصيل", "Details"))}
          </Link>
        </div>
      </div>
    </article>
  );
}
