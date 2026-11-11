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
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-12 lg:grid-cols-[1.2fr_0.8fr]">
        <div>
          <Photo src={auction.image} alt={tx(auction.title)} className="aspect-[16/10] w-full" />
          <p className="mt-4 text-sm text-muted">{auction.year} · {tx(auction.city)} · {tx(auction.specs)}</p>
          <h2 className="mt-8 font-display text-2xl">{tx(L("سجل المزايدة", "Bid record"))}</h2>
          <ul className="mt-4 divide-y divide-line border-y border-line">
            {mine && (
              <li className="flex items-center justify-between py-3 text-sm">
                <span>{tx(L("مزايدتك", "Your bid"))}</span>
                <span>{money(mine)}</span>
              </li>
            )}
            {auction.bids.map((item) => (
              <li key={item.name + item.amountOmr} className="flex items-center justify-between py-3 text-sm">
                <span>{item.name} <span className="text-muted">· {tx(item.ago)}</span></span>
                <span>{money(item.amountOmr)}</span>
              </li>
            ))}
          </ul>
        </div>
        <aside className="border border-line bg-paper p-6 lg:sticky lg:top-24 lg:self-start">
          <p className="text-xs text-live tabular-nums">{left === null ? "—" : formatRemain(left)}</p>
          <p className="mt-3 text-xs text-muted">{tx(L("أعلى مزايدة", "High bid"))}</p>
          <p className="font-display text-4xl">{money(high)}</p>
          <p className="mt-2 text-sm text-muted">
            {auction.reserveMet ? tx(L("السعر السري مكسور", "Reserve met")) : tx(L("السعر السري لم يُكسر", "Reserve not met"))}
          </p>
          <p className="mt-4 text-sm">{tx(L("الخطوة التالية", "Next step"))} {money(next)}</p>
          <p className="text-xs text-muted">{tx(L("عمولة المشتري على هذه الخطوة", "Buyer's premium on this step"))} {money(premium)}</p>
          {sent ? (
            <div className="mt-6">
              <Receipt refCode={sent} title={tx(L("سُجّلت المزايدة.", "The bid is on the book."))} detail={tx(L("تبقى ظاهرة في الطلبات. الترسية لا تتم إلا بتأكيد المكتب.", "It stays on your requests. The award still needs the desk."))} />
            </div>
          ) : (
            <div className="mt-6">
              <Primary onClick={bid}>{tx(L("زاود بالخطوة التالية", "Bid the next step"))}</Primary>
            </div>
          )}
          <div className="mt-6"><DemoNote /></div>
        </aside>
      </div>
    </div>
  );
}
