import { NextResponse } from "next/server";
import { resolvePortalViewer, resolveWorkspaceAccess } from "@/lib/portal/access";
import { hasScope } from "@/lib/portal/scopes";
import {
  createRequest,
  listOrgRequests,
  listPersonalRequests,
} from "@/lib/portal/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function PUT(request: Request) {
  const body = (await request.json()) as Record<string, unknown>;
  const space = String(body.space || "personal");
  const kind = String(body.kind || "finance");
  const title = String(body.title || "").trim();
  if (!title) return NextResponse.json({ ok: false, error: "title_required" }, { status: 400 });

  if (space === "org") {
    const access = await resolveWorkspaceAccess("requests.write");
    if (access.kind !== "ok") {
      return NextResponse.json({ ok: false, error: access.kind }, { status: 401 });
    }
    if (
      access.membership.role !== "owner" &&
      access.membership.role !== "admin" &&
      !hasScope(access.membership.scopes, "requests.write")
    ) {
      return NextResponse.json({ ok: false, error: "forbidden" }, { status: 403 });
    }
    await createRequest({
      userId: access.viewer.session.sub,
      orgId: access.membership.org_id,
      kind,
      title,
    });
    return NextResponse.json({ ok: true, data: await listOrgRequests(access.membership.org_id) });
  }

  const viewer = await resolvePortalViewer();
  if (viewer.kind !== "ok") {
    return NextResponse.json({ ok: false, error: viewer.kind }, { status: 401 });
  }
  await createRequest({
    userId: viewer.viewer.session.sub,
    kind,
    title,
  });
  return NextResponse.json({
    ok: true,
    data: await listPersonalRequests(viewer.viewer.session.sub),
  });
}
