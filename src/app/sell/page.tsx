"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { listingSections } from "@/lib/listing-sections";
import { usePrefs } from "@/lib/prefs";
import type { Copy } from "@/lib/types";

const L = (ar: string, en: string): Copy => ({ ar, en });

export default function Page() {
  const { tx, locale } = usePrefs();
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return listingSections;
    return listingSections.filter((section) => {
      const ar = section.name.ar;
      const en = section.name.en.toLowerCase();
      const blurbAr = section.blurb.ar;
      const blurbEn = section.blurb.en.toLowerCase();
      return ar.includes(query) || en.includes(q) || blurbAr.includes(query) || blurbEn.includes(q);
    });
  }, [query]);

  return (
    <div className="min-h-[75vh] bg-gradient-to-b from-sand/50 to-ivory">
      <div className="mx-auto max-w-3xl px-5 py-12 md:py-16">
        <p className="eyebrow">{tx(L("أضف إعلاناً", "Add a listing"))}</p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-night md:text-4xl">
          {tx(L("اختر القسم المناسب لإضافة الإعلان", "Choose the right section for your listing"))}
        </h1>
        <p className="mt-3 max-w-2xl text-muted">
          {tx(
            L(
              "كل قسم له قائمة إدخال خاصة بأهم بياناته — حتى يصل المشتري لما يبحث عنه بسرعة.",
              "Each section has its own entry list with the fields that matter most — so buyers find what they need faster.",
            ),
          )}
        </p>

        <label className="relative mt-8 block">
          <span className="pointer-events-none absolute inset-y-0 start-4 flex items-center text-muted">⌕</span>
          <input
            className="field ps-11"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={tx(L("ابحث عن قسم…", "Search for a section…"))}
          />
        </label>

        <div className="mt-6 space-y-3">
          {filtered.map((section) => (
            <Link
              key={section.id}
              href={`/sell/${section.id}`}
              className="surface-card surface-card-hover flex items-center gap-4 px-4 py-4 transition md:px-5"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-soft text-2xl">
                {section.icon}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-semibold text-night">{tx(section.name)}</span>
                <span className="mt-0.5 block text-sm text-muted">{tx(section.blurb)}</span>
              </span>
              <span className="shrink-0 text-lg text-muted" aria-hidden>
                {locale === "ar" ? "‹" : "›"}
              </span>
            </Link>
          ))}
          {filtered.length === 0 && (
            <p className="rounded-2xl border border-dashed border-line bg-paper px-4 py-8 text-center text-sm text-muted">
              {tx(L("لا يوجد قسم بهذا الاسم.", "No section matches that search."))}
            </p>
          )}
        </div>

        <div className="mt-8 rounded-2xl border border-dashed border-brass/35 bg-sand/30 px-4 py-4 text-sm text-muted">
          <p className="font-medium text-night">{tx(L("هل تحتاج مساعدة؟", "Need help?"))}</p>
          <p className="mt-1">{tx(L("تواصل معنا الآن لاختيار القسم المناسب.", "Contact us to pick the right section."))}</p>
          <Link href="/contact" className="btn-secondary mt-3 inline-flex">
            {tx(L("تواصل معنا", "Contact us"))}
          </Link>
        </div>
      </div>
    </div>
  );
}
