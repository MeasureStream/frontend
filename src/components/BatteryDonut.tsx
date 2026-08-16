/**
 * Indicatore di batteria ad anello.
 *
 * SVG puro (nessuna dipendenza): un cerchio di fondo e uno di riempimento a cui
 * si accorcia il tratteggio in proporzione alla carica. Il colore segue la
 * stessa regola delle card dispositivo: salvia, arancione sotto il 20 %,
 * cremisi sotto il 10 %.
 */

interface Props {
  /** Percentuale 0–100. */
  percent: number;
  /** Diametro in pixel. */
  size?: number;
  /** Alimentazione esterna o in carica: l'anello resta salvia. */
  externalPower?: boolean;
}

export function BatteryDonut({ percent, size = 26, externalPower = false }: Props) {
  const value = Math.max(0, Math.min(100, percent));
  const stroke = Math.max(2.5, size * 0.13);
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;

  const color = externalPower
    ? "var(--ms-sage)"
    : value < 10
      ? "var(--ms-crimson)"
      : value < 20
        ? "var(--ms-orange)"
        : "var(--ms-marrs-green)";

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
        /* Si parte dalle 12 in punto e si gira in senso orario. */
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
    </svg>
  );
}
