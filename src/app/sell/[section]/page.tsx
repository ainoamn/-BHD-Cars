"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { SectionWizard } from "@/components/section-wizard";
import { findListingSection } from "@/lib/listing-sections";
import { usePrefs } from "@/lib/prefs";
import type { Copy } from "@/lib/types";

const L = (ar: string, en: string): Copy => ({ ar, en });

const carPaths = [
  {
    href: "/sell/ready",
    kicker: L("بدون حادث", "No accident"),
    title: L("سيارة جاهزة للبيع", "A ready car for sale"),
    text: L(
      "إعلان شفاف للسيارات السليمة مع مواصفات كاملة وسعر مقابل السوق.",
      "A clear listing for undamaged cars with full specs and market pricing.",
    ),
    tone: "ready" as const,
  },
  {
    href: "/sell/accident",
    kicker: L("حادث معلن", "Declared accident"),
    title: L("سيارة بحادث — الضرر يُعلن لا يُخفى", "Accident car — damage is declared"),
    text: L(
      "خريطة ضرر، حالة الإصلاح، صور الضرر، وملكية واضحة.",
      "Damage map, repair state, damage photos, and a clear title.",
    ),
    tone: "accident" as const,
  },
];

export default function Page() {
  const params = useParams<{ section: string }>();
  const { tx } = usePrefs();
  const section = findListingSection(params.section);

  if (!section) {
    return (
      <div className="mx-auto max-w-xl px-5 py-16 text-center">
        <h1 className="text-2xl font-bold text-night">{tx(L("القسم غير موجود", "Section not found"))}</h1>
        <Link href="/sell" className="btn-primary mt-6 inline-flex">
          {tx(L("العودة للأقسام", "Back to sections"))}
        </Link>
      </div>
    );
  }

  if (section.mode === "cars-sale") {
    return (
      <div className="min-h-[75vh] bg-gradient-to-b from-sand/50 to-ivory">
        <div className="mx-auto max-w-4xl px-5 py-12 md:py-16">
          <Link href="/sell" className="text-sm text-muted hover:text-night">
            {tx(L("← الأقسام", "← Sections"))}
          </Link>
          <p className="eyebrow mt-4">
            {section.icon} {tx(section.name)}
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-night md:text-4xl">
            {tx(L("ما نوع السيارة؟", "What kind of car?"))}
          </h1>
          <p className="mt-3 max-w-2xl text-muted">
            {tx(
              L(
                "نفرّق الجاهزة عن الحادث حتى لا تختلط الثقة — ثم نفتح قائمة الإدخال الخاصة بكل مسار.",
                "We separate ready from accident so trust stays clear — then open the right entry list.",
              ),
            )}
          </p>

          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {carPaths.map((path) => (
              <Link
                key={path.href}
                href={path.href}
                className={`surface-card surface-card-hover block p-6 ${
                  path.tone === "accident" ? "border-live/25" : ""
                }`}
              >
                <p
                  className={`text-xs font-semibold tracking-[0.14em] ${
                    path.tone === "accident" ? "text-live" : "text-brass"
                  }`}
                >
                  {tx(path.kicker)}
                </p>
                <h2 className="mt-3 text-2xl font-bold tracking-tight text-night">{tx(path.title)}</h2>
                <p className="mt-3 text-sm leading-relaxed text-muted">{tx(path.text)}</p>
                <span className={`mt-6 inline-flex ${path.tone === "accident" ? "btn-secondary" : "btn-primary"}`}>
                  {tx(L("ابدأ الإدخال", "Start entry"))}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return <SectionWizard section={section} />;
}
