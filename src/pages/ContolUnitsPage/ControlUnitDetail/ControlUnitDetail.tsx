import { Container, Row, Col, Card, Badge, ListGroup, ProgressBar, Button } from "react-bootstrap";
import { BsCpu, BsGear, BsPencil, BsThermometerHalf, BsDroplet, BsSpeedometer, BsToggles, BsActivity, BsBroadcast, BsPlayFill, BsStopFill } from "react-icons/bs";
import { ControlUnitDTO, formatDevEui, CUTransmissionCommandDTO, AcquisitionSchedule } from "../../../API/interfaces";
import { useParams } from "react-router";
import { useEffect, useState } from "react";
import { MeasurementUnitCard } from "../../../components/MeasurementUnitCard";
import { getControlUnitById, ControlTransmission } from "../../../API/ControlUnitAPI";
import { ConfigCUModal } from "../../../components/ConfigCUModal";
import { SensorConfigModal } from "../../../components/SensorConfigModal";
import { useAuth } from "../../../API/AuthContext";
import { EditMetadataModal } from "../../../components/EditMetadataModal";
import { RangeTicks } from "../../../components/RangeTicks";
import { AcquisitionScheduler } from "../../../components/AcquisitionScheduler";

// Tacche posizionate sul valore REALE dell'indice (1 step = 15 min, 255 = 1 min):
// idx 24 = 6 h, idx 48 = 12 h, idx 96 = 24 h, idx 240 = 7 g
const TRANSMISSION_TICKS = [
  { value: 0, label: "OFF" },
  { value: 24, label: "6h" },
  { value: 48, label: "12h" },
  { value: 96, label: "24h" },
  { value: 240, label: "7g" },
];

export function ControlUnitDetail({ allControlUnits }: { allControlUnits: ControlUnitDTO[] }) {
  const { id } = useParams<{ id: string }>();
  const cuId = Number(id);
  const { xsrfToken } = useAuth();

  // Stato locale per gestire l'aggiornamento della singola CU
  const [currentCU, setCurrentCU] = useState<ControlUnitDTO | null>(null);
  const [showConfig, setShowConfig] = useState(false);
  const [showSensorConfig, setShowSensorConfig] = useState(false);
  const [acqIndex, setAcqIndex] = useState(0);
  const [showEditMetadata, setShowEditMetadata] = useState(false);
  const [schedule, setSchedule] = useState<AcquisitionSchedule | null>(null);

  // Inizializzazione: se allControlUnits cambia o l'ID cambia, cerchiamo la CU
  useEffect(() => {
    const found = allControlUnits.find(unit => unit.id === cuId);
    if (found) { setCurrentCU(found); setAcqIndex(found.transmissionInterval) }

  }, [allControlUnits, cuId]);

  // Funzione di refresh specifica per QUESTA unità
  const refreshSingleCU = async () => {
    try {
      const updatedCU = await getControlUnitById(cuId);
      setCurrentCU(updatedCU);
      setAcqIndex(updatedCU.transmissionInterval);
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

  const handleStartAcquisition = async () => {
    if (!currentCU) return;
    if (schedule && !schedule.valid) return;

    try {
      // TODO backend: quando sensor-manager supporterà le acquisizioni
      // programmate, includere qui schedule (startDate/startTime/endDate).
      // Il server assorbe i minuti residui e invia all'end device un
      // ritardo di avvio in ore intere.
      if (schedule?.complete) {
        console.log("Sessione programmata (solo UI per ora):", schedule);
      }
      await ControlTransmission(xsrfToken, { // Metti il token se lo gestisci
        devEui: currentCU.devEui,
        transmissionIndex: acqIndex
      });
      console.log("Sessione avviata con successo");
    } catch (err) {
      console.error("Errore nell'avvio della sessione:", err);
      alert("Errore durante l'avvio della sessione");
    }
  };

  const handleStopAcquisition = async () => {
    if (!currentCU) return;
    try {
      await ControlTransmission(xsrfToken, {
        devEui: currentCU.devEui,
        transmissionIndex: 0 // Forza lo STOP
      });
      setAcqIndex(0); // Reset dello slider in UI
      console.log("Sessione fermata");
    } catch (err) {
      console.error("Errore nel fermare la sessione:", err);
    }
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
            <BsPencil
              className="text-muted text-primary-hover"
              style={{ cursor: "pointer", fontSize: "1.1rem", marginLeft: "4px" }}
              onClick={() => setShowEditMetadata(true)}
              title="Modifica nome e locazione"
            />

            {/* Stato coerente con la landing: deriva da cu.status calcolato dal backend su lastSeen */}
            <span className={`ms-badge ${cu.status === 1 ? "ms-badge-safe" : "ms-badge-muted"}`} style={{ verticalAlign: 'middle' }}>
              {cu.status === 1 ? "ACTIVE" : "INACTIVE"}
            </span>
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
              <span className="ms-badge ms-badge-accent font-monospace">{cu.pollingInterval} h</span>
            </div>
            <div className="d-flex justify-content-between align-items-center">
              <span className="small text-muted">GPS Module:</span>
              <span className={`ms-badge ${cu.hasGPS ? "ms-badge-accent" : "ms-badge-muted"}`}>
                {cu.hasGPS ? "ENABLED" : "DISABLED"}
              </span>
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
            <Row className="align-items-start g-4">
              {/* Slider intervallo di trasmissione (larghezza ridotta) */}
              <Col lg={4} md={12}>
                <div className="d-flex justify-content-between align-items-end mb-2">
                  <label className="fw-bold small text-uppercase text-muted">Transmission Interval</label>
                  <span className={`ms-badge font-monospace ${acqIndex === 0 ? "ms-badge-muted" : "ms-badge-alert"}`} style={{ fontSize: '0.85rem' }}>
                    {decodeIndexToLabel(acqIndex)}
                  </span>
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
                <RangeTicks max={255} ticks={TRANSMISSION_TICKS} />
              </Col>

              {/* Programmazione della sessione: calendario + immissione manuale */}
              <Col lg={5} md={8}>
                <label className="fw-bold small text-uppercase text-muted mb-2 d-block">Programmazione</label>
                <AcquisitionScheduler onChange={setSchedule} />
              </Col>

              <Col lg={3} md={4} className="d-flex flex-column gap-2 justify-content-lg-center align-self-lg-center">
                <Button
                  variant="outline-primary"
                  className="fw-bold px-4 py-2 d-flex align-items-center justify-content-center gap-2"
                  disabled={acqIndex === 0 || (schedule !== null && !schedule.valid)}
                  onClick={handleStartAcquisition}
                >
                  <BsPlayFill size={20} /> START SESSION
                </Button>
                <Button
                  variant="outline-danger"
                  className="fw-bold px-4 py-2 d-flex align-items-center justify-content-center gap-2"
                  onClick={handleStopAcquisition}
                >
                  <BsStopFill size={18} /> STOP
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

      <EditMetadataModal
        show={showEditMetadata}
        onHide={() => setShowEditMetadata(false)}
        cu={cu}
        onSuccess={refreshSingleCU} />

    </Container>

  );
}

const decodeIndexToLabel = (idx: number): string => {
  if (idx === 0) return "OFF (Stop)";
  if (idx <= 4) return `${idx * 15} min`;
  if (idx <= 96) return `${Math.trunc(idx * 15 / 60)} h ${(idx * 15) % 60} min`;
  //AGGIUNGERE che il massimo valore è 240 per fermarlo ad esattamente 7gg
  if (idx <= 254) return `${1 + Math.trunc((idx - 96) / 24)} g ${(idx - 96) % 24} h`;
  if (idx === 255) return `${1} min`;
  return "OUT OF RANGE";
};
