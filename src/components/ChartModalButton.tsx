import { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { BsGraphUp } from "react-icons/bs"; // Icona per il grafico
import { deleteMEasures, downloadMeasures } from "../API/measuresAPI";
import { useAuth } from "../API/AuthContext";

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export function ChartModalButton({ nodeId, unit, setDirty }: { nodeId: number, unit: string, setDirty: () => void }) {
  const [show, setShow] = useState(false);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const { xsrfToken } = useAuth();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

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
    if (window.confirm("Sei sicuro di voler eliminare queste misure?")) {
      await deleteMEasures(nodeId, unit, from, to, xsrfToken);
      handleClose();
      setDirty();
    }
  };

  // --- URL GRAFANA (Solo Full View) ---
  const getGrafanaUrl = () => {
    const base = BASE_URL === "https://www.christiandellisanti.uk"
      ? "https://grafana.christiandellisanti.uk"
      : "http://localhost:3000";

    const fromParam = from ? new Date(from).toISOString() : "now-1h";
    const toParam = to ? new Date(to).toISOString() : "now";

    return `${base}/d-solo/beh39dmpjez28e/dashboard1?orgId=1&from=${encodeURIComponent(fromParam)}&to=${encodeURIComponent(toParam)}&refresh=30s&theme=light&panelId=1&var-nodeId=${nodeId}&var-measureUnit=${unit}&timezone=browser`;
  };

  return (
    <>
      {/* BOTTONE MINIMALISTA: Da posizionare vicino al valore del sensore */}
      <Button
        variant="outline-primary"
        size="sm"
        className="rounded-circle p-2 shadow-sm"
        onClick={handleShow}
        title="Apri Grafico"
      >
        <BsGraphUp size={14} />
      </Button>

      {/* MODAL (Carica l'iframe SOLO quando show è true) */}
      <Modal show={show} onHide={handleClose} size="xl" centered backdrop="static">
        <Modal.Header closeButton className="bg-light">
          <Modal.Title className="h5">Dettaglio Storico: {unit} (Nodo {nodeId})</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ height: '80vh', display: 'flex', flexDirection: 'column' }}>

          <div className="mb-3 d-flex gap-3 align-items-center flex-wrap bg-white p-3 rounded border">
            <div className="d-flex align-items-center gap-2">
              <label className="small fw-bold">Da:</label>
              <input type="datetime-local" value={from} onChange={(e) => setFrom(e.target.value)} className="form-control form-control-sm" />
            </div>
            <div className="d-flex align-items-center gap-2">
              <label className="small fw-bold">A:</label>
              <input type="datetime-local" value={to} onChange={(e) => setTo(e.target.value)} className="form-control form-control-sm" />
            </div>
            <Button variant="link" size="sm" onClick={() => { setFrom(""); setTo(""); }}>Reset</Button>

            <div className="ms-auto d-flex gap-2">
              <Button variant="primary" size="sm" onClick={handleDownload}> JSON</Button>
              <Button variant="danger" size="sm" onClick={handleDelete}> Elimina</Button>
            </div>
          </div>

          <div className="flex-grow-1 bg-light rounded border overflow-hidden">
            {show && (
              <iframe
                src={getGrafanaUrl()}
                width="100%"
                height="100%"
                frameBorder="0"
                title="Grafana Full"
              ></iframe>
            )}
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
