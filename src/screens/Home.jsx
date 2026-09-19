import { useState } from 'react';
import BottomNav from '../components/BottomNav.jsx';
import EvenementTab from './EvenementTab.jsx';
import EntrainementTab from './EntrainementTab.jsx';
import ReglesTab from './ReglesTab.jsx';
import EquipeTab from './EquipeTab.jsx';
import './Home.css';

export default function Home() {
  const [tab, setTab] = useState('competences');
  const prenom = localStorage.getItem('dart_prenom') || 'joueur';

  return (
    <div className="home-screen">
      <div className="home-content">
        {tab === 'competences' && <CompetencesTab prenom={prenom} />}
        {tab === 'evenement' && <EvenementTab />}
        {tab === 'entrainement' && <EntrainementTab />}
        {tab === 'regles' && <ReglesTab />}
        {tab === 'equipe' && <EquipeTab />}
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
