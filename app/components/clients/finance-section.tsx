"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Field, inputClass } from "@/components/clients/field";

type FieldDef =
  | { key: string; label: string; kind: "select"; options: readonly { value: string; label: string }[] }
  | { key: string; label: string; kind: "number" }
  | { key: string; label: string; kind: "text" };

function formatValue(field: FieldDef, value: unknown): string {
  if (value === undefined || value === null || value === "") return "—";
  if (field.kind === "select") {
    return field.options.find((o) => o.value === value)?.label ?? String(value);
  }
  if (field.kind === "number") {
    return `${Number(value).toLocaleString("fr-FR")} €`;
  }
  return String(value);
}

export function FinanceSection<T extends { id: string }>({
  title,
  fields,
  items,
  listUrl,
  deleteUrlPrefix,
  emptyLabel,
}: {
  title: string;
  fields: FieldDef[];
  items: T[];
  listUrl: string;
  deleteUrlPrefix: string;
  emptyLabel: string;
}) {
  const [records, setRecords] = useState(items);
  const [showForm, setShowForm] = useState(false);
  const [draft, setDraft] = useState<Record<string, string>>(() =>
    Object.fromEntries(
      fields.map((f) => [f.key, f.kind === "select" ? f.options[0]?.value ?? "" : ""])
    )
  );
  const [busy, setBusy] = useState(false);

  async function handleAdd() {
    setBusy(true);
    const payload: Record<string, string | number> = {};
    for (const f of fields) {
      payload[f.key] = f.kind === "number" ? Number(draft[f.key] || 0) : draft[f.key];
    }
    const res = await fetch(listUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setBusy(false);
    if (res.ok) {
      const body = await res.json();
      const created = Object.values(body)[0] as T;
      setRecords((prev) => [...prev, created]);
      setShowForm(false);
      setDraft(
        Object.fromEntries(
          fields.map((f) => [f.key, f.kind === "select" ? f.options[0]?.value ?? "" : ""])
        )
      );
    }
  }

  async function handleRemove(id: string) {
    setRecords((prev) => prev.filter((r) => r.id !== id));
    await fetch(`${deleteUrlPrefix}/${id}`, { method: "DELETE" });
  }

  return (
    <section className="mb-4 rounded-xl border border-border bg-background p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-serif text-sm font-medium text-primary">{title}</h2>
        <button
          onClick={() => setShowForm((s) => !s)}
          className="flex items-center gap-1.5 text-sm text-accent-dark hover:underline"
        >
          <Plus size={14} />
          Ajouter
        </button>
      </div>

      {showForm && (
        <div className="mb-4 rounded-md border border-border bg-secondary/40 p-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {fields.map((f) => (
              <Field key={f.key} label={f.label}>
                {f.kind === "select" ? (
                  <select
                    value={draft[f.key]}
                    onChange={(e) => setDraft({ ...draft, [f.key]: e.target.value })}
                    className={inputClass}
                  >
                    {f.options.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={f.kind === "number" ? "number" : "text"}
                    value={draft[f.key]}
                    onChange={(e) => setDraft({ ...draft, [f.key]: e.target.value })}
                    className={inputClass}
                  />
                )}
              </Field>
            ))}
          </div>
          <div className="mt-3 flex justify-end gap-2">
            <button onClick={() => setShowForm(false)} className="rounded-md border border-border px-3 py-1.5 text-sm">
              Annuler
            </button>
            <button
              onClick={handleAdd}
              disabled={busy}
              className="rounded-md bg-primary px-3 py-1.5 text-sm text-white disabled:opacity-50"
            >
              Ajouter
            </button>
          </div>
        </div>
      )}

      {records.length === 0 ? (
        <p className="text-sm text-foreground/50">{emptyLabel}</p>
      ) : (
        <ul className="divide-y divide-border">
          {records.map((record) => (
            <li key={record.id} className="flex items-center justify-between py-2.5 text-sm">
              <span>
                {fields.map((f, i) => (
                  <span key={f.key}>
                    {i > 0 && " · "}
                    {formatValue(f, (record as Record<string, unknown>)[f.key])}
                  </span>
                ))}
              </span>
              <button onClick={() => handleRemove(record.id)} className="text-foreground/30 hover:text-bordeaux">
                <Trash2 size={14} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
