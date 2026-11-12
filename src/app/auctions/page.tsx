import { AuctionsBoard } from "@/components/auctions-board";
import { PageGate } from "@/components/page-gate";
import { publicAuctions } from "@/lib/admin/public-catalog";

export const dynamic = "force-dynamic";

export default async function Page() {
  const list = await publicAuctions();
  return (
    <PageGate page="auctions">
      <AuctionsBoard initialAuctions={list} />
    </PageGate>
  );
}
