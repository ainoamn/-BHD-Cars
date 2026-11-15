import { NextResponse } from "next/server";
import { resolvePortalViewer, resolveWorkspaceAccess } from "@/lib/portal/access";
import { hasScope } from "@/lib/portal/scopes";
import {
  createListing,
  listOrgListings,
  listPersonalListings,
  updateListingStatus,
} from "@/lib/portal/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const space = url.searchParams.get("space") || "personal";
  if (space === "org") {
    const access = await resolveWorkspaceAccess("listings.read");
    if (access.kind !== "ok") {
      return NextResponse.json({ ok: false, error: access.kind }, { status: 401 });
    }
    return NextResponse.json({ ok: true, data: await listOrgListings(access.membership.org_id) });
  }

  const viewer = await resolvePortalViewer();
  if (viewer.kind !== "ok") {
    return NextResponse.json({ ok: false, error: viewer.kind }, { status: 401 });
  }
  return NextResponse.json({
    ok: true,
    data: await listPersonalListings(viewer.viewer.session.sub),
  });
}

export async function PUT(request: Request) {
  const body = (await request.json()) as Record<string, unknown>;
  const space = String(body.space || "personal");

  if (space === "org") {
    const access = await resolveWorkspaceAccess("listings.write");
    if (access.kind !== "ok") {
      return NextResponse.json({ ok: false, error: access.kind }, { status: access.kind === "forbidden" ? 403 : 401 });
    }
    if (
      access.membership.role !== "owner" &&
      access.membership.role !== "admin" &&
      !hasScope(access.membership.scopes, "listings.write")
    ) {
      return NextResponse.json({ ok: false, error: "forbidden" }, { status: 403 });
    }
    await createListing({
      orgId: access.membership.org_id,
      titleAr: String(body.titleAr || ""),
      titleEn: String(body.titleEn || ""),
      priceOmr: Number(body.priceOmr || 0),
      status: String(body.status || "draft"),
    });
    return NextResponse.json({ ok: true, data: await listOrgListings(access.membership.org_id) });
  }

  const viewer = await resolvePortalViewer();
  if (viewer.kind !== "ok") {
    return NextResponse.json({ ok: false, error: viewer.kind }, { status: 401 });
  }
  await createListing({
    ownerUserId: viewer.viewer.session.sub,
    titleAr: String(body.titleAr || ""),
    titleEn: String(body.titleEn || ""),
    priceOmr: Number(body.priceOmr || 0),
    status: String(body.status || "draft"),
  });
  return NextResponse.json({
    ok: true,
    data: await listPersonalListings(viewer.viewer.session.sub),
  });
}

export async function PATCH(request: Request) {
  const body = (await request.json()) as Record<string, unknown>;
  const space = String(body.space || "personal");
  const id = String(body.id || "");
  const status = String(body.status || "draft");

  if (space === "org") {
    const access = await resolveWorkspaceAccess("listings.write");
    if (access.kind !== "ok") {
      return NextResponse.json({ ok: false, error: access.kind }, { status: 401 });
    }
    await updateListingStatus(id, status, { userId: access.viewer.session.sub, orgId: access.membership.org_id });
    return NextResponse.json({ ok: true, data: await listOrgListings(access.membership.org_id) });
  }

  const viewer = await resolvePortalViewer();
  if (viewer.kind !== "ok") {
    return NextResponse.json({ ok: false, error: viewer.kind }, { status: 401 });
  }
  await updateListingStatus(id, status, { userId: viewer.viewer.session.sub });
  return NextResponse.json({
    ok: true,
    data: await listPersonalListings(viewer.viewer.session.sub),
  });
}
