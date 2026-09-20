export default function LineChart({ points, height = 100 }) {
  if (!points || points.length === 0) return <p className="placeholder-text">Pas encore de données.</p>;
  if (points.length === 1) {
    return <p className="placeholder-text">Ajoute au moins 2 résultats pour voir une évolution.</p>;
  }

  const width = 280;
  const max = Math.max(...points, 100);
  const min = Math.min(...points, 0);
  const range = max - min || 1;

  const coords = points.map((p, i) => {
    const x = (i / (points.length - 1)) * (width - 20) + 10;
    const y = height - 10 - ((p - min) / range) * (height - 20);
    return [x, y];
  });

  const chemin = coords.map((c) => c.join(',')).join(' ');

  return (
    <svg width="100%" viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Évolution dans le temps">
      <polyline points={chemin} fill="none" stroke="var(--color-accent)" strokeWidth="2" />
      {coords.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="3" fill="var(--color-accent)" />
      ))}
    </svg>
  );
}
