import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { AuctionLot } from "@/components/auction-lot";
import { PageGate } from "@/components/page-gate";
import {
  displayHigh,
  getAuctionLot,
  listLotBids,
  nextBidAmount,
  reserveMet,
} from "@/lib/auctions/store";
import { SESSION_COOKIE, readSessionToken } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const lot = await getAuctionLot(slug);
  if (!lot) notFound();
  const bids = await listLotBids(lot.id);
  const jar = await cookies();
  const session = await readSessionToken(jar.get(SESSION_COOKIE)?.value || "");

  return (
    <PageGate page="auctions">
      <AuctionLot
        slug={slug}
        initial={{
          serverNow: new Date().toISOString(),
          lot,
          bids,
          high: displayHigh(lot),
          next: nextBidAmount(lot),
          reserveMet: reserveMet(lot),
          signedIn: Boolean(session),
        }}
      />
    </PageGate>
  );
}
