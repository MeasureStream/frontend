import {ChangeEvent, FormEvent, useEffect, useState} from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import {ControlUnitDTO, MeasurementUnitDTO, MeInterface, NodeDTO} from "../API/interfaces";
import {useParams} from "react-router";
import {Button, Card, Col, Container, Form, ListGroup, Row, Spinner} from "react-bootstrap";
import {getMe} from "../API/MeAPI";
import { BsChevronDown } from "react-icons/bs";
import {deleteNode, getAllNodes, getNodesId, getNodeUnits} from "../API/NodeAPI";
import {getMuId} from "../API/MeasurementUnitAPI";
import {Accordion} from "react-bootstrap";
import {getCuId} from "../API/ControlUnitAPI";

import {Modal } from "react-bootstrap";
import {number} from "yup";
import {useAuth} from "../API/AuthContext";
import { useNavigate } from 'react-router';


interface  Props {
    nodes : NodeDTO[]
}

const NodeInfoPage = ({nodes} : Props) => {
    const { nodeId } = useParams<{ nodeId: string }>();
    const id = parseInt(nodeId!!, 10);
    const [node, setNode] = useState<NodeDTO | null>(null);
    const [measurementUnits, setMeasurementUnits] = useState<MeasurementUnitDTO[]>([]);
    const [controlUnits, setControlUnits] = useState<ControlUnitDTO[]>([]);
    const [nodeUnits, setNodeUnits] = useState<string[]>([]);
    const [dirty, setDirty] = useState(true)
    const navigate = useNavigate()
    useEffect(() => {

        console.log("DEBUG node:", node)
        console.log("DEBUG mu:", measurementUnits)

        console.log(" dirty" , dirty )
    });

    useEffect( () => {

        const fetchNodes = async () => {
            const node_res = await getNodesId(Number(nodeId))
            setNode(node_res)

        }
        const fetchMuCu = async () => {

            if( dirty ){

                const mu = await getMuId( Number(nodeId) )
                setMeasurementUnits(mu)

                const cu = await getCuId((Number(nodeId)))
                setControlUnits(cu)

                const nu = await getNodeUnits(Number(nodeId))
                setNodeUnits(nu)

                setDirty(false)
            }

        }

        fetchNodes().then( async () => await fetchMuCu() ).catch(e => console.log("ERROR: ", e))

    }, [dirty]);

    if (!node) {
        return (
            <Container className="text-center my-5">
                <Spinner animation="border" variant="primary" />
                {/*<p className="mt-3">Nodo non trovato</p>*/}
            </Container>
        );
    }

    const handleDelete = () => {
        alert("Elemento eliminato!");  // Implementa la logica di eliminazione qui

        navigate("/")
    };

    return (
        <Container className="mt-5">
            <h1 className="text-center mb-4">Node Information</h1>
            <Row>
                <Col md={4}>
                    <Card className="shadow">
                        <Card.Body>
                            <Card.Title>{node.name}</Card.Title>
                            <Card.Text>
                                <strong>ID:</strong> {node.id}
                            </Card.Text>
                            <Card.Text>
                                <strong>Standard:</strong> {node.standard ? "Yes" : "No"}
                            </Card.Text>
                            <Card.Text>

                                <ConfirmDelete onDelete={handleDelete} id = {node.id}/>
                            </Card.Text>
                        </Card.Body>
                    </Card>

                    <Card className="shadow">
                        <Card.Body>
                            <Card.Title>Real Time Measures</Card.Title>
                            <>
                            {
                               nodeUnits.map((unit, index) => (
                                    <Card.Text key={index}>
                                        <ShowChart nodeId={node.id} unit={unit}></ShowChart>
                                    </Card.Text>
                                ))
                            }

                            </>


                        </Card.Body>
                    </Card>

                    <UploadCard muId={ Number(nodeId) } expiration={"2025-12-31"}/>
                </Col>

                <Col md={8}>
                    <Card className="shadow">
                        <Card.Body>
                            <h3>Map</h3>
                            <div style={{ height: "300px", width: "100%" }}>
                                <MapContainer
                                    center={[node.location.x, node.location.y]}
                                    zoom={13}
                                    style={{ height: "100%", width: "100%" }}
                                >
                                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                    <Marker position={[node.location.x, node.location.y]}>
                                        <Popup>{node.name}</Popup>
                                    </Marker>
                                </MapContainer>
                            </div>
                        </Card.Body>
                    </Card>

                    {
                        //inizio MeasurementUnit
                    }

                    <Card className="mt-4 shadow">
                        <Card.Body>
                            <h3>Measurement Units</h3>
                            <Accordion>


                                <>
                                    {measurementUnits.map((mu,index) => (

                                        <Accordion.Item key = {index} eventKey={index.toString()} >
                                            <Accordion.Header > MeasurementUnit id: {mu.id}</Accordion.Header>
                                            <Accordion.Body>
                                                <ListGroup>
                                                    <div key = {index}>
                                                        <ListGroup.Item variant="secondary">
                                                            NetworkId:{mu.id}
                                                        </ListGroup.Item>
                                                        <ListGroup.Item variant="secondary">
                                                            type: {mu.type}
                                                        </ListGroup.Item >
                                                        <ListGroup.Item variant="secondary">
                                                            Unit: {mu.measuresUnit}
                                                        </ListGroup.Item>
                                                    </div>
                                                </ListGroup>

                                            </Accordion.Body>

                                        </Accordion.Item>


                                    ))}
                                </>
                            </Accordion>

                        </Card.Body>
                    </Card>

                    {
                        //inizio ControlUnit
                    }

                    <Card className="mt-4 shadow">
                        <Card.Body>
                            <h3>Control Units</h3>

                                <Accordion>

                                <>
                                    {controlUnits.map((cu,index) => (

                                        <Accordion.Item key = {index} eventKey={index.toString()} >
                                            <Accordion.Header > {cu.name}  id: {cu.id}</Accordion.Header>
                                            <Accordion.Body>
                                                    <ListGroup>
                                                        <ListGroup.Item variant="secondary">
                                                            NetworkId: {cu.networkId}
                                                        </ListGroup.Item >
                                                        <ListGroup.Item variant="secondary">
                                                            Name: {cu.name}
                                                        </ListGroup.Item>
                                                        <ListGroup.Item variant="secondary">
                                                            Remaining Battery: {Math.ceil(Number(cu.remainingBattery))} %
                                                        </ListGroup.Item>
                                                        <ListGroup.Item variant="secondary">
                                                            rssi: {Number(cu.rssi).toFixed(3)} dB
                                                        </ListGroup.Item>
                                                    </ListGroup>

                                            </Accordion.Body>

                                        </Accordion.Item>





                                    ))}
                                </>
                                </Accordion>

                        </Card.Body>
                    </Card>

                    {
                        //inizio DCC
                    }
                    <Card className="mt-4 shadow">
                        <Card.Body>
                            <h3>DCCs</h3>
                            <>
                                        <ListGroup>
                                        {measurementUnits
                                            .slice() // per evitare mutazioni se measurementUnits viene da uno state
                                            .sort((a, b) => a.id - b.id)
                                            .map((mu,index) => (

                                            <div key = {mu.id}>
                                                <DccMu mu={mu} expiration={"2025-12-31"} setDirty={setDirty}></DccMu>

                                            </div>
                                        ))}
                                        </ListGroup>
                                    </>


                        </Card.Body>
                    </Card>

                </Col>
            </Row>
        </Container>
    );
};



// Funzione ConfirmDelete
function ConfirmDelete({onDelete, id}: { onDelete: () => void, id?: number }) {
    const [show, setShow] = useState(false);
    const { xsrfToken, setXsrfToken} = useAuth();  // Recupera il xsrfToken dal contesto
    // Funzioni per mostrare/nascondere il modal
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    // Funzione chiamata quando si conferma l'eliminazione
    const handleDelete = () => {
        deleteNode(xsrfToken, id).then(() => {
            //setDirty(true);
            onDelete() }  ).catch((e)=> console.log("nodo non eliminato xsrf:   ",xsrfToken, e))

        setShow(false);
    };

    return (
        <>
            {/* Bottone che apre il modal */}
            <Button variant="danger" onClick={handleShow}>
                DELETE
            </Button>

            {/* Modal di conferma */}
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>⚠️ Confirm Deletion</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure you want to delete this item?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        ❌ Cancel
                    </Button>
                    <Button variant="danger" onClick={handleDelete}>
                        ✅ Delete
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}



// Funzione ConfirmDelete
function ShowChart({nodeId, unit}: { nodeId: number, unit: string }) {
    const [show, setShow] = useState(false);

    // Funzioni per mostrare/nascondere il modal
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);


    return (
        <>
            {/* Bottone che apre il modal */}
            <Button variant="primary" onClick={handleShow}>
                Show {unit}
            </Button>


            <Modal show={show} onHide={handleClose} size="xl">
                <Modal.Header closeButton>
                    <Modal.Title>Sensor Dashboard</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ height: '80vh' }}>
                    <iframe
                        //src={`http://localhost:8080/grafana/d-solo/beh39dmpjez28e/dashboard1?orgId=1&from=2025-04-07T02:44:38.103Z&to=2025-04-07T12:39:42.265Z&refresh=30s&theme=light&panelId=1&__feature.dashboardSceneSolo&var-nodeId=1&var-measureUnit=Celsius&timezone=browser`}
                        src={`http://localhost:3000/d-solo/beh39dmpjez28e/dashboard1?orgId=&refresh=30s&theme=light&panelId=1&__feature.dashboardSceneSolo&var-nodeId=${nodeId}&var-measureUnit=${unit}&timezone=browser`}
                        //src={`http://172.20.0.30:3000/d-solo/beh39dmpjez28e/dashboard1?orgId=1&from=2025-04-07T02:44:38.103Z&to=2025-04-07T12:39:42.265Z&refresh=30s&theme=light&panelId=1&__feature.dashboardSceneSolo&var-nodeId=${1}&var-measureUnit=${unit}&timezone=browser`}
                        //src={`http://localhost:3000/public-dashboards/366bb25b5951418bae6d2664f20b0f18`}
                        width="100%"
                        height="100%"
                        frameBorder="0"
                        title="Grafana Panel"
                    ></iframe>
                </Modal.Body>
            </Modal>
        </>
    );
}

function DccMu( {mu, expiration, setDirty}: { mu: MeasurementUnitDTO, expiration : string ,  setDirty: React.Dispatch<React.SetStateAction<boolean>> } ){
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
            <ListGroup.Item variant="light" className="d-flex justify-content-between align-items-center">
                <div>
                    MU: {mu.id} {mu.dccFileNme}
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



const UploadCard = ({muId, expiration}: { muId: number, expiration : string }) => {
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
            const response = await fetch(`http://localhost:8080/API/pdf/?muId=${muId}&expiration=${expiration}`, {
                method: 'POST',
                headers: {
                    'X-XSRF-TOKEN': xsrfToken || '',  // Includi il token nell'intestazione
                },
                body: formData,
            });

            if (response.ok) {
                console.log('Upload riuscito');
                alert('Upload riuscito!');
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

    return (
        <Card className="mt-4 shadow">
            <Card.Body>
                <h3>Upload PDF</h3>
                <form onSubmit={handleSubmit} encType="multipart/form-data">
                    <input
                        type="file"
                        accept="application/pdf"
                        onChange={handleFileChange}
                    />
                    <Button variant="success" className="mt-3" type="submit">
                        Upload PDF
                    </Button>
                </form>
            </Card.Body>
        </Card>
    );
};




export default NodeInfoPage;

