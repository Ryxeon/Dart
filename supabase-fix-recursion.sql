-- À exécuter dans le SQL Editor de Supabase
-- Corrige "infinite recursion detected in policy for relation profils"

-- 1. Fonctions qui contournent la RLS pour éviter la boucle
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

-- 2. On supprime les anciennes règles qui se référençaient elles-mêmes
drop policy if exists "Un utilisateur peut voir ses coéquipiers" on profils;
drop policy if exists "Le capitaine peut modifier ses joueurs" on profils;
drop policy if exists "Le capitaine peut retirer un joueur" on profils;

drop policy if exists "Voir les événements de son équipe" on evenements;
drop policy if exists "Le capitaine peut ajouter un événement" on evenements;
drop policy if exists "Le capitaine peut modifier un événement" on evenements;

drop policy if exists "Voir ses propres présences et celles de son équipe" on presences;

drop policy if exists "Voir les exercices de son équipe" on exercices;
drop policy if exists "Le capitaine gère les exercices" on exercices;

-- 3. On les recrée en utilisant les fonctions (plus de recursion)
create policy "Un utilisateur peut voir ses coéquipiers"
  on profils for select using (equipe_id is not null and equipe_id = mon_equipe_id());

create policy "Le capitaine peut modifier ses joueurs"
  on profils for update using (equipe_id = mon_equipe_id() and je_suis_capitaine());

create policy "Le capitaine peut retirer un joueur"
  on profils for delete using (equipe_id = mon_equipe_id() and je_suis_capitaine());

create policy "Voir les événements de son équipe"
  on evenements for select using (equipe_id = mon_equipe_id());

create policy "Le capitaine peut ajouter un événement"
  on evenements for insert with check (equipe_id = mon_equipe_id() and je_suis_capitaine());

create policy "Le capitaine peut modifier un événement"
  on evenements for update using (equipe_id = mon_equipe_id() and je_suis_capitaine());

create policy "Voir ses propres présences et celles de son équipe"
  on presences for select using (
    evenement_id in (select id from evenements where equipe_id = mon_equipe_id())
  );

create policy "Voir les exercices de son équipe"
  on exercices for select using (equipe_id = mon_equipe_id());

create policy "Le capitaine gère les exercices"
  on exercices for all using (equipe_id = mon_equipe_id() and je_suis_capitaine());
