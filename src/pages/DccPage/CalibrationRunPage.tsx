import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import {
  Container, Row, Col, Button, Badge, Spinner, Alert,
  Nav, Tab, Card, Accordion,
} from 'react-bootstrap';
import DccNav from '../../components/DccNav';
import { useAuth } from '../../API/AuthContext';
import { getCalibrationByRequest } from '../../API/WizardAPI';
import { CalibrationWizardDTO } from '../../API/interfaces';


const CALIB_BASE = '/api/calibrations';

function getCookie(name: string): string | null {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(';').shift() ?? null;
  }
  return null;
}

function getXsrfHeaders(): HeadersInit | undefined {
  const xsrfToken = getCookie('XSRF-TOKEN');
  return xsrfToken ? { 'X-XSRF-TOKEN': xsrfToken } : undefined;
}

function statusVariant(status?: string) {
  if (status === 'SUCCESS') return 'success';
  if (status === 'FAILED') return 'danger';
  if (status === 'RUNNING') return 'warning';
  return 'secondary';
}

function formatJson(s: string | null | undefined): string {
  if (!s) return '';
  try { return JSON.stringify(JSON.parse(s), null, 2); }
  catch { return s; }
}

/**
 * Results page — /dcc/calibrations/:requestId/run
 *
 * Shows the results of the last calibration run for a given CalibrationRequest.
 * Four tabs: Log, Results JSON, DCC XML, Conformity.
 * Footer: "Save DCC" button that calls gemimeg XML→JSON then POST /api/dcc.
 */
function CalibrationRunPage() {
  const { requestId } = useParams<{ requestId: string }>();
  const navigate = useNavigate();


  const [calib, setCalib] = useState<CalibrationWizardDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('log');
  const [savingDcc, setSavingDcc] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [savedDccId, setSavedDccId] = useState<number | null>(null);

  const { role } = useAuth();

  useEffect(() => {
    if (!requestId) return;
    setLoading(true);
    getCalibrationByRequest(parseInt(requestId))
      .then((c) => setCalib(c))
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  }, [requestId]);

  // ── Parse images list ───────────────────────────────────────────────────

  const cacheBuster = calib ? `?v=${calib.updatedAt || calib.id}` : '';

  const images: string[] = (() => {
    try { return calib?.images ? JSON.parse(calib.images) : []; }
    catch { return []; }
  })();

  const calibImages = images.filter((u) => u.includes('/images/calibration/'));
  const conformImages = images.filter((u) => u.includes('/images/conformity/'));

  // ── Save DCC ───────────────────────────────────────────────────────────

  const handleSaveDcc = async () => {
    if (!calib?.id) return;
    setSavingDcc(true);
    setSaveError(null);
    try {
      // Single backend call: converts XML→JSON via gemimeg, resolves sensorId from
      // CalibrationRequest, creates the DCC record with both IDs set, returns DccDto.
      const res = await fetch(
        `${CALIB_BASE}/wizard/${calib.id}/save-dcc`,
        { method: 'POST', credentials: 'include', headers: getXsrfHeaders() }
      );
      if (!res.ok) {
        const errText = await res.text().catch(() => res.statusText);
        throw new Error(`Save DCC failed: ${errText}`);
      }
      const newDcc = await res.json();
      setSavedDccId(newDcc.id);
    } catch (e: any) {
      setSaveError(e.message);
    } finally {
      setSavingDcc(false);
    }
  };

  // ── Render ──────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <Container fluid>
        <DccNav />
        <div className="text-center py-5"><Spinner animation="border" variant="primary" /></div>
      </Container>
    );
  }

  if (!calib) {
    return (
      <Container fluid>
        <DccNav />
        <Alert variant="warning" className="mt-3">
          No calibration found for request #{requestId}.{' '}
          <Button variant="link" className="p-0" onClick={() => navigate('/dcc/calibrations')}>
            Back to Calibrations
          </Button>
        </Alert>
      </Container>
    );
  }

  const hasRun = !!calib.runStatus;
  const runFailed = calib.runStatus === 'FAILED';

  return (
    <Container fluid>
      <DccNav />

      {/* Header */}
      <div className="d-flex align-items-center justify-content-between mb-3 mt-2">
        <div>
          <Button variant="outline-secondary" size="sm" onClick={() => navigate('/dcc/calibrations')} className="me-2">
            ← Back
          </Button>
          <span className="fw-bold fs-5">Results</span>
          <code className="ms-2 text-muted small">{calib.runId ?? `request-${requestId}`}</code>
        </div>
        <div className="d-flex align-items-center gap-2">
          {calib.runStatus && (
            <Badge bg={statusVariant(calib.runStatus)} className="px-3 py-2">
              {calib.runStatus}
            </Badge>
          )}
          {!hasRun && (
            <Alert variant="info" className="mb-0 py-1 px-3 small">
              No run found. Use the "Calibrate" button from the Calibrations page.
            </Alert>
          )}
        </div>
      </div>

      {/* "Save DCC" success banner */}
      {savedDccId && (
        <Alert variant="success" className="d-flex justify-content-between align-items-center">
          <span>DCC saved successfully (ID: {savedDccId})</span>
          <Button size="sm" variant="outline-success" onClick={() => navigate(`/dcc/certificates/${savedDccId}`)}>
            View DCC →
          </Button>
        </Alert>
      )}

      {/* Main tab panel */}
      <Tab.Container activeKey={activeTab} onSelect={(k) => setActiveTab(k || 'log')}>
        <Nav variant="tabs" className="mb-0">
          <Nav.Item>
            <Nav.Link eventKey="log">
              Log {runFailed && <Badge bg="danger" pill className="ms-1">Error</Badge>}
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="results" disabled={!calib.resultJson}>
              Results JSON
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="dcc" disabled={!calib.dccXml}>
              DCC XML
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="plots" disabled={images.length === 0}>
              Plots ({images.length})
            </Nav.Link>
          </Nav.Item>
        </Nav>

        <Card className="rounded-top-0 border-top-0">
          <Card.Body className="p-0">
            <Tab.Content>
              {/* ── Log tab ── */}
              <Tab.Pane eventKey="log">
                <div className="p-3">
                  {calib.runLog ? (
                    <>
                      {runFailed && (
                        <Alert variant="danger" className="py-2 mb-2">
                          Calibration process exited with errors. See log below.
                        </Alert>
                      )}
                      {calib.runStatus === 'SUCCESS' && (
                        <Alert variant="success" className="py-2 mb-2">
                          Calibration completed successfully.
                        </Alert>
                      )}
                      <pre
                        className="bg-dark text-light p-3 rounded"
                        style={{ maxHeight: '65vh', overflowY: 'auto', fontSize: '0.78rem', whiteSpace: 'pre-wrap' }}
                      >
                        {calib.runLog}
                      </pre>
                    </>
                  ) : (
                    <Alert variant="secondary">No run log available.</Alert>
                  )}
                </div>
              </Tab.Pane>

              {/* ── Results JSON tab ── */}
              <Tab.Pane eventKey="results">
                <div className="p-3">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="fw-bold small text-muted">certificato_funzione_filled.json</span>
                    <Button
                      size="sm" variant="outline-secondary"
                      onClick={() => navigator.clipboard.writeText(formatJson(calib.resultJson))}
                    >
                      Copy JSON
                    </Button>
                  </div>
                  <pre
                    className="bg-light p-3 rounded border"
                    style={{ maxHeight: '65vh', overflowY: 'auto', fontSize: '0.75rem' }}
                  >
                    {formatJson(calib.resultJson)}
                  </pre>
                </div>
              </Tab.Pane>

              {/* ── DCC XML tab ── */}
              <Tab.Pane eventKey="dcc">
                <div className="p-3">
                  {saveError && <Alert variant="danger" className="py-2">{saveError}</Alert>}
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="fw-bold small text-muted">ntc_calibration_certificate.xml</span>
                    <div className="d-flex gap-2">
                      <Button
                        size="sm" variant="outline-secondary"
                        onClick={() => navigator.clipboard.writeText(calib.dccXml ?? '')}
                      >
                        Copy XML
                      </Button>
                      {role === 'ADMIN' && (
                        <Button
                          size="sm" variant="primary"
                          onClick={handleSaveDcc}
                          disabled={savingDcc || !!savedDccId || !calib.dccXml}
                        >
                          {savingDcc ? (
                            <><Spinner as="span" size="sm" animation="border" className="me-1" />Saving DCC...</>
                          ) : savedDccId ? (
                            `DCC Saved (ID ${savedDccId})`
                          ) : (
                            'Save DCC'
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                  <pre
                    className="bg-light p-3 rounded border"
                    style={{ maxHeight: '62vh', overflowY: 'auto', fontSize: '0.72rem', whiteSpace: 'pre-wrap' }}
                  >
                    {calib.dccXml}
                  </pre>
                </div>
              </Tab.Pane>

              {/* ── Plots tab ── */}
              <Tab.Pane eventKey="plots">
                <div className="p-3">
                  {calib.pdfOutputUrl && (
                    <Alert variant="info" className="d-flex justify-content-between align-items-center py-2 mb-3">
                      <span className="small">
                        <strong>Calibration Certificate PDF</strong> generated
                      </span>
                      <Button
                        as="a"
                        size="sm" variant="outline-primary"
                        href={calib.pdfOutputUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Download PDF
                      </Button>
                    </Alert>
                  )}

                  {calibImages.length > 0 && (
                    <>
                      <div className="fw-bold text-muted small text-uppercase mb-2">Calibration Charts</div>
                      <Row className="g-3 mb-4">
                        {calibImages.map((url) => (
                          <Col key={url} md={6} lg={4}>
                            <PlotCard url={url} cacheBuster={cacheBuster} />
                          </Col>
                        ))}
                      </Row>
                    </>
                  )}

                  {conformImages.length > 0 && (
                    <>
                      <div className="fw-bold text-muted small text-uppercase mb-2">Conformity Charts</div>
                      <Row className="g-3">
                        {conformImages.map((url) => (
                          <Col key={url} md={6} lg={4}>
                            <PlotCard url={url} cacheBuster={cacheBuster} />
                          </Col>
                        ))}
                      </Row>
                    </>
                  )}

                  {images.length === 0 && (
                    <Alert variant="secondary">No plot images available.</Alert>
                  )}
                </div>
              </Tab.Pane>
            </Tab.Content>
          </Card.Body>
        </Card>
      </Tab.Container>

      {/* ── Conformity (collapsible) ── */}
      {calib.conformityJson && (
        <Accordion className="mt-3">
          <Accordion.Item eventKey="conformity">
            <Accordion.Header>
              Conformity
              <span className="text-muted ms-2 small">certificato_funzione_filled.json &amp; conformity checks</span>
            </Accordion.Header>
            <Accordion.Body>
              <ConformitySummary conformityJson={calib.conformityJson} />
              <div className="d-flex justify-content-between align-items-center mb-2 mt-3">
                <span className="fw-bold small text-muted">conformity.json (full)</span>
                <Button
                  size="sm" variant="outline-secondary"
                  onClick={() => navigator.clipboard.writeText(formatJson(calib.conformityJson))}
                >
                  Copy JSON
                </Button>
              </div>
              <pre
                className="bg-light p-3 rounded border"
                style={{ maxHeight: '45vh', overflowY: 'auto', fontSize: '0.72rem' }}
              >
                {formatJson(calib.conformityJson)}
              </pre>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      )}
    </Container>
  );
}

// ── Sub-components ──────────────────────────────────────────────────────────

function PlotCard({ url, cacheBuster }: { url: string; cacheBuster?: string }) {
  const filename = url.split('/').pop() ?? url;
  const src = cacheBuster ? `${url}${cacheBuster}` : url;
  return (
    <Card className="border shadow-sm h-100">
      <Card.Body className="p-2 text-center">
        <img
          src={src}
          alt={filename}
          className="img-fluid rounded"
          style={{ maxHeight: '280px', objectFit: 'contain', cursor: 'pointer' }}
          onClick={() => window.open(src, '_blank')}
          title="Click to open full size"
        />
        <div className="text-muted mt-1" style={{ fontSize: '0.7rem' }}>{filename}</div>
      </Card.Body>
    </Card>
  );
}

function ConformitySummary({ conformityJson }: { conformityJson: string }) {
  let parsed: any = null;
  try { parsed = JSON.parse(conformityJson); } catch { return null; }

  const summary = parsed?.summary;
  if (!summary) return null;

  const overall: string = summary.overall ?? 'UNKNOWN';
  const overallNorm = overall === 'CONFORME' ? 'COMPLIANT' : overall === 'NON CONFORME' ? 'NON-COMPLIANT' : overall;
  const checks: { key: string; label: string }[] = [
    { key: 'G', label: 'As-Found vs Tolerance' },
    { key: 'A', label: 'Expanded Uncertainty' },
    { key: 'B', label: 'Calibration Limits' },
    { key: 'H', label: 'PFA' },
  ];

  return (
    <div className="p-3 rounded border mb-2">
      <div className="d-flex align-items-center gap-3 mb-3">
        <span className="fw-bold">Conformity Result:</span>
        <Badge
          bg={overall === 'CONFORME' || overall === 'COMPLIANT' ? 'success' : overall === 'NON CONFORME' || overall === 'NON-COMPLIANT' ? 'danger' : 'secondary'}
          className="px-3 py-2"
        >
          {overallNorm}
        </Badge>
        {summary.calibration_done && (
          <Badge bg="info">{summary.calibration_done}</Badge>
        )}
      </div>
      <div className="d-flex flex-wrap gap-2">
        {checks.map(({ key, label }) => {
          const val: string = summary[key] ?? 'N/A';
          const bg = val === 'PASS' ? 'success' : val === 'FAIL' ? 'danger' : val === 'WARN' ? 'warning' : 'secondary';
          return (
            <div key={key} className="text-center" style={{ minWidth: '80px' }}>
              <div className="text-muted small">{label}</div>
              <Badge bg={bg} className="w-100">{val}</Badge>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default CalibrationRunPage;
