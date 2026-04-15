import { Container, Row, Col, Card, Badge, ListGroup, ProgressBar, Button } from "react-bootstrap";
import { BsCpu, BsGear, BsThermometerHalf, BsDroplet, BsSpeedometer, BsToggles, BsActivity, BsBroadcast } from "react-icons/bs";
import { ControlUnitDTO, formatDevEui } from "../../../API/interfaces";
import { useParams } from "react-router";
import { useEffect, useState } from "react";
import ChartPreviewCard from "../../../components/ChartPreviewCard";
import { ChartModalButton } from "../../../components/ChartModalButton";
import { MeasurementUnitCard } from "../../../components/MeasurementUnitCard";
import { getControlUnitById } from "../../../API/ControlUnitAPI";
import { ConfigCUModal } from "../../../components/ConfigCUModal";
import { SensorConfigModal } from "../../../components/SensorConfigModal";

export function ControlUnitDetail({ allControlUnits }: { allControlUnits: ControlUnitDTO[] }) {
  const { id } = useParams<{ id: string }>();
  const cuId = Number(id);

  // Stato locale per gestire l'aggiornamento della singola CU
  const [currentCU, setCurrentCU] = useState<ControlUnitDTO | null>(null);
  const [showConfig, setShowConfig] = useState(false);
  const [showSensorConfig, setShowSensorConfig] = useState(false);
  const [acqIndex, setAcqIndex] = useState(0);

  // Inizializzazione: se allControlUnits cambia o l'ID cambia, cerchiamo la CU
  useEffect(() => {
    const found = allControlUnits.find(unit => unit.id === cuId);
    if (found) setCurrentCU(found);
  }, [allControlUnits, cuId]);

  // Funzione di refresh specifica per QUESTA unità
  const refreshSingleCU = async () => {
    try {
      const updatedCU = await getControlUnitById(cuId);
      setCurrentCU(updatedCU);
      console.log(`Dati aggiornati per CU ${cuId} alle ${new Date().toLocaleTimeString()}`);
    } catch (err) {
      console.error("Refresh fallito:", err);
    }
  };

  // Polling ogni minuto
  useEffect(() => {
    const interval = setInterval(refreshSingleCU, 60000);
    return () => clearInterval(interval);
  }, [cuId]);
  // Stub per la funzione setDirty richiesta dalla card
  const handleSetDirty = () => {
    console.log("Data marked as dirty");
  };

  const handleStartAcquisition = () => {
    console.log(`Inviando comando START con intervallo indice: ${acqIndex} (${decodeIndexToLabel(acqIndex)})`);
    // Qui chiamerai la tua API verso il backend Rust/Java
  };

  const handleStopAcquisition = () => {
    setAcqIndex(0);
    console.log("Inviando comando STOP");
  };


  const cu = currentCU;

  if (!cu) return <Container className="py-5"><h1>CU non trovata</h1></Container>;

  const airtimeLimit = 30000;
  const airtimePercentage = Math.min((cu.usedDailyAirtime / airtimeLimit) * 100, 100);

  return (
    <Container className="py-4">
      {/* --- HEADER CU --- */}
      {/* --- HEADER MINIMAL --- */}
      <div className="d-flex justify-content-between align-items-end mb-4 px-2">
        <div>
          <div className="d-flex align-items-center gap-2 mb-1">
            <h2 className="fw-bold mb-0" style={{ letterSpacing: '-0.5px' }}>{cu.name}</h2>
            <Badge pill bg={cu.lastSeen ? "success" : "secondary"} style={{ fontSize: '0.65rem', verticalAlign: 'middle' }}>
              {cu.lastSeen ? "ACTIVE" : "INACTIVE"}
            </Badge>
          </div>
          <small className="text-muted font-monospace">
            EUI: {cu.devEui ? formatDevEui(cu.devEui) : "N/D"} • {cu.semanticLocation || "No Location"}
          </small>
        </div>
        <div className="text-end" style={{ minWidth: '150px' }}>
          <div className="d-flex justify-content-between mb-1">
            <small className="fw-bold text-muted" style={{ fontSize: '0.75rem' }}>BATTERY</small>
            <small className="fw-bold" style={{ fontSize: '0.75rem' }}>{cu.remainingBattery}%</small>
          </div>
          <ProgressBar now={cu.remainingBattery} variant={cu.remainingBattery < 20 ? "danger" : "success"} style={{ height: '4px' }} className="bg-light border" />
        </div>
      </div>

      {/* --- METRICS GRID (PIÙ PULITA) --- */}
      <Row className="g-3 mb-5">
        {/* Network Health */}
        <Col md={4}>
          <div className="p-3 bg-white rounded shadow-sm border-0 h-100">
            <div className="d-flex align-items-center gap-2 mb-3 text-primary">
              <BsActivity size={18} />
              <span className="fw-bold small text-uppercase">Network Health</span>
            </div>
            <div className="mb-3">
              <div className="d-flex justify-content-between mb-1" style={{ fontSize: '0.85rem' }}>
                <span className="text-muted">Airtime Limit</span>
                <span className="fw-bold">{(cu.usedDailyAirtime / 1000).toFixed(2)}s / 30s</span>
              </div>
              <ProgressBar now={airtimePercentage} variant={airtimePercentage > 80 ? "danger" : "info"} style={{ height: '6px' }} rounded-pill />
            </div>
            <div className="d-flex justify-content-between small opacity-75">
              <span>Last contact:</span>
              <span className="fw-bold">{cu.lastSeen ? new Date(cu.lastSeen.endsWith('Z') ? cu.lastSeen : cu.lastSeen + 'Z').toLocaleString('it-IT', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
              }) : "N/D"}</span>
            </div>
          </div>
        </Col>

        {/* Radio Params */}
        <Col md={4}>
          <div className="p-3 bg-white rounded shadow-sm border-0 h-100">
            <div className="d-flex align-items-center gap-2 mb-3 text-success">
              <BsBroadcast size={18} />
              <span className="fw-bold small text-uppercase">Radio Signals</span>
            </div>
            <Row className="g-2 text-center">
              <Col xs={4}>
                <div className="text-muted tiny text-uppercase" style={{ fontSize: '0.65rem' }}>RSSI</div>
                <div className="fw-bold">{cu.rssi} <small>dBm</small></div>
              </Col>
              <Col xs={4} className="border-start border-end">
                <div className="text-muted tiny text-uppercase" style={{ fontSize: '0.65rem' }}>DR</div>
                <div className="fw-bold">DR{cu.dataRate}</div>
              </Col>
              <Col xs={4}>
                <div className="text-muted tiny text-uppercase" style={{ fontSize: '0.65rem' }}>Power</div>
                <div className="fw-bold">{cu.transmissionPower} <small>dBm</small></div>
              </Col>
            </Row>
          </div>
        </Col>

        {/* Config Summary - CON ICONA CLICCABILE */}
        <Col md={4}>
          <div className="p-3 bg-white rounded shadow-sm border-0 h-100 position-relative">
            <div className="d-flex align-items-center justify-content-between mb-3 text-secondary">
              <div className="d-flex align-items-center gap-2">
                <BsGear size={18} />
                <span className="fw-bold small text-uppercase">Configuration</span>
              </div>
              {/* ICONA CHE APRE IL MODAL */}
              <BsGear
                className="text-primary cursor-pointer hover-rotate"
                style={{
                  cursor: 'pointer',
                  transition: 'transform 0.3s ease',
                  fontSize: '1.2rem'
                }}
                onClick={() => setShowConfig(true)}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'rotate(90deg)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'rotate(0deg)'}
              />
            </div>
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="small text-muted">Polling Interval:</span>
              <Badge bg="light" className="text-dark border font-monospace">{cu.pollingInterval} h</Badge>
            </div>
            <div className="d-flex justify-content-between align-items-center">
              <span className="small text-muted">GPS Module:</span>
              <Badge bg={cu.hasGPS ? "info" : "light"} className={cu.hasGPS ? "text-white" : "text-muted border"}>
                {cu.hasGPS ? "ENABLED" : "DISABLED"}
              </Badge>
            </div>
          </div>
        </Col>
      </Row>

      {/* --- ACQUISITION CONTROL SECTION --- */}
      <div className="mb-5 mt-4">
        <h4 className="mb-3 d-flex align-items-center gap-2">
          <BsActivity className="text-danger" /> Live Acquisition
        </h4>
        <Card className="border-0 shadow-sm overflow-hidden">
          <Card.Body className="p-4 bg-white">
            <Row className="align-items-center">
              <Col lg={7} md={12} className="mb-3 mb-lg-0">
                <div className="d-flex justify-content-between align-items-end mb-2">
                  <label className="fw-bold small text-uppercase text-muted">Transmission Interval</label>
                  <Badge bg={acqIndex === 0 ? "secondary" : "danger"} className="p-2 font-monospace" style={{ fontSize: '1rem' }}>
                    {decodeIndexToLabel(acqIndex)}
                  </Badge>
                </div>
                <input
                  type="range"
                  className="form-range custom-range"
                  min="0"
                  max="255"
                  step="1"
                  value={acqIndex}
                  onChange={(e) => setAcqIndex(parseInt(e.target.value))}
                />
                <div className="d-flex justify-content-between mt-1 text-muted small">
                  <span>OFF</span>
                  <span>1s</span>
                  <span>1h</span>
                  <span>+24h</span>
                </div>
              </Col>

              <Col lg={5} md={12} className="d-flex gap-2 justify-content-lg-end">
                <Button
                  variant="outline-danger"
                  className="fw-bold px-4 py-2 d-flex align-items-center gap-2"
                  onClick={handleStopAcquisition}
                >
                  STOP
                </Button>
                <Button
                  variant="danger"
                  className="fw-bold px-4 py-2 d-flex align-items-center gap-2 shadow-sm"
                  disabled={acqIndex === 0}
                  onClick={handleStartAcquisition}
                >
                  <BsBroadcast size={18} /> START SESSION
                </Button>
              </Col>
            </Row>
          </Card.Body>
          {acqIndex > 0 && acqIndex < 4 && (
            <div className="bg-warning-subtle text-warning-emphasis px-4 py-1 small border-top border-warning-subtle">
              <strong>Attenzione:</strong> Verificare limiti di banda e batteria.
            </div>
          )}
        </Card>
      </div>



      <div className="d-flex justify-content-between align-items-center mb-4 mt-5">
        <h4 className="mb-0 d-flex align-items-center gap-2">
          <BsToggles className="text-primary" /> Measurement Units
        </h4>
        <Button
          variant="outline-primary"
          size="sm"
          className="d-flex align-items-center gap-2 shadow-sm"
          onClick={() => setShowSensorConfig(true)}
        >
          <BsCpu size={16} /> Configura Sampling Sensori
        </Button>
      </div>


      {/* --- CICLO MEASUREMENT UNITS --- */}
      {cu.measurementUnits
        .slice() // o [...mu.sensors] per non mutare l'array originale
        .sort((a, b) => a.localId - b.localId)
        .map((mu: any) => (
          <MeasurementUnitCard
            key={mu.id}
            mu={mu}
            handleSetDirty={handleSetDirty}
          />
        ))}

      <ConfigCUModal
        cu={cu}
        show={showConfig}
        onHide={() => setShowConfig(false)}
        handleSetDirty={handleSetDirty}
      />

      <SensorConfigModal
        show={showSensorConfig}
        onHide={() => setShowSensorConfig(false)}
        controlUnit={cu}
      />

    </Container>

  );
}

const decodeIndexToLabel = (idx: number): string => {
  if (idx === 0) return "OFF (Stop)";
  if (idx <= 4) return `${idx * 15} min`;
  if (idx <= 96) return `${Math.trunc(idx * 15 / 60)} h ${(idx * 15) % 60} min`;
  if (idx <= 254) return `${1 + Math.trunc((idx - 96) / 24)} g ${(idx - 96) % 24} h`;
  if (idx === 255) return `${1} min`;
  return "OUT OF RANGE";
};
