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
import { omanRegions, regionForCity } from "@/lib/oman-regions";
import { usePrefs } from "@/lib/prefs";
import { bodyTypes, exteriorColors, interiorColors, years } from "@/lib/sell-catalog";
import type { Copy } from "@/lib/types";

const L = (ar: string, en: string): Copy => ({ ar, en });

const FUELS = [
  { id: "", label: L("الكل", "All") },
  { id: "petrol", label: L("بترول", "Petrol"), match: ["بنزين", "petrol", "بترول"] },
  { id: "hybrid", label: L("هايبرد", "Hybrid"), match: ["هايبرد", "hybrid"] },
  { id: "diesel", label: L("ديزل", "Diesel"), match: ["ديزل", "diesel"] },
  { id: "ev", label: L("كهربائي", "Electric"), match: ["كهرباء", "electric", "ev"] },
] as const;

const GEARS = [
  { id: "", label: L("الكل", "All") },
  { id: "auto", label: L("أوتوماتيك", "Automatic"), match: ["أوتوماتيك", "automatic", "pdk", "cvt"] },
  { id: "manual", label: L("يدوي", "Manual"), match: ["يدوي", "عادي", "manual"] },
] as const;

const DRIVES = [
  { id: "", label: L("الكل", "All") },
  { id: "fwd", label: L("دفع أمامي", "Front-wheel"), match: ["أمامي", "fwd"] },
  { id: "rwd", label: L("دفع خلفي", "Rear-wheel"), match: ["خلفي", "rwd"] },
  { id: "awd", label: L("4x4", "4x4"), match: ["رباعي", "4wd", "awd", "4x4"] },
] as const;

const ORIGINS = [
  { id: "", label: L("الكل", "All") },
  { id: "gcc", label: L("خليجي", "GCC"), match: ["خليجي", "gcc"] },
  {
    id: "import",
    label: L("السيارات المستوردة", "Imported cars"),
    match: ["مستورد", "أمريكي", "أوروبي", "يابان", "كوريا", "us ", "import", "american", "european", "japan", "korea", "auction"],
  },
] as const;

const CYLINDERS = ["", "3", "4", "6", "8", "10", "12"] as const;

function Pill({
  active,
  children,
  onClick,
  round = false,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
  round?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`${round ? "h-10 min-w-10 rounded-full px-3" : "rounded-full px-3.5 py-2"} text-xs font-medium transition ${
        active ? "bg-navy text-ivory" : "border border-line bg-paper text-night hover:border-navy/35"
      }`}
    >
      {children}
    </button>
  );
}

function FilterSection({
  title,
  icon,
  open,
  onToggle,
  children,
}: {
  title: string;
  icon?: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="border-b border-line/80 pb-3 last:border-b-0">
      <button type="button" onClick={onToggle} className="flex w-full items-center justify-between gap-2 py-2.5 text-start">
        <span className="inline-flex items-center gap-2 text-sm font-semibold text-night">
          {icon ? <span aria-hidden className="text-base opacity-70">{icon}</span> : null}
          {title}
        </span>
        <span className="text-muted">{open ? "▴" : "▾"}</span>
      </button>
      {open && <div className="pt-1">{children}</div>}
    </div>
  );
}

function ColorSwatches({
  items,
  value,
  onChange,
}: {
  items: { id: string; name: Copy; hex: string }[];
  value: string;
  onChange: (id: string) => void;
}) {
  const { tx } = usePrefs();
  return (
    <div className="grid grid-cols-5 gap-2">
      {items.map((item) => {
        const active = value === item.id;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onChange(active ? "" : item.id)}
            className="flex flex-col items-center gap-1"
            title={tx(item.name)}
          >
            <span
              className={`h-8 w-8 rounded-full border-2 ${active ? "border-navy ring-2 ring-navy/25" : "border-line"}`}
              style={{ background: item.hex }}
            />
            <span className="line-clamp-1 text-[10px] text-muted">{tx(item.name)}</span>
          </button>
        );
      })}
    </div>
  );
}

function carText(car: (typeof cars)[number]) {
  return [
    car.title.ar,
    car.title.en,
    car.make,
    car.model,
    car.fuel.ar,
    car.fuel.en,
    car.gearbox.ar,
    car.gearbox.en,
    car.body.ar,
    car.body.en,
    car.drive.ar,
    car.drive.en,
    car.color.ar,
    car.color.en,
    car.city.ar,
    car.city.en,
    car.vin,
    ...car.highlights.map((item) => `${item.ar} ${item.en}`),
    car.description.ar,
    car.description.en,
  ]
    .join(" ")
    .toLowerCase();
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
  const [trimIds, setTrimIds] = useState<string[]>([]);
  const [trimQuery, setTrimQuery] = useState("");
  const [yearFrom, setYearFrom] = useState(params.get("yearFrom") ?? "");
  const [yearTo, setYearTo] = useState(params.get("yearTo") ?? "");
  const [body, setBody] = useState(params.get("body") ?? "");
  const [fuel, setFuel] = useState(params.get("fuel") ?? "");
  const [gear, setGear] = useState(params.get("gear") ?? "");
  const [drive, setDrive] = useState(params.get("drive") ?? "");
  const [origin, setOrigin] = useState(params.get("origin") ?? "");
  const [cylinders, setCylinders] = useState(params.get("cylinders") ?? "");
  const [priceMin, setPriceMin] = useState(params.get("priceMin") ?? "");
  const [priceMax, setPriceMax] = useState(params.get("priceMax") ?? "");
  const [exterior, setExterior] = useState(params.get("exterior") ?? "");
  const [interior, setInterior] = useState(params.get("interior") ?? "");
  const [regionId, setRegionId] = useState(params.get("region") ?? "");
  const [cityKey, setCityKey] = useState(params.get("city") ?? "");
  const [regionQuery, setRegionQuery] = useState("");
  const [condition, setCondition] = useState(params.get("condition") ?? "");
  const [query, setQuery] = useState(params.get("q") ?? "");
  const [sort, setSort] = useState("newest");
  const [showAllMakes, setShowAllMakes] = useState(false);
  const [modelsExpanded, setModelsExpanded] = useState<Record<string, boolean>>({});
  const [modelsShowAll, setModelsShowAll] = useState<Record<string, boolean>>({});
  const [open, setOpen] = useState({
    make: true,
    model: true,
    trim: true,
    year: true,
    body: false,
    origin: true,
    gear: true,
    drive: true,
    fuel: true,
    cylinders: true,
    price: true,
    exterior: true,
    interior: true,
    region: true,
    city: true,
  });

  const selectedMakes = useMemo(
    () =>
      makeIds
        .map((id) => allMakes.find((item) => item.id === id))
        .filter(Boolean) as typeof allMakes,
    [makeIds],
  );

  const selectedRegion = omanRegions.find((item) => item.id === regionId);

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

  const trimGroups = useMemo(() => {
    const selected = modelOptions.filter((item) => modelIds.includes(`${item.makeId}:${item.id}`) || modelIds.includes(item.id));
    const source = selected.length > 0 ? selected : modelOptions;
    const q = trimQuery.trim().toLowerCase();
    return source
      .map((model) => {
        const make = selectedMakes.find((item) => item.id === model.makeId);
        const trims = (model.trims ?? []).filter((trim) => !q || trim.toLowerCase().includes(q));
        return { make, model, trims };
      })
      .filter((group) => group.trims.length > 0);
  }, [modelOptions, modelIds, selectedMakes, trimQuery]);

  const filteredRegions = useMemo(() => {
    const q = regionQuery.trim().toLowerCase();
    if (!q) return omanRegions;
    return omanRegions.filter((region) => region.name.ar.includes(regionQuery) || region.name.en.toLowerCase().includes(q));
  }, [regionQuery]);

  const list = useMemo(() => {
    const filtered = cars.filter((car) => {
      const hay = carText(car);

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
      if (trimIds.length > 0) {
        if (!trimIds.some((trim) => hay.includes(trim.toLowerCase()))) return false;
      }
      if (yearFrom && car.year < Number(yearFrom)) return false;
      if (yearTo && car.year > Number(yearTo)) return false;
      if (body) {
        const bodyMeta = bodyTypes.find((item) => item.id === body);
        if (bodyMeta) {
          const bodyHay = `${car.body.ar} ${car.body.en}`.toLowerCase();
          if (!bodyHay.includes(bodyMeta.name.en.toLowerCase()) && !bodyHay.includes(bodyMeta.name.ar)) return false;
        }
      }
      if (origin) {
        const meta = ORIGINS.find((item) => item.id === origin);
        if (meta && "match" in meta && !meta.match.some((token) => hay.includes(token.toLowerCase()))) return false;
      }
      if (gear) {
        const meta = GEARS.find((item) => item.id === gear);
        if (meta && "match" in meta) {
          const gearHay = `${car.gearbox.ar} ${car.gearbox.en}`.toLowerCase();
          if (!meta.match.some((token) => gearHay.includes(token.toLowerCase()))) return false;
        }
      }
      if (drive) {
        const meta = DRIVES.find((item) => item.id === drive);
        if (meta && "match" in meta) {
          const driveHay = `${car.drive.ar} ${car.drive.en}`.toLowerCase();
          if (!meta.match.some((token) => driveHay.includes(token.toLowerCase()))) return false;
        }
      }
      if (fuel) {
        const fuelMeta = FUELS.find((item) => item.id === fuel);
        if (fuelMeta && "match" in fuelMeta) {
          const fuelHay = `${car.fuel.ar} ${car.fuel.en}`.toLowerCase();
          if (!fuelMeta.match.some((token) => fuelHay.includes(token.toLowerCase()))) return false;
        }
      }
      if (cylinders) {
        const cylHay = `${hay} ${car.title.en} ${car.title.ar}`;
        const patterns = [new RegExp(`\\b${cylinders}\\s*(cyl|cylinder|أسطوان)`, "i"), new RegExp(`v${cylinders}\\b`, "i")];
        if (!patterns.some((pattern) => pattern.test(cylHay))) {
          // soft pass when listing has no cylinder data yet
          if (/\b(v?\d+|cyl|أسطوان)/i.test(cylHay)) return false;
        }
      }
      if (priceMin && car.priceOmr < Number(priceMin)) return false;
      if (priceMax && car.priceOmr > Number(priceMax)) return false;
      if (exterior) {
        const color = exteriorColors.find((item) => item.id === exterior);
        if (color) {
          const colorHay = `${car.color.ar} ${car.color.en}`.toLowerCase();
          if (!colorHay.includes(color.name.en.toLowerCase()) && !colorHay.includes(color.name.ar)) return false;
        }
      }
      if (interior) {
        const color = interiorColors.find((item) => item.id === interior);
        if (color) {
          const hit =
            hay.includes(`${color.name.en.toLowerCase()} interior`) ||
            hay.includes(`interior ${color.name.en.toLowerCase()}`) ||
            hay.includes(`${color.name.ar} داخلي`) ||
            hay.includes(`داخلي ${color.name.ar}`);
          const mentionsOther = interiorColors.some(
            (item) =>
              item.id !== interior &&
              (hay.includes(`${item.name.en.toLowerCase()} interior`) ||
                hay.includes(`داخلي ${item.name.ar}`) ||
                hay.includes(`${item.name.ar} داخلي`)),
          );
          // Soft until listings carry structured interior color: only exclude clear conflicts.
          if (mentionsOther && !hit) return false;
        }
      }
      if (regionId) {
        const region = regionForCity(car.city.en, car.city.ar);
        if (!region || region.id !== regionId) return false;
      }
      if (cityKey) {
        if (car.city.en !== cityKey && car.city.ar !== cityKey) {
          const city = selectedRegion?.cities.find((item) => item.id === cityKey || item.name.en === cityKey || item.name.ar === cityKey);
          if (!city || (car.city.en !== city.name.en && car.city.ar !== city.name.ar)) return false;
        }
      }
      if (condition && car.condition !== condition) return false;
      if (query && !hay.includes(query.toLowerCase())) return false;
      return true;
    });

    return [...filtered].sort((a, b) => {
      if (sort === "price-asc") return a.priceOmr - b.priceOmr;
      if (sort === "price-desc") return b.priceOmr - a.priceOmr;
      if (sort === "mileage") return a.mileage - b.mileage;
      return b.year - a.year;
    });
  }, [
    makeIds,
    modelIds,
    modelOptions,
    trimIds,
    yearFrom,
    yearTo,
    body,
    origin,
    gear,
    drive,
    fuel,
    cylinders,
    priceMin,
    priceMax,
    exterior,
    interior,
    regionId,
    cityKey,
    selectedRegion,
    condition,
    query,
    sort,
  ]);

  function clearFilters() {
    setMakeIds([]);
    setModelIds([]);
    setTrimIds([]);
    setTrimQuery("");
    setYearFrom("");
    setYearTo("");
    setBody("");
    setFuel("");
    setGear("");
    setDrive("");
    setOrigin("");
    setCylinders("");
    setPriceMin("");
    setPriceMax("");
    setExterior("");
    setInterior("");
    setRegionId("");
    setCityKey("");
    setRegionQuery("");
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
      setTrimIds([]);
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
      setOpen((prev) => ({ ...prev, model: true, trim: true, year: true }));
    }
  }

  function pickModel(makeId: string, id: string) {
    const key = `${makeId}:${id}`;
    setModelIds((current) => {
      if (current.includes(key)) return current.filter((item) => item !== key);
      return [...current.filter((item) => item !== id), key];
    });
    setTrimIds([]);
    setOpen((prev) => ({ ...prev, trim: true }));
  }

  function pickTrim(trim: string) {
    setTrimIds((current) => (current.includes(trim) ? current.filter((item) => item !== trim) : [...current, trim]));
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
          "فلاتر كاملة: الشركات، الموديلات، التجهيز، السنة، المواصفات، والألوان والمناطق.",
          "Full filters: makes, models, trims, year, specs, colors, and regions.",
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

        <div className="grid gap-6 xl:grid-cols-[340px_minmax(0,1fr)] lg:grid-cols-[300px_minmax(0,1fr)]">
          <aside className="surface-card h-fit max-h-[calc(100vh-7rem)] space-y-1 overflow-y-auto p-4 lg:sticky lg:top-28">
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

            <FilterSection title={tx(L("التصنيع", "Make"))} icon="◎" open={open.make} onToggle={() => setOpen((prev) => ({ ...prev, make: !prev.make }))}>
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
              <button type="button" onClick={() => setShowAllMakes((value) => !value)} className="mt-2 w-full rounded-xl border border-line bg-soft/60 py-2 text-xs font-medium text-night hover:bg-soft">
                {showAllMakes ? tx(L("عرض أقل", "Show less")) : tx(L("عرض المزيد", "Show more"))}
              </button>
            </FilterSection>

            <FilterSection title={tx(L("الموديل", "Model"))} icon="▣" open={open.model} onToggle={() => setOpen((prev) => ({ ...prev, model: !prev.model }))}>
              {selectedMakes.length === 0 ? (
                <p className="rounded-xl bg-soft/50 px-3 py-4 text-center text-xs text-muted">
                  {tx(L("اختر شركة واحدة أو أكثر أولاً.", "Pick one or more makes first."))}
                </p>
              ) : (
                <div className="space-y-2">
                  {modelGroups.map(({ make, models }) => {
                    const groupOpen = isMakeModelsOpen(make.id);
                    const showAll = Boolean(modelsShowAll[make.id]);
                    const visible = showAll ? models : models.slice(0, 9);
                    const selectedCount = models.filter((item) => modelIds.includes(`${make.id}:${item.id}`)).length;
                    return (
                      <div key={make.id} className="overflow-hidden rounded-xl border border-line bg-white">
                        <button
                          type="button"
                          onClick={() => setModelsExpanded((prev) => ({ ...prev, [make.id]: !(prev[make.id] !== false) }))}
                          className="flex w-full items-center justify-between gap-2 bg-soft/40 px-2.5 py-2 text-start hover:bg-soft/70"
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
                                    {active && <span className="absolute end-1 top-1 z-10 rounded-full bg-navy px-1 text-[9px] text-ivory">✓</span>}
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

            <FilterSection title={tx(L("الموديل الفرعي", "Sub-model"))} icon="⌕" open={open.trim} onToggle={() => setOpen((prev) => ({ ...prev, trim: !prev.trim }))}>
              {selectedMakes.length === 0 ? (
                <p className="rounded-xl bg-soft/50 px-3 py-4 text-center text-xs text-muted">
                  {tx(L("اختر الشركة والموديل أولاً.", "Pick make and model first."))}
                </p>
              ) : (
                <>
                  <input
                    value={trimQuery}
                    onChange={(event) => setTrimQuery(event.target.value)}
                    className="field mb-3"
                    placeholder={tx(L("البحث عن موديل فرعي", "Search for a sub-model"))}
                  />
                  <div className="space-y-3">
                    {trimGroups.length === 0 ? (
                      <p className="text-xs text-muted">{tx(L("لا توجد تجهيزات مطابقة.", "No matching trims."))}</p>
                    ) : (
                      trimGroups.map(({ make, model, trims }) => (
                        <div key={`${model.makeId}:${model.id}`}>
                          <p className="mb-1.5 text-[11px] font-semibold text-night">
                            {make ? tx(make.name) : model.makeId}
                            <span className="mx-1 text-muted">·</span>
                            {locale === "ar" ? model.name.ar : model.name.en}
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {trims.map((trim) => (
                              <Pill key={`${model.id}:${trim}`} active={trimIds.includes(trim)} onClick={() => pickTrim(trim)}>
                                {trim}
                              </Pill>
                            ))}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </>
              )}
            </FilterSection>

            <FilterSection title={tx(L("السنة", "Year"))} icon="📅" open={open.year} onToggle={() => setOpen((prev) => ({ ...prev, year: !prev.year }))}>
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

            <FilterSection title={tx(L("المواصفات", "Specifications"))} icon="⚙" open={open.origin} onToggle={() => setOpen((prev) => ({ ...prev, origin: !prev.origin }))}>
              <div className="flex flex-wrap gap-2">
                {ORIGINS.map((item) => (
                  <Pill key={item.id || "all-origin"} active={origin === item.id} onClick={() => setOrigin(item.id)}>
                    {tx(item.label)}
                  </Pill>
                ))}
              </div>
            </FilterSection>

            <FilterSection title={tx(L("ناقل الحركة", "Transmission"))} icon="⚙" open={open.gear} onToggle={() => setOpen((prev) => ({ ...prev, gear: !prev.gear }))}>
              <div className="flex flex-wrap gap-2">
                {GEARS.map((item) => (
                  <Pill key={item.id || "all-gear"} active={gear === item.id} onClick={() => setGear(item.id)}>
                    {tx(item.label)}
                  </Pill>
                ))}
              </div>
            </FilterSection>

            <FilterSection title={tx(L("نظام الدفع", "Drive system"))} icon="◎" open={open.drive} onToggle={() => setOpen((prev) => ({ ...prev, drive: !prev.drive }))}>
              <div className="flex flex-wrap gap-2">
                {DRIVES.map((item) => (
                  <Pill key={item.id || "all-drive"} active={drive === item.id} onClick={() => setDrive(item.id)}>
                    {tx(item.label)}
                  </Pill>
                ))}
              </div>
            </FilterSection>

            <FilterSection title={tx(L("نوع الوقود", "Fuel type"))} icon="⛽" open={open.fuel} onToggle={() => setOpen((prev) => ({ ...prev, fuel: !prev.fuel }))}>
              <div className="flex flex-wrap gap-2">
                {FUELS.map((item) => (
                  <Pill key={item.id || "all-fuel"} active={fuel === item.id} onClick={() => setFuel(item.id)}>
                    {tx(item.label)}
                  </Pill>
                ))}
              </div>
            </FilterSection>

            <FilterSection title={tx(L("نوع الهيكل", "Body type"))} icon="▣" open={open.body} onToggle={() => setOpen((prev) => ({ ...prev, body: !prev.body }))}>
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

            <FilterSection title={tx(L("عدد الأسطوانات", "Cylinders"))} icon="◉" open={open.cylinders} onToggle={() => setOpen((prev) => ({ ...prev, cylinders: !prev.cylinders }))}>
              <div className="flex flex-wrap gap-2">
                {CYLINDERS.map((item) => (
                  <Pill key={item || "all-cyl"} active={cylinders === item} onClick={() => setCylinders(item)} round>
                    {item || tx(L("الكل", "All"))}
                  </Pill>
                ))}
              </div>
            </FilterSection>

            <FilterSection title={tx(L("السعر", "Price"))} icon="$" open={open.price} onToggle={() => setOpen((prev) => ({ ...prev, price: !prev.price }))}>
              <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
                <input
                  inputMode="decimal"
                  value={priceMin}
                  onChange={(event) => setPriceMin(event.target.value)}
                  className="field"
                  placeholder={tx(L("الأدنى", "Min"))}
                />
                <span className="text-muted">—</span>
                <input
                  inputMode="decimal"
                  value={priceMax}
                  onChange={(event) => setPriceMax(event.target.value)}
                  className="field"
                  placeholder={tx(L("الأعلى", "Max"))}
                />
              </div>
            </FilterSection>

            <FilterSection title={tx(L("اللون الخارجي", "Exterior color"))} icon="◐" open={open.exterior} onToggle={() => setOpen((prev) => ({ ...prev, exterior: !prev.exterior }))}>
              <ColorSwatches items={exteriorColors} value={exterior} onChange={setExterior} />
            </FilterSection>

            <FilterSection title={tx(L("اللون الداخلي", "Interior color"))} icon="◑" open={open.interior} onToggle={() => setOpen((prev) => ({ ...prev, interior: !prev.interior }))}>
              <ColorSwatches items={interiorColors} value={interior} onChange={setInterior} />
            </FilterSection>

            <FilterSection title={tx(L("المنطقة", "Region"))} icon="⌖" open={open.region} onToggle={() => setOpen((prev) => ({ ...prev, region: !prev.region }))}>
              <input
                value={regionQuery}
                onChange={(event) => setRegionQuery(event.target.value)}
                className="field mb-2"
                placeholder={tx(L("البحث عن منطقة", "Search for a region"))}
              />
              <div className="max-h-48 space-y-1 overflow-y-auto rounded-xl border border-line p-2">
                {filteredRegions.map((region) => {
                  const active = regionId === region.id;
                  return (
                    <label key={region.id} className="flex cursor-pointer items-center justify-between gap-2 rounded-lg px-2 py-1.5 text-sm hover:bg-soft/60">
                      <span>{tx(region.name)}</span>
                      <input
                        type="checkbox"
                        checked={active}
                        onChange={() => {
                          setRegionId(active ? "" : region.id);
                          setCityKey("");
                          setOpen((prev) => ({ ...prev, city: true }));
                        }}
                        className="h-4 w-4 accent-[var(--color-navy)]"
                      />
                    </label>
                  );
                })}
              </div>
            </FilterSection>

            <FilterSection title={tx(L("المدينة", "City"))} icon="⌖" open={open.city} onToggle={() => setOpen((prev) => ({ ...prev, city: !prev.city }))}>
              {!selectedRegion ? (
                <p className="rounded-xl border border-dashed border-line bg-soft/40 px-3 py-4 text-center text-xs text-muted">
                  {tx(L("اختر المنطقة أولاً", "Choose the region first"))}
                </p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {selectedRegion.cities.map((city) => {
                    const active = cityKey === city.id || cityKey === city.name.en || cityKey === city.name.ar;
                    return (
                      <Pill key={city.id} active={active} onClick={() => setCityKey(active ? "" : city.id)}>
                        {tx(city.name)}
                      </Pill>
                    );
                  })}
                </div>
              )}
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
                {trimIds.length > 0 && (
                  <span className="rounded-full border border-line bg-soft px-2 py-1 text-xs text-muted">
                    {locale === "ar" ? `${trimIds.length} تجهيز` : `${trimIds.length} trims`}
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
