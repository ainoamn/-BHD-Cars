"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function SwitchOrgButton({
  orgId,
  label,
  next = "/workspace",
  night = false,
}: {
  orgId: string;
  label: string;
  next?: string;
  night?: boolean;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function onClick() {
    setBusy(true);
    await fetch("/api/portal/active-org", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ orgId, next }),
    });
    router.push(next);
    router.refresh();
  }

  return (
    <button
      type="button"
      disabled={busy}
      onClick={onClick}
      className={night ? "portal-room__enter" : undefined}
      style={
        night
          ? undefined
          : {
              padding: "0.4rem 0.7rem",
              borderRadius: "0.55rem",
              border: "1px solid #092d24",
              background: "#092d24",
              color: "#fff",
              fontSize: "0.78rem",
              fontWeight: 700,
              cursor: "pointer",
            }
      }
    >
      {busy ? "…" : label}
    </button>
  );
}
