import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";
import { getClientById } from "@/modules/clients/service";
import { situationFamilialeLabel } from "@/modules/clients/types";
import { listDocuments } from "@/modules/documents/service";
import {
  listRevenus, listCharges, listImmobilier, listFinanciers, listObjectifs,
} from "@/modules/finances/service";
import {
  REVENU_TYPES, CHARGE_TYPES, IMMOBILIER_TYPES, FINANCIER_TYPES, OBJECTIF_TYPES,
} from "@/modules/finances/types";
import {
  calculateRevenusMensuels, calculateChargesMensuelles, calculateSavingsCapacity,
  calculateGrossWealth, calculateNetWealth, calculatePatrimoineImmobilierBrut,
  calculatePatrimoineFinancier, calculateCreditRestantImmobilier,
} from "@/calculations/patrimoine";
import { detecterOpportunites, type Opportunite } from "@/rules/opportunites";
import type { Client } from "@/modules/clients/types";
import type { Revenu, Charge, BienImmobilier, ActifFinancier, Objectif } from "@/modules/finances/types";
import type { DocumentItem } from "@/modules/documents/types";

function label(options: readonly { value: string; label: string }[], value: string): string {
  return options.find((o) => o.value === value)?.label ?? value;
}

export interface RapportData {
  client: Client;
  genereLe: string;
  revenus: Revenu[];
  charges: Charge[];
  biens: BienImmobilier[];
  actifs: ActifFinancier[];
  objectifs: Objectif[];
  documents: DocumentItem[];
  opportunites: Opportunite[];
  synthese: {
    revenusMensuels: number;
    chargesMensuelles: number;
    capaciteEpargne: number;
    patrimoineImmobilierBrut: number;
    patrimoineFinancier: number;
    creditRestant: number;
    patrimoineBrut: number;
    patrimoineNet: number;
  };
  labels: {
    revenu: (t: string) => string;
    charge: (t: string) => string;
    immobilier: (t: string) => string;
    financier: (t: string) => string;
    objectif: (t: string) => string;
  };
}

export async function buildRapportData(
  supabase: SupabaseClient<Database>,
  clientId: string
): Promise<RapportData | null> {
  const client = await getClientById(supabase, clientId);
  if (!client) return null;

  const [documents, revenus, charges, biens, actifs, objectifs] = await Promise.all([
    listDocuments(supabase, clientId),
    listRevenus(supabase, clientId),
    listCharges(supabase, clientId),
    listImmobilier(supabase, clientId),
    listFinanciers(supabase, clientId),
    listObjectifs(supabase, clientId),
  ]);

  const opportunites = detecterOpportunites({ revenus, charges, biens, actifs });

  const revenusMensuels = calculateRevenusMensuels(revenus);
  const chargesMensuelles = calculateChargesMensuelles(charges);
  const capaciteEpargne = calculateSavingsCapacity(revenus, charges);
  const patrimoineImmobilierBrut = calculatePatrimoineImmobilierBrut(biens);
  const patrimoineFinancier = calculatePatrimoineFinancier(actifs);
  const creditRestant = calculateCreditRestantImmobilier(biens);
  const patrimoineBrut = calculateGrossWealth(biens, actifs);
  const patrimoineNet = calculateNetWealth(biens, actifs);

  return {
    client,
    genereLe: new Date().toLocaleDateString("fr-FR", {
      day: "numeric", month: "long", year: "numeric",
    }),
    revenus,
    charges,
    biens,
    actifs,
    objectifs,
    documents,
    opportunites,
    synthese: {
      revenusMensuels, chargesMensuelles, capaciteEpargne,
      patrimoineImmobilierBrut, patrimoineFinancier, creditRestant,
      patrimoineBrut, patrimoineNet,
    },
    labels: {
      revenu: (t) => label(REVENU_TYPES, t),
      charge: (t) => label(CHARGE_TYPES, t),
      immobilier: (t) => label(IMMOBILIER_TYPES, t),
      financier: (t) => label(FINANCIER_TYPES, t),
      objectif: (t) => label(OBJECTIF_TYPES, t),
    },
  };
}

export { situationFamilialeLabel };
