import { NextResponse } from "next/server";
import { resolvePortalViewer } from "@/lib/portal/access";
import { createLotFromListing, listBidsForUser } from "@/lib/auctions/store";
import { getPersonalListing } from "@/lib/portal/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const result = await resolvePortalViewer();
  if (result.kind !== "ok") return NextResponse.json({ message: result.kind }, { status: 401 });
  const bids = await listBidsForUser(result.viewer.session.sub);
  return NextResponse.json({ bids });
}

export async function POST(request: Request) {
  const result = await resolvePortalViewer();
  if (result.kind !== "ok") return NextResponse.json({ ok: false, error: result.kind }, { status: 401 });

  let body: {
    listingId?: string;
    openingOmr?: number;
    incrementOmr?: number;
    reserveOmr?: number | null;
    startsAt?: string;
    endsAt?: string;
  } = {};
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  if (!body.listingId || !body.startsAt || !body.endsAt) {
    return NextResponse.json({ ok: false, error: "listingId, startsAt, endsAt required" }, { status: 400 });
  }

  const listing = await getPersonalListing(result.viewer.session.sub, body.listingId);
  if (!listing) return NextResponse.json({ ok: false, error: "Listing not found" }, { status: 404 });

  const startsAt = new Date(body.startsAt).toISOString();
  const endsAt = new Date(body.endsAt).toISOString();

  try {
    const lot = await createLotFromListing({
      listingId: listing.id,
      ownerUserId: result.viewer.session.sub,
      titleAr: listing.title_ar,
      titleEn: listing.title_en,
      openingOmr: Number(body.openingOmr ?? listing.price_omr) || 0,
      incrementOmr: Number(body.incrementOmr ?? 50) || 50,
      reserveOmr:
        body.reserveOmr == null || Number(body.reserveOmr) <= 0 ? null : Number(body.reserveOmr),
      startsAt,
      endsAt,
    });
    return NextResponse.json({ ok: true, lot });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : "Could not create lot" },
      { status: 500 },
    );
  }
}
