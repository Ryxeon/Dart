import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase, supabaseReady } from '../lib/supabase.js';
import './EquipeTab.css';

const POSTES = ['Non défini', 'Passeur', 'Central', 'Réceptionneur-attaquant', 'Pointu', 'Libéro'];

export default function EquipeTab() {
  const navigate = useNavigate();
  const [equipe, setEquipe] = useState(null);
  const [joueurs, setJoueurs] = useState([]);
  const [estCapitaine, setEstCapitaine] = useState(false);
  const [chargement, setChargement] = useState(true);
  const [joueurEdite, setJoueurEdite] = useState(null);

  async function charger() {
    if (!supabaseReady) {
      setChargement(false);
      return;
    }
    const { data: { user } } = await supabase.auth.getUser();
    const { data: profil } = await supabase
      .from('profils')
      .select('equipe_id, est_capitaine')
      .eq('id', user.id)
      .single();

    setEstCapitaine(!!profil?.est_capitaine);

    if (profil?.equipe_id) {
      const { data: eq } = await supabase
        .from('equipes')
        .select('*')
        .eq('id', profil.equipe_id)
        .single();
      setEquipe(eq);

      const { data: membres } = await supabase
        .from('profils')
        .select('id, prenom, poste, numero, est_capitaine')
        .eq('equipe_id', profil.equipe_id);
      setJoueurs(membres || []);
    }
    setChargement(false);
  }

  useEffect(() => { charger(); }, []);

  async function sauvegarderJoueur(id, numero, poste) {
    await supabase.from('profils').update({ numero: numero || null, poste }).eq('id', id);
    setJoueurEdite(null);
    charger();
  }

  async function supprimerJoueur(id) {
    if (!confirm('Retirer ce joueur de l\'équipe ? Cette action est irréversible.')) return;
    await supabase.from('profils').update({ equipe_id: null }).eq('id', id);
    setJoueurEdite(null);
    charger();
  }

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
          <button
            key={j.id}
            className="joueur-row"
            onClick={() => estCapitaine && setJoueurEdite(j)}
            style={{ cursor: estCapitaine ? 'pointer' : 'default' }}
          >
            <span className="joueur-nom">
              {j.numero ? `#${j.numero} ` : ''}{j.prenom}{j.est_capitaine ? ' (C)' : ''}
            </span>
            <span className="joueur-poste">{j.poste || 'Poste non défini'}</span>
          </button>
        ))}
        {joueurs.length === 0 && <p className="placeholder-text">Aucun autre joueur pour l'instant.</p>}
      </div>

      <button className="settings-btn" onClick={() => navigate('/parametres')}>
        Paramètres
      </button>

      {joueurEdite && (
        <EditeurJoueur
          joueur={joueurEdite}
          onFermer={() => setJoueurEdite(null)}
          onSauvegarder={sauvegarderJoueur}
          onSupprimer={supprimerJoueur}
        />
      )}
    </div>
  );
}

function EditeurJoueur({ joueur, onFermer, onSauvegarder, onSupprimer }) {
  const [numero, setNumero] = useState(joueur.numero || '');
  const [poste, setPoste] = useState(joueur.poste || POSTES[0]);

  return (
    <div className="popup-overlay" role="dialog" aria-modal="true">
      <div className="popup">
        <p className="popup-title">{joueur.prenom}</p>
        <div className="field" style={{ textAlign: 'left', marginTop: 16 }}>
          <label className="field-label">Numéro</label>
          <input
            type="number"
            className="field-input"
            value={numero}
            onChange={(e) => setNumero(e.target.value)}
          />
        </div>
        <div className="field" style={{ textAlign: 'left' }}>
          <label className="field-label">Poste</label>
          <select className="field-input" value={poste} onChange={(e) => setPoste(e.target.value)}>
            {POSTES.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
        <div className="popup-actions">
          <button className="popup-btn popup-btn--secondary" onClick={onFermer}>Annuler</button>
          <button className="popup-btn popup-btn--primary" onClick={() => onSauvegarder(joueur.id, numero, poste)}>Enregistrer</button>
        </div>
        <button
          className="popup-btn"
          style={{ marginTop: 10, background: 'none', color: 'var(--color-error)', border: '2px solid var(--color-error)', width: '100%' }}
          onClick={() => onSupprimer(joueur.id)}
        >
          Retirer de l'équipe
        </button>
      </div>
    </div>
  );
}
