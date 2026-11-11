import { Suspense } from "react";
import { ValuationDesk } from "@/components/valuation-desk";

export default function Page() {
  return <Suspense fallback={null}><ValuationDesk /></Suspense>;
}
