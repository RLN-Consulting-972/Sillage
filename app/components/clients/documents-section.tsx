"use client";

import { useState } from "react";
import { Plus, Check, RotateCcw, Trash2, ListChecks } from "lucide-react";
import type { DocumentItem, Categorie } from "@/modules/documents/types";
import { CATEGORIES } from "@/modules/documents/types";
import { MissingBanner } from "@/components/layout/missing-info";
import { Field, inputClass } from "@/components/clients/field";

export function DocumentsSection({
  clientId,
  initialDocuments,
}: {
  clientId: string;
  initialDocuments: DocumentItem[];
}) {
  const [documents, setDocuments] = useState(initialDocuments);
  const [showForm, setShowForm] = useState(false);
  const [nom, setNom] = useState("");
  const [categorie, setCategorie] = useState<Categorie>("autre");
  const [busy, setBusy] = useState(false);

  const missingCount = documents.filter((d) => d.statut === "manquant").length;

  async function handleAdd() {
    if (!nom.trim()) return;
    setBusy(true);
    const res = await fetch(`/api/clients/${clientId}/documents`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nom, categorie }),
    });
    setBusy(false);
    if (res.ok) {
      const { document } = await res.json();
      setDocuments((prev) => [...prev, document]);
      setNom("");
      setCategorie("autre");
      setShowForm(false);
    }
  }

  async function handleSeedChecklist() {
    setBusy(true);
    const res = await fetch(`/api/clients/${clientId}/documents/checklist-standard`, {
      method: "POST",
    });
    setBusy(false);
    if (res.ok) {
      const { documents: seeded } = await res.json();
      setDocuments((prev) => [...prev, ...seeded]);
    }
  }

  async function toggleStatut(doc: DocumentItem) {
    const nextStatut = doc.statut === "manquant" ? "recu" : "manquant";
    setDocuments((prev) =>
      prev.map((d) => (d.id === doc.id ? { ...d, statut: nextStatut } : d))
    );
    await fetch(`/api/documents/${doc.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ statut: nextStatut }),
    });
  }

  async function handleRemove(documentId: string) {
    setDocuments((prev) => prev.filter((d) => d.id !== documentId));
    await fetch(`/api/documents/${documentId}`, { method: "DELETE" });
  }

  return (
    <section className="mb-4 rounded-xl border border-border bg-background p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-serif text-sm font-medium text-primary">Documents</h2>
        <div className="flex items-center gap-4">
          {documents.length === 0 && (
            <button
              onClick={handleSeedChecklist}
              disabled={busy}
              className="flex items-center gap-1.5 text-sm text-accent-dark hover:underline disabled:opacity-50"
            >
              <ListChecks size={14} />
              Checklist standard
            </button>
          )}
          <button
            onClick={() => setShowForm((s) => !s)}
            className="flex items-center gap-1.5 text-sm text-accent-dark hover:underline"
          >
            <Plus size={14} />
            Ajouter une pièce
          </button>
        </div>
      </div>

      {missingCount > 0 && (
        <MissingBanner>
          {missingCount} pièce{missingCount > 1 ? "s" : ""} manquante
          {missingCount > 1 ? "s" : ""} pour ce dossier
        </MissingBanner>
      )}

      {showForm && (
        <div className="mb-4 rounded-md border border-border bg-secondary/40 p-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field label="Nom de la pièce">
              <input
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                className={inputClass}
                placeholder="Ex. Avis d'imposition 2025"
              />
            </Field>
            <Field label="Catégorie">
              <select
                value={categorie}
                onChange={(e) => setCategorie(e.target.value as Categorie)}
                className={inputClass}
              >
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </Field>
          </div>
          <div className="mt-3 flex justify-end gap-2">
            <button
              onClick={() => setShowForm(false)}
              className="rounded-md border border-border px-3 py-1.5 text-sm"
            >
              Annuler
            </button>
            <button
              onClick={handleAdd}
              disabled={busy || !nom.trim()}
              className="rounded-md bg-primary px-3 py-1.5 text-sm text-white disabled:opacity-50"
            >
              Ajouter
            </button>
          </div>
        </div>
      )}

      {documents.length === 0 ? (
        <p className="text-sm text-foreground/50">
          Aucune pièce demandée pour ce dossier.
        </p>
      ) : (
        <ul className="divide-y divide-border">
          {documents.map((doc) => (
            <li key={doc.id} className="flex items-center justify-between py-2.5">
              <div>
                <p className="text-sm font-medium text-foreground">{doc.nom}</p>
                <p className="text-xs text-foreground/50">
                  {CATEGORIES.find((c) => c.value === doc.categorie)?.label}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => toggleStatut(doc)}
                  className={
                    doc.statut === "recu"
                      ? "flex items-center gap-1 rounded-full bg-success/10 px-2.5 py-1 text-xs font-medium text-success"
                      : "flex items-center gap-1 rounded-full bg-bordeaux/10 px-2.5 py-1 text-xs font-medium text-bordeaux"
                  }
                >
                  {doc.statut === "recu" ? (
                    <>
                      <Check size={12} /> Reçu
                    </>
                  ) : (
                    <>
                      <RotateCcw size={12} /> Manquant
                    </>
                  )}
                </button>
                <button
                  onClick={() => handleRemove(doc.id)}
                  className="text-foreground/30 hover:text-bordeaux"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
