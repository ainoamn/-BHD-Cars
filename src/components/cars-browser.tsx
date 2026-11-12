"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { BrandLogo } from "@/components/brand-logo";
import { CarCard } from "@/components/car-card";
import { ModelThumb } from "@/components/model-thumb";
import { PageHeader } from "@/components/ui";
import { cars } from "@/lib/data";
import { makeIdFromLabel, makeLabelFromId, popularMakeIds } from "@/lib/make-map";
import { allMakes } from "@/lib/makes-full";
import { usePrefs } from "@/lib/prefs";
import { bodyTypes, years } from "@/lib/sell-catalog";
import type { Copy } from "@/lib/types";

const L = (ar: string, en: string): Copy => ({ ar, en });

const FUELS = [
  { id: "", label: L("الكل", "All") },
  { id: "petrol", label: L("بنزين", "Petrol"), match: ["بنزين", "petrol", "بترول"] },
  { id: "diesel", label: L("ديزل", "Diesel"), match: ["ديزل", "diesel"] },
  { id: "hybrid", label: L("هايبرد", "Hybrid"), match: ["هايبرد", "hybrid"] },
  { id: "ev", label: L("كهرباء", "Electric"), match: ["كهرباء", "electric", "ev"] },
] as const;

function FilterSection({
  title,
  open,
  onToggle,
  children,
}: {
  title: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="border-b border-line/80 pb-3 last:border-b-0">
      <button type="button" onClick={onToggle} className="flex w-full items-center justify-between gap-2 py-2 text-start">
        <span className="text-sm font-semibold text-night">{title}</span>
        <span className="text-muted">{open ? "▴" : "▾"}</span>
      </button>
      {open && <div className="pt-1">{children}</div>}
    </div>
  );
}

function parseList(value: string | null) {
  return [...new Set((value ?? "").split(",").map((item) => item.trim()).filter(Boolean))];
}

export function CarsBrowser() {
  const params = useSearchParams();
  const { tx, locale } = usePrefs();

  const initialMakeLabel = params.get("make") ?? "";
  const initialMakeFromLabel = initialMakeLabel ? makeIdFromLabel(initialMakeLabel) : null;
  const initialMakes = [
    ...parseList(params.get("makes") ?? params.get("makeId")),
    ...(initialMakeFromLabel ? [initialMakeFromLabel] : []),
  ];
  const initialModels = parseList(params.get("models") ?? params.get("model"));

  const [makeIds, setMakeIds] = useState<string[]>([...new Set(initialMakes)]);
  const [modelIds, setModelIds] = useState<string[]>([...new Set(initialModels)]);
  const [yearFrom, setYearFrom] = useState(params.get("yearFrom") ?? "");
  const [yearTo, setYearTo] = useState(params.get("yearTo") ?? "");
  const [body, setBody] = useState(params.get("body") ?? "");
  const [fuel, setFuel] = useState(params.get("fuel") ?? "");
  const [condition, setCondition] = useState(params.get("condition") ?? "");
  const [query, setQuery] = useState(params.get("q") ?? "");
  const [sort, setSort] = useState("newest");
  const [showAllMakes, setShowAllMakes] = useState(false);
  const [modelsExpanded, setModelsExpanded] = useState<Record<string, boolean>>({});
  const [modelsShowAll, setModelsShowAll] = useState<Record<string, boolean>>({});
  const [open, setOpen] = useState({
    make: true,
    model: true,
    year: true,
    body: true,
    fuel: true,
  });

  const selectedMakes = useMemo(
    () =>
      makeIds
        .map((id) => allMakes.find((item) => item.id === id))
        .filter(Boolean) as typeof allMakes,
    [makeIds],
  );

  const brandOptions = useMemo(() => {
    const popular = popularMakeIds
      .map((id) => allMakes.find((item) => item.id === id))
      .filter(Boolean) as typeof allMakes;
    if (showAllMakes) {
      const rest = allMakes.filter((item) => !popularMakeIds.includes(item.id as (typeof popularMakeIds)[number]));
      return [...popular, ...rest];
    }
    return popular;
  }, [showAllMakes]);

  const modelGroups = useMemo(
    () =>
      selectedMakes.map((make) => ({
        make,
        models: make.models.map((model) => ({
          ...model,
          makeId: make.id,
        })),
      })),
    [selectedMakes],
  );

  const modelOptions = useMemo(() => modelGroups.flatMap((group) => group.models), [modelGroups]);

  const list = useMemo(() => {
    const filtered = cars.filter((car) => {
      if (makeIds.length > 0) {
        const carMakeId = makeIdFromLabel(car.make);
        const matchesMake = makeIds.some((id) => {
          if (carMakeId && carMakeId === id) return true;
          const label = makeLabelFromId(id).toLowerCase();
          return car.make.toLowerCase() === label || car.make.toLowerCase().includes(label);
        });
        if (!matchesMake) return false;
      }
      if (modelIds.length > 0) {
        const modelHay = `${car.model} ${car.title.en} ${car.title.ar}`.toLowerCase();
        const matchesModel = modelOptions
          .filter((item) => modelIds.includes(item.id) || modelIds.includes(`${item.makeId}:${item.id}`))
          .some((model) => modelHay.includes(model.name.en.toLowerCase()) || modelHay.includes(model.name.ar));
        if (!matchesModel) return false;
      }
      if (yearFrom && car.year < Number(yearFrom)) return false;
      if (yearTo && car.year > Number(yearTo)) return false;
      if (body) {
        const bodyMeta = bodyTypes.find((item) => item.id === body);
        if (bodyMeta) {
          const hay = `${car.body.ar} ${car.body.en}`.toLowerCase();
          if (!hay.includes(bodyMeta.name.en.toLowerCase()) && !hay.includes(bodyMeta.name.ar)) return false;
        }
      }
      if (fuel) {
        const fuelMeta = FUELS.find((item) => item.id === fuel);
        if (fuelMeta && "match" in fuelMeta) {
          const hay = `${car.fuel.ar} ${car.fuel.en}`.toLowerCase();
          if (!fuelMeta.match.some((token) => hay.includes(token.toLowerCase()))) return false;
        }
      }
      if (condition && car.condition !== condition) return false;
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
  }, [makeIds, modelIds, modelOptions, yearFrom, yearTo, body, fuel, condition, query, sort]);

  function clearFilters() {
    setMakeIds([]);
    setModelIds([]);
    setYearFrom("");
    setYearTo("");
    setBody("");
    setFuel("");
    setCondition("");
    setQuery("");
    setModelsExpanded({});
    setModelsShowAll({});
  }

  function pickMake(id: string) {
    const already = makeIds.includes(id);
    if (already) {
      const bareIds = new Set((allMakes.find((item) => item.id === id)?.models ?? []).map((model) => model.id));
      setMakeIds((current) => current.filter((item) => item !== id));
      setModelIds((models) => models.filter((key) => !key.startsWith(`${id}:`) && !bareIds.has(key)));
      setModelsExpanded((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
      setModelsShowAll((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
    } else {
      setMakeIds((current) => [...current, id]);
      setModelsExpanded((prev) => ({ ...prev, [id]: true }));
      setOpen((prev) => ({ ...prev, model: true, year: true }));
    }
  }

  function pickModel(makeId: string, id: string) {
    const key = `${makeId}:${id}`;
    setModelIds((current) => {
      if (current.includes(key)) return current.filter((item) => item !== key);
      // drop legacy bare ids for this model when toggling on
      return [...current.filter((item) => item !== id), key];
    });
  }

  function isMakeModelsOpen(makeId: string) {
    return modelsExpanded[makeId] !== false;
  }

  return (
    <div>
      <PageHeader
        kicker={L("السوق", "The market")}
        title={L("سيارات جاهزة، واضحة، وقابلة للمقارنة.", "Ready cars, clear and comparable.")}
        lead={L(
          "اختر شركة أو أكثر، ثم الموديلات لكل شركة، ثم السنة والهيكل والوقود.",
          "Pick one or more makes, then models per make, then year, body, and fuel.",
        )}
        actions={<a href="/sell" className="btn-primary">{tx(L("أضف إعلانك", "Add your listing"))}</a>}
      />

      <div className="market-shell">
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

        <div className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)] lg:grid-cols-[280px_minmax(0,1fr)]">
          <aside className="surface-card h-fit space-y-1 p-4 lg:sticky lg:top-28">
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-night">{tx(L("تصفية النتائج", "Filter results"))}</h2>
              <button type="button" onClick={clearFilters} className="text-xs text-brass hover:underline">
                {tx(L("مسح", "Clear"))}
              </button>
            </div>

            <label className="mb-3 block text-xs text-muted">
              {tx(L("بحث", "Search"))}
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="field mt-2"
                placeholder={tx(L("لكزس، باترول، VIN", "Lexus, Patrol, VIN"))}
              />
            </label>

            <FilterSection
              title={tx(L("التصنيع", "Make"))}
              open={open.make}
              onToggle={() => setOpen((prev) => ({ ...prev, make: !prev.make }))}
            >
              <p className="mb-2 text-[11px] text-muted">{tx(L("يمكنك اختيار أكثر من شركة.", "You can select more than one make."))}</p>
              <div className="grid grid-cols-4 gap-2">
                {brandOptions.map((item) => {
                  const active = makeIds.includes(item.id);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => pickMake(item.id)}
                      className={`relative flex flex-col items-center rounded-xl border bg-white p-1.5 transition ${
                        active ? "border-brass ring-2 ring-brass/30" : "border-line hover:border-brass/40"
                      }`}
                      title={tx(item.name)}
                    >
                      {active && <span className="absolute end-1 top-1 rounded-full bg-navy px-1 text-[9px] text-ivory">✓</span>}
                      <BrandLogo id={item.id} mark={item.mark} name={tx(item.name)} className="h-10 w-10" />
                      <span className="mt-1 line-clamp-1 w-full text-center text-[10px] text-muted">
                        {locale === "ar" ? item.name.ar : item.name.en}
                      </span>
                    </button>
                  );
                })}
              </div>
              <button
                type="button"
                onClick={() => setShowAllMakes((value) => !value)}
                className="mt-2 w-full rounded-xl border border-line bg-soft/60 py-2 text-xs font-medium text-night hover:bg-soft"
              >
                {showAllMakes ? tx(L("عرض أقل", "Show less")) : tx(L("عرض المزيد", "Show more"))}
              </button>
            </FilterSection>

            <FilterSection
              title={tx(L("الموديل الفرعي", "Sub-model"))}
              open={open.model}
              onToggle={() => setOpen((prev) => ({ ...prev, model: !prev.model }))}
            >
              {selectedMakes.length === 0 ? (
                <p className="rounded-xl bg-soft/50 px-3 py-4 text-center text-xs text-muted">
                  {tx(L("اختر شركة واحدة أو أكثر أولاً.", "Pick one or more makes first."))}
                </p>
              ) : (
                <div className="space-y-2">
                  <p className="text-[11px] text-muted">
                    {tx(L("موديلات كل شركة منفصلة — يمكنك طي أو توسيع أي قسم.", "Models are grouped by make — expand or collapse each section."))}
                  </p>
                  {modelGroups.map(({ make, models }) => {
                    const groupOpen = isMakeModelsOpen(make.id);
                    const showAll = Boolean(modelsShowAll[make.id]);
                    const visible = showAll ? models : models.slice(0, 9);
                    const selectedCount = models.filter((item) => modelIds.includes(`${make.id}:${item.id}`)).length;
                    return (
                      <div key={make.id} className="overflow-hidden rounded-xl border border-line bg-white">
                        <button
                          type="button"
                          onClick={() =>
                            setModelsExpanded((prev) => ({
                              ...prev,
                              [make.id]: !(prev[make.id] !== false),
                            }))
                          }
                          className="flex w-full items-center justify-between gap-2 bg-soft/40 px-2.5 py-2 text-start transition hover:bg-soft/70"
                        >
                          <span className="inline-flex min-w-0 items-center gap-2">
                            <BrandLogo id={make.id} mark={make.mark} name={tx(make.name)} className="h-7 w-7 shrink-0" />
                            <span className="truncate text-xs font-semibold text-night">{tx(make.name)}</span>
                            <span className="shrink-0 rounded-full bg-paper px-1.5 py-0.5 text-[10px] text-muted">
                              {selectedCount > 0
                                ? locale === "ar"
                                  ? `${selectedCount} مختار`
                                  : `${selectedCount} selected`
                                : locale === "ar"
                                  ? `${models.length} موديل`
                                  : `${models.length} models`}
                            </span>
                          </span>
                          <span className="text-muted">{groupOpen ? "▴" : "▾"}</span>
                        </button>
                        {groupOpen && (
                          <div className="border-t border-line/70 p-2">
                            <div className="grid grid-cols-3 gap-2">
                              {visible.map((item) => {
                                const key = `${item.makeId}:${item.id}`;
                                const active = modelIds.includes(key);
                                return (
                                  <button
                                    key={key}
                                    type="button"
                                    onClick={() => pickModel(item.makeId, item.id)}
                                    className={`relative overflow-hidden rounded-xl border bg-white text-center transition ${
                                      active ? "border-brass ring-2 ring-brass/30" : "border-line hover:border-brass/40"
                                    }`}
                                  >
                                    {active && (
                                      <span className="absolute end-1 top-1 z-10 rounded-full bg-navy px-1 text-[9px] text-ivory">✓</span>
                                    )}
                                    <ModelThumb
                                      src={item.image}
                                      alt={`${item.name.ar} / ${item.name.en}`}
                                      body={item.body}
                                      makeId={item.makeId}
                                      modelId={item.id}
                                      className="aspect-[5/4] w-full object-contain p-1"
                                    />
                                    <span className="block truncate border-t border-line/70 px-1 py-1.5 text-[10px] font-medium text-muted">
                                      {locale === "ar" ? item.name.ar : item.name.en}
                                    </span>
                                  </button>
                                );
                              })}
                            </div>
                            {models.length > 9 && (
                              <button
                                type="button"
                                onClick={() => setModelsShowAll((prev) => ({ ...prev, [make.id]: !prev[make.id] }))}
                                className="mt-2 w-full rounded-xl border border-line bg-soft/60 py-2 text-xs font-medium text-night hover:bg-soft"
                              >
                                {showAll ? tx(L("عرض أقل", "Show less")) : tx(L("عرض المزيد", "Show more"))}
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </FilterSection>

            <FilterSection
              title={tx(L("سنة الصنع", "Year"))}
              open={open.year}
              onToggle={() => setOpen((prev) => ({ ...prev, year: !prev.year }))}
            >
              <div className="grid grid-cols-2 gap-2">
                <label className="text-xs text-muted">
                  {tx(L("من", "From"))}
                  <select value={yearFrom} onChange={(event) => setYearFrom(event.target.value)} className="field mt-1">
                    <option value="">{tx(L("الكل", "All"))}</option>
                    {years.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="text-xs text-muted">
                  {tx(L("إلى", "To"))}
                  <select value={yearTo} onChange={(event) => setYearTo(event.target.value)} className="field mt-1">
                    <option value="">{tx(L("الكل", "All"))}</option>
                    {years.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            </FilterSection>

            <FilterSection
              title={tx(L("نوع الهيكل", "Body type"))}
              open={open.body}
              onToggle={() => setOpen((prev) => ({ ...prev, body: !prev.body }))}
            >
              <div className="grid grid-cols-2 gap-2">
                {bodyTypes.map((item) => {
                  const active = body === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setBody((current) => (current === item.id ? "" : item.id))}
                      className={`overflow-hidden rounded-xl border text-center ${active ? "border-brass ring-1 ring-brass/30" : "border-line"}`}
                    >
                      <img src={item.image} alt={tx(item.name)} className="aspect-[4/3] w-full object-cover" />
                      <span className="block px-1 py-1.5 text-[11px] font-medium">{tx(item.name)}</span>
                    </button>
                  );
                })}
              </div>
            </FilterSection>

            <FilterSection
              title={tx(L("نوع الوقود", "Fuel type"))}
              open={open.fuel}
              onToggle={() => setOpen((prev) => ({ ...prev, fuel: !prev.fuel }))}
            >
              <div className="flex flex-wrap gap-2">
                {FUELS.map((item) => (
                  <button
                    key={item.id || "all-fuel"}
                    type="button"
                    onClick={() => setFuel(item.id)}
                    className={fuel === item.id ? "chip chip-active" : "chip"}
                  >
                    {tx(item.label)}
                  </button>
                ))}
              </div>
            </FilterSection>
          </aside>

          <div>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-line bg-paper px-4 py-3">
              <div className="flex min-w-0 flex-wrap items-center gap-2">
                {selectedMakes.map((make) => (
                  <span key={make.id} className="inline-flex items-center gap-1.5 rounded-full border border-line bg-soft px-2 py-1 text-xs">
                    <BrandLogo id={make.id} mark={make.mark} name={tx(make.name)} className="h-5 w-5" />
                    {tx(make.name)}
                  </span>
                ))}
                {modelIds.length > 0 && (
                  <span className="rounded-full border border-line bg-soft px-2 py-1 text-xs text-muted">
                    {locale === "ar" ? `${modelIds.length} موديل` : `${modelIds.length} models`}
                  </span>
                )}
                <p className="text-sm text-muted">{locale === "ar" ? `${list.length} إعلان` : `${list.length} listings`}</p>
              </div>
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
              <div className="cars-grid">
                {list.map((car) => (
                  <CarCard key={car.slug} car={car} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
