import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin/api-guard";
import {
  billingPulse,
  deleteDelegate,
  listAccounts,
  listAuctionControls,
  listClientAccounts,
  listDealerControls,
  listDelegates,
  listListingControls,
  listMarketControls,
  listPartnerOrgs,
  listPaymentGateways,
  listPlans,
  listServiceRequests,
  listSubscriptions,
  listSupportTickets,
  loadSiteBundle,
  saveSiteSetting,
  updateClientAccount,
  updatePaymentGateway,
  updateServiceRequest,
  updateSubscription,
  updateSupportTicket,
  updatePartnerOrg,
  upsertAccount,
  upsertAuctionControl,
  upsertDealerControl,
  upsertDelegate,
  upsertListingControl,
  upsertMarketControl,
  upsertPlan,
} from "@/lib/admin/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ resource: string }> };

export async function GET(_request: Request, ctx: Ctx) {
  const guard = await requireAdminApi();
  if (guard.error) return guard.error;
  const { resource } = await ctx.params;

  switch (resource) {
    case "settings":
      return NextResponse.json({ ok: true, data: await loadSiteBundle() });
    case "listings":
      return NextResponse.json({ ok: true, data: await listListingControls() });
    case "auctions":
      return NextResponse.json({ ok: true, data: await listAuctionControls() });
    case "dealers":
      return NextResponse.json({ ok: true, data: await listDealerControls() });
    case "requests":
      return NextResponse.json({ ok: true, data: await listServiceRequests() });
    case "support":
      return NextResponse.json({ ok: true, data: await listSupportTickets() });
    case "plans":
      return NextResponse.json({ ok: true, data: await listPlans() });
    case "subscriptions":
      return NextResponse.json({ ok: true, data: await listSubscriptions() });
    case "users":
      return NextResponse.json({ ok: true, data: await listAccounts() });
    case "accounting":
      return NextResponse.json({ ok: true, data: await listClientAccounts() });
    case "payments":
      return NextResponse.json({ ok: true, data: await listPaymentGateways() });
    case "delegates":
      return NextResponse.json({ ok: true, data: await listDelegates() });
    case "markets":
      return NextResponse.json({ ok: true, data: await listMarketControls() });
    case "partners":
      return NextResponse.json({ ok: true, data: await listPartnerOrgs() });
    case "billing":
      return NextResponse.json({ ok: true, data: await billingPulse() });
    default:
      return NextResponse.json({ ok: false, error: "unknown_resource" }, { status: 404 });
  }
}

export async function PUT(request: Request, ctx: Ctx) {
  const guard = await requireAdminApi();
  if (guard.error) return guard.error;
  const { resource } = await ctx.params;
  const body = (await request.json()) as Record<string, unknown>;
  const by = guard.access.session.email;

  try {
    switch (resource) {
      case "settings": {
        const section = String(body.section || "");
        if (!["maintenance", "notice", "pages", "default_market"].includes(section)) {
          return NextResponse.json({ ok: false, error: "bad_section" }, { status: 400 });
        }
        await saveSiteSetting(section === "default_market" ? "default_market" : section, body.value, by);
        return NextResponse.json({ ok: true, data: await loadSiteBundle() });
      }
      case "plans": {
        await upsertPlan({
          id: String(body.id || ""),
          nameAr: String(body.nameAr || ""),
          nameEn: String(body.nameEn || ""),
          priceOmr: Number(body.priceOmr || 0),
          listingCap: Number(body.listingCap || 0),
          auctionAccess: Boolean(body.auctionAccess),
          active: body.active !== false,
        });
        return NextResponse.json({ ok: true, data: await listPlans() });
      }
      case "users": {
        await upsertAccount({
          email: String(body.email || ""),
          name: String(body.name || ""),
          kind: String(body.kind || "member"),
          status: String(body.status || "active"),
          dealerSlug: body.dealerSlug ? String(body.dealerSlug) : undefined,
          identitySub: body.identitySub ? String(body.identitySub) : undefined,
        });
        return NextResponse.json({ ok: true, data: await listAccounts() });
      }
      case "delegates": {
        const scopes = Array.isArray(body.scopes)
          ? body.scopes.map(String)
          : String(body.scopes || "all")
              .split(/[,;\s]+/)
              .filter(Boolean);
        await upsertDelegate({
          email: String(body.email || ""),
          scopes,
          note: String(body.note || ""),
          by,
        });
        return NextResponse.json({ ok: true, data: await listDelegates() });
      }
      case "markets": {
        await upsertMarketControl({
          marketId: String(body.marketId || ""),
          enabled: Boolean(body.enabled),
          currency: String(body.currency || "OMR"),
          services: (body.services as Record<string, boolean>) || {},
        });
        return NextResponse.json({ ok: true, data: await listMarketControls() });
      }
      default:
        return NextResponse.json({ ok: false, error: "unsupported_put" }, { status: 405 });
    }
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "save_failed" },
      { status: 500 },
    );
  }
}

export async function PATCH(request: Request, ctx: Ctx) {
  const guard = await requireAdminApi();
  if (guard.error) return guard.error;
  const { resource } = await ctx.params;
  const body = (await request.json()) as Record<string, unknown>;
  const by = guard.access.session.email;

  try {
    switch (resource) {
      case "listings":
        await upsertListingControl({
          slug: String(body.slug || ""),
          status: String(body.status || "published"),
          notes: String(body.notes || ""),
          by,
        });
        return NextResponse.json({ ok: true, data: await listListingControls() });
      case "auctions":
        await upsertAuctionControl({
          slug: String(body.slug || ""),
          status: String(body.status || "live"),
          notes: String(body.notes || ""),
          by,
        });
        return NextResponse.json({ ok: true, data: await listAuctionControls() });
      case "dealers":
        await upsertDealerControl({
          slug: String(body.slug || ""),
          verified: Boolean(body.verified),
          accredited: Boolean(body.accredited),
          status: String(body.status || "active"),
          notes: String(body.notes || ""),
          by,
        });
        return NextResponse.json({ ok: true, data: await listDealerControls() });
      case "requests":
        await updateServiceRequest(String(body.id || ""), String(body.status || "new"), body.assignee ? String(body.assignee) : undefined);
        return NextResponse.json({ ok: true, data: await listServiceRequests() });
      case "support":
        await updateSupportTicket(String(body.id || ""), String(body.status || "open"));
        return NextResponse.json({ ok: true, data: await listSupportTickets() });
      case "subscriptions":
        await updateSubscription(
          String(body.id || ""),
          String(body.status || "active"),
          body.planId ? String(body.planId) : undefined,
        );
        return NextResponse.json({ ok: true, data: await listSubscriptions() });
      case "accounting":
        await updateClientAccount(
          String(body.id || ""),
          Number(body.balanceOmr || 0),
          Number(body.openInvoices || 0),
          String(body.status || "open"),
        );
        return NextResponse.json({ ok: true, data: await listClientAccounts() });
      case "payments":
        await updatePaymentGateway(
          String(body.id || ""),
          body.enabled === true || body.enabled === "true",
        );
        return NextResponse.json({ ok: true, data: await listPaymentGateways() });
      case "partners":
        await updatePartnerOrg(String(body.id || ""), String(body.status || "active"), String(body.notes || ""));
        return NextResponse.json({ ok: true, data: await listPartnerOrgs() });
      default:
        return NextResponse.json({ ok: false, error: "unsupported_patch" }, { status: 405 });
    }
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "patch_failed" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request, ctx: Ctx) {
  const guard = await requireAdminApi();
  if (guard.error) return guard.error;
  const { resource } = await ctx.params;
  const url = new URL(request.url);
  if (resource !== "delegates") {
    return NextResponse.json({ ok: false, error: "unsupported_delete" }, { status: 405 });
  }
  const email = url.searchParams.get("email") || "";
  await deleteDelegate(email);
  return NextResponse.json({ ok: true, data: await listDelegates() });
}
