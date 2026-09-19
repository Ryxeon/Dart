import { useEffect, useRef, useState } from 'react';

// Temps (en secondes) pour parcourir 20m à chaque palier
const TEMPS_PAR_PALIER = [8.47, 8.00, 7.58, 7.20, 6.86, 6.55, 6.26, 6.00, 5.76, 5.54, 5.33];
const DUREE_PALIER_MS = 60000;

export default function TestEndurance({ onTermine }) {
  const [enCours, setEnCours] = useState(false);
  const [palier, setPalier] = useState(1);
  const [tempsRestantPalier, setTempsRestantPalier] = useState(DUREE_PALIER_MS);
  const audioCtxRef = useRef(null);
  const intervalRef = useRef(null);
  const dernierBipRef = useRef(0);

  function jouerBip() {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    const ctx = audioCtxRef.current;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.frequency.value = 880;
    osc.connect(gain);
    gain.connect(ctx.destination);
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    osc.start();
    osc.stop(ctx.currentTime + 0.15);
  }

  function demarrer() {
    setEnCours(true);
    setPalier(1);
    dernierBipRef.current = Date.now();
    jouerBip();

    intervalRef.current = setInterval(() => {
      const tempsPalier = (TEMPS_PAR_PALIER[Math.min(palierRef.current - 1, TEMPS_PAR_PALIER.length - 1)]) * 1000;
      const maintenant = Date.now();
      const ecoule = maintenant - dernierBipRef.current;

      if (ecoule >= tempsPalier) {
        jouerBip();
        dernierBipRef.current = maintenant;
      }
    }, 50);

    palierIntervalRef.current = setInterval(() => {
      palierRef.current += 1;
      setPalier(palierRef.current);
    }, DUREE_PALIER_MS);
  }

  const palierRef = useRef(1);
  const palierIntervalRef = useRef(null);

  function arreter() {
    setEnCours(false);
    clearInterval(intervalRef.current);
    clearInterval(palierIntervalRef.current);
    onTermine(palierRef.current);
  }

  useEffect(() => {
    return () => {
      clearInterval(intervalRef.current);
      clearInterval(palierIntervalRef.current);
    };
  }, []);

  return (
    <div className="test-runner">
      {!enCours ? (
        <button className="quest-btn quest-btn--primary" onClick={demarrer}>Démarrer le test navette</button>
      ) : (
        <>
          <p className="test-palier">Palier {palier}</p>
          <p className="test-hint-small">Cours entre les deux lignes à chaque bip !</p>
          <button className="quest-btn quest-btn--secondary" onClick={arreter}>
            J'ai raté deux fois — Arrêter
          </button>
        </>
      )}
    </div>
  );
}
