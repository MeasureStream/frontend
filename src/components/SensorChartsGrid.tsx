/**
 * La griglia dei grafici di una MU: una card per sensore, due per riga.
 *
 * Stava dentro la scheda «Grafici» della CU, che però itera le MU del dispositivo. La stessa
 * griglia serve alla pagina di una MU presa da sola — dove di CU non ce n'è nessuna — quindi
 * prende in ingresso dei sensori e non un dispositivo. Due per riga: con tre i punti
 * diventavano illeggibili sulle scale strette.
 */
import { Row, Col } from "react-bootstrap";
import type { SensorDTO } from "../API/interfaces";
import { ChartPreviewCard } from "./ChartPreviewCard";
import { sensorType } from "../API/sensorConfig/sensorConfigAdapter";
import { useI18n } from "../i18n/I18nContext";

/** `MU hA1B2`: le ultime due parole dell'EUI, come la MU si chiama in tutta l'interfaccia. */
export function muLabel(extendedId: number): string {
  return `MU h${(Number(extendedId) & 0xffff).toString(16).toUpperCase()}`;
}

interface Props {
  sensors: SensorDTO[];
  /** Nome della MU: lo ripete il modal del grafico, che deve bastare a sé stesso. */
  label: string;
  /**
   * Ultimo contatto: il pannello si ricarica solo se il dispositivo si è fatto vivo, perché
   * senza un contatto nuovo i dati sarebbero gli stessi.
   */
  lastContact?: string | null;
}

export function SensorChartsGrid({ sensors, label, lastContact }: Props) {
  const { t } = useI18n();

  return (
    <Row className="row-cols-1 row-cols-lg-2 g-4">
      {[...sensors]
        .sort((a, b) => a.sensorIndex - b.sensorIndex)
        .map((sensor) => (
          <Col key={sensor.id}>
            <ChartPreviewCard
              sensorId={sensor.id}
              sensor={sensor}
              // Nella card basta il tipo di sensore; la MU la ripete il modal.
              title={sensorType(sensor.template, t).label}
              muLabel={label}
              lastContact={lastContact}
              // TODO passo 11: il tipo di misura attivo si ricava dalle metriche dello slot
              // nel modello di MU, non piu' da una costante.
              measurementType={"avg-std"}
            />
          </Col>
        ))}
    </Row>
  );
}
