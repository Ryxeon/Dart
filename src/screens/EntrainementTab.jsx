import { useNavigate } from 'react-router-dom';
import './EntrainementTab.css';

const CATEGORIES = [
  { id: 'echauffement', label: 'Échauffement', desc: 'Routine avant chaque séance' },
  { id: 'entrainement', label: 'Entraînement', desc: 'Exercices par thème' },
  { id: 'etirements', label: 'Étirements', desc: 'Routine après chaque séance' },
];

export default function EntrainementTab() {
  const navigate = useNavigate();

  return (
    <div className="tab-page">
      <h1 className="greeting-name" style={{ fontSize: 26 }}>Entraînement</h1>

      <div className="categories-list">
        {CATEGORIES.map((c) => (
          <button key={c.id} className="categorie-card" onClick={() => navigate(`/entrainement/${c.id}`)}>
            <span className="categorie-label">{c.label}</span>
            <span className="categorie-desc">{c.desc}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
