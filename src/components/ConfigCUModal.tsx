import { useState } from "react";
import { Modal, Badge } from "react-bootstrap";
import { BsGearFill, BsCpu, BsClockHistory, BsBroadcast } from "react-icons/bs";
import { ControlUnitDTO } from "../API/interfaces";

interface ConfigProps {
  cu: ControlUnitDTO;
  show: boolean;
  onHide: () => void;
  handleSetDirty: () => void;
}

export function ConfigCUModal({ cu, show, onHide, handleSetDirty }: ConfigProps) {
  // Inizializziamo lo stato con il valore in ore (default 1h se non presente)
  const [pollingInterval, setPollingInterval] = useState(cu.pollingInterval || 1);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      // Endpoint ipotetico usando l'intervallo in ore
      // await updateCU(cu.id, { pollingInterval: pollingInterval });
      console.log(`Salvataggio CU ID ${cu.id}: Polling Interval impostato a ${pollingInterval} ore`);

      handleSetDirty();
      onHide();
    } catch (error) {
      console.error("Errore configurazione:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered contentClassName="rounded-4 border-0 shadow-lg">
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title className="fw-bold d-flex align-items-center gap-2">
          <BsGearFill className="text-primary" />
          <span>Impostazioni Unità</span>
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="p-4">
        {/* INFO RIEPILOGO CU */}
        <div className="d-flex align-items-center gap-3 p-3 mb-4 bg-light rounded-4 border">
          <div className="bg-white p-2 rounded-3 shadow-sm text-primary">
            <BsCpu size={20} />
          </div>
          <div className="small">
            <div className="fw-bold">ID: {cu.devEui}</div>
            <div className="text-muted">Model: {cu.model}</div>
          </div>
        </div>

        {/* SEZIONE POLLING INTERVAL (ORE) */}
        <div className="mb-4">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <label className="fw-bold text-dark small text-uppercase d-flex align-items-center gap-2">
              <BsClockHistory /> Polling Interval
            </label>
            <Badge bg="primary" className="px-2 py-1">
              {pollingInterval} {pollingInterval === 1 ? 'ora' : 'ore'}
            </Badge>
          </div>

          <input
            type="range"
            className="form-range custom-range"
            min="1"
            max="256"
            step="1"
            value={pollingInterval}
            onChange={(e) => setPollingInterval(parseInt(e.target.value))}
          />

          <div className="d-flex justify-content-between mt-1 text-muted px-1" style={{ fontSize: '0.7rem' }}>
            <span>1h (Frequente)</span>
            <span>256h (Risparmio)</span>
          </div>
        </div>

        {/* STATO E NOTA TECNICA */}
        <div className="p-3 bg-primary bg-opacity-10 rounded-4 border border-primary-subtle">
          <h6 className="small fw-bold text-primary mb-2 text-uppercase">Info Trasmissione</h6>

          <div className="text-primary" style={{ fontSize: '0.75rem' }}>
            * L'unità si risveglierà ogni <strong>{pollingInterval} {pollingInterval === 1 ? 'ora' : 'ore'}</strong> per trasmettere il suo stato.
          </div>
        </div>

        <div className="p-3 bg-warning bg-opacity-10 rounded-4 border border-warning-subtle">
          <div className="d-flex gap-2">
            <BsBroadcast className="text-warning mt-1" size={14} />
            <div className="text-warning-emphasis" style={{ fontSize: '0.75rem', lineHeight: '1.2' }}>
              <strong>Sincronizzazione remota:</strong> Il comando è stato messo in coda. L'unità caricherà i nuovi parametri durante la <strong>prossima connessione utile</strong>; la configurazione sarà pienamente operativa entro le 24 ore successive.
            </div>
          </div>
        </div>

      </Modal.Body>

      <Modal.Footer className="border-0 p-4 pt-0">
        <button className="btn btn-link text-muted text-decoration-none me-auto" onClick={onHide}>
          Annulla
        </button>
        <button
          className="btn btn-primary rounded-pill px-4 fw-bold shadow-sm"
          onClick={handleSave}
          disabled={loading}
        >
          {loading ? 'Invio in corso...' : 'Salva Modifiche'}
        </button>
      </Modal.Footer>
    </Modal>
  );
}
