import { randomBytes } from "crypto";
import { databaseConfigured, query } from "@/lib/db";
import type { ProductSession } from "@/lib/auth/session";
import { DEFAULT_STAFF_SCOPES, type PortalScope } from "@/lib/portal/scopes";

export type OrgRow = {
  id: string;
  kind: string;
  name_ar: string;
  name_en: string;
  owner_user_id: string;
  status: string;
};

export type OrgMembership = {
  org_id: string;
  user_id: string;
  email: string;
  name: string;
  role: string;
  scopes: string[];
  status: string;
  org_kind?: string;
  org_name_ar?: string;
  org_name_en?: string;
};

export type UserListing = {
  id: string;
  owner_user_id: string | null;
  org_id: string | null;
  catalog_slug: string | null;
  title_ar: string;
  title_en: string;
  status: string;
  price_omr: string;
  created_at: string;
};

export type UserRequest = {
  id: string;
  user_id: string;
  org_id: string | null;
  kind: string;
  status: string;
  title: string;
  created_at: string;
};

export type OrgInvitation = {
  id: string;
  org_id: string;
  email: string;
  role: string;
  scopes: string[];
  token: string;
  status: string;
  expires_at: string;
};

function emptyDb() {
  return !databaseConfigured();
}

export async function listMembershipsForUser(userId: string, email: string) {
  if (emptyDb()) return [] as OrgMembership[];
  try {
    return await query<OrgMembership>`
      SELECT m.org_id, m.user_id, m.email, m.name, m.role, m.scopes, m.status,
             o.kind as org_kind, o.name_ar as org_name_ar, o.name_en as org_name_en
      FROM org_memberships m
      JOIN orgs o ON o.id = m.org_id
      WHERE m.status = 'active'
        AND (m.user_id = ${userId} OR lower(m.email) = ${email.toLowerCase()})
      ORDER BY o.name_en
    `;
  } catch {
    return [];
  }
}

export async function getMembership(orgId: string, userId: string) {
  if (emptyDb()) return null;
  const rows = await query<OrgMembership>`
    SELECT m.org_id, m.user_id, m.email, m.name, m.role, m.scopes, m.status,
           o.kind as org_kind, o.name_ar as org_name_ar, o.name_en as org_name_en
    FROM org_memberships m
    JOIN orgs o ON o.id = m.org_id
    WHERE m.org_id = ${orgId} AND m.user_id = ${userId}
    LIMIT 1
  `;
  return rows[0] || null;
}

export async function getOrg(orgId: string) {
  if (emptyDb()) return null;
  const rows = await query<OrgRow>`
    SELECT id, kind, name_ar, name_en, owner_user_id, status FROM orgs WHERE id = ${orgId} LIMIT 1
  `;
  return rows[0] || null;
}

export async function listOrgMembers(orgId: string) {
  if (emptyDb()) return [] as OrgMembership[];
  return query<OrgMembership>`
    SELECT org_id, user_id, email, name, role, scopes, status
    FROM org_memberships
    WHERE org_id = ${orgId}
    ORDER BY role, email
  `;
}

export async function listOrgInvitations(orgId: string) {
  if (emptyDb()) return [] as OrgInvitation[];
  return query<OrgInvitation>`
    SELECT id::text, org_id, email, role, scopes, token, status, expires_at::text
    FROM org_invitations
    WHERE org_id = ${orgId} AND status = 'pending'
    ORDER BY created_at DESC
  `;
}

export async function inviteMember(input: {
  orgId: string;
  email: string;
  role: string;
  scopes: string[];
  invitedBy: string;
}) {
  const token = randomBytes(24).toString("hex");
  const scopes = input.scopes.length ? input.scopes : DEFAULT_STAFF_SCOPES;
  await query`
    INSERT INTO org_invitations (org_id, email, role, scopes, token, invited_by, status, expires_at)
    VALUES (
      ${input.orgId},
      ${input.email.toLowerCase()},
      ${input.role},
      ${scopes},
      ${token},
      ${input.invitedBy},
      'pending',
      now() + interval '14 days'
    )
  `;
  return token;
}

export async function upsertMembership(input: {
  orgId: string;
  userId: string;
  email: string;
  name: string;
  role: string;
  scopes: string[];
  invitedBy?: string;
  status?: string;
}) {
  await query`
    INSERT INTO org_memberships (org_id, user_id, email, name, role, scopes, status, invited_by, updated_at)
    VALUES (
      ${input.orgId},
      ${input.userId},
      ${input.email.toLowerCase()},
      ${input.name},
      ${input.role},
      ${input.scopes},
      ${input.status || "active"},
      ${input.invitedBy || null},
      now()
    )
    ON CONFLICT (org_id, user_id) DO UPDATE
    SET email = EXCLUDED.email,
        name = EXCLUDED.name,
        role = EXCLUDED.role,
        scopes = EXCLUDED.scopes,
        status = EXCLUDED.status,
        updated_at = now()
  `;
}

export async function updateMemberScopes(orgId: string, userId: string, role: string, scopes: string[]) {
  await query`
    UPDATE org_memberships
    SET role = ${role}, scopes = ${scopes}, updated_at = now()
    WHERE org_id = ${orgId} AND user_id = ${userId}
  `;
}

export async function removeMember(orgId: string, userId: string) {
  await query`
    DELETE FROM org_memberships
    WHERE org_id = ${orgId} AND user_id = ${userId} AND role <> 'owner'
  `;
}

export async function acceptInvitationsForUser(session: ProductSession) {
  if (emptyDb()) return;
  const invites = await query<OrgInvitation>`
    SELECT id::text, org_id, email, role, scopes, token, status, expires_at::text
    FROM org_invitations
    WHERE lower(email) = ${session.email.toLowerCase()}
      AND status = 'pending'
      AND expires_at > now()
  `;
  for (const invite of invites) {
    await upsertMembership({
      orgId: invite.org_id,
      userId: session.sub,
      email: session.email,
      name: session.name,
      role: invite.role,
      scopes: invite.scopes?.length ? invite.scopes : DEFAULT_STAFF_SCOPES,
      invitedBy: "invite",
    });
    await query`
      UPDATE org_invitations SET status = 'accepted' WHERE id = ${invite.id}
    `;
  }
}

/** Personal listings only — never other users. */
export async function listPersonalListings(userId: string) {
  if (emptyDb()) return [] as UserListing[];
  return query<UserListing>`
    SELECT id::text, owner_user_id, org_id, catalog_slug, title_ar, title_en, status, price_omr::text, created_at::text
    FROM user_listings
    WHERE owner_user_id = ${userId} AND org_id IS NULL
    ORDER BY updated_at DESC
  `;
}

/** Org listings only — never personal of others or other orgs. */
export async function listOrgListings(orgId: string) {
  if (emptyDb()) return [] as UserListing[];
  return query<UserListing>`
    SELECT id::text, owner_user_id, org_id, catalog_slug, title_ar, title_en, status, price_omr::text, created_at::text
    FROM user_listings
    WHERE org_id = ${orgId}
    ORDER BY updated_at DESC
  `;
}

export async function createListing(input: {
  ownerUserId?: string | null;
  orgId?: string | null;
  titleAr: string;
  titleEn: string;
  priceOmr: number;
  status?: string;
  catalogSlug?: string;
}) {
  const rows = await query<{ id: string }>`
    INSERT INTO user_listings (owner_user_id, org_id, catalog_slug, title_ar, title_en, status, price_omr)
    VALUES (
      ${input.ownerUserId || null},
      ${input.orgId || null},
      ${input.catalogSlug || null},
      ${input.titleAr},
      ${input.titleEn},
      ${input.status || "draft"},
      ${input.priceOmr}
    )
    RETURNING id::text
  `;
  return rows[0]?.id || "";
}

export async function updateListingStatus(id: string, status: string, actor: { userId: string; orgId?: string }) {
  if (actor.orgId) {
    await query`
      UPDATE user_listings
      SET status = ${status}, updated_at = now()
      WHERE id = ${id} AND org_id = ${actor.orgId}
    `;
    return;
  }
  await query`
    UPDATE user_listings
    SET status = ${status}, updated_at = now()
    WHERE id = ${id} AND owner_user_id = ${actor.userId} AND org_id IS NULL
  `;
}

export async function listPersonalRequests(userId: string) {
  if (emptyDb()) return [] as UserRequest[];
  return query<UserRequest>`
    SELECT id::text, user_id, org_id, kind, status, title, created_at::text
    FROM user_requests
    WHERE user_id = ${userId} AND org_id IS NULL
    ORDER BY created_at DESC
  `;
}

export async function listOrgRequests(orgId: string) {
  if (emptyDb()) return [] as UserRequest[];
  return query<UserRequest>`
    SELECT id::text, user_id, org_id, kind, status, title, created_at::text
    FROM user_requests
    WHERE org_id = ${orgId}
    ORDER BY created_at DESC
  `;
}

export async function createRequest(input: {
  userId: string;
  orgId?: string | null;
  kind: string;
  title: string;
}) {
  await query`
    INSERT INTO user_requests (user_id, org_id, kind, title, status)
    VALUES (${input.userId}, ${input.orgId || null}, ${input.kind}, ${input.title}, 'new')
  `;
}

export async function syncPlatformAccount(session: ProductSession) {
  if (emptyDb()) return;
  await query`
    INSERT INTO platform_accounts (email, name, kind, status, identity_sub, updated_at)
    VALUES (${session.email.toLowerCase()}, ${session.name}, 'member', 'active', ${session.sub}, now())
    ON CONFLICT (email) DO UPDATE
    SET name = EXCLUDED.name, identity_sub = EXCLUDED.identity_sub, updated_at = now()
  `;
}

export type { PortalScope };
