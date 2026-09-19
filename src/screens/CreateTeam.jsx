import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormScreen, Field, Button } from '../components/FormScreen.jsx';
import { supabase, supabaseReady, genererCodeEquipe } from '../lib/supabase.js';

const JOURS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];

export default function CreateTeam() {
  const navigate = useNavigate();
  const [nom, setNom] = useState('');
  const [slogan, setSlogan] = useState('');
  const [jours, setJours] = useState([]);
  const [horaire, setHoraire] = useState('');
  const [erreur, setErreur] = useState('');
  const [chargement, setChargement] = useState(false);

  function toggleJour(jour) {
    setJours((prev) =>
      prev.includes(jour) ? prev.filter((j) => j !== jour) : [...prev, jour]
    );
  }

  async function handleCreer() {
    if (!nom.trim()) {
      setErreur("Le nom de l'équipe est obligatoire");
      return;
    }
    setErreur('');
    setChargement(true);

    const code = genererCodeEquipe();

    if (supabaseReady) {
      const { data: { user } } = await supabase.auth.getUser();
      const { data, error } = await supabase
        .from('equipes')
        .insert({
          nom,
          slogan,
          code,
          jours_entrainement: jours,
          horaire,
          capitaine_id: user?.id,
        })
        .select()
        .single();

      if (error) {
        setErreur("Impossible de créer l'équipe : " + error.message);
        setChargement(false);
        return;
      }

      await supabase.from('profils').update({ equipe_id: data.id }).eq('id', user.id);
      localStorage.setItem('dart_equipe_code', code);
    } else {
      localStorage.setItem('dart_equipe_code', code);
      localStorage.setItem('dart_equipe_nom', nom);
    }

    setChargement(false);
    navigate('/accueil');
  }

  return (
    <FormScreen accent="beige" title="Créer ton équipe" subtitle="Seul le nom est obligatoire">
      <button className="form-back" onClick={() => navigate('/equipe-choix')} aria-label="Retour">←</button>

      <Field label="Nom de l'équipe" placeholder="Ex : Les Dendrobates" value={nom} onChange={setNom} required error={erreur} />
      <Field label="Slogan ou surnom" placeholder="Ex : Petits mais redoutables" value={slogan} onChange={setSlogan} />

      <div className="field">
        <span className="field-label">Jours d'entraînement</span>
        <div className="jours-grid">
          {JOURS.map((jour) => (
            <button
              key={jour}
              className={`jour-btn ${jours.includes(jour) ? 'jour-btn--active' : ''}`}
              onClick={() => toggleJour(jour)}
              aria-pressed={jours.includes(jour)}
            >
              {jour.slice(0, 3)}
            </button>
          ))}
        </div>
      </div>

      <Field label="Horaire" placeholder="Ex : 19h - 21h" value={horaire} onChange={setHoraire} />

      <Button variant="accent" onClick={handleCreer}>
        {chargement ? 'Création...' : "Créer l'équipe"}
      </Button>
    </FormScreen>
  );
}
