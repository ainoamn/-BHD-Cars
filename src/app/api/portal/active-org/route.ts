import { NextResponse } from "next/server";
import { ACTIVE_ORG_COOKIE, resolvePortalViewer } from "@/lib/portal/access";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const result = await resolvePortalViewer();
  if (result.kind !== "ok") {
    return NextResponse.json({ ok: false, error: result.kind }, { status: 401 });
  }

  const body = (await request.json()) as { orgId?: string; next?: string };
  const orgId = String(body.orgId || "").trim();
  const allowed = result.viewer.memberships.some(
    (row) => row.org_id === orgId && row.status === "active",
  );
  if (!orgId || !allowed) {
    return NextResponse.json({ ok: false, error: "org_forbidden" }, { status: 403 });
  }

  const response = NextResponse.json({ ok: true, orgId });
  response.cookies.set(ACTIVE_ORG_COOKIE, orgId, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 40,
  });
  return response;
}
