import { Container, Row, Col, Card, ProgressBar } from "react-bootstrap";
import { BsBroadcast, BsBatteryFull, BsCpu, BsArrowRight, BsTrash } from "react-icons/bs";
import { Link } from "react-router";
import { useState } from "react";
import { ControlUnitDTO, formatDevEui } from "../../API/interfaces";
import { DeleteCUModal } from "../../components/DeleteCUModal";
import { EmptyDevicesLanding } from "./EmptyDevicesLanding";

/** Valori riservati del byte batteria trasmesso dalla CU. */
const BATTERY_RAW_EXTERNAL = 254; // 0xFE — alimentazione da rete/USB
const BATTERY_RAW_CHARGING = 255; // 0xFF — carica in corso

type PowerSource = "BATTERY" | "CHARGING" | "EXTERNAL";

/**
 * Sorgente di alimentazione: usa il campo del DTO se presente, altrimenti
 * interpreta i valori riservati del byte grezzo (0xFE/0xFF).
 */
function getPowerSource(cu: ControlUnitDTO): PowerSource {
  if (cu.powerSource) return cu.powerSource;
  if (cu.remainingBattery === BATTERY_RAW_CHARGING) return "CHARGING";
  if (cu.remainingBattery === BATTERY_RAW_EXTERNAL) return "EXTERNAL";
  return "BATTERY";
}

const POWER_LABEL: Record<PowerSource, string> = {
  BATTERY: "A batteria",
  CHARGING: "In ricarica",
  EXTERNAL: "Alimentazione USB",
};

/** Percentuale mostrata: i valori riservati non sono livelli di carica. */
function batteryPercent(cu: ControlUnitDTO): number {
  if (cu.remainingBattery >= BATTERY_RAW_EXTERNAL) return 100;
  return cu.remainingBattery;
}

/**
 * Colore di riempimento della barra (l'icona resta sempre in ottanio):
 * salvia quando alimentata dall'esterno o in carica, altrimenti dinamico
 * sul livello (salvia → arancione sotto il 20% → cremisi sotto il 10%).
 */
function batteryColor(percent: number, source: PowerSource): string {
  if (source !== "BATTERY") return "var(--ms-sage)";
  if (percent < 10) return "var(--ms-crimson)";
  if (percent < 20) return "var(--ms-orange)";
  return "var(--ms-sage)";
}

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
          const powerSource = getPowerSource(cu);
          const percent = batteryPercent(cu);
          const batteryTint = batteryColor(percent, powerSource);

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
                        <BsBatteryFull className="mb-1" size={20} style={{ color: 'var(--ms-teal)' }} />
                        <div className="small fw-bold">{percent}%</div>
                        <ProgressBar
                          now={percent}
                          style={{ height: '4px', ['--ms-progress-color' as string]: batteryTint }}
                          className="mt-1 ms-progress"
                        />
                        <small className="text-muted">{POWER_LABEL[powerSource]}</small>
                      </Col>
                      <Col>
                        <BsBroadcast className="mb-1" size={18} style={{ color: 'var(--ms-teal)' }} />
                        <div className="small fw-bold">{cu.rssi} dBm</div>
                        <small className="text-muted">Segnale</small>
                      </Col>
                      <Col>
                        <BsCpu className="mb-1" size={20} style={{ color: 'var(--ms-teal)' }} />
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

                  <span
                    className="fw-bold text-uppercase"
                    style={{
                      fontSize: '0.7rem',
                      letterSpacing: '0.5px',
                      color: isOnline ? 'var(--ms-sage)' : '#6c757d',
                    }}
                  >
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
