import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/types/database.types";

/**
 * Client Supabase à utiliser dans les Client Components ("use client").
 * Ne jamais utiliser ce client pour des opérations nécessitant la clé
 * service_role : celle-ci ne doit jamais être exposée côté navigateur.
 */
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
