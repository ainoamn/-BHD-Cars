import { Suspense } from "react";
import { CarsBrowser } from "@/components/cars-browser";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <CarsBrowser />
    </Suspense>
  );
}
