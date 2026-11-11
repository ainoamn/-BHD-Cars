"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { DemoNote, Field, PageHeader, Primary, Receipt, Steps, fieldClass } from "@/components/ui";
import { banks, carBySlug, cars } from "@/lib/data";
import { financeOffers } from "@/lib/quotes";
import { usePrefs } from "@/lib/prefs";
import { useStore } from "@/lib/store";
import type { Copy } from "@/lib/types";

const L = (ar: string, en: string): Copy => ({ ar, en });

export function FinanceDesk() {
  const params = useSearchParams();
  const { tx, money } = usePrefs();
  const { addRequest } = useStore();
  const preset = params.get("car") ?? "";
  const [step, setStep] = useState(0);
  const [carSlug, setCarSlug] = useState(preset);
  const [price, setPrice] = useState(String(carBySlug(preset)?.priceOmr ?? 12000));
  const [down, setDown] = useState(20);
  const [years, setYears] = useState(5);
  const [income, setIncome] = useState("800");
  const [employer, setEmployer] = useState("private");
  const [chosen, setChosen] = useState(banks[0].id);
  const [sent, setSent] = useState<string | null>(null);

  const priceOmr = Number(price) || 0;
  const offers = useMemo(() => financeOffers(banks, priceOmr, down, years), [priceOmr, down, years]);
  const labels = [
    tx(L("السيارة", "The car")),
    tx(L("الملف", "The file")),
    tx(L("العروض", "Offers")),
  ];

  function submit() {
    const bank = banks.find((item) => item.id === chosen) ?? offers[0]?.bank;
    const offer = offers.find((item) => item.bank.id === bank?.id);
    const created = addRequest({
      kind: "finance",
      title: bank ? tx(bank.name) : tx(L("تمويل", "Finance")),
      detail: `${money(priceOmr)} · ${years} ${tx(L("سنوات", "years"))} · ${tx(L("قسط", "instalment"))} ${offer ? money(offer.monthly) : "—"} · ${tx(L("دخل", "income"))} ${income}`,
      status: "matching",
    });
    setSent(created.ref);
  }

  return (
    <div>
      <PageHeader
        kicker={L("التمويل", "Finance")}
        title={L("القسط يُقارن هنا، والملف يذهب للبنك.", "The instalment is compared here. The file goes to the bank.")}
        lead={L("ليست حاسبة منفصلة عن السيارة. تختار العرض ثم يُرسل الطلب للجهة، ويبقى القرار لها بعد المستندات.", "This is not a calculator sitting apart from the car. You choose an offer, the request goes to that house, and the decision stays with them after the documents.")}
      />
      <div className="mx-auto max-w-3xl px-5 py-12">
        {sent ? (
          <Receipt refCode={sent} title={tx(L("الملف عند الجهة المختارة.", "The file is with the house you chose."))} detail={tx(L("سيراجعون الدخل ونوع العمل. لا يُخصم قسط قبل الموافقة.", "They review income and employment. No instalment is taken before approval."))} />
        ) : (
          <div className="space-y-8">
            <Steps labels={labels} index={step} />
            {step === 0 && (
              <div className="grid gap-4">
                <Field label={tx(L("سيارة من السوق، أو مبلغ حر", "A car from the market, or a free amount"))}>
                  <select
                    className={fieldClass}
                    value={carSlug}
                    onChange={(event) => {
                      setCarSlug(event.target.value);
                      const car = carBySlug(event.target.value);
                      if (car) setPrice(String(car.priceOmr));
                    }}
                  >
                    <option value="">{tx(L("مبلغ بدون سيارة محددة", "An amount, no specific car"))}</option>
                    {cars.map((car) => <option key={car.slug} value={car.slug}>{tx(car.title)} · {car.year}</option>)}
                  </select>
                </Field>
                <Field label={tx(L("سعر السيارة بالريال العُماني", "Car price in Omani rial"))}>
                  <input className={fieldClass} inputMode="decimal" value={price} onChange={(event) => setPrice(event.target.value)} />
                </Field>
                <Field label={tx(L("الدفعة المقدمة", "Down payment")) + ` ${down}%`}>
                  <input type="range" min={0} max={50} value={down} onChange={(event) => setDown(Number(event.target.value))} className="w-full" />
                </Field>
                <Field label={tx(L("المدة", "Term"))}>
                  <select className={fieldClass} value={years} onChange={(event) => setYears(Number(event.target.value))}>
                    {[3, 4, 5, 6, 7].map((year) => <option key={year} value={year}>{year}</option>)}
                  </select>
                </Field>
                <Primary onClick={() => setStep(1)}>{tx(L("التالي", "Continue"))}</Primary>
              </div>
            )}
            {step === 1 && (
              <div className="grid gap-4">
                <Field label={tx(L("الدخل الشهري بالريال العُماني", "Monthly income in Omani rial"))}>
                  <input className={fieldClass} value={income} onChange={(event) => setIncome(event.target.value)} />
                </Field>
                <Field label={tx(L("جهة العمل", "Employer"))}>
                  <select className={fieldClass} value={employer} onChange={(event) => setEmployer(event.target.value)}>
                    <option value="government">{tx(L("حكومي", "Government"))}</option>
                    <option value="private">{tx(L("خاص", "Private"))}</option>
                    <option value="self">{tx(L("عمل حر", "Self-employed"))}</option>
                  </select>
                </Field>
                <div className="flex gap-3">
                  <Primary onClick={() => setStep(0)}>{tx(L("رجوع", "Back"))}</Primary>
                  <Primary onClick={() => { if (offers[0]) setChosen(offers[0].bank.id); setStep(2); }}>{tx(L("اعرض العروض", "Show offers"))}</Primary>
                </div>
              </div>
            )}
            {step === 2 && (
              <div className="space-y-4">
                {offers.length === 0 && <p className="text-sm text-muted">{tx(L("لا توجد جهة تقبل هذه الدفعة والمدة. عدّل الاختيار.", "No house accepts this down payment and term. Adjust the selection."))}</p>}
                {offers.map((offer) => (
                  <label key={offer.bank.id} className={`block border p-4 ${chosen === offer.bank.id ? "border-night" : "border-line"}`}>
                    <input type="radio" name="bank" className="me-2" checked={chosen === offer.bank.id} onChange={() => setChosen(offer.bank.id)} />
                    <span className="font-medium">{tx(offer.bank.name)}</span>
                    <span className="mt-2 block text-sm">{tx(L("قسط شهري", "Monthly"))} {money(offer.monthly)} · {offer.bank.apr}%</span>
                    <span className="mt-1 block text-xs text-muted">{tx(offer.bank.note)} · {tx(L("إجمالي", "Total"))} {money(offer.total)}</span>
                  </label>
                ))}
                <p className="text-xs text-muted">{tx(L("جهة العمل المسجّلة", "Employer on file"))}: {employer === "government" ? tx(L("حكومي", "Government")) : employer === "self" ? tx(L("عمل حر", "Self-employed")) : tx(L("خاص", "Private"))}</p>
                <div className="flex gap-3">
                  <Primary onClick={() => setStep(1)}>{tx(L("رجوع", "Back"))}</Primary>
                  <Primary onClick={submit}>{tx(L("أرسل الملف", "Send the file"))}</Primary>
                </div>
                <DemoNote />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
