/**
 * Segmented control: una fila di bottoni mutuamente esclusivi.
 * Usato per i periodi rapidi e per le misure (in barra e dentro ogni riga).
 */

export interface SegmentedOption<T extends string | number> {
  value: T;
  label: string;
  /** Tooltip: serve a spiegare PERCHÉ un'opzione è disabilitata. */
  title?: string;
  disabled?: boolean;
}

interface Props<T extends string | number> {
  options: SegmentedOption<T>[];
  /** `null` = nessun valore attivo (ambito non omogeneo). */
  value: T | null;
  onChange: (value: T) => void;
  /** Accento verde della configurazione avanzata invece dell'ottanio. */
  accent?: boolean;
  className?: string;
}

export function SegmentedControl<T extends string | number>({ options, value, onChange, accent, className }: Props<T>) {
  return (
    <span className={`ms-seg${accent ? " ms-seg-accent" : ""}${className ? ` ${className}` : ""}`}>
      {options.map((opt) => (
        <button
          key={String(opt.value)}
          type="button"
          title={opt.title}
          disabled={opt.disabled}
          className={opt.value === value ? "ms-seg-on" : undefined}
          onClick={() => onChange(opt.value)}
        >
          {opt.label}
        </button>
      ))}
    </span>
  );
}
