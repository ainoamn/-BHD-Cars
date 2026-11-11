"use client";

import { useState } from "react";
import { DemoNote, PageHeader, Photo, Primary, Receipt } from "@/components/ui";
import { auctions } from "@/lib/data";
import { usePrefs } from "@/lib/prefs";
import { useStore } from "@/lib/store";
import { formatRemain, highBid, useCountdown } from "./auctions-board";
import type { Copy } from "@/lib/types";

const L = (ar: string, en: string): Copy => ({ ar, en });

export function AuctionLot({ slug }: { slug: string }) {
  const auction = auctions.find((item) => item.slug === slug);
  const { tx, money } = usePrefs();
  const { bids, placeBid, addRequest } = useStore();
  const [sent, setSent] = useState<string | null>(null);
  const left = useCountdown(auction?.endsInHours ?? 1);

  if (!auction) {
    return <p className="px-5 py-20 text-muted">{tx(L("هذا اللوت غير موجود.", "This lot is not here."))}</p>;
  }

  const mine = bids[auction.slug];
  const high = highBid(auction, mine);
  const next = high + auction.incrementOmr;
  const premium = Math.round(next * 0.025);

  function bid() {
    placeBid(auction!.slug, next);
    const created = addRequest({
      kind: "auction",
      title: tx(auction!.title),
      detail: `${tx(L("مزايدة", "Bid"))} ${money(next)}`,
      status: "quoted",
    });
    setSent(created.ref);
  }

  return (
    <div>
      <PageHeader kicker={L("لوت مفتوح", "Open lot")} title={auction.title} lead={auction.note} />
      <div className="mx-auto grid max-w-6xl gap-6 px-5 py-10 lg:grid-cols-[1.2fr_0.8fr]">
        <div>
          <div className="surface-card overflow-hidden">
            <Photo src={auction.image} alt={tx(auction.title)} className="aspect-[16/10] w-full" />
          </div>
          <p className="mt-4 text-sm text-muted">{auction.year} · {tx(auction.city)} · {tx(auction.specs)}</p>
          <h2 className="mt-8 text-xl font-bold text-night">{tx(L("سجل المزايدة", "Bid record"))}</h2>
          <ul className="surface-card mt-4 divide-y divide-line overflow-hidden">
            {mine && (
              <li className="flex items-center justify-between bg-soft px-4 py-3 text-sm">
                <span className="font-medium">{tx(L("مزايدتك", "Your bid"))}</span>
                <span className="font-semibold">{money(mine)}</span>
              </li>
            )}
            {auction.bids.map((item) => (
              <li key={item.name + item.amountOmr} className="flex items-center justify-between px-4 py-3 text-sm">
                <span>{item.name} <span className="text-muted">· {tx(item.ago)}</span></span>
                <span className="font-medium">{money(item.amountOmr)}</span>
              </li>
            ))}
          </ul>
        </div>
        <aside className="surface-card p-6 lg:sticky lg:top-28 lg:self-start">
          <p className="flex items-center gap-2 text-xs font-medium text-live">
            <span className="pulse-dot inline-block h-2 w-2 rounded-full bg-live" />
            <span className="tabular-nums">{left === null ? "—" : formatRemain(left)}</span>
          </p>
          <p className="mt-4 text-xs text-muted">{tx(L("أعلى مزايدة", "High bid"))}</p>
          <p className="text-4xl font-bold tracking-tight text-night">{money(high)}</p>
          <p className="mt-2 text-sm text-muted">
            {auction.reserveMet ? tx(L("السعر السري مكسور", "Reserve met")) : tx(L("السعر السري لم يُكسر", "Reserve not met"))}
          </p>
          <div className="mt-5 rounded-2xl border border-line bg-soft/70 px-4 py-3">
            <p className="text-sm">{tx(L("الخطوة التالية", "Next step"))} <span className="font-semibold">{money(next)}</span></p>
            <p className="mt-1 text-xs text-muted">{tx(L("عمولة المشتري على هذه الخطوة", "Buyer's premium on this step"))} {money(premium)}</p>
          </div>
          {sent ? (
            <div className="mt-6">
              <Receipt refCode={sent} title={tx(L("سُجّلت المزايدة.", "The bid is on the book."))} detail={tx(L("تبقى ظاهرة في الطلبات. الترسية لا تتم إلا بتأكيد المكتب.", "It stays on your requests. The award still needs the desk."))} />
            </div>
          ) : (
            <div className="mt-6">
              <Primary onClick={bid} className="w-full">{tx(L("زاود بالخطوة التالية", "Bid the next step"))}</Primary>
            </div>
          )}
          <div className="mt-6"><DemoNote /></div>
        </aside>
      </div>
    </div>
  );
}
