-- Sillage by RLN Consulting — Migration 0003 : correction du bug
-- "profil conseiller manquant après inscription".
--
-- Avant cette migration, la création du profil se faisait côté
-- application juste après l'inscription (supabase.auth.signUp), à un
-- moment où la session n'est pas encore établie. Les règles de sécurité
-- (RLS) bloquaient alors silencieusement cette insertion, laissant le
-- compte d'authentification exister sans jamais avoir de profil associé
-- — ce qui empêchait ensuite toute création de client (contrainte de
-- clé étrangère clients_conseiller_id_fkey).
--
-- Solution robuste : un trigger côté base de données, qui s'exécute
-- avec des droits élevés (SECURITY DEFINER) et n'est donc jamais
-- concerné par ce problème de timing.

create or replace function public.handle_new_user()
returns trigger
security definer
set search_path = public
language plpgsql
as $$
begin
  -- Le rôle et le nom sont lus dans les métadonnées transmises à la
  -- création du compte : "conseiller" pour une auto-inscription
  -- (app/(auth)/register), "client" pour une invitation envoyée par un
  -- conseiller (app/api/clients/[clientId]/inviter). Sans indication,
  -- on suppose "conseiller" par défaut.
  insert into public.profiles (id, role, full_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'role', 'conseiller')::user_role,
    coalesce(new.raw_user_meta_data->>'full_name', '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Rattrapage pour les comptes déjà créés avant cette migration, dont le
-- profil manque encore (comme celui identifié manuellement ce jour-là).
-- Par sécurité, seuls les comptes sans AUCUN profil sont concernés — un
-- compte client déjà correctement configuré n'est jamais touché.
insert into public.profiles (id, role, full_name)
select
  u.id,
  coalesce(u.raw_user_meta_data->>'role', 'conseiller')::user_role,
  coalesce(u.raw_user_meta_data->>'full_name', '')
from auth.users u
left join public.profiles p on p.id = u.id
where p.id is null;
