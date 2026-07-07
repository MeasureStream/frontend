interface Tick {
  value: number;
  label: string;
}

/**
 * Etichette di riferimento per uno slider (Form.Range / input range).
 * A differenza di "justify-content-between", ogni etichetta viene posizionata
 * alla percentuale REALE del proprio valore sull'asse dello slider, così la
 * posizione del cursore coincide sempre con le tacche mostrate.
 * Riusare questo componente per ogni nuova barra (la scala è NON lineare!).
 */
export function RangeTicks({ max, ticks, min = 0 }: { max: number; ticks: Tick[]; min?: number }) {
  return (
    <div className="position-relative mt-1 text-muted small" style={{ height: "1.4em" }}>
      {ticks.map((t) => {
        const pct = ((t.value - min) / (max - min)) * 100;
        // Le etichette agli estremi non devono uscire dallo slider
        const transform =
          pct <= 0 ? "translateX(0)" : pct >= 100 ? "translateX(-100%)" : "translateX(-50%)";
        return (
          <span
            key={t.value}
            className="position-absolute text-nowrap"
            style={{ left: `${pct}%`, transform }}
          >
            {t.label}
          </span>
        );
      })}
    </div>
  );
}
