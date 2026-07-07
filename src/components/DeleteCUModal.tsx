import { Modal, Button, Spinner } from "react-bootstrap";
import { useState } from "react";
import { DeleteCu } from "../API/ControlUnitAPI";
import { useAuth } from "../API/AuthContext";
import { ControlUnitDTO } from "../API/interfaces";

interface DeleteCUModalProps {
  show: boolean;
  onHide: () => void;
  controlUnit: ControlUnitDTO | null;
  onSuccess: () => void;
}

export function DeleteCUModal({ show, onHide, controlUnit, onSuccess }: DeleteCUModalProps) {
  const { xsrfToken } = useAuth();
  const [loading, setLoading] = useState(false);

  if (!controlUnit) return null;

  const handleDelete = async () => {
    setLoading(true);
    try {
      await DeleteCu(xsrfToken, controlUnit);
      onSuccess();
      onHide();
    } catch (err) {
      console.error("Errore durante l'eliminazione della CU:", err);
      alert("Si è verificato un errore durante l'eliminazione del dispositivo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered backup="static">
      <Modal.Header closeButton>
        <Modal.Title className="h5 text-danger">Elimina Control Unit</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          Sei sicuro di voler eliminare definitivamente la Control Unit <strong>{controlUnit.name}</strong>?
        </p>
        <p className="text-muted small mb-0">
          Questa azione rimuoverà il dispositivo dal network e scollegherà tutte le Measurement Units associate. L'operazione non è reversibile.
        </p>
      </Modal.Body>
      <Modal.Footer className="border-0">
        <Button variant="outline-secondary" size="sm" onClick={onHide} disabled={loading}>
          Annulla
        </Button>
        <Button variant="danger" size="sm" onClick={handleDelete} disabled={loading}>
          {loading ? (
            <>
              <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
              Eliminazione...
            </>
          ) : (
            "Sì, Elimina"
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
