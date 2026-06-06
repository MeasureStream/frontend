import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import {
  Container, Card, Row, Col, Button, Badge,
  ListGroup, Spinner,
} from 'react-bootstrap';
import {
  BsFiletypePdf, BsFiletypeXml, BsGraphUp,
  BsBoxArrowUpRight, BsShieldCheck, BsCheckCircle,
} from 'react-icons/bs';
import { DccDTO } from '../../API/interfaces';
import {
  getDcc, validateDcc, downloadSignedPdf, downloadSignedXml,
  downloadCalibrationResult,
  publishDcc, unpublishDcc,
} from '../../API/DccAPI';
import { useAuth } from '../../API/AuthContext';

const GEMIMEG_URL = 'https://dev.christiandellisanti.uk/gemimegdcc/dcc/create';

function statusBg(status: string) {
  if (status === 'GREEN') return 'success';
  if (status === 'YELLOW') return 'warning';
  if (status === 'RED') return 'danger';
  if (status === 'BLUE') return 'primary';
  if (status === 'GREY') return 'secondary';
  if (status === 'ARCHIVED') return 'dark';
  return 'secondary';
}

function DccDetail() {
  const { dccId } = useParams<{ dccId: string }>();
  const navigate = useNavigate();
  const { xsrfToken, role } = useAuth();

  const [dcc, setDcc] = useState<DccDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [validating, setValidating] = useState(false);

  useEffect(() => {
    if (!dccId) return;
    getDcc(parseInt(dccId))
      .then(setDcc)
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  }, [dccId]);

  const handleSignAndVerify = async () => {
    if (!dcc) return;
    setValidating(true);
    try {
      const updated = await validateDcc(xsrfToken || '', dcc.id, 'PDF');
      setDcc(updated);
      alert('Both PDF and XML signed and validated!');
    } catch (e) {
      console.error(e);
      alert('Validation failed. Ensure backend services are running.');
    } finally {
      setValidating(false);
    }
  };

  const handleDownload = async (type: 'PDF' | 'XML') => {
    if (!dcc) return;
    try {
      const url = type === 'PDF' ? dcc.pdfUrl : dcc.xmlUrl;
      if (url) {
        const a = document.createElement('a');
        a.href = url; a.download = `dcc-${dcc.id}-signed.${type.toLowerCase()}`;
        a.target = '_blank'; document.body.appendChild(a); a.click(); document.body.removeChild(a);
      } else {
        const blob = type === 'PDF' ? await downloadSignedPdf(dcc.id) : await downloadSignedXml(dcc.id);
        const blobUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = blobUrl; a.download = `dcc-${dcc.id}-signed.${type.toLowerCase()}`;
        document.body.appendChild(a); a.click(); URL.revokeObjectURL(blobUrl); document.body.removeChild(a);
      }
    } catch (e) { console.error(e); alert(`Download ${type} failed`); }
  };

  const handlePublish = async () => {
    if (!dcc || !window.confirm('Make this DCC effective?')) return;
    try { setDcc(await publishDcc(xsrfToken || '', dcc.id)); alert('DCC made effective!'); }
    catch (e) { console.error(e); alert('Publish failed'); }
  };

  const handleUnpublish = async () => {
    if (!dcc || !window.confirm('Make this DCC ineffective?')) return;
    try { setDcc(await unpublishDcc(xsrfToken || '', dcc.id)); alert('DCC made ineffective!'); }
    catch (e) { console.error(e); alert('Unpublish failed'); }
  };

  const handleCalibrationResult = async () => {
    if (!dcc) return;
    try {
      const blob = await downloadCalibrationResult(dcc.id);
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl; a.download = `calibration-result-dcc-${dcc.id}.pdf`;
      document.body.appendChild(a); a.click(); URL.revokeObjectURL(blobUrl); document.body.removeChild(a);
    } catch (e) { console.error(e); alert('Download calibration result failed'); }
  };

  if (loading) return <Container className="mt-4"><Spinner animation="border" /></Container>;
  if (!dcc) return <Container className="mt-4"><h3>DCC not found</h3></Container>;

  let parsedJson: any = null;
  try { parsedJson = JSON.parse(dcc.dccJson); } catch { /* leave null */ }

  const isEffectiveOrArchived = dcc.status === 'BLUE' || dcc.status === 'ARCHIVED';

  return (
    <Container className="mt-4">
      <Button variant="outline-secondary" className="mb-3" onClick={() => navigate(-1)}>
        &larr; Back
      </Button>

      <Card>
        <Card.Header as="h4" className="d-flex justify-content-between align-items-center">
          <span>DCC Details: {dcc.name}</span>
          <div className="d-flex gap-2 align-items-center">
            {role === 'ADMIN' && !isEffectiveOrArchived && (
              <Button
                size="sm" variant="info"
                onClick={(e) => window.open(`${GEMIMEG_URL}?dccId=${dcc.id}`, e.ctrlKey || e.metaKey ? '_blank' : '_self')}
              >
                <BsBoxArrowUpRight className="me-1" />GEMIMEG
              </Button>
            )}
            {role === 'ADMIN' && !isEffectiveOrArchived ? (
              dcc.publishedAt
                ? <Button size="sm" variant="warning" onClick={handleUnpublish}>Make Ineffective</Button>
                : dcc.pdfValid && dcc.xmlValid
                  ? <Button size="sm" variant="success" onClick={handlePublish}><BsCheckCircle className="me-1" />Make Effective</Button>
                  : null
            ) : (
              <Badge bg={statusBg(dcc.status)}>{dcc.status}</Badge>
            )}
            {role === 'ADMIN' && !isEffectiveOrArchived && (
              <Badge bg={statusBg(dcc.status)}>{dcc.status}</Badge>
            )}
          </div>
        </Card.Header>

        <Card.Body>
          <Row className="mb-3">
            <Col md={6}>
              <ListGroup variant="flush">
                <ListGroup.Item><strong>ID:</strong> {dcc.id}</ListGroup.Item>
                <ListGroup.Item><strong>Name:</strong> {dcc.name}</ListGroup.Item>
                <ListGroup.Item>
                  <strong>Sensor ID:</strong>{' '}
                  {dcc.sensorId ? (
                    <Button
                      size="sm" variant="link" className="p-0"
                      onClick={() => navigate(`/dcc/certificates?sensorId=${dcc.sensorId}`)}
                    >
                      {dcc.sensorId}
                    </Button>
                  ) : 'Template (None)'}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Calibration Date:</strong>{' '}
                  {dcc.calibrationDate ? new Date(dcc.calibrationDate).toLocaleDateString() : '-'}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Expiration Date:</strong>{' '}
                  {dcc.expirationDate ? new Date(dcc.expirationDate).toLocaleDateString() : '-'}
                </ListGroup.Item>
              </ListGroup>
            </Col>
            <Col md={6}>
              <ListGroup variant="flush">
                <ListGroup.Item><strong>Created By:</strong> {dcc.createdByName || dcc.createdBy}</ListGroup.Item>
                <ListGroup.Item><strong>Created At:</strong> {new Date(dcc.createdAt).toLocaleString()}</ListGroup.Item>
                <ListGroup.Item><strong>Updated At:</strong> {new Date(dcc.updatedAt).toLocaleString()}</ListGroup.Item>
                <ListGroup.Item>
                  <strong>Effective From:</strong>{' '}
                  {dcc.publishedAt
                    ? new Date(dcc.publishedAt).toLocaleString()
                    : <span className="text-muted">Not effective</span>}
                </ListGroup.Item>
              </ListGroup>
            </Col>
          </Row>

          {/* Files & signing */}
          <Row className="mb-3">
            <Col>
              <h5>Files</h5>
              <div className="d-flex align-items-center gap-3 flex-wrap">
                <Badge bg={dcc.pdfValid ? 'success' : 'danger'}>
                  PDF {dcc.pdfValid ? 'Valid' : 'Invalid/Missing'}
                </Badge>
                <Badge bg={dcc.xmlValid ? 'success' : 'danger'}>
                  XML {dcc.xmlValid ? 'Valid' : 'Invalid/Missing'}
                </Badge>
                <div className="ms-auto d-flex gap-2 flex-wrap">
                  {role === 'ADMIN' && !isEffectiveOrArchived && !dcc.pdfValid && !dcc.xmlValid && (
                    <Button
                      size="sm" variant="success"
                      onClick={handleSignAndVerify} disabled={validating}
                    >
                      {validating ? <><Spinner as="span" animation="border" size="sm" className="me-1" />Signing...</> : <><BsShieldCheck className="me-1" />Sign & Verify</>}
                    </Button>
                  )}
                  <Button size="sm" variant="outline-danger" onClick={() => handleDownload('PDF')} disabled={!dcc.pdfValid || validating}>
                    <BsFiletypePdf className="me-1" />Signed PDF
                  </Button>
                  <Button size="sm" variant="outline-warning" onClick={() => handleDownload('XML')} disabled={!dcc.xmlValid || validating}>
                    <BsFiletypeXml className="me-1" />Signed XML
                  </Button>
                  {dcc.calibrationRequestId && isEffectiveOrArchived && (
                    <Button size="sm" variant="outline-info" onClick={handleCalibrationResult}>
                      <BsGraphUp className="me-1" />Calibration Result
                    </Button>
                  )}
                </div>
              </div>
            </Col>
          </Row>

          {/* JSON preview */}
          <Row>
            <Col>
              <h5>DCC JSON Content</h5>
              <Card className="bg-light">
                <Card.Body>
                  <pre style={{ maxHeight: '300px', overflowY: 'auto', fontSize: '0.8rem' }}>
                    {parsedJson ? JSON.stringify(parsedJson, null, 2) : dcc.dccJson}
                  </pre>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default DccDetail;
