import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormScreen, Field, Button } from '../components/FormScreen.jsx';
import Kroa from '../components/Kroa.jsx';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

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
      />

      <button className="form-link">Mot de passe oublié ?</button>

      <Button variant="filled" onClick={() => alert('La connexion sera active une fois la base de données branchée')}>
        Connexion
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
