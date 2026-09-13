import type { SituationFamiliale } from "@/types/database.types";

export const SITUATIONS = [
  { value: "celibataire", label: "Célibataire" },
  { value: "marie", label: "Marié(e)" },
  { value: "pacse", label: "Pacsé(e)" },
  { value: "concubinage", label: "Concubinage" },
  { value: "divorce", label: "Divorcé(e)" },
  { value: "veuf", label: "Veuf/Veuve" },
] as const satisfies { value: SituationFamiliale; label: string }[];

export function situationFamilialeLabel(value?: SituationFamiliale | null): string {
  return SITUATIONS.find((s) => s.value === value)?.label ?? "—";
}

export interface Enfant {
  id?: string;
  prenom: string;
  dateNaissance?: string;
  aCharge: boolean;
  situation?: string;
  notesTransmission?: string;
}

export interface Conjoint {
  id?: string;
  civilite?: string;
  nom?: string;
  prenom?: string;
  dateNaissance?: string;
}

export interface Client {
  id: string;
  userId?: string;
  civilite?: string;
  nom: string;
  prenom: string;
  dateNaissance?: string;
  adresse?: string;
  telephone?: string;
  email?: string;
  residenceFiscale?: string;
  situationFamiliale?: SituationFamiliale;
  regimeMatrimonial?: string;
  dateMariage?: string;
  contratMariage?: boolean;
  conjoint?: Conjoint;
  enfants: Enfant[];
  createdAt: string;
  updatedAt: string;
}

/** Champs du formulaire client (création ET modification). */
export type ClientFormInput = Omit<
  Client,
  "id" | "createdAt" | "updatedAt" | "enfants"
> & { enfants?: Enfant[] };
