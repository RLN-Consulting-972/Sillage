import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, ClientRow } from "@/types/database.types";
import type { Client, ClientFormInput } from "./types";

/**
 * Couche service — accès Supabase uniquement.
 * Aucun calcul patrimonial, aucune règle métier ici : voir /calculations et /rules.
 */

function mapRowToClient(
  row: ClientRow,
  conjoint?: Database["public"]["Tables"]["conjoints"]["Row"] | null,
  enfants: Database["public"]["Tables"]["enfants"]["Row"][] = []
): Client {
  return {
    id: row.id,
    userId: row.user_id ?? undefined,
    civilite: row.civilite ?? undefined,
    nom: row.nom,
    prenom: row.prenom,
    dateNaissance: row.date_naissance ?? undefined,
    adresse: row.adresse ?? undefined,
    telephone: row.telephone ?? undefined,
    email: row.email ?? undefined,
    residenceFiscale: row.residence_fiscale ?? undefined,
    situationFamiliale: row.situation_familiale ?? undefined,
    regimeMatrimonial: row.regime_matrimonial ?? undefined,
    dateMariage: row.date_mariage ?? undefined,
    contratMariage: row.contrat_mariage ?? undefined,
    conjoint: conjoint
      ? {
          id: conjoint.id,
          civilite: conjoint.civilite ?? undefined,
          nom: conjoint.nom ?? undefined,
          prenom: conjoint.prenom ?? undefined,
          dateNaissance: conjoint.date_naissance ?? undefined,
        }
      : undefined,
    enfants: enfants.map((e) => ({
      id: e.id,
      prenom: e.prenom,
      dateNaissance: e.date_naissance ?? undefined,
      aCharge: e.a_charge ?? true,
      situation: e.situation ?? undefined,
      notesTransmission: e.notes_transmission ?? undefined,
    })),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function listClients(
  supabase: SupabaseClient<Database>
): Promise<Client[]> {
  const { data, error } = await supabase
    .from("clients")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []).map((row) => mapRowToClient(row));
}

export async function getClientById(
  supabase: SupabaseClient<Database>,
  clientId: string
): Promise<Client | null> {
  const { data: clientRow, error: clientError } = await supabase
    .from("clients")
    .select("*")
    .eq("id", clientId)
    .single();

  if (clientError) {
    if (clientError.code === "PGRST116") return null; // not found
    throw clientError;
  }

  const [{ data: conjointRow }, { data: enfantsRows }] = await Promise.all([
    supabase.from("conjoints").select("*").eq("client_id", clientId).maybeSingle(),
    supabase.from("enfants").select("*").eq("client_id", clientId),
  ]);

  return mapRowToClient(clientRow, conjointRow ?? null, enfantsRows ?? []);
}

/**
 * Les champs <input type="date"> HTML envoient "" (chaîne vide) quand ils
 * sont laissés vides — jamais undefined ni null. Or Postgres refuse
 * catégoriquement "" pour une colonne de type date ("invalid input
 * syntax for type date"). Cette fonction normalise ça avant tout insert.
 */
export function emptyDateToNull(value: string | null | undefined): string | null {
  return value ? value : null;
}

export function clientInputToRow(input: ClientFormInput) {
  return {
    civilite: input.civilite ?? null,
    nom: input.nom,
    prenom: input.prenom,
    date_naissance: emptyDateToNull(input.dateNaissance),
    adresse: input.adresse ?? null,
    telephone: input.telephone ?? null,
    email: input.email ?? null,
    residence_fiscale: input.residenceFiscale ?? null,
    situation_familiale: input.situationFamiliale ?? null,
    regime_matrimonial: input.regimeMatrimonial ?? null,
    date_mariage: emptyDateToNull(input.dateMariage),
    contrat_mariage: input.contratMariage ?? null,
  };
}

async function upsertConjointEtEnfants(
  supabase: SupabaseClient<Database>,
  clientId: string,
  input: ClientFormInput
) {
  // Remplace conjoint et enfants existants par la version soumise :
  // plus simple et plus sûr qu'un diff champ à champ pour une V1.
  await supabase.from("conjoints").delete().eq("client_id", clientId);
  await supabase.from("enfants").delete().eq("client_id", clientId);

  if (input.conjoint && (input.conjoint.nom || input.conjoint.prenom)) {
    await supabase.from("conjoints").insert({
      client_id: clientId,
      civilite: input.conjoint.civilite ?? null,
      nom: input.conjoint.nom ?? null,
      prenom: input.conjoint.prenom ?? null,
      date_naissance: emptyDateToNull(input.conjoint.dateNaissance),
    });
  }

  if (input.enfants && input.enfants.length > 0) {
    await supabase.from("enfants").insert(
      input.enfants.map((e) => ({
        client_id: clientId,
        prenom: e.prenom,
        date_naissance: emptyDateToNull(e.dateNaissance),
        a_charge: e.aCharge,
        situation: e.situation ?? null,
        notes_transmission: e.notesTransmission ?? null,
      }))
    );
  }
}

export async function getOwnClientRecord(
  supabase: SupabaseClient<Database>,
  userId: string
): Promise<Client | null> {
  const { data: clientRow, error } = await supabase
    .from("clients")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) throw error;
  if (!clientRow) return null;

  const [{ data: conjointRow }, { data: enfantsRows }] = await Promise.all([
    supabase.from("conjoints").select("*").eq("client_id", clientRow.id).maybeSingle(),
    supabase.from("enfants").select("*").eq("client_id", clientRow.id),
  ]);

  return mapRowToClient(clientRow, conjointRow ?? null, enfantsRows ?? []);
}

export async function createClient(
  supabase: SupabaseClient<Database>,
  conseillerId: string,
  input: ClientFormInput
): Promise<Client> {
  const { data: clientRow, error } = await supabase
    .from("clients")
    .insert({ conseiller_id: conseillerId, ...clientInputToRow(input) })
    .select("*")
    .single();

  if (error) throw error;

  await upsertConjointEtEnfants(supabase, clientRow.id, input);

  return (await getClientById(supabase, clientRow.id)) as Client;
}

export async function updateClient(
  supabase: SupabaseClient<Database>,
  clientId: string,
  input: ClientFormInput
): Promise<Client> {
  const { error } = await supabase
    .from("clients")
    .update(clientInputToRow(input))
    .eq("id", clientId);

  if (error) throw error;

  await upsertConjointEtEnfants(supabase, clientId, input);

  return (await getClientById(supabase, clientId)) as Client;
}

export async function deleteClient(
  supabase: SupabaseClient<Database>,
  clientId: string
): Promise<void> {
  const { error } = await supabase.from("clients").delete().eq("id", clientId);
  if (error) throw error;
}
