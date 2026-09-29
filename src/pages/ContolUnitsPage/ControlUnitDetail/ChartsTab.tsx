/**
 * Scheda "Grafici": una card per sensore, raggruppate per MU.
 *
 * Riusa `ChartPreviewCard` (già esistente): la card apre il grafico storico.
 * Qui cambia solo la disposizione, pensata per confrontare più sensori invece
 * di aprirne uno alla volta. Due card per riga: con tre i punti diventavano
 * illeggibili sulle scale strette.
 */
import { Row, Col } from "react-bootstrap";
import { BsBarChartFill } from "react-icons/bs";
import type { ControlUnitDTO } from "../../../API/interfaces";
import { ChartPreviewCard } from "../../../components/ChartPreviewCard";
import { sensorType } from "../../../API/sensorConfig/sensorConfigAdapter";
import { useI18n } from "../../../i18n/I18nContext";

interface Props {
  cu: ControlUnitDTO;
  /**
   * Segnala alla pagina che i dati vanno ricaricati. Oggi non usato: serviva a
   * scarico e cancellazione delle misure, tolti finché non tornano su sensor-manager.
   */
  onRefresh: () => void;
}

/** Etichetta della MU, la stessa usata dalle card dei sensori. */
function muLabel(extendedId: number): string {
  return `MU h${(Number(extendedId) & 0xffff).toString(16).toUpperCase()}`;
}

export function ChartsTab({ cu }: Props) {
  const { t } = useI18n();

  if (!cu.measurementUnits.length) {
    return <p className="text-muted">{t("charts.empty")}</p>;
  }

  return (
    <section>
      <h4 className="d-flex align-items-center gap-2 fw-bold mb-1">
        <BsBarChartFill className="text-primary" /> {t("charts.title")}
      </h4>

      {[...cu.measurementUnits]
        .sort((a, b) => a.localId - b.localId)
        .map((mu) => (
          <div key={mu.id} className="mb-5">
            {/* La MU si dichiara una volta sola, grande, in testa al suo gruppo: nelle
                card sotto sarebbe la stessa scritta ripetuta per ogni sensore. */}
            <h3 className="fw-bold font-monospace text-primary mb-3">{muLabel(mu.extendedId)}</h3>

            <Row className="row-cols-1 row-cols-lg-2 g-4">
              {[...mu.sensors]
                .sort((a, b) => a.sensorIndex - b.sensorIndex)
                .map((sensor) => (
                  <Col key={sensor.id}>
                    <ChartPreviewCard
                      sensorId={sensor.id}
                      sensor={sensor}
                      // Nella card basta il tipo di sensore; la MU la ripete il modal,
                      // che si apre da solo e deve bastare a sé stesso.
                      title={sensorType(sensor.template, t).label}
                      muLabel={muLabel(mu.extendedId)}
                      // TODO passo 11: il tipo di misura attivo si ricava dalle metriche
                      // dello slot nel modello di MU, non piu' da una costante.
                      measurementType={"avg-std"}
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
