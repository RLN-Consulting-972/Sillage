"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Edit2 } from "lucide-react";
import { Field, inputClass } from "@/components/clients/field";

type SelectOption = { value: string; label: string; groupe?: string };

type FieldDef =
  | { key: string; label: string; kind: "select"; options: readonly SelectOption[] }
  | { key: string; label: string; kind: "number" }
  | { key: string; label: string; kind: "text" };

/** Regroupe les options par "groupe" (pour <optgroup>) en conservant
 * l'ordre d'apparition — les options sans groupe restent à plat. */
function groupOptions(options: readonly SelectOption[]) {
  const groups = new Map<string, SelectOption[]>();
  const sansGroupe: SelectOption[] = [];
  for (const o of options) {
    if (!o.groupe) {
      sansGroupe.push(o);
      continue;
    }
    if (!groups.has(o.groupe)) groups.set(o.groupe, []);
    groups.get(o.groupe)!.push(o);
  }
  return { sansGroupe, groups };
}

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

function emptyDraft(fields: FieldDef[]): Record<string, string> {
  return Object.fromEntries(
    fields.map((f) => [f.key, f.kind === "select" ? f.options[0]?.value ?? "" : ""])
  );
}

function draftFromRecord(fields: FieldDef[], record: Record<string, unknown>): Record<string, string> {
  return Object.fromEntries(
    fields.map((f) => [f.key, record[f.key] !== undefined && record[f.key] !== null ? String(record[f.key]) : ""])
  );
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
  const router = useRouter();

  // La synthèse patrimoniale en haut de la fiche client est calculée côté
  // serveur, à partir des données de TOUS les modules financiers. Ce
  // composant ne connaît que sa propre liste — sans ce useEffect, la
  // synthèse resterait figée sur les anciens chiffres tant que la page
  // n'est pas rechargée manuellement.
  useEffect(() => {
    setRecords(items);
  }, [items]);

  const [mode, setMode] = useState<"closed" | "adding" | "editing">("closed");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Record<string, string>>(() => emptyDraft(fields));
  const [busy, setBusy] = useState(false);

  function openAddForm() {
    setDraft(emptyDraft(fields));
    setEditingId(null);
    setMode("adding");
  }

  function openEditForm(record: T) {
    setDraft(draftFromRecord(fields, record as Record<string, unknown>));
    setEditingId(record.id);
    setMode("editing");
  }

  function closeForm() {
    setMode("closed");
    setEditingId(null);
  }

  function buildPayload() {
    const payload: Record<string, string | number> = {};
    for (const f of fields) {
      payload[f.key] = f.kind === "number" ? Number(draft[f.key] || 0) : draft[f.key];
    }
    return payload;
  }

  async function handleAdd() {
    setBusy(true);
    const res = await fetch(listUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(buildPayload()),
    });
    setBusy(false);
    if (res.ok) {
      const body = await res.json();
      const created = Object.values(body)[0] as T;
      setRecords((prev) => [...prev, created]);
      closeForm();
      router.refresh();
    }
  }

  async function handleSaveEdit() {
    if (!editingId) return;
    setBusy(true);
    const res = await fetch(`${deleteUrlPrefix}/${editingId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(buildPayload()),
    });
    setBusy(false);
    if (res.ok) {
      const { record: updated } = await res.json();
      setRecords((prev) => prev.map((r) => (r.id === editingId ? (updated as T) : r)));
      closeForm();
      router.refresh();
    }
  }

  async function handleRemove(id: string) {
    setRecords((prev) => prev.filter((r) => r.id !== id));
    await fetch(`${deleteUrlPrefix}/${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <section className="mb-4 rounded-xl border border-border bg-background p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-serif text-sm font-medium text-primary">{title}</h2>
        <button
          onClick={mode === "closed" ? openAddForm : closeForm}
          className="flex items-center gap-1.5 text-sm text-accent-dark hover:underline"
        >
          <Plus size={14} />
          Ajouter
        </button>
      </div>

      {mode !== "closed" && (
        <div className="mb-4 rounded-md border border-border bg-secondary/40 p-4">
          <p className="mb-3 text-xs font-medium text-foreground/50">
            {mode === "editing" ? "Modifier cet élément" : "Nouvel élément"}
          </p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {fields.map((f) => (
              <Field key={f.key} label={f.label}>
                {f.kind === "select" ? (
                  <select
                    value={draft[f.key]}
                    onChange={(e) => setDraft({ ...draft, [f.key]: e.target.value })}
                    className={inputClass}
                  >
                    {(() => {
                      const { sansGroupe, groups } = groupOptions(f.options);
                      return (
                        <>
                          {sansGroupe.map((o) => (
                            <option key={o.value} value={o.value}>
                              {o.label}
                            </option>
                          ))}
                          {Array.from(groups.entries()).map(([groupe, opts]) => (
                            <optgroup key={groupe} label={groupe}>
                              {opts.map((o) => (
                                <option key={o.value} value={o.value}>
                                  {o.label}
                                </option>
                              ))}
                            </optgroup>
                          ))}
                        </>
                      );
                    })()}
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
            <button onClick={closeForm} className="rounded-md border border-border px-3 py-1.5 text-sm">
              Annuler
            </button>
            <button
              onClick={mode === "editing" ? handleSaveEdit : handleAdd}
              disabled={busy}
              className="rounded-md bg-primary px-3 py-1.5 text-sm text-white disabled:opacity-50"
            >
              {mode === "editing" ? "Enregistrer" : "Ajouter"}
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
              <span className="flex items-center gap-3">
                <button onClick={() => openEditForm(record)} className="text-foreground/30 hover:text-accent-dark">
                  <Edit2 size={14} />
                </button>
                <button onClick={() => handleRemove(record.id)} className="text-foreground/30 hover:text-bordeaux">
                  <Trash2 size={14} />
                </button>
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
