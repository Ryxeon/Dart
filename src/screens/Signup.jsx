import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormScreen, Field, Button } from '../components/FormScreen.jsx';
import Kroa from '../components/Kroa.jsx';
import { supabase, supabaseReady } from '../lib/supabase.js';

export default function Signup() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [chargement, setChargement] = useState(false);

  async function handleContinue() {
    if (!email.includes('@')) {
      setError('Entre une adresse email valide');
      return;
    }
    if (password.length < 6) {
      setError('Le mot de passe doit faire au moins 6 caractères');
      return;
    }
    setError('');

    if (!supabaseReady) {
      // Base de données pas encore branchée : on continue quand même pour tester le parcours
      localStorage.setItem('dart_email_temp', email);
      navigate('/profil');
      return;
    }

    setChargement(true);
    const { data, error: signUpError } = await supabase.auth.signUp({ email, password });
    setChargement(false);

    if (signUpError) {
      if (signUpError.message.includes('already registered')) {
        setError('Cet email est déjà utilisé');
      } else {
        setError("Erreur : " + signUpError.message);
      }
      return;
    }

    localStorage.setItem('dart_user_id', data.user?.id || '');
    navigate('/profil');
  }

  return (
    <FormScreen title="Créer un compte" subtitle="Rejoins l'aventure avec Kroa !">
      <button className="form-back" onClick={() => navigate('/')} aria-label="Retour">←</button>

      <Field
        label="Email"
        type="email"
        placeholder="exemple@email.com"
        value={email}
        onChange={setEmail}
        required
        error={error}
      />

      <Field
        label="Mot de passe"
        type="password"
        placeholder="Choisis un mot de passe"
        value={password}
        onChange={setPassword}
        required
      />

      <Button variant="filled" onClick={handleContinue}>
        {chargement ? 'Création...' : 'Continuer'}
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
