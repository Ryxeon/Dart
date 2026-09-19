import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase, supabaseReady } from '../lib/supabase.js';
import {
  niveauDetente, niveauSautBloc, niveauRapidite,
  niveauEndurance, niveauTechniqueDepuisMoyenne, moyenneArrondie,
} from '../lib/scoring.js';
import './Questionnaire.css';

const ETAPES = ['force', 'detente', 'endurance', 'rapidite', 'technique', 'intelligence', 'fin'];

export default function Questionnaire() {
  const navigate = useNavigate();
  const [etape, setEtape] = useState(0);
  const [genre, setGenre] = useState('Homme');

  // Réponses brutes
  const [forceFrappe, setForceFrappe] = useState(3);
  const [forceService, setForceService] = useState(3);

  const [tailleBras, setTailleBras] = useState('');
  const [hauteurTouchee, setHauteurTouchee] = useState('');
  const [hauteurBloc, setHauteurBloc] = useState('');

  const [palierEndurance, setPalierEndurance] = useState('');

  const [tempsSprint, setTempsSprint] = useState('');

  const [receptionPts, setReceptionPts] = useState('');
  const [passePts, setPassePts] = useState('');
  const [attaquePts, setAttaquePts] = useState('');
  const [servicePts, setServicePts] = useState('');
  const [contrePts, setContrePts] = useState('');

  const [intelAnticipation, setIntelAnticipation] = useState(3);
  const [intelDecision, setIntelDecision] = useState(3);

  async function terminer() {
    const detenteBase = tailleBras && hauteurTouchee
      ? niveauDetente(Number(hauteurTouchee) - Number(tailleBras), genre)
      : null;
    const sautBloc = tailleBras && hauteurBloc
      ? niveauSautBloc(Number(hauteurBloc) - Number(tailleBras), genre)
      : null;
    const detente = moyenneArrondie(detenteBase, sautBloc) ?? 1;

    const endurance = palierEndurance ? niveauEndurance(Number(palierEndurance)) : 1;
    const rapidite = tempsSprint ? niveauRapidite(Number(tempsSprint), genre) : 1;

    const moyTechnique = moyenneArrondie(
      Number(receptionPts) || 0,
      Number(passePts) || 0,
      Number(attaquePts) || 0,
      Number(servicePts) || 0,
      Number(contrePts) || 0,
    ) ?? 0;
    const technique = niveauTechniqueDepuisMoyenne(moyTechnique / 1); // moyenne déjà sur 0-3

    const force = Math.round((Number(forceFrappe) + Number(forceService)) / 2);
    const intelligence = Math.round((Number(intelAnticipation) + Number(intelDecision)) / 2);

    const competences = { force, detente, endurance, intelligence, technique, rapidite };

    if (supabaseReady) {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from('profils').update({ competences }).eq('id', user.id);
        await supabase.from('questionnaire_historique').insert({ profil_id: user.id, competences });
      }
    }
    localStorage.setItem('dart_competences', JSON.stringify(competences));
    navigate('/accueil');
  }

  const nom = ETAPES[etape];

  return (
    <div className="quest-screen">
      <button className="form-back" onClick={() => navigate('/accueil')} aria-label="Fermer">←</button>
      <div className="quest-progress">
        <div className="quest-progress-bar" style={{ width: `${((etape + 1) / ETAPES.length) * 100}%` }} />
      </div>

      {nom === 'force' && (
        <Etape titre="Force">
          <Slider label="Force de frappe (attaque)" value={forceFrappe} onChange={setForceFrappe} />
          <Slider label="Force de service" value={forceService} onChange={setForceService} />
          <p className="quest-hint">Conseil : demande l'avis de tes coéquipiers ou de ton capitaine pour rester objectif !</p>
        </Etape>
      )}

      {nom === 'detente' && (
        <Etape titre="Détente">
          <div className="quest-field">
            <label>Ton genre</label>
            <select value={genre} onChange={(e) => setGenre(e.target.value)}>
              <option>Homme</option>
              <option>Femme</option>
              <option>Autre</option>
            </select>
          </div>
          <NumField label="Taille bras tendu (cm)" value={tailleBras} onChange={setTailleBras} />
          <NumField label="Hauteur touchée en sautant (cm)" value={hauteurTouchee} onChange={setHauteurTouchee} />
          <NumField label="Hauteur touchée au bloc (cm)" value={hauteurBloc} onChange={setHauteurBloc} />
        </Etape>
      )}

      {nom === 'endurance' && (
        <Etape titre="Endurance">
          <p className="quest-hint">Fais le test navette (façon Luc Léger, 20m). Note le dernier palier que tu as validé entièrement.</p>
          <NumField label="Dernier palier validé" value={palierEndurance} onChange={setPalierEndurance} />
        </Etape>
      )}

      {nom === 'rapidite' && (
        <Etape titre="Rapidité">
          <p className="quest-hint">Chronomètre un sprint de 30 mètres, départ arrêté.</p>
          <NumField label="Temps (en secondes)" value={tempsSprint} onChange={setTempsSprint} step="0.01" />
        </Etape>
      )}

      {nom === 'technique' && (
        <Etape titre="Technique">
          <p className="quest-hint">Pour chaque action, indique le nombre moyen de points sur 10 tentatives (Raté=0, Correct=1, Réussi=2, Parfait=3), moyenne entre 0 et 3.</p>
          <NumField label="Réception (moyenne /3)" value={receptionPts} onChange={setReceptionPts} step="0.1" />
          <NumField label="Passe (moyenne /3)" value={passePts} onChange={setPassePts} step="0.1" />
          <NumField label="Attaque (moyenne /3)" value={attaquePts} onChange={setAttaquePts} step="0.1" />
          <NumField label="Service (moyenne /3)" value={servicePts} onChange={setServicePts} step="0.1" />
          <NumField label="Contre (moyenne /3)" value={contrePts} onChange={setContrePts} step="0.1" />
        </Etape>
      )}

      {nom === 'intelligence' && (
        <Etape titre="Intelligence">
          <Slider label="Anticipation du jeu adverse" value={intelAnticipation} onChange={setIntelAnticipation} />
          <Slider label="Prise de décision rapide" value={intelDecision} onChange={setIntelDecision} />
          <p className="quest-hint">Le quiz vidéo arrive bientôt — pour l'instant, seule l'auto-évaluation compte.</p>
        </Etape>
      )}

      {nom === 'fin' && (
        <Etape titre="C'est fini !">
          <p className="quest-hint">Tes résultats vont être enregistrés et ton radar de compétences va se mettre à jour.</p>
        </Etape>
      )}

      <div className="quest-nav">
        {etape > 0 && <button className="quest-btn quest-btn--secondary" onClick={() => setEtape(etape - 1)}>Précédent</button>}
        {etape < ETAPES.length - 1 && <button className="quest-btn quest-btn--primary" onClick={() => setEtape(etape + 1)}>Suivant</button>}
        {etape === ETAPES.length - 1 && <button className="quest-btn quest-btn--primary" onClick={terminer}>Valider</button>}
      </div>
    </div>
  );
}

function Etape({ titre, children }) {
  return (
    <div className="quest-etape">
      <h1 className="quest-titre">{titre}</h1>
      {children}
    </div>
  );
}

function Slider({ label, value, onChange }) {
  return (
    <div className="quest-field">
      <label>{label} — {value}/5</label>
      <input type="range" min="1" max="5" value={value} onChange={(e) => onChange(Number(e.target.value))} />
    </div>
  );
}

function NumField({ label, value, onChange, step = '1' }) {
  return (
    <div className="quest-field">
      <label>{label}</label>
      <input type="number" step={step} value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}
