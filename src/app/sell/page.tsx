"use client";

import Link from "next/link";
import { usePrefs } from "@/lib/prefs";
import type { Copy } from "@/lib/types";

const L = (ar: string, en: string): Copy => ({ ar, en });

const paths = [
  {
    href: "/sell/ready",
    kicker: L("بدون حادث", "No accident"),
    title: L("سيارة جاهزة للبيع", "A ready car for sale"),
    text: L("إعلان شفاف للسيارات السليمة. سعر مقابل السوق، وفحص اختياري.", "A clear listing for undamaged cars. Price against the market, optional inspection."),
    tone: "ready" as const,
  },
  {
    href: "/sell/accident",
    kicker: L("حادث معلن", "Declared accident"),
    title: L("سيارة بحادث — الضرر يُعلن لا يُخفى", "Accident car — damage is declared, not hidden"),
    text: L("خريطة ضرر، حالة الإصلاح، صور الضرر، وملكية واضحة. أقوى من إعلان «حوادث» عام.", "A damage map, repair state, damage photos, and a clear title. Stronger than a vague salvage ad."),
    tone: "accident" as const,
  },
];

export default function Page() {
  const { tx } = usePrefs();

  return (
    <div className="min-h-[75vh] bg-gradient-to-b from-sand/50 to-ivory">
      <div className="mx-auto max-w-4xl px-5 py-12 md:py-16">
        <p className="eyebrow">{tx(L("أضف إعلاناً", "Add a listing"))}</p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-night md:text-4xl">
          {tx(L("ماذا تبيع؟", "What are you selling?"))}
        </h1>
        <p className="mt-3 max-w-2xl text-muted">
          {tx(L(
            "نبدأ بالتصنيف حتى لا تختلط السيارة الجاهزة بسيارة الحادث — كما يفعل سوق كارز، لكن بمسار أوضح لكل نوع.",
            "We start with the category so a ready car never mixes with a salvage car — like Sooq Cars, but with a clearer path for each type.",
          ))}
        </p>

        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {paths.map((path) => (
            <Link
              key={path.href}
              href={path.href}
              className={`surface-card surface-card-hover block p-6 ${
                path.tone === "accident" ? "border-live/25" : ""
              }`}
            >
              <p className={`text-xs font-semibold tracking-[0.14em] ${path.tone === "accident" ? "text-live" : "text-brass"}`}>
                {tx(path.kicker)}
              </p>
              <h2 className="mt-3 text-2xl font-bold tracking-tight text-night">{tx(path.title)}</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted">{tx(path.text)}</p>
              <span className={`mt-6 inline-flex ${path.tone === "accident" ? "btn-secondary" : "btn-primary"}`}>
                {tx(L("ابدأ", "Start"))}
              </span>
            </Link>
          ))}
        </div>

        <p className="mt-8 text-center text-sm text-muted">
          <Link href="/plates" className="text-navy hover:text-brass">{tx(L("أو أعلن عن لوحة مميزة", "Or list a distinctive plate"))}</Link>
        </p>
      </div>
    </div>
  );
}
