-- ============================================================
-- DART — Schéma complet Supabase (fichier unique)
-- À exécuter en une seule fois dans le SQL Editor de Supabase
-- Remplace tous les anciens fichiers supabase-*.sql
-- ============================================================

-- Nettoyage (au cas où certaines tables existent déjà d'un essai précédent)
drop table if exists presences cascade;
drop table if exists evenements cascade;
drop table if exists exercices cascade;
drop table if exists questionnaire_historique cascade;
drop table if exists equipes cascade;
drop table if exists profils cascade;
drop function if exists mon_equipe_id() cascade;
drop function if exists je_suis_capitaine() cascade;

-- ============================================================
-- TABLES
-- ============================================================

create table profils (
  id uuid primary key references auth.users(id) on delete cascade,
  prenom text not null,
  nom text,
  genre text,
  age int,
  taille int,
  bras_tendu int,
  poste text,
  numero int,
  est_capitaine boolean default false,
  equipe_id uuid,
  competences jsonb default '{}'::jsonb,
  created_at timestamp default now()
);

create table equipes (
  id uuid primary key default gen_random_uuid(),
  nom text not null,
  slogan text,
  code text unique not null,
  jours_entrainement text[],
  horaire text,
  capitaine_id uuid references auth.users(id) on delete set null,
  created_at timestamp default now()
);

create table questionnaire_historique (
  id uuid primary key default gen_random_uuid(),
  profil_id uuid references profils(id) on delete cascade,
  competences jsonb not null,
  date_passage timestamp default now()
);

create table evenements (
  id uuid primary key default gen_random_uuid(),
  equipe_id uuid references equipes(id) on delete cascade,
  titre text not null,
  type text not null default 'Entraînement classique',
  date_debut timestamp not null,
  lieu text,
  description text,
  created_at timestamp default now()
);

create table presences (
  id uuid primary key default gen_random_uuid(),
  evenement_id uuid references evenements(id) on delete cascade,
  profil_id uuid references profils(id) on delete cascade,
  present boolean,
  unique (evenement_id, profil_id)
);

create table exercices (
  id uuid primary key default gen_random_uuid(),
  equipe_id uuid references equipes(id) on delete cascade,
  categorie text not null,
  sous_categorie text,
  nom text not null,
  description text,
  video_url text,
  unite text default 'reps',
  valeur_defaut int default 10,
  ordre int default 0,
  created_at timestamp default now()
);

create table sous_equipes (
  id uuid primary key default gen_random_uuid(),
  equipe_id uuid references equipes(id) on delete cascade,
  nom text not null,
  capitaine_honorifique_id uuid references profils(id) on delete set null,
  created_at timestamp default now()
);

create table sous_equipe_membres (
  sous_equipe_id uuid references sous_equipes(id) on delete cascade,
  profil_id uuid references profils(id) on delete cascade,
  primary key (sous_equipe_id, profil_id)
);

-- ============================================================
-- FONCTIONS (évitent la récursion infinie dans les règles RLS)
-- ============================================================

create or replace function public.mon_equipe_id()
returns uuid
language sql
security definer
set search_path = public
stable
as $$
  select equipe_id from profils where id = auth.uid()
$$;

create or replace function public.je_suis_capitaine()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select coalesce(est_capitaine, false) from profils where id = auth.uid()
$$;

-- ============================================================
-- DROITS DE BASE
-- ============================================================

grant usage on schema public to authenticated, anon;
grant select, insert, update, delete on all tables in schema public to authenticated;
grant select on all tables in schema public to anon;
grant usage, select on all sequences in schema public to authenticated;
alter default privileges in schema public
  grant select, insert, update, delete on tables to authenticated;

-- ============================================================
-- RÈGLES DE SÉCURITÉ (RLS)
-- ============================================================

alter table profils enable row level security;
alter table equipes enable row level security;
alter table questionnaire_historique enable row level security;
alter table evenements enable row level security;
alter table presences enable row level security;
alter table exercices enable row level security;
alter table sous_equipes enable row level security;
alter table sous_equipe_membres enable row level security;

-- Profils
create policy "Voir son propre profil"
  on profils for select using (auth.uid() = id);

create policy "Voir ses coéquipiers"
  on profils for select using (equipe_id is not null and equipe_id = mon_equipe_id());

create policy "Modifier son propre profil"
  on profils for update using (auth.uid() = id);

create policy "Créer son propre profil"
  on profils for insert with check (auth.uid() = id);

create policy "Le capitaine modifie ses joueurs"
  on profils for update using (equipe_id = mon_equipe_id() and je_suis_capitaine());

create policy "Le capitaine retire un joueur"
  on profils for delete using (equipe_id = mon_equipe_id() and je_suis_capitaine());

-- Équipes
create policy "Voir les équipes"
  on equipes for select using (auth.role() = 'authenticated');

create policy "Créer une équipe"
  on equipes for insert with check (auth.role() = 'authenticated');

create policy "Le capitaine modifie son équipe"
  on equipes for update using (auth.uid() = capitaine_id);

-- Historique questionnaire
create policy "Voir son historique"
  on questionnaire_historique for select using (auth.uid() = profil_id);

create policy "Ajouter à son historique"
  on questionnaire_historique for insert with check (auth.uid() = profil_id);

-- Événements
create policy "Voir les événements de son équipe"
  on evenements for select using (equipe_id = mon_equipe_id());

create policy "Le capitaine ajoute un événement"
  on evenements for insert with check (equipe_id = mon_equipe_id() and je_suis_capitaine());

create policy "Le capitaine modifie un événement"
  on evenements for update using (equipe_id = mon_equipe_id() and je_suis_capitaine());

-- Présences
create policy "Voir les présences de son équipe"
  on presences for select using (
    evenement_id in (select id from evenements where equipe_id = mon_equipe_id())
  );

create policy "Renseigner sa propre présence"
  on presences for insert with check (auth.uid() = profil_id);

create policy "Modifier sa propre présence"
  on presences for update using (auth.uid() = profil_id);

-- Exercices
create policy "Voir les exercices de son équipe"
  on exercices for select using (equipe_id = mon_equipe_id());

create policy "Le capitaine gère les exercices"
  on exercices for all using (equipe_id = mon_equipe_id() and je_suis_capitaine());

-- Sous-équipes
create policy "Voir les sous-équipes de son équipe"
  on sous_equipes for select using (equipe_id = mon_equipe_id());

create policy "Le capitaine gère les sous-équipes"
  on sous_equipes for all using (equipe_id = mon_equipe_id() and je_suis_capitaine());

create policy "Voir les membres des sous-équipes de son équipe"
  on sous_equipe_membres for select using (
    sous_equipe_id in (select id from sous_equipes where equipe_id = mon_equipe_id())
  );

create policy "Le capitaine gère les membres des sous-équipes"
  on sous_equipe_membres for all using (
    sous_equipe_id in (select id from sous_equipes where equipe_id = mon_equipe_id())
    and je_suis_capitaine()
  );
