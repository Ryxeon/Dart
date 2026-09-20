import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormScreen, Field, SelectField, Button } from '../components/FormScreen.jsx';
import { supabase, supabaseReady } from '../lib/supabase.js';

const GENRES = ['Homme', 'Femme', 'Autre', 'Préfère ne pas dire'];
const POSTES = ['Je sais pas encore', 'Passeur', 'Central', 'Réceptionneur-attaquant', 'Pointu', 'Libéro'];

export default function EditProfile() {
  const navigate = useNavigate();
  const [prenom, setPrenom] = useState('');
  const [nom, setNom] = useState('');
  const [genre, setGenre] = useState(GENRES[0]);
  const [age, setAge] = useState('');
  const [taille, setTaille] = useState('');
  const [brasTendu, setBrasTendu] = useState('');
  const [poste, setPoste] = useState(POSTES[0]);
  const [chargement, setChargement] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    async function charger() {
      if (!supabaseReady) { setChargement(false); return; }
      const { data: { user } } = await supabase.auth.getUser();
      const { data } = await supabase.from('profils').select('*').eq('id', user.id).single();
      if (data) {
        setPrenom(data.prenom || '');
        setNom(data.nom || '');
        setGenre(data.genre || GENRES[0]);
        setAge(data.age || '');
        setTaille(data.taille || '');
        setBrasTendu(data.bras_tendu || '');
        setPoste(data.poste || POSTES[0]);
      }
      setChargement(false);
    }
    charger();
  }, []);

  async function handleValider() {
    if (!prenom.trim()) return;
    if (supabaseReady) {
      const { data: { user } } = await supabase.auth.getUser();
      await supabase.from('profils').update({
        prenom, nom: nom || null, genre, age: age ? Number(age) : null,
        taille: taille ? Number(taille) : null, bras_tendu: brasTendu ? Number(brasTendu) : null, poste,
      }).eq('id', user.id);
    }
    localStorage.setItem('dart_prenom', prenom);
    setMessage('Profil mis à jour !');
    setTimeout(() => navigate(-1), 1000);
  }

  if (chargement) return <div className="tab-page"><p className="placeholder-text">Chargement...</p></div>;

  return (
    <FormScreen title="Modifier mon profil">
      <button className="form-back" onClick={() => navigate(-1)} aria-label="Retour">←</button>

      <Field label="Prénom" value={prenom} onChange={setPrenom} required />
      <Field label="Nom" value={nom} onChange={setNom} />
      <SelectField label="Genre" options={GENRES} value={genre} onChange={setGenre} />
      <Field label="Âge" type="number" value={age} onChange={setAge} />
      <Field label="Taille (cm)" type="number" value={taille} onChange={setTaille} />
      <Field label="Taille bras tendu (cm)" type="number" value={brasTendu} onChange={setBrasTendu} />
      <SelectField label="Poste souhaité" options={POSTES} value={poste} onChange={setPoste} />

      {message && <p className="quest-hint">{message}</p>}

      <Button variant="filled" onClick={handleValider}>Enregistrer</Button>
    </FormScreen>
  );
}
