import { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { ControlUnitDTO } from "../API/interfaces";
import { UpdateCuMetadata } from "../API/ControlUnitAPI";
import { useAuth } from "../API/AuthContext";

interface EditMetadataModalProps {
  show: boolean;
  onHide: () => void;
  cu: ControlUnitDTO;
  onSuccess: () => void; // Callback per scatenare il refreshSingleCU
}

export function EditMetadataModal({ show, onHide, cu, onSuccess }: EditMetadataModalProps) {
  const { xsrfToken } = useAuth();
  const [name, setName] = useState(cu.name);
  const [semanticLocation, setSemanticLocation] = useState(cu.semanticLocation || "");
  const [loading, setLoading] = useState(false);

  // Sincronizza i campi se la CU cambia mentre il modal è renderizzato
  useEffect(() => {
    setName(cu.name);
    setSemanticLocation(cu.semanticLocation || "");
  }, [cu]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert("Il nome della Control Unit è obbligatorio.");
      return;
    }

    setLoading(false);
    try {
      setLoading(true);
      await UpdateCuMetadata(xsrfToken, cu.id, name, semanticLocation);
      onSuccess(); // Rinfresca i dati nella pagina principale
      onHide();    // Chiude il modal
    } catch (err) {
      console.error("Errore durante l'aggiornamento dei metadati:", err);
      alert("Impossibile aggiornare i metadati. Riprova.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title className="fw-bold h5">Modifica Metadati CU</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Form.Group className="mb-3" controlId="formCUName">
            <Form.Label className="small fw-bold text-muted text-uppercase">Nome Dispositivo</Form.Label>
            <Form.Control
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Inserisci il nome della CU"
              maxLength={100}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formCUSemanticLocation">
            <Form.Label className="small fw-bold text-muted text-uppercase">Locazione Semantica</Form.Label>
            <Form.Control
              type="text"
              value={semanticLocation}
              onChange={(e) => setSemanticLocation(e.target.value)}
              placeholder="Es. Laboratorio 3, Corridoio Sud..."
              maxLength={150}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer className="border-0 pt-0">
          <Button variant="outline-secondary" size="sm" onClick={onHide} disabled={loading}>
            Annulla
          </Button>
          <Button variant="primary" size="sm" type="submit" disabled={loading}>
            {loading ? "Salvataggio..." : "Salva Modifiche"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
