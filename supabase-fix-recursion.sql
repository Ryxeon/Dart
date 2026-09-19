-- À exécuter dans le SQL Editor de Supabase
-- Corrige "infinite recursion detected in policy for relation profils"
-- Version robuste : ne plante pas si certaines tables n'existent pas encore chez toi

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

-- profils (existe toujours)
drop policy if exists "Un utilisateur peut voir ses coéquipiers" on profils;
drop policy if exists "Le capitaine peut modifier ses joueurs" on profils;
drop policy if exists "Le capitaine peut retirer un joueur" on profils;

create policy "Un utilisateur peut voir ses coéquipiers"
  on profils for select using (equipe_id is not null and equipe_id = mon_equipe_id());

create policy "Le capitaine peut modifier ses joueurs"
  on profils for update using (equipe_id = mon_equipe_id() and je_suis_capitaine());

create policy "Le capitaine peut retirer un joueur"
  on profils for delete using (equipe_id = mon_equipe_id() and je_suis_capitaine());

-- evenements, presences, exercices (seulement si elles existent déjà)
do $$
begin
  if to_regclass('public.evenements') is not null then
    drop policy if exists "Voir les événements de son équipe" on evenements;
    drop policy if exists "Le capitaine peut ajouter un événement" on evenements;
    drop policy if exists "Le capitaine peut modifier un événement" on evenements;

    create policy "Voir les événements de son équipe"
      on evenements for select using (equipe_id = mon_equipe_id());

    create policy "Le capitaine peut ajouter un événement"
      on evenements for insert with check (equipe_id = mon_equipe_id() and je_suis_capitaine());

    create policy "Le capitaine peut modifier un événement"
      on evenements for update using (equipe_id = mon_equipe_id() and je_suis_capitaine());
  end if;

  if to_regclass('public.presences') is not null then
    drop policy if exists "Voir ses propres présences et celles de son équipe" on presences;

    create policy "Voir ses propres présences et celles de son équipe"
      on presences for select using (
        evenement_id in (select id from evenements where equipe_id = mon_equipe_id())
      );
  end if;

  if to_regclass('public.exercices') is not null then
    drop policy if exists "Voir les exercices de son équipe" on exercices;
    drop policy if exists "Le capitaine gère les exercices" on exercices;

    create policy "Voir les exercices de son équipe"
      on exercices for select using (equipe_id = mon_equipe_id());

    create policy "Le capitaine gère les exercices"
      on exercices for all using (equipe_id = mon_equipe_id() and je_suis_capitaine());
  end if;
end $$;
