import { useState, useMemo } from 'react';
import { Modal, Button, Accordion, ListGroup, Stack, Alert } from 'react-bootstrap';
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
                  <strong>Unità di Misura #{mu.localId}</strong>
                  <small className="text-muted">Modello: {mu.model}</small>
                </Stack>
              </Accordion.Header>
              <Accordion.Body className="p-0">
                <ListGroup variant="flush">
                  {mu.sensors.map((sensor) => {
                    const currentVal = config.configurations
                      .find(c => c.localId === mu.localId)
                      ?.sensors.find(s => s.sensorIndex === sensor.sensorIndex)
                      ?.samplingPeriod;

                    return (
                      <ListGroup.Item key={sensor.id} className="d-flex justify-content-between align-items-center py-3">
                        <div className="me-3">
                          <div className="fw-bold text-dark">{sensor.modelName}</div>
                          <div className="text-muted" style={{ fontSize: '0.75rem' }}>
                            Index: {sensor.sensorIndex}
                          </div>
                        </div>

                        <Stack direction="horizontal" gap={1}>
                          {SAMPLING_OPTIONS.map((opt) => (
                            <Button
                              key={opt.value}
                              size="sm"
                              variant={currentVal === opt.value ? "primary" : "outline-secondary"}
                              style={{ minWidth: '45px' }}
                              onClick={() => handlePeriodChange(mu.localId, sensor.sensorIndex, opt.value)}
                            >
                              {opt.label}
                            </Button>
                          ))}
                        </Stack>
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
