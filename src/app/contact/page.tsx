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
  const [name, setName] = useState("");
  const [note, setNote] = useState("");

  return (
    <div>
      <PageHeader kicker={L("تواصل", "Contact")} title={L("مكتب واحد، لا رقم يضيع في الإعلان.", "One desk, not a number lost on a listing.")} lead={L("مسقط · رد خلال يوم عمل على طلبات الشراكة والمعارض.", "Muscat · partnership and showroom notes are answered within a working day.")} />
      <div className="mx-auto grid max-w-6xl gap-6 px-5 py-10 md:grid-cols-2">
        <div className="surface-card p-6 text-sm leading-relaxed">
          <p className="eyebrow">{tx(L("المكتب", "The desk"))}</p>
          <p className="mt-4 text-lg font-semibold text-night">hello@bhdcars.example</p>
          <p className="mt-2 text-night">+968 2400 1000</p>
          <p className="mt-6 text-muted">{tx(L("غلا، مسقط. المعارض والبنوك وشركات التأمين تتعاقد من هنا.", "Ghala, Muscat. Houses, banks, and insurers contract from here."))}</p>
        </div>
        {sent ? (
          <Receipt refCode={sent} title={tx(L("وصلت الرسالة.", "The note arrived."))} detail={tx(L("ستجدها أيضاً في طلباتك.", "You will also find it among your requests."))} />
        ) : (
          <FormShell>
            <form className="grid gap-4" onSubmit={(event) => {
              event.preventDefault();
              const created = addRequest({ kind: "inquiry", title: name, detail: note, status: "submitted" });
              setSent(created.ref);
            }}>
              <Field label={tx(L("الاسم", "Name"))}><input required className={fieldClass} value={name} onChange={(event) => setName(event.target.value)} /></Field>
              <Field label={tx(L("الرسالة", "Note"))}><textarea required className={fieldClass} rows={5} value={note} onChange={(event) => setNote(event.target.value)} /></Field>
              <Primary type="submit">{tx(L("أرسل", "Send"))}</Primary>
            </form>
          </FormShell>
        )}
      </div>
    </div>
  );
}
