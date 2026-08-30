-- Sillage by RLN Consulting — Migration 0005 : Phase 3, revenus, charges,
-- patrimoine (immobilier et financier), objectifs.
--
-- Champs volontairement resserrés par rapport au cahier des charges
-- d'origine (périodicité, titulaire, établissement plutôt que la liste
-- complète) — on enrichira une fois l'usage validé, plutôt que de
-- construire tout le détail d'un coup.

create table revenus (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references clients(id) on delete cascade,
  type text not null check (type in (
    'salaire', 'revenus_professionnels', 'revenus_fonciers', 'pensions',
    'retraites', 'dividendes', 'interets', 'autres'
  )),
  montant numeric not null check (montant >= 0),
  periodicite text not null default 'mensuel' check (periodicite in ('mensuel', 'annuel')),
  titulaire text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table charges (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references clients(id) on delete cascade,
  type text not null check (type in (
    'credit_immobilier', 'credit_consommation', 'leasing', 'loyer',
    'pension_versee', 'charges_recurrentes', 'autres'
  )),
  montant numeric not null check (montant >= 0),
  periodicite text not null default 'mensuel' check (periodicite in ('mensuel', 'annuel')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table patrimoine_immobilier (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references clients(id) on delete cascade,
  type text not null check (type in (
    'residence_principale', 'residence_secondaire', 'locatif', 'sci',
    'nue_propriete', 'usufruit', 'autre'
  )),
  valeur_estimee numeric not null check (valeur_estimee >= 0),
  credit_restant numeric default 0 check (credit_restant >= 0),
  mensualite_credit numeric default 0 check (mensualite_credit >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table patrimoine_financier (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references clients(id) on delete cascade,
  type text not null check (type in (
    'livret_a', 'ldds', 'assurance_vie', 'per', 'pea', 'compte_titres',
    'comptes_bancaires', 'scpi', 'autres'
  )),
  montant numeric not null check (montant >= 0),
  etablissement text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table objectifs (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references clients(id) on delete cascade,
  type text not null check (type in (
    'retraite', 'transmission', 'fiscalite', 'revenus_complementaires',
    'acquisition_immobiliere', 'protection_familiale',
    'constitution_capital', 'autre'
  )),
  montant_cible numeric check (montant_cible >= 0),
  echeance text,
  priorite text not null default 'moyenne' check (priorite in ('haute', 'moyenne', 'basse')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Trigger updated_at, mêmes règles que sur "clients"
create trigger revenus_set_updated_at before update on revenus
  for each row execute procedure set_updated_at();
create trigger charges_set_updated_at before update on charges
  for each row execute procedure set_updated_at();
create trigger patrimoine_immobilier_set_updated_at before update on patrimoine_immobilier
  for each row execute procedure set_updated_at();
create trigger patrimoine_financier_set_updated_at before update on patrimoine_financier
  for each row execute procedure set_updated_at();
create trigger objectifs_set_updated_at before update on objectifs
  for each row execute procedure set_updated_at();

-- RLS : même principe que documents — visible uniquement par le
-- conseiller propriétaire du dossier client.
alter table revenus enable row level security;
alter table charges enable row level security;
alter table patrimoine_immobilier enable row level security;
alter table patrimoine_financier enable row level security;
alter table objectifs enable row level security;

create policy "conseiller_owns_revenu" on revenus
  for all using (client_id in (select id from clients where conseiller_id = auth.uid()));
create policy "conseiller_owns_charge" on charges
  for all using (client_id in (select id from clients where conseiller_id = auth.uid()));
create policy "conseiller_owns_immobilier" on patrimoine_immobilier
  for all using (client_id in (select id from clients where conseiller_id = auth.uid()));
create policy "conseiller_owns_financier" on patrimoine_financier
  for all using (client_id in (select id from clients where conseiller_id = auth.uid()));
create policy "conseiller_owns_objectif" on objectifs
  for all using (client_id in (select id from clients where conseiller_id = auth.uid()));
