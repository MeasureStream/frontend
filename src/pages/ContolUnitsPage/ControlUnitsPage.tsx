import { Container, Row, Col, Card, Badge, ProgressBar } from "react-bootstrap";
import { BsSignal, BsBatteryFull, BsCpu, BsArrowRight } from "react-icons/bs";
import { Link } from "react-router";
import { ControlUnitDTO } from "../../API/interfaces";

export function ControlUnitsPage({ controlUnits }: { controlUnits: ControlUnitDTO[] }) {
  return (
    <Container className="py-4">
      <header className="mb-4">
        <h1>Benvenuto, ecco le tue Centraline</h1>
        <p className="text-muted">Monitoraggio in tempo reale del network LoRaWAN</p>
      </header>

      <Row>
        {controlUnits.map((cu) => (
          <Col key={cu.id} xs={12} lg={6} xl={4} className="mb-4">
            <Card className="shadow-sm border-0 hover-shadow transition">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div>
                    <Card.Title className="h5 mb-0">{cu.name}</Card.Title>
                    <small className="text-muted">EUI: {cu.devEui}</small>
                  </div>
                  <Badge pill bg={cu.status === 1 ? "success" : "secondary"}>
                    {cu.status === 1 ? "Online" : "Offline"}
                  </Badge>
                </div>

                <Row className="text-center mb-3">
                  <Col>
                    <BsBatteryFull className="text-primary mb-1" />
                    <div className="small fw-bold">{cu.remainingBattery}%</div>
                    <ProgressBar
                      now={cu.remainingBattery}
                      variant={cu.remainingBattery < 20 ? "danger" : "primary"}
                      style={{ height: '4px' }}
                    />
                  </Col>
                  <Col>
                    <BsSignal className="text-info mb-1" />
                    <div className="small fw-bold">{cu.rssi} dBm</div>
                    <small className="text-muted">Segnale</small>
                  </Col>
                  <Col>
                    <BsCpu className="text-warning mb-1" />
                    <div className="small fw-bold">{cu.measurementUnits.length}</div>
                    <small className="text-muted">MU associate</small>
                  </Col>
                </Row>

                <div className="d-grid">
                  <Link to={`/cus/${cu.id}`} className="btn btn-outline-primary btn-sm d-flex align-items-center justify-content-center gap-2">
                    Dettaglio Sensori <BsArrowRight />
                  </Link>
                </div>
              </Card.Body>
              <Card.Footer className="bg-white border-0 py-2">
                <small className="text-muted">Località: {cu.semanticLocation || "Non specificata"}</small>
              </Card.Footer>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}
