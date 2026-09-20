import { useNavigate } from 'react-router-dom';
import { REGLES_IMPORTANTES, POSTES } from '../data/reglesContent.js';
import './RegleDetail.css';

export default function ToutesLesRegles() {
  const navigate = useNavigate();

  return (
    <div className="tab-page">
      <button className="form-back" onClick={() => navigate(-1)} aria-label="Retour">←</button>
      <h1 className="greeting-name" style={{ fontSize: 26 }}>Toutes les règles</h1>

      {Object.values(REGLES_IMPORTANTES).map((regle) => (
        <div key={regle.titre} style={{ marginBottom: 28 }}>
          <h2 style={{ fontFamily: 'var(--font-title)', fontSize: 20, color: 'var(--color-primary)', marginBottom: 8 }}>
            {regle.titre}
          </h2>
          {regle.sections.map((s) => (
            <div key={s.sous_titre} className="regle-section">
              <p className="regle-sous-titre">{s.sous_titre}</p>
              <p className="regle-texte">{s.texte}</p>
            </div>
          ))}
        </div>
      ))}

      <h2 style={{ fontFamily: 'var(--font-title)', fontSize: 20, color: 'var(--color-primary)', marginBottom: 8 }}>
        Les postes
      </h2>
      {Object.values(POSTES).map((poste) => (
        <div key={poste.titre} className="regle-section">
          <p className="regle-sous-titre">{poste.titre}</p>
          <p className="regle-texte">{poste.regles}</p>
        </div>
      ))}
    </div>
  );
}
