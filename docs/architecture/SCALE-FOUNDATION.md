# BHD Cars — foundation for 1M+ vehicles / 6M+ users

## Why navigation felt slow

Every click re-ran uncached Neon work in the root shell (`loadSiteBundle` up to 3×), sometimes hanging with no timeout (~30s). Portal layouts also re-queried memberships on layout **and** page.

## Immediate controls (shipped)

| Control | Effect |
|--------|--------|
| `react.cache` + `unstable_cache` on site settings (30s, tag `site-settings`) | One cheap read for SiteRuntime / banner / PageGate |
| DB query timeout 4s | No more multi-ten-second hangs |
| `resolvePortalViewer` per-request cache | Layout + page share one auth/memberships fetch |
| Auction list without UPDATE on every read | Read path stays read-only |
| `loading.tsx` + `RoutePrefetcher` | Instant shell feedback + warm RSC payloads |

## Domain modules (`src/domains/*`)

Keep future work behind domain barrels so inventory, auctions, identity, and portal can scale independently:

- `catalog` — browse / filters / cursor pages
- `auctions` — lots & bids
- `identity` — SSO / session
- `portal` — account & workspace isolation
- `site` — maintenance / notice / page flags

## Scale rules

1. **Keyset cursors**, never deep `OFFSET` (`src/lib/scale/cursor.ts`).
2. **Stateless app nodes** (Vercel) + **pooled Neon** — horizontal scale by adding instances.
3. **Vertical scale** — raise Neon compute; keep query budgets under the 4s timeout.
4. **Cache edge-safe data** (site flags, public catalog slices); never cache private bids/sessions across users.
5. **Write paths** (bids, listings) stay transactional and isolated from browse caches.
6. **Split read replicas / search** (OpenSearch/Meilisearch or Neon + pg_trgm) before inventing 1M-row full-table scans in RSC.

## Next capacity milestones

1. Persist cars in Neon with `(published_at, id)` cursor indexes — leave static `data.ts` as seed only.
2. Public `/cars` ISR or tagged cache with filter query params hashed.
3. Redis/Upstash for hot lot snapshots under auction load.
4. Separate auction write API from marketing RSC tree.
