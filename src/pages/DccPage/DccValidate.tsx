import { useState, useRef, useEffect } from 'react';
import {
  Container, Card, Row, Col, Button, Form,
  Alert, Badge, ListGroup, Table, InputGroup, Spinner, Collapse,
} from 'react-bootstrap';
import { useNavigate } from 'react-router';
import { FiTrash2, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { useAuth } from '../../API/AuthContext';
import DccNav from '../../components/DccNav';
import { externalValidateXml, externalValidatePdf, verifyDccConformity, getSensorTemplates } from '../../API/DccAPI';
import { DccValidationResultDTO, DccDTO, ConformityVerificationResultDTO } from '../../API/interfaces';

function DccValidate() {
  const navigate = useNavigate();
  const { xsrfToken } = useAuth();

  const [xmlFile, setXmlFile] = useState<File | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const xmlRef = useRef<HTMLInputElement>(null);
  const pdfRef = useRef<HTMLInputElement>(null);

  const [validating, setValidating] = useState(false);
  const [xmlResult, setXmlResult] = useState<DccValidationResultDTO | null>(null);
  const [pdfResult, setPdfResult] = useState<DccValidationResultDTO | null>(null);

  // ── Verify Conformity state ──────────────────────────────────────────────
  const [conformityXmlFile, setConformityXmlFile]   = useState<File | null>(null);
  const conformityXmlRef = useRef<HTMLInputElement>(null);

  const [sensorTemplates, setSensorTemplates]       = useState<string[]>([]);
  const [selectedSensor, setSelectedSensor]         = useState('ntc_temperature.json');
  const [mae, setMae]                               = useState(0.10);
  const [pfaThreshold, setPfaThreshold]             = useState(20.0);
  const [uRef, setURef]                             = useState(0.065);
  const [showAdvanced, setShowAdvanced]             = useState(false);

  const [conformityRunning, setConformityRunning]   = useState(false);
  const [conformityResult, setConformityResult]     = useState<ConformityVerificationResultDTO | null>(null);
  const [conformityError, setConformityError]       = useState<string | null>(null);

  // Load sensor templates once
  useEffect(() => {
    getSensorTemplates()
      .then((templates) => {
        setSensorTemplates(templates);
        if (templates.length > 0) setSelectedSensor(templates[0]);
      })
      .catch(() => {/* not fatal — user can type manually */});
  }, []);

  const handleValidate = async () => {
    if (!xmlFile && !pdfFile) {
      alert('Please select at least one file to validate.');
      return;
    }
    setValidating(true);
    setXmlResult(null);
    setPdfResult(null);
    try {
      if (xmlFile) setXmlResult(await externalValidateXml(xsrfToken || '', xmlFile));
      if (pdfFile) setPdfResult(await externalValidatePdf(xsrfToken || '', pdfFile));
    } catch (e) {
      console.error(e);
      alert('An error occurred during validation.');
    } finally {
      setValidating(false);
    }
  };

  const clearFile = (type: 'xml' | 'pdf') => {
    if (type === 'xml') {
      setXmlFile(null);
      if (xmlRef.current) xmlRef.current.value = '';
      setXmlResult(null);
    } else {
      setPdfFile(null);
      if (pdfRef.current) pdfRef.current.value = '';
      setPdfResult(null);
    }
  };

  const handleVerifyConformity = async () => {
    if (!conformityXmlFile) {
      alert('Please select a DCC XML file to verify.');
      return;
    }
    setConformityRunning(true);
    setConformityResult(null);
    setConformityError(null);
    try {
      const result = await verifyDccConformity(
        xsrfToken || '',
        conformityXmlFile,
        selectedSensor,
        mae,
        pfaThreshold,
        uRef,
      );
      setConformityResult(result);
    } catch (e: any) {
      setConformityError(e.message || 'Unknown error');
    } finally {
      setConformityRunning(false);
    }
  };

  const clearConformityFile = () => {
    setConformityXmlFile(null);
    if (conformityXmlRef.current) conformityXmlRef.current.value = '';
    setConformityResult(null);
    setConformityError(null);
  };

  const renderResult = (title: string, result: DccValidationResultDTO) => (
    <div className="mb-5">
      <h5 className="mb-3 text-uppercase fw-bold border-bottom pb-2">{title}</h5>
      <Row>
        <Col md={12} className="mb-4">
          <Card className={`border-0 shadow-sm ${result.valid ? 'border-start border-success border-5' : 'border-start border-danger border-5'}`}>
            <Card.Header className="bg-white">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Validation Result</h5>
                <Badge bg={result.valid ? 'success' : 'danger'}>
                  {result.valid ? 'VALID SIGNATURE' : 'INVALID SIGNATURE'}
                </Badge>
              </div>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={6}>
                  <h6>Signature Details</h6>
                  <ListGroup variant="flush">
                    <ListGroup.Item className="d-flex justify-content-between px-0">
                      <span>Algorithm:</span>
                      <span className="fw-bold text-break">{result.signatureDetails.algorithm}</span>
                    </ListGroup.Item>
                    <ListGroup.Item className="px-0">
                      <div>Signer:</div>
                      <span className="fw-bold text-break">{result.signatureDetails.signer}</span>
                    </ListGroup.Item>
                    <ListGroup.Item className="d-flex justify-content-between px-0">
                      <span>Public Key Match:</span>
                      <Badge bg={result.signatureDetails.publicKeyMatch ? 'success' : 'danger'}>
                        {result.signatureDetails.publicKeyMatch ? 'MATCHED' : 'MISMATCH'}
                      </Badge>
                    </ListGroup.Item>
                  </ListGroup>
                </Col>
                <Col md={6}>
                  <h6>File Integrity</h6>
                  <ListGroup variant="flush">
                    <ListGroup.Item className="px-0">
                      <div>Hash (SHA-256):</div>
                      <code className="text-break">{result.signatureDetails.hash}</code>
                    </ListGroup.Item>
                    <ListGroup.Item className="px-0">
                      <div>Public Key Hash:</div>
                      <code className="text-break">{result.signatureDetails.publicKeyHash}</code>
                    </ListGroup.Item>
                    <ListGroup.Item className="d-flex justify-content-between px-0">
                      <span>Timestamp:</span>
                      <span>{result.signatureDetails.timestamp}</span>
                    </ListGroup.Item>
                  </ListGroup>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col md={12}>
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-white">
              <h5 className="mb-0">Matching DCCs in Database</h5>
            </Card.Header>
            <Card.Body className="p-0">
              <Table responsive hover className="mb-0">
                <thead className="table-light">
                  <tr>
                    <th>ID</th><th>Name</th><th>Sensor ID</th>
                    <th>Status</th><th>Created By</th><th></th>
                  </tr>
                </thead>
                <tbody>
                  {result.matchingDccs.map((dcc: DccDTO) => (
                    <tr key={dcc.id} style={{ cursor: 'pointer' }} onClick={() => navigate(`/dcc/certificates/${dcc.id}`)}>
                      <td className="fw-bold">{dcc.id}</td>
                      <td>{dcc.name}</td>
                      <td>{dcc.sensorId ?? '-'}</td>
                      <td>
                        <Badge bg={dcc.status === 'GREEN' ? 'success' : dcc.status === 'YELLOW' ? 'warning' : dcc.status === 'BLUE' ? 'primary' : 'danger'}>
                          {dcc.status}
                        </Badge>
                      </td>
                      <td>{dcc.createdByName || dcc.createdBy}</td>
                      <td><small className="text-primary">View Details &rarr;</small></td>
                    </tr>
                  ))}
                  {result.matchingDccs.length === 0 && (
                    <tr>
                      <td colSpan={6} className="text-center py-3 text-muted">
                        No matching DCCs found for this file hash.
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );

  return (
    <Container fluid>
      <DccNav />
      <h4 className="mt-4 mb-4">Validate DCC Signatures</h4>

      <Row className="mb-4">
        <Col md={6}>
          <Card className="shadow-sm border-0">
            <Card.Body>
              <Card.Title>Upload Files</Card.Title>
              <Form.Group className="mb-3">
                <Form.Label>DCC XML File</Form.Label>
                <InputGroup>
                  <Form.Control
                    type="file" accept=".xml" ref={xmlRef}
                    onChange={(e: any) => setXmlFile(e.target.files[0])}
                  />
                  {xmlFile && (
                    <Button variant="outline-danger" onClick={() => clearFile('xml')}>
                      <FiTrash2 />
                    </Button>
                  )}
                </InputGroup>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>DCC PDF File</Form.Label>
                <InputGroup>
                  <Form.Control
                    type="file" accept=".pdf" ref={pdfRef}
                    onChange={(e: any) => setPdfFile(e.target.files[0])}
                  />
                  {pdfFile && (
                    <Button variant="outline-danger" onClick={() => clearFile('pdf')}>
                      <FiTrash2 />
                    </Button>
                  )}
                </InputGroup>
              </Form.Group>
              <Button
                variant="primary" onClick={handleValidate}
                disabled={validating || (!xmlFile && !pdfFile)}
              >
                {validating ? 'Validating...' : 'Validate Signatures'}
              </Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Alert variant="info">
            <h5>How it works</h5>
            <p className="small">
              Upload your signed DCC files. The system will:
              <br />1. Verify the digital signature integrity.
              <br />2. Check if the public key matches the <strong>Measure Stream</strong> authority.
              <br />3. Identify existing DCCs in the database that match the file hash.
            </p>
          </Alert>
        </Col>
      </Row>

      {xmlResult && renderResult('XML Verification', xmlResult)}
      {pdfResult && renderResult('PDF Verification', pdfResult)}

      {/* ── Verify DCC Conformity ─────────────────────────────────── */}
      <hr className="my-5" />
      <h4 className="mb-4">Verify DCC Conformity</h4>

      <Row className="mb-4">
        <Col md={6}>
          <Card className="shadow-sm border-0">
            <Card.Body>
              <Card.Title>Upload DCC XML Certificate</Card.Title>

              {/* File upload */}
              <Form.Group className="mb-3">
                <Form.Label>DCC XML File <span className="text-danger">*</span></Form.Label>
                <InputGroup>
                  <Form.Control
                    type="file" accept=".xml" ref={conformityXmlRef}
                    onChange={(e: any) => {
                      setConformityXmlFile(e.target.files?.[0] ?? null);
                      setConformityResult(null);
                      setConformityError(null);
                    }}
                  />
                  {conformityXmlFile && (
                    <Button variant="outline-danger" onClick={clearConformityFile}>
                      <FiTrash2 />
                    </Button>
                  )}
                </InputGroup>
              </Form.Group>

              {/* Sensor template dropdown */}
              <Form.Group className="mb-3">
                <Form.Label>
                  Sensor Template{' '}
                  <Badge bg="secondary" className="ms-1" style={{ fontSize: '0.65rem' }}>--sensor</Badge>
                </Form.Label>
                <Form.Select
                  value={selectedSensor}
                  onChange={(e) => setSelectedSensor(e.target.value)}
                >
                  {sensorTemplates.length > 0
                    ? sensorTemplates.map((s) => <option key={s} value={s}>{s}</option>)
                    : <option value="ntc_temperature.json">ntc_temperature.json</option>
                  }
                </Form.Select>
                <Form.Text className="text-muted">From models_in/sensors/</Form.Text>
              </Form.Group>

              {/* Advanced parameters (collapsible) */}
              <div className="mb-3">
                <Button
                  variant="link"
                  className="p-0 text-decoration-none text-muted small"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                >
                  {showAdvanced ? <FiChevronUp className="me-1" /> : <FiChevronDown className="me-1" />}
                  Advanced Parameters
                </Button>
                <Collapse in={showAdvanced}>
                  <div className="mt-2 p-3 rounded bg-light border">
                    <Row className="g-2">
                      <Col md={4}>
                        <Form.Group>
                          <Form.Label className="small fw-semibold">
                            MAE [°C]{' '}
                            <Badge bg="secondary" style={{ fontSize: '0.6rem' }}>--mae</Badge>
                          </Form.Label>
                          <Form.Control
                            type="number" step="0.001" min="0.001"
                            value={mae}
                            onChange={(e) => setMae(parseFloat(e.target.value) || 0.10)}
                            size="sm"
                          />
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group>
                          <Form.Label className="small fw-semibold">
                            PFA Threshold [%]{' '}
                            <Badge bg="secondary" style={{ fontSize: '0.6rem' }}>--pfa-threshold</Badge>
                          </Form.Label>
                          <Form.Control
                            type="number" step="0.1" min="0.1" max="100"
                            value={pfaThreshold}
                            onChange={(e) => setPfaThreshold(parseFloat(e.target.value) || 20.0)}
                            size="sm"
                          />
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group>
                          <Form.Label className="small fw-semibold">
                            U_ref [°C]{' '}
                            <Badge bg="secondary" style={{ fontSize: '0.6rem' }}>--u-ref</Badge>
                          </Form.Label>
                          <Form.Control
                            type="number" step="0.001" min="0"
                            value={uRef}
                            onChange={(e) => setURef(parseFloat(e.target.value) || 0.065)}
                            size="sm"
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                  </div>
                </Collapse>
              </div>

              <Button
                variant="primary"
                onClick={handleVerifyConformity}
                disabled={conformityRunning || !conformityXmlFile}
              >
                {conformityRunning
                  ? <><Spinner as="span" size="sm" animation="border" className="me-2" />Running...</>
                  : 'Verify Conformity'}
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Alert variant="info">
            <h5>How it works</h5>
            <p className="small mb-0">
              Upload a signed DCC XML certificate. The system will:
              <br />1. Parse the embedded measurement data (T_ref, T_sensor, errors, uncertainties).
              <br />2. Run <strong>Check G</strong> — sensor as-found accuracy vs declared limits.
              <br />3. Run <strong>Check H</strong> — Probability of False Acceptance (PFA) per point.
              <br />4. Run the <strong>Overlap Check</strong> — uncertainty interval compatibility.
              <br />5. Generate conformity charts and return the full verification report.
              <br /><br />
              Nothing is saved to the database — all processing is ephemeral.
            </p>
          </Alert>
        </Col>
      </Row>

      {/* Error */}
      {conformityError && (
        <Alert variant="danger" className="mb-4">
          <strong>Error:</strong> {conformityError}
        </Alert>
      )}

      {/* Results */}
      {conformityResult && (
        <div className="mb-5">
          <h5 className="mb-3 text-uppercase fw-bold border-bottom pb-2">Conformity Verification Result</h5>

          {/* Overall verdict banner */}
          <Alert
            variant={
              conformityResult.overall === 'CONFORME' ? 'success'
              : conformityResult.overall === 'NON CONFORME' ? 'danger'
              : 'warning'
            }
            className="d-flex align-items-center gap-3 mb-4"
          >
            <span className="fs-4">
              {conformityResult.overall === 'CONFORME' ? '✓' : conformityResult.overall === 'NON CONFORME' ? '✗' : '?'}
            </span>
            <div>
              <div className="fw-bold fs-5">
                Overall Verdict:{' '}
                <Badge
                  bg={
                    conformityResult.overall === 'CONFORME' ? 'success'
                    : conformityResult.overall === 'NON CONFORME' ? 'danger'
                    : 'warning'
                  }
                >
                  {conformityResult.overall}
                </Badge>
              </div>
              <div className="small mt-1 opacity-75">
                Parameters: MAE={mae} °C | PFA threshold={pfaThreshold}% | U_ref={uRef} °C | Sensor={selectedSensor}
              </div>
            </div>
          </Alert>

          <Row className="g-4">
            {/* Log panel */}
            <Col md={conformityResult.images.length > 0 ? 6 : 12}>
              <Card className="border-0 shadow-sm h-100">
                <Card.Header className="bg-white d-flex justify-content-between align-items-center">
                  <span className="fw-semibold">Verification Log</span>
                  <Badge bg={conformityResult.success ? 'success' : 'danger'}>
                    {conformityResult.success ? 'Exit 0' : 'Error'}
                  </Badge>
                </Card.Header>
                <Card.Body className="p-0">
                  <pre
                    className="m-0 p-3"
                    style={{
                      fontSize: '0.72rem',
                      background: '#1e1e1e',
                      color: '#d4d4d4',
                      borderRadius: '0 0 0.375rem 0.375rem',
                      maxHeight: '500px',
                      overflowY: 'auto',
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word',
                    }}
                  >
                    {conformityResult.log}
                  </pre>
                </Card.Body>
              </Card>
            </Col>

            {/* Charts */}
            {conformityResult.images.length > 0 && (
              <Col md={6}>
                <Card className="border-0 shadow-sm h-100">
                  <Card.Header className="bg-white fw-semibold">
                    Conformity Charts ({conformityResult.images.length})
                  </Card.Header>
                  <Card.Body style={{ overflowY: 'auto', maxHeight: '520px' }}>
                    {conformityResult.images.map((img) => (
                      <div key={img.filename} className="mb-4">
                        <div className="small text-muted mb-1 fw-semibold">{img.filename}</div>
                        <img
                          src={img.dataUri}
                          alt={img.filename}
                          className="img-fluid rounded border"
                          style={{ width: '100%' }}
                        />
                      </div>
                    ))}
                  </Card.Body>
                </Card>
              </Col>
            )}
          </Row>
        </div>
      )}
    </Container>
  );
}

export default DccValidate;
