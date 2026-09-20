import { useEffect, useState } from 'react';
import { supabase, supabaseReady } from '../lib/supabase.js';
import './EvenementTab.css';

const JOURS_SEMAINE = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
const MOIS = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
const TYPES = ['Entraînement classique', 'Entraînement ciblé', 'Compétition', 'Compétition internationale à regarder'];

export default function EvenementTab() {
  const [date, setDate] = useState(new Date());
  const [evenements, setEvenements] = useState([]);
  const [equipeId, setEquipeId] = useState(null);
  const [estCapitaine, setEstCapitaine] = useState(false);
  const [showAjout, setShowAjout] = useState(false);
  const aujourdHui = new Date();

  async function charger() {
    if (!supabaseReady) return;
    const { data: { user } } = await supabase.auth.getUser();
    const { data: profil } = await supabase.from('profils').select('equipe_id, est_capitaine').eq('id', user.id).single();
    if (!profil?.equipe_id) return;
    setEquipeId(profil.equipe_id);
    setEstCapitaine(!!profil.est_capitaine);
    const { data } = await supabase
      .from('evenements')
      .select('*')
      .eq('equipe_id', profil.equipe_id)
      .order('date_debut', { ascending: true });
    setEvenements(data || []);
  }

  useEffect(() => { charger(); }, []);

  const annee = date.getFullYear();
  const mois = date.getMonth();
  const premierJour = new Date(annee, mois, 1);
  const nbJours = new Date(annee, mois + 1, 0).getDate();
  const decalage = (premierJour.getDay() + 6) % 7;

  const jours = [];
  for (let i = 0; i < decalage; i++) jours.push(null);
  for (let j = 1; j <= nbJours; j++) jours.push(j);

  function changerMois(delta) {
    setDate(new Date(annee, mois + delta, 1));
  }

  function aUnEvenement(j) {
    if (!j) return false;
    return evenements.some((e) => {
      const d = new Date(e.date_debut);
      return d.getDate() === j && d.getMonth() === mois && d.getFullYear() === annee;
    });
  }

  const [jourOuvert, setJourOuvert] = useState(null);

  function evenementsDuJour(j) {
    if (!j) return [];
    return evenements.filter((e) => {
      const d = new Date(e.date_debut);
      return d.getDate() === j && d.getMonth() === mois && d.getFullYear() === annee;
    });
  }

  const prochain = evenements
    .filter((e) => new Date(e.date_debut) >= aujourdHui)
    .sort((a, b) => new Date(a.date_debut) - new Date(b.date_debut))[0];

  return (
    <div className="tab-page">
      <div className="evenement-header">
        <h1 className="greeting-name" style={{ fontSize: 26, marginBottom: 0 }}>Événement</h1>
        {estCapitaine && (
          <button className="add-event-btn" onClick={() => setShowAjout(true)} aria-label="Ajouter un événement">+</button>
        )}
      </div>

      <div className="next-event-card">
        <p className="next-event-label">Prochain événement</p>
        <p className="next-event-title">
          {prochain ? `${prochain.titre} — ${new Date(prochain.date_debut).toLocaleDateString('fr-FR')}` : 'Aucun événement programmé'}
        </p>
      </div>

      <div className="calendar-header">
        <button onClick={() => changerMois(-1)} aria-label="Mois précédent">‹</button>
        <span>{MOIS[mois]} {annee}</span>
        <button onClick={() => changerMois(1)} aria-label="Mois suivant">›</button>
      </div>

      <div className="calendar-grid calendar-grid--labels">
        {JOURS_SEMAINE.map((j, i) => <span key={i}>{j}</span>)}
      </div>

      <div className="calendar-grid">
        {jours.map((j, i) => {
          const estAujourdhui = j === aujourdHui.getDate() && mois === aujourdHui.getMonth() && annee === aujourdHui.getFullYear();
          if (!j) return <span key={i} className="calendar-day calendar-day--empty" />;
          return (
            <button
              key={i}
              className={`calendar-day calendar-day--btn ${estAujourdhui ? 'calendar-day--today' : ''} ${aUnEvenement(j) ? 'calendar-day--event' : ''}`}
              onClick={() => setJourOuvert(j)}
            >
              {j}
            </button>
          );
        })}
      </div>

      {jourOuvert && (
        <div className="popup-overlay" role="dialog" aria-modal="true">
          <div className="popup" style={{ textAlign: 'left' }}>
            <p className="popup-title" style={{ textAlign: 'center' }}>
              {jourOuvert} {MOIS[mois]} {annee}
            </p>
            {evenementsDuJour(jourOuvert).length === 0 && (
              <p className="placeholder-text" style={{ textAlign: 'center' }}>Aucun événement ce jour-là.</p>
            )}
            {evenementsDuJour(jourOuvert).map((e) => (
              <div key={e.id} className="jour-evenement-item">
                <p className="jour-evenement-titre">{e.titre}</p>
                <p className="jour-evenement-type">{e.type}</p>
                {e.lieu && <p className="jour-evenement-detail">📍 {e.lieu}</p>}
                <p className="jour-evenement-detail">
                  {new Date(e.date_debut).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                </p>
                {e.description && <p className="jour-evenement-detail">{e.description}</p>}
              </div>
            ))}
            <button className="popup-btn popup-btn--primary" style={{ width: '100%', marginTop: 12 }} onClick={() => setJourOuvert(null)}>
              Fermer
            </button>
          </div>
        </div>
      )}

      {showAjout && (
        <AjoutEvenement
          equipeId={equipeId}
          onFermer={() => setShowAjout(false)}
          onAjoute={() => { setShowAjout(false); charger(); }}
        />
      )}
    </div>
  );
}

function AjoutEvenement({ equipeId, onFermer, onAjoute }) {
  const [titre, setTitre] = useState('');
  const [type, setType] = useState(TYPES[0]);
  const [date, setDate] = useState('');
  const [lieu, setLieu] = useState('');
  const [description, setDescription] = useState('');
  const [erreur, setErreur] = useState('');

  async function handleAjouter() {
    if (!titre.trim() || !date) {
      setErreur('Le titre et la date sont obligatoires');
      return;
    }
    const { error } = await supabase.from('evenements').insert({
      equipe_id: equipeId,
      titre,
      type,
      date_debut: date,
      lieu,
      description,
    });
    if (error) {
      setErreur("Erreur : " + error.message);
      return;
    }
    onAjoute();
  }

  return (
    <div className="popup-overlay" role="dialog" aria-modal="true">
      <div className="popup" style={{ textAlign: 'left', maxWidth: 360 }}>
        <p className="popup-title" style={{ textAlign: 'center' }}>Nouvel événement</p>

        <div className="field">
          <label className="field-label">Titre</label>
          <input className="field-input" value={titre} onChange={(e) => setTitre(e.target.value)} />
        </div>
        <div className="field">
          <label className="field-label">Type</label>
          <select className="field-input" value={type} onChange={(e) => setType(e.target.value)}>
            {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div className="field">
          <label className="field-label">Date et heure</label>
          <input type="datetime-local" className="field-input" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
        <div className="field">
          <label className="field-label">Lieu</label>
          <input className="field-input" value={lieu} onChange={(e) => setLieu(e.target.value)} />
        </div>
        <div className="field">
          <label className="field-label">Description</label>
          <input className="field-input" value={description} onChange={(e) => setDescription(e.target.value)} />
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
