import { ControlUnitDTO, formatDevEui, CUTransmissionCommandDTO, AcquisitionSchedule } from "../../../API/interfaces";
import { Container, Row, Col, Card, Badge, ListGroup, ProgressBar, Button, Form } from "react-bootstrap";
import { BsCpu, BsGear, BsPencil, BsThermometerHalf, BsDroplet, BsSpeedometer, BsToggles, BsActivity, BsBroadcast, BsPlayFill, BsStopFill, BsCalendarEvent } from "react-icons/bs";

import { useParams } from "react-router";
import { useEffect, useState } from "react";
import { MeasurementUnitCard } from "../../../components/MeasurementUnitCard";
import { getControlUnitById, ControlTransmission } from "../../../API/ControlUnitAPI";
import { ConfigCUModal } from "../../../components/ConfigCUModal";
import { SensorConfigModal } from "../../../components/SensorConfigModal";
import { useAuth } from "../../../API/AuthContext";
import { EditMetadataModal } from "../../../components/EditMetadataModal";
import { RangeTicks } from "../../../components/RangeTicks";

// Tacche posizionate sul valore REALE dell'indice (1 step = 15 min):
const TRANSMISSION_TICKS = [
  { value: 0, label: "OFF" },
  { value: 24, label: "6h" },
  { value: 48, label: "12h" },
  { value: 96, label: "24h" },
  { value: 240, label: "7g" },
];

function isControlUnitOnline(lastSeen: string | null, transmissionInterval: number): boolean {
  if (!lastSeen) return false;

  const lastSeenDate = new Date(lastSeen.endsWith('Z') ? lastSeen : lastSeen + 'Z').getTime();
  const now = Date.now();

  const minutesElapsed = (now - lastSeenDate) / (1000 * 60);
  const maxTimeout = Math.max(30, transmissionInterval * 2);

  return minutesElapsed <= maxTimeout;
}

export function ControlUnitDetail({ allControlUnits }: { allControlUnits: ControlUnitDTO[] }) {
  const { id } = useParams<{ id: string }>();
  const cuId = Number(id);
  const { xsrfToken } = useAuth();

  const [currentCU, setCurrentCU] = useState<ControlUnitDTO | null>(null);
  const [showConfig, setShowConfig] = useState(false);
  const [showSensorConfig, setShowSensorConfig] = useState(false);
  const [acqIndex, setAcqIndex] = useState(0);
  const [showEditMetadata, setShowEditMetadata] = useState(false);
  const [schedule, setSchedule] = useState<AcquisitionSchedule | null>(null);

  useEffect(() => {
    const found = allControlUnits.find(unit => unit.id === cuId);
    if (found) {
      setCurrentCU(found);
      setAcqIndex(found.transmissionInterval);
    }
  }, [allControlUnits, cuId]);

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

  useEffect(() => {
    const interval = setInterval(refreshSingleCU, 60000);
    return () => clearInterval(interval);
  }, [cuId]);

  const handleSetDirty = () => {
    console.log("Data marked as dirty");
  };

  const handleStartAcquisition = async () => {
    if (!currentCU) return;
    if (schedule && !schedule.valid) return;

    try {
      if (schedule?.complete) {
        console.log("Sessione programmata (solo UI per ora):", schedule);
      }
      await ControlTransmission(xsrfToken, {
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
        transmissionIndex: 0
      });
      setAcqIndex(0);
      console.log("Sessione fermata");
    } catch (err) {
      console.error("Errore nel fermare la sessione:", err);
    }
  };

  const cu = currentCU;

  if (!cu) return <Container className="py-5"><h1>CU non trovata</h1></Container>;

  const isOnline = isControlUnitOnline(cu.lastSeen, cu.transmissionInterval);

  const airtimeLimit = 30000;
  const airtimePercentage = Math.min((cu.usedDailyAirtime / airtimeLimit) * 100, 100);

  const updateSchedule = (sd: string | null, st: string | null, ed: string | null) => {
    const isComplete = !!(sd && ed);
    let isValid = true;

    if (isComplete) {
      isValid = ed! >= sd!;
    }

    setSchedule({
      startDate: sd,
      startTime: st,
      endDate: ed,
      complete: isComplete,
      valid: isValid
    });
  };

  return (
    <Container className="py-4 fade-in-up">
      {/* --- HEADER CU --- */}
      <div className="d-flex justify-content-between align-items-end mb-4 px-2">
        <div>
          <div className="d-flex align-items-center gap-2 mb-1">
            <h2 className="fw-bold mb-0" style={{ letterSpacing: '-0.5px' }}>{cu.name}</h2>
            <BsPencil
              className="text-muted text-primary-hover hover-slide-right"
              style={{ cursor: "pointer", fontSize: "1.1rem", marginLeft: "4px" }}
              onClick={() => setShowEditMetadata(true)}
              title="Modifica nome e locazione"
            />

            <span className={`ms-badge ${isOnline ? "ms-badge-safe" : "ms-badge-muted"}`} style={{ verticalAlign: 'middle' }}>
              {isOnline ? "ACTIVE" : "INACTIVE"}
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

      {/* --- METRICS GRID CON HOVER-LIFT E OMBRE --- */}
      <Row className="g-3 mb-5">
        {/* Network Health */}
        <Col md={4}>
          <div className="p-3 ms-tile rounded shadow border-0 h-100 hover-lift">
            <div className="d-flex align-items-center gap-2 mb-3 text-primary">
              <BsActivity size={18} />
              <span className="fw-bold small text-uppercase">Network Health</span>
            </div>
            <div className="mb-3">
              <div className="d-flex justify-content-between mb-1" style={{ fontSize: '0.85rem' }}>
                <span className="text-muted">Airtime Limit</span>
                <span className="fw-bold">{(cu.usedDailyAirtime / 1000).toFixed(2)}s / 30s</span>
              </div>
              <ProgressBar now={airtimePercentage} variant={airtimePercentage > 80 ? "danger" : "info"} style={{ height: '6px' }} />
            </div>
            <div className="d-flex justify-content-between small opacity-75">
              <span>Last contact:</span>
              <span className="fw-bold">
                {cu.lastSeen ? new Date(cu.lastSeen.endsWith('Z') ? cu.lastSeen : cu.lastSeen + 'Z').toLocaleString('it-IT', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit'
                }) : "N/D"}
              </span>
            </div>
          </div>
        </Col>

        {/* Radio Params */}
        <Col md={4}>
          <div className="p-3 ms-tile rounded shadow border-0 h-100 hover-lift">
            <div className="d-flex align-items-center gap-2 mb-3 text-primary">
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

        {/* Config Summary */}
        <Col md={4}>
          <div className="p-3 ms-tile rounded shadow border-0 h-100 position-relative hover-lift">
            <div className="d-flex align-items-center justify-content-between mb-3 text-secondary">
              <div className="d-flex align-items-center gap-2">
                <BsGear size={18} />
                <span className="fw-bold small text-uppercase">Configuration</span>
              </div>
              <BsGear
                className="text-primary cursor-pointer"
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
        <h4 className="mb-3 d-flex align-items-center gap-2 fw-bold">
          <BsActivity className="text-danger" /> Live Acquisition
        </h4>
        <Card className="border-0 shadow hover-lift overflow-hidden">
          <Card.Body className="p-4">
            <Row className="align-items-center g-4">
              {/* 1. SELEZIONE INTERVALLO (SLIDER) */}
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
                  max="240"
                  step="1"
                  value={acqIndex}
                  onChange={(e) => setAcqIndex(parseInt(e.target.value))}
                />
                <RangeTicks max={240} ticks={TRANSMISSION_TICKS} />
              </Col>

              {/* 2. CALENDARIO STRUTTURATO */}
              <Col lg={5} md={8} className="border-start-lg ps-lg-4">
                <div className="d-flex align-items-center gap-2 mb-2 text-muted">
                  <BsCalendarEvent size={16} className="text-primary" />
                  <label className="fw-bold small text-uppercase mb-0">Schedule Session </label>
                </div>

                <Row className="g-3">
                  {/* SEZIONE INIZIO */}
                  <Col sm={6}>
                    <span className="text-muted tiny d-block mb-1 fw-bold" style={{ fontSize: '0.7rem' }}>START SESSION</span>
                    <div className="d-flex gap-1">
                      <Form.Control
                        type="date"
                        size="sm"
                        className="border-light-subtle bg-light-subtle shadow-sm"
                        value={schedule?.startDate || ""}
                        onChange={(e) => {
                          const d = e.target.value || null;
                          updateSchedule(d, schedule?.startTime || null, schedule?.endDate || null);
                        }}
                      />
                      <Form.Control
                        type="time"
                        size="sm"
                        className="border-light-subtle bg-light-subtle shadow-sm"
                        style={{ width: '110px' }}
                        value={schedule?.startTime || ""}
                        onChange={(e) => {
                          const t = e.target.value || null;
                          updateSchedule(schedule?.startDate || null, t, schedule?.endDate || null);
                        }}
                      />
                    </div>
                  </Col>

                  {/* SEZIONE FINE */}
                  <Col sm={6}>
                    <span className="text-muted tiny d-block mb-1 fw-bold" style={{ fontSize: '0.7rem' }}>END SESSION</span>
                    <div className="d-flex gap-1">
                      <Form.Control
                        type="date"
                        size="sm"
                        className="border-light-subtle bg-light-subtle shadow-sm"
                        value={schedule?.endDate || ""}
                        onChange={(e) => {
                          const d = e.target.value || null;
                          updateSchedule(schedule?.startDate || null, schedule?.startTime || null, d);
                        }}
                      />
                    </div>
                  </Col>
                </Row>

                {schedule !== null && !schedule.valid && (
                  <div className="text-danger small mt-2 fw-semibold" style={{ fontSize: '0.75rem' }}>
                    * La data di stop non può precedere il giorno di avvio.
                  </div>
                )}
              </Col>

              {/* 3. PULSANTI DI AZIONE CON EFFETTO HOVER-SLIDE */}
              <Col lg={3} md={4} className="d-flex flex-column gap-2 justify-content-center">
                <Button
                  variant="outline-primary"
                  className="fw-bold px-4 py-2 d-flex align-items-center justify-content-center gap-2 shadow hover-slide-right"
                  disabled={acqIndex === 0 || (schedule !== null && !schedule.valid)}
                  onClick={handleStartAcquisition}
                >
                  <BsPlayFill size={20} /> START SESSION
                </Button>
                <Button
                  variant="outline-danger"
                  className="fw-bold px-4 py-2 d-flex align-items-center justify-content-center gap-2 hover-slide-right"
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
        <h4 className="mb-0 d-flex align-items-center gap-2 fw-bold">
          <BsToggles className="text-primary" /> Measurement Units
        </h4>
        <Button
          variant="outline-primary"
          size="sm"
          className="d-flex align-items-center gap-2 shadow hover-slide-right"
          onClick={() => setShowSensorConfig(true)}
        >
          <BsCpu size={16} /> Configura Sampling Sensori
        </Button>
      </div>

      {/* --- CICLO MEASUREMENT UNITS CON HOVER-LIFT --- */}
      {cu.measurementUnits
        .slice()
        .sort((a, b) => a.localId - b.localId)
        .map((mu: any) => (
          <div key={mu.id} className="mb-3 shadow hover-lift">
            <MeasurementUnitCard
              mu={mu}
              handleSetDirty={handleSetDirty}
            />
          </div>
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
        onSuccess={refreshSingleCU}
      />
    </Container>
  );
}

const decodeIndexToLabel = (idx: number): string => {
  if (idx === 0) return "OFF (Stop)";
  if (idx <= 4) return `${idx * 15} min`;
  if (idx <= 96) return `${Math.trunc(idx * 15 / 60)} h ${(idx * 15) % 60} min`;
  if (idx <= 240) return `${1 + Math.trunc((idx - 96) / 24)} g ${(idx - 96) % 24} h`;
  if (idx > 240) return "OUT OF RANGE (Max 7gg)";
  if (idx === 255) return `1 min`;
  return "OUT OF RANGE";
};
