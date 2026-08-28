/**
 * Scheda "Grafici": una card per sensore, raggruppate per MU.
 *
 * Riusa `ChartPreviewCard` (già esistente): la card apre il grafico storico e
 * permette scarico/cancellazione delle misure. Qui cambia solo la disposizione,
 * pensata per confrontare più sensori invece di aprirne uno alla volta.
 */
import { Row, Col } from "react-bootstrap";
import { BsBarChartFill } from "react-icons/bs";
import type { ControlUnitDTO } from "../../../API/interfaces";
import { ChartPreviewCard } from "../../../components/ChartPreviewCard";
import { useI18n } from "../../../i18n/I18nContext";

interface Props {
  cu: ControlUnitDTO;
  /** Segnala alla pagina che i dati vanno ricaricati (scarico/cancellazione). */
  onRefresh: () => void;
}

export function ChartsTab({ cu, onRefresh }: Props) {
  const { t } = useI18n();

  if (!cu.measurementUnits.length) {
    return <p className="text-muted">{t("charts.empty")}</p>;
  }

  return (
    <section>
      <h4 className="d-flex align-items-center gap-2 fw-bold mb-1">
        <BsBarChartFill className="text-primary" /> {t("charts.title")}
      </h4>
      <p className="text-muted small mb-4">{t("charts.subtitle")}</p>

      {[...cu.measurementUnits]
        .sort((a, b) => a.localId - b.localId)
        .map((mu) => (
          <div key={mu.id} className="mb-4">
            <h6 className="fw-bold font-monospace text-primary mb-3">
              MU h{(Number(mu.extendedId) & 0xffff).toString(16).toUpperCase()}
            </h6>

            <Row className="row-cols-1 row-cols-md-2 row-cols-xl-3 g-3">
              {[...mu.sensors]
                .sort((a, b) => a.sensorIndex - b.sensorIndex)
                .map((sensor) => (
                  <Col key={sensor.id}>
                    <ChartPreviewCard
                      sensorId={sensor.id}
                      measurementType={"avg-std"} // sensor.sensorTemplate?.measurementType || sensor.measurementType || TODO aggiistare con measurementType Dinamica
                      setDirty={onRefresh}
                    />
                  </Col>
                ))}
            </Row>
          </div>
        ))}
    </section>
  );
}

export default ChartsTab;
