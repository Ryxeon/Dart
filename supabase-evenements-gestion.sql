-- À exécuter dans le SQL Editor de Supabase

alter table profils add column if not exists numero int;

create table if not exists evenements (
  id uuid primary key default gen_random_uuid(),
  equipe_id uuid references equipes(id) on delete cascade,
  titre text not null,
  type text not null default 'Entraînement classique',
  date_debut timestamp not null,
  lieu text,
  description text,
  created_at timestamp default now()
);

create table if not exists presences (
  id uuid primary key default gen_random_uuid(),
  evenement_id uuid references evenements(id) on delete cascade,
  profil_id uuid references profils(id) on delete cascade,
  present boolean,
  unique (evenement_id, profil_id)
);

alter table evenements enable row level security;
alter table presences enable row level security;

create policy "Voir les événements de son équipe"
  on evenements for select using (
    equipe_id = (select equipe_id from profils where id = auth.uid())
  );

create policy "Le capitaine peut ajouter un événement"
  on evenements for insert with check (
    equipe_id = (select equipe_id from profils where id = auth.uid())
    and (select est_capitaine from profils where id = auth.uid()) = true
  );

create policy "Le capitaine peut modifier un événement"
  on evenements for update using (
    equipe_id = (select equipe_id from profils where id = auth.uid())
    and (select est_capitaine from profils where id = auth.uid()) = true
  );

create policy "Voir ses propres présences et celles de son équipe"
  on presences for select using (
    evenement_id in (
      select id from evenements where equipe_id = (select equipe_id from profils where id = auth.uid())
    )
  );

create policy "Renseigner sa propre présence"
  on presences for insert with check (auth.uid() = profil_id);

create policy "Modifier sa propre présence"
  on presences for update using (auth.uid() = profil_id);

-- Le capitaine doit pouvoir modifier numéro/poste des joueurs de son équipe
create policy "Le capitaine peut modifier ses joueurs"
  on profils for update using (
    equipe_id = (select equipe_id from profils where id = auth.uid())
    and (select est_capitaine from profils where id = auth.uid()) = true
  );

create policy "Le capitaine peut retirer un joueur"
  on profils for delete using (
    equipe_id = (select equipe_id from profils where id = auth.uid())
    and (select est_capitaine from profils where id = auth.uid()) = true
  );
