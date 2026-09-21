import { useState } from "react";
import { Button, Modal, Card, Form } from "react-bootstrap";
import { SensorDTO } from "../API/interfaces";

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

interface Props {
  sensorId: string | number;
  sensor: SensorDTO;
  measurementType: string;
  /**
   * Intestazione della card e titolo della finestra: "MU hA1B2 · Temperatura".
   * La compone chi conosce la MU (ChartsTab); senza, si ricade sul numero del canale,
   * che da solo dice poco all'utente.
   */
  title?: string;
}

export function ChartPreviewCard({ sensorId, sensor, measurementType, title }: Props) {
  const [show, setShow] = useState(false);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const heading = title ?? `Sensore ${sensor.sensorIndex}`;

  // Inizializziamo lo stato con measurementType (se valido), altrimenti fallback su "puntual"
  const [selectedView, setSelectedView] = useState<string>(() => {
    const validViews = ["puntual", "avg-std", "max-min", "integral"];
    return validViews.includes(measurementType) ? measurementType : "puntual";
  });

  const handleClose = () => setShow(false);
  const handleShow = () => {
    // Quando apriamo il modal, impostiamo il default sul measurementType della prop
    const validViews = ["puntual", "avg-std", "max-min", "integral"];
    setSelectedView(validViews.includes(measurementType) ? measurementType : "puntual");
    setShow(true);
  };

  // Mappatura delle viste con i codici panel-X
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

    // Per l'anteprima (card piccola) usiamo il measurementType del sensore, nel modal usiamo la selezione attiva
    const activeView = isFullView ? selectedView : (["puntual", "avg-std", "max-min", "integral"].includes(measurementType) ? measurementType : "puntual");
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
              {heading}
              <small className="text-muted ms-2">canale {sensor.sensorIndex}</small>
            </h6>
            <span className="badge bg-light text-primary border">Zoom Chart</span>
          </div>

          {/* Due card per riga: l'anteprima può essere più alta e i punti restano leggibili. */}
          <div style={{ height: '320px', overflow: 'hidden', borderRadius: '4px', pointerEvents: 'none' }}>
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
          <Modal.Title>
            {heading}
            <small className="text-muted ms-2">
              canale {sensor.sensorIndex} · {sensor.modelName}
            </small>
          </Modal.Title>
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
            {/* «Download JSON» e «Delete Range» tolti il 14/09/2026: chiamavano measure-manager,
                dismesso. Da reintegrare con endpoint di sensor-manager sulla tabella measurements. */}
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
