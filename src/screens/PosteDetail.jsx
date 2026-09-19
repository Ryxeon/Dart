import { useNavigate, useParams } from 'react-router-dom';
import { POSTES } from '../data/reglesContent.js';
import './RegleDetail.css';

export default function PosteDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const poste = POSTES[id];

  if (!poste) {
    return (
      <div className="tab-page">
        <button className="form-back" onClick={() => navigate(-1)} aria-label="Retour">←</button>
        <p className="placeholder-text">Poste introuvable.</p>
      </div>
    );
  }

  return (
    <div className="tab-page">
      <button className="form-back" onClick={() => navigate(-1)} aria-label="Retour">←</button>
      <h1 className="greeting-name" style={{ fontSize: 26 }}>{poste.titre}</h1>

      <div className="regle-section">
        <p className="regle-sous-titre">Règles du poste</p>
        <p className="regle-texte">{poste.regles}</p>
      </div>

      <div className="regle-section">
        <p className="regle-sous-titre">Joueurs forts à ce poste</p>
        <ul className="regle-liste">
          {poste.joueurs_forts.map((j) => <li key={j}>{j}</li>)}
        </ul>
      </div>

      <div className="regle-section">
        <p className="regle-sous-titre">Compétences à développer</p>
        <div className="tags-list">
          {poste.competences.map((c) => <span key={c} className="tag">{c}</span>)}
        </div>
      </div>

      <div className="regle-section">
        <p className="regle-sous-titre">Conseils d'entraînement</p>
        <p className="regle-texte">{poste.conseils}</p>
      </div>
    </div>
  );
}
