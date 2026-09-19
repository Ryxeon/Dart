import { useNavigate, useParams } from 'react-router-dom';
import { REGLES_IMPORTANTES } from '../data/reglesContent.js';
import './RegleDetail.css';

export default function RegleDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const regle = REGLES_IMPORTANTES[id];

  if (!regle) {
    return (
      <div className="tab-page">
        <button className="form-back" onClick={() => navigate(-1)} aria-label="Retour">←</button>
        <p className="placeholder-text">Règle introuvable.</p>
      </div>
    );
  }

  return (
    <div className="tab-page">
      <button className="form-back" onClick={() => navigate(-1)} aria-label="Retour">←</button>
      <h1 className="greeting-name" style={{ fontSize: 26 }}>{regle.titre}</h1>

      {regle.sections.map((s) => (
        <div key={s.sous_titre} className="regle-section">
          <p className="regle-sous-titre">{s.sous_titre}</p>
          <p className="regle-texte">{s.texte}</p>
        </div>
      ))}
    </div>
  );
}
