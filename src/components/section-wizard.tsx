"use client";

import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { Receipt } from "@/components/ui";
import type { FieldDef, FieldOption, ListingSection } from "@/lib/listing-sections";
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
const MIN_PHOTOS_DEFAULT = 2;
const MAX_PHOTOS = 12;

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

function optionName(list: FieldOption[] | undefined, id: string, tx: (c: Copy) => string) {
  const found = list?.find((item) => item.id === id);
  return found ? tx(found.name) : id;
}

export function SectionWizard({ section }: { section: ListingSection }) {
  const { tx, money, locale } = usePrefs();
  const { addRequest } = useStore();
  const fields = section.fields;
  const [step, setStep] = useState(0);
  const [values, setValues] = useState<Record<string, string>>({});
  const [multi, setMulti] = useState<Record<string, string[]>>({});
  const [photos, setPhotos] = useState<string[]>([]);
  const [sent, setSent] = useState<string | null>(null);
  const [aiBusy, setAiBusy] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const maxReached = useRef(0);

  const field = fields[step] as FieldDef | undefined;
  const governorateId = values.governorate ?? "";
  const wilayatId = values.wilayat ?? "";
  const villageId = values.village ?? "";
  const governorate = findGovernorate(governorateId);
  const wilayat = findWilayat(governorateId, wilayatId);
  const placeLabel = locationLabel({
    governorateId,
    wilayatId,
    villageId,
    locale,
  });

  const previewTitle = useMemo(() => {
    if (values.title?.trim()) return values.title.trim();
    const bits = [values.make, values.model, values.year, values.partName, values.name, values.plateDigits]
      .filter(Boolean)
      .join(" ");
    return bits || tx(section.name);
  }, [values, section.name, tx]);

  const readiness = useMemo(() => {
    const required = fields.filter((item) => item.required);
    if (!required.length) return 0;
    let filled = 0;
    for (const item of required) {
      if (item.kind === "photos") {
        if (photos.length >= (item.minPhotos ?? MIN_PHOTOS_DEFAULT)) filled += 1;
        continue;
      }
      if (item.kind === "multi") {
        if ((multi[item.id] ?? []).length) filled += 1;
        continue;
      }
      if ((values[item.id] ?? "").trim()) filled += 1;
    }
    return Math.round((filled / required.length) * 100);
  }, [fields, values, multi, photos]);

  async function runAi(action: "title" | "description", style?: "calm" | "clear" | "warm") {
    setAiBusy(true);
    try {
      const res = await fetch("/api/ai/listing-assist", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          locale,
          action,
          style: style ?? "clear",
          sectionId: section.id,
          facts: { ...values, photos: photos.length, title: values.title || previewTitle },
        }),
      });
      const json = (await res.json()) as { text?: string };
      if (!json.text) return;
      if (action === "title") patch("title", json.text.slice(0, 100));
      else patch("note", json.text.slice(0, 4000));
    } finally {
      setAiBusy(false);
    }
  }

  function patch(id: string, value: string) {
    setValues((prev) => {
      const next = { ...prev, [id]: value };
      if (id === "governorate") {
        next.wilayat = "";
        next.village = "";
      }
      if (id === "wilayat") next.village = "";
      return next;
    });
  }

  function go(to: number) {
    const next = Math.max(0, Math.min(fields.length - 1, to));
    maxReached.current = Math.max(maxReached.current, next);
    setStep(next);
  }

  function advance() {
    go(step + 1);
  }

  function resolveOptions(def: FieldDef): FieldOption[] {
    if (def.optionsSource === "governorates") {
      return omanGovernorates.map((item) => ({ id: item.id, name: item.name }));
    }
    if (def.optionsSource === "wilayats") {
      return (governorate?.wilayats ?? []).map((item) => ({ id: item.id, name: item.name }));
    }
    if (def.optionsSource === "villages") {
      return (wilayat?.villages ?? []).map((item) => ({ id: item.id, name: item.name }));
    }
    return def.options ?? [];
  }

  function canNext() {
    if (!field) return false;
    if (field.kind === "photos") {
      const min = field.minPhotos ?? MIN_PHOTOS_DEFAULT;
      return photos.length >= min;
    }
    if (field.kind === "multi") return true;
    if (field.kind === "textarea" || field.kind === "title") {
      if (!field.required) return true;
      return Boolean((values[field.id] ?? "").trim().length >= (field.kind === "title" ? 4 : 0));
    }
    if (field.kind === "phone") {
      return (values.phone ?? "").replace(/\D/g, "").length >= 8;
    }
    if (field.kind === "price") {
      return Boolean(values.price && Number(values.price) > 0);
    }
    if (!field.required) return true;
    return Boolean((values[field.id] ?? "").trim());
  }

  function choose(id: string, value: string, thenAdvance = true) {
    patch(id, value);
    if (thenAdvance) window.setTimeout(() => go(step + 1), 120);
  }

  function toggleMulti(id: string, optionId: string) {
    setMulti((prev) => {
      const current = prev[id] ?? [];
      const next = current.includes(optionId)
        ? current.filter((item) => item !== optionId)
        : [...current, optionId];
      return { ...prev, [id]: next };
    });
  }

  function onFiles(files: FileList | null) {
    if (!files?.length) return;
    const room = MAX_PHOTOS - photos.length;
    if (room <= 0) return;
    const urls = Array.from(files).slice(0, room).map((file) => URL.createObjectURL(file));
    setPhotos((prev) => [...prev, ...urls]);
  }

  function publish() {
    const detailParts = fields
      .filter((item) => item.kind !== "photos" && item.kind !== "textarea" && item.kind !== "title")
      .map((item) => {
        if (item.kind === "multi") {
          const ids = multi[item.id] ?? [];
          if (!ids.length) return null;
          return `${tx(item.label)}: ${ids.map((id) => optionName(item.options, id, tx)).join(", ")}`;
        }
        const raw = values[item.id];
        if (!raw) return null;
        if (item.kind === "choice" || item.optionsSource) {
          return `${tx(item.label)}: ${optionName(resolveOptions(item), raw, tx)}`;
        }
        if (item.id === "phone") return `+968 ${raw}`;
        if (item.id === "price") return `${raw} OMR`;
        return `${tx(item.label)}: ${raw}`;
      })
      .filter(Boolean);

    if (placeLabel) detailParts.push(placeLabel);
    if (values.note) detailParts.push(values.note);

    const created = addRequest({
      kind: section.requestKind,
      title: previewTitle,
      detail: [`section:${section.id}`, ...detailParts].join(" · "),
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
              "بعد القبول يظهر في القسم المناسب. يمكنك متابعة الرقم من صفحة الطلبات.",
              "Once accepted it appears in the right section. Track the reference on the requests page.",
            ),
          )}
        />
      </div>
    );
  }

  if (!field) {
    return (
      <div className="mx-auto max-w-xl px-5 py-16 text-center">
        <p className="text-muted">{tx(L("لا توجد حقول لهذا القسم.", "No fields for this section."))}</p>
        <Link href="/sell" className="btn-primary mt-6 inline-flex">
          {tx(L("العودة للأقسام", "Back to sections"))}
        </Link>
      </div>
    );
  }

  const progress = ((step + 1) / fields.length) * 100;
  const options = resolveOptions(field);
  const minPhotos = field.minPhotos ?? MIN_PHOTOS_DEFAULT;

  return (
    <div className="min-h-[80vh] bg-gradient-to-b from-sand/40 to-ivory">
      <div className="border-b border-line/80 bg-paper/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4">
          <div>
            <p className="eyebrow">
              {section.icon} {tx(section.name)}
            </p>
            <h1 className="text-xl font-bold tracking-tight text-night md:text-2xl">
              {tx(L("أكمل العرض بخطوات سلسة", "Complete the offer in smooth steps"))}
            </h1>
          </div>
          <Link href="/sell" className="rounded-full border border-line px-3 py-2 text-sm text-muted hover:text-night">
            {tx(L("المسارات", "Paths"))}
          </Link>
        </div>

        <div className="mx-auto max-w-6xl space-y-3 px-5 pb-4">
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-muted">
            <span>
              {tx(L("الخطوة", "Step"))} {step + 1} / {fields.length}
            </span>
            <span className="font-semibold text-night">{tx(field.label)}</span>
            <span className="rounded-full border border-teal/30 bg-teal/10 px-2.5 py-1 font-semibold text-night">
              {tx(L("جاهزية العرض", "Offer readiness"))}: {readiness}%
            </span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-line">
            <div className="h-full rounded-full bg-brass transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
          <ol className="flex gap-1 overflow-x-auto pb-1">
            {fields.map((item, index) => {
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
        </div>
      </div>

      <div className="mx-auto grid w-full max-w-6xl gap-6 px-5 py-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,0.75fr)]">
        <div className="surface-card min-w-0 overflow-x-clip p-4 md:p-6">
          <Question title={tx(field.label)} lead={field.lead ? tx(field.lead) : undefined}>
            {field.kind === "choice" && (
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {options.map((item) => (
                  <Chip
                    key={item.id}
                    active={values[field.id] === item.id}
                    onClick={() => choose(field.id, item.id, !field.hold)}
                  >
                    {tx(item.name)}
                  </Chip>
                ))}
              </div>
            )}

            {field.kind === "multi" && (
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {(field.options ?? []).map((item) => (
                  <CheckTile
                    key={item.id}
                    active={(multi[field.id] ?? []).includes(item.id)}
                    onClick={() => toggleMulti(field.id, item.id)}
                  >
                    {tx(item.name)}
                  </CheckTile>
                ))}
              </div>
            )}

            {(field.kind === "text" || field.kind === "number") && (
              <label className="block space-y-2">
                <div className="relative">
                  <input
                    className={`field ${field.suffix ? "pe-16" : ""}`}
                    inputMode={field.kind === "number" ? "decimal" : "text"}
                    value={values[field.id] ?? ""}
                    onChange={(event) => patch(field.id, event.target.value)}
                    placeholder={field.placeholder ? tx(field.placeholder) : undefined}
                  />
                  {field.suffix ? (
                    <span className="absolute end-4 top-1/2 -translate-y-1/2 text-sm text-muted">
                      {tx(field.suffix)}
                    </span>
                  ) : null}
                </div>
              </label>
            )}

            {field.kind === "title" && (
              <div className="space-y-3">
                <label className="block space-y-2">
                  <input
                    className="field"
                    maxLength={field.maxLength ?? 100}
                    value={values.title ?? ""}
                    onChange={(event) => patch("title", event.target.value.slice(0, field.maxLength ?? 100))}
                    placeholder={field.placeholder ? tx(field.placeholder) : previewTitle}
                  />
                  <span className="block text-xs text-muted">
                    {(values.title ?? "").length} / {field.maxLength ?? 100}
                  </span>
                </label>
                <button
                  type="button"
                  className="btn-teal"
                  disabled={aiBusy}
                  onClick={() => void runAi("title")}
                >
                  {aiBusy
                    ? tx(L("جارٍ الصياغة…", "Drafting…"))
                    : tx(L("صياغة العنوان بالمساعد", "Draft headline with assistant"))}
                </button>
              </div>
            )}

            {field.kind === "textarea" && (
              <div className="space-y-3">
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                  {(
                    [
                      ["warm", L("ودّي واضح", "Warm & clear")],
                      ["calm", L("هادئ مهني", "Calm professional")],
                      ["clear", L("مختصر مباشر", "Short & direct")],
                    ] as const
                  ).map(([style, label]) => (
                    <button
                      key={style}
                      type="button"
                      className="rounded-2xl border border-line bg-soft/50 px-3 py-3 text-sm font-medium text-night hover:border-teal/40"
                      disabled={aiBusy}
                      onClick={() => void runAi("description", style)}
                    >
                      {tx(label)}
                    </button>
                  ))}
                </div>
                <label className="block space-y-2">
                  <textarea
                    className="field"
                    rows={6}
                    maxLength={field.maxLength ?? 4000}
                    value={values.note ?? ""}
                    onChange={(event) => patch("note", event.target.value.slice(0, field.maxLength ?? 4000))}
                    placeholder={field.placeholder ? tx(field.placeholder) : undefined}
                  />
                  <span className="block text-xs text-muted">
                    {(values.note ?? "").length} / {field.maxLength ?? 4000}
                    {aiBusy ? ` · ${tx(L("جارٍ التوليد…", "Generating…"))}` : ""}
                  </span>
                </label>
              </div>
            )}

            {field.kind === "price" && (
              <label className="block space-y-2">
                <div className="relative">
                  <input
                    className="field pe-16"
                    inputMode="decimal"
                    value={values.price ?? ""}
                    onChange={(event) => patch("price", event.target.value)}
                    placeholder={tx(L("أدخل السعر", "Enter price"))}
                  />
                  <span className="absolute end-4 top-1/2 -translate-y-1/2 text-sm text-muted">
                    {field.suffix ? tx(field.suffix) : "OMR"}
                  </span>
                </div>
              </label>
            )}

            {field.kind === "phone" && (
              <div className="flex overflow-hidden rounded-2xl border border-line bg-paper">
                <span className="flex items-center gap-2 border-e border-line bg-soft px-3 text-sm text-muted">
                  🇴🇲 +968
                </span>
                <input
                  className="field flex-1 rounded-none border-0"
                  inputMode="tel"
                  value={values.phone ?? ""}
                  onChange={(event) => patch("phone", event.target.value.replace(/[^\d]/g, "").slice(0, 8))}
                  placeholder="95655200"
                />
              </div>
            )}

            {field.kind === "photos" && (
              <>
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="flex w-full flex-col items-center justify-center rounded-[1.25rem] border border-dashed border-brass/50 bg-soft/50 px-6 py-12 text-center"
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brass text-2xl text-white">+</span>
                  <span className="mt-3 font-semibold text-night">
                    {photos.length
                      ? tx(L("أضف المزيد من الصور", "Add more photos"))
                      : tx(L("أضف الصور", "Add photos"))}
                  </span>
                  <span className="mt-1 text-xs text-muted">
                    {tx(L(`الحد الأدنى ${minPhotos} · حتى ${MAX_PHOTOS}`, `Minimum ${minPhotos} · up to ${MAX_PHOTOS}`))}
                  </span>
                </button>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(event) => onFiles(event.target.files)}
                />
                {photos.length > 0 && (
                  <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
                    {photos.map((src, index) => (
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
                          onClick={() => setPhotos((prev) => prev.filter((_, i) => i !== index))}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </Question>

          <div className="sticky bottom-0 z-10 -mx-4 mt-8 flex items-center gap-3 border-t border-line bg-paper/95 px-4 py-3 backdrop-blur md:static md:mx-0 md:bg-transparent md:px-0 md:backdrop-blur-none">
            {step > 0 && (
              <button type="button" onClick={() => go(step - 1)} className="btn-secondary px-4">
                {locale === "ar" ? "→" : "←"} {tx(L("رجوع", "Back"))}
              </button>
            )}
            {step < fields.length - 1 ? (
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
                {tx(L("حفظ ونشر العرض", "Save and publish offer"))}
              </button>
            )}
          </div>
        </div>

        <aside className="hidden lg:block">
          <div className="surface-card sticky top-28 overflow-hidden">
            <div className="bg-night px-5 py-3 text-xs font-medium tracking-[0.14em] text-brass">
              {tx(L("معاينة العرض", "Offer preview"))} · {readiness}%
            </div>
            <div className="aspect-[16/10] bg-soft">
              {photos[0] ? (
                <img src={photos[0]} alt="" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center text-4xl">{section.icon}</div>
              )}
            </div>
            <div className="space-y-2 p-5">
              <p className="text-2xl font-bold text-night">
                {values.price ? money(Number(values.price) || 0) : "—"}
              </p>
              <p className="font-semibold text-night">{previewTitle}</p>
              <p className="text-sm text-muted">
                {[tx(section.name), placeLabel || null].filter(Boolean).join(" · ")}
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
