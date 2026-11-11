"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CarCard } from "@/components/car-card";
import { PageHeader, fieldClass } from "@/components/ui";
import { cars, makes, markets } from "@/lib/data";
import { usePrefs } from "@/lib/prefs";
import type { Copy } from "@/lib/types";

const L = (ar: string, en: string): Copy => ({ ar, en });

export function CarsBrowser() {
  const params = useSearchParams();
  const { tx, locale } = usePrefs();
  const [make, setMake] = useState(params.get("make") ?? "");
  const [condition, setCondition] = useState(params.get("condition") ?? "");
  const [country, setCountry] = useState(params.get("country") ?? "");
  const [budget, setBudget] = useState(params.get("budget") ?? "");
  const [query, setQuery] = useState(params.get("q") ?? "");

  const list = useMemo(() => {
    return cars.filter((car) => {
      if (make && car.make !== make) return false;
      if (condition && car.condition !== condition) return false;
      if (country && car.country !== country) return false;
      if (budget && car.priceOmr > Number(budget)) return false;
      if (query) {
        const haystack = `${car.make} ${car.model} ${car.title.ar} ${car.title.en}`.toLowerCase();
        if (!haystack.includes(query.toLowerCase())) return false;
      }
      return true;
    });
  }, [make, condition, country, budget, query]);

  return (
    <div>
      <PageHeader
        kicker={L("السوق", "The market")}
        title={L("سيارات بمعيار واحد.", "Cars on one standard.")}
        lead={L("الجاهز والجديد والحادث المعلن في المكان نفسه، والسعر مقيس على متوسط السوق.", "Ready, new, and declared-damage cars in one place, with price measured against the market average.")}
      />
      <div className="mx-auto grid max-w-6xl gap-8 px-5 py-10 lg:grid-cols-[240px_1fr]">
        <aside className="space-y-4">
          <label className="block text-xs text-muted">
            {tx(L("بحث", "Search"))}
            <input value={query} onChange={(event) => setQuery(event.target.value)} className={`${fieldClass} mt-2`} placeholder={tx(L("لكزس، باترول، 911", "Lexus, Patrol, 911"))} />
          </label>
          <label className="block text-xs text-muted">
            {tx(L("الشركة", "Make"))}
            <select value={make} onChange={(event) => setMake(event.target.value)} className={`${fieldClass} mt-2`}>
              <option value="">{tx(L("الكل", "All"))}</option>
              {makes.map((item) => <option key={item}>{item}</option>)}
            </select>
          </label>
          <label className="block text-xs text-muted">
            {tx(L("الحالة", "Condition"))}
            <select value={condition} onChange={(event) => setCondition(event.target.value)} className={`${fieldClass} mt-2`}>
              <option value="">{tx(L("الكل", "All"))}</option>
              <option value="ready">{tx(L("جاهزة", "Ready"))}</option>
              <option value="new">{tx(L("جديدة", "New"))}</option>
              <option value="accident">{tx(L("حادث معلن", "Declared damage"))}</option>
            </select>
          </label>
          <label className="block text-xs text-muted">
            {tx(L("السوق", "Market"))}
            <select value={country} onChange={(event) => setCountry(event.target.value)} className={`${fieldClass} mt-2`}>
              <option value="">{tx(L("كل الأسواق", "All markets"))}</option>
              {markets.filter((market) => market.id !== "world").map((market) => (
                <option key={market.id} value={market.id}>{tx(market.name)}</option>
              ))}
            </select>
          </label>
          <label className="block text-xs text-muted">
            {tx(L("السقف بالريال العُماني", "Ceiling in Omani rial"))}
            <select value={budget} onChange={(event) => setBudget(event.target.value)} className={`${fieldClass} mt-2`}>
              <option value="">{tx(L("بدون سقف", "No ceiling"))}</option>
              <option value="5000">5,000</option>
              <option value="12000">12,000</option>
              <option value="20000">20,000</option>
              <option value="40000">40,000</option>
            </select>
          </label>
        </aside>
        <div>
          <p className="mb-6 text-sm text-muted">
            {locale === "ar" ? `${list.length} إعلان` : `${list.length} listings`}
          </p>
          {list.length === 0 ? (
            <p className="text-muted">{tx(L("لا توجد سيارة ضمن هذا الاختيار.", "Nothing matches this selection."))}</p>
          ) : (
            <div className="grid gap-8 sm:grid-cols-2">
              {list.map((car) => <CarCard key={car.slug} car={car} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
