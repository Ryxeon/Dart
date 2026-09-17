import { useNavigate } from 'react-router-dom';
import { FormScreen, Button } from '../components/FormScreen.jsx';
import './TeamChoice.css';

export default function TeamChoice() {
  const navigate = useNavigate();
  const estCapitaine = localStorage.getItem('dart_capitaine') === 'oui';

  return (
    <FormScreen accent="beige" title="" >
      <div className="team-choice">
        <h1 className="team-title">Avant de jouer, il vous faut une équipe !</h1>
        <p className="team-subtitle">
          {estCapitaine
            ? 'Rejoins tes coéquipiers ou lance ta propre équipe'
            : 'Rejoins tes coéquipiers'}
        </p>

        {estCapitaine && (
          <Button variant="accent" onClick={() => navigate('/creer-equipe')}>
            Créer une équipe
          </Button>
        )}

        <button
          className={`form-btn ${estCapitaine ? 'team-btn-outline' : 'form-btn--accent'}`}
          onClick={() => navigate('/rejoindre-equipe')}
        >
          Rejoindre une équipe
        </button>
      </div>
    </FormScreen>
  );
}
