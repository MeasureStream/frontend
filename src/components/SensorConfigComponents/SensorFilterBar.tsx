/**
 * Barra dei filtri della tabella avanzata: ricerca testuale + filtri di stato.
 * I contatori accanto a ogni filtro dicono quanto lavoro c'è da fare senza
 * doverlo cercare riga per riga.
 */
import { BsFunnel, BsSearch } from "react-icons/bs";
import { useI18n } from "../../i18n/I18nContext";
import { rowStatus, type SensorConfigRow } from "../../API/sensorConfig/sensorConfigTypes";
import type { RowFilter } from "./useSensorConfig";
import type { TranslationKey } from "../../i18n/translations";

interface Props {
  rows: SensorConfigRow[];
  shownCount: number;
  query: string;
  filter: RowFilter;
  onQuery: (value: string) => void;
  onFilter: (filter: RowFilter) => void;
}

const FILTER_KEYS: { id: RowFilter; key: TranslationKey }[] = [
  { id: "all", key: "sensorConfig.filterAll" },
  { id: "pending", key: "sensorConfig.filterPending" },
  { id: "divergent", key: "sensorConfig.filterDivergent" },
  { id: "withThresholds", key: "sensorConfig.filterWithThresholds" },
  { id: "off", key: "sensorConfig.filterOff" },
];

/** Quanti sensori ricadono in ciascun filtro (stessa regola del filtraggio). */
function countFor(rows: SensorConfigRow[], filter: RowFilter): number {
  switch (filter) {
    case "pending": return rows.filter((r) => rowStatus(r) === "pending").length;
    case "divergent": return rows.filter((r) => rowStatus(r) === "divergent").length;
    case "withThresholds":
      return rows.filter((r) => r.values.thHigh !== null || r.values.thLow !== null || r.values.roc !== null).length;
    case "off": return rows.filter((r) => r.values.period === 0).length;
    default: return rows.length;
  }
}

export function SensorFilterBar({ rows, shownCount, query, filter, onQuery, onFilter }: Props) {
  const { t } = useI18n();

  return (
    <div className="ms-cfg-section d-flex align-items-center gap-3 flex-wrap">
      <span className="d-flex align-items-center gap-2 fw-bold">
        <BsFunnel style={{ color: "var(--ms-marrs-green)" }} />
        {t("sensorConfig.filter")}
      </span>

      <span className="position-relative d-flex align-items-center">
        <BsSearch className="position-absolute text-muted" style={{ left: 10, fontSize: "0.8rem" }} />
        <input
          type="search"
          className="form-control form-control-sm ps-4"
          style={{ width: 240 }}
          placeholder={t("sensorConfig.search")}
          value={query}
          onChange={(e) => onQuery(e.target.value)}
        />
      </span>

      <span className="d-flex gap-1 flex-wrap">
        {FILTER_KEYS.map(({ id, key }) => (
          <button
            key={id}
            type="button"
            className={`ms-chip ms-chip-filter${filter === id ? " ms-chip-on" : ""}`}
            onClick={() => onFilter(id)}
          >
            {t(key)}
            <span className="ms-chip-count">{countFor(rows, id)}</span>
          </button>
        ))}
      </span>

      <span className="flex-grow-1" />
      <span className="small text-muted">
        {shownCount === rows.length
          ? t("sensorConfig.shownAll", { total: rows.length })
          : t("sensorConfig.shownSome", { shown: shownCount, total: rows.length })}
      </span>
    </div>
  );
}
