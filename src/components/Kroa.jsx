export default function Kroa({ size = 70 }) {
  return (
    <svg width={size} height={size * 0.85} viewBox="0 0 70 60" role="img" aria-label="Kroa, la mascotte">
      <ellipse cx="35" cy="38" rx="26" ry="18" fill="#0074D9" />
      <circle cx="22" cy="20" r="8" fill="#0074D9" />
      <circle cx="48" cy="20" r="8" fill="#0074D9" />
      <circle cx="22" cy="18" r="3.5" fill="#1C1E21" />
      <circle cx="48" cy="18" r="3.5" fill="#1C1E21" />
      <circle cx="26" cy="34" r="3" fill="#06345E" opacity="0.5" />
      <circle cx="44" cy="40" r="2.5" fill="#06345E" opacity="0.5" />
      <circle cx="35" cy="30" r="2" fill="#06345E" opacity="0.5" />
      <path d="M28 44 Q35 49 42 44" stroke="#06345E" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  );
}
