import { cars, auctions } from "@/lib/data";
import { listAuctionControls, listListingControls, loadSiteBundle } from "@/lib/admin/store";
import { databaseConfigured } from "@/lib/db";

export async function publicCars() {
  if (!databaseConfigured()) return cars;
  try {
    const controls = await listListingControls();
    const blocked = new Set(
      controls.filter((row) => row.status === "withdrawn" || row.status === "held").map((row) => row.slug),
    );
    return cars.filter((car) => !blocked.has(car.slug));
  } catch {
    return cars;
  }
}

export async function publicAuctions() {
  if (!databaseConfigured()) return auctions;
  try {
    const controls = await listAuctionControls();
    const blocked = new Set(
      controls.filter((row) => row.status === "paused" || row.status === "closed").map((row) => row.slug),
    );
    return auctions.filter((lot) => !blocked.has(lot.slug));
  } catch {
    return auctions;
  }
}

export async function publicPageEnabled(page: string) {
  const site = await loadSiteBundle();
  if (site.pages[page] === undefined) return true;
  return Boolean(site.pages[page]);
}
