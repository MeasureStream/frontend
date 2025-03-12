import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import {ControlUnitDTO, MeasurementUnitDTO, MeInterface, NodeDTO} from "../API/interfaces";
import {useParams} from "react-router";
import {Card, Col, Container, ListGroup, Row, Spinner} from "react-bootstrap";
import {getMe} from "../API/MeAPI";
import {getNodesId} from "../API/NodeAPI";


const NodeInfoPage = () => {
    const { nodeId } = useParams<{ nodeId: string }>();
    const id = parseInt(nodeId!!, 10);
    const [node, setNode] = useState<NodeDTO | null>(null);
    const [measurementUnits, setMeasurementUnits] = useState<MeasurementUnitDTO[]>([]);
    const [controlUnits, setControlUnits] = useState<ControlUnitDTO[]>([]);

    useEffect( () => {

        const fetchALL = async () => {
            const res = await getNodesId(id)
            const fetchedNode = await res.json() as NodeDTO
            console.log(fetchedNode)
            setNode(fetchedNode);
        }
        if (!nodeId) return;





            const fetchedMeasurementUnits: MeasurementUnitDTO[] = [
            {id: 1, networkId: 100, type: "Temperature", measuresUnit: "°C", idDcc: 123, nodeId: 1},
            {id: 2, networkId: 100, type: "Humidity", measuresUnit: "%", idDcc: 124, nodeId: 1},
        ];

        const fetchedControlUnits: ControlUnitDTO[] = [
            {id: 1, networkId: 100, name: "Controller A", remainingBattery: 80, rssi: -50, nodeId: 1},
        ];
        fetchALL()

        setMeasurementUnits(fetchedMeasurementUnits.filter(mu => mu.nodeId === id));
        setControlUnits(fetchedControlUnits.filter(cu => cu.nodeId === id));
    }, [nodeId]);

    if (!node) {
        return (
            <Container className="text-center my-5">
                <Spinner animation="border" variant="primary" />
                <p className="mt-3">Nodo non trovato</p>
            </Container>
        );
    }

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
                            <ListGroup>
                                {measurementUnits.map(mu => (
                                    <ListGroup.Item key={mu.id}>
                                        {mu.type} ({mu.measuresUnit})
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                        </Card.Body>
                    </Card>

                    <Card className="mt-4 shadow">
                        <Card.Body>
                            <h3>Control Units</h3>
                            <ListGroup>
                                {controlUnits.map(cu => (
                                    <ListGroup.Item key={cu.id}>
                                        {cu.name} - Battery: {cu.remainingBattery}% - RSSI: {cu.rssi}
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};


export default NodeInfoPage;

