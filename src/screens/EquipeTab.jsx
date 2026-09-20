import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase, supabaseReady } from '../lib/supabase.js';
import './EquipeTab.css';

const POSTES = ['Non défini', 'Passeur', 'Central', 'Réceptionneur-attaquant', 'Pointu', 'Libéro'];

export default function EquipeTab() {
  const navigate = useNavigate();
  const [equipe, setEquipe] = useState(null);
  const [joueurs, setJoueurs] = useState([]);
  const [sousEquipes, setSousEquipes] = useState([]);
  const [monId, setMonId] = useState(null);
  const [estCapitaine, setEstCapitaine] = useState(false);
  const [chargement, setChargement] = useState(true);
  const [joueurEdite, setJoueurEdite] = useState(null);
  const [sousEquipeEditee, setSousEquipeEditee] = useState(null);
  const [showAjoutSousEquipe, setShowAjoutSousEquipe] = useState(false);

  async function charger() {
    if (!supabaseReady) {
      setChargement(false);
      return;
    }
    const { data: { user } } = await supabase.auth.getUser();
    setMonId(user.id);
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
        .select('id, prenom, poste, voeu_poste, numero, est_capitaine, titulaire')
        .eq('equipe_id', profil.equipe_id);
      setJoueurs(membres || []);

      const { data: sousEq } = await supabase
        .from('sous_equipes')
        .select('*, sous_equipe_membres(profil_id)')
        .eq('equipe_id', profil.equipe_id);
      setSousEquipes(sousEq || []);
    }
    setChargement(false);
  }

  useEffect(() => { charger(); }, []);

  async function sauvegarderJoueur(id, numero, poste, titulaire) {
    await supabase.from('profils').update({ numero: numero || null, poste, titulaire }).eq('id', id);
    setJoueurEdite(null);
    charger();
  }

  async function supprimerJoueur(id) {
    if (!confirm('Retirer ce joueur de l\'équipe ? Cette action est irréversible.')) return;
    await supabase.from('profils').update({ equipe_id: null }).eq('id', id);
    setJoueurEdite(null);
    charger();
  }

  async function creerSousEquipe(nom) {
    if (!nom.trim()) return;
    await supabase.from('sous_equipes').insert({ equipe_id: equipe.id, nom });
    setShowAjoutSousEquipe(false);
    charger();
  }

  async function renommerSousEquipe(id, nouveauNom) {
    await supabase.from('sous_equipes').update({ nom: nouveauNom }).eq('id', id);
    setSousEquipeEditee(null);
    charger();
  }

  async function toggleMembre(sousEquipeId, profilId, estDedans) {
    if (estDedans) {
      await supabase.from('sous_equipe_membres').delete().eq('sous_equipe_id', sousEquipeId).eq('profil_id', profilId);
    } else {
      await supabase.from('sous_equipe_membres').insert({ sous_equipe_id: sousEquipeId, profil_id: profilId });
    }
    charger();
  }

  async function supprimerSousEquipe(id) {
    if (!confirm('Supprimer cette sous-équipe ?')) return;
    await supabase.from('sous_equipes').delete().eq('id', id);
    setSousEquipeEditee(null);
    charger();
  }

  if (chargement) return <div className="tab-page"><p className="placeholder-text">Chargement...</p></div>;

  if (!equipe) {
    return (
      <div className="tab-page">
        <h1 className="greeting-name" style={{ fontSize: 26 }}>Équipe</h1>
        <p className="placeholder-text" style={{ marginBottom: 20 }}>
          Tu ne fais partie d'aucune équipe pour l'instant.
        </p>
        <button className="form-btn form-btn--accent" onClick={() => navigate('/creer-equipe')} style={{ marginBottom: 12 }}>
          Créer une équipe
        </button>
        <button className="form-btn form-btn--outline" onClick={() => navigate('/rejoindre-equipe')}>
          Rejoindre une équipe
        </button>
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
            <span className="joueur-poste">
              {j.poste || 'Poste non défini'}{j.titulaire ? ' · Titulaire' : ' · Remplaçant'}
            </span>
          </button>
        ))}
        {joueurs.length === 0 && <p className="placeholder-text">Aucun autre joueur pour l'instant.</p>}
      </div>

      <div className="evenement-header" style={{ marginTop: 8 }}>
        <p className="section-label" style={{ margin: 0 }}>Sous-équipes</p>
        {estCapitaine && (
          <button className="add-event-btn" onClick={() => setShowAjoutSousEquipe(true)} aria-label="Créer une sous-équipe">+</button>
        )}
      </div>
      <div className="joueurs-list">
        {sousEquipes.map((se) => {
          const membresIds = (se.sous_equipe_membres || []).map((m) => m.profil_id);
          const jeSuisDedans = membresIds.includes(monId);
          return (
            <button
              key={se.id}
              className="joueur-row"
              onClick={() => estCapitaine && setSousEquipeEditee(se)}
              style={{ cursor: estCapitaine ? 'pointer' : 'default' }}
            >
              <span className="joueur-nom">{se.nom}{jeSuisDedans ? ' (toi)' : ''}</span>
              <span className="joueur-poste">{membresIds.length} joueur{membresIds.length > 1 ? 's' : ''}</span>
            </button>
          );
        })}
        {sousEquipes.length === 0 && <p className="placeholder-text">Aucune sous-équipe pour l'instant.</p>}
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

      {showAjoutSousEquipe && (
        <AjoutSousEquipe onFermer={() => setShowAjoutSousEquipe(false)} onCreer={creerSousEquipe} />
      )}

      {sousEquipeEditee && (
        <EditeurSousEquipe
          sousEquipe={sousEquipeEditee}
          joueurs={joueurs}
          onFermer={() => setSousEquipeEditee(null)}
          onRenommer={renommerSousEquipe}
          onToggleMembre={toggleMembre}
          onSupprimer={supprimerSousEquipe}
        />
      )}
    </div>
  );
}

function EditeurJoueur({ joueur, onFermer, onSauvegarder, onSupprimer }) {
  const [numero, setNumero] = useState(joueur.numero || '');
  const [poste, setPoste] = useState(joueur.poste || POSTES[0]);
  const [titulaire, setTitulaire] = useState(!!joueur.titulaire);

  return (
    <div className="popup-overlay" role="dialog" aria-modal="true">
      <div className="popup">
        <p className="popup-title">{joueur.prenom}</p>

        {joueur.voeu_poste && (
          <p style={{ fontSize: 12, color: 'var(--color-text-secondary)', textAlign: 'left', marginTop: 12 }}>
            Vœu de poste : <strong>{joueur.voeu_poste}</strong>
          </p>
        )}

        <div className="field" style={{ textAlign: 'left', marginTop: 12 }}>
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
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, marginBottom: 16 }}>
          <input type="checkbox" checked={titulaire} onChange={(e) => setTitulaire(e.target.checked)} />
          Titulaire (sinon remplaçant)
        </label>
        <div className="popup-actions">
          <button className="popup-btn popup-btn--secondary" onClick={onFermer}>Annuler</button>
          <button className="popup-btn popup-btn--primary" onClick={() => onSauvegarder(joueur.id, numero, poste, titulaire)}>Enregistrer</button>
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

function AjoutSousEquipe({ onFermer, onCreer }) {
  const [nom, setNom] = useState('');

  return (
    <div className="popup-overlay" role="dialog" aria-modal="true">
      <div className="popup" style={{ textAlign: 'left' }}>
        <p className="popup-title" style={{ textAlign: 'center' }}>Nouvelle sous-équipe</p>
        <div className="field">
          <label className="field-label">Nom (ex : Équipe 1, Seniors...)</label>
          <input className="field-input" value={nom} onChange={(e) => setNom(e.target.value)} />
        </div>
        <div className="popup-actions">
          <button className="popup-btn popup-btn--secondary" onClick={onFermer}>Annuler</button>
          <button className="popup-btn popup-btn--primary" onClick={() => onCreer(nom)}>Créer</button>
        </div>
      </div>
    </div>
  );
}

function EditeurSousEquipe({ sousEquipe, joueurs, onFermer, onRenommer, onToggleMembre, onSupprimer }) {
  const [nom, setNom] = useState(sousEquipe.nom);
  const membresIds = (sousEquipe.sous_equipe_membres || []).map((m) => m.profil_id);

  return (
    <div className="popup-overlay" role="dialog" aria-modal="true">
      <div className="popup" style={{ textAlign: 'left', maxWidth: 360 }}>
        <p className="popup-title" style={{ textAlign: 'center' }}>Modifier la sous-équipe</p>

        <div className="field">
          <label className="field-label">Nom</label>
          <input className="field-input" value={nom} onChange={(e) => setNom(e.target.value)} />
        </div>

        <p className="field-label" style={{ marginBottom: 8 }}>Membres</p>
        <div style={{ maxHeight: 200, overflowY: 'auto', marginBottom: 16 }}>
          {joueurs.map((j) => {
            const dedans = membresIds.includes(j.id);
            return (
              <label key={j.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0', fontSize: 14 }}>
                <input
                  type="checkbox"
                  checked={dedans}
                  onChange={() => onToggleMembre(sousEquipe.id, j.id, dedans)}
                />
                {j.prenom}
              </label>
            );
          })}
        </div>

        <div className="popup-actions">
          <button className="popup-btn popup-btn--secondary" onClick={onFermer}>Fermer</button>
          <button className="popup-btn popup-btn--primary" onClick={() => onRenommer(sousEquipe.id, nom)}>Enregistrer le nom</button>
        </div>
        <button
          className="popup-btn"
          style={{ marginTop: 10, background: 'none', color: 'var(--color-error)', border: '2px solid var(--color-error)', width: '100%' }}
          onClick={() => onSupprimer(sousEquipe.id)}
        >
          Supprimer la sous-équipe
        </button>
      </div>
    </div>
  );
}
