"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { DemoNote, PageHeader, Photo } from "@/components/ui";
import { auctions } from "@/lib/data";
import { usePrefs } from "@/lib/prefs";
import { useStore } from "@/lib/store";
import type { Auction, Copy } from "@/lib/types";

const L = (ar: string, en: string): Copy => ({ ar, en });

export function useCountdown(hours: number) {
  const [left, setLeft] = useState<number | null>(null);
  useEffect(() => {
    const end = Date.now() + hours * 3600 * 1000;
    const tick = () => setLeft(Math.max(0, end - Date.now()));
    const timer = window.setInterval(tick, 1000);
    const frame = window.setTimeout(tick, 0);
    return () => {
      window.clearInterval(timer);
      window.clearTimeout(frame);
    };
  }, [hours]);
  return left;
}

export function formatRemain(ms: number) {
  const total = Math.max(0, Math.floor(ms / 1000));
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

export function highBid(auction: Auction, userBid?: number) {
  return Math.max(auction.openingOmr, ...auction.bids.map((bid) => bid.amountOmr), userBid ?? 0);
}

function LotRow({ auction }: { auction: Auction }) {
  const { tx, money } = usePrefs();
  const { bids } = useStore();
  const left = useCountdown(auction.endsInHours);
  const high = highBid(auction, bids[auction.slug]);

  return (
    <Link href={`/auctions/${auction.slug}`} className="surface-card surface-card-hover grid overflow-hidden md:grid-cols-[320px_1fr]">
      <Photo src={auction.image} alt={tx(auction.title)} className="h-56 w-full md:h-full" />
      <div className="p-6">
        <p className="flex items-center gap-2 text-xs font-medium text-live">
          <span className="pulse-dot inline-block h-2 w-2 rounded-full bg-live" />
          <span className="tabular-nums">{left === null ? "—" : formatRemain(left)}</span>
        </p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight text-night md:text-3xl">{tx(auction.title)}</h2>
        <p className="mt-2 text-sm text-muted">{tx(auction.city)} · {tx(auction.origin)} · {tx(auction.specs)}</p>
        <p className="mt-4 text-2xl font-bold text-night">{money(high)}</p>
        <p className="mt-1 text-xs text-muted">
          {auction.reserveMet ? tx(L("السعر السري مكسور", "Reserve met")) : tx(L("السعر السري لم يُكسر", "Reserve not met"))}
        </p>
      </div>
    </Link>
  );
}

export function AuctionsBoard() {
  return (
    <div>
      <PageHeader
        kicker={L("المزاد", "The auction")}
        title={L("المزايدة علنية، والخطوة معلنة.", "The bidding is public, and the step is stated.")}
        lead={L("كل لوت يعرض أعلى مزايدة وعمولة المشتري 2.5٪ بعد المطرقة. الترسية يؤكدها مكتب المزاد.", "Each lot shows the high bid and a 2.5% buyer's premium after the hammer. The desk confirms the award.")}
      />
      <div className="mx-auto grid max-w-6xl gap-8 px-5 py-12">
        {auctions.map((auction) => <LotRow key={auction.slug} auction={auction} />)}
        <DemoNote />
      </div>
    </div>
  );
}
