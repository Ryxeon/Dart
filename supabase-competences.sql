-- À exécuter en plus du script principal, dans le SQL Editor de Supabase

alter table profils add column if not exists competences jsonb default '{}'::jsonb;

-- Historique des passages du questionnaire
create table if not exists questionnaire_historique (
  id uuid primary key default gen_random_uuid(),
  profil_id uuid references profils(id) on delete cascade,
  competences jsonb not null,
  date_passage timestamp default now()
);

alter table questionnaire_historique enable row level security;

create policy "Un utilisateur voit son historique"
  on questionnaire_historique for select using (auth.uid() = profil_id);

create policy "Un utilisateur ajoute à son historique"
  on questionnaire_historique for insert with check (auth.uid() = profil_id);
