import { useEffect, useState } from 'react';
import {
  Container, Table, Badge, Button, Modal, Form,
  Row, Col, Spinner, Nav, Tab,
} from 'react-bootstrap';
import { useSearchParams, useNavigate } from 'react-router';
import DccNav from '../../components/DccNav';
import CertificatoWizard from '../../components/CertificatoWizard';
import CalibrationRunModal from '../../components/CalibrationRunModal';
import {
  getCalibrationRequests, getCalibrationRequest, getCalibrationMessages,
} from '../../API/CalibrationAPI';
import { getCalibrationByRequest } from '../../API/WizardAPI';
import { CalibrationRequestDTO, CalibrationMessageDTO, CalibrationWizardDTO } from '../../API/interfaces';

function DccCalibrations() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const sensorIdParam = searchParams.get('sensorId');
  const muIdParam = searchParams.get('muId');

  const [requests, setRequests] = useState<CalibrationRequestDTO[]>([]);
  const [messages, setMessages] = useState<CalibrationMessageDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMsgs, setLoadingMsgs] = useState(false);

  const [filterCalibId, setFilterCalibId] = useState('');
  const [filterSensorId, setFilterSensorId] = useState(sensorIdParam || '');
  const [filterMuId, setFilterMuId] = useState(muIdParam || '');

  // Detail modal — loads full record (with JSON) only on demand
  const [selectedReq, setSelectedReq] = useState<CalibrationRequestDTO | null>(null);
  const [reqMessages, setReqMessages] = useState<CalibrationMessageDTO[]>([]);
  const [showDetail, setShowDetail] = useState(false);
  const [detailTab, setDetailTab] = useState('processed');
  const [loadingDetail, setLoadingDetail] = useState(false);

  // Wizard modal
  const [wizardReq, setWizardReq] = useState<CalibrationRequestDTO | null>(null);
  const [showWizard, setShowWizard] = useState(false);

  // Map requestId → Calibration (to know which rows have a certificato_in / run results)
  const [calibrationMap, setCalibrationMap] = useState<Record<number, CalibrationWizardDTO>>({});

  // Certificato Base JSON viewer modal
  const [showCertModal, setCertModal] = useState(false);
  const [certJson, setCertJson] = useState<string | null>(null);

  // Calibration Run modal
  const [runModalReq, setRunModalReq] = useState<{ req: CalibrationRequestDTO; calib: CalibrationWizardDTO } | null>(null);
  const [showRunModal, setShowRunModal] = useState(false);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const data = await getCalibrationRequests({
        sensorId: filterSensorId ? parseInt(filterSensorId) : undefined,
        muId: filterMuId ? parseInt(filterMuId) : undefined,
      });
      setRequests(data);
      // Load calibration status for each request in parallel (fire-and-forget, non-blocking)
      loadCalibrationMap(data);
    } catch (e) {
      console.error('Error fetching calibration requests:', e);
    } finally {
      setLoading(false);
    }
  };

  const loadCalibrationMap = async (reqs: CalibrationRequestDTO[]) => {
    const results = await Promise.allSettled(
      reqs.map(r => getCalibrationByRequest(r.id).then(c => ({ id: r.id, calib: c })))
    );
    const map: Record<number, CalibrationWizardDTO> = {};
    for (const r of results) {
      if (r.status === 'fulfilled' && r.value.calib) {
        map[r.value.id] = r.value.calib;
      }
    }
    setCalibrationMap(map);
  };

  const fetchMessages = async () => {
    setLoadingMsgs(true);
    try {
      const data = await getCalibrationMessages();
      setMessages(data);
    } catch (e) {
      console.error('Error fetching calibration messages:', e);
    } finally {
      setLoadingMsgs(false);
    }
  };

  useEffect(() => {
    fetchRequests();
    fetchMessages();
  }, []);

  const handleFilter = () => {
    const p: Record<string, string> = {};
    if (filterSensorId) p['sensorId'] = filterSensorId;
    if (filterMuId) p['muId'] = filterMuId;
    setSearchParams(p);
    fetchRequests();
  };

  /** Open detail modal: fetches full record (with JSON) only now */
  const openDetail = async (row: CalibrationRequestDTO) => {
    setShowDetail(true);
    setDetailTab('processed');
    setSelectedReq(row);   // show modal immediately with metadata
    setLoadingDetail(true);
    try {
      const [full, msgs] = await Promise.all([
        getCalibrationRequest(row.id),
        getCalibrationMessages(row.calibrationId),
      ]);
      setSelectedReq(full);
      setReqMessages(msgs);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingDetail(false);
    }
  };

  const openWizard = (req: CalibrationRequestDTO) => {
    setWizardReq(req);
    setShowWizard(true);
  };

  const closeWizard = () => {
    setShowWizard(false);
    // Refresh calibration map so the new button appears immediately after build
    if (wizardReq) {
      getCalibrationByRequest(wizardReq.id).then(c => {
        if (c) setCalibrationMap(prev => ({ ...prev, [wizardReq.id]: c }));
      }).catch(console.error);
    }
    setWizardReq(null);
  };

  const openCertJson = (calib: CalibrationWizardDTO) => {
    setCertJson(calib.certificatoIn ?? null);
    setCertModal(true);
  };

  const openRunModal = (req: CalibrationRequestDTO, calib: CalibrationWizardDTO) => {
    setRunModalReq({ req, calib });
    setShowRunModal(true);
  };

  const closeRunModal = () => {
    setShowRunModal(false);
    setRunModalReq(null);
  };

  const filteredRequests = requests.filter(r =>
    (!filterCalibId || r.calibrationId.toLowerCase().includes(filterCalibId.toLowerCase()))
  );

  const formatJson = (jsonStr: string | null | undefined) => {
    if (!jsonStr) return 'N/A';
    try { return JSON.stringify(JSON.parse(jsonStr), null, 2); }
    catch { return jsonStr; }
  };

  return (
    <Container fluid>
      <DccNav />

      {/* Filters */}
      <Row className="g-2 mb-3">
        <Col md={3}>
          <Form.Control
            placeholder="Filter by Calibration ID"
            value={filterCalibId}
            onChange={e => setFilterCalibId(e.target.value)}
          />
        </Col>
        <Col md={2}>
          <Form.Control
            placeholder="Sensor ID"
            type="number"
            value={filterSensorId}
            onChange={e => setFilterSensorId(e.target.value)}
          />
        </Col>
        <Col md={2}>
          <Form.Control
            placeholder="MU ID"
            type="number"
            value={filterMuId}
            onChange={e => setFilterMuId(e.target.value)}
          />
        </Col>
        <Col md="auto">
          <Button variant="primary" onClick={handleFilter}>Apply</Button>
          <Button variant="outline-secondary" className="ms-2" onClick={() => {
            setFilterCalibId(''); setFilterSensorId(''); setFilterMuId('');
            setSearchParams({});
            getCalibrationRequests().then(setRequests).catch(console.error);
          }}>Clear</Button>
        </Col>
        <Col md="auto" className="ms-auto">
          <Button variant="outline-primary" size="sm" onClick={() => { fetchRequests(); fetchMessages(); }}>
            Refresh
          </Button>
        </Col>
      </Row>

      {/* Calibration Requests table */}
      <h5 className="mb-2">Calibration Requests</h5>
      {loading ? (
        <div className="text-center py-4"><Spinner animation="border" variant="primary" /></div>
      ) : (
        <Table responsive hover className="shadow-sm mb-5">
          <thead className="table-light">
            <tr>
              <th>ID</th>
              <th>Calibration ID</th>
              <th>Calibrator ID</th>
              <th>MU ID</th>
              <th>Sensor ID</th>
              <th>Status</th>
              <th>Created At</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filteredRequests.length === 0 && (
              <tr><td colSpan={8} className="text-center text-muted py-3">No calibration requests found.</td></tr>
            )}
            {filteredRequests.map(r => (
              <tr key={r.id}>
                <td className="fw-bold">{r.id}</td>
                <td><code className="small">{r.calibrationId}</code></td>
                <td>{r.calibratorId}</td>
                <td>{r.muId}</td>
                <td>{r.sensorId}</td>
                <td>
                  <Badge bg={r.processed ? 'success' : 'warning'} text={r.processed ? undefined : 'dark'}>
                    {r.processed ? 'Processed' : 'Pending'}
                  </Badge>
                </td>
                <td>{new Date(r.createdAt).toLocaleString()}</td>
                <td>
                  <div className="d-flex gap-1 flex-wrap calib-actions">
                    <Button size="sm" variant="primary" onClick={() => openWizard(r)}>
                      Administrative Data
                    </Button>
                    <Button size="sm" variant="outline-secondary" onClick={() => openDetail(r)}>
                      Raw Data
                    </Button>
                    {calibrationMap[r.id]?.certificatoIn && (
                      <Button
                        size="sm"
                        variant="outline-info"
                        onClick={() => openCertJson(calibrationMap[r.id])}
                      >
                        Administrative Data
                      </Button>
                    )}
                    {calibrationMap[r.id]?.certificatoIn && (
                      <Button
                        size="sm"
                        variant={calibrationMap[r.id]?.runStatus === 'SUCCESS' ? 'success' : 'warning'}
                        onClick={() => openRunModal(r, calibrationMap[r.id])}
                        title="Run calibration pipeline (analisi_calib_data.py)"
                      >
                        {calibrationMap[r.id]?.runStatus === 'SUCCESS'
                          ? 'Retry Calibration'
                          : calibrationMap[r.id]?.runStatus === 'FAILED'
                          ? 'Retry Calibration'
                          : 'Calibrate'}
                      </Button>
                    )}
                    {calibrationMap[r.id]?.runStatus && (
                      <Button
                        size="sm"
                        variant="info"
                        onClick={() => navigate(`/dcc/calibrations/${r.id}/run`)}
                        title="View run results"
                      >
                        Results
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {/* Raw Calibration Messages table */}
      <h5 className="mb-2">
        Raw Calibration Messages
        <Badge bg="secondary" className="ms-2">{messages.length}</Badge>
      </h5>
      {loadingMsgs ? (
        <div className="text-center py-4"><Spinner animation="border" variant="secondary" /></div>
      ) : (
        <Table responsive hover className="shadow-sm" style={{ fontSize: '0.85rem' }}>
          <thead className="table-light">
            <tr>
              <th>ID</th>
              <th>Calib ID</th>
              <th>Step</th>
              <th>Target (°C)</th>
              <th>Total Steps</th>
              <th>Assembled</th>
              <th>Received At</th>
            </tr>
          </thead>
          <tbody>
            {messages.length === 0 && (
              <tr><td colSpan={7} className="text-center text-muted py-3">No messages received yet.</td></tr>
            )}
            {messages.map(m => (
              <tr key={m.id}>
                <td>{m.id}</td>
                <td><code className="small">{m.calibId}</code></td>
                <td><Badge bg="info" pill>{m.stepIndex} / {(m.totalSteps ?? 1) - 1}</Badge></td>
                <td>{m.target?.toFixed(1)}</td>
                <td>{m.totalSteps}</td>
                <td>
                  <Badge bg={m.assembled ? 'success' : 'secondary'}>
                    {m.assembled ? 'Yes' : 'No'}
                  </Badge>
                </td>
                <td>{new Date(m.receivedAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {/* Certificate Wizard */}
      {wizardReq && (
        <CertificatoWizard
          show={showWizard}
          calibrationRequestId={wizardReq.id}
          calibrationRequestLabel={wizardReq.calibrationId}
          onHide={closeWizard}
        />
      )}

      {/* Calibration Run Modal */}
      {runModalReq && (
        <CalibrationRunModal
          show={showRunModal}
          calibrationId={runModalReq.calib.id}
          calibrationRequestId={runModalReq.req.id}
          calibrationLabel={runModalReq.req.calibrationId}
          onHide={closeRunModal}
          onRunComplete={(result) => {
            // Update the calibration map so the badge refreshes immediately
            setCalibrationMap((prev) => ({ ...prev, [runModalReq.req.id]: result }));
          }}
        />
      )}

      {/* Detail Modal — JSON loaded on demand */}
      <Modal show={showDetail} onHide={() => setShowDetail(false)} size="xl" scrollable>
        <Modal.Header closeButton>
          <Modal.Title>
            Calibration: <code>{selectedReq?.calibrationId}</code>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedReq && (
            <>
              <Row className="mb-3 g-2">
                <Col xs="auto"><Badge bg="secondary">Calibrator {selectedReq.calibratorId}</Badge></Col>
                <Col xs="auto"><Badge bg="info">MU {selectedReq.muId}</Badge></Col>
                <Col xs="auto"><Badge bg="primary">Sensor {selectedReq.sensorId}</Badge></Col>
                <Col xs="auto">
                  <Badge bg={selectedReq.processed ? 'success' : 'warning'} text={selectedReq.processed ? undefined : 'dark'}>
                    {selectedReq.processed ? 'Processed' : 'Pending'}
                  </Badge>
                </Col>
                <Col xs="auto" className="text-muted small">
                  {new Date(selectedReq.createdAt).toLocaleString()}
                </Col>
                <Col xs="auto" className="text-muted small">
                  Messages: {reqMessages.length}
                </Col>
              </Row>

              {loadingDetail ? (
                <div className="text-center py-5">
                  <Spinner animation="border" variant="primary" />
                  <div className="text-muted mt-2 small">Loading JSON data...</div>
                </div>
              ) : (
                <Tab.Container activeKey={detailTab} onSelect={k => setDetailTab(k || 'processed')}>
                  <Nav variant="tabs" className="mb-3">
                    <Nav.Item><Nav.Link eventKey="processed">Processed JSON</Nav.Link></Nav.Item>
                    <Nav.Item><Nav.Link eventKey="input">Input JSON (raw steps)</Nav.Link></Nav.Item>
                    <Nav.Item><Nav.Link eventKey="messages">Step Messages ({reqMessages.length})</Nav.Link></Nav.Item>
                  </Nav>
                  <Tab.Content>
                    <Tab.Pane eventKey="processed">
                      <div className="d-flex justify-content-end mb-1">
                        <Button size="sm" variant="outline-secondary"
                          onClick={() => navigator.clipboard.writeText(formatJson(selectedReq.processedJson))}>
                          Copy JSON
                        </Button>
                      </div>
                      <pre className="bg-light p-3 rounded border"
                        style={{ maxHeight: '500px', overflowY: 'auto', fontSize: '0.75rem' }}>
                        {formatJson(selectedReq.processedJson)}
                      </pre>
                    </Tab.Pane>
                    <Tab.Pane eventKey="input">
                      <div className="d-flex justify-content-end mb-1">
                        <Button size="sm" variant="outline-secondary"
                          onClick={() => navigator.clipboard.writeText(formatJson(selectedReq.inputJson))}>
                          Copy JSON
                        </Button>
                      </div>
                      <pre className="bg-light p-3 rounded border"
                        style={{ maxHeight: '500px', overflowY: 'auto', fontSize: '0.75rem' }}>
                        {formatJson(selectedReq.inputJson)}
                      </pre>
                    </Tab.Pane>
                    <Tab.Pane eventKey="messages">
                      <Table responsive hover size="sm">
                        <thead className="table-light">
                          <tr>
                            <th>Step</th><th>Target</th><th>Assembled</th><th>Received</th>
                          </tr>
                        </thead>
                        <tbody>
                          {reqMessages.map(m => (
                            <tr key={m.id}>
                              <td><Badge bg="info" pill>{m.stepIndex}</Badge></td>
                              <td>{m.target?.toFixed(1)} °C</td>
                              <td><Badge bg={m.assembled ? 'success' : 'secondary'}>{m.assembled ? 'Yes' : 'No'}</Badge></td>
                              <td>{new Date(m.receivedAt).toLocaleString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </Tab.Pane>
                  </Tab.Content>
                </Tab.Container>
              )}
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDetail(false)}>Close</Button>
        </Modal.Footer>
      </Modal>
      {/* Certificate Base JSON viewer */}
      <Modal show={showCertModal} onHide={() => setCertModal(false)} size="xl" scrollable>
        <Modal.Header closeButton>
          <Modal.Title>Administrative Data <span className="text-muted small">(certificato_in)</span></Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="d-flex justify-content-end mb-2">
            <Button
              size="sm"
              variant="outline-secondary"
              onClick={() => navigator.clipboard.writeText(formatJson(certJson))}
            >
              Copy
            </Button>
          </div>
          <pre
            className="bg-light p-3 rounded border"
            style={{ maxHeight: '70vh', overflowY: 'auto', fontSize: '0.75rem' }}
          >
            {formatJson(certJson)}
          </pre>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setCertModal(false)}>Close</Button>
        </Modal.Footer>
      </Modal>

    </Container>
  );
}

export default DccCalibrations;
