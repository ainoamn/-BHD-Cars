"use client";

import { usePathname } from "next/navigation";
import { Shell } from "@/components/shell";

/** Shopping chrome everywhere except admin / account / workspace portals. */
export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || "/";
  if (
    pathname === "/admin" ||
    pathname.startsWith("/admin/") ||
    pathname === "/account" ||
    pathname.startsWith("/account/") ||
    pathname === "/workspace" ||
    pathname.startsWith("/workspace/") ||
    pathname === "/portal" ||
    pathname.startsWith("/portal/")
  ) {
    return <>{children}</>;
  }
  return <Shell>{children}</Shell>;
}
