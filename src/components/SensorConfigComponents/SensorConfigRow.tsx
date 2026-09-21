/**
 * Una riga della tabella avanzata: un sensore, tutti i suoi parametri.
 *
 * Colonne: selezione · identità · periodo · misura · 6 campi numerici · stato.
 * Un campo si colora d'ambra appena diverge dal valore salvato, così si vede a
 * colpo d'occhio cosa partirà al prossimo poll.
 */
import { useI18n } from "../../i18n/I18nContext";
import { decodeSamplingIndex as decodePeriodIndex } from "../../API/protocol/scales";
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
    <tr className={`${selected ? "ms-cfg-row-sel" : ""}${status === "divergent" ? " ms-cfg-row-div" : ""}`}>
      {/* Identità del sensore: colonna fissa nello scorrimento orizzontale */}
      <td className="ms-col-sensor">
        <span className="d-flex align-items-center gap-2">
          <input type="checkbox" className="form-check-input mt-0" checked={selected} disabled={locked} onChange={onToggleSelect} />
          <span className={`ms-dot ms-dot-${status}`} />
          <span className="text-truncate">
            <span className={`d-block ms-sensor-name${isOff ? " text-muted" : ""}`}>
              {row.name}
              {locked && (
                <span className="ms-pill ms-pill-divergent ms-2" title={t("sensorConfig.lockedTitle")}>
                  {t("sensorConfig.locked")}
                </span>
              )}
            </span>
            <span className="d-block ms-sensor-meta">
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
          className={`ms-period-btn${isOff ? " ms-period-btn-off" : ""}`}
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
          className="ms-seg-sm"
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
          <td
            key={field.key}
            className={`text-end${field.unit === "roc" || field.unit === "cumulative" || field.unit === "minutes" ? " ms-cfg-dyn" : ""}`}
          >
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
              <span className={`ms-cfg-unit${disabled || value === null ? " ms-cfg-unit-off" : ""}`} style={{ minWidth: 34, textAlign: "left" }}>
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
