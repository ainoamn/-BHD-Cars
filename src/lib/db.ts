import { neon, type NeonQueryFunction } from "@neondatabase/serverless";

let sql: NeonQueryFunction<false, false> | null = null;

/** Hard ceiling so a hung Neon call cannot stall navigation for ~30s. */
export const DB_QUERY_TIMEOUT_MS = 4_000;

export function databaseConfigured() {
  return Boolean(process.env.DATABASE_URL?.trim());
}

export function getSql() {
  let url = process.env.DATABASE_URL?.trim().replace(/^["']|["']$/g, "") || "";
  // Guard against accidental KEY=value pastes into the env value itself.
  if (url.startsWith("DATABASE_URL=")) url = url.slice("DATABASE_URL=".length).trim();
  if (!url) throw new Error("DATABASE_URL is not configured");
  if (!sql) sql = neon(url);
  return sql;
}

export class DbTimeoutError extends Error {
  constructor(ms = DB_QUERY_TIMEOUT_MS) {
    super(`Database query timed out after ${ms}ms`);
    this.name = "DbTimeoutError";
  }
}

async function withTimeout<T>(promise: Promise<T>, ms = DB_QUERY_TIMEOUT_MS): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      promise,
      new Promise<T>((_, reject) => {
        timer = setTimeout(() => reject(new DbTimeoutError(ms)), ms);
      }),
    ]);
  } finally {
    if (timer) clearTimeout(timer);
  }
}

export async function query<T extends Record<string, unknown> = Record<string, unknown>>(
  strings: TemplateStringsArray,
  ...values: unknown[]
): Promise<T[]> {
  const rows = await withTimeout(getSql()(strings, ...values));
  return rows as T[];
}
