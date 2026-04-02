import { Container, Row, Col, Card, Badge, ListGroup, ProgressBar } from "react-bootstrap";
import { BsCpu, BsGear, BsThermometerHalf, BsDroplet, BsSpeedometer, BsToggles } from "react-icons/bs";
import { ControlUnitDTO, formatDevEui } from "../../../API/interfaces";
import { useParams } from "react-router";
import { useMemo } from "react";
import ChartPreviewCard from "../../../components/ChartPreviewCard";


export function ControlUnitDetail({ allControlUnits }: { allControlUnits: ControlUnitDTO[] }) {
  const { id } = useParams<{ id: string }>();

  const cu = useMemo(() =>
    allControlUnits.find(unit => unit.id === Number(id)),
    [allControlUnits, id]
  );

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

  if (!cu) return <Container className="py-5"><h1>CU non trovata</h1></Container>;

  return (
    <Container className="py-4">
      {/* --- HEADER CU --- */}
      <Card className="mb-4 border-0 shadow-sm">
        <Card.Body className="bg-light">
          <Row className="align-items-center">
            <Col md={8}>
              <div className="d-flex align-items-center gap-3">
                <h2 className="mb-0">{cu.name}</h2>
                <Badge bg={cu.status === 1 ? "success" : "secondary"}>
                  {cu.status === 1 ? "ONLINE" : "OFFLINE"}
                </Badge>
              </div>
              <p className="text-muted mb-0 mt-1">
                EUI: <code className="fw-bold">{formatDevEui(cu.devEui)}</code> |
                Location: {cu.semanticLocation || "Non definita"}
              </p>
            </Col>
            <Col md={4} className="text-md-end mt-3 mt-md-0">
              <div className="small text-muted mb-1">Batteria: {cu.remainingBattery}%</div>
              <ProgressBar
                now={cu.remainingBattery}
                variant={cu.remainingBattery < 20 ? "danger" : "success"}
                style={{ height: '8px' }}
              />
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* --- PARAMETRI RADIO & CONFIG --- */}
      <Row className="mb-4 g-3">
        <Col md={4}>
          <Card className="h-100 border-0 shadow-sm">
            <Card.Header className="bg-white fw-bold">Parametri Radio</Card.Header>
            <ListGroup variant="flush">
              <ListGroup.Item className="d-flex justify-content-between">
                <span>RSSI</span> <strong>{cu.rssi} dBm</strong>
              </ListGroup.Item>
              <ListGroup.Item className="d-flex justify-content-between">
                <span>SF</span> <strong>SF{cu.spreadingFactor || 7}</strong>
              </ListGroup.Item>
              <ListGroup.Item className="d-flex justify-content-between">
                <span>Bandwidth</span> <strong>{cu.bandwidth} kHz</strong>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
        <Col md={8}>
          <Card className="h-100 border-0 shadow-sm">
            <Card.Header className="bg-white fw-bold">Configurazione</Card.Header>
            <Card.Body>
              <Row className="text-center h-100 align-items-center">
                <Col xs={6} md={3}>
                  <small className="text-muted d-block">Polling</small>
                  <strong>{cu.pollingInterval}s</strong>
                </Col>
                <Col xs={6} md={3}>
                  <small className="text-muted d-block">TX Power</small>
                  <strong>{cu.transmissionPower} dBm</strong>
                </Col>
                <Col xs={6} md={3}>
                  <small className="text-muted d-block">GPS</small>
                  <Badge bg={cu.hasGPS ? "info" : "light"} className={cu.hasGPS ? "" : "text-muted border"}>
                    {cu.hasGPS ? "ON" : "OFF"}
                  </Badge>
                </Col>
                <Col xs={6} md={3}>
                  <small className="text-muted d-block">Data Rate</small>
                  <strong>DR{cu.dataRate}</strong>
                </Col>
              </Row>
            </Card.Body>
          </Card>
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
              <h5 className="mb-0 font-monospace">MU ExtendedID: {mu.extendedId}</h5>
            </div>
            <Badge bg="dark">Modello: {mu.model}</Badge>
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
                      <Badge pill bg="white" className="text-primary border border-primary">
                        Ch: {sensor.sensorIndex}
                      </Badge>
                    </div>

                    <Row className="text-center mb-4 py-2 bg-white rounded mx-0 shadow-xs">
                      <Col>
                        <div className="h2 mb-0 fw-bold text-primary">
                          {sensor.physVal.toFixed(2)}
                        </div>
                        <small className="text-muted text-uppercase fw-bold">
                          {sensor.sensorTemplate.unit}
                        </small>
                      </Col>
                      <Col className="border-start">
                        <div className="h4 mb-0 text-dark">{sensor.elecVal.toFixed(2)}</div>
                        <small className="text-muted">Elettrico (V)</small>
                      </Col>
                    </Row>

                    {/* --- GRAFICO ASSOCIATO ALL'EXTENDED ID DELLA MU --- */}
                    <div className="mt-2">
                      <ChartPreviewCard
                        nodeId={mu.extendedId} // <-- Qui usiamo l'ID della Measurement Unit
                        unit={sensor.sensorTemplate.unit}
                        setDirty={handleSetDirty}
                      />
                    </div>

                    <div className="mt-3 pt-2 border-top d-flex justify-content-between small text-muted">
                      <span>Freq. Campionamento: <strong>{sensor.samplingF} Hz</strong></span>
                      <span>Tipo: {sensor.sensorTemplate.type}</span>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      ))}
    </Container>
  );
}
