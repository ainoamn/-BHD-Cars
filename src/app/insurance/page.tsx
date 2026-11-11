import { Suspense } from "react";
import { InsuranceDesk } from "@/components/insurance-desk";

export default function Page() {
  return <Suspense fallback={null}><InsuranceDesk /></Suspense>;
}
