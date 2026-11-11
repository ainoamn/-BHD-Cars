"use client";

import { useState } from "react";
import { CarCard } from "@/components/car-card";
import { DemoNote, Field, PageHeader, Primary, Receipt, fieldClass } from "@/components/ui";
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
      <div className="mx-auto max-w-6xl px-5 py-12">
        <div className="flex gap-6 border-b border-line text-sm">
          <button type="button" className={tab === "order" ? "border-b border-night pb-3" : "pb-3 text-muted"} onClick={() => setTab("order")}>{tx(L("طلب استيراد", "Order an import"))}</button>
          <button type="button" className={tab === "salvage" ? "border-b border-night pb-3" : "pb-3 text-muted"} onClick={() => setTab("salvage")}>{tx(L("سيارات حوادث للبيع", "Salvage for sale"))}</button>
        </div>
        {tab === "order" && (
          <div className="mt-8 max-w-2xl">
            {sent ? <Receipt refCode={sent} title={tx(L("المكتب يبحث عن المطابقة.", "The desk is looking for a match."))} detail={tx(L("ستصلك خيارات مع تقدير شحن وجمارك وفحص قبل الشراء.", "You will receive options with freight, duty, and an inspection before you buy."))} /> : (
              <div className="grid gap-4">
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
                <Field label={tx(L("الميزانية بالريال العُماني شاملة الشحن", "Budget in Omani rial, freight included"))}>
                  <input className={fieldClass} value={budget} onChange={(event) => setBudget(event.target.value)} />
                </Field>
                <Field label={tx(L("ما الذي تريده", "What you want"))}>
                  <textarea className={fieldClass} rows={4} value={spec} onChange={(event) => setSpec(event.target.value)} placeholder={tx(L("لاند كروزر 2022، ماشي دون 80 ألف، بدون حادث هيكلي.", "Land Cruiser 2022, under 80,000 km, no structural damage."))} />
                </Field>
                <Field label={tx(L("قبول الضرر", "Damage tolerance"))}>
                  <select className={fieldClass} value={damage} onChange={(event) => setDamage(event.target.value)}>
                    <option value="none">{tx(L("سليمة فقط", "Clean only"))}</option>
                    <option value="light">{tx(L("ضرر تجميلي مقبول", "Cosmetic damage is fine"))}</option>
                    <option value="repair">{tx(L("للإصلاح وإعادة البيع", "For repair and resale"))}</option>
                  </select>
                </Field>
                <Field label={tx(L("ميناء الوصول", "Arrival port"))}>
                  <select className={fieldClass} value={port} onChange={(event) => setPort(event.target.value)}>
                    <option value="sohar">{tx(L("صحار", "Sohar"))}</option>
                    <option value="sultan">{tx(L("السلطان قابوس", "Sultan Qaboos"))}</option>
                    <option value="salalah">{tx(L("صلالة", "Salalah"))}</option>
                    <option value="jebel">{tx(L("جبل علي ثم برّاً", "Jebel Ali, then by road"))}</option>
                  </select>
                </Field>
                <Primary onClick={submit}>{tx(L("أرسل الطلب", "Send the request"))}</Primary>
                <DemoNote />
              </div>
            )}
          </div>
        )}
        {tab === "salvage" && (
          <div className="mt-8 grid gap-8 sm:grid-cols-2">
            {salvage.map((car) => <CarCard key={car.slug} car={car} />)}
          </div>
        )}
      </div>
    </div>
  );
}
