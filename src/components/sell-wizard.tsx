"use client";

import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { BrandLogo, ModelName } from "@/components/brand-logo";
import { MakePicker } from "@/components/make-picker";
import { ModelThumb } from "@/components/model-thumb";
import { Receipt } from "@/components/ui";
import {
  bodyTypes,
  citiesOm,
  estimateMarketOmr,
  exteriorColors,
  interiorColors,
  mileageBands,
  sellMakes,
  years,
} from "@/lib/sell-catalog";
import { usePrefs } from "@/lib/prefs";
import { useStore } from "@/lib/store";
import type { Copy } from "@/lib/types";

const L = (ar: string, en: string): Copy => ({ ar, en });

/** One question per screen — selecting an answer advances immediately. */
const STEPS = [
  L("الشركة", "Make"),
  L("الفئة", "Category"),
  L("سنة الصنع", "Year"),
  L("الممشى", "Mileage"),
  L("المواصفات", "Origin"),
  L("التجهيز", "Trim"),
  L("نوع الهيكل", "Body type"),
  L("نوع الوقود", "Fuel"),
  L("ناقل الحركة", "Transmission"),
  L("الإسطوانات", "Cylinders"),
  L("نظام الدفع", "Drivetrain"),
  L("اللون الخارجي", "Exterior"),
  L("اللون الداخلي", "Interior"),
  L("المفاتيح", "Keys"),
  L("رقم الشاصي", "VIN"),
  L("الصور", "Photos"),
  L("السعر والنشر", "Price & publish"),
] as const;

type Deal = "sell" | "trade" | "both";

type Draft = {
  makeId: string;
  modelId: string;
  year: number | null;
  mileageBand: string;
  origin: "gcc" | "import";
  trim: string;
  body: string;
  vin: string;
  showVin: boolean;
  fuel: string;
  gearbox: string;
  cylinders: string;
  drive: string;
  exterior: string;
  interior: string;
  keys: "1" | "2";
  photos: string[];
  price: string;
  deal: Deal;
  city: string;
  note: string;
  wantInspection: boolean;
  wantValuation: boolean;
};

const empty: Draft = {
  makeId: "",
  modelId: "",
  year: null,
  mileageBand: "",
  origin: "gcc",
  trim: "",
  body: "",
  vin: "",
  showVin: false,
  fuel: "",
  gearbox: "",
  cylinders: "",
  drive: "",
  exterior: "",
  interior: "",
  keys: "2",
  photos: [],
  price: "",
  deal: "sell",
  city: "",
  note: "",
  wantInspection: true,
  wantValuation: false,
};

function Chip({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-2xl border px-4 py-3 text-sm font-medium transition ${
        active ? "border-night bg-night text-ivory" : "border-line bg-paper text-night hover:border-brass/50"
      }`}
    >
      {children}
    </button>
  );
}

function Question({
  title,
  lead,
  children,
}: {
  title: string;
  lead?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-5">
      <div>
        <h2 className="text-lg font-semibold text-night md:text-xl">{title}</h2>
        {lead ? <p className="mt-1 text-sm text-muted">{lead}</p> : null}
      </div>
      {children}
    </section>
  );
}

export function SellWizard() {
  const { tx, money, locale } = usePrefs();
  const { addRequest } = useStore();
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<Draft>(empty);
  const [modelQuery, setModelQuery] = useState("");
  const [sent, setSent] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const maxReached = useRef(0);

  const make = sellMakes.find((item) => item.id === draft.makeId);
  const model = make?.models.find((item) => item.id === draft.modelId);
  const mileage = mileageBands.find((item) => item.id === draft.mileageBand)?.value ?? 0;
  const cityLabel = citiesOm.find((item) => item.en === draft.city);

  const market = useMemo(() => {
    if (!draft.makeId || !draft.year || !draft.body) return null;
    return estimateMarketOmr({
      makeId: draft.makeId,
      year: draft.year,
      mileage,
      body: draft.body,
      origin: draft.origin,
    });
  }, [draft.makeId, draft.year, draft.body, draft.origin, mileage]);

  const title = [make ? tx(make.name) : "", model ? tx(model.name) : "", draft.year ?? ""]
    .filter(Boolean)
    .join(" ");

  const filteredModels = (make?.models ?? []).filter((item) => {
    const q = modelQuery.trim().toLowerCase();
    if (!q) return true;
    return item.name.ar.includes(modelQuery) || item.name.en.toLowerCase().includes(q);
  });

  function patch(partial: Partial<Draft>) {
    setDraft((prev) => ({ ...prev, ...partial }));
  }

  function go(to: number) {
    const next = Math.max(0, Math.min(STEPS.length - 1, to));
    maxReached.current = Math.max(maxReached.current, next);
    setStep(next);
  }

  function advance() {
    go(step + 1);
  }

  function canNext() {
    if (step === 0) return Boolean(draft.makeId);
    if (step === 1) return Boolean(draft.modelId);
    if (step === 2) return Boolean(draft.year);
    if (step === 3) return Boolean(draft.mileageBand);
    if (step === 4) return Boolean(draft.origin);
    if (step === 5) return Boolean(draft.trim);
    if (step === 6) return Boolean(draft.body);
    if (step === 7) return Boolean(draft.fuel);
    if (step === 8) return Boolean(draft.gearbox);
    if (step === 9) return Boolean(draft.cylinders);
    if (step === 10) return Boolean(draft.drive);
    if (step === 11) return Boolean(draft.exterior);
    if (step === 12) return Boolean(draft.interior);
    if (step === 13) return Boolean(draft.keys);
    if (step === 14) return true; // VIN optional — can skip
    if (step === 15) return draft.photos.length > 0;
    if (step === 16) return Boolean(draft.price && draft.city);
    return false;
  }

  function choose<K extends keyof Draft>(key: K, value: Draft[K], thenAdvance = true) {
    patch({ [key]: value } as Partial<Draft>);
    if (thenAdvance) {
      // Defer so the active chip paints before the step swap.
      window.setTimeout(() => go(step + 1), 120);
    }
  }

  function pickMake(id: string) {
    patch({ makeId: id, modelId: "", trim: "", body: "" });
    window.setTimeout(() => go(1), 120);
  }

  function pickModel(id: string) {
    const found = make?.models.find((item) => item.id === id);
    patch({
      modelId: id,
      body: found?.body ?? "",
      trim: found?.trims[0] ?? "",
      cylinders: found?.body === "coupe" || id === "mustang" || id === "911" ? "8" : found?.body === "suv" ? "6" : "4",
      drive: found?.body === "suv" || found?.body === "pickup" ? "awd" : "fwd",
      fuel: id === "seal" || id.includes("song") ? "ev" : "petrol",
    });
    window.setTimeout(() => go(2), 120);
  }

  function onFiles(files: FileList | null) {
    if (!files?.length) return;
    const urls = Array.from(files).slice(0, 12).map((file) => URL.createObjectURL(file));
    const nextPhotos = [...draft.photos, ...urls].slice(0, 12);
    patch({ photos: nextPhotos });
    if (draft.photos.length === 0 && nextPhotos.length > 0) {
      window.setTimeout(() => go(16), 180);
    }
  }

  function decodeVin() {
    if (!draft.vin.trim()) return;
    patch({
      year: draft.year ?? 2019,
      origin: "import",
      showVin: true,
    });
  }

  function publish() {
    const created = addRequest({
      kind: "sell",
      title: title || tx(L("إعلان سيارة", "Car listing")),
      detail: [
        draft.trim,
        draft.origin,
        `${mileage} km`,
        `${draft.price} OMR`,
        cityLabel ? tx(cityLabel) : draft.city,
        draft.deal,
        draft.wantInspection ? "inspection" : null,
        draft.wantValuation ? "valuation" : null,
        draft.note || null,
      ]
        .filter(Boolean)
        .join(" · "),
      status: "submitted",
    });
    setSent(created.ref);
  }

  if (sent) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-12">
        <Receipt
          refCode={sent}
          title={tx(L("إعلانك في المراجعة القصيرة.", "Your listing is in short review."))}
          detail={tx(
            L(
              "بعد القبول يظهر في السوق مع أدوات التمويل والتأمين والفحص. يمكنك متابعة الرقم من صفحة الطلبات.",
              "Once accepted it appears in the market with finance, insurance, and inspection. Track the reference on the requests page.",
            ),
          )}
        />
      </div>
    );
  }

  const progress = ((step + 1) / STEPS.length) * 100;
  const trims = model?.trims?.length ? model.trims : ["Base"];

  return (
    <div className="min-h-[80vh] bg-gradient-to-b from-sand/40 to-ivory">
      <div className="border-b border-line/80 bg-paper/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4">
          <div>
            <p className="eyebrow">{tx(L("بيع بدون حادث", "Sell a ready car"))}</p>
            <h1 className="text-xl font-bold tracking-tight text-night md:text-2xl">
              {tx(L("أنشئ إعلانك بخطوات واضحة", "Build your listing in clear steps"))}
            </h1>
          </div>
          <Link href="/sell" className="rounded-full border border-line px-3 py-2 text-sm text-muted hover:text-night">
            {tx(L("إغلاق", "Close"))}
          </Link>
        </div>

        <div className="mx-auto max-w-6xl space-y-3 px-5 pb-4">
          <div className="flex items-center justify-between gap-3 text-xs text-muted">
            <span>
              {tx(L("الخطوة", "Step"))} {step + 1} / {STEPS.length}
            </span>
            <span className="font-semibold text-night">{tx(STEPS[step])}</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-line">
            <div className="h-full rounded-full bg-brass transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
          <ol className="flex gap-1 overflow-x-auto pb-1">
            {STEPS.map((label, index) => {
              const done = index < step;
              const active = index === step;
              const reachable = index <= maxReached.current || index <= step;
              return (
                <li key={label.en}>
                  <button
                    type="button"
                    disabled={!reachable}
                    onClick={() => reachable && go(index)}
                    title={tx(label)}
                    className={`flex h-8 min-w-8 items-center justify-center rounded-full px-2 text-[11px] font-semibold ${
                      done || active
                        ? "bg-night text-ivory"
                        : reachable
                          ? "border border-line bg-paper text-muted"
                          : "border border-line/60 bg-soft text-muted/50"
                    }`}
                    aria-current={active ? "step" : undefined}
                  >
                    {done ? "✓" : index + 1}
                  </button>
                </li>
              );
            })}
          </ol>

          {title && (
            <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-line bg-soft/70 px-3 py-1.5 text-sm text-night">
              {make && <BrandLogo id={make.id} mark={make.mark} name={tx(make.name)} className="h-7 w-7 shrink-0" />}
              <span className="truncate font-medium">{title}</span>
            </div>
          )}
        </div>
      </div>

      <div className="mx-auto grid w-full max-w-6xl gap-6 px-5 py-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,0.75fr)]">
        <div className="surface-card min-w-0 overflow-x-clip p-4 md:p-6">
          {step === 0 && <MakePicker selectedId={draft.makeId} onSelect={pickMake} />}

          {step === 1 && make && (
            <Question title={tx(L("اختر الفئة", "Choose the category"))} lead={tx(L("اختيار واحد ينقلك مباشرة للسنة.", "One tap moves you straight to the year."))}>
              <div className="flex items-center gap-3">
                <BrandLogo id={make.id} mark={make.mark} name={tx(make.name)} className="h-12 w-12" />
                <p className="text-sm text-muted">{tx(make.name)}</p>
              </div>
              <input
                value={modelQuery}
                onChange={(event) => setModelQuery(event.target.value)}
                className="field"
                placeholder={tx(L("ابحث عن الفئة", "Search category / model"))}
              />
              <div className="grid grid-cols-3 gap-2.5 md:grid-cols-4">
                {filteredModels.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => pickModel(item.id)}
                    className={`overflow-hidden rounded-2xl border bg-white text-center transition hover:border-brass/50 ${
                      draft.modelId === item.id ? "border-brass ring-2 ring-brass/25" : "border-line"
                    }`}
                  >
                    <ModelThumb
                      src={item.image}
                      alt={`${item.name.ar} / ${item.name.en}`}
                      body={item.body}
                      makeId={make.id}
                      modelId={item.id}
                      className="aspect-[5/4] w-full object-contain p-1.5"
                    />
                    <span className="block border-t border-line/70 px-1.5 py-2 text-[11px] font-medium text-muted sm:text-xs">
                      {locale === "ar" ? item.name.ar : item.name.en}
                    </span>
                  </button>
                ))}
              </div>
            </Question>
          )}

          {step === 2 && (
            <Question title={tx(L("سنة الصنع", "Year of manufacture"))}>
              <div className="grid grid-cols-4 gap-2 sm:grid-cols-5">
                {years.map((year) => (
                  <Chip key={year} active={draft.year === year} onClick={() => choose("year", year)}>
                    {year}
                  </Chip>
                ))}
              </div>
            </Question>
          )}

          {step === 3 && (
            <Question title={tx(L("الممشى", "Mileage"))}>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {mileageBands.map((band) => (
                  <Chip key={band.id} active={draft.mileageBand === band.id} onClick={() => choose("mileageBand", band.id)}>
                    {tx(band.label)}
                  </Chip>
                ))}
              </div>
            </Question>
          )}

          {step === 4 && (
            <Question title={tx(L("المواصفات", "Specs origin"))}>
              <div className="grid grid-cols-2 gap-2">
                <Chip active={draft.origin === "gcc"} onClick={() => choose("origin", "gcc")}>
                  {tx(L("خليجي", "GCC"))}
                </Chip>
                <Chip active={draft.origin === "import"} onClick={() => choose("origin", "import")}>
                  {tx(L("وارد", "Imported"))}
                </Chip>
              </div>
            </Question>
          )}

          {step === 5 && (
            <Question title={tx(L("التجهيز", "Trim"))}>
              <div className="flex flex-wrap gap-2">
                {trims.map((trim) => (
                  <Chip key={trim} active={draft.trim === trim} onClick={() => choose("trim", trim)}>
                    {trim}
                  </Chip>
                ))}
              </div>
            </Question>
          )}

          {step === 6 && (
            <Question title={tx(L("نوع الهيكل", "Body type"))} lead={tx(L("نقترح هيكلاً من الفئة — يمكنك تغييره.", "Suggested from the category — you can change it."))}>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
                {bodyTypes.map((body) => (
                  <button
                    key={body.id}
                    type="button"
                    onClick={() => choose("body", body.id)}
                    className={`overflow-hidden rounded-2xl border bg-white text-center ${
                      draft.body === body.id ? "border-brass ring-2 ring-brass/25" : "border-line"
                    }`}
                  >
                    <img src={body.image} alt={tx(body.name)} className="aspect-[4/3] w-full object-cover" />
                    <span className="block px-1 py-2 text-xs font-medium">{tx(body.name)}</span>
                  </button>
                ))}
              </div>
            </Question>
          )}

          {step === 7 && (
            <Question title={tx(L("نوع الوقود", "Fuel type"))}>
              <div className="flex flex-wrap gap-2">
                {(
                  [
                    ["petrol", L("بترول", "Petrol")],
                    ["hybrid", L("هايبرد", "Hybrid")],
                    ["diesel", L("ديزل", "Diesel")],
                    ["ev", L("كهربائي", "Electric")],
                  ] as const
                ).map(([id, label]) => (
                  <Chip key={id} active={draft.fuel === id} onClick={() => choose("fuel", id)}>
                    {tx(label)}
                  </Chip>
                ))}
              </div>
            </Question>
          )}

          {step === 8 && (
            <Question title={tx(L("ناقل الحركة", "Transmission"))}>
              <div className="grid grid-cols-2 gap-2">
                <Chip active={draft.gearbox === "auto"} onClick={() => choose("gearbox", "auto")}>
                  {tx(L("أوتوماتيك", "Automatic"))}
                </Chip>
                <Chip active={draft.gearbox === "manual"} onClick={() => choose("gearbox", "manual")}>
                  {tx(L("عادي", "Manual"))}
                </Chip>
              </div>
            </Question>
          )}

          {step === 9 && (
            <Question title={tx(L("عدد الإسطوانات", "Cylinders"))}>
              <div className="flex flex-wrap gap-2">
                {["2", "3", "4", "6", "8", "10", "12"].map((n) => (
                  <Chip key={n} active={draft.cylinders === n} onClick={() => choose("cylinders", n)}>
                    {n}
                  </Chip>
                ))}
              </div>
            </Question>
          )}

          {step === 10 && (
            <Question title={tx(L("نظام الدفع", "Drivetrain"))}>
              <div className="grid grid-cols-3 gap-2">
                <Chip active={draft.drive === "fwd"} onClick={() => choose("drive", "fwd")}>
                  {tx(L("أمامي", "FWD"))}
                </Chip>
                <Chip active={draft.drive === "rwd"} onClick={() => choose("drive", "rwd")}>
                  {tx(L("خلفي", "RWD"))}
                </Chip>
                <Chip active={draft.drive === "awd"} onClick={() => choose("drive", "awd")}>
                  {tx(L("رباعي", "AWD"))}
                </Chip>
              </div>
            </Question>
          )}

          {step === 11 && (
            <Question title={tx(L("اللون الخارجي", "Exterior colour"))}>
              <div className="flex flex-wrap gap-3">
                {exteriorColors.map((color) => (
                  <button key={color.id} type="button" onClick={() => choose("exterior", color.id)} className="text-center">
                    <span
                      className={`mx-auto block h-11 w-11 rounded-full border-2 ${
                        draft.exterior === color.id ? "scale-110 border-night" : "border-line"
                      }`}
                      style={{ background: color.hex }}
                    />
                    <span className="mt-1 block text-[11px] text-muted">{tx(color.name)}</span>
                  </button>
                ))}
              </div>
            </Question>
          )}

          {step === 12 && (
            <Question title={tx(L("اللون الداخلي", "Interior colour"))}>
              <div className="flex flex-wrap gap-3">
                {interiorColors.map((color) => (
                  <button key={color.id} type="button" onClick={() => choose("interior", color.id)} className="text-center">
                    <span
                      className={`mx-auto block h-11 w-11 rounded-full border-2 ${
                        draft.interior === color.id ? "scale-110 border-night" : "border-line"
                      }`}
                      style={{ background: color.hex }}
                    />
                    <span className="mt-1 block text-[11px] text-muted">{tx(color.name)}</span>
                  </button>
                ))}
              </div>
            </Question>
          )}

          {step === 13 && (
            <Question title={tx(L("عدد المفاتيح", "Number of keys"))}>
              <div className="grid grid-cols-2 gap-2">
                <Chip active={draft.keys === "1"} onClick={() => choose("keys", "1")}>
                  1
                </Chip>
                <Chip active={draft.keys === "2"} onClick={() => choose("keys", "2")}>
                  2
                </Chip>
              </div>
            </Question>
          )}

          {step === 14 && (
            <Question
              title={tx(L("رقم الشاصي", "Chassis / VIN"))}
              lead={tx(L("اختياري — يسرّع المراجعة. يمكنك التخطي والمتابعة.", "Optional — speeds review. You can skip and continue."))}
            >
              <label className="block space-y-2">
                <span className="block text-sm font-medium text-night">{tx(L("رقم الشاصي", "VIN"))}</span>
                <input
                  className="field"
                  value={draft.vin}
                  onChange={(event) => patch({ vin: event.target.value.toUpperCase(), showVin: true })}
                  placeholder="WDB..."
                  autoComplete="off"
                />
              </label>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  className="btn-secondary"
                  disabled={!draft.vin.trim()}
                  onClick={() => {
                    decodeVin();
                    window.setTimeout(() => go(15), 120);
                  }}
                >
                  {tx(L("فك الرمز والمتابعة", "Decode & continue"))}
                </button>
                <button type="button" className="btn-primary" onClick={() => go(15)}>
                  {draft.vin.trim()
                    ? tx(L("حفظ والمتابعة", "Save & continue"))
                    : tx(L("تخطي", "Skip"))}
                </button>
              </div>
            </Question>
          )}

          {step === 15 && (
            <Question
              title={`${tx(L("إضافة صور", "Add photos"))} (${draft.photos.length}/12)`}
              lead={tx(L("أول صورة تصبح الغلاف. بعد إضافة صورة تنتقل للسعر تلقائيًا.", "The first photo becomes the cover. After adding one, you move to pricing."))}
            >
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="flex w-full flex-col items-center justify-center rounded-[1.25rem] border border-dashed border-brass/50 bg-soft/50 px-6 py-14 text-center"
              >
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-brass text-2xl text-white">+</span>
                <span className="mt-3 font-semibold text-night">{tx(L("أضف صور السيارة", "Add car photos"))}</span>
                <span className="mt-1 text-xs text-muted">{tx(L("jpg أو png · حتى 12 صورة", "jpg or png · up to 12 photos"))}</span>
              </button>
              <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={(event) => onFiles(event.target.files)} />
              {draft.photos.length > 0 && (
                <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
                  {draft.photos.map((src, index) => (
                    <div key={src} className="relative overflow-hidden rounded-2xl border border-line">
                      <img src={src} alt="" className="aspect-square w-full object-cover" />
                      {index === 0 && (
                        <span className="absolute start-2 top-2 rounded-full bg-night px-2 py-0.5 text-[10px] text-ivory">
                          {tx(L("الغلاف", "Cover"))}
                        </span>
                      )}
                      <button
                        type="button"
                        className="absolute end-2 top-2 rounded-full bg-paper/95 px-2 text-xs"
                        onClick={() => patch({ photos: draft.photos.filter((_, i) => i !== index) })}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </Question>
          )}

          {step === 16 && (
            <Question
              title={tx(L("السعر والمنطقة والنشر", "Price, area, and publish"))}
              lead={tx(L("آخر خطوة — راجع المعاينة ثم أنشئ الإعلان.", "Last step — check the preview, then create the listing."))}
            >
              {market && (
                <div className="rounded-2xl border border-brass/30 bg-soft px-4 py-3 text-sm">
                  <p className="font-medium text-night">{tx(L("تقدير السوق لهذه المواصفات", "Market estimate for these specs"))}</p>
                  <p className="mt-1 text-brass">
                    {money(Math.round(market * 0.92))} – {money(Math.round(market * 1.08))}
                  </p>
                </div>
              )}

              <label className="block">
                <span className="mb-2 block text-sm font-medium">{tx(L("سعر البيع", "Asking price"))}</span>
                <div className="relative">
                  <input
                    className="field pe-16"
                    inputMode="decimal"
                    value={draft.price}
                    onChange={(event) => patch({ price: event.target.value })}
                    placeholder={tx(L("اكتب سعر البيع", "Enter asking price"))}
                  />
                  <span className="absolute end-4 top-1/2 -translate-y-1/2 text-sm text-muted">OMR</span>
                </div>
              </label>

              <div>
                <p className="mb-2 text-sm font-medium">{tx(L("نوع الصفقة", "Deal type"))}</p>
                <div className="grid gap-2 sm:grid-cols-3">
                  <Chip active={draft.deal === "sell"} onClick={() => patch({ deal: "sell" })}>
                    {tx(L("بيع فقط", "Sell only"))}
                  </Chip>
                  <Chip active={draft.deal === "both"} onClick={() => patch({ deal: "both" })}>
                    {tx(L("بيع أو تبادل", "Sell or trade"))}
                  </Chip>
                  <Chip active={draft.deal === "trade"} onClick={() => patch({ deal: "trade" })}>
                    {tx(L("تبادل فقط", "Trade only"))}
                  </Chip>
                </div>
              </div>

              <div>
                <p className="mb-2 text-sm font-medium">{tx(L("المنطقة", "Area"))}</p>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {citiesOm.map((city) => (
                    <Chip key={city.en} active={draft.city === city.en} onClick={() => patch({ city: city.en })}>
                      {tx(city)}
                    </Chip>
                  ))}
                </div>
              </div>

              <label className="block">
                <span className="mb-2 block text-sm font-medium">{tx(L("وصف السيارة (اختياري)", "Description (optional)"))}</span>
                <textarea
                  className="field"
                  rows={4}
                  value={draft.note}
                  onChange={(event) => patch({ note: event.target.value })}
                  placeholder={tx(L("اكتب معلومات إضافية", "Add extra details"))}
                />
              </label>

              <div className="space-y-2 rounded-2xl border border-line bg-sand/40 p-4">
                <p className="text-sm font-semibold text-night">{tx(L("قوة BHD — اختر ما يُرفق بالإعلان", "BHD edge — attach to the listing"))}</p>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={draft.wantInspection}
                    onChange={(event) => patch({ wantInspection: event.target.checked })}
                    className="accent-[var(--color-brass)]"
                  />
                  {tx(L("طلب فحص بالنيابة قبل النشر الكامل", "Request a proxy inspection before full publish"))}
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={draft.wantValuation}
                    onChange={(event) => patch({ wantValuation: event.target.checked })}
                    className="accent-[var(--color-brass)]"
                  />
                  {tx(L("تثمين معتمد يُعرض للمشتري", "Certified valuation shown to buyers"))}
                </label>
              </div>
            </Question>
          )}

          <div className="sticky bottom-0 z-10 -mx-4 mt-8 flex items-center gap-3 border-t border-line bg-paper/95 px-4 py-3 backdrop-blur md:static md:mx-0 md:bg-transparent md:px-0 md:backdrop-blur-none">
            {step > 0 && (
              <button type="button" onClick={() => go(step - 1)} className="btn-secondary px-4" aria-label={tx(L("رجوع", "Back"))}>
                {locale === "ar" ? "→" : "←"} {tx(L("رجوع", "Back"))}
              </button>
            )}
            {step < STEPS.length - 1 ? (
              <button
                type="button"
                onClick={advance}
                disabled={!canNext()}
                className={`btn-primary flex-1 ${!canNext() ? "opacity-40" : ""}`}
              >
                {tx(L("التالي", "Next"))}
              </button>
            ) : (
              <button
                type="button"
                onClick={publish}
                disabled={!canNext()}
                className={`btn-teal flex-1 ${!canNext() ? "opacity-40" : ""}`}
              >
                {tx(L("إنشاء الإعلان", "Create listing"))}
              </button>
            )}
          </div>
        </div>

        <aside className="hidden lg:block">
          <div className="surface-card sticky top-28 overflow-hidden">
            <div className="bg-night px-5 py-3 text-xs font-medium tracking-[0.14em] text-brass">
              {tx(L("معاينة مباشرة", "Live preview"))}
            </div>
            <div className="aspect-[16/10] bg-soft">
              {draft.photos[0] ? (
                <img src={draft.photos[0]} alt="" className="h-full w-full object-cover" />
              ) : model?.image ? (
                <ModelThumb
                  src={model.image}
                  alt={title}
                  body={model.body}
                  makeId={make?.id}
                  modelId={model.id}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-muted">
                  {tx(L("ستظهر الصورة هنا", "Photo appears here"))}
                </div>
              )}
            </div>
            <div className="space-y-2 p-5">
              <p className="text-2xl font-bold text-night">{draft.price ? money(Number(draft.price) || 0) : "—"}</p>
              <p className="font-semibold text-night">{title || tx(L("سيارتك", "Your car"))}</p>
              <p className="text-sm text-muted">
                {[draft.year, draft.mileageBand ? `${mileage.toLocaleString()} ${tx(L("كم", "km"))}` : null, cityLabel ? tx(cityLabel) : null]
                  .filter(Boolean)
                  .join(" · ") || tx(L("أكمل الخطوات لملء البطاقة", "Complete steps to fill the card"))}
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                {draft.trim && <span className="chip">{draft.trim}</span>}
                {draft.origin && (
                  <span className="chip">{draft.origin === "gcc" ? tx(L("خليجي", "GCC")) : tx(L("وارد", "Imported"))}</span>
                )}
                {draft.gearbox && (
                  <span className="chip">{draft.gearbox === "auto" ? tx(L("أوتوماتيك", "Auto")) : tx(L("عادي", "Manual"))}</span>
                )}
              </div>
              {model ? (
                <p className="pt-2 text-xs text-muted">
                  <ModelName name={model.name} locale={locale} />
                </p>
              ) : null}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
