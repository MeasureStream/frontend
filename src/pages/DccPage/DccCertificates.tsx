import { useEffect, useState } from 'react';
import {
  Container, Table, Badge, Button, Modal, Form,
  Row, Col, Alert, Spinner, OverlayTrigger, Tooltip,
} from 'react-bootstrap';
import {
  BsPencil, BsBoxArrowUpRight, BsShieldCheck, BsCheckCircle,
  BsFiletypePdf, BsFiletypeXml, BsGraphUp,
} from 'react-icons/bs';
import { FiHelpCircle } from 'react-icons/fi';
import { useNavigate, useSearchParams } from 'react-router';
import { useAuth } from '../../API/AuthContext';
import DccNav from '../../components/DccNav';
import {
  getDccs, createDcc, updateDcc, validateDcc,
  publishDcc, unpublishDcc, deleteDcc, downloadSignedPdf,
  downloadSignedXml, downloadCalibrationResult, getSensors,
} from '../../API/DccAPI';
import {
  DccDTO, DccCreateRequest, DccUpdateRequest, SensorDccDTO,
} from '../../API/interfaces';

const GEMIMEG_URL = 'https://dev.christiandellisanti.uk/gemimegdcc/dcc/create';

const STATUS_LEGEND = (
  <OverlayTrigger
    placement="right"
    overlay={
      <Tooltip id="status-legend-tooltip" style={{ maxWidth: '300px' }}>
        <div style={{ textAlign: 'left', fontSize: '0.8rem', lineHeight: '1.6' }}>
          <div><span className="badge bg-success me-1">GREEN</span> Valid and within calibration period</div>
          <div><span className="badge bg-warning text-dark me-1">YELLOW</span> Calibration near expiration or needs attention</div>
          <div><span className="badge bg-danger me-1">RED</span> Expired or validation failed</div>
          <div><span className="badge bg-primary me-1">BLUE</span> Published and effective</div>
          <div><span className="badge bg-secondary me-1">GREY</span> Draft — not yet signed or validated</div>
          <div><span className="badge bg-dark me-1">ARCHIVED</span> No longer active</div>
        </div>
      </Tooltip>
    }
  >
    <FiHelpCircle className="ms-1 text-muted" style={{ cursor: 'help', fontSize: '0.85rem' }} />
  </OverlayTrigger>
);

function statusBg(status: string) {
  if (status === 'GREEN') return 'success';
  if (status === 'YELLOW') return 'warning';
  if (status === 'RED') return 'danger';
  if (status === 'BLUE') return 'primary';
  if (status === 'GREY') return 'secondary';
  if (status === 'ARCHIVED') return 'dark';
  return 'secondary';
}

// ─── Main page ─────────────────────────────────────────────────────────────

function DccCertificates() {
  const { xsrfToken, role } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sensorIdParam = searchParams.get('sensorId');

  const [dccs, setDccs] = useState<DccDTO[]>([]);
  const [sensors, setSensors] = useState<SensorDccDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [dirty, setDirty] = useState(true);
  const [filterId, setFilterId] = useState('');
  const [filterName, setFilterName] = useState('');

  const [showCreate, setShowCreate] = useState(false);
  const [createForm, setCreateForm] = useState<DccCreateRequest>({
    name: '',
    sensorId: sensorIdParam || undefined,
  });

  useEffect(() => {
    getSensors()
      .then(setSensors)
      .catch((e) => console.error('Error fetching sensors:', e));
  }, []);

  useEffect(() => {
    if (!dirty) return;
    setLoading(true);
    getDccs(sensorIdParam || undefined, false)
      .then(setDccs)
      .catch((e) => console.error('Error fetching DCCs:', e))
      .finally(() => { setLoading(false); setDirty(false); });
  }, [dirty, sensorIdParam]);

  const handleCreate = async () => {
    if (!createForm.name) { alert('Name is required'); return; }
    try {
      await createDcc(xsrfToken || '', createForm);
      setCreateForm({ name: '', sensorId: sensorIdParam || undefined });
      setShowCreate(false);
      setDirty(true);
    } catch (e) {
      console.error(e);
      alert('Failed to create DCC.');
    }
  };

  const filtered = dccs.filter((d) =>
    (!filterId || d.id.toString().includes(filterId)) &&
    (!filterName || d.name.toLowerCase().includes(filterName.toLowerCase()))
  );

  const sensorLabel = (sensorId?: number) => {
    if (!sensorId) return '-';
    return <code className="small">ID {sensorId}</code>;
  };

  return (
    <Container fluid>
      <DccNav />

      <Form className="mb-3">
        <Row className="g-2">
          <Col md>
            <Form.Control placeholder="Filter by ID" value={filterId} onChange={(e) => setFilterId(e.target.value)} />
          </Col>
          <Col md>
            <Form.Control placeholder="Filter by Name" value={filterName} onChange={(e) => setFilterName(e.target.value)} />
          </Col>
        </Row>
      </Form>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="mb-0">DCC Certificates</h4>
        {role === 'ADMIN' && (
          <Button variant="primary" onClick={() => setShowCreate(true)}>
            Create DCC
          </Button>
        )}
      </div>

      {sensorIdParam && (
        <Alert variant="info" className="d-flex justify-content-between align-items-center">
          <span>
            Filtering by sensor: <strong>{sensorLabel(parseInt(sensorIdParam))}</strong>
          </span>
          <Button size="sm" variant="outline-info" onClick={() => navigate('/dcc/certificates')}>
            Clear Filter
          </Button>
        </Alert>
      )}

      {loading ? (
        <div className="text-center py-5"><Spinner animation="border" variant="primary" /></div>
      ) : (
        <Table responsive striped hover className="text-center">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Sensor</th>
              <th>Status{STATUS_LEGEND}</th>
              <th>Created By</th>
              <th>Created At</th>
              <th>Calibration Date</th>
              <th>Expiration Date</th>
              <th>Effective From</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((dcc) => (
              <tr
                key={dcc.id}
                style={{ cursor: 'pointer' }}
                onClick={() => navigate(`/dcc/certificates/${dcc.id}`)}
              >
                <td>{dcc.id}</td>
                <td>{dcc.name}</td>
                <td>
                  <code className="small">ID {dcc.sensorId || '-'}</code>
                </td>
                <td>
                  <Badge bg={statusBg(dcc.status)}>{dcc.status}</Badge>
                </td>
                <td>{dcc.createdByName || dcc.createdBy}</td>
                <td>{new Date(dcc.createdAt).toLocaleString()}</td>
                <td>{dcc.calibrationDate ? new Date(dcc.calibrationDate).toLocaleDateString() : '-'}</td>
                <td>{dcc.expirationDate ? new Date(dcc.expirationDate).toLocaleDateString() : '-'}</td>
                <td>{dcc.publishedAt ? new Date(dcc.publishedAt).toLocaleString() : '-'}</td>
                <td onClick={(e) => e.stopPropagation()}>
                  <DccActions dcc={dcc} sensors={sensors} setDirty={setDirty} />
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {/* Create modal */}
      <Modal show={showCreate} onHide={() => setShowCreate(false)}>
        <Modal.Header closeButton><Modal.Title>Create DCC</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                value={createForm.name}
                onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                placeholder="Certificate name"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Sensor (optional)</Form.Label>
              <Form.Select
                value={createForm.sensorId || ''}
                onChange={(e) => setCreateForm({ ...createForm, sensorId: e.target.value || undefined })}
              >
                <option value="">-- None (Template) --</option>
                {sensors.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.modelName} — CH {s.sensorIndex} | MU {s.muExtendedId} (ID: {s.id})
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCreate(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleCreate}>Create</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

// ─── Actions component ──────────────────────────────────────────────────────

function DccActions({
  dcc, sensors, setDirty,
}: { dcc: DccDTO; sensors: SensorDccDTO[]; setDirty: (v: boolean) => void }) {
  const { xsrfToken, role } = useAuth();
  const [showEdit, setShowEdit] = useState(false);
  const [editForm, setEditForm] = useState<DccUpdateRequest>({
    name: dcc.name,
    sensorId: dcc.sensorId?.toString() || '',
    calibrationDate: dcc.calibrationDate
      ? new Date(dcc.calibrationDate).toISOString().split('T')[0]
      : dcc.createdAt
        ? new Date(dcc.createdAt).toISOString().split('T')[0]
        : '',
    expirationDate: dcc.expirationDate
      ? new Date(dcc.expirationDate).toISOString().split('T')[0]
      : '',
  });

  const handleEdit = async () => {
    try {
      await updateDcc(xsrfToken || '', dcc.id, {
        ...editForm,
        calibrationDate: editForm.calibrationDate
          ? new Date(editForm.calibrationDate).toISOString() : undefined,
        expirationDate: editForm.expirationDate
          ? new Date(editForm.expirationDate).toISOString() : undefined,
      });
      setShowEdit(false);
      setDirty(true);
    } catch (e) { console.error(e); alert('Update failed'); }
  };

  const handleValidate = async () => {
    try {
      await validateDcc(xsrfToken || '', dcc.id, 'PDF');
      setDirty(true);
      alert('Signed & validated!');
    } catch (e) { console.error(e); alert('Validation failed'); }
  };

  const handlePublish = async () => {
    if (!window.confirm('Make this DCC effective?')) return;
    try { await publishDcc(xsrfToken || '', dcc.id); setDirty(true); }
    catch (e) { console.error(e); alert('Publish failed'); }
  };

  const handleUnpublish = async () => {
    if (!window.confirm('Make this DCC ineffective?')) return;
    try { await unpublishDcc(xsrfToken || '', dcc.id); setDirty(true); }
    catch (e) { console.error(e); alert('Unpublish failed'); }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this DCC?')) return;
    try { await deleteDcc(xsrfToken || '', dcc.id); setDirty(true); }
    catch (e) { console.error(e); alert('Delete failed'); }
  };

  const handleDownload = async (type: 'PDF' | 'XML') => {
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

  const handleCalibrationResult = async () => {
    try {
      const blob = await downloadCalibrationResult(dcc.id);
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl; a.download = `calibration-result-dcc-${dcc.id}.pdf`;
      document.body.appendChild(a); a.click(); URL.revokeObjectURL(blobUrl); document.body.removeChild(a);
    } catch (e) { console.error(e); alert('Download calibration result failed'); }
  };

  const isEffectiveOrArchived = dcc.status === 'BLUE' || dcc.status === 'ARCHIVED';

  return (
    <div className="d-flex gap-1 flex-wrap justify-content-left">
      {/* Effective or Archived: only download buttons */}
      {isEffectiveOrArchived ? (
        <>
          <Button size="sm" variant="outline-danger" onClick={() => handleDownload('PDF')} disabled={!dcc.pdfValid}>
            <BsFiletypePdf className="me-1" />DCC PDF
          </Button>
          <Button size="sm" variant="outline-warning" onClick={() => handleDownload('XML')} disabled={!dcc.xmlValid}>
            <BsFiletypeXml className="me-1" />DCC XML
          </Button>
          {dcc.calibrationRequestId && (
            <Button size="sm" variant="outline-info" onClick={handleCalibrationResult}>
              <BsGraphUp className="me-1" />Calibration certificate
            </Button>
          )}
        </>
      ) : (
        <>
          {/* Admin actions for non-effective, non-archived DCCs */}
          
          <Button size="sm" variant="outline-danger" onClick={() => handleDownload('PDF')} disabled={!dcc.pdfValid}>
            <BsFiletypePdf className="me-1" />DCC PDF
          </Button>
          <Button size="sm" variant="outline-warning" onClick={() => handleDownload('XML')} disabled={!dcc.xmlValid}>
            <BsFiletypeXml className="me-1" />DCC XML
          </Button>
          {dcc.calibrationRequestId && (
            <Button size="sm" variant="outline-info" onClick={handleCalibrationResult}>
              <BsGraphUp className="me-1" />Calibration certificate
            </Button>
          )}
          {role === 'ADMIN' && (
            <Button size="sm" variant="outline-info" onClick={() => setShowEdit(true)}>
              <BsPencil className="me-1" />Edit
            </Button>
          )}
          {role === 'ADMIN' && (
            <Button
              size="sm" variant="outline-info"
              onClick={(e) =>
                window.open(`${GEMIMEG_URL}?dccId=${dcc.id}`, e.ctrlKey || e.metaKey ? '_blank' : '_self')
              }
            >
              <BsBoxArrowUpRight className="me-1" />GEMIMEG
            </Button>
          )}
          {role === 'ADMIN' && !dcc.pdfValid && !dcc.xmlValid && (
            <Button size="sm" variant="success" onClick={handleValidate}>
              <BsShieldCheck className="me-1" />Sign & Verify
            </Button>
          )}
          {role === 'ADMIN' && dcc.pdfValid && dcc.xmlValid && !dcc.publishedAt && (
            <Button size="sm" variant="success" onClick={handlePublish}>
              <BsCheckCircle className="me-1" />Make Effective
            </Button>
          )}
          {role === 'ADMIN' && dcc.publishedAt && (
            <Button size="sm" variant="warning" onClick={handleUnpublish}>Make Ineffective</Button>
          )}
          {role === 'ADMIN' && !dcc.publishedAt && (
            <Button size="sm" variant="danger" onClick={handleDelete}>Delete</Button>
          )}
        </>
      )}

      {/* Edit modal */}
      <Modal show={showEdit} onHide={() => setShowEdit(false)}>
        <Modal.Header closeButton><Modal.Title>Edit DCC Details</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control value={editForm.name || ''} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Author</Form.Label>
              <Form.Control value={dcc.createdByName || dcc.createdBy} readOnly disabled />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Sensor</Form.Label>
              <Form.Select
                value={editForm.sensorId || ''}
                onChange={(e) => setEditForm({ ...editForm, sensorId: e.target.value || undefined })}
              >
                <option value="">-- None (Template) --</option>
                {sensors.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.modelName} — CH {s.sensorIndex} | MU {s.muExtendedId} (ID: {s.id})
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Calibration Date</Form.Label>
              <Form.Control type="date" value={editForm.calibrationDate || ''} onChange={(e) => setEditForm({ ...editForm, calibrationDate: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Expiration Date</Form.Label>
              <Form.Control type="date" value={editForm.expirationDate || ''} onChange={(e) => setEditForm({ ...editForm, expirationDate: e.target.value })} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEdit(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleEdit}>Save</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default DccCertificates;
