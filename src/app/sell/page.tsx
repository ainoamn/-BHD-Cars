"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { listingSections, sectionGroups } from "@/lib/listing-sections";
import { usePrefs } from "@/lib/prefs";
import type { Copy } from "@/lib/types";

const L = (ar: string, en: string): Copy => ({ ar, en });

export default function Page() {
  const { tx, locale } = usePrefs();
  const [query, setQuery] = useState("");
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiBusy, setAiBusy] = useState(false);
  const [aiHint, setAiHint] = useState<string | null>(null);
  const [suggestedId, setSuggestedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return listingSections;
    return listingSections.filter((section) => {
      const hay = `${section.name.ar} ${section.name.en} ${section.blurb.ar} ${section.blurb.en}`.toLowerCase();
      return hay.includes(q) || section.name.ar.includes(query);
    });
  }, [query]);

  async function askRoute() {
    const prompt = aiPrompt.trim();
    if (!prompt) return;
    setAiBusy(true);
    setAiHint(null);
    try {
      const res = await fetch("/api/ai/listing-assist", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ locale, action: "route", prompt }),
      });
      const json = (await res.json()) as { sectionId?: string; reason?: string };
      if (json.sectionId) {
        setSuggestedId(json.sectionId);
        setAiHint(json.reason || null);
      }
    } finally {
      setAiBusy(false);
    }
  }

  return (
    <div className="min-h-[75vh] bg-gradient-to-b from-sand/50 via-ivory to-soft/40">
      <div className="mx-auto max-w-3xl px-5 py-12 md:py-16">
        <p className="eyebrow">{tx(L("مسار العرض", "Listing path"))}</p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-night md:text-4xl">
          {tx(L("ماذا تعرض اليوم؟", "What are you offering today?"))}
        </h1>
        <p className="mt-3 max-w-2xl text-muted">
          {tx(
            L(
              "مسارات قصيرة بمصطلحات دقيقة — والمساعد يقترح المسار إن لم تكن متأكدًا. لا قوائم متشعّبة بلا نهاية.",
              "Short paths with precise terms — the assistant suggests a route if you are unsure. No endless nested menus.",
            ),
          )}
        </p>

        <div className="mt-8 space-y-3 rounded-[1.5rem] border border-teal/25 bg-gradient-to-br from-teal/5 to-paper p-4 md:p-5">
          <p className="text-sm font-semibold text-night">
            {tx(L("مساعد اختيار المسار", "Path assistant"))}
          </p>
          <p className="text-sm text-muted">
            {tx(
              L(
                "صف ما تريد عرضه بجملة واحدة — نقترح المسار الأنسب دون نسخ قوائم مواقع أخرى.",
                "Describe what you want to list in one sentence — we suggest the best path without copying other sites’ menus.",
              ),
            )}
          </p>
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              className="field flex-1"
              value={aiPrompt}
              onChange={(event) => setAiPrompt(event.target.value)}
              placeholder={tx(
                L("مثال: أريد تأجير بيك أب شهريًا مع توصيل", "e.g. I want to hire out a pickup monthly with delivery"),
              )}
            />
            <button type="button" className="btn-teal shrink-0" disabled={aiBusy || !aiPrompt.trim()} onClick={() => void askRoute()}>
              {aiBusy ? tx(L("جارٍ الاقتراح…", "Suggesting…")) : tx(L("اقترح المسار", "Suggest path"))}
            </button>
          </div>
          {aiHint && (
            <div className="rounded-2xl border border-line bg-paper px-4 py-3 text-sm text-muted">
              <p className="text-night">{aiHint}</p>
              {suggestedId && (
                <Link href={`/sell/${suggestedId}`} className="btn-primary mt-3 inline-flex">
                  {tx(L("افتح المسار المقترح", "Open suggested path"))}
                </Link>
              )}
            </div>
          )}
        </div>

        <label className="relative mt-8 block">
          <span className="pointer-events-none absolute inset-y-0 start-4 flex items-center text-muted">⌕</span>
          <input
            className="field ps-11"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={tx(L("ابحث في المسارات…", "Search paths…"))}
          />
        </label>

        <div className="mt-8 space-y-8">
          {sectionGroups.map((group) => {
            const items = filtered.filter((section) => section.group === group.id);
            if (!items.length) return null;
            return (
              <section key={group.id} className="space-y-3">
                <div>
                  <h2 className="text-lg font-semibold text-night">{tx(group.name)}</h2>
                  <p className="text-sm text-muted">{tx(group.lead)}</p>
                </div>
                <div className="space-y-3">
                  {items.map((section) => {
                    const suggested = suggestedId === section.id;
                    return (
                      <Link
                        key={section.id}
                        href={`/sell/${section.id}`}
                        className={`surface-card surface-card-hover flex items-center gap-4 px-4 py-4 transition md:px-5 ${
                          suggested ? "border-teal ring-1 ring-teal/30" : ""
                        }`}
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
                    );
                  })}
                </div>
              </section>
            );
          })}
          {filtered.length === 0 && (
            <p className="rounded-2xl border border-dashed border-line bg-paper px-4 py-8 text-center text-sm text-muted">
              {tx(L("لا يوجد مسار بهذا الاسم — جرّب المساعد أعلاه.", "No path matches — try the assistant above."))}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
