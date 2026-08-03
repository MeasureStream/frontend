import { Container, Row, Col, Card, ProgressBar } from "react-bootstrap";
import { BsSignal, BsBatteryFull, BsCpu, BsArrowRight, BsTrash } from "react-icons/bs";
import { Link } from "react-router";
import { useState } from "react";
import { ControlUnitDTO, formatDevEui } from "../../API/interfaces";
import { DeleteCUModal } from "../../components/DeleteCUModal";
import { EmptyDevicesLanding } from "./EmptyDevicesLanding";

function isControlUnitOnline(lastSeen: string | null, transmissionInterval: number): boolean {
  if (!lastSeen) return false;

  const lastSeenDate = new Date(lastSeen).getTime();
  const now = Date.now();

  const minutesElapsed = (now - lastSeenDate) / (1000 * 60);
  const maxTimeout = Math.max(30, transmissionInterval * 2);

  return minutesElapsed <= maxTimeout;
}

interface ControlUnitsPageProps {
  controlUnits: ControlUnitDTO[];
  onRefresh?: () => void;
}

export function ControlUnitsPage({ controlUnits, onRefresh }: ControlUnitsPageProps) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCU, setSelectedCU] = useState<ControlUnitDTO | null>(null);

  if (controlUnits.length === 0) {
    return <EmptyDevicesLanding />;
  }

  const openDeleteModal = (cu: ControlUnitDTO) => {
    setSelectedCU(cu);
    setShowDeleteModal(true);
  };

  const handleDeleteSuccess = () => {
    if (onRefresh) {
      onRefresh();
    } else {
      window.location.reload();
    }
  };

  return (
    <Container className="py-4 fade-in-up">
      <header className="mb-4">
        <h1 className="fw-bold">Benvenuto, ecco i tuoi dispositivi</h1>
        <p className="text-muted">Monitoraggio in tempo reale del network LoRaWAN</p>
      </header>

      <Row>
        {controlUnits.map((cu) => {
          const isOnline = isControlUnitOnline(cu.lastSeen, cu.transmissionInterval);

          return (
            <Col key={cu.id} xs={12} lg={6} xl={4} className="mb-4">
              {/* Sostituito `shadow-sm` con `shadow` per un'ombra marcata di default + `hover-lift` */}
              <Card className="shadow border-0 hover-lift h-100">
                <Card.Body className="d-flex flex-column justify-content-between">
                  <div>
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <div>
                        <Card.Title className="h5 mb-0 fw-bold">{cu.name}</Card.Title>
                        <code className="text-primary small" style={{ fontSize: '0.85rem' }}>
                          {formatDevEui(cu.devEui)}
                        </code>
                      </div>

                      {/* Tasto eliminazione con animazione hover */}
                      <button
                        className="btn btn-link text-muted p-1 border-0 "
                        onClick={() => openDeleteModal(cu)}
                        title={`Elimina ${cu.name}`}
                        style={{ background: 'none' }}
                      >
                        <BsTrash size={18} className="text-danger" />
                      </button>
                    </div>

                    <Row className="text-center mb-3">
                      <Col>
                        <BsBatteryFull className="text-primary mb-1" size={20} />
                        <div className="small fw-bold">{cu.remainingBattery}%</div>
                        <ProgressBar
                          now={cu.remainingBattery}
                          variant={cu.remainingBattery < 20 ? "danger" : "primary"}
                          style={{ height: '4px' }}
                          className="mt-1"
                        />
                      </Col>
                      <Col>
                        <BsSignal className="text-info mb-1" size={20} />
                        <div className="small fw-bold">{cu.rssi} dBm</div>
                        <small className="text-muted">Segnale</small>
                      </Col>
                      <Col>
                        <BsCpu className="text-warning mb-1" size={20} />
                        <div className="small fw-bold">{cu.measurementUnits.length}</div>
                        <small className="text-muted">MU associate</small>
                      </Col>
                    </Row>
                  </div>

                  <div className="d-grid mt-3">
                    <Link to={`/cus/${cu.id}`} className="btn btn-outline-primary btn-sm d-flex align-items-center justify-content-center gap-2 hover-slide-right">
                      Dettaglio Sensori <BsArrowRight />
                    </Link>
                  </div>
                </Card.Body>

                <Card.Footer className="border-0 py-2 d-flex justify-content-between align-items-center" style={{ backgroundColor: "transparent" }}>
                  <small className="text-muted">Località: {cu.semanticLocation || "Non specificata"}</small>

                  <span className={`ms-badge ${isOnline ? "ms-badge-safe" : "ms-badge-muted"}`}>
                    {isOnline ? "Active" : "Inactive"}
                  </span>
                </Card.Footer>
              </Card>
            </Col>
          );
        })}
      </Row>

      <DeleteCUModal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        controlUnit={selectedCU}
        onSuccess={handleDeleteSuccess}
      />
    </Container>
  );
}
