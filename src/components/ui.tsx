"use client";

import Link from "next/link";
import { usePrefs } from "@/lib/prefs";
import type { Copy } from "@/lib/types";

const L = (ar: string, en: string): Copy => ({ ar, en });

export const fieldClass = "field";

export function PageHeader({
  kicker,
  title,
  lead,
  actions,
}: {
  kicker: Copy;
  title: Copy;
  lead?: Copy;
  actions?: React.ReactNode;
}) {
  const { tx } = usePrefs();
  return (
    <header className="border-b border-line/80 bg-paper/70 backdrop-blur">
      <div className="page-wrap flex flex-col gap-6 py-10 md:flex-row md:items-end md:justify-between md:py-12">
        <div className="max-w-3xl">
          <p className="eyebrow">{tx(kicker)}</p>
          <h1 className="section-title mt-3">{tx(title)}</h1>
          {lead && <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted">{tx(lead)}</p>}
        </div>
        {actions}
      </div>
    </header>
  );
}

export function Steps({ labels, index }: { labels: string[]; index: number }) {
  return (
    <ol className="grid gap-2 sm:grid-cols-3">
      {labels.map((label, step) => (
        <li
          key={label}
          className={`rounded-2xl border px-4 py-3 text-sm ${
            step === index ? "border-night bg-night text-ivory" : step < index ? "border-brass/40 bg-soft text-night" : "border-line bg-paper text-muted"
          }`}
        >
          <span className="me-2 tabular-nums opacity-70">{String(step + 1).padStart(2, "0")}</span>
          {label}
        </li>
      ))}
    </ol>
  );
}

export function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-night">{label}</span>
      {children}
      {hint && <span className="mt-2 block text-xs text-muted">{hint}</span>}
    </label>
  );
}

export function Primary({
  children,
  type = "button",
  onClick,
  className = "",
}: {
  children: React.ReactNode;
  type?: "button" | "submit";
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button type={type} onClick={onClick} className={`btn-primary ${className}`}>
      {children}
    </button>
  );
}

export function Ghost({
  children,
  onClick,
  href,
  className = "",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
  className?: string;
}) {
  const classes = `btn-secondary ${className}`;
  if (href) return <Link href={href} className={classes}>{children}</Link>;
  return (
    <button type="button" onClick={onClick} className={classes}>
      {children}
    </button>
  );
}

export function Receipt({ refCode, title, detail }: { refCode: string; title: string; detail: string }) {
  const { tx } = usePrefs();
  return (
    <div className="surface-card overflow-hidden">
      <div className="bg-soft px-6 py-4 text-xs font-medium tracking-[0.14em] text-brass">
        {tx(L("تم استلام الطلب", "Request received"))}
      </div>
      <div className="p-6">
        <p className="text-3xl font-bold tracking-tight text-night">{refCode}</p>
        <h2 className="mt-4 text-lg font-semibold">{title}</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted">{detail}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Ghost href="/requests">{tx(L("متابعة الطلبات", "Track requests"))}</Ghost>
          <Ghost href="/">{tx(L("العودة للرئيسية", "Back home"))}</Ghost>
        </div>
      </div>
    </div>
  );
}

export function DemoNote() {
  const { tx } = usePrefs();
  return (
    <p className="rounded-2xl border border-dashed border-line bg-sand/50 px-4 py-3 text-xs leading-relaxed text-muted">
      {tx(L(
        "العروض والأسماء في هذه النسخة توضيحية. لا تُصدر وثيقة ولا يُعتمد تمويل إلا بعد ربط الشركة أو البنك المتعاقد ومراجعة المستندات.",
        "Offers and names in this version are illustrative. No policy is issued and no finance is approved until a contracted partner reviews the documents.",
      ))}
    </p>
  );
}

export function Photo({ src, alt, className = "" }: { src: string; alt: string; className?: string }) {
  return <img src={src} alt={alt} className={`bg-soft object-cover ${className}`} loading="lazy" />;
}

export function SpecRow({ items }: { items: { label: string; value: string }[] }) {
  return (
    <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {items.map((item) => (
        <div key={item.label} className="rounded-2xl border border-line bg-paper px-4 py-3">
          <dt className="text-xs text-muted">{item.label}</dt>
          <dd className="mt-1 text-sm font-medium text-night">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}

export function ChoiceCard({
  selected,
  title,
  price,
  meta,
  onSelect,
}: {
  selected: boolean;
  title: string;
  price?: string;
  meta?: string;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`w-full rounded-2xl border p-4 text-start transition ${
        selected ? "border-night bg-night text-ivory shadow-card" : "border-line bg-paper hover:border-brass/50"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className={`font-semibold ${selected ? "text-ivory" : "text-night"}`}>{title}</p>
          {meta && <p className={`mt-1 text-xs leading-relaxed ${selected ? "text-ivory/70" : "text-muted"}`}>{meta}</p>}
        </div>
        {price && <p className={`shrink-0 text-lg font-bold tabular-nums ${selected ? "text-ivory" : "text-night"}`}>{price}</p>}
      </div>
    </button>
  );
}

export function FormShell({ children }: { children: React.ReactNode }) {
  return <div className="surface-card mx-auto max-w-3xl space-y-6 p-5 md:p-8">{children}</div>;
}
