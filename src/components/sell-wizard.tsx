"use client";

import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { BrandLogo, ModelName } from "@/components/brand-logo";
import { MakePicker } from "@/components/make-picker";
import { ModelThumb } from "@/components/model-thumb";
import { Receipt } from "@/components/ui";
import {
  bodyTypes,
  exteriorColors,
  interiorColors,
  mileageBands,
  sellMakes,
  valuateReadyListing,
  years,
} from "@/lib/sell-catalog";
import {
  aiStyles,
  conditions,
  exteriorFeatures,
  fuelTypes,
  insuranceStatuses,
  interiorFeatures,
  licenseStatuses,
  paymentMethods,
  regionalSpecs,
  seatCounts,
  techFeatures,
  type AiStyleId,
} from "@/lib/sell-options";
import {
  findGovernorate,
  findWilayat,
  locationLabel,
  omanGovernorates,
} from "@/lib/oman-locations";
import { usePrefs } from "@/lib/prefs";
import { useStore } from "@/lib/store";
import type { Copy } from "@/lib/types";

const L = (ar: string, en: string): Copy => ({ ar, en });

/** Priority order: identity → condition → mechanical → colours → docs → features → media → place → listing → deal. */
const STEPS = [
  { id: "make", label: L("الشركة", "Make") },
  { id: "model", label: L("الفئة", "Category") },
  { id: "year", label: L("سنة الصنع", "Year") },
  { id: "condition", label: L("الحالة", "Condition") },
  { id: "specs", label: L("مصدر المواصفات", "Specs origin") },
  { id: "mileage", label: L("الممشى", "Mileage") },
  { id: "trim", label: L("التجهيز", "Trim") },
  { id: "body", label: L("نوع الهيكل", "Body type") },
  { id: "seats", label: L("عدد المقاعد", "Seats") },
  { id: "fuel", label: L("نوع الوقود", "Fuel") },
  { id: "gearbox", label: L("ناقل الحركة", "Transmission") },
  { id: "cylinders", label: L("الإسطوانات", "Cylinders") },
  { id: "drive", label: L("نظام الدفع", "Drivetrain") },
  { id: "exterior", label: L("اللون الخارجي", "Exterior") },
  { id: "interior", label: L("اللون الداخلي", "Interior") },
  { id: "keys", label: L("المفاتيح", "Keys") },
  { id: "vin", label: L("رقم الشاصي", "VIN") },
  { id: "license", label: L("الترخيص", "License") },
  { id: "insurance", label: L("التأمين", "Insurance") },
  { id: "feat-interior", label: L("مواصفات داخلية", "Interior features") },
  { id: "feat-exterior", label: L("مواصفات خارجية", "Exterior features") },
  { id: "feat-tech", label: L("مواصفات تقنية", "Tech features") },
  { id: "photos", label: L("الصور", "Photos") },
  { id: "governorate", label: L("المحافظة", "Governorate") },
  { id: "wilayat", label: L("الولاية", "Wilayat") },
  { id: "village", label: L("القرية", "Village") },
  { id: "price", label: L("السعر", "Price") },
  { id: "payment", label: L("طريقة الدفع", "Payment") },
  { id: "deal", label: L("نوع الصفقة", "Deal") },
  { id: "phone", label: L("رقم الهاتف", "Phone") },
  { id: "title", label: L("عنوان العرض", "Listing headline") },
  { id: "description", label: L("الوصف", "Description") },
  { id: "publish", label: L("النشر", "Publish") },
] as const;

type StepId = (typeof STEPS)[number]["id"];
type Deal = "sell" | "trade" | "both";

type Draft = {
  makeId: string;
  modelId: string;
  year: number | null;
  condition: string;
  origin: string;
  mileageBand: string;
  trim: string;
  body: string;
  seats: string;
  fuel: string;
  gearbox: string;
  cylinders: string;
  drive: string;
  exterior: string;
  exteriorHex: string;
  interior: string;
  interiorHex: string;
  smartKeys: number;
  regularKeys: number;
  vin: string;
  showVin: boolean;
  license: string;
  insurance: string;
  interiorFeatureIds: string[];
  exteriorFeatureIds: string[];
  techFeatureIds: string[];
  photos: string[];
  videoUrl: string;
  hidePlate: boolean;
  governorateId: string;
  wilayatId: string;
  villageId: string;
  adTitle: string;
  note: string;
  price: string;
  priceNegotiable: boolean;
  payment: string;
  deal: Deal;
  phone: string;
  wantInspection: boolean;
  wantValuation: boolean;
};

const MIN_PHOTOS = 3;
const MAX_PHOTOS = 12;
const FEATURE_PREVIEW = 10;
const KEY_COUNTS = [0, 1, 2, 3, 4, 5] as const;
const TITLE_MAX = 100;
const NOTE_MAX = 4000;

const empty: Draft = {
  makeId: "",
  modelId: "",
  year: null,
  condition: "",
  origin: "",
  mileageBand: "",
  trim: "",
  body: "",
  seats: "",
  fuel: "",
  gearbox: "",
  cylinders: "",
  drive: "",
  exterior: "",
  exteriorHex: "",
  interior: "",
  interiorHex: "",
  smartKeys: 1,
  regularKeys: 1,
  vin: "",
  showVin: false,
  license: "",
  insurance: "",
  interiorFeatureIds: [],
  exteriorFeatureIds: [],
  techFeatureIds: [],
  photos: [],
  videoUrl: "",
  hidePlate: false,
  governorateId: "",
  wilayatId: "",
  villageId: "",
  adTitle: "",
  note: "",
  price: "",
  priceNegotiable: true,
  payment: "",
  deal: "sell",
  phone: "",
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

function CheckTile({
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
      className={`rounded-2xl border px-3 py-3 text-start text-sm transition ${
        active
          ? "border-teal bg-teal/10 text-night ring-1 ring-teal/30"
          : "border-line bg-paper text-night hover:border-brass/40"
      }`}
    >
      <span className="me-2 inline-flex h-5 w-5 items-center justify-center rounded-md border border-current text-[11px]">
        {active ? "✓" : ""}
      </span>
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

function optionLabel(list: { id: string; name: Copy }[], id: string, tx: (c: Copy) => string) {
  const found = list.find((item) => item.id === id);
  return found ? tx(found.name) : id;
}

export function SellWizard() {
  const { tx, money, locale } = usePrefs();
  const { addRequest } = useStore();
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<Draft>(empty);
  const [modelQuery, setModelQuery] = useState("");
  const [sent, setSent] = useState<string | null>(null);
  const [aiBusy, setAiBusy] = useState(false);
  const [plateBusy, setPlateBusy] = useState(false);
  const [expandInterior, setExpandInterior] = useState(false);
  const [expandExterior, setExpandExterior] = useState(false);
  const [expandTech, setExpandTech] = useState(false);
  const [previewAsk, setPreviewAsk] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const previewRef = useRef<HTMLElement | null>(null);
  const [showExteriorCatalog, setShowExteriorCatalog] = useState(false);
  const [showInteriorCatalog, setShowInteriorCatalog] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLInputElement>(null);
  const maxReached = useRef(0);

  const stepId = STEPS[step].id as StepId;
  const make = sellMakes.find((item) => item.id === draft.makeId);
  const model = make?.models.find((item) => item.id === draft.modelId);
  const mileage = mileageBands.find((item) => item.id === draft.mileageBand)?.value ?? 0;
  const governorate = findGovernorate(draft.governorateId);
  const wilayat = findWilayat(draft.governorateId, draft.wilayatId);
  const placeLabel = locationLabel({
    governorateId: draft.governorateId,
    wilayatId: draft.wilayatId,
    villageId: draft.villageId,
    locale,
  });

  const valuation = useMemo(() => {
    if (!draft.makeId || !draft.year || !draft.body) return null;
    return valuateReadyListing({
      makeId: draft.makeId,
      modelId: draft.modelId,
      year: draft.year,
      mileage,
      body: draft.body,
      origin: draft.origin || "gcc",
      condition: draft.condition,
      fuel: draft.fuel,
      gearbox: draft.gearbox,
      trim: draft.trim,
      cylinders: draft.cylinders,
      drive: draft.drive,
      smartKeys: draft.smartKeys,
      regularKeys: draft.regularKeys,
      interiorFeatureCount: draft.interiorFeatureIds.length,
      exteriorFeatureCount: draft.exteriorFeatureIds.length,
      techFeatureCount: draft.techFeatureIds.length,
    });
  }, [
    draft.makeId,
    draft.modelId,
    draft.year,
    draft.body,
    draft.origin,
    draft.condition,
    draft.fuel,
    draft.gearbox,
    draft.trim,
    draft.cylinders,
    draft.drive,
    draft.smartKeys,
    draft.regularKeys,
    draft.interiorFeatureIds.length,
    draft.exteriorFeatureIds.length,
    draft.techFeatureIds.length,
    mileage,
  ]);

  const enteredPrice = Number(draft.price) || 0;
  const priceVsMarket =
    valuation && enteredPrice > 0
      ? enteredPrice < valuation.low
        ? "below"
        : enteredPrice > valuation.high
          ? "above"
          : "fair"
      : null;

  const autoTitle = [make ? tx(make.name) : "", model ? tx(model.name) : "", draft.year ?? ""]
    .filter(Boolean)
    .join(" ");
  const title = draft.adTitle.trim() || autoTitle;

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
    switch (stepId) {
      case "make":
        return Boolean(draft.makeId);
      case "model":
        return Boolean(draft.modelId);
      case "year":
        return Boolean(draft.year);
      case "condition":
        return Boolean(draft.condition);
      case "specs":
        return Boolean(draft.origin);
      case "mileage":
        return Boolean(draft.mileageBand);
      case "trim":
        return Boolean(draft.trim);
      case "body":
        return Boolean(draft.body);
      case "seats":
        return Boolean(draft.seats);
      case "fuel":
        return Boolean(draft.fuel);
      case "gearbox":
        return Boolean(draft.gearbox);
      case "cylinders":
        return Boolean(draft.cylinders);
      case "drive":
        return Boolean(draft.drive);
      case "exterior":
        return Boolean(draft.exterior) || Boolean(draft.exteriorHex);
      case "interior":
        return Boolean(draft.interior) || Boolean(draft.interiorHex);
      case "keys":
        return draft.smartKeys + draft.regularKeys >= 1;
      case "vin":
        return true;
      case "license":
        return Boolean(draft.license);
      case "insurance":
        return Boolean(draft.insurance);
      case "feat-interior":
      case "feat-exterior":
      case "feat-tech":
        return true;
      case "photos":
        return draft.photos.length >= MIN_PHOTOS;
      case "governorate":
        return Boolean(draft.governorateId);
      case "wilayat":
        return Boolean(draft.wilayatId);
      case "village":
        return Boolean(draft.villageId);
      case "title":
        return draft.adTitle.trim().length >= 6;
      case "description":
        return true;
      case "price":
        return Boolean(draft.price && Number(draft.price) > 0);
      case "payment":
        return Boolean(draft.payment);
      case "deal":
        return Boolean(draft.deal);
      case "phone":
        return draft.phone.replace(/\D/g, "").length >= 8;
      case "publish":
        return (
          Boolean(draft.villageId) &&
          draft.photos.length >= MIN_PHOTOS &&
          Boolean(draft.price && Number(draft.price) > 0) &&
          draft.phone.replace(/\D/g, "").length >= 8
        );
      default:
        return false;
    }
  }

  function choose<K extends keyof Draft>(key: K, value: Draft[K], thenAdvance = true) {
    patch({ [key]: value } as Partial<Draft>);
    if (thenAdvance) {
      window.setTimeout(() => go(step + 1), 120);
    }
  }

  function toggleFeature(
    key: "interiorFeatureIds" | "exteriorFeatureIds" | "techFeatureIds",
    id: string,
  ) {
    setDraft((prev) => {
      const list = prev[key];
      return {
        ...prev,
        [key]: list.includes(id) ? list.filter((item) => item !== id) : [...list, id],
      };
    });
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
      seats: found?.body === "coupe" ? "2" : found?.body === "pickup" || found?.body === "suv" ? "7" : "5",
      cylinders:
        found?.body === "coupe" || id === "mustang" || id === "911"
          ? "8"
          : found?.body === "suv"
            ? "6"
            : "4",
      drive: found?.body === "suv" || found?.body === "pickup" ? "awd" : "fwd",
      fuel: id === "seal" || id.includes("song") ? "ev" : "petrol",
    });
    window.setTimeout(() => go(2), 120);
  }

  async function onFiles(files: FileList | null) {
    if (!files?.length) return;
    const room = MAX_PHOTOS - draft.photos.length;
    if (room <= 0) return;
    let urls = Array.from(files).slice(0, room).map((file) => URL.createObjectURL(file));
    if (draft.hidePlate) {
      setPlateBusy(true);
      try {
        const { obscurePlatesOnImages } = await import("@/lib/plate-obscure");
        urls = await obscurePlatesOnImages(urls);
      } finally {
        setPlateBusy(false);
      }
    }
    patch({ photos: [...draft.photos, ...urls] });
  }

  async function toggleHidePlate(checked: boolean) {
    patch({ hidePlate: checked });
    if (!checked || !draft.photos.length) return;
    setPlateBusy(true);
    try {
      const { obscurePlatesOnImages } = await import("@/lib/plate-obscure");
      const next = await obscurePlatesOnImages(draft.photos);
      patch({ photos: next, hidePlate: true });
    } finally {
      setPlateBusy(false);
    }
  }

  async function generateTitleAi() {
    setAiBusy(true);
    try {
      const res = await fetch("/api/ai/listing-assist", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          locale,
          action: "title",
          style: "warm",
          sectionId: "cars-sale",
          facts: {
            make: make ? tx(make.name) : "",
            model: model ? tx(model.name) : "",
            year: draft.year,
            trim: draft.trim,
          },
        }),
      });
      const json = (await res.json()) as { text?: string };
      if (json.text) patch({ adTitle: json.text.slice(0, TITLE_MAX) });
    } finally {
      setAiBusy(false);
    }
  }

  function onVideo(files: FileList | null) {
    const file = files?.[0];
    if (!file) return;
    patch({ videoUrl: URL.createObjectURL(file) });
  }

  function decodeVin() {
    if (!draft.vin.trim()) return;
    patch({
      year: draft.year ?? 2019,
      origin: draft.origin || "agency",
      showVin: true,
    });
  }

  function ensureTitle() {
    if (!draft.adTitle.trim() && autoTitle) {
      const suffix = locale === "ar" ? " للبيع" : " for sale";
      patch({ adTitle: `${autoTitle}${suffix}`.slice(0, TITLE_MAX) });
    }
  }

  async function generateAi(style: AiStyleId | "skip") {
    if (style === "skip") {
      advance();
      return;
    }
    setAiBusy(true);
    try {
      const res = await fetch("/api/ai/listing-description", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          locale,
          style,
          title,
          make: make ? tx(make.name) : "",
          model: model ? tx(model.name) : "",
          year: draft.year,
          condition: optionLabel(conditions, draft.condition, tx),
          mileage: draft.mileageBand
            ? `${mileage.toLocaleString()} ${locale === "ar" ? "كم" : "km"}`
            : "",
          origin: optionLabel(regionalSpecs, draft.origin, tx),
          trim: draft.trim,
          body: bodyTypes.find((b) => b.id === draft.body)
            ? tx(bodyTypes.find((b) => b.id === draft.body)!.name)
            : draft.body,
          seats: optionLabel(seatCounts, draft.seats, tx),
          fuel: optionLabel(fuelTypes, draft.fuel, tx),
          gearbox:
            draft.gearbox === "auto"
              ? locale === "ar"
                ? "أوتوماتيك"
                : "Automatic"
              : draft.gearbox === "manual"
                ? locale === "ar"
                  ? "عادي"
                  : "Manual"
                : draft.gearbox,
          cylinders: draft.cylinders,
          drive: draft.drive,
          exterior: exteriorColors.find((c) => c.id === draft.exterior)
            ? tx(exteriorColors.find((c) => c.id === draft.exterior)!.name)
            : draft.exterior,
          interior: interiorColors.find((c) => c.id === draft.interior)
            ? tx(interiorColors.find((c) => c.id === draft.interior)!.name)
            : draft.interior,
          license: optionLabel(licenseStatuses, draft.license, tx),
          insurance: optionLabel(insuranceStatuses, draft.insurance, tx),
          interiorFeatures: draft.interiorFeatureIds.map((id) => optionLabel(interiorFeatures, id, tx)),
          exteriorFeatures: draft.exteriorFeatureIds.map((id) => optionLabel(exteriorFeatures, id, tx)),
          techFeatures: draft.techFeatureIds.map((id) => optionLabel(techFeatures, id, tx)),
          smartKeys: draft.smartKeys,
          regularKeys: draft.regularKeys,
          price: draft.price,
          priceNegotiable: draft.priceNegotiable,
          payment: optionLabel(paymentMethods, draft.payment, tx),
          location: placeLabel,
          vin: draft.vin,
        }),
      });
      const json = (await res.json()) as { ok?: boolean; text?: string };
      if (json.ok && json.text) patch({ note: json.text.slice(0, NOTE_MAX) });
    } finally {
      setAiBusy(false);
    }
  }

  function publish() {
    const created = addRequest({
      kind: "sell",
      title: title || tx(L("إعلان سيارة", "Car listing")),
      detail: [
        draft.condition,
        draft.trim,
        draft.origin,
        `${mileage} km`,
        `seats:${draft.seats}`,
        `smartKeys:${draft.smartKeys}`,
        `regularKeys:${draft.regularKeys}`,
        draft.license,
        draft.insurance,
        `${draft.price} OMR`,
        draft.priceNegotiable ? "negotiable" : "fixed-price",
        draft.payment,
        placeLabel || null,
        draft.deal,
        `+968 ${draft.phone}`,
        draft.hidePlate ? "hide-plate" : null,
        draft.videoUrl ? "video" : null,
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

  function requestPublish() {
    if (!canNext()) return;
    setPreviewAsk(true);
  }

  function confirmPreviewThenStay() {
    setPreviewAsk(false);
    setPreviewMode(true);
    window.setTimeout(() => {
      previewRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 80);
  }

  function confirmPublishNow() {
    setPreviewAsk(false);
    setPreviewMode(false);
    publish();
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
            <span className="font-semibold text-night">{tx(STEPS[step].label)}</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-line">
            <div className="h-full rounded-full bg-brass transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
          <ol className="flex gap-1 overflow-x-auto pb-1">
            {STEPS.map((item, index) => {
              const done = index < step;
              const active = index === step;
              const reachable = index <= maxReached.current || index <= step;
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    disabled={!reachable}
                    onClick={() => reachable && go(index)}
                    title={tx(item.label)}
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

          {autoTitle && (
            <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-line bg-soft/70 px-3 py-1.5 text-sm text-night">
              {make && <BrandLogo id={make.id} mark={make.mark} name={tx(make.name)} className="h-7 w-7 shrink-0" />}
              <span className="truncate font-medium">{title}</span>
            </div>
          )}
        </div>
      </div>

      <div className="mx-auto grid w-full max-w-6xl gap-6 px-5 py-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,0.75fr)]">
        <div className="surface-card min-w-0 overflow-x-clip p-4 md:p-6">
          {stepId === "make" && <MakePicker selectedId={draft.makeId} onSelect={pickMake} />}

          {stepId === "model" && make && (
            <Question
              title={tx(L("اختر الفئة", "Choose the category"))}
              lead={tx(L("اختيار واحد ينقلك مباشرة للسنة.", "One tap moves you straight to the year."))}
            >
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
                      alt={locale === "ar" ? item.name.ar : item.name.en}
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

          {stepId === "year" && (
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

          {stepId === "condition" && (
            <Question title={tx(L("الحالة", "Condition"))} lead={tx(L("جديد أم مستعمل؟", "New or used?"))}>
              <div className="grid grid-cols-2 gap-2">
                {conditions.map((item) => (
                  <Chip key={item.id} active={draft.condition === item.id} onClick={() => choose("condition", item.id)}>
                    {tx(item.name)}
                  </Chip>
                ))}
              </div>
            </Question>
          )}

          {stepId === "specs" && (
            <Question
              title={tx(L("مصدر المواصفات", "Specs origin"))}
              lead={tx(L("سوق التصنيع أو مواصفات الوكالة — بمصطلح دقيق.", "Build market or local dealer specs — precise terms."))}
            >
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {regionalSpecs.map((item) => (
                  <Chip key={item.id} active={draft.origin === item.id} onClick={() => choose("origin", item.id)}>
                    {tx(item.name)}
                  </Chip>
                ))}
              </div>
            </Question>
          )}

          {stepId === "mileage" && (
            <Question
              title={tx(L("الممشى", "Mileage"))}
              lead={tx(L("على الجوال قائمة منسدلة — وعلى الشاشات الأوسع أزرار سريعة.", "Dropdown on phone — quick chips on larger screens."))}
            >
              <label className="block sm:hidden">
                <select
                  className="field"
                  value={draft.mileageBand}
                  onChange={(event) => {
                    const value = event.target.value;
                    if (!value) return;
                    choose("mileageBand", value);
                  }}
                >
                  <option value="">{tx(L("اختر الممشى", "Select mileage"))}</option>
                  {mileageBands.map((band) => (
                    <option key={band.id} value={band.id}>
                      {tx(band.label)}
                    </option>
                  ))}
                </select>
              </label>
              <div className="hidden max-h-[50vh] grid-cols-2 gap-2 overflow-y-auto sm:grid sm:grid-cols-3 md:grid-cols-4">
                {mileageBands.map((band) => (
                  <Chip
                    key={band.id}
                    active={draft.mileageBand === band.id}
                    onClick={() => choose("mileageBand", band.id)}
                  >
                    {tx(band.label)}
                  </Chip>
                ))}
              </div>
            </Question>
          )}

          {stepId === "trim" && (
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

          {stepId === "body" && (
            <Question
              title={tx(L("نوع الهيكل", "Body type"))}
              lead={tx(L("نقترح هيكلاً من الفئة — يمكنك تغييره.", "Suggested from the category — you can change it."))}
            >
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

          {stepId === "seats" && (
            <Question title={tx(L("عدد المقاعد", "Number of seats"))}>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {seatCounts.map((item) => (
                  <Chip key={item.id} active={draft.seats === item.id} onClick={() => choose("seats", item.id)}>
                    {tx(item.name)}
                  </Chip>
                ))}
              </div>
            </Question>
          )}

          {stepId === "fuel" && (
            <Question title={tx(L("نوع الوقود", "Fuel type"))}>
              <div className="flex flex-wrap gap-2">
                {fuelTypes.map((item) => (
                  <Chip key={item.id} active={draft.fuel === item.id} onClick={() => choose("fuel", item.id)}>
                    {tx(item.name)}
                  </Chip>
                ))}
              </div>
            </Question>
          )}

          {stepId === "gearbox" && (
            <Question title={tx(L("ناقل الحركة", "Transmission"))}>
              <div className="grid grid-cols-2 gap-2">
                <Chip active={draft.gearbox === "auto"} onClick={() => choose("gearbox", "auto")}>
                  {tx(L("أوتوماتيك", "Automatic"))}
                </Chip>
                <Chip active={draft.gearbox === "manual"} onClick={() => choose("gearbox", "manual")}>
                  {tx(L("يدوي / عادي", "Manual"))}
                </Chip>
              </div>
            </Question>
          )}

          {stepId === "cylinders" && (
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

          {stepId === "drive" && (
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

          {stepId === "exterior" && (
            <Question
              title={tx(L("اللون الخارجي", "Exterior colour"))}
              lead={tx(L("اختر من الكتالوج أو افتح منتقي الألوان / أدخل كود اللون.", "Pick from the catalog, or open the picker / enter a color code."))}
            >
              <div className="flex flex-wrap gap-3">
                {(showExteriorCatalog ? exteriorColors : exteriorColors.slice(0, 12)).map((color) => (
                  <button
                    key={color.id}
                    type="button"
                    onClick={() => {
                      patch({ exterior: color.id, exteriorHex: color.hex });
                      window.setTimeout(() => go(step + 1), 120);
                    }}
                    className="text-center"
                  >
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
              <button
                type="button"
                className="text-sm font-medium text-teal"
                onClick={() => setShowExteriorCatalog((v) => !v)}
              >
                {showExteriorCatalog
                  ? tx(L("طي الكتالوج", "Collapse catalog"))
                  : tx(L("فتح كتالوج الألوان الكامل", "Open full color catalog"))}
              </button>
              <div className="rounded-2xl border border-line bg-soft/40 p-4">
                <p className="mb-3 text-sm font-medium text-night">{tx(L("لون مخصص", "Custom colour"))}</p>
                <div className="flex flex-wrap items-center gap-3">
                  <input
                    type="color"
                    value={draft.exteriorHex || "#092d24"}
                    onChange={(event) => patch({ exterior: "custom", exteriorHex: event.target.value })}
                    className="h-11 w-14 cursor-pointer rounded-xl border border-line bg-paper"
                    aria-label={tx(L("منتقي اللون", "Colour picker"))}
                  />
                  <input
                    className="field max-w-[10rem] font-mono uppercase"
                    value={draft.exteriorHex}
                    placeholder="#1A1A1A"
                    onChange={(event) => {
                      const hex = event.target.value.trim();
                      patch({ exterior: "custom", exteriorHex: hex });
                    }}
                  />
                  <span
                    className="h-11 w-11 rounded-full border border-line"
                    style={{ background: /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(draft.exteriorHex) ? draft.exteriorHex : "#ddd" }}
                  />
                </div>
              </div>
            </Question>
          )}

          {stepId === "interior" && (
            <Question
              title={tx(L("اللون الداخلي", "Interior colour"))}
              lead={tx(L("اختر من الكتالوج أو أدخل كود لون مخصص.", "Pick from the catalog or enter a custom color code."))}
            >
              <div className="flex flex-wrap gap-3">
                {(showInteriorCatalog ? interiorColors : interiorColors.slice(0, 10)).map((color) => (
                  <button
                    key={color.id}
                    type="button"
                    onClick={() => {
                      patch({ interior: color.id, interiorHex: color.hex });
                      window.setTimeout(() => go(step + 1), 120);
                    }}
                    className="text-center"
                  >
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
              <button
                type="button"
                className="text-sm font-medium text-teal"
                onClick={() => setShowInteriorCatalog((v) => !v)}
              >
                {showInteriorCatalog
                  ? tx(L("طي الكتالوج", "Collapse catalog"))
                  : tx(L("فتح كتالوج الألوان الكامل", "Open full color catalog"))}
              </button>
              <div className="rounded-2xl border border-line bg-soft/40 p-4">
                <p className="mb-3 text-sm font-medium text-night">{tx(L("لون مخصص", "Custom colour"))}</p>
                <div className="flex flex-wrap items-center gap-3">
                  <input
                    type="color"
                    value={draft.interiorHex || "#1a1a1a"}
                    onChange={(event) => patch({ interior: "custom", interiorHex: event.target.value })}
                    className="h-11 w-14 cursor-pointer rounded-xl border border-line bg-paper"
                  />
                  <input
                    className="field max-w-[10rem] font-mono uppercase"
                    value={draft.interiorHex}
                    placeholder="#1A1A1A"
                    onChange={(event) => patch({ interior: "custom", interiorHex: event.target.value.trim() })}
                  />
                  <span
                    className="h-11 w-11 rounded-full border border-line"
                    style={{ background: /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(draft.interiorHex) ? draft.interiorHex : "#ddd" }}
                  />
                </div>
              </div>
            </Question>
          )}

          {stepId === "keys" && (
            <Question
              title={tx(L("المفاتيح", "Keys"))}
              lead={tx(
                L(
                  "حدّد عدد المفاتيح الذكية والعادية. الإجمالي مفتاح واحد على الأقل، ثم اضغط التالي.",
                  "Set smart and regular key counts. Total must be at least one, then press Next.",
                ),
              )}
            >
              <div className="space-y-5">
                <div>
                  <p className="mb-2 text-sm font-medium text-night">{tx(L("مفاتيح ذكية", "Smart keys"))}</p>
                  <div className="flex flex-wrap gap-2">
                    {KEY_COUNTS.map((n) => (
                      <Chip key={`smart-${n}`} active={draft.smartKeys === n} onClick={() => patch({ smartKeys: n })}>
                        {n}
                      </Chip>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="mb-2 text-sm font-medium text-night">{tx(L("مفاتيح عادية", "Regular keys"))}</p>
                  <div className="flex flex-wrap gap-2">
                    {KEY_COUNTS.map((n) => (
                      <Chip
                        key={`regular-${n}`}
                        active={draft.regularKeys === n}
                        onClick={() => patch({ regularKeys: n })}
                      >
                        {n}
                      </Chip>
                    ))}
                  </div>
                </div>
                <p className="text-sm text-muted">
                  {tx(L("الإجمالي", "Total"))}: {draft.smartKeys + draft.regularKeys}
                </p>
              </div>
            </Question>
          )}

          {stepId === "vin" && (
            <Question
              title={tx(L("رقم الشاصي", "Chassis / VIN"))}
              lead={tx(L("اختياري — يسرّع المراجعة. يمكنك التخطي.", "Optional — speeds review. You can skip."))}
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
              <p className="text-xs text-teal">
                {tx(L("أين أجد رقم الشاصي؟ على لوحة المحرك أو بطاقة الملكية.", "Where is the VIN? On the engine bay plate or registration card."))}
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  className="btn-secondary"
                  disabled={!draft.vin.trim()}
                  onClick={() => {
                    decodeVin();
                    window.setTimeout(advance, 120);
                  }}
                >
                  {tx(L("فك الرمز والمتابعة", "Decode & continue"))}
                </button>
                <button type="button" className="btn-primary" onClick={advance}>
                  {draft.vin.trim() ? tx(L("حفظ والمتابعة", "Save & continue")) : tx(L("تخطي", "Skip"))}
                </button>
              </div>
            </Question>
          )}

          {stepId === "license" && (
            <Question title={tx(L("الترخيص", "Licensing"))}>
              <div className="grid grid-cols-2 gap-2">
                {licenseStatuses.map((item) => (
                  <Chip key={item.id} active={draft.license === item.id} onClick={() => choose("license", item.id)}>
                    {tx(item.name)}
                  </Chip>
                ))}
              </div>
            </Question>
          )}

          {stepId === "insurance" && (
            <Question title={tx(L("التأمين", "Insurance"))}>
              <div className="grid gap-2 sm:grid-cols-3">
                {insuranceStatuses.map((item) => (
                  <Chip
                    key={item.id}
                    active={draft.insurance === item.id}
                    onClick={() => choose("insurance", item.id)}
                  >
                    {tx(item.name)}
                  </Chip>
                ))}
              </div>
            </Question>
          )}

          {stepId === "feat-interior" && (
            <Question
              title={tx(L("مواصفات داخلية", "Interior features"))}
              lead={tx(L("نعرض حتى 10 أولًا — يمكنك التمديد لرؤية التقنيات الأحدث.", "We show up to 10 first — expand for newer tech."))}
            >
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {(expandInterior ? interiorFeatures : interiorFeatures.slice(0, FEATURE_PREVIEW)).map((item) => (
                  <CheckTile
                    key={item.id}
                    active={draft.interiorFeatureIds.includes(item.id)}
                    onClick={() => toggleFeature("interiorFeatureIds", item.id)}
                  >
                    {tx(item.name)}
                  </CheckTile>
                ))}
              </div>
              {interiorFeatures.length > FEATURE_PREVIEW && (
                <button type="button" className="text-sm font-medium text-teal" onClick={() => setExpandInterior((v) => !v)}>
                  {expandInterior
                    ? tx(L("عرض أقل", "Show less"))
                    : tx(L(`عرض المزيد (${interiorFeatures.length - FEATURE_PREVIEW})`, `Show more (${interiorFeatures.length - FEATURE_PREVIEW})`))}
                </button>
              )}
            </Question>
          )}

          {stepId === "feat-exterior" && (
            <Question
              title={tx(L("مواصفات خارجية", "Exterior features"))}
              lead={tx(L("حتى 10 ظاهرة أولًا مع إمكانية التمديد.", "Up to 10 shown first, with expand."))}
            >
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {(expandExterior ? exteriorFeatures : exteriorFeatures.slice(0, FEATURE_PREVIEW)).map((item) => (
                  <CheckTile
                    key={item.id}
                    active={draft.exteriorFeatureIds.includes(item.id)}
                    onClick={() => toggleFeature("exteriorFeatureIds", item.id)}
                  >
                    {tx(item.name)}
                  </CheckTile>
                ))}
              </div>
              {exteriorFeatures.length > FEATURE_PREVIEW && (
                <button type="button" className="text-sm font-medium text-teal" onClick={() => setExpandExterior((v) => !v)}>
                  {expandExterior
                    ? tx(L("عرض أقل", "Show less"))
                    : tx(L(`عرض المزيد (${exteriorFeatures.length - FEATURE_PREVIEW})`, `Show more (${exteriorFeatures.length - FEATURE_PREVIEW})`))}
                </button>
              )}
            </Question>
          )}

          {stepId === "feat-tech" && (
            <Question
              title={tx(L("مواصفات تقنية", "Technical features"))}
              lead={tx(L("أمان وتقنية حديثة — 10 أولًا ثم التمديد.", "Modern safety & tech — 10 first, then expand."))}
            >
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {(expandTech ? techFeatures : techFeatures.slice(0, FEATURE_PREVIEW)).map((item) => (
                  <CheckTile
                    key={item.id}
                    active={draft.techFeatureIds.includes(item.id)}
                    onClick={() => toggleFeature("techFeatureIds", item.id)}
                  >
                    {tx(item.name)}
                  </CheckTile>
                ))}
              </div>
              {techFeatures.length > FEATURE_PREVIEW && (
                <button type="button" className="text-sm font-medium text-teal" onClick={() => setExpandTech((v) => !v)}>
                  {expandTech
                    ? tx(L("عرض أقل", "Show less"))
                    : tx(L(`عرض المزيد (${techFeatures.length - FEATURE_PREVIEW})`, `Show more (${techFeatures.length - FEATURE_PREVIEW})`))}
                </button>
              )}
            </Question>
          )}

          {stepId === "photos" && (
            <Question
              title={`${tx(L("الصور والفيديو", "Photos & video"))} (${draft.photos.length}/${MAX_PHOTOS})`}
              lead={tx(
                L(
                  "تنبيه: ارفع 3 صور على الأقل. صور أكثر تعني فرص بيع أكبر.",
                  "Notice: upload at least 3 photos. More photos mean better selling odds.",
                ),
              )}
            >
              <div className="rounded-2xl border border-dashed border-brass/40 bg-sand/30 px-4 py-3 text-sm text-night">
                {tx(L("الحد الأدنى 3 صور للمتابعة — الصورة الأولى هي الغلاف.", "Minimum 3 photos to continue — the first is the cover."))}
              </div>
              <div className="grid gap-3 sm:grid-cols-[120px_1fr]">
                <button
                  type="button"
                  onClick={() => videoRef.current?.click()}
                  className="flex aspect-square flex-col items-center justify-center rounded-[1.25rem] border border-dashed border-line bg-soft/40 text-center"
                >
                  <span className="text-2xl">🎬</span>
                  <span className="mt-1 text-xs font-medium text-night">
                    {draft.videoUrl ? tx(L("فيديو جاهز", "Video ready")) : tx(L("فيديو", "Video"))}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="flex w-full flex-col items-center justify-center rounded-[1.25rem] border border-dashed border-brass/50 bg-soft/50 px-6 py-10 text-center"
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brass text-2xl text-white">+</span>
                  <span className="mt-3 font-semibold text-night">
                    {draft.photos.length
                      ? tx(L("أضف المزيد من الصور", "Add more photos"))
                      : tx(L("أضف صور السيارة", "Add car photos"))}
                  </span>
                  <span className="mt-1 text-xs text-muted">
                    {tx(L("jpg أو png · الحد الأدنى 3 · حتى 12", "jpg or png · min 3 · up to 12"))}
                  </span>
                </button>
              </div>
              <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => onFiles(e.target.files)} />
              <input ref={videoRef} type="file" accept="video/*" className="hidden" onChange={(e) => onVideo(e.target.files)} />

              <label className="flex flex-col gap-2 rounded-2xl border border-line bg-soft/40 px-4 py-3 text-sm">
                <span className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={draft.hidePlate}
                    disabled={plateBusy}
                    onChange={(event) => void toggleHidePlate(event.target.checked)}
                    className="accent-[var(--color-brass)]"
                  />
                  {tx(L("إخفاء رقم اللوحة بشعار BHD", "Hide plate number with BHD mark"))}
                </span>
                <span className="text-xs text-muted">
                  {plateBusy
                    ? tx(L("جارٍ تضليل اللوحة واستبدالها بالشعار…", "Obscuring plate and applying the logo…"))
                    : tx(
                        L(
                          "عند التفعيل يُضلَّل شريط اللوحة الشائع في الصور ويُستبدل بشعار الموقع تلقائيًا.",
                          "When enabled, the common plate band is obscured and replaced with the site logo automatically.",
                        ),
                      )}
                </span>
              </label>

              {draft.photos.length > 0 && (
                <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
                  {draft.photos.map((src, index) => (
                    <div key={src} className="relative overflow-hidden rounded-2xl border border-line">
                      <img src={src} alt="" className="aspect-square w-full object-cover" />
                      {index === 0 && (
                        <span className="absolute start-2 top-2 rounded-full bg-night px-2 py-0.5 text-[10px] text-ivory">
                          {tx(L("صورة الغلاف", "Cover"))}
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

              <div className="rounded-2xl border border-line bg-soft/50 px-4 py-3 text-sm text-muted">
                {draft.photos.length === 0
                  ? tx(L("لم تُرفع أي صورة بعد. ارفع 3 صور على الأقل للمتابعة.", "No photos yet. Upload at least 3 to continue."))
                  : draft.photos.length < MIN_PHOTOS
                    ? tx(
                        L(
                          `لديك ${draft.photos.length} من 3 — أضف ${MIN_PHOTOS - draft.photos.length} على الأقل ثم اضغط التالي.`,
                          `You have ${draft.photos.length} of 3 — add at least ${MIN_PHOTOS - draft.photos.length} more, then Next.`,
                        ),
                      )
                    : tx(
                        L(
                          `جاهز (${draft.photos.length} صور). يمكنك رفع المزيد أو الضغط على التالي.`,
                          `Ready (${draft.photos.length} photos). Add more or press Next.`,
                        ),
                      )}
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  className="btn-secondary"
                  disabled={draft.photos.length >= MAX_PHOTOS}
                  onClick={() => fileRef.current?.click()}
                >
                  {tx(L("رفع المزيد", "Upload more"))}
                </button>
                <button
                  type="button"
                  className={`btn-primary ${draft.photos.length < MIN_PHOTOS ? "opacity-40" : ""}`}
                  disabled={draft.photos.length < MIN_PHOTOS}
                  onClick={advance}
                >
                  {tx(L("الاستمرار", "Continue"))}
                </button>
              </div>
            </Question>
          )}

          {stepId === "governorate" && (
            <Question title={tx(L("المحافظة", "Governorate"))} lead={tx(L("اختر المحافظة أولًا.", "Choose the governorate first."))}>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {omanGovernorates.map((item) => (
                  <Chip
                    key={item.id}
                    active={draft.governorateId === item.id}
                    onClick={() => {
                      patch({ governorateId: item.id, wilayatId: "", villageId: "" });
                      window.setTimeout(advance, 120);
                    }}
                  >
                    {tx(item.name)}
                  </Chip>
                ))}
              </div>
            </Question>
          )}

          {stepId === "wilayat" && governorate && (
            <Question title={tx(L("الولاية", "Wilayat"))} lead={tx(governorate.name)}>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {governorate.wilayats.map((item) => (
                  <Chip
                    key={item.id}
                    active={draft.wilayatId === item.id}
                    onClick={() => {
                      patch({ wilayatId: item.id, villageId: "" });
                      window.setTimeout(advance, 120);
                    }}
                  >
                    {tx(item.name)}
                  </Chip>
                ))}
              </div>
            </Question>
          )}

          {stepId === "village" && wilayat && (
            <Question title={tx(L("القرية / المنطقة", "Village / area"))} lead={tx(wilayat.name)}>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {wilayat.villages.map((item) => (
                  <Chip key={item.id} active={draft.villageId === item.id} onClick={() => choose("villageId", item.id)}>
                    {tx(item.name)}
                  </Chip>
                ))}
              </div>
            </Question>
          )}

          {stepId === "title" && (
            <Question
              title={tx(L("عنوان العرض", "Listing headline"))}
              lead={tx(
                L(
                  "قبل النشر: ولّد العنوان من بياناتك بلغة الواجهة فقط، أو اكتبه وعدّله.",
                  "Before publish: generate the title from your facts in the UI language only, or write and edit.",
                ),
              )}
            >
              <div className="rounded-2xl border border-teal/30 bg-teal/5 px-4 py-3 text-sm text-night">
                {tx(
                  L(
                    `لغة التوليد = لغة الواجهة (${locale === "ar" ? "العربية" : "English"}) فقط.`,
                    `Generation language = UI language (${locale === "ar" ? "Arabic" : "English"}) only.`,
                  ),
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                <button type="button" className="btn-teal" disabled={aiBusy} onClick={() => void generateTitleAi()}>
                  {aiBusy
                    ? tx(L("جارٍ التوليد…", "Generating…"))
                    : tx(L("توليد عنوان مرح بالذكاء الاصطناعي", "Generate a cheerful AI title"))}
                </button>
                <button type="button" className="btn-secondary" onClick={ensureTitle}>
                  {tx(L("اقتراح سريع من البيانات", "Quick suggestion from facts"))}
                </button>
              </div>
              <label className="block space-y-2">
                <input
                  className="field"
                  value={draft.adTitle}
                  maxLength={TITLE_MAX}
                  onChange={(event) => patch({ adTitle: event.target.value.slice(0, TITLE_MAX) })}
                  placeholder={
                    autoTitle
                      ? `${autoTitle}${locale === "ar" ? " للبيع" : " for sale"}`
                      : tx(L("مثال: تويوتا كامري 2021 للبيع", "e.g. Toyota Camry 2021 for sale"))
                  }
                />
                <span className="block text-xs text-muted">
                  {draft.adTitle.length} / {TITLE_MAX} · {tx(L("يمكنك التعديل بحرية بعد التوليد", "You can edit freely after generation"))}
                </span>
              </label>
            </Question>
          )}

          {stepId === "description" && (
            <Question
              title={tx(L("تفاصيل العرض", "Listing details"))}
              lead={tx(
                L(
                  "الخطوة الأخيرة قبل النشر: توليد نص حقيقي من المعلومات — بلغة الواجهة فقط.",
                  "Last step before publish: real text from your facts — UI language only.",
                ),
              )}
            >
              <div className="rounded-2xl border border-line bg-soft/50 p-4">
                <p className="mb-3 text-sm font-semibold text-night">
                  {tx(L("مساعد صياغة مرحة", "Cheerful drafting assistant"))}
                </p>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  <button
                    type="button"
                    disabled={aiBusy}
                    onClick={() => void generateAi("casual")}
                    className="rounded-2xl border border-teal/40 bg-teal/10 px-3 py-3 text-sm font-medium text-night"
                  >
                    ✦ {tx(L("مرح وودّي", "Cheerful & warm"))}
                  </button>
                  {aiStyles
                    .filter((style) => style.id !== "casual")
                    .map((style) => (
                      <button
                        key={style.id}
                        type="button"
                        disabled={aiBusy}
                        onClick={() => void generateAi(style.id)}
                        className="rounded-2xl border border-line bg-paper px-3 py-3 text-sm font-medium text-night transition hover:border-teal/50"
                      >
                        <span className="me-1">{style.emoji}</span>
                        {tx(style.name)}
                      </button>
                    ))}
                  <button
                    type="button"
                    disabled={aiBusy}
                    onClick={() => void generateAi("skip")}
                    className="rounded-2xl border border-line bg-paper px-3 py-3 text-sm text-muted"
                  >
                    {tx(L("سأكتب يدويًا", "I’ll write myself"))}
                  </button>
                </div>
              </div>
              <textarea
                className="field"
                rows={7}
                value={draft.note}
                maxLength={NOTE_MAX}
                onChange={(event) => patch({ note: event.target.value.slice(0, NOTE_MAX) })}
                placeholder={tx(
                  L(
                    "أضف المواصفات وحالة السيارة — أو اضغط التوليد المرح ثم عدّل النص.",
                    "Add features and condition — or tap cheerful generate, then edit.",
                  ),
                )}
              />
              <p className="text-xs text-muted">
                {draft.note.length} / {NOTE_MAX}
                {aiBusy ? ` · ${tx(L("جارٍ التوليد…", "Generating…"))}` : ""}
              </p>
            </Question>
          )}

          {stepId === "price" && (
            <Question
              title={tx(L("السعر", "Price"))}
              lead={tx(
                L(
                  "السعر مطلوب. الأداة الذكية تقيّم العمر والموديل والمواصفات وتعرض نطاق السوق.",
                  "Price is required. The smart tool weighs age, model, and specs and shows the market band.",
                ),
              )}
            >
              {valuation && (
                <div className="space-y-3 rounded-2xl border border-teal/30 bg-teal/5 px-4 py-4 text-sm">
                  <p className="font-semibold text-night">
                    {tx(L("تقييم BHD الذكي لهذه السيارة", "BHD smart valuation for this car"))}
                  </p>
                  <p className="text-muted">
                    {tx(
                      L(
                        `عمر تقريبي ${valuation.ageYears} سنة · يعتمد على الموديل والحالة والممشى والمواصفات المختارة.`,
                        `About ${valuation.ageYears} years old · based on model, condition, mileage, and selected specs.`,
                      ),
                    )}
                  </p>
                  <div className="grid gap-2 sm:grid-cols-3">
                    <div className="rounded-xl border border-line bg-paper px-3 py-2">
                      <p className="text-xs text-muted">{tx(L("الأقل في السوق", "Market low"))}</p>
                      <p className="mt-1 text-lg font-bold text-night">{money(valuation.low)}</p>
                    </div>
                    <div className="rounded-xl border border-brass/40 bg-paper px-3 py-2">
                      <p className="text-xs text-muted">{tx(L("تقدير وسط", "Mid estimate"))}</p>
                      <p className="mt-1 text-lg font-bold text-brass">{money(valuation.mid)}</p>
                    </div>
                    <div className="rounded-xl border border-line bg-paper px-3 py-2">
                      <p className="text-xs text-muted">{tx(L("الأعلى في السوق", "Market high"))}</p>
                      <p className="mt-1 text-lg font-bold text-night">{money(valuation.high)}</p>
                    </div>
                  </div>
                  <div className="rounded-xl border border-dashed border-brass/50 bg-sand/40 px-3 py-2 text-night">
                    {tx(
                      L(
                        `تنبيه: سيارات مشابهة تُعرض عادة بين ${money(valuation.low)} و ${money(valuation.high)}.`,
                        `Notice: similar cars usually list between ${money(valuation.low)} and ${money(valuation.high)}.`,
                      ),
                    )}
                  </div>
                  <button
                    type="button"
                    className="text-sm font-medium text-teal"
                    onClick={() => patch({ price: String(valuation.mid) })}
                  >
                    {tx(L("استخدم التقدير الوسط كسعر", "Use mid estimate as price"))}
                  </button>
                </div>
              )}

              <label className="block">
                <span className="mb-2 block text-sm font-medium">{tx(L("السعر المحدد (مطلوب)", "Specified price (required)"))}</span>
                <div className="relative">
                  <input
                    className="field pe-16"
                    inputMode="decimal"
                    value={draft.price}
                    onChange={(event) => patch({ price: event.target.value.replace(/[^\d.]/g, "") })}
                    placeholder={valuation ? String(valuation.mid) : tx(L("مثال: 8500", "e.g. 8500"))}
                  />
                  <span className="absolute end-4 top-1/2 -translate-y-1/2 text-sm text-muted">
                    {locale === "ar" ? "ر.ع" : "OMR"}
                  </span>
                </div>
              </label>

              {priceVsMarket && (
                <p
                  className={`rounded-2xl px-4 py-3 text-sm ${
                    priceVsMarket === "fair"
                      ? "border border-teal/30 bg-teal/10 text-night"
                      : priceVsMarket === "below"
                        ? "border border-brass/40 bg-sand/50 text-night"
                        : "border border-line bg-soft text-night"
                  }`}
                >
                  {priceVsMarket === "fair"
                    ? tx(L("سعرك داخل نطاق السوق المتوقع — مناسب للمشاهدات.", "Your price sits inside the expected market band — good for views."))
                    : priceVsMarket === "below"
                      ? tx(L("سعرك أقل من الأدنى الشائع — قد يجذب بسرعة لكن راقب العروض.", "Below the usual low — may attract fast, watch offers carefully."))
                      : tx(L("سعرك أعلى من الأعلى الشائع — قد يقلل المشاهدات حتى يُعدَّل.", "Above the usual high — may reduce views until adjusted."))}
                </p>
              )}

              <div className="grid gap-2 sm:grid-cols-2">
                <button
                  type="button"
                  className={`rounded-2xl border px-4 py-3 text-sm font-medium transition ${
                    draft.priceNegotiable ? "border-teal bg-teal/10 text-night" : "border-line bg-paper text-muted"
                  }`}
                  onClick={() => patch({ priceNegotiable: true })}
                >
                  {tx(L("قابل للنقاش", "Negotiable"))}
                </button>
                <button
                  type="button"
                  className={`rounded-2xl border px-4 py-3 text-sm font-medium transition ${
                    !draft.priceNegotiable ? "border-teal bg-teal/10 text-night" : "border-line bg-paper text-muted"
                  }`}
                  onClick={() => patch({ priceNegotiable: false })}
                >
                  {tx(L("غير قابل للنقاش", "Not negotiable"))}
                </button>
              </div>
            </Question>
          )}

          {stepId === "payment" && (
            <Question title={tx(L("طريقة الدفع", "Payment method"))}>
              <div className="grid gap-2 sm:grid-cols-3">
                {paymentMethods.map((item) => (
                  <Chip key={item.id} active={draft.payment === item.id} onClick={() => choose("payment", item.id)}>
                    {tx(item.name)}
                  </Chip>
                ))}
              </div>
            </Question>
          )}

          {stepId === "deal" && (
            <Question title={tx(L("نوع الصفقة", "Deal type"))}>
              <div className="grid gap-2 sm:grid-cols-3">
                <Chip active={draft.deal === "sell"} onClick={() => choose("deal", "sell")}>
                  {tx(L("بيع فقط", "Sell only"))}
                </Chip>
                <Chip active={draft.deal === "both"} onClick={() => choose("deal", "both")}>
                  {tx(L("بيع أو تبادل", "Sell or trade"))}
                </Chip>
                <Chip active={draft.deal === "trade"} onClick={() => choose("deal", "trade")}>
                  {tx(L("تبادل فقط", "Trade only"))}
                </Chip>
              </div>
            </Question>
          )}

          {stepId === "phone" && (
            <Question
              title={tx(L("معلومات الاتصال", "Contact information"))}
              lead={tx(L("أضف رقم الهاتف الخاص بالإعلان.", "Add the phone number for this listing."))}
            >
              <label className="block space-y-2">
                <span className="block text-sm font-medium text-night">{tx(L("رقم الهاتف", "Phone number"))}</span>
                <div className="flex overflow-hidden rounded-2xl border border-line bg-paper">
                  <span className="flex items-center gap-2 border-e border-line bg-soft px-3 text-sm text-muted">
                    🇴🇲 +968
                  </span>
                  <input
                    className="field flex-1 rounded-none border-0"
                    inputMode="tel"
                    value={draft.phone}
                    onChange={(event) => patch({ phone: event.target.value.replace(/[^\d]/g, "").slice(0, 8) })}
                    placeholder="95655200"
                  />
                </div>
              </label>
            </Question>
          )}

          {stepId === "publish" && (
            <Question
              title={tx(L("النشر", "Publish"))}
              lead={tx(L("راجع الملخص. عند الحفظ سنسألك إن أردت استعراض الإعلان أولًا.", "Review the summary. On save we’ll ask if you want to preview first."))}
            >
              <div className="rounded-2xl border border-line bg-soft/60 px-4 py-3 text-sm text-muted">
                <p className="font-medium text-night">{title || tx(L("سيارتك", "Your car"))}</p>
                <p className="mt-1">{placeLabel || "—"}</p>
                <p className="mt-1">
                  {draft.price ? money(Number(draft.price) || 0) : "—"}
                  {draft.price
                    ? ` · ${draft.priceNegotiable ? tx(L("قابل للنقاش", "Negotiable")) : tx(L("غير قابل للنقاش", "Fixed"))}`
                    : ""}
                </p>
                <p className="mt-1">+968 {draft.phone || "—"}</p>
              </div>
              {previewMode && (
                <div className="rounded-2xl border border-teal/40 bg-teal/10 px-4 py-3 text-sm text-night">
                  {tx(
                    L(
                      "وضع الاستعراض مفعّل — راجع البطاقة الجانبية أو الملخص أعلاه، ثم اضغط «حفظ ونشر» مجددًا للتأكيد.",
                      "Preview mode on — check the side card or summary above, then press Save & publish again to confirm.",
                    ),
                  )}
                </div>
              )}
              <div className="space-y-2 rounded-2xl border border-line bg-sand/40 p-4">
                <p className="text-sm font-semibold text-night">
                  {tx(L("قوة BHD — اختر ما يُرفق بالإعلان", "BHD edge — attach to the listing"))}
                </p>
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
            ) : previewMode ? (
              <button
                type="button"
                onClick={publish}
                disabled={!canNext()}
                className={`btn-teal flex-1 ${!canNext() ? "opacity-40" : ""}`}
              >
                {tx(L("تأكيد النشر بعد الاستعراض", "Confirm publish after preview"))}
              </button>
            ) : (
              <button
                type="button"
                onClick={requestPublish}
                disabled={!canNext()}
                className={`btn-teal flex-1 ${!canNext() ? "opacity-40" : ""}`}
              >
                {tx(L("حفظ و نشر الإعلان", "Save and publish"))}
              </button>
            )}
          </div>
        </div>

        <aside className={`${previewMode ? "block" : "hidden lg:block"}`} ref={previewRef}>
          <div className={`surface-card sticky top-28 overflow-hidden ${previewMode ? "ring-2 ring-teal/50" : ""}`}>
            <div className="bg-night px-5 py-3 text-xs font-medium tracking-[0.14em] text-brass">
              {previewMode
                ? tx(L("استعراض الإعلان قبل النشر", "Ad preview before publish"))
                : tx(L("معاينة مباشرة", "Live preview"))}
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
              <p className="text-2xl font-bold text-night">
                {draft.price ? money(Number(draft.price) || 0) : "—"}
              </p>
              {draft.price && (
                <p className="text-xs font-medium text-teal">
                  {draft.priceNegotiable
                    ? tx(L("السعر قابل للنقاش", "Price is negotiable"))
                    : tx(L("السعر غير قابل للنقاش", "Price is fixed"))}
                </p>
              )}
              <p className="font-semibold text-night">{title || tx(L("سيارتك", "Your car"))}</p>
              <p className="text-sm text-muted">
                {[
                  draft.year,
                  draft.mileageBand ? `${mileage.toLocaleString()} ${tx(L("كم", "km"))}` : null,
                  placeLabel || null,
                ]
                  .filter(Boolean)
                  .join(" · ") || tx(L("أكمل الخطوات لملء البطاقة", "Complete steps to fill the card"))}
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                {draft.condition && <span className="chip">{optionLabel(conditions, draft.condition, tx)}</span>}
                {draft.trim && <span className="chip">{draft.trim}</span>}
                {draft.origin && <span className="chip">{optionLabel(regionalSpecs, draft.origin, tx)}</span>}
                {draft.gearbox && (
                  <span className="chip">
                    {draft.gearbox === "auto" ? tx(L("أوتوماتيك", "Auto")) : tx(L("عادي", "Manual"))}
                  </span>
                )}
                {draft.payment && <span className="chip">{optionLabel(paymentMethods, draft.payment, tx)}</span>}
                {draft.smartKeys > 0 && (
                  <span className="chip">
                    {draft.smartKeys} {tx(L("ذكي", "smart"))}
                  </span>
                )}
                {draft.regularKeys > 0 && (
                  <span className="chip">
                    {draft.regularKeys} {tx(L("عادي", "regular"))}
                  </span>
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

      {previewAsk && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-night/50 p-4 sm:items-center" role="dialog" aria-modal="true">
          <div className="w-full max-w-md rounded-[1.5rem] border border-line bg-paper p-5 shadow-xl">
            <p className="text-lg font-bold text-night">
              {tx(L("هل تريد استعراض الإعلان قبل النشر؟", "Do you want to preview the ad before publishing?"))}
            </p>
            <p className="mt-2 text-sm text-muted">
              {tx(
                L(
                  "يمكنك مراجعة البطاقة كما يراها المشتري، ثم تأكيد النشر. أو انشر مباشرة الآن.",
                  "Review the card as buyers will see it, then confirm publish — or publish right away.",
                ),
              )}
            </p>
            <div className="mt-5 flex flex-col gap-2 sm:flex-row">
              <button type="button" className="btn-primary flex-1" onClick={confirmPreviewThenStay}>
                {tx(L("نعم، استعرض أولًا", "Yes, preview first"))}
              </button>
              <button type="button" className="btn-teal flex-1" onClick={confirmPublishNow}>
                {tx(L("لا، انشر الآن", "No, publish now"))}
              </button>
            </div>
            <button type="button" className="mt-3 w-full text-sm text-muted" onClick={() => setPreviewAsk(false)}>
              {tx(L("إلغاء", "Cancel"))}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
