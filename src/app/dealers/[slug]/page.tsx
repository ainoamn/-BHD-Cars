"use client";

import { useParams } from "next/navigation";
import { CarCard } from "@/components/car-card";
import { PageHeader } from "@/components/ui";
import { cars, sellers } from "@/lib/data";
import { usePrefs } from "@/lib/prefs";
import type { Copy } from "@/lib/types";

const L = (ar: string, en: string): Copy => ({ ar, en });

export default function Page() {
  const params = useParams<{ slug: string }>();
  const { tx } = usePrefs();
  const house = sellers.find((seller) => seller.slug === params.slug && seller.kind === "dealer");
  if (!house) return <p className="px-5 py-20">{tx(L("هذا المعرض غير موجود.", "This house is not here."))}</p>;
  const list = cars.filter((car) => car.seller === house.slug);
  return (
    <div>
      <PageHeader kicker={L("معرض", "House")} title={{ ar: house.name, en: house.name }} lead={house.about} />
      <div className="page-wrap grid gap-8 py-12 sm:grid-cols-2">
        {list.map((car) => <CarCard key={car.slug} car={car} />)}
      </div>
    </div>
  );
}
