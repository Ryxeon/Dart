const AXES = [
  { key: 'detente', label: 'Détente' },
  { key: 'endurance', label: 'Endurance' },
  { key: 'intelligence', label: 'Intelligence' },
  { key: 'technique', label: 'Technique' },
  { key: 'rapidite', label: 'Rapidité' },
  { key: 'force', label: 'Force' },
];

export default function Radar({ competences }) {
  const cx = 110, cy = 110, maxR = 90;

  function point(i, valeur) {
    const angle = (Math.PI * 2 * i) / AXES.length - Math.PI / 2;
    const r = (valeur / 5) * maxR;
    return [cx + r * Math.cos(angle), cy + r * Math.sin(angle)];
  }

  function labelPoint(i) {
    const angle = (Math.PI * 2 * i) / AXES.length - Math.PI / 2;
    const r = maxR + 18;
    return [cx + r * Math.cos(angle), cy + r * Math.sin(angle)];
  }

  const zonePoints = AXES.map((a, i) => point(i, competences[a.key] || 0)).map((p) => p.join(',')).join(' ');

  return (
    <svg width="100%" viewBox="0 0 220 220" role="img" aria-label="Radar de compétences">
      <g stroke="var(--color-border)" strokeWidth="1" fill="none">
        {[1, 2, 3].map((n) => (
          <polygon
            key={n}
            points={AXES.map((a, i) => point(i, (n / 3) * 5).join(',')).join(' ')}
          />
        ))}
        {AXES.map((a, i) => {
          const [x, y] = point(i, 5);
          return <line key={a.key} x1={cx} y1={cy} x2={x} y2={y} />;
        })}
      </g>

      <polygon points={zonePoints} fill="var(--color-accent-light)" stroke="var(--color-accent)" strokeWidth="2" />

      {AXES.map((a, i) => {
        const [x, y] = labelPoint(i);
        return (
          <text key={a.key} x={x} y={y} textAnchor="middle" fontSize="10" fill="var(--color-text-secondary)">
            {a.label}
          </text>
        );
      })}
    </svg>
  );
}
