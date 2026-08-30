import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  Database,
  RevenuRow,
  ChargeRow,
  PatrimoineImmobilierRow,
  PatrimoineFinancierRow,
  ObjectifRow,
} from "@/types/database.types";
import type {
  Revenu, Charge, BienImmobilier, ActifFinancier, Objectif,
  RevenuType, ChargeType, ImmobilierType, FinancierType, ObjectifType,
  Periodicite, Priorite,
} from "./types";

type DB = SupabaseClient<Database>;

// ---------- Revenus ----------

function mapRevenu(row: RevenuRow): Revenu {
  return {
    id: row.id,
    clientId: row.client_id,
    type: row.type as RevenuType,
    montant: Number(row.montant),
    periodicite: row.periodicite as Periodicite,
    titulaire: row.titulaire ?? undefined,
  };
}

export async function listRevenus(supabase: DB, clientId: string): Promise<Revenu[]> {
  const { data, error } = await supabase
    .from("revenus").select("*").eq("client_id", clientId).order("created_at");
  if (error) throw error;
  return (data ?? []).map(mapRevenu);
}

export async function createRevenu(
  supabase: DB, clientId: string,
  input: { type: RevenuType; montant: number; periodicite: Periodicite; titulaire?: string }
): Promise<Revenu> {
  const { data, error } = await supabase
    .from("revenus")
    .insert({ client_id: clientId, type: input.type, montant: input.montant, periodicite: input.periodicite, titulaire: input.titulaire ?? null })
    .select("*").single();
  if (error) throw error;
  return mapRevenu(data);
}

export async function deleteRevenu(supabase: DB, id: string): Promise<void> {
  const { error } = await supabase.from("revenus").delete().eq("id", id);
  if (error) throw error;
}

// ---------- Charges ----------

function mapCharge(row: ChargeRow): Charge {
  return {
    id: row.id,
    clientId: row.client_id,
    type: row.type as ChargeType,
    montant: Number(row.montant),
    periodicite: row.periodicite as Periodicite,
  };
}

export async function listCharges(supabase: DB, clientId: string): Promise<Charge[]> {
  const { data, error } = await supabase
    .from("charges").select("*").eq("client_id", clientId).order("created_at");
  if (error) throw error;
  return (data ?? []).map(mapCharge);
}

export async function createCharge(
  supabase: DB, clientId: string,
  input: { type: ChargeType; montant: number; periodicite: Periodicite }
): Promise<Charge> {
  const { data, error } = await supabase
    .from("charges")
    .insert({ client_id: clientId, type: input.type, montant: input.montant, periodicite: input.periodicite })
    .select("*").single();
  if (error) throw error;
  return mapCharge(data);
}

export async function deleteCharge(supabase: DB, id: string): Promise<void> {
  const { error } = await supabase.from("charges").delete().eq("id", id);
  if (error) throw error;
}

// ---------- Patrimoine immobilier ----------

function mapImmobilier(row: PatrimoineImmobilierRow): BienImmobilier {
  return {
    id: row.id,
    clientId: row.client_id,
    type: row.type as ImmobilierType,
    valeurEstimee: Number(row.valeur_estimee),
    creditRestant: Number(row.credit_restant ?? 0),
    mensualiteCredit: Number(row.mensualite_credit ?? 0),
  };
}

export async function listImmobilier(supabase: DB, clientId: string): Promise<BienImmobilier[]> {
  const { data, error } = await supabase
    .from("patrimoine_immobilier").select("*").eq("client_id", clientId).order("created_at");
  if (error) throw error;
  return (data ?? []).map(mapImmobilier);
}

export async function createImmobilier(
  supabase: DB, clientId: string,
  input: { type: ImmobilierType; valeurEstimee: number; creditRestant: number; mensualiteCredit: number }
): Promise<BienImmobilier> {
  const { data, error } = await supabase
    .from("patrimoine_immobilier")
    .insert({
      client_id: clientId, type: input.type, valeur_estimee: input.valeurEstimee,
      credit_restant: input.creditRestant, mensualite_credit: input.mensualiteCredit,
    })
    .select("*").single();
  if (error) throw error;
  return mapImmobilier(data);
}

export async function deleteImmobilier(supabase: DB, id: string): Promise<void> {
  const { error } = await supabase.from("patrimoine_immobilier").delete().eq("id", id);
  if (error) throw error;
}

// ---------- Patrimoine financier ----------

function mapFinancier(row: PatrimoineFinancierRow): ActifFinancier {
  return {
    id: row.id,
    clientId: row.client_id,
    type: row.type as FinancierType,
    montant: Number(row.montant),
    etablissement: row.etablissement ?? undefined,
  };
}

export async function listFinanciers(supabase: DB, clientId: string): Promise<ActifFinancier[]> {
  const { data, error } = await supabase
    .from("patrimoine_financier").select("*").eq("client_id", clientId).order("created_at");
  if (error) throw error;
  return (data ?? []).map(mapFinancier);
}

export async function createFinancier(
  supabase: DB, clientId: string,
  input: { type: FinancierType; montant: number; etablissement?: string }
): Promise<ActifFinancier> {
  const { data, error } = await supabase
    .from("patrimoine_financier")
    .insert({ client_id: clientId, type: input.type, montant: input.montant, etablissement: input.etablissement ?? null })
    .select("*").single();
  if (error) throw error;
  return mapFinancier(data);
}

export async function deleteFinancier(supabase: DB, id: string): Promise<void> {
  const { error } = await supabase.from("patrimoine_financier").delete().eq("id", id);
  if (error) throw error;
}

// ---------- Objectifs ----------

function mapObjectif(row: ObjectifRow): Objectif {
  return {
    id: row.id,
    clientId: row.client_id,
    type: row.type as ObjectifType,
    montantCible: row.montant_cible ? Number(row.montant_cible) : undefined,
    echeance: row.echeance ?? undefined,
    priorite: row.priorite as Priorite,
  };
}

export async function listObjectifs(supabase: DB, clientId: string): Promise<Objectif[]> {
  const { data, error } = await supabase
    .from("objectifs").select("*").eq("client_id", clientId).order("created_at");
  if (error) throw error;
  return (data ?? []).map(mapObjectif);
}

export async function createObjectif(
  supabase: DB, clientId: string,
  input: { type: ObjectifType; montantCible?: number; echeance?: string; priorite: Priorite }
): Promise<Objectif> {
  const { data, error } = await supabase
    .from("objectifs")
    .insert({
      client_id: clientId, type: input.type, montant_cible: input.montantCible ?? null,
      echeance: input.echeance ?? null, priorite: input.priorite,
    })
    .select("*").single();
  if (error) throw error;
  return mapObjectif(data);
}

export async function deleteObjectif(supabase: DB, id: string): Promise<void> {
  const { error } = await supabase.from("objectifs").delete().eq("id", id);
  if (error) throw error;
}
