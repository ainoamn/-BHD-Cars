import { randomBytes } from "crypto";
import { databaseConfigured, query } from "@/lib/db";
import { auctions as catalogAuctions } from "@/lib/data";
import type { ProductSession } from "@/lib/auth/session";

export type AuctionLotRow = {
  id: string;
  slug: string;
  title_ar: string;
  title_en: string;
  year: number;
  image: string;
  city_ar: string;
  city_en: string;
  country: string;
  opening_omr: string;
  increment_omr: string;
  reserve_omr: string | null;
  high_bid_omr: string;
  bid_count: number;
  buyer_premium_bps: number;
  starts_at: string;
  ends_at: string;
  status: string;
  featured: boolean;
  origin_ar: string;
  origin_en: string;
  note_ar: string;
  note_en: string;
  specs_ar: string;
  specs_en: string;
  owner_user_id: string | null;
  org_id: string | null;
  listing_id: string | null;
  server_now?: string;
};

export type AuctionBidRow = {
  id: string;
  lot_id: string;
  bidder_user_id: string;
  bidder_name: string;
  amount_omr: string;
  sequence: number;
  created_at: string;
};

export type AuctionBucket = "featured" | "live" | "upcoming" | "ended";

function money(value: string | number | null | undefined) {
  return Number(value || 0);
}

function newId(prefix: string) {
  return `${prefix}_${randomBytes(8).toString("hex")}`;
}

export function reserveMet(lot: AuctionLotRow) {
  if (lot.reserve_omr == null) return true;
  return money(lot.high_bid_omr) >= money(lot.reserve_omr);
}

export function displayHigh(lot: AuctionLotRow) {
  return Math.max(money(lot.opening_omr), money(lot.high_bid_omr));
}

export function nextBidAmount(lot: AuctionLotRow) {
  const high = displayHigh(lot);
  const opening = money(lot.opening_omr);
  if (money(lot.high_bid_omr) <= 0) return opening;
  return high + money(lot.increment_omr);
}

export function buyerPremium(amount: number, bps: number) {
  return Math.round((amount * bps) / 10000);
}

export async function refreshLotStatuses() {
  if (!databaseConfigured()) return;
  try {
    await query`
      UPDATE auction_lots
      SET status = 'live', updated_at = now()
      WHERE status = 'scheduled' AND starts_at <= now() AND ends_at > now()
    `;
    await query`
      UPDATE auction_lots
      SET status = 'ended', updated_at = now()
      WHERE status IN ('scheduled', 'live') AND ends_at <= now()
    `;
  } catch {
    /* tables may be absent during bootstrap */
  }
}

async function seedFromCatalogIfEmpty() {
  if (!databaseConfigured()) return;
  try {
    const rows = await query<{ count: string }>`SELECT count(*)::text as count FROM auction_lots`;
    if (Number(rows[0]?.count || 0) > 0) return;
  } catch {
    return;
  }

  for (const [index, auction] of catalogAuctions.entries()) {
    const high = Math.max(auction.openingOmr, ...auction.bids.map((bid) => bid.amountOmr));
    const id = newId("lot");
    const startsAt = new Date(Date.now() - 6 * 3600 * 1000).toISOString();
    const endsAt = new Date(Date.now() + auction.endsInHours * 3600 * 1000).toISOString();
    try {
      await query`
        INSERT INTO auction_lots (
          id, slug, title_ar, title_en, year, image, city_ar, city_en, country,
          opening_omr, increment_omr, reserve_omr, high_bid_omr, bid_count, buyer_premium_bps,
          starts_at, ends_at, status, featured,
          origin_ar, origin_en, note_ar, note_en, specs_ar, specs_en
        ) VALUES (
          ${id}, ${auction.slug}, ${auction.title.ar}, ${auction.title.en}, ${auction.year}, ${auction.image},
          ${auction.city.ar}, ${auction.city.en}, ${auction.country},
          ${auction.openingOmr}, ${auction.incrementOmr},
          ${auction.reserveMet ? null : high + auction.incrementOmr * 4},
          ${high}, ${auction.bids.length}, 250,
          ${startsAt}, ${endsAt}, 'live', ${index < 2},
          ${auction.origin.ar}, ${auction.origin.en}, ${auction.note.ar}, ${auction.note.en},
          ${auction.specs.ar}, ${auction.specs.en}
        )
        ON CONFLICT (slug) DO NOTHING
      `;
    } catch {
      /* ignore seed races */
    }
  }
}

export async function listAuctionLots(input?: { q?: string; refresh?: boolean }) {
  if (!databaseConfigured()) return [] as AuctionLotRow[];
  await seedFromCatalogIfEmpty();
  // Avoid write amplification on every public navigation; refresh only when asked or on bid paths.
  if (input?.refresh) await refreshLotStatuses();
  const q = input?.q?.trim().toLowerCase() || "";
  try {
    const rows = await query<AuctionLotRow>`
      SELECT
        *,
        now()::text as server_now,
        CASE
          WHEN ends_at <= now() AND status IN ('scheduled', 'live') THEN 'ended'
          WHEN starts_at <= now() AND ends_at > now() AND status = 'scheduled' THEN 'live'
          ELSE status
        END as status
      FROM auction_lots
      ORDER BY
        CASE
          WHEN ends_at <= now() THEN 2
          WHEN starts_at > now() THEN 1
          ELSE 0
        END,
        featured DESC,
        ends_at ASC
    `;
    if (!q) return rows;
    return rows.filter((row) =>
      [row.title_ar, row.title_en, row.city_ar, row.city_en, row.specs_ar, row.specs_en, row.origin_ar, row.origin_en]
        .join(" ")
        .toLowerCase()
        .includes(q),
    );
  } catch {
    return [];
  }
}

export function bucketLots(lots: AuctionLotRow[]) {
  const featured = lots.filter((lot) => lot.featured && lot.status === "live");
  const live = lots.filter((lot) => lot.status === "live" && !lot.featured);
  const upcoming = lots.filter((lot) => lot.status === "scheduled");
  const ended = lots.filter((lot) => lot.status === "ended" || lot.status === "awarded" || lot.status === "closed");
  return { featured, live, upcoming, ended } satisfies Record<AuctionBucket, AuctionLotRow[]>;
}

export async function getAuctionLot(slug: string) {
  if (!databaseConfigured()) return null;
  await refreshLotStatuses();
  try {
    const rows = await query<AuctionLotRow>`
      SELECT *, now()::text as server_now FROM auction_lots WHERE slug = ${slug} LIMIT 1
    `;
    return rows[0] || null;
  } catch {
    return null;
  }
}

export async function listLotBids(lotId: string, limit = 40) {
  if (!databaseConfigured()) return [] as AuctionBidRow[];
  try {
    return await query<AuctionBidRow>`
      SELECT id, lot_id, bidder_user_id, bidder_name, amount_omr, sequence, created_at
      FROM auction_bids
      WHERE lot_id = ${lotId}
      ORDER BY sequence DESC
      LIMIT ${limit}
    `;
  } catch {
    return [];
  }
}

export function auctionStatsFromLots(lots: AuctionLotRow[]) {
  const buckets = bucketLots(lots);
  return {
    live: buckets.featured.length + buckets.live.length,
    upcoming: buckets.upcoming.length,
    ended: buckets.ended.length,
    bids: lots.reduce((sum, lot) => sum + Number(lot.bid_count || 0), 0),
  };
}

export async function auctionStats() {
  return auctionStatsFromLots(await listAuctionLots());
}

export type PlaceBidResult =
  | { ok: true; lot: AuctionLotRow; bid: AuctionBidRow }
  | { ok: false; code: "login" | "not-found" | "closed" | "too-low" | "own-lot" | "db" | "conflict"; message: string };

export async function placeServerBid(input: {
  slug: string;
  amountOmr: number;
  session: ProductSession;
  idempotencyKey?: string;
}): Promise<PlaceBidResult> {
  if (!databaseConfigured()) return { ok: false, code: "db", message: "Database unavailable" };
  await refreshLotStatuses();
  const lot = await getAuctionLot(input.slug);
  if (!lot) return { ok: false, code: "not-found", message: "Lot not found" };
  if (lot.status !== "live") return { ok: false, code: "closed", message: "Lot is not open" };
  if (lot.owner_user_id && lot.owner_user_id === input.session.sub) {
    return { ok: false, code: "own-lot", message: "Seller cannot bid on own lot" };
  }

  const min = nextBidAmount(lot);
  if (!(input.amountOmr >= min)) {
    return { ok: false, code: "too-low", message: `Minimum bid is ${min}` };
  }

  const bidId = newId("bid");
  const key = input.idempotencyKey?.trim() || newId("idem");
  const bidderName = input.session.name || input.session.email;

  try {
    const updated = await query<AuctionLotRow>`
      UPDATE auction_lots
      SET high_bid_omr = ${input.amountOmr},
          bid_count = bid_count + 1,
          ends_at = CASE
            WHEN ends_at - now() < interval '2 minutes' THEN ends_at + interval '2 minutes'
            ELSE ends_at
          END,
          updated_at = now()
      WHERE slug = ${input.slug}
        AND status = 'live'
        AND ends_at > now()
        AND ${input.amountOmr} >= GREATEST(opening_omr, high_bid_omr) + CASE WHEN high_bid_omr > 0 THEN increment_omr ELSE 0 END
      RETURNING *, now()::text as server_now
    `;
    const nextLot = updated[0];
    if (!nextLot) return { ok: false, code: "conflict", message: "Bid rejected — lot moved or amount too low" };

    const inserted = await query<AuctionBidRow>`
      INSERT INTO auction_bids (id, lot_id, bidder_user_id, bidder_name, amount_omr, sequence, idempotency_key)
      VALUES (${bidId}, ${nextLot.id}, ${input.session.sub}, ${bidderName}, ${input.amountOmr}, ${nextLot.bid_count}, ${key})
      ON CONFLICT (lot_id, bidder_user_id, idempotency_key) DO UPDATE
      SET amount_omr = EXCLUDED.amount_omr
      RETURNING id, lot_id, bidder_user_id, bidder_name, amount_omr, sequence, created_at
    `;
    return { ok: true, lot: nextLot, bid: inserted[0] };
  } catch {
    return { ok: false, code: "db", message: "Could not place bid" };
  }
}

export async function listBidsForUser(userId: string) {
  if (!databaseConfigured()) return [] as Array<AuctionBidRow & { slug: string; title_ar: string; title_en: string; lot_status: string; ends_at: string }>;
  try {
    return await query<AuctionBidRow & { slug: string; title_ar: string; title_en: string; lot_status: string; ends_at: string }>`
      SELECT b.id, b.lot_id, b.bidder_user_id, b.bidder_name, b.amount_omr, b.sequence, b.created_at,
             l.slug, l.title_ar, l.title_en, l.status as lot_status, l.ends_at
      FROM auction_bids b
      JOIN auction_lots l ON l.id = b.lot_id
      WHERE b.bidder_user_id = ${userId}
      ORDER BY b.created_at DESC
      LIMIT 100
    `;
  } catch {
    return [];
  }
}

export async function createLotFromListing(input: {
  listingId: string;
  ownerUserId: string;
  titleAr: string;
  titleEn: string;
  openingOmr: number;
  incrementOmr: number;
  reserveOmr?: number | null;
  startsAt: string;
  endsAt: string;
  image?: string;
}) {
  if (!databaseConfigured()) throw new Error("db");
  const id = newId("lot");
  const slug = `user-${input.listingId.slice(0, 10)}-${randomBytes(3).toString("hex")}`;
  const starts = new Date(input.startsAt);
  const ends = new Date(input.endsAt);
  if (!(ends.getTime() > starts.getTime())) throw new Error("ends");
  const status = starts.getTime() <= Date.now() ? "live" : "scheduled";
  const image =
    input.image ||
    "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1600&q=80";

  const rows = await query<AuctionLotRow>`
    INSERT INTO auction_lots (
      id, slug, title_ar, title_en, year, image, city_ar, city_en, country,
      opening_omr, increment_omr, reserve_omr, high_bid_omr, bid_count, buyer_premium_bps,
      starts_at, ends_at, status, featured,
      origin_ar, origin_en, note_ar, note_en, specs_ar, specs_en,
      owner_user_id, listing_id
    ) VALUES (
      ${id}, ${slug}, ${input.titleAr}, ${input.titleEn}, ${new Date().getFullYear()}, ${image},
      ${"مسقط"}, ${"Muscat"}, ${"om"},
      ${input.openingOmr}, ${input.incrementOmr}, ${input.reserveOmr ?? null}, 0, 0, 250,
      ${starts.toISOString()}, ${ends.toISOString()}, ${status}, false,
      ${"شخصي"}, ${"Private"},
      ${"لوت شخصي من لوحة المستخدم. المزايدة تتطلب دخول BHD."},
      ${"A personal lot from the user desk. Bidding requires BHD sign-in."},
      ${""}, ${""},
      ${input.ownerUserId}, ${input.listingId}
    )
    RETURNING *, now()::text as server_now
  `;
  return rows[0];
}
