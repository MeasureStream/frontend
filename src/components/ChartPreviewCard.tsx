import { useState } from "react";
import { Button, Modal, Card } from "react-bootstrap";
import { deleteMEasures, downloadMeasures } from "../API/measuresAPI";
import { useAuth } from "../API/AuthContext";

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const unitToTypeMap: Record<string, string> = {
  "°C": "Temperature", "Celsius": "Temperature", "K": "Temperature", "°F": "Temperature",
  "Pa": "Pressure", "Pascal": "Pressure", "kPa": "Pressure", "hPa": "Pressure", "bar": "Pressure", "atm": "Pressure", "mmHg": "Pressure",
  "%": "Humidity", "RH": "Humidity",
  "m": "Distance", "cm": "Distance", "mm": "Distance", "km": "Distance", "in": "Distance", "ft": "Distance",
  "m/s": "Speed", "km/h": "Speed", "mph": "Speed",
  "m/s²": "Acceleration", "g": "Acceleration",
  "V": "Voltage", "mV": "Voltage",
  "A": "Current", "mA": "Current",
  "W": "Power", "kW": "Power",
  "J": "Energy", "kJ": "Energy", "Wh": "Energy", "kWh": "Energy",
  "Hz": "Frequency", "kHz": "Frequency", "MHz": "Frequency",
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

  // --- LOGICA DOWNLOAD ---
  const handleDownload = async () => {
    const encodedUnit = encodeURIComponent(unit);
    const encodedFrom = from ? encodeURIComponent(new Date(from).toISOString()) : '';
    const encodedTo = to ? encodeURIComponent(new Date(to).toISOString()) : '';

    const blob = await downloadMeasures(nodeId, encodedUnit, encodedFrom, encodedTo);
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `measures-${nodeId}-${unit}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  };

  // --- LOGICA DELETE ---
  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete these measures?")) {
      await deleteMEasures(nodeId, unit, from, to, xsrfToken);
      handleClose();
      setDirty();
    }
  };

  // --- GENERAZIONE URL GRAFANA ---
  const getGrafanaUrl = (isFullView: boolean) => {
    const base = BASE_URL === "https://www.christiandellisanti.uk"
      ? "https://grafana.christiandellisanti.uk"
      : "http://localhost:3000";

    const orgId = 1;
    const theme = "light";
    const panelId = 1;

    // Se è preview (isFullView = false) mostriamo l'ultima ora, altrimenti usiamo i filtri o "last 5m"
    const fromParam = isFullView
      ? (from ? new Date(from).toISOString() : "now-5m")
      : "now-1h";
    const toParam = isFullView
      ? (to ? new Date(to).toISOString() : "now")
      : "now";

    return `${base}/d-solo/beh39dmpjez28e/dashboard1?orgId=${orgId}&from=${encodeURIComponent(fromParam)}&to=${encodeURIComponent(toParam)}&refresh=30s&theme=${theme}&panelId=${panelId}&__feature.dashboardSceneSolo&var-nodeId=${nodeId}&var-measureUnit=${unit}&timezone=browser`;
  };

  return (
    <>
      {/* CARD ANTEPRIMA (Sostituisce il vecchio bottone) */}
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
            <span className="badge bg-light text-primary border">Zoom Chart</span>
          </div>

          <div style={{ height: '200px', overflow: 'hidden', borderRadius: '4px', pointerEvents: 'none' }}>
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

      {/* MODAL DETTAGLIATO (Con tutti i tuoi controlli originali) */}
      <Modal show={show} onHide={handleClose} size="xl" centered>
        <Modal.Header closeButton>
          <Modal.Title>{getTypeFromUnit(unit)} - Detailed View</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ height: '85vh', display: 'flex', flexDirection: 'column' }}>

          {/* BARRA DEI CONTROLLI (Reintegrata qui) */}
          <div className="mb-3 d-flex gap-2 align-items-center flex-wrap bg-light p-3 rounded border">
            <div className="d-flex align-items-center gap-2">
              <label className="small fw-bold">From:</label>
              <input
                type="datetime-local"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                className="form-control form-control-sm"
              />
            </div>
            <div className="d-flex align-items-center gap-2">
              <label className="small fw-bold">To:</label>
              <input
                type="datetime-local"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                className="form-control form-control-sm"
              />
            </div>

            <Button variant="secondary" size="sm" onClick={() => { setFrom(""); setTo(""); }}>
              Reset (Last 5m)
            </Button>
            <div className="ms-auto d-flex gap-2">
              <Button variant="primary" size="sm" onClick={handleDownload}>
                📥 Download JSON
              </Button>
              <Button variant="danger" size="sm" onClick={handleDelete}>
                🗑️ Delete Range
              </Button>
            </div>
          </div>

          {/* GRAFICO FULL SIZE */}
          <div className="flex-grow-1">
            <iframe
              src={getGrafanaUrl(true)}
              width="100%"
              height="100%"
              frameBorder="0"
              title="Grafana Full Panel"
            ></iframe>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default ChartPreviewCard;
