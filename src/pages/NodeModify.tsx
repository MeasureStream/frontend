import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { ControlUnitDTO, CuGw, getUnitLabel, MeasurementUnitDTO, NodeDTO } from "../API/interfaces";
import { useParams } from "react-router";
import { Button, Card, Col, Container, ListGroup, Row, Spinner, Accordion, Modal } from "react-bootstrap";
import { deleteNode, getNodesId, getNodeUnits } from "../API/NodeAPI";
import { getMuId } from "../API/MeasurementUnitAPI";
import { getCuId } from "../API/ControlUnitAPI";

import { useAuth } from "../API/AuthContext";
import { useNavigate } from 'react-router';
import { AddMu, RemoveMU } from "../components/MUsModals";
import { AddCu } from "../components/CUsModal";
import L from "leaflet";
import redMarker from "/src/assets/marker-red.svg";
import bluMarkerShadow from '/src/assets/marker-shadow.svg';
import { ChartPreviewCard } from "../components/ChartPreviewCard";
import { CuAreAlive } from "../API/SettingsAPI";
import { RSSIBadge } from "../components/RSSIBadge";

const NodeInfoPage = () => {
  const { nodeId } = useParams<{ nodeId: string }>();
  const [node, setNode] = useState<NodeDTO | null>(null);
  const [measurementUnits, setMeasurementUnits] = useState<MeasurementUnitDTO[]>([]);
  const [controlUnits, setControlUnits] = useState<ControlUnitDTO[]>([]);
  const [cugw, setCugw] = useState<CuGw[]>([]);
  const [dirty, setDirty] = useState(true);
  const navigate = useNavigate();
  const { xsrfToken } = useAuth();

  useEffect(() => {
    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    iframe.src = "https://grafana.christiandellisanti.uk/login/generic_oauth";
    document.body.appendChild(iframe);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!nodeId) return;
      try {
        const node_res = await getNodesId(Number(nodeId));
        setNode(node_res);

        if (dirty) {
          const mu = await getMuId(Number(nodeId));
          setMeasurementUnits(mu);

          const cu = await getCuId(Number(nodeId));
          setControlUnits(cu);

          if (xsrfToken && cu.length > 0) {
            const _cugw = await CuAreAlive(cu.map(e => e.networkId), xsrfToken);
            setCugw(_cugw);
          }
          setDirty(false);
        }
      } catch (e) {
        console.error("ERROR FETCHING DATA: ", e);
      }
    };
    fetchData();
  }, [nodeId, dirty, xsrfToken]);

  if (!node) {
    return (
      <Container className="text-center my-5">
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  const redMarkerIcon = L.icon({
    iconUrl: redMarker,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: bluMarkerShadow,
    shadowSize: [41, 41],
    shadowAnchor: [12, 41],
  });

  const handleDeleteSuccess = () => {
    navigate("/");
  };

  const getStatusBadge = (networkId: number) => {
    const c = Array.isArray(cugw) ? cugw.find(e => e.cuNetworkId === networkId) : null;
    return (c && c.gw)
      ? <span className="badge bg-success ms-2">ONLINE 🟢</span>
      : <span className="badge bg-warning text-dark ms-2">OFFLINE 🔴</span>;
  };

  return (
    <Container fluid className="px-4 py-4 bg-light min-vh-100">

      {/* --- HEADER: INFO NODO ORIZZONTALE --- */}
      <Card className="shadow-sm border-0 mb-4 bg-white">
        <Card.Body className="d-flex justify-content-between align-items-center py-3 px-4">
          <div>
            <h1 className="h3 mb-1 text-dark fw-bold">{node.name}</h1>
            <div className="d-flex align-items-center gap-3 text-muted">
              <span><strong>ID:</strong> {node.id}</span>
              <span><strong>Standard:</strong> {node.standard ? "✅ Yes" : "❌ No"}</span>
              <span className="text-primary"><i className="bi bi-geo-alt"></i> {node.location.x.toFixed(4)}, {node.location.y.toFixed(4)}</span>
            </div>
          </div>
          <div className="d-flex gap-2">
            <ConfirmDelete onDelete={handleDeleteSuccess} id={node.id} />
          </div>
        </Card.Body>
      </Card>

      <Row className="g-4">
        {/* --- MAPPA: FULL WIDTH --- */}
        <Col lg={12}>
          <Card className="shadow-sm border-0 overflow-hidden">
            <Card.Header className="bg-white py-3 border-0">
              <h5 className="mb-0 text-secondary"><i className="bi bi-map me-2"></i>Geospatial Position</h5>
            </Card.Header>
            <div style={{ height: "350px", width: "100%" }}>
              <MapContainer
                center={[node.location.x, node.location.y]}
                zoom={14}
                style={{ height: "100%", width: "100%" }}
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Marker position={[node.location.x, node.location.y]} icon={redMarkerIcon}>
                  <Popup>{node.name}</Popup>
                </Marker>
              </MapContainer>
            </div>
          </Card>
        </Col>

        {/* --- COLONNA SINISTRA: CONTROL UNITS --- */}
        <Col lg={6}>
          <Card className="shadow-sm border-0 h-100">
            <Card.Header className="bg-white py-3 d-flex justify-content-between align-items-center border-0">
              <h5 className="mb-0 text-dark"><i className="bi bi-cpu me-2"></i>Control Units</h5>
              <AddCu node={node} setDirty={setDirty} />
            </Card.Header>
            <Card.Body>
              <Accordion flush>
                {controlUnits.map((cu, index) => (
                  <Accordion.Item key={`cu-${cu.id}`} eventKey={index.toString()} className="border rounded mb-2 overflow-hidden">
                    <Accordion.Header>
                      <div className="w-100 d-flex justify-content-between align-items-center pe-3">
                        <span>{cu.name} <small className="text-muted ms-2">({cu.networkId})</small></span>
                        {
                          //getStatusBadge(cu.networkId)
                        }
                        <RSSIBadge networkId={measurementUnits[0].networkId} fallbackNetworkId={measurementUnits[1].networkId} />
                      </div>
                    </Accordion.Header>
                    <Accordion.Body className="bg-light">
                      <ListGroup variant="flush" className="rounded shadow-sm">
                        <ListGroup.Item className="d-flex justify-content-between">
                          <strong>Network ID</strong> <span>{cu.networkId}</span>
                        </ListGroup.Item>
                        <ListGroup.Item className="d-flex justify-content-between">
                          <strong>Database ID</strong> <span>{cu.id}</span>
                        </ListGroup.Item>
                      </ListGroup>
                    </Accordion.Body>
                  </Accordion.Item>
                ))}
              </Accordion>
            </Card.Body>
          </Card>
        </Col>

        {/* --- COLONNA DESTRA: MEASUREMENT UNITS --- */}
        <Col lg={6}>
          <Card className="shadow-sm border-0 h-100">
            <Card.Header className="bg-white py-3 d-flex justify-content-between align-items-center border-0">
              <h5 className="mb-0 text-dark"><i className="bi bi-thermometer-half me-2"></i>Measurement Units</h5>
              <AddMu node={node} setDirty={setDirty} />
            </Card.Header>
            <Card.Body>
              <Accordion flush>
                {measurementUnits.map((mu, index) => (
                  <Accordion.Item key={`mu-${mu.id}`} eventKey={index.toString()} className="border rounded mb-2 overflow-hidden">
                    <Accordion.Header>
                      <div className="w-100 d-flex justify-content-between align-items-center pe-3">
                        <span><strong>MU {mu.networkId}</strong></span>
                        <span className="badge bg-info text-dark">Model {mu.model}</span>
                      </div>
                    </Accordion.Header>
                    <Accordion.Body className="bg-light">
                      <h6 className="small text-muted text-uppercase fw-bold mb-3">Sensors Associated</h6>
                      <Row className="g-2 mb-3">
                        {mu.sensors?.map((sensor) => (
                          <Col xs={12} key={sensor.id}>
                            <div className="d-flex justify-content-between align-items-center bg-white p-2 border rounded shadow-sm">
                              <div>
                                <span className="text-primary fw-bold me-2">#{sensor.sensorIndex}</span>
                                <span className="text-dark">{sensor.type}</span>
                              </div>
                              <span className="badge rounded-pill bg-secondary">{getUnitLabel(sensor.unitCode)}</span>
                            </div>
                          </Col>
                        ))}
                      </Row>
                      <div className="border-top pt-3 d-flex justify-content-end">
                        <RemoveMU mu={mu} setDirty={setDirty} />
                      </div>
                    </Accordion.Body>
                  </Accordion.Item>
                ))}
              </Accordion>
            </Card.Body>
          </Card>
        </Col>

        {/* --- DASHBOARD ANALYTICS IN FONDO --- */}
        <Col xs={12}>
          <Card className="shadow-sm border-0 mt-2 overflow-hidden">
            <Card.Header className="bg-dark text-white py-3">
              <h4 className="mb-0"><i className="bi bi-graph-up me-2"></i>Analytics & System Health</h4>
            </Card.Header>
            <Card.Body className="bg-light p-4">

              {/* --- DIAGNOSTICA CU --- */}
              <h5 className="text-danger mb-4"><i className="bi bi-broadcast me-2"></i>Network Diagnostics (CUs)</h5>
              <Row className="mb-5">
                {measurementUnits.map((cu) => (
                  <Col md={12} key={`charts-cu-${cu.id}`} className="mb-4">
                    <div className="p-4 bg-white rounded shadow-sm border-start border-danger border-4">
                      <h6 className="mb-4 text-secondary fw-bold">Control Unit: {controlUnits.length > 0 ? controlUnits[0].name : ""} (ID: {controlUnits.length > 0 ? controlUnits[0].networkId : 0})</h6>
                      <Row>
                        <Col md={4}>
                          <ChartPreviewCard
                            nodeId={cu.networkId}
                            //nodeId={measurementUnits.length > 0 ? measurementUnits[0].networkId : 0}
                            unit="LoRa RSSI"
                            setDirty={() => setDirty(true)}
                          />
                        </Col>
                      </Row>
                    </div>
                  </Col>
                ))}
              </Row>

              <hr className="my-5" />

              {/* --- SENSORI MU --- */}
              <h5 className="text-primary mb-4"><i className="bi bi-moisture me-2"></i>Environmental Data (MUs)</h5>
              {measurementUnits.map((mu) => (
                <div key={`charts-mu-${mu.id}`} className="mb-5 p-4 bg-white rounded shadow-sm border-start border-primary border-4">
                  <h6 className="mb-4 text-secondary fw-bold">MU Unit: {mu.networkId}</h6>
                  <Row className="g-4">
                    {mu.sensors?.map((sensor) => (
                      <Col md={4} key={`chart-s-${sensor.id}`}>
                        <ChartPreviewCard
                          nodeId={mu.networkId}
                          unit={getUnitLabel(sensor.unitCode)}
                          setDirty={() => setDirty(true)}
                        />
                      </Col>
                    ))}
                    <Col md={4}>
                      <ChartPreviewCard
                        nodeId={mu.networkId}
                        unit="BLE RSSI"
                        setDirty={() => setDirty(true)}
                      />
                    </Col>
                  </Row>
                </div>
              ))}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

// --- Componente ConfirmDelete ---
function ConfirmDelete({ onDelete, id }: { onDelete: () => void, id?: number }) {
  const [show, setShow] = useState(false);
  const { xsrfToken, setDirty } = useAuth();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleDelete = () => {
    if (!id) return;
    deleteNode(xsrfToken, id).then(() => {
      setDirty(true);
      onDelete();
    }).catch((e) => console.log("Error deleting node: ", e));
    setShow(false);
  };

  return (
    <>
      <Button variant="outline-danger" className="d-flex align-items-center gap-2" onClick={handleShow}>
        <i className="bi bi-trash"></i> DELETE NODE
      </Button>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton className="border-0">
          <Modal.Title className="text-danger">⚠️ Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body className="py-4 text-center">
          <p className="fs-5 mb-0">Are you sure you want to delete <strong>permanently</strong> this node and all its associations?</p>
        </Modal.Body>
        <Modal.Footer className="border-0 pb-3">
          <Button variant="light" onClick={handleClose}>Cancel</Button>
          <Button variant="danger" onClick={handleDelete} className="px-4">Confirm Delete</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default NodeInfoPage;
