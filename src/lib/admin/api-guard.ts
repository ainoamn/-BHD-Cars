import { NextResponse } from "next/server";
import { databaseConfigured } from "@/lib/db";
import { resolveAdminAccessOrDev } from "@/lib/admin/access";

export async function requireAdminApi() {
  if (!databaseConfigured()) {
    return {
      error: NextResponse.json(
        { ok: false, error: "database_unconfigured" },
        { status: 503 },
      ),
      access: null,
    } as const;
  }

  const result = await resolveAdminAccessOrDev();
  if (result.kind !== "ok") {
    return {
      error: NextResponse.json({ ok: false, error: result.kind }, { status: 401 }),
      access: null,
    } as const;
  }

  return { error: null, access: result.access } as const;
}
