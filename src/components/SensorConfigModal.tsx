import { useState, useMemo } from 'react';
import { Modal, Button, Accordion, ListGroup, Stack, Alert, Badge, Form } from 'react-bootstrap';

import { ControlUnitDTO, CUConfigurationDTO } from "../API/interfaces";
import { UpdateSensorsConfig } from "../API/ControlUnitAPI";
import { useAuth } from "../API/AuthContext";

const SAMPLING_OPTIONS = [
  { label: 'OFF', value: 0 },
  { label: '30s', value: 30 },
  { label: '1m', value: 60 },
  { label: '5m', value: 300 },
  { label: '15m', value: 900 },
];

const decodeIndexToLabel = (idx: number): string => {
  if (idx === 0) return "OFF";
  if (idx <= 9) return `${idx} ms`;
  if (idx <= 27) return `${10 + (idx - 10) * 5} ms`;
  if (idx <= 45) return `${100 + (idx - 28) * 50} ms`;
  if (idx <= 54) return `${1 + (idx - 46)} s`;
  if (idx <= 64) return `${10 + (idx - 55) * 5} s`;
  if (idx <= 73) return `${1 + (idx - 65)} m`;
  if (idx <= 83) return `${10 + (idx - 74) * 5} m`;
  if (idx <= 222) {
    const totalMin = 60 + (idx - 84) * 10;
    const h = Math.floor(totalMin / 60);
    const m = totalMin % 60;
    return m === 0 ? `${h}h` : `${h}h ${m}m`;
  }
  if (idx <= 246) return `${25 + (idx - 223)} h`;
  return "Out of Range";
};

interface Props {
  show: boolean;
  onHide: () => void;
  controlUnit: ControlUnitDTO;
}

export function SensorConfigModal({ show, onHide, controlUnit }: Props) {
  // Preleviamo il token direttamente dal contesto
  const { xsrfToken } = useAuth();

  // Inizializzazione dello stato locale basato sulla CU passata
  // Usiamo una funzione per calcolare lo stato iniziale solo alla creazione del componente
  const [config, setConfig] = useState<CUConfigurationDTO>(() => ({
    devEui: controlUnit.devEui,
    configurations: controlUnit.measurementUnits.map(mu => ({
      localId: mu.localId,
      sensors: mu.sensors.map(s => ({
        sensorIndex: s.sensorIndex,
        samplingPeriod: Math.round(s.samplingF)
      }))
    }))
  }));

  // Calcoliamo il numero totale di sensori attesi per la validazione
  const totalSensorsExpected = useMemo(() =>
    controlUnit.measurementUnits.reduce((acc, mu) => acc + mu.sensors.length, 0),
    [controlUnit]
  );

  // Calcoliamo se la configurazione è completa
  const isComplete = useMemo(() => {
    const currentTotal = config.configurations.reduce((acc, mu) => acc + mu.sensors.length, 0);
    return currentTotal === totalSensorsExpected;
  }, [config, totalSensorsExpected]);

  const handlePeriodChange = (muLocalId: number, sensorIdx: number, period: number) => {
    setConfig(prev => ({
      ...prev,
      configurations: prev.configurations.map(mu =>
        mu.localId === muLocalId
          ? {
            ...mu,
            sensors: mu.sensors.map(s =>
              s.sensorIndex === sensorIdx ? { ...s, samplingPeriod: period } : s
            )
          }
          : mu
      )
    }));
  };

  const handleSave = async () => {
    if (!isComplete) {
      alert("Errore: tutti i sensori devono avere un periodo impostato.");
      return;
    }

    try {
      await UpdateSensorsConfig(xsrfToken, config);
      alert("Configurazione inviata con successo!");
      onHide();
    } catch (e) {
      console.error(e);
      alert("Errore nell'invio della configurazione. Controlla i permessi.");
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>Configurazione Sensori: {controlUnit.name}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <p className="text-muted small">
          Devi impostare il periodo per <strong>tutti</strong> i sensori delle MU associate.
          Usa "OFF" per disabilitare il campionamento.
        </p>

        {!isComplete && (
          <Alert variant="danger" className="py-2">
            Configurazione incompleta: mancano dati per alcuni sensori.
          </Alert>
        )}

        <Accordion defaultActiveKey="0" className="mt-3">
          {controlUnit.measurementUnits.map((mu, muIdx) => (
            <Accordion.Item eventKey={muIdx.toString()} key={mu.id}>
              <Accordion.Header>
                <Stack>
                  <strong>MeasurementUnit #{mu.localId}</strong>
                  <small className="text-muted">Modello: {mu.model}</small>
                </Stack>
              </Accordion.Header>
              <Accordion.Body className="p-0">
                <ListGroup variant="flush">
                  {mu.sensors.map((sensor) => {
                    // Troviamo l'indice corrente (dovrai decidere se il DTO ora trasporta l'indice o i ms)
                    // Qui assumiamo che config.samplingPeriod sia l'INDICE (0-246) per semplicità di UI
                    const currentIdx = config.configurations
                      .find(c => c.localId === mu.localId)
                      ?.sensors.find(s => s.sensorIndex === sensor.sensorIndex)
                      ?.samplingPeriod || 0;

                    return (
                      <ListGroup.Item key={sensor.id} className="py-3">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <div className="fw-bold">{sensor.modelName}</div>
                          <Badge bg={currentIdx === 0 ? "secondary" : "primary"} style={{ fontSize: '1rem' }}>
                            {decodeIndexToLabel(currentIdx)}
                          </Badge>
                        </div>

                        <Form.Range
                          min={0}
                          max={246}
                          step={1}
                          value={currentIdx}
                          onChange={(e) => handlePeriodChange(mu.localId, sensor.sensorIndex, parseInt(e.target.value))}
                        />
                        <div className="d-flex justify-content-between mt-1 small text-muted">
                          <span>OFF</span>
                          <span>1s</span>
                          <span>1h</span>
                          <span>24h</span>
                          <span>48h</span>
                        </div>
                      </ListGroup.Item>
                    );
                  })}
                </ListGroup>
              </Accordion.Body>
            </Accordion.Item>
          ))}
        </Accordion>
      </Modal.Body>

      <Modal.Footer className="bg-light">
        <Button variant="outline-secondary" onClick={onHide}>
          Annulla
        </Button>
        <Button
          variant="primary"
          onClick={handleSave}
          disabled={!isComplete}
          className="px-4"
        >
          Invia a Control Unit
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
