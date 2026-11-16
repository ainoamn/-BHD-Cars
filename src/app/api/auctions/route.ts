import { NextResponse } from "next/server";
import { auctionStats, bucketLots, listAuctionLots } from "@/lib/auctions/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const q = url.searchParams.get("q") || "";
  const lots = await listAuctionLots({ q });
  const buckets = bucketLots(lots);
  const stats = await auctionStats();
  return NextResponse.json({
    serverNow: new Date().toISOString(),
    stats,
    buckets,
    lots,
  });
}
