-- Sillage by RLN Consulting — Migration 0002 : Phase 2, fondation du mode client
--
-- Un client peut désormais avoir son propre compte de connexion (user_id),
-- distinct du conseiller qui gère son dossier (conseiller_id). Ce compte
-- est créé par le conseiller via une invitation — jamais par auto-inscription
-- libre, pour garder le contrôle de qui a accès à quel dossier.

alter table clients add column user_id uuid references auth.users(id);
create unique index clients_user_id_unique on clients(user_id) where user_id is not null;

-- Un client connecté ne doit voir QUE sa propre fiche, jamais celles des
-- autres clients du conseiller.
create policy "client_reads_own_record" on clients
  for select using (user_id = auth.uid());

create policy "client_reads_own_conjoint" on conjoints
  for select using (
    client_id in (select id from clients where user_id = auth.uid())
  );

create policy "client_reads_own_enfants" on enfants
  for select using (
    client_id in (select id from clients where user_id = auth.uid())
  );
