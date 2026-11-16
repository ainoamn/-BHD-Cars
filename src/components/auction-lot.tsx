"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { PageHeader, Photo, Primary } from "@/components/ui";
import { formatRemain, useEndsAtCountdown } from "@/components/auctions-board";
import { usePrefs } from "@/lib/prefs";
import type { AuctionBidRow, AuctionLotRow } from "@/lib/auctions/store";
import type { Copy } from "@/lib/types";

const L = (ar: string, en: string): Copy => ({ ar, en });
const loginHref = (returnTo: string) => `/api/auth/bhd/start?returnTo=${encodeURIComponent(returnTo)}`;

type Snapshot = {
  serverNow: string;
  lot: AuctionLotRow;
  bids: AuctionBidRow[];
  high: number;
  next: number;
  reserveMet: boolean;
  signedIn: boolean;
};

export function AuctionLot({ slug, initial }: { slug: string; initial: Snapshot }) {
  const { tx, money } = usePrefs();
  const [snap, setSnap] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState(false);
  const left = useEndsAtCountdown(snap.lot.ends_at, snap.serverNow);
  const live = snap.lot.status === "live" && (left === null || left > 0);
  const premium = Math.round((snap.next * snap.lot.buyer_premium_bps) / 10000);

  useEffect(() => {
    const timer = window.setInterval(async () => {
      const res = await fetch(`/api/auctions/${slug}`, { cache: "no-store" });
      if (!res.ok) return;
      setSnap((await res.json()) as Snapshot);
    }, 8000);
    return () => window.clearInterval(timer);
  }, [slug]);

  async function bid() {
    setBusy(true);
    setError(null);
    setOk(false);
    const res = await fetch(`/api/auctions/${slug}/bids`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ amountOmr: snap.next, idempotencyKey: crypto.randomUUID() }),
    });
    const body = (await res.json()) as { message?: string; login?: string; lot?: AuctionLotRow };
    if (res.status === 401) {
      window.location.href = body.login || loginHref(`/auctions/${slug}`);
      return;
    }
    if (!res.ok) {
      setError(body.message || tx(L("تعذّرت المزايدة", "Bid failed")));
      setBusy(false);
      const refresh = await fetch(`/api/auctions/${slug}`, { cache: "no-store" });
      if (refresh.ok) setSnap((await refresh.json()) as Snapshot);
      return;
    }
    setOk(true);
    const refresh = await fetch(`/api/auctions/${slug}`, { cache: "no-store" });
    if (refresh.ok) setSnap((await refresh.json()) as Snapshot);
    setBusy(false);
  }

  const lot = snap.lot;

  return (
    <div>
      <PageHeader
        kicker={L("لوت مزاد", "Auction lot")}
        title={{ ar: lot.title_ar, en: lot.title_en }}
        lead={{ ar: lot.note_ar, en: lot.note_en }}
      />
      <div className="page-wrap grid gap-6 px-5 py-10 lg:grid-cols-[1.2fr_0.8fr]">
        <div>
          <div className="surface-card overflow-hidden">
            <Photo src={lot.image} alt={tx({ ar: lot.title_ar, en: lot.title_en })} className="aspect-[16/10] w-full" />
          </div>
          <p className="mt-4 text-sm text-muted">
            {lot.year} · {tx({ ar: lot.city_ar, en: lot.city_en })} · {tx({ ar: lot.specs_ar, en: lot.specs_en })}
          </p>
          <h2 className="mt-8 text-xl font-bold text-night">{tx(L("سجل المزايدة", "Bid record"))}</h2>
          <ul className="surface-card mt-4 divide-y divide-line overflow-hidden">
            {snap.bids.length === 0 ? (
              <li className="px-4 py-3 text-sm text-muted">{tx(L("لا مزايدات بعد — كن الأول.", "No bids yet — be first."))}</li>
            ) : (
              snap.bids.map((item) => (
                <li key={item.id} className="flex items-center justify-between px-4 py-3 text-sm">
                  <span>
                    {item.bidder_name}
                    <span className="text-muted"> · #{item.sequence}</span>
                  </span>
                  <span className="font-medium">{money(Number(item.amount_omr))}</span>
                </li>
              ))
            )}
          </ul>
        </div>

        <aside className="surface-card p-6 lg:sticky lg:top-28 lg:self-start">
          <p className="flex items-center gap-2 text-xs font-medium text-live">
            <span className="pulse-dot inline-block h-2 w-2 rounded-full bg-live" />
            <span className="tabular-nums">
              {live ? (left === null ? "—" : formatRemain(left)) : tx(L("مغلق", "Closed"))}
            </span>
          </p>
          <p className="mt-4 text-xs text-muted">{tx(L("أعلى مزايدة", "High bid"))}</p>
          <p className="text-4xl font-bold tracking-tight text-night">{money(snap.high)}</p>
          <p className="mt-2 text-sm text-muted">
            {snap.reserveMet
              ? tx(L("السعر السري مكسور", "Reserve met"))
              : tx(L("السعر السري لم يُكسر", "Reserve not met"))}
          </p>
          <div className="mt-5 rounded-2xl border border-line bg-soft/70 px-4 py-3">
            <p className="text-sm">
              {tx(L("الخطوة التالية", "Next step"))} <span className="font-semibold">{money(snap.next)}</span>
            </p>
            <p className="mt-1 text-xs text-muted">
              {tx(L("عمولة المشتري على هذه الخطوة", "Buyer's premium on this step"))} {money(premium)}
            </p>
            <p className="mt-1 text-xs text-muted">
              {tx(L("تمديد دقيقتين إن جاءت مزايدة في آخر دقيقتين.", "A bid in the last two minutes extends the lot by two minutes."))}
            </p>
          </div>

          {ok ? (
            <p className="mt-6 rounded-xl bg-soft px-4 py-3 text-sm font-medium text-night">
              {tx(L("سُجّلت مزايدتك على الخادم.", "Your bid is recorded on the server."))}
            </p>
          ) : null}
          {error ? <p className="mt-4 text-sm text-live">{error}</p> : null}

          <div className="mt-6 space-y-3">
            {live ? (
              snap.signedIn ? (
                <Primary onClick={bid} className="w-full" disabled={busy}>
                  {busy ? "…" : tx(L("زاود بالخطوة التالية", "Bid the next step"))}
                </Primary>
              ) : (
                <Link className="btn-teal flex w-full justify-center px-4 py-3" href={loginHref(`/auctions/${slug}`)}>
                  {tx(L("دخول BHD للمزايدة", "Sign in with BHD to bid"))}
                </Link>
              )
            ) : (
              <p className="text-sm text-muted">{tx(L("هذا اللوت غير مفتوح للمزايدة.", "This lot is not open for bidding."))}</p>
            )}
            <Link href="/auctions" className="block text-center text-sm font-medium text-navy hover:text-brass">
              {tx(L("العودة للمزادات", "Back to auctions"))}
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
