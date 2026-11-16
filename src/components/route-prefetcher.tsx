"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { criticalRoutes } from "@/lib/site-menus";

/** Warm App Router RSC payloads for primary destinations after first paint. */
export function RoutePrefetcher() {
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;
    const run = () => {
      if (cancelled) return;
      for (const href of criticalRoutes) {
        try {
          router.prefetch(href);
        } catch {
          /* ignore */
        }
      }
    };

    const ric = (window as Window & { requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number })
      .requestIdleCallback;
    if (typeof ric === "function") {
      const id = ric(run, { timeout: 1800 });
      return () => {
        cancelled = true;
        window.cancelIdleCallback?.(id);
      };
    }

    const timer = window.setTimeout(run, 400);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [router]);

  return null;
}
