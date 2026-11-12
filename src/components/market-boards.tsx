"use client";

import { useState } from "react";
import { ChoiceCard, DemoNote, Field, FormShell, PageHeader, Photo, Primary, Receipt, fieldClass } from "@/components/ui";
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
      <div className="page-wrap grid gap-6 px-5 py-10 md:grid-cols-2">
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
    <article className="surface-card surface-card-hover overflow-hidden">
      <Photo src={car.image} alt={tx(car.title)} className="aspect-[16/9] w-full" />
      <div className="p-5">
        <p className="text-xs text-muted">{car.company} · {tx(car.city)} · {car.year}</p>
        <h2 className="mt-1 text-2xl font-bold tracking-tight text-night">{tx(car.title)}</h2>
        <p className="mt-3 text-lg font-semibold text-night">{money(car.dayOmr)} <span className="text-sm font-normal text-muted">{tx(L("في اليوم", "a day"))}</span></p>
        <p className="mt-1 text-sm text-muted">{money(car.monthOmr)} {tx(L("في الشهر", "a month"))}</p>
        <p className="mt-1 text-xs text-muted">{car.kmDay} {tx(L("كم في اليوم", "km a day"))} · {tx(L("تأمين", "Deposit"))} {money(car.depositOmr)}</p>
        <ul className="mt-3 flex flex-wrap gap-2">
          {car.includes.map((item) => <li key={item.en} className="chip">{tx(item)}</li>)}
        </ul>
        {!open && (
          <button type="button" className="btn-primary mt-5" onClick={() => setOpen(true)}>
            {tx(L("اطلب الحجز", "Request a booking"))}
          </button>
        )}
        {open && !sent && (
          <div className="mt-4 grid gap-3">
            <div className="flex flex-wrap gap-2">
              {([
                ["day", L("يوم", "Day")],
                ["week", L("أسبوع", "Week")],
                ["month", L("شهر", "Month")],
              ] as const).map(([id, label]) => (
                <button key={id} type="button" onClick={() => setTerm(id)} className={term === id ? "chip chip-active" : "chip"}>
                  {tx(label)}
                </button>
              ))}
            </div>
            <Primary onClick={book}>{tx(L("أرسل الطلب", "Send the request"))} · {money(price)}</Primary>
          </div>
        )}
        {sent && (
          <div className="mt-4">
            <Receipt refCode={sent} title={tx(L("طلب التأجير وصل الشركة.", "The rental request reached the company."))} detail={tx(L("يؤكدون التوفر قبل أي مبلغ.", "They confirm availability before any payment."))} />
          </div>
        )}
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
      <div className="page-wrap py-10">
        <div className="grid gap-5 md:grid-cols-3">
          {parts.map((part) => (
            <article key={part.slug} className="surface-card surface-card-hover overflow-hidden">
              <Photo src={part.image} alt={tx(part.title)} className="aspect-[4/3] w-full" />
              <div className="p-4">
                <p className="text-xs text-muted">{part.condition === "new" ? tx(L("جديد", "New")) : tx(L("مستعمل", "Used"))} · {tx(part.city)}</p>
                <h2 className="mt-1 text-lg font-semibold text-night">{tx(part.title)}</h2>
                <p className="mt-1 text-xl font-bold text-night">{money(part.priceOmr)}</p>
                <p className="mt-1 text-xs text-muted">{tx(part.fit)} · {part.seller}</p>
                <button
                  type="button"
                  className="btn-secondary mt-4 w-full"
                  onClick={() => {
                    const created = addRequest({ kind: "part", title: tx(part.title), detail: part.seller, status: "matching" });
                    setSent(created.ref);
                  }}
                >
                  {tx(L("اطلب القطعة", "Request the part"))}
                </button>
              </div>
            </article>
          ))}
        </div>
        <form
          className="surface-card mt-10 grid max-w-xl gap-4 p-6"
          onSubmit={(event) => {
            event.preventDefault();
            const created = addRequest({ kind: "part", title: need || tx(L("طلب قطعة", "Part request")), detail: vin, status: "submitted" });
            setSent(created.ref);
          }}
        >
          <h2 className="text-2xl font-bold tracking-tight text-night">{tx(L("لم تجدها؟", "Not on the list?"))}</h2>
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
      <div className="page-wrap grid gap-5 px-5 py-10 md:grid-cols-3">
        {yards.map((yard) => (
          <article key={yard.slug} className="surface-card p-5">
            <h2 className="text-xl font-bold text-night">{tx(yard.name)}</h2>
            <p className="mt-2 text-sm text-muted">{tx(yard.city)} · {money(yard.pricePerTon)} / {tx(L("طن", "tonne"))}</p>
            <p className="mt-3 text-sm leading-relaxed text-ink/90">{tx(yard.note)}</p>
            <p className="mt-2 text-xs font-medium text-brass">{yard.pickup ? tx(L("استلام متاح", "Collection available")) : tx(L("تسليم في الساحة", "Drop-off at the yard"))}</p>
            <button
              type="button"
              className="btn-secondary mt-5"
              onClick={() => {
                const created = addRequest({ kind: "scrap", title: tx(yard.name), detail: tx(yard.city), status: "matching" });
                setSent(created.ref);
              }}
            >
              {tx(L("اطلب تقديراً", "Ask for an estimate"))}
            </button>
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
      <div className="page-wrap grid gap-3 px-5 py-10">
        {plates.map((plate) => (
          <article key={plate.slug} className="surface-card flex flex-wrap items-center justify-between gap-4 px-5 py-4">
            <div>
              <p className="text-3xl font-bold tracking-[0.2em] text-night">{plate.number}</p>
              <p className="text-xs text-muted">{plate.code} · {tx(plate.city)}</p>
            </div>
            <div className="text-end">
              <p className="text-xl font-bold text-night">{money(plate.priceOmr)}</p>
              <button
                type="button"
                className="mt-2 text-sm font-medium text-navy hover:text-brass"
                onClick={() => {
                  const created = addRequest({ kind: "plate", title: plate.number, detail: plate.code, status: "matching" });
                  setSent(created.ref);
                }}
              >
                {tx(L("اطلب النقل", "Request the transfer"))}
              </button>
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
      <div className="mx-auto max-w-3xl px-5 py-10">
        {sent ? (
          <Receipt refCode={sent} title={tx(L("الورشة رأت الطلب.", "The workshop has the request."))} detail={tx(L("يؤكدون الموعد قبل الحضور.", "They confirm the slot before you arrive."))} />
        ) : (
          <FormShell>
            <div className="grid gap-3">
              {workshops.map((item) => (
                <ChoiceCard
                  key={item.id}
                  selected={workshop === item.id}
                  title={`${tx(item.name)} · ${tx(item.city)}`}
                  meta={tx(item.services)}
                  onSelect={() => setWorkshop(item.id)}
                />
              ))}
            </div>
            <Field label={tx(L("ماذا تحتاج", "What you need"))}>
              <textarea className={fieldClass} rows={3} value={note} onChange={(event) => setNote(event.target.value)} />
            </Field>
            <Primary onClick={() => {
              const item = workshops.find((entry) => entry.id === workshop)!;
              const created = addRequest({ kind: "service", title: tx(item.name), detail: note || tx(item.services), status: "matching" });
              setSent(created.ref);
            }}>{tx(L("اطلب الموعد", "Request the slot"))}</Primary>
          </FormShell>
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
      <div className="mx-auto max-w-xl px-5 py-10">
        {sent ? (
          <Receipt refCode={sent} title={tx(L("التقرير قيد الجمع.", "The report is being assembled."))} detail={tx(L("يظهر الملخص في الطلبات. بعض الدول لا تفصح عن كل الحوادث.", "The summary appears in requests. Some countries do not disclose every accident."))} />
        ) : (
          <FormShell>
            <form className="grid gap-4" onSubmit={(event) => {
              event.preventDefault();
              const created = addRequest({ kind: "report", title: vin || "VIN", detail: tx(L("تقرير هيكل", "History report")), status: "matching" });
              setSent(created.ref);
            }}>
              <Field label={tx(L("رقم الهيكل", "VIN"))}>
                <input required className={fieldClass} value={vin} onChange={(event) => setVin(event.target.value)} placeholder="WDB..." />
              </Field>
              <Primary type="submit">{tx(L("اطلب التقرير", "Request the report"))}</Primary>
              <DemoNote />
            </form>
          </FormShell>
        )}
      </div>
    </div>
  );
}
