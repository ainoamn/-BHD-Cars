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
  const [sort, setSort] = useState("newest");

  const list = useMemo(() => {
    const filtered = cars.filter((car) => {
      if (make && car.make !== make) return false;
      if (condition && car.condition !== condition) return false;
      if (country && car.country !== country) return false;
      if (budget && car.priceOmr > Number(budget)) return false;
      if (query) {
        const haystack = `${car.make} ${car.model} ${car.title.ar} ${car.title.en} ${car.vin}`.toLowerCase();
        if (!haystack.includes(query.toLowerCase())) return false;
      }
      return true;
    });

    return [...filtered].sort((a, b) => {
      if (sort === "price-asc") return a.priceOmr - b.priceOmr;
      if (sort === "price-desc") return b.priceOmr - a.priceOmr;
      if (sort === "mileage") return a.mileage - b.mileage;
      return b.year - a.year;
    });
  }, [make, condition, country, budget, query, sort]);

  function clearFilters() {
    setMake("");
    setCondition("");
    setCountry("");
    setBudget("");
    setQuery("");
  }

  return (
    <div>
      <PageHeader
        kicker={L("السوق", "The market")}
        title={L("سيارات جاهزة، واضحة، وقابلة للمقارنة.", "Ready cars, clear and comparable.")}
        lead={L("فلتر بالشركة والحالة والسعر والموقع. كل بطاقة تعرض السعر والمواصفات وموقعها من متوسط السوق.", "Filter by make, condition, price, and location. Every card shows price, specs, and where it sits against the market.")}
        actions={
          <a href="/sell" className="btn-primary">{tx(L("أضف إعلانك", "Add your listing"))}</a>
        }
      />

      <div className="mx-auto max-w-6xl px-5 py-8">
        <div className="mb-5 flex flex-wrap gap-2">
          {[
            { id: "", label: tx(L("الكل", "All")) },
            { id: "ready", label: tx(L("جاهزة", "Ready")) },
            { id: "new", label: tx(L("جديدة", "New")) },
            { id: "accident", label: tx(L("حادث معلن", "Declared damage")) },
          ].map((item) => (
            <button
              key={item.id || "all"}
              type="button"
              onClick={() => setCondition(item.id)}
              className={condition === item.id ? "chip chip-active" : "chip"}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          <aside className="surface-card h-fit space-y-4 p-4 lg:sticky lg:top-28">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-night">{tx(L("تصفية النتائج", "Filter results"))}</h2>
              <button type="button" onClick={clearFilters} className="text-xs text-brass hover:underline">
                {tx(L("مسح", "Clear"))}
              </button>
            </div>

            <label className="block text-xs text-muted">
              {tx(L("بحث", "Search"))}
              <input value={query} onChange={(event) => setQuery(event.target.value)} className={`${fieldClass} mt-2`} placeholder={tx(L("لكزس، باترول، VIN", "Lexus, Patrol, VIN"))} />
            </label>

            <label className="block text-xs text-muted">
              {tx(L("الشركة", "Make"))}
              <select value={make} onChange={(event) => setMake(event.target.value)} className={`${fieldClass} mt-2`}>
                <option value="">{tx(L("الكل", "All"))}</option>
                {makes.map((item) => <option key={item}>{item}</option>)}
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
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-line bg-paper px-4 py-3">
              <p className="text-sm text-muted">
                {locale === "ar" ? `${list.length} إعلان` : `${list.length} listings`}
              </p>
              <label className="flex items-center gap-2 text-sm text-muted">
                {tx(L("ترتيب", "Sort"))}
                <select value={sort} onChange={(event) => setSort(event.target.value)} className="rounded-xl border border-line bg-ivory px-3 py-2 text-night">
                  <option value="newest">{tx(L("الأحدث سنة", "Newest year"))}</option>
                  <option value="price-asc">{tx(L("السعر: الأقل", "Price: low"))}</option>
                  <option value="price-desc">{tx(L("السعر: الأعلى", "Price: high"))}</option>
                  <option value="mileage">{tx(L("أقل مسافة", "Lowest mileage"))}</option>
                </select>
              </label>
            </div>

            {list.length === 0 ? (
              <div className="surface-card px-6 py-16 text-center">
                <p className="text-lg font-semibold text-night">{tx(L("لا توجد سيارة ضمن هذا الاختيار.", "Nothing matches this selection."))}</p>
                <p className="mt-2 text-sm text-muted">{tx(L("وسّع الفلاتر أو امسحها ثم أعد المحاولة.", "Widen or clear the filters, then try again."))}</p>
                <button type="button" onClick={clearFilters} className="btn-secondary mt-5">
                  {tx(L("مسح الفلاتر", "Clear filters"))}
                </button>
              </div>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {list.map((car) => <CarCard key={car.slug} car={car} />)}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
