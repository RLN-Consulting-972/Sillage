"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  clientFormSchema,
  type ClientFormValues,
} from "@/modules/clients/schema";
import type { Client } from "@/modules/clients/types";
import { Field, inputClass } from "./field";
import { MissingBanner } from "@/components/layout/missing-info";
import { AlertCircle } from "lucide-react";

const SITUATIONS = [
  { value: "celibataire", label: "Célibataire" },
  { value: "marie", label: "Marié(e)" },
  { value: "pacse", label: "Pacsé(e)" },
  { value: "concubinage", label: "Concubinage" },
  { value: "divorce", label: "Divorcé(e)" },
  { value: "veuf", label: "Veuf/Veuve" },
] as const;

function clientToFormValues(client?: Client | null): ClientFormValues {
  if (!client) return { nom: "", prenom: "", enfants: [] };
  return {
    civilite: client.civilite,
    nom: client.nom,
    prenom: client.prenom,
    dateNaissance: client.dateNaissance,
    adresse: client.adresse,
    telephone: client.telephone,
    email: client.email,
    residenceFiscale: client.residenceFiscale,
    situationFamiliale: client.situationFamiliale,
    regimeMatrimonial: client.regimeMatrimonial,
    dateMariage: client.dateMariage,
    contratMariage: client.contratMariage,
    conjoint: client.conjoint,
    enfants: client.enfants,
  };
}

export function ClientForm({
  initialClient,
  onSubmitUrl,
  method,
}: {
  initialClient?: Client | null;
  onSubmitUrl: string;
  method: "POST" | "PATCH";
}) {
  const router = useRouter();
  const isEditing = Boolean(initialClient);
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
  } = useForm<ClientFormValues>({
    resolver: zodResolver(clientFormSchema),
    defaultValues: clientToFormValues(initialClient),
  });

  const { fields, append, remove } = useFieldArray({ control, name: "enfants" });
  const situationFamiliale = watch("situationFamiliale");
  const showConjoint = ["marie", "pacse", "concubinage"].includes(
    situationFamiliale ?? ""
  );

  async function onSubmit(values: ClientFormValues) {
    setSubmitting(true);
    setServerError(null);

    const res = await fetch(onSubmitUrl, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    setSubmitting(false);

    if (!res.ok) {
      const body = await res.json().catch(() => null);
      setServerError(body?.error ?? "Une erreur est survenue.");
      return;
    }

    const { client } = await res.json();
    router.push(`/clients/${client.id}`);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Identité */}
      <section className="rounded-xl border border-border bg-background p-5">
        <h2 className="mb-4 font-serif text-sm font-medium text-primary">Identité</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Civilité">
            <select {...register("civilite")} className={inputClass}>
              <option value="">—</option>
              <option value="M.">M.</option>
              <option value="Mme">Mme</option>
            </select>
          </Field>
          <div />
          <Field label="Nom" required error={errors.nom?.message}>
            <input {...register("nom")} className={inputClass} />
          </Field>
          <Field label="Prénom" required error={errors.prenom?.message}>
            <input {...register("prenom")} className={inputClass} />
          </Field>
          <Field label="Date de naissance">
            <input type="date" {...register("dateNaissance")} className={inputClass} />
          </Field>
          <Field label="Résidence fiscale">
            <input {...register("residenceFiscale")} className={inputClass} />
          </Field>
          <Field label="Adresse">
            <input {...register("adresse")} className={inputClass} />
          </Field>
          <Field label="Téléphone">
            <input {...register("telephone")} className={inputClass} />
          </Field>
          <Field label="Email" error={errors.email?.message}>
            <input type="email" {...register("email")} className={inputClass} />
          </Field>
        </div>
      </section>

      {/* Situation familiale */}
      <section className="rounded-xl border border-border bg-background p-5">
        <h2 className="mb-4 font-serif text-sm font-medium text-primary">
          Situation familiale
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Situation">
            <select {...register("situationFamiliale")} className={inputClass}>
              <option value="">—</option>
              {SITUATIONS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </Field>
          {situationFamiliale === "marie" && (
            <>
              <Field label="Régime matrimonial">
                <input {...register("regimeMatrimonial")} className={inputClass} />
              </Field>
              <Field label="Date de mariage">
                <input type="date" {...register("dateMariage")} className={inputClass} />
              </Field>
              <Field label="Contrat de mariage">
                <input type="checkbox" {...register("contratMariage")} className="h-4 w-4" />
              </Field>
            </>
          )}
        </div>

        {showConjoint && (
          <div className="mt-4 border-t border-border pt-4">
            <p className="mb-3 text-sm font-medium text-foreground/80">Conjoint</p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Nom">
                <input {...register("conjoint.nom")} className={inputClass} />
              </Field>
              <Field label="Prénom">
                <input {...register("conjoint.prenom")} className={inputClass} />
              </Field>
              <Field label="Date de naissance">
                <input type="date" {...register("conjoint.dateNaissance")} className={inputClass} />
              </Field>
            </div>
          </div>
        )}
      </section>

      {/* Enfants */}
      <section className="rounded-xl border border-border bg-background p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-serif text-sm font-medium text-primary">Enfants</h2>
          <button
            type="button"
            onClick={() => append({ prenom: "", aCharge: true })}
            className="text-sm text-accent-dark hover:underline"
          >
            + Ajouter un enfant
          </button>
        </div>

        {fields.length === 0 && (
          <p className="text-sm text-foreground/50">Aucun enfant renseigné.</p>
        )}

        <div className="space-y-4">
          {fields.map((field, index) => (
            <div key={field.id} className="grid grid-cols-1 gap-4 border-t border-border pt-4 sm:grid-cols-4">
              <Field label="Prénom" required>
                <input {...register(`enfants.${index}.prenom`)} className={inputClass} />
              </Field>
              <Field label="Date de naissance">
                <input type="date" {...register(`enfants.${index}.dateNaissance`)} className={inputClass} />
              </Field>
              <Field label="À charge">
                <input type="checkbox" {...register(`enfants.${index}.aCharge`)} className="h-4 w-4" defaultChecked />
              </Field>
              <div className="flex items-end">
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="text-sm text-bordeaux hover:underline"
                >
                  Retirer
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {serverError && (
        <MissingBanner>
          <AlertCircle size={14} />
          {serverError}
        </MissingBanner>
      )}

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-md border border-border px-4 py-2 text-sm"
        >
          Annuler
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-50"
        >
          {submitting
            ? "Enregistrement..."
            : isEditing
              ? "Enregistrer les modifications"
              : "Créer le client"}
        </button>
      </div>
    </form>
  );
}
