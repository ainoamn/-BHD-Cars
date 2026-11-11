"use client";

import { useState } from "react";
import { Field, PageHeader, Primary, Receipt, fieldClass } from "@/components/ui";
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

  return (
    <div>
      <PageHeader
        kicker={L("البيع", "Selling")}
        title={L("أعلن بهدوء، أو بدّل سيارتك.", "List quietly, or trade the car in.")}
        lead={L("الإعلان يمر على مراجعة قصيرة قبل النشر. البدل يُرسل إلى مكتب يطابق سيارة من السوق.", "The listing passes a short review before it is public. A trade-in goes to a desk that matches a car already on the market.")}
      />
      <div className="mx-auto max-w-xl px-5 py-12">
        {sent ? <Receipt refCode={sent} title={tx(L("الإعلان في المراجعة.", "The listing is in review."))} detail={tx(L("بعد القبول يظهر في السوق مع أدوات التمويل والتأمين والفحص.", "Once accepted it appears in the market with finance, insurance, and inspection attached."))} /> : (
          <form className="grid gap-4" onSubmit={(event) => {
            event.preventDefault();
            const created = addRequest({
              kind: "sell",
              title: title,
              detail: `${condition} · ${price} OMR · ${city}${trade ? " · trade-in" : ""}`,
              status: "submitted",
            });
            setSent(created.ref);
          }}>
            <Field label={tx(L("السيارة", "The car"))}>
              <input required className={fieldClass} value={title} onChange={(event) => setTitle(event.target.value)} placeholder={tx(L("لكزس ES 2019", "Lexus ES 2019"))} />
            </Field>
            <Field label={tx(L("السعر المطلوب بالريال العُماني", "Asking price in Omani rial"))}>
              <input required className={fieldClass} value={price} onChange={(event) => setPrice(event.target.value)} />
            </Field>
            <Field label={tx(L("المدينة", "City"))}>
              <input required className={fieldClass} value={city} onChange={(event) => setCity(event.target.value)} />
            </Field>
            <Field label={tx(L("الحالة", "Condition"))}>
              <select className={fieldClass} value={condition} onChange={(event) => setCondition(event.target.value)}>
                <option value="ready">{tx(L("جاهزة", "Ready"))}</option>
                <option value="new">{tx(L("جديدة", "New"))}</option>
                <option value="accident">{tx(L("حادث معلن", "Declared damage"))}</option>
              </select>
            </Field>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={trade} onChange={(event) => setTrade(event.target.checked)} />
              {tx(L("أريد البدل بسيارة من السوق", "I want to trade against a car on the market"))}
            </label>
            <Primary type="submit">{tx(L("أرسل الإعلان", "Send the listing"))}</Primary>
          </form>
        )}
      </div>
    </div>
  );
}
