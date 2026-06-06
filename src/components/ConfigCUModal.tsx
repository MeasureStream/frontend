import { useState } from "react";
import { Modal, Badge } from "react-bootstrap";
import { BsGearFill, BsCpu, BsClockHistory, BsBroadcast } from "react-icons/bs";
import { ControlUnitDTO } from "../API/interfaces";
import { CUConfigCommandDTO } from "../API/interfaces";
import { ConfigureCu } from "../API/ControlUnitAPI";
import { useAuth } from "../API/AuthContext";

interface ConfigProps {
  cu: ControlUnitDTO;
  show: boolean;
  onHide: () => void;
  handleSetDirty: () => void;
}

export function ConfigCUModal({ cu, show, onHide, handleSetDirty }: ConfigProps) {
  const [pollingInterval, setPollingInterval] = useState(cu.pollingInterval || 1);
  const [loading, setLoading] = useState(false);
  const { xsrfToken, setDirty } = useAuth();

  const handleSave = async () => {
    setLoading(true);
    try {
      // 2. Prepara il payload per il comando
      const command: CUConfigCommandDTO = {
        deviceId: cu.deviceId,
        devEui: cu.devEui,
        pollingInterval: pollingInterval // il valore dello slider (1-256)
      };

      // 3. Esegui la chiamata POST /configure
      // Passa null se non gestisci i token XSRF, o recuperalo dallo stato/context
      console.log(`xsrfToken : ${xsrfToken}   command ${command}`);
      await ConfigureCu(xsrfToken, command);
      setDirty(true);

      console.log(`Command sent for CU ${cu.deviceId}: Polling set to ${pollingInterval}h`);

      handleSetDirty(); // Notify data changed
      onHide();         // Close modal
    } catch (error) {
      console.error("Error sending configuration:", error);
      alert("Error sending command to control unit.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <Modal show={show} onHide={onHide} centered contentClassName="rounded-4 border-0 shadow-lg">
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title className="fw-bold d-flex align-items-center gap-2">
          <BsGearFill className="text-primary" />
          <span>Unit Settings</span>
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

        {/* SEZIONE POLLING INTERVAL */}
        <div className="mb-4">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <label className="fw-bold text-dark small text-uppercase d-flex align-items-center gap-2">
              <BsClockHistory /> Polling Interval
            </label>
            <Badge bg="primary" className="px-3 py-2">
              {pollingInterval} {pollingInterval === 1 ? 'hour' : 'hours'}
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

          <div className="d-flex justify-content-between mt-1 text-muted px-1" style={{ fontSize: '0.75rem' }}>
            <span>1h (Frequent)</span>
            <span>256h (Low Power)</span>
          </div>
        </div>

        {/* BOX 1: INFO TRASMISSIONE - Aggiunto mb-3 e font aumentato */}
        <div className="p-3 bg-primary bg-opacity-10 rounded-4 border border-primary-subtle mb-3">
          <h6 className="small fw-bold text-primary mb-2 text-uppercase">Transmission Info</h6>
          <div className="text-primary" style={{ fontSize: '0.85rem' }}>
            * The unit will wake up every <strong>{pollingInterval} {pollingInterval === 1 ? 'hour' : 'hours'}</strong> to transmit its status.
          </div>
        </div>

        {/* BOX 2: SINCRONIZZAZIONE - Font aumentato e linea più ariosa */}
        <div className="p-3 bg-warning bg-opacity-10 rounded-4 border border-warning-subtle">
          <div className="d-flex gap-3">
            <BsBroadcast className="text-warning mt-1" size={18} />
            <div className="text-warning-emphasis" style={{ fontSize: '0.85rem', lineHeight: '1.4' }}>
              <strong>Remote sync:</strong> The command has been queued.
              The unit will load the new parameters on the <strong>next available connection</strong>;
              the configuration will be active within 24 hours.
            </div>
          </div>
        </div>

      </Modal.Body>

      <Modal.Footer className="border-0 p-4 pt-0">
        <button className="btn btn-link text-muted text-decoration-none me-auto" onClick={onHide}>
          Cancel
        </button>
        <button
          className="btn btn-primary rounded-pill px-4 fw-bold shadow-sm"
          onClick={handleSave}
          disabled={loading}
        >
          {loading ? 'Sending...' : 'Save Changes'}
        </button>
      </Modal.Footer>
    </Modal>
  );
}
