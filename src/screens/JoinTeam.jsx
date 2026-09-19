import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormScreen, Field, Button } from '../components/FormScreen.jsx';
import { supabase, supabaseReady } from '../lib/supabase.js';

export default function JoinTeam() {
  const navigate = useNavigate();
  const [code, setCode] = useState('');
  const [erreur, setErreur] = useState('');
  const [chargement, setChargement] = useState(false);

  async function handleRejoindre() {
    if (!code.trim()) {
      setErreur("Entre le code de l'équipe");
      return;
    }
    setErreur('');
    setChargement(true);

    if (supabaseReady) {
      const { data: equipe, error } = await supabase
        .from('equipes')
        .select('id, nom')
        .eq('code', code.trim().toUpperCase())
        .single();

      if (error || !equipe) {
        setErreur('Aucune équipe ne correspond à ce code');
        setChargement(false);
        return;
      }

      const { data: { user } } = await supabase.auth.getUser();

      const { data: profilExistant } = await supabase
        .from('profils')
        .select('id')
        .eq('id', user.id)
        .maybeSingle();

      if (!profilExistant) {
        const prenomSecours = localStorage.getItem('dart_prenom') || 'Joueur';
        await supabase.from('profils').insert({ id: user.id, prenom: prenomSecours });
      }

      await supabase.from('profils').update({ equipe_id: equipe.id }).eq('id', user.id);
      localStorage.setItem('dart_equipe_code', code.trim().toUpperCase());
    } else {
      localStorage.setItem('dart_equipe_code', code.trim().toUpperCase());
    }

    setChargement(false);
    navigate('/accueil');
  }

  return (
    <FormScreen accent="beige" title="Rejoindre une équipe" subtitle="Demande le code à un membre de ton équipe">
      <button className="form-back" onClick={() => navigate('/equipe-choix')} aria-label="Retour">←</button>

      <Field
        label="Code d'équipe"
        placeholder="Ex : K7B3QX"
        value={code}
        onChange={(v) => setCode(v.toUpperCase())}
        required
        error={erreur}
      />

      <Button variant="accent" onClick={handleRejoindre}>
        {chargement ? 'Vérification...' : 'Rejoindre'}
      </Button>
    </FormScreen>
  );
}
