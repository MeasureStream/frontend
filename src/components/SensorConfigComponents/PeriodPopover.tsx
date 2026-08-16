/**
 * Popover del periodo di campionamento di un singolo sensore.
 *
 * Non è un menu a tendina perché la scala ha 247 posizioni: serve uno slider
 * (grana fine) più i preset (i casi frequenti). Si posiziona sotto al pulsante
 * che l'ha aperto e si ribalta sopra se non c'è spazio.
 */
import { useEffect } from "react";
import { useI18n } from "../../i18n/I18nContext";
import { MAX_PERIOD_INDEX, PERIOD_PRESETS, decodePeriodIndex } from "../../API/sensorConfig/samplingScale";
import type { SensorConfigRow } from "../../API/sensorConfig/sensorConfigTypes";
import { SegmentedControl } from "./SegmentedControl";

interface Props {
  row: SensorConfigRow;
  /** Posizione del pulsante che ha aperto il popover. */
  anchor: DOMRect;
  onChange: (period: number) => void;
  onClose: () => void;
}

const WIDTH = 300;
const HEIGHT = 180;

export function PeriodPopover({ row, anchor, onChange, onClose }: Props) {
  const { t } = useI18n();

  /* Chiusura su Esc: il click fuori è gestito dal velo trasparente sotto. */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const flipUp = anchor.bottom + 8 + HEIGHT > window.innerHeight - 8;
  const top = flipUp ? Math.max(8, anchor.top - 8 - HEIGHT) : anchor.bottom + 8;
  const left = Math.max(10, Math.min(anchor.left, window.innerWidth - WIDTH - 14));

  return (
    <>
      {/* Velo trasparente: un click qualsiasi fuori dal popover lo chiude. */}
      <div className="position-fixed top-0 start-0 w-100 h-100" style={{ zIndex: 1070 }} onClick={onClose} />

      <div className="ms-popover" style={{ top, left }}>
        <div className="d-flex justify-content-between align-items-center mb-1">
          <span className="small fw-bold text-uppercase text-muted">{t("sensorConfig.periodTitle")}</span>
          <span className="fw-bold font-monospace" style={{ color: "var(--ms-marrs-green)" }}>
            {decodePeriodIndex(row.values.period)}
          </span>
        </div>
        <div className="small text-muted font-monospace mb-2">
          {row.name} · {t("sensorConfig.channel", { ch: row.sensorIndex })}
        </div>

        <input
          type="range"
          className="form-range"
          min={0}
          max={MAX_PERIOD_INDEX}
          step={1}
          value={row.values.period}
          onChange={(e) => onChange(parseInt(e.target.value, 10))}
        />

        <div className="d-flex justify-content-between mt-2">
          <SegmentedControl
            accent
            options={PERIOD_PRESETS.map((p) => ({ value: p.index, label: p.label }))}
            value={PERIOD_PRESETS.some((p) => p.index === row.values.period) ? row.values.period : null}
            onChange={onChange}
          />
        </div>

        <div className="text-muted mt-2" style={{ fontSize: "0.68rem", lineHeight: 1.45 }}>
          {t("sensorConfig.periodNote", { hysteresis: (row.uncertainty * 2).toFixed(2), unit: row.unit })}
        </div>
      </div>
    </>
  );
}
