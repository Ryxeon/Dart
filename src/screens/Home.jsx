import { useState } from 'react';
import BottomNav from '../components/BottomNav.jsx';
import './Home.css';

export default function Home() {
  const [tab, setTab] = useState('competences');
  const prenom = localStorage.getItem('dart_prenom') || 'joueur';

  return (
    <div className="home-screen">
      <div className="home-content">
        {tab === 'competences' && <CompetencesTab prenom={prenom} />}
        {tab === 'evenement' && <PlaceholderTab titre="Événement" />}
        {tab === 'entrainement' && <PlaceholderTab titre="Entraînement" />}
        {tab === 'regles' && <PlaceholderTab titre="Règles" />}
        {tab === 'equipe' && <PlaceholderTab titre="Équipe" />}
      </div>
      <BottomNav active={tab} onChange={setTab} />
    </div>
  );
}

function CompetencesTab({ prenom }) {
  return (
    <div className="tab-page">
      <p className="greeting-small">Bonjour</p>
      <h1 className="greeting-name">{prenom}</h1>

      <div className="radar-placeholder">
        <p>Ton radar de compétences apparaîtra ici une fois le questionnaire rempli.</p>
        <button className="radar-btn">Faire le questionnaire</button>
      </div>
    </div>
  );
}

function PlaceholderTab({ titre }) {
  return (
    <div className="tab-page">
      <h1 className="greeting-name" style={{ fontSize: 26 }}>{titre}</h1>
      <p className="placeholder-text">Cette page arrive bientôt.</p>
    </div>
  );
}
