/**
 * Catalog domain — public vehicle marketplace reads.
 * Keep listing queries, filters, and SEO metadata here as the inventory grows past 1M rows.
 */
export { publicCars, publicAuctions } from "@/lib/admin/public-catalog";
export { pageFromRows, encodeCursor, decodeCursor, type CursorPage } from "@/lib/scale/cursor";
