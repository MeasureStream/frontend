/**
 * Barra delle schede del dettaglio CU.
 *
 * Le prime tre sono le viste di lettura (stato, grafici, allarmi); la quarta,
 * staccata a destra, è l'unica che SCRIVE sul dispositivo — la distanza visiva
 * è voluta, così non ci si finisce dentro per sbaglio.
 */
import { BsPencilSquare } from "react-icons/bs";
import { useI18n } from "../../../i18n/I18nContext";
import type { TranslationKey } from "../../../i18n/translations";

export type CUDetailTab = "overview" | "charts" | "alarms" | "sensorConfig";

/** Schede di lettura, nell'ordine in cui compaiono. */
const READ_TABS: { id: CUDetailTab; key: TranslationKey }[] = [
  { id: "overview", key: "detail.tabs.overview" },
  { id: "charts", key: "detail.tabs.charts" },
  { id: "alarms", key: "detail.tabs.alarms" },
];

interface Props {
  active: CUDetailTab;
  onChange: (tab: CUDetailTab) => void;
  /** Allarmi ancora da leggere: badge accanto alla scheda (0 = nessun badge). */
  alarmCount?: number;
}

export function CUDetailTabs({ active, onChange, alarmCount = 0 }: Props) {
  const { t } = useI18n();

  return (
    <div className="d-flex align-items-center gap-1 flex-wrap border-bottom mb-4">
      {READ_TABS.map((tab) => (
        <button
          key={tab.id}
          type="button"
          className={`ms-tab${active === tab.id ? " ms-tab-active" : ""}`}
          onClick={() => onChange(tab.id)}
        >
          {t(tab.key)}
          {tab.id === "alarms" && <span className="ms-chip-count">{alarmCount}</span>}
        </button>
      ))}

      <span className="flex-grow-1" />

      <button
        type="button"
        className={`btn btn-sm d-flex align-items-center gap-2 mb-1 ${
          active === "sensorConfig" ? "btn-primary" : "btn-outline-primary"
        }`}
        onClick={() => onChange("sensorConfig")}
      >
        <BsPencilSquare /> {t("detail.tabs.sensorConfig")}
      </button>
    </div>
  );
}
