import { Suspense } from "react";
import { InspectionDesk } from "@/components/valuation-desk";

export default function Page() {
  return <Suspense fallback={null}><InspectionDesk /></Suspense>;
}
