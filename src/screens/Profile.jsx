import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormScreen, Field, SelectField, Button } from '../components/FormScreen.jsx';
import { supabase, supabaseReady } from '../lib/supabase.js';
import './Profile.css';

const POSTES = [
  'Je sais pas encore',
  'Passeur',
  'Central',
  'Réceptionneur-attaquant',
  'Pointu',
  'Libéro',
];

const GENRES = ['Homme', 'Femme', 'Autre', 'Préfère ne pas dire'];

export default function Profile() {
  const navigate = useNavigate();
  const [prenom, setPrenom] = useState('');
  const [nom, setNom] = useState('');
  const [genre, setGenre] = useState(GENRES[0]);
  const [age, setAge] = useState('');
  const [taille, setTaille] = useState('');
  const [brasTendu, setBrasTendu] = useState('');
  const [autreClub, setAutreClub] = useState(null);
  const [poste, setPoste] = useState(POSTES[0]);
  const [estCapitaine, setEstCapitaine] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [erreurPrenom, setErreurPrenom] = useState('');

  function toggleCapitaine() {
    if (!estCapitaine) {
      setShowPopup(true);
    } else {
      setEstCapitaine(false);
    }
  }

  async function handleValider() {
    if (!prenom.trim()) {
      setErreurPrenom('Le prénom est obligatoire');
      return;
    }
    setErreurPrenom('');
    localStorage.setItem('dart_prenom', prenom);
    localStorage.setItem('dart_capitaine', estCapitaine ? 'oui' : 'non');

    if (supabaseReady) {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from('profils').upsert({
          id: user.id,
          prenom,
          nom: nom || null,
          genre,
          age: age ? parseInt(age, 10) : null,
          taille: taille ? parseInt(taille, 10) : null,
          bras_tendu: brasTendu ? parseInt(brasTendu, 10) : null,
          poste,
          est_capitaine: estCapitaine,
        });
      }
    }

    navigate('/equipe-choix');
  }

  return (
    <FormScreen
      title="Avant de commencer"
      subtitle="Seul le prénom est obligatoire"
      accent="beige"
    >
      <div className="photo-zone">
        <button className="photo-circle" aria-label="Ajouter une photo de profil">
          Ajouter<br />photo
        </button>
      </div>

      <Field label="Prénom" placeholder="Ton prénom" value={prenom} onChange={setPrenom} required error={erreurPrenom} />
      <Field label="Nom" placeholder="Ton nom" value={nom} onChange={setNom} />
      <SelectField label="Genre" options={GENRES} value={genre} onChange={setGenre} />
      <Field label="Âge" type="number" placeholder="Ton âge" value={age} onChange={setAge} />

      <div className="form-divider">
        <p className="form-section-title">Infos volley</p>
      </div>

      <Field label="Taille (cm)" type="number" placeholder="Ex : 178" value={taille} onChange={setTaille} />
      <Field label="Taille bras tendu (cm)" type="number" placeholder="Ex : 230" value={brasTendu} onChange={setBrasTendu} />

      <div className="field">
        <span className="field-label">Tu joues dans un autre club ?</span>
        <div className="choice-row">
          <button
            className={`choice-btn ${autreClub === true ? 'choice-btn--active' : ''}`}
            onClick={() => setAutreClub(true)}
            aria-pressed={autreClub === true}
          >
            Oui
          </button>
          <button
            className={`choice-btn ${autreClub === false ? 'choice-btn--active' : ''}`}
            onClick={() => setAutreClub(false)}
            aria-pressed={autreClub === false}
          >
            Non
          </button>
        </div>
      </div>

      <SelectField label="Poste souhaité" options={POSTES} value={poste} onChange={setPoste} />

      <div className="form-divider capitaine-row">
        <span className="field-label">Je suis capitaine</span>
        <button
          className={`toggle ${estCapitaine ? 'toggle--on' : ''}`}
          onClick={toggleCapitaine}
          role="switch"
          aria-checked={estCapitaine}
          aria-label="Je suis capitaine"
        >
          <span className="toggle-ball">
            <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
              <circle cx="12" cy="12" r="10" fill="none" stroke="#E07B1A" strokeWidth="2" />
              <path d="M12 2 Q17 12 12 22" fill="none" stroke="#E07B1A" strokeWidth="1.6" />
              <path d="M12 2 Q7 12 12 22" fill="none" stroke="#E07B1A" strokeWidth="1.6" />
              <path d="M2.5 8 Q12 13 21.5 8" fill="none" stroke="#E07B1A" strokeWidth="1.6" />
            </svg>
          </span>
        </button>
      </div>

      <Button variant="accent" onClick={handleValider}>Valider</Button>

      {showPopup && (
        <div className="popup-overlay" role="dialog" aria-modal="true" aria-labelledby="popup-title">
          <div className="popup">
            <p className="popup-title" id="popup-title">Tu es sûr ?</p>
            <p className="popup-text">As-tu vérifié avec ton équipe que tu es bien capitaine ?</p>
            <div className="popup-actions">
              <button
                className="popup-btn popup-btn--secondary"
                onClick={() => { setShowPopup(false); setEstCapitaine(false); }}
              >
                Non
              </button>
              <button
                className="popup-btn popup-btn--primary"
                onClick={() => { setShowPopup(false); setEstCapitaine(true); }}
              >
                Oui
              </button>
            </div>
          </div>
        </div>
      )}
    </FormScreen>
  );
}
