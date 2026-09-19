import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormScreen, Field, Button } from '../components/FormScreen.jsx';
import Kroa from '../components/Kroa.jsx';
import { supabase, supabaseReady } from '../lib/supabase.js';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [erreur, setErreur] = useState('');
  const [chargement, setChargement] = useState(false);

  async function handleConnexion() {
    if (!supabaseReady) {
      setErreur("La base de données n'est pas encore branchée (voir les instructions).");
      return;
    }
    setErreur('');
    setChargement(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setChargement(false);
    if (error) {
      setErreur('Email ou mot de passe incorrect.');
      return;
    }
    navigate('/accueil');
  }

  return (
    <FormScreen title="Connectez-vous" subtitle="Ravi de vous revoir ! Prêt à jouer ?">
      <button className="form-back" onClick={() => navigate('/')} aria-label="Retour">←</button>

      <Field
        label="Email"
        type="email"
        placeholder="exemple@email.com"
        value={email}
        onChange={setEmail}
        required
      />

      <Field
        label="Mot de passe"
        type="password"
        placeholder="Votre mot de passe"
        value={password}
        onChange={setPassword}
        required
        error={erreur}
      />

      <button className="form-link">Mot de passe oublié ?</button>

      <Button variant="filled" onClick={handleConnexion}>
        {chargement ? 'Connexion...' : 'Connexion'}
      </Button>

      <div className="kroa-zone">
        <div className="kroa-line" />
        <span className="kroa-text">Kroa t'attend</span>
        <div className="kroa-line" />
      </div>
      <div className="kroa-img"><Kroa /></div>
    </FormScreen>
  );
}
