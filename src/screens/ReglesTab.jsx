import { useState } from 'react';
import './ReglesTab.css';

const REGLES_IMPORTANTES = [
  { id: 'rotations', label: 'Rotations' },
  { id: 'remplacements', label: 'Remplacements' },
  { id: 'format', label: 'Format du match' },
];

const POSTES = [
  { id: 'passeur', label: 'Passeur' },
  { id: 'central', label: 'Central' },
  { id: 'receptionneur', label: 'Réceptionneur-attaquant' },
  { id: 'pointu', label: 'Pointu' },
  { id: 'libero', label: 'Libéro' },
];

export default function ReglesTab() {
  const [recherche, setRecherche] = useState('');

  return (
    <div className="tab-page">
      <h1 className="greeting-name" style={{ fontSize: 26 }}>Règles</h1>

      <input
        type="search"
        className="regles-search"
        placeholder="Chercher une règle (ex : passeur)"
        value={recherche}
        onChange={(e) => setRecherche(e.target.value)}
        aria-label="Rechercher dans les règles"
      />

      <button className="regles-all-btn">📘 Toutes les règles</button>

      <p className="section-label">Règles importantes</p>
      <div className="regles-grid">
        {REGLES_IMPORTANTES.map((r) => (
          <button key={r.id} className="regle-card">{r.label}</button>
        ))}
      </div>

      <p className="section-label">Postes</p>
      <div className="regles-grid">
        {POSTES.map((p) => (
          <button key={p.id} className="regle-card">{p.label}</button>
        ))}
      </div>
    </div>
  );
}
