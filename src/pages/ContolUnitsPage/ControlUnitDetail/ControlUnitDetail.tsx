import { Container, Row, Col, Card, Badge, ListGroup, ProgressBar } from "react-bootstrap";
import { BsCpu, BsGear, BsThermometerHalf, BsDroplet, BsSpeedometer, BsToggles, BsActivity, BsBroadcast } from "react-icons/bs";
import { ControlUnitDTO, formatDevEui } from "../../../API/interfaces";
import { useParams } from "react-router";
import { useEffect, useState } from "react";
import ChartPreviewCard from "../../../components/ChartPreviewCard";
import { ChartModalButton } from "../../../components/ChartModalButton";
import { getControlUnitById } from "../../../API/ControlUnitAPI";


export function ControlUnitDetail({ allControlUnits }: { allControlUnits: ControlUnitDTO[] }) {
  const { id } = useParams<{ id: string }>();
  const cuId = Number(id);

  // Stato locale per gestire l'aggiornamento della singola CU
  const [currentCU, setCurrentCU] = useState<ControlUnitDTO | null>(null);

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

  const getSensorIcon = (type: string) => {
    switch (type) {
      case 'temperature': return <BsThermometerHalf className="text-danger" />;
      case 'humidity': return <BsDroplet className="text-info" />;
      case 'accelerometer': return <BsSpeedometer className="text-warning" />;
      case 'pressure': return <BsGear className="text-secondary" />;
      default: return <BsCpu />;
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

        {/* Config Summary */}
        <Col md={4}>
          <div className="p-3 bg-white rounded shadow-sm border-0 h-100">
            <div className="d-flex align-items-center gap-2 mb-3 text-secondary">
              <BsGear size={18} />
              <span className="fw-bold small text-uppercase">Configuration</span>
            </div>
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="small text-muted">Polling Rate:</span>
              <Badge bg="light" className="text-dark border font-monospace">{cu.pollingInterval}s</Badge>
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

      <h4 className="mb-4 mt-5 d-flex align-items-center gap-2">
        <BsToggles className="text-primary" /> Measurement Units
      </h4>

      {/* --- CICLO MEASUREMENT UNITS --- */}
      {cu.measurementUnits.map((mu: any) => (
        <div key={mu.id} className="mb-5 p-3 rounded shadow-sm border bg-white">
          <div className="d-flex align-items-center justify-content-between mb-4 pb-2 border-bottom">
            <div className="d-flex align-items-center gap-2">
              <BsCpu className="text-primary" />
              <h5 className="mb-0 font-monospace">MU: {mu.extendedId}</h5>
            </div>
            <Badge bg="dark" className="fw-normal">Model: {mu.model}</Badge>
          </div>

          <Row className="g-4">
            {mu.sensors.map((sensor: any) => (
              <Col key={sensor.id} lg={6}>
                <Card className="border-0 bg-light h-100 shadow-sm">
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <div className="d-flex align-items-center gap-2">
                        {getSensorIcon(sensor.sensorTemplate.type)}
                        <span className="fw-bold">{sensor.modelName}</span>
                      </div>

                      <div className="d-flex align-items-center gap-2">
                        {/* IL NUOVO BOTTONE MINIMALISTA */}
                        <ChartModalButton
                          nodeId={mu.extendedId}
                          unit={sensor.sensorTemplate.unit}
                          setDirty={handleSetDirty}
                        />
                        <Badge pill bg="white" className="text-primary border border-primary px-2">
                          Ch: {sensor.sensorIndex}
                        </Badge>
                      </div>
                    </div>

                    <Row className="text-center mb-1 py-2 bg-white rounded mx-0 border shadow-sm">
                      <Col>
                        <div className="h2 mb-0 fw-bold text-primary">
                          {sensor.physVal.toFixed(2)}
                        </div>
                        <small className="text-muted text-uppercase fw-bold" style={{ fontSize: '0.7rem' }}>
                          {sensor.sensorTemplate.unit}
                        </small>
                      </Col>
                      <Col className="border-start">
                        <div className="h4 mb-0 text-dark">{sensor.elecVal.toFixed(2)}</div>
                        <small className="text-muted" style={{ fontSize: '0.7rem' }}>Elec. (V)</small>
                      </Col>
                    </Row>

                    <div className="mt-3 pt-2 border-top d-flex justify-content-between small text-muted" style={{ fontSize: '0.75rem' }}>
                      <span>Sampling: <strong>{sensor.samplingF} Hz</strong></span>
                      <span className="text-uppercase">{sensor.sensorTemplate.type}</span>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      ))}    </Container>
  );
}
