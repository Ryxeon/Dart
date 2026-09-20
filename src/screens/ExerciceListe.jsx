import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase, supabaseReady } from '../lib/supabase.js';
import './ExerciceListe.css';

const TITRES = {
  echauffement: 'Échauffement',
  entrainement: 'Entraînement',
  etirements: 'Étirements',
};

export default function ExerciceListe() {
  const { categorie } = useParams();
  const navigate = useNavigate();
  const [exercices, setExercices] = useState([]);
  const [estCapitaine, setEstCapitaine] = useState(false);
  const [equipeId, setEquipeId] = useState(null);
  const [showAjout, setShowAjout] = useState(false);
  const [exerciceOuvert, setExerciceOuvert] = useState(null);

  async function charger() {
    if (!supabaseReady) return;
    const { data: { user } } = await supabase.auth.getUser();
    const { data: profil } = await supabase.from('profils').select('equipe_id, est_capitaine').eq('id', user.id).single();
    if (!profil?.equipe_id) return;
    setEquipeId(profil.equipe_id);
    setEstCapitaine(!!profil.est_capitaine);
    const { data } = await supabase
      .from('exercices')
      .select('*')
      .eq('equipe_id', profil.equipe_id)
      .eq('categorie', categorie)
      .order('ordre', { ascending: true });
    setExercices(data || []);
  }

  useEffect(() => { charger(); }, [categorie]);

  return (
    <div className="tab-page">
      <div className="evenement-header">
        <button className="form-back" onClick={() => navigate(-1)} aria-label="Retour">←</button>
        {estCapitaine && (
          <button className="add-event-btn" onClick={() => setShowAjout(true)} aria-label="Ajouter un exercice">+</button>
        )}
      </div>
      <h1 className="greeting-name" style={{ fontSize: 26 }}>{TITRES[categorie] || categorie}</h1>

      <div className="exercices-grid">
        {exercices.map((ex) => (
          <button key={ex.id} className="exercice-card" onClick={() => setExerciceOuvert(ex)}>
            <span className="exercice-nom">{ex.nom}</span>
            <span className="exercice-valeur">
              {ex.valeur_defaut} {ex.unite === 'temps' ? 'sec' : 'reps'}
            </span>
          </button>
        ))}
        {exercices.length === 0 && <p className="placeholder-text">Aucun exercice pour l'instant.</p>}
      </div>

      {exerciceOuvert && (
        <DetailExercice exercice={exerciceOuvert} onFermer={() => setExerciceOuvert(null)} />
      )}

      {showAjout && (
        <AjoutExercice
          categorie={categorie}
          equipeId={equipeId}
          onFermer={() => setShowAjout(false)}
          onAjoute={() => { setShowAjout(false); charger(); }}
        />
      )}
    </div>
  );
}

function DetailExercice({ exercice, onFermer }) {
  const [valeur, setValeur] = useState(exercice.valeur_defaut);

  return (
    <div className="popup-overlay" role="dialog" aria-modal="true">
      <div className="popup" style={{ textAlign: 'left' }}>
        <p className="popup-title" style={{ textAlign: 'center' }}>{exercice.nom}</p>
        {exercice.description && <p className="popup-text">{exercice.description}</p>}

        {exercice.video_url && (
          <a href={exercice.video_url} target="_blank" rel="noreferrer" className="exercice-video-link">
            Voir la vidéo YouTube
          </a>
        )}

        <div className="field" style={{ marginTop: 16 }}>
          <label className="field-label">
            {exercice.unite === 'temps' ? 'Temps réalisé (secondes)' : 'Reps réalisées'}
          </label>
          <input
            type="number"
            className="field-input"
            value={valeur}
            onChange={(e) => setValeur(e.target.value)}
          />
        </div>

        <button className="popup-btn popup-btn--primary" style={{ width: '100%' }} onClick={onFermer}>
          Fermer
        </button>
      </div>
    </div>
  );
}

function AjoutExercice({ categorie, equipeId, onFermer, onAjoute }) {
  const [nom, setNom] = useState('');
  const [description, setDescription] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [unite, setUnite] = useState('reps');
  const [valeurDefaut, setValeurDefaut] = useState(10);
  const [erreur, setErreur] = useState('');

  async function handleAjouter() {
    if (!nom.trim()) {
      setErreur("Le nom de l'exercice est obligatoire");
      return;
    }
    const { error } = await supabase.from('exercices').insert({
      equipe_id: equipeId,
      categorie,
      nom,
      description,
      video_url: videoUrl,
      unite,
      valeur_defaut: Number(valeurDefaut) || 0,
    });
    if (error) {
      setErreur('Erreur : ' + error.message);
      return;
    }
    onAjoute();
  }

  return (
    <div className="popup-overlay" role="dialog" aria-modal="true">
      <div className="popup" style={{ textAlign: 'left', maxWidth: 360 }}>
        <p className="popup-title" style={{ textAlign: 'center' }}>Nouvel exercice</p>

        <div className="field">
          <label className="field-label">Nom</label>
          <input className="field-input" value={nom} onChange={(e) => setNom(e.target.value)} />
        </div>
        <div className="field">
          <label className="field-label">Description</label>
          <input className="field-input" value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
        <div className="field">
          <label className="field-label">Lien vidéo YouTube</label>
          <input className="field-input" value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} />
        </div>
        <div className="field">
          <label className="field-label">Unité</label>
          <select className="field-input" value={unite} onChange={(e) => setUnite(e.target.value)}>
            <option value="reps">Répétitions</option>
            <option value="temps">Temps (secondes)</option>
          </select>
        </div>
        <div className="field">
          <label className="field-label">Valeur par défaut</label>
          <input type="number" className="field-input" value={valeurDefaut} onChange={(e) => setValeurDefaut(e.target.value)} />
        </div>

        {erreur && <p className="field-error">{erreur}</p>}

        <div className="popup-actions">
          <button className="popup-btn popup-btn--secondary" onClick={onFermer}>Annuler</button>
          <button className="popup-btn popup-btn--primary" onClick={handleAjouter}>Ajouter</button>
        </div>
      </div>
    </div>
  );
}
