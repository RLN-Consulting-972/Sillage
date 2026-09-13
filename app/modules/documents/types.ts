import type { DocumentStatut } from "@/types/database.types";

export const CATEGORIES = [
  { value: "identite", label: "Identité" },
  { value: "avis_imposition", label: "Avis d'imposition" },
  { value: "retraite", label: "Retraite" },
  { value: "assurance_vie", label: "Assurance-vie" },
  { value: "per", label: "PER" },
  { value: "pea", label: "PEA" },
  { value: "credit", label: "Crédit" },
  { value: "immobilier", label: "Immobilier" },
  { value: "assurance", label: "Assurance" },
  { value: "autre", label: "Autre" },
] as const;

export type Categorie = (typeof CATEGORIES)[number]["value"];

export interface DocumentItem {
  id: string;
  clientId: string;
  nom: string;
  categorie: Categorie;
  statut: DocumentStatut;
  note?: string;
  createdAt: string;
  updatedAt: string;
}

/** Checklist standard proposée en un clic pour démarrer un dossier. */
export const CHECKLIST_STANDARD: { nom: string; categorie: Categorie }[] = [
  { nom: "Pièce d'identité", categorie: "identite" },
  { nom: "Dernier avis d'imposition", categorie: "avis_imposition" },
  { nom: "RIB", categorie: "autre" },
  { nom: "Justificatif de domicile", categorie: "autre" },
];
