"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { Photo } from "@/components/ui";
import { usePrefs } from "@/lib/prefs";
import type { AuctionLotRow } from "@/lib/auctions/store";
import type { Copy } from "@/lib/types";

const L = (ar: string, en: string): Copy => ({ ar, en });

export function useEndsAtCountdown(endsAt: string, serverNow?: string) {
  const [left, setLeft] = useState<number | null>(null);

  useEffect(() => {
    const skew = serverNow ? Date.now() - new Date(serverNow).getTime() : 0;
    const tick = () => {
      const end = new Date(endsAt).getTime();
      const now = Date.now() - skew;
      setLeft(Math.max(0, end - now));
    };
    tick();
    const timer = window.setInterval(tick, 1000);
    return () => window.clearInterval(timer);
  }, [endsAt, serverNow]);

  return left;
}

export function formatRemain(ms: number) {
  const total = Math.max(0, Math.floor(ms / 1000));
  const days = Math.floor(total / 86400);
  const hours = Math.floor((total % 86400) / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;
  const pad = (value: number) => String(value).padStart(2, "0");
  if (days > 0) return `${days}d ${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

function highOf(lot: AuctionLotRow) {
  return Math.max(Number(lot.opening_omr), Number(lot.high_bid_omr));
}

function LotCard({
  lot,
  serverNow,
  featured = false,
}: {
  lot: AuctionLotRow;
  serverNow?: string;
  featured?: boolean;
}) {
  const { tx, money } = usePrefs();
  const left = useEndsAtCountdown(lot.ends_at, serverNow);
  const live = lot.status === "live";
  const upcoming = lot.status === "scheduled";

  return (
    <article className={`surface-card overflow-hidden ${featured ? "ring-1 ring-brass/40" : ""}`}>
      <div className="relative aspect-[16/10] overflow-hidden">
        <Photo src={lot.image} alt={tx({ ar: lot.title_ar, en: lot.title_en })} className="h-full w-full" />
        <div className="absolute inset-0 bg-gradient-to-t from-night/75 via-transparent to-transparent" />
        <div className="absolute inset-x-3 bottom-3 flex items-center justify-between gap-2">
          <span className="rounded-full bg-paper/95 px-2.5 py-1 text-[11px] font-semibold text-night">
            {live
              ? tx(L("مباشر", "Live"))
              : upcoming
                ? tx(L("قريبًا", "Upcoming"))
                : tx(L("منتهٍ", "Ended"))}
          </span>
          {live ? (
            <span className="rounded-full bg-night/80 px-2.5 py-1 text-[11px] font-semibold tabular-nums text-ivory">
              {left === null ? "—" : formatRemain(left)}
            </span>
          ) : null}
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-bold tracking-tight text-night">{tx({ ar: lot.title_ar, en: lot.title_en })}</h3>
        <p className="mt-1 text-sm text-muted">
          {tx({ ar: lot.city_ar, en: lot.city_en })} · {tx({ ar: lot.origin_ar, en: lot.origin_en })} · {lot.year}
        </p>
        <p className="mt-3 text-2xl font-bold text-night">{money(highOf(lot))}</p>
        <p className="mt-1 text-xs text-muted">
          {Number(lot.bid_count)} {tx(L("مزايدة", "bids"))} · {tx(L("خطوة", "step"))} {money(Number(lot.increment_omr))}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link href={`/auctions/${lot.slug}`} className="btn-secondary px-3 py-2 text-xs">
            {tx(L("التفاصيل", "Details"))}
          </Link>
          {live ? (
            <Link href={`/auctions/${lot.slug}`} className="btn-teal px-3 py-2 text-xs">
              {tx(L("قدّم مزايدة", "Place bid"))}
            </Link>
          ) : upcoming ? (
            <span className="inline-flex items-center rounded-full border border-line px-3 py-2 text-xs text-muted">
              {tx(L("قريبًا", "Coming soon"))}
            </span>
          ) : null}
        </div>
      </div>
    </article>
  );
}

function Section({ title, lead, children }: { title: string; lead?: string; children: ReactNode }) {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="section-title">{title}</h2>
        {lead ? <p className="mt-1 text-sm text-muted">{lead}</p> : null}
      </div>
      {children}
    </section>
  );
}

export type AuctionBoardPayload = {
  serverNow: string;
  stats: { live: number; upcoming: number; ended: number; bids: number };
  buckets: {
    featured: AuctionLotRow[];
    live: AuctionLotRow[];
    upcoming: AuctionLotRow[];
    ended: AuctionLotRow[];
  };
};

export function AuctionsBoard({ initial }: { initial: AuctionBoardPayload }) {
  const { tx } = usePrefs();
  const [q, setQ] = useState("");
  const [data, setData] = useState(initial);

  async function search(event: FormEvent) {
    event.preventDefault();
    const res = await fetch(`/api/auctions?q=${encodeURIComponent(q)}`);
    if (!res.ok) return;
    setData((await res.json()) as AuctionBoardPayload);
  }

  const { featured, live, upcoming, ended } = data.buckets;

  return (
    <div>
      <section className="relative overflow-hidden border-b border-line bg-night text-ivory">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgb(8_163_159_/_0.28),transparent_45%),radial-gradient(ellipse_at_bottom_right,rgb(181_141_85_/_0.18),transparent_40%)]" />
        <div className="relative page-wrap px-5 py-14 md:py-16">
          <p className="text-xs font-semibold tracking-[0.18em] text-brass">
            {tx(L("BHD CARS · مزاد المركبات", "BHD CARS · Vehicle auction"))}
          </p>
          <h1 className="mt-3 max-w-3xl text-4xl font-bold leading-tight tracking-tight md:text-5xl">
            {tx(L("مزاد سيارات علني بساعة خادم.", "A public car auction on a server clock."))}
          </h1>
          <p className="mt-4 max-w-2xl text-base text-ivory/80 md:text-lg">
            {tx(
              L(
                "مباشر وقادم ومنتهٍ في لوحة واحدة. المزايدة تتطلب دخول BHD، والخطوة معلنة، والوقت لا يُعاد عند التحديث.",
                "Live, upcoming, and ended in one board. Bidding needs BHD sign-in, the step is stated, and refresh does not reset the clock.",
              ),
            )}
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-4">
            {[
              [data.stats.live, L("مباشر الآن", "Live now")],
              [data.stats.upcoming, L("قادم", "Upcoming")],
              [data.stats.ended, L("منتهٍ", "Ended")],
              [data.stats.bids, L("مزايدات مسجّلة", "Recorded bids")],
            ].map(([value, label]) => (
              <div key={(label as Copy).en} className="rounded-2xl border border-white/15 bg-white/5 px-4 py-3">
                <p className="text-2xl font-bold tabular-nums">{value as number}</p>
                <p className="mt-1 text-xs text-ivory/70">{tx(label as Copy)}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/account/auctions" className="btn-teal px-5 py-3 text-sm">
              {tx(L("بيع عبر المزاد", "Sell via auction"))}
            </Link>
            <Link href="/account/auctions" className="rounded-xl border border-white/25 px-5 py-3 text-sm text-ivory hover:bg-white/10">
              {tx(L("مزايداتي", "My bids"))}
            </Link>
          </div>
        </div>
      </section>

      <div className="page-wrap space-y-12 px-5 py-12">
        <form onSubmit={search} className="flex flex-col gap-2 rounded-[1.25rem] border border-line bg-paper p-2 shadow-[var(--shadow-card)] sm:flex-row">
          <input
            value={q}
            onChange={(event) => setQ(event.target.value)}
            placeholder={tx(L("ابحث بالمركبة أو المدينة أو المواصفات", "Search by vehicle, city, or specs"))}
            className="field flex-1 border-0 bg-transparent"
          />
          <button className="btn-teal px-5" type="submit">
            {tx(L("بحث", "Search"))}
          </button>
        </form>

        {featured.length ? (
          <Section title={tx(L("المزادات المميزة النشطة", "Featured live auctions"))}>
            <div className="grid gap-4 lg:grid-cols-2">
              {featured.map((lot) => (
                <LotCard key={lot.id} lot={lot} serverNow={data.serverNow} featured />
              ))}
            </div>
          </Section>
        ) : null}

        <Section
          title={tx(L("المزادات النشطة", "Active auctions"))}
          lead={tx(L("لوتات مفتوحة للمزايدة الآن.", "Lots open for bidding now."))}
        >
          {live.length ? (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {live.map((lot) => (
                <LotCard key={lot.id} lot={lot} serverNow={data.serverNow} />
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted">{tx(L("لا لوتات نشطة غير المميزة الآن.", "No other live lots right now."))}</p>
          )}
        </Section>

        <Section title={tx(L("المزادات القادمة", "Upcoming auctions"))}>
          {upcoming.length ? (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {upcoming.map((lot) => (
                <LotCard key={lot.id} lot={lot} serverNow={data.serverNow} />
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted">{tx(L("لا مزادات مجدولة بعد.", "No scheduled lots yet."))}</p>
          )}
        </Section>

        <Section title={tx(L("المزادات المنتهية", "Ended auctions"))}>
          {ended.length ? (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {ended.map((lot) => (
                <LotCard key={lot.id} lot={lot} serverNow={data.serverNow} />
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted">{tx(L("لا نتائج منتهية بعد.", "No ended lots yet."))}</p>
          )}
        </Section>
      </div>
    </div>
  );
}
