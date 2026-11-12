import { NextResponse } from "next/server";
import { loadSiteBundle } from "@/lib/admin/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const data = await loadSiteBundle();
  return NextResponse.json({
    ok: true,
    data: {
      maintenance: data.maintenance,
      notice: data.notice,
      pages: data.pages,
      defaultMarket: data.defaultMarket,
    },
  });
}
