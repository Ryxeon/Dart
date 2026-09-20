import { useNavigate } from 'react-router-dom';
import './WelcomeAfterProfile.css';

export default function WelcomeAfterProfile() {
  const navigate = useNavigate();
  const prenom = localStorage.getItem('dart_prenom') || '';
  const estCapitaine = localStorage.getItem('dart_capitaine') === 'oui';

  return (
    <div className="welcome-after-screen">
      <p className="welcome-after-text">
        Bienvenue {estCapitaine ? 'capitaine ' : ''}{prenom} !<br />
        Prêt{estCapitaine ? '' : '(e)'} à jouer au volley ?
      </p>
      <button className="form-btn form-btn--accent" onClick={() => navigate('/equipe-choix')}>
        C'est parti
      </button>
    </div>
  );
}
