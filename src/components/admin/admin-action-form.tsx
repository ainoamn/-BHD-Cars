"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export function AdminActionForm({
  action,
  method = "PATCH",
  fields,
  submitLabel,
  successLabel,
}: {
  action: string;
  method?: "PATCH" | "PUT" | "DELETE";
  fields: Array<{
    name: string;
    label: string;
    type?: "text" | "number" | "select" | "checkbox" | "textarea" | "hidden";
    options?: Array<{ value: string; label: string }>;
    defaultValue?: string | number | boolean;
    required?: boolean;
  }>;
  submitLabel: string;
  successLabel?: string;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    setError("");
    const form = new FormData(event.currentTarget);
    const payload: Record<string, unknown> = {};
    for (const field of fields) {
      if (field.type === "checkbox") {
        payload[field.name] = form.get(field.name) === "on";
      } else if (field.type === "number") {
        payload[field.name] = Number(form.get(field.name) || 0);
      } else {
        payload[field.name] = String(form.get(field.name) || "");
      }
    }

    try {
      const response = await fetch(action, {
        method,
        headers: method === "DELETE" ? undefined : { "content-type": "application/json" },
        body: method === "DELETE" ? undefined : JSON.stringify(payload),
      });
      const json = (await response.json()) as { ok?: boolean; error?: string };
      if (!response.ok || !json.ok) {
        setError(json.error || `HTTP ${response.status}`);
      } else {
        setMessage(successLabel || "Saved");
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
      {fields.map((field) => {
        if (field.type === "hidden") {
          return <input key={field.name} type="hidden" name={field.name} defaultValue={String(field.defaultValue ?? "")} />;
        }
        return (
          <label key={field.name} className="admin-field">
            <span>{field.label}</span>
            {field.type === "select" ? (
              <select name={field.name} defaultValue={String(field.defaultValue ?? "")} required={field.required}>
                {(field.options || []).map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            ) : field.type === "textarea" ? (
              <textarea name={field.name} defaultValue={String(field.defaultValue ?? "")} rows={2} />
            ) : field.type === "checkbox" ? (
              <input name={field.name} type="checkbox" defaultChecked={Boolean(field.defaultValue)} />
            ) : (
              <input
                name={field.name}
                type={field.type || "text"}
                defaultValue={String(field.defaultValue ?? "")}
                required={field.required}
              />
            )}
          </label>
        );
      })}
      <button type="submit" className="primary" disabled={busy}>
        {busy ? "…" : submitLabel}
      </button>
      {message ? <span className="admin-badge admin-badge--ready">{message}</span> : null}
      {error ? <span className="admin-badge admin-badge--danger">{error}</span> : null}
    </form>
  );
}
