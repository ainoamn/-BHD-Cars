"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function DelegatesDeleteButton({ email, label }: { email: string; label: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function onClick() {
    setBusy(true);
    await fetch(`/api/admin/delegates?email=${encodeURIComponent(email)}`, { method: "DELETE" });
    router.refresh();
    setBusy(false);
  }

  return (
    <button type="button" onClick={onClick} disabled={busy} className="admin-actions">
      <span style={{ padding: "0.35rem 0.55rem", border: "1px solid #dde8e3", borderRadius: "0.55rem" }}>
        {busy ? "…" : label}
      </span>
    </button>
  );
}
