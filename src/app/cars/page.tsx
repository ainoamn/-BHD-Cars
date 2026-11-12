import { Suspense } from "react";
import { CarsBrowser } from "@/components/cars-browser";
import { PageGate } from "@/components/page-gate";
import { publicCars } from "@/lib/admin/public-catalog";

export const dynamic = "force-dynamic";

export default async function Page() {
  const list = await publicCars();
  return (
    <PageGate page="cars">
      <Suspense fallback={null}>
        <CarsBrowser initialCars={list} />
      </Suspense>
    </PageGate>
  );
}
