import {ControlUnitDTO, MeasurementUnitDTO, NodeDTO} from "../API/interfaces";
import {useEffect, useState} from "react";
import {useAuth} from "../API/AuthContext";
import {EditNode} from "../API/NodeAPI";

import {Button, Form, Modal} from "react-bootstrap";
import {DeleteCu, EditCu, getAllAvailableCuList} from "../API/ControlUnitAPI";

function AddCu({node, setDirty}:{node:NodeDTO, setDirty:React.Dispatch<React.SetStateAction<boolean>>}){
    const [showModal, setShowModal] = useState(false);
    const [selectedMU, setSelectedMU] = useState("");
    const [mus, setMus] = useState<ControlUnitDTO[]>([])
    const handleAdd = () => setShowModal(true);
    const handleClose = () => setShowModal(false);
    const {xsrfToken} = useAuth()
    const handleConfirmAdd = () => {
        console.log("Added MeasurementUnit:", selectedMU);
        EditNode(xsrfToken, { ...node, controlUnitsId: [...node.controlUnitsId, Number(selectedMU)]})
            .then(() => {setDirty(true)})
            .catch((e)=>console.log("Error not added ",e))
        handleClose();
    };
    useEffect(() => {
        const get = async () => {
            try {
                const m = await getAllAvailableCuList();
                setMus(m);
            } catch (error) {
                console.error("Failed to fetch Measurement Units", error);
                setMus([]);
            }
        }
        get()
    }, [showModal]);



    return (
        <>
            <Button variant="success" onClick={handleAdd}>Add</Button>
            <Modal show={showModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Control Unit</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group controlId="selectMeasurementUnit">
                        <Form.Label>Select Control Unit</Form.Label>
                        <Form.Select
                            value={selectedMU}
                            onChange={(e) => setSelectedMU(e.target.value)}
                        >
                            <option value="">-- Select --</option>
                            <>
                                {mus.map((mu) => (
                                    <option key={mu.id} value={mu.id}>
                                        {mu.name} ID: {mu.id})
                                    </option>
                                ))}
                            </>
                        </Form.Select>
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button
                        variant="primary"
                        onClick={handleConfirmAdd}
                        disabled={!selectedMU}
                    >
                        Add Control Unit
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

function RemoveCu({
                      cu,
                      setDirty
                  }: {
    cu: ControlUnitDTO,
    setDirty: React.Dispatch<React.SetStateAction<boolean>>
}) {
    const { xsrfToken } = useAuth();
    const [showModal, setShowModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleOpenModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);

    const handleConfirmRemove = async () => {
        setIsLoading(true);
        try {
            await EditCu(xsrfToken, { ...cu, nodeId: null } as ControlUnitDTO );
            console.log("Removed ControlUnit from Node:", cu.id);
            setDirty(true);
        } catch (error) {
            console.error("Error removing ControlUnit:", error);
        } finally {
            setIsLoading(false);
            handleCloseModal();
        }
    };

    return (
        <>
            <Button variant="warning" onClick={handleOpenModal}>
                <i className="bi bi-box-arrow-up me-1"></i> Remove
            </Button>

            <Modal show={showModal} onHide={handleCloseModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>
                        Remove Control Unit #{cu.id} from Node {cu.nodeId}
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <p>
                        Are you sure you want to <strong>remove</strong> the Control Unit <strong>#{cu.id} ({cu.name})</strong> from Node <strong>{cu.nodeId}</strong>?
                    </p>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal} disabled={isLoading}>
                        <i className="bi bi-x-circle me-1"></i> Cancel
                    </Button>
                    <Button variant="warning" onClick={handleConfirmRemove} disabled={isLoading}>
                        <>
                        {isLoading ? (
                            <>
                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                Removing...
                            </>
                        ) : (
                            <>
                                <i className="bi bi-box-arrow-up me-1"></i> Remove
                            </>
                        )}
                        </>
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

function DeleteControlUnitModal({
                                    cu,
                                    setDirty
                                }: {
    cu: ControlUnitDTO,
    setDirty: React.Dispatch<React.SetStateAction<boolean>>
}) {
    const { xsrfToken } = useAuth();
    const [showModal, setShowModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleDelete = () => setShowModal(true);
    const handleClose = () => setShowModal(false);

    const handleConfirmDelete = () => {
        setIsLoading(true);

        DeleteCu(xsrfToken, cu).then(() => {
            console.log("Deleted ControlUnit:", cu.id);
            setIsLoading(false);
            handleClose();
            setDirty(true);
        }).catch((e) => {
            console.error("Error deleting ControlUnit:", e);
            setIsLoading(false);
            handleClose();
        });
    };

    return (
        <>
            <Button variant="danger" onClick={handleDelete}>
                <i className="bi bi-trash3 me-1"></i> Delete
            </Button>

            <Modal show={showModal} onHide={handleClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Deletion</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <p>
                        Are you sure you want to <strong>delete</strong> the Control Unit
                        <strong> #{cu.id} ({cu.name}) </strong>?
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


export {AddCu, RemoveCu, DeleteControlUnitModal}