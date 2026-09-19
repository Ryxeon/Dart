-- À copier-coller dans l'éditeur SQL de Supabase (SQL Editor > New query)

-- Table des profils joueurs (liée aux comptes d'authentification)
create table profils (
  id uuid primary key references auth.users(id) on delete cascade,
  prenom text not null,
  nom text,
  genre text,
  age int,
  taille int,
  bras_tendu int,
  poste text,
  est_capitaine boolean default false,
  equipe_id uuid,
  created_at timestamp default now()
);

-- Table des équipes
create table equipes (
  id uuid primary key default gen_random_uuid(),
  nom text not null,
  slogan text,
  code text unique not null,
  jours_entrainement text[],
  horaire text,
  capitaine_id uuid references profils(id),
  created_at timestamp default now()
);

-- Autoriser chaque utilisateur connecté à lire/modifier ses propres données
alter table profils enable row level security;
alter table equipes enable row level security;

create policy "Un utilisateur peut voir son profil"
  on profils for select using (auth.uid() = id);

create policy "Un utilisateur peut voir ses coéquipiers"
  on profils for select using (
    equipe_id is not null
    and equipe_id = (select equipe_id from profils where id = auth.uid())
  );

create policy "Un utilisateur peut modifier son profil"
  on profils for update using (auth.uid() = id);

create policy "Un utilisateur peut créer son profil"
  on profils for insert with check (auth.uid() = id);

create policy "Tout utilisateur connecté peut voir les équipes"
  on equipes for select using (auth.role() = 'authenticated');

create policy "Tout utilisateur connecté peut créer une équipe"
  on equipes for insert with check (auth.role() = 'authenticated');

create policy "Le capitaine peut modifier son équipe"
  on equipes for update using (auth.uid() = capitaine_id);
