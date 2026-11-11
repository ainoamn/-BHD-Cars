"use client";

import { useParams } from "next/navigation";
import { AuctionLot } from "@/components/auction-lot";

export default function Page() {
  const params = useParams<{ slug: string }>();
  return <AuctionLot slug={params.slug} />;
}
