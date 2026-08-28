import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";

/**
 * Client Supabase "admin", utilisant la clé service_role.
 *
 * ATTENTION SÉCURITÉ : cette clé contourne complètement les règles RLS
 * (Row Level Security). Elle ne doit JAMAIS être :
 * - préfixée par NEXT_PUBLIC_ (elle serait alors envoyée au navigateur) ;
 * - importée depuis un fichier "use client" ou un composant client ;
 * - loggée, affichée, ou renvoyée dans une réponse API.
 *
 * À utiliser uniquement dans des Route Handlers (app/api/**) pour des
 * opérations qui nécessitent explicitement de dépasser les droits normaux
 * d'un utilisateur — ici, inviter un client à créer son compte.
 */
export function createAdminClient() {
  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
