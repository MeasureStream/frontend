import { Row, Col, Card, Badge, Modal, ListGroup } from "react-bootstrap";
import { BsCpu, BsThermometerHalf, BsDroplet, BsSpeedometer, BsGear, BsInfoCircle, BsTools, BsSliders, BsShieldCheck } from "react-icons/bs";
import { useState } from "react";
import { ChartModalButton } from "./ChartModalButton";
import { MeasurementUnitDTO, SensorDTO } from "../API/interfaces";
import { AccelIcon, PressureIcon } from "../icons/CustomIcons";

interface Props {
  mu: MeasurementUnitDTO;
  handleSetDirty: () => void;
}

export function MeasurementUnitCard({ mu, handleSetDirty }: Props) {
  const [selectedSensor, setSelectedSensor] = useState<SensorDTO | null>(null);

  const getSensorIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'temperature': return <BsThermometerHalf />;
      case 'humidity': return <BsDroplet />;
      case 'accelerometer': return <AccelIcon />;
      case 'pressure': return <PressureIcon />;
      default: return <BsCpu />;
    }
  };

  return (
    <div className="mb-5 p-4 rounded-4 shadow-sm border-0 bg-white">
      {/* HEADER MU */}
      <div className="d-flex align-items-center justify-content-between mb-4 pb-3 border-bottom">
        <div className="d-flex align-items-center gap-3">
          <div className="p-2 bg-primary bg-opacity-10 rounded-3 text-primary">
            <BsCpu size={24} />
          </div>
          <div>
            <h5 className="mb-0 fw-bold">MU #{mu.extendedId}</h5>
            <small className="text-muted font-monospace opacity-75">Model: {mu.model}</small>
          </div>
        </div>
      </div>

      {/* GRIGLIA QUADRATA: row-cols-2 per mobile, row-cols-md-3 o 4 per desktop */}
      <Row className="row-cols-2 row-cols-md-3 row-cols-lg-4 g-3">
        {mu.sensors
          .slice() // o [...mu.sensors] per non mutare l'array originale
          .sort((a, b) => a.sensorIndex - b.sensorIndex)
          .map((sensor) => {
            // Sensore oltre il limite di 48 per CU: visibile ma disabilitato
            const disabled = sensor.configurable === false;
            return (
            <Col key={sensor.id}>
              {/* Card in stile "offerta": tag in alto, valore al centro, footer con azioni */}
              <Card
                className="border rounded-4 shadow-sm bg-white h-100 position-relative overflow-hidden"
                style={{ minHeight: '180px', borderColor: '#e9ecef' }}
              >
                {disabled && (
                  <div
                    className="position-absolute top-0 start-0 w-100 h-100 d-flex flex-column align-items-center justify-content-center gap-1"
                    style={{ backgroundColor: 'rgba(233, 236, 239, 0.72)', zIndex: 2 }}
                    title="Superato il limite di 48 sensori configurabili per Control Unit"
                  >
                    <Badge bg="secondary" className="text-uppercase">Disabilitato</Badge>
                    <small className="text-secondary fw-bold" style={{ fontSize: '0.6rem' }}>
                      Oltre il limite di 48 sensori
                    </small>
                  </div>
                )}
                <Card.Body
                  className="d-flex flex-column justify-content-between p-3"
                  style={disabled ? { filter: 'grayscale(1)', opacity: 0.6 } : undefined}
                >

                  {/* TOP: tag tipo sensore + canale */}
                  <div className="d-flex justify-content-between align-items-center gap-2">
                    <span
                      className="d-inline-flex align-items-center gap-1 px-2 py-1 rounded-pill text-secondary text-truncate"
                      style={{ backgroundColor: '#f1f3f5', fontSize: '0.65rem', fontWeight: 600 }}
                    >
                      {getSensorIcon(sensor.sensorTemplate.type)}
                      <span className="text-truncate">{sensor.sensorTemplate.type}</span>
                    </span>
                    <Badge bg="white" className="text-primary border border-primary-subtle px-2 py-1" style={{ fontSize: '0.6rem' }}>
                      CH {sensor.sensorIndex}
                    </Badge>
                  </div>

                  {/* CENTER: valore misurato */}
                  <div className="my-2">
                    <div className="h3 mb-0 fw-bold" style={{ color: '#1c3d6e' }}>
                      {sensor.physVal.toFixed(1)}{' '}
                      <small className="text-muted fw-normal" style={{ fontSize: '0.9rem' }}>
                        {sensor.sensorTemplate.unit}
                      </small>
                    </div>
                    <div className="text-muted text-truncate" style={{ fontSize: '0.7rem' }}>
                      {sensor.modelName}
                    </div>
                  </div>

                  {/* BOTTOM: azioni */}
                  <div className="d-flex justify-content-between align-items-center pt-2 border-top" style={{ borderColor: '#f1f3f5' }}>
                    <button
                      className="btn btn-link p-0 text-muted hover-primary d-flex align-items-center gap-1"
                      style={{ fontSize: '0.7rem', textDecoration: 'none' }}
                      onClick={() => setSelectedSensor(sensor)}
                    >
                      <BsInfoCircle size={14} /> Dettagli
                    </button>
                    <div
                      className="d-inline-flex align-items-center justify-content-center rounded-3"
                      style={{ width: '34px', height: '34px', backgroundColor: '#e7f1ff', color: '#0d6efd' }}
                    >
                      <ChartModalButton
                        nodeId={mu.extendedId}
                        unit={sensor.sensorTemplate.unit || ""}
                        setDirty={handleSetDirty}
                      />
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            );
          })}
      </Row>

      <SensorInfoModal
        sensor={selectedSensor}
        onHide={() => setSelectedSensor(null)}
      />
    </div>
  );
}

function SensorInfoModal({ sensor, onHide }: { sensor: SensorDTO | null, onHide: () => void }) {
  if (!sensor) return null;

  return (
    <Modal show={!!sensor} onHide={onHide} centered size="lg" contentClassName="rounded-4 border-0 shadow">
      <Modal.Header closeButton className="border-bottom-0 pb-0">
        <Modal.Title className="fw-bold d-flex align-items-center gap-2">
          <BsTools className="text-primary" /> {sensor.modelName} <small className="text-muted fw-light">Specs</small>
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="p-4">
        <Row className="g-4">
          {/* SEZIONE 1: DATI ELETTRICI E CALIBRAZIONE */}
          <Col md={6}>
            <div className="p-3 rounded-4 bg-light h-100 border">
              <h6 className="fw-bold mb-3 d-flex align-items-center gap-2">
                <BsSliders className="text-primary" /> Signal & Calibration
              </h6>
              <ListGroup variant="flush" className="bg-transparent">
                <ListGroup.Item className="bg-transparent px-0 d-flex justify-content-between">
                  <span className="text-muted">Raw Electrical</span>
                  <span className="fw-bold">{sensor.elecVal.toFixed(4)} V</span>
                </ListGroup.Item>
                <ListGroup.Item className="bg-transparent px-0 d-flex justify-content-between">
                  <span className="text-muted">Phys Threshold</span>
                  <span className="fw-bold">{sensor.phyThreshold} {sensor.sensorTemplate.unit}</span>
                </ListGroup.Item>
                <ListGroup.Item className="bg-transparent px-0">
                  <div className="text-muted mb-2">Polynomial Coeffs (A-D)</div>
                  <div className="p-2 bg-white rounded border font-monospace text-center small">
                    {sensor.coeffA ?? 0} | {sensor.coeffB ?? 0} | {sensor.coeffC ?? 0} | {sensor.coeffD ?? 0}
                  </div>
                </ListGroup.Item>
              </ListGroup>
            </div>
          </Col>

          {/* SEZIONE 2: METROLOGIA E CONVERSIONE */}
          <Col md={6}>
            <div className="p-3 rounded-4 bg-primary bg-opacity-10 h-100 border border-primary-subtle">
              <h6 className="fw-bold mb-3 d-flex align-items-center gap-2 text-primary">
                <BsShieldCheck /> Metrology & Conversion
              </h6>
              <div className="small">
                <div className="mb-2"><strong>Conv Type:</strong> {sensor.sensorTemplate.conversion?.type || 'N/A'}</div>
                {sensor.sensorTemplate.conversion?.coefficients && (
                  <div className="mb-2">
                    <strong>Template Coeffs:</strong>
                    <Badge bg="primary" className="ms-2">{sensor.sensorTemplate.conversion.coefficients.join(', ')}</Badge>
                  </div>
                )}
                <div className="mt-3 p-2 bg-white rounded shadow-xs border">
                  <div className="fw-bold border-bottom pb-1 mb-1 text-uppercase text-xs" style={{ fontSize: '0.65rem' }}>Template Properties</div>
                  <pre className="mb-0" style={{ fontSize: '0.7rem' }}>{JSON.stringify(sensor.sensorTemplate.properties, null, 2)}</pre>
                </div>
              </div>
            </div>
          </Col>

          {/* SEZIONE 3: RANGE OPERATIVI (FULL WIDTH) */}
          {sensor.sensorTemplate.ranges && (
            <Col xs={12}>
              <div className="p-3 rounded-4 border bg-white">
                <h6 className="fw-bold mb-3 text-secondary">Operating Ranges</h6>
                <Row className="text-center g-2">
                  {Object.entries(sensor.sensorTemplate.ranges).map(([key, val]: [string, any]) => (
                    <Col key={key} xs={4}>
                      <div className="p-2 rounded bg-light border-dashed">
                        <div className="text-muted text-uppercase" style={{ fontSize: '0.6rem' }}>{key}</div>
                        <div className="small fw-bold">{val.min} / {val.max}</div>
                      </div>
                    </Col>
                  ))}
                </Row>
              </div>
            </Col>
          )}
        </Row>
      </Modal.Body>
    </Modal>
  );
}
