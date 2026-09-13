import { z } from "zod";
import {
  REVENU_TYPES,
  CHARGE_TYPES,
  IMMOBILIER_TYPES,
  FINANCIER_TYPES,
  OBJECTIF_TYPES,
  PERIODICITES,
  PRIORITES,
} from "./types";

function valuesOf<T extends readonly { value: string }[]>(arr: T) {
  return arr.map((t) => t.value) as [T[number]["value"], ...T[number]["value"][]];
}

export const createRevenuSchema = z.object({
  type: z.enum(valuesOf(REVENU_TYPES)),
  montant: z.number().min(0),
  periodicite: z.enum(valuesOf(PERIODICITES)),
  titulaire: z.string().optional(),
});

export const createChargeSchema = z.object({
  type: z.enum(valuesOf(CHARGE_TYPES)),
  montant: z.number().min(0),
  periodicite: z.enum(valuesOf(PERIODICITES)),
});

export const createImmobilierSchema = z.object({
  type: z.enum(valuesOf(IMMOBILIER_TYPES)),
  valeurEstimee: z.number().min(0),
  creditRestant: z.number().min(0).default(0),
  mensualiteCredit: z.number().min(0).default(0),
});

export const createFinancierSchema = z.object({
  type: z.enum(valuesOf(FINANCIER_TYPES)),
  montant: z.number().min(0),
  etablissement: z.string().optional(),
});

export const createObjectifSchema = z.object({
  type: z.enum(valuesOf(OBJECTIF_TYPES)),
  montantCible: z.number().min(0).optional(),
  echeance: z.string().optional(),
  priorite: z.enum(valuesOf(PRIORITES)),
});
