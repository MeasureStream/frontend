/**
 * Intestazione del dettaglio CU: identità a sinistra, i tre parametri sempre
 * visibili a destra (ultimo contatto, polling, batteria).
 *
 * Resta agganciata in alto durante lo scorrimento (classe `.ms-detail-header`
 * sul contenitore in ControlUnitDetail), così si sa sempre quale dispositivo
 * si sta guardando e in che stato è.
 */
import { BsGeoFill, BsPencil } from "react-icons/bs";
import { formatDevEui, type ControlUnitDTO } from "../../../API/interfaces";
import { ageSince, estimateNextPoll, formatClock, parseServerDate } from "../../../API/cuTiming";
import { BatteryDonut } from "../../../components/BatteryDonut";
import { useI18n } from "../../../i18n/I18nContext";
import type { TranslationKey } from "../../../i18n/translations";

/** Chiave di traduzione per ciascuna unità di età. */
const AGE_KEYS: Record<string, TranslationKey> = {
  now: "detail.age.now",
  minutes: "detail.age.minutes",
  hours: "detail.age.hours",
  days: "detail.age.days",
};

interface Props {
  cu: ControlUnitDTO;
  isOnline: boolean;
  onEditMetadata: () => void;
}

/** Blocco "etichetta + valore" dei parametri di destra. */
function Metric({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="ms-meta-label">{label}</div>
      <div className="ms-meta-value mt-1">{children}</div>
    </div>
  );
}

export function CUDetailHeader({ cu, isOnline, onEditMetadata }: Props) {
  const { t, locale } = useI18n();

  const lastSeen = parseServerDate(cu.lastSeen);
  const age = ageSince(lastSeen);
  const nextPoll = estimateNextPoll(cu.lastSeen, cu.pollingInterval);
  const externalPower = cu.acPowered || cu.isCharging;
  const battery = externalPower ? 100 : cu.remainingBattery;

  return (
    <div className="d-flex justify-content-between align-items-end gap-3 flex-wrap px-2">
      {/* Identità */}
      <div>
        <div className="d-flex align-items-center gap-2 mb-1">
          <h2 className="fw-bold mb-0" style={{ letterSpacing: "-0.5px" }}>{cu.name}</h2>
          <BsPencil
            className="text-muted"
            style={{ cursor: "pointer", fontSize: "0.95rem" }}
            onClick={onEditMetadata}
            title={t("detail.editMetadata")}
          />
          <span className="ms-state-pill">{isOnline ? t("devices.active") : t("devices.inactive")}</span>
        </div>
        <small className="text-muted font-monospace">
          EUI: {cu.devEui ? formatDevEui(cu.devEui) : t("common.notAvailable")}{" "}
          <BsGeoFill size={12} className="ms-1" /> {cu.semanticLocation || t("detail.noLocation")}
        </small>
      </div>

      {/* Parametri sempre visibili */}
      <div className="d-flex align-items-end gap-3">
        <Metric label={t("detail.header.lastContact")}>
          {lastSeen
            ? `${formatClock(lastSeen, locale)} · ${t(AGE_KEYS[age!.unit], { value: age!.value })}`
            : t("common.notAvailable")}
        </Metric>

        <span className="ms-meta-sep align-self-center">/</span>

        <Metric label={t("detail.header.polling")}>
          {t("detail.header.pollingHours", { hours: cu.pollingInterval })}
          {/* Su un nodo inattivo la stima del prossimo contatto non significa
              nulla: al suo posto si dichiara lo stato. */}
          {!isOnline ? (
            <span className="text-muted"> · {t("detail.header.inactiveNode")}</span>
          ) : (
            nextPoll && <> · {t("detail.header.nextAt", { time: formatClock(nextPoll, locale) })}</>
          )}
        </Metric>

        <span className="ms-meta-sep align-self-center">/</span>

        <Metric label={t("detail.header.battery")}>
          {/* Allineato al fondo della riga: sulla linea di base l'anello
              alzerebbe il blocco batteria rispetto alle altre due metriche. */}
          <span
            className="d-inline-flex align-items-center gap-2"
            style={{ height: "1.26rem", verticalAlign: "bottom" }}
          >
            {/* Diametro pari all'altezza della riga di testo: così l'anello
                resta allineato ai valori delle altre due metriche. */}
            <BatteryDonut percent={battery} size={18} externalPower={externalPower} />
            {battery}%
          </span>
        </Metric>
      </div>
    </div>
  );
}
