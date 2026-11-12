"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export function SettingsClientForm({
  section,
  submitLabel,
  initial,
  fields,
}: {
  section: string;
  ar?: boolean;
  submitLabel: string;
  initial: Record<string, unknown>;
  fields: Array<{
    key: string;
    label: string;
    kind: "text" | "checkbox" | "select";
    options?: Array<{ value: string; label: string }>;
  }>;
}) {
  const router = useRouter();
  const [values, setValues] = useState<Record<string, unknown>>(initial);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    setError("");
    try {
      const response = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ section, value: values }),
      });
      const json = (await response.json()) as { ok?: boolean; error?: string };
      if (!response.ok || !json.ok) {
        setError(json.error || `HTTP ${response.status}`);
      } else {
        setMessage("OK");
        router.refresh();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="admin-inline-form">
      {fields.map((field) => (
        <label key={field.key} className="admin-field">
          <span>{field.label}</span>
          {field.kind === "checkbox" ? (
            <input
              type="checkbox"
              checked={Boolean(values[field.key])}
              onChange={(event) =>
                setValues((prev) => ({ ...prev, [field.key]: event.target.checked }))
              }
            />
          ) : field.kind === "select" ? (
            <select
              value={String(values[field.key] ?? "")}
              onChange={(event) => setValues((prev) => ({ ...prev, [field.key]: event.target.value }))}
            >
              {(field.options || []).map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          ) : (
            <input
              type="text"
              value={String(values[field.key] ?? "")}
              onChange={(event) => setValues((prev) => ({ ...prev, [field.key]: event.target.value }))}
            />
          )}
        </label>
      ))}
      <button type="submit" className="primary" disabled={busy}>
        {busy ? "…" : submitLabel}
      </button>
      {message ? <span className="admin-badge admin-badge--ready">{message}</span> : null}
      {error ? <span className="admin-badge admin-badge--danger">{error}</span> : null}
    </form>
  );
}
