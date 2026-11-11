"use client";

import { useState } from "react";
import { CarCard } from "@/components/car-card";
import { DemoNote, Field, FormShell, PageHeader, Primary, Receipt, fieldClass } from "@/components/ui";
import { cars } from "@/lib/data";
import { usePrefs } from "@/lib/prefs";
import { useStore } from "@/lib/store";
import type { Copy } from "@/lib/types";

const L = (ar: string, en: string): Copy => ({ ar, en });

export function ImportDesk() {
  const { tx } = usePrefs();
  const { addRequest } = useStore();
  const [tab, setTab] = useState<"order" | "salvage">("order");
  const [origin, setOrigin] = useState("us");
  const [budget, setBudget] = useState("8000");
  const [spec, setSpec] = useState("");
  const [damage, setDamage] = useState("light");
  const [port, setPort] = useState("sohar");
  const [sent, setSent] = useState<string | null>(null);
  const salvage = cars.filter((car) => car.condition === "accident");

  function submit() {
    const created = addRequest({
      kind: "import",
      title: tx(L("طلب استيراد", "Import request")),
      detail: `${origin} · ${budget} OMR · ${damage} · ${port} · ${spec}`,
      status: "matching",
    });
    setSent(created.ref);
  }

  return (
    <div>
      <PageHeader
        kicker={L("الاستيراد", "Import")}
        title={L("اطلب سيارة، أو اشترِ حادثاً معلناً.", "Order a car, or buy a declared salvage.")}
        lead={L("مكتب واحد للمصدر والشحن والجمارك، وقسم منفصل لسيارات الحوادث حتى لا تختلط بالجاهز.", "One desk for source, freight, and duty, and a separate section for accident cars so they do not mix with ready stock.")}
      />
      <div className="mx-auto max-w-6xl px-5 py-10">
        <div className="mb-8 flex flex-wrap gap-2">
          <button type="button" className={tab === "order" ? "chip chip-active" : "chip"} onClick={() => setTab("order")}>
            {tx(L("طلب استيراد", "Order an import"))}
          </button>
          <button type="button" className={tab === "salvage" ? "chip chip-active" : "chip"} onClick={() => setTab("salvage")}>
            {tx(L("سيارات حوادث للبيع", "Salvage for sale"))}
          </button>
        </div>

        {tab === "order" && (
          <div className="max-w-3xl">
            {sent ? (
              <Receipt refCode={sent} title={tx(L("المكتب يبحث عن المطابقة.", "The desk is looking for a match."))} detail={tx(L("ستصلك خيارات مع تقدير شحن وجمارك وفحص قبل الشراء.", "You will receive options with freight, duty, and an inspection before you buy."))} />
            ) : (
              <FormShell>
                <Field label={tx(L("المصدر", "Origin"))}>
                  <select className={fieldClass} value={origin} onChange={(event) => setOrigin(event.target.value)}>
                    <option value="us">{tx(L("الولايات المتحدة", "United States"))}</option>
                    <option value="jp">{tx(L("اليابان", "Japan"))}</option>
                    <option value="kr">{tx(L("كوريا", "Korea"))}</option>
                    <option value="de">{tx(L("ألمانيا", "Germany"))}</option>
                    <option value="uk">{tx(L("بريطانيا", "United Kingdom"))}</option>
                    <option value="ae">{tx(L("من داخل الخليج", "Inside the Gulf"))}</option>
                  </select>
                </Field>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label={tx(L("الميزانية بالريال العُماني", "Budget in Omani rial"))}>
                    <input className={fieldClass} value={budget} onChange={(event) => setBudget(event.target.value)} />
                  </Field>
                  <Field label={tx(L("ميناء الوصول", "Arrival port"))}>
                    <select className={fieldClass} value={port} onChange={(event) => setPort(event.target.value)}>
                      <option value="sohar">{tx(L("صحار", "Sohar"))}</option>
                      <option value="salalah">{tx(L("صلالة", "Salalah"))}</option>
                      <option value="dubai">{tx(L("دبي ثم برّاً", "Dubai then overland"))}</option>
                    </select>
                  </Field>
                </div>
                <Field label={tx(L("مستوى الضرر المقبول", "Accepted damage level"))}>
                  <div className="flex flex-wrap gap-2">
                    {([
                      ["clean", L("بدون حادث", "No damage")],
                      ["light", L("خفيف", "Light")],
                      ["heavy", L("ثقيل معلن", "Heavy declared")],
                    ] as const).map(([id, label]) => (
                      <button key={id} type="button" onClick={() => setDamage(id)} className={damage === id ? "chip chip-active" : "chip"}>
                        {tx(label)}
                      </button>
                    ))}
                  </div>
                </Field>
                <Field label={tx(L("المواصفات المطلوبة", "Required specs"))}>
                  <textarea className={fieldClass} rows={3} value={spec} onChange={(event) => setSpec(event.target.value)} placeholder={tx(L("باترول 2021، دفع رباعي، أقل من 80 ألف كم", "Patrol 2021, 4WD, under 80k km"))} />
                </Field>
                <Primary onClick={submit}>{tx(L("أرسل طلب الاستيراد", "Send the import request"))}</Primary>
                <DemoNote />
              </FormShell>
            )}
          </div>
        )}

        {tab === "salvage" && (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {salvage.map((car) => <CarCard key={car.slug} car={car} />)}
          </div>
        )}
      </div>
    </div>
  );
}
