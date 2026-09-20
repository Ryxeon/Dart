import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../components/BottomNav.jsx';
import Radar from '../components/Radar.jsx';
import LineChart from '../components/LineChart.jsx';
import EvenementTab from './EvenementTab.jsx';
import EntrainementTab from './EntrainementTab.jsx';
import ReglesTab from './ReglesTab.jsx';
import EquipeTab from './EquipeTab.jsx';
import { supabase, supabaseReady } from '../lib/supabase.js';
import './Home.css';

export default function Home() {
  const [tab, setTab] = useState(() => localStorage.getItem('dart_dernier_onglet') || 'competences');
  const prenom = localStorage.getItem('dart_prenom') || 'joueur';

  function changerOnglet(nouvelOnglet) {
    setTab(nouvelOnglet);
    localStorage.setItem('dart_dernier_onglet', nouvelOnglet);
  }

  return (
    <div className="home-screen">
      <div className="home-content">
        {tab === 'competences' && <CompetencesTab prenom={prenom} />}
        {tab === 'evenement' && <EvenementTab />}
        {tab === 'entrainement' && <EntrainementTab />}
        {tab === 'regles' && <ReglesTab />}
        {tab === 'equipe' && <EquipeTab />}
      </div>
      <BottomNav active={tab} onChange={changerOnglet} />
    </div>
  );
}

const ACTIONS_MATCH = ['Attaque', 'Service', 'Réception', 'Passe', 'Contre'];

function CompetencesTab({ prenom }) {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [competences, setCompetences] = useState(null);
  const [exercicesMuscu, setExercicesMuscu] = useState([]);
  const [statsMatch, setStatsMatch] = useState([]);
  const [historique, setHistorique] = useState([]);
  const [showHistorique, setShowHistorique] = useState(false);
  const [showAjoutStat, setShowAjoutStat] = useState(false);

  useEffect(() => {
    async function charger() {
      if (!supabaseReady) {
        const local = localStorage.getItem('dart_competences');
        if (local) setCompetences(JSON.parse(local));
        return;
      }
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profil } = await supabase.from('profils').select('competences, equipe_id').eq('id', user.id).single();
      if (profil?.competences && Object.keys(profil.competences).length > 0) setCompetences(profil.competences);

      if (profil?.equipe_id) {
        const { data: exos } = await supabase.from('exercices').select('*').eq('equipe_id', profil.equipe_id).eq('categorie', 'entrainement');
        setExercicesMuscu(exos || []);
      }

      const { data: stats } = await supabase.from('stats_match').select('*').eq('profil_id', user.id).order('date_passage', { ascending: true });
      setStatsMatch(stats || []);

      const { data: hist } = await supabase.from('questionnaire_historique').select('*').eq('profil_id', user.id).order('date_passage', { ascending: false });
      setHistorique(hist || []);
    }
    charger();
  }, []);

  async function ajouterResultatMuscu(exerciceId, valeur) {
    const { data: { user } } = await supabase.auth.getUser();
    await supabase.from('exercice_resultats').insert({ profil_id: user.id, exercice_id: exerciceId, valeur });
  }

  async function ajouterStat(action, pourcentage) {
    const { data: { user } } = await supabase.auth.getUser();
    await supabase.from('stats_match').insert({ profil_id: user.id, action, pourcentage });
    const { data: stats } = await supabase.from('stats_match').select('*').eq('profil_id', user.id).order('date_passage', { ascending: true });
    setStatsMatch(stats || []);
    setShowAjoutStat(false);
  }

  return (
    <div className="tab-page">
      <p className="greeting-small">Bonjour</p>
      <h1 className="greeting-name">{prenom}</h1>

      <div className="page-dots">
        {[0, 1, 2, 3, 4].map((i) => (
          <button
            key={i}
            className={`page-dot ${page === i ? 'page-dot--active' : ''}`}
            onClick={() => setPage(i)}
            aria-label={`Page ${i + 1}`}
          />
        ))}
      </div>

      {page === 0 && (
        competences ? (
          <div className="radar-wrap">
            <Radar competences={competences} />
            <button className="radar-btn" onClick={() => navigate('/questionnaire')}>Refaire le questionnaire</button>
          </div>
        ) : (
          <div className="radar-placeholder">
            <p>Ton radar de compétences apparaîtra ici une fois le questionnaire rempli.</p>
            <button className="radar-btn" onClick={() => navigate('/questionnaire')}>Faire le questionnaire</button>
          </div>
        )
      )}

      {page === 1 && (
        <div>
          <p className="section-label">Musculation</p>
          <div className="exercices-grid">
            {exercicesMuscu.map((ex) => (
              <MuscuCard key={ex.id} exercice={ex} onEnregistrer={ajouterResultatMuscu} />
            ))}
            {exercicesMuscu.length === 0 && <p className="placeholder-text">Aucun exercice de musculation pour l'instant.</p>}
          </div>
        </div>
      )}

      {page === 2 && (
        <div>
          <div className="evenement-header">
            <p className="section-label" style={{ margin: 0 }}>Stats de match</p>
            <button className="add-event-btn" onClick={() => setShowAjoutStat(true)} aria-label="Ajouter un résultat">+</button>
          </div>
          {ACTIONS_MATCH.map((action) => {
            const points = statsMatch.filter((s) => s.action === action).map((s) => s.pourcentage);
            return (
              <div key={action} style={{ marginBottom: 20 }}>
                <p className="regle-sous-titre">{action}</p>
                <LineChart points={points} />
              </div>
            );
          })}
          {showAjoutStat && (
            <AjoutStat onFermer={() => setShowAjoutStat(false)} onAjouter={ajouterStat} />
          )}
        </div>
      )}

      {page === 3 && (
        <div className="radar-placeholder">
          <p>🎬</p>
          <p>Les vidéos arrivent bientôt !</p>
        </div>
      )}

      {page === 4 && (
        <div>
          <p className="section-label">Questionnaire</p>
          <button className="form-btn form-btn--accent" style={{ marginBottom: 12 }} onClick={() => navigate('/questionnaire')}>
            Refaire le questionnaire
          </button>
          <button className="form-btn form-btn--outline" onClick={() => setShowHistorique(true)}>
            Voir l'historique
          </button>

          {showHistorique && (
            <div className="popup-overlay" role="dialog" aria-modal="true">
              <div className="popup" style={{ textAlign: 'left', maxWidth: 340 }}>
                <p className="popup-title" style={{ textAlign: 'center' }}>Historique</p>
                <div style={{ maxHeight: 300, overflowY: 'auto' }}>
                  {historique.map((h) => (
                    <div key={h.id} className="jour-evenement-item">
                      <p className="jour-evenement-titre">{new Date(h.date_passage).toLocaleDateString('fr-FR')}</p>
                      <p className="jour-evenement-detail">
                        {Object.entries(h.competences).map(([k, v]) => `${k}: ${v}`).join(' · ')}
                      </p>
                    </div>
                  ))}
                  {historique.length === 0 && <p className="placeholder-text">Aucun historique pour l'instant.</p>}
                </div>
                <button className="popup-btn popup-btn--primary" style={{ width: '100%', marginTop: 12 }} onClick={() => setShowHistorique(false)}>
                  Fermer
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function MuscuCard({ exercice, onEnregistrer }) {
  const [valeur, setValeur] = useState(exercice.valeur_defaut);
  const [enregistre, setEnregistre] = useState(false);

  return (
    <div className="exercice-card">
      <span className="exercice-nom">{exercice.nom}</span>
      <input
        type="number"
        className="field-input"
        style={{ marginTop: 6, marginBottom: 6 }}
        value={valeur}
        onChange={(e) => setValeur(e.target.value)}
      />
      <button
        className="popup-btn popup-btn--primary"
        style={{ fontSize: 12, padding: 8 }}
        onClick={() => { onEnregistrer(exercice.id, Number(valeur)); setEnregistre(true); }}
      >
        {enregistre ? 'Enregistré ✓' : 'Enregistrer'}
      </button>
    </div>
  );
}

function AjoutStat({ onFermer, onAjouter }) {
  const [action, setAction] = useState(ACTIONS_MATCH[0]);
  const [pourcentage, setPourcentage] = useState(70);

  return (
    <div className="popup-overlay" role="dialog" aria-modal="true">
      <div className="popup" style={{ textAlign: 'left' }}>
        <p className="popup-title" style={{ textAlign: 'center' }}>Nouveau résultat</p>
        <div className="field">
          <label className="field-label">Action</label>
          <select className="field-input" value={action} onChange={(e) => setAction(e.target.value)}>
            {ACTIONS_MATCH.map((a) => <option key={a} value={a}>{a}</option>)}
          </select>
        </div>
        <div className="field">
          <label className="field-label">Pourcentage de réussite</label>
          <input type="number" className="field-input" value={pourcentage} onChange={(e) => setPourcentage(e.target.value)} />
        </div>
        <div className="popup-actions">
          <button className="popup-btn popup-btn--secondary" onClick={onFermer}>Annuler</button>
          <button className="popup-btn popup-btn--primary" onClick={() => onAjouter(action, Number(pourcentage))}>Ajouter</button>
        </div>
      </div>
    </div>
  );
}
