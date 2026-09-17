import { useNavigate } from 'react-router-dom';
import './Welcome.css';

export default function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="welcome-screen">
      <svg
        className="welcome-bg"
        viewBox="0 0 380 700"
        preserveAspectRatio="xMidYMid slice"
        role="img"
        aria-hidden="true"
      >
        <rect x="0" y="0" width="380" height="700" fill="#06345E" />
        <g fill="#F3EDE1">
          <circle cx="380" cy="0" r="70" />
          <circle cx="345" cy="15" r="9" />
          <circle cx="320" cy="40" r="7" />
          <circle cx="360" cy="55" r="6" />
          <circle cx="300" cy="15" r="5" />
          <circle cx="330" cy="70" r="5" />
          <circle cx="280" cy="40" r="4" />
          <circle cx="310" cy="85" r="4" />
          <circle cx="355" cy="90" r="3.5" />
          <circle cx="260" cy="60" r="3" />
          <circle cx="290" cy="100" r="3" />
          <circle cx="245" cy="85" r="2.5" />
          <circle cx="330" cy="115" r="2.5" />
          <circle cx="270" cy="120" r="2" />
          <circle cx="225" cy="105" r="2" />
        </g>
        <g fill="#00060F">
          <circle cx="0" cy="700" r="55" />
          <circle cx="30" cy="670" r="7" />
          <circle cx="55" cy="690" r="6" />
          <circle cx="15" cy="635" r="5" />
          <circle cx="70" cy="655" r="4.5" />
          <circle cx="45" cy="620" r="4" />
          <circle cx="90" cy="675" r="4" />
          <circle cx="30" cy="600" r="3.5" />
          <circle cx="105" cy="640" r="3" />
          <circle cx="65" cy="590" r="3" />
        </g>
      </svg>

      <div className="welcome-content">
        <h2 className="welcome-subtitle">Bienvenue sur</h2>
        <h1 className="welcome-title">DART</h1>

        <div className="welcome-spacer" />

        <button
          className="btn btn-outline"
          onClick={() => navigate('/creer-compte')}
        >
          Créer un compte
        </button>

        <button
          className="btn btn-filled"
          onClick={() => navigate('/connexion')}
        >
          Connexion
        </button>
      </div>
    </div>
  );
}
