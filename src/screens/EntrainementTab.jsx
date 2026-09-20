import { useNavigate } from 'react-router-dom';
import './EntrainementTab.css';

const CATEGORIES = [
  { id: 'echauffement', label: 'Échauffement', desc: 'Routine avant chaque séance', route: '/entrainement/echauffement' },
  { id: 'entrainement', label: 'Entraînement', desc: 'Exercices par thème', route: '/entrainement/entrainement' },
  { id: 'etirements', label: 'Étirements', desc: 'Routine après chaque séance', route: '/entrainement/etirements' },
  { id: 'habitudes', label: 'Bonnes habitudes', desc: 'Sommeil, nutrition, conseils', route: '/bonnes-habitudes' },
];

export default function EntrainementTab() {
  const navigate = useNavigate();

  return (
    <div className="tab-page">
      <h1 className="greeting-name" style={{ fontSize: 26 }}>Entraînement</h1>

      <div className="categories-list">
        {CATEGORIES.map((c) => (
          <button key={c.id} className="categorie-card" onClick={() => navigate(c.route)}>
            <span className="categorie-label">{c.label}</span>
            <span className="categorie-desc">{c.desc}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
