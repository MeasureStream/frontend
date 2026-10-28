/**
 * Scheda "Configurazione Sensori": l'unica vista che scrive sul dispositivo.
 *
 * In cima sta l'intervallo di trasmissione, e non per simmetria: il comando dei periodi lo
 * trasporta nel suo primo blocco come valore assoluto, e sulla scala lo zero significa «non
 * trasmettere». Finché non è configurato, il server rifiuta la configurazione dei sensori —
 * quindi la cosa da sistemare per prima è la prima che si legge.
 *
 * Sotto, due modi di lavorare sugli stessi dati:
 *   1. Configurazione rapida — si sceglie un ambito e si applica a tutti
 *      (genera i payload più economici: un valore per molti sensori);
 *   2. Configurazione avanzata — tabella completa, sensore per sensore.
 *
 * Lo stato vive in `useSensorConfig`; qui si compone soltanto la pagina.
 */
import { Col, Row } from "react-bootstrap";
import type { ControlUnitDTO } from "../../../API/interfaces";
import { useI18n } from "../../../i18n/I18nContext";
import { useSensorConfig } from "../../../components/SensorConfigComponents/useSensorConfig";
import { QuickConfigPanel } from "../../../components/SensorConfigComponents/QuickConfigPanel";
import { AdvancedConfigPanel } from "../../../components/SensorConfigComponents/AdvancedConfigPanel";
import { ConfigStatusLegend } from "../../../components/SensorConfigComponents/ConfigStatusLegend";
import { TransmissionIntervalBar } from "../../../components/TransmissionInterval/TransmissionIntervalBar";
import { AutoRestoreCard } from "../../../components/TransmissionInterval/AutoRestoreCard";

export function SensorConfigTab({ cu, onRefresh }: { cu: ControlUnitDTO; onRefresh: () => void }) {
  const { t } = useI18n();
  const state = useSensorConfig(cu);

  if (!state.rows.length) {
    return (
      <section className="d-flex flex-column gap-3">
        <Row className="g-3">
          <Col lg={8}>
            <TransmissionIntervalBar
              cu={cu}
              index={state.transmissionIndex}
              onChange={state.setTransmissionIndex}
              onApplied={onRefresh}
            />
          </Col>
          <Col lg={4}>
            <AutoRestoreCard cu={cu} onApplied={onRefresh} />
          </Col>
        </Row>
        <p className="text-muted mb-0">{t("sensorConfig.noSensors")}</p>
      </section>
    );
  }

  return (
    <section className="d-flex flex-column gap-3">
      <Row className="g-3">
        <Col lg={8}>
          <TransmissionIntervalBar
              cu={cu}
              index={state.transmissionIndex}
              onChange={state.setTransmissionIndex}
              onApplied={onRefresh}
            />
        </Col>
        <Col lg={4}>
          <AutoRestoreCard cu={cu} onApplied={onRefresh} />
        </Col>
      </Row>
      <QuickConfigPanel state={state} />
      <AdvancedConfigPanel state={state} />
      <ConfigStatusLegend />
    </section>
  );
}
