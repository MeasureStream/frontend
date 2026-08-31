/**
 * Anello di copertura: percentuale di sensori con certificato valido.
 *
 * Stesso linguaggio grafico dell'anello di batteria nell'intestazione CU, ma
 * con la soglia tarata sulla metrologia: sotto il 60% il colore vira, perché
 * una copertura bassa non è un dettaglio ma una non conformità di sistema.
 */

interface Props {
  percent: number;
  size?: number;
}

export function CoverageRing({ percent, size = 22 }: Props) {
  const value = Math.max(0, Math.min(100, percent));
  const stroke = Math.max(2.5, size * 0.14);
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;

  const color =
    value < 60 ? "var(--ms-crimson)" : value < 85 ? "var(--ms-orange)" : "var(--ms-marrs-green)";

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label={`${value}%`}>
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="var(--ms-line)" strokeWidth={stroke} />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={circumference * (1 - value / 100)}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
    </svg>
  );
}
