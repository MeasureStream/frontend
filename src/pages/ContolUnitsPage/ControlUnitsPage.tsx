import { Container, Row, Col, Card, ProgressBar } from "react-bootstrap";
import { BsBarChartFill, BsBroadcast, BsBatteryFull, BsCpu, BsArrowRight, BsTrash } from "react-icons/bs";
import { BsBatteryCharging, BsUsbPlugFill} from "react-icons/bs";
import { Link } from "react-router";
import { useState } from "react";
import { ControlUnitDTO, formatDevEui } from "../../API/interfaces";
import { DeleteCUModal } from "../../components/DeleteCUModal";
import { EmptyDevicesLanding } from "./EmptyDevicesLanding";
import { useI18n } from "../../i18n/I18nContext";
import type { TranslationKey } from "../../i18n/translations";



type PowerSource = "BATTERY" | "CHARGING" | "EXTERNAL";

/**
 * Sorgente di alimentazione: usa il campo del DTO se presente, altrimenti
 * interpreta i valori riservati del byte grezzo (0xFE/0xFF).
 */
function getPowerSource(cu: ControlUnitDTO): PowerSource {
  if (cu.acPowered) return "EXTERNAL";
  if (cu.isCharging) return "CHARGING";
  return "BATTERY";
}

const POWER_LABEL_KEY: Record<PowerSource, TranslationKey> = {
  BATTERY: "devices.power.battery",
  CHARGING: "devices.power.charging",
  EXTERNAL: "devices.power.external",
};

/** Percentuale mostrata: i valori riservati non sono livelli di carica. */
function batteryPercent(cu: ControlUnitDTO): number {
  if (cu.isCharging || cu.acPowered) return 100;
  return cu.remainingBattery;
}

function renderPowerIcon(source: PowerSource) {
  const commonProps = {
    className: "mb-1",
    size: 20,
    style: { color: "var(--ms-teal)" },
  };

  switch (source) {
    case "EXTERNAL":
      return (
        <BsUsbPlugFill
          {...commonProps}
          style={{ ...commonProps.style, transform: "rotate(90deg)" }}
        />
      );
    case "CHARGING":
      return <BsBatteryCharging {...commonProps} />;
    case "BATTERY":
    default:
      return <BsBatteryFull {...commonProps} />;
  }
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
  const { t } = useI18n();

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
        <h1 className="fw-bold">{t("devices.title")}</h1>
        <p className="text-muted">{t("devices.subtitle")}</p>
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
                        title={t("devices.deleteTitle", { name: cu.name })}
                        style={{ background: 'none' }}
                      >
                        <BsTrash size={18} className="text-danger" />
                      </button>
                    </div>

                    <Row className="text-center mb-3">
                      <Col>
                        {/*<BsBatteryFull className="mb-1" size={20} style={{ color: 'var(--ms-teal)' }} />*/}
                        {renderPowerIcon(powerSource)}
                        <div className="small fw-bold">{percent}%</div>
                        <ProgressBar
                          now={percent}
                          style={{ height: '4px', ['--ms-progress-color' as string]: batteryTint }}
                          className="mt-1 ms-progress"
                        />
                        <small className="text-muted">{t(POWER_LABEL_KEY[powerSource])}</small>
                      </Col>
                      <Col>
                        <BsBroadcast className="mb-1" size={18} style={{ color: 'var(--ms-teal)' }} />
                        <div className="small fw-bold">{cu.rssi} dBm</div>
                        <small className="text-muted">{t("devices.signal")}</small>
                      </Col>
                      <Col>
                        <BsCpu className="mb-1" size={20} style={{ color: 'var(--ms-teal)' }} />
                        <div className="small fw-bold">{cu.measurementUnits.length}</div>
                        <small className="text-muted">{t("devices.linkedMus")}</small>
                      </Col>
                    </Row>
                  </div>

                  <div className="d-grid mt-3">
                    <Link to={`/cus/${cu.id}`} className="btn btn-outline-primary btn-sm d-flex align-items-center justify-content-center gap-2 hover-slide-right">
                      {t("devices.sensorDetail")} <BsArrowRight />
                    </Link>
                  </div>
                </Card.Body>

                <Card.Footer className="border-0 py-2 d-flex justify-content-between align-items-center" style={{ backgroundColor: "transparent" }}>
                  <small className="text-muted">
                    {t("devices.location", {
                      location: cu.semanticLocation || t("devices.locationUnknown"),
                    })}
                  </small>

                  <span
                    className="fw-bold text-uppercase"
                    style={{
                      fontSize: '0.7rem',
                      letterSpacing: '0.5px',
                      color: isOnline ? 'var(--ms-sage)' : '#6c757d',
                    }}
                  >
                    {isOnline ? t("devices.active") : t("devices.inactive")}
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
