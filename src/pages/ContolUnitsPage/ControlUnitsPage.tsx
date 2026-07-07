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
  onRefresh?: () => void; // Utile per far scattare un getAllCu() dal componente padre
}

export function ControlUnitsPage({ controlUnits, onRefresh }: ControlUnitsPageProps) {
  // Stati per la gestione del modal di cancellazione
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCU, setSelectedCU] = useState<ControlUnitDTO | null>(null);

  // Nessun dispositivo associato: landing informativa al posto della pagina vuota
  if (controlUnits.length === 0) {
    return <EmptyDevicesLanding />;
  }

  const openDeleteModal = (cu: ControlUnitDTO) => {
    setSelectedCU(cu);
    setShowDeleteModal(true);
  };

  const handleDeleteSuccess = () => {
    if (onRefresh) {
      onRefresh(); // Esegue il refresh se passato
    } else {
      // Alternativa locale se gestisci lo stato altrove, rinfresca la finestra corrente
      window.location.reload();
    }
  };

  return (
    <Container className="py-4">
      <header className="mb-4">
        <h1>Benvenuto, ecco i tuoi dispositivi</h1>
        <p className="text-muted">Monitoraggio in tempo reale del network LoRaWAN</p>
      </header>

      <Row>
        {controlUnits.map((cu) => {
          const isOnline = isControlUnitOnline(cu.lastSeen, cu.transmissionInterval);

          return (
            <Col key={cu.id} xs={12} lg={6} xl={4} className="mb-4">
              <Card className="shadow-sm border-0 hover-ggVGshadow transition">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div>
                      <Card.Title className="h5 mb-0">{cu.name}</Card.Title>
                      <code className="text-primary small" style={{ fontSize: '0.85rem' }}>
                        {formatDevEui(cu.devEui)}
                      </code>
                    </div>
                    {/* Icona della spazzatura posizionata in alto a destra */}
                    <button
                      className="btn btn-link text-muted text-danger-hover p-1 border-0"
                      onClick={() => openDeleteModal(cu)}
                      title={`Elimina ${cu.name}`}
                      style={{ background: 'none' }}
                    >
                      <BsTrash size={18} />
                    </button>
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

      {/* Rendering Dichiarativo del Modal */}
      <DeleteCUModal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        controlUnit={selectedCU}
        onSuccess={handleDeleteSuccess}
      />
    </Container>
  );
}
