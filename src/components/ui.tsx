"use client";

import Link from "next/link";
import { usePrefs } from "@/lib/prefs";
import type { Copy } from "@/lib/types";

const L = (ar: string, en: string): Copy => ({ ar, en });

export const fieldClass =
  "w-full border border-line bg-paper px-3 py-3 text-sm text-ink outline-none transition placeholder:text-muted/70 focus:border-brass";

export function PageHeader({ kicker, title, lead }: { kicker: Copy; title: Copy; lead?: Copy }) {
  const { tx } = usePrefs();
  return (
    <header className="border-b border-line">
      <div className="mx-auto max-w-6xl px-5 py-14">
        <p className="text-xs text-brass">{tx(kicker)}</p>
        <h1 className="mt-3 max-w-3xl font-display text-4xl leading-[1.15] text-night md:text-5xl">{tx(title)}</h1>
        {lead && <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted">{tx(lead)}</p>}
      </div>
    </header>
  );
}

export function Steps({ labels, index }: { labels: string[]; index: number }) {
  return (
    <ol className="flex flex-wrap gap-x-5 gap-y-2 border-b border-line pb-4 text-sm">
      {labels.map((label, step) => (
        <li key={label} className={step === index ? "text-night" : "text-muted"}>
          <span className="me-2 tabular-nums text-brass">{String(step + 1).padStart(2, "0")}</span>
          {label}
        </li>
      ))}
    </ol>
  );
}

export function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs text-muted">{label}</span>
      {children}
    </label>
  );
}

export function Primary({ children, type = "button", onClick }: { children: React.ReactNode; type?: "button" | "submit"; onClick?: () => void }) {
  return (
    <button type={type} onClick={onClick} className="bg-night px-5 py-3 text-sm text-ivory transition hover:bg-ink">
      {children}
    </button>
  );
}

export function Ghost({ children, onClick, href }: { children: React.ReactNode; onClick?: () => void; href?: string }) {
  const className = "border border-line px-5 py-3 text-sm transition hover:border-night";
  if (href) return <Link href={href} className={className}>{children}</Link>;
  return <button type="button" onClick={onClick} className={className}>{children}</button>;
}

export function Receipt({ refCode, title, detail }: { refCode: string; title: string; detail: string }) {
  const { tx } = usePrefs();
  return (
    <div className="border border-night bg-paper p-6">
      <p className="text-xs text-brass">{tx(L("تم استلام الطلب", "Request received"))}</p>
      <p className="mt-2 font-display text-3xl text-night">{refCode}</p>
      <h2 className="mt-4 text-lg">{title}</h2>
      <p className="mt-2 text-sm leading-relaxed text-muted">{detail}</p>
      <div className="mt-6 flex flex-wrap gap-3">
        <Ghost href="/requests">{tx(L("متابعة الطلبات", "Track requests"))}</Ghost>
        <Ghost href="/">{tx(L("العودة للرئيسية", "Back home"))}</Ghost>
      </div>
    </div>
  );
}

export function DemoNote() {
  const { tx } = usePrefs();
  return (
    <p className="text-xs leading-relaxed text-muted">
      {tx(L(
        "العروض والأسماء في هذه النسخة توضيحية. لا تُصدر وثيقة ولا يُعتمد تمويل إلا بعد ربط الشركة أو البنك المتعاقد ومراجعة المستندات.",
        "Offers and names in this version are illustrative. No policy is issued and no finance is approved until a contracted partner reviews the documents.",
      ))}
    </p>
  );
}

export function Photo({ src, alt, className = "" }: { src: string; alt: string; className?: string }) {
  return <img src={src} alt={alt} className={`bg-sand object-cover ${className}`} />;
}
