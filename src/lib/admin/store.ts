import { databaseConfigured, query } from "@/lib/db";
import {
  DEFAULT_SITE_BUNDLE,
  type DefaultMarketSettings,
  type MaintenanceSettings,
  type NoticeSettings,
  type PageFlags,
  type SiteBundle,
} from "@/lib/admin/site-control";

function asObject(value: unknown) {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function readMaintenance(value: unknown): MaintenanceSettings {
  const row = asObject(value);
  return {
    enabled: Boolean(row.enabled),
    messageAr: typeof row.messageAr === "string" ? row.messageAr : DEFAULT_SITE_BUNDLE.maintenance.messageAr,
    messageEn: typeof row.messageEn === "string" ? row.messageEn : DEFAULT_SITE_BUNDLE.maintenance.messageEn,
  };
}

function readNotice(value: unknown): NoticeSettings {
  const row = asObject(value);
  return {
    enabled: Boolean(row.enabled),
    messageAr: typeof row.messageAr === "string" ? row.messageAr : "",
    messageEn: typeof row.messageEn === "string" ? row.messageEn : "",
  };
}

function readPages(value: unknown): PageFlags {
  const row = asObject(value);
  return { ...DEFAULT_SITE_BUNDLE.pages, ...Object.fromEntries(
    Object.entries(row).map(([key, flag]) => [key, Boolean(flag)]),
  ) };
}

function readDefaultMarket(value: unknown): DefaultMarketSettings {
  const row = asObject(value);
  return { id: typeof row.id === "string" && row.id ? row.id : "om" };
}

export async function loadSiteBundle(): Promise<SiteBundle> {
  if (!databaseConfigured()) return DEFAULT_SITE_BUNDLE;
  try {
    const rows = await query<{ key: string; value: unknown }>`
      SELECT key, value FROM site_settings
      WHERE key IN ('maintenance', 'notice', 'pages', 'default_market')
    `;
    const map = Object.fromEntries(rows.map((row) => [row.key, row.value]));
    return {
      maintenance: readMaintenance(map.maintenance),
      notice: readNotice(map.notice),
      pages: readPages(map.pages),
      defaultMarket: readDefaultMarket(map.default_market),
    };
  } catch {
    return DEFAULT_SITE_BUNDLE;
  }
}

export async function saveSiteSetting(key: string, value: unknown, updatedBy: string) {
  await query`
    INSERT INTO site_settings (key, value, updated_by, updated_at)
    VALUES (${key}, ${value as never}, ${updatedBy}, now())
    ON CONFLICT (key) DO UPDATE
    SET value = EXCLUDED.value, updated_by = EXCLUDED.updated_by, updated_at = now()
  `;
}

export async function listListingControls() {
  if (!databaseConfigured()) return [] as Array<{ slug: string; status: string; notes: string }>;
  try {
    return await query<{ slug: string; status: string; notes: string }>`
      SELECT slug, status, notes FROM listing_controls ORDER BY slug
    `;
  } catch {
    return [];
  }
}

export async function upsertListingControl(input: {
  slug: string;
  status: string;
  notes?: string;
  by: string;
}) {
  await query`
    INSERT INTO listing_controls (slug, status, notes, moderated_at, moderated_by)
    VALUES (${input.slug}, ${input.status}, ${input.notes || ""}, now(), ${input.by})
    ON CONFLICT (slug) DO UPDATE
    SET status = EXCLUDED.status,
        notes = EXCLUDED.notes,
        moderated_at = now(),
        moderated_by = EXCLUDED.moderated_by
  `;
}

export async function listAuctionControls() {
  if (!databaseConfigured()) return [] as Array<{ slug: string; status: string; notes: string }>;
  return query<{ slug: string; status: string; notes: string }>`
    SELECT slug, status, notes FROM auction_controls ORDER BY slug
  `;
}

export async function upsertAuctionControl(input: {
  slug: string;
  status: string;
  notes?: string;
  by: string;
}) {
  await query`
    INSERT INTO auction_controls (slug, status, notes, updated_at, updated_by)
    VALUES (${input.slug}, ${input.status}, ${input.notes || ""}, now(), ${input.by})
    ON CONFLICT (slug) DO UPDATE
    SET status = EXCLUDED.status,
        notes = EXCLUDED.notes,
        updated_at = now(),
        updated_by = EXCLUDED.updated_by
  `;
}

export async function listDealerControls() {
  if (!databaseConfigured()) {
    return [] as Array<{
      slug: string;
      verified: boolean;
      accredited: boolean;
      status: string;
      notes: string;
    }>;
  }
  return query<{
    slug: string;
    verified: boolean;
    accredited: boolean;
    status: string;
    notes: string;
  }>`
    SELECT slug, verified, accredited, status, notes FROM dealer_controls ORDER BY slug
  `;
}

export async function upsertDealerControl(input: {
  slug: string;
  verified: boolean;
  accredited: boolean;
  status: string;
  notes?: string;
  by: string;
}) {
  await query`
    INSERT INTO dealer_controls (slug, verified, accredited, status, notes, updated_at, updated_by)
    VALUES (${input.slug}, ${input.verified}, ${input.accredited}, ${input.status}, ${input.notes || ""}, now(), ${input.by})
    ON CONFLICT (slug) DO UPDATE
    SET verified = EXCLUDED.verified,
        accredited = EXCLUDED.accredited,
        status = EXCLUDED.status,
        notes = EXCLUDED.notes,
        updated_at = now(),
        updated_by = EXCLUDED.updated_by
  `;
}

export async function listServiceRequests() {
  if (!databaseConfigured()) return [];
  return query<{
    id: string;
    kind: string;
    status: string;
    title: string;
    contact_name: string;
    contact_phone: string;
    market_id: string;
    assignee: string | null;
    created_at: string;
  }>`
    SELECT id::text, kind, status, title, contact_name, contact_phone, market_id, assignee, created_at::text
    FROM service_requests
    ORDER BY created_at DESC
  `;
}

export async function updateServiceRequest(id: string, status: string, assignee?: string) {
  await query`
    UPDATE service_requests
    SET status = ${status},
        assignee = ${assignee || null},
        updated_at = now()
    WHERE id = ${id}
  `;
}

export async function listSupportTickets() {
  if (!databaseConfigured()) return [];
  return query<{
    id: string;
    subject: string;
    status: string;
    priority: string;
    category: string;
    contact_name: string;
    contact_email: string;
    related_slug: string | null;
    created_at: string;
  }>`
    SELECT id::text, subject, status, priority, category, contact_name, contact_email, related_slug, created_at::text
    FROM support_tickets
    ORDER BY created_at DESC
  `;
}

export async function updateSupportTicket(id: string, status: string) {
  await query`
    UPDATE support_tickets SET status = ${status}, updated_at = now() WHERE id = ${id}
  `;
}

export async function listPlans() {
  if (!databaseConfigured()) return [];
  return query<{
    id: string;
    name_ar: string;
    name_en: string;
    price_omr: string;
    listing_cap: number;
    auction_access: boolean;
    active: boolean;
  }>`
    SELECT id, name_ar, name_en, price_omr::text, listing_cap, auction_access, active
    FROM platform_plans
    ORDER BY sort_order, id
  `;
}

export async function upsertPlan(input: {
  id: string;
  nameAr: string;
  nameEn: string;
  priceOmr: number;
  listingCap: number;
  auctionAccess: boolean;
  active: boolean;
}) {
  await query`
    INSERT INTO platform_plans (id, name_ar, name_en, price_omr, listing_cap, auction_access, active)
    VALUES (${input.id}, ${input.nameAr}, ${input.nameEn}, ${input.priceOmr}, ${input.listingCap}, ${input.auctionAccess}, ${input.active})
    ON CONFLICT (id) DO UPDATE
    SET name_ar = EXCLUDED.name_ar,
        name_en = EXCLUDED.name_en,
        price_omr = EXCLUDED.price_omr,
        listing_cap = EXCLUDED.listing_cap,
        auction_access = EXCLUDED.auction_access,
        active = EXCLUDED.active
  `;
}

export async function listSubscriptions() {
  if (!databaseConfigured()) return [];
  return query<{
    id: string;
    dealer_slug: string;
    plan_id: string;
    status: string;
    starts_at: string;
    renews_at: string | null;
    notes: string;
  }>`
    SELECT id::text, dealer_slug, plan_id, status, starts_at::text, renews_at::text, notes
    FROM platform_subscriptions
    ORDER BY created_at DESC
  `;
}

export async function updateSubscription(id: string, status: string, planId?: string) {
  if (planId) {
    await query`
      UPDATE platform_subscriptions SET status = ${status}, plan_id = ${planId} WHERE id = ${id}
    `;
    return;
  }
  await query`UPDATE platform_subscriptions SET status = ${status} WHERE id = ${id}`;
}

export async function listAccounts() {
  if (!databaseConfigured()) return [];
  return query<{
    id: string;
    email: string;
    name: string;
    kind: string;
    status: string;
    dealer_slug: string | null;
    identity_sub: string | null;
  }>`
    SELECT id::text, email, name, kind, status, dealer_slug, identity_sub
    FROM platform_accounts
    ORDER BY created_at DESC
  `;
}

export async function upsertAccount(input: {
  email: string;
  name: string;
  kind: string;
  status: string;
  dealerSlug?: string;
  identitySub?: string;
}) {
  await query`
    INSERT INTO platform_accounts (email, name, kind, status, dealer_slug, identity_sub, updated_at)
    VALUES (${input.email.toLowerCase()}, ${input.name}, ${input.kind}, ${input.status}, ${input.dealerSlug || null}, ${input.identitySub || null}, now())
    ON CONFLICT (email) DO UPDATE
    SET name = EXCLUDED.name,
        kind = EXCLUDED.kind,
        status = EXCLUDED.status,
        dealer_slug = EXCLUDED.dealer_slug,
        identity_sub = EXCLUDED.identity_sub,
        updated_at = now()
  `;
}

export async function listClientAccounts() {
  if (!databaseConfigured()) return [];
  return query<{
    id: string;
    label: string;
    party_slug: string | null;
    party_kind: string;
    balance_omr: string;
    open_invoices: number;
    status: string;
  }>`
    SELECT id::text, label, party_slug, party_kind, balance_omr::text, open_invoices, status
    FROM client_accounts
    ORDER BY label
  `;
}

export async function updateClientAccount(id: string, balanceOmr: number, openInvoices: number, status: string) {
  await query`
    UPDATE client_accounts
    SET balance_omr = ${balanceOmr}, open_invoices = ${openInvoices}, status = ${status}, updated_at = now()
    WHERE id = ${id}
  `;
}

export async function listPaymentGateways() {
  if (!databaseConfigured()) return [];
  return query<{
    id: string;
    label: string;
    markets: string[];
    enabled: boolean;
    config: unknown;
  }>`
    SELECT id, label, markets, enabled, config FROM payment_gateways ORDER BY id
  `;
}

export async function updatePaymentGateway(id: string, enabled: boolean) {
  await query`
    UPDATE payment_gateways SET enabled = ${enabled}, updated_at = now() WHERE id = ${id}
  `;
}

export async function listDelegates() {
  if (!databaseConfigured()) return [];
  return query<{
    email: string;
    scopes: string[];
    note: string;
    granted_by: string | null;
    granted_at: string;
  }>`
    SELECT email, scopes, note, granted_by, granted_at::text FROM admin_delegates ORDER BY email
  `;
}

export async function upsertDelegate(input: {
  email: string;
  scopes: string[];
  note?: string;
  by: string;
}) {
  await query`
    INSERT INTO admin_delegates (email, scopes, note, granted_by, granted_at)
    VALUES (${input.email.toLowerCase()}, ${input.scopes}, ${input.note || ""}, ${input.by}, now())
    ON CONFLICT (email) DO UPDATE
    SET scopes = EXCLUDED.scopes, note = EXCLUDED.note, granted_by = EXCLUDED.granted_by, granted_at = now()
  `;
}

export async function deleteDelegate(email: string) {
  await query`DELETE FROM admin_delegates WHERE email = ${email.toLowerCase()}`;
}

export async function listMarketControls() {
  if (!databaseConfigured()) return [];
  return query<{
    market_id: string;
    enabled: boolean;
    currency: string;
    services: unknown;
  }>`
    SELECT market_id, enabled, currency, services FROM market_controls ORDER BY market_id
  `;
}

export async function upsertMarketControl(input: {
  marketId: string;
  enabled: boolean;
  currency: string;
  services?: Record<string, boolean>;
}) {
  await query`
    INSERT INTO market_controls (market_id, enabled, currency, services, updated_at)
    VALUES (${input.marketId}, ${input.enabled}, ${input.currency}, ${(input.services || {}) as never}, now())
    ON CONFLICT (market_id) DO UPDATE
    SET enabled = EXCLUDED.enabled,
        currency = EXCLUDED.currency,
        services = EXCLUDED.services,
        updated_at = now()
  `;
}

export async function listPartnerOrgs() {
  if (!databaseConfigured()) return [];
  return query<{
    id: string;
    name_ar: string;
    name_en: string;
    kind: string;
    market_id: string;
    status: string;
    phone: string;
    notes: string;
  }>`
    SELECT id, name_ar, name_en, kind, market_id, status, phone, notes
    FROM partner_orgs
    ORDER BY kind, name_en
  `;
}

export async function updatePartnerOrg(id: string, status: string, notes?: string) {
  await query`
    UPDATE partner_orgs SET status = ${status}, notes = ${notes || ""} WHERE id = ${id}
  `;
}

export async function billingPulse() {
  const [plans, subs, gateways, accounts] = await Promise.all([
    listPlans(),
    listSubscriptions(),
    listPaymentGateways(),
    listClientAccounts(),
  ]);
  const activeSubs = subs.filter((row) => row.status === "active");
  const mrr = activeSubs.reduce((sum, sub) => {
    const plan = plans.find((item) => item.id === sub.plan_id);
    return sum + Number(plan?.price_omr || 0);
  }, 0);
  const openBalance = accounts.reduce((sum, row) => sum + Number(row.balance_omr || 0), 0);
  return {
    plans: plans.length,
    activeSubs: activeSubs.length,
    mrr,
    enabledGateways: gateways.filter((row) => row.enabled).length,
    openBalance,
  };
}
