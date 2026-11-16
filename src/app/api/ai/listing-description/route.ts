import { NextResponse } from "next/server";
import { generateListingDescription, type ListingDescriptionInput } from "@/lib/ai/listing-description";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let body: ListingDescriptionInput;
  try {
    body = (await request.json()) as ListingDescriptionInput;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const result = await generateListingDescription({
    ...body,
    locale: body.locale === "en" ? "en" : "ar",
  });

  return NextResponse.json({ ok: true, ...result });
}
