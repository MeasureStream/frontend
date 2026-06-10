import { useEffect, useState } from 'react';
import {
  Container, Table, Badge, Button, Modal, Form,
  Row, Col, Spinner, Nav, Tab, Accordion, Dropdown,
} from 'react-bootstrap';
import { useSearchParams, useNavigate } from 'react-router';
import { FiFileText, FiCode, FiPlay, FiRefreshCw, FiBarChart2, FiRefreshCcw, FiActivity, FiSave, FiTrash2 } from 'react-icons/fi';
import { BsThreeDotsVertical } from 'react-icons/bs';
import DccNav from '../../components/DccNav';
import CertificatoWizard from '../../components/CertificatoWizard';
import CalibrationRunModal from '../../components/CalibrationRunModal';
import {
  getCalibrationRequests, getCalibrationRequest, getCalibrationMessages,
  deleteCalibrationRequest,
} from '../../API/CalibrationAPI';
import { getCalibrationByRequest, saveDccFromCalibration } from '../../API/WizardAPI';
import { CalibrationRequestDTO, CalibrationMessageDTO, CalibrationWizardDTO } from '../../API/interfaces';
import { useAuth } from '../../API/AuthContext';

function DccCalibrations() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { role } = useAuth();
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

  // Save DCC state (per-row)
  const [savingDcc, setSavingDcc] = useState<Record<number, boolean>>({});
  const [deletingRow, setDeletingRow] = useState<Record<number, boolean>>({});

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

  const handleSaveDcc = async (reqId: number, calib: CalibrationWizardDTO) => {
    setSavingDcc(prev => ({ ...prev, [reqId]: true }));
    try {
      await saveDccFromCalibration(calib.id);
      alert('DCC saved successfully.');
    } catch (e: any) {
      alert('Save DCC failed: ' + e.message);
    } finally {
      setSavingDcc(prev => ({ ...prev, [reqId]: false }));
    }
  };

  const handleDelete = async (reqId: number) => {
    if (!window.confirm('Are you sure you want to delete this calibration request and all associated data?')) return;
    setDeletingRow(prev => ({ ...prev, [reqId]: true }));
    try {
      await deleteCalibrationRequest(reqId);
      setRequests(prev => prev.filter(r => r.id !== reqId));
      setCalibrationMap(prev => {
        const next = { ...prev };
        delete next[reqId];
        return next;
      });
    } catch (e: any) {
      alert('Delete failed: ' + e.message);
    } finally {
      setDeletingRow(prev => ({ ...prev, [reqId]: false }));
    }
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
      <div className="calib-filters mb-3">
        <Row className="g-2 align-items-center">
          <Col md={3}>
            <Form.Control
              size="sm"
              placeholder="Filter by Calibration ID"
              value={filterCalibId}
              onChange={e => setFilterCalibId(e.target.value)}
            />
          </Col>
          <Col md={2}>
            <Form.Control
              size="sm"
              placeholder="Sensor ID"
              type="number"
              value={filterSensorId}
              onChange={e => setFilterSensorId(e.target.value)}
            />
          </Col>
          <Col md={2}>
            <Form.Control
              size="sm"
              placeholder="MU ID"
              type="number"
              value={filterMuId}
              onChange={e => setFilterMuId(e.target.value)}
            />
          </Col>
          <Col md="auto">
            <Button variant="primary" size="sm" onClick={handleFilter}>
              <FiPlay className="me-1" style={{ transform: 'rotate(90deg)' }} />Apply
            </Button>
            <Button variant="outline-secondary" size="sm" className="ms-2" onClick={() => {
              setFilterCalibId(''); setFilterSensorId(''); setFilterMuId('');
              setSearchParams({});
              getCalibrationRequests().then(setRequests).catch(console.error);
            }}>Clear</Button>
          </Col>
          <Col md="auto" className="ms-auto">
            <Button variant="outline-primary" size="sm" onClick={() => { fetchRequests(); fetchMessages(); }}>
              <FiRefreshCcw className="me-1" />Refresh
            </Button>
          </Col>
        </Row>
      </div>

      {/* Calibration Measurements table */}
      <div className="calib-heading">
        <FiActivity />Calibration Measurements
      </div>
      {loading ? (
        <div className="text-center py-4"><Spinner animation="border" variant="primary" /></div>
      ) : (
        <Table responsive hover className="calib-table mb-5">
          <thead>
            <tr>
              <th>ID</th>
              <th>Calibration ID</th>
              <th>Calibrator</th>
              <th>MU</th>
              <th>Sensor</th>
              <th>Status</th>
              <th>Created At</th>
              <th style={{ minWidth: 420 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRequests.length === 0 && (
              <tr><td colSpan={8} className="calib-empty text-center py-4">No calibration requests found.</td></tr>
            )}
            {filteredRequests.map((r, i) => (
              <tr key={r.id}
                style={{
                  borderLeft: `4px solid ${r.processed ? '#198754' : '#ffc107'}`,
                  backgroundColor: i % 2 === 0 ? 'rgba(0,0,0,0.01)' : undefined,
                }}
              >
                <td className="fw-bold text-muted">#{r.id}</td>
                <td><code className="small">{r.calibrationId}</code></td>
                <td>{r.calibratorId}</td>
                <td>{r.muId}</td>
                <td>{r.sensorId}</td>
                <td>
                  <Badge
                    bg={r.processed ? 'success' : 'warning'}
                    text={r.processed ? undefined : 'dark'}
                    className="calib-status-badge"
                  >
                    {r.processed ? 'Processed' : 'Pending'}
                  </Badge>
                </td>
                <td className="text-muted small">{new Date(r.createdAt).toLocaleString()}</td>
                <td>
                  <div className="d-flex gap-2 flex-wrap calib-actions align-items-center">
                    <Button size="sm" variant="outline-primary" onClick={() => openWizard(r)} title="Build certificate step-by-step">
                      <FiFileText className="me-1" />Compile Administrative Data
                    </Button>
                    <Button size="sm" variant="outline-dark" onClick={() => openDetail(r)} title="View raw calibration data">
                      <FiCode className="me-1" />Preview Administrative Data
                    </Button>
                    {calibrationMap[r.id]?.certificatoIn && (
                      <Button
                        size="sm"
                        variant={
                          calibrationMap[r.id]?.runStatus === 'SUCCESS' ? 'warning'
                            : calibrationMap[r.id]?.runStatus === 'FAILED' ? 'danger'
                            : 'success'
                        }
                        onClick={() => openRunModal(r, calibrationMap[r.id])}
                        title="Run calibration pipeline (analisi_calib_data.py)"
                      >
                        {calibrationMap[r.id]?.runStatus ? (
                          <FiRefreshCw className="me-1" />
                        ) : (
                          <FiPlay className="me-1" />
                        )}
                        Analyze
                      </Button>
                    )}
                    {calibrationMap[r.id]?.runStatus && (
                      <Button
                        size="sm"
                        variant="info"
                        onClick={() => navigate(`/dcc/calibrations/${r.id}/run`)}
                        title="View run results"
                      >
                        <FiBarChart2 className="me-1" />Results
                      </Button>
                    )}
                    {calibrationMap[r.id]?.runStatus === 'SUCCESS' && calibrationMap[r.id]?.dccXml && (
                      <Button
                        size="sm"
                        variant="success"
                        disabled={savingDcc[r.id]}
                        onClick={() => handleSaveDcc(r.id, calibrationMap[r.id])}
                        title="Save DCC from calibration XML"
                      >
                        {savingDcc[r.id] ? (
                          <Spinner as="span" size="sm" animation="border" className="me-1" />
                        ) : (
                          <FiSave className="me-1" />
                        )}
                        Save DCC
                      </Button>
                    )}
                    <Dropdown>
                      <Dropdown.Toggle variant="light" size="sm" id={`calib-menu-${r.id}`} className="p-1">
                        <BsThreeDotsVertical />
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        <Dropdown.Item onClick={() => openDetail(r)}>
                          <FiCode className="me-2" />View Raw Data
                        </Dropdown.Item>
                        {role === 'ADMIN' && (
                          <>
                            <Dropdown.Divider />
                            <Dropdown.Item
                              className="text-danger"
                              disabled={deletingRow[r.id]}
                              onClick={() => handleDelete(r.id)}
                            >
                              {deletingRow[r.id] ? (
                                <><Spinner as="span" size="sm" animation="border" className="me-2" />Deleting...</>
                              ) : (
                                <><FiTrash2 className="me-2" />Delete</>
                              )}
                            </Dropdown.Item>
                          </>
                        )}
                      </Dropdown.Menu>
                    </Dropdown>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {/* Raw Messages — collapsed by default */}
      <Accordion className="mb-4">
        <Accordion.Item eventKey="messages">
          <Accordion.Header>
            Raw Messages
            <Badge bg="secondary" className="calib-status-badge ms-2">{messages.length}</Badge>
          </Accordion.Header>
          <Accordion.Body>
            {loadingMsgs ? (
              <div className="text-center py-4"><Spinner animation="border" variant="secondary" /></div>
            ) : (
              <Table responsive hover className="calib-table" style={{ fontSize: '0.85rem' }}>
                <thead>
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
                    <tr><td colSpan={7} className="calib-empty text-center py-3">No messages received yet.</td></tr>
                  )}
                  {messages.map(m => (
                    <tr key={m.id}>
                      <td className="text-muted small">#{m.id}</td>
                      <td><code className="small">{m.calibId}</code></td>
                      <td><Badge bg="info" pill>{m.stepIndex} / {(m.totalSteps ?? 1) - 1}</Badge></td>
                      <td>{m.target?.toFixed(1)}</td>
                      <td>{m.totalSteps}</td>
                      <td>
                        <Badge bg={m.assembled ? 'success' : 'secondary'}>
                          {m.assembled ? 'Yes' : 'No'}
                        </Badge>
                      </td>
                      <td className="text-muted small">{new Date(m.receivedAt).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>

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
                <Col xs="auto"><Badge bg="secondary" className="calib-status-badge">Calibrator {selectedReq.calibratorId}</Badge></Col>
                <Col xs="auto"><Badge bg="info" className="calib-status-badge">MU {selectedReq.muId}</Badge></Col>
                <Col xs="auto"><Badge bg="primary" className="calib-status-badge">Sensor {selectedReq.sensorId}</Badge></Col>
                <Col xs="auto">
                  <Badge bg={selectedReq.processed ? 'success' : 'warning'} text={selectedReq.processed ? undefined : 'dark'} className="calib-status-badge">
                    {selectedReq.processed ? 'Processed' : 'Pending'}
                  </Badge>
                </Col>
                <Col xs="auto" className="text-muted small">
                  {new Date(selectedReq.createdAt).toLocaleString()}
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
