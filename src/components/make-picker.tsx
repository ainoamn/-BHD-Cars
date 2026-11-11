"use client";

import { useMemo, useRef, useState } from "react";
import { BrandLogo } from "@/components/brand-logo";
import { allMakes, type SellMake } from "@/lib/makes-full";
import { L } from "@/lib/sell-catalog";
import { usePrefs } from "@/lib/prefs";

const CATEGORIES = [
  { id: "all", label: L("الكل", "All") },
  { id: "cars", label: L("سيارات", "Cars") },
  { id: "luxury", label: L("فاخرة", "Luxury") },
  { id: "china", label: L("صينية", "Chinese") },
  { id: "moto", label: L("دراجات", "Motorcycles") },
  { id: "truck", label: L("شاحنات ومعدات", "Trucks & equipment") },
  { id: "other", label: L("أخرى", "Other") },
] as const;

type CategoryId = (typeof CATEGORIES)[number]["id"];

export function MakePicker({
  selectedId,
  onSelect,
  title,
  subtitle,
}: {
  selectedId?: string;
  onSelect: (id: string) => void;
  title?: { ar: string; en: string };
  subtitle?: { ar: string; en: string };
}) {
  const { tx, locale } = usePrefs();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<CategoryId>("all");
  const scrollerRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return allMakes.filter((item) => {
      if (category !== "all" && (item.category ?? "cars") !== category) return false;
      if (!q) return true;
      return (
        item.name.ar.includes(query) ||
        item.name.en.toLowerCase().includes(q) ||
        item.id.includes(q) ||
        item.mark.toLowerCase().includes(q)
      );
    });
  }, [query, category]);

  function scrollByPage(dir: 1 | -1) {
    const el = scrollerRef.current;
    if (!el) return;
    const amount = Math.max(240, el.clientWidth * 0.7) * dir;
    el.scrollBy({ left: amount * (locale === "ar" ? -1 : 1), behavior: "smooth" });
  }

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-night">
            {tx(title ?? L("المُصنّعون الأكثر رواجاً", "Most popular manufacturers"))}
          </h2>
          <p className="mt-1 text-sm text-muted">
            {tx(subtitle ?? L("شعارات رسمية حقيقية — اختر الوكالة ثم صور الفئة.", "Real official logos — pick the make, then category photos."))}
          </p>
        </div>
        <div className="inline-flex rounded-full border border-line bg-soft p-1 text-sm">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-night px-3 py-1.5 font-medium text-ivory">
            <span aria-hidden>◎</span>
            {tx(L("المُصنّع", "Manufacturer"))}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-muted">
            <span aria-hidden>▣</span>
            {tx(L("نوع الهيكل", "Body type"))}
          </span>
        </div>
      </div>

      <input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        className="field"
        placeholder={tx(L("ابحث عن المصنع أو الاسم الإنجليزي", "Search make in Arabic or English"))}
      />

      <div className="flex gap-2 overflow-x-auto pb-1">
        {CATEGORIES.map((item) => {
          const active = category === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setCategory(item.id)}
              className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                active ? "border-night bg-night text-ivory" : "border-line bg-paper text-muted hover:text-night"
              }`}
            >
              {tx(item.label)}
            </button>
          );
        })}
      </div>

      <div
        ref={scrollerRef}
        className="grid max-h-[22rem] auto-cols-[minmax(5.75rem,1fr)] grid-flow-col grid-rows-2 gap-2 overflow-x-auto overscroll-x-contain pb-2 scroll-smooth sm:auto-cols-[6.5rem]"
      >
        {filtered.map((item: SellMake) => {
          const active = selectedId === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelect(item.id)}
              title={tx(item.name)}
              className={`flex w-[5.75rem] shrink-0 flex-col items-center rounded-2xl border bg-white p-2 text-center shadow-sm transition hover:border-brass/40 sm:w-[6.5rem] ${
                active ? "border-[#1d4ed8] ring-2 ring-[#1d4ed8]/30" : "border-line/80"
              }`}
            >
              <BrandLogo id={item.id} mark={item.mark} name={tx(item.name)} className="h-14 w-14 sm:h-16 sm:w-16" />
              <span className="mt-1.5 line-clamp-2 w-full text-[10px] leading-tight text-muted sm:text-[11px]">
                {locale === "ar" ? item.name.ar : item.name.en}
              </span>
            </button>
          );
        })}
      </div>

      {!filtered.length && (
        <p className="rounded-2xl border border-dashed border-line bg-soft/50 px-4 py-8 text-center text-sm text-muted">
          {tx(L("لا نتائج لهذا البحث.", "No makes match this search."))}
        </p>
      )}

      <div className="flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => scrollByPage(-1)}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-line bg-paper text-muted hover:text-night"
          aria-label={tx(L("السابق", "Previous"))}
        >
          ‹
        </button>
        <span className="text-xs text-muted">
          {filtered.length} {tx(L("وكالة", "makes"))}
        </span>
        <button
          type="button"
          onClick={() => scrollByPage(1)}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-line bg-paper text-muted hover:text-night"
          aria-label={tx(L("التالي", "Next"))}
        >
          ›
        </button>
      </div>
    </section>
  );
}
