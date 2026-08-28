import { useState } from "react";
import { Button, Modal, Card, Form } from "react-bootstrap";
import { deleteMEasures, downloadMeasures } from "../API/measuresAPI";
import { useAuth } from "../API/AuthContext";

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export function ChartPreviewCard({ sensorId, measurementType, setDirty }: { sensorId: string | number, measurementType: string, setDirty: () => void }) {
  const [show, setShow] = useState(false);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  // Stato per gestire la vista selezionata nel Modal
  const [selectedView, setSelectedView] = useState<string>("puntual");
  const { xsrfToken } = useAuth();

  const handleClose = () => setShow(false);
  const handleShow = () => {
    setSelectedView("puntual");
    setShow(true);
  };

  // --- LOGICA DOWNLOAD ---
  const handleDownload = async () => {
    const encodedFrom = from ? encodeURIComponent(new Date(from).toISOString()) : '';
    const encodedTo = to ? encodeURIComponent(new Date(to).toISOString()) : '';

    const blob = await downloadMeasures(Number(sensorId), measurementType, encodedFrom, encodedTo);
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `measures-${sensorId}-${measurementType}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  };

  // --- LOGICA DELETE ---
  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete these measures?")) {
      await deleteMEasures(Number(sensorId), measurementType, from, to, xsrfToken);
      handleClose();
      setDirty();
    }
  };

  // Mappatura delle viste con i codici panel-X che hai testato e verificato funzionare
  const getPanelId = (viewType: string) => {
    switch (viewType) {
      case "integral": return "panel-1";
      case "puntual": return "panel-2";
      case "max-min": return "panel-3";
      case "avg-std": return "panel-4";
      default: return "panel-2";
    }
  };

  // --- GENERAZIONE URL GRAFANA ---
  const getGrafanaUrl = (isFullView: boolean) => {
    const base = BASE_URL === "https://www.christiandellisanti.uk"
      ? "https://grafana.christiandellisanti.uk"
      : "http://localhost:3000";

    const orgId = 1;
    const theme = "light";

    const activeView = isFullView ? selectedView : "puntual";
    const panelId = getPanelId(activeView);

    const fromParam = isFullView
      ? (from ? new Date(from).toISOString() : "now-6h")
      : "now-1h";
    const toParam = isFullView
      ? (to ? new Date(to).toISOString() : "now")
      : "now";

    return `${base}/d-solo/adlw9mw/dashboard-measurements-of-different-types?orgId=${orgId}&from=${encodeURIComponent(fromParam)}&to=${encodeURIComponent(toParam)}&timezone=browser&var-sensor_id=${sensorId}&panelId=${panelId}&theme=${theme}`;
  };

  return (
    <>
      {/* CARD ANTEPRIMA */}
      <Card
        className="mb-3 shadow-sm hover-shadow transition-all"
        onClick={handleShow}
        style={{ cursor: 'pointer', borderLeft: '5px solid var(--ms-sky)' }}
      >
        <Card.Body className="p-2">
          <div className="d-flex justify-content-between align-items-center mb-2 px-2">
            <h6 className="mb-0 fw-bold text-dark">
              Sensor: {sensorId} <small className="text-muted">({measurementType})</small>
            </h6>
            <span className="badge bg-light text-primary border">Zoom Chart</span>
          </div>

          <div style={{ height: '200px', overflow: 'hidden', borderRadius: '4px', pointerEvents: 'none' }}>
            <iframe
              src={getGrafanaUrl(false)}
              width="100%"
              height="100%"
              frameBorder="0"
              title={`Preview ${sensorId}`}
            ></iframe>
          </div>
        </Card.Body>
      </Card>

      {/* MODAL DETTAGLIATO */}
      <Modal show={show} onHide={handleClose} size="xl" centered>
        <Modal.Header closeButton>
          <Modal.Title>Sensor {sensorId} - Detailed View</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ height: '85vh', display: 'flex', flexDirection: 'column' }}>

          {/* BARRA DEI CONTROLLI */}
          <div className="mb-3 d-flex gap-2 align-items-center flex-wrap bg-light p-3 rounded border">

            {/* SELETTORE TIPO DI PANNELLO */}
            <div className="d-flex align-items-center gap-2">
              <label className="small fw-bold">View:</label>
              <Form.Select
                size="sm"
                value={selectedView}
                onChange={(e) => setSelectedView(e.target.value)}
                style={{ width: '160px' }}
              >
                <option value="puntual">Puntual</option>
                <option value="avg-std">Avg - Std</option>
                <option value="max-min">Max - Min</option>
                <option value="integral">Integral</option>
              </Form.Select>
            </div>

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
              Reset (Last 6h)
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
