/**
 * L'intervallo di trasmissione, in cima alla configurazione sensori.
 *
 * Non è un doppione del comando che sta nella scheda principale: è lì perché **senza di lui
 * la configurazione dei sensori non può partire**. Il comando 0x21 porta il periodo di
 * trasmissione nel suo primo blocco, come valore assoluto, e sulla scala lo zero significa
 * «non trasmettere»: configurare i periodi con la trasmissione a zero direbbe alla CU di
 * campionare e poi tacere. Il server infatti la rifiuta, e questo blocco è il posto dove
 * rimediare senza cambiare scheda.
 */
import { useState } from "react";
import { Alert, Button, Spinner } from "react-bootstrap";
import { BsBroadcast } from "react-icons/bs";
import type { ControlUnitDTO } from "../../API/interfaces";
import { ControlTransmission } from "../../API/ControlUnitAPI";
import { useAuth } from "../../API/AuthContext";
import { useI18n } from "../../i18n/I18nContext";
import { maxTransmissionIndex, transmissionTicks } from "../../API/protocol/scales";
import { RangeTicks } from "../RangeTicks";
import { transmissionLabel, transmissionTickLabel } from "./transmissionLabels";

export function TransmissionIntervalBar({
  cu,
  onApplied,
}: {
  cu: ControlUnitDTO;
  onApplied?: () => void;
}) {
  const { t } = useI18n();
  const { xsrfToken } = useAuth();

  const [index, setIndex] = useState(cu.transmissionInterval);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /** Vero finché il dispositivo non ha un periodo: è la condizione che blocca la 0x21. */
  const notConfigured = cu.transmissionInterval <= 0;
  const changed = index !== cu.transmissionInterval;

  const apply = async () => {
    if (sending) return;
    setSending(true);
    setError(null);
    try {
      await ControlTransmission(xsrfToken, { devEui: cu.devEui, transmissionIndex: index });
      onApplied?.();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setSending(false);
    }
  };

  return (
    <section className="ms-cfg-panel shadow-sm p-3">
      <div className="d-flex align-items-center gap-2 mb-2">
        <BsBroadcast size={17} className="text-primary" />
        <span className="ms-cfg-title">{t("sensorConfig.transmission.title")}</span>
        <span className="ms-cfg-note">{t("sensorConfig.transmission.subtitle")}</span>
        <span className="flex-grow-1" />
        <span
          className={`ms-badge font-monospace ${notConfigured ? "ms-badge-alert" : "ms-badge-accent"}`}
        >
          {transmissionLabel(cu.transmissionInterval, t)}
        </span>
      </div>

      {notConfigured && (
        <Alert variant="warning" className="py-2 small mb-2">
          {t("sensorConfig.transmission.required")}
        </Alert>
      )}

      <div className="d-flex align-items-center gap-3 flex-wrap">
        <div className="flex-grow-1" style={{ minWidth: 260 }}>
          <input
            type="range"
            className="form-range"
            min="0"
            max={maxTransmissionIndex()}
            value={index}
            disabled={sending}
            onChange={(e) => setIndex(parseInt(e.target.value))}
          />
          <RangeTicks
            max={maxTransmissionIndex()}
            ticks={transmissionTicks((i) => transmissionTickLabel(i, t))}
          />
        </div>

        <div className="text-nowrap">
          <span className="ms-cfg-label me-2">{transmissionLabel(index, t)}</span>
          <Button size="sm" variant="primary" disabled={!changed || sending} onClick={apply}>
            {sending && <Spinner animation="border" size="sm" className="me-2" />}
            {t("sensorConfig.transmission.apply")}
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="danger" className="py-2 small mb-0 mt-2">
          {error}
        </Alert>
      )}
    </section>
  );
}
