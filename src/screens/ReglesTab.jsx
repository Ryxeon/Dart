import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { construireIndexRecherche } from '../data/reglesContent.js';
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
  const navigate = useNavigate();
  const index = useMemo(() => construireIndexRecherche(), []);

  const resultats = useMemo(() => {
    const q = recherche.trim().toLowerCase();
    if (q.length < 2) return [];
    return index.filter((e) => e.texte.toLowerCase().includes(q) || e.titre.toLowerCase().includes(q)).slice(0, 8);
  }, [recherche, index]);

  function extraitSurligne(texte, q) {
    const idx = texte.toLowerCase().indexOf(q.toLowerCase());
    if (idx === -1) return texte.slice(0, 90) + '...';
    const debut = Math.max(0, idx - 30);
    const fin = Math.min(texte.length, idx + q.length + 40);
    const avant = (debut > 0 ? '...' : '') + texte.slice(debut, idx);
    const trouve = texte.slice(idx, idx + q.length);
    const apres = texte.slice(idx + q.length, fin) + (fin < texte.length ? '...' : '');
    return (
      <>
        {avant}<mark className="recherche-surlignage">{trouve}</mark>{apres}
      </>
    );
  }

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

      {resultats.length > 0 && (
        <div className="resultats-recherche">
          {resultats.map((r, i) => (
            <button key={i} className="resultat-item" onClick={() => navigate(r.route)}>
              <span className="resultat-titre">{r.titre} — {r.sousTitre}</span>
              <span className="resultat-extrait">{extraitSurligne(r.texte, recherche.trim())}</span>
            </button>
          ))}
        </div>
      )}

      {recherche.trim().length < 2 && (
        <>
          <button className="regles-all-btn" onClick={() => navigate('/regles/rotations')}>
            📘 Toutes les règles
          </button>

          <p className="section-label">Règles importantes</p>
          <div className="regles-grid">
            {REGLES_IMPORTANTES.map((r) => (
              <button key={r.id} className="regle-card" onClick={() => navigate(`/regles/${r.id}`)}>{r.label}</button>
            ))}
          </div>

          <p className="section-label">Postes</p>
          <div className="regles-grid">
            {POSTES.map((p) => (
              <button key={p.id} className="regle-card" onClick={() => navigate(`/postes/${p.id}`)}>{p.label}</button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
