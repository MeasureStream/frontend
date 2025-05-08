import {ChangeEvent, FormEvent, useEffect, useState} from "react";
import {MeasurementUnitDTO} from "../API/interfaces";
import {getAllMuList, getMuId} from "../API/MeasurementUnitAPI";
import {getCuId} from "../API/ControlUnitAPI";
import {getNodeUnits} from "../API/NodeAPI";
import Table from 'react-bootstrap/Table';
import {Button, Col, Container, Form, ListGroup, Modal, Row} from "react-bootstrap";
import {useAuth} from "../API/AuthContext";

function Dcc() {
    const [measurementUnits, setMeasurementUnits] = useState<MeasurementUnitDTO[]>([]);
    const [dirty, setDirty] = useState(true)


    const [filterNodeId, setFilterNodeId] = useState<string>('');
    const [filterId, setFilterId] = useState<string>('');
    const [filterType, setFilterType] = useState<string>('');
    const [filterUnit, setFilterUnit] = useState<string>('');


    useEffect(() => {
        const fetchMuCu = async () => {
            if( dirty ){
                const mu = await getAllMuList()
                setMeasurementUnits(mu)
                setDirty(false)
            }

        }
        fetchMuCu()
    }, [dirty]);
    return (
        <>
            <Container fluid>
                <br/>
                <Form className="mb-3">
                    <Row className="g-2">
                        <Col md>
                            <Form.Control
                                type="text"
                                placeholder="Filter by Node ID"
                                value={filterNodeId}
                                onChange={(e) => setFilterNodeId(e.target.value)}
                            />
                        </Col>
                        <Col md>
                            <Form.Control
                                type="text"
                                placeholder="Filter by ID"
                                value={filterId}
                                onChange={(e) => setFilterId(e.target.value)}
                            />
                        </Col>
                        <Col md>
                            <Form.Control
                                type="text"
                                placeholder="Filter by Type"
                                value={filterType}
                                onChange={(e) => setFilterType(e.target.value)}
                            />
                        </Col>
                        <Col md>
                            <Form.Control
                                type="text"
                                placeholder="Filter by Measure Unit"
                                value={filterUnit}
                                onChange={(e) => setFilterUnit(e.target.value)}
                            />
                        </Col>
                    </Row>
                </Form>
                <br/>


                <Table responsive striped className="text-center">
                    <thead>
                    <tr>
                        <th>Node ID</th>
                        <th>ID</th>

                        <th>Type</th>




                <th>DCC File</th>
                <th>Expiration</th>



                    </tr>
                    </thead>
                    <tbody>
                    {measurementUnits
                        .slice()
                        .filter(mu =>
                            (!filterNodeId || mu.nodeId?.toString().includes(filterNodeId)) &&
                            (!filterId || mu.id.toString().includes(filterId)) &&
                            (!filterType || mu.type.toLowerCase().includes(filterType.toLowerCase())) &&
                            (!filterUnit || mu.measuresUnit.toLowerCase().includes(filterUnit.toLowerCase()))
                        )
                        .sort((a, b) => {
                            if (a.nodeId === undefined && b.nodeId !== undefined) return 1;
                            if (a.nodeId !== undefined && b.nodeId === undefined) return -1;
                            if (a.nodeId !== b.nodeId) return (a.nodeId ?? 0) - (b.nodeId ?? 0);
                            return Number(a.id) - Number(b.id);
                        })
                        .map((mu) => (
                            <tr key={mu.id}>
                                <td>{mu.nodeId ?? '-'}</td>
                                <td>{mu.id}</td>

                                <td>{mu.type}</td>



                    <td>{mu.dccFileNme ?? '-'}</td>
                    <td>{mu.expiration ?? '-'}</td>



                            <td><DccMuButtons mu={mu} expiration={"2025-12-31"} setDirty={setDirty}/></td>

                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Container>
        </>
    )
}




function DccMuButtons( {mu, expiration, setDirty}: { mu: MeasurementUnitDTO, expiration : string ,  setDirty: React.Dispatch<React.SetStateAction<boolean>> } ){
    const [file, setFile] = useState<File | null>(null);
    const { xsrfToken, setXsrfToken } = useAuth();  // Recupera il xsrfToken dal contesto
    const handleUpload = async () => {

        if (!file) {
            alert('Seleziona un file PDF prima di fare l\'upload.');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);


        try {
            const response = await fetch(`http://localhost:8080/API/pdf/?muId=${mu.id}&expiration=${expiration}`, {
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
            const response = await fetch(`http://localhost:8080/API/dcc/${mu.idDcc}`, {
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
            const response = await fetch(`http://localhost:8080/API/dcc/${mu.idDcc}/download`, {
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


                    <Button variant="outline-primary" onClick={handleDownload}>
                        Download
                    </Button>
                    <Button variant="outline-warning" onClick={handleDelete}>
                        Delete
                    </Button>
                    <Button variant="outline-secondary" onClick={handleOpen}>
                        Details
                    </Button>



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

export default Dcc