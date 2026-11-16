import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getAuctionLot, listLotBids, displayHigh, nextBidAmount, reserveMet } from "@/lib/auctions/store";
import { SESSION_COOKIE, readSessionToken } from "@/lib/auth/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(_request: Request, context: { params: Promise<{ slug: string }> }) {
  const { slug } = await context.params;
  const lot = await getAuctionLot(slug);
  if (!lot) return NextResponse.json({ message: "not found" }, { status: 404 });
  const bids = await listLotBids(lot.id);
  const jar = await cookies();
  const session = await readSessionToken(jar.get(SESSION_COOKIE)?.value || "");
  return NextResponse.json({
    serverNow: new Date().toISOString(),
    lot,
    bids,
    high: displayHigh(lot),
    next: nextBidAmount(lot),
    reserveMet: reserveMet(lot),
    signedIn: Boolean(session),
  });
}
