import { Suspense } from "react";
import { FinanceDesk } from "@/components/finance-desk";

export default function Page() {
  return <Suspense fallback={null}><FinanceDesk /></Suspense>;
}
