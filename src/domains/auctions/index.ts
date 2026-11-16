/**
 * Auctions domain — lots, bids, snapshots. Isolated from marketplace browse.
 */
export {
  listAuctionLots,
  getAuctionLot,
  listLotBids,
  placeServerBid,
  createLotFromListing,
  listBidsForUser,
  bucketLots,
  auctionStatsFromLots,
  type AuctionLotRow,
  type AuctionBidRow,
} from "@/lib/auctions/store";
