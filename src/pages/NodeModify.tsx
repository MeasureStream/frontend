import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { ControlUnitDTO, CuGw, getUnitLabel, MeasurementUnitDTO, NodeDTO } from "../API/interfaces";
import { useParams } from "react-router";
import { Button, Card, Col, Container, ListGroup, Row, Spinner } from "react-bootstrap";
import { deleteNode, getNodesId, getNodeUnits } from "../API/NodeAPI";
import { getMuId } from "../API/MeasurementUnitAPI";
import { Accordion } from "react-bootstrap";
import { getCuId } from "../API/ControlUnitAPI";

import { Modal } from "react-bootstrap";

import { useAuth } from "../API/AuthContext";
import { useNavigate } from 'react-router';
import { AddMu, DccMu, RemoveMU } from "../components/MUsModals";
import { AddCu, RemoveCu } from "../components/CUsModal";
import L from "leaflet";
import redMarker from "/src/assets/marker-red.svg";
import bluMarkerShadow from '/src/assets/marker-shadow.svg';
import ShowChart from "../components/ShowChart";
import { AddCuSettings } from "../components/CuSettingModal";
import { CuAreAlive, getMUStartId, getMUStopId } from "../API/SettingsAPI";
import { AddMuSettings } from "../components/AddMuSettings";

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';


interface Props {
  nodes: NodeDTO[]
}




const NodeInfoPage = ({ nodes }: Props) => {
  const { nodeId } = useParams<{ nodeId: string }>();
  const id = parseInt(nodeId!!, 10);
  const [node, setNode] = useState<NodeDTO | null>(null);
  const [measurementUnits, setMeasurementUnits] = useState<MeasurementUnitDTO[]>([]);
  const [controlUnits, setControlUnits] = useState<ControlUnitDTO[]>([]);
  const [cugw, setCugw] = useState<CuGw[]>([])
  //const [cusettings, setCusettings] = useState<CuSettingDTO>()
  const [nodeUnits, setNodeUnits] = useState<string[]>([]);
  const [dirty, setDirty] = useState(true)
  const navigate = useNavigate()
  const { xsrfToken } = useAuth();



  useEffect(() => {
    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    iframe.src = "https://grafana.christiandellisanti.uk/login/generic_oauth";
    document.body.appendChild(iframe);
  }, []);

  useEffect(() => {

    console.log("DEBUG node:", node)
    console.log("DEBUG mu:", measurementUnits)
    console.log("xsrfToken: ", xsrfToken)
    console.log(" dirty", dirty)
  });

  useEffect(() => {

    const fetchNodes = async () => {
      const node_res = await getNodesId(Number(nodeId))
      setNode(node_res)

    }
    const fetchMuCu = async () => {

      if (dirty) {

        const mu = await getMuId(Number(nodeId))
        setMeasurementUnits(mu)

        const cu = await getCuId((Number(nodeId)))
        setControlUnits(cu)

        const nu = await getNodeUnits(Number(nodeId))
        setNodeUnits(nu)
        if (xsrfToken) {
          const _cugw = await CuAreAlive(cu.map(e => e.networkId), xsrfToken)
          setCugw(_cugw)
          setDirty(false)
        }



      }

    }

    fetchNodes().then(async () => await fetchMuCu()).catch(e => console.log("ERROR: ", e))

  }, [dirty, xsrfToken]);

  if (!node) {
    return (
      <Container className="text-center my-5">
        <Spinner animation="border" variant="primary" />
        {/*<p className="mt-3">Nodo non trovato</p>*/}
      </Container>
    );
  }

  const redMarkerIcon = L.icon({
    iconUrl: redMarker, // Percorso dell'icona
    iconSize: [25, 41], // Dimensione dell'icona (modifica se necessario)
    iconAnchor: [12, 41], // Punto dell'icona che tocca la mappa
    popupAnchor: [1, -34], // Posizione del popup rispetto all'icona
    shadowUrl: bluMarkerShadow,// Percorso della shadow
    shadowSize: [41, 41], // Dimensioni della shadow
    shadowAnchor: [12, 41], // Dove ancorare la shadow rispetto all'icona

  });

  const handleDelete = () => {
    alert("Elemento eliminato!");  // Implementa la logica di eliminazione qui

    navigate("/")
  };

  const isAlive = (Cuid: number) => {
    /*const c = cugw.find(e => e.cuNetworkId == Cuid)
    if(c.gateway == null)
        return "OFFLINE"
    else return "ONLINE"*/
    const c = Array.isArray(cugw) ? cugw.find(e => e.cuNetworkId === Cuid) : null;
    if (c == null || c.gw == null) return "WARNING THIS CU IS OFFLINE  🔴";
    return "ONLINE  🟢";
  }

  const handleStart = (id: number) => {

    getMUStartId(id)

  }

  const handleStop = (networkId: number) => {

    getMUStopId(networkId)
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
              <Card.Text>

                <ConfirmDelete onDelete={handleDelete} id={node.id} />
              </Card.Text>
            </Card.Body>
          </Card>

          <Card className="shadow">
            <Card.Body>
              <Card.Title className="mb-4">Real Time Measures</Card.Title>
              <div className="measures-container">
                {measurementUnits.length > 0 ? (
                  measurementUnits.map((mu) => (
                    <div key={`mu-${mu.id}`} className="mb-5 pb-3 border-bottom">
                      <h5 className="text-primary">MU NetworkID: {mu.networkId}</h5>

                      {/* 1. Ciclo dei Sensori Fisici (Temp, Accel, ecc.) */}
                      <h6 className="mt-3 text-muted small uppercase">Environment Sensors</h6>
                      {mu.sensors && mu.sensors.map((sensor) => (
                        <Card.Text key={`sensor-${sensor.id}`} className="my-2">
                          <div className="d-flex justify-content-between align-items-center mb-1">
                            <span className="badge bg-primary">
                              {sensor.type} (Idx: {sensor.sensorIndex})
                            </span>
                            <span className="fw-bold">{getUnitLabel(sensor.unitCode)}</span>
                          </div>
                          <ShowChart
                            nodeId={mu.id}
                            unit={getUnitLabel(sensor.unitCode)}
                            setDirty={() => setDirty(true)}
                          />
                        </Card.Text>
                      ))}

                      {/* 2. Grafici di Diagnostica Radio (System Measures) */}
                      <h6 className="mt-4 text-muted small uppercase">Network Diagnostics</h6>

                      {/* Sempre visibile: LoRA RSSI */}
                      <Card.Text className="my-2">
                        <div className="d-flex justify-content-between align-items-center mb-1">
                          <span className="badge bg-secondary">LoRA RSSI</span>
                          <span className="fw-bold">dBm</span>
                        </div>
                        <ShowChart
                          nodeId={mu.id}
                          unit="LoRArssi"
                          setDirty={() => setDirty(true)}
                        />
                      </Card.Text>

                      {/* Visibile solo se model >= 100: BLE RSSI */}
                      {mu.model >= 100 && (
                        <Card.Text className="my-2">
                          <div className="d-flex justify-content-between align-items-center mb-1">
                            <span className="badge bg-info text-dark">BLE RSSI</span>
                            <span className="fw-bold">dBm</span>
                          </div>
                          <ShowChart
                            nodeId={mu.id}
                            unit="rssi"
                            setDirty={() => setDirty(true)}
                          />
                        </Card.Text>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-muted">No measurements available.</p>
                )}
              </div>
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
                  <Marker position={[node.location.x, node.location.y]} icon={redMarkerIcon}>
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
            <Card.Body className="px-4" >
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="mb-0">Measurement Units</h3>
                <AddMu node={node!!} setDirty={setDirty} />

              </div>

              <Accordion>


                <>
                  {measurementUnits.map((mu, index) => (

                    <Accordion.Body>
                      <ListGroup variant="flush">
                        <ListGroup.Item>
                          <strong>Network ID:</strong> {mu.networkId}
                          <span className="ms-3 badge bg-info text-dark">Model {mu.model}</span>
                        </ListGroup.Item>

                        <ListGroup.Item className="mt-2">
                          <h6>Sensors associated:</h6>
                          <Row className="g-2">
                            {mu.sensors && mu.sensors.length > 0 ? (
                              mu.sensors.map((sensor) => (
                                <Col xs={12} key={sensor.id}>
                                  <Card className="border-light bg-light">
                                    <Card.Body className="py-2 px-3">
                                      <div className="d-flex justify-content-between align-items-center">
                                        <div>
                                          <span className="fw-bold text-primary">#{sensor.sensorIndex}</span> - {sensor.type}
                                          <small className="text-muted ms-2">({sensor.modelName})</small>
                                        </div>
                                        {/* Esempio di badge condizionale per l'unità */}
                                        <span className="badge rounded-pill bg-secondary">
                                          {sensor.type === 'NTC' ? '°C' : 'Raw Data'}
                                        </span>
                                      </div>
                                    </Card.Body>
                                  </Card>
                                </Col>
                              ))
                            ) : (
                              <p className="text-muted ps-3">No sensors registered for this unit.</p>
                            )}
                          </Row>
                        </ListGroup.Item>

                        <ListGroup.Item className="d-flex gap-2 mt-3">
                          <RemoveMU mu={mu} setDirty={setDirty} />
                          <Button variant="outline-success" size="sm" onClick={() => handleStart(mu.networkId)}>Start</Button>
                          <Button variant="outline-danger" size="sm" onClick={() => handleStop(mu.networkId)}>Stop</Button>
                          <AddMuSettings muNetworkId={mu.networkId} />
                        </ListGroup.Item>
                      </ListGroup>
                    </Accordion.Body>

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

              <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="mb-0">Control Units</h3>
                <AddCu node={node!!} setDirty={setDirty} />
              </div>

              <Accordion>

                <>
                  {controlUnits.map((cu, index) => (

                    <Accordion.Item key={index} eventKey={index.toString()}>
                      <Accordion.Header> {cu.name} id: {cu.id}
                        {
                          //isAlive(cu.networkId)
                        }
                      </Accordion.Header>
                      <Accordion.Body>
                        <ListGroup>
                          <ListGroup.Item variant="secondary">
                            NetworkId: {cu.networkId}
                          </ListGroup.Item>
                          <ListGroup.Item variant="secondary">
                            Name: {cu.name}
                          </ListGroup.Item>
                          {/*
<ListGroup.Item variant="secondary">
                            Remaining Battery: {Math.ceil(Number(cu.remainingBattery))} %
                          </ListGroup.Item>
                          <ListGroup.Item variant="secondary">
                            rssi: {Number(cu.rssi).toFixed(3)} dB
                          </ListGroup.Item>
                          <ListGroup.Item variant="secondary">
                            <RemoveCu cu={cu} setDirty={setDirty} />
                            <AddCuSettings cuNetworkId={cu.id} />
                          </ListGroup.Item>



                          */}
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
            /*
             *
             *
            

            <Card className="mt-4 shadow">
            <Card.Body>
              <h3>DCCs</h3>
              <>
                <ListGroup>
                  <>
                    {measurementUnits
                      //.slice() // per evitare mutazioni se measurementUnits viene da uno state
                      .sort((a, b) => a.id - b.id)
                      .map((mu, index) => (

                        <div key={mu.id}>
                          <DccMu mu={mu} expiration={"2025-12-31"} setDirty={setDirty}></DccMu>

                        </div>
                      ))}
                  </>
                </ListGroup>
              </>


            </Card.Body>
          </Card>


             *
             * */
          }


        </Col>
      </Row>
    </Container>
  );
};



// Funzione ConfirmDelete
function ConfirmDelete({ onDelete, id }: { onDelete: () => void, id?: number }) {
  const [show, setShow] = useState(false);
  const { xsrfToken, setDirty } = useAuth();  // Recupera il xsrfToken dal contesto
  // Funzioni per mostrare/nascondere il modal
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // Funzione chiamata quando si conferma l'eliminazione
  const handleDelete = () => {
    deleteNode(xsrfToken, id).then(() => {
      setDirty(true);
      onDelete()
    }).catch((e) => console.log("nodo non eliminato xsrf:   ", xsrfToken, e))

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

