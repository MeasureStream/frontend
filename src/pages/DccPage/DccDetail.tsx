import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import {
  Container, Card, Row, Col, Button, Badge,
  ListGroup, Spinner,
} from 'react-bootstrap';
import { DccDTO } from '../../API/interfaces';
import {
  getDcc, validateDcc, downloadSignedPdf, downloadSignedXml,
  publishDcc, unpublishDcc,
} from '../../API/DccAPI';
import { useAuth } from '../../API/AuthContext';

const GEMIMEG_URL = 'https://dev.christiandellisanti.uk/gemimegdcc/dcc/create';

function statusBg(status: string) {
  if (status === 'GREEN') return 'success';
  if (status === 'YELLOW') return 'warning';
  if (status === 'RED') return 'danger';
  if (status === 'BLUE') return 'primary';
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

  if (loading) return <Container className="mt-4"><Spinner animation="border" /></Container>;
  if (!dcc) return <Container className="mt-4"><h3>DCC not found</h3></Container>;

  let parsedJson: any = null;
  try { parsedJson = JSON.parse(dcc.dccJson); } catch { /* leave null */ }

  return (
    <Container className="mt-4">
      <Button variant="outline-secondary" className="mb-3" onClick={() => navigate(-1)}>
        &larr; Back
      </Button>

      <Card>
        <Card.Header as="h4" className="d-flex justify-content-between align-items-center">
          <span>DCC Details: {dcc.name}</span>
          <div className="d-flex gap-2 align-items-center">
            <Button
              size="sm" variant="info"
              onClick={(e) => window.open(`${GEMIMEG_URL}?dccId=${dcc.id}`, e.ctrlKey || e.metaKey ? '_blank' : '_self')}
            >
              GEMIMEG
            </Button>
            {role === 'ADMIN' && (
              dcc.publishedAt
                ? <Button size="sm" variant="warning" onClick={handleUnpublish}>Make Ineffective</Button>
                : <Button size="sm" variant="success" onClick={handlePublish} disabled={dcc.status === 'RED'}>Make Effective</Button>
            )}
            <Badge bg={statusBg(dcc.status)}>{dcc.status}</Badge>
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
                  <Button
                    size="sm" variant="outline-success"
                    onClick={handleSignAndVerify} disabled={validating}
                  >
                    {validating ? <Spinner as="span" animation="border" size="sm" /> : 'Sign & Verify Both'}
                  </Button>
                  <div className="vr" />
                  <Button size="sm" variant="primary" onClick={() => handleDownload('PDF')} disabled={!dcc.pdfValid || validating}>
                    ⬇ Signed PDF
                  </Button>
                  <Button size="sm" variant="info" onClick={() => handleDownload('XML')} disabled={!dcc.xmlValid || validating}>
                    ⬇ Signed XML
                  </Button>
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
