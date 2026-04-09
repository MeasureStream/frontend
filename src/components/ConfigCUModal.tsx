import { useState } from "react";
import { Modal, Badge } from "react-bootstrap";
import { BsGearFill, BsCpu } from "react-icons/bs";




interface ConfigProps {
  cu: any; // Qui usa il tuo tipo ControlUnitDTO
  show: boolean;
  onHide: () => void;
  handleSetDirty: () => void;
}

export function ConfigCUModal({ cu, show, onHide, handleSetDirty }: ConfigProps) {
  // Inizializziamo lo stato con i valori attuali della CU
  const [pollingRate, setPollingRate] = useState(cu.pollingRate || 1);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      // Esempio di invio: usiamo cu.id per l'endpoint
      // await updateCU(cu.id, { pollingRate });
      console.log(`Salvataggio CU ID ${cu.id}: Polling Rate ${pollingRate}Hz`);

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
            <div className="fw-bold">ID: {cu.extendedId}</div>
            <div className="text-muted">Model: {cu.modelName}</div>
          </div>
        </div>

        {/* SEZIONE POLLING RATE */}
        <div className="mb-4">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <label className="fw-bold text-dark small text-uppercase">Polling Rate</label>
            <Badge bg="primary-subtle" className="text-primary px-2 py-1">
              {pollingRate} Hz
            </Badge>
          </div>

          <input
            type="range"
            className="form-range custom-range"
            min="1"
            max="120"
            step="1"
            value={pollingRate}
            onChange={(e) => setPollingRate(parseInt(e.target.value))}
          />

          <div className="d-flex justify-content-between mt-1 text-muted px-1" style={{ fontSize: '0.7rem' }}>
            <span>1 Hz (Lento)</span>
            <span>120 Hz (Veloce)</span>
          </div>
        </div>

        {/* ALTRE INFO DI SOLA LETTURA (Esempio di utilità del passare tutto l'oggetto) */}
        <div className="p-3 bg-primary bg-opacity-10 rounded-4 border border-primary-subtle">
          <h6 className="small fw-bold text-primary mb-2 text-uppercase">Stato Attuale</h6>
          <div className="d-flex justify-content-between small">
            <span className="text-muted">Firmware Version:</span>
            <span className="fw-bold">{cu.fwVersion || "v1.0.4"}</span>
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
