import {useEffect, useState} from "react";
import {MeasurementUnitDTO} from "../API/interfaces";
import {getAllMuList, getMuId} from "../API/MeasurementUnitAPI";
import {getCuId} from "../API/ControlUnitAPI";
import {getNodeUnits} from "../API/NodeAPI";
import Table from 'react-bootstrap/Table';
import {Button, Col, Container, Form, Modal, Row} from "react-bootstrap";
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

function Measures() {
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
    }, []);
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
                <th>Measure Unit</th>
                {/*
                <th>Network ID</th>
                <th>DCC ID</th>
                <th>DCC File</th>
                <th>Expiration</th>
                 */}

                <th>Chart</th>
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
                    {/*
                    <td>{mu.networkId}</td>
                    <td>{mu.idDcc ?? '-'}</td>
                    <td>{mu.dccFileNme ?? '-'}</td>
                    <td>{mu.expiration ?? '-'}</td>

                    */}
                    <td>{mu.measuresUnit}</td>

                    <td>
                        <ShowChart nodeId={mu.nodeId ?? 0} unit={mu.measuresUnit ?? ''}></ShowChart>
                    </td>
                </tr>
            ))}
            </tbody>
        </Table>
            </Container>
            </>
    )
}




function ShowChart({nodeId, unit}: { nodeId: number, unit: string }) {
    const [show, setShow] = useState(false);

    // Funzioni per mostrare/nascondere il modal
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");

    // Calcola lo src dinamicamente
    const grafanaSrc = () => {
        const base = BASE_URL === "https://www.christiandellisanti.uk"
            ? "https://grafana.christiandellisanti.uk"
            : "http://localhost:3000";

        const orgId = 1;
        const refresh = "30s";
        const theme = "light";
        const panelId = 1;

        const fromParam = from ? new Date(from).toISOString() : "now-5m";
        const toParam = to ? new Date(to).toISOString() : "now";

        return `${base}/d-solo/beh39dmpjez28e/dashboard1?orgId=${orgId}&from=${encodeURIComponent(fromParam)}&to=${encodeURIComponent(toParam)}&refresh=${refresh}&theme=${theme}&panelId=${panelId}&__feature.dashboardSceneSolo&var-nodeId=${nodeId}&var-measureUnit=${unit}&timezone=browser`;
    };



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

                    {/* Intervallo temporale manuale */}
                    <div className="mb-3 d-flex gap-3 align-items-center">
                        <label className="form-label">From:</label>
                        <input
                            type="datetime-local"
                            value={from}
                            onChange={(e) => setFrom(e.target.value)}
                            className="form-control"
                        />
                        <label className="form-label">To:</label>
                        <input
                            type="datetime-local"
                            value={to}
                            onChange={(e) => setTo(e.target.value)}
                            className="form-control"
                        />
                        <Button variant={"danger"} onClick={() => {setFrom(""); setTo("")}}>Reset</Button>
                    </div>

                    <iframe
                        //src={`http://localhost:8080/grafana/d-solo/beh39dmpjez28e/dashboard1?orgId=1&from=2025-04-07T02:44:38.103Z&to=2025-04-07T12:39:42.265Z&refresh=30s&theme=light&panelId=1&__feature.dashboardSceneSolo&var-nodeId=1&var-measureUnit=Celsius&timezone=browser`}
                        src={
                            /*BASE_URL == "https://www.christiandellisanti.uk"?
                                `https://grafana.christiandellisanti.uk/d-solo/beh39dmpjez28e/dashboard1?orgId=1&from=now-5m&to=now&refresh=30s&theme=light&panelId=1&__feature.dashboardSceneSolo&var-nodeId=${nodeId}&var-measureUnit=${unit}&timezone=browser`
                                :
                                `http://localhost:3000/d-solo/beh39dmpjez28e/dashboard1?orgId=&refresh=30s&theme=light&panelId=1&__feature.dashboardSceneSolo&var-nodeId=${nodeId}&var-measureUnit=${unit}&timezone=browser`
                            */
                            grafanaSrc()
                        }
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

export default Measures