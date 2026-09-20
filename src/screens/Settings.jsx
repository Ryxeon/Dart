import { useNavigate } from 'react-router-dom';
import { supabase, supabaseReady } from '../lib/supabase.js';
import './Settings.css';

export default function Settings() {
  const navigate = useNavigate();

  async function handleDeconnexion() {
    if (supabaseReady) await supabase.auth.signOut();
    localStorage.clear();
    navigate('/');
  }

  async function handleQuitterEquipe() {
    if (!confirm("Es-tu sûr de vouloir quitter ton équipe ?")) return;
    if (supabaseReady) {
      const { data: { user } } = await supabase.auth.getUser();
      await supabase.from('profils').update({ equipe_id: null, est_capitaine: false }).eq('id', user.id);
    }
    localStorage.removeItem('dart_dernier_onglet');
    navigate('/equipe-choix');
  }

  return (
    <div className="settings-screen">
      <button className="form-back" onClick={() => navigate(-1)} aria-label="Retour">←</button>
      <h1 className="settings-title">Paramètres</h1>

      <SettingsSection titre="Compte">
        <SettingsRow label="Modifier mon profil" onClick={() => navigate('/modifier-profil')} />
        <SettingsRow label="Changer mon mot de passe" bientot />
        <SettingsRow label="Changer mon email" bientot />
      </SettingsSection>

      <SettingsSection titre="Équipe">
        <SettingsRow label="Voir le code d'équipe" onClick={() => navigate('/accueil')} />
        <SettingsRow label="Modifier les infos du club" bientot />
        <SettingsRow label="Quitter l'équipe" danger onClick={handleQuitterEquipe} />
      </SettingsSection>

      <SettingsSection titre="Notifications">
        <SettingsRow label="Gérer les notifications" bientot />
      </SettingsSection>

      <SettingsSection titre="Général">
        <SettingsRow label="Revoir le tuto" bientot />
        <SettingsRow label="Contact / Signaler un problème" bientot />
        <SettingsRow label="Mentions légales" bientot />
        <SettingsRow label="Se déconnecter" onClick={handleDeconnexion} />
        <SettingsRow label="Supprimer mon compte" danger bientot />
      </SettingsSection>
    </div>
  );
}

function SettingsSection({ titre, children }) {
  return (
    <div className="settings-section">
      <p className="settings-section-title">{titre}</p>
      <div className="settings-list">{children}</div>
    </div>
  );
}

function SettingsRow({ label, danger, onClick, bientot }) {
  if (bientot) {
    return (
      <div className="settings-row settings-row--disabled">
        {label}
        <span className="settings-row-badge">Bientôt</span>
      </div>
    );
  }
  return (
    <button className={`settings-row ${danger ? 'settings-row--danger' : ''}`} onClick={onClick}>
      {label}
      <span aria-hidden="true">›</span>
    </button>
  );
}
