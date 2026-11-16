import { NextResponse } from "next/server";
import { runListingAssist, type ListingAssistInput } from "@/lib/ai/listing-assist";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let body: ListingAssistInput;
  try {
    body = (await request.json()) as ListingAssistInput;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const result = await runListingAssist({
    ...body,
    locale: body.locale === "en" ? "en" : "ar",
  });

  if (!result.ok) {
    return NextResponse.json(result, { status: 400 });
  }
  return NextResponse.json(result);
}
