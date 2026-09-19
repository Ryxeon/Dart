import { useState } from 'react';
import './EvenementTab.css';

const JOURS_SEMAINE = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
const MOIS = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];

export default function EvenementTab() {
  const [date, setDate] = useState(new Date());
  const aujourdHui = new Date();

  const annee = date.getFullYear();
  const mois = date.getMonth();
  const premierJour = new Date(annee, mois, 1);
  const nbJours = new Date(annee, mois + 1, 0).getDate();
  const decalage = (premierJour.getDay() + 6) % 7; // lundi = 0

  const jours = [];
  for (let i = 0; i < decalage; i++) jours.push(null);
  for (let j = 1; j <= nbJours; j++) jours.push(j);

  function changerMois(delta) {
    setDate(new Date(annee, mois + delta, 1));
  }

  return (
    <div className="tab-page">
      <div className="next-event-card">
        <p className="next-event-label">Prochain événement</p>
        <p className="next-event-title">Aucun événement programmé</p>
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
          return (
            <span key={i} className={`calendar-day ${estAujourdhui ? 'calendar-day--today' : ''} ${!j ? 'calendar-day--empty' : ''}`}>
              {j || ''}
            </span>
          );
        })}
      </div>
    </div>
  );
}
