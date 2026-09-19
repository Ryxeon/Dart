-- À exécuter dans le SQL Editor de Supabase
-- Corrige "violates foreign key constraint equipes_capitaine_id_fkey"

alter table equipes drop constraint if exists equipes_capitaine_id_fkey;
alter table equipes add constraint equipes_capitaine_id_fkey
  foreign key (capitaine_id) references auth.users(id) on delete set null;
