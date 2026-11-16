import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { placeServerBid } from "@/lib/auctions/store";
import { SESSION_COOKIE, readSessionToken } from "@/lib/auth/session";
import { portalLoginHref } from "@/lib/portal/access";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request, context: { params: Promise<{ slug: string }> }) {
  const { slug } = await context.params;
  const jar = await cookies();
  const session = await readSessionToken(jar.get(SESSION_COOKIE)?.value || "");
  if (!session) {
    return NextResponse.json(
      { message: "Sign in required", login: portalLoginHref(`/auctions/${slug}`) },
      { status: 401 },
    );
  }

  let body: { amountOmr?: number; idempotencyKey?: string } = {};
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ message: "Invalid JSON" }, { status: 400 });
  }

  const amount = Number(body.amountOmr);
  if (!Number.isFinite(amount) || amount <= 0) {
    return NextResponse.json({ message: "Invalid amount" }, { status: 400 });
  }

  const result = await placeServerBid({
    slug,
    amountOmr: amount,
    session,
    idempotencyKey: body.idempotencyKey,
  });

  if (!result.ok) {
    const status =
      result.code === "too-low" || result.code === "conflict"
        ? 409
        : result.code === "not-found"
          ? 404
          : result.code === "closed" || result.code === "own-lot"
            ? 403
            : 500;
    return NextResponse.json({ message: result.message, code: result.code }, { status });
  }

  return NextResponse.json({
    ok: true,
    lot: result.lot,
    bid: result.bid,
    serverNow: new Date().toISOString(),
  });
}
