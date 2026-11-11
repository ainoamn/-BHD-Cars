"use client";

import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { Receipt } from "@/components/ui";
import {
  bodyTypes,
  citiesOm,
  damageSeverities,
  damageZones,
  estimateAccidentOmr,
  exteriorColors,
  mileageBands,
  repairStates,
  sellMakes,
  titleStatuses,
  transparencyScore,
  years,
} from "@/lib/sell-catalog";
import { usePrefs } from "@/lib/prefs";
import { useStore } from "@/lib/store";
import type { Copy } from "@/lib/types";

const L = (ar: string, en: string): Copy => ({ ar, en });

const STEPS = [
  L("السيارة", "The car"),
  L("الضرر", "Damage"),
  L("الإصلاح والملكية", "Repair & title"),
  L("الصور", "Photos"),
  L("السعر والنشر", "Price & publish"),
] as const;

type Draft = {
  makeId: string;
  modelId: string;
  year: number | null;
  mileageBand: string;
  origin: "gcc" | "import";
  trim: string;
  body: string;
  vin: string;
  fuel: string;
  gearbox: string;
  exterior: string;
  zones: string[];
  severity: string;
  repair: string;
  title: string;
  runs: boolean;
  airbagsDeployed: boolean | null;
  damagePhotos: string[];
  beforePhotos: string[];
  beautyPhotos: string[];
  price: string;
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
  origin: "import",
  trim: "",
  body: "",
  vin: "",
  fuel: "petrol",
  gearbox: "auto",
  exterior: "white",
  zones: [],
  severity: "",
  repair: "",
  title: "salvage",
  runs: true,
  airbagsDeployed: null,
  damagePhotos: [],
  beforePhotos: [],
  beautyPhotos: [],
  price: "",
  city: "",
  note: "",
  wantInspection: true,
  wantValuation: true,
};

function Chip({
  active,
  children,
  onClick,
  danger = false,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-2xl border px-4 py-3 text-sm font-medium transition ${
        active
          ? danger
            ? "border-live bg-live text-white"
            : "border-night bg-night text-ivory"
          : "border-line bg-paper text-night hover:border-brass/50"
      }`}
    >
      {children}
    </button>
  );
}

export function AccidentWizard() {
  const { tx, money, locale } = usePrefs();
  const { addRequest } = useStore();
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<Draft>(empty);
  const [makeQuery, setMakeQuery] = useState("");
  const [sent, setSent] = useState<string | null>(null);
  const damageRef = useRef<HTMLInputElement>(null);
  const beforeRef = useRef<HTMLInputElement>(null);
  const beautyRef = useRef<HTMLInputElement>(null);

  const make = sellMakes.find((item) => item.id === draft.makeId);
  const model = make?.models.find((item) => item.id === draft.modelId);
  const mileage = mileageBands.find((item) => item.id === draft.mileageBand)?.value ?? 0;
  const cityLabel = citiesOm.find((item) => item.en === draft.city);

  const market = useMemo(() => {
    if (!draft.makeId || !draft.year || !draft.body || !draft.severity) return null;
    return estimateAccidentOmr({
      makeId: draft.makeId,
      year: draft.year,
      mileage,
      body: draft.body,
      origin: draft.origin,
      severity: draft.severity,
      zones: draft.zones,
      repair: draft.repair,
      runs: draft.runs,
    });
  }, [draft, mileage]);

  const score = transparencyScore({
    zones: draft.zones,
    severity: draft.severity,
    repair: draft.repair,
    title: draft.title,
    damagePhotos: draft.damagePhotos.length,
    beforePhotos: draft.beforePhotos.length,
    vin: Boolean(draft.vin.trim()),
    note: Boolean(draft.note.trim()),
  });

  const title = [make ? tx(make.name) : "", model ? tx(model.name) : "", draft.year ?? ""]
    .filter(Boolean)
    .join(" ");

  const filteredMakes = sellMakes.filter((item) => {
    const q = makeQuery.trim().toLowerCase();
    if (!q) return true;
    return item.name.ar.includes(makeQuery) || item.name.en.toLowerCase().includes(q) || item.id.includes(q);
  });

  function patch(partial: Partial<Draft>) {
    setDraft((prev) => ({ ...prev, ...partial }));
  }

  function toggleZone(id: string) {
    patch({
      zones: draft.zones.includes(id) ? draft.zones.filter((z) => z !== id) : [...draft.zones, id],
    });
  }

  function canNext() {
    if (step === 0) return Boolean(draft.makeId && draft.modelId && draft.year && draft.mileageBand && draft.body);
    if (step === 1) return draft.zones.length > 0 && Boolean(draft.severity) && draft.airbagsDeployed !== null;
    if (step === 2) return Boolean(draft.repair && draft.title);
    if (step === 3) return draft.damagePhotos.length >= 2;
    if (step === 4) return Boolean(draft.price && draft.city) && score >= 55;
    return false;
  }

  function next() {
    if (!canNext()) return;
    setStep((value) => Math.min(STEPS.length - 1, value + 1));
  }

  function back() {
    setStep((value) => Math.max(0, value - 1));
  }

  function onFiles(kind: "damage" | "before" | "beauty", files: FileList | null) {
    if (!files?.length) return;
    const urls = Array.from(files).slice(0, 8).map((file) => URL.createObjectURL(file));
    if (kind === "damage") patch({ damagePhotos: [...draft.damagePhotos, ...urls].slice(0, 12) });
    if (kind === "before") patch({ beforePhotos: [...draft.beforePhotos, ...urls].slice(0, 8) });
    if (kind === "beauty") patch({ beautyPhotos: [...draft.beautyPhotos, ...urls].slice(0, 8) });
  }

  function publish() {
    const created = addRequest({
      kind: "sell",
      title: `${title} · ${tx(L("حادث معلن", "Declared accident"))}`,
      detail: [
        "accident",
        draft.severity,
        draft.zones.join(","),
        draft.repair,
        draft.title,
        draft.runs ? "runs" : "does-not-run",
        `${draft.price} OMR`,
        cityLabel ? tx(cityLabel) : draft.city,
        `transparency ${score}%`,
        draft.wantInspection ? "inspection" : null,
        draft.wantValuation ? "valuation" : null,
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
          title={tx(L("إعلان الحادث في المراجعة.", "The accident listing is in review."))}
          detail={tx(L(
            "يظهر في قسم الحوادث المعلن فقط، مع خريطة الضرر والصور. الفحص والتثمين يُربطان إن طلبتهما.",
            "It appears only in the declared-accident section, with the damage map and photos. Inspection and valuation attach if you asked for them.",
          ))}
        />
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] bg-gradient-to-b from-[#f7ebe8] to-ivory">
      <div className="border-b border-line/80 bg-paper/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4">
          <div>
            <p className="text-xs font-semibold tracking-[0.14em] text-live">{tx(L("بيع بحادث معلن", "Sell a declared accident car"))}</p>
            <h1 className="text-xl font-bold tracking-tight text-night md:text-2xl">
              {tx(L("الضرر يُكتب قبل السعر", "Damage is written before the price"))}
            </h1>
          </div>
          <Link href="/sell" className="rounded-full border border-line px-3 py-2 text-sm text-muted hover:text-night">
            {tx(L("إغلاق", "Close"))}
          </Link>
        </div>

        <div className="mx-auto max-w-6xl px-5 pb-4">
          <ol className="flex items-center gap-1 overflow-x-auto pb-1">
            {STEPS.map((label, index) => {
              const done = index < step;
              const active = index === step;
              return (
                <li key={label.en} className="flex min-w-0 flex-1 items-center gap-1">
                  <button
                    type="button"
                    onClick={() => index < step && setStep(index)}
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                      done || active ? "bg-live text-white" : "border border-line bg-paper text-muted"
                    }`}
                  >
                    {done ? "✓" : index + 1}
                  </button>
                  <span className={`hidden truncate text-xs md:inline ${active ? "font-semibold text-night" : "text-muted"}`}>
                    {tx(label)}
                  </span>
                  {index < STEPS.length - 1 && <span className="mx-1 hidden h-px flex-1 bg-line sm:block" />}
                </li>
              );
            })}
          </ol>

          <div className="mt-3 flex flex-wrap items-center gap-3">
            {title && (
              <div className="inline-flex items-center gap-2 rounded-full border border-line bg-soft/70 px-3 py-1.5 text-sm text-night">
                {make && (
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-night text-[10px] font-bold text-ivory">
                    {make.mark}
                  </span>
                )}
                <span className="font-medium">{title}</span>
                <span className="rounded-full bg-live/10 px-2 py-0.5 text-[11px] font-medium text-live">
                  {tx(L("حادث معلن", "Declared"))}
                </span>
              </div>
            )}
            <div className="ms-auto flex min-w-[160px] items-center gap-2 text-xs">
              <span className="text-muted">{tx(L("شفافية", "Transparency"))}</span>
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-line">
                <div
                  className={`h-full rounded-full transition-all ${score >= 80 ? "bg-brass" : score >= 55 ? "bg-navy" : "bg-live"}`}
                  style={{ width: `${score}%` }}
                />
              </div>
              <span className="tabular-nums font-semibold text-night">{score}%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-6xl gap-6 px-5 py-6 lg:grid-cols-[1.35fr_0.75fr]">
        <div className="surface-card p-4 md:p-6">
          {step === 0 && (
            <section className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-night">{tx(L("عرّف السيارة أولاً", "Identify the car first"))}</h2>
                <p className="mt-1 text-sm text-muted">{tx(L("نفس وضوح الإعلان العادي — ثم ننتقل للضرر.", "The same clarity as a normal listing — then we move to the damage."))}</p>
              </div>

              <input
                value={makeQuery}
                onChange={(event) => setMakeQuery(event.target.value)}
                className="field"
                placeholder={tx(L("ابحث عن المصنع", "Search for a make"))}
              />

              <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                {filteredMakes.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => patch({ makeId: item.id, modelId: "", trim: "", body: "" })}
                    className={`rounded-2xl border p-3 text-center ${draft.makeId === item.id ? "border-night bg-soft" : "border-line"}`}
                  >
                    <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-night text-xs font-bold text-ivory">{item.mark}</span>
                    <span className="mt-2 block text-xs font-medium">{tx(item.name)}</span>
                  </button>
                ))}
              </div>

              {make && (
                <div>
                  <p className="mb-2 text-sm font-medium">{tx(L("الطراز", "Model"))}</p>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {make.models.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() =>
                          patch({
                            modelId: item.id,
                            body: item.body,
                            trim: item.trims[0] ?? "",
                          })
                        }
                        className={`overflow-hidden rounded-2xl border text-start ${draft.modelId === item.id ? "border-night" : "border-line"}`}
                      >
                        <img src={item.image} alt={tx(item.name)} className="aspect-[4/3] w-full object-cover" />
                        <span className="block px-2 py-2 text-sm font-semibold">{tx(item.name)}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {draft.modelId && (
                <>
                  <div>
                    <p className="mb-2 text-sm font-medium">{tx(L("السنة", "Year"))}</p>
                    <div className="grid grid-cols-4 gap-2 sm:grid-cols-5">
                      {years.map((year) => (
                        <Chip key={year} active={draft.year === year} onClick={() => patch({ year })}>{year}</Chip>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="mb-2 text-sm font-medium">{tx(L("الممشى", "Mileage"))}</p>
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                      {mileageBands.map((band) => (
                        <Chip key={band.id} active={draft.mileageBand === band.id} onClick={() => patch({ mileageBand: band.id })}>
                          {tx(band.label)}
                        </Chip>
                      ))}
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <p className="mb-2 text-sm font-medium">{tx(L("الأصل", "Origin"))}</p>
                      <div className="grid grid-cols-2 gap-2">
                        <Chip active={draft.origin === "gcc"} onClick={() => patch({ origin: "gcc" })}>{tx(L("خليجي", "GCC"))}</Chip>
                        <Chip active={draft.origin === "import"} onClick={() => patch({ origin: "import" })}>{tx(L("وارد", "Imported"))}</Chip>
                      </div>
                    </div>
                    <div>
                      <p className="mb-2 text-sm font-medium">{tx(L("هل تمشي؟", "Does it run?"))}</p>
                      <div className="grid grid-cols-2 gap-2">
                        <Chip active={draft.runs} onClick={() => patch({ runs: true })}>{tx(L("تمشي", "Runs"))}</Chip>
                        <Chip active={!draft.runs} onClick={() => patch({ runs: false })} danger>{tx(L("لا تمشي", "Does not run"))}</Chip>
                      </div>
                    </div>
                  </div>
                  {model && (
                    <div>
                      <p className="mb-2 text-sm font-medium">{tx(L("الفئة", "Trim"))}</p>
                      <div className="flex flex-wrap gap-2">
                        {model.trims.map((trim) => (
                          <Chip key={trim} active={draft.trim === trim} onClick={() => patch({ trim })}>{trim}</Chip>
                        ))}
                      </div>
                    </div>
                  )}
                  <div>
                    <p className="mb-2 text-sm font-medium">{tx(L("الهيكل", "Body"))}</p>
                    <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
                      {bodyTypes.map((body) => (
                        <button
                          key={body.id}
                          type="button"
                          onClick={() => patch({ body: body.id })}
                          className={`overflow-hidden rounded-2xl border text-center ${draft.body === body.id ? "border-night" : "border-line"}`}
                        >
                          <img src={body.image} alt={tx(body.name)} className="aspect-[4/3] w-full object-cover" />
                          <span className="block px-1 py-2 text-xs font-medium">{tx(body.name)}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  <label className="block">
                    <span className="mb-2 block text-sm font-medium">{tx(L("رقم الشاصي (مستحسن بقوة)", "VIN (strongly recommended)"))}</span>
                    <input className="field" value={draft.vin} onChange={(event) => patch({ vin: event.target.value.toUpperCase() })} placeholder="WDB..." />
                  </label>
                </>
              )}
            </section>
          )}

          {step === 1 && (
            <section className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-night">{tx(L("خريطة الضرر", "Damage map"))}</h2>
                <p className="mt-1 text-sm text-muted">{tx(L("اختر كل موضع تضرر. هذا ما يفرّقنا عن إعلان يكتب «حادث» فقط.", "Select every damaged area. This is what separates us from an ad that only says “accident”."))}</p>
              </div>

              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {damageZones.map((zone) => (
                  <Chip key={zone.id} active={draft.zones.includes(zone.id)} onClick={() => toggleZone(zone.id)} danger={zone.id === "flood" || zone.id === "fire" || zone.id === "airbags"}>
                    {tx(zone.name)}
                  </Chip>
                ))}
              </div>

              <div>
                <p className="mb-2 text-sm font-medium">{tx(L("شدة الضرر", "Damage severity"))}</p>
                <div className="grid gap-2 sm:grid-cols-2">
                  {damageSeverities.map((item) => (
                    <Chip key={item.id} active={draft.severity === item.id} onClick={() => patch({ severity: item.id })} danger={item.id === "heavy" || item.id === "total"}>
                      {tx(item.name)}
                    </Chip>
                  ))}
                </div>
              </div>

              <div>
                <p className="mb-2 text-sm font-medium">{tx(L("هل انفتحت الوسائد؟", "Did the airbags deploy?"))}</p>
                <div className="grid grid-cols-2 gap-2">
                  <Chip active={draft.airbagsDeployed === true} onClick={() => patch({ airbagsDeployed: true, zones: draft.zones.includes("airbags") ? draft.zones : [...draft.zones, "airbags"] })} danger>
                    {tx(L("نعم", "Yes"))}
                  </Chip>
                  <Chip active={draft.airbagsDeployed === false} onClick={() => patch({ airbagsDeployed: false })}>
                    {tx(L("لا", "No"))}
                  </Chip>
                </div>
              </div>

              <div>
                <p className="mb-2 text-sm font-medium">{tx(L("اللون الخارجي", "Exterior colour"))}</p>
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {exteriorColors.map((color) => (
                    <button key={color.id} type="button" onClick={() => patch({ exterior: color.id })} className="shrink-0 text-center">
                      <span className={`mx-auto block h-10 w-10 rounded-full border-2 ${draft.exterior === color.id ? "border-night" : "border-line"}`} style={{ background: color.hex }} />
                      <span className="mt-1 block text-[11px] text-muted">{tx(color.name)}</span>
                    </button>
                  ))}
                </div>
              </div>
            </section>
          )}

          {step === 2 && (
            <section className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-night">{tx(L("الإصلاح والملكية", "Repair and title"))}</h2>
                <p className="mt-1 text-sm text-muted">{tx(L("المشتري يحتاج أن يعرف إن كانت السيارة أُصلحت، وما نوع الملكية.", "The buyer needs to know if it was repaired, and what title it carries."))}</p>
              </div>

              <div className="grid gap-3">
                {repairStates.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => patch({ repair: item.id })}
                    className={`rounded-2xl border p-4 text-start ${draft.repair === item.id ? "border-night bg-soft" : "border-line"}`}
                  >
                    <p className="font-semibold text-night">{tx(item.name)}</p>
                    <p className="mt-1 text-xs text-muted">{tx(item.note)}</p>
                  </button>
                ))}
              </div>

              <div>
                <p className="mb-2 text-sm font-medium">{tx(L("حالة الملكية", "Title status"))}</p>
                <div className="grid gap-2 sm:grid-cols-2">
                  {titleStatuses.map((item) => (
                    <Chip key={item.id} active={draft.title === item.id} onClick={() => patch({ title: item.id })}>
                      {tx(item.name)}
                    </Chip>
                  ))}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="mb-2 text-sm font-medium">{tx(L("الوقود", "Fuel"))}</p>
                  <div className="flex flex-wrap gap-2">
                    {([
                      ["petrol", L("بترول", "Petrol")],
                      ["hybrid", L("هايبرد", "Hybrid")],
                      ["diesel", L("ديزل", "Diesel")],
                      ["ev", L("كهربائي", "Electric")],
                    ] as const).map(([id, label]) => (
                      <Chip key={id} active={draft.fuel === id} onClick={() => patch({ fuel: id })}>{tx(label)}</Chip>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="mb-2 text-sm font-medium">{tx(L("القير", "Gearbox"))}</p>
                  <div className="grid grid-cols-2 gap-2">
                    <Chip active={draft.gearbox === "auto"} onClick={() => patch({ gearbox: "auto" })}>{tx(L("أوتوماتيك", "Auto"))}</Chip>
                    <Chip active={draft.gearbox === "manual"} onClick={() => patch({ gearbox: "manual" })}>{tx(L("عادي", "Manual"))}</Chip>
                  </div>
                </div>
              </div>
            </section>
          )}

          {step === 3 && (
            <section className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-night">{tx(L("صور الضرر أولاً", "Damage photos first"))}</h2>
                <p className="mt-1 text-sm text-muted">{tx(L("صورتان للضرر على الأقل قبل أي صورة جمالية. هذا شرط النشر.", "At least two damage photos before any beauty shot. This is required to publish."))}</p>
              </div>

              <UploadBlock
                title={tx(L("صور الضرر (إلزامي · 2 على الأقل)", "Damage photos (required · at least 2)"))}
                count={draft.damagePhotos.length}
                onPick={() => damageRef.current?.click()}
                onClear={(index) => patch({ damagePhotos: draft.damagePhotos.filter((_, i) => i !== index) })}
                photos={draft.damagePhotos}
                accent="live"
              />
              <input ref={damageRef} type="file" accept="image/*" multiple className="hidden" onChange={(event) => onFiles("damage", event.target.files)} />

              <UploadBlock
                title={tx(L("صور قبل الإصلاح (إن وُجدت)", "Before-repair photos (if any)"))}
                count={draft.beforePhotos.length}
                onPick={() => beforeRef.current?.click()}
                onClear={(index) => patch({ beforePhotos: draft.beforePhotos.filter((_, i) => i !== index) })}
                photos={draft.beforePhotos}
              />
              <input ref={beforeRef} type="file" accept="image/*" multiple className="hidden" onChange={(event) => onFiles("before", event.target.files)} />

              <UploadBlock
                title={tx(L("صور عامة للسيارة (اختياري)", "General car photos (optional)"))}
                count={draft.beautyPhotos.length}
                onPick={() => beautyRef.current?.click()}
                onClear={(index) => patch({ beautyPhotos: draft.beautyPhotos.filter((_, i) => i !== index) })}
                photos={draft.beautyPhotos}
              />
              <input ref={beautyRef} type="file" accept="image/*" multiple className="hidden" onChange={(event) => onFiles("beauty", event.target.files)} />
            </section>
          )}

          {step === 4 && (
            <section className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-night">{tx(L("سعّر الحادث بصدق", "Price the accident honestly"))}</h2>
                <p className="mt-1 text-sm text-muted">{tx(L("التقدير يخصم حسب الشدة والمناطق والإصلاح. الشفافية تحت 55٪ تمنع النشر.", "The estimate discounts by severity, zones, and repair. Transparency under 55% blocks publish."))}</p>
              </div>

              {market && (
                <div className="rounded-2xl border border-live/25 bg-[#fdf4f2] px-4 py-3 text-sm">
                  <p className="font-medium text-night">{tx(L("نطاق تقديري بعد الحادث", "Estimated band after damage"))}</p>
                  <p className="mt-1 text-live">
                    {money(Math.round(market * 0.9))} – {money(Math.round(market * 1.12))}
                  </p>
                </div>
              )}

              <label className="block">
                <span className="mb-2 block text-sm font-medium">{tx(L("سعر البيع", "Asking price"))}</span>
                <div className="relative">
                  <input className="field pe-16" inputMode="decimal" value={draft.price} onChange={(event) => patch({ price: event.target.value })} placeholder={tx(L("اكتب سعر البيع", "Enter asking price"))} />
                  <span className="absolute end-4 top-1/2 -translate-y-1/2 text-sm text-muted">OMR</span>
                </div>
              </label>

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
                <span className="mb-2 block text-sm font-medium">{tx(L("وصف الضرر بالتفصيل", "Describe the damage in detail"))}</span>
                <textarea
                  className="field"
                  rows={4}
                  value={draft.note}
                  onChange={(event) => patch({ note: event.target.value })}
                  placeholder={tx(L("مثال: صدمة أمامية يمنى، تم تغيير غطاء المحرك، الهيكل الأصلي لم يُقطع.", "Example: front-right impact, bonnet replaced, original structure not cut."))}
                />
              </label>

              <div className="space-y-2 rounded-2xl border border-line bg-sand/40 p-4">
                <p className="text-sm font-semibold text-night">{tx(L("موصى به لسيارات الحوادث", "Recommended for accident cars"))}</p>
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={draft.wantInspection} onChange={(event) => patch({ wantInspection: event.target.checked })} className="accent-[var(--color-brass)]" />
                  {tx(L("فحص هيكل بالنيابة قبل إتمام البيع", "Proxy structural inspection before the sale closes"))}
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={draft.wantValuation} onChange={(event) => patch({ wantValuation: event.target.checked })} className="accent-[var(--color-brass)]" />
                  {tx(L("تثمين معتمد يُعرض مع الإعلان", "Certified valuation shown with the listing"))}
                </label>
              </div>

              {score < 55 && (
                <p className="rounded-2xl border border-live/30 bg-[#fdf4f2] px-4 py-3 text-sm text-live">
                  {tx(L("أكمل خريطة الضرر وصور الضرر لرفع الشفافية فوق 55٪ قبل النشر.", "Complete the damage map and damage photos to raise transparency above 55% before publishing."))}
                </p>
              )}
            </section>
          )}

          <div className="mt-8 flex items-center gap-3 border-t border-line pt-4">
            {step > 0 && (
              <button type="button" onClick={back} className="btn-secondary px-4" aria-label={tx(L("رجوع", "Back"))}>
                {locale === "ar" ? "→" : "←"}
              </button>
            )}
            {step < STEPS.length - 1 ? (
              <button type="button" onClick={next} disabled={!canNext()} className={`btn-primary flex-1 ${!canNext() ? "opacity-40" : ""}`}>
                {tx(L("التالي", "Next"))}
              </button>
            ) : (
              <button type="button" onClick={publish} disabled={!canNext()} className={`flex-1 rounded-[0.85rem] bg-live px-4 py-3 font-semibold text-white ${!canNext() ? "opacity-40" : ""}`}>
                {tx(L("نشر إعلان الحادث", "Publish accident listing"))}
              </button>
            )}
          </div>
        </div>

        <aside className="hidden lg:block">
          <div className="surface-card sticky top-28 overflow-hidden">
            <div className="bg-live px-5 py-3 text-xs font-medium tracking-[0.14em] text-white">
              {tx(L("معاينة إعلان حادث", "Accident listing preview"))}
            </div>
            <div className="aspect-[16/10] bg-soft">
              {(draft.damagePhotos[0] || draft.beautyPhotos[0] || model?.image) ? (
                <img src={draft.damagePhotos[0] ?? draft.beautyPhotos[0] ?? model?.image} alt="" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-muted">{tx(L("صورة الضرر تظهر هنا", "Damage photo appears here"))}</div>
              )}
            </div>
            <div className="space-y-3 p-5">
              <p className="text-2xl font-bold text-night">{draft.price ? money(Number(draft.price) || 0) : "—"}</p>
              <p className="font-semibold text-night">{title || tx(L("سيارتك بحادث", "Your accident car"))}</p>
              <p className="text-sm text-muted">
                {[
                  draft.severity ? tx(damageSeverities.find((item) => item.id === draft.severity)?.name ?? L("", "")) : null,
                  draft.runs ? tx(L("تمشي", "Runs")) : tx(L("لا تمشي", "Does not run")),
                  cityLabel ? tx(cityLabel) : null,
                ]
                  .filter(Boolean)
                  .join(" · ")}
              </p>
              {draft.zones.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {draft.zones.slice(0, 6).map((id) => {
                    const zone = damageZones.find((item) => item.id === id);
                    return zone ? <span key={id} className="rounded-full bg-live/10 px-2.5 py-1 text-[11px] text-live">{tx(zone.name)}</span> : null;
                  })}
                </div>
              )}
              <p className="text-xs leading-relaxed text-muted">
                {tx(L(
                  "في سوق كارز تختار «حوادث» ثم تملأ حقولاً عامة. هنا الضرر خريطة، والصور إلزامية، والشفافية شرط للنشر.",
                  "On Sooq Cars you pick “Accidents” then fill generic fields. Here damage is a map, photos are required, and transparency gates publish.",
                ))}
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function UploadBlock({
  title,
  count,
  photos,
  onPick,
  onClear,
  accent = "brass",
}: {
  title: string;
  count: number;
  photos: string[];
  onPick: () => void;
  onClear: (index: number) => void;
  accent?: "brass" | "live";
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-night">{title}</p>
        <span className="text-xs text-muted">{count}</span>
      </div>
      <button
        type="button"
        onClick={onPick}
        className={`mb-3 flex w-full flex-col items-center justify-center rounded-[1.25rem] border border-dashed px-6 py-10 text-center ${
          accent === "live" ? "border-live/40 bg-[#fdf4f2]" : "border-brass/40 bg-soft/50"
        }`}
      >
        <span className={`flex h-12 w-12 items-center justify-center rounded-full text-xl text-white ${accent === "live" ? "bg-live" : "bg-brass"}`}>+</span>
        <span className="mt-2 text-sm font-semibold text-night">{title}</span>
      </button>
      {photos.length > 0 && (
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
          {photos.map((src, index) => (
            <div key={src} className="relative overflow-hidden rounded-xl border border-line">
              <img src={src} alt="" className="aspect-square w-full object-cover" />
              <button type="button" className="absolute end-1 top-1 rounded-full bg-paper/95 px-2 text-xs" onClick={() => onClear(index)}>
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
