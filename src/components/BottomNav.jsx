import './BottomNav.css';

const TABS = [
  { id: 'evenement', label: 'Événement' },
  { id: 'entrainement', label: 'Entraînement' },
  { id: 'competences', label: 'Compétences' },
  { id: 'regles', label: 'Règles' },
  { id: 'equipe', label: 'Équipe' },
];

export default function BottomNav({ active, onChange }) {
  return (
    <nav className="bottom-nav" aria-label="Navigation principale">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          className={`nav-tab ${active === tab.id ? 'nav-tab--active' : ''}`}
          onClick={() => onChange(tab.id)}
          aria-current={active === tab.id ? 'page' : undefined}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  );
}
