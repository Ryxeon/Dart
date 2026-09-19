-- À exécuter dans le SQL Editor de Supabase

create table if not exists exercices (
  id uuid primary key default gen_random_uuid(),
  equipe_id uuid references equipes(id) on delete cascade,
  categorie text not null, -- 'echauffement', 'entrainement', 'etirements'
  sous_categorie text,     -- ex: 'muscu', 'passes'... utile seulement pour 'entrainement'
  nom text not null,
  description text,
  video_url text,
  unite text default 'reps', -- 'reps' ou 'temps'
  valeur_defaut int default 10,
  ordre int default 0,
  created_at timestamp default now()
);

alter table exercices enable row level security;

create policy "Voir les exercices de son équipe"
  on exercices for select using (
    equipe_id = (select equipe_id from profils where id = auth.uid())
  );

create policy "Le capitaine gère les exercices"
  on exercices for all using (
    equipe_id = (select equipe_id from profils where id = auth.uid())
    and (select est_capitaine from profils where id = auth.uid()) = true
  );
