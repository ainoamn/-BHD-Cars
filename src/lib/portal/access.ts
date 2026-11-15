import { cookies } from "next/headers";
import { authSecret, readSessionToken, SESSION_COOKIE, type ProductSession } from "@/lib/auth/session";
import { isAdminDevOpen } from "@/lib/admin/access";
import { hasScope, type PortalScope } from "@/lib/portal/scopes";
import {
  acceptInvitationsForUser,
  getMembership,
  listMembershipsForUser,
  type OrgMembership,
} from "@/lib/portal/store";

export const ACTIVE_ORG_COOKIE = "bhd_cars_org";

export type PortalViewer = {
  session: ProductSession;
  memberships: OrgMembership[];
};

export async function readPortalSession(): Promise<ProductSession | null> {
  if (isAdminDevOpen()) {
    return {
      sub: "42d976aa-27c3-470e-888a-23beafe88a9b",
      email: "a.hamid89@hotmail.com",
      name: "عبد الحميد الرواحي",
    };
  }
  if (!authSecret()) return null;
  const jar = await cookies();
  return readSessionToken(jar.get(SESSION_COOKIE)?.value || "");
}

export async function resolvePortalViewer(): Promise<
  | { kind: "ok"; viewer: PortalViewer }
  | { kind: "login" }
  | { kind: "auth-config" }
> {
  if (isAdminDevOpen()) {
    const session = await readPortalSession();
    if (!session) return { kind: "login" };
    await acceptInvitationsForUser(session).catch(() => undefined);
    const memberships = await listMembershipsForUser(session.sub, session.email);
    return { kind: "ok", viewer: { session, memberships } };
  }

  if (!authSecret()) return { kind: "auth-config" };
  const session = await readPortalSession();
  if (!session) return { kind: "login" };
  await acceptInvitationsForUser(session).catch(() => undefined);
  const memberships = await listMembershipsForUser(session.sub, session.email);
  return { kind: "ok", viewer: { session, memberships } };
}

export async function readActiveOrgId() {
  const jar = await cookies();
  return jar.get(ACTIVE_ORG_COOKIE)?.value?.trim() || "";
}

export async function resolveWorkspaceAccess(required?: PortalScope | PortalScope[]) {
  const viewerResult = await resolvePortalViewer();
  if (viewerResult.kind !== "ok") return viewerResult;

  const orgId = await readActiveOrgId();
  const memberships = viewerResult.viewer.memberships.filter((row) => row.status === "active");
  if (!memberships.length) {
    return { kind: "no-org" as const, viewer: viewerResult.viewer };
  }

  const membership =
    (orgId ? memberships.find((row) => row.org_id === orgId) : null) || memberships[0];

  if (
    required &&
    membership.role !== "owner" &&
    membership.role !== "admin" &&
    !hasScope(membership.scopes, required)
  ) {
    return { kind: "forbidden" as const, viewer: viewerResult.viewer, membership };
  }

  return {
    kind: "ok" as const,
    viewer: viewerResult.viewer,
    membership,
  };
}

export async function requireMembershipScope(
  orgId: string,
  userId: string,
  needed: PortalScope | PortalScope[],
) {
  const membership = await getMembership(orgId, userId);
  if (!membership || membership.status !== "active") return null;
  if (membership.role === "owner" || membership.role === "admin") return membership;
  if (!hasScope(membership.scopes, needed)) return null;
  return membership;
}

export function portalLoginHref(returnTo = "/portal") {
  return `/api/auth/bhd/start?returnTo=${encodeURIComponent(returnTo)}`;
}
