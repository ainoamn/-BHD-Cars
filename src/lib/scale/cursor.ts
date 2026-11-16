/**
 * Keyset pagination for million-row catalogs.
 * Prefer (sort, id) cursors over OFFSET — OFFSET degrades linearly at scale.
 */

export type CursorPage<T> = {
  items: T[];
  nextCursor: string | null;
  hasMore: boolean;
};

export function encodeCursor(payload: Record<string, string | number>) {
  return Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
}

export function decodeCursor<T extends Record<string, string | number>>(raw: string | null | undefined): T | null {
  if (!raw) return null;
  try {
    return JSON.parse(Buffer.from(raw, "base64url").toString("utf8")) as T;
  } catch {
    return null;
  }
}

export function pageFromRows<T>(rows: T[], limit: number, cursorOf: (row: T) => Record<string, string | number>): CursorPage<T> {
  const hasMore = rows.length > limit;
  const items = hasMore ? rows.slice(0, limit) : rows;
  const last = items[items.length - 1];
  return {
    items,
    hasMore,
    nextCursor: hasMore && last ? encodeCursor(cursorOf(last)) : null,
  };
}
