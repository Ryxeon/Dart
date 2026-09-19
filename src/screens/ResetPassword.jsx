import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormScreen, Field, Button } from '../components/FormScreen.jsx';
import { supabase } from '../lib/supabase.js';

export default function ResetPassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [erreur, setErreur] = useState('');
  const [succes, setSucces] = useState(false);

  async function handleValider() {
    if (password.length < 6) {
      setErreur('Le mot de passe doit faire au moins 6 caractères');
      return;
    }
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      setErreur("Erreur : " + error.message);
      return;
    }
    setSucces(true);
    setTimeout(() => navigate('/connexion'), 2000);
  }

  return (
    <FormScreen title="Nouveau mot de passe" subtitle="Choisis un nouveau mot de passe">
      {succes ? (
        <p className="quest-hint">Mot de passe mis à jour ! Redirection vers la connexion...</p>
      ) : (
        <>
          <Field
            label="Nouveau mot de passe"
            type="password"
            placeholder="Ton nouveau mot de passe"
            value={password}
            onChange={setPassword}
            required
            error={erreur}
          />
          <Button variant="filled" onClick={handleValider}>Valider</Button>
        </>
      )}
    </FormScreen>
  );
}
