import { useState } from "react";
import { Button, Modal, Card } from "react-bootstrap";
import { deleteMEasures, downloadMeasures } from "../API/measuresAPI";
import { useAuth } from "../API/AuthContext";
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const unitToTypeMap: Record<string, string> = {
  // Temperature
  "°C": "Temperature",
  "Celsius": "Temperature",
  "K": "Temperature",          // Kelvin
  "°F": "Temperature",         // Fahrenheit

  // Pressure
  "Pa": "Pressure",
  "Pascal": "Pressure",  // Pascal
  "kPa": "Pressure",           // Kilopascal
  "hPa": "Pressure",           // Hectopascal
  "bar": "Pressure",
  "atm": "Pressure",
  "mmHg": "Pressure",

  // Humidity
  "%": "Humidity",
  "RH": "Humidity",            // Relative Humidity

  // Distance / Length
  "m": "Distance",
  "cm": "Distance",
  "mm": "Distance",
  "km": "Distance",
  "in": "Distance",
  "ft": "Distance",

  // Speed
  "m/s": "Speed",
  "km/h": "Speed",
  "mph": "Speed",

  // Acceleration
  "m/s²": "Acceleration",
  "g": "Acceleration",

  // Voltage
  "V": "Voltage",
  "mV": "Voltage",

  // Current
  "A": "Current",
  "mA": "Current",

  // Power
  "W": "Power",
  "kW": "Power",

  // Energy
  "J": "Energy",
  "kJ": "Energy",
  "Wh": "Energy",
  "kWh": "Energy",

  // Frequency
  "Hz": "Frequency",
  "kHz": "Frequency",
  "MHz": "Frequency",
};

export function ChartPreviewCard({ nodeId, unit, setDirty }: { nodeId: number, unit: string, setDirty: () => void }) {
  const [show, setShow] = useState(false);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const { xsrfToken } = useAuth();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  function getTypeFromUnit(unit: string): string {
    return unitToTypeMap[unit] || unit;
  }

  // Helper per generare l'URL (aggiungiamo un parametro per nascondere i controlli nella preview)
  const getGrafanaUrl = (isFullView: boolean) => {
    const base = BASE_URL === "https://www.christiandellisanti.uk"
      ? "https://grafana.christiandellisanti.uk"
      : "http://localhost:3000";

    const fromParam = from ? new Date(from).toISOString() : "now-1h"; // Preview mostra l'ultima ora
    const toParam = to ? new Date(to).toISOString() : "now";

    // Se è una preview, usiamo parametri che rendono il grafico più "minimal"
    return `${base}/d-solo/beh39dmpjez28e/dashboard1?orgId=1&from=${encodeURIComponent(fromParam)}&to=${encodeURIComponent(toParam)}&refresh=30s&theme=light&panelId=1&var-nodeId=${nodeId}&var-measureUnit=${unit}&timezone=browser`;
  };

  return (
    <>
      {/* ANTEPRIMA GRAFICA INVECE DEL BOTTONE */}
      <Card
        className="mb-3 shadow-sm hover-shadow transition-all"
        onClick={handleShow}
        style={{ cursor: 'pointer', borderLeft: '5px solid #007bff' }}
      >
        <Card.Body className="p-2">
          <div className="d-flex justify-content-between align-items-center mb-2 px-2">
            <h6 className="mb-0 fw-bold text-dark">
              {getTypeFromUnit(unit)} <small className="text-muted">({unit})</small>
            </h6>
            <span className="badge bg-light text-primary border">Click to expand</span>
          </div>

          {/* Iframe in miniatura per l'anteprima */}
          <div style={{ height: '150px', overflow: 'hidden', borderRadius: '4px', pointerEvents: 'none' }}>
            <iframe
              src={getGrafanaUrl(false)}
              width="100%"
              height="100%"
              frameBorder="0"
              title={`Preview ${unit}`}
            ></iframe>
          </div>
        </Card.Body>
      </Card>

      {/* IL MODAL RIMANE UGUALE (più o meno) */}
      <Modal show={show} onHide={handleClose} size="xl" centered>
        <Modal.Header closeButton>
          <Modal.Title>{getTypeFromUnit(unit)} History - Node {nodeId}</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ height: '80vh' }}>
          {/* ... mantieni i tuoi controlli (input date, bottoni download/delete) ... */}
          <iframe
            src={getGrafanaUrl(true)}
            width="100%"
            height="100%"
            frameBorder="0"
          ></iframe>
        </Modal.Body>
      </Modal>
    </>
  );
}
