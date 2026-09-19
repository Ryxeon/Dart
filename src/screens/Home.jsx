import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../components/BottomNav.jsx';
import Radar from '../components/Radar.jsx';
import EvenementTab from './EvenementTab.jsx';
import EntrainementTab from './EntrainementTab.jsx';
import ReglesTab from './ReglesTab.jsx';
import EquipeTab from './EquipeTab.jsx';
import { supabase, supabaseReady } from '../lib/supabase.js';
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
  const navigate = useNavigate();
  const [competences, setCompetences] = useState(null);

  useEffect(() => {
    async function charger() {
      if (supabaseReady) {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data } = await supabase.from('profils').select('competences').eq('id', user.id).single();
          if (data?.competences && Object.keys(data.competences).length > 0) {
            setCompetences(data.competences);
            return;
          }
        }
      }
      const local = localStorage.getItem('dart_competences');
      if (local) setCompetences(JSON.parse(local));
    }
    charger();
  }, []);

  return (
    <div className="tab-page">
      <p className="greeting-small">Bonjour</p>
      <h1 className="greeting-name">{prenom}</h1>

      {competences ? (
        <div className="radar-wrap">
          <Radar competences={competences} />
          <button className="radar-btn" onClick={() => navigate('/questionnaire')}>Refaire le questionnaire</button>
        </div>
      ) : (
        <div className="radar-placeholder">
          <p>Ton radar de compétences apparaîtra ici une fois le questionnaire rempli.</p>
          <button className="radar-btn" onClick={() => navigate('/questionnaire')}>Faire le questionnaire</button>
        </div>
      )}
    </div>
  );
}
