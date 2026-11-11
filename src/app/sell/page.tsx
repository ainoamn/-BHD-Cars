"use client";

import { useState } from "react";
import { Field, FormShell, PageHeader, Primary, Receipt, fieldClass } from "@/components/ui";
import { usePrefs } from "@/lib/prefs";
import { useStore } from "@/lib/store";
import type { Copy } from "@/lib/types";

const L = (ar: string, en: string): Copy => ({ ar, en });

export default function Page() {
  const { tx } = usePrefs();
  const { addRequest } = useStore();
  const [sent, setSent] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [condition, setCondition] = useState("ready");
  const [trade, setTrade] = useState(false);
  const [city, setCity] = useState("");
  const [year, setYear] = useState("");
  const [mileage, setMileage] = useState("");
  const [note, setNote] = useState("");

  return (
    <div>
      <PageHeader
        kicker={L("البيع", "Selling")}
        title={L("أعلن بهدوء، أو بدّل سيارتك.", "List quietly, or trade the car in.")}
        lead={L("الإعلان يمر على مراجعة قصيرة قبل النشر. البدل يُرسل إلى مكتب يطابق سيارة من السوق.", "The listing passes a short review before it is public. A trade-in goes to a desk that matches a car already on the market.")}
      />
      <div className="mx-auto max-w-3xl px-5 py-10">
        {sent ? (
          <Receipt refCode={sent} title={tx(L("الإعلان في المراجعة.", "The listing is in review."))} detail={tx(L("بعد القبول يظهر في السوق مع أدوات التمويل والتأمين والفحص.", "Once accepted it appears in the market with finance, insurance, and inspection attached."))} />
        ) : (
          <FormShell>
            <form
              className="grid gap-5"
              onSubmit={(event) => {
                event.preventDefault();
                const created = addRequest({
                  kind: "sell",
                  title: title,
                  detail: `${condition} · ${year} · ${mileage} km · ${price} OMR · ${city}${trade ? " · trade-in" : ""}${note ? ` · ${note}` : ""}`,
                  status: "submitted",
                });
                setSent(created.ref);
              }}
            >
              <Field label={tx(L("السيارة", "The car"))}>
                <input required className={fieldClass} value={title} onChange={(event) => setTitle(event.target.value)} placeholder={tx(L("لكزس ES 2019", "Lexus ES 2019"))} />
              </Field>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label={tx(L("سنة الصنع", "Year"))}>
                  <input required className={fieldClass} value={year} onChange={(event) => setYear(event.target.value)} placeholder="2019" />
                </Field>
                <Field label={tx(L("المسافة بالكيلومتر", "Mileage in km"))}>
                  <input required className={fieldClass} value={mileage} onChange={(event) => setMileage(event.target.value)} />
                </Field>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label={tx(L("السعر المطلوب بالريال العُماني", "Asking price in Omani rial"))}>
                  <input required className={fieldClass} value={price} onChange={(event) => setPrice(event.target.value)} />
                </Field>
                <Field label={tx(L("المدينة", "City"))}>
                  <input required className={fieldClass} value={city} onChange={(event) => setCity(event.target.value)} />
                </Field>
              </div>
              <Field label={tx(L("الحالة", "Condition"))}>
                <div className="flex flex-wrap gap-2">
                  {([
                    ["ready", L("جاهزة", "Ready")],
                    ["new", L("جديدة", "New")],
                    ["accident", L("حادث معلن", "Declared damage")],
                  ] as const).map(([id, label]) => (
                    <button key={id} type="button" onClick={() => setCondition(id)} className={condition === id ? "chip chip-active" : "chip"}>
                      {tx(label)}
                    </button>
                  ))}
                </div>
              </Field>
              <Field label={tx(L("ملاحظة للمراجعة", "Note for review"))} hint={tx(L("اختياري. مثل صيانة حديثة أو سبب البيع.", "Optional. Recent service or reason for sale."))}>
                <textarea className={fieldClass} rows={3} value={note} onChange={(event) => setNote(event.target.value)} />
              </Field>
              <label className="flex items-center gap-3 rounded-2xl border border-line bg-soft/60 px-4 py-3 text-sm">
                <input type="checkbox" checked={trade} onChange={(event) => setTrade(event.target.checked)} className="accent-[var(--color-brass)]" />
                {tx(L("أريد البدل بسيارة من السوق", "I want to trade against a car on the market"))}
              </label>
              <Primary type="submit" className="w-full sm:w-auto">{tx(L("أرسل الإعلان", "Send the listing"))}</Primary>
            </form>
          </FormShell>
        )}
      </div>
    </div>
  );
}
