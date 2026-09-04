import { useState, useEffect } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import { BsBroadcast } from "react-icons/bs";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

interface SignalQualityModalProps {
  show: boolean;
  onHide: () => void;
  cuId: number | string;
  cuName?: string;
}

export function SignalQualityModal({ show, onHide, cuId, cuName }: SignalQualityModalProps) {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [selectedPanel, setSelectedPanel] = useState<string>("all");
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const isDark =
      document.documentElement.getAttribute("data-bs-theme") === "dark" ||
      document.body.classList.contains("dark-mode");
    setTheme(isDark ? "dark" : "light");
  }, [show]);

  const buildPanelUrl = (panelId: number) => {
    const grafanaBase =
      BASE_URL === "https://www.christiandellisanti.uk"
        ? "https://grafana.christiandellisanti.uk"
        : "http://localhost:3000";

    const fromParam = from ? new Date(from).toISOString() : "now-6h";
    const toParam = to ? new Date(to).toISOString() : "now";

    return `${grafanaBase}/d-solo/adk5hcb/signalquality?orgId=1&from=${encodeURIComponent(
      fromParam
    )}&to=${encodeURIComponent(
      toParam
    )}&timezone=browser&var-cu_id=${cuId}&panelId=${panelId}&theme=${theme}`;
  };

  const handleResetTime = () => {
    setFrom("");
    setTo("");
  };

  return (
    <Modal show={show} onHide={onHide} size="xl" centered>
      <Modal.Header closeButton>
        <Modal.Title className="d-flex align-items-center gap-2 text-primary fs-5">
          <BsBroadcast /> Qualità del Segnale Radio {cuName ? `- ${cuName}` : ""}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="d-flex flex-column" style={{ minHeight: "80vh" }}>
        {/* BARRA CONTROLLI TEMPORALI E VISTA */}
        <div className="mb-3 d-flex gap-2 align-items-center flex-wrap bg-body-tertiary p-3 rounded border">
          {/* Selettore Pannelli */}
          <div className="d-flex align-items-center gap-2">
            <label className="small fw-bold mb-0">Vista:</label>
            <Form.Select
              size="sm"
              value={selectedPanel}
              onChange={(e) => setSelectedPanel(e.target.value)}
              style={{ width: "160px" }}
            >
              <option value="all">Tutti i Grafici</option>
              <option value="1">RSSI (dBm)</option>
              <option value="2">SNR (dB)</option>
              <option value="3">Data Rate (DR)</option>
            </Form.Select>
          </div>

          {/* Filtro From */}
          <div className="d-flex align-items-center gap-2 ms-lg-2">
            <label className="small fw-bold mb-0">Da:</label>
            <input
              type="datetime-local"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="form-control form-control-sm"
            />
          </div>

          {/* Filtro To */}
          <div className="d-flex align-items-center gap-2">
            <label className="small fw-bold mb-0">A:</label>
            <input
              type="datetime-local"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="form-control form-control-sm"
            />
          </div>

          {/* Pulsanti Rapidi */}
          <Button variant="outline-secondary" size="sm" onClick={handleResetTime}>
            Reset (Ultime 6h)
          </Button>

          <div className="ms-auto d-flex gap-1">
            <Button
              variant="outline-primary"
              size="sm"
              onClick={() => {
                const now = new Date();
                const past = new Date(now.getTime() - 24 * 60 * 60 * 1000);
                setFrom(past.toISOString().slice(0, 16));
                setTo(now.toISOString().slice(0, 16));
              }}
            >
              24h
            </Button>
            <Button
              variant="outline-primary"
              size="sm"
              onClick={() => {
                const now = new Date();
                const past = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                setFrom(past.toISOString().slice(0, 16));
                setTo(now.toISOString().slice(0, 16));
              }}
            >
              7 Giorni
            </Button>
          </div>
        </div>

        {/* AREA DEI GRAFICI INCORPORATI */}
        <div className="flex-grow-1 position-relative" style={{ minHeight: "500px" }}>
          {selectedPanel === "all" ? (
            <Row className="g-3 h-100">
              <Col md={12} style={{ height: "260px" }}>
                <iframe
                  src={buildPanelUrl(1)}
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  title="RSSI Chart"
                  className="rounded border"
                />
              </Col>
              <Col md={6} style={{ height: "260px" }}>
                <iframe
                  src={buildPanelUrl(2)}
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  title="SNR Chart"
                  className="rounded border"
                />
              </Col>
              <Col md={6} style={{ height: "260px" }}>
                <iframe
                  src={buildPanelUrl(3)}
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  title="DataRate Chart"
                  className="rounded border"
                />
              </Col>
            </Row>
          ) : (
            <iframe
              src={buildPanelUrl(Number(selectedPanel))}
              width="100%"
              height="100%"
              style={{ minHeight: "500px" }}
              frameBorder="0"
              title="Grafana Full Panel"
              className="rounded border"
            />
          )}
        </div>
      </Modal.Body>
    </Modal>
  );
}
