"use client";

import { useParams } from "next/navigation";
import { CarDetail } from "@/components/car-detail";

export default function Page() {
  const params = useParams<{ slug: string }>();
  return <CarDetail slug={params.slug} />;
}
