import { NextResponse } from "next/server";
import { resolveWorkspaceAccess } from "@/lib/portal/access";
import { canManageTeam, DEFAULT_STAFF_SCOPES } from "@/lib/portal/scopes";
import {
  inviteMember,
  listOrgInvitations,
  listOrgMembers,
  removeMember,
  updateMemberScopes,
} from "@/lib/portal/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function parseScopes(raw: unknown) {
  if (Array.isArray(raw)) return raw.map(String).filter(Boolean);
  return String(raw || "")
    .split(/[,;\s]+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export async function GET() {
  const access = await resolveWorkspaceAccess("team.read");
  if (access.kind !== "ok") {
    return NextResponse.json({ ok: false, error: access.kind }, { status: 401 });
  }
  const orgId = access.membership.org_id;
  return NextResponse.json({
    ok: true,
    data: {
      members: await listOrgMembers(orgId),
      invites: canManageTeam(access.membership.role, access.membership.scopes)
        ? await listOrgInvitations(orgId)
        : [],
    },
  });
}

export async function PUT(request: Request) {
  const access = await resolveWorkspaceAccess("team.write");
  if (access.kind !== "ok") {
    return NextResponse.json({ ok: false, error: access.kind }, { status: 401 });
  }
  if (!canManageTeam(access.membership.role, access.membership.scopes)) {
    return NextResponse.json({ ok: false, error: "forbidden" }, { status: 403 });
  }

  const body = (await request.json()) as Record<string, unknown>;
  const email = String(body.email || "").trim().toLowerCase();
  if (!email) return NextResponse.json({ ok: false, error: "email_required" }, { status: 400 });

  const role = String(body.role || "staff");
  if (role === "owner") {
    return NextResponse.json({ ok: false, error: "cannot_invite_owner" }, { status: 400 });
  }
  const scopes = parseScopes(body.scopes);
  await inviteMember({
    orgId: access.membership.org_id,
    email,
    role,
    scopes: scopes.length ? scopes : DEFAULT_STAFF_SCOPES,
    invitedBy: access.viewer.session.sub,
  });

  return NextResponse.json({
    ok: true,
    data: {
      members: await listOrgMembers(access.membership.org_id),
      invites: await listOrgInvitations(access.membership.org_id),
    },
  });
}

export async function PATCH(request: Request) {
  const access = await resolveWorkspaceAccess("team.write");
  if (access.kind !== "ok") {
    return NextResponse.json({ ok: false, error: access.kind }, { status: 401 });
  }
  if (!canManageTeam(access.membership.role, access.membership.scopes)) {
    return NextResponse.json({ ok: false, error: "forbidden" }, { status: 403 });
  }

  const body = (await request.json()) as Record<string, unknown>;
  const userId = String(body.userId || "");
  const role = String(body.role || "staff");
  const scopes = parseScopes(body.scopes);
  if (!userId) return NextResponse.json({ ok: false, error: "user_required" }, { status: 400 });
  if (role === "owner") {
    return NextResponse.json({ ok: false, error: "cannot_promote_owner" }, { status: 400 });
  }

  await updateMemberScopes(
    access.membership.org_id,
    userId,
    role,
    scopes.length ? scopes : DEFAULT_STAFF_SCOPES,
  );

  return NextResponse.json({
    ok: true,
    data: { members: await listOrgMembers(access.membership.org_id) },
  });
}

export async function DELETE(request: Request) {
  const access = await resolveWorkspaceAccess("team.write");
  if (access.kind !== "ok") {
    return NextResponse.json({ ok: false, error: access.kind }, { status: 401 });
  }
  if (!canManageTeam(access.membership.role, access.membership.scopes)) {
    return NextResponse.json({ ok: false, error: "forbidden" }, { status: 403 });
  }

  const userId = new URL(request.url).searchParams.get("userId") || "";
  if (!userId) return NextResponse.json({ ok: false, error: "user_required" }, { status: 400 });
  if (userId === access.viewer.session.sub) {
    return NextResponse.json({ ok: false, error: "cannot_remove_self" }, { status: 400 });
  }

  await removeMember(access.membership.org_id, userId);
  return NextResponse.json({
    ok: true,
    data: { members: await listOrgMembers(access.membership.org_id) },
  });
}
