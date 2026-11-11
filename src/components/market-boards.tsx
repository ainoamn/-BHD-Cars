"use client";

import { useState } from "react";
import { DemoNote, Field, PageHeader, Photo, Primary, Receipt, fieldClass } from "@/components/ui";
import { parts, plates, rentals, workshops, yards } from "@/lib/data";
import { usePrefs } from "@/lib/prefs";
import { useStore } from "@/lib/store";
import type { Copy, Rental } from "@/lib/types";

const L = (ar: string, en: string): Copy => ({ ar, en });

export function RentalBoard() {
  return (
    <div>
      <PageHeader
        kicker={L("التأجير", "Rental")}
        title={L("السعر يشمل التأمين وسقف الكيلومترات.", "The price includes cover and a mileage cap.")}
        lead={L("يومي أو أسبوعي أو شهري، من شركات معلنة، مع توصيل حيث هو مكتوب.", "Daily, weekly, or monthly, from named companies, with delivery where it is written.")}
      />
      <div className="mx-auto grid max-w-6xl gap-8 px-5 py-12 md:grid-cols-2">
        {rentals.map((car) => <RentalCard key={car.slug} car={car} />)}
      </div>
    </div>
  );
}

function RentalCard({ car }: { car: Rental }) {
  const { tx, money } = usePrefs();
  const { addRequest } = useStore();
  const [open, setOpen] = useState(false);
  const [term, setTerm] = useState("day");
  const [sent, setSent] = useState<string | null>(null);
  const price = term === "month" ? car.monthOmr : term === "week" ? car.weekOmr : car.dayOmr;

  function book() {
    const created = addRequest({
      kind: "rental",
      title: tx(car.title),
      detail: `${term} · ${money(price)} · ${tx(car.city)}`,
      status: "matching",
    });
    setSent(created.ref);
  }

  return (
    <article className="border border-line bg-paper">
      <Photo src={car.image} alt={tx(car.title)} className="aspect-[16/9] w-full" />
      <div className="p-5">
        <p className="text-xs text-muted">{car.company} · {tx(car.city)} · {car.year}</p>
        <h2 className="mt-1 font-display text-3xl">{tx(car.title)}</h2>
        <p className="mt-3 text-sm">{money(car.dayOmr)} {tx(L("في اليوم", "a day"))} · {money(car.monthOmr)} {tx(L("في الشهر", "a month"))}</p>
        <p className="mt-1 text-xs text-muted">{car.kmDay} {tx(L("كم في اليوم", "km a day"))} · {tx(L("تأمين", "Deposit"))} {money(car.depositOmr)}</p>
        <ul className="mt-3 flex flex-wrap gap-2">
          {car.includes.map((item) => <li key={item.en} className="border border-line px-2 py-1 text-xs">{tx(item)}</li>)}
        </ul>
        {!open && <button type="button" className="mt-4 text-sm text-brass" onClick={() => setOpen(true)}>{tx(L("اطلب الحجز", "Request a booking"))}</button>}
        {open && !sent && (
          <div className="mt-4 grid gap-3">
            <select className={fieldClass} value={term} onChange={(event) => setTerm(event.target.value)}>
              <option value="day">{tx(L("يوم", "Day"))}</option>
              <option value="week">{tx(L("أسبوع", "Week"))}</option>
              <option value="month">{tx(L("شهر", "Month"))}</option>
            </select>
            <Primary onClick={book}>{tx(L("أرسل الطلب", "Send the request"))} · {money(price)}</Primary>
          </div>
        )}
        {sent && <div className="mt-4"><Receipt refCode={sent} title={tx(L("طلب التأجير وصل الشركة.", "The rental request reached the company."))} detail={tx(L("يؤكدون التوفر قبل أي مبلغ.", "They confirm availability before any payment."))} /></div>}
      </div>
    </article>
  );
}

export function PartsBoard() {
  const { tx, money } = usePrefs();
  const { addRequest } = useStore();
  const [sent, setSent] = useState<string | null>(null);
  const [vin, setVin] = useState("");
  const [need, setNeed] = useState("");

  return (
    <div>
      <PageHeader kicker={L("قطع الغيار", "Parts")} title={L("قطعة مطابقة للهيكل.", "A part matched to the VIN.")} lead={L("جديد ومستعمل، مع طلب حر إذا لم تجد القطعة في القائمة.", "New and used, with a free request if the part is not on the list.")} />
      <div className="mx-auto max-w-6xl px-5 py-12">
        <div className="grid gap-6 md:grid-cols-3">
          {parts.map((part) => (
            <article key={part.slug} className="border border-line bg-paper">
              <Photo src={part.image} alt={tx(part.title)} className="aspect-[4/3] w-full" />
              <div className="p-4">
                <p className="text-xs text-muted">{part.condition === "new" ? tx(L("جديد", "New")) : tx(L("مستعمل", "Used"))} · {tx(part.city)}</p>
                <h2 className="mt-1 text-lg">{tx(part.title)}</h2>
                <p className="mt-1 text-sm">{money(part.priceOmr)}</p>
                <p className="mt-1 text-xs text-muted">{tx(part.fit)} · {part.seller}</p>
                <button type="button" className="mt-3 text-sm text-brass" onClick={() => {
                  const created = addRequest({ kind: "part", title: tx(part.title), detail: part.seller, status: "matching" });
                  setSent(created.ref);
                }}>{tx(L("اطلب القطعة", "Request the part"))}</button>
              </div>
            </article>
          ))}
        </div>
        <form className="mt-12 grid max-w-xl gap-4" onSubmit={(event) => {
          event.preventDefault();
          const created = addRequest({ kind: "part", title: need || tx(L("طلب قطعة", "Part request")), detail: vin, status: "submitted" });
          setSent(created.ref);
        }}>
          <h2 className="font-display text-3xl">{tx(L("لم تجدها؟", "Not on the list?"))}</h2>
          <Field label={tx(L("رقم الهيكل", "VIN"))}><input className={fieldClass} value={vin} onChange={(event) => setVin(event.target.value)} /></Field>
          <Field label={tx(L("القطعة", "The part"))}><input className={fieldClass} value={need} onChange={(event) => setNeed(event.target.value)} /></Field>
          <Primary type="submit">{tx(L("ابحث لي", "Find it for me"))}</Primary>
          {sent && <Receipt refCode={sent} title={tx(L("طلب القطعة مسجّل.", "The part request is on file."))} detail={tx(L("نرد بالمتوفر والسعر قبل الشحن.", "We reply with availability and price before shipping."))} />}
        </form>
      </div>
    </div>
  );
}

export function ScrapBoard() {
  const { tx, money } = usePrefs();
  const { addRequest } = useStore();
  const [sent, setSent] = useState<string | null>(null);
  return (
    <div>
      <PageHeader kicker={L("السكراب", "Scrap")} title={L("سيارة انتهت، بسعر وزن واضح.", "A car at the end of its life, at a stated weight price.")} lead={L("استلام من البيت حيث هو متاح، وشهادة إسقاط مع العملية.", "Home collection where it is offered, and a deregistration note with the job.")} />
      <div className="mx-auto grid max-w-6xl gap-6 px-5 py-12 md:grid-cols-3">
        {yards.map((yard) => (
          <article key={yard.slug} className="border border-line p-5">
            <h2 className="font-display text-2xl">{tx(yard.name)}</h2>
            <p className="mt-2 text-sm text-muted">{tx(yard.city)} · {money(yard.pricePerTon)} / {tx(L("طن", "tonne"))}</p>
            <p className="mt-3 text-sm leading-relaxed">{tx(yard.note)}</p>
            <p className="mt-2 text-xs text-brass">{yard.pickup ? tx(L("استلام متاح", "Collection available")) : tx(L("تسليم في الساحة", "Drop-off at the yard"))}</p>
            <button type="button" className="mt-4 text-sm" onClick={() => {
              const created = addRequest({ kind: "scrap", title: tx(yard.name), detail: tx(yard.city), status: "matching" });
              setSent(created.ref);
            }}>{tx(L("اطلب تقديراً", "Ask for an estimate"))}</button>
          </article>
        ))}
        {sent && <div className="md:col-span-3"><Receipt refCode={sent} title={tx(L("الساحة ستقدّر الوزن.", "The yard will estimate the weight."))} detail={tx(L("التقدير المبدئي قبل التحريك.", "A first estimate before the car is moved."))} /></div>}
      </div>
    </div>
  );
}

export function PlatesBoard() {
  const { tx, money } = usePrefs();
  const { addRequest } = useStore();
  const [sent, setSent] = useState<string | null>(null);
  return (
    <div>
      <PageHeader kicker={L("اللوحات", "Plates")} title={L("رقم مميز، بمعاملة نقل واضحة.", "A distinctive number, with a clear transfer.")} />
      <div className="mx-auto grid max-w-6xl gap-4 px-5 py-12">
        {plates.map((plate) => (
          <article key={plate.slug} className="flex flex-wrap items-center justify-between gap-4 border border-line px-5 py-4">
            <div>
              <p className="font-display text-3xl tracking-[0.2em]">{plate.number}</p>
              <p className="text-xs text-muted">{plate.code} · {tx(plate.city)}</p>
            </div>
            <div className="text-end">
              <p>{money(plate.priceOmr)}</p>
              <button type="button" className="mt-2 text-sm text-brass" onClick={() => {
                const created = addRequest({ kind: "plate", title: plate.number, detail: plate.code, status: "matching" });
                setSent(created.ref);
              }}>{tx(L("اطلب النقل", "Request the transfer"))}</button>
            </div>
          </article>
        ))}
        {sent && <Receipt refCode={sent} title={tx(L("طلب اللوحة مسجّل.", "The plate request is on file."))} detail={tx(L("النقل يتم بعد التأكد من ملكية الرقم.", "Transfer follows confirmation of ownership."))} />}
      </div>
    </div>
  );
}

export function ServiceBoard() {
  const { tx } = usePrefs();
  const { addRequest } = useStore();
  const [sent, setSent] = useState<string | null>(null);
  const [workshop, setWorkshop] = useState(workshops[0].id);
  const [note, setNote] = useState("");
  return (
    <div>
      <PageHeader kicker={L("الصيانة", "Service")} title={L("موعد ورشة، مربوط بالسيارة.", "A workshop slot, tied to the car.")} lead={L("صيانة دورية أو سمكرة أو كهرباء، من ورش معلنة في المنصة.", "Scheduled service, bodywork, or electrical work, from workshops named on the platform.")} />
      <div className="mx-auto max-w-3xl px-5 py-12">
        {sent ? <Receipt refCode={sent} title={tx(L("الورشة رأت الطلب.", "The workshop has the request."))} detail={tx(L("يؤكدون الموعد قبل الحضور.", "They confirm the slot before you arrive."))} /> : (
          <div className="grid gap-4">
            {workshops.map((item) => (
              <label key={item.id} className={`block border p-4 ${workshop === item.id ? "border-night" : "border-line"}`}>
                <input type="radio" className="me-2" name="workshop" checked={workshop === item.id} onChange={() => setWorkshop(item.id)} />
                {tx(item.name)} · {tx(item.city)}
                <span className="mt-1 block text-sm text-muted">{tx(item.services)}</span>
              </label>
            ))}
            <Field label={tx(L("ماذا تحتاج", "What you need"))}>
              <textarea className={fieldClass} rows={3} value={note} onChange={(event) => setNote(event.target.value)} />
            </Field>
            <Primary onClick={() => {
              const item = workshops.find((entry) => entry.id === workshop)!;
              const created = addRequest({ kind: "service", title: tx(item.name), detail: note || tx(item.services), status: "matching" });
              setSent(created.ref);
            }}>{tx(L("اطلب الموعد", "Request the slot"))}</Primary>
          </div>
        )}
      </div>
    </div>
  );
}

export function ReportsDesk() {
  const { tx } = usePrefs();
  const { addRequest } = useStore();
  const [vin, setVin] = useState("");
  const [sent, setSent] = useState<string | null>(null);
  return (
    <div>
      <PageHeader
        kicker={L("السجل", "History")}
        title={L("ماذا حدث لهذه السيارة قبل الإعلان.", "What happened to this car before the listing.")}
        lead={L("طلب تقرير برقم الهيكل: ملكية، حوادث معلنة حيث تتوفر، وقراءة عداد إن وُجدت.", "A report by VIN: ownership, declared accidents where they exist, and an odometer reading if one is on file.")}
      />
      <div className="mx-auto max-w-xl px-5 py-12">
        {sent ? <Receipt refCode={sent} title={tx(L("التقرير قيد الجمع.", "The report is being assembled."))} detail={tx(L("يظهر الملخص في الطلبات. بعض الدول لا تفصح عن كل الحوادث.", "The summary appears in requests. Some countries do not disclose every accident."))} /> : (
          <form className="grid gap-4" onSubmit={(event) => {
            event.preventDefault();
            const created = addRequest({ kind: "report", title: vin || "VIN", detail: tx(L("تقرير هيكل", "History report")), status: "matching" });
            setSent(created.ref);
          }}>
            <Field label={tx(L("رقم الهيكل", "VIN"))}>
              <input required className={fieldClass} value={vin} onChange={(event) => setVin(event.target.value)} placeholder="WDB..." />
            </Field>
            <Primary type="submit">{tx(L("اطلب التقرير", "Request the report"))}</Primary>
            <p className="text-xs text-muted">{tx(L("رسم التقرير التوضيحي 8 ريالات عُمانية عند الربط الفعلي.", "The illustrative report fee is 8 Omani rial once the feed is connected."))}</p>
          </form>
        )}
      </div>
    </div>
  );
}
