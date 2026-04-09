import { Row, Col, Card, Badge, Modal, Table } from "react-bootstrap";
import { BsCpu, BsThermometerHalf, BsDroplet, BsSpeedometer, BsGear, BsInfoCircle } from "react-icons/bs";
import { useState } from "react";
import { ChartModalButton } from "./ChartModalButton";
import { MeasurementUnitDTO, SensorDTO } from "../API/interfaces";

interface Props {
  mu: MeasurementUnitDTO;
  handleSetDirty: () => void;
}

export function MeasurementUnitCard({ mu, handleSetDirty }: Props) {
  const [selectedSensor, setSelectedSensor] = useState<SensorDTO | null>(null);

  const getSensorIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'temperature': return <BsThermometerHalf className="text-danger" />;
      case 'humidity': return <BsDroplet className="text-info" />;
      case 'accelerometer': return <BsSpeedometer className="text-warning" />;
      case 'pressure': return <BsGear className="text-secondary" />;
      default: return <BsCpu />;
    }
  };

  return (
    <div className="mb-5 p-3 rounded shadow-sm border bg-white">
      <div className="d-flex align-items-center justify-content-between mb-4 pb-2 border-bottom">
        <div className="d-flex align-items-center gap-2">
          <BsCpu className="text-primary" />
          <h5 className="mb-0 font-monospace">MU: {mu.extendedId}</h5>
        </div>
        <Badge bg="dark" className="fw-normal">Model: {mu.model}</Badge>
      </div>

      <Row className="g-4">
        {mu.sensors.map((sensor) => (
          <Col key={sensor.id} lg={6}>
            <Card className="border-0 bg-light h-100 shadow-sm">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div className="d-flex align-items-center gap-2">
                    {getSensorIcon(sensor.sensorTemplate.type)}
                    <span className="fw-bold">{sensor.modelName}</span>
                  </div>

                  <div className="d-flex align-items-center gap-2">
                    {/* INFO BUTTON */}
                    <BsInfoCircle
                      className="text-muted cursor-pointer hover-primary"
                      style={{ cursor: 'pointer' }}
                      size={18}
                      onClick={() => setSelectedSensor(sensor)}
                    />
                    <ChartModalButton
                      nodeId={mu.extendedId}
                      unit={sensor.sensorTemplate.unit || ""}
                      setDirty={handleSetDirty}
                    />
                    <Badge pill bg="white" className="text-primary border border-primary">
                      Ch: {sensor.sensorIndex}
                    </Badge>
                  </div>
                </div>

                {/* SOLO VALORE FISICO - UI PULITA */}
                <div className="text-center py-3 bg-white rounded border shadow-sm">
                  <div className="display-6 fw-bold text-primary">
                    {sensor.physVal.toFixed(2)}
                  </div>
                  <small className="text-muted text-uppercase fw-bold">
                    {sensor.sensorTemplate.unit}
                  </small>
                </div>

                <div className="mt-3 pt-2 border-top d-flex justify-content-between small text-muted">
                  <span>Sampling: <strong>{sensor.samplingF} Hz</strong></span>
                  <span className="text-uppercase">{sensor.sensorTemplate.type}</span>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* MODAL DETTAGLI SENSORE */}
      <SensorInfoModal
        sensor={selectedSensor}
        onHide={() => setSelectedSensor(null)}
      />
    </div>
  );
}

// --- SOTTO-COMPONENTE PER IL MODAL DELLE INFO ---
function SensorInfoModal({ sensor, onHide }: { sensor: SensorDTO | null, onHide: () => void }) {
  if (!sensor) return null;

  return (
    <Modal show={!!sensor} onHide={onHide} centered size="lg">
      <Modal.Header closeButton className="bg-light">
        <Modal.Title className="h5">Dettagli Tecnici: {sensor.modelName}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-0">
        <Table responsive striped borderless className="mb-0">
          <thead className="table-dark">
            <tr>
              <th className="ps-3">Parametro</th>
              <th>Valore / Configurazione</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="ps-3 fw-bold">Valore Elettrico</td>
              <td><Badge bg="info">{sensor.elecVal.toFixed(4)} V</Badge></td>
            </tr>
            <tr>
              <td className="ps-3 fw-bold">Soglia Fisica</td>
              <td>{sensor.phyThreshold} {sensor.sensorTemplate.unit}</td>
            </tr>
            <tr>
              <td className="ps-3 fw-bold">Coefficienti (A, B, C, D)</td>
              <td className="font-monospace small">
                {sensor.coeffA ?? 0} | {sensor.coeffB ?? 0} | {sensor.coeffC ?? 0} | {sensor.coeffD ?? 0}
              </td>
            </tr>
            <tr>
              <td className="ps-3 fw-bold">Data Calibrazione</td>
              <td>{sensor.calDate ? new Date(sensor.calDate).toLocaleDateString() : 'N/D'} ({sensor.calInitials || '---'})</td>
            </tr>
            <tr>
              <td className="ps-3 fw-bold">Template Type</td>
              <td>{sensor.sensorTemplate.type}</td>
            </tr>
            {sensor.sensorTemplate.ranges && (
              <tr>
                <td className="ps-3 fw-bold">Range Operativi</td>
                <td className="small">
                  {JSON.stringify(sensor.sensorTemplate.ranges)}
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </Modal.Body>
    </Modal>
  );
}
