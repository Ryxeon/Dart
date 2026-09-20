import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase, supabaseReady } from '../lib/supabase.js';
import LecteurRoutine from '../components/LecteurRoutine.jsx';
import './ExerciceListe.css';

const TITRES = {
  echauffement: 'Échauffement',
  entrainement: 'Entraînement',
  etirements: 'Étirements',
};

const CATEGORIES_AVEC_ROUTINE = ['echauffement', 'etirements'];

export default function ExerciceListe() {
  const { categorie } = useParams();
  const navigate = useNavigate();
  const [exercices, setExercices] = useState([]);
  const [estCapitaine, setEstCapitaine] = useState(false);
  const [equipeId, setEquipeId] = useState(null);
  const [showAjout, setShowAjout] = useState(false);
  const [exerciceOuvert, setExerciceOuvert] = useState(null);
  const [routineLancee, setRoutineLancee] = useState(false);
  const [routines, setRoutines] = useState([]);
  const [showCreationRoutine, setShowCreationRoutine] = useState(false);
  const [routineEnLecture, setRoutineEnLecture] = useState(null);

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

    if (categorie === 'entrainement') {
      const { data: r } = await supabase.from('routines').select('*').eq('equipe_id', profil.equipe_id);
      setRoutines(r || []);
    }
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

      {CATEGORIES_AVEC_ROUTINE.includes(categorie) && exercices.length > 0 && (
        <button
          className="form-btn form-btn--accent"
          style={{ marginBottom: 20 }}
          onClick={() => setRoutineLancee(true)}
        >
          ▶ Lancer la routine
        </button>
      )}

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

      {categorie === 'entrainement' && (
        <>
          <div className="evenement-header" style={{ marginTop: 24 }}>
            <p className="section-label" style={{ margin: 0 }}>Bibliothèque de routines</p>
            {estCapitaine && exercices.length > 0 && (
              <button className="add-event-btn" onClick={() => setShowCreationRoutine(true)} aria-label="Créer une routine">+</button>
            )}
          </div>
          <div className="joueurs-list">
            {routines.map((r) => (
              <div key={r.id} className="joueur-row" style={{ cursor: 'default' }}>
                <span className="joueur-nom">{r.nom}</span>
                <button
                  className="regle-card"
                  style={{ padding: '6px 14px', minHeight: 'auto' }}
                  onClick={() => setRoutineEnLecture(r)}
                >
                  ▶ Lancer
                </button>
              </div>
            ))}
            {routines.length === 0 && <p className="placeholder-text">Aucune routine créée pour l'instant.</p>}
          </div>
        </>
      )}

      {routineLancee && (
        <LecteurRoutine exercices={exercices} onTerminer={() => setRoutineLancee(false)} />
      )}

      {routineEnLecture && (
        <LecteurRoutine
          exercices={routineEnLecture.contenu.map((c) => exercices.find((e) => e.id === c.exercice_id)).filter(Boolean)}
          onTerminer={() => setRoutineEnLecture(null)}
        />
      )}

      {exerciceOuvert && (
        <DetailExercice exercice={exerciceOuvert} onFermer={() => setExerciceOuvert(null)} />
      )}

      {showCreationRoutine && (
        <CreationRoutine
          exercices={exercices}
          equipeId={equipeId}
          onFermer={() => setShowCreationRoutine(false)}
          onCree={() => { setShowCreationRoutine(false); charger(); }}
        />
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

function CreationRoutine({ exercices, equipeId, onFermer, onCree }) {
  const [nom, setNom] = useState('');
  const [selection, setSelection] = useState([]);
  const [erreur, setErreur] = useState('');

  function toggle(id) {
    setSelection((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  }

  async function handleCreer() {
    if (!nom.trim() || selection.length === 0) {
      setErreur("Donne un nom et sélectionne au moins un exercice");
      return;
    }
    const contenu = selection.map((exercice_id, i) => ({ exercice_id, ordre: i }));
    const { error } = await supabase.from('routines').insert({ equipe_id: equipeId, nom, contenu });
    if (error) {
      setErreur('Erreur : ' + error.message);
      return;
    }
    onCree();
  }

  return (
    <div className="popup-overlay" role="dialog" aria-modal="true">
      <div className="popup" style={{ textAlign: 'left', maxWidth: 360 }}>
        <p className="popup-title" style={{ textAlign: 'center' }}>Nouvelle routine</p>

        <div className="field">
          <label className="field-label">Nom de la routine</label>
          <input className="field-input" value={nom} onChange={(e) => setNom(e.target.value)} />
        </div>

        <p className="field-label" style={{ marginBottom: 8 }}>Exercices (dans l'ordre de sélection)</p>
        <div style={{ maxHeight: 220, overflowY: 'auto', marginBottom: 16 }}>
          {exercices.map((ex) => (
            <label key={ex.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0', fontSize: 14 }}>
              <input type="checkbox" checked={selection.includes(ex.id)} onChange={() => toggle(ex.id)} />
              {ex.nom} {selection.includes(ex.id) && `(#${selection.indexOf(ex.id) + 1})`}
            </label>
          ))}
        </div>

        {erreur && <p className="field-error">{erreur}</p>}

        <div className="popup-actions">
          <button className="popup-btn popup-btn--secondary" onClick={onFermer}>Annuler</button>
          <button className="popup-btn popup-btn--primary" onClick={handleCreer}>Créer la routine</button>
        </div>
      </div>
    </div>
  );
}
