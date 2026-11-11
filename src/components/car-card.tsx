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
  below: L("أدنى من متوسط السوق", "Below the market"),
  fair: L("ضمن متوسط السوق", "In line with the market"),
  above: L("أعلى من متوسط السوق", "Above the market"),
};

export function CarCard({ car }: { car: Car }) {
  const { tx, money, number } = usePrefs();
  const { compare, toggleCompare } = useStore();
  const seller = sellerBySlug(car.seller);
  const position = marketPosition(car.priceOmr, car.marketOmr);
  const selected = compare.includes(car.slug);

  return (
    <article className="group flex flex-col">
      <Link href={`/cars/${car.slug}`} className="relative block aspect-[4/3] overflow-hidden">
        <Photo src={car.images[0]} alt={tx(car.title)} className="h-full w-full transition duration-700 group-hover:scale-[1.03]" />
        <span className="absolute start-3 top-3 bg-ivory/95 px-2 py-1 text-[11px] text-night">
          {car.condition === "accident" ? tx(L("حادث معلن", "Declared damage")) : car.condition === "new" ? tx(L("جديدة", "New")) : tx(L("جاهزة", "Ready"))}
        </span>
      </Link>
      <div className="flex flex-1 flex-col pt-4">
        <p className="text-xs text-muted">{car.year} · {tx(car.city)} · {number(car.mileage)} {tx(L("كم", "km"))}</p>
        <h3 className="mt-1 font-display text-2xl leading-tight">
          <Link href={`/cars/${car.slug}`}>{tx(car.title)}</Link>
        </h3>
        <p className="mt-2 text-sm">{money(car.priceOmr)}</p>
        <p className="mt-1 text-xs text-brass">{tx(positionCopy[position])}</p>
        <div className="mt-4 flex items-center justify-between gap-3 text-xs text-muted">
          <span>{seller?.name}</span>
          <button type="button" onClick={() => toggleCompare(car.slug)} className={selected ? "text-night" : "hover:text-night"}>
            {selected ? tx(L("في المقارنة", "In compare")) : tx(L("قارن", "Compare"))}
          </button>
        </div>
      </div>
    </article>
  );
}
