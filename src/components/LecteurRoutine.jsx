import { useEffect, useRef, useState } from 'react';

export default function LecteurRoutine({ exercices, onTerminer }) {
  const [index, setIndex] = useState(0);
  const [tempsRestant, setTempsRestant] = useState(exercices[0]?.valeur_defaut || 0);
  const audioCtxRef = useRef(null);
  const intervalRef = useRef(null);

  const exercice = exercices[index];
  const estTemps = exercice?.unite === 'temps';

  function jouerSon() {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    const ctx = audioCtxRef.current;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.frequency.value = 660;
    osc.connect(gain);
    gain.connect(ctx.destination);
    gain.gain.setValueAtTime(0.25, ctx.currentTime);
    osc.start();
    osc.stop(ctx.currentTime + 0.2);
  }

  function exerciceSuivant() {
    jouerSon();
    if (index + 1 >= exercices.length) {
      onTerminer();
      return;
    }
    setIndex(index + 1);
    setTempsRestant(exercices[index + 1]?.valeur_defaut || 0);
  }

  useEffect(() => {
    if (!estTemps) return;
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setTempsRestant((t) => {
        if (t <= 1) {
          clearInterval(intervalRef.current);
          exerciceSuivant();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  if (!exercice) return null;

  return (
    <div className="popup-overlay" role="dialog" aria-modal="true">
      <div className="popup" style={{ maxWidth: 340 }}>
        <p className="popup-title">{exercice.nom}</p>
        <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', margin: '0 0 20px' }}>
          Exercice {index + 1} / {exercices.length}
        </p>

        {estTemps ? (
          <p style={{ fontFamily: 'var(--font-title)', fontSize: 48, color: 'var(--color-primary)', margin: '0 0 20px' }}>
            {tempsRestant}s
          </p>
        ) : (
          <p style={{ fontSize: 16, margin: '0 0 20px' }}>
            {exercice.valeur_defaut} répétitions
          </p>
        )}

        {exercice.description && (
          <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', marginBottom: 20 }}>{exercice.description}</p>
        )}

        <button className="popup-btn popup-btn--primary" style={{ width: '100%' }} onClick={exerciceSuivant}>
          {index + 1 >= exercices.length ? 'Terminer' : 'Exercice suivant'}
        </button>
        <button className="popup-btn popup-btn--secondary" style={{ width: '100%', marginTop: 10 }} onClick={onTerminer}>
          Arrêter la routine
        </button>
      </div>
    </div>
  );
}
