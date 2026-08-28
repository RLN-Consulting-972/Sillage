/**
 * Généré par introspection directe du schéma Postgres réel appliqué
 * (database/migrations/0001_init.sql), en l'absence de Docker requis par
 * `npx supabase gen types typescript` dans cet environnement.
 *
 * Reproduit la forme standard des types générés par la CLI Supabase
 * (Row / Insert / Update / Relationships) — à régénérer avec la commande
 * officielle dès qu'un environnement avec Docker (ou un projet Supabase
 * distant) est disponible :
 *
 *   npx supabase gen types typescript --project-id <id> > types/database.types.ts
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRole = "conseiller" | "client" | "admin";
export type SituationFamiliale = "celibataire" | "marie" | "pacse" | "concubinage" | "divorce" | "veuf";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          role: "conseiller" | "client" | "admin";
          full_name: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          role?: "conseiller" | "client" | "admin";
          full_name?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          role?: "conseiller" | "client" | "admin";
          full_name?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      clients: {
        Row: {
          id: string;
          conseiller_id: string;
          civilite: string | null;
          nom: string;
          prenom: string;
          date_naissance: string | null;
          adresse: string | null;
          telephone: string | null;
          email: string | null;
          residence_fiscale: string | null;
          situation_familiale: SituationFamiliale | null;
          regime_matrimonial: string | null;
          date_mariage: string | null;
          contrat_mariage: boolean | null;
          created_at: string;
          updated_at: string;
          user_id: string | null;
        };
        Insert: {
          id?: string;
          conseiller_id: string;
          civilite?: string | null;
          nom: string;
          prenom: string;
          date_naissance?: string | null;
          adresse?: string | null;
          telephone?: string | null;
          email?: string | null;
          residence_fiscale?: string | null;
          situation_familiale?: SituationFamiliale | null;
          regime_matrimonial?: string | null;
          date_mariage?: string | null;
          contrat_mariage?: boolean | null;
          created_at?: string;
          updated_at?: string;
          user_id?: string | null;
        };
        Update: {
          id?: string;
          conseiller_id?: string;
          civilite?: string | null;
          nom?: string;
          prenom?: string;
          date_naissance?: string | null;
          adresse?: string | null;
          telephone?: string | null;
          email?: string | null;
          residence_fiscale?: string | null;
          situation_familiale?: SituationFamiliale | null;
          regime_matrimonial?: string | null;
          date_mariage?: string | null;
          contrat_mariage?: boolean | null;
          created_at?: string;
          updated_at?: string;
          user_id?: string | null;
        };
        Relationships: [];
      };
      conjoints: {
        Row: {
          id: string;
          client_id: string;
          civilite: string | null;
          nom: string | null;
          prenom: string | null;
          date_naissance: string | null;
        };
        Insert: {
          id?: string;
          client_id: string;
          civilite?: string | null;
          nom?: string | null;
          prenom?: string | null;
          date_naissance?: string | null;
        };
        Update: {
          id?: string;
          client_id?: string;
          civilite?: string | null;
          nom?: string | null;
          prenom?: string | null;
          date_naissance?: string | null;
        };
        Relationships: [];
      };
      enfants: {
        Row: {
          id: string;
          client_id: string;
          prenom: string;
          date_naissance: string | null;
          a_charge: boolean | null;
          situation: string | null;
          notes_transmission: string | null;
        };
        Insert: {
          id?: string;
          client_id: string;
          prenom: string;
          date_naissance?: string | null;
          a_charge?: boolean | null;
          situation?: string | null;
          notes_transmission?: string | null;
        };
        Update: {
          id?: string;
          client_id?: string;
          prenom?: string;
          date_naissance?: string | null;
          a_charge?: boolean | null;
          situation?: string | null;
          notes_transmission?: string | null;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      user_role: UserRole;
    };
    CompositeTypes: Record<string, never>;
  };
}

// Alias pratiques utilisés dans les modules métier (types "Row" par table)
export type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];
export type ClientRow = Database["public"]["Tables"]["clients"]["Row"];
export type ConjointRow = Database["public"]["Tables"]["conjoints"]["Row"];
export type EnfantRow = Database["public"]["Tables"]["enfants"]["Row"];
