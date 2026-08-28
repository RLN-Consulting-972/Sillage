-- Sillage by RLN Consulting — Migration 0001 : Phase 1
-- (auth, profils, clients, conjoint, enfants)

create type user_role as enum ('conseiller', 'client', 'admin');

create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role user_role not null default 'conseiller',
  full_name text,
  created_at timestamptz not null default now()
);

create table clients (
  id uuid primary key default gen_random_uuid(),
  conseiller_id uuid not null references profiles(id),
  civilite text,
  nom text not null,
  prenom text not null,
  date_naissance date,
  adresse text,
  telephone text,
  email text,
  residence_fiscale text,
  situation_familiale text check (situation_familiale in
    ('celibataire','marie','pacse','concubinage','divorce','veuf')),
  regime_matrimonial text,
  date_mariage date,
  contrat_mariage boolean,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table conjoints (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references clients(id) on delete cascade,
  civilite text,
  nom text,
  prenom text,
  date_naissance date
);

create table enfants (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references clients(id) on delete cascade,
  prenom text not null,
  date_naissance date,
  a_charge boolean default true,
  situation text,
  notes_transmission text
);

-- Trigger updated_at
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger clients_set_updated_at
before update on clients
for each row execute procedure set_updated_at();

-- Row Level Security
alter table profiles enable row level security;
alter table clients enable row level security;
alter table conjoints enable row level security;
alter table enfants enable row level security;

create policy "profiles_self_access" on profiles
  for all using (id = auth.uid());

create policy "conseiller_owns_client" on clients
  for all using (conseiller_id = auth.uid());

create policy "conseiller_owns_conjoint" on conjoints
  for all using (
    client_id in (select id from clients where conseiller_id = auth.uid())
  );

create policy "conseiller_owns_enfant" on enfants
  for all using (
    client_id in (select id from clients where conseiller_id = auth.uid())
  );
