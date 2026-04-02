import { MeasurementUnitDTO } from "../API/interfaces";
import { useState } from "react";
import { useAuth } from "../API/AuthContext";
import { Button, Modal } from "react-bootstrap";
import { DeleteMu, } from "../API/MeasurementUnitAPI";

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';


function DeleteMUModal({ mu, setDirty }: { mu: MeasurementUnitDTO, setDirty: React.Dispatch<React.SetStateAction<boolean>> }) {
  const { xsrfToken } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  const handleConfirmDelete = () => {
    setIsLoading(true);

    DeleteMu(xsrfToken, mu).then(() => {
      console.log("Deleted MeasurementUnit:", mu.id);
      setIsLoading(false);
      handleClose();
      setDirty(true);
    }
    ).catch(
      (e) => {
        console.error("Error deleting MU:", e);
        setIsLoading(false);
        handleClose();
      }
    )


  };

  return (
    <>
      <Button variant="danger" onClick={handleDelete}>
        <i className="bi bi-trash3 me-1"></i> Delete
      </Button>

      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            Confirm Deletion
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <p>
            Are you sure you want to <strong>delete</strong> the Measurement Unit
            <strong> #{mu.id} </strong>?
          </p>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose} disabled={isLoading}>
            <i className="bi bi-x-circle me-1"></i> Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleConfirmDelete}
            disabled={isLoading}
          >
            <>
              {isLoading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Deleting...
                </>
              ) : (
                <>
                  <i className="bi bi-trash3 me-1"></i> Delete
                </>
              )}
            </>
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}


export { DeleteMUModal }
