-- Sillage by RLN Consulting — Migration 0004 : module Documents
--
-- Volontairement simple pour cette première version : une checklist de
-- pièces attendues par dossier, avec un statut manquant/reçu — sans
-- upload de fichier (viendra dans un second temps une fois ce besoin
-- validé à l'usage).

create type document_statut as enum ('manquant', 'recu');

create table documents (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references clients(id) on delete cascade,
  nom text not null,
  categorie text not null check (categorie in (
    'identite', 'avis_imposition', 'retraite', 'assurance_vie', 'per',
    'pea', 'credit', 'immobilier', 'assurance', 'autre'
  )),
  statut document_statut not null default 'manquant',
  note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger documents_set_updated_at
before update on documents
for each row execute procedure set_updated_at();

alter table documents enable row level security;

create policy "conseiller_owns_document" on documents
  for all using (
    client_id in (select id from clients where conseiller_id = auth.uid())
  );
