import { Container, Row, Col, Card, Badge, ListGroup, Table, ProgressBar } from "react-bootstrap";
import { BsCpu, BsGear, BsThermometerHalf, BsDroplet, BsSpeedometer, BsToggles } from "react-icons/bs";
import { ControlUnitDTO, formatDevEui } from "../../../API/interfaces";
import { useParams, } from "react-router";
import { useMemo } from "react";

export function ControlUnitDetail({ allControlUnits }: { allControlUnits: ControlUnitDTO[] }) {

  const { id } = useParams<{ id: string }>();

  const cu = useMemo(() =>
    allControlUnits.find(unit => unit.id === Number(id)),
    [allControlUnits, id]
  );

  // Helper per icona sensore in base al tipo
  const getSensorIcon = (type: string) => {
    switch (type) {
      case 'temperature': return <BsThermometerHalf className="text-danger" />;
      case 'humidity': return <BsDroplet className="text-info" />;
      case 'accelerometer': return <BsSpeedometer className="text-warning" />;
      case 'pressure': return <BsGear className="text-secondary" />;
      default: return <BsCpu />;
    }
  };

  if (cu == undefined) {
    return (<h1>CU non trovata</h1>)
  }

  return (
    <Container className="py-4">
      {/* Header: Stato Generale CU */}
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

      {/* Dettagli Tecnici LoRaWAN */}
      <Row className="mb-4">
        <Col md={4}>
          <Card className="h-100 border-0 shadow-sm">
            <Card.Header className="bg-white fw-bold">Parametri Radio</Card.Header>
            <ListGroup variant="flush">
              <ListGroup.Item className="d-flex justify-content-between">
                <span>RSSI</span> <strong>{cu.rssi} dBm</strong>
              </ListGroup.Item>
              <ListGroup.Item className="d-flex justify-content-between">
                <span>Spreading Factor</span> <strong>SF{cu.spreadingFactor || 7}</strong>
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
              <Row>
                <Col xs={6} mb={2}>
                  <small className="text-muted d-block">Polling Interval</small>
                  <strong>{cu.pollingInterval}s</strong>
                </Col>
                <Col xs={6} mb={2}>
                  <small className="text-muted d-block">Transmission Power</small>
                  <strong>{cu.transmissionPower} dBm</strong>
                </Col>
                <Col xs={6}>
                  <small className="text-muted d-block">GPS</small>
                  <strong>{cu.hasGPS ? "Attivo" : "No"}</strong>
                </Col>
                <Col xs={6}>
                  <small className="text-muted d-block">Data Rate</small>
                  <strong>DR{cu.dataRate}</strong>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Measurement Units e Sensori */}
      <h4 className="mb-3 mt-5 d-flex align-items-center gap-2">
        <BsToggles /> Unità di Misura Associate
      </h4>

      {cu.measurementUnits.map((mu: any) => (
        <div key={mu.id} className="mb-5">
          <div className="d-flex align-items-center gap-2 mb-3 bg-dark text-white p-2 rounded">
            <BsCpu /> <strong>MU ExtendedID: {mu.extendedId} (Modello: {mu.model})</strong>
          </div>

          <Row>
            {mu.sensors.map((sensor: any) => (
              <Col key={sensor.id} lg={6} className="mb-3">
                <Card className="border-0 shadow-sm hover-shadow transition">
                  <Card.Body>
                    <div className="d-flex justify-content-between border-bottom pb-2 mb-3">
                      <div className="d-flex align-items-center gap-2">
                        {getSensorIcon(sensor.sensorTemplate.type)}
                        <span className="fw-bold">{sensor.modelName}</span>
                      </div>
                      <Badge bg="outline-primary" className="text-primary border border-primary">
                        Index: {sensor.sensorIndex}
                      </Badge>
                    </div>

                    <Row className="text-center">
                      <Col>
                        <div className="display-6 fw-bold text-primary">
                          {sensor.physVal.toFixed(2)}
                        </div>
                        <small className="text-muted text-uppercase">{sensor.sensorTemplate.unit}</small>
                      </Col>
                      <Col className="border-start">
                        <div className="h4 mb-0">{sensor.elecVal.toFixed(2)}</div>
                        <small className="text-muted">Valore Elettrico</small>
                      </Col>
                    </Row>

                    <div className="mt-3 pt-3 border-top">
                      <small className="text-muted">
                        Frequenza Campionamento: <strong>{sensor.samplingF} Hz</strong>
                      </small>
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
