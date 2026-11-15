"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function TeamRemoveButton({ userId, label }: { userId: string; label: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function onClick() {
    setBusy(true);
    await fetch(`/api/portal/team?userId=${encodeURIComponent(userId)}`, { method: "DELETE" });
    router.refresh();
    setBusy(false);
  }

  return (
    <button
      type="button"
      disabled={busy}
      onClick={onClick}
      style={{
        padding: "0.35rem 0.55rem",
        borderRadius: "0.55rem",
        border: "1px solid #dde8e3",
        background: "#fff",
        fontSize: "0.75rem",
        fontWeight: 700,
        cursor: "pointer",
      }}
    >
      {busy ? "…" : label}
    </button>
  );
}
