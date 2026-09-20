import { useNavigate } from 'react-router-dom';
import { BONNES_HABITUDES } from '../data/reglesContent.js';
import './RegleDetail.css';

export default function BonnesHabitudes() {
  const navigate = useNavigate();

  return (
    <div className="tab-page">
      <button className="form-back" onClick={() => navigate(-1)} aria-label="Retour">←</button>
      <h1 className="greeting-name" style={{ fontSize: 26 }}>{BONNES_HABITUDES.titre}</h1>

      {BONNES_HABITUDES.sections.map((s) => (
        <div key={s.sous_titre} className="regle-section">
          <p className="regle-sous-titre">{s.sous_titre}</p>
          <p className="regle-texte">{s.texte}</p>
        </div>
      ))}
    </div>
  );
}
