"use client";

import { usePathname } from "next/navigation";
import { Shell } from "@/components/shell";

/** Shopping chrome everywhere except the site-admin console. */
export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || "/";
  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    return <>{children}</>;
  }
  return <Shell>{children}</Shell>;
}
