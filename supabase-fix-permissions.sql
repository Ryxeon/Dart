-- À exécuter dans le SQL Editor de Supabase si tu as l'erreur
-- "permission denied for table equipes" (ou profils)

grant usage on schema public to authenticated, anon;
grant select, insert, update, delete on all tables in schema public to authenticated;
grant select on all tables in schema public to anon;

-- Pour que les futures tables héritent aussi de ces droits automatiquement
alter default privileges in schema public
  grant select, insert, update, delete on tables to authenticated;
