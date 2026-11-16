import { AuctionsBoard } from "@/components/auctions-board";
import { PageGate } from "@/components/page-gate";
import { auctionStatsFromLots, bucketLots, listAuctionLots } from "@/lib/auctions/store";

export const dynamic = "force-dynamic";

export default async function Page() {
  const lots = await listAuctionLots();
  const buckets = bucketLots(lots);
  const stats = auctionStatsFromLots(lots);

  return (
    <PageGate page="auctions">
      <AuctionsBoard
        initial={{
          serverNow: new Date().toISOString(),
          stats,
          buckets,
        }}
      />
    </PageGate>
  );
}
