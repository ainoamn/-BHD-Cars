import { Suspense } from "react";
import { CarsBrowser } from "@/components/cars-browser";
import { PageGate } from "@/components/page-gate";
import { publicCars } from "@/lib/admin/public-catalog";

export const revalidate = 30;

export default async function Page() {
  const list = await publicCars();
  return (
    <PageGate page="cars">
      <Suspense fallback={<div className="page-wrap px-5 py-10 text-sm text-muted">…</div>}>
        <CarsBrowser initialCars={list} />
      </Suspense>
    </PageGate>
  );
}
