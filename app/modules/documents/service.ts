import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, DocumentRow } from "@/types/database.types";
import type { DocumentItem, Categorie } from "./types";
import { CHECKLIST_STANDARD } from "./types";

function mapRow(row: DocumentRow): DocumentItem {
  return {
    id: row.id,
    clientId: row.client_id,
    nom: row.nom,
    categorie: row.categorie as Categorie,
    statut: row.statut,
    note: row.note ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function listDocuments(
  supabase: SupabaseClient<Database>,
  clientId: string
): Promise<DocumentItem[]> {
  const { data, error } = await supabase
    .from("documents")
    .select("*")
    .eq("client_id", clientId)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return (data ?? []).map(mapRow);
}

export async function createDocument(
  supabase: SupabaseClient<Database>,
  clientId: string,
  input: { nom: string; categorie: Categorie; note?: string }
): Promise<DocumentItem> {
  const { data, error } = await supabase
    .from("documents")
    .insert({
      client_id: clientId,
      nom: input.nom,
      categorie: input.categorie,
      note: input.note ?? null,
    })
    .select("*")
    .single();

  if (error) throw error;
  return mapRow(data);
}

export async function seedChecklistStandard(
  supabase: SupabaseClient<Database>,
  clientId: string
): Promise<DocumentItem[]> {
  const { data, error } = await supabase
    .from("documents")
    .insert(
      CHECKLIST_STANDARD.map((item) => ({
        client_id: clientId,
        nom: item.nom,
        categorie: item.categorie,
      }))
    )
    .select("*");

  if (error) throw error;
  return (data ?? []).map(mapRow);
}

export async function updateDocumentStatut(
  supabase: SupabaseClient<Database>,
  documentId: string,
  statut: "manquant" | "recu"
): Promise<DocumentItem> {
  const { data, error } = await supabase
    .from("documents")
    .update({ statut })
    .eq("id", documentId)
    .select("*")
    .single();

  if (error) throw error;
  return mapRow(data);
}

export async function deleteDocument(
  supabase: SupabaseClient<Database>,
  documentId: string
): Promise<void> {
  const { error } = await supabase.from("documents").delete().eq("id", documentId);
  if (error) throw error;
}
