"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { ChoiceCard, DemoNote, Field, FormShell, PageHeader, Primary, Receipt, fieldClass } from "@/components/ui";
import { appraisers, carBySlug, cars, centers } from "@/lib/data";
import { usePrefs } from "@/lib/prefs";
import { useStore } from "@/lib/store";
import type { Copy } from "@/lib/types";

const L = (ar: string, en: string): Copy => ({ ar, en });

export function ValuationDesk() {
  const params = useSearchParams();
  const preset = params.get("car") ?? "";
  const { tx, money } = usePrefs();
  const { addRequest } = useStore();
  const [carSlug, setCarSlug] = useState(preset);
  const [purpose, setPurpose] = useState("sale");
  const [appraiser, setAppraiser] = useState("auto");
  const [sent, setSent] = useState<string | null>(null);
  const selected = appraisers.find((item) => item.id === appraiser);

  function submit() {
    const car = carBySlug(carSlug);
    const created = addRequest({
      kind: "valuation",
      title: car ? tx(car.title) : tx(L("تثمين سيارة", "Car valuation")),
      detail: `${purpose} · ${selected ? tx(selected.name) : tx(L("أقرب مثمن متاح", "Nearest available appraiser"))}`,
      status: "matching",
    });
    setSent(created.ref);
  }

  return (
    <div>
      <PageHeader
        kicker={L("التثمين", "Valuation")}
        title={L("رقم من مثمن، لا من البائع.", "A figure from an appraiser, not from the seller.")}
        lead={L("الطلب يذهب إلى مثمن مرخّص حسب المدينة. التقرير يصل خلال المدة المعلنة، ويصلح للبيع أو التمويل أو النزاع.", "The request goes to a licensed appraiser by city. The report arrives within the stated time, and serves a sale, finance, or a dispute.")}
      />
      <div className="mx-auto max-w-3xl px-5 py-10">
        {sent ? (
          <Receipt refCode={sent} title={tx(L("المثمن استلم الطلب.", "The appraiser has the request."))} detail={tx(L("قد يطلب صوراً للهيكل والعداد. الرسم يُحصّل مع التسليم.", "They may ask for photos of the body and the odometer. The fee is taken with delivery."))} />
        ) : (
          <FormShell>
            <Field label={tx(L("السيارة", "Car"))}>
              <select className={fieldClass} value={carSlug} onChange={(event) => setCarSlug(event.target.value)}>
                <option value="">{tx(L("سيارة خارج السوق", "A car outside the market"))}</option>
                {cars.map((car) => <option key={car.slug} value={car.slug}>{tx(car.title)}</option>)}
              </select>
            </Field>
            <Field label={tx(L("الغرض", "Purpose"))}>
              <div className="flex flex-wrap gap-2">
                {([
                  ["sale", L("بيع", "Sale")],
                  ["finance", L("تمويل", "Finance")],
                  ["insurance", L("تأمين", "Insurance")],
                  ["dispute", L("نزاع أو تركة", "Dispute or estate")],
                ] as const).map(([id, label]) => (
                  <button key={id} type="button" onClick={() => setPurpose(id)} className={purpose === id ? "chip chip-active" : "chip"}>
                    {tx(label)}
                  </button>
                ))}
              </div>
            </Field>
            <Field label={tx(L("المثمن", "Appraiser"))}>
              <div className="grid gap-3">
                <ChoiceCard
                  selected={appraiser === "auto"}
                  title={tx(L("أقرب مثمن متاح", "Nearest available"))}
                  meta={tx(L("نوزّع حسب المدينة والوقت.", "We assign by city and availability."))}
                  onSelect={() => setAppraiser("auto")}
                />
                {appraisers.map((item) => (
                  <ChoiceCard
                    key={item.id}
                    selected={appraiser === item.id}
                    title={tx(item.name)}
                    price={money(item.feeOmr)}
                    meta={`${item.license} · ${tx(item.cities)} · ${item.hours} ${tx(L("ساعة", "hours"))}`}
                    onSelect={() => setAppraiser(item.id)}
                  />
                ))}
              </div>
            </Field>
            <Primary onClick={submit}>{tx(L("أرسل طلب التثمين", "Send the valuation"))}</Primary>
            <DemoNote />
          </FormShell>
        )}
      </div>
    </div>
  );
}

export function InspectionDesk() {
  const params = useSearchParams();
  const { tx, money } = usePrefs();
  const { addRequest } = useStore();
  const [carSlug, setCarSlug] = useState(params.get("car") ?? "");
  const [centerId, setCenterId] = useState(centers[0].id);
  const center = centers.find((item) => item.id === centerId) ?? centers[0];
  const [tierId, setTierId] = useState(center.tiers[1].id);
  const [slot, setSlot] = useState("tomorrow-morning");
  const [sent, setSent] = useState<string | null>(null);
  const tier = center.tiers.find((item) => item.id === tierId) ?? center.tiers[0];

  function submit() {
    const car = carBySlug(carSlug);
    const created = addRequest({
      kind: "inspection",
      title: car ? tx(car.title) : tx(L("فحص سيارة", "Car inspection")),
      detail: `${tx(center.name)} · ${tx(tier.name)} · ${slot} · ${money(tier.feeOmr)}`,
      status: "matching",
    });
    setSent(created.ref);
  }

  return (
    <div>
      <PageHeader
        kicker={L("الفحص", "Inspection")}
        title={L("يفحصها المختبر قبل أن تراها.", "The lab sees it before you have to.")}
        lead={L("موعد، مستوى فحص، وتقرير بالصور. مناسب للشراء المحلي ولسيارات الميناء.", "A slot, a level of inspection, and a photo report. For a local purchase and for cars at the port.")}
      />
      <div className="mx-auto max-w-3xl px-5 py-10">
        {sent ? (
          <div className="space-y-6">
            <Receipt refCode={sent} title={tx(L("الموعد محجوز بصورة مبدئية.", "The slot is held, pending confirmation."))} detail={tx(L("يصل التقرير على صفحة الطلبات: الهيكل، الكمبيوتر، تجربة الطريق، والملاحظات.", "The report lands on the requests page: structure, computer, road test, and notes."))} />
            <div className="surface-card p-5 text-sm leading-relaxed">
              <p className="eyebrow">{tx(L("شكل التقرير", "What the report contains"))}</p>
              <ul className="mt-3 list-disc space-y-1 ps-5 text-muted">
                <li>{tx(L("مطابقة رقم الهيكل", "VIN match"))}</li>
                <li>{tx(L("هيكل وطلاء", "Structure and paint"))}</li>
                <li>{tx(L("قراءة الأعطال", "Fault codes"))}</li>
                <li>{tx(L("تجربة طريق إن سمح البائع", "A road test if the seller allows it"))}</li>
                <li>{tx(L("توصية: اشترِ، تفاوض، أو ابتعد", "A recommendation: buy, negotiate, or walk away"))}</li>
              </ul>
            </div>
          </div>
        ) : (
          <FormShell>
            <Field label={tx(L("السيارة", "Car"))}>
              <select className={fieldClass} value={carSlug} onChange={(event) => setCarSlug(event.target.value)}>
                <option value="">{tx(L("سيارة برابط أو رقم هيكل لاحقاً", "A car, with a link or VIN later"))}</option>
                {cars.map((car) => <option key={car.slug} value={car.slug}>{tx(car.title)}</option>)}
              </select>
            </Field>
            <Field label={tx(L("المختبر", "Lab"))}>
              <div className="grid gap-3">
                {centers.map((item) => (
                  <ChoiceCard
                    key={item.id}
                    selected={centerId === item.id}
                    title={tx(item.name)}
                    meta={tx(item.city)}
                    onSelect={() => { setCenterId(item.id); setTierId(item.tiers[1]?.id ?? item.tiers[0].id); }}
                  />
                ))}
              </div>
            </Field>
            <Field label={tx(L("المستوى", "Level"))}>
              <div className="grid gap-3">
                {center.tiers.map((item) => (
                  <ChoiceCard
                    key={item.id}
                    selected={tierId === item.id}
                    title={tx(item.name)}
                    price={money(item.feeOmr)}
                    meta={tx(item.note)}
                    onSelect={() => setTierId(item.id)}
                  />
                ))}
              </div>
            </Field>
            <Field label={tx(L("الوقت", "Time"))}>
              <div className="flex flex-wrap gap-2">
                {([
                  ["tomorrow-morning", L("غداً صباحاً", "Tomorrow morning")],
                  ["tomorrow-evening", L("غداً مساءً", "Tomorrow evening")],
                  ["port", L("عند وصولها الميناء", "When it reaches the port")],
                ] as const).map(([id, label]) => (
                  <button key={id} type="button" onClick={() => setSlot(id)} className={slot === id ? "chip chip-active" : "chip"}>
                    {tx(label)}
                  </button>
                ))}
              </div>
            </Field>
            <Primary onClick={submit}>{tx(L("احجز الفحص", "Book the inspection"))}</Primary>
            <DemoNote />
          </FormShell>
        )}
      </div>
    </div>
  );
}
