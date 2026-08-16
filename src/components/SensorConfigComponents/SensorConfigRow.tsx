/**
 * Una riga della tabella avanzata: un sensore, tutti i suoi parametri.
 *
 * Colonne: selezione · identità · periodo · misura · 6 campi numerici · stato.
 * Un campo si colora d'ambra appena diverge dal valore salvato, così si vede a
 * colpo d'occhio cosa partirà al prossimo poll.
 */
import { useI18n } from "../../i18n/I18nContext";
import { decodePeriodIndex } from "../../API/sensorConfig/samplingScale";
import {
  MEASURES,
  VALUE_FIELDS,
  fieldUnitLabel,
  rowStatus,
  type MeasureId,
  type SensorConfigRow as Row,
  type ValueField,
} from "../../API/sensorConfig/sensorConfigTypes";
import { SegmentedControl } from "./SegmentedControl";
import { StatusPill } from "./ConfigStatusLegend";

interface Props {
  row: Row;
  selected: boolean;
  onToggleSelect: () => void;
  onOpenPeriod: (anchor: DOMRect) => void;
  onMeasure: (measure: MeasureId) => void;
  onField: (field: ValueField, value: number | null) => void;
}

export function SensorConfigTableRow({ row, selected, onToggleSelect, onOpenPeriod, onMeasure, onField }: Props) {
  const { t } = useI18n();
  const status = rowStatus(row);
  const isOff = row.values.period === 0;
  const locked = !row.configurable;

  return (
    <tr className={selected ? "ms-cfg-row-sel" : undefined}>
      {/* Identità del sensore */}
      <td>
        <span className="d-flex align-items-center gap-2">
          <input type="checkbox" className="form-check-input mt-0" checked={selected} disabled={locked} onChange={onToggleSelect} />
          <span className={`ms-dot ms-dot-${status}`} />
          <span className="text-truncate">
            <span className={`d-block font-monospace fw-semibold${isOff ? " text-muted" : ""}`} style={{ fontSize: "0.78rem" }}>
              {row.name}
              {locked && (
                <span className="ms-pill ms-pill-divergent ms-2" title={t("sensorConfig.lockedTitle")}>
                  {t("sensorConfig.locked")}
                </span>
              )}
            </span>
            <span className="d-block text-muted" style={{ fontSize: "0.66rem" }}>
              {t("sensorConfig.channel", { ch: row.sensorIndex })} ·{" "}
              {isOff ? t("sensorConfig.samplingOff") : row.liveValue} · u = {row.uncertainty} {row.unit}
            </span>
          </span>
        </span>
      </td>

      {/* Periodo */}
      <td>
        <button
          type="button"
          className="btn btn-sm btn-outline-secondary font-monospace fw-bold"
          disabled={locked}
          onClick={(e) => onOpenPeriod(e.currentTarget.getBoundingClientRect())}
        >
          {decodePeriodIndex(row.values.period)}
        </button>
      </td>

      {/* Misura */}
      <td>
        <SegmentedControl
          accent
          options={MEASURES.map((m) => {
            const unsupported = !row.allowedMeasures.includes(m.id);
            return {
              value: m.id,
              label: m.short,
              disabled: unsupported || isOff || locked,
              title: unsupported ? t("sensorConfig.measureNotInTemplate", { measure: t(m.labelKey) }) : t(m.labelKey),
            };
          })}
          value={isOff ? null : row.values.measure}
          onChange={onMeasure}
        />
      </td>

      {/* Campi numerici */}
      {VALUE_FIELDS.map((field) => {
        const value = row.values[field.key];
        const disabled = locked || isOff || (field.onlyWithPercentile && row.values.measure !== "pct");
        const dirty = value !== row.saved[field.key];
        return (
          <td key={field.key} className={field.unit === "roc" || field.unit === "cumulative" || field.unit === "minutes" ? "ms-cfg-dyn text-end" : "text-end"}>
            <span className="d-flex align-items-center gap-1 justify-content-end">
              <input
                type="number"
                className={`ms-cfg-input${dirty ? " ms-cfg-input-dirty" : ""}`}
                step={field.unit === "sensor" ? row.step : 1}
                value={value === null ? "" : value}
                disabled={disabled}
                placeholder={disabled ? "—" : field.short}
                title={field.onlyWithPercentile && row.values.measure !== "pct" ? t("sensorConfig.pctOnlyWithPercentile") : undefined}
                onChange={(e) => onField(field.key, e.target.value === "" ? null : Number(e.target.value))}
              />
              <span className="text-muted font-monospace" style={{ fontSize: "0.62rem", minWidth: 34 }}>
                {fieldUnitLabel(field, row.unit, row.rocUnit)}
              </span>
            </span>
          </td>
        );
      })}

      {/* Stato di consegna */}
      <td className="text-end">
        <StatusPill status={status} />
      </td>
    </tr>
  );
}
