import { useEffect, useRef, useState } from 'react';

export default function TestSprint({ onTermine }) {
  const [enCours, setEnCours] = useState(false);
  const [temps, setTemps] = useState(0);
  const debutRef = useRef(0);
  const intervalRef = useRef(null);

  function demarrer() {
    setEnCours(true);
    debutRef.current = Date.now();
    intervalRef.current = setInterval(() => {
      setTemps((Date.now() - debutRef.current) / 1000);
    }, 30);
  }

  function arreter() {
    clearInterval(intervalRef.current);
    setEnCours(false);
    onTermine(temps.toFixed(2));
  }

  useEffect(() => () => clearInterval(intervalRef.current), []);

  return (
    <div className="test-runner">
      <p className="test-chrono">{temps.toFixed(2)} s</p>
      {!enCours ? (
        <button className="quest-btn quest-btn--primary" onClick={demarrer}>Démarrer (au départ du sprint)</button>
      ) : (
        <button className="quest-btn quest-btn--secondary" onClick={arreter}>Arrêter (à l'arrivée, 30m)</button>
      )}
    </div>
  );
}
