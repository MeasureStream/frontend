import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import {ControlUnitDTO, MeasurementUnitDTO, MeInterface, NodeDTO} from "../API/interfaces";
import {useParams} from "react-router";
import {Button, Card, Col, Container, ListGroup, Row, Spinner} from "react-bootstrap";
import {getMe} from "../API/MeAPI";
import { BsChevronDown } from "react-icons/bs";
import {getAllNodes, getNodesId} from "../API/NodeAPI";
import {getMuId} from "../API/MeasurementUnitAPI";
import {Accordion} from "react-bootstrap";
import {getCuId} from "../API/ControlUnitAPI";

import {Modal } from "react-bootstrap";


interface  Props {
    nodes : NodeDTO[]
}

const NodeInfoPage = ({nodes} : Props) => {
    const { nodeId } = useParams<{ nodeId: string }>();
    const id = parseInt(nodeId!!, 10);
    const [node, setNode] = useState<NodeDTO | null>(null);
    const [measurementUnits, setMeasurementUnits] = useState<MeasurementUnitDTO[]>([]);
    const [controlUnits, setControlUnits] = useState<ControlUnitDTO[]>([]);
    const [dirty, setDirty] = useState(true)

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
                setDirty(false)
            }

        }


            const fetchedMeasurementUnits: MeasurementUnitDTO[] = [
            {id: 1, networkId: 100, type: "Temperature", measuresUnit: "°C", idDcc: 123, nodeId: 1},
            {id: 2, networkId: 100, type: "Humidity", measuresUnit: "%", idDcc: 124, nodeId: 1},
        ];

        const fetchedControlUnits: ControlUnitDTO[] = [
            { id: 1, networkId: 100, name: "Controller A", remainingBattery: 80, rssi: -50, nodeId: 1 },
            { id: 2, networkId: 101, name: "Controller B", remainingBattery: 65, rssi: -55, nodeId: 1 },
            { id: 3, networkId: 102, name: "Controller C", remainingBattery: 90, rssi: -45, nodeId: 1 },
        ];
        fetchNodes().then( async () => await fetchMuCu() ).catch(e => console.log("ERROR: ", e))


       // setMeasurementUnits(fetchedMeasurementUnits.filter(mu => mu.nodeId === id));
        //setControlUnits(fetchedControlUnits.filter(cu => cu.nodeId === id));
    }, [ ]);

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

                                <ConfirmDelete onDelete={handleDelete} />
                            </Card.Text>
                        </Card.Body>
                    </Card>
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
                                                    < div key = {index}>
                                                        <ListGroup.Item variant="secondary">
                                                            NetworkId:{mu.id}
                                                        </ListGroup.Item>
                                                        <ListGroup.Item variant="secondary">
                                                            type: {mu.type}
                                                        </ListGroup.Item >
                                                        <ListGroup.Item variant="secondary">
                                                            Unit: {mu.measuresUnit}
                                                        </ListGroup.Item>
                                                    < /div>
                                                </ListGroup>

                                            </Accordion.Body>

                                        </Accordion.Item>





                                    ))}
                                </>
                            </Accordion>

                        </Card.Body>
                    </Card>

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
                </Col>
            </Row>
        </Container>
    );
};



// Funzione ConfirmDelete
function ConfirmDelete({ onDelete }: { onDelete: () => void }) {
    const [show, setShow] = useState(false);

    // Funzioni per mostrare/nascondere il modal
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    // Funzione chiamata quando si conferma l'eliminazione
    const handleDelete = () => {
        onDelete();  // Chiamata alla funzione passata come prop
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



export default NodeInfoPage;

