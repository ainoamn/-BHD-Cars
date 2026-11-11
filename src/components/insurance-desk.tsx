"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ChoiceCard, DemoNote, Field, FormShell, PageHeader, Primary, Receipt, Steps, fieldClass } from "@/components/ui";
import { carBySlug, cars, insurers } from "@/lib/data";
import { insuranceQuotes, type Cover } from "@/lib/quotes";
import { usePrefs } from "@/lib/prefs";
import { useStore } from "@/lib/store";
import type { Copy } from "@/lib/types";

const L = (ar: string, en: string): Copy => ({ ar, en });

export function InsuranceDesk() {
  const params = useSearchParams();
  const preset = params.get("car") ?? "";
  const car = carBySlug(preset);
  const { tx, money } = usePrefs();
  const { addRequest } = useStore();
  const [step, setStep] = useState(0);
  const [cover, setCover] = useState<Cover>("comp");
  const [year, setYear] = useState(String(car?.year ?? 2022));
  const [value, setValue] = useState(String(car?.priceOmr ?? 8000));
  const [plate, setPlate] = useState("");
  const [chosen, setChosen] = useState(insurers[0].id);
  const [sent, setSent] = useState<string | null>(null);

  const quotes = useMemo(
    () => insuranceQuotes(insurers, { valueOmr: Number(value) || 0, year: Number(year) || 2020, cover }),
    [value, year, cover],
  );
  const labels = [tx(L("التغطية", "Cover")), tx(L("السيارة", "Vehicle")), tx(L("المقارنة", "Compare"))];

  function submit() {
    const quote = quotes.find((item) => item.insurer.id === chosen) ?? quotes[0];
    const created = addRequest({
      kind: "insurance",
      title: quote ? tx(quote.insurer.name) : tx(L("تأمين", "Insurance")),
      detail: `${tx(cover === "tpl" ? L("طرف ثالث", "Third party") : cover === "border" ? L("حدود", "Border") : L("شامل", "Comprehensive"))} · ${year} · ${plate || car?.vin || "—"} · ${quote ? money(quote.priceOmr) : ""}`,
      status: "matching",
    });
    setSent(created.ref);
  }

  return (
    <div>
      <PageHeader
        kicker={L("التأمين", "Insurance")}
        title={L("قارن، ثم ادفع بعد صدور الوثيقة.", "Compare, then pay once the policy exists.")}
        lead={L("نفس منطق وسيط التأمين: عرض من أكثر من شركة، ثم مستندات، ثم إصدار. التغطية لا تبدأ قبل صدور الوثيقة.", "The same logic as an insurance desk: offers from more than one company, then documents, then issue. Cover does not start before the policy exists.")}
      />
      <div className="mx-auto max-w-3xl px-5 py-10">
        {sent ? (
          <Receipt
            refCode={sent}
            title={tx(L("بانتظار المستندات.", "Waiting for documents."))}
            detail={tx(L("المطلوب: ملكية، رخصة، وأربع صور للسيارة مع عداد المسافة إن طلبته الشركة. الإصدار المعتاد بعد المراجعة، لا قبلها.", "Needed: ownership, licence, and four photos of the car with the odometer if the company asks. Issue follows review."))}
          />
        ) : (
          <FormShell>
            <Steps labels={labels} index={step} />
            {step === 0 && (
              <div className="grid gap-3">
                {([
                  ["comp", L("شامل", "Comprehensive"), L("يغطي سيارتك والطرف الآخر.", "Covers your car and the other party.")],
                  ["tpl", L("طرف ثالث", "Third party"), L("يغطي الضرر الذي تسببه للغير.", "Covers damage you cause to others.")],
                  ["border", L("حدود", "Border"), L("لخروج السيارة أو دخولها.", "For a car leaving or entering.")],
                ] as const).map(([id, title, text]) => (
                  <ChoiceCard
                    key={id}
                    selected={cover === id}
                    title={tx(title)}
                    meta={tx(text)}
                    onSelect={() => { setCover(id); setStep(1); }}
                  />
                ))}
              </div>
            )}
            {step === 1 && (
              <div className="grid gap-4">
                <Field label={tx(L("ربط بسيارة من السوق", "Link a car from the market"))}>
                  <select className={fieldClass} defaultValue={preset} onChange={(event) => {
                    const found = carBySlug(event.target.value);
                    if (!found) return;
                    setYear(String(found.year));
                    setValue(String(found.priceOmr));
                  }}>
                    <option value="">{tx(L("سيارة غير معروضة", "A car that is not listed"))}</option>
                    {cars.map((item) => <option key={item.slug} value={item.slug}>{tx(item.title)}</option>)}
                  </select>
                </Field>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label={tx(L("سنة الصنع", "Year"))}>
                    <input className={fieldClass} value={year} onChange={(event) => setYear(event.target.value)} />
                  </Field>
                  <Field label={tx(L("قيمة السيارة بالريال العُماني", "Car value in Omani rial"))}>
                    <input className={fieldClass} value={value} onChange={(event) => setValue(event.target.value)} />
                  </Field>
                </div>
                <Field label={tx(L("رقم اللوحة أو الهيكل", "Plate or VIN"))}>
                  <input className={fieldClass} value={plate} onChange={(event) => setPlate(event.target.value)} />
                </Field>
                <div className="flex flex-wrap gap-3">
                  <Primary onClick={() => setStep(0)}>{tx(L("رجوع", "Back"))}</Primary>
                  <Primary onClick={() => { if (quotes[0]) setChosen(quotes[0].insurer.id); setStep(2); }}>{tx(L("قارن العروض", "Compare offers"))}</Primary>
                </div>
              </div>
            )}
            {step === 2 && (
              <div className="space-y-4">
                <div className="grid gap-3">
                  {quotes.map((quote) => (
                    <ChoiceCard
                      key={quote.insurer.id}
                      selected={chosen === quote.insurer.id}
                      title={tx(quote.insurer.name)}
                      price={money(quote.priceOmr)}
                      meta={[
                        tx(quote.insurer.focus),
                        quote.excessOmr ? `${tx(L("تحمّل", "Excess"))} ${money(quote.excessOmr)}` : null,
                        quote.insurer.agencyRepair ? tx(L("إصلاح وكالة", "Agency repair")) : tx(L("إصلاح معتمد", "Approved repair")),
                        quote.insurer.roadside ? tx(L("مساعدة طريق", "Roadside")) : null,
                      ].filter(Boolean).join(" · ")}
                      onSelect={() => setChosen(quote.insurer.id)}
                    />
                  ))}
                </div>
                <div className="flex flex-wrap gap-3">
                  <Primary onClick={() => setStep(1)}>{tx(L("رجوع", "Back"))}</Primary>
                  <Primary onClick={submit}>{tx(L("أرسل الطلب", "Send the request"))}</Primary>
                </div>
                <DemoNote />
              </div>
            )}
          </FormShell>
        )}
      </div>
    </div>
  );
}
