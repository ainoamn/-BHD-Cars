"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { DemoNote, Field, PageHeader, Primary, Receipt, fieldClass } from "@/components/ui";
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
      <div className="mx-auto max-w-3xl px-5 py-12">
        {sent ? (
          <Receipt refCode={sent} title={tx(L("المثمن استلم الطلب.", "The appraiser has the request."))} detail={tx(L("قد يطلب صوراً للهيكل والعداد. الرسم يُحصّل مع التسليم.", "They may ask for photos of the body and the odometer. The fee is taken with delivery."))} />
        ) : (
          <div className="grid gap-4">
            <Field label={tx(L("السيارة", "Car"))}>
              <select className={fieldClass} value={carSlug} onChange={(event) => setCarSlug(event.target.value)}>
                <option value="">{tx(L("سيارة خارج السوق", "A car outside the market"))}</option>
                {cars.map((car) => <option key={car.slug} value={car.slug}>{tx(car.title)}</option>)}
              </select>
            </Field>
            <Field label={tx(L("الغرض", "Purpose"))}>
              <select className={fieldClass} value={purpose} onChange={(event) => setPurpose(event.target.value)}>
                <option value="sale">{tx(L("بيع", "Sale"))}</option>
                <option value="finance">{tx(L("تمويل", "Finance"))}</option>
                <option value="insurance">{tx(L("تأمين", "Insurance"))}</option>
                <option value="dispute">{tx(L("نزاع أو تركة", "Dispute or estate"))}</option>
              </select>
            </Field>
            <Field label={tx(L("المثمن", "Appraiser"))}>
              <select className={fieldClass} value={appraiser} onChange={(event) => setAppraiser(event.target.value)}>
                <option value="auto">{tx(L("أقرب مثمن متاح", "Nearest available"))}</option>
                {appraisers.map((item) => (
                  <option key={item.id} value={item.id}>{tx(item.name)} · {tx(item.cities)} · {money(item.feeOmr)}</option>
                ))}
              </select>
            </Field>
            <ul className="grid gap-3 sm:grid-cols-2">
              {appraisers.map((item) => (
                <li key={item.id} className="border border-line p-4 text-sm">
                  <p>{tx(item.name)}</p>
                  <p className="mt-1 text-xs text-muted">{item.license} · {tx(item.cities)} · {item.hours} {tx(L("ساعة", "hours"))}</p>
                </li>
              ))}
            </ul>
            <Primary onClick={submit}>{tx(L("أرسل طلب التثمين", "Send the valuation"))}</Primary>
            <DemoNote />
          </div>
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
      <div className="mx-auto max-w-3xl px-5 py-12">
        {sent ? (
          <div className="space-y-6">
            <Receipt refCode={sent} title={tx(L("الموعد محجوز بصورة مبدئية.", "The slot is held, pending confirmation."))} detail={tx(L("يصل التقرير على صفحة الطلبات: الهيكل، الكمبيوتر، تجربة الطريق، والملاحظات.", "The report lands on the requests page: structure, computer, road test, and notes."))} />
            <div className="border border-line p-5 text-sm leading-relaxed">
              <p className="text-xs text-brass">{tx(L("شكل التقرير", "What the report contains"))}</p>
              <ul className="mt-3 list-disc space-y-1 ps-5">
                <li>{tx(L("مطابقة رقم الهيكل", "VIN match"))}</li>
                <li>{tx(L("هيكل وطلاء", "Structure and paint"))}</li>
                <li>{tx(L("قراءة الأعطال", "Fault codes"))}</li>
                <li>{tx(L("تجربة طريق إن سمح البائع", "A road test if the seller allows it"))}</li>
                <li>{tx(L("توصية: اشترِ، تفاوض، أو ابتعد", "A recommendation: buy, negotiate, or walk away"))}</li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="grid gap-4">
            <Field label={tx(L("السيارة", "Car"))}>
              <select className={fieldClass} value={carSlug} onChange={(event) => setCarSlug(event.target.value)}>
                <option value="">{tx(L("سيارة برابط أو رقم هيكل لاحقاً", "A car, with a link or VIN later"))}</option>
                {cars.map((car) => <option key={car.slug} value={car.slug}>{tx(car.title)}</option>)}
              </select>
            </Field>
            <Field label={tx(L("المختبر", "Lab"))}>
              <select className={fieldClass} value={centerId} onChange={(event) => { setCenterId(event.target.value); setTierId("full"); }}>
                {centers.map((item) => <option key={item.id} value={item.id}>{tx(item.name)} · {tx(item.city)}</option>)}
              </select>
            </Field>
            <Field label={tx(L("المستوى", "Level"))}>
              <select className={fieldClass} value={tierId} onChange={(event) => setTierId(event.target.value)}>
                {center.tiers.map((item) => <option key={item.id} value={item.id}>{tx(item.name)} · {money(item.feeOmr)} · {tx(item.note)}</option>)}
              </select>
            </Field>
            <Field label={tx(L("الوقت", "Time"))}>
              <select className={fieldClass} value={slot} onChange={(event) => setSlot(event.target.value)}>
                <option value="tomorrow-morning">{tx(L("غداً صباحاً", "Tomorrow morning"))}</option>
                <option value="tomorrow-evening">{tx(L("غداً مساءً", "Tomorrow evening"))}</option>
                <option value="port">{tx(L("عند وصولها الميناء", "When it reaches the port"))}</option>
              </select>
            </Field>
            <Primary onClick={submit}>{tx(L("احجز الفحص", "Book the inspection"))}</Primary>
            <DemoNote />
          </div>
        )}
      </div>
    </div>
  );
}
