import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase, supabaseReady } from '../lib/supabase.js';
import './EquipeTab.css';

export default function EquipeTab() {
  const navigate = useNavigate();
  const [equipe, setEquipe] = useState(null);
  const [joueurs, setJoueurs] = useState([]);
  const [chargement, setChargement] = useState(true);

  useEffect(() => {
    async function charger() {
      if (!supabaseReady) {
        setChargement(false);
        return;
      }
      const { data: { user } } = await supabase.auth.getUser();
      const { data: profil } = await supabase
        .from('profils')
        .select('equipe_id')
        .eq('id', user.id)
        .single();

      if (profil?.equipe_id) {
        const { data: eq } = await supabase
          .from('equipes')
          .select('*')
          .eq('id', profil.equipe_id)
          .single();
        setEquipe(eq);

        const { data: membres } = await supabase
          .from('profils')
          .select('id, prenom, poste, est_capitaine')
          .eq('equipe_id', profil.equipe_id);
        setJoueurs(membres || []);
      }
      setChargement(false);
    }
    charger();
  }, []);

  if (chargement) return <div className="tab-page"><p className="placeholder-text">Chargement...</p></div>;

  if (!equipe) {
    return (
      <div className="tab-page">
        <h1 className="greeting-name" style={{ fontSize: 26 }}>Équipe</h1>
        <p className="placeholder-text">Aucune équipe trouvée.</p>
      </div>
    );
  }

  return (
    <div className="tab-page equipe-tab">
      <div className="club-card">
        <h1 className="club-name">{equipe.nom}</h1>
        {equipe.slogan && <p className="club-slogan">{equipe.slogan}</p>}
        <div className="club-code">
          Code d'équipe : <strong>{equipe.code}</strong>
        </div>
      </div>

      <p className="section-label">Joueurs ({joueurs.length})</p>
      <div className="joueurs-list">
        {joueurs.map((j) => (
          <div key={j.id} className="joueur-row">
            <span className="joueur-nom">{j.prenom}{j.est_capitaine ? ' (C)' : ''}</span>
            <span className="joueur-poste">{j.poste || 'Poste non défini'}</span>
          </div>
        ))}
        {joueurs.length === 0 && <p className="placeholder-text">Aucun autre joueur pour l'instant.</p>}
      </div>

      <button className="settings-btn" onClick={() => navigate('/parametres')}>
        Paramètres
      </button>
    </div>
  );
}
