import {MeasurementUnitDTO, NodeDTO} from "../API/interfaces";
import {ChangeEvent, FormEvent, useEffect, useState} from "react";
import {useAuth} from "../API/AuthContext";
import {Button, Form, ListGroup, Modal} from "react-bootstrap";
import {EditNode} from "../API/NodeAPI";
import {DeleteMu, EditMu, getAllAvailableMuList} from "../API/MeasurementUnitAPI";

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

function DccMu( {mu, expiration, setDirty}: { mu: MeasurementUnitDTO, expiration : string ,  setDirty: React.Dispatch<React.SetStateAction<boolean>> } ){
    const [file, setFile] = useState<File | null>(null);
    const [newExpiration, setNewExpiration] = useState(expiration); // 👈 Nuova expiration modificabile

    const { xsrfToken, setXsrfToken } = useAuth();  // Recupera il xsrfToken dal contesto
    const handleUpload = async () => {

        if (!file) {
            alert('Seleziona un file PDF prima di fare l\'upload.');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);


        try {
            const response = await fetch(`${BASE_URL}/API/pdf/?muId=${mu.id}&expiration=${expiration}`, {
                method: 'POST',
                headers: {
                    'X-XSRF-TOKEN': xsrfToken || '',  // Includi il token nell'intestazione
                },
                body: formData,
            });

            if (response.ok) {
                console.log('Upload riuscito');
                alert('Upload riuscito!');
                setDirty(true)
                //window.location.href = "/uploadSuccess";  // Se il server risponde correttamente
            } else {
                const errorText = await response.text();
                console.error('Errore:', errorText);
                alert('Errore durante l\'upload');
            }
        } catch (err) {
            console.error('Errore di rete:', err);
            alert('Errore nella richiesta');
        }
    };
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFile(e.target.files?.[0] ?? null);
    };
    const handleDateChange = (e: ChangeEvent<HTMLInputElement>) => {
        setNewExpiration(e.target.value);
    };
    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        handleUpload();
    };
    const [showModal, setShowModal] = useState(false);

    const handleOpen = () => setShowModal(true);
    const handleClose = () => setShowModal(false);
    const handleDelete = async () => {
        const confirm = window.confirm(`Sei sicuro di voler eliminare il file PDF della MU ${mu.id}?`);
        if (!confirm) return;

        try {
            const response = await fetch(`${BASE_URL}/API/dcc/${mu.idDcc}`, {
                method: 'DELETE',
                headers: {
                    'X-XSRF-TOKEN': xsrfToken || '', // se usi la protezione CSRF
                },
            });

            if (response.ok) {
                alert('File PDF eliminato con successo.');
                setDirty(true); // forza il genitore a rifare il fetch
            } else {
                const errorText = await response.text();
                console.error('Errore:', errorText);
                alert('Errore durante l\'eliminazione.');
            }
        } catch (err) {
            console.error('Errore di rete:', err);
            alert('Errore di rete durante la richiesta.');
        }
    };
    const handleDownload = async () => {
        try {
            const response = await fetch(`${BASE_URL}/API/dcc/${mu.idDcc}/download`, {
                method: 'GET',
            });

            if (!response.ok) {
                throw new Error('Errore nel download del file');
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.href = url;
            a.download = mu.dccFileNme || 'file.pdf';  // nome del file da salvare
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Errore durante il download:', error);
        }
    };


    return (
        <>
            <ListGroup.Item variant="light" className="d-flex justify-content-between align-items-center">
                <div>
                    MU: {mu.id} {mu.expiration} {mu.dccFileNme}
                </div>
                <div className="ms-auto d-flex gap-2">
                    <Button variant="outline-primary" onClick={handleDownload}>
                        Download
                    </Button>
                    <Button variant="outline-warning" onClick={handleDelete}>
                        Delete
                    </Button>
                    <Button variant="outline-secondary" onClick={handleOpen}>
                        Details
                    </Button>
                </div>
            </ListGroup.Item>

            <Modal show={showModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Upload DCC for MU</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p><strong>MUId:</strong> {mu.id}</p>
                    <p><strong>Dcc file name:</strong> {mu.dccFileNme}</p>
                    <Form onSubmit={handleSubmit} encType="multipart/form-data">
                        <Form.Group controlId="formFile">
                            <Form.Label>Carica file PDF</Form.Label>
                            <Form.Control
                                type="file"
                                accept="application/pdf"
                                onChange={handleFileChange}
                            />
                        </Form.Group>

                        <Form.Group controlId="formDate" className="mt-3">
                            <Form.Label>Expiration date</Form.Label>
                            <Form.Control
                                type="date"
                                value={newExpiration}
                                onChange={handleDateChange}
                                required
                            />
                        </Form.Group>

                        <Button variant="success" className="mt-3" type="submit">
                            Upload PDF
                        </Button>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Chiudi
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

function AddMu({node, setDirty}:{node:NodeDTO, setDirty:React.Dispatch<React.SetStateAction<boolean>>}){
    const [showModal, setShowModal] = useState(false);
    const [selectedMU, setSelectedMU] = useState("");
    const [mus, setMus] = useState<MeasurementUnitDTO[]>([])
    const handleAdd = () => setShowModal(true);
    const handleClose = () => setShowModal(false);
    const {xsrfToken} = useAuth()
    const handleConfirmAdd = () => {
        console.log("Added MeasurementUnit:", selectedMU);
        EditNode(xsrfToken, { ...node, measurementUnitsId: [...node.measurementUnitsId, Number(selectedMU)]})
            .then(() => {setDirty(true)})
            .catch((e)=>console.log("Error not added ",e))
        handleClose();
    };
    useEffect(() => {
        const get = async () => {
            try {
                const m = await getAllAvailableMuList();
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
                    <Modal.Title>Add Measurement Unit</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group controlId="selectMeasurementUnit">
                        <Form.Label>Select Measurement Unit</Form.Label>
                        <Form.Select
                            value={selectedMU}
                            onChange={(e) => setSelectedMU(e.target.value)}
                        >
                            <option value="">-- Select --</option>
                            <>
                                {mus.map((mu) => (
                                    <option key={mu.id} value={mu.id}>
                                        {mu.type} - {mu.measuresUnit} (ID: {mu.id})
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
                        Add Measurement Unit
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

function RemoveMU({mu, setDirty}:{mu:MeasurementUnitDTO, setDirty: React.Dispatch<React.SetStateAction<boolean>>}){
    const { xsrfToken, setXsrfToken } = useAuth();
    const [showModal, setShowModal] = useState(false);
    const [selectedMU, setSelectedMU] = useState("");

    const handleRemove = () => setShowModal(true);
    const handleClose = () => setShowModal(false);

    const handleConfirmRemove = () => {


        EditMu(xsrfToken, {...mu, nodeId: null} as MeasurementUnitDTO)
            .then(() => {
                console.log("Removed MeasurementUnit:", selectedMU)
                setDirty(true)
            })
            .catch(e => console.log("Error: ", e))
        handleClose();
    };



    return (
        <>
            <Button variant="danger" onClick={handleRemove}>
                <i className="bi bi-trash3 me-1"></i> Remove
            </Button>

            <Modal show={showModal} onHide={handleClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>
                        Confirm Removal
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <p>
                        Are you sure you want to <strong>remove</strong> the Measurement Unit
                        <strong> #{mu.id} </strong> from Node
                        <strong> #{mu.nodeId} </strong>?
                    </p>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        <i className="bi bi-x-circle me-1"></i> Cancel
                    </Button>
                    <Button
                        variant="danger"
                        onClick={handleConfirmRemove}
                    >
                        <i className="bi bi-trash3 me-1"></i> Remove
                    </Button>
                </Modal.Footer>
            </Modal>

        </>
    )
}

function DeleteMUModal({ mu, setDirty }: { mu: MeasurementUnitDTO, setDirty: React.Dispatch<React.SetStateAction<boolean>> }) {
    const { xsrfToken } = useAuth();
    const [showModal, setShowModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleDelete = () => setShowModal(true);
    const handleClose = () => setShowModal(false);

    const handleConfirmDelete =  () => {
        setIsLoading(true);

        DeleteMu(xsrfToken, mu).then(()=>{
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


export {DccMu, AddMu, RemoveMU, DeleteMUModal}